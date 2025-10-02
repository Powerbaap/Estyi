import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, User, Calendar, Clock, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';

interface ClinicOffer {
  id: string;
  userId: string;
  procedure: string;
  basePrice: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  submittedAt: Date;
  expiresAt: Date;
  duration: string;
  hospitalization: string;
  includedServices: string[];
}

interface ClinicOffersProps {
  filterStatus?: string;
}

const ClinicOffers: React.FC<ClinicOffersProps> = ({ filterStatus = 'all' }) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState(filterStatus);
  const [dateFilter, setDateFilter] = useState('all');

  const [offers] = useState<ClinicOffer[]>([
    {
      id: 'offer1',
      userId: 'User1234',
      procedure: 'Rhinoplasty (Nose Surgery)',
      basePrice: 3500,
      totalPrice: 4250,
      status: 'accepted',
      submittedAt: new Date('2025-01-18T14:30:00'),
      expiresAt: new Date('2025-01-25T14:30:00'),
      duration: '2-3 hours',
      hospitalization: '1 night',
      includedServices: ['Hotel Accommodation', 'Airport Transfer', 'Consultations']
    },
    {
      id: 'offer2',
      userId: 'User5678',
      procedure: 'Hair Transplant',
      basePrice: 2800,
      totalPrice: 3450,
      status: 'pending',
      submittedAt: new Date('2025-01-19T10:15:00'),
      expiresAt: new Date('2025-01-26T10:15:00'),
      duration: '6-8 hours',
      hospitalization: 'None',
      includedServices: ['Airport Transfer', 'Consultations']
    },
    {
      id: 'offer3',
      userId: 'User9012',
      procedure: 'Breast Augmentation',
      basePrice: 4200,
      totalPrice: 5050,
      status: 'pending',
      submittedAt: new Date('2025-01-20T09:45:00'),
      expiresAt: new Date('2025-01-27T09:45:00'),
      duration: '3-4 hours',
      hospitalization: '2 nights',
      includedServices: ['Hotel Accommodation', 'Airport Transfer', 'Consultations']
    },
    {
      id: 'offer4',
      userId: 'User3456',
      procedure: 'Rhinoplasty (Nose Surgery)',
      basePrice: 3200,
      totalPrice: 3850,
      status: 'rejected',
      submittedAt: new Date('2025-01-15T16:20:00'),
      expiresAt: new Date('2025-01-22T16:20:00'),
      duration: '2-3 hours',
      hospitalization: '1 night',
      includedServices: ['Consultations']
    },
    {
      id: 'offer5',
      userId: 'User7890',
      procedure: 'Hair Transplant',
      basePrice: 3000,
      totalPrice: 3600,
      status: 'expired',
      submittedAt: new Date('2025-01-10T11:30:00'),
      expiresAt: new Date('2025-01-17T11:30:00'),
      duration: '6-8 hours',
      hospitalization: 'None',
      includedServices: ['Airport Transfer']
    }
  ]);

  // Update statusFilter when prop changes
  React.useEffect(() => {
    setStatusFilter(filterStatus);
  }, [filterStatus]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const filteredOffers = offers.filter(offer => {
    if (statusFilter !== 'all' && offer.status !== statusFilter) return false;
    if (dateFilter === 'today') {
      const today = new Date();
      return offer.submittedAt.toDateString() === today.toDateString();
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return offer.submittedAt >= weekAgo;
    }
    return true;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'pending').length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    totalValue: offers.filter(o => o.status === 'accepted').reduce((sum, o) => sum + o.totalPrice, 0)
  };

  const getDaysUntilExpiry = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tekliflerim</h1>
          <p className="text-gray-600 mt-1">Tekliflerinizi takip edin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyen</option>
            <option value="accepted">Kabul Edilen</option>
            <option value="rejected">Reddedilen</option>
            <option value="expired">Süresi Dolan</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Toplam Teklif</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Bekleyen</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
              <p className="text-sm text-gray-600">Kabul Edilen</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Toplam Değer</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Teklif Listesi</h2>
            <span className="text-sm text-gray-600">
              {filteredOffers.length} / {offers.length} teklif gösteriliyor
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hasta & İşlem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detaylar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gönderildi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Tarih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{offer.userId}</div>
                        <div className="text-sm text-gray-500">{offer.procedure}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${offer.basePrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Toplam: ${offer.totalPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Süre: {offer.duration}</div>
                      <div>Hastane: {offer.hospitalization}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {offer.includedServices.slice(0, 2).join(', ')}
                        {offer.includedServices.length > 2 && ` +${offer.includedServices.length - 2} daha`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="ml-1">
                        {offer.status === 'pending' ? 'Bekliyor' :
                         offer.status === 'accepted' ? 'Kabul Edildi' :
                         offer.status === 'rejected' ? 'Reddedildi' : 'Süresi Doldu'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {offer.submittedAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{offer.expiresAt.toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {getDaysUntilExpiry(offer.expiresAt)} gün kaldı
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicOffers; 