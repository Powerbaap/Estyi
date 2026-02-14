import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Check, CreditCard, Calendar, TrendingUp, Star, Zap, Shield } from 'lucide-react';

// Estyi spec: Planlar aylık teklif kotasına göre (auto + manual + sla_default hepsi sayılır)
const ClinicMembership: React.FC = () => {
  const { t } = useTranslation();
  const [currentPlan] = useState({
    name: 'Plan 1',
    price: 10,
    quota: 100,
    billingCycle: 'monthly',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-02-01'),
    autoRenew: true
  });

  const quotaUsed = 42;
  const quotaTotal = currentPlan.quota;
  const quotaPercentage = quotaTotal > 0 ? Math.min(100, (quotaUsed / quotaTotal) * 100) : 0;

  const plans = [
    {
      name: 'Plan 1',
      price: 10,
      quota: 100,
      quotaLabel: '0–100 teklif/ay',
      description: 'Küçük klinikler için',
      features: [
        'Ayda 100 teklif hakkı (otomatik + manuel + SLA)',
        'Temel talep paneli',
        'E-posta destek'
      ],
      limitations: [] as string[],
      popular: false
    },
    {
      name: 'Plan 2',
      price: 18,
      quota: 200,
      quotaLabel: '100–200 teklif/ay',
      description: 'Büyüyen klinikler için',
      features: [
        'Ayda 200 teklif hakkı',
        'Gelişmiş filtreler',
        'Öncelikli destek'
      ],
      limitations: [] as string[],
      popular: true
    },
    {
      name: 'Plan 3',
      price: 40,
      quota: -1,
      quotaLabel: 'Sınırsız teklif/ay',
      description: 'Yoğun hacim için',
      features: [
        'Sınırsız teklif',
        'Tüm özellikler',
        'Öncelikli destek'
      ],
      limitations: [] as string[],
      popular: false
    }
  ];

  const usage = {
    offers: { current: quotaUsed, limit: quotaTotal === -1 ? '∞' : String(quotaTotal), percentage: quotaPercentage }
  };

  const getDaysUntilRenewal = () => {
    const now = new Date();
    const diffTime = currentPlan.endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('clinicDashboard.membership')}</h1>
          <p className="text-gray-600 mt-1">{t('clinicDashboard.manageMembership')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            {t('clinicDashboard.downloadInvoice')}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('clinicDashboard.upgradePlan')}
          </button>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentPlan.name}</h2>
              <p className="text-blue-100">
                ${currentPlan.price}/{t('clinicDashboard.monthly')} • {currentPlan.quota === -1 ? t('clinicDashboard.quotaUnlimited') : `0–${currentPlan.quota} ${t('clinicDashboard.quotaOffers')}`}
              </p>
              <p className="text-sm text-blue-200 mt-1">
                {currentPlan.autoRenew ? t('clinicDashboard.autoRenewal') : t('clinicDashboard.manualRenewal')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100">{t('clinicDashboard.nextBillingDate')}</p>
            <p className="text-xl font-semibold">{currentPlan.endDate.toLocaleDateString()}</p>
            <p className="text-sm text-blue-200">{getDaysUntilRenewal()} {t('clinicDashboard.daysLeft')}</p>
          </div>
        </div>
      </div>

      {/* Teklif kotası (Estyi: auto + manual + sla_default hepsi sayılır) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('clinicDashboard.quotaUsedThisMonth')}</h3>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">{quotaUsed}</span>
            <span className="text-sm text-gray-500">/ {quotaTotal === -1 ? '∞' : quotaTotal} {t('clinicDashboard.quotaOffers')}</span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${quotaTotal === -1 ? 0 : usage.offers.percentage}%` }}></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t('clinicDashboard.quotaIncludesAutoManualSLA')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t('clinicDashboard.renewalDate')}</h3>
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{currentPlan.endDate.toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">{getDaysUntilRenewal()} {t('clinicDashboard.daysLeft')}</p>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('clinicDashboard.availablePlans')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 p-6 ${
                plan.popular
                  ? 'border-blue-500 bg-blue-50'
                  : plan.name === currentPlan.name
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t('clinicDashboard.mostPopular')}
                  </span>
                </div>
              )}
              {plan.name === currentPlan.name && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t('clinicDashboard.currentPlan')}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{t('clinicDashboard.monthly')}</span>
                </div>
                <p className="text-sm font-medium text-blue-600">{plan.quotaLabel}</p>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
                {(plan.limitations || []).map((limitation, index) => (
                  <div key={index} className="flex items-center space-x-2 opacity-60">
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={plan.name === currentPlan.name}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.name === currentPlan.name
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.name === currentPlan.name ? t('clinicDashboard.currentPlan') : t('clinicDashboard.upgradeToPlan', { plan: plan.name })}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.billingHistory')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('clinicDashboard.date')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('clinicDashboard.description')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('clinicDashboard.amount')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('clinicDashboard.status')}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{t('clinicDashboard.invoice')}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2025-01-01', description: 'Professional Plan - Ocak 2025', amount: '$299.00', status: t('clinicDashboard.paid') },
                { date: '2024-12-01', description: 'Professional Plan - Aralık 2024', amount: '$299.00', status: t('clinicDashboard.paid') },
                { date: '2024-11-01', description: 'Professional Plan - Kasım 2024', amount: '$299.00', status: t('clinicDashboard.paid') },
                { date: '2024-10-01', description: 'Basic Plan - Ekim 2024', amount: '$99.00', status: t('clinicDashboard.paid') }
              ].map((invoice, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{invoice.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{invoice.description}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.amount}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {t('clinicDashboard.download')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('clinicDashboard.paymentMethod')}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-sm text-gray-600">Expires 12/25</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            {t('clinicDashboard.change')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicMembership;