import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  User, 
  Users,
  Crown,
  Bell,
  Menu,
  X,
  TrendingUp,
  CheckCircle,
  Activity,
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign as DollarIcon,
  AlertCircle
} from 'lucide-react';
import ClinicRequests from '../../components/Clinic/ClinicRequests';
import ClinicProfile from '../../components/Clinic/ClinicProfile';
import ClinicMembership from '../../components/Clinic/ClinicMembership';
import ClinicNotificationCenter from '../../components/Notifications/ClinicNotificationCenter';
import ClinicProcedures from '../../components/Clinic/ClinicProcedures';
import ClinicMessages from '../../components/Clinic/ClinicMessages';
import { supabase } from '../../lib/supabaseClient';
import { requestService, offerService, messageService } from '../../services/api';
import { getProcedure } from '../../data/procedureCategories';

const ClinicDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProcedure] = useState('all');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null);
  const [clinicRequests, setClinicRequests] = useState<any[]>([]);
  const [clinicOffers, setClinicOffers] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const getProcedureDisplayName = useCallback(
    (procedureKey?: string, procedureName?: string) => {
      if (procedureName) return procedureName;
      if (!procedureKey) return '';
      const proc = getProcedure(procedureKey);
      if (!proc) return procedureKey;
      const key = `procedureCategories.procedures.${proc.key}`;
      const translated = t(key);
      return translated && translated !== key ? translated : proc.name;
    },
    [t]
  );

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
    if (!user?.id) {
      setClinicRequests([]);
      setClinicOffers([]);
      return;
    }
    const clinicId = user.id;
    const loadData = async () => {
      try {
        setIsDataLoading(true);
        const results = await Promise.allSettled([
          requestService.getClinicDashboardRequests(clinicId),
          offerService.getClinicOffers(clinicId),
        ]);
        const requestsData = results[0].status === 'fulfilled' ? results[0].value : [];
        const offersData = results[1].status === 'fulfilled' ? results[1].value : [];
        setClinicRequests(Array.isArray(requestsData) ? requestsData : []);
        setClinicOffers(Array.isArray(offersData) ? offersData : []);
      } catch (e) {
        console.error(e);
        setClinicRequests([]);
        setClinicOffers([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, [user]);

  const dashboardData = useMemo(() => {
    const now = new Date();

    const normalizedRequests = (clinicRequests || []).map((row: any) => {
      const createdAt = row.created_at ? new Date(row.created_at) : new Date();
      const status = row.status || 'active';
      const procedureKey =
        row.procedure_key || row.procedure_category || row.procedureKey;
      const procedureNameRaw = row.procedure_name || row.procedure;
      const procedureName = getProcedureDisplayName(
        procedureKey,
        procedureNameRaw
      );
      const expiresAt =
        row.expires_at && typeof row.expires_at === 'string'
          ? new Date(row.expires_at)
          : row.expires_at instanceof Date
          ? row.expires_at
          : new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      return {
        id: row.id,
        procedureName,
        status,
        createdAt,
        expiresAt,
        userId: row.user_id || '',
      };
    });

    const normalizedOffers = (clinicOffers || []).map((row: any) => {
      const createdAt = row.created_at ? new Date(row.created_at) : new Date();
      const status = (row.status || 'sent').toString().toLowerCase();
      const offerType = row.offer_type || row.offerType || null;
      const source = (row.source || row.offer_source || '').toString().toLowerCase();
      const requestRow = row.requests || row.request || {};
      const procedureKey =
        requestRow.procedure_key ||
        requestRow.procedure_category ||
        requestRow.procedureKey;
      const procedureNameRaw =
        requestRow.procedure_name || requestRow.procedure;
      const procedureName = getProcedureDisplayName(
        procedureKey,
        procedureNameRaw
      );
      return {
        id: row.id,
        requestId: row.request_id || requestRow.id,
        status,
        offerType,
        source,
        priceUsd: row.price_usd || row.offer_price_usd || null,
        createdAt,
        procedureName,
        userId: requestRow.user_id || '',
      };
    });

    const offerByRequestId = new Map<string, any>();
    normalizedOffers.forEach((offer) => {
      if (offer.requestId) {
        offerByRequestId.set(offer.requestId, offer);
      }
    });

    const acceptedOffers = normalizedOffers.filter(
      (offer) => offer.status === 'accepted'
    );

    const autoOffersWaiting = normalizedOffers.filter(
      (offer) => offer.status === 'sent' && offer.source === 'auto'
    );

    const activeRequestsNeedingOffer = normalizedRequests.filter((request) => {
      const expiresAt = request.expiresAt as Date;
      return expiresAt > now && !offerByRequestId.has(request.id);
    });

    const passiveRequests = normalizedRequests.filter((request) => {
      const expiresAt = request.expiresAt as Date;
      return expiresAt <= now;
    });

    return {
      normalizedRequests,
      normalizedOffers,
      offerByRequestId,
      acceptedOffers,
      autoOffersWaiting,
      activeRequestsNeedingOffer,
      passiveRequests,
    };
  }, [clinicRequests, clinicOffers, getProcedureDisplayName]);

  const {
    normalizedRequests,
    normalizedOffers,
    acceptedOffers,
    autoOffersWaiting,
    activeRequestsNeedingOffer,
    passiveRequests,
  } = dashboardData;

  const totalRequestsCount = normalizedRequests.length;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('clinicDashboard.menu.dashboard'), count: null },
    { id: 'requests', icon: FileText, label: t('clinicDashboard.menu.requests'), count: totalRequestsCount },
    { id: 'fixedPrices', icon: DollarIcon, label: t('clinicDashboard.menu.fixedPrices'), count: null },
    { id: 'profile', icon: User, label: t('clinicDashboard.menu.profile'), count: null },
    { id: 'membership', icon: Crown, label: t('clinicDashboard.menu.membership'), count: null }
  ];

  const stats = [
    { 
      label: 'Otomatik Teklifler', 
      value: String(autoOffersWaiting.length),
      icon: DollarSign, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      trend: 'up'
    },
    { 
      label: 'Kabul Edilen Teklifler', 
      value: String(acceptedOffers.length),
      icon: CheckCircle, 
      color: 'green',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      trend: 'up'
    },
    { 
      label: 'Aktif Talepler (Beklemede)', 
      value: String(activeRequestsNeedingOffer.length),
      icon: FileText, 
      color: 'purple',
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100',
      trend: 'up'
    },
    { 
      label: 'Pasif Talepler (Süresi Dolmuş)', 
      value: String(passiveRequests.length),
      icon: AlertCircle, 
      color: 'orange',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      trend: 'up'
    }
  ];

  const handleStatClick = () => {
    setActiveTab('requests');
    setFilterStatus('all');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <ClinicRequests 
            filterStatus={filterStatus} 
            filterProcedure={filterProcedure}
            clinicSpecialties={['burun_estetigi_rinoplasti', 'sac_ekimi_fue', 'gogus_buyutme']}
            clinicBranchCity={'İstanbul'}
          />
        );
      case 'messages':
        return <ClinicMessages selectedConversationId={selectedConversationId} />;
      case 'fixedPrices':
        return <ClinicProcedures />;
      case 'profile':
        return <ClinicProfile />;
      case 'membership':
        return <ClinicMembership />;
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{t('clinicDashboard.calendarTitle')}</h2>
                  <p className="text-gray-600 mt-1">{t('clinicDashboard.calendarSubtitle')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {t('clinicDashboard.today')}
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    {t('clinicDashboard.thisWeek')}
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    {t('clinicDashboard.thisMonth')}
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {[t('clinicDashboard.monday'), t('clinicDashboard.tuesday'), t('clinicDashboard.wednesday'), t('clinicDashboard.thursday'), t('clinicDashboard.friday'), t('clinicDashboard.saturday'), t('clinicDashboard.sunday')].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i + 1;
                  const hasAppointment = [5, 12, 15, 22, 28].includes(day);
                  const isToday = day === new Date().getDate();
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-3 text-center text-sm border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        isToday ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="relative">
                        <span className={isToday ? 'font-bold text-blue-600' : 'text-gray-700'}>
                          {day}
                        </span>
                        {hasAppointment && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.confirmedAppointments')}</h3>
                
                {[
                  {
                    id: '1',
                    patientName: 'Ahmet Yılmaz',
                    procedure: t('procedures.rhinoplasty'),
                    date: '15 ' + t('clinicDashboard.august') + ' 2025',
                    time: '14:00',
                    status: 'confirmed',
                    clinic: t('clinicDashboard.istanbulAestheticCenter')
                  },
                  {
                    id: '2',
                    patientName: 'Fatma Demir',
                    procedure: t('procedures.hairTransplant'),
                    date: '22 ' + t('clinicDashboard.august') + ' 2025',
                    time: '10:30',
                    status: 'confirmed',
                    clinic: t('clinicDashboard.istanbulAestheticCenter')
                  },
                  {
                    id: '3',
                    patientName: 'Mehmet Kaya',
                    procedure: t('procedures.breastSurgery'),
                    date: '28 ' + t('clinicDashboard.august') + ' 2025',
                    time: '16:00',
                    status: 'confirmed',
                    clinic: t('clinicDashboard.istanbulAestheticCenter')
                  }
                ].map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">{appointment.procedure}</p>
                        <p className="text-xs text-gray-500">{appointment.clinic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('clinicDashboard.confirmed')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{t('clinicDashboard.welcome', { name: ((user as any)?.user_metadata?.name) || t('clinicDashboard.clinic') })}</h1>
                  <p className="text-blue-100">{t('clinicDashboard.today')} {new Date().toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{activeRequestsNeedingOffer.length}</p>
                    <p className="text-blue-200 text-sm">{t('clinicDashboard.activeRequest')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{autoOffersWaiting.length}</p>
                    <p className="text-blue-200 text-sm">{t('clinicDashboard.pendingOffer')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat, index) => {
                return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden"
                  onClick={handleStatClick}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-emerald-100' :
                      stat.color === 'purple' ? 'bg-violet-100' : 'bg-amber-100'
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-emerald-600' :
                        stat.color === 'purple' ? 'text-violet-600' : 'text-amber-600'
                      }`} />
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Otomatik Teklif Verilen Talepler</h3>
                    <p className="text-sm text-gray-500 mt-1">Bu klinik için otomatik teklif üretilen talepler</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {autoOffersWaiting.length}
                  </span>
                </div>
                {isDataLoading ? (
                  <p className="text-sm text-gray-500">Veriler yükleniyor...</p>
                ) : autoOffersWaiting.length === 0 ? (
                  <p className="text-sm text-gray-500">Henüz otomatik teklif verdiğiniz talep yok.</p>
                ) : (
                  <div className="space-y-3">
                    {autoOffersWaiting.slice(0, 5).map((offer) => (
                      <div
                        key={offer.id}
                        className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                        onClick={() => setActiveTab('requests')}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-100">
                          <DollarIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {offer.procedureName || '-'}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                              Otomatik
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {offer.userId || ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {offer.createdAt.toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Kabul Edilen Talepler</h3>
                    <p className="text-sm text-gray-500 mt-1">Teklifinizin kabul edildiği talepler</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {acceptedOffers.length}
                  </span>
                </div>
                {isDataLoading ? (
                  <p className="text-sm text-gray-500">Veriler yükleniyor...</p>
                ) : acceptedOffers.length === 0 ? (
                  <p className="text-sm text-gray-500">Henüz kabul edilen teklifiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {acceptedOffers.slice(0, 5).map((offer) => (
                      <div
                        key={offer.id}
                        className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                        onClick={() => setActiveTab('requests')}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 space-x-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {offer.procedureName || '-'}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {offer.userId || ''}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                              Kabul edildi
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {offer.createdAt.toLocaleString('tr-TR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (!user?.id || !offer.userId) return;
                                try {
                                  const conversationId = await messageService.findOrCreateConversation(
                                    user.id,
                                    offer.userId
                                  );
                                  setSelectedConversationId(conversationId);
                                  setActiveTab('messages');
                                } catch (err) {
                                  console.error('Konuşma başlatılamadı', err);
                                }
                              }}
                              className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Konuşma Başlat
                            </button>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Aktif Talepler (Beklemede)</h3>
                    <p className="text-sm text-gray-500 mt-1">Teklif vermenizi bekleyen aktif talepler</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {activeWaitingRequests.length}
                  </span>
                </div>
                {isDataLoading ? (
                  <p className="text-sm text-gray-500">Veriler yükleniyor...</p>
                ) : activeWaitingRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">Bekleyen aktif talebiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {activeWaitingRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                        onClick={() => setActiveTab('requests')}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {request.procedureName || '-'}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex-shrink-0">
                              Beklemede
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {request.userId || ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {request.createdAt.toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Pasif Talepler (Süresi Dolmuş)</h3>
                    <p className="text-sm text-gray-500 mt-1">SLA süresi veya geçerlilik süresi dolan talepler</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    {passiveExpiredRequests.length}
                  </span>
                </div>
                {isDataLoading ? (
                  <p className="text-sm text-gray-500">Veriler yükleniyor...</p>
                ) : passiveExpiredRequests.length === 0 ? (
                  <p className="text-sm text-gray-500">Süresi dolmuş talebiniz bulunmuyor.</p>
                ) : (
                  <div className="space-y-3">
                    {passiveExpiredRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                        onClick={() => setActiveTab('requests')}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {request.procedureName || '-'}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex-shrink-0">
                              Süresi dolmuş
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {request.userId || ''}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {request.createdAt.toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('clinicDashboard.quickActions')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{t('clinicDashboard.reports')}</p>
                    <p className="text-sm text-gray-600">{t('clinicDashboard.performanceAnalysis')}</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveTab('calendar')}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{t('clinicDashboard.calendar')}</p>
                    <p className="text-sm text-gray-600">{t('clinicDashboard.viewAppointments')}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
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
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                  {(user as any)?.user_metadata?.name || t('clinicDashboard.istanbulAestheticCenter')}
                  </h1>
                <p className="text-sm text-gray-600">{t('clinicDashboard.medicalDashboard')}</p>
              </div>
            </div>
            
            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4">
              <button
                ref={notificationButtonRef}
                onClick={() => setNotificationCenterOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">
                     {((user as any)?.user_metadata?.name || 'K').charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900">
                     {(user as any)?.user_metadata?.name || t('clinicDashboard.testClinic')}
                  </p>
                  <p className="text-xs text-gray-500">{t('clinicDashboard.premiumMember')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-2 lg:p-3">
          <div className="w-full">
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
