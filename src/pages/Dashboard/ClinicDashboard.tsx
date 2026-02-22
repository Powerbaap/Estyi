import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  DollarSign,
  User,
  Crown,
  Bell,
  Menu,
  X,
  CheckCircle,
  Activity,
  Clock,
  MessageCircle
} from 'lucide-react';
import ClinicProfile from '../../components/Clinic/ClinicProfile';
import ClinicMembership from '../../components/Clinic/ClinicMembership';
import ClinicNotificationCenter from '../../components/Notifications/ClinicNotificationCenter';
import ClinicProcedures from '../../components/Clinic/ClinicProcedures';
import ClinicMessages from '../../components/Clinic/ClinicMessages';
import { supabase } from '../../lib/supabaseClient';

const ClinicDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'fixedPrices' | 'profile' | 'membership'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null);
  const [clinicOffers, setClinicOffers] = useState<any[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'auto' | 'accepted' | 'active' | 'expired'>('auto');
  const [clinicName, setClinicName] = useState('');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user) return;
      try {
        const email = user.email;
        const { data: clinic } = await supabase
          .from('clinics')
          .select('id, specialties')
          .eq('email', email)
          .maybeSingle();

        if (!clinic?.id) return;

        const { data: prices } = await supabase
          .from('clinic_price_list')
          .select('id')
          .eq('clinic_id', clinic.id)
          .limit(1);

        if (clinic.specialties?.length > 0 && (!prices || prices.length === 0)) {
          setActiveTab('fixedPrices');
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkFirstLogin();
  }, [user]);

  useEffect(() => {
    const loadClinicInfo = async () => {
      if (!user) return;
      const clinicId = (user as any)?.user_metadata?.clinic_id || user.id;
      try {
        const { data } = await supabase
          .from('clinics')
          .select('name')
          .or(`id.eq.${clinicId},email.eq.${user.email}`)
          .maybeSingle();
        if (data) {
          setClinicName(data.name || user.email || '');
          setPlanName('Standart Plan');
        } else {
          setClinicName((user as any)?.user_metadata?.name || user.email || '');
          setPlanName('Standart Plan');
        }
      } catch {
        setClinicName((user as any)?.user_metadata?.name || user.email || '');
        setPlanName('Standart Plan');
      }
    };
    loadClinicInfo();
  }, [user]);

  useEffect(() => {
    const loadClinicOffers = async () => {
      if (!user) return;
      try {
        const clinicId = (user as any)?.user_metadata?.clinic_id || (user as any)?.id;
        if (!clinicId) return;
        setOffersLoading(true);
        const { data, error } = await supabase
          .from('offers')
          .select('*, requests:requests(user_id, sessions, region, expires_at, country, city, procedure_name, procedure_key, status)')
          .eq('clinic_id', clinicId)
          .order('created_at', { ascending: false });
        if (error) {
          console.error(error);
          setClinicOffers([]);
          return;
        }
        setClinicOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setClinicOffers([]);
      } finally {
        setOffersLoading(false);
      }
    };
    loadClinicOffers();
  }, [user]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('clinicDashboard.menu.dashboard'), count: null },
    { id: 'messages', icon: MessageCircle, label: t('messages.title'), count: null },
    { id: 'fixedPrices', icon: DollarSign, label: t('clinicDashboard.menu.fixedPrices'), count: null },
    { id: 'profile', icon: User, label: t('clinicDashboard.menu.profile'), count: null },
    { id: 'membership', icon: Crown, label: t('clinicDashboard.menu.membership'), count: null }
  ];

  const now = new Date();

  const pendingOffers = clinicOffers.filter((offer) => offer.status === 'sent');
  const acceptedOffers = clinicOffers.filter((offer) => offer.status === 'accepted');
  const activePendingOffers = pendingOffers.filter((offer) => {
    const expiresAt = offer.requests?.expires_at ? new Date(offer.requests.expires_at) : null;
    if (!expiresAt) return true;
    return expiresAt > now;
  });
  const expiredOffers = clinicOffers.filter((offer) => {
    const req = offer.requests;
    const expiresAt = req?.expires_at ? new Date(req.expires_at) : null;
    if (req?.status === 'expired') return true;
    if (expiresAt && expiresAt < now) return true;
    return false;
  });

  const stats = [
    {
      key: 'total',
      label: t('clinicDashboard.totalOffers'),
      value: clinicOffers.length,
      icon: DollarSign,
      color: 'blue'
    },
    {
      key: 'accepted',
      label: t('clinicDashboard.accepted'),
      value: acceptedOffers.length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      key: 'pending',
      label: t('clinicDashboard.pending'),
      value: activePendingOffers.length,
      icon: Clock,
      color: 'yellow'
    },
    {
      key: 'expired',
      label: t('clinicDashboard.expired'),
      value: expiredOffers.length,
      icon: Clock,
      color: 'gray'
    }
  ];

  const getProcedureName = (offer: any) => {
    const key = offer.requests?.procedure_name || offer.requests?.procedure_key || '';
    if (!key) return 'Bilinmeyen İşlem';
    const translationKey = `procedures.${key}`;
    const translated = t(translationKey);
    return translated && translated !== translationKey ? translated : key;
  };

  const getUserDisplay = (offer: any) => {
    const userId = offer.requests?.user_id || '';
    if (!userId) return t('clinicDashboard.user');
    const shortId = userId.slice(-4) || '????';
    return `Kullanıcı ${shortId}`;
  };

  const getPriceText = (offer: any) => {
    const price = offer.price;
    const min = offer.price_min;
    const max = offer.price_max;
    if (price) return `${price} USD`;
    if (min && max && min !== max) return `${min} - ${max} USD`;
    if (min) return `${min} USD`;
    if (max) return `${max} USD`;
    return '-';
  };

  const getRemainingTime = (expiresAt?: string | null) => {
    if (!expiresAt) return '-';
    const target = new Date(expiresAt);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return 'Süresi doldu';
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
    const dayPart = days > 0 ? `${days} gün ` : '';
    const hourPart = `${hours} saat`;
    return `${dayPart}${hourPart} kaldı`;
  };

  const handleStatClick = (key: string) => {
    if (key === 'total') {
      setActiveDashboardTab('auto');
    } else if (key === 'accepted') {
      setActiveDashboardTab('accepted');
    } else if (key === 'pending') {
      setActiveDashboardTab('active');
    } else if (key === 'expired') {
      setActiveDashboardTab('expired');
    }
  };

  const renderDashboardTabContent = () => {
    if (offersLoading) {
      return (
        <div className="py-8 text-center text-gray-500">
          {t('clinicDashboard.loading')}
        </div>
      );
    }

    if (clinicOffers.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          {t('clinicDashboard.noOffers')}
        </div>
      );
    }

    if (activeDashboardTab === 'accepted') {
      const list = acceptedOffers;
      return (
        <div className="space-y-4">
          {list.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {getProcedureName(offer)}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                    {getUserDisplay(offer)}
                  </span>
                  {offer.requests?.country && offer.requests?.city && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700">
                      {offer.requests.country} / {offer.requests.city}
                    </span>
                  )}
                  {offer.requests?.sessions && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-700">
                      {offer.requests.sessions} seans
                    </span>
                  )}
                  {offer.requests?.region && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700">
                      {offer.requests.region}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {getPriceText(offer)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('clinicDashboard.accepted')} {new Date(offer.updated_at || offer.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate('/messages', {
                      state: {
                        messageType: 'clinic_contact',
                        fromOfferId: offer.id,
                        targetUserId: offer.requests?.user_id
                      }
                    })
                  }
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaj Gönder
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeDashboardTab === 'active') {
      const list = activePendingOffers;
      return (
        <div className="space-y-4">
          {list.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {getProcedureName(offer)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {getUserDisplay(offer)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getLocation(offer)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {getPriceText(offer)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    {getRemainingTime(offer.requests?.expires_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeDashboardTab === 'expired') {
      const list = expiredOffers;
      return (
        <div className="space-y-4">
          {list.map((offer) => (
            <div
              key={offer.id}
              className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 opacity-75"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {getProcedureName(offer)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {getUserDisplay(offer)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {getLocation(offer)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {getPriceText(offer)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('clinicDashboard.expired')} {offer.requests?.expires_at ? new Date(offer.requests.expires_at).toLocaleDateString('tr-TR') : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const list = pendingOffers;
    return (
      <div className="space-y-4">
        {list.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {getProcedureName(offer)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {getUserDisplay(offer)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getLocation(offer)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {getPriceText(offer)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(offer.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'fixedPrices') {
      return <ClinicProcedures />;
    }
    if (activeTab === 'profile') {
      return <ClinicProfile />;
    }
    if (activeTab === 'membership') {
      return <ClinicMembership />;
    }
    if (activeTab === 'messages') {
      return <ClinicMessages />;
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <button
              key={stat.key}
              onClick={() => handleStatClick(stat.key)}
              className={`group relative bg-white rounded-lg shadow-sm border-2 p-4 text-left hover:shadow-md transition-all duration-300 overflow-hidden ${
                activeDashboardTab === (stat.key === 'total' ? 'auto' : stat.key === 'pending' ? 'active' : (stat.key as any))
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {renderDashboardTabContent()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:absolute lg:inset-0 lg:z-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">{t('clinicDashboard.sidebarTitle')}</span>
          </div>
                      <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className={`text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold ${
                    activeTab === item.id ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full lg:ml-64">
        {/* Enhanced Dashboard Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                ref={notificationButtonRef}
                onClick={() => setNotificationCenterOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-2 lg:p-3">
          <div className="w-full">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {t('clinicDashboard.welcome', { name: clinicName })}
                </h1>
                <p className="text-blue-100">
                  {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{planName}</p>
              </div>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Notification Center */}
        <ClinicNotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        anchorRef={notificationButtonRef}
        clinicSpecialties={['Rhinoplasty', 'Hair Transplant', 'Breast Surgery']}
      />
    </div>
  );
};

export default ClinicDashboard;
