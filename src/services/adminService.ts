import { clinicApplicationService } from './api';
import { supabase } from '../lib/supabase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function fetchJSON(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export type AdminUser = {
  id: string;
  email: string | null;
  name?: string | null;
  role?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type AdminClinic = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  location?: string | null;
  status?: string | null;
  rating?: number | null;
  reviews?: number | null;
  created_at?: string | null;
};

export type AdminRequest = {
  id: string;
  user_id?: string | null;
  status?: string | null;
  created_at?: string | null;
  title?: string | null;
  description?: string | null;
};

export type AdminClinicApplication = {
  id: string;
  email?: string | null;
  clinic_name?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  status?: string | null;
  created_at?: string | null;
  specialties?: string[] | null;
};

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
    try {
      const data = await fetchJSON('/api/admin/users');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      // backend erişilemezse supabase fallback dene
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  async getClinics(): Promise<AdminClinic[]> {
    try {
      const data = await fetchJSON('/api/admin/clinics');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      // backend erişilemezse supabase fallback dene
    }
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  async getRequests(): Promise<AdminRequest[]> {
    try {
      const data = await fetchJSON('/api/admin/requests');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      // backend erişilemezse supabase fallback dene
    }
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  async getClinicApplications(): Promise<AdminClinicApplication[]> {
    try {
      const data = await fetchJSON('/api/admin/clinic-applications');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      // Backend erişilemezse supabase fallback dene
    }
    try {
      const supaData = await clinicApplicationService.getApplications();
      return Array.isArray(supaData) ? supaData : [];
    } catch {
      return [];
    }
  },
  async approveClinicApplication(id: string) {
    try {
      return await fetchJSON(`/api/admin/clinic-applications/${id}/approve`, { method: 'POST' });
    } catch (err) {
      // Backend başarısızsa Supabase üzerinden onaylama fallback
      const { data: app, error } = await supabase
        .from('clinic_applications')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      const createdClinic = await clinicApplicationService.approveApplication(app);
      return { success: true, clinic: createdClinic } as const;
    }
  },
  async rejectClinicApplication(id: string, reason?: string) {
    try {
      return await fetchJSON(`/api/admin/clinic-applications/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch (err) {
      // Backend başarısızsa Supabase üzerinden reddetme fallback
      const updated = await clinicApplicationService.rejectApplication(id, reason);
      return { success: true, application: updated } as const;
    }
  },
};