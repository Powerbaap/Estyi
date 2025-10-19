import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Building,
  LogOut
} from 'lucide-react';
import { adminService, AdminRequest } from '../../services/adminService';

const RequestManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
+ const [requests, setRequests] = useState<AdminRequest[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

-  const requests = [
-    {
-      id: '1',
-      user: 'Ahmet Yılmaz',
-      userEmail: 'ahmet@example.com',
-      procedure: 'Rhinoplasty',
-      description: 'Burun estetiği için fiyat teklifi istiyorum',
-      status: 'active',
-      photos: 3,
-      createdAt: '2024-01-20',
-      offers: 2
-    },
-    {
-      id: '2',
-      user: 'Fatma Demir',
-      userEmail: 'fatma@example.com',
-      procedure: 'Hair Transplant',
-      description: 'Saç ekimi için detaylı bilgi ve fiyat',
-      status: 'active',
-      photos: 2,
-      createdAt: '2024-01-19',
-      offers: 1
-    },
-    {
-      id: '3',
-      user: 'Mehmet Kaya',
-      userEmail: 'mehmet@example.com',
-      procedure: 'Liposuction',
-      description: 'Karın bölgesi liposuction fiyat teklifi',
-      status: 'closed',
-      photos: 1,
-      createdAt: '2024-01-18',
-      offers: 3
-    },
-    {
-      id: '4',
-      user: 'Ayşe Özkan',
-      userEmail: 'ayse@example.com',
-      procedure: 'Breast Augmentation',
-      description: 'Göğüs büyütme ameliyatı bilgisi',
-      status: 'completed',
-      photos: 4,
-      createdAt: '2024-01-17',
-      offers: 2
-    }
-  ];
+  useEffect(() => {
+    adminService.getRequests()
+      .then((rows) => setRequests(Array.isArray(rows) ? rows : []))
+      .catch((err) => console.error('Talepler yüklenemedi:', err));
+  }, []);

  const filteredRequests = requests.filter((request: any) => {
    const title = (request.title || '').toLowerCase();
    const desc = (request.description || '').toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (request.status || 'active') === statusFilter;
    return matchesSearch && matchesStatus;
  });
+  const filteredRequests = requests.filter((request: any) => {
+    const title = (request.title || '').toLowerCase();
+    const desc = (request.description || '').toLowerCase();
+    const matchesSearch = title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
+    const matchesStatus = statusFilter === 'all' || (request.status || 'active') === statusFilter;
+    return matchesSearch && matchesStatus;
+  });

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'closed':
        return 'Kapalı';
      case 'completed':
        return 'Tamamlandı';
      default:
        return 'Bilinmiyor';
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Talep Yönetimi</h2>
          <p className="text-gray-600">Sistem taleplerini görüntüle ve yönet</p>
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
                  placeholder="Talep ara..."
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
                <option value="active">Aktif</option>
                <option value="closed">Kapalı</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Talepler ({filteredRequests.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fotoğraf
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teklif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.user_name || request.user_id || '—'}</div>
                          <div className="text-sm text-gray-500">{request.user_email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.title || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{Array.isArray((request as any).photo_urls) ? (request as any).photo_urls.length : '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{'—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.created_at ? new Date(request.created_at).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Talep Detayları</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kullanıcı</label>
-               <p className="text-sm text-gray-900">{selectedRequest.user}</p>
-               <p className="text-xs text-gray-500">{selectedRequest.userEmail}</p>
+               <p className="text-sm text-gray-900">{selectedRequest.user_name || selectedRequest.user_id || '—'}</p>
+               <p className="text-xs text-gray-500">{selectedRequest.user_email || ''}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">İşlem</label>
                <p className="text-sm text-gray-900">{selectedRequest.procedure}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                <p className="text-sm text-gray-900">{selectedRequest.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <p className="text-sm text-gray-900">{getStatusText(selectedRequest.status)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fotoğraf Sayısı</label>
                <p className="text-sm text-gray-900">{selectedRequest.photos}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teklif Sayısı</label>
                <p className="text-sm text-gray-900">{'—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                <p className="text-sm text-gray-900">{selectedRequest.createdAt}</p>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

export default RequestManagement;