import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Send, ArrowLeft, Check, CheckCheck, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentBubble from './AppointmentBubble';
import AppointmentForm from './AppointmentForm';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ChatWindowProps {
  conversationId: string | null;
  onBack: () => void;
}

type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

type AppointmentPayload =
  | {
      type: 'appointment_request';
      appointmentId: string;
      date: string;
      time: string;
      note?: string;
    }
  | { type: 'appointment_response'; appointmentId: string; status: 'confirmed' | 'rejected' }
  | { type: 'appointment_cancelled'; appointmentId: string };

const parseAppointmentPayload = (content: string): AppointmentPayload | null => {
  const trimmed = content.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null;
  try {
    const obj: unknown = JSON.parse(trimmed);
    if (!obj || typeof obj !== 'object') return null;
    const rec = obj as Record<string, unknown>;
    if (typeof rec.type !== 'string') return null;

    const appointmentId = rec.appointment_id;
    if (typeof appointmentId !== 'string' || !appointmentId) return null;

    if (rec.type === 'appointment_request') {
      if (typeof rec.date !== 'string' || typeof rec.time !== 'string') return null;
      return {
        type: 'appointment_request',
        appointmentId,
        date: rec.date,
        time: rec.time,
        note: typeof rec.note === 'string' ? rec.note : undefined,
      };
    }

    if (rec.type === 'appointment_response') {
      if (rec.status !== 'confirmed' && rec.status !== 'rejected') return null;
      return { type: 'appointment_response', appointmentId, status: rec.status };
    }

    if (rec.type === 'appointment_cancelled') {
      return { type: 'appointment_cancelled', appointmentId };
    }

    return null;
  } catch {
    return null;
  }
};

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const { user } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState<Record<string, any>>({});
  const [convData, setConvData] = useState<{ user_id: string; clinic_id: string } | null>(null);
  const [partnerName, setPartnerName] = useState('');
  const partnerCacheRef = useRef<Record<string, string>>({});
  const prevLengthRef = useRef(0);

  const appointmentStatusById = useMemo(() => {
    const map: Record<string, AppointmentStatus> = {};
    for (const m of messages) {
      const payload = parseAppointmentPayload(m.content);
      if (!payload) continue;
      if (payload.type === 'appointment_request') {
        map[payload.appointmentId] = map[payload.appointmentId] || 'pending';
      } else if (payload.type === 'appointment_response') {
        map[payload.appointmentId] = payload.status;
      } else if (payload.type === 'appointment_cancelled') {
        map[payload.appointmentId] = 'cancelled';
      }
    }
    return map;
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !user?.id) return;
    let active = true;

    if (partnerCacheRef.current[conversationId]) {
      setPartnerName(partnerCacheRef.current[conversationId]);
    } else {
      setPartnerName('');
    }
    setMessages([]);
    setConvData(null);
    setAppointments({});
    prevLengthRef.current = 0;

    const loadAll = async () => {
      try {
        const [convResult, messagesResult] = await Promise.all([
          supabase.from('conversations').select('user_id, clinic_id').eq('id', conversationId).single(),
          supabase.from('messages').select('id, sender_id, content, created_at, is_read').eq('conversation_id', conversationId).order('created_at', { ascending: true }),
        ]);

        if (!messagesResult.error && active) {
          const list = Array.isArray(messagesResult.data) ? messagesResult.data : [];
          setMessages(list.map((m: any) => ({ id: m.id, sender_id: m.sender_id, content: m.content, created_at: m.created_at, is_read: !!m.is_read })));
        }

        if (convResult.data && active) {
          const conv = convResult.data;
          setConvData({ user_id: conv.user_id, clinic_id: conv.clinic_id });
          const otherPartyId = conv.user_id === user.id ? conv.clinic_id : conv.user_id;
          const [clinicRes, userRes] = await Promise.all([
            supabase.from('clinics').select('name').eq('id', otherPartyId).maybeSingle(),
            supabase.from('users').select('email').eq('id', otherPartyId).maybeSingle(),
          ]);
          if (active) {
            const name = clinicRes.data?.name || userRes.data?.email || '';
            setPartnerName(name);
            if (name) partnerCacheRef.current[conversationId] = name;
          }
        }

        try {
          const { data: aptsData } = await supabase
            .from('appointments')
            .select('*')
            .eq('conversation_id', conversationId);
          if (aptsData && active) {
            const aptMap: Record<string, any> = {};
            aptsData.forEach((a: any) => {
              aptMap[a.id] = a;
            });
            setAppointments(aptMap);
          }
        } catch {}

        supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', user.id).then(() => {});
      } catch (err) {
        console.error('Mesaj yükleme hatası:', err);
      }
    };

    loadAll();

    const channel = supabase
      .channel(`room-${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, async (payload: any) => {
        if (!active) return;
        const msg = payload.new;
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, { id: msg.id, sender_id: msg.sender_id, content: msg.content, created_at: msg.created_at, is_read: !!msg.is_read }];
        });
        if (msg.sender_id !== user?.id) {
          supabase.from('messages').update({ is_read: true }).eq('id', msg.id).then(() => {});
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload: any) => {
        if (!active) return;
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, is_read: !!payload.new.is_read } : m));
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (!active) return;
          if (payload.eventType === 'DELETE') {
            setAppointments(prev => {
              const n = { ...prev };
              delete n[payload.old.id];
              return n;
            });
          } else {
            setAppointments(prev => ({ ...prev, [payload.new.id]: payload.new }));
          }
        }
      )
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [conversationId, user?.id]);

  useEffect(() => {
    if (messages.length !== prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !conversationId || !user?.id || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage('');
    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempId, sender_id: user.id, content, created_at: new Date().toISOString(), is_read: false }]);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: user.id, sender_type: 'user', content })
        .select()
        .single();

      if (!error && data) {
        setMessages(prev => prev.map(m => m.id === tempId ? { id: data.id, sender_id: data.sender_id, content: data.content, created_at: data.created_at, is_read: !!data.is_read } : m));
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setNewMessage(content);
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  }, [newMessage, conversationId, user?.id, sending]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      if (isToday) return 'Bugün';
      if (isYesterday) return 'Dün';
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return ''; }
  };

  const formatMessageTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const getDateKey = (dateStr: string) => {
    try { return new Date(dateStr).toDateString(); } catch { return ''; }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3 flex-shrink-0">
        <button onClick={onBack} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{partnerName ? partnerName.charAt(0).toUpperCase() : '?'}</span>
        </div>
        <div><h3 className="font-semibold text-gray-900">{partnerName || 'Sohbet'}</h3></div>
      </div>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p className="text-sm">Henüz mesaj yok. İlk mesajı gönderin!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDateSeparator = index === 0 || getDateKey(message.created_at) !== getDateKey(messages[index - 1].created_at);
            const isOwn = message.sender_id === user?.id;
            const isTemp = message.id.startsWith('temp-');
            
            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                )}
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${isTemp ? 'opacity-70' : ''}`}>
                    {(() => {
                      try {
                        const parsed = JSON.parse(message.content);

                        if (parsed.type === 'appointment_request') {
                          const apt = appointments[parsed.appointment_id] || { status: 'pending' };
                          return (
                            <AppointmentBubble
                              appointmentId={parsed.appointment_id}
                              date={parsed.date}
                              time={parsed.time}
                              note={parsed.note}
                              status={apt.status || appointmentStatusById[parsed.appointment_id] || 'pending'}
                              isOwnMessage={message.sender_id === user?.id}
                              currentUserId={user?.id || ''}
                              proposedBy={message.sender_id}
                              conversationId={conversationId || ''}
                              onUpdate={() => {}}
                            />
                          );
                        }

                        let label: string | null = null;
                        if (parsed.type === 'appointment_response') {
                          label =
                            parsed.status === 'confirmed'
                              ? 'Randevu onaylandı ✅'
                              : 'Randevu reddedildi ❌';
                        } else if (parsed.type === 'appointment_cancelled') {
                          label = 'Randevu iptal edildi 🚫';
                        }

                        return (
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {label ? (
                              <p className="text-sm italic whitespace-pre-wrap break-words">{label}</p>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            )}
                          </div>
                        );
                      } catch {
                        return (
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          </div>
                        );
                      }
                    })()}
                    <div className={`flex items-center justify-end mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      <span className="text-xs mr-1">{formatMessageTime(message.created_at)}</span>
                      {isOwn && (message.is_read ? <CheckCheck className="w-3 h-3 text-blue-200" /> : <Check className="w-3 h-3 text-gray-300" />)}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {showAppointmentForm && convData && (
        <AppointmentForm
          conversationId={conversationId || ''}
          userId={user?.id || ''}
          clinicId={convData.clinic_id}
          onSent={() => setShowAppointmentForm(false)}
          onCancel={() => setShowAppointmentForm(false)}
        />
      )}

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAppointmentForm(!showAppointmentForm)}
            className={`p-3 rounded-full transition-colors ${
              showAppointmentForm
                ? 'bg-purple-100 text-purple-600'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Randevu Oluştur"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Mesajınızı yazın..." className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
