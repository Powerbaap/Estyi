import { User } from '@supabase/supabase-js';

// Uygulama genelinde rol tespitini standartlaştırır
export function getUserRole(user: User | null | undefined): 'user' | 'clinic' | 'admin' {
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