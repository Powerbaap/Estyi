import React from 'react';
import { Calendar, Clock, Check, X, Ban, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

interface AppointmentBubbleProps {
  appointmentId: string;
  date: string;
  time: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  isOwnMessage: boolean;
  currentUserId: string;
  proposedBy: string;
  conversationId: string;
  onUpdate?: () => void;
}

const AppointmentBubble: React.FC<AppointmentBubbleProps> = ({
  appointmentId,
  date,
  time,
  note,
  status,
  isOwnMessage,
  currentUserId,
  proposedBy,
  conversationId,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const canRespond = status === 'pending' && currentUserId !== proposedBy;
  const canCancel =
    (status === 'pending' || status === 'confirmed') &&
    (currentUserId === proposedBy || canRespond);

  const getSenderType = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('user_id, clinic_id')
      .eq('id', conversationId)
      .maybeSingle();

    return data?.clinic_id === currentUserId ? 'clinic' : 'user';
  };

  const handleResponse = async (newStatus: 'confirmed' | 'rejected') => {
    try {
      await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      const responseContent = JSON.stringify({
        type: 'appointment_response',
        appointment_id: appointmentId,
        status: newStatus,
      });

      const senderType = await getSenderType();

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        sender_type: senderType,
        content: responseContent,
      });

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Randevu cevap hatası:', err);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Randevuyu iptal etmek istediğinizden emin misiniz?')) return;
    try {
      await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      const cancelContent = JSON.stringify({
        type: 'appointment_cancelled',
        appointment_id: appointmentId,
      });

      const senderType = await getSenderType();

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        sender_type: senderType,
        content: cancelContent,
      });

      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Randevu iptal hatası:', err);
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      });
    } catch {
      return d;
    }
  };

  const statusConfig: Record<
    string,
    { bg: string; text: string; label: string; icon: React.ReactNode }
  > = {
    pending: {
      bg: 'bg-yellow-50 border-yellow-300',
      text: 'text-yellow-700',
      label: t('appointmentPanel.status.pending'),
      icon: <Clock className="w-4 h-4" />,
    },
    confirmed: {
      bg: 'bg-green-50 border-green-300',
      text: 'text-green-700',
      label: t('appointmentPanel.status.confirmed'),
      icon: <Check className="w-4 h-4" />,
    },
    rejected: {
      bg: 'bg-red-50 border-red-300',
      text: 'text-red-700',
      label: t('appointmentPanel.status.rejected'),
      icon: <X className="w-4 h-4" />,
    },
    cancelled: {
      bg: 'bg-gray-50 border-gray-300',
      text: 'text-gray-500',
      label: t('appointmentPanel.status.cancelled'),
      icon: <Ban className="w-4 h-4" />,
    },
  };

  const cfg = statusConfig[status] || statusConfig.pending;

  return (
    <div
      className={`max-w-xs lg:max-w-sm rounded-2xl border-2 p-4 ${cfg.bg} ${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-purple-600" />
        <span className="font-semibold text-gray-900 text-sm">
          {t('appointmentPanel.appointmentRequest')}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{time}</span>
        </div>
        {note && <p className="text-xs text-gray-500 italic">{note}</p>}
      </div>

      <div className={`flex items-center gap-1 text-xs font-medium ${cfg.text} mb-3`}>
        {cfg.icon}
        <span>{cfg.label}</span>
      </div>

      {canRespond && (
        <div className="flex gap-2">
          <button
            onClick={() => handleResponse('confirmed')}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            <Check className="w-3 h-3" />
            {t('appointmentPanel.actions.approve')}
          </button>
          <button
            onClick={() => handleResponse('rejected')}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-xl hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            {t('appointmentPanel.actions.reject')}
          </button>
        </div>
      )}

      {canCancel && status !== 'cancelled' && status !== 'rejected' && !canRespond && (
        <button
          onClick={handleCancel}
          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-300 transition-colors"
        >
          <Ban className="w-3 h-3" />
          {t('appointmentPanel.actions.cancel')}
        </button>
      )}

      {status === 'confirmed' && isOwnMessage && (
        <div className="mt-3 p-3 bg-white/80 rounded-xl border border-green-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">{t('appointmentPanel.reservation.type')}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <Check className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs font-medium text-green-800">{t('appointmentPanel.reservation.standard')}</p>
                <p className="text-[10px] text-green-600">{t('appointmentPanel.reservation.standardActive')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200 opacity-60">
              <Shield className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs font-medium text-purple-800">{t('appointmentPanel.reservation.guaranteedLabel')}</p>
                <p className="text-[10px] text-purple-500">{t('appointmentPanel.reservation.comingSoon')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBubble;
