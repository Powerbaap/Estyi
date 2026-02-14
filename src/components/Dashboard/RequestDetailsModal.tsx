import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Clock, DollarSign, MessageCircle, Star, Award, Calendar, Eye } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { signRequestPhotoUrls } from '../../services/storage';

interface Offer {
  id: string;
  clinicName: string;
  clinicCountry: string;
  clinicRating: number;
  clinicReviews: number;
  priceMin: number;
  priceMax: number;
  currency: string;
  duration: string;
  hospitalization: string;
  description: string;
  createdAt: Date;
  isVerified: boolean;
}

interface Request {
  id: string;
  procedure: string;
  status: string;
  createdAt: Date;
  offersCount: number;
  countries: string[];
  photos: number;
  offers: Offer[];
  photoUrls?: string[];
}

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, onClose, request }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [offerStatuses, setOfferStatuses] = React.useState<{[key: string]: 'pending' | 'accepted' | 'rejected'}>({});
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [displayPhotoUrls, setDisplayPhotoUrls] = useState<string[]>([]);
  const [photoLoadError, setPhotoLoadError] = useState<boolean>(false);
  const [failedPhotos, setFailedPhotos] = useState<Record<number, boolean>>({});

  const handleImageError = (idx: number) => {
    setPhotoLoadError(true);
    setFailedPhotos(prev => ({ ...prev, [idx]: true }));
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setPhotoLoadError(false);
      setFailedPhotos({});
      const urls = Array.isArray(request?.photoUrls) ? request!.photoUrls! : [];
      if (urls.length === 0) {
        setDisplayPhotoUrls([]);
        return;
      }
      try {
        const signed = await signRequestPhotoUrls(urls, 3600);
        if (!cancelled) setDisplayPhotoUrls(signed);
      } catch {
        if (!cancelled) setPhotoLoadError(true);
        if (!cancelled) setDisplayPhotoUrls(urls);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [request?.photoUrls]);

  const handleContactClinic = (clinicName: string) => {
    // Mesaj bölümüne yönlendir
    navigate('/messages', { 
      state: { 
        selectedClinic: clinicName,
        messageType: 'clinic_contact'
      } 
    });
    onClose();
  };

  const handleAcceptOffer = async (offerId: string, clinicName: string) => {
    setIsProcessing(offerId);
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOfferStatuses(prev => ({ ...prev, [offerId]: 'accepted' }));
      
      // Estyi: Teklif kabul edilince konuşma (chat) açılır
      navigate('/messages', { 
        state: { 
          selectedClinic: clinicName,
          messageType: 'clinic_contact',
          offerAccepted: true
        } 
      });
      onClose();
    } catch (error) {
      alert(t('auth.acceptError'));
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectOffer = async (offerId: string, clinicName: string) => {
    setIsProcessing(offerId);
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOfferStatuses(prev => ({ ...prev, [offerId]: 'rejected' }));
      
      // Kliniğe bildirim gönder
      
      // Başarı mesajı göster
      alert(t('auth.rejectSuccess', { clinicName }));
      
    } catch (error) {
      alert(t('auth.rejectError'));
    } finally {
      setIsProcessing(null);
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
        return t('requestDetails.status.active');
      case 'closed':
        return t('requestDetails.status.closed');
      case 'cancelled':
        return t('requestDetails.status.cancelled');
      default:
        return t('requestDetails.status.unknown');
    }
  };

  const safeFormatDateTR = (value: any): string => {
    try {
      if (!value) return '';
      let d: Date;
      if (value instanceof Date) {
        d = value as Date;
      } else if (typeof value === 'string') {
        const s = value.trim();
        const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (m) {
          const day = parseInt(m[1], 10);
          const month = parseInt(m[2], 10) - 1;
          const year = parseInt(m[3], 10);
          d = new Date(year, month, day);
        } else {
          d = new Date(s);
        }
      } else if (typeof value === 'number') {
        d = new Date(value);
      } else {
        d = new Date(value);
      }
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('tr-TR');
    } catch {
      return '';
    }
  }; 
 
  // Modal kapalıyken veya request yokken render etme
  if (!isOpen || !request) return null;
 
   return (
     <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-8 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                {request.procedure}
              </h2>
              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center space-x-2 flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>{safeFormatDateTR(request.createdAt)}</span>
                </span>
                <span className="flex items-center space-x-2 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{Array.isArray(request.countries) ? request.countries.join(', ') : (request.countries ? String(request.countries) : '')}</span>
                </span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-4"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{request.offersCount}</div>
                  <div className="text-sm text-blue-700 font-medium">{t('requestDetails.offersReceived')}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{Array.isArray(request.countries) ? request.countries.length : (typeof (request as any).countries === 'string' && (request as any).countries.trim().length > 0 ? (request as any).countries.split(',').filter((c: string) => c.trim().length > 0).length : 0)}</div>
                  <div className="text-sm text-purple-700 font-medium">{t('requestDetails.countries')}</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600">{request.photos}</div>
                  <div className="text-sm text-pink-700 font-medium">{t('requestDetails.photos')}</div>
                </div>
              </div>
            </div>

            {/* Offers */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Star className="w-5 h-5 text-amber-500 mr-2" />
                {t('requestDetails.receivedOffers')} ({request.offersCount})
              </h3>
              {(!Array.isArray(request.offers) || request.offers.length === 0) ? (
                <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">{t('requestDetails.noOffersYet')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(Array.isArray(request.offers) ? request.offers : []).map((offer) => (
                    <div
                      key={offer.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-white group"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-white font-bold text-xl">
                              {String(offer.clinicName ?? 'K').charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 
                                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
                                onClick={() => {
                                  navigate('/clinic-profile', { 
                                    state: { 
                                      clinicName: offer.clinicName,
                                      clinicCountry: offer.clinicCountry
                                    } 
                                  });
                                  onClose();
                                }}
                              >
                                {offer.clinicName}
                              </h4>
                              {offer.isVerified && (
                                <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  <Award className="w-3 h-3" />
                                  <span>{t('requestDetails.verified')}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center space-x-2 flex-shrink-0">
                                <MapPin className="w-4 h-4 text-green-500" />
                                <span>{offer.clinicCountry}</span>
                              </span>
                              <span className="flex items-center space-x-2 flex-shrink-0">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="font-medium">{offer.clinicRating}</span>
                                <span className="text-gray-500">({offer.clinicReviews} {t('requestDetails.reviews')})</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-6">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ${Number(offer.priceMin ?? 0).toLocaleString()}{offer.priceMax != null && offer.priceMax !== offer.priceMin ? ` - $${Number(offer.priceMax).toLocaleString()}` : ''} <span className="text-base font-normal text-gray-500">USD</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                            <span aria-hidden>🔒</span>
                            <span>{t('requestDetails.priceLocked')}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {safeFormatDateTR((offer as any).createdAt)} {t('requestDetails.onDate')}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <div>
                            <span className="font-medium text-gray-700">{t('requestDetails.duration')}:</span>
                            <span className="text-gray-600 ml-2">{offer.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <span className="text-lg">🏥</span>
                          <div>
                            <span className="font-medium text-gray-700">{t('requestDetails.hospitalization')}:</span>
                            <span className="text-gray-600 ml-2">{offer.hospitalization}</span>
                          </div>
                        </div>
                      </div>

                      {offer.description && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {offer.description}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="text-sm text-gray-500 flex-shrink-0 bg-gray-100 px-3 py-1.5 rounded-full">
                          {t('requestDetails.offerNumber')} #{(typeof offer.id === 'string' ? offer.id : String(offer.id ?? '')).slice(-6).toUpperCase()}
                        </div>
                        
                        {/* Teklif Durumu */}
                        {offerStatuses[offer.id] === 'accepted' && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <span className="text-green-600 font-semibold">{t('requestDetails.offerAccepted')}</span>
                          </div>
                        )}
                        
                        {offerStatuses[offer.id] === 'rejected' && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-lg">✗</span>
                            </div>
                            <span className="text-red-600 font-semibold">{t('requestDetails.offerRejected')}</span>
                          </div>
                        )}
                        
                        {/* Aksiyon Butonları */}
                        {!offerStatuses[offer.id] && (
                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <button
                              onClick={() => handleAcceptOffer(offer.id, offer.clinicName)}
                              disabled={isProcessing === offer.id}
                              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              {isProcessing === offer.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <span className="text-lg">✓</span>
                              )}
                              <span>{t('requestDetails.accept')}</span>
                            </button>
                            
                            <button
                              onClick={() => handleRejectOffer(offer.id, offer.clinicName)}
                              disabled={isProcessing === offer.id}
                              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              {isProcessing === offer.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <span className="text-lg">✗</span>
                              )}
                              <span>{t('requestDetails.reject')}</span>
                            </button>
                            
                            <button
                              onClick={() => handleContactClinic(offer.clinicName)}
                              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{t('requestDetails.contactClinic')}</span>
                            </button>
                          </div>
                        )}
                        
                        {/* Kabul/Red sonrası sadece iletişim butonu */}
                        {offerStatuses[offer.id] && (
                          <button
                            onClick={() => handleContactClinic(offer.clinicName)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{t('requestDetails.contactClinic')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User's Photos */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                {t('requestDetails.myPhotos')}
              </h3>
              {photoLoadError && (
                <div className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  {t('requestDetails.photoSignError')}
                </div>
              )}
              {displayPhotoUrls && displayPhotoUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayPhotoUrls.map((url, idx) => (
                    // Gizle: yüklenemeyen görseller
                    failedPhotos[idx] ? null : (
                      <div key={idx} className="relative group">
                        <LazyLoadImage
                          src={url}
                          alt={`${t('requestDetails.photos')} ${idx + 1}`}
                          effect="blur"
                          className="w-full h-40 object-cover rounded-xl border border-gray-200"
                          onClick={() => setEnlargedPhoto(url)}
                          onError={() => handleImageError(idx)}
                        />
                        <button
                          type="button"
                          onClick={() => setEnlargedPhoto(url)}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 text-white flex items-center justify-center rounded-xl transition-opacity"
                        >
                          <Eye className="w-6 h-6" />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-gray-600 text-sm bg-gray-50 border border-gray-200 rounded-xl p-4">
                  {t('userDashboard.noPhotos')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Enlargement Modal */}
      {enlargedPhoto && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold">{t('requestDetails.enlargedPhoto')}</h4>
              <button
                onClick={() => setEnlargedPhoto(null)}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={enlargedPhoto} alt={t('requestDetails.enlargedPhoto')} className="max-h-[70vh] w-full object-contain bg-black" />
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDetailsModal;