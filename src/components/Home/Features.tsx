import React from 'react';
import { Shield, Globe, Users, Star, Award, Clock, Sparkles, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollToTopInstant } from '../../utils/scrollUtils';

const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Güvenli Platform',
      description: 'GDPR uyumlu ve SSL güvenlik sertifikalı platform ile verileriniz güvende.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Uluslararası Erişim',
      description: 'Global güvenilir klinikler ve uzman doktorlar ile bağlantı kurun.',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Uzman Doktorlar',
      description: 'Sertifikalı ve deneyimli doktorlar ile kaliteli tedavi hizmeti alın.',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Star,
      title: 'Kanıtlanmış Sonuçlar',
      description: '10,000+ mutlu hasta ve 4.9/5 ortalama değerlendirme puanı.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Award,
      title: 'Kalite Garantisi',
      description: 'Sadece onaylı ve kalite standartlarını karşılayan klinikler.',
      color: 'from-yellow-500 to-green-500'
    },
    {
      icon: Clock,
      title: '7/24 Destek',
      description: 'Her zaman yanınızdayız. Sorularınız için anında destek alın.',
      color: 'from-green-500 to-blue-500'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Neden <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Estyi</span>'yi Seçmelisiniz
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Estetik tıbbın geleceğini deneyimleyin ve yenilikçi platformumuzla tanışın
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-200/50 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 relative z-10`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Heart className="w-4 h-4 text-pink-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.1%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%271%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
            
            {/* Floating Icons */}
            <div className="absolute top-4 left-4 animate-float">
              <Sparkles className="w-6 h-6 text-white/60" />
            </div>
            <div className="absolute top-8 right-8 animate-float animation-delay-1000">
              <Zap className="w-5 h-5 text-white/60" />
            </div>
            <div className="absolute bottom-6 left-1/3 animate-float animation-delay-2000">
              <Heart className="w-4 h-4 text-white/60" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold mb-6">
                Hemen Başlayın
              </h3>
              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
                Ücretsiz hesap oluşturun ve estetik tedaviniz için en iyi fiyatları alın
              </p>
              <Link
                to="/signup"
                onClick={scrollToTopInstant}
                className="group inline-flex items-center bg-white text-purple-600 px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden"
              >
                <span className="relative z-10">Ücretsiz Kayıt Ol</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Sparkles className="w-5 h-5 text-purple-600 absolute right-4 top-1/2 transform -translate-y-1/2 group-hover:animate-pulse" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;