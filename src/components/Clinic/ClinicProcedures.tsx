import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { PROCEDURE_CATEGORIES } from '../../data/procedureCategories';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';

interface ClinicPrice {
  id: string;
  clinic_id: string;
  procedure_id: string;
  currency: string;
  amount: number;
}

const ClinicProcedures: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicSpecialties, setClinicSpecialties] = useState<string[]>([]);
  const [prices, setPrices] = useState<ClinicPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ClinicPrice | null>(null);
  const [form, setForm] = useState<{ procedure_id?: string; amount?: number }>({});

  // Talep formu ve klinik başvurusu ile birebir aynı: procedureCategories (tek kaynak). Sadece klinik uzmanlık alanları gösterilir.
  const procedureOptions: { key: string; name: string }[] = (() => {
    const all = PROCEDURE_CATEGORIES.flatMap((cat) =>
      cat.procedures.map((proc) => {
        const trKey = `procedureCategories.procedures.${proc.key}`;
        const translated = t(trKey);
        const name = translated && translated !== trKey ? translated : proc.name;
        return { key: proc.key, name };
      })
    );
    if (clinicSpecialties.length === 0) return all;
    return all.filter((s) => clinicSpecialties.includes(s.key));
  })();

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

  async function loadClinicSpecialties(cid: string) {
    try {
      const { data } = await (supabase as any).from('clinics').select('specialties').eq('id', cid).single();
      const specs = Array.isArray(data?.specialties) ? data.specialties : [];
      setClinicSpecialties(specs);
    } catch (e) {
      console.error(e);
      setClinicSpecialties([]);
    }
  }

  async function loadPrices(cid: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any).from('clinic_price_list').select('*').eq('clinic_id', cid);
      if (error) {
        console.error('Fiyat yükleme hatası:', error);
        throw error;
      }
      const loadedPrices = Array.isArray(data) ? data : [];
      setPrices(loadedPrices);
      console.log('Yüklenen fiyatlar:', loadedPrices.length);
    } catch (e: any) {
      console.error('Fiyat yükleme hatası:', e);
      setError(e?.message || 'Fiyatlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const cid = await resolveClinicId();
      if (cid) {
        await loadClinicSpecialties(cid);
        await loadPrices(cid);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function resetForm() {
    setForm({});
    setEditing(null);
  }

  async function savePrice() {
    if (!clinicId) {
      setError('Klinik ID bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    if (!form.procedure_id) {
      setError('Lütfen işlem seçin');
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError('Lütfen geçerli bir tutar girin');
      return;
    }

    // Duplicate kontrolü: Aynı işlem için zaten fiyat varsa (edit modunda değilse) hata ver
    if (!editing) {
      const existing = prices.find(p => p.procedure_id === form.procedure_id);
      if (existing) {
        setError('Bu işlem için zaten bir fiyat tanımlı. Lütfen mevcut fiyatı düzenleyin.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const currency = 'USD';
      if (editing) {
        // Edit modunda: aynı procedure_id'ye sahip başka bir kayıt varsa (kendi kaydı hariç) hata ver
        const otherExisting = prices.find(p => p.procedure_id === form.procedure_id && p.id !== editing.id);
        if (otherExisting) {
          setError('Bu işlem için zaten başka bir fiyat tanımlı.');
          setLoading(false);
          return;
        }
        const { error: updateError } = await (supabase as any).from('clinic_price_list').update({
          procedure_id: form.procedure_id,
          currency,
          amount: form.amount,
        }).eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const newPrice: ClinicPrice = {
          id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clinic_id: clinicId,
          procedure_id: form.procedure_id!,
          currency,
          amount: Number(form.amount),
        };
        const { error: insertError } = await (supabase as any).from('clinic_price_list').insert(newPrice);
        if (insertError) throw insertError;
      }
      await loadPrices(clinicId);
      resetForm();
    } catch (e: any) {
      console.error('Fiyat kaydetme hatası:', e);
      const errorMsg = e?.message || e?.error?.message || 'Kaydetme sırasında hata oluştu';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function deletePrice(id: string) {
    if (!clinicId) return;
    setLoading(true);
    setError(null);
    try {
      await (supabase as any).from('clinic_price_list').delete().eq('id', id);
      await loadPrices(clinicId);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Silme sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  function procedureName(pid: string) {
    const o = procedureOptions.find((x) => x.key === pid);
    return o ? o.name : pid;
  }

  return (
    <div className="space-y-6">
      {/* Otomatik Fiyatlar — klinik uzmanlık alanları, sadece USD */}
      <section className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t('clinicProcedures.automaticPricesTitle')}</h2>
              <span className="inline-block mt-1 text-xs font-medium text-emerald-100 bg-white/20 px-2 py-0.5 rounded-full">
                {t('clinicProcedures.automaticPricesBadge')}
              </span>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('clinicProcedures.newPrice')}
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">{t('clinicProcedures.automaticPricesDesc')}</p>
          {procedureOptions.length === 0 && (
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm mb-4">
              {t('clinicProcedures.noSpecialtiesHint')}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">{t('clinicProcedures.procedure')}</label>
              <select
                value={form.procedure_id || ''}
                onChange={(e) => setForm((f) => ({ ...f, procedure_id: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">{t('clinicProcedures.selectProcedure')}</option>
                {procedureOptions.map((o) => (
                  <option key={o.key} value={o.key}>{o.name}</option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700">{t('clinicProcedures.currency')}</label>
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-700 font-medium">
                USD
              </div>

              <label className="block text-sm font-medium text-gray-700">{t('clinicProcedures.amount')}</label>
              <input
                type="number"
                value={form.amount ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder={t('clinicProcedures.amountPlaceholder')}
              />

              <div className="flex gap-3">
                <button
                  onClick={savePrice}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
                >
                  {editing ? t('clinicProcedures.update') : t('clinicProcedures.save')}
                </button>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  {t('clinicProcedures.clear')}
                </button>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('clinicProcedures.priceList')}</h3>
              {loading && prices.length === 0 ? (
                <p className="text-gray-500">{t('clinicProcedures.loading')}</p>
              ) : prices.length === 0 ? (
                <p className="text-gray-500">{t('clinicProcedures.noFixedPrices')}</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {prices.map((p) => (
                    <li key={p.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{procedureName(p.procedure_id)}</p>
                        <p className="text-sm text-gray-600">{p.amount} USD</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(p);
                            setForm({ procedure_id: p.procedure_id, amount: p.amount });
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => deletePrice(p.id)}
                          className="p-2 rounded-lg hover:bg-gray-100"
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
      </section>
    </div>
  );
};

export default ClinicProcedures;
