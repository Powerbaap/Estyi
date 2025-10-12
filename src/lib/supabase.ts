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

  const devFrom = (_table: string) => {
    return {
      // select chain
      select(_cols?: string) {
        return {
          eq(_column: string, _value: any) {
            return {
              async single() {
                return { data: null, error: { message: 'Supabase dev mock: select unavailable' } } as any;
              }
            };
          }
        };
      },
      // insert direct
      async insert(_values: any) {
        return { data: null, error: null } as any;
      },
      // update chain ending in eq(...)
      update(_values: any) {
        return {
          async eq(_column: string, _value: any) {
            return { data: { updated: true }, error: null } as any;
          }
        };
      },
      // delete chain (used rarely)
      delete() {
        return {
          async eq(_column: string, _value: any) {
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