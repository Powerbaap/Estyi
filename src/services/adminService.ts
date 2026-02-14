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
  status?: string | null;
  created_at?: string | null;
  specialties?: string[] | null;
};

export type AdminStats = {
  totalUsers: number;
  activeClinics: number;
  pendingRequests: number;
  monthlyRevenue: number;
};

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
      const supaData = await clinicApplicationService.getApplications();
      return Array.isArray(supaData) ? supaData : [];
    } catch {
      return [];
    }
  },
  async approveClinicApplication(id: string) {
    throw new Error('Klinik onayı için sunucu tarafı yetki gerekir (service key).');
  },
  async resendInviteLink(id: string) {
    throw new Error('Davet linki gönderimi için sunucu tarafı yetki gerekir (service key).');
  },
  async rejectClinicApplication(id: string, reason?: string) {
    const updated = await clinicApplicationService.rejectApplication(id, reason);
    return { success: true, application: updated } as const;
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
