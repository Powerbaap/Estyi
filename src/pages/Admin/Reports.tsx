import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building,
  FileText,
  Globe,
  Shield,
  Download,
  Calendar,
  LogOut
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { adminService } from '../../services/adminService';

const Reports: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [stats, setStats] = useState({ totalUsers: 0, activeClinics: 0, totalRequests: 0, totalCountries: 0 });
  const [usersByCountry, setUsersByCountry] = useState<{country: string, count: number}[]>([]);
  const [clinicsByCountry, setClinicsByCountry] = useState<{country: string, count: number}[]>([]);
  const [requestsByProcedure, setRequestsByProcedure] = useState<{procedure: string, count: number}[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const [usersRes, clinicsRes, requestsRes] = await Promise.all([
          supabase.from('users').select('id, role, created_at', { count: 'exact' }),
          supabase.from('clinics').select('id, location, countries, status', { count: 'exact' }),
          supabase.from('requests').select('id, procedure_key, user_id, status, countries, created_at', { count: 'exact' }),
        ]);

        const users = usersRes.data || [];
        const clinics = clinicsRes.data || [];
        const requests = requestsRes.data || [];

        const activeUsers = users.filter((u: any) => u.role === 'user').length;
        const activeClinics = clinics.filter((c: any) => c.status === 'active').length;

        const clinicCountryMap: Record<string, number> = {};
        clinics.forEach((c: any) => {
          const country = c.location?.split('/')[0]?.trim() || 'Bilinmiyor';
          clinicCountryMap[country] = (clinicCountryMap[country] || 0) + 1;
        });
        const clinicsByCountryArr = Object.entries(clinicCountryMap)
          .map(([country, count]) => ({ country, count: count as number }))
          .sort((a, b) => b.count - a.count);

        const procMap: Record<string, number> = {};
        requests.forEach((r: any) => {
          const proc = r.procedure_key || 'Bilinmiyor';
          procMap[proc] = (procMap[proc] || 0) + 1;
        });
        const requestsByProc = Object.entries(procMap)
          .map(([procedure, count]) => ({ procedure, count: count as number }))
          .sort((a, b) => b.count - a.count);

        const uniqueCountries = new Set<string>();
        clinics.forEach((c: any) => {
          if (Array.isArray(c.countries)) {
            c.countries.forEach((co: string) => uniqueCountries.add(co));
          }
        });

        setStats({
          totalUsers: activeUsers,
          activeClinics,
          totalRequests: requests.length,
          totalCountries: uniqueCountries.size,
        });
        setClinicsByCountry(clinicsByCountryArr);
        setRequestsByProcedure(requestsByProc);
        setRecentRequests(requests.slice(0, 10));
      } catch (err) {
        console.error('Rapor verileri yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [selectedPeriod]);

  const handleDownloadReport = (type: string) => {
    // Burada gerçek rapor indirme işlemi yapılacak
    alert(t('auth.reportDownloading', { type }));
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-500">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Aktif Klinikler</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeClinics}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-500">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Talep</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-orange-500">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ülke Sayısı</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCountries}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Klinik Dağılımı (Ülkelere Göre) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Klinik Dağılımı (Ülkelere Göre)</h3>
                  <p className="text-sm text-gray-600">Kliniklerin ülkeler bazında dağılımı</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {clinicsByCountry.map((row, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{row.country}</span>
                        </div>
                        <div className="text-sm text-gray-700">{row.count}</div>
                      </div>
                    ))}
                    {clinicsByCountry.length === 0 && (
                      <div className="text-sm text-gray-500">Veri bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Bazlı Talepler */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">İşlem Bazlı Talepler</h3>
                  <p className="text-sm text-gray-600">Hangi işlemlere daha çok talep var?</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {requestsByProcedure.map((row, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{row.procedure}</span>
                        </div>
                        <div className="text-sm text-gray-700">{row.count}</div>
                      </div>
                    ))}
                    {requestsByProcedure.length === 0 && (
                      <div className="text-sm text-gray-500">Veri bulunamadı</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Yer ayırıcı: recentRequests ileride kullanılabilir */}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports; 
