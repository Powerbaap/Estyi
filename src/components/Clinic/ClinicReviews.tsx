import React, { useState, useEffect } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  clinic_response: string | null;
  created_at: string;
  user_email?: string;
}

interface ClinicReviewsProps {
  clinicId: string;
}

const ClinicReviews: React.FC<ClinicReviewsProps> = ({ clinicId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!clinicId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('clinic_id', clinicId)
          .order('created_at', { ascending: false });

        const revs = data || [];

        const enriched = await Promise.all(revs.map(async (r: any) => {
          const { data: u } = await supabase.from('users').select('email').eq('id', r.user_id).maybeSingle();
          return { ...r, user_email: u?.email || 'Anonim Kullanıcı' };
        }));

        setReviews(enriched);
        if (enriched.length > 0) {
          const avg = enriched.reduce((s, r) => s + r.rating, 0) / enriched.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      } catch (err) {
        console.error('Yorum yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clinicId]);

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-xl"></div>;
  if (reviews.length === 0) return null;

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return 'Kullanıcı';
    return name.substring(0, 2) + '***@' + domain;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-600" />
          Hasta Yorumları
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-bold text-gray-900">{averageRating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviews.length} yorum)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{(rev.user_email || 'A')[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{maskEmail(rev.user_email || '')}</p>
                  <p className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              {renderStars(rev.rating)}
            </div>
            {rev.comment && <p className="text-sm text-gray-700 leading-relaxed">{rev.comment}</p>}
            {rev.clinic_response && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-semibold text-blue-800 mb-1">Klinik Yanıtı</p>
                <p className="text-sm text-blue-700">{rev.clinic_response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicReviews;
