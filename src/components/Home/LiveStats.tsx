import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const LiveStats: React.FC = () => {
  const { t } = useTranslation();
  const [targets, setTargets] = useState({ clinics: 0, countries: 0, requests: 0 });
  const [displayed, setDisplayed] = useState({ clinics: 0, countries: 0, requests: 0 });
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

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

  const animateCountUp = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setDisplayed({ clinics: 0, countries: 0, requests: 0 });

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
        isAnimatingRef.current = false;
      }
    }, interval);
  }, [targets]);

  useEffect(() => {
    if (!loaded || targets.clinics === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCountUp();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loaded, animateCountUp]);

  if (!loaded || (targets.clinics === 0 && targets.countries === 0 && targets.requests === 0)) return null;

  const metrics = [
    { value: displayed.clinics, label: t('home.liveStats.clinics', { defaultValue: 'Sertifikalı Klinik' }), color: 'text-purple-500', glow: '0 0 30px rgba(168,85,247,0.3)', gradient: 'from-purple-500 to-purple-500/0' },
    { value: displayed.countries, label: t('home.liveStats.countries', { defaultValue: 'Ülke' }), color: 'text-pink-500', glow: '0 0 30px rgba(236,72,153,0.3)', gradient: 'from-pink-500 to-pink-500/0' },
    { value: displayed.requests, label: t('home.liveStats.requests', { defaultValue: 'Talep Oluşturuldu' }), color: 'text-blue-500', glow: '0 0 30px rgba(59,130,246,0.3)', gradient: 'from-blue-500 to-blue-500/0' },
  ];

  return (
    <section ref={sectionRef} className="py-16 px-6 relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold italic">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t('home.liveStats.title', { defaultValue: 'Rakamlarla Estyi' })}
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {metrics.map((m, i) => (
            m.value >= 0 && (
              <div key={i} className="text-center">
                <div
                  className={`text-7xl font-black ${m.color} mb-2 tabular-nums`}
                  style={{ textShadow: m.glow }}
                >
                  {m.value}
                  <span className="text-3xl opacity-50">+</span>
                </div>
                <div className={`w-16 h-px mx-auto mb-3 bg-gradient-to-r ${m.gradient}`}></div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                  {m.label}
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
