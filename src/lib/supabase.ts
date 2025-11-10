import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const offlineMode = import.meta.env.VITE_OFFLINE_MODE === 'true';

// Dev fallback: if Supabase envs are missing, provide a minimal mock
const useDevFallback = offlineMode || !supabaseUrl || !supabaseAnonKey;

function createDevSupabaseMock() {
  const devAuth = {
    async getSession() {
      return { data: { session: null }, error: null } as any;
    },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe() {} } } } as any;
    },
    async signInWithPassword(_: any) {
      return { data: null, error: { message: 'Supabase dev mock: signIn unavailable' } } as any;
    },
    async signUp(_: any) {
      return { data: null, error: { message: 'Supabase dev mock: signUp unavailable' } } as any;
    }
  };

  const devStorage = {
    from(_bucket: string) {
      return {
        async upload(_path: string, _file: File, _opts?: any) {
          return { data: null, error: null } as any;
        },
        getPublicUrl(path: string) {
          return { data: { publicUrl: `http://localhost:5175/${path}` }, error: null } as any;
        },
        async createSignedUrl(path: string, expiresInSeconds: number) {
          const exp = Date.now() + (expiresInSeconds || 3600) * 1000;
          const signed = `http://localhost:5175/${path}?token=dev&exp=${exp}`;
          return { data: { signedUrl: signed }, error: null } as any;
        }
      };
    }
  };

  // In-memory store for simple dev operations
  const devStore: Record<string, any[]> = {
    requests: [],
    offers: [],
    users: [],
    messages: [],
    clinics: [],
    conversations: [],
    clinic_applications: [],
    verification_codes: [],
    // Yeni sabit fiyat modeli tabloları
    doctors: [],
    procedures: [],
    clinic_procedure_prices: [],
    appointments: [],
    ratings: []
  };

  function withDefaults(table: string, values: any) {
    const now = new Date().toISOString();
    const id = values.id || Math.random().toString(36).substring(2, 10);
    const base = { id, created_at: now, updated_at: now };
    if (table === 'requests') {
      return {
        ...base,
        user_id: values.user_id,
        procedure: values.procedure || 'Unknown',
        description: values.description || '',
        photos: Array.isArray(values.photos) ? values.photos : [],
        status: values.status || 'active'
      };
    }
    if (table === 'clinic_applications') {
      return {
        ...base,
        clinic_name: values.clinic_name,
        country: values.country || '',
        specialties: Array.isArray(values.specialties) ? values.specialties : [],
        website: values.website || '',
        phone: values.phone || '',
        email: values.email,
        password: values.password || '',
        description: values.description || '',
        certificate_urls: Array.isArray(values.certificate_urls) ? values.certificate_urls : [],
        status: values.status || 'pending',
        submitted_by: values.submitted_by || null
      };
    }
    if (table === 'verification_codes') {
      return {
        ...base,
        user_id: values.user_id || values.email || 'DEV_USER',
        email: values.email || undefined,
        code: values.code,
        expires_at: values.expires_at || new Date(Date.now() + 15 * 60 * 1000).toISOString()
      };
    }
    // Yeni tablolar için varsayılanlar
    if (table === 'doctors') {
      return {
        ...base,
        clinic_id: values.clinic_id,
        full_name: values.full_name || 'Unknown Doctor',
        instagram_url: values.instagram_url || '',
        website: values.website || '',
        bio: values.bio || '',
        photo_url: values.photo_url || ''
      };
    }
    if (table === 'procedures') {
      return {
        ...base,
        slug: values.slug || 'procedure',
        name: values.name || 'Procedure'
      };
    }
    if (table === 'clinic_procedure_prices') {
      return {
        ...base,
        clinic_id: values.clinic_id,
        procedure_id: values.procedure_id,
        price_currency: values.price_currency || 'USD',
        price_amount: values.price_amount || 0
      };
    }
    if (table === 'appointments') {
      return {
        ...base,
        user_id: values.user_id,
        clinic_id: values.clinic_id,
        procedure_id: values.procedure_id,
        status: values.status || 'pending',
        deposit_amount: values.deposit_amount || 0,
        appointment_date: values.appointment_date || null
      };
    }
    if (table === 'ratings') {
      return {
        ...base,
        clinic_id: values.clinic_id,
        score: values.score || 0,
        review_count: values.review_count || 0
      };
    }
    return { ...values, ...base };
  }

  const devFrom = (table: string) => {
    return {
      // select chain (minimal support used in app)
      select(_cols?: string) {
        // v_market_cards sanal görünümü
        if (table === 'v_market_cards') {
          const rows = (devStore.clinic_procedure_prices || []).map((cpp: any) => {
            const clinic = (devStore.clinics || []).find((c: any) => c.id === cpp.clinic_id) || {};
            const doctor = (devStore.doctors || []).find((d: any) => d.clinic_id === cpp.clinic_id) || {};
            const procedure = (devStore.procedures || []).find((p: any) => p.id === cpp.procedure_id) || {};
            const rating = (devStore.ratings || []).find((r: any) => r.clinic_id === cpp.clinic_id) || { score: 0, review_count: 0 };
            const [country, city] = (clinic.location || '').split('/')
              .map((s: string) => s.trim());
            return {
              id: `vmc_${cpp.id}`,
              clinic_id: cpp.clinic_id,
              clinic_name: clinic.name,
              doctor_name: doctor.full_name || '',
              procedure_id: cpp.procedure_id,
              procedure_name: procedure.name || '',
              price_amount: cpp.price_amount,
              price_currency: cpp.price_currency,
              clinic_rating: rating.score || clinic.rating || 0,
              reviews_count: rating.review_count || clinic.reviews || 0,
              instagram_url: doctor.instagram_url || '',
              website: clinic.website || doctor.website || '',
              country: country || '',
              city: city || ''
            };
          });
          return {
            order(_col: string, _opts: any) {
              return Promise.resolve({ data: rows, error: null });
            },
            async single() {
              return { data: rows[0] || null, error: rows[0] ? null : { message: 'Not found' } } as any;
            }
          } as any;
        }
        const rows = devStore[table] || [];
        return {
          eq(column: string, value: any) {
            const filtered = rows.filter((r: any) => r[column] === value);
            return {
              order(_col: string, _opts: any) {
                return Promise.resolve({ data: filtered, error: null });
              },
              async single() {
                return { data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } } as any;
              },
              gt(column2: string, compareVal: any) {
                const nowIso = typeof compareVal === 'string' ? compareVal : new Date().toISOString();
                const filtered2 = filtered.filter((r: any) => (r[column2] || '') > nowIso);
                return {
                  async single() {
                    return { data: filtered2[0] || null, error: filtered2[0] ? null : { message: 'Not found' } } as any;
                  }
                } as any;
              }
            };
          }
        };
      },
      // insert followed by optional select('*')
      insert(values: any) {
        const toInsert = Array.isArray(values) ? values : [values];
        const inserted = toInsert.map(v => withDefaults(table, v));
        devStore[table] = [...(devStore[table] || []), ...inserted];
        return {
          async select(_cols?: string) {
            return { data: inserted, error: null } as any;
          }
        } as any;
      },
      // update chain ending in eq(...)
      update(updates: any) {
        return {
          async eq(column: string, value: any) {
            const rows = devStore[table] || [];
            devStore[table] = rows.map(r => (r[column] === value ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
            return { data: { updated: true }, error: null } as any;
          }
        };
      },
      // delete chain (used rarely)
      delete() {
        return {
          async eq(column: string, value: any) {
            const rows = devStore[table] || [];
            devStore[table] = rows.filter(r => r[column] !== value);
            return { data: { deleted: true }, error: null } as any;
          }
        };
      }
    } as any;
  };

  const mock = {
    auth: devAuth,
    storage: devStorage,
    from: devFrom
  } as any;

  // Seed data for offline development (only once)
  if ((devStore.procedures || []).length === 0) {
    devStore.procedures = [
      { id: 'proc_rhinoplasty', slug: 'rhinoplasty', name: 'Burun Estetiği', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'proc_hair', slug: 'hair-transplant', name: 'Saç Ekimi', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    devStore.clinics = [
      { id: 'clinic_ist', name: 'Istanbul Aesthetic Clinic', email: 'contact@iac.example', phone: '+90 212 000 00 00', website: 'https://iac.example', location: 'Turkey/Istanbul', status: 'active', rating: 4.7, reviews: 124, specialties: ['rhinoplasty','hair'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'clinic_ber', name: 'Berlin Beauty Clinic', email: 'hello@bbc.example', phone: '+49 30 000 000', website: 'https://bbc.example', location: 'Germany/Berlin', status: 'active', rating: 4.5, reviews: 87, specialties: ['rhinoplasty'], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    devStore.doctors = [
      { id: 'doc_ist_1', clinic_id: 'clinic_ist', full_name: 'Dr. Ayşe Demir', instagram_url: 'https://instagram.com/dr.ayse', website: 'https://iac.example/ayse', bio: 'Burun estetiği uzmanı', photo_url: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'doc_ber_1', clinic_id: 'clinic_ber', full_name: 'Dr. Hans Müller', instagram_url: 'https://instagram.com/dr.hans', website: 'https://bbc.example/hans', bio: 'Plastik cerrah', photo_url: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    devStore.ratings = [
      { id: 'rat_ist', clinic_id: 'clinic_ist', score: 4.7, review_count: 124, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'rat_ber', clinic_id: 'clinic_ber', score: 4.5, review_count: 87, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
    devStore.clinic_procedure_prices = [
      { id: 'cpp_ist_rh', clinic_id: 'clinic_ist', procedure_id: 'proc_rhinoplasty', price_currency: 'USD', price_amount: 2800, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'cpp_ist_hair', clinic_id: 'clinic_ist', procedure_id: 'proc_hair', price_currency: 'USD', price_amount: 1500, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 'cpp_ber_rh', clinic_id: 'clinic_ber', procedure_id: 'proc_rhinoplasty', price_currency: 'EUR', price_amount: 3500, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ];
  }

  console.warn('⚠️ Using dev Supabase mock (offline mode or missing env).');
  return mock;
}

export const supabase = useDevFallback
  ? createDevSupabaseMock()
  : createClient(supabaseUrl!, supabaseAnonKey!);


// Database tabloları için type'lar
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'user' | 'clinic' | 'admin';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'user' | 'clinic' | 'admin';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'user' | 'clinic' | 'admin';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clinic_applications: {
        Row: {
          id: string;
          clinic_name: string;
          country: string | null;
          specialties: string[];
          website: string | null;
          phone: string | null;
          email: string;
          password: string | null;
          description: string | null;
          certificate_urls: string[];
          status: 'pending' | 'approved' | 'rejected';
          submitted_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_name: string;
          country?: string;
          specialties?: string[];
          website?: string;
          phone?: string;
          email: string;
          password?: string;
          description?: string;
          certificate_urls?: string[];
          status?: 'pending' | 'approved' | 'rejected';
          submitted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_name?: string;
          country?: string;
          specialties?: string[];
          website?: string;
          phone?: string;
          email?: string;
          password?: string;
          description?: string;
          certificate_urls?: string[];
          status?: 'pending' | 'approved' | 'rejected';
          submitted_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clinics: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          website: string;
          location: string;
          status: 'active' | 'pending' | 'rejected';
          rating: number;
          reviews: number;
          specialties: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          website: string;
          location: string;
          status?: 'active' | 'pending' | 'rejected';
          rating?: number;
          reviews?: number;
          specialties: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          website?: string;
          location?: string;
          status?: 'active' | 'pending' | 'rejected';
          rating?: number;
          reviews?: number;
          specialties?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          user_id: string;
          procedure: string;
          description: string;
          photos: string[];
          status: 'active' | 'closed' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          procedure: string;
          description: string;
          photos: string[];
          status?: 'active' | 'closed' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          procedure?: string;
          description?: string;
          photos?: string[];
          status?: 'active' | 'closed' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          request_id: string;
          clinic_id: string;
          min_price: number;
          max_price: number;
          description: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          clinic_id: string;
          min_price: number;
          max_price: number;
          description: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          clinic_id?: string;
          min_price?: number;
          max_price?: number;
          description?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          sender_type: 'user' | 'clinic';
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          sender_type: 'user' | 'clinic';
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          sender_type?: 'user' | 'clinic';
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}