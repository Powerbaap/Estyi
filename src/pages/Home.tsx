import React from 'react';
import SEOHead from '../components/SEO/SEOHead';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import LiveStats from '../components/Home/LiveStats';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Estyi - Estetik İşlemler İçin Global Fiyat Teklifi Platformu" 
        description="Dünya genelinde sertifikalı estetik kliniklerden anında fiyat teklifi alın. Saç ekimi, burun estetiği, diş tedavisi ve daha fazlası için şeffaf fiyatlar." 
        canonical="/" 
      />
      <Hero />
      <Features />
      <LiveStats />
    </div>
  );
};

export default Home;
