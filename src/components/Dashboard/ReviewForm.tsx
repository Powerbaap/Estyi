import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
  appointmentId: string;
  clinicId: string;
  conversationId: string;
  onDone: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ appointmentId, clinicId, conversationId, onDone }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { alert(t('reviewForm.selectRating')); return; }
    if (!user?.id) return;
    setSending(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        appointment_id: appointmentId,
        conversation_id: conversationId,
        user_id: user.id,
        clinic_id: clinicId,
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;

      // Klinik ortalama puanını güncelle
      const { data: allReviews } = await supabase.from('reviews').select('rating').eq('clinic_id', clinicId);
      if (allReviews && allReviews.length > 0) {
        const avg = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
        await supabase.from('clinics').update({ rating: Math.round(avg * 100) / 100, reviews: allReviews.length }).eq('id', clinicId);
      }

      // Sohbete sistem mesajı gönder
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: JSON.stringify({ type: 'review_submitted', rating, appointment_id: appointmentId }),
      });

      alert(t('reviewForm.success'));
      onDone();
    } catch (err) {
      console.error('Yorum gönderme hatası:', err);
      alert(t('reviewForm.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-yellow-200 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('reviewForm.title')}</h4>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} onMouseEnter={() => setHoveredRating(i)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setRating(i)} className="p-0.5">
            <Star className={`w-7 h-7 transition-colors ${i <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
          </button>
        ))}
        {rating > 0 && <span className="text-sm text-gray-500 ml-2">{rating}/5</span>}
      </div>
      <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t('reviewForm.placeholder')} rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mb-3" />
      <button onClick={handleSubmit} disabled={rating === 0 || sending}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 transition-colors">
        <Send className="w-4 h-4" />{sending ? t('reviewForm.submitting') : t('reviewForm.submit')}
      </button>
    </div>
  );
};

export default ReviewForm;
