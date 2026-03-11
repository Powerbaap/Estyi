import React, { useEffect, useRef, useState } from 'react';
import { Building, Globe, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const LiveStats: React.FC = () => {
  const [targets, setTargets] = useState({ clinics: 0, countries: 0, requests: 0 });
  const [displayed, setDisplayed] = useState({ clinics: 0, countries: 0, requests: 0 });
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: clinics } = await supabase
          .from('clinics')
          .select('id, location, countries, status')
          .eq('status', 'active');

        const clinicList = clinics || [];
        const uniqueCountries = new Set<string>();
        clinicList.forEach((c: any) => {
          if (Array.isArray(c.countries)) {
            c.countries.forEach((co: string) => uniqueCountries.add(co));
          } else if (c.location) {
            const country = c.location.split('/')[0]?.trim();
            if (country) uniqueCountries.add(country);
          }
        });

        const { count: requestCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true });

        setTargets({
          clinics: clinicList.length,
          countries: uniqueCountries.size,
          requests: requestCount || 0,
        });
        setLoaded(true);
      } catch (err) {
        console.error('LiveStats error:', err);
        setLoaded(true);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loaded || animatedRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loaded]);

  const animateCountUp = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed({
        clinics: Math.round(targets.clinics * eased),
        countries: Math.round(targets.countries * eased),
        requests: Math.round(targets.requests * eased),
      });
      if (step >= steps) {
        clearInterval(timer);
        setDisplayed({ ...targets });
      }
    }, interval);
  };

  if (!loaded || (targets.clinics === 0 && targets.countries === 0 && targets.requests === 0)) return null;

  const metrics = [
    {
      icon: Building,
      value: displayed.clinics,
      label: 'Sertifikalı Klinik',
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Globe,
      value: displayed.countries,
      label: 'Ülke',
      gradient: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      icon: FileText,
      value: displayed.requests,
      label: 'Talep Oluşturuldu',
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2760%27%20height=%2760%27%20viewBox=%270%200%2060%2060%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20fill=%27none%27%20fill-rule=%27evenodd%27%3E%3Cg%20fill=%27%23ffffff%27%20fill-opacity=%270.08%27%3E%3Ccircle%20cx=%2730%27%20cy=%2730%27%20r=%271.5%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Rakamlarla Estyi
          </h2>
          <p className="text-lg text-white/70">
            Platformumuzdaki güncel veriler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            metric.value > 0 && (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${metric.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <metric.icon className={`w-8 h-8 ${metric.iconColor}`} />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 tabular-nums">
                  {metric.value}
                  <span className="text-3xl text-white/60">+</span>
                </div>
                <div className="text-base text-white/80 font-medium tracking-wide">
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

export default LiveStats;
