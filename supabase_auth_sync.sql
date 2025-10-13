-- Auth.users → public.users otomatik senkronizasyon
-- Bu scripti Supabase SQL Editor'da çalıştırın (Project → SQL → New Query)

-- 1) Senkron fonksiyon: auth.users üzerinde INSERT/UPDATE olduğunda public.users’ı günceller
create or replace function public.sync_user_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_role text;
begin
  -- Metadata’dan isim/rol; yoksa email’den türet
  v_name := coalesce((new.raw_user_meta_data ->> 'name'), split_part(new.email, '@', 1));
  v_role := coalesce((new.raw_user_meta_data ->> 'role'), 'user');

  -- public.users içine ekle veya güncelle
  insert into public.users (id, user_id, email, name, role, is_verified, created_at, updated_at)
  values (
    new.id,
    upper(substr(md5(new.id::text), 1, 8)),
    new.email,
    v_name,
    v_role,
    true,
    now(),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$;

-- 2) Tetikleyiciler: auth.users üzerinde insert/update
drop trigger if exists trg_sync_user_on_insert on auth.users;
create trigger trg_sync_user_on_insert
after insert on auth.users
for each row execute procedure public.sync_user_from_auth();

drop trigger if exists trg_sync_user_on_update on auth.users;
create trigger trg_sync_user_on_update
after update on auth.users
for each row execute procedure public.sync_user_from_auth();

-- 3) RLS: public.users zaten kullanıcı bazlı RLS ile korunuyor.
-- SECURITY DEFINER sayesinde fonksiyon RLS engeline takılmadan çalışır.

-- 4) Sağlama için basit kontrol (opsiyonel): Son 10 auth kullanıcı ile eşleşen public.users satırlarını gösterir
-- select a.id, a.email, a.raw_user_meta_data, u.name, u.role from auth.users a
-- left join public.users u on u.id = a.id
-- order by a.created_at desc
-- limit 10;