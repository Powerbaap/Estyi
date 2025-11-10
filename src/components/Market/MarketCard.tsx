import React, { useState } from 'react';
import { Star, Globe, Link as LinkIcon, MessageCircle, Calendar } from 'lucide-react';

interface MarketCardProps {
  card: {
    clinic_id: string;
    clinic_name: string;
    doctor_name: string;
    procedure_id: string;
    procedure_name: string;
    price_amount: number;
    price_currency: string;
    clinic_rating: number;
    reviews_count: number;
    instagram_url?: string;
    website?: string;
    country?: string;
    city?: string;
  };
  onMessage: (clinicId: string) => void;
  onBook: (card: MarketCardProps['card']) => void;
}

const MarketCard: React.FC<MarketCardProps> = ({ card, onMessage, onBook }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-semibold text-gray-900">{card.clinic_name}</div>
          <div className="text-sm text-gray-600">{card.doctor_name}</div>
          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-700">
            <span className="font-bold">{card.price_amount} {card.price_currency}</span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-1" />{card.clinic_rating.toFixed(1)} ({card.reviews_count})</span>
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:underline" onClick={() => setOpen(!open)}>
          {open ? 'Detayı Gizle' : 'Detayı Gör'}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex items-center space-x-2"><Globe className="w-4 h-4" /><span>{card.country}{card.city ? ` / ${card.city}` : ''}</span></div>
          {card.instagram_url && (
            <div className="flex items-center space-x-2"><LinkIcon className="w-4 h-4" /><a href={card.instagram_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Instagram</a></div>
          )}
          {card.website && (
            <div className="flex items-center space-x-2"><LinkIcon className="w-4 h-4" /><a href={card.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Web Sitesi</a></div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center space-x-3">
        <button
          type="button"
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => onMessage(card.clinic_id)}
        >
          <MessageCircle className="w-4 h-4 mr-2" /> Mesaj Gönder
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:opacity-90 flex items-center"
          onClick={() => onBook(card)}
        >
          <Calendar className="w-4 h-4 mr-2" /> Randevu Al
        </button>
      </div>
    </div>
  );
};

export default MarketCard;