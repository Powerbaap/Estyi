import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'user' | 'clinic' | 'admin';

const roleCache = new Map<string, { value: UserRole; expiresAt: number }>();

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

const withTimeout = <T,>(promise: Promise<T>, ms = 4000) =>
  Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('ROLE_TIMEOUT')), ms)),
  ]);

export async function getCurrentUserRole(user?: User | null): Promise<UserRole> {
  try {
    let currentUser = user ?? null;
    if (!currentUser) {
      const { data } = await withTimeout(supabase.auth.getUser(), 4000);
      currentUser = data?.user ?? null;
    }
    if (!currentUser) return 'user';

    const cacheKey = currentUser.id;
    const cached = roleCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const email = (currentUser.email || '').toLowerCase();
    if (email === 'admin@estyi.com') {
      try {
        await supabase.from('users').upsert(
          { id: currentUser.id, email: currentUser.email, role: 'admin', is_verified: true },
          { onConflict: 'id' }
        );
      } catch {}
      roleCache.set(currentUser.id, { value: 'admin', expiresAt: Date.now() + 60_000 });
      return 'admin';
    }

    const metaRole = getUserRole(currentUser);

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('users')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle(),
        4000
      );

      if (!error && data?.role && (data.role === 'admin' || data.role === 'clinic' || data.role === 'user')) {
        const value = data.role as UserRole;
        roleCache.set(currentUser.id, { value, expiresAt: Date.now() + 60_000 });
        return value;
      }
    } catch {}

    roleCache.set(currentUser.id, { value: metaRole, expiresAt: Date.now() + 60_000 });
    return metaRole;
  } catch {
    if (user?.email?.toLowerCase() === 'admin@estyi.com') {
      return 'admin';
    }
    return getUserRole(user ?? null);
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
    if (currentUser?.id || currentUser?.email) {
      try {
        let clinicData: any = null;
        if (currentUser.id) {
          const { data } = await supabase
            .from('clinics')
            .select('status')
            .eq('id', currentUser.id)
            .maybeSingle();
          clinicData = data;
        }

        if (!clinicData && currentUser.email) {
          const { data: byEmail } = await supabase
            .from('clinics')
            .select('status')
            .eq('email', currentUser.email)
            .maybeSingle();
          clinicData = byEmail;
        }

        if (clinicData?.status) {
          isClinicApproved = clinicData.status === 'active';
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
