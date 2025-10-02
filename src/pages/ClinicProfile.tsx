import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe, Award, Users, Clock, DollarSign } from 'lucide-react';

interface ClinicProfileProps {
  clinicName?: string;
  clinicCountry?: string;
}

const ClinicProfile: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState<any>(null);

  // Location state'den veya props'tan klinik bilgilerini al
  const clinicName = location.state?.clinicName || 'İstanbul Estetik Merkezi';
  const clinicCountry = location.state?.clinicCountry || 'Türkiye';

  useEffect(() => {
    // Mock klinik verisi
    setClinicData({
      name: clinicName,
      country: clinicCountry,
      rating: 4.8,
      reviews: 245,
      phone: '+90 212 555 0123',
      email: 'info@istanbulestetik.com',
      website: 'www.istanbulestetik.com',
      specialties: ['Rhinoplasty', 'Hair Transplant', 'Breast Surgery', 'Face Lift'],
      description: '15 yıllık deneyimimizle İstanbul\'da estetik cerrahi alanında hizmet veriyoruz. Uluslararası standartlarda tedavi ve hasta memnuniyeti odaklı yaklaşımımızla binlerce başarılı operasyon gerçekleştirdik.',
      team: 'Deneyimli cerrahlarımız ve uzman ekibimizle en güncel teknikleri kullanarak doğal ve estetik sonuçlar elde ediyoruz.',
      photos: [
        'https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3376791/pexels-photo-3376791.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/3376792/pexels-photo-3376792.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      procedures: [
        {
          name: 'Rhinoplasty',
          price: '2500 - 3500 USD',
          duration: '2-3 saat',
          recovery: '1-2 hafta'
        },
        {
          name: 'Hair Transplant',
          price: '1500 - 2500 USD',
          duration: '4-6 saat',
          recovery: '2-3 hafta'
        },
        {
          name: 'Breast Surgery',
          price: '3000 - 5000 USD',
          duration: '3-4 saat',
          recovery: '2-4 hafta'
        }
      ]
    });
  }, [clinicName, clinicCountry]);

  if (!clinicData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {clinicData.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{clinicData.name}</h1>
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{clinicData.country}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{clinicData.rating} ({clinicData.reviews} değerlendirme)</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{clinicData.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{clinicData.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{clinicData.website}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hakkında</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{clinicData.description}</p>
              <div className="flex items-start space-x-2">
                <Users className="w-5 h-5 text-gray-500 mt-1" />
                <p className="text-gray-700">{clinicData.team}</p>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h2>
              <div className="flex flex-wrap gap-2">
                {clinicData.specialties.map((specialty: string) => (
                  <span key={specialty} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Procedures */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">İşlemler ve Fiyatlar</h2>
              <div className="space-y-4">
                {clinicData.procedures.map((procedure: any) => (
                  <div key={procedure.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{procedure.name}</h3>
                      <span className="text-green-600 font-semibold">{procedure.price}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{procedure.duration}</span>
                      </span>
                      <span>İyileşme: {procedure.recovery}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Ara</span>
                </button>
                <button 
                  onClick={() => navigate('/messages', { 
                    state: { 
                      selectedClinic: clinicData.name,
                      messageType: 'clinic_contact'
                    } 
                  })}
                  className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Mail className="w-4 h-4" />
                  <span>Mesaj Gönder</span>
                </button>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Klinik Fotoğrafları</h3>
              <div className="grid grid-cols-2 gap-2">
                {clinicData.photos.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Klinik fotoğrafı ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile; 