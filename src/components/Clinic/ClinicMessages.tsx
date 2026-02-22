import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface Conversation {
  id: string;
  user_id: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const ClinicMessages: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const clinicId = (user as any)?.user_metadata?.clinic_id || user?.id;
  const currentUserId = user?.id || '';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
            let userEmail = '';
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('email')
                .eq('id', conv.user_id)
                .maybeSingle();
              if (userData?.email) {
                userEmail = userData.email;
              }
            } catch {}
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
                lastMessage = msg.content || '';
                lastTime = msg.created_at || '';
              }
            } catch {}
            return {
              id: conv.id,
              user_id: conv.user_id,
              userEmail: userEmail || conv.user_id,
              lastMessage,
              lastMessageTime: lastTime,
              unreadCount: 0,
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
          setMessages(Array.isArray(data) ? (data as Message[]) : []);
        }
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
            setMessages(prev => [...prev, payload.new as Message]);
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;
    const content = newMessage.trim();
    setNewMessage('');
    try {
      await supabase.from('messages').insert({
        conversation_id: selectedConversation,
        sender_id: currentUserId,
        content,
      });
    } catch {
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation) || null;
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!user) {
    return (
      <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500 text-sm">{t('clinic.loginRequired')}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 flex">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
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
        <div className="flex-1 overflow-y-auto">
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
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {conversation.userEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.userEmail}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageTime
                            ? new Date(conversation.lastMessageTime).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage || t('clinic.noMessages') || 'Mesaj yok'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="mt-1">
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
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
                    {selectedConv.userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConv.userEmail}</h3>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  <span>{t('clinic.loadingMessages') || 'Mesajlar yükleniyor...'}</span>
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
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender_id === currentUserId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center justify-end mt-1 ${
                          message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        <span className="text-xs">
                          {message.created_at
                            ? new Date(message.created_at).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
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
