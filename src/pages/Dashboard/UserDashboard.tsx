import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Clock, CheckCircle, XCircle, Camera, Settings, Eye, X, TrendingUp, Users, DollarSign, Calendar, MapPin, Star, ChevronRight, Filter, Search, AlertCircle, FileText } from 'lucide-react';
import PriceRequestModal from '../../components/Dashboard/PriceRequestModal';
import RequestDetailsModal from '../../components/Dashboard/RequestDetailsModal';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { requestService } from '../../services/api';
import { signRequestPhotoUrls } from '../../services/storage';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // Gerçek kullanıcı verileri - başlangıçta boş
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gerçek veri yükleme (Supabase API entegrasyonu)
  useEffect(() => {
    const loadUserRequests = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) {
          setRequests([]);
          return;
        }
        const userRequests = await requestService.getUserRequests(user.id);
        const mapped = (Array.isArray(userRequests) ? userRequests : []).map((r: any) => {
          // photos alanı dizi, sayı veya JSON-string olabilir; güvenli şekilde çözümle
          let photoUrlsResolved: string[] | undefined = undefined;
          const rawPhotos = r?.photos;
          if (Array.isArray(rawPhotos)) {
            photoUrlsResolved = rawPhotos as string[];
          } else if (typeof rawPhotos === 'string') {
            try {
              const parsed = JSON.parse(rawPhotos);
              if (Array.isArray(parsed)) {
                photoUrlsResolved = parsed as string[];
              }
            } catch (_) {
              // geçersiz JSON-string ise yok say
            }
          }

          return {
            id: r.id,
            procedure: r.procedure,
            status: r.status ?? 'active',
            createdAt: r.created_at ? new Date(r.created_at) : new Date(),
            offersCount: r.offersCount ?? 0,
            countries: r.countries ?? [],
            photos: photoUrlsResolved ? photoUrlsResolved.length : (typeof rawPhotos === 'number' ? rawPhotos : 0),
            photoUrls: photoUrlsResolved,
            // Sunucudan gelen kayıtlarda offers alanı olmayabilir; güvenli varsayılan ekleyelim
            offers: Array.isArray(r.offers) ? r.offers : []
          };
        });
        setRequests((prev) => {
          const combined = [...prev];
          mapped.forEach((r: any) => {
            const idx = combined.findIndex((p) => p.id === r.id);
            if (idx === -1) {
              combined.push(r);
            } else {
              const prevItem = combined[idx];
              // Undefined değerlerin mevcut bilgiyi ezmesini engelle
              const merged = { ...prevItem, ...r } as any;
              // Fotoğraf URL'leri yeni kayıtta yoksa eskileri koru
              merged.photoUrls = Array.isArray(r.photoUrls) ? r.photoUrls : prevItem.photoUrls;
              // Fotoğraf sayısını URL'lere göre senkronize et
              if (Array.isArray(merged.photoUrls)) {
                merged.photos = merged.photoUrls.length;
              } else if (typeof r.photos === 'number') {
                merged.photos = r.photos;
              } else {
                merged.photos = prevItem.photos ?? 0;
              }
              combined[idx] = merged;
            }
          });
          return combined.sort((a, b) => {
            const ad = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const bd = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return bd.getTime() - ad.getTime();
          });
        });
      } catch (error) {
        console.error('Kullanıcı talepleri yüklenirken hata:', error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserRequests();
    }
  }, [user]);

  // Fotoğraf önizlemeleri için imzalı URL kullanımı (bucket private olabilir)
  useEffect(() => {
    const signMissingPhotoUrls = async () => {
      if (!requests || requests.length === 0) return;
      const updated = await Promise.all(requests.map(async (r: any) => {
        const urls: string[] = Array.isArray(r.photoUrls) ? r.photoUrls : [];
        if (urls.length === 0) return r;
        // Zaten imzalıysa tekrar işlem yapma
        const alreadySigned = urls.some(u => u.includes('token='));
        if (alreadySigned) return r;
        try {
          const signed = await signRequestPhotoUrls(urls, 3600);
          return { ...r, photoUrls: signed };
        } catch {
          return r;
        }
      }));
      setRequests(updated);
    };
    // Uzun döngüleri engellemek için sadece liste uzunluğu değiştiğinde çalıştır
    signMissingPhotoUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests.length]);

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

  // /request/new sayfasından navigate state ile gelen yeni talebi listeye ekle
  useEffect(() => {
    const state = location.state as { newRequest?: any } | undefined;
    if (state?.newRequest) {
      setRequests(prev => [state.newRequest, ...prev]);
      // State'i temizleyerek tekrar girişte çift eklenmeyi önle
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

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
        return t('userDashboard.status.active');
      case 'closed':
        return t('userDashboard.status.closed');
      case 'cancelled':
        return t('userDashboard.status.cancelled');
      default:
        return t('userDashboard.status.unknown');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.login')}</h2>
          <p className="text-gray-600 leading-relaxed">{t('dashboard.welcome')}</p>
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
                {t('userDashboard.welcome', { name: (user as any)?.user_metadata?.name || t('userDashboard.user') })}
              </h1>
              <p className="text-lg text-gray-600 mt-2 max-w-2xl">
                {t('userDashboard.subtitle')}
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>{t('userDashboard.newRequest')}</span>
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
                <p className="text-sm font-medium text-gray-600 mb-2">{t('userDashboard.stats.totalRequests')}</p>
                <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
                <p className="text-xs text-gray-500 mt-1">{t('userDashboard.stats.allRequests')}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-2">{t('userDashboard.stats.activeRequests')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.filter(req => req.status === 'active').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t('userDashboard.stats.ongoing')}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-2">{t('userDashboard.stats.totalOffers')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.reduce((total, req) => total + req.offersCount, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t('userDashboard.stats.receivedOffers')}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-2">{t('userDashboard.stats.completed')}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.filter(req => req.status === 'closed').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t('userDashboard.stats.finished')}</p>
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
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('userDashboard.loadingTitle')}</h3>
              <p className="text-gray-600">{t('userDashboard.loadingText')}</p>
            </div>
          ) : getFilteredRequests().length === 0 ? (
            <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              {activeFilter === 'all' ? (
                <>
                  <button
                    onClick={() => {
                      // SPA içinde yönlendirerek talep oluşturmayı başlat
                      navigate('/request/new');
                    }}
                    className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-transform hover:scale-105"
                    aria-label={t('userDashboard.newRequest')}
                  >
                    <Plus className="w-12 h-12 text-white" />
                  </button>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
                    {t('userDashboard.empty.all.title')}
                  </h3>
                  <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                    {t('userDashboard.empty.all.description')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('userDashboard.empty.guide.step1.title')}</h4>
                      <p className="text-sm text-gray-600">{t('userDashboard.empty.guide.step1.desc')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('userDashboard.empty.guide.step2.title')}</h4>
                      <p className="text-sm text-gray-600">{t('userDashboard.empty.guide.step2.desc')}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('userDashboard.empty.guide.step3.title')}</h4>
                      <p className="text-sm text-gray-600">{t('userDashboard.empty.guide.step3.desc')}</p>
                    </div>
                  </div>
                  {/* CTA kaldırıldı: Artı düğmesi talep oluşturma akışını başlatıyor */}
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {activeFilter === 'active' && 'Aktif Talep Bulunamadı'}
                    {activeFilter === 'closed' && 'Tamamlanmış Talep Bulunamadı'}
                    {activeFilter === 'offers' && 'Teklif Alan Talep Bulunamadı'}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {activeFilter === 'active' && 'Henüz aktif bir talebiniz bulunmuyor.'}
                    {activeFilter === 'closed' && 'Henüz tamamlanmış bir talebiniz bulunmuyor.'}
                    {activeFilter === 'offers' && 'Henüz teklif alan bir talebiniz bulunmuyor.'}
                  </p>
                </>
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
                          <span>{request.offersCount} {t('userDashboard.offer')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Camera className="w-4 h-4 text-gray-400" />
                          <span>{request.photos} {t('userDashboard.photo')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{Array.isArray(request.countries) ? request.countries.join(', ') : (request.countries ? String(request.countries) : '')}</span>
                        </div>
                      </div>

                      {/* Photo Preview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('userDashboard.photos')}</h4>
                        <div className="flex space-x-3">
                          {(request.photoUrls ?? []).slice(0, 4).map((url, index) => (
                            <div
                              key={index}
                              className="relative group/photo overflow-hidden"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePhotoClick(url);
                              }}
                            >
                              <LazyLoadImage
                                src={url}
                                alt=""
                                effect="blur"
                                threshold={200}
                                wrapperClassName="w-20 h-20"
                                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-200 group-hover/photo:scale-105 bg-gray-100"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/photo:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center pointer-events-none">
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
                            {t('userDashboard.latestOffers')}
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
                                    <span>({offer.clinicReviews} {t('userDashboard.reviews')})</span>
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
                          title={t('userDashboard.deleteRequest')}
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
              alt={t('userDashboard.enlargedPhoto')}
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