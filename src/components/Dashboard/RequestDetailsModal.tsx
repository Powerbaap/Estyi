import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Clock, DollarSign, MessageCircle, Star, Award, Calendar, Eye, Phone, Mail } from 'lucide-react';

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
  const [enlargedPhoto, setEnlargedPhoto] = React.useState<string | null>(null);
  const [offerStatuses, setOfferStatuses] = React.useState<{[key: string]: 'pending' | 'accepted' | 'rejected'}>({});
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  if (!isOpen || !request) return null;

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
      
      // Kliniğe bildirim gönder
      console.log(`Teklif kabul edildi: ${clinicName} - ${offerId}`);
      
      // Başarı mesajı göster
      alert(`${clinicName} teklifini kabul ettiniz!`);
      
    } catch (error) {
      console.error('Teklif kabul edilirken hata:', error);
      alert('Teklif kabul edilirken bir hata oluştu.');
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
      console.log(`Teklif reddedildi: ${clinicName} - ${offerId}`);
      
      // Başarı mesajı göster
      alert(`${clinicName} teklifini reddettiniz.`);
      
    } catch (error) {
      console.error('Teklif reddedilirken hata:', error);
      alert('Teklif reddedilirken bir hata oluştu.');
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
        return 'Aktif';
      case 'closed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

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
                  <span>{request.createdAt.toLocaleDateString('tr-TR')}</span>
                </span>
                <span className="flex items-center space-x-2 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{request.countries.join(', ')}</span>
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
                  <div className="text-sm text-blue-700 font-medium">Teklif Alındı</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">{request.photos}</div>
                  <div className="text-sm text-green-700 font-medium">Fotoğraf</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{request.countries.length}</div>
                  <div className="text-sm text-purple-700 font-medium">Ülke</div>
                </div>
              </div>
            </div>

            {/* User's Photos */}
            {request.photoUrls && request.photoUrls.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="w-5 h-5 text-blue-500 mr-2" />
                  Fotoğraflarım ({request.photos})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {request.photoUrls.map((photoUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photoUrl}
                        alt={`Fotoğraf ${index + 1}`}
                        className="aspect-square object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-200 group-hover:scale-105"
                        onClick={() => setEnlargedPhoto(photoUrl)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                        <button 
                          className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium transition-opacity shadow-lg cursor-pointer hover:bg-white hover:shadow-xl transform hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnlargedPhoto(photoUrl);
                          }}
                        >
                          Büyüt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="w-5 h-5 text-blue-500 mr-2" />
                  Fotoğraflarım ({request.photos})
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-600 text-lg">
                    {request.photos} fotoğraf yüklendi
                  </p>
                </div>
              </div>
            )}

            {/* Offers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Star className="w-5 h-5 text-amber-500 mr-2" />
                Alınan Teklifler ({request.offersCount})
              </h3>
              {request.offers.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Henüz teklif alınmadı. Klinikler tarafından değerlendiriliyor...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {request.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-white group"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-white font-bold text-xl">
                              {offer.clinicName.charAt(0)}
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
                                  <span>Doğrulanmış</span>
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
                                <span className="text-gray-500">({offer.clinicReviews} değerlendirme)</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-6">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ${offer.priceMin.toLocaleString()} - ${offer.priceMax.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {offer.createdAt.toLocaleDateString('tr-TR')} tarihinde
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <div>
                            <span className="font-medium text-gray-700">Süre:</span>
                            <span className="text-gray-600 ml-2">{offer.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <span className="text-lg">🏥</span>
                          <div>
                            <span className="font-medium text-gray-700">Hastanede Kalış:</span>
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
                          Teklif #{offer.id.slice(-6).toUpperCase()}
                        </div>
                        
                        {/* Teklif Durumu */}
                        {offerStatuses[offer.id] === 'accepted' && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <span className="text-green-600 font-semibold">Teklif Kabul Edildi</span>
                          </div>
                        )}
                        
                        {offerStatuses[offer.id] === 'rejected' && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-lg">✗</span>
                            </div>
                            <span className="text-red-600 font-semibold">Teklif Reddedildi</span>
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
                              <span>Kabul Et</span>
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
                              <span>Reddet</span>
                            </button>
                            
                            <button
                              onClick={() => handleContactClinic(offer.clinicName)}
                              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Klinik ile İletişim</span>
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
                            <span>Klinik ile İletişim</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Enlargement Modal */}
      {enlargedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-700 transition-all duration-200 hover:scale-110 backdrop-blur-sm shadow-2xl"
            >
              <X className="w-6 h-6" />
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
    </>
  );
};

export default RequestDetailsModal;