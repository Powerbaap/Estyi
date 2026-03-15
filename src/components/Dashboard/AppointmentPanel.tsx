import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Building, Check, X, Ban, MessageCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Appointment {
  id: string;
  conversation_id: string;
  user_id: string;
  clinic_id: string;
  proposed_by: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  note: string | null;
  created_at: string;
  updated_at: string;
  clinic_name?: string;
  user_email?: string;
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
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const userId = user?.id || '';
  const clinicId = (user as any)?.user_metadata?.clinic_id || user?.id || '';

  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    const loadAppointments = async () => {
      setLoading(true);
      try {
        const column = role === 'clinic' ? 'clinic_id' : 'user_id';
        const id = role === 'clinic' ? clinicId : userId;

        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq(column, id)
          .order('appointment_date', { ascending: true });

        if (error || !active) {
          setAppointments([]);
          return;
        }

        const appts = data || [];

        // Karşı taraf isimlerini çek
        const enriched = await Promise.all(
          appts.map(async (apt: any) => {
            let clinic_name = '';
            let user_email = '';

            if (role === 'user') {
              const { data: clinic } = await supabase
                .from('clinics')
                .select('name')
                .eq('id', apt.clinic_id)
                .maybeSingle();
              clinic_name = clinic?.name || '';
            } else {
              const { data: usr } = await supabase
                .from('users')
                .select('email')
                .eq('id', apt.user_id)
                .maybeSingle();
              user_email = usr?.email || '';
            }

            return { ...apt, clinic_name, user_email };
          })
        );

        if (active) setAppointments(enriched);
      } catch (err) {
        console.error('Randevu yükleme hatası:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAppointments();

    // Realtime
    const channel = supabase
      .channel(`appointments-${role}-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadAppointments();
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, role]);

  const handleCancel = async (aptId: string) => {
    if (!confirm('Randevuyu iptal etmek istediğinizden emin misiniz?')) return;
    try {
      await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', aptId);

      setAppointments(prev =>
        prev.map(a => (a.id === aptId ? { ...a, status: 'cancelled' } : a))
      );
    } catch (err) {
      console.error('İptal hatası:', err);
    }
  };

  const handleConfirm = async (aptId: string) => {
    try {
      await supabase
        .from('appointments')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', aptId);

      setAppointments(prev =>
        prev.map(a => (a.id === aptId ? { ...a, status: 'confirmed' } : a))
      );
    } catch (err) {
      console.error('Onay hatası:', err);
    }
  };

  const handleReject = async (aptId: string) => {
    try {
      await supabase
        .from('appointments')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', aptId);

      setAppointments(prev =>
        prev.map(a => (a.id === aptId ? { ...a, status: 'rejected' } : a))
      );
    } catch (err) {
      console.error('Red hatası:', err);
    }
  };

  const goToChat = (conversationId: string) => {
    if (role === 'user') {
      navigate('/messages', { state: { conversationId } });
    } else {
      // Klinik dashboard'da messages tabına geç
      window.dispatchEvent(new CustomEvent('switch-clinic-tab', { detail: { tab: 'messages' } }));
    }
  };

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        weekday: 'short',
      });
    } catch {
      return d;
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string; dot: string }> = {
    pending: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', label: 'Onay Bekliyor', dot: 'bg-yellow-400' },
    confirmed: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', label: 'Onaylandı', dot: 'bg-green-400' },
    rejected: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'Reddedildi', dot: 'bg-red-400' },
    cancelled: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', label: 'İptal Edildi', dot: 'bg-gray-400' },
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const now = new Date();
  const upcoming = filtered.filter(a => new Date(a.appointment_date) >= now && (a.status === 'pending' || a.status === 'confirmed'));
  const past = filtered.filter(a => new Date(a.appointment_date) < now || a.status === 'rejected' || a.status === 'cancelled');

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled' || a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Filtreler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-600" />
            Randevularım
          </h2>
          <p className="text-sm text-gray-500 mt-1">Tüm randevularınızı buradan takip edin</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'pending', label: 'Bekleyen' },
            { key: 'confirmed', label: 'Onaylı' },
            { key: 'cancelled', label: 'İptal' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label} ({(counts as any)[f.key]})
            </button>
          ))}
        </div>
      </div>

      {/* Yaklaşan Randevular */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Yaklaşan Randevular</h3>
          <div className="space-y-3">
            {upcoming.map(apt => {
              const cfg = statusConfig[apt.status] || statusConfig.pending;
              const canRespond = apt.status === 'pending' && apt.proposed_by !== (role === 'clinic' ? clinicId : userId);
              const canCancel = apt.status === 'pending' || apt.status === 'confirmed';

              return (
                <div key={apt.id} className={`border rounded-xl p-4 ${cfg.bg} transition-all hover:shadow-md`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}></div>
                        <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(apt.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{apt.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          {role === 'user' ? (
                            <>
                              <Building className="w-4 h-4 text-gray-400" />
                              <span>{apt.clinic_name || 'Klinik'}</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{apt.user_email || 'Hasta'}</span>
                            </>
                          )}
                        </div>
                        {apt.note && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                            <span>📝 {apt.note}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => goToChat(apt.conversation_id)}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        title="Sohbete Git"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {canRespond && (
                        <>
                          <button
                            onClick={() => handleConfirm(apt.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Onayla"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(apt.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Reddet"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {canCancel && !canRespond && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                          title="İptal Et"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geçmiş Randevular */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Geçmiş Randevular</h3>
          <div className="space-y-3">
            {past.map(apt => {
              const cfg = statusConfig[apt.status] || statusConfig.pending;
              return (
                <div key={apt.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`}></div>
                        <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-5">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-300" />
                          <span>{formatDate(apt.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-300" />
                          <span>{apt.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {role === 'user' ? (
                            <>
                              <Building className="w-4 h-4 text-gray-300" />
                              <span>{apt.clinic_name || 'Klinik'}</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-gray-300" />
                              <span>{apt.user_email || 'Hasta'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => goToChat(apt.conversation_id)}
                      className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Sohbete Git"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {filtered.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">Randevu Bulunamadı</h3>
          <p className="text-sm text-gray-400">Henüz bir randevunuz bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentPanel;
