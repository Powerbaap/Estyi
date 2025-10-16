import { supabase } from '../lib/supabase';

export const uploadRequestPhotos = async (userId: string, files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const bucket = 'request-photos';
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `requests/${userId}/${Date.now()}-${i}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
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
    if (idx === -1) return null;
    const after = url.substring(idx + marker.length);
    // public/request-photos/<path> veya private/request-photos/<path>
    const parts = after.split('/');
    // parts[0] = public|private, parts[1] = bucket name
    if (parts.length >= 3 && parts[1] === bucket) {
      const path = parts.slice(2).join('/');
      return path;
    }
    return null;
  } catch {
    return null;
  }
};

// Fotoğraf URL'lerini imzala: bucket private olsa bile görüntülenebilir link üretir
export const signRequestPhotoUrls = async (urls: string[], expiresInSeconds: number = 3600): Promise<string[]> => {
  if (!urls || urls.length === 0) return [];
  const bucket = 'request-photos';
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

export const uploadClinicCertificates = async (applicationId: string, files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const bucket = 'clinic-certificates';
  const uploadedUrls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `applications/${applicationId}/${Date.now()}-${i}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) {
      uploadedUrls.push(data.publicUrl);
    }
  }

  return uploadedUrls;
};