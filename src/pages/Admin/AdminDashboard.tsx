import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings,
  UserPlus,
  Shield,
  Activity,
  TrendingUp,
  Sparkles,
  Heart,
  Star,
  Globe,
  Lock,
  Eye,
  LogOut
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [stats, setStats] = useState([
    {
      title: 'Toplam Kullanıcı',
      value: '–',
      change: '',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Aktif Klinikler',
      value: '–',
      change: '',
      icon: Building,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Bekleyen Talepler',
      value: '–',
      change: '',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Aylık Gelir',
      value: '–',
      change: '',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]);

  useEffect(() => {
    let mounted = true;
    adminService.getAdminStats()
      .then((s) => {
        if (!mounted) return;
        setStats([
          {
            title: 'Toplam Kullanıcı',
            value: s.totalUsers.toLocaleString(),
            change: '',
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Aktif Klinikler',
            value: s.activeClinics.toLocaleString(),
            change: '',
            icon: Building,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Bekleyen Talepler',
            value: s.pendingRequests.toLocaleString(),
            change: '',
            icon: FileText,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Aylık Gelir',
            value: `$${Math.round(s.monthlyRevenue).toLocaleString()}`,
            change: '',
            icon: TrendingUp,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50'
          }
        ]);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const quickActions = [
    {
      title: 'Kullanıcı Yönetimi',
      description: 'Kullanıcıları görüntüle ve yönet',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/users'
    },
    {
      title: 'Klinik Yönetimi',
      description: 'Klinikleri onayla ve yönet',
      icon: Building,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/clinics'
    },
    {
      title: 'Talep Yönetimi',
      description: 'Tüm talepleri görüntüle',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/requests'
    },
    {
      title: 'Mesaj Yönetimi',
      description: 'Kullanıcı mesajlarını yönet',
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/messages'
    },
    {
      title: 'Raporlar',
      description: 'Sistem raporlarını görüntüle',
      icon: BarChart3,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/reports'
    },
    {
      title: 'Sistem Ayarları',
      description: 'Genel ayarları düzenle',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      href: '/admin/settings'
    },
    {
      title: 'Değişim Kontrol',
      description: 'Değişim arayan ve yaratan tarafları yönet',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/change-control'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user_registration',
      message: 'Yeni kullanıcı kaydı: user@example.com',
      time: '2 dakika önce',
      status: 'success',
      icon: UserPlus
    },
    {
      id: '2',
      type: 'clinic_approval',
      message: 'Klinik onayı bekliyor: İstanbul Estetik Merkezi',
      time: '15 dakika önce',
      status: 'pending',
      icon: Building
    },
    {
      id: '3',
      type: 'offer_submitted',
      message: t('notifications.newTreatmentOffer'),
      time: '1 saat önce',
      status: 'info',
      icon: FileText
    },
    {
      id: '4',
      type: 'payment_received',
      message: t('notifications.paymentReceived'),
      time: '3 saat önce',
      status: 'success',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Admin Panel</h1>
                  <p className="text-sm text-gray-600">Sistem Yönetimi</p>
                </div>
              </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Hoş Geldiniz, {user?.user_metadata?.name || 'Admin'}!
          </h2>
          <p className="text-gray-600 text-lg">
            Sistem yönetimi ve izleme paneli. Tüm işlemlerinizi buradan yönetebilirsiniz.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-semibold">{stat.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50">
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span>Hızlı İşlemler</span>
                </h3>
                <p className="text-sm text-gray-600">Sistem yönetimi için hızlı erişim</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200/50 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 bg-white/50 hover:bg-white/80"
                      onClick={() => navigate(action.href)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50">
              <div className="p-6 border-b border-gray-200/50">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span>Son Aktiviteler</span>
                </h3>
                <p className="text-sm text-gray-600">Sistem aktivitelerini takip et</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/50 transition-colors duration-200">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${activity.status === 'success' ? 'from-green-500 to-green-600' : activity.status === 'pending' ? 'from-yellow-500 to-yellow-600' : 'from-blue-500 to-blue-600'} shadow-lg`}>
                        <activity.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;