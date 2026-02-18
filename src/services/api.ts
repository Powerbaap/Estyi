import { supabase } from '../lib/supabaseClient';
import { uploadClinicCertificates } from './storage';

const offline = import.meta.env.VITE_OFFLINE_MODE === 'true';

// Kullanıcı servisleri
export const userService = {
  // Kullanıcı profil bilgilerini getir
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcı profilini güncelle
  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return data;
  }
};

// Randevu servisleri
export const appointmentService = {
  // Kullanıcının randevularını getir
  getUserAppointments: async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .in('user_id', [userId, 'DEV_USER'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Randevu iptal et
  cancelAppointment: async (appointmentId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select('*');
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }
};

// Klinik servisleri
export const clinicService = {
  // Klinik profil bilgilerini getir
  getClinicProfile: async (clinicId: string) => {
    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', clinicId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Klinik profilini güncelle
  updateClinicProfile: async (clinicId: string, updates: any) => {
    const { data, error } = await supabase
      .from('clinics')
      .update(updates)
      .eq('id', clinicId);
    
    if (error) throw error;
    return data;
  },
  
  // Tüm klinikleri getir
  getAllClinics: async () => {
    const { data, error } = await supabase
      .from('clinics')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};

// Klinik başvuru servisleri
export const clinicApplicationService = {
  // Başvuru oluştur (sertifikalar olmadan)
  createApplication: async (payload: {
    clinic_name: string;
    countries?: string[];
    cities_by_country?: Record<string, string[]>;
    specialties?: string[];
    website?: string;
    phone?: string;
    email: string;
    password?: string;
    description?: string;
    certificate_files?: {
      path: string;
      bucket: string;
      mime: string;
      size: number;
      url?: string;
    }[];
    submitted_by?: string | null;
  }) => {
    if (!payload.password) {
      throw new Error('Klinik başvurusu için şifre gereklidir.');
    }
    if (offline) {
      const fakeId = 'DEV_APP_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      return {
        id: fakeId,
        clinic_name: payload.clinic_name,
        email: payload.email,
        phone: payload.phone || '',
        website: payload.website || '',
        country: Array.isArray(payload.countries) && payload.countries.length > 0 ? payload.countries[0] : null,
        countries: payload.countries || [],
        cities_by_country: payload.cities_by_country || {},
        specialties: payload.specialties || [],
        description: payload.description || '',
        certificate_files: Array.isArray(payload.certificate_files) ? payload.certificate_files : [],
        status: 'pending',
        submitted_by: null
      };
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          role: 'clinic',
          name: payload.clinic_name
        }
      }
    });

    if (authError) {
      const msg = (authError.message || '').toLowerCase();
      if (msg.includes('already') && (msg.includes('registered') || msg.includes('exists'))) {
        throw new Error('Bu e-posta ile zaten bir hesap var. Giriş yapın veya Şifremi Unuttum kullanın.');
      }
      throw new Error(authError.message);
    }

    const authUserId = authData?.user?.id;
    if (!authUserId) {
      throw new Error('Kullanıcı oluşturulamadı.');
    }

    await supabase.auth.signOut();

    try {
      await supabase.from('users').upsert(
        {
          id: authUserId,
          email: payload.email,
          name: payload.clinic_name,
          role: 'clinic',
          is_verified: false
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      console.warn('Users profil upsert uyarı:', e);
    }

    const countries = Array.isArray(payload.countries) ? payload.countries : [];
    const insertPayload = {
      clinic_name: payload.clinic_name,
      email: payload.email,
      phone: payload.phone || null,
      website: payload.website || null,
      country: countries[0] || null,
      countries,
      cities_by_country:
        payload.cities_by_country && typeof payload.cities_by_country === 'object'
          ? payload.cities_by_country
          : {},
      specialties: Array.isArray(payload.specialties) ? payload.specialties : [],
      description: payload.description || null,
      certificate_files: Array.isArray(payload.certificate_files) ? payload.certificate_files : [],
      status: 'pending',
      submitted_by: authUserId
    };

    const { data, error } = await supabase.from('clinic_applications').insert(insertPayload).select('*');

    if (error) {
      console.error('Clinic application insert error:', error);
      throw new Error(error.message);
    }

    return Array.isArray(data) ? data[0] : data;
  },

  // Sertifikaları yükle ve başvuruya ekle
  attachCertificates: async (applicationId: string, files: File[]) => {
    let uid: string | undefined = undefined;
    try {
      const { data } = await supabase.auth.getSession();
      uid = data?.session?.user?.id;
    } catch { /* ignore */ }
    const filesPayload = await uploadClinicCertificates(applicationId, files, uid);
    const { data, error } = await supabase
      .from('clinic_applications')
      .update({ certificate_files: filesPayload })
      .eq('id', applicationId)
      .select('*');
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  },

  // Başvuruları getir (admin)
  getApplications: async () => {
    const { data, error } = await supabase
      .from('clinic_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Başvuruyu onayla: clinics tablosuna ekle ve status=approved yap
  approveApplication: async (application: any) => {
    // 1) clinics tablosuna ekle
    const countries = Array.isArray(application.countries) ? application.countries : [];
    const citiesByCountry = application.cities_by_country && typeof application.cities_by_country === 'object'
      ? application.cities_by_country
      : {};
    const firstCountry = countries[0];
    const firstCity = firstCountry && Array.isArray(citiesByCountry[firstCountry])
      ? citiesByCountry[firstCountry][0]
      : undefined;
    const location = firstCountry ? (firstCity ? `${firstCountry}/${firstCity}` : firstCountry) : '';
    const clinicInsert = {
      name: application.clinic_name,
      email: application.email,
      phone: application.phone || '',
      website: application.website || '',
      location,
      status: 'active',
      rating: 0,
      reviews: 0,
      specialties: application.specialties || [],
      countries,
      cities_by_country: citiesByCountry
    };
    const { data: clinicRow, error: clinicErr } = await supabase
      .from('clinics')
      .insert(clinicInsert)
      .select('*');
    if (clinicErr) throw clinicErr;
    const createdClinic = Array.isArray(clinicRow) ? clinicRow[0] : clinicRow;

    // 2) Başvuruyu güncelle
    const { error: appErr } = await supabase
      .from('clinic_applications')
      .update({ status: 'approved' })
      .eq('id', application.id);
    if (appErr) throw appErr;

    return createdClinic;
  },

  // Başvuruyu reddet
  rejectApplication: async (applicationId: string, reason?: string) => {
    const { data, error } = await supabase
      .from('clinic_applications')
      .update({ status: 'rejected', description: reason || null })
      .eq('id', applicationId)
      .select('*');
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  }
};

// Talep servisleri
export const requestService = {
  // Kullanıcının taleplerini getir
  getUserRequests: async (userId: string) => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  // Klinik için tüm talepleri getir
  getClinicRequests: async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  },
  
  // Yeni talep oluştur
  createRequest: async (requestData: any) => {
    const sessionsRaw =
      typeof requestData.sessions === 'number'
        ? String(requestData.sessions)
        : requestData.sessions;

    const sessionsValue =
      typeof requestData.sessions === 'number'
        ? requestData.sessions
        : sessionsRaw && !Number.isNaN(Number(sessionsRaw))
        ? Number(sessionsRaw)
        : null;

    const payload = {
      procedure_name:
        requestData.procedure_name ||
        requestData.procedure ||
        requestData.procedureName ||
        '',
      procedure_category: requestData.procedure_category ?? null,
      region: requestData.region ?? null,
      sessions: sessionsValue,
      selected_countries: Array.isArray(requestData.selected_countries)
        ? requestData.selected_countries
        : Array.isArray(requestData.countries)
        ? requestData.countries
        : [],
      cities_by_country:
        requestData.cities_by_country ||
        requestData.citiesByCountry ||
        {},
      gender: requestData.gender ?? null,
      notes: requestData.notes ?? requestData.description ?? null,
    };

    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession();
    const session = (sessionData as any)?.session;

    if (!session?.user?.id) {
      console.log('[REQUEST_SERVICE] missing session for createRequest', {
        sessionError,
        session,
      });
      throw new Error('Kullanıcı oturumu bulunamadı.');
    }

    const requestInsert = {
      user_id: session.user.id,
      procedure_name: payload.procedure_name,
      procedure_category: payload.procedure_category,
      region: payload.region,
      sessions: payload.sessions,
      selected_countries: payload.selected_countries,
      cities_by_country: payload.cities_by_country,
      gender: payload.gender,
      notes: payload.notes,
      status: 'active',
    };

    const {
      data,
      error,
    } = await supabase
      .from('requests')
      .insert(requestInsert as any)
      .select('*')
      .single();

    if (error) {
      console.log('[REQUEST_SERVICE] error', {
        name: error?.name,
        message: error?.message,
        status: (error as any)?.code,
        details: (error as any)?.details,
      });
      throw error;
    }

    return data;
  }
};

// Teklif servisleri
export const offerService = {
  // Bir talep için teklif oluştur
  createOffer: async (offerData: any) => {
    const { data, error } = await supabase
      .from('offers')
      .insert(offerData);
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcının aldığı teklifleri getir
  getUserOffers: async (userId: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select('*, requests(*)')
      .eq('requests.user_id', userId);
    
    if (error) throw error;
    return data;
  },
  
  // Kliniğin gönderdiği teklifleri getir
  getClinicOffers: async (clinicId: string) => {
    const { data, error } = await supabase
      .from('offers')
      .select('*, requests(*)')
      .eq('clinic_id', clinicId);
    
    if (error) throw error;
    return data;
  }
};

// Mesajlaşma servisleri
export const messageService = {
  // Konuşma oluştur
  createConversation: async (conversationData: any) => {
    const { data, error } = await supabase
      .from('conversations')
      .insert(conversationData);
    
    if (error) throw error;
    return data;
  },
  
  // Kullanıcının konuşmalarını getir
  getUserConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user_id.eq.${userId},clinic_id.eq.${userId}`);
    
    if (error) throw error;
    return data;
  },
  
  // Mesaj gönder
  sendMessage: async (messageData: any) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData);
    
    if (error) throw error;
    return data;
  },
  
  // Konuşmanın mesajlarını getir
  getConversationMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};
