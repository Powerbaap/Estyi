import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Upload, Award, Globe, Sparkles, Heart, Star, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { clinicApplicationService } from '../services/api';
import { useLocation } from 'react-router-dom';
import { logLegalAcceptance } from '../services/legalAcceptance';
import { COUNTRY_KEYS, CITY_OPTIONS } from '../data/countriesAndCities';
import { PROCEDURE_CATEGORIES } from '../data/procedureCategories';

const ClinicApplication: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  // Talep formu ile birebir aynı: procedureCategories (tek kaynak)
  const specialtyOptions: { key: string; name: string; categoryKey: string }[] = PROCEDURE_CATEGORIES.flatMap((cat) =>
    cat.procedures.map((proc) => {
      const trKey = `procedureCategories.procedures.${proc.key}`;
      const translated = t(trKey);
      const name = translated && translated !== trKey ? translated : proc.name;
      return { key: proc.key, name, categoryKey: cat.key };
    })
  );
  const [formData, setFormData] = useState({
    clinicName: '',
    countries: [] as string[],
    specialties: [] as string[],
    website: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    description: '',
    certificates: [] as File[],
    price_data: [] as {
      procedure_key: string;
      region: string | null;
      sessions: number | null;
      price: number;
    }[]
  });
  const [citiesByCountry, setCitiesByCountry] = useState<Record<string, string[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  type PriceCombo = {
    procedure_key: string;
    region: string | null;
    sessions: number | null;
  };

  const findProcedure = (procedureKey: string) => {
    for (const category of PROCEDURE_CATEGORIES) {
      const found = category.procedures.find((p) => p.key === procedureKey);
      if (found) return found;
    }
    return undefined;
  };

  const requiredPriceCombos: PriceCombo[] = useMemo(() => {
    const specialties = Array.isArray(formData.specialties) ? formData.specialties : [];
    const combos: PriceCombo[] = [];

    specialties.forEach((key) => {
      const proc = findProcedure(key);
      if (!proc || !Array.isArray(proc.params) || proc.params.length === 0) {
        combos.push({
          procedure_key: key,
          region: null,
          sessions: null,
        });
        return;
      }

      const isIntegerParam = (p: any) => p && p.options.every((o: string) => Number.isFinite(Number(o)));
      const param1 = proc.params[0] || null;
      const param2 = proc.params[1] || null;
      let regionOptions: string[] = [];
      let sessionsOptions: number[] = [];
      if (param1 && param2) {
        if (isIntegerParam(param1) && !isIntegerParam(param2)) {
          sessionsOptions = param1.options.map((v: string) => Number(v));
          regionOptions = Array.isArray(param2.options) ? param2.options : [];
        } else if (!isIntegerParam(param1) && isIntegerParam(param2)) {
          regionOptions = Array.isArray(param1.options) ? param1.options : [];
          sessionsOptions = param2.options.map((v: string) => Number(v));
        } else {
          regionOptions = [];
          param1.options.forEach((a: string) => {
            param2.options.forEach((b: string) => {
              regionOptions.push(a + ' | ' + b);
            });
          });
        }
      } else if (param1) {
        if (isIntegerParam(param1)) {
          sessionsOptions = param1.options.map((v: string) => Number(v));
        } else {
          regionOptions = Array.isArray(param1.options) ? param1.options : [];
        }
      }

      if (regionOptions.length === 0 && sessionsOptions.length === 0) {
        combos.push({
          procedure_key: key,
          region: null,
          sessions: null,
        });
      } else if (regionOptions.length > 0 && sessionsOptions.length === 0) {
        regionOptions.forEach((region: string) => {
          combos.push({
            procedure_key: key,
            region: region || null,
            sessions: null,
          });
        });
      } else if (regionOptions.length === 0 && sessionsOptions.length > 0) {
        sessionsOptions.forEach((s) => {
          combos.push({
            procedure_key: key,
            region: null,
            sessions: s,
          });
        });
      } else {
        regionOptions.forEach((region: string) => {
          sessionsOptions.forEach((s) => {
            combos.push({
              procedure_key: key,
              region: region || null,
              sessions: s,
            });
          });
        });
      }
    });

    return combos;
  }, [formData.specialties]);

  const findPriceItem = (procedureKey: string, region: string | null, sessions: number | null) => {
    return (formData.price_data || []).find((item) => {
      if (!item || item.procedure_key !== procedureKey) return false;
      const regionMatch = (item.region || null) === (region || null);
      const sessionsMatch = (item.sessions ?? null) === (sessions ?? null);
      return regionMatch && sessionsMatch;
    });
  };

  const handlePriceChange = (
    procedureKey: string,
    region: string | null,
    sessions: number | null,
    value: string
  ) => {
    const normalized = value.replace(',', '.');
    const num = Number(normalized);
    const price = Number.isFinite(num) && num >= 0 ? num : 0;

    setFormData((prev) => {
      const current = Array.isArray(prev.price_data) ? prev.price_data : [];
      const next = [...current];
      const index = next.findIndex((item) => {
        if (!item || item.procedure_key !== procedureKey) return false;
        const regionMatch = (item.region || null) === (region || null);
        const sessionsMatch = (item.sessions ?? null) === (sessions ?? null);
        return regionMatch && sessionsMatch;
      });

      if (price <= 0) {
        if (index !== -1) {
          next.splice(index, 1);
        }
      } else if (index === -1) {
        next.push({
          procedure_key: procedureKey,
          region,
          sessions,
          price,
        });
      } else {
        next[index] = {
          ...next[index],
          price,
        };
      }

      return {
        ...prev,
        price_data: next,
      };
    });
  };

  const totalRequiredPriceCount = requiredPriceCombos.length;

  const filledPriceCount = useMemo(() => {
    if (!Array.isArray(formData.price_data) || formData.price_data.length === 0) {
      return 0;
    }
    let count = 0;
    requiredPriceCombos.forEach((combo) => {
      const item = findPriceItem(combo.procedure_key, combo.region, combo.sessions);
      if (item && typeof item.price === 'number' && item.price > 0) {
        count += 1;
      }
    });
    return count;
  }, [formData.price_data, requiredPriceCombos]);

  const hasPriceError =
    Array.isArray(formData.specialties) &&
    formData.specialties.length > 0 &&
    totalRequiredPriceCount > 0 &&
    filledPriceCount < totalRequiredPriceCount;

  const toggleCountry = (countryKey: string) => {
    setFormData(prev => {
      const exists = prev.countries.includes(countryKey);
      const nextCountries = exists
        ? prev.countries.filter(c => c !== countryKey)
        : [...prev.countries, countryKey];
      return { ...prev, countries: nextCountries };
    });
    if (formData.countries.includes(countryKey)) {
      setCitiesByCountry(prev => {
        const { [countryKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const toggleCity = (countryKey: string, city: string) => {
    setCitiesByCountry(prev => {
      const current = prev[countryKey] || [];
      const next = current.includes(city)
        ? current.filter(c => c !== city)
        : [...current, city];
      return { ...prev, [countryKey]: next };
    });
  };

  const selectAllCities = (countryKey: string) => {
    const list = CITY_OPTIONS[countryKey] || [];
    setCitiesByCountry(prev => ({ ...prev, [countryKey]: [...list] }));
  };

  const clearCities = (countryKey: string) => {
    setCitiesByCountry(prev => {
      const { [countryKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const selectAllCountries = () => {
    setFormData(prev => ({ ...prev, countries: [...COUNTRY_KEYS] }));
  };

  const clearAllCountries = () => {
    setFormData(prev => ({ ...prev, countries: [] }));
    setCitiesByCountry({});
  };

  const handleSpecialtyToggle = (key: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(key)
        ? prev.specialties.filter(s => s !== key)
        : [...prev.specialties, key]
    }));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Kabul edilen türler ve maksimum dosya boyutu (10MB)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const MAX_BYTES = 10 * 1024 * 1024;

    const valid: File[] = [];
    const rejected: string[] = [];

    for (const f of files) {
      const typeOk = allowedTypes.includes(f.type);
      const sizeOk = f.size <= MAX_BYTES;
      if (typeOk && sizeOk) {
        valid.push(f);
      } else {
        const reason = !typeOk && !sizeOk
          ? getTranslation('clinicApplication.fileInvalidTypeSize', 'Invalid file type and size')
          : !typeOk
          ? getTranslation('clinicApplication.fileInvalidType', 'Invalid file type')
          : getTranslation('clinicApplication.fileTooBig', 'File exceeds 10MB limit');
        rejected.push(`${f.name} (${reason})`);
      }
    }

    if (rejected.length) {
      alert(
        getTranslation('clinicApplication.filesRejectedTitle', 'Some files could not be added:') + '\n' +
        rejected.join('\n') +
        '\n\n' + getTranslation('clinicApplication.filesRejectedHint', 'Please only upload PDF, JPG or PNG files up to 10MB.')
      );
    }

    if (valid.length) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, ...valid]
      }));
    }
  };

  const removeCertificateAt = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.password || !formData.confirmPassword) {
        alert('Lütfen şifre ve şifre tekrarını doldurun.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert(getTranslation('clinicApplication.passwordsDoNotMatch', 'Passwords do not match!'));
        return;
      }
      const pwd = formData.password;
      const lengthOk = pwd.length >= 8;
      const upperOk = /[A-Z]/.test(pwd);
      if (!lengthOk || !upperOk) {
        alert(getTranslation('clinicApplication.passwordRequirements', 'Password must be at least 8 characters and contain at least one uppercase letter.'));
        return;
      }
      const hasMissingCities = (formData.countries || []).some((countryKey: string) => {
        const cities = citiesByCountry[countryKey];
        return !cities || cities.length === 0;
      });
      if ((formData.countries || []).length > 0 && hasMissingCities) {
        alert(getTranslation('clinicApplication.cityRequired', 'Lütfen seçtiğiniz her ülke için en az bir şehir seçin.'));
        return;
      }
      setSubmitting(true);
      // 1) Sertifikalar varsa önce depoya yükle (anon kullanıcılar için güncelleme RLS'inden kaçınmak amacıyla)
      let certificateFiles: {
        path: string;
        bucket: string;
        mime: string;
        size: number;
        url?: string;
      }[] = [];
      if (formData.certificates.length > 0) {
        const tmpId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { uploadClinicCertificates } = await import('../services/storage');
        certificateFiles = await uploadClinicCertificates(tmpId, formData.certificates);
      }

      // 2) Başvuru kaydı oluştur (sertifika URL'leri dahil)
      await clinicApplicationService.createApplication({
        clinic_name: formData.clinicName,
        countries: formData.countries,
        cities_by_country: Object.keys(citiesByCountry).length ? citiesByCountry : undefined,
        specialties: formData.specialties,
        website: formData.website,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        description: formData.description,
        certificate_files: certificateFiles,
        price_data: Array.isArray(formData.price_data) ? formData.price_data : [],
      });
      const actorId = user?.id || formData.email;
      try {
        await logLegalAcceptance('clinic', actorId, 'clinic_agreement');
        await logLegalAcceptance('clinic', actorId, 'data_security_addendum');
      } catch (_) { /* non-blocking */ }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Başvuru gönderilirken hata:', err);
      // Supabase hata mesajını kullanıcıya daha anlaşılır ver
      const raw = err?.message || err?.error?.message || '';
      const normalized = (raw || '').toLowerCase();

      let friendly = '';
      if (normalized.includes('bu e-posta ile zaten hesap var') || normalized.includes('user already exists') || normalized.includes('already registered')) {
        friendly = raw;
      } else if (normalized.includes('şifre en az 8 karakter') || (normalized.includes('password') && normalized.includes('character'))) {
        friendly = raw;
      } else if (normalized.includes('row-level security') || normalized.includes('rls')) {
        friendly = 'Yetki politikası nedeniyle başvuru kaydı reddedildi (RLS). Lütfen yönetici politikalarını kontrol edin.';
      } else if (normalized.includes('permission denied')) {
        friendly = 'İzin hatası oluştu. Lütfen Supabase tabloları/depoyu ve politikaları kontrol edin.';
      } else if (normalized.includes('bucket') && normalized.includes('not found')) {
        friendly = 'Depolama kovası bulunamadı. Sertifika yüklemeleri için ilgili kovayı oluşturun.';
      }

      alert(
        getTranslation('clinicApplication.submitError', 'An error occurred while submitting the application. ') +
          (friendly ? `\n\n${friendly}` : '') +
          (raw ? `\n\nDetay: ${raw}` : '')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Otomatik gönderim testi: /clinic-application?auto=1 ile çalışır
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auto') === '1' && !isSubmitted && !submitting) {
      (async () => {
        try {
          setSubmitting(true);
          // Test verileri
          const payload = {
            clinic_name: formData.clinicName || 'Test Klinik',
            countries: formData.countries.length ? formData.countries : ['turkey'],
            cities_by_country: Object.keys(citiesByCountry).length ? citiesByCountry : undefined,
            specialties: formData.specialties.length ? formData.specialties : ['sac_ekimi_fue'],
            website: formData.website || 'https://example.com',
            phone: formData.phone || '+90 212 555 0000',
            email: formData.email || 'test.clinic@example.com',
            password: formData.password || 'Test12345!',
            description: formData.description || 'Otomatik test başvurusu'
          };
          const created = await clinicApplicationService.createApplication(payload);
          // Sertifika ekleme opsiyonel, dosya yoksa atla
          setIsSubmitted(true);
          console.log('Otomatik başvuru oluşturuldu:', created);
        } catch (err) {
          console.error('Otomatik başvuru hatası:', err);
        } finally {
          setSubmitting(false);
        }
      })();
    }
  }, [location.search]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center py-12 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {getTranslation('clinicApplication.submissionSuccess', 'Application Submitted!')}
            </h2>
            <p className="text-gray-600 mb-6">
              {getTranslation('clinicApplication.submissionMessage', 'Your application has been successfully received. We will get back to you as soon as possible.')}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              {getTranslation('clinicApplication.backToHome', 'Back to Homepage')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {getTranslation('clinicApplication.title', 'Clinic Application Form')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {getTranslation('clinicApplication.subtitle', 'Join our global network of certified aesthetic clinics and connect with patients worldwide')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Clinic Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.clinicName', 'Clinic Name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.clinicNamePlaceholder', 'Enter your clinic name')}
                  />
                </div>

                {/* Ülkeler — birden fazla seçim (talep formu ile aynı liste) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.countries', 'Ülkeler')} * ({getTranslation('clinicApplication.selectCountriesHint', 'Select countries where your clinic has branches')})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      type="button"
                      onClick={selectAllCountries}
                      className="text-sm px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                    >
                      {getTranslation('clinicApplication.selectAllCountries', 'Tümünü seç')}
                    </button>
                    <button
                      type="button"
                      onClick={clearAllCountries}
                      className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {getTranslation('clinicApplication.clearAll', 'Tümünü temizle')}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-4 bg-white/50">
                    {COUNTRY_KEYS.map((key) => (
                      <label key={key} className="flex items-center space-x-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.countries.includes(key)}
                          onChange={() => toggleCountry(key)}
                          className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{t(`countries.${key}`) || key}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTranslation('clinicApplication.selected', 'Seçilen')}: {formData.countries.length} {getTranslation('clinicApplication.country', 'ülke')}
                  </p>
                </div>

                {/* Seçilen her ülke için şehirler — birden fazla şehir seçilebilir */}
                {formData.countries.map((countryKey) => {
                  const cityList = CITY_OPTIONS[countryKey];
                  if (!cityList || cityList.length === 0) return null;
                  const selectedCities = citiesByCountry[countryKey] || [];
                  return (
                    <div key={countryKey} className="border border-gray-200 rounded-xl p-4 bg-white/50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getTranslation('clinicApplication.citiesIn', 'Şehirler')} — {t(`countries.${countryKey}`) || countryKey}
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => selectAllCities(countryKey)}
                          className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          {getTranslation('clinicApplication.selectAll', 'Tümünü seç')}
                        </button>
                        <button
                          type="button"
                          onClick={() => clearCities(countryKey)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          {getTranslation('clinicApplication.clear', 'Temizle')}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                        {cityList.map((city) => (
                          <label key={city} className="flex items-center space-x-2 cursor-pointer hover:bg-purple-50 p-1.5 rounded">
                            <input
                              type="checkbox"
                              checked={selectedCities.includes(city)}
                              onChange={() => toggleCity(countryKey, city)}
                              className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{city}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTranslation('clinicApplication.selected', 'Seçilen')}: {selectedCities.length} {getTranslation('clinicApplication.city', 'şehir')}
                      </p>
                    </div>
                  );
                })}

                {/* Specialties — talep formundaki işlem listesi ile birebir aynı (key ile eşleşir) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.specialties', 'Uzmanlık Alanları')} * ({getTranslation('clinicApplication.selectAll', 'Tümünü seçin')})
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-4 bg-white/50">
                    {specialtyOptions.map((item) => (
                      <label key={item.key} className="flex items-center space-x-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(item.key)}
                          onChange={() => handleSpecialtyToggle(item.key)}
                          className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTranslation('clinicApplication.selected', 'Seçilen')}: {formData.specialties.length} {getTranslation('clinicApplication.specialtyAreas', 'uzmanlık alanı')}
                  </p>
                </div>

                {formData.specialties.length > 0 && (
                  <div className="border border-purple-100 bg-purple-50/60 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{getTranslation('clinicApplication.pricingTitle', 'Pricing')}</p>
                        <p className="text-xs text-gray-600">
                          Seçtiğiniz işlemler için USD fiyatları girin.
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {filledPriceCount}/{totalRequiredPriceCount || 0} fiyat girildi
                      </span>
                    </div>

                    {hasPriceError && (
                      <p className="text-xs text-red-600">
                        Seçtiğiniz tüm işlemler için fiyat girmeniz zorunludur.
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formData.specialties.map((key) => {
                        const proc = findProcedure(key);
                        const name = proc?.name || key;
                        const combos = requiredPriceCombos.filter((c) => c.procedure_key === key);
                        const filledForProcedure = combos.reduce((acc, combo) => {
                          const item = findPriceItem(combo.procedure_key, combo.region, combo.sessions);
                          if (item && typeof item.price === 'number' && item.price > 0) {
                            return acc + 1;
                          }
                          return acc;
                        }, 0);

                        return (
                          <div
                            key={key}
                            className="border border-purple-100 bg-white/80 rounded-xl p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                              <span className="text-xs text-gray-500">
                                {filledForProcedure}/{combos.length || 1}
                              </span>
                            </div>

                            {combos.length === 0 ? (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-600">Tek fiyat (USD)</span>
                                <input
                                  type="number"
                                  min={0}
                                  step="1"
                                  className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  value={findPriceItem(key, null, null)?.price ?? ''}
                                  onChange={(e) =>
                                    handlePriceChange(key, null, null, e.target.value)
                                  }
                                  placeholder="USD"
                                />
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {combos.map((combo, index) => {
                                  const regionLabel = combo.region || '-';
                                  const sessionsLabel =
                                    combo.sessions != null ? `${combo.sessions} seans` : '-';
                                  const current = findPriceItem(
                                    combo.procedure_key,
                                    combo.region,
                                    combo.sessions
                                  );

                                  return (
                                    <div
                                      key={`${combo.procedure_key}-${combo.region ?? 'none'}-${
                                        combo.sessions ?? 'none'
                                      }-${index}`}
                                      className="flex items-center justify-between gap-3"
                                    >
                                      <div className="flex-1">
                                        <p className="text-[11px] font-medium text-gray-700">
                                          Bölge:{' '}
                                          <span className="font-normal">{regionLabel}</span>
                                        </p>
                                        <p className="text-[11px] font-medium text-gray-700">
                                          Seans:{' '}
                                          <span className="font-normal">{sessionsLabel}</span>
                                        </p>
                                      </div>
                                      <input
                                        type="number"
                                        min={0}
                                        step="1"
                                        className="w-24 px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        value={current?.price ?? ''}
                                        onChange={(e) =>
                                          handlePriceChange(
                                            combo.procedure_key,
                                            combo.region,
                                            combo.sessions,
                                            e.target.value
                                          )
                                        }
                                        placeholder="USD"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.website', 'Website')}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.websitePlaceholder', 'https://your-clinic-website.com')}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.phone', 'Contact Number')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.phonePlaceholder', '+90 XXX XXX XX XX')}
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.email', 'Email Address')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.emailPlaceholder', 'clinic@example.com')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.password', 'Password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.passwordPlaceholder', 'Create a password for clinic admin')}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {getTranslation('clinicApplication.passwordHint', 'Keep this password safe; you’ll use it to access the clinic panel.')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.confirmPassword', 'Confirm Password')} *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.confirmPasswordPlaceholder', 'Re-enter your password')}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.description', 'Clinic Description')} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={getTranslation('clinicApplication.descriptionPlaceholder', 'Write about your clinic, services, experience and what makes you special...')}
                  />
                </div>

                {/* Certificates Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.certificates', 'Certificates & Licenses')} *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors duration-300 bg-white/50">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCertificateUpload}
                      className="hidden"
                      id="certificate-upload"
                    />
                    <label
                      htmlFor="certificate-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">{getTranslation('clinicApplication.uploadCertificates', 'Upload certificates and licenses')}</span>
                      <span className="text-xs text-gray-500">{getTranslation('clinicApplication.fileFormat', 'PDF, JPG, PNG - max 10MB each file')}</span>
                    </label>
                  </div>
                  {formData.certificates.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.certificates.length} {getTranslation('clinicApplication.filesUploaded', 'files uploaded')}
                      </p>
                      <div className="flex flex-wrap">
                        {formData.certificates.map((file, index) => (
                          <div key={index} className="relative inline-block m-1">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                className="w-20 h-20 object-cover rounded-lg border"
                                alt={file.name}
                              />
                            ) : (
                              <div className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded-lg border text-xs text-center p-1">
                                <span>📄</span>
                                <span className="truncate w-full text-center">{file.name}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeCertificateAt(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Legal — tek onay: Şartlar ve Politikalar (/legal) */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      {t('legal.clickwrapClinic.acceptAll')}{' '}
                      <a href="/legal" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">{t('legal.clickwrap.legalPage')}</a>
                    </span>
                  </label>
                  {formData.specialties.length > 0 && hasPriceError && (
                    <p className="mt-2 text-xs text-red-600">
                      Başvuruyu göndermek için tüm işlemler için fiyat girmelisiniz.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !formData.clinicName ||
                    formData.countries.length === 0 ||
                    formData.specialties.length === 0 ||
                    !formData.description ||
                    !formData.phone ||
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !acceptTerms ||
                    hasPriceError
                  }
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {submitting ? getTranslation('clinicApplication.submitting', 'Submitting...') : getTranslation('clinicApplication.submitApplication', 'Submit Application')}
                </button>
                <p className="text-xs text-gray-600 mt-3 italic text-center">
                  {getTranslation('clinicApplication.loginNote', 'Daha sonra bu e-posta ve şifre ile giriş yapabilirsiniz.')}
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>{getTranslation('clinicApplication.whyJoin', 'Why Join Estyi?')}</span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span>{getTranslation('clinicApplication.globalAccess', 'Global patient network access')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{getTranslation('clinicApplication.verifiedCertification', 'Verified clinic certification')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span>{getTranslation('clinicApplication.securePayments', 'Secure payment processing')}</span>
                </li>
              </ul>
            </div>

            {/* Process */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200/50">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span>{getTranslation('clinicApplication.applicationProcess', 'Application Process')}</span>
              </h3>
              <div className="space-y-3 text-sm text-purple-800">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>{getTranslation('clinicApplication.step1', 'Submit application')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>{getTranslation('clinicApplication.step2', 'Review & verification (2-5 days)')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>{getTranslation('clinicApplication.step3', 'Contract signing')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>{getTranslation('clinicApplication.step4', 'Platform access granted')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicApplication;
