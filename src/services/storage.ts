import { supabase } from '../lib/supabaseClient';
import { STORAGE_BUCKETS } from '../config/storageBuckets';

export const uploadRequestPhotos = async (userId: string, files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const bucket = STORAGE_BUCKETS.CERTIFICATES;
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `requests/${userId}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('upload error', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) {
      uploadedUrls.push(data.publicUrl);
    }
  }

  return uploadedUrls;
};

// Supabase public URL'lerinden bucket içi path'i çıkar
const extractBucketPath = (url: string, bucket: string): string | null => {
  try {
    const marker = `/storage/v1/object/`;
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const after = url.substring(idx + marker.length);
      const parts = after.split('/');
      // parts[0] = public|private, parts[1] = bucket name
      if (parts.length >= 3 && parts[1] === bucket) {
        const path = parts.slice(2).join('/');
        return path;
      }
    }

    // Dev/local fallback: URL supabase formatında değilse path'i domain sonrası olarak al
    // Örnek: http://localhost:5175/requests/<...> veya http://localhost:5175/images/requests/<...>
    const u = new URL(url);
    const cleaned = u.pathname.replace(/^\/+/, '');

    // images/<realPath>
    if (cleaned.startsWith(`${bucket}/`)) {
      return cleaned.slice(bucket.length + 1);
    }

    // direct resource paths we use in dev mock
    const knownRoots = ['requests/', 'applications/', 'avatars/', 'profiles/'];
    for (const root of knownRoots) {
      if (cleaned.startsWith(root)) return cleaned;
    }

    return null;
  } catch {
    return null;
  }
};

// Fotoğraf URL'lerini imzala: bucket private olsa bile görüntülenebilir link üretir
export const signRequestPhotoUrls = async (urls: string[], expiresInSeconds: number = 3600): Promise<string[]> => {
  if (!urls || urls.length === 0) return [];
  const bucket = STORAGE_BUCKETS.CERTIFICATES;
  const out: string[] = [];
  for (const u of urls) {
    const path = extractBucketPath(u, bucket);
    if (!path) {
      // Path çözümlenemedi, orijinal URL'yi kullan
      out.push(u);
      continue;
    }
    try {
      // Supabase SDK v2: createSignedUrl
      // Not: Dev mock ortamında bu metod olmayabilir; hata olursa orijinali kullanırız
      const anyStorage: any = supabase.storage;
      const fromBucket = anyStorage.from(bucket);
      if (typeof fromBucket.createSignedUrl === 'function') {
        const { data, error } = await fromBucket.createSignedUrl(path, expiresInSeconds);
        if (!error && data?.signedUrl) {
          out.push(data.signedUrl);
        } else {
          out.push(u);
        }
      } else {
        // Dev mock veya desteklenmeyen durumda fallback
        out.push(u);
      }
    } catch {
      out.push(u);
    }
  }
  return out;
};

export const uploadClinicCertificates = async (applicationId: string, files: File[], userId?: string): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const bucket = STORAGE_BUCKETS.CERTIFICATES;
  const uploadedUrls: string[] = [];
  let uid = userId;
  try {
    if (!uid) {
      const { data } = await supabase.auth.getSession();
      uid = data?.session?.user?.id || 'anonymous';
    }
  } catch {
    uid = 'anonymous';
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `clinic-applications/${uid}/${Date.now()}_${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('upload error', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) {
      uploadedUrls.push(data.publicUrl);
    }
  }

  return uploadedUrls;
};

// Genel imzalama: images bucket’taki herhangi bir dosya URL listesini imzalar
export const signImageUrls = async (urls: string[], expiresInSeconds: number = 3600): Promise<string[]> => {
  if (!urls || urls.length === 0) return [];
  const bucket = STORAGE_BUCKETS.CERTIFICATES;
  const out: string[] = [];
  for (const u of urls) {
    const path = extractBucketPath(u, bucket);
    if (!path) {
      out.push(u);
      continue;
    }
    try {
      const anyStorage: any = supabase.storage;
      const fromBucket = anyStorage.from(bucket);
      if (typeof fromBucket.createSignedUrl === 'function') {
        const { data, error } = await fromBucket.createSignedUrl(path, expiresInSeconds);
        if (!error && data?.signedUrl) {
          out.push(data.signedUrl);
        } else {
          out.push(u);
        }
      } else {
        out.push(u);
      }
    } catch {
      out.push(u);
    }
  }
  return out;
};
