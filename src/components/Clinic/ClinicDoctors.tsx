import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface Doctor {
  id: string;
  clinic_id: string;
  full_name: string;
  instagram_url?: string;
  website?: string;
  bio?: string;
  photo_url?: string;
}

const ClinicDoctors: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>({ full_name: '', instagram_url: '', website: '', bio: '' });

  const offlineMode = useMemo(() => {
    return (import.meta as any).env?.VITE_OFFLINE_MODE === 'true' || (import.meta as any).env?.MODE === 'development';
  }, []);

  async function resolveClinicId() {
    // Try localStorage first
    const cached = localStorage.getItem('clinic_id');
    if (cached) {
      setClinicId(cached);
      return cached;
    }

    // Try user metadata
    const metaClinicId = (user as any)?.user_metadata?.clinic_id;
    if (metaClinicId) {
      localStorage.setItem('clinic_id', metaClinicId);
      setClinicId(metaClinicId);
      return metaClinicId;
    }

    // Try to find or create a clinic for current user (dev/offline support)
    const fallbackId = `clinic_${Date.now()}`;
    try {
      const email = (user as any)?.email || (user as any)?.user_metadata?.email;
      const name = (user as any)?.user_metadata?.name || 'Test Clinic';

      const { data: existing } = await (supabase as any).from('clinics').select('*').eq('email', email);
      if (existing && existing.length > 0) {
        localStorage.setItem('clinic_id', existing[0].id);
        setClinicId(existing[0].id);
        return existing[0].id;
      }

      const newClinic = {
        id: fallbackId,
        name,
        email: email || `test_${fallbackId}@example.com`,
        phone: '',
        website: '',
        address: '',
        location: 'Istanbul',
        specialties: [],
        description: '',
        photo_url: '',
        rating: 0,
      };
      await (supabase as any).from('clinics').insert(newClinic);
      localStorage.setItem('clinic_id', fallbackId);
      setClinicId(fallbackId);
      return fallbackId;
    } catch (e) {
      console.error(e);
      localStorage.setItem('clinic_id', fallbackId);
      setClinicId(fallbackId);
      return fallbackId;
    }
  }

  async function loadDoctors(cid: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any).from('doctors').select('*').eq('clinic_id', cid);
      if (error) throw error;
      setDoctors(data || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Doktorlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const cid = await resolveClinicId();
      if (cid) await loadDoctors(cid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function resetForm() {
    setForm({ full_name: '', instagram_url: '', website: '', bio: '' });
    setEditing(null);
  }

  async function saveDoctor() {
    if (!clinicId) return;
    if (!form.full_name || form.full_name.trim().length < 2) {
      setError('Lütfen doktorun adını girin');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        const updatePayload = {
          full_name: form.full_name,
          instagram_url: form.instagram_url,
          website: form.website,
          bio: form.bio,
        } as Partial<Doctor>;
        await (supabase as any).from('doctors').update(updatePayload).eq('id', editing.id);
      } else {
        const newDoc: Doctor = {
          id: `doc_${Date.now()}`,
          clinic_id: clinicId,
          full_name: form.full_name!,
          instagram_url: form.instagram_url || '',
          website: form.website || '',
          bio: form.bio || '',
          photo_url: '',
        };
        await (supabase as any).from('doctors').insert(newDoc);
      }
      await loadDoctors(clinicId);
      resetForm();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Kaydetme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function deleteDoctor(id: string) {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    try {
      await (supabase as any).from('doctors').delete().eq('id', id);
      await loadDoctors(clinicId);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Silme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Doktor Yönetimi</h1>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Doktor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              value={form.full_name || ''}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Örn. Dr. Ayşe Demir"
            />

            <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
            <input
              type="url"
              value={form.instagram_url || ''}
              onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://instagram.com/username"
            />

            <label className="block text-sm font-medium text-gray-700">Web Sitesi</label>
            <input
              type="url"
              value={form.website || ''}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://..."
            />

            <label className="block text-sm font-medium text-gray-700">Biyografi</label>
            <textarea
              value={form.bio || ''}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Uzmanlık alanları, deneyimler vb."
            />

            <div className="flex gap-3">
              <button
                onClick={saveDoctor}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {editing ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Temizle
              </button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Doktor Listesi</h2>
            {loading && doctors.length === 0 ? (
              <p className="text-gray-500">Yükleniyor...</p>
            ) : doctors.length === 0 ? (
              <p className="text-gray-500">Henüz kayıtlı doktor bulunmuyor.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {doctors.map((d) => (
                  <li key={d.id} className="py-3 flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{d.full_name}</p>
                      {d.bio && <p className="text-sm text-gray-600 mt-1">{d.bio}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {d.instagram_url && (
                          <a href={d.instagram_url} target="_blank" rel="noreferrer" className="text-pink-600 inline-flex items-center">
                            <ExternalLink className="w-4 h-4 mr-1" /> Instagram
                          </a>
                        )}
                        {d.website && (
                          <a href={d.website} target="_blank" rel="noreferrer" className="text-blue-600 inline-flex items-center">
                            <ExternalLink className="w-4 h-4 mr-1" /> Web
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditing(d);
                          setForm({ full_name: d.full_name, instagram_url: d.instagram_url, website: d.website, bio: d.bio });
                        }}
                        className="p-2 rounded-md hover:bg-gray-100"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => deleteDoctor(d.id)}
                        className="p-2 rounded-md hover:bg-gray-100"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Doktor Yorumları</h2>
        <p className="text-gray-600 text-sm">Bu bölümde doktor yorumları görüntülenecek. (Yakında)</p>
      </div>
    </div>
  );
};

export default ClinicDoctors;