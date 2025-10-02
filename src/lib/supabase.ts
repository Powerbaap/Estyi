import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test bağlantısı
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully!');
  }
});

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