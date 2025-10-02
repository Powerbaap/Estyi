import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building,
  FileText,
  DollarSign,
  Shield,
  Download,
  Calendar,
  LogOut
} from 'lucide-react';

const Reports: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Aktif Klinikler',
      value: '89',
      change: '+5%',
      icon: Building,
      color: 'bg-green-500'
    },
    {
      title: 'Toplam Talep',
      value: '456',
      change: '+8%',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Aylık Gelir',
      value: '$45,230',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const monthlyTrends = [
    { month: 'Ocak', users: 120, clinics: 8, requests: 45, revenue: 12500 },
    { month: 'Şubat', users: 135, clinics: 10, requests: 52, revenue: 14200 },
    { month: 'Mart', users: 148, clinics: 12, requests: 58, revenue: 15800 },
    { month: 'Nisan', users: 162, clinics: 15, requests: 65, revenue: 17200 },
    { month: 'Mayıs', users: 178, clinics: 18, requests: 72, revenue: 18900 },
    { month: 'Haziran', users: 195, clinics: 22, requests: 80, revenue: 20800 }
  ];

  const topClinics = [
    { name: 'İstanbul Estetik Merkezi', requests: 45, rating: 4.8, revenue: 12500 },
    { name: 'Hair World İstanbul', requests: 38, rating: 4.7, revenue: 9800 },
    { name: 'Ankara Estetik Kliniği', requests: 32, rating: 4.6, revenue: 8200 },
    { name: 'İzmir Güzellik Merkezi', requests: 28, rating: 4.5, revenue: 7200 },
    { name: 'Bursa Estetik Kliniği', requests: 25, rating: 4.4, revenue: 6500 }
  ];

  const topProcedures = [
    { name: 'Rhinoplasty', requests: 156, avgPrice: 3500, growth: '+12%' },
    { name: 'Hair Transplant', requests: 134, avgPrice: 2800, growth: '+8%' },
    { name: 'Liposuction', requests: 98, avgPrice: 4200, growth: '+15%' },
    { name: 'Breast Augmentation', requests: 87, avgPrice: 3800, growth: '+6%' },
    { name: 'Face Lift', requests: 65, avgPrice: 4500, growth: '+10%' }
  ];

  const quickStats = [
    { title: 'Günlük Aktif Kullanıcı', value: '234', change: '+5%' },
    { title: 'Haftalık Yeni Kayıt', value: '89', change: '+12%' },
    { title: 'Aylık Teklif Sayısı', value: '1,234', change: '+8%' },
    { title: 'Ortalama İşlem Süresi', value: '2.3 gün', change: '-15%' }
  ];

  const handleDownloadReport = (type: string) => {
    console.log(`Downloading ${type} report...`);
    // Burada gerçek rapor indirme işlemi yapılacak
    alert(`${type} raporu indiriliyor...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105 group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Admin Panel</h1>
                  <p className="text-sm text-gray-600">Sistem Yönetimi</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-medium">
                    {user?.user_metadata?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">Sistem Yöneticisi</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Raporlar</h2>
          <p className="text-gray-600">Sistem performansı ve istatistikleri</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rapor Dönemi</h3>
              <p className="text-sm text-gray-600">Hangi dönem için rapor istiyorsunuz?</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="quarter">Bu Çeyrek</option>
                <option value="year">Bu Yıl</option>
              </select>
              <button
                onClick={() => handleDownloadReport(selectedPeriod)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aylık Trendler</h3>
              <p className="text-sm text-gray-600">Son 6 ayın performansı</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{trend.month}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">K: {trend.users}</span>
                      <span className="text-gray-600">Klinik: {trend.clinics}</span>
                      <span className="text-gray-600">Talep: {trend.requests}</span>
                      <span className="text-green-600 font-medium">${trend.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İstatistikler</h3>
              <p className="text-sm text-gray-600">Güncel sistem durumu</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{stat.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Clinics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">En İyi Klinikler</h3>
              <p className="text-sm text-gray-600">En çok talep alan klinikler</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topClinics.map((clinic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{clinic.name}</p>
                        <p className="text-xs text-gray-500">{clinic.requests} talep • {clinic.rating} ⭐</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">${clinic.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Procedures */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">En Popüler İşlemler</h3>
              <p className="text-sm text-gray-600">En çok talep edilen işlemler</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProcedures.map((procedure, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{procedure.name}</p>
                        <p className="text-xs text-gray-500">{procedure.requests} talep</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${procedure.avgPrice}</p>
                      <p className="text-xs text-green-600">{procedure.growth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 