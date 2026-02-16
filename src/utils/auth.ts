import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'user' | 'clinic' | 'admin';

export function getUserRole(user: User | null | undefined): UserRole {
  if (!user) return 'user';
  const fallbackAdminIds = (import.meta.env.VITE_ADMIN_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  const fallbackAdminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((em) => em.trim().toLowerCase())
    .filter(Boolean);
  if (fallbackAdminIds.includes(user.id)) return 'admin';
  if (user.email && fallbackAdminEmails.includes(user.email.toLowerCase())) return 'admin';
  const meta = (user as any).user_metadata || {};
  const appMeta = (user as any).app_metadata || {};
  const role = meta.role || appMeta.role || meta.roleType || appMeta.roleType;
  if (role === 'admin' || role === 'clinic' || role === 'user') {
    return role;
  }
  return 'user';
}

export async function getCurrentUserRole(user?: User | null): Promise<UserRole> {
  try {
    let currentUser = user ?? null;
    if (!currentUser) {
      const { data } = await supabase.auth.getUser();
      currentUser = data?.user ?? null;
    }
    if (!currentUser) return 'user';

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (!error && data?.role && (data.role === 'admin' || data.role === 'clinic' || data.role === 'user')) {
      return data.role;
    }

    const email = (currentUser.email || '').toLowerCase();
    if (email === 'admin@estyi.com') {
      try {
        await supabase.from('users').upsert(
          { id: currentUser.id, email: currentUser.email, role: 'admin', is_verified: true },
          { onConflict: 'id' }
        );
      } catch {}
      return 'admin';
    }

    return getUserRole(currentUser);
  } catch {
    if (user?.email?.toLowerCase() === 'admin@estyi.com') {
      return 'admin';
    }
    return 'user';
  }
}

export interface UserAccess {
  role: UserRole;
  isAdmin: boolean;
  isClinicApproved: boolean;
}

export async function getCurrentUserAccess(user?: User | null): Promise<UserAccess> {
  const role = await getCurrentUserRole(user);
  let isAdmin = role === 'admin';
  let isClinicApproved = true;

  let currentUser = user ?? null;
  if (!currentUser) {
    const { data } = await supabase.auth.getUser();
    currentUser = data?.user ?? null;
  }

  if (role === 'clinic') {
    isClinicApproved = false;
    if (currentUser?.id) {
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('status')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (!error && data?.status) {
          isClinicApproved = data.status === 'active';
        }
      } catch {
        isClinicApproved = false;
      }
    }
  }

  if (!isAdmin && currentUser) {
    const meta = (currentUser as any).user_metadata || {};
    const appMeta = (currentUser as any).app_metadata || {};
    const explicitRole = meta.role || appMeta.role || meta.roleType || appMeta.roleType;
    if (explicitRole === 'admin') {
      isAdmin = true;
    }
  }

  return { role, isAdmin, isClinicApproved };
}
