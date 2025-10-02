import React, { useState } from 'react';
import { CheckCircle, Upload, Award, Globe, Sparkles, Heart, Star, Shield } from 'lucide-react';

const ClinicApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    clinicName: '',
    country: '',
    specialties: [] as string[],
    website: '',
    description: '',
    certificates: [] as File[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const specialtyOptions = [
    'Abdominoplasti (Karın Germe)',
    'Akne Tedavisi',
    'Anti-Aging Uygulamaları',
    'Bacak Estetiği',
    'Basen Estetiği',
    'Botoks',
    'Boy Uzatma Ameliyatı',
    'Burun Estetiği (Rinoplasti)',
    'Çene Estetiği',
    'Cilt Gençleştirme (Mezoterapi, PRP vb.)',
    'Diş Beyazlatma',
    'Diş İmplantı',
    'Dudak Dolgusu',
    'El Gençleştirme',
    'Göz Altı Işık Dolgusu',
    'Göz Kapağı Estetiği (Blefaroplasti)',
    'Göğüs Büyütme',
    'Göğüs Dikleştirme',
    'Göğüs Küçültme',
    'Kalça Şekillendirme / BBL (Popo Kaldırma)',
    'Karbon Peeling',
    'Kol Germe',
    'Kombine Estetik Paketleri (Full Body Makeover)',
    'Liposuction (Yağ Aldırma)',
    'Lüks Medikal Spa Tedavileri',
    'Meme Ucu Estetiği',
    'Saç Ekimi',
    'Sakal Ekimi',
    'Yüz Germe (Facelift)',
    'Yüz Şekillendirme (Dolgu / Jawline)',
    'Vajinal Estetik (Genital Estetik)',
    'Penis Kalınlaştırma Dolgusu (Penil Filler)',
    'Penis Uzatma Operasyonları',
    'Vücut Şekillendirme (HD Liposuction, Six-Pack Abdominal Etching)'
  ];

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
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ...files]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Clinic application submitted:', formData);
    setIsSubmitted(true);
  };

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
              Başvuru Gönderildi!
            </h2>
            <p className="text-gray-600 mb-6">
              Başvurunuz başarıyla alındı. En kısa sürede size geri dönüş yapacağız.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              Ana Sayfaya Dön
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
              Klinik Başvuru Formu
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sertifikalı estetik kliniklerinin global ağımıza katılın ve dünya çapındaki hastalarla bağlantı kurun
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
                    Klinik Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clinicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="Klinik adınızı girin"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ülke *
                  </label>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  >
                    <option value="">Ülkenizi seçin</option>
                    <option value="Turkey">Turkey</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Germany">Germany</option>
                    <option value="Poland">Poland</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="India">India</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uzmanlık Alanları * (Tümünü seçin)
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
                    Seçilen: {formData.specialties.length} uzmanlık alanı
                  </p>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Web Sitesi
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="https://klinik-web-siteniz.com"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Klinik Açıklaması *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder="Klinik hakkında, hizmetleriniz, deneyiminiz ve sizi özel kılan şeyler hakkında açıklama yazın..."
                  />
                </div>

                {/* Certificates Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sertifikalar & Lisanslar *
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
                      <span className="text-sm text-gray-600">Sertifika ve lisansları yükleyin</span>
                      <span className="text-xs text-gray-500">PDF, JPG, PNG - her dosya maksimum 10MB</span>
                    </label>
                  </div>
                  {formData.certificates.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        {formData.certificates.length} dosya yüklendi
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.clinicName || !formData.country || formData.specialties.length === 0 || !formData.description}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg transform hover:scale-105"
                >
                  Başvuruyu Gönder
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>Neden Estyi'ye Katılmalısınız?</span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span>Global hasta ağına erişim</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Doğrulanmış klinik sertifikasyonu</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span>Güvenli ödeme işlemi</span>
                </li>
              </ul>
            </div>

            {/* Process */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-200/50">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span>Başvuru Süreci</span>
              </h3>
              <div className="space-y-3 text-sm text-purple-800">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Başvuru gönder</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>İnceleme & doğrulama (2-5 gün)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Sözleşme imzalama</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Platform erişimi verildi</span>
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