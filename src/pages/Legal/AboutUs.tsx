import React from 'react';
import { Users, Globe, Shield, Sparkles, Heart, Star, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Hakkımızda
              </h1>
              <p className="text-gray-600 mt-2">Estetik tıbbın geleceğini şekillendiriyoruz</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Estyi, dünya çapında estetik tedavi arayan hastaları güvenilir kliniklerle buluşturan yenilikçi bir platformdur. 
              Şeffaflık, güvenlik ve kalite odaklı yaklaşımımızla estetik tıbbın geleceğini şekillendiriyoruz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Şeffaf Fiyatlandırma</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Gizli maliyetler olmadan, net fiyatlar sunuyoruz. Tedavi maliyetlerini önceden bilin.
                </p>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-6 h-6 text-pink-600" />
                  <h3 className="font-semibold text-gray-900">Global Erişim</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dünya çapında sertifikalı kliniklere erişim sağlıyoruz. En iyi tedavi seçeneklerini keşfedin.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">AI Destekli Eşleştirme</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Yapay zeka ile en uygun klinik-hasta eşleştirmesi yapıyoruz. Kişiselleştirilmiş öneriler.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">Kalite Garantisi</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tüm kliniklerimiz lisans ve sertifika kontrolünden geçer. Sadece en yüksek kalite standartlarını karşılayan 
                klinikler platformumuzda yer alır. Hastalarımızın güvenliği ve memnuniyeti bizim için en önemli önceliktir.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-green-600" />
                  <span>10,000+ Mutlu Hasta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 Ortalama Puan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>500+ Güvenilir Klinik</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span>10+ Ülke</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bizimle İletişime Geçin</h3>
              <p className="text-gray-600 mb-6">
                Sorularınız için bizimle iletişime geçebilirsiniz. Size en kısa sürede yanıt vereceğiz.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <a 
                  href="/contact" 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Heart className="w-4 h-4" />
                  <span>İletişim Sayfası</span>
                </a>
                <a 
                  href="mailto:info@estyi.com" 
                  className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-medium border border-purple-200 hover:bg-purple-50 transition-all duration-300"
                >
                  <Star className="w-4 h-4" />
                  <span>E-posta Gönder</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;