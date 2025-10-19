import { supabase } from '../lib/supabase';
import { uploadClinicCertificates } from './storage';

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
    country?: string;
    specialties?: string[];
    website?: string;
    phone?: string;
    email: string;
    password?: string;
    description?: string;
    certificate_urls?: string[];
    submitted_by?: string | null;
  }) => {
    // Anonim başvurular için RLS SELECT engeline takılmamak adına
    // sadece INSERT yap ve temsil isteme; oturum açıkken temsil döndür.
    try {
      const insertQuery = supabase
        .from('clinic_applications')
        .insert(payload);

      if (payload.submitted_by) {
        const { data, error } = await insertQuery.select('*');
        if (error) throw error;
        return Array.isArray(data) ? data[0] : data;
      } else {
        const { error } = await insertQuery; // return=minimal
        if (error) throw error;
        return { ok: true } as const;
      }
    } catch (e: any) {
      const msg = (e?.message || '').toLowerCase();
      const looksLikePasswordColumnMissing =
        msg.includes("password") && (msg.includes("schema cache") || msg.includes("column"));

      // Üretimde şema henüz güncellenmediyse, şifre alanını çıkarıp tekrar dene
      if (looksLikePasswordColumnMissing) {
        const safePayload = { ...payload } as any;
        delete safePayload.password;
        const retryInsert = supabase
          .from('clinic_applications')
          .insert(safePayload);
        if (payload.submitted_by) {
          const { data, error } = await retryInsert.select('*');
          if (error) throw error;
          return Array.isArray(data) ? data[0] : data;
        } else {
          const { error } = await retryInsert;
          if (error) throw error;
          return { ok: true, passwordStored: false } as const;
        }
      }
      throw e;
    }
  },

  // Sertifikaları yükle ve başvuruya ekle
  attachCertificates: async (applicationId: string, files: File[]) => {
    const urls = await uploadClinicCertificates(applicationId, files);
    const { data, error } = await supabase
      .from('clinic_applications')
      .update({ certificate_urls: urls })
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
    const clinicInsert = {
      name: application.clinic_name,
      email: application.email,
      phone: application.phone || '',
      website: application.website || '',
      location: application.country || '',
      status: 'active',
      rating: 0,
      reviews: 0,
      specialties: application.specialties || []
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
    const { data, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select('*');
    
    if (error) throw error;
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