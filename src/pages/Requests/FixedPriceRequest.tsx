import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import MarketCard from '../../components/Market/MarketCard';
import { scrollToTopInstant } from '../../utils/scrollUtils';

const FixedPriceRequest: React.FC = () => {
  const { t } = useTranslation();
  const [procedures, setProcedures] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [procedureId, setProcedureId] = useState('');
  const [busy, setBusy] = useState(false);
  const offline = (import.meta.env.VITE_OFFLINE_MODE === 'true');

  // Çeviri fallback yardımcı fonksiyonu
  const getTranslation = (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  useEffect(() => {
    scrollToTopInstant();
  }, []);

  useEffect(() => {
    const load = async () => {
      const procs = await supabase.from('procedures').select('*').order('name', { ascending: true });
      const cl = await supabase.from('clinics').select('*').order('name', { ascending: true });
      const vc = await supabase.from('v_market_cards').select('*').order('clinic_name', { ascending: true });
      setProcedures(procs.data || []);
      setClinics(cl.data || []);
      setCards(vc.data || []);
    };
    load();
  }, []);

  const countries = useMemo(() => {
    const set = new Set<string>();
    (clinics || []).forEach((c: any) => {
      const code = c.country_code || '';
      if (code) set.add(code);
    });
    return Array.from(set);
  }, [clinics]);

  const cities = useMemo(() => {
    return (clinics || [])
      .filter((c: any) => (c.country_code || '') === country)
      .map((c: any) => c.city)
      .filter(Boolean)
      .reduce((acc: string[], cur: string) => acc.includes(cur) ? acc : acc.concat(cur), []);
  }, [clinics, country]);

  const filteredCards = useMemo(() => {
    const mapped = (cards || []).map((c: any) => ({
      clinic_id: c.clinic_id,
      clinic_name: c.clinic_name,
      doctor_name: c.doctor_name || '',
      procedure_id: c.procedure_id,
      procedure_name: c.procedure_name || '',
      price_amount: c.price,
      price_currency: c.currency,
      clinic_rating: Number(c.clinic_rating ?? 0),
      reviews_count: Number(c.reviews_count ?? c.reviews ?? 0),
      instagram_url: c.instagram_url,
      website: c.website,
      country: c.country_code,
      city: c.city
    }));
    return mapped.filter((c: any) => {
      const okProc = procedureId ? c.procedure_id === procedureId : true;
      const okCountry = country ? c.country === country : true;
      const okCity = city ? (c.city || '') === city : true;
      return okProc && okCountry && okCity;
    });
  }, [cards, procedureId, country, city]);

  const handleMessage = async (clinicId: string) => {
    // Basit bir mesaj başlangıcı (offline’da sadece UI göstereceğiz)
    alert(getTranslation('request.messageStart', 'Mesaj başlatıldı'));
  };

  const handleBook = async (card: any) => {
    try {
      setBusy(true);
      // Demo: ödeme entegrasyonu kaldırıldı; doğrudan randevu kaydı oluştur
      await supabase.from('appointments').insert({
        user_id: 'DEV_USER',
        clinic_id: card.clinic_id,
        procedure_id: card.procedure_id,
        status: 'confirmed',
        deposit_amount: null
      });
      alert(getTranslation('request.appointmentConfirmed', 'Randevu onaylandı'));
    } catch (e: any) {
      alert(e?.message || 'Randevu oluşturulamadı');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{getTranslation('request.title', 'Talep Oluştur')}</h1>

        <div className="bg-white rounded-2xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{getTranslation('request.selectProcedure', 'İşlem Seç')}</label>
            <select className="w-full border rounded-lg p-2" value={procedureId} onChange={e => setProcedureId(e.target.value)}>
              <option value="">{getTranslation('common.select', 'Seç')}</option>
              {procedures.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{getTranslation('request.selectCountry', 'Ülke Seç')}</label>
            <select className="w-full border rounded-lg p-2" value={country} onChange={e => { setCountry(e.target.value); setCity(''); }}>
              <option value="">{getTranslation('common.select', 'Seç')}</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{getTranslation('request.selectCity', 'Şehir Seç (Opsiyonel)')}</label>
            <select className="w-full border rounded-lg p-2" value={city} onChange={e => setCity(e.target.value)}>
              <option value="">{getTranslation('common.optional', 'Opsiyonel')}</option>
              {cities.map(ci => <option key={ci} value={ci}>{ci}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCards.length === 0 ? (
            <div className="text-gray-600">{getTranslation('common.noResults', 'Sonuç bulunamadı')}</div>
          ) : (
            filteredCards.map((card) => (
              <MarketCard key={card.id} card={card} onMessage={handleMessage} onBook={handleBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FixedPriceRequest;
