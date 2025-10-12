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
import { uploadRequestPhotos } from '../../services/storage';
// Photo upload restored as optional

const PriceRequestModal: React.FC<PriceRequestModalProps> = ({ isOpen, onClose, onRequestSubmitted }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

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
    treatmentDate: '',
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
    'turkey', 'southKorea', 'thailand', 'brazil', 'mexico', 'colombia', 
    'argentina', 'chile', 'peru', 'venezuela', 'ecuador', 'uruguay', 
    'paraguay', 'bolivia', 'guyana', 'suriname', 'frenchGuiana',
    'india', 'singapore', 'malaysia', 'indonesia', 'philippines',
    'vietnam', 'cambodia', 'laos', 'myanmar', 'bangladesh', 'sriLanka',
    'nepal', 'bhutan', 'maldives', 'pakistan', 'afghanistan',
    'usa', 'russia', 'china', 'canada', 'japan', 'germany', 
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

  // Photo upload handlers removed

  const toggleCountry = (countryKey: string) => {
    setFormData(prev => ({
      ...prev,
      countries: prev.countries.includes(countryKey)
        ? prev.countries.filter(c => c !== countryKey)
        : [...prev.countries, countryKey]
    }));
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
    
    // Optional photo upload
    let photoUrls: string[] = [];
    try {
      if (photoFiles.length > 0) {
        photoUrls = await uploadRequestPhotos(user.id, photoFiles);
      }
    } catch (err: any) {
      setSubmitError(getTranslation('priceRequest.photoUploadFailed', 'Fotoğraflar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'));
      setIsSubmitting(false);
      return;
    }
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
        photos: photoUrls.length,
        photoUrls: photoUrls,
        offers: []
      };
      onRequestSubmitted(newRequest);

      setFormData({
        procedure: '',
        countries: [],
        citiesTR: [],
        age: '',
        gender: '',
        treatmentDate: '',
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
          {/* Optional Photo Upload - moved to top */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.uploadPhotos', 'Fotoğraf Yükle')} ({getTranslation('priceRequest.optional', 'Opsiyonel')})
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              {getTranslation('priceRequest.photoNoteAccurate', 'Fotoğraf yüklerseniz daha doğru fiyatlar ile karşılaşırsınız.')}
            </p>
            {photoFiles.length > 0 && (
              <>
                <p className="text-xs text-gray-600 mt-1">
                  {getTranslation('priceRequest.selectedFiles', 'Seçilen dosya sayısı')}: {photoFiles.length}
                </p>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photoFiles.map((file, idx) => {
                    const src = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative w-full rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-24 w-full object-cover"
                          onLoad={() => URL.revokeObjectURL(src)}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

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

          {/* Treatment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getTranslation('priceRequest.treatmentDate', 'Treatment Date')} *
            </label>
            <input
              type="date"
              required
              value={formData.treatmentDate}
              onChange={(e) => setFormData(prev => ({ ...prev, treatmentDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={getTranslation('priceRequest.treatmentDatePlaceholder', 'Select treatment date')}
            />
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