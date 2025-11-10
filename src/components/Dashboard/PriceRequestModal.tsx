import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TREATMENT_AREAS } from '../../types';

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (request: any) => void;
}

import { useAuth } from '../../contexts/AuthContext';
import { requestService } from '../../services/api';

// Photo upload restored as optional

const PriceRequestModal: React.FC<PriceRequestModalProps> = ({ isOpen, onClose, onRequestSubmitted }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();


  // Helper function to get translation with fallback
  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };
  const [formData, setFormData] = useState({
    procedure: '',
    countries: [] as string[],
    citiesTR: [] as string[],
    age: '',
    gender: '',

    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get treatment areas in current language with fallback
  const getTreatmentAreas = () => {
    const currentLang = i18n.language || 'en';
    return TREATMENT_AREAS.map(area => ({
      key: area.key,
      name: area.name[currentLang as keyof typeof area.name] || area.name.en,
      description: area.description[currentLang as keyof typeof area.description] || area.description.en
    }));
  };

  const treatmentAreas = getTreatmentAreas();
  
  // Countries list with translation keys and fallbacks
  const countryKeys = [
    // ABD ve Meksika en üstte
    'usa', 'mexico',
    'turkey', 'southKorea', 'thailand', 'brazil', 'colombia', 
    'argentina', 'chile', 'peru', 'venezuela', 'ecuador', 'uruguay', 
    'paraguay', 'bolivia', 'guyana', 'suriname', 'frenchGuiana',
    'india', 'singapore', 'malaysia', 'indonesia', 'philippines',
    'vietnam', 'cambodia', 'laos', 'myanmar', 'bangladesh', 'sriLanka',
    'nepal', 'bhutan', 'maldives', 'pakistan', 'afghanistan',
    'russia', 'china', 'canada', 'japan', 'germany', 
    'unitedKingdom', 'netherlands', 'sweden'
  ];
  
  // Country fallbacks in English
  const countryFallbacks: { [key: string]: string } = {
    turkey: 'Turkey',
    southKorea: 'South Korea',
    thailand: 'Thailand',
    brazil: 'Brazil',
    mexico: 'Mexico',
    colombia: 'Colombia',
    argentina: 'Argentina',
    chile: 'Chile',
    peru: 'Peru',
    venezuela: 'Venezuela',
    ecuador: 'Ecuador',
    uruguay: 'Uruguay',
    paraguay: 'Paraguay',
    bolivia: 'Bolivia',
    guyana: 'Guyana',
    suriname: 'Suriname',
    frenchGuiana: 'French Guiana',
    india: 'India',
    singapore: 'Singapore',
    malaysia: 'Malaysia',
    indonesia: 'Indonesia',
    philippines: 'Philippines',
    vietnam: 'Vietnam',
    cambodia: 'Cambodia',
    laos: 'Laos',
    myanmar: 'Myanmar',
    bangladesh: 'Bangladesh',
    sriLanka: 'Sri Lanka',
    nepal: 'Nepal',
    bhutan: 'Bhutan',
    maldives: 'Maldives',
    pakistan: 'Pakistan',
    afghanistan: 'Afghanistan',
    usa: 'United States',
    russia: 'Russian Federation',
    china: 'China',
    canada: 'Canada',
    japan: 'Japan',
    germany: 'Germany',
    unitedKingdom: 'United Kingdom',
    netherlands: 'Netherlands',
    sweden: 'Sweden'
  };
  
  // Get translated country names with fallback
  const getCountryName = (key: string) => {
    const translation = t(`countries.${key}`);
    // If translation failed (returns the key), use fallback
    if (translation === `countries.${key}`) {
      return countryFallbacks[key] || key;
    }
    return translation;
  };
  
  const countries = countryKeys.map(key => ({
    key,
    name: getCountryName(key)
  }));

  // Türkiye şehirleri (81 il)
  const turkishCities = [
    'Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın',
    'Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa',
    'Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce',
    'Edirne','Elazığ','Erzincan','Erzurum','Eskişehir',
    'Gaziantep','Giresun','Gümüşhane',
    'Hakkari','Hatay','Iğdır','Isparta','İstanbul','İzmir',
    'Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir','Kilis',
    'Kocaeli','Konya','Kütahya',
    'Malatya','Manisa','Mardin','Mersin','Muğla','Muş',
    'Nevşehir','Niğde','Ordu','Osmaniye',
    'Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak',
    'Tekirdağ','Tokat','Trabzon','Tunceli',
    'Uşak','Van',
    'Yalova','Yozgat','Zonguldak'
  ];

  const istanbulRegionCities = [
    'İstanbul','Tekirdağ','Kırklareli','Edirne','Çanakkale','Kocaeli','Sakarya'
  ];

  // City options per country (subset for UI)
  const cityOptions: Record<string, string[]> = {
    turkey: turkishCities,
    // Güney Kore için kapsamlı şehir listesi
    southKorea: [
      'Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Ulsan','Sejong',
      'Suwon','Seongnam','Goyang','Yongin','Bucheon','Ansan','Anyang','Cheongju',
      'Jeonju','Cheonan','Gimhae','Pohang','Gumi','Uijeongbu','Hwaseong','Pyeongtaek',
      'Jeju','Mokpo','Gunsan','Gwangmyeong','Yangsan','Jinju','Wonju','Chungju',
      'Sokcho','Gangneung','Paju','Gimpo','Icheon','Asan','Dangjin','Naju','Yeosu',
      'Andong','Gyeongju','Samcheok','Donghae','Taebaek','Geoje','Tongyeong','Masan',
      'Suncheon','Jeongeup','Gyeongsan','Miryang','Yeongju','Boryeong','Hongseong','Goesan'
    ],
    thailand: ['Bangkok','Chiang Mai','Phuket','Pattaya','Chiang Rai'],
    brazil: ['São Paulo','Rio de Janeiro','Brasília','Belo Horizonte','Curitiba'],
    mexico: ['Mexico City','Guadalajara','Monterrey','Puebla','Cancún'],
    colombia: ['Bogotá','Medellín','Cali','Barranquilla','Cartagena'],
    germany: ['Berlin','Munich','Hamburg','Frankfurt','Cologne'],
    // ABD için kapsamlı şehir listesi (eyalet başkentleri + büyük şehirler)
    usa: [
      // Büyük şehirler
      'New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose',
      'Austin','Jacksonville','Fort Worth','Columbus','Charlotte','San Francisco','Indianapolis','Seattle','Denver','Washington',
      'Boston','El Paso','Nashville','Detroit','Oklahoma City','Portland','Las Vegas','Memphis','Louisville','Baltimore',
      'Milwaukee','Albuquerque','Tucson','Fresno','Mesa','Sacramento','Atlanta','Kansas City','Colorado Springs','Miami',
      'Raleigh','Omaha','Long Beach','Virginia Beach','Oakland','Minneapolis','Tulsa','Arlington','Tampa','New Orleans',
      // Eyalet başkentleri (tam liste)
      'Montgomery','Juneau','Phoenix','Little Rock','Sacramento','Denver','Hartford','Dover','Tallahassee','Atlanta',
      'Honolulu','Boise','Springfield','Indianapolis','Des Moines','Topeka','Frankfort','Baton Rouge','Augusta','Annapolis',
      'Boston','Lansing','Saint Paul','Jackson','Jefferson City','Helena','Lincoln','Carson City','Concord','Trenton',
      'Santa Fe','Albany','Raleigh','Bismarck','Columbus','Oklahoma City','Salem','Harrisburg','Providence','Columbia',
      'Pierre','Nashville','Austin','Salt Lake City','Montpelier','Richmond','Olympia','Charleston','Madison','Cheyenne'
    ],
    unitedKingdom: ['London','Manchester','Birmingham','Edinburgh','Glasgow'],
    netherlands: ['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven'],
    sweden: ['Stockholm','Gothenburg','Malmö','Uppsala','Västerås'],
    canada: ['Toronto','Vancouver','Montreal','Calgary','Ottawa'],
    japan: ['Tokyo','Osaka','Yokohama','Nagoya','Sapporo'],
    russia: ['Moscow','Saint Petersburg','Novosibirsk','Yekaterinburg','Kazan'],
    china: ['Beijing','Shanghai','Guangzhou','Shenzhen','Hangzhou'],
    india: ['Delhi','Mumbai','Bengaluru','Chennai','Hyderabad'],
    malaysia: ['Kuala Lumpur','George Town','Johor Bahru','Ipoh','Kuching'],
    singapore: ['Singapore']
  };

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
      countries: countryKeys
    }));
  };

  const clearAllCountries = () => {
    setFormData(prev => ({
      ...prev,
      countries: []
    }));
  };

  const isAllSelected = formData.countries.length === countryKeys.length;

  // Submit butonunun devre dışı kalma kontrolü ve kullanıcıya ipuçları
  const isSubmitDisabled = () => {
    const isMissingCities = formData.countries.includes('turkey') && formData.citiesTR.length === 0;
    return (
      !user?.id ||
      !formData.procedure ||
      formData.countries.length === 0 ||
      !formData.age ||
      !formData.gender ||
      isMissingCities
    );
  };

  const getMissingHints = () => {
    const hints: string[] = [];
    if (!formData.procedure) hints.push(getTranslation('priceRequest.hintProcedure', 'İşlem seçin'));
    if (formData.countries.length === 0) hints.push(getTranslation('priceRequest.hintCountries', 'En az bir ülke seçin'));
    if (formData.countries.includes('turkey') && formData.citiesTR.length === 0) hints.push(getTranslation('priceRequest.hintCitiesTR', 'Türkiye için şehir seçin'));
    if (!formData.age) hints.push(getTranslation('priceRequest.hintAge', 'Yaşınızı girin'));
    if (!formData.gender) hints.push(getTranslation('priceRequest.hintGender', 'Cinsiyet seçin'));
    return hints;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    if (!user?.id) {
      setSubmitError(getTranslation('priceRequest.loginRequired', 'Talep oluşturmak için lütfen giriş yapın.'));
      setIsSubmitting(false);
      return;
    }
    
    // Photo upload removed; always submit without photos
    const photoUrls: string[] = [];
    const countriesSelected = formData.countries.map(key => countries.find(c => c.key === key)?.name || key);
    const payload = {
      user_id: user?.id,
      procedure: formData.procedure,
      description: formData.description,
      photos: photoUrls,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;

    try {
      const inserted = await requestService.createRequest(payload);
      const row = Array.isArray(inserted) ? inserted[0] : inserted;
      const newRequest = {
        id: row.id,
        procedure: row.procedure,
        status: row.status ?? 'active',
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        offersCount: 0,
        countries: countriesSelected,
        citiesTR: formData.countries.includes('turkey') ? formData.citiesTR : [],
        photos: Array.isArray(row?.photos) ? row.photos.length : photoUrls.length,
        photoUrls: Array.isArray(row?.photos) ? row.photos : photoUrls,
        offers: []
      };
      onRequestSubmitted(newRequest);

      setFormData({
        procedure: '',
        countries: [],
        citiesTR: [],
        age: '',
        gender: '',
        description: ''
      });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Talep oluşturulamadı:', err);
      // Supabase hatasında kullanıcıya görünür geri bildirim ver
      setSubmitError(getTranslation('priceRequest.submitError', 'Talep gönderilirken sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'));
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
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">



          {/* Procedure Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.procedure', 'Select Procedure')} *
            </label>
            <select
              required
              value={formData.procedure}
              onChange={(e) => setFormData(prev => ({ ...prev, procedure: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{getTranslation('priceRequest.selectProcedure', 'Select procedure')}</option>
              {treatmentAreas.map((area) => (
                <option key={area.key} value={area.name}>
                  {area.name}
                </option>
              ))}
              <option value={getTranslation('procedures.otherDental', 'Other Dental Procedures')}>{getTranslation('procedures.otherDental', 'Other Dental Procedures')}</option>
              <option value={getTranslation('procedures.otherFacial', 'Other Facial Procedures')}>{getTranslation('procedures.otherFacial', 'Other Facial Procedures')}</option>
              <option value={getTranslation('procedures.otherBody', 'Other Body Procedures')}>{getTranslation('procedures.otherBody', 'Other Body Procedures')}</option>
            </select>
          </div>

          

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
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.age', 'Age')} *
            </label>
            <input
              type="number"
              required
              min="18"
              max="80"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={getTranslation('priceRequest.agePlaceholder', 'Enter your age')}
            />
          </div>

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
              <li>{getTranslation('priceRequest.requestActive', 'Clinics can send offers as long as your request is active.')}</li>
              <li>{getTranslation('priceRequest.onlyCertified', 'Only certified and approved clinics can send offers.')}</li>
              {/* Photo storage info removed */}
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
  );
};

export default PriceRequestModal;