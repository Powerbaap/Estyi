import React, { useState } from 'react';
import { Calendar, Send, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

interface AppointmentFormProps {
  conversationId: string;
  userId: string;
  clinicId: string;
  onSent: () => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  conversationId,
  userId,
  clinicId,
  onSent,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!date || !time) return;
    setSending(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData?.session?.user?.id;
      if (!currentUserId) throw new Error('No session');

      const { data: apt, error: aptErr } = await supabase
        .from('appointments')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          clinic_id: clinicId,
          proposed_by: currentUserId,
          appointment_date: date,
          appointment_time: time,
          note: note || null,
          status: 'pending',
        })
        .select('id')
        .single();

      if (aptErr) throw aptErr;

      const content = JSON.stringify({
        type: 'appointment_request',
        appointment_id: apt.id,
        date,
        time,
        note: note || undefined,
      });

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        sender_type: currentUserId === clinicId ? 'clinic' : 'user',
        content,
      });

      // Karşı tarafa bildirim gönder
      const recipientId = currentUserId === clinicId ? userId : clinicId;
      try {
        await supabase.from('notifications').insert({
          user_id: recipientId,
          type: 'appointment',
          title: t('appointmentPanel.appointmentRequest', 'Randevu Talebi'),
          message: `${date} - ${time}`,
          action_url: '/messages',
          metadata: { conversation_id: conversationId, appointment_id: apt.id },
        });
      } catch {}

      onSent();
    } catch (err) {
      console.error('Randevu gönderme hatası:', err);
      alert(t('appointmentForm.error', 'Randevu gönderilemedi.'));
    } finally {
      setSending(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 bg-purple-50 border-t border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-sm text-purple-900">
            {t('appointmentForm.title', 'Randevu Oluştur')}
          </span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-purple-600" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">{t('appointmentForm.date', 'Tarih')}</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">{t('appointmentForm.time', 'Saat')}</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
      <input
        type="text"
        placeholder={t('appointmentForm.notePlaceholder', 'Not ekle (opsiyonel)')}
        value={note}
        onChange={e => setNote(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm mb-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />
      <button
        onClick={handleSend}
        disabled={!date || !time || sending}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
        {sending ? t('appointmentForm.sending', 'Gönderiliyor...') : t('appointmentForm.send', 'Randevu Gönder')}
      </button>
    </div>
  );
};

export default AppointmentForm;
