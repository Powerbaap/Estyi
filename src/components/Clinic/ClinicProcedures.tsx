import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Procedure {
  id: string;
  name: string;
}

interface ClinicPrice {
  id: string;
  clinic_id: string;
  procedure_id: string;
  currency: string;
  amount: number;
}

const ClinicProcedures: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [prices, setPrices] = useState<ClinicPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ClinicPrice | null>(null);
  const [form, setForm] = useState<{ procedure_id?: string; currency: string; amount?: number }>({ currency: 'USD' });

  const offlineMode = useMemo(() => {
    return (import.meta as any).env?.VITE_OFFLINE_MODE === 'true' || (import.meta as any).env?.MODE === 'development';
  }, []);

  async function resolveClinicId() {
    const cached = localStorage.getItem('clinic_id');
    if (cached) {
      setClinicId(cached);
      return cached;
    }
    const metaClinicId = (user as any)?.user_metadata?.clinic_id;
    if (metaClinicId) {
      localStorage.setItem('clinic_id', metaClinicId);
      setClinicId(metaClinicId);
      return metaClinicId;
    }
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
        phone: '', website: '', address: '', location: 'Istanbul', specialties: [], description: '', photo_url: '', rating: 0,
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

  async function loadProcedures() {
    try {
      const { data } = await (supabase as any).from('procedures').select('*');
      setProcedures((data || []).map((p: any) => ({ id: p.id, name: p.name })));
    } catch (e) {
      console.error(e);
    }
  }

  async function loadPrices(cid: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any).from('clinic_procedure_prices').select('*').eq('clinic_id', cid);
      if (error) throw error;
      setPrices(data || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Fiyatlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await loadProcedures();
      const cid = await resolveClinicId();
      if (cid) await loadPrices(cid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function resetForm() {
    setForm({ currency: 'USD' });
    setEditing(null);
  }

  async function savePrice() {
    if (!clinicId) return;
    if (!form.procedure_id) { setError('Lütfen işlem seçin'); return; }
    if (!form.amount || form.amount <= 0) { setError('Lütfen geçerli bir tutar girin'); return; }
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        await (supabase as any).from('clinic_procedure_prices').update({
          procedure_id: form.procedure_id,
          currency: form.currency,
          amount: form.amount,
        }).eq('id', editing.id);
      } else {
        const newPrice: ClinicPrice = {
          id: `price_${Date.now()}`,
          clinic_id: clinicId,
          procedure_id: form.procedure_id!,
          currency: form.currency,
          amount: Number(form.amount),
        };
        await (supabase as any).from('clinic_procedure_prices').insert(newPrice);
      }
      await loadPrices(clinicId);
      resetForm();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Kaydetme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function deletePrice(id: string) {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    try {
      await (supabase as any).from('clinic_procedure_prices').delete().eq('id', id);
      await loadPrices(clinicId);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Silme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  function procedureName(pid: string) {
    const p = procedures.find((x) => x.id === pid);
    return p ? p.name : pid;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Sabit Fiyat Yönetimi</h1>
          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Fiyat
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">İşlem</label>
            <select
              value={form.procedure_id || ''}
              onChange={(e) => setForm((f) => ({ ...f, procedure_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seçiniz</option>
              {procedures.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Tutar</label>
            <input
              type="number"
              value={form.amount || ''}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Örn. 3500"
            />

            <div className="flex gap-3">
              <button
                onClick={savePrice}
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
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Fiyat Listesi</h2>
            {loading && prices.length === 0 ? (
              <p className="text-gray-500">Yükleniyor...</p>
            ) : prices.length === 0 ? (
              <p className="text-gray-500">Henüz sabit fiyat bulunmuyor.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {prices.map((p) => (
                  <li key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{procedureName(p.procedure_id)}</p>
                      <p className="text-sm text-gray-600">{p.amount} {p.currency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setForm({ procedure_id: p.procedure_id, currency: p.currency, amount: p.amount });
                        }}
                        className="p-2 rounded-md hover:bg-gray-100"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => deletePrice(p.id)}
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
    </div>
  );
};

export default ClinicProcedures;