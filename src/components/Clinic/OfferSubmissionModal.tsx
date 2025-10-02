import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, DollarSign, Clock, Bed, Plane, FileText, Check } from 'lucide-react';

interface UserRequest {
  id: string;
  userId: string;
  procedure: string;
  photos: string[];
  countries: string[];
  age: number;
  notes?: string;
  createdAt: Date;
  status: 'new' | 'offered' | 'expired';
}

interface OfferSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: UserRequest | null;
}

const OfferSubmissionModal: React.FC<OfferSubmissionModalProps> = ({ isOpen, onClose, request }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    basePrice: '',
    minPrice: '',
    maxPrice: '',
    priceRange: 200,
    duration: '',
    hospitalization: '',
    doctorName: '',
    clinicAddress: '',
    accommodation: false,
    transport: false,
    consultation: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateTotal = () => {
    const minPrice = parseFloat(formData.minPrice) || 0;
    const maxPrice = parseFloat(formData.maxPrice) || 0;
    return `${minPrice} - ${maxPrice}`;
  };

  const validatePriceRange = () => {
    const minPrice = parseFloat(formData.minPrice) || 0;
    const maxPrice = parseFloat(formData.maxPrice) || 0;
    const difference = maxPrice - minPrice;
    return difference <= 200;
  };

  const getPriceRangeError = () => {
    const minPrice = parseFloat(formData.minPrice) || 0;
    const maxPrice = parseFloat(formData.maxPrice) || 0;
    const difference = maxPrice - minPrice;
    if (difference > 200) {
      return `Fiyat aralığı 200 doları geçemez. Mevcut fark: $${difference}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fiyat aralığı kontrolü
    if (!validatePriceRange()) {
      alert(getPriceRangeError());
      return;
    }
    
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset form
      setFormData({
        basePrice: '',
        minPrice: '',
        maxPrice: '',
        priceRange: 200,
        duration: '',
        hospitalization: '',
        accommodation: false,
        transport: false,
        consultation: false,
        notes: ''
      });
    }, 3000);
  };

  if (!isOpen || !request) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Teklif Gönderildi!</h2>
          <p className="text-gray-600 mb-4">
            Teklifiniz {request.userId} kullanıcısına gönderildi. 7 gün içinde yanıt verebilirler.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Toplam Teklif:</strong> ${calculateTotal().toLocaleString()} USD
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>İşlemi Yapacak:</strong> {formData.doctorName}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Adres:</strong> {formData.clinicAddress}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Teklif Gönder</h2>
            <p className="text-gray-600 mt-1">
              {request.procedure} için {request.userId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Info Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Hasta Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Yaş:</span> {request.age}
              </div>
              <div>
                <span className="text-gray-600">Ülkeler:</span> {request.countries.join(', ')}
              </div>
              <div>
                <span className="text-gray-600">Fotoğraflar:</span> {request.photos.length} yüklendi
              </div>
              <div>
                <span className="text-gray-600">Talep Tarihi:</span> {request.createdAt.toLocaleDateString('tr-TR')}
              </div>
            </div>
            {request.notes && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Notlar:</span>
                <p className="text-sm text-gray-800 mt-1">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Min-Max Price */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Fiyat *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="100"
                  max="50000"
                  value={formData.minPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minimum fiyatı girin"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimum Fiyat *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="100"
                  max="50000"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Maksimum fiyatı girin"
                />
              </div>
            </div>
            
            {/* Fiyat Aralığı Kontrolü */}
            {formData.minPrice && formData.maxPrice && (
              <div className={`p-3 rounded-lg ${
                validatePriceRange() 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Fiyat Aralığı: ${parseFloat(formData.minPrice) || 0} - ${parseFloat(formData.maxPrice) || 0}
                  </span>
                  <span className={`text-sm font-medium ${
                    validatePriceRange() ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Fark: ${(parseFloat(formData.maxPrice) || 0) - (parseFloat(formData.minPrice) || 0)}
                  </span>
                </div>
                {!validatePriceRange() && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Fiyat aralığı 200 doları geçemez!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Doctor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İşlemi Yapacak Doktor/Uzman *
              </label>
              <input
                type="text"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dr. Ad Soyad"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İşlem Yapılacak Adres *
              </label>
              <input
                type="text"
                required
                value={formData.clinicAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicAddress: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Klinik adresi"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşlem Süresi *
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                required
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Süre seçin</option>
                <option value="1-2 hours">1-2 saat</option>
                <option value="2-3 hours">2-3 saat</option>
                <option value="3-4 hours">3-4 saat</option>
                <option value="4-6 hours">4-6 saat</option>
                <option value="6-8 hours">6-8 saat</option>
                <option value="Full day">Tam gün</option>
              </select>
            </div>
          </div>

          {/* Hospitalization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hastane Yatışı Gerekli mi? *
            </label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                required
                value={formData.hospitalization}
                onChange={(e) => setFormData(prev => ({ ...prev, hospitalization: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Hastane yatışı seçin</option>
                <option value="None">Yok (Ayakta tedavi)</option>
                <option value="1 night">1 gece</option>
                <option value="2 nights">2 gece</option>
                <option value="3 nights">3 gece</option>
                <option value="4-5 nights">4-5 gece</option>
                <option value="1 week">1 hafta</option>
              </select>
            </div>
          </div>

          {/* Included Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dahil Olan Hizmetler
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accommodation}
                  onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.checked }))}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Otel Konaklaması</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.transport}
                  onChange={(e) => setFormData(prev => ({ ...prev, transport: e.target.checked }))}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Havaalanı Transferi</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consultation}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultation: e.target.checked }))}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Konsültasyonlar</span>
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ek Notlar
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ek bilgiler ekleyin..."
            />
          </div>

          {/* Cost Breakdown */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Maliyet Dağılımı</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Temel İşlem:</span>
                <span>${parseFloat(formData.minPrice) || 0} - ${parseFloat(formData.maxPrice) || 0}</span>
              </div>

              <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold text-blue-900">
                <span>Toplam Teklif:</span>
                <span>${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Önemli Bilgiler</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>Her talep için sadece bir teklif gönderebilirsiniz</li>
              <li>Teklif gönderildikten sonra değiştirilemez</li>
              <li>Hasta 7 gün içinde yanıt verebilir</li>
              <li>Hastane yatışı ve temel hizmetler otomatik dahildir</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={!formData.minPrice || !formData.maxPrice || !formData.duration || !formData.hospitalization || !formData.doctorName || !formData.clinicAddress || isSubmitting || !validatePriceRange()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  <span>Teklif Gönder (${calculateTotal()})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferSubmissionModal;