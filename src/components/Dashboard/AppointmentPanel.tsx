import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Building, Check, X, Ban, MessageCircle, Shield, Star } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReviewForm from './ReviewForm';

interface Appointment {
  id: string;
  conversation_id: string;
  user_id: string;
  clinic_id: string;
  proposed_by: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reservation_type: string;
  treatment_completed: boolean;
  completed_at: string | null;
  deposit_amount: number | null;
  deposit_status: string;
  total_price: number | null;
  note: string | null;
  created_at: string;
  clinic_name?: string;
  user_email?: string;
  has_review?: boolean;
}

interface AppointmentPanelProps {
  role: 'user' | 'clinic';
}

const AppointmentPanel: React.FC<AppointmentPanelProps> = ({ role }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [reviewingApt, setReviewingApt] = useState<string | null>(null);

  const myId = user?.id || '';

  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const col = role === 'clinic' ? 'clinic_id' : 'user_id';
        const { data } = await supabase
          .from('appointments')
          .select('*')
          .eq(col, myId)
          .order('appointment_date', { ascending: true });

        const appts = data || [];

        // Karşı taraf isimleri + review durumu
        const enriched = await Promise.all(appts.map(async (apt: any) => {
          let clinic_name = '', user_email = '', has_review = false;
          if (role === 'user') {
            const { data: c } = await supabase.from('clinics').select('name').eq('id', apt.clinic_id).maybeSingle();
            clinic_name = c?.name || '';
          } else {
            const { data: u } = await supabase.from('users').select('email').eq('id', apt.user_id).maybeSingle();
            user_email = u?.email || '';
          }
          const { data: rev } = await supabase.from('reviews').select('id').eq('appointment_id', apt.id).maybeSingle();
          has_review = !!rev;
          return { ...apt, clinic_name, user_email, has_review };
        }));

        if (active) setAppointments(enriched);
      } catch (err) {
        console.error('Randevu yükleme hatası:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    const channel = supabase
      .channel(`apt-panel-${role}-${myId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => load())
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [user?.id, role]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const markCompleted = async (id: string) => {
    if (!confirm(t('appointmentPanel.actions.confirmComplete'))) return;
    await supabase.from('appointments').update({ treatment_completed: true, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, treatment_completed: true, completed_at: new Date().toISOString() } : a));
  };

  const goToChat = (convId: string) => {
    if (role === 'user') {
      navigate('/messages', { state: { conversationId: convId } });
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'short' }); } catch { return d; }
  };

  const statusCfg: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    pending: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: t('appointmentPanel.status.pending'), dot: 'bg-yellow-400' },
    confirmed: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: t('appointmentPanel.status.confirmed'), dot: 'bg-green-400' },
    rejected: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: t('appointmentPanel.status.rejected'), dot: 'bg-red-400' },
    cancelled: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', label: t('appointmentPanel.status.cancelled'), dot: 'bg-gray-400' },
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => {
    if (filter === 'completed') return a.treatment_completed;
    return a.status === filter;
  });

  const now = new Date();
  const upcoming = filtered.filter(a => new Date(a.appointment_date) >= now && !a.treatment_completed && a.status !== 'rejected' && a.status !== 'cancelled');
  const completed = filtered.filter(a => a.treatment_completed);
  const past = filtered.filter(a => (new Date(a.appointment_date) < now || a.status === 'rejected' || a.status === 'cancelled') && !a.treatment_completed);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            {t('appointmentPanel.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{t('appointmentPanel.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all','pending','confirmed','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f === 'all' ? t('appointmentPanel.filters.all') : f === 'pending' ? t('appointmentPanel.filters.pending') : f === 'confirmed' ? t('appointmentPanel.filters.confirmed') : f === 'completed' ? t('appointmentPanel.filters.completed') : t('appointmentPanel.filters.cancelled')}
            </button>
          ))}
        </div>
      </div>

      {/* Yaklaşan */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('appointmentPanel.sections.upcoming')}</h3>
          <div className="space-y-3">
            {upcoming.map(apt => {
              const cfg = statusCfg[apt.status] || statusCfg.pending;
              const canRespond = apt.status === 'pending' && apt.proposed_by !== myId;
              const canCancel = (apt.status === 'pending' || apt.status === 'confirmed') && !canRespond;
              return (
                <div key={apt.id} className={`border rounded-xl p-4 ${cfg.bg} hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}></div>
                        <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
                        {apt.reservation_type === 'guaranteed' && (
                          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3" /> {t('appointmentPanel.reservation.guaranteed')}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700"><Calendar className="w-4 h-4 text-gray-400" />{formatDate(apt.appointment_date)}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-700"><Clock className="w-4 h-4 text-gray-400" />{apt.appointment_time}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          {role === 'user' ? <><Building className="w-4 h-4 text-gray-400" />{apt.clinic_name || t('appointmentPanel.clinic')}</> : <><User className="w-4 h-4 text-gray-400" />{apt.user_email || t('appointmentPanel.patient')}</>}
                        </div>
                        {apt.note && <div className="text-sm text-gray-500 italic">📝 {apt.note}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button onClick={() => goToChat(apt.conversation_id)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg" title={t('appointmentPanel.actions.chat')}><MessageCircle className="w-4 h-4" /></button>
                      {canRespond && <>
                        <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-2 text-green-600 hover:bg-green-100 rounded-lg" title={t('appointmentPanel.actions.approve')}><Check className="w-4 h-4" /></button>
                        <button onClick={() => updateStatus(apt.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-100 rounded-lg" title={t('appointmentPanel.actions.reject')}><X className="w-4 h-4" /></button>
                      </>}
                      {canCancel && <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg" title={t('appointmentPanel.actions.cancel')}><Ban className="w-4 h-4" /></button>}
                      {role === 'clinic' && apt.status === 'confirmed' && !apt.treatment_completed && (
                        <button onClick={() => markCompleted(apt.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg" title={t('appointmentPanel.actions.markCompleted')}><Check className="w-4 h-4" /></button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tamamlanan */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('appointmentPanel.sections.completed')}</h3>
          <div className="space-y-3">
            {completed.map(apt => (
              <div key={apt.id} className="border border-blue-200 rounded-xl p-4 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                      <span className="text-sm font-semibold text-blue-700">{t('appointmentPanel.status.completed')}</span>
                      {apt.reservation_type === 'guaranteed' && (
                        <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" /> {t('appointmentPanel.reservation.guaranteed')}</span>
                      )}
                      {apt.has_review && <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"><Star className="w-3 h-3" /> {t('appointmentPanel.reviewed')}</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-gray-300" />{formatDate(apt.appointment_date)}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4 text-gray-300" />{apt.appointment_time}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {role === 'user' ? <><Building className="w-4 h-4 text-gray-300" />{apt.clinic_name}</> : <><User className="w-4 h-4 text-gray-300" />{apt.user_email}</>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button onClick={() => goToChat(apt.conversation_id)} className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg"><MessageCircle className="w-4 h-4" /></button>
                    {role === 'user' && apt.reservation_type === 'guaranteed' && !apt.has_review && (
                      <button onClick={() => setReviewingApt(apt.id)} className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600">{t('appointmentPanel.writeReview')}</button>
                    )}
                  </div>
                </div>
                {reviewingApt === apt.id && (
                  <ReviewForm appointmentId={apt.id} clinicId={apt.clinic_id} conversationId={apt.conversation_id} onDone={() => { setReviewingApt(null); }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geçmiş */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('appointmentPanel.sections.past')}</h3>
          <div className="space-y-3">
            {past.map(apt => {
              const cfg = statusCfg[apt.status] || statusCfg.pending;
              return (
                <div key={apt.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 opacity-70">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}></div>
                    <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="w-4 h-4 text-gray-300" />{formatDate(apt.appointment_date)}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {role === 'user' ? <><Building className="w-4 h-4 text-gray-300" />{apt.clinic_name}</> : <><User className="w-4 h-4 text-gray-300" />{apt.user_email}</>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">{t('appointmentPanel.empty.title')}</h3>
          <p className="text-sm text-gray-400">{t('appointmentPanel.empty.subtitle')}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentPanel;
