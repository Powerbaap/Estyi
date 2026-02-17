import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (request: any) => void;
}

import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { COUNTRY_KEYS, CITY_OPTIONS, TURKISH_CITIES } from '../../data/countriesAndCities';
import {
  PROCEDURE_CATEGORIES,
  getProcedure,
  filterProcedures,
  type ProcedureItem,
  type ProcedureCategory,
} from '../../data/procedureCategories';

const PriceRequestModal: React.FC<PriceRequestModalProps> = ({ isOpen, onClose, onRequestSubmitted }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  const [formData, setFormData] = useState({
    procedure: '',
    procedureKey: '',
    procedureParams: {} as Record<string, string>,
    countries: [] as string[],
    citiesTR: [] as string[],
    gender: '',
    description: '',
  });
  const [procedureSearch, setProcedureSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedProcedure = formData.procedureKey ? getProcedure(formData.procedureKey) : undefined;
  const hasParams = selectedProcedure && selectedProcedure.params.length > 0;
  const paramsFilled =
    !hasParams ||
    selectedProcedure!.params.every((p) => {
      const val = formData.procedureParams[p.type];
      return val != null && val !== '';
    });

  const getProcedureDisplayName = (proc: ProcedureItem) => {
    const key = `procedureCategories.procedures.${proc.key}`;
    const translated = t(key);
    return translated && translated !== key ? translated : proc.name;
  };
  const getCategoryDisplayName = (cat: ProcedureCategory) => {
    const key = `procedureCategories.categories.${cat.key}`;
    const translated = t(key);
    return translated && translated !== key ? translated : cat.name;
  };

  const searchResults = useMemo(() => {
    const q = procedureSearch.trim().toLowerCase();
    if (!q) return null;
    return filterProcedures(procedureSearch);
  }, [procedureSearch]);

  const categoriesToShow = searchResults !== null ? null : PROCEDURE_CATEGORIES;
  
  // Talep formu ve klinik başvurusu ile aynı ülke/şehir listesi (countriesAndCities)
  const getCountryName = (key: string) => t(`countries.${key}`) || key;
  const countries = COUNTRY_KEYS.map(key => ({ key, name: getCountryName(key) }));
  const turkishCities = TURKISH_CITIES;
  const istanbulRegionCities = ['İstanbul', 'Tekirdağ', 'Kırklareli', 'Edirne', 'Çanakkale', 'Kocaeli', 'Sakarya'];
  const cityOptions = CITY_OPTIONS;

  const [citiesByCountry, setCitiesByCountry] = useState<Record<string, string[]>>({});

  // Photo upload handlers removed

  const toggleCountry = (countryKey: string) => {
    setFormData(prev => {
      const exists = prev.countries.includes(countryKey);
      const nextCountries = exists
        ? prev.countries.filter(c => c !== countryKey)
        : [...prev.countries, countryKey];

      if (exists) {
        // Ülke kaldırıldığında şehir seçimlerini temizle
        setCitiesByCountry(prevMap => {
          const { [countryKey]: _, ...rest } = prevMap;
          return rest;
        });
        // Türkiye özel şehir state'ini de temizle
        if (countryKey === 'turkey') {
          return { ...prev, countries: nextCountries, citiesTR: [] };
        }
      }
      return { ...prev, countries: nextCountries };
    });
  };

  // Türkiye şehir seçim fonksiyonları
  const toggleCityTR = (city: string) => {
    setFormData(prev => ({
      ...prev,
      citiesTR: prev.citiesTR.includes(city)
        ? prev.citiesTR.filter(c => c !== city)
        : [...prev.citiesTR, city]
    }));
  };

  const selectAllCitiesTR = () => {
    setFormData(prev => ({
      ...prev,
      citiesTR: [...turkishCities]
    }));
  };

  const clearAllCitiesTR = () => {
    setFormData(prev => ({
      ...prev,
      citiesTR: []
    }));
  };

  // Genel şehir seçim fonksiyonları (Türkiye dışındaki ülkeler için)
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
    const list = cityOptions[countryKey] || [];
    setCitiesByCountry(prev => ({ ...prev, [countryKey]: [...list] }));
  };

  const clearCities = (countryKey: string) => {
    setCitiesByCountry(prev => {
      const { [countryKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const selectAllCountries = () => {
    setFormData(prev => ({
      ...prev,
      countries: [...COUNTRY_KEYS]
    }));
  };

  const clearAllCountries = () => {
    setFormData(prev => ({
      ...prev,
      countries: []
    }));
  };

  const isAllSelected = formData.countries.length === COUNTRY_KEYS.length;

  const isSubmitDisabled = () => {
    const isMissingCities = formData.countries.includes('turkey') && formData.citiesTR.length === 0;
    return (
      !user?.id ||
      !formData.procedure ||
      formData.countries.length === 0 ||
      !formData.gender ||
      isMissingCities ||
      !paramsFilled
    );
  };

  const getMissingHints = () => {
    const hints: string[] = [];
    if (!formData.procedure) hints.push(getTranslation('priceRequest.hintProcedure', 'İşlem seçin'));
    if (hasParams && !paramsFilled)
      hints.push(getTranslation('priceRequest.hintProcedureParams', 'Seçtiğiniz işlem için bölge/seans vb. alanları doldurun'));
    if (formData.countries.length === 0) hints.push(getTranslation('priceRequest.hintCountries', 'En az bir ülke seçin'));
    if (formData.countries.includes('turkey') && formData.citiesTR.length === 0) hints.push(getTranslation('priceRequest.hintCitiesTR', 'Türkiye için şehir seçin'));
    if (!formData.gender) hints.push(getTranslation('priceRequest.hintGender', 'Cinsiyet seçin'));
    return hints;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!user?.id) {
      setSubmitError(getTranslation('priceRequest.loginRequired', 'Talep oluşturmak için lütfen giriş yapın.'));
      return;
    }

    setIsSubmitting(true);

    const countriesSelected = [...formData.countries];
    const citiesMap: Record<string, string[]> = { ...citiesByCountry };
    if (countriesSelected.includes('turkey')) {
      citiesMap['turkey'] = [...formData.citiesTR];
    }

    const procedureCategory =
      formData.procedureKey &&
      PROCEDURE_CATEGORIES.find((cat) => cat.procedures.some((p) => p.key === formData.procedureKey));

    const region =
      (formData.procedureParams['bolge'] as string | undefined) ||
      (formData.procedureParams['region'] as string | undefined) ||
      null;

    const sessionsRaw =
      (formData.procedureParams['seans'] as string | undefined) ||
      (formData.procedureParams['sessions'] as string | undefined);
    const sessions =
      sessionsRaw && !Number.isNaN(Number(sessionsRaw)) ? Number(sessionsRaw) : null;

    const payload = {
      procedure_name: selectedProcedure ? getProcedureDisplayName(selectedProcedure) : formData.procedure,
      procedure_category: procedureCategory ? procedureCategory.name : null,
      region,
      sessions,
      selected_countries: countriesSelected,
      cities_by_country: citiesMap,
      gender: formData.gender || null,
      notes: formData.description || null,
    };

    try {
      console.log('[PRICE_REQUEST] creating request, offers via DB trigger');
      console.log('[PRICE_REQUEST] payload', payload);

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session?.access_token) {
        console.log('[PRICE_REQUEST] missing access token', {
          sessionError,
          session,
        });
        setSubmitError(
          getTranslation(
            'priceRequest.authRequired',
            'Giriş yapılmadı, lütfen çıkış yapıp tekrar giriş yap.'
          )
        );
        return;
      }

      const token = session.access_token;
      const tokenPrefix = token.slice(0, 25);
      const tokenParts = token.split('.').length;

      console.log(
        '[PRICE_REQUEST] VITE_SUPABASE_URL',
        import.meta.env.VITE_SUPABASE_URL
      );
      console.log('[PRICE_REQUEST] tokenPrefix', tokenPrefix);
      console.log('[PRICE_REQUEST] tokenParts', tokenParts);

      const requestInsert = {
        user_id: user.id,
        procedure_name: payload.procedure_name,
        procedure_category: payload.procedure_category,
        region: payload.region,
        sessions: payload.sessions,
        selected_countries: payload.selected_countries,
        cities_by_country: payload.cities_by_country,
        gender: payload.gender,
        notes: payload.notes,
        status: 'open',
      };

      console.log('[PRICE_REQUEST] requestInsert', requestInsert);

      const {
        data: requestRow,
        error: requestError,
      } = await supabase
        .from('requests')
        .insert(requestInsert as any)
        .select('*')
        .single();

      if (requestError || !requestRow) {
        console.log('[PRICE_REQUEST] request insert error', {
          error: requestError,
          row: requestRow,
        });
        throw requestError || new Error('Talep oluşturma sırasında hata oluştu.');
      }

      let offers: any[] = [];
      const delays = [200, 400, 600, 800, 1000];

      for (let i = 0; i < delays.length; i++) {
        const {
          data: offersData,
          error: offersError,
        } = await supabase
          .from('offers')
          .select('*')
          .eq('request_id', requestRow.id);

        if (offersError) {
          console.log('[PRICE_REQUEST] offers fetch error', {
            error: offersError,
            attempt: i + 1,
          });
          break;
        }

        if (Array.isArray(offersData) && offersData.length > 0) {
          offers = offersData;
          break;
        }

        if (i < delays.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, delays[i]));
        }
      }

      const offersCount = Array.isArray(offers) ? offers.length : 0;

      const newRequest = {
        id: requestRow.id,
        procedure: formData.procedure,
        procedureKey: formData.procedureKey,
        status: requestRow.status ?? 'open',
        createdAt: requestRow.created_at ? new Date(requestRow.created_at) : new Date(),
        offersCount,
        countries: countriesSelected,
        citiesTR: formData.countries.includes('turkey') ? formData.citiesTR : [],
        photos: Array.isArray(requestRow?.photos) ? requestRow.photos.length : 0,
        photoUrls: Array.isArray(requestRow?.photos) ? requestRow.photos : [],
        offers: Array.isArray(offers) ? offers : [],
      };

      console.log('[PRICE_REQUEST] response', {
        requestId: newRequest.id,
        offersCount: newRequest.offersCount,
      });

      onRequestSubmitted(newRequest);

      setFormData({
        procedure: '',
        procedureKey: '',
        procedureParams: {},
        countries: [],
        citiesTR: [],
        gender: '',
        description: '',
      });
      setProcedureSearch('');
      setSubmitError(null);

      let successMessage = getTranslation(
        'priceRequest.submitSuccess',
        'Talebiniz oluşturuldu, teklifler geldikçe bilgilendirileceksiniz.'
      );

      if (offersCount === 0) {
        successMessage = getTranslation(
          'priceRequest.submitSuccessNoOffersYet',
          'Talebin alındı, teklifler birazdan gelecek.'
        );
      }

      alert(successMessage);
      onClose();
    } catch (err: any) {
      console.log('[PRICE_REQUEST] error', {
        name: err?.name,
        message: err?.message,
        status: err?.status,
        details: err?.details,
      });
      let uiMessage =
        (typeof err?.message === 'string' && err.message.trim()) ||
        getTranslation('priceRequest.submitError', 'Talep gönderilirken sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');

      const lower = (uiMessage || '').toLowerCase();
      if (
        lower.includes('permission') ||
        lower.includes('not authorized') ||
        lower.includes('rls') ||
        lower.includes('denied')
      ) {
        uiMessage = getTranslation(
          'priceRequest.submitErrorPermission',
          'Yetki hatası: Lütfen hesabınızla yeniden giriş yapın veya daha sonra tekrar deneyin.'
        );
      } else if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed')) {
        uiMessage = getTranslation(
          'priceRequest.submitErrorNetwork',
          'Ağ hatası: İnternet bağlantınızı kontrol ederek tekrar deneyin.'
        );
      }

      setSubmitError(uiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{getTranslation('priceRequest.title', 'Get Price Quote')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Procedure Selection: Arama + Kategorilere göre işlemler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.procedure', 'İşlem Seçin')} *
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={procedureSearch}
                onChange={(e) => setProcedureSearch(e.target.value)}
                placeholder={t('procedureCategories.searchPlaceholder') || 'İşlem ara (örn. saç ekimi, lazer)...'}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="max-h-56 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
              {searchResults !== null ? (
                searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">{getTranslation('priceRequest.noResults', 'Sonuç bulunamadı')}</p>
                ) : (
                  searchResults.map(({ category, procedure }) => (
                    <button
                      key={procedure.key}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          procedureKey: procedure.key,
                          procedure: getProcedureDisplayName(procedure),
                          procedureParams: {},
                        }));
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.procedureKey === procedure.key
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <span className="font-medium">{getProcedureDisplayName(procedure)}</span>
                      <span className="text-gray-500 ml-1"> — {getCategoryDisplayName(category)}</span>
                    </button>
                  ))
                )
              ) : (
                categoriesToShow?.map((cat) => (
                  <div key={cat.key}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1 sticky top-0 bg-gray-50 rounded">
                      {getCategoryDisplayName(cat)}
                    </p>
                    {cat.procedures.map((proc) => (
                      <button
                        key={proc.key}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            procedureKey: proc.key,
                            procedure: getProcedureDisplayName(proc),
                            procedureParams: {},
                          }));
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          formData.procedureKey === proc.key ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        {getProcedureDisplayName(proc)}
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
            {formData.procedureKey && (
              <p className="text-xs text-gray-500 mt-1">
                {getTranslation('priceRequest.selected', 'Seçilen')}: {formData.procedure}
              </p>
            )}
          </div>

          {/* İşlem parametreleri (bölge, seans, ml vb.) — seçilen işlemde varsa zorunlu */}
          {hasParams && selectedProcedure && (
            <div className="rounded-xl border-2 border-blue-100 bg-blue-50/50 p-4 space-y-4">
              <h4 className="text-sm font-semibold text-gray-800">
                {getTranslation('priceRequest.procedureOptions', 'İşlem seçenekleri')} *
              </h4>
              {selectedProcedure.params.map((param) => (
                <div key={param.type}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(`procedureCategories.paramTypes.${param.type}`) || param.type} *
                  </label>
                  <select
                    required
                    value={formData.procedureParams[param.type] ?? ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        procedureParams: { ...prev.procedureParams, [param.type]: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">{getTranslation('priceRequest.selectOption', 'Seçiniz')}</option>
                    {param.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Countries Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.selectCountries', 'Select Countries')} * ({getTranslation('priceRequest.selectCountriesHint', 'Select countries you want to receive offers from')})
            </label>
            
            {/* Quick Selection Buttons */}
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={selectAllCountries}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  isAllSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                }`}
              >
                {getTranslation('priceRequest.selectAll', 'Select All')}
              </button>
              <button
                type="button"
                onClick={clearAllCountries}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {getTranslation('priceRequest.clear', 'Clear')}
              </button>
            </div>

            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2">
                {countries.map((country) => (
                  <label key={country.key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.countries.includes(country.key)}
                      onChange={() => toggleCountry(country.key)}
                      className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{country.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getTranslation('priceRequest.selected', 'Selected')}: {formData.countries.length} {getTranslation('priceRequest.country', 'country')}
              {isAllSelected && <span className="text-blue-600 font-medium"> ({getTranslation('priceRequest.allCountries', 'All countries')})</span>}
            </p>
          </div>

          {/* Cities selection for Turkey */}
          {formData.countries.includes('turkey') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getTranslation('priceRequest.selectCities', 'Select Cities')} ({getTranslation('countries.turkey', 'Turkey')}) {formData.citiesTR.length === 0 && <span className="text-red-500">*</span>}
              </label>
              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={selectAllCitiesTR}
                  className="px-3 py-1 text-sm rounded-lg border bg-white text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {getTranslation('priceRequest.selectAll', 'Select All')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, citiesTR: [...istanbulRegionCities] }))}
                  className="px-3 py-1 text-sm rounded-lg border bg-white text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {getTranslation('priceRequest.istanbulRegion', 'Istanbul and Surrounding Cities')}
                </button>
                <button
                  type="button"
                  onClick={clearAllCitiesTR}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {getTranslation('priceRequest.clear', 'Clear')}
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {turkishCities.map((city) => (
                    <label key={city} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.citiesTR.includes(city)}
                        onChange={() => toggleCityTR(city)}
                        className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{getTranslation('priceRequest.selected', 'Selected')}: {formData.citiesTR.length} {getTranslation('priceRequest.city', 'city')}</p>
            </div>
          )}

          {/* Cities selection for other selected countries */}
          {formData.countries.filter(c => c !== 'turkey').map((ckey) => {
            const cityList = cityOptions[ckey] || [];
            if (cityList.length === 0) return null;
            return (
              <div key={ckey}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getTranslation('priceRequest.selectCities', 'Select Cities')} ({getCountryName(ckey)})
                </label>
                <div className="flex space-x-2 mb-3">
                  <button
                    type="button"
                    onClick={() => selectAllCities(ckey)}
                    className="px-3 py-1 text-sm rounded-lg border bg-white text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {getTranslation('priceRequest.selectAll', 'Select All')}
                  </button>
                  <button
                    type="button"
                    onClick={() => clearCities(ckey)}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {getTranslation('priceRequest.clear', 'Clear')}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {cityList.map((city) => (
                      <label key={city} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={(citiesByCountry[ckey] || []).includes(city)}
                          onChange={() => toggleCity(ckey, city)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{getTranslation('priceRequest.selected', 'Selected')}: {(citiesByCountry[ckey] || []).length} {getTranslation('priceRequest.city', 'city')}</p>
              </div>
            );
          })}
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.gender', 'Gender')} *
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{getTranslation('priceRequest.selectGender', 'Select gender')}</option>
              <option value="female">{getTranslation('priceRequest.female', 'Female')}</option>
              <option value="male">{getTranslation('priceRequest.male', 'Male')}</option>
            </select>
          </div>



          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.additionalDetails', 'Additional Details')}
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={getTranslation('priceRequest.descriptionPlaceholder', 'Additional information about treatment, your expectations, special requests...')}
            />
          </div>

          {/* (Old simple photo input removed; professional uploader is at the top) */}

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{getTranslation('priceRequest.importantInfo', 'Important Information')}</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>{t('legal.medicalDisclaimer')}</li>
              <li>{getTranslation('priceRequest.requestActive', 'Clinics can send offers as long as your request is active.')}</li>
              <li>{getTranslation('priceRequest.notifications', 'You will be notified when new offers arrive.')}</li>
              {isAllSelected && (
                <li className="text-blue-900 font-medium">{getTranslation('priceRequest.allCountriesInfo', 'You will receive offers from all countries. More options!')}</li>
              )}
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {getTranslation('priceRequest.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled() || isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{getTranslation('priceRequest.submitting', 'Gönderiliyor...')}</span>
                </>
              ) : (
                <>
                  <span>{isAllSelected ? getTranslation('priceRequest.submitAllCountries', 'Send to All Countries') : getTranslation('priceRequest.submitRequest', 'Create Request')}</span>
                </>
              )}
            </button>
          </div>

          {/* Submit Hata Mesajı */}
          {submitError && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {submitError}
            </div>
          )}

          {/* Disabled ipucu listesi */}
          {isSubmitDisabled() && (
            <div className="mt-3 text-sm text-red-600">
              <p className="font-medium mb-1">{getTranslation('priceRequest.missingFieldsTitle', 'Eksik bilgiler var:')}</p>
              <ul className="list-disc pl-5 space-y-1">
                {getMissingHints().map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default PriceRequestModal;
