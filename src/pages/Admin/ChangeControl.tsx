import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Building, 
  Shield, 
  Eye, 
  EyeOff, 
  LogOut, 
  Settings, 
  UserCheck, 
  UserX,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const ChangeControl: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'seeking' | 'creating'>('seeking');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Mock data for change-seeking side (patients)
  const changeSeekingData = {
    totalUsers: 1247,
    activeUsers: 892,
    pendingRequests: 156,
    completedRequests: 234,
    recentActivity: [
      { id: 1, user: 'Ahmet Yılmaz', action: 'Yeni tedavi talebi oluşturdu', time: '2 saat önce' },
      { id: 2, user: 'Fatma Demir', action: 'Klinik değerlendirmesi yaptı', time: '4 saat önce' },
      { id: 3, user: 'Mehmet Kaya', action: 'Randevu talep etti', time: '6 saat önce' },
      { id: 4, user: 'Ayşe Özkan', action: 'Fiyat teklifi aldı', time: '8 saat önce' }
    ],
    credentials: {
      username: 'change_seeker_admin',
      password: 'seeker123456'
    }
  };

  // Mock data for change-creating side (clinics)
  const changeCreatingData = {
    totalClinics: 89,
    activeClinics: 67,
    pendingOffers: 234,
    completedOffers: 567,
    recentActivity: [
      { id: 1, clinic: 'İstanbul Estetik Merkezi', action: 'Yeni teklif gönderdi', time: '1 saat önce' },
      { id: 2, clinic: 'Hair World İstanbul', action: 'Randevu onayladı', time: '3 saat önce' },
      { id: 3, clinic: 'Medikal Spa', action: 'Fiyat güncelledi', time: '5 saat önce' },
      { id: 4, clinic: 'Estetik Kliniği', action: 'Yeni tedavi ekledi', time: '7 saat önce' }
    ],
    credentials: {
      username: 'change_creator_admin',
      password: 'creator123456'
    }
  };

  const statsCards = [
    {
      title: 'Toplam Kullanıcı',
      value: activeTab === 'seeking' ? changeSeekingData.totalUsers : changeCreatingData.totalClinics,
      icon: Users,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    {
      title: 'Aktif Kullanıcı',
      value: activeTab === 'seeking' ? changeSeekingData.activeUsers : changeCreatingData.activeClinics,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      title: 'Bekleyen Talepler',
      value: activeTab === 'seeking' ? changeSeekingData.pendingRequests : changeCreatingData.pendingOffers,
      icon: Clock,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-gradient-to-r from-orange-500 to-red-600'
    },
    {
      title: 'Tamamlanan İşlemler',
      value: activeTab === 'seeking' ? changeSeekingData.completedRequests : changeCreatingData.completedOffers,
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                <Shield className="w-8 h-8" />
                <span>Admin Panel</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{user?.user_metadata?.name || 'Admin'}</span>
              </div>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Değişim Kontrol Merkezi
          </h1>
          <p className="text-gray-600 text-lg">
            Değişim arayan ve değişim yaratan tarafları kontrol edin ve yönetin
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-200/50">
            <button
              onClick={() => setActiveTab('seeking')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'seeking'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Değişim Arayan Tarafı</span>
            </button>
            <button
              onClick={() => setActiveTab('creating')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'creating'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>Değişim Yaratan Tarafı</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${card.color})` }}>
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl ${card.bgColor} text-white`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Access Credentials */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Erişim Bilgileri
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'seeking' ? 'Değişim Arayan' : 'Değişim Yaratan'} tarafına erişim
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={activeTab === 'seeking' ? changeSeekingData.credentials.username : changeCreatingData.credentials.username}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(activeTab === 'seeking' ? changeSeekingData.credentials.username : changeCreatingData.credentials.username)}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Kopyala
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      value={activeTab === 'seeking' ? changeSeekingData.credentials.password : changeCreatingData.credentials.password}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono pr-12"
                    />
                    <button
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(activeTab === 'seeking' ? changeSeekingData.credentials.password : changeCreatingData.credentials.password)}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Kopyala
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <Unlock className="w-5 h-5 inline mr-2" />
                  Bu Tarafa Erişim Sağla
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Son Aktiviteler</h3>
                <p className="text-gray-600">
                  {activeTab === 'seeking' ? 'Değişim Arayan' : 'Değişim Yaratan'} tarafından
                </p>
              </div>
            </div>

                         <div className="space-y-4">
               {(activeTab === 'seeking' ? changeSeekingData.recentActivity : changeCreatingData.recentActivity).map((activity) => (
                 <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                   <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                   <div className="flex-1">
                     <p className="text-sm font-medium text-gray-900">
                       {'user' in activity ? activity.user : activity.clinic}
                     </p>
                     <p className="text-sm text-gray-600">{activity.action}</p>
                   </div>
                   <span className="text-xs text-gray-500">{activity.time}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h4>
              <p className="text-sm text-gray-600">Kullanıcıları görüntüle ve yönet</p>
            </button>

            <button className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">İstatistikler</h4>
              <p className="text-sm text-gray-600">Detaylı raporları görüntüle</p>
            </button>

            <button className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Mesajlar</h4>
              <p className="text-sm text-gray-600">Mesaj trafiğini kontrol et</p>
            </button>

            <button className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Raporlar</h4>
              <p className="text-sm text-gray-600">Sistem raporlarını görüntüle</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeControl; 