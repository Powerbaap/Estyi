import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { getProcedure } from '../../data/procedureCategories';
import { Save, Upload, MapPin, Phone, Mail, Globe, Award, Users, FileText, Camera, X } from 'lucide-react';

// Profil ve Otomatik Fiyatlar aynı kaynağı kullanır: clinics.specialties (procedure key listesi)
function getSpecialtyDisplayName(key: string, t: (k: string) => string): string {
  const proc = getProcedure(key);
  if (proc) {
    const trKey = `procedureCategories.procedures.${key}`;
    const translated = t(trKey);
    return translated && translated !== trKey ? translated : proc.name;
  }
  return key;
}

const ClinicProfile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    branchCity: '',
    specialties: [] as string[],
    teamDescription: '',
    aboutUs: '',
    languages: [] as string[],
    certifications: [] as string[],
    workingHours: ''
  });
  const [profileLoading, setProfileLoading] = useState(true);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Medical License.pdf', type: 'License', uploadDate: '2024-01-15', size: '2.3 MB' },
    { id: 2, name: 'JCI Certificate.pdf', type: 'Certificate', uploadDate: '2024-01-10', size: '1.8 MB' },
    { id: 3, name: 'ISO Certificate.pdf', type: 'Certificate', uploadDate: '2024-01-05', size: '1.2 MB' },
    { id: 4, name: 'Team Credentials.pdf', type: 'Team', uploadDate: '2024-01-01', size: '4.1 MB' }
  ]);

  const [photos, setPhotos] = useState([
    'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
  };

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const photoUrl = URL.createObjectURL(file);
      setPhotos(prev => [...prev, photoUrl]);
    });
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
    const clinicId = localStorage.getItem('clinic_id') || (user as any)?.user_metadata?.clinic_id;
    if (!clinicId) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    (async () => {
      try {
        const { data, error } = await (supabase as any).from('clinics').select('*').eq('id', clinicId).single();
        if (error) throw error;
        if (data) {
          setProfileData(prev => ({
            ...prev,
            clinicName: data.name ?? prev.clinicName,
            address: data.address ?? prev.address,
            phone: data.phone ?? prev.phone,
            email: data.email ?? prev.email,
            website: data.website ?? prev.website,
            branchCity: data.location ?? data.branch_city ?? prev.branchCity,
            specialties: Array.isArray(data.specialties) ? data.specialties : [],
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('clinicDashboard.clinicProfile')}</h1>
          <p className="text-gray-600 mt-1">{t('clinicDashboard.viewClinicInfo')}</p>
        </div>
        {/* Profil düzenleme butonu kaldırıldı - sadece admin düzenleyebilir */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.basicInfo')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.clinicName')}</label>
                <p className="text-gray-900">{profileData.clinicName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.branchLocation')}</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{profileData.branchCity}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.phone')}</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{profileData.phone}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.email')}</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{profileData.email}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.website')}</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profileData.website}
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('clinicDashboard.address')}</label>
              <p className="text-gray-900 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>{profileData.address}</span>
              </p>
            </div>
          </div>

          {/* Uzmanlık Alanları — Sabit Fiyatlar (Otomatik Fiyatlar) sadece bu listedeki işlemler için fiyat kabul eder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.specialties')}</h2>
            {profileLoading ? (
              <p className="text-gray-500 text-sm">{t('clinicProcedures.loading')}</p>
            ) : profileData.specialties.length === 0 ? (
              <p className="text-gray-500 text-sm">{t('clinicProcedures.noSpecialtiesHint')}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.specialties.map((key) => (
                  <span key={key} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {getSpecialtyDisplayName(key, t)}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-3">{t('clinicDashboard.specialtiesSameAsPrices')}</p>
          </div>

          {/* About Us */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.aboutUs')}</h2>
            <p className="text-gray-700 leading-relaxed">{profileData.aboutUs}</p>
          </div>

          {/* Team Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.medicalTeamDescription')}</h2>
            <p className="text-gray-700 leading-relaxed flex items-start space-x-2">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <span>{profileData.teamDescription}</span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.quickStats')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('clinicDashboard.profileCompletion')}</span>
                <span className="text-green-600 font-semibold">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('clinicDashboard.documents')}</span>
                <span className="font-semibold text-gray-900">{documents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('clinicDashboard.photos')}</span>
                <span className="font-semibold text-gray-900">{photos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t('clinicDashboard.specialtyAreas')}</span>
                <span className="font-semibold text-gray-900">{profileData.specialties.length}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.certifications')}</h2>
            <div className="space-y-3">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.languages')}</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((language) => (
                <span key={language} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Enlargement Modal */}
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
