import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  X,
  LogOut
} from 'lucide-react';

const ClinicManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    specialties: [] as string[]
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const clinics = [
    {
      id: '1',
      name: 'İstanbul Estetik Merkezi',
      email: 'info@istanbulestetik.com',
      phone: '+90 212 555 0123',
      location: 'İstanbul, Türkiye',
      status: 'active',
      specialties: ['Rhinoplasty', 'Hair Transplant'],
      rating: 4.8,
      reviews: 156,
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Hair World İstanbul',
      email: 'info@hairworld.com',
      phone: '+90 212 555 0456',
      location: 'İstanbul, Türkiye',
      status: 'active',
      specialties: ['Hair Transplant'],
      rating: 4.6,
      reviews: 89,
      joinDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Ankara Estetik Merkezi',
      email: 'info@ankaraestetik.com',
      phone: '+90 312 555 0789',
      location: 'Ankara, Türkiye',
      status: 'pending',
      specialties: ['Rhinoplasty', 'Liposuction'],
      rating: 0,
      reviews: 0,
      joinDate: '2024-01-20'
    }
  ];

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || clinic.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateClinic = () => {
    // Create clinic logic
    console.log('Creating clinic:', newClinic);
    setShowCreateModal(false);
    setNewClinic({
      name: '',
      email: '',
      phone: '',
      location: '',
      specialties: []
    });
  };

  const handleSpecialtyChange = (specialty: string) => {
    setNewClinic(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleViewClinic = (clinic: any) => {
    setSelectedClinic(clinic);
    setShowClinicModal(true);
  };

  const handleApproveClinic = (clinicId: string) => {
    // Approve clinic logic
    console.log('Approving clinic:', clinicId);
  };

  const handleRejectClinic = (clinicId: string) => {
    // Reject clinic logic
    console.log('Rejecting clinic:', clinicId);
  };

  const handleDeleteClinic = (clinicId: string) => {
    // Delete clinic logic
    console.log('Deleting clinic:', clinicId);
  };

  const specialties = [
    'Rhinoplasty',
    'Hair Transplant',
    'Liposuction',
    'Breast Augmentation',
    'Face Lift',
    'Dental Implants'
  ];

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Klinik Yönetimi</h2>
            <p className="text-gray-600">Sistem kliniklerini görüntüle ve yönet</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Klinik</span>
          </Link>
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
                <option value="active">Aktif</option>
                <option value="pending">Beklemede</option>
                <option value="rejected">Reddedilmiş</option>
              </select>
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klinik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uzmanlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Değerlendirme
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Building className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{clinic.name}</div>
                          <div className="text-sm text-gray-500">{clinic.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{clinic.email}</div>
                      <div className="text-sm text-gray-500">{clinic.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {clinic.specialties.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {specialty}
                          </span>
                        ))}
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
                        <span className="text-sm font-medium text-gray-900">{clinic.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({clinic.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewClinic(clinic)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {clinic.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveClinic(clinic.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Onayla"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClinic(clinic.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reddet"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteClinic(clinic.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Clinic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Klinik Ekle</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Klinik Adı</label>
                <input
                  type="text"
                  value={newClinic.name}
                  onChange={(e) => setNewClinic(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  value={newClinic.email}
                  onChange={(e) => setNewClinic(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="text"
                  value={newClinic.phone}
                  onChange={(e) => setNewClinic(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Konum</label>
                <input
                  type="text"
                  value={newClinic.location}
                  onChange={(e) => setNewClinic(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Uzmanlık Alanları</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specialties.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newClinic.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleCreateClinic}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Klinik Ekle
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Details Modal */}
      {showClinicModal && selectedClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Klinik Detayları</h3>
              <button
                onClick={() => setShowClinicModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Klinik Adı</label>
                <p className="text-sm text-gray-900">{selectedClinic.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <p className="text-sm text-gray-900">{selectedClinic.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <p className="text-sm text-gray-900">{selectedClinic.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Konum</label>
                <p className="text-sm text-gray-900">{selectedClinic.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Uzmanlık Alanları</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedClinic.specialties.map((specialty: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum</label>
                <p className="text-sm text-gray-900">{selectedClinic.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Değerlendirme</label>
                <p className="text-sm text-gray-900">{selectedClinic.rating} ({selectedClinic.reviews} değerlendirme)</p>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowClinicModal(false)}
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

export default ClinicManagement; 