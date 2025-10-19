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
    return fetchJSON('/api/admin/users');
  },
  async getClinics(): Promise<AdminClinic[]> {
    return fetchJSON('/api/admin/clinics');
  },
  async getRequests(): Promise<AdminRequest[]> {
    return fetchJSON('/api/admin/requests');
  },
  async getClinicApplications(): Promise<AdminClinicApplication[]> {
    return fetchJSON('/api/admin/clinic-applications');
  },
  async approveClinicApplication(id: string) {
    return fetchJSON(`/api/admin/clinic-applications/${id}/approve`, { method: 'POST' });
  },
  async rejectClinicApplication(id: string, reason?: string) {
    return fetchJSON(`/api/admin/clinic-applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};