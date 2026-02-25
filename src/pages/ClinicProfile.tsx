import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const formatSpecialty = (text: string) => {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ClinicProfile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clinicId } = useParams<{ clinicId: string }>();
  const [clinicData, setClinicData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) {
      setLoading(false);
      return;
    }
    let active = true;
    const loadClinic = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('clinics')
          .select('*')
          .eq('id', clinicId)
          .single();
        if (!active) return;
        if (error) {
          console.error('Klinik profili yüklenemedi:', error);
          setClinicData(null);
        } else {
          setClinicData(data);
        }
      } catch (e) {
        if (!active) return;
        console.error('Klinik profili yüklenirken hata oluştu:', e);
        setClinicData(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadClinic();
    return () => {
      active = false;
    };
  }, [clinicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!clinicData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-600">Klinik profili bulunamadı.</p>
        </div>
      </div>
    );
  }

  const countries = Array.isArray(clinicData.countries) ? clinicData.countries : [];
  const citiesByCountry = clinicData.cities_by_country || {};
  const specialties = Array.isArray(clinicData.specialties) ? clinicData.specialties : [];
  const doctors = Array.isArray(clinicData.doctors) ? clinicData.doctors : [];
  const photos = Array.isArray(clinicData.photos) ? clinicData.photos : [];
  const socialMedia = clinicData.social_media || {};

  const isOwner = user && clinicData && (user.id === clinicData.user_id || user.email === clinicData.email);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  {clinicData.name?.charAt(0) || '?'}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{clinicData.name}</h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{clinicData.location}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {isOwner && (
                    <span className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{clinicData.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{clinicData.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <a
                      href={clinicData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {clinicData.website}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">BÖLÜM A - Başvurudan Gelen Bilgiler</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bu bilgiler başvuru sırasında sağlanan verilere göre doldurulur.
                </p>
              </div>
              <span className="text-xs text-gray-500">
                Bu bilgileri değiştirmek için estyi@sport.com adresine mail atın.
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Temel Bilgiler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Klinik Adı</p>
                      <p className="text-gray-900">{clinicData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Konum</p>
                      <p className="text-gray-900 flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{clinicData.location}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Web Sitesi</p>
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={clinicData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {clinicData.website}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Ülkeler</h3>
                    {countries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {countries.map((country: string) => (
                          <span
                            key={country}
                            className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {country}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Ülke bilgisi henüz eklenmemiş.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Şehirler</h3>
                    {citiesByCountry && Object.keys(citiesByCountry).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(citiesByCountry).map(([country, cities]) => (
                          <div key={country}>
                            <p className="text-xs font-medium text-gray-600 mb-1">{country}</p>
                            <div className="flex flex-wrap gap-2">
                              {(cities as string[]).map(city => (
                                <span
                                  key={city}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs"
                                >
                                  {city}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Şehir bilgisi henüz eklenmemiş.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Uzmanlık Alanları</h3>
                    {specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((specialty: string) => (
                          <span
                            key={specialty}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {formatSpecialty(specialty)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Uzmanlık alanı bilgisi henüz eklenmemiş.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">İletişim</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {isOwner && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{clinicData.phone}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{clinicData.email}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Sosyal Medya</h3>
                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'instagram', label: 'Instagram' },
                      { key: 'facebook', label: 'Facebook' },
                      { key: 'twitter', label: 'Twitter/X' },
                      { key: 'youtube', label: 'YouTube' },
                      { key: 'tiktok', label: 'TikTok' }
                    ].map(item => {
                      const value = socialMedia[item.key] as string | undefined;
                      return (
                        <div key={item.key} className="flex items-center gap-2">
                          <span className="w-24 text-gray-600">{item.label}</span>
                          {value ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {value}
                            </a>
                          ) : (
                            <span className="text-gray-400">Henüz eklenmemiş</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Klinik Tanıtımı</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {clinicData.clinic_intro ||
                    clinicData.description ||
                    'Klinik tanıtımı henüz eklenmemiş.'}
                </p>
                <div className="flex items-start space-x-2">
                  <Users className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-gray-700">
                    {clinicData.team_description || 'Doktor ekibi hakkında bilgi henüz eklenmemiş.'}
                  </p>
                </div>
              </div>

              {doctors.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Doktorlar</h2>
                  <div className="space-y-4">
                    {doctors.map((doctor: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 border border-gray-100 rounded-lg p-3"
                      >
                        {doctor.photo_url && (
                          <img
                            src={doctor.photo_url}
                            alt={doctor.full_name || 'Doktor'}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {doctor.full_name || 'İsimsiz Doktor'}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            {doctor.specialty || 'Uzmanlık bilgisi yok'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doctor.bio || 'Kısa biyografi eklenmemiş.'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Klinik Fotoğrafları</h3>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((photo: string, index: number) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Klinik fotoğrafı ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Henüz klinik fotoğrafı eklenmemiş.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile;
