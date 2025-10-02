import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Upload, MapPin, Phone, Mail, Globe, Award, Users, FileText, Camera, X } from 'lucide-react';

const ClinicProfile: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    clinicName: 'Istanbul Aesthetic Center',
    address: 'Nişantaşı, Teşvikiye Cd. No:123, 34365 Şişli/İstanbul',
    phone: '+90 212 555 0123',
    email: 'info@istanbulaesthetic.com',
    website: 'https://www.istanbulaesthetic.com',
    branchCity: 'İstanbul',
    specialties: ['Rhinoplasty', 'Hair Transplant', 'Breast Surgery', 'Face Lift'],
    teamDescription: 'Our experienced team of 15+ medical professionals has been serving international patients for over 10 years.',
    aboutUs: 'Istanbul Aesthetic Center is a leading medical tourism destination specializing in cosmetic and reconstructive surgery. We combine advanced medical technology with Turkish hospitality to provide world-class care.',
    languages: ['Turkish', 'English', 'Arabic', 'Russian'],
    certifications: ['JCI Accredited', 'ISO 9001:2015', 'Turkish Ministry of Health'],
    workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM'
  });

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
    console.log('Saving profile:', profileData);
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

  const specialtyOptions = [
    'Rhinoplasty', 'Hair Transplant', 'Breast Surgery', 'Face Lift', 'Liposuction',
    'Tummy Tuck', 'Botox & Fillers', 'Dental Surgery', 'Eye Surgery', 'Body Contouring'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik Profili</h1>
          <p className="text-gray-600 mt-1">Klinik bilgilerinizi görüntüleyin</p>
        </div>
        {/* Profil düzenleme butonu kaldırıldı - sadece admin düzenleyebilir */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Klinik Adı</label>
                <p className="text-gray-900">{profileData.clinicName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şubenin Bulunduğu İl</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{profileData.branchCity}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{profileData.phone}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{profileData.email}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Web Sitesi</label>
                <p className="text-gray-900 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profileData.website}
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
              <p className="text-gray-900 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>{profileData.address}</span>
              </p>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.specialties.map((specialty) => (
                <span key={specialty} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hakkımızda</h2>
            <p className="text-gray-700 leading-relaxed">{profileData.aboutUs}</p>
          </div>

          {/* Team Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tıbbi Ekip Açıklaması</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İstatistikler</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profil Tamamlanma</span>
                <span className="text-green-600 font-semibold">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Belgeler</span>
                <span className="font-semibold text-gray-900">{documents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fotoğraflar</span>
                <span className="font-semibold text-gray-900">{photos.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uzmanlık Alanları</span>
                <span className="font-semibold text-gray-900">{profileData.specialties.length}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sertifikalar</h2>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Diller</h2>
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