import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Star, MessageCircle, ThumbsUp, Filter, Search, Plus, Heart, Globe, Clock, Shield, User } from 'lucide-react';
import { scrollToTopInstant } from '../utils/scrollUtils';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  date: Date;
  helpfulCount: number;
  verified: boolean;
  platformFeature: string;
}

const Reviews: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | '5star' | '4star'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewForm, setReviewForm] = useState({
    title: '',
    content: '',
    platformFeature: ''
  });

  // Sayfa yüklendiğinde en üste scroll yap
  useEffect(() => {
    scrollToTopInstant();
  }, []);

  // Mock data - Sadece platform övgüleri
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
        rating: 5,
        title: 'Çok hızlı fiyat aldım!',
        content: 'İnanılmaz hızlı bir şekilde fiyat aldım. Böyle bir platform ile karşılaştığım için çok şanslıyım. Şeffaf ve güvenilir bir platform.',
        authorName: 'user12345',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        helpfulCount: 18,
        verified: true,
        platformFeature: 'Hızlı Fiyat Alma'
      },
      {
        id: '2',
        rating: 5,
        title: 'Zamanım yoktu, mükemmel çözüm!',
        content: 'Bir estetik merkezine gitmeye zamanım yoktu. Bu platform sayesinde tüm dünya ülkelerinden ve lokallerden fiyat aldım. Harika bir deneyim!',
        authorName: 'user78901',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        helpfulCount: 25,
        verified: true,
        platformFeature: 'Zaman Tasarrufu'
      },
      {
        id: '3',
        rating: 5,
        title: 'Şeffaf ve güvenilir platform',
        content: 'Böyle şeffaf bir platform ile karşılaştığım için çok şanslıyım. Fiyatları karşılaştırmak çok kolay ve güvenilir.',
        authorName: 'user45678',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
        helpfulCount: 32,
        verified: true,
        platformFeature: 'Şeffaflık'
      },
      {
        id: '4',
        rating: 5,
        title: 'Tek tıkla fiyat alma!',
        content: 'Tek tıkla ücretsiz fiyat alabiliyorum. Böyle bir platform ile karşılaştığım için çok şanslıyım. Çok pratik ve kullanışlı.',
        authorName: 'user23456',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
        helpfulCount: 15,
        verified: true,
        platformFeature: 'Kolay Kullanım'
      },
      {
        id: '5',
        rating: 5,
        title: 'Uluslararası erişim harika!',
        content: 'Tüm dünya ülkelerinden fiyat alabiliyorum. Böyle bir platform ile karşılaştığım için çok şanslıyım. Global bir çözüm.',
        authorName: 'user89012',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
        helpfulCount: 28,
        verified: true,
        platformFeature: 'Uluslararası Erişim'
      },
      {
        id: '6',
        rating: 5,
        title: 'Güvenli ve hızlı platform',
        content: 'Çok güvenli ve hızlı bir platform. Böyle bir platform ile karşılaştığım için çok şanslıyım. Verilerim güvende.',
        authorName: 'user34567',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        helpfulCount: 22,
        verified: true,
        platformFeature: 'Güvenlik'
      }
    ];
    setReviews(mockReviews);
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.platformFeature.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && review.rating === parseInt(filter.replace('star', ''));
  });

  const averageRating = 4.9; // Sabit 4.9 puan
  const totalReviews = reviews.length;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: 0,
    2: 0,
    1: 0
  };

  const handleSubmitReview = () => {
    // Yeni kullanıcı numarası oluştur (gerçek uygulamada backend'den gelecek)
    const newUserId = `user${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newReview: Review = {
      id: Date.now().toString(),
      rating: selectedRating,
      title: reviewForm.title,
      content: reviewForm.content,
      authorName: user ? user.username : newUserId,
      date: new Date(),
      helpfulCount: 0,
      verified: true,
      platformFeature: reviewForm.platformFeature
    };
    
    setReviews(prev => [newReview, ...prev]);
    setShowReviewModal(false);
    setReviewForm({ title: '', content: '', platformFeature: '' });
    setSelectedRating(5);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('reviews.title')}</h1>
                              <p className="text-gray-600 mt-2">{t('reviews.subtitle') || 'Kullanıcılarımızın Estyi deneyimleri'}</p>
            </div>
            {user ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t('reviews.writeReview')}</span>
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{t('reviews.loginToReview')}</p>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  {t('login.loginButton')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats and Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reviews.platformScore') || 'Platform Puanı'}</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {renderStars(5)}
                </div>
                <p className="text-sm text-gray-600">{totalReviews} {t('reviews.totalReviews')}</p>
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center text-green-600">
                    <Heart className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{t('reviews.excellentPlatform') || 'Mükemmel Platform'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {[5, 4].map((rating) => (
                  <div key={rating} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('reviews.filters')}</h3>
              <div className="space-y-2">
                {[
                  { key: 'all', label: t('reviews.all') },
                  { key: '5star', label: `5 ${t('reviews.stars') || 'Yıldız'}` },
                  { key: '4star', label: `4 ${t('reviews.stars') || 'Yıldız'}` }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filter === option.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('reviews.searchPlaceholder') || 'Platform özelliklerinde ara...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('reviews.noReviews')}</h3>
                  <p className="text-gray-600 mb-6">
                    {t('reviews.noReviewsDesc')}
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start space-x-4">
                      {/* Anonim kullanıcı ikonu */}
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600 font-mono">{review.authorName}</span>
                              {review.verified && (
                                <>
                                  <span className="text-sm text-gray-600">•</span>
                                  <span className="text-sm text-green-600 font-medium">Doğrulanmış</span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                            {review.platformFeature}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.content}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Faydalı ({review.helpfulCount})</span>
                          </button>
                          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                            Yanıtla
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Değerlendirmesi Yaz</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Özelliği</label>
                <select
                  value={reviewForm.platformFeature}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, platformFeature: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Özellik seçin</option>
                  <option value="Hızlı Fiyat Alma">Hızlı Fiyat Alma</option>
                  <option value="Zaman Tasarrufu">Zaman Tasarrufu</option>
                  <option value="Şeffaflık">Şeffaflık</option>
                  <option value="Kolay Kullanım">Kolay Kullanım</option>
                  <option value="Uluslararası Erişim">Uluslararası Erişim</option>
                  <option value="Güvenlik">Güvenlik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Puan</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${rating <= selectedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Platform deneyiminiz için kısa bir başlık"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Değerlendirme</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Platform deneyiminizi detaylı olarak paylaşın..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewForm.title || !reviewForm.content || !reviewForm.platformFeature}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews; 