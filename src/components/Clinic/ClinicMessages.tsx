import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Check, CheckCheck, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import AppointmentBubble from '../Messages/AppointmentBubble';
import AppointmentForm from '../Messages/AppointmentForm';

interface Conversation {
  id: string;
  user_id: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
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

const ClinicMessages: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const clinicId = (user as any)?.user_metadata?.clinic_id || user?.id;
  const currentUserId = user?.id || '';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointments, setAppointments] = useState<Record<string, any>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());

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
    if (!clinicId) {
      setConversations([]);
      return;
    }
    let active = true;
    const loadConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('clinic_id', clinicId)
          .order('created_at', { ascending: false });
        if (error || !active) {
          setConversations([]);
          return;
        }
        const list = Array.isArray(data) ? data : [];
        const enriched = await Promise.all(
          list.map(async (conv: any) => {
            let lastMessage = '';
            let lastTime = '';
            try {
              const { data: msg } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
              if (msg) {
                const payload = msg.content ? parseAppointmentPayload(msg.content) : null;
                if (!payload) {
                  lastMessage = msg.content || '';
                } else if (payload.type === 'appointment_request') {
                  lastMessage = t('appointmentPanel.appointmentRequest');
                } else if (payload.type === 'appointment_response') {
                  lastMessage =
                    payload.status === 'confirmed'
                      ? t('appointmentPanel.status.confirmed')
                      : t('appointmentPanel.status.rejected');
                } else {
                  lastMessage = t('appointmentPanel.status.cancelled');
                }
                lastTime = msg.created_at || '';
              }
            } catch {}

            let unreadCount = 0;
            try {
              const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conv.id)
                .eq('is_read', false)
                .neq('sender_id', currentUserId);
              unreadCount = count || 0;
            } catch {}

            return {
              id: conv.id,
              user_id: conv.user_id,
              lastMessage,
              lastMessageTime: lastTime,
              unreadCount,
            } as Conversation;
          })
        );
        if (active) {
          setConversations(enriched);
        }
      } catch {
        if (active) {
          setConversations([]);
        }
      }
    };
    loadConversations();
    return () => {
      active = false;
    };
  }, [clinicId]);

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      setAppointments({});
      setShowAppointmentForm(false);
      return;
    }
    let active = true;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedConversation)
          .order('created_at', { ascending: true });
        if (!error && active) {
          const list = Array.isArray(data) ? data : [];
          setMessages(
            list.map((m: any) => ({
              id: m.id,
              sender_id: m.sender_id,
              content: m.content,
              created_at: m.created_at,
              is_read: !!m.is_read,
            }))
          );
        }

        try {
          const { data: aptsData } = await supabase
            .from('appointments')
            .select('*')
            .eq('conversation_id', selectedConversation);
          if (aptsData && active) {
            const aptMap: Record<string, any> = {};
            aptsData.forEach((a: any) => {
              aptMap[a.id] = a;
            });
            setAppointments(aptMap);
          }
        } catch {}

        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', selectedConversation)
          .neq('sender_id', currentUserId);
      } catch {
      } finally {
        if (active) {
          setLoadingMessages(false);
        }
      }
    };
    loadMessages();
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation ? { ...conv, unreadCount: 0 } : conv
      )
    );
    const channel = supabase
      .channel(`clinic-messages:${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        payload => {
          if (active) {
            const msg = payload.new;
            if (pendingIdsRef.current.has(msg.id)) {
              pendingIdsRef.current.delete(msg.id);
              return;
            }
            setMessages(prev => {
              if (prev.some(m => m.id === msg.id)) return prev;
              return [...prev, {
                id: msg.id,
                sender_id: msg.sender_id,
                content: msg.content,
                created_at: msg.created_at,
                is_read: !!msg.is_read,
              }];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        payload => {
          if (active) {
            setMessages(prev =>
              prev.map(m =>
                m.id === payload.new.id
                  ? { ...m, is_read: !!payload.new.is_read }
                  : m
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `conversation_id=eq.${selectedConversation}`,
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
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;
    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { data, error } = await supabase.from('messages').insert({
        conversation_id: selectedConversation,
        sender_id: currentUserId,
        content,
      }).select().single();

      if (error) throw error;
      if (data) {
        pendingIdsRef.current.add(data.id);
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, { id: data.id, sender_id: data.sender_id, content: data.content, created_at: data.created_at, is_read: false }];
        });
      }
    } catch (error: any) {
      console.error('Mesaj gönderme hatası:', JSON.stringify(error));
      setNewMessage(content);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation) || null;
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!user) {
    return (
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 items-center justify-center">
        <p className="text-gray-500 text-sm">{t('clinic.loginRequired', 'Login Required')}</p>
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-280px)] min-h-[500px] overflow-hidden">
      <div className="w-1/3 border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('clinic.messages')}</h2>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {totalUnread}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{t('clinic.chatWithPatients')}</p>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p className="text-sm">{t('clinic.noConversations') || 'Henüz mesajınız bulunmamaktadır.'}</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map(conversation => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : conversation.unreadCount > 0
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {`K${conversation.user_id.slice(-4)}`.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`truncate ${
                            conversation.unreadCount > 0
                              ? 'font-bold text-gray-900'
                              : 'font-semibold text-gray-900'
                          }`}
                        >
                          {`${t('clinicReviews.user', 'User')} ${conversation.user_id.slice(-4)}`}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageTime
                            ? new Date(conversation.lastMessageTime).toLocaleTimeString(i18n.language || 'tr', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || t('clinic.noMessages') || 'Mesaj yok'}
                      </p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="ml-2">
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {`K${selectedConv.user_id.slice(-4)}`.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {`${t('clinicReviews.user', 'User')} ${selectedConv.user_id.slice(-4)}`}
                  </h3>
                </div>
              </div>
            </div>
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <span>{t('clinic.loadingMessages', 'Loading messages...')}</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <span>{t('clinic.noMessages') || 'Henüz mesaj yok. İlk mesajı gönderin.'}</span>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {(() => {
                      const isOwn = message.sender_id === currentUserId;

                      return (
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
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
                                    isOwnMessage={message.sender_id === currentUserId}
                                    currentUserId={currentUserId}
                                    proposedBy={message.sender_id}
                                    conversationId={selectedConversation || ''}
                                    onUpdate={() => {}}
                                  />
                                );
                              } else if (parsed.type === 'appointment_response') {
                                const label =
                                  parsed.status === 'confirmed'
                                    ? t('appointmentPanel.status.confirmed') + ' ✅'
                                    : t('appointmentPanel.status.rejected') + ' ❌';
                                return <p className="text-sm italic">{label}</p>;
                              } else if (parsed.type === 'appointment_cancelled') {
                                return <p className="text-sm italic">{t('appointmentPanel.status.cancelled')} 🚫</p>;
                              } else if (parsed.type === 'review_submitted') {
                                return <p className="text-sm italic">⭐ {t('appointmentPanel.reviewed', 'Reviewed')} ({parsed.rating}/5)</p>;
                              }

                              return (
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                    isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
                          <div
                            className={`flex items-center justify-end mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            <span className="text-xs mr-1">
                              {message.created_at
                                ? new Date(message.created_at).toLocaleTimeString(i18n.language || 'tr', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ''}
                            </span>
                            {isOwn && (
                              <span className="text-xs">
                                {message.is_read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-300" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-300" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ))
              )}
            </div>
            {showAppointmentForm && selectedConv && (
              <AppointmentForm
                conversationId={selectedConversation || ''}
                userId={selectedConv.user_id}
                clinicId={clinicId}
                onSent={() => setShowAppointmentForm(false)}
                onCancel={() => setShowAppointmentForm(false)}
              />
            )}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                  className={`p-3 rounded-full transition-colors ${
                    showAppointmentForm
                      ? 'bg-purple-100 text-purple-600'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title={t('appointmentForm.title', 'Create Appointment')}
                >
                  <Calendar className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('clinic.typeMessage')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg">{t('clinic.selectConversation')}</p>
              <p className="text-sm mt-2">{t('clinic.choosePatient')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicMessages;
