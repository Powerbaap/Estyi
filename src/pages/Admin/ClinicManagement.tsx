import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  X,
  LogOut,
  Lock,
  Globe,
  FileText,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';
import { signCertificateFiles } from '../../services/storage';
import { adminService } from '../../services/adminService';
import { supabase } from '../../lib/supabaseClient';
import { PROCEDURE_CATEGORIES } from '../../data/procedureCategories';
import { useTranslation } from 'react-i18next';
import { STORAGE_BUCKETS } from '../../config/storageBuckets';

const ClinicManagement: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [clinics, setClinics] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [approving, setApproving] = useState(false);
  
  const [newClinic, setNewClinic] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    specialties: [] as string[]
  });

  const [editingClinic, setEditingClinic] = useState<any>(null);

  // Tüm procedure key'lerini al
  const allProcedureKeys = PROCEDURE_CATEGORIES.flatMap(cat => 
    cat.procedures.map(proc => ({ key: proc.key, name: proc.name }))
  );

  // Belge türü algılama yardımcıları
  const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
  const isPdfUrl = (url: string) => /\.pdf(\?.*)?$/i.test(url);
  const getCertificateUrls = (app: any) => {
    const files = Array.isArray(app?.certificate_files) ? app.certificate_files : [];
    return files.map((f: any) => f?.url).filter(Boolean);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Başvuruları yükle
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingApps(true);
        const data = await adminService.getClinicApplications();
        const apps = Array.isArray(data) ? data : [];
        // Sertifika URL'lerini imzala
        const signedApps = await Promise.all(apps.map(async (app: any) => {
          const files = Array.isArray(app.certificate_files) ? app.certificate_files : [];
          const legacyUrls = Array.isArray(app.certificate_urls) ? app.certificate_urls : [];
          const normalized = files.length
            ? files
            : legacyUrls.map((url: string) => ({
                path: '',
                bucket: STORAGE_BUCKETS.CERTIFICATES,
                mime: 'application/octet-stream',
                size: 0,
                url
              }));
          const signed = await signCertificateFiles(normalized, 3600);
          return { ...app, certificate_files: signed };
        }));
        setApplications(signedApps);
      } catch (err) {
        console.error('Başvurular yüklenemedi:', err);
      } finally {
        setLoadingApps(false);
      }
    };
    load();
  }, []);

  // Klinikleri yükle
  useEffect(() => {
    const load = async () => {
      try {
        const rows = await adminService.getClinics();
        setClinics(Array.isArray(rows) ? rows : []);
      } catch (err) {
        console.error('Klinikler yüklenemedi:', err);
      }
    };
    load();
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.clinic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && (!app.status || app.status === 'pending')) ||
                         (statusFilter === 'active' && app.status === 'approved') ||
                         (statusFilter === 'rejected' && app.status === 'rejected');
    return matchesSearch && matchesStatus;
  });

  // Yeni klinik oluştur
  const handleCreateClinic = async () => {
    if (!newClinic.name || !newClinic.email) {
      alert('Lütfen tüm zorunlu alanları doldurun (Ad, E-posta)');
      return;
    }

    try {
      // Invite user via email (admin yetkisiyle backend üzerinden değil, client üzerinden de invite edilebilir ama 
      // spam riski ve yetki nedeniyle backend daha güvenli. Ancak mevcut yapıya uygun olarak inviteUserByEmail kullanıyoruz.)
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(newClinic.email, {
        data: { role: 'clinic', name: newClinic.name },
        redirectTo: `${window.location.origin}/auth/callback`
      });

      if (authError) throw authError;

      const clinicAuthId = authData.user.id;

      // Users tablosuna ekle
      const randomUserId = Math.random().toString(36).substring(2, 10).toUpperCase();
      await supabase.from('users').upsert({
        id: clinicAuthId,
        user_id: randomUserId,
        email: newClinic.email,
        name: newClinic.name,
        role: 'clinic',
        is_verified: true
      });

      // Clinics tablosuna ekle
      const { error: clinicError } = await supabase.from('clinics').upsert({
        id: clinicAuthId,
        name: newClinic.name,
        email: newClinic.email,
        phone: newClinic.phone || '',
        website: newClinic.website || '',
        location: newClinic.location || '',
        status: 'active',
        rating: 0,
        reviews: 0,
        specialties: newClinic.specialties || []
      });

      if (clinicError) throw clinicError;

      alert('Klinik başarıyla oluşturuldu ve davet emaili gönderildi!');
      setShowCreateModal(false);
      setNewClinic({
        name: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        specialties: []
      });
      
      // Listeyi yenile
      const refreshed = await adminService.getClinics();
      setClinics(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      console.error('Klinik oluşturma hatası:', err);
      alert('Klinik oluşturulamadı: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const handleSpecialtyToggle = (specialty: string, isNew: boolean = true) => {
    if (isNew) {
      setNewClinic(prev => ({
        ...prev,
        specialties: prev.specialties.includes(specialty)
          ? prev.specialties.filter(s => s !== specialty)
          : [...prev.specialties, specialty]
      }));
    } else {
      setEditingClinic((prev: any) => ({
        ...prev,
        specialties: prev.specialties.includes(specialty)
          ? prev.specialties.filter((s: string) => s !== specialty)
          : [...prev.specialties, specialty]
      }));
    }
  };

  const handleViewClinic = (clinic: any) => {
    setSelectedClinic(clinic);
    setShowClinicModal(true);
  };

  const handleEditClinic = (clinic: any) => {
    setEditingClinic({ ...clinic });
    setShowEditModal(true);
  };

  const handleSaveClinic = async () => {
    if (!editingClinic?.id) return;

    try {
      // Clinics tablosunu güncelle
      const { error } = await supabase
        .from('clinics')
        .update({
          name: editingClinic.name,
          email: editingClinic.email,
          phone: editingClinic.phone || '',
          website: editingClinic.website || '',
          location: editingClinic.location || '',
          specialties: editingClinic.specialties || [],
          status: editingClinic.status || 'active'
        })
        .eq('id', editingClinic.id);

      if (error) throw error;

      // Users tablosunu da güncelle
      await supabase
        .from('users')
        .update({
          name: editingClinic.name,
          email: editingClinic.email
        })
        .eq('id', editingClinic.id);

      alert('Klinik başarıyla güncellendi!');
      setShowEditModal(false);
      setEditingClinic(null);

      // Listeyi yenile
      const refreshed = await adminService.getClinics();
      setClinics(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      console.error('Klinik güncelleme hatası:', err);
      alert('Klinik güncellenemedi: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const handleDeleteClinic = async (clinicId: string) => {
    if (!confirm('Bu kliniki silmek istediğinizden emin misiniz?')) return;

    try {
      // Auth user'ı sil
      await supabase.auth.admin.deleteUser(clinicId);
      
      // Clinics ve users tablolarından sil (cascade ile otomatik silinir)
      const { error } = await supabase.from('clinics').delete().eq('id', clinicId);
      if (error) throw error;

      alert('Klinik başarıyla silindi!');
      
      // Listeyi yenile
      const refreshed = await adminService.getClinics();
      setClinics(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      console.error('Klinik silme hatası:', err);
      alert('Klinik silinemedi: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  // Başvuru detayını görüntüle
  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
    setShowPassword(false);
  };

  const handleApproveApplication = async (application: any) => {
    if (!confirm(`"${application.clinic_name}" başvurusunu onaylamak istediğinizden emin misiniz?`)) return;

    try {
      setApproving(true);
      const result = await adminService.approveClinicApplication(application.id);
      
      setApplications(prev => prev.map(a => a.id === application.id ? { ...a, status: 'approved' } : a));
      
      // Klinik listesi yenile
      const refreshed = await adminService.getClinics();
      setClinics(Array.isArray(refreshed) ? refreshed : []);
      
      setShowApplicationModal(false);
      
      const passwordInfo = '\n\nKlinik e-postasına şifre belirleme linki gönderildi.';
      
      alert(`Başvuru onaylandı!${passwordInfo}`);
    } catch (err: any) {
      console.error('Başvuru onaylama hatası:', err);
      alert('Başvuru onaylanamadı: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setApproving(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const reason = prompt('Reddetme nedeni (isteğe bağlı):');
    if (reason === null) return; // Kullanıcı iptal etti

    try {
      await adminService.rejectClinicApplication(applicationId, reason || undefined);
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'rejected' } : a));
      setShowApplicationModal(false);
      alert('Başvuru reddedildi.');
    } catch (err: any) {
      console.error('Başvuru reddetme hatası:', err);
      alert('Başvuru reddedilemedi: ' + (err.message || 'Bilinmeyen hata'));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Panoya kopyalandı!');
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Klinik Yönetimi</h2>
            <p className="text-gray-600">Sistem kliniklerini görüntüle ve yönet</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Klinik</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Klinik ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="pending">Beklemede</option>
                <option value="active">Aktif</option>
                <option value="rejected">Reddedilmiş</option>
              </select>
            </div>
          </div>
        </div>

        {/* Başvurular Tablosu */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Klinik Başvuruları ({filteredApplications.length})</h3>
            {loadingApps && <span className="text-sm text-gray-500">Yükleniyor...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klinik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ülke</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifikalar</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Başvuru bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.clinic_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.email}</div>
                        <div className="text-sm text-gray-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.country || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status === 'approved' ? 'Onaylandı' :
                           app.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getCertificateUrls(app).slice(0, 2).map((url: string, idx: number) => (
                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                              Belge {idx + 1}
                            </a>
                          ))}
                          {getCertificateUrls(app).length > 2 && (
                            <span className="text-xs text-gray-500">+{getCertificateUrls(app).length - 2} daha</span>
                          )}
                          {getCertificateUrls(app).length === 0 && (
                            <span className="text-gray-500 text-xs">Belge yok</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewApplication(app)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Detayları Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {app.status === 'approved' && (
                            <button
                              onClick={async () => {
                                if (confirm('Şifre belirleme linkini tekrar göndermek istediğinizden emin misiniz?')) {
                                  try {
                                    await adminService.resendInviteLink(app.id);
                                    alert('Link tekrar gönderildi.');
                                  } catch (err: any) {
                                    alert('Hata: ' + err.message);
                                  }
                                }
                              }}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                              title="Link Yeniden Gönder"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          {app.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveApplication(app)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Onayla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => handleRejectApplication(app.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinics Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Klinikler ({filteredClinics.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klinik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uzmanlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Değerlendirme</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClinics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Klinik bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredClinics.map((clinic) => (
                    <tr key={clinic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <Building className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{clinic.name}</div>
                            <div className="text-sm text-gray-500">{clinic.location || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{clinic.email}</div>
                        <div className="text-sm text-gray-500">{clinic.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(clinic.specialties || []).slice(0, 2).map((specialty: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                              {specialty}
                            </span>
                          ))}
                          {(clinic.specialties || []).length > 2 && (
                            <span className="text-xs text-gray-500">+{(clinic.specialties || []).length - 2}</span>
                          )}
                          {(!clinic.specialties || clinic.specialties.length === 0) && (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          clinic.status === 'active' ? 'bg-green-100 text-green-800' :
                          clinic.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {clinic.status === 'active' ? 'Aktif' :
                           clinic.status === 'pending' ? 'Beklemede' : 'Reddedilmiş'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{clinic.rating || 0}</span>
                          <span className="text-sm text-gray-500 ml-1">({clinic.reviews || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewClinic(clinic)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Görüntüle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClinic(clinic)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClinic(clinic.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Başvuru Detay Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">Başvuru Detayları</h3>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Temel Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.clinic_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded flex-1">{selectedApplication.email}</p>
                    <button
                      onClick={() => copyToClipboard(selectedApplication.email)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <div className="flex items-center gap-2">
                    {selectedApplication.website ? (
                      <>
                        <a href={selectedApplication.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline bg-gray-50 p-2 rounded flex-1">
                          {selectedApplication.website}
                        </a>
                        <Globe className="w-4 h-4 text-gray-400" />
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">-</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedApplication.country || '-'}</p>
                </div>
              </div>

              {/* Açıklama */}
              {selectedApplication.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">{selectedApplication.description}</p>
                </div>
              )}

              {/* Uzmanlık Alanları */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedApplication.specialties || []).map((s: string, index: number) => (
                    <span key={index} className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                      {s}
                    </span>
                  ))}
                  {(!selectedApplication.specialties || selectedApplication.specialties.length === 0) && (
                    <span className="text-sm text-gray-500">Uzmanlık alanı belirtilmemiş</span>
                  )}
                </div>
              </div>

              {/* Sertifikalar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yüklenen Sertifikalar/Belgeler</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getCertificateUrls(selectedApplication).map((url: string, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 group">
                      {isImageUrl(url) ? (
                        <div className="relative">
                          <img src={url} alt={`Belge ${idx + 1}`} className="w-full h-48 object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                            <a href={url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-lg">
                              <Download className="w-5 h-5 text-gray-700" />
                            </a>
                          </div>
                        </div>
                      ) : isPdfUrl(url) ? (
                        <div className="relative h-48 flex items-center justify-center bg-gray-100">
                          <FileText className="w-16 h-16 text-gray-400" />
                          <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white p-2 rounded shadow-lg">
                              <Download className="w-5 h-5 text-gray-700" />
                            </div>
                          </a>
                        </div>
                      ) : (
                        <div className="p-4 h-48 flex flex-col items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400 mb-2" />
                          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm text-center">
                            Belge {idx + 1}'i İndir
                          </a>
                        </div>
                      )}
                      <div className="p-2 text-center">
                        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                          Belge {idx + 1}
                        </a>
                      </div>
                    </div>
                  ))}
                  {getCertificateUrls(selectedApplication).length === 0 && (
                    <span className="text-gray-500 text-sm col-span-full">Belge yüklenmemiş</span>
                  )}
                </div>
              </div>

              {/* Durum ve Tarih */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedApplication.status === 'approved' ? 'Onaylandı' :
                     selectedApplication.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başvuru Tarihi</label>
                  <p className="text-sm text-gray-900">
                    {selectedApplication.created_at 
                      ? new Date(selectedApplication.created_at).toLocaleString('tr-TR')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 pt-4 border-t border-gray-200">
              {selectedApplication.status !== 'approved' && (
                <button
                  onClick={() => handleApproveApplication(selectedApplication)}
                  disabled={approving}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {approving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Onaylanıyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Onayla ve Şifreyi Aktif Et</span>
                    </>
                  )}
                </button>
              )}
              {selectedApplication.status !== 'rejected' && (
                <button
                  onClick={() => handleRejectApplication(selectedApplication.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reddet</span>
                </button>
              )}
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Klinik Ekleme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Yeni Klinik Ekle</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı *</label>
                  <input
                    type="text"
                    value={newClinic.name}
                    onChange={(e) => setNewClinic(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Klinik adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    value={newClinic.email}
                    onChange={(e) => setNewClinic(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="klinik@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={newClinic.phone}
                    onChange={(e) => setNewClinic(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 555 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={newClinic.website}
                    onChange={(e) => setNewClinic(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <input
                    type="text"
                    value={newClinic.location}
                    onChange={(e) => setNewClinic(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İstanbul, Türkiye"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allProcedureKeys.map((proc) => (
                    <label key={proc.key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={newClinic.specialties.includes(proc.key)}
                        onChange={() => handleSpecialtyToggle(proc.key, true)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{proc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCreateClinic}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Klinik Oluştur
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewClinic({
                    name: '',
                    email: '',
                    phone: '',
                    website: '',
                    location: '',
                    specialties: []
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Klinik Düzenleme Modal */}
      {showEditModal && editingClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Klinik Düzenle</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingClinic(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı</label>
                  <input
                    type="text"
                    value={editingClinic.name || ''}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={editingClinic.email || ''}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editingClinic.phone || ''}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={editingClinic.website || ''}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <input
                    type="text"
                    value={editingClinic.location || ''}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={editingClinic.status || 'active'}
                    onChange={(e) => setEditingClinic((prev: any) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="pending">Beklemede</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allProcedureKeys.map((proc) => (
                    <label key={proc.key} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={(editingClinic.specialties || []).includes(proc.key)}
                        onChange={() => handleSpecialtyToggle(proc.key, false)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{proc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveClinic}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Kaydet
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingClinic(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Klinik Detay Modal (Sadece Görüntüleme) */}
      {showClinicModal && selectedClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Klinik Detayları</h3>
              <button
                onClick={() => setShowClinicModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klinik Adı</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedClinic.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedClinic.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedClinic.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  {selectedClinic.website ? (
                    <a href={selectedClinic.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline bg-gray-50 p-2 rounded block">
                      {selectedClinic.website}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">-</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedClinic.location || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedClinic.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedClinic.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedClinic.status === 'active' ? 'Aktif' :
                     selectedClinic.status === 'pending' ? 'Beklemede' : 'Pasif'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedClinic.specialties || []).map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                  {(!selectedClinic.specialties || selectedClinic.specialties.length === 0) && (
                    <span className="text-sm text-gray-500">Uzmanlık alanı belirtilmemiş</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Değerlendirme</label>
                  <p className="text-sm text-gray-900">{selectedClinic.rating || 0} / 5.0 ({selectedClinic.reviews || 0} değerlendirme)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Tarihi</label>
                  <p className="text-sm text-gray-900">
                    {selectedClinic.created_at 
                      ? new Date(selectedClinic.created_at).toLocaleString('tr-TR')
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowClinicModal(false);
                  handleEditClinic(selectedClinic);
                }}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
              <button
                onClick={() => setShowClinicModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicManagement;
