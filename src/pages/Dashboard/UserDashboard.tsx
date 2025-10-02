import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Camera, Settings, Eye, X, TrendingUp, Users, DollarSign, Calendar, MapPin, Star, ChevronRight, Filter, Search } from 'lucide-react';
import PriceRequestModal from '../../components/Dashboard/PriceRequestModal';
import RequestDetailsModal from '../../components/Dashboard/RequestDetailsModal';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  const [requests, setRequests] = useState([
    {
      id: '1',
      procedure: 'Rinoplasti (Burun Estetiği)',
      status: 'active',
      createdAt: new Date('2025-01-15'),
      offersCount: 3,
      countries: ['Türkiye', 'Güney Kore'],
      photos: 5,
      photoUrls: [
        'https://images.pexels.com/photos/5069437/pexels-photo-5069437.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069438/pexels-photo-5069438.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069439/pexels-photo-5069439.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069440/pexels-photo-5069440.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069441/pexels-photo-5069441.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      offers: [
        {
          id: 'offer1',
          clinicName: 'İstanbul Estetik Merkezi',
          clinicCountry: 'Türkiye',
          clinicRating: 4.8,
          clinicReviews: 245,
          priceMin: 2500,
          priceMax: 3500,
          currency: 'USD',
          duration: '2-3 saat',
          hospitalization: '1 gece',
          description: 'Deneyimli cerrahlarımız ile doğal görünümlü burun estetiği. 15 yıllık tecrübe.',
          createdAt: new Date('2025-01-16'),
          isVerified: true
        },
        {
          id: 'offer2',
          clinicName: 'Seul Güzellik Kliniği',
          clinicCountry: 'Güney Kore',
          clinicRating: 4.9,
          clinicReviews: 189,
          priceMin: 3000,
          priceMax: 4200,
          currency: 'USD',
          duration: '3-4 saat',
          hospitalization: '2 gece',
          description: 'K-beauty teknikleri ile mükemmel sonuçlar. Uluslararası sertifikalı cerrahlar.',
          createdAt: new Date('2025-01-17'),
          isVerified: true
        },
        {
          id: 'offer3',
          clinicName: 'Antalya Tıp Merkezi',
          clinicCountry: 'Türkiye',
          clinicRating: 4.7,
          clinicReviews: 156,
          priceMin: 2200,
          priceMax: 3000,
          currency: 'USD',
          duration: '2-3 saat',
          hospitalization: '1 gece',
          description: 'Tatil ile birleştirilebilir paket seçenekleri. VIP transfer dahil.',
          createdAt: new Date('2025-01-18'),
          isVerified: true
        }
      ]
    },
    {
      id: '2',
      procedure: 'Saç Ekimi',
      status: 'closed',
      createdAt: new Date('2025-01-10'),
      offersCount: 5,
      countries: ['Türkiye', 'Tayland'],
      photos: 4,
      photoUrls: [
        'https://images.pexels.com/photos/5069437/pexels-photo-5069437.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069438/pexels-photo-5069438.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069439/pexels-photo-5069439.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5069440/pexels-photo-5069440.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      offers: [
        {
          id: 'offer4',
          clinicName: 'Hair World İstanbul',
          clinicCountry: 'Türkiye',
          clinicRating: 4.9,
          clinicReviews: 312,
          priceMin: 1800,
          priceMax: 2500,
          currency: 'USD',
          duration: '6-8 saat',
          hospitalization: '1 gece',
          description: 'FUE tekniği ile doğal saç ekimi. 10 yıllık garantili sonuç.',
          createdAt: new Date('2025-01-11'),
          isVerified: true
        },
        {
          id: 'offer5',
          clinicName: 'Bangkok Hair Clinic',
          clinicCountry: 'Tayland',
          clinicRating: 4.8,
          clinicReviews: 198,
          priceMin: 2200,
          priceMax: 3200,
          currency: 'USD',
          duration: '8-10 saat',
          hospitalization: '2 gece',
          description: 'DHI tekniği ile hassas saç ekimi. 5 yıllık bakım dahil.',
          createdAt: new Date('2025-01-12'),
          isVerified: true
        }
      ]
    }
  ]);

  const handleRequestClick = (request: any) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleRequestSubmitted = (newRequest: any) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handlePhotoClick = (photo: string) => {
    setEnlargedPhoto(photo);
  };

  const handleClosePhotoModal = () => {
    setEnlargedPhoto(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setEnlargedPhoto(null);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const getFilteredRequests = () => {
    switch (activeFilter) {
      case 'active':
        return requests.filter(req => req.status === 'active');
      case 'closed':
        return requests.filter(req => req.status === 'closed');
      case 'offers':
        return requests.filter(req => req.offersCount > 0);
      case 'all':
      default:
        return requests;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200';
      case 'closed':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'closed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapın</h2>
          <p className="text-gray-600 leading-relaxed">Dashboard'ı görüntülemek için giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Hoş Geldiniz, {user.name || 'Kullanıcı'}
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-2xl">
                Tedavi taleplerinizi yönetin, teklifleri karşılaştırın ve en uygun kliniği bulun
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Fiyat Talebi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
            }`}
            onClick={() => handleFilterClick('all')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">Toplam Talep</p>
                <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                <p className="text-xs text-gray-500 mt-1">Tüm talepleriniz</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeFilter === 'all' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200'
              }`}>
                <Camera className={`w-7 h-7 ${activeFilter === 'all' ? 'text-white' : 'text-blue-600'}`} />
              </div>
            </div>
            {activeFilter === 'all' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
            )}
          </div>

          <div 
            className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeFilter === 'active' ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-emerald-50' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-green-50'
            }`}
            onClick={() => handleFilterClick('active')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">Aktif Talepler</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.filter(req => req.status === 'active').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Devam eden işlemler</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeFilter === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200'
              }`}>
                <TrendingUp className={`w-7 h-7 ${activeFilter === 'active' ? 'text-white' : 'text-green-600'}`} />
              </div>
            </div>
            {activeFilter === 'active' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
            )}
          </div>

          <div 
            className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeFilter === 'offers' ? 'ring-2 ring-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-amber-50'
            }`}
            onClick={() => handleFilterClick('offers')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">Toplam Teklif</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.reduce((total, req) => total + req.offersCount, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Alınan teklifler</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeFilter === 'offers' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : 'bg-gradient-to-r from-amber-100 to-yellow-100 group-hover:from-amber-200 group-hover:to-yellow-200'
              }`}>
                <DollarSign className={`w-7 h-7 ${activeFilter === 'offers' ? 'text-white' : 'text-amber-600'}`} />
              </div>
            </div>
            {activeFilter === 'offers' && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 rounded-2xl"></div>
            )}
          </div>

          <div 
            className={`group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              activeFilter === 'closed' ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-50 to-violet-50' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-purple-50'
            }`}
            onClick={() => handleFilterClick('closed')}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">Tamamlanan</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.filter(req => req.status === 'closed').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Bitirilen işlemler</p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                activeFilter === 'closed' ? 'bg-gradient-to-r from-purple-500 to-violet-600' : 'bg-gradient-to-r from-purple-100 to-violet-100 group-hover:from-purple-200 group-hover:to-violet-200'
              }`}>
                <CheckCircle className={`w-7 h-7 ${activeFilter === 'closed' ? 'text-white' : 'text-purple-600'}`} />
              </div>
            </div>
            {activeFilter === 'closed' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-2xl"></div>
            )}
          </div>
        </div>



        {/* Requests List */}
        <div className="space-y-6">
          {getFilteredRequests().length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activeFilter === 'all' && 'Henüz Talep Yok'}
                {activeFilter === 'active' && 'Aktif Talep Yok'}
                {activeFilter === 'closed' && 'Tamamlanmış Talep Yok'}
                {activeFilter === 'offers' && 'Teklif Alınmış Talep Yok'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {activeFilter === 'all' && 'İlk fiyat talebinizi oluşturmak için yukarıdaki butona tıklayın.'}
                {activeFilter === 'active' && 'Aktif talepleriniz burada görünecek.'}
                {activeFilter === 'closed' && 'Tamamlanmış talepleriniz burada görünecek.'}
                {activeFilter === 'offers' && 'Teklif alınmış talepleriniz burada görünecek.'}
              </p>
              {activeFilter === 'all' && (
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>İlk Talebi Oluştur</span>
                </button>
              )}
            </div>
          ) : (
            getFilteredRequests().map((request) => (
              <div 
                key={request.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleRequestClick(request)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {request.procedure}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-2">{getStatusText(request.status)}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{request.createdAt.toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span>{request.offersCount} teklif</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Camera className="w-4 h-4 text-gray-400" />
                          <span>{request.photos} fotoğraf</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{request.countries.join(', ')}</span>
                        </div>
                      </div>

                      {/* Photo Preview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Fotoğraflar</h4>
                        <div className="flex space-x-3">
                          {request.photoUrls.slice(0, 4).map((url, index) => (
                            <div
                              key={index}
                              className="relative group/photo"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePhotoClick(url);
                              }}
                            >
                              <img
                                src={url}
                                alt={`Photo ${index + 1}`}
                                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-200 group-hover/photo:scale-105"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/photo:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                          {request.photos > 4 && (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                              <span className="text-sm font-bold text-gray-600">+{request.photos - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Offers Preview */}
                      {request.offers.length > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Star className="w-4 h-4 text-amber-500 mr-2" />
                            Son Teklifler
                          </h4>
                          <div className="space-y-3">
                            {request.offers.slice(0, 2).map((offer) => (
                              <div key={offer.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-gray-900 truncate">{offer.clinicName}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">({offer.clinicCountry})</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                                    <span className="flex items-center">
                                      <Star className="w-3 h-3 text-amber-500 mr-1" />
                                      {offer.clinicRating}
                                    </span>
                                    <span>({offer.clinicReviews} değerlendirme)</span>
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                  <div className="text-lg font-bold text-gray-900">${offer.priceMin.toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">- ${offer.priceMax.toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      {request.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(request.id);
                          }}
                          className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors group/delete"
                          title="Talebi Sil"
                        >
                          <XCircle className="w-4 h-4 text-red-500 group-hover/delete:text-red-600 transition-colors" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <PriceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSubmitted={handleRequestSubmitted}
      />

      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
      />

      {/* Photo Enlargement Modal */}
      {enlargedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={handleClosePhotoModal}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-2xl transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <img
              src={enlargedPhoto}
              alt="Büyütülmüş fotoğraf"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;