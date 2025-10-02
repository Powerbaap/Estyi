import React from 'react';
import { LifeBuoy, Mail, Phone, MessageCircle, Clock, Sparkles, Heart, Star, Globe } from 'lucide-react';

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 sm:p-12">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <LifeBuoy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yardım Merkezi
              </h1>
              <p className="text-gray-600 mt-2">Size nasıl yardımcı olabiliriz?</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Aşağıdaki iletişim kanallarından bize ulaşabilirsiniz. Size en kısa sürede yanıt vereceğiz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">E-posta Desteği</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Genel sorular için e-posta gönderin. 24 saat içinde yanıt alacaksınız.
                </p>
                <a 
                  href="mailto:support@estyi.com" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>support@estyi.com</span>
                </a>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Telefon Desteği</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Acil durumlar için telefon ile iletişime geçin.
                </p>
                <a 
                  href="tel:+902121234567" 
                  className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>+90 212 123 45 67</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
                <h3 className="font-semibold text-gray-900">Destek Saatleri</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <p>Hafta içi: 09:00 - 18:00</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-green-500" />
                  <p>Hafta sonu: 10:00 - 16:00</p>
                </div>
                <p className="text-sm text-yellow-700 mt-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Tüm saatler Türkiye saati (GMT+3) olarak gösterilir</span>
                </p>
              </div>
            </div>

            {/* Additional Support Options */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Canlı Destek</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Anlık sorularınız için canlı destek hizmetimiz mevcuttur.
                </p>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Canlı Destek Başlat</span>
                </button>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <h3 className="font-semibold text-gray-900">Sık Sorulan Sorular</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  Yaygın soruların cevaplarını SSS bölümümüzde bulabilirsiniz.
                </p>
                <a 
                  href="/faq" 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
                >
                  <Star className="w-4 h-4" />
                  <span>SSS'yi Görüntüle</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;