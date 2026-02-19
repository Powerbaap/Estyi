import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Edit2, FileText } from 'lucide-react';

interface ClinicPrice {
  id: string;
  clinic_id: string;
  procedure_name: string | null;
  country: string | null;
  region: string | null;
  sessions: number | null;
  currency: string | null;
  price_min: number | null;
  price_max: number | null;
}

const ClinicProcedures: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [prices, setPrices] = useState<ClinicPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  async function resolveClinicId() {
    const cached = localStorage.getItem('clinic_id');
    if (cached) {
      setClinicId(cached);
      return cached;
    }
    const metaClinicId = (user as any)?.user_metadata?.clinic_id;
    if (metaClinicId) {
      try {
        localStorage.setItem('clinic_id', metaClinicId);
      } catch {}
      setClinicId(metaClinicId);
      return metaClinicId;
    }
    if (user?.id) {
      const { data } = await supabase.from('clinics').select('id').eq('id', user.id).maybeSingle();
      if (data?.id) {
        try {
          localStorage.setItem('clinic_id', data.id);
        } catch {}
        setClinicId(data.id);
        return data.id;
      }
    }
    const email = user?.email;
    if (email) {
      const { data } = await supabase.from('clinics').select('id').eq('email', email).maybeSingle();
      if (data?.id) {
        try {
          localStorage.setItem('clinic_id', data.id);
        } catch {}
        setClinicId(data.id);
        return data.id;
      }
    }
    return null;
  }

  async function loadPrices(cid: string) {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any)
        .from('clinic_price_rules')
        .select('id, clinic_id, procedure_name, country, region, sessions, currency, price_min, price_max')
        .eq('clinic_id', cid);
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
        await loadPrices(cid);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function cancelEditing() {
    setEditingId(null);
    setEditingValue('');
  }

  async function saveInlinePrice(id: string) {
    if (!clinicId) {
      setError('Klinik ID bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    const value = Number(editingValue);
    if (!value || value <= 0) {
      setError('Lütfen geçerli bir tutar girin');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await (supabase as any)
        .from('clinic_price_rules')
        .update({ price_min: value, price_max: value })
        .eq('id', id);
      if (updateError) throw updateError;
      await loadPrices(clinicId);
      cancelEditing();
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || e?.error?.message || 'Kaydetme sırasında hata oluştu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function procedureName(p: ClinicPrice) {
    return p.procedure_name || '-';
  }

  return (
    <div className="space-y-6">
      {/* Sabit Fiyatlar — klinik sadece mevcut fiyatları düzenleyebilir */}
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
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">{t('clinicProcedures.automaticPricesDesc')}</p>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('clinicProcedures.priceList')}</h3>
            {loading && prices.length === 0 ? (
              <p className="text-gray-500">{t('clinicProcedures.loading')}</p>
            ) : prices.length === 0 ? (
              <p className="text-gray-500">{t('clinicProcedures.noFixedPrices')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlem
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bölge
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seans
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fiyat (USD)
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prices.map((p) => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {procedureName(p)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {p.region || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {p.sessions ?? '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {isEditing ? (
                              <input
                                type="number"
                                className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                placeholder={
                                  p.price_min !== null && p.price_min !== undefined ? String(p.price_min) : ''
                                }
                              />
                            ) : (
                              <>
                                {(p.price_min ?? 0)
                                  ? new Intl.NumberFormat('tr-TR').format(p.price_min!)
                                  : '-'} USD
                              </>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => saveInlinePrice(p.id)}
                                  disabled={loading}
                                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  Kaydet
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  disabled={loading}
                                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-xs font-medium hover:bg-gray-300 disabled:opacity-50"
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  const basePrice = p.price_min ?? 0;
                                  setEditingValue(basePrice ? String(basePrice) : '');
                                  setError(null);
                                }}
                                className="inline-flex items-center px-3 py-1.5 rounded-md bg-white border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <Edit2 className="w-4 h-4 mr-1" />
                                Düzenle
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
          </div>
        </div>
      </section>
      <p className="text-xs text-gray-500">
        İşlem eklemek veya kaldırmak için estyi@sport.com adresine e-posta gönderin.
      </p>
    </div>
  );
};

export default ClinicProcedures;
