import React from 'react';
import { Shield, Globe, Award, Clock, Lock, MapPin, Sparkles, Heart, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { scrollToTopInstant } from '../../utils/scrollUtils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getUserRole } from '../../utils/auth';

const Features: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Giriş yapılmışsa kayıt sayfasına gitmeyi engelle
    if (user) {
      e.preventDefault();
      const role = getUserRole(user);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'clinic') {
        navigate('/clinic-dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }
    // Misafir kullanıcı için normal davranış
    scrollToTopInstant();
  };
  
  const features = [
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.description'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: t('home.features.global.title'),
      description: t('home.features.global.description'),
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Award,
      title: t('home.features.quality.title'),
      description: t('home.features.quality.description'),
      color: 'from-yellow-500 to-green-500'
    },
    {
      icon: Clock,
      title: t('home.features.support.title'),
      description: t('home.features.support.description'),
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Lock,
      title: t('home.features.fixedPrice.title'),
      description: t('home.features.fixedPrice.description'),
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: MapPin,
      title: t('home.features.locationFilter.title'),
      description: t('home.features.locationFilter.description'),
      color: 'from-indigo-500 to-purple-500'
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
            {t('home.features.title')} <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Estyi</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('home.features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50 overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 relative z-10`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
