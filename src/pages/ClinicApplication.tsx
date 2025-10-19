import React, { useEffect, useState } from 'react';
import { CheckCircle, Upload, Award, Globe, Sparkles, Heart, Star, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TREATMENT_AREAS } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { clinicApplicationService } from '../services/api';
import { useLocation } from 'react-router-dom';

const ClinicApplication: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Helper function to get translation with fallback
  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };
  
  // Get treatment areas in current language
  const getSpecialtyOptions = () => {
    const currentLang = i18n.language || 'en';
    return TREATMENT_AREAS.map(area => 
      area.name[currentLang as keyof typeof area.name] || area.name.en
    );
  };

  const specialtyOptions = getSpecialtyOptions();
  const [formData, setFormData] = useState({
    clinicName: '',
    country: '',
    specialties: [] as string[],
    website: '',
    phone: '',
    email: '',
    password: '',
    description: '',
    certificates: [] as File[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
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
          ? 'Dosya türü ve boyutu geçersiz'
          : !typeOk
          ? 'Dosya türü geçersiz'
          : 'Dosya 10MB sınırını aşıyor';
        rejected.push(`${f.name} (${reason})`);
      }
    }

    if (rejected.length) {
      alert(
        'Bazı dosyalar eklenemedi:\n' +
        rejected.join('\n') +
        '\n\nLütfen yalnızca PDF, JPG veya PNG ve en fazla 10MB ekleyin.'
      );
    }

    if (valid.length) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, ...valid]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // 1) Sertifikalar varsa önce depoya yükle (anon kullanıcılar için güncelleme RLS'inden kaçınmak amacıyla)
      let certificateUrls: string[] = [];
      if (formData.certificates.length > 0) {
        const tmpId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { uploadClinicCertificates } = await import('../services/storage');
        certificateUrls = await uploadClinicCertificates(tmpId, formData.certificates);
      }

      // 2) Başvuru kaydı oluştur (sertifika URL'leri dahil)
      await clinicApplicationService.createApplication({
        clinic_name: formData.clinicName,
        country: formData.country,
        specialties: formData.specialties,
        website: formData.website,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        description: formData.description,
        certificate_urls: certificateUrls,
        submitted_by: user?.id || null
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Başvuru gönderilirken hata:', err);
      // Supabase hata mesajını kullanıcıya daha anlaşılır ver
      const raw = err?.message || err?.error?.message || '';
      const normalized = (raw || '').toLowerCase();

      let friendly = '';
      if (normalized.includes('row-level security') || normalized.includes('rls')) {
        friendly = 'Yetki politikası nedeniyle başvuru kaydı reddedildi (RLS). Lütfen yönetici politikalarını kontrol edin.';
      } else if (normalized.includes('permission denied')) {
        friendly = 'İzin hatası oluştu. Lütfen Supabase tabloları/depoyu ve politikaları kontrol edin.';
      } else if (normalized.includes('bucket') && normalized.includes('not found')) {
        friendly = 'Depolama kovası bulunamadı. Sertifika yüklemeleri için ilgili kovayı oluşturun.';
      }

      alert(
        'Başvuru gönderilirken bir hata oluştu. ' +
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
            country: formData.country || 'Türkiye',
            specialties: formData.specialties.length ? formData.specialties : ['Hair Transplant'],
            website: formData.website || 'https://example.com',
            phone: formData.phone || '+90 212 555 0000',
            email: formData.email || 'test.clinic@example.com',
            password: formData.password || 'EstyiTemp123!',
            description: formData.description || 'Otomatik test başvurusu',
            submitted_by: user?.id || null
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

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.country', 'Country')} *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  >
                    <option value="">{getTranslation('clinicApplication.selectCountry', 'Select your country')}</option>
                    <option value="Turkey">{getTranslation('countries.turkey', 'Turkey')}</option>
                    <option value="South Korea">{getTranslation('countries.southKorea', 'South Korea')}</option>
                    <option value="Thailand">{getTranslation('countries.thailand', 'Thailand')}</option>
                    <option value="Brazil">{getTranslation('countries.brazil', 'Brazil')}</option>
                    <option value="Mexico">{getTranslation('countries.mexico', 'Mexico')}</option>
                    <option value="Colombia">{getTranslation('countries.colombia', 'Colombia')}</option>
                    <option value="Argentina">{getTranslation('countries.argentina', 'Argentina')}</option>
                    <option value="Chile">{getTranslation('countries.chile', 'Chile')}</option>
                    <option value="Peru">{getTranslation('countries.peru', 'Peru')}</option>
                    <option value="Venezuela">{getTranslation('countries.venezuela', 'Venezuela')}</option>
                    <option value="Ecuador">{getTranslation('countries.ecuador', 'Ecuador')}</option>
                    <option value="Uruguay">{getTranslation('countries.uruguay', 'Uruguay')}</option>
                    <option value="Paraguay">{getTranslation('countries.paraguay', 'Paraguay')}</option>
                    <option value="Bolivia">{getTranslation('countries.bolivia', 'Bolivia')}</option>
                    <option value="Guyana">{getTranslation('countries.guyana', 'Guyana')}</option>
                    <option value="Suriname">{getTranslation('countries.suriname', 'Suriname')}</option>
                    <option value="French Guiana">{getTranslation('countries.frenchGuiana', 'French Guiana')}</option>
                    <option value="India">{getTranslation('countries.india', 'India')}</option>
                    <option value="Singapore">{getTranslation('countries.singapore', 'Singapore')}</option>
                    <option value="Malaysia">{getTranslation('countries.malaysia', 'Malaysia')}</option>
                    <option value="Indonesia">{getTranslation('countries.indonesia', 'Indonesia')}</option>
                    <option value="Philippines">{getTranslation('countries.philippines', 'Philippines')}</option>
                    <option value="Vietnam">{getTranslation('countries.vietnam', 'Vietnam')}</option>
                    <option value="Cambodia">{getTranslation('countries.cambodia', 'Cambodia')}</option>
                    <option value="Laos">{getTranslation('countries.laos', 'Laos')}</option>
                    <option value="Myanmar">{getTranslation('countries.myanmar', 'Myanmar')}</option>
                    <option value="Bangladesh">{getTranslation('countries.bangladesh', 'Bangladesh')}</option>
                    <option value="Sri Lanka">{getTranslation('countries.sriLanka', 'Sri Lanka')}</option>
                    <option value="Nepal">{getTranslation('countries.nepal', 'Nepal')}</option>
                    <option value="Bhutan">{getTranslation('countries.bhutan', 'Bhutan')}</option>
                    <option value="Maldives">{getTranslation('countries.maldives', 'Maldives')}</option>
                    <option value="Pakistan">{getTranslation('countries.pakistan', 'Pakistan')}</option>
                    <option value="Afghanistan">{getTranslation('countries.afghanistan', 'Afghanistan')}</option>
                    <option value="United States">{getTranslation('countries.usa', 'United States')}</option>
                    <option value="Russian Federation">{getTranslation('countries.russia', 'Russian Federation')}</option>
                    <option value="China">{getTranslation('countries.china', 'China')}</option>
                    <option value="Canada">{getTranslation('countries.canada', 'Canada')}</option>
                    <option value="Japan">{getTranslation('countries.japan', 'Japan')}</option>
                    <option value="Germany">{getTranslation('countries.germany', 'Germany')}</option>
                    <option value="United Kingdom">{getTranslation('countries.unitedKingdom', 'United Kingdom')}</option>
                    <option value="Netherlands">{getTranslation('countries.netherlands', 'Netherlands')}</option>
                    <option value="Sweden">{getTranslation('countries.sweden', 'Sweden')}</option>
                  </select>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('clinicApplication.specialties', 'Specialties')} * ({getTranslation('clinicApplication.selectAll', 'Select all that apply')})
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-4 bg-white/50">
                    {specialtyOptions.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors duration-200">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTranslation('clinicApplication.selected', 'Selected')}: {formData.specialties.length} {getTranslation('clinicApplication.specialtyAreas', 'specialty areas')}
                  </p>
                </div>

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

                {/* Password */}
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
                    placeholder={getTranslation('clinicApplication.passwordPlaceholder', 'Choose a strong password')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {getTranslation('clinicApplication.passwordHint', 'Minimum 8 karakter, kolay tahmin edilemeyen bir şifre seçin')}
                  </p>
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
                      <p className="text-sm text-gray-600">
                        {formData.certificates.length} {getTranslation('clinicApplication.filesUploaded', 'files uploaded')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !formData.clinicName || !formData.country || formData.specialties.length === 0 || !formData.description || !formData.phone || !formData.email || !formData.password}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  {submitting ? getTranslation('clinicApplication.submitting', 'Submitting...') : getTranslation('clinicApplication.submitApplication', 'Submit Application')}
                </button>
                <p className="text-xs text-gray-600 mt-3 italic text-center">
                  {getTranslation('clinicApplication.loginNote', 'Onayınız geldiğinde formda belirttiğiniz e-posta ve şifreyle giriş sağlayacaksınız.')}
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