import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Dev fallback: if Supabase envs are missing, provide a minimal mock
const useDevFallback = !supabaseUrl || !supabaseAnonKey;

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
    },
    async signOut() {
      // Dev mock: hiçbir gerçek oturum yok, sadece başarı döndür
      return { error: null } as any;
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
    conversations: []
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
    return { ...values, ...base };
  }

  const devFrom = (table: string) => {
    return {
      // select chain (minimal support used in app)
      select(_cols?: string) {
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

  console.warn('⚠️ Supabase env missing. Using dev mock for local UI testing.');
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