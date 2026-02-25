import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { getProcedure } from '../../data/procedureCategories';
import { Save, Upload, MapPin, Phone, Mail, Globe, Award, Users, X } from 'lucide-react';
import { STORAGE_BUCKETS } from '../../config/storageBuckets';

function getSpecialtyDisplayName(key: string, t: (k: string) => string): string {
  const proc = getProcedure(key);
  if (proc) {
    const trKey = `procedureCategories.procedures.${key}`;
    const translated = t(trKey);
    return translated && translated !== trKey ? translated : proc.name;
  }
  return key;
}

async function resolveClinicId(user: any): Promise<string | null> {
  try {
    const stored = localStorage.getItem('clinic_id');
    if (stored) return stored;
  } catch {}

  const metaId = user?.user_metadata?.clinic_id;
  if (metaId) {
    try {
      localStorage.setItem('clinic_id', metaId);
    } catch {}
    return metaId;
  }

  if (user?.id) {
    const { data } = await (supabase as any).from('clinics').select('id').eq('id', user.id).maybeSingle();
    if (data?.id) {
      try {
        localStorage.setItem('clinic_id', data.id);
      } catch {}
      return data.id;
    }
  }

  if (user?.email) {
    const { data } = await (supabase as any).from('clinics').select('id').eq('email', user.email).maybeSingle();
    if (data?.id) {
      try {
        localStorage.setItem('clinic_id', data.id);
      } catch {}
      return data.id;
    }
  }

  return null;
}

const ClinicProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    branchCity: '',
    countries: [] as string[],
    citiesByCountry: {} as Record<string, string[]>,
    specialties: [] as string[],
    clinicIntro: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: '',
      tiktok: ''
    },
    doctors: [] as any[],
    photos: [] as string[],
    teamDescription: '',
    aboutUs: '',
    languages: [] as string[],
    certifications: [] as string[],
    workingHours: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [editingIntro, setEditingIntro] = useState(false);
  const [editingSocial, setEditingSocial] = useState(false);
  const [editingDoctors, setEditingDoctors] = useState(false);
  const [editingPhotos, setEditingPhotos] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<{ id: string; preview: string }[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: 'Document',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
      setDocuments(prev => [...prev, newDoc]);
    });
  };

  const handleClinicIntroSave = async () => {
    const clinicId = await resolveClinicId(user);
    if (!clinicId) return;
    try {
      await (supabase as any)
        .from('clinics')
        .update({
          clinic_intro: profileData.clinicIntro
        })
        .eq('id', clinicId);
      setEditingIntro(false);
    } catch (e) {
      console.error('Klinik tanıtımı kaydedilemedi:', e);
    }
  };

  const handleSocialMediaSave = async () => {
    const clinicId = await resolveClinicId(user);
    if (!clinicId) return;
    try {
      await (supabase as any)
        .from('clinics')
        .update({
          social_media: profileData.socialMedia
        })
        .eq('id', clinicId);
      setEditingSocial(false);
    } catch (e) {
      console.error('Sosyal medya hesapları kaydedilemedi:', e);
    }
  };

  const handleDoctorsSave = async () => {
    const clinicId = await resolveClinicId(user);
    if (!clinicId) return;
    try {
      await (supabase as any)
        .from('clinics')
        .update({
          doctors: profileData.doctors
        })
        .eq('id', clinicId);
      setEditingDoctors(false);
    } catch (e) {
      console.error('Doktorlar kaydedilemedi:', e);
    }
  };

  const handlePhotosSave = async () => {
    const clinicId = await resolveClinicId(user);
    if (!clinicId) return;
    try {
      await (supabase as any)
        .from('clinics')
        .update({
          photos: profileData.photos
        })
        .eq('id', clinicId);
      setEditingPhotos(false);
    } catch (e) {
      console.error('Fotoğraflar kaydedilemedi:', e);
    }
  };

  const handleClinicPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const clinicId = await resolveClinicId(user);
    if (!clinicId) return;

    const currentPhotos = profileData.photos || [];
    const totalCount = currentPhotos.length + uploadingPhotos.length;
    
    if (totalCount >= 10) {
      setPhotoError('Maksimum 10 fotoğraf yükleyebilirsiniz.');
      return;
    }

    const bucket = STORAGE_BUCKETS.CLINIC_PHOTOS || 'clinic-photos';
    const remainingSlots = 10 - totalCount;
    const filesToUpload = files.slice(0, remainingSlots);

    // Create previews
    const newUploads = filesToUpload.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      file
    }));

    setUploadingPhotos(prev => [...prev, ...newUploads.map(u => ({ id: u.id, preview: u.preview }))]);

    const newUrls: string[] = [];

    for (const uploadItem of newUploads) {
      const { file, id } = uploadItem;
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const path = `${clinicId}/${Date.now()}_${safeName}`; // Removed 'clinic-photos/' prefix from path as it might be redundant inside the bucket

      try {
        const { error: uploadError } = await (supabase as any).storage
          .from(bucket)
          .upload(path, file, { upsert: true });

        if (uploadError) {
          console.error('Fotoğraf yükleme hatası:', uploadError);
          throw uploadError;
        }

        const { data } = (supabase as any).storage.from(bucket).getPublicUrl(path);
        if (data?.publicUrl) {
          newUrls.push(data.publicUrl);
        }
      } catch (err: any) {
        console.error('Fotoğraf yükleme sırasında hata:', err);
        if (!photoError) {
          setPhotoError('Bazı fotoğraflar yüklenirken hata oluştu.');
        }
      } finally {
        // Remove from uploading state
        setUploadingPhotos(prev => prev.filter(p => p.id !== id));
        URL.revokeObjectURL(uploadItem.preview);
      }
    }

    if (newUrls.length > 0) {
      setProfileData(prev => {
        const updatedPhotos = [...(prev.photos || []), ...newUrls];
        
        // Otomatik kaydetme
        (async () => {
          try {
            const { error } = await (supabase as any)
              .from('clinics')
              .update({ photos: updatedPhotos })
              .eq('id', clinicId);
              
            if (error) {
              console.error('Fotoğraflar otomatik kaydedilemedi:', error);
            }
          } catch (err) {
            console.error('Otomatik kayıt hatası:', err);
          }
        })();

        return {
          ...prev,
          photos: updatedPhotos
        };
      });
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const clinicId = await resolveClinicId(user);
    
    setProfileData(prev => {
      const updatedPhotos = (prev.photos || []).filter((_, i) => i !== index);
      
      if (clinicId) {
        // Otomatik kaydetme
        (async () => {
          try {
            const { error } = await (supabase as any)
              .from('clinics')
              .update({ photos: updatedPhotos })
              .eq('id', clinicId);
              
            if (error) {
              console.error('Fotoğraf silme işlemi kaydedilemedi:', error);
            }
          } catch (err) {
            console.error('Fotoğraf silme hatası:', err);
          }
        })();
      }

      return {
        ...prev,
        photos: updatedPhotos
      };
    });
  };

  const handleAddDoctor = () => {
    setProfileData(prev => {
      const doctors = prev.doctors || [];
      if (doctors.length >= 10) {
        return prev;
      }
      return {
        ...prev,
        doctors: [
          ...doctors,
          {
            full_name: '',
            specialty: '',
            photo_url: '',
            bio: ''
          }
        ]
      };
    });
  };

  const handleDoctorChange = (index: number, field: string, value: string) => {
    setProfileData(prev => {
      const doctors = [...(prev.doctors || [])];
      if (!doctors[index]) return prev;
      doctors[index] = {
        ...doctors[index],
        [field]: value
      };
      return {
        ...prev,
        doctors
      };
    });
  };

  const handleRemoveDoctor = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      doctors: (prev.doctors || []).filter((_, i) => i !== index)
    }));
  };

  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo);
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedPhoto(null);
    }
  };

  const lang = (i18n.language || 'en') as string;

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    const storedId = localStorage.getItem('clinic_id') || (user as any)?.user_metadata?.clinic_id;
    setProfileLoading(true);
    (async () => {
      try {
        let data: any = null;
        let error: any = null;

        if (storedId) {
          const res = await (supabase as any).from('clinics').select('*').eq('id', storedId).maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (!data && user.id) {
          const res = await (supabase as any).from('clinics').select('*').eq('id', user.id).maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (!data && user.email) {
          const res = await (supabase as any).from('clinics').select('*').eq('email', user.email).maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (error && !data) {
          throw error;
        }

        if (data) {
          if (data.id) {
            try {
              localStorage.setItem('clinic_id', data.id);
            } catch {}
          }
          setProfileData(prev => ({
            ...prev,
            clinicName: data.name ?? prev.clinicName,
            address: data.address ?? prev.address,
            phone: data.phone ?? prev.phone,
            email: data.email ?? prev.email,
            website: data.website ?? prev.website,
            branchCity: data.location ?? data.branch_city ?? prev.branchCity,
            countries: Array.isArray(data.countries) ? data.countries : prev.countries,
            citiesByCountry: data.cities_by_country || prev.citiesByCountry,
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
            clinicIntro: typeof data.clinic_intro === 'string' ? data.clinic_intro : (data.description ?? prev.clinicIntro),
            socialMedia: {
              instagram: data.social_media?.instagram || prev.socialMedia.instagram,
              facebook: data.social_media?.facebook || prev.socialMedia.facebook,
              twitter: data.social_media?.twitter || prev.socialMedia.twitter,
              youtube: data.social_media?.youtube || prev.socialMedia.youtube,
              tiktok: data.social_media?.tiktok || prev.socialMedia.tiktok
            },
            doctors: Array.isArray(data.doctors) ? data.doctors : prev.doctors,
            photos: Array.isArray(data.photos) ? data.photos : prev.photos,
            aboutUs: data.description ?? prev.aboutUs,
            teamDescription: data.team_description ?? prev.teamDescription,
            languages: Array.isArray(data.languages) ? data.languages : prev.languages,
            certifications: Array.isArray(data.certifications) ? data.certifications : prev.certifications,
            workingHours: data.working_hours ?? prev.workingHours
          }));
        }
      } catch (e) {
        console.error('Profil yükleme hatası:', e);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('clinicDashboard.clinicProfile')}</h1>
          <p className="text-gray-600 mt-1">{t('clinicDashboard.viewClinicInfo')}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">BÖLÜM A - Başvurudan Gelen Bilgiler</h2>
            <p className="text-sm text-gray-500 mt-1">Bu bilgiler başvuru sırasında sağlanan verilere göre doldurulur.</p>
          </div>
          <span className="text-xs text-gray-500">
            Bu bilgileri değiştirmek için estyi@sport.com adresine mail atın.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('clinicDashboard.basicInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.clinicName')}</label>
                  <p className="text-gray-900">{profileData.clinicName}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.branchLocation')}</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{profileData.branchCity}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.phone')}</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{profileData.phone}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.email')}</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{profileData.email}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.website')}</label>
                  <p className="text-gray-900 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profileData.website}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{t('clinicDashboard.address')}</label>
                  <p className="text-gray-900 flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <span>{profileData.address}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Ülkeler</h3>
                {profileData.countries && profileData.countries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.countries.map(country => (
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
                {profileData.citiesByCountry &&
                Object.keys(profileData.citiesByCountry).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(profileData.citiesByCountry).map(([country, cities]) => (
                      <div key={country}>
                        <p className="text-xs font-medium text-gray-600 mb-1">{country}</p>
                        <div className="flex flex-wrap gap-2">
                          {(cities || []).map(city => (
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
                <h3 className="text-sm font-semibold text-gray-800 mb-2">{t('clinicDashboard.specialties')}</h3>
                {profileLoading ? (
                  <p className="text-xs text-gray-500">{t('clinicProcedures.loading')}</p>
                ) : profileData.specialties.length === 0 ? (
                  <p className="text-xs text-gray-500">{t('clinicProcedures.noSpecialtiesHint')}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map(key => (
                      <span
                        key={key}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {getSpecialtyDisplayName(key, t)}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {t('clinicDashboard.specialtiesSameAsPrices')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('clinicDashboard.quickStats')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t('clinicDashboard.profileCompletion')}</span>
                  <span className="text-green-600 font-semibold text-sm">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t('clinicDashboard.documents')}</span>
                  <span className="font-semibold text-gray-900 text-sm">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t('clinicDashboard.photos')}</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {(profileData.photos || []).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t('clinicDashboard.specialtyAreas')}</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {profileData.specialties.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('clinicDashboard.certifications')}</h3>
              <div className="space-y-3">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-700">{cert}</span>
                  </div>
                ))}
                {profileData.certifications.length === 0 && (
                  <p className="text-xs text-gray-500">Sertifika bilgisi eklenmemiş.</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">{t('clinicDashboard.languages')}</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.languages.map(language => (
                  <span
                    key={language}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs"
                  >
                    {language}
                  </span>
                ))}
                {profileData.languages.length === 0 && (
                  <p className="text-xs text-gray-500">Dil bilgisi eklenmemiş.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          BÖLÜM B - Kliniğin Düzenleyebileceği Bilgiler
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Klinik Tanıtımı</h3>
                <button
                  onClick={editingIntro ? handleClinicIntroSave : () => setEditingIntro(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {editingIntro ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>
              {editingIntro ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full min-h-[120px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={1000}
                    value={profileData.clinicIntro}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        clinicIntro: e.target.value
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {profileData.clinicIntro.length}/1000
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {profileData.clinicIntro || 'Klinik tanıtımı henüz eklenmemiş.'}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Doktorlar</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddDoctor}
                    disabled={(profileData.doctors || []).length >= 10}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    + Doktor Ekle
                  </button>
                  <button
                    onClick={editingDoctors ? handleDoctorsSave : () => setEditingDoctors(true)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {editingDoctors ? 'Kaydet' : 'Düzenle'}
                  </button>
                </div>
              </div>

              {(profileData.doctors || []).length === 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  Henüz doktor eklenmemiş. Maksimum 10 doktor ekleyebilirsiniz.
                </p>
              )}

              <div className="space-y-4">
                {(profileData.doctors || []).map((doctor: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3"
                  >
                    {editingDoctors ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Ad Soyad
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={doctor.full_name || ''}
                              onChange={e =>
                                handleDoctorChange(index, 'full_name', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Uzmanlık
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={doctor.specialty || ''}
                              onChange={e =>
                                handleDoctorChange(index, 'specialty', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Fotoğraf URL
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={doctor.photo_url || ''}
                              onChange={e =>
                                handleDoctorChange(index, 'photo_url', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Kısa Bio
                            </label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={doctor.bio || ''}
                              onChange={e =>
                                handleDoctorChange(index, 'bio', e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRemoveDoctor(index)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-3">
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Sosyal Medya Hesapları</h3>
                <button
                  onClick={editingSocial ? handleSocialMediaSave : () => setEditingSocial(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {editingSocial ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'instagram', label: 'Instagram URL' },
                  { key: 'facebook', label: 'Facebook URL' },
                  { key: 'twitter', label: 'Twitter/X URL' },
                  { key: 'youtube', label: 'YouTube URL' },
                  { key: 'tiktok', label: 'TikTok URL' }
                ].map(item => (
                  <div key={item.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {item.label}
                    </label>
                    {editingSocial ? (
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={(profileData.socialMedia as any)[item.key] || ''}
                        onChange={e =>
                          setProfileData(prev => ({
                            ...prev,
                            socialMedia: {
                              ...prev.socialMedia,
                              [item.key]: e.target.value
                            }
                          }))
                        }
                      />
                    ) : (
                      <p className="text-xs text-blue-600 break-all">
                        {(profileData.socialMedia as any)[item.key] || 'Henüz eklenmemiş'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold text-gray-900">Klinik Fotoğrafları</h3>
                <button
                  onClick={editingPhotos ? handlePhotosSave : () => setEditingPhotos(true)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {editingPhotos ? 'Kaydet' : 'Düzenle'}
                </button>
              </div>

              <div className="space-y-3">
                {editingPhotos && (
                  <div className="flex items-center justify-between gap-2">
                    <label className="inline-flex items-center px-3 py-2 rounded-lg border border-dashed border-gray-300 cursor-pointer text-xs text-gray-600 hover:bg-gray-50">
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Fotoğraf Yükle (Maks. 10)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleClinicPhotoUpload}
                      />
                    </label>
                    <span className="text-xs text-gray-500">
                      {(profileData.photos || []).length}/10 fotoğraf
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {(profileData.photos || []).map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Klinik fotoğrafı ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                      {editingPhotos && (
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black bg-opacity-60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  {uploadingPhotos.map((photo) => (
                    <div key={photo.id} className="relative group animate-pulse">
                      <img
                        src={photo.preview}
                        alt="Yükleniyor"
                        className="w-full h-24 object-cover rounded-lg opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  ))}
                  {(profileData.photos || []).length === 0 && uploadingPhotos.length === 0 && (
                    <p className="text-xs text-gray-500">
                      Henüz fotoğraf eklenmemiş. Maksimum 10 fotoğraf ekleyebilirsiniz.
                    </p>
                  )}
                </div>
                {photoError && (
                  <p className="text-xs text-red-600 mt-2">
                    {photoError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Büyütülmüş fotoğraf"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicProfile;
