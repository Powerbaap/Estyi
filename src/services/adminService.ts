import { clinicApplicationService } from './api';
import { supabase } from '../lib/supabaseClient';

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
  countries?: string[] | null;
  cities_by_country?: Record<string, string[]> | null;
  status?: string | null;
  created_at?: string | null;
  specialties?: string[] | null;
  description?: string | null;
  certificate_files?: string[] | null;
  certificate_urls?: string[] | null;
};

export type AdminStats = {
  totalUsers: number;
  activeClinics: number;
  pendingRequests: number;
  monthlyRevenue: number;
};

const backendBase = import.meta.env.VITE_BACKEND_URL;
const isOffline = import.meta.env.VITE_OFFLINE_MODE === 'true';

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  const session = data?.session ?? null;
  const token = session?.access_token;
  if (!token) {
    throw new Error('Admin işlemleri için oturum bulunamadı');
  }
  return token;
}

export const adminService = {
  async getUsers(): Promise<AdminUser[]> {
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
      if (!backendBase || isOffline) {
        const supaData = await clinicApplicationService.getApplications();
        return Array.isArray(supaData) ? supaData : [];
      }

      const token = await getAccessToken();
      const url = `${backendBase.replace(/\/$/, '')}/api/admin/clinic-applications`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Klinik başvuruları getirilemedi');
      }

      const json = await res.json();
      return Array.isArray(json) ? json : [];
    } catch {
      return [];
    }
  },
  async approveClinicApplication(id: string, approvedSpecialties?: string[]) {
    if (!backendBase || isOffline) {
      throw new Error('Klinik onayı sadece backend API üzerinden yapılabilir.');
    }

    const token = await getAccessToken();
    const url = `${backendBase.replace(/\/$/, '')}/api/admin/clinic-applications/${id}/approve`;

    const body: any = {};
    if (Array.isArray(approvedSpecialties) && approvedSpecialties.length > 0) {
      body.approved_specialties = approvedSpecialties;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'Klinik başvurusu onaylanamadı');
    }

    return json;
  },
  async resendInviteLink(id: string) {
    if (!backendBase || isOffline) {
      throw new Error('Davet linki gönderimi sadece backend API üzerinden yapılabilir.');
    }

    const token = await getAccessToken();
    const url = `${backendBase.replace(/\/$/, '')}/api/admin/clinic-applications/${id}/resend-invite`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'Davet linki gönderilemedi');
    }

    return json;
  },
  async rejectClinicApplication(id: string, reason?: string) {
    if (!backendBase || isOffline) {
      const updated = await clinicApplicationService.rejectApplication(id, reason);
      return { success: true, application: updated } as const;
    }

    const token = await getAccessToken();
    const url = `${backendBase.replace(/\/$/, '')}/api/admin/clinic-applications/${id}/reject`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || 'Klinik başvurusu reddedilemedi');
    }

    return json;
  },
  async getAdminStats(): Promise<AdminStats> {
    const [users, clinics, requests] = await Promise.all([
      this.getUsers(),
      this.getClinics(),
      this.getRequests(),
    ]);

    const activeClinics = clinics.filter(
      (c) => (c.status ?? 'active').toLowerCase() === 'active'
    ).length;

    const pendingStatuses = new Set(['pending', 'awaiting', 'open', 'active']);
    const pendingRequests = requests.filter((r) =>
      pendingStatuses.has((r.status ?? '').toLowerCase())
    ).length;

    let monthlyRevenue = 0;
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('offers')
        .select('min_price, max_price, status, created_at')
        .eq('status', 'accepted')
        .gte('created_at', startOfMonth.toISOString());

      if (!error && Array.isArray(data)) {
        monthlyRevenue = data.reduce((sum, o: any) => {
          const min = Number(o?.min_price ?? 0);
          const max = Number(o?.max_price ?? 0);
          const avg = (min + max) / 2;
          return sum + (isFinite(avg) ? avg : 0);
        }, 0);
      }
    } catch {
      // gelir hesaplanamadıysa 0 döner
    }

    return {
      totalUsers: users.length,
      activeClinics,
      pendingRequests,
      monthlyRevenue,
    };
  },
};
