import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Clock, DollarSign, MessageCircle, Star, Award, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

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
  clinic_name?: string;
  country?: string;
  clinics?: {
    id?: string;
    name?: string;
    country?: string;
    city?: string;
    rating?: number;
    review_count?: number;
    certificate_files?: any[] | null;
  } | null;
}

interface Request {
  id: string;
  procedure: string;
  status: string;
  createdAt: Date;
  offersCount: number;
  countries: string[];
  citiesByCountry?: Record<string, string[]> | null;
  photos: number;
  offers: Offer[];
  photoUrls?: string[];
  region?: string | null;
  sessions?: number | null;
  notes?: string | null;
}

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ isOpen, onClose, request }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getCountryDisplayName = (countryKey?: string) => {
    if (!countryKey) return '';
    const key = `countries.${countryKey}`;
    const translated = t(key);
    return translated && translated !== key ? translated : countryKey;
  };
  const formatCountries = (countries?: string[]) => {
    if (!Array.isArray(countries)) return '';
    return countries.map(getCountryDisplayName).filter(Boolean).join(', ');
  };
  const [offerStatuses, setOfferStatuses] = React.useState<{[key: string]: 'pending' | 'accepted' | 'rejected'}>({});
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  const handleContactClinic = async (clinicId: string, clinicName: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (userId && clinicId) {
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', userId)
          .eq('clinic_id', clinicId)
          .maybeSingle();

        if (existingConv?.id) {
          navigate('/messages', {
            state: {
              conversationId: existingConv.id,
            },
          });
          onClose();
          return;
        }

        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ user_id: userId, clinic_id: clinicId })
          .select('id')
          .single();

        if (newConv?.id) {
          navigate('/messages', {
            state: {
              conversationId: newConv.id,
            },
          });
          onClose();
          return;
        }
      }
    } catch (err) {
      console.error('Conversation hatası:', err);
    }

    navigate('/messages');
    onClose();
  };

  const handleAcceptOffer = async (offerId: string, clinicName: string) => {
    setIsProcessing(offerId);
    try {
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId);

      if (offerError) throw offerError;

      const { data: offerData } = await supabase
        .from('offers')
        .select('request_id')
        .eq('id', offerId)
        .single();

      if (offerData?.request_id) {
        try {
          await supabase
            .from('offers')
            .update({ status: 'rejected' })
            .eq('request_id', offerData.request_id)
            .neq('id', offerId);
        } catch {}
        
        try {
          await supabase
            .from('requests')
            .update({ status: 'accepted' })
            .eq('id', offerData.request_id);
        } catch {}
      }
      
      setOfferStatuses(prev => ({ ...prev, [offerId]: 'accepted' }));

      // Conversation oluştur
      let conversationId: string | null = null;
      try {
        const { data: fullOffer } = await supabase
          .from('offers')
          .select('id, request_id, clinic_id, price_min, currency')
          .eq('id', offerId)
          .single();
        if (fullOffer) {
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData?.session?.user?.id;
          if (userId && fullOffer.clinic_id) {
            const { data: existingConv } = await supabase
              .from('conversations')
              .select('id')
              .eq('user_id', userId)
              .eq('clinic_id', fullOffer.clinic_id)
              .maybeSingle();
            if (existingConv?.id) {
              conversationId = existingConv.id;
            } else {
              const { data: newConv } = await supabase
                .from('conversations')
                .insert({ user_id: userId, clinic_id: fullOffer.clinic_id })
                .select('id')
                .single();
              conversationId = newConv?.id || null;
            }
            if (conversationId) {
              await supabase.from('messages').insert({
                conversation_id: conversationId,
                sender_id: userId,
                sender_type: 'user',
                content: `Merhaba, teklifinizi kabul ettim. Detaylar hakkında görüşmek istiyorum.`,
              });
            }
          }
        }
      } catch (convErr) {
        console.error('Conversation oluşturma hatası:', convErr);
      }

      navigate('/messages', {
        state: {
          selectedClinic: clinicName,
          messageType: 'clinic_contact',
          offerAccepted: true,
          offerId: offerId,
          conversationId: conversationId,
        },
      });
      onClose();
    } catch (error) {
      console.error('Teklif kabul hatası:', error);
      alert(t('auth.acceptError'));
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectOffer = async (offerId: string, clinicName: string) => {
    setIsProcessing(offerId);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (error) throw error;
      setOfferStatuses(prev => ({ ...prev, [offerId]: 'rejected' }));
      alert(t('auth.rejectSuccess', { clinicName }));
    } catch (error) {
      console.error('Teklif red hatası:', error);
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
              {(request.region || request.sessions) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {request.region && (
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100">
                      📍 {request.region}
                    </span>
                  )}
                  {request.sessions && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100">
                      🔁 {request.sessions} seans
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-6 mt-3 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center space-x-2 flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>{safeFormatDateTR(request.createdAt)}</span>
                </span>
                <span className="flex items-center space-x-2 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{(() => {
                    const countries = Array.isArray(request.countries) ? request.countries : (request.countries ? [String(request.countries)] : []);
                    const cbd = request.citiesByCountry;
                    return countries.map(c => {
                      const name = getCountryDisplayName(c);
                      const cities = cbd && Array.isArray(cbd[c]) ? cbd[c] : [];
                      return cities.length > 0 ? `${name} / ${cities.join(', ')}` : name;
                    }).filter(Boolean).join(', ');
                  })()}</span>
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
              {(() => {
                const created = request.createdAt instanceof Date ? request.createdAt : new Date(request.createdAt);
                const expiresAt = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000);
                const diffMs = expiresAt.getTime() - Date.now();
                const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                const isExpiringSoon = diffDays <= 2;
                return (
                  <div className={`bg-gradient-to-br rounded-2xl p-6 border ${isExpiringSoon ? 'from-red-50 to-orange-50 border-red-100' : 'from-green-50 to-emerald-50 border-green-100'}`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r rounded-xl flex items-center justify-center mx-auto mb-3 ${isExpiringSoon ? 'from-red-500 to-orange-600' : 'from-green-500 to-emerald-600'}`}>
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className={`text-3xl font-bold ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>{diffDays}</div>
                      <div className={`text-sm font-medium ${isExpiringSoon ? 'text-red-700' : 'text-green-700'}`}>
                        {diffDays === 0 ? 'Bugün bitiyor!' : 'gün kaldı'}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
                              {String(offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik').charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 
                                className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors truncate"
                                onClick={() => {
                                  const cId = offer.clinics?.id ?? (offer as any).clinic_id;
                                  if (cId) {
                                    navigate(`/clinic/${cId}/profile`);
                                  } else {
                                    navigate('/clinic-profile', { 
                                      state: { 
                                        clinicName: offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik',
                                        clinicCountry: offer.country ?? (offer as any).clinicCountry ?? offer.clinics?.country_code ?? ''
                                      } 
                                    });
                                  }
                                  onClose();
                                }}
                              >
                                {offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik'}
                              </h4>
                              {offer.isVerified && (
                                <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                  <Award className="w-3 h-3" />
                                  <span>{t('requestDetails.verified')}</span>
                                </div>
                              )}
                              {offer.clinics?.certificate_files && Array.isArray(offer.clinics.certificate_files) && offer.clinics.certificate_files.length > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Sertifikalı
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-600 flex-wrap">
                              <span className="flex items-center space-x-2 flex-shrink-0">
                                <MapPin className="w-4 h-4 text-green-500" />
                                <span>{getCountryDisplayName(offer.country ?? (offer as any).clinicCountry ?? offer.clinics?.country_code ?? '')}</span>
                              </span>
                              {(offer.clinics?.rating ?? (offer as any).clinicRating) > 0 && (
                                <span className="flex items-center space-x-2 flex-shrink-0">
                                  <Star className="w-4 h-4 text-amber-500" />
                                  <span className="font-medium">{offer.clinics?.rating ?? (offer as any).clinicRating ?? 0}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-6">
                          <div className="text-3xl font-bold text-green-600 mb-1">
                            ${Number(offer.priceMin ?? (offer as any).price_min ?? (offer as any).price ?? 0).toLocaleString()}
                            {((offer.priceMax ?? (offer as any).price_max) != null &&
                              (offer.priceMax ?? (offer as any).price_max) !== (offer.priceMin ?? (offer as any).price_min))
                              ? ` - $${Number(offer.priceMax ?? (offer as any).price_max).toLocaleString()}`
                              : ''}{' '}
                            <span className="text-base font-normal text-gray-500">USD</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                            <span aria-hidden>🔒</span>
                            <span>{t('requestDetails.priceLocked')}</span>
                          </div>
                          <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <span>🔒</span>
                            <span>{t('offers.priceLocked')}</span>
                          </p>
                          <div className="text-sm text-gray-600 mt-2">
                            {safeFormatDateTR((offer as any).createdAt)} {t('requestDetails.onDate')}
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
                        {/* Teklif Durumu */}
                        {(offerStatuses[offer.id] === 'accepted' || (offer as any).status === 'accepted') && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <span className="text-green-600 font-semibold">{t('requestDetails.offerAccepted')}</span>
                          </div>
                        )}
                        
                        {(offerStatuses[offer.id] === 'rejected' || (offer as any).status === 'rejected') && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-lg">✗</span>
                            </div>
                            <span className="text-red-600 font-semibold">{t('requestDetails.offerRejected')}</span>
                          </div>
                        )}
                        
                        {/* Aksiyon Butonları */}
                        {!offerStatuses[offer.id] && (offer as any).status !== 'accepted' && (offer as any).status !== 'rejected' && (
                          <div className="flex items-center space-x-3 flex-shrink-0">
                              <button
                              onClick={() => handleAcceptOffer(offer.id, offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik')}
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
                              onClick={() => handleRejectOffer(offer.id, offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik')}
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
                              onClick={() => {
                                const cId = offer.clinics?.id ?? (offer as any).clinic_id ?? '';
                                handleContactClinic(
                                  cId,
                                  offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik'
                                );
                              }}
                              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{t('requestDetails.contactClinic')}</span>
                            </button>
                          </div>
                        )}
                        
                        {(offerStatuses[offer.id] || (offer as any).status === 'accepted' || (offer as any).status === 'rejected') && (
                          <button
                            onClick={() => {
                              const cId = offer.clinics?.id ?? (offer as any).clinic_id ?? '';
                              handleContactClinic(
                                cId,
                                offer.clinicName ?? offer.clinic_name ?? offer.clinics?.name ?? 'Klinik'
                              );
                            }}
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

          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailsModal;
