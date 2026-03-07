import React, { useState, useEffect } from 'react';
import { Building, Globe, FileText, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

interface Stats {
  clinicCount: number;
  countryCount: number;
  requestCount: number;
  userCount: number;
}

const TrustBar: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>({ clinicCount: 0, countryCount: 0, requestCount: 0, userCount: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [clinicsRes, requestsRes, usersRes] = await Promise.all([
          supabase.from('clinics').select('id, location, countries, status').eq('status', 'active'),
          supabase.from('requests').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'user'),
        ]);

        const clinics = clinicsRes.data || [];
        const uniqueCountries = new Set<string>();
        clinics.forEach((c: any) => {
          if (Array.isArray(c.countries)) {
            c.countries.forEach((co: string) => uniqueCountries.add(co));
          } else if (c.location) {
            const country = c.location.split('/')[0]?.trim();
            if (country) uniqueCountries.add(country);
          }
        });

        setStats({
          clinicCount: clinics.length,
          countryCount: uniqueCountries.size,
          requestCount: requestsRes.count || 0,
          userCount: usersRes.count || 0,
        });
        setLoaded(true);
      } catch (err) {
        console.error('TrustBar stats error:', err);
        setLoaded(true);
      }
    };
    loadStats();
  }, []);

  if (!loaded) return null;

  const metrics = [
    { icon: Building, value: stats.clinicCount, label: t('home.trustBar.clinics', { defaultValue: 'Sertifikalı Klinik' }), color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Globe, value: stats.countryCount, label: t('home.trustBar.countries', { defaultValue: 'Ülke' }), color: 'text-pink-600', bg: 'bg-pink-100' },
    { icon: FileText, value: stats.requestCount, label: t('home.trustBar.requests', { defaultValue: 'Talep Oluşturuldu' }), color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Users, value: stats.userCount, label: t('home.trustBar.users', { defaultValue: 'Kayıtlı Kullanıcı' }), color: 'text-green-600', bg: 'bg-green-100' },
  ];

  // Eğer tüm değerler 0 ise gösterme
  if (metrics.every(m => m.value === 0)) return null;

  return (
    <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            metric.value > 0 && (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className={`w-12 h-12 ${metric.bg} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {metric.value.toLocaleString()}+
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {metric.label}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
