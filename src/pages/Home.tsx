import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
    </div>
  );
};

export default Home;