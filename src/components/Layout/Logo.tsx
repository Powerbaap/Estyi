import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#f093fb', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#4facfe', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#00f2fe', stopOpacity: 1}} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Ana container - modern hexagon */}
        <path 
          d="M24 2 L44 14 L44 34 L24 46 L4 34 L4 14 Z" 
          fill="url(#primaryGradient)" 
          stroke="url(#primaryGradient)" 
          strokeWidth="1"
          filter="url(#glow)"
        />
        
        {/* İç hexagon - beyaz arka plan */}
        <path 
          d="M24 6 L40 16 L40 32 L24 42 L8 32 L8 16 Z" 
          fill="white" 
          stroke="white" 
          strokeWidth="1"
        />
        
        {/* Estetik sembol - gül yaprağı */}
        <path 
          d="M24 12 Q28 8 32 12 Q28 16 24 12 Z" 
          fill="url(#accentGradient)" 
          stroke="url(#accentGradient)" 
          strokeWidth="0.5"
        />
        
        {/* Merkez daire */}
        <circle cx="24" cy="24" r="8" fill="url(#primaryGradient)" stroke="url(#primaryGradient)" strokeWidth="0.5"/>
        
        {/* İç detay - kalp şekli */}
        <path 
          d="M24 18 Q26 16 28 18 Q26 20 24 18 Z" 
          fill="white" 
          stroke="white" 
          strokeWidth="0.5"
        />
        
        {/* Parlama efekti */}
        <circle cx="20" cy="20" r="2" fill="white" opacity="0.8"/>
      </svg>
    </div>
  );
};

export default Logo; 