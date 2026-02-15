import React, { useState } from 'react';
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
  DollarSign as DollarIcon
} from 'lucide-react';
import ClinicRequests from '../../components/Clinic/ClinicRequests';
import ClinicOffers from '../../components/Clinic/ClinicOffers';
import ClinicProfile from '../../components/Clinic/ClinicProfile';
import ClinicMembership from '../../components/Clinic/ClinicMembership';
import ClinicNotificationCenter from '../../components/Notifications/ClinicNotificationCenter';
import ClinicProcedures from '../../components/Clinic/ClinicProcedures';

const ClinicDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProcedure] = useState('all');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('clinicDashboard.menu.dashboard'), count: null },
    { id: 'requests', icon: FileText, label: t('clinicDashboard.menu.requests'), count: 12 },
    { id: 'offers', icon: DollarSign, label: t('clinicDashboard.menu.offers'), count: 8 },
    { id: 'fixedPrices', icon: DollarIcon, label: t('clinicDashboard.menu.fixedPrices'), count: null },
    { id: 'profile', icon: User, label: t('clinicDashboard.menu.profile'), count: null },
    { id: 'membership', icon: Crown, label: t('clinicDashboard.menu.membership'), count: null }
  ];

  const stats = [
    { 
      label: t('clinicDashboard.stats.totalRequests'), 
      value: '24', 
      change: '+12%', 
      changeType: 'increase',
      icon: FileText, 
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      trend: 'up'
    },
    { 
      label: t('clinicDashboard.stats.activeOffers'), 
      value: '8', 
      change: '+5%', 
      changeType: 'increase',
      icon: DollarSign, 
      color: 'green',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      trend: 'up'
    },
    { 
      label: t('clinicDashboard.stats.acceptedOffers'), 
      value: '16', 
      change: '+25%', 
      changeType: 'increase',
      icon: CheckCircle, 
      color: 'purple',
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100',
      trend: 'up'
    },
    { 
      label: t('clinicDashboard.stats.responseRate'), 
      value: '94%', 
      change: '+3%', 
      changeType: 'increase',
      icon: TrendingUp, 
      color: 'orange',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      trend: 'up'
    }
  ];

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'totalRequests':
        setActiveTab('requests');
        break;
      case 'activeOffers':
        setActiveTab('offers');
        setFilterStatus('pending');
        break;
      case 'acceptedOffers':
        setActiveTab('offers');
        setFilterStatus('accepted');
        break;
      case 'responseRate':
        setActiveTab('dashboard');
        break;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <ClinicRequests 
          filterStatus={filterStatus} 
          filterProcedure={filterProcedure}
          clinicSpecialties={['burun_estetigi_rinoplasti', 'sac_ekimi_fue', 'gogus_buyutme']}
          clinicBranchCity={'İstanbul'}
        />;
      case 'offers':
        return <ClinicOffers filterStatus={filterStatus} />;
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
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-blue-200 text-sm">{t('clinicDashboard.activeRequest')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-blue-200 text-sm">{t('clinicDashboard.pendingOffer')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat, index) => {
                const statKey = index === 0 ? 'totalRequests' :
                               index === 1 ? 'activeOffers' :
                               index === 2 ? 'acceptedOffers' : 'responseRate';
                
                return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden"
                  onClick={() => handleStatClick(statKey)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} {t('clinicDashboard.fromLastMonth')}
                      </p>
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
              {/* Recent Requests */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{t('clinicDashboard.recentRequests')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('clinicDashboard.last24Hours')}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('requests')}
                    className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>{t('clinicDashboard.viewAll')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[t('procedures.rhinoplasty') + ' ' + t('clinicDashboard.request'), t('procedures.hairTransplant') + ' ' + t('clinicDashboard.request'), t('procedures.breastSurgery') + ' ' + t('clinicDashboard.request'), t('procedures.faceLift') + ' ' + t('clinicDashboard.request'), t('procedures.liposuction') + ' ' + t('clinicDashboard.request')].map((procedure, i) => {
                    const request = {
                      id: `${t('clinicDashboard.user')}123${5+i}`,
                      procedure: procedure,
                      time: `${i+1} ${t('clinicDashboard.hoursAgo')}`,
                      status: 'new',
                      priority: i < 2 ? 'high' : i < 4 ? 'medium' : 'low'
                    };
                    return request;
                  }).map((request, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={() => setActiveTab('requests')}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        request.priority === 'high' ? 'bg-red-100' :
                        request.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          request.priority === 'high' ? 'text-red-600' :
                          request.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">{request.id}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex-shrink-0">
                            {t('clinicDashboard.new')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{request.procedure}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {request.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Offers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{t('clinicDashboard.recentOffers')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('clinicDashboard.last24HoursOffers')}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('offers')}
                    className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>{t('clinicDashboard.viewAll')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { amount: '$3,500', procedure: t('procedures.hairTransplant'), user: t('clinicDashboard.user') + '5679', time: `2 ${t('clinicDashboard.hoursAgo')}`, status: 'accepted' },
                    { amount: '$4,200', procedure: t('procedures.rhinoplasty'), user: t('clinicDashboard.user') + '5680', time: `4 ${t('clinicDashboard.hoursAgo')}`, status: 'pending' },
                    { amount: '$6,800', procedure: t('procedures.breastSurgery'), user: t('clinicDashboard.user') + '5681', time: `6 ${t('clinicDashboard.hoursAgo')}`, status: 'pending' },
                    { amount: '$5,500', procedure: t('procedures.faceLift'), user: t('clinicDashboard.user') + '5682', time: `8 ${t('clinicDashboard.hoursAgo')}`, status: 'accepted' },
                    { amount: '$3,200', procedure: t('procedures.liposuction'), user: t('clinicDashboard.user') + '5683', time: `12 ${t('clinicDashboard.hoursAgo')}`, status: 'pending' }
                  ].map((offer, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200"
                      onClick={() => setActiveTab('offers')}
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">{offer.amount} - {offer.procedure}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {offer.status === 'accepted' ? t('clinicDashboard.accepted') : t('clinicDashboard.pending')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{offer.user}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {offer.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
