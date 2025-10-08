import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  MapPin, 
  Calendar, 
  User, 
  Camera, 
  DollarSign, 
  Clock, 
  FileText, 
  X, 
  Filter,
  Search,
  Star,
  Award,
  TrendingUp,
  Users,
  Clock as ClockIcon,
  AlertCircle
} from 'lucide-react';
import OfferSubmissionModal from './OfferSubmissionModal';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { requestService } from '../../services/api';

interface UserRequest {
  id: string;
  userId: string;
  procedure: string;
  photos: string[];
  countries: string[];
  citiesTR?: string[]; // Kullanıcının seçtiği Türkiye şehirleri
  age: number;
  gender: string;
  treatmentDate: string;
  description: string;
  status: 'new' | 'offered' | 'expired';
  createdAt: Date;
  offersCount: number;
}

interface ClinicRequestsProps {
  filterStatus?: string;
  filterProcedure?: string;
  clinicSpecialties?: string[];
  clinicBranchCity?: string; // Şubenin bulunduğu il
}

const ClinicRequests: React.FC<ClinicRequestsProps> = ({ 
  filterStatus = 'all', 
  filterProcedure = 'all',
  clinicSpecialties = [
    'Rhinoplasty', 
    'Hair Transplant', 
    'Breast Surgery',
    'El Tırnak İşlemleri',
    'Saç Boyama',
    'Protez Saç',
    'Diğer Saç İşlemleri'
  ],
  clinicBranchCity = 'İstanbul'
}) => {
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [currentFilterStatus, setCurrentFilterStatus] = useState(filterStatus);
  const [currentFilterProcedure, setCurrentFilterProcedure] = useState(filterProcedure);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // API'den gelen verileri tutacak state
  const [requests, setRequests] = useState<UserRequest[]>([
    {
      id: 'req1',
      userId: 'Kullanıcı1234',
      procedure: t('procedures.breastSurgery'),
      photos: [
        'https://images.pexels.com/photos/5069437/pexels-photo-5069437.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069438/pexels-photo-5069438.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069439/pexels-photo-5069439.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      countries: ['Türkiye', 'Almanya'],
      citiesTR: ['İstanbul'],
      age: 26,
      gender: t('genders.female'),
      treatmentDate: '2025-02-15',
      description: 'Doğal sonuçlar arıyorum, minimal kesi tercih ediyorum',
      createdAt: new Date('2025-01-20T10:30:00'),
      status: 'new',
      offersCount: 0
    },
    {
      id: 'req2',
      userId: 'Kullanıcı2234',
      procedure: t('procedures.hairTransplant'),
      photos: [
        'https://images.pexels.com/photos/5069440/pexels-photo-5069440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069441/pexels-photo-5069441.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      countries: [t('countries.turkey'), t('countries.germany')],
      citiesTR: [t('cities.istanbul')],
      age: 27,
      gender: t('genders.male'),
      treatmentDate: '2025-03-01',
      description: 'FUE tekniği tercih ediyorum, doğal görünüm önemli',
      createdAt: new Date('2025-01-19T15:20:00'),
      status: 'new',
      offersCount: 0
    }
  ]);

  const handleSubmitOffer = useCallback((request: UserRequest) => {
    setSelectedRequest(request);
    setIsOfferModalOpen(true);
  }, []);

  const handlePhotoClick = useCallback((photo: string) => {
    setEnlargedPhoto(photo);
  }, []);

  const handleClosePhotoModal = useCallback(() => {
    setEnlargedPhoto(null);
  }, []);

  const handleModalBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePhotoModal();
    }
  }, [handleClosePhotoModal]);

  // Filtreleme işlemleri
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Status filtresi
      if (currentFilterStatus !== 'all' && request.status !== currentFilterStatus) {
        return false;
      }
      
      // Prosedür filtresi
      if (currentFilterProcedure !== 'all' && !request.procedure.toLowerCase().includes(currentFilterProcedure.toLowerCase())) {
        return false;
      }
      
      // Klinik uzmanlık alanı filtresi
      if (clinicSpecialties.length > 0 && !clinicSpecialties.includes(request.procedure)) {
        return false;
      }
      
      // Şehir filtresi - Klinik şubesi ile aynı şehirdeki talepler
      if (clinicBranchCity && request.citiesTR && !request.citiesTR.includes(clinicBranchCity)) {
        return false;
      }
      
      // Arama filtresi
      if (searchTerm && !(
        request.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userId.toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      return true;
    });
  }, [requests, currentFilterStatus, currentFilterProcedure, clinicSpecialties, clinicBranchCity, searchTerm]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'offered':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'new':
        return t('clinicRequests.status.new');
      case 'offered':
        return t('clinicRequests.status.offered');
      case 'expired':
        return t('clinicRequests.status.expired');
      default:
        return t('clinicRequests.status.unknown');
    }
  }, [t]);

  const stats = useMemo(() => ({
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    offered: requests.filter(r => r.status === 'offered').length,
    expired: requests.filter(r => r.status === 'expired').length
  }), [requests]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('clinicRequests.title')}</h1>
            <p className="text-gray-600">{t('clinicRequests.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <div className="w-4 h-4 flex flex-col space-y-0.5">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">{t('clinicRequests.stats.total')}</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">{t('clinicRequests.stats.newRequests')}</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">{t('clinicRequests.stats.offeredRequests')}</p>
                <p className="text-2xl font-bold">{stats.offered}</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">{t('clinicRequests.stats.expiredRequests')}</p>
                <p className="text-2xl font-bold">{stats.expired}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={currentFilterStatus}
                onChange={(e) => setCurrentFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('clinicRequests.filter.allStatuses')}</option>
                <option value="new">{t('clinicRequests.status.new')}</option>
                <option value="offered">{t('clinicRequests.status.offered')}</option>
                <option value="expired">{t('clinicRequests.status.expired')}</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={currentFilterProcedure}
                onChange={(e) => setCurrentFilterProcedure(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('clinicRequests.filter.allProcedures')}</option>
                {clinicSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder={t('clinicRequests.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Requests Grid/List */}
      <div className="p-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('clinicRequests.noRequests')}</h3>
            <p className="text-gray-500">{t('clinicRequests.noRequestsDesc')}</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.procedure}</h3>
                      <p className="text-sm text-gray-600 mb-2">{t('clinicRequests.user')}: {request.userId}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{request.age} {t('clinicRequests.age')}, {request.gender}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.treatmentDate).toLocaleDateString('tr-TR')}</span>
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{request.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.countries.join(', ')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Camera className="w-4 h-4" />
                        <span>{request.photos.length} {t('clinicRequests.photos')}</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {request.createdAt.toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {request.photos.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {request.photos.slice(0, 3).map((photo, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg bg-gray-100">
                            <LazyLoadImage
                              src={photo}
                              alt=""
                              effect="blur"
                              className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handlePhotoClick(photo)}
                              wrapperClassName="w-full h-24"
                              threshold={300}
                            />
                          </div>
                        ))}
                        {request.photos.length > 3 && (
                          <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                            +{request.photos.length - 3} {t('clinicRequests.more')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {Math.floor((Date.now() - request.createdAt.getTime()) / (1000 * 60 * 60 * 24))} {t('clinicRequests.daysAgo')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSubmitOffer(request)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        {t('clinicRequests.submitOffer')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {enlargedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={handleClosePhotoModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={enlargedPhoto}
              alt={t('clinicRequests.enlargedPhoto')}
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && selectedRequest && (
        <OfferSubmissionModal
          isOpen={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default React.memo(ClinicRequests);