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
  certificate_files?: any[] | null;
  certificate_urls?: string[] | null;
};

export type AdminStats = {
  totalUsers: number;
  activeClinics: number;
  pendingRequests: number;
  monthlyRevenue: number;
};

// const backendBase = import.meta.env.VITE_BACKEND_URL; // Backend deploy edildiğinde tekrar aktif edilecek
// const isOffline = import.meta.env.VITE_OFFLINE_MODE === 'true';
//
// async function getAccessToken() {
//   const { data } = await supabase.auth.getSession();
//   const session = data?.session ?? null;
//   const token = session?.access_token;
//   if (!token) {
//     throw new Error('Admin işlemleri için oturum bulunamadı');
//   }
//   return token;
// }

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
      const { data, error } = await supabase
        .from('clinic_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  async approveClinicApplication(id: string, approvedSpecialties?: string[]) {
    const { data: app, error: appErr } = await supabase
      .from('clinic_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (appErr || !app) {
      throw new Error(appErr?.message || 'Başvuru bulunamadı');
    }

    if (app.status === 'approved') {
      return { success: true, message: 'Başvuru zaten onaylanmış' };
    }

    if (!app.submitted_by) {
      throw new Error('Başvuruda submitted_by alanı eksik. Klinik hesabı oluşturulamamış olabilir.');
    }

    const authUserId = app.submitted_by as string;
    const applicationSpecialties = Array.isArray(app.specialties) ? app.specialties : [];
    const approved =
      Array.isArray(approvedSpecialties) && approvedSpecialties.length > 0
        ? approvedSpecialties
        : applicationSpecialties;

    const countries = Array.isArray(app.countries) ? app.countries : [];
    const citiesByCountry =
      app.cities_by_country && typeof app.cities_by_country === 'object'
        ? app.cities_by_country
        : {};

    let location = '';
    if (countries.length > 0) {
      const firstCountry = countries[0];
      const cities = (citiesByCountry as any)[firstCountry];
      if (Array.isArray(cities) && cities.length > 0) {
        location = `${firstCountry} / ${cities[0]}`;
      } else {
        location = firstCountry;
      }
    }

    const clinicInsert = {
      id: authUserId,
      name: app.clinic_name,
      email: app.email,
      phone: app.phone || '',
      website: app.website || '',
      location,
      description: app.description || '',
      status: 'active',
      rating: 0,
      reviews: 0,
      specialties: approved,
      countries,
      cities_by_country: citiesByCountry,
    };

    const { error: clinicErr } = await supabase.from('clinics').upsert(clinicInsert).select('*');

    if (clinicErr) {
      throw new Error(clinicErr.message);
    }

    const { error: updErr } = await supabase
      .from('clinic_applications')
      .update({ status: 'approved' })
      .eq('id', id);

    if (updErr) {
      throw new Error(updErr.message);
    }

    try {
      await supabase
        .from('users')
        .update({ role: 'clinic', is_verified: true })
        .eq('id', authUserId);
    } catch (e) {
      console.warn('Users role update warning:', e);
    }

    return { success: true };
  },
  async resendInviteLink(id: string) {
    const { data: app, error: appErr } = await supabase
      .from('clinic_applications')
      .select('email, status')
      .eq('id', id)
      .single();

    if (appErr || !app) {
      throw new Error('Başvuru bulunamadı');
    }

    if (app.status !== 'approved') {
      throw new Error('Önce başvuruyu onaylamalısınız');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(app.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'Şifre sıfırlama linki gönderildi' };
  },
  async rejectClinicApplication(id: string, reason?: string) {
    const { data, error } = await supabase
      .from('clinic_applications')
      .update({ status: 'rejected', description: reason || null })
      .eq('id', id)
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, application: Array.isArray(data) ? data[0] : data };
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
