import React, { useState } from 'react';
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
  Clock as ClockIcon
} from 'lucide-react';
import OfferSubmissionModal from './OfferSubmissionModal';

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

  const [requests] = useState<UserRequest[]>([
    {
      id: 'req1',
      userId: 'Kullanıcı1234',
      procedure: 'Göğüs Estetiği',
      photos: [
        'https://images.pexels.com/photos/5069437/pexels-photo-5069437.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069438/pexels-photo-5069438.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069439/pexels-photo-5069439.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      countries: ['Türkiye', 'Almanya'],
      citiesTR: ['İstanbul'],
      age: 26,
      gender: 'Kadın',
      treatmentDate: '2025-02-15',
      description: 'Doğal sonuçlar arıyorum, minimal kesi tercih ediyorum',
      createdAt: new Date('2025-01-20T10:30:00'),
      status: 'new',
      offersCount: 0
    },
    {
      id: 'req2',
      userId: 'Kullanıcı2234',
      procedure: 'Saç Ekimi',
      photos: [
        'https://images.pexels.com/photos/5069440/pexels-photo-5069440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069441/pexels-photo-5069441.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      countries: ['Türkiye', 'Almanya'],
      citiesTR: ['İstanbul'],
      age: 27,
      gender: 'Erkek',
      treatmentDate: '2025-03-01',
      description: 'FUE tekniği tercih ediyorum, doğal görünüm önemli',
      createdAt: new Date('2025-01-19T15:20:00'),
      status: 'new',
      offersCount: 0
    }
  ]);

  const handleSubmitOffer = (request: UserRequest) => {
    setSelectedRequest(request);
    setIsOfferModalOpen(true);
  };

  const handlePhotoClick = (photo: string) => {
    setEnlargedPhoto(photo);
  };

  const handleClosePhotoModal = () => {
    setEnlargedPhoto(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePhotoModal();
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = currentFilterStatus === 'all' || request.status === currentFilterStatus;
    const matchesProcedure = currentFilterProcedure === 'all' || request.procedure.toLowerCase().includes(currentFilterProcedure.toLowerCase());
    const matchesSearch = searchTerm === '' || 
      request.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesProcedure && matchesSearch;
  });

  const getStatusColor = (status: string) => {
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
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Yeni';
      case 'offered':
        return 'Teklif Verildi';
      case 'expired':
        return 'Süresi Doldu';
      default:
        return 'Bilinmiyor';
    }
  };

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    offered: requests.filter(r => r.status === 'offered').length,
    highPriority: requests.filter(r => r.priority === 'high').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Talepler</h1>
            <p className="text-gray-600">Kullanıcıların estetik talep istekleri</p>
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
                <p className="text-blue-100 text-sm">Toplam Talep</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Yeni Talepler</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Teklif Verilen</p>
                <p className="text-2xl font-bold">{stats.offered}</p>
              </div>
              <Award className="w-8 h-8 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Yüksek Öncelik</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
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
                <option value="all">Tüm Durumlar</option>
                <option value="new">Yeni</option>
                <option value="offered">Teklif Verildi</option>
                <option value="expired">Süresi Doldu</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={currentFilterProcedure}
                onChange={(e) => setCurrentFilterProcedure(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm İşlemler</option>
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
              placeholder="Talep ara..."
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Talep Bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun talep bulunmuyor.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.procedure}</h3>
                      <p className="text-sm text-gray-600 mb-2">Kullanıcı: {request.userId}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{request.age} yaş, {request.gender}</span>
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
                        <span>{request.photos.length} fotoğraf</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {request.createdAt.toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  {request.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {request.photos.slice(0, 3).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Talep fotoğrafı ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handlePhotoClick(photo)}
                        />
                      ))}
                      {request.photos.length > 3 && (
                        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                          +{request.photos.length - 3} daha
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {Math.floor((Date.now() - request.createdAt.getTime()) / (1000 * 60 * 60 * 24))} gün önce
                      </span>
                    </div>
                    <button
                      onClick={() => handleSubmitOffer(request)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Teklif Ver
                    </button>
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
              alt="Büyütülmüş fotoğraf"
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

export default ClinicRequests;