import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

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

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const { user } = useAuth();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    if (!conversationId || !user?.id) return;
    let active = true;

    const loadMessages = async () => {
      try {
        const { data: conv } = await supabase.from('conversations').select('user_id, clinic_id').eq('id', conversationId).single();
        if (conv) {
          const otherPartyId = conv.user_id === user.id ? conv.clinic_id : conv.user_id;
          try {
            const { data: clinic } = await supabase.from('clinics').select('name').eq('id', otherPartyId).maybeSingle();
            if (clinic?.name) setPartnerName(clinic.name);
            else {
              const { data: u } = await supabase.from('users').select('email').eq('id', otherPartyId).maybeSingle();
              if (u?.email) setPartnerName(u.email);
            }
          } catch {}
        }

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
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

        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .neq('sender_id', user.id);
      } catch (err) { console.error('Mesaj yükleme hatası:', err); }
    };
    loadMessages();

    const channel = supabase
      .channel(`public:messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          if (active) {
            const msg = payload.new;
            const mapped: Message = {
              id: msg.id,
              sender_id: msg.sender_id,
              content: msg.content,
              created_at: msg.created_at,
              is_read: !!msg.is_read,
            };
            setMessages(prev => [...prev, mapped]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
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
      .subscribe();

    return () => { active = false; supabase.removeChannel(channel); };
  }, [conversationId, user?.id]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user?.id || sending) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: user.id, sender_type: 'user', content: newMessage.trim() });
      if (!error) { setNewMessage(''); }
      else { console.error('Mesaj gönderme hatası:', error); }
    } catch (err) { console.error('Mesaj gönderme hatası:', err); }
    finally { setSending(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const formatTime = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center space-x-3 flex-shrink-0">
        <button onClick={onBack} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{partnerName ? partnerName.charAt(0).toUpperCase() : '?'}</span>
        </div>
        <div><h3 className="font-semibold text-gray-900">{partnerName || 'Sohbet'}</h3></div>
      </div>
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-500"><p className="text-sm">Henüz mesaj yok. İlk mesajı gönderin!</p></div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center justify-end mt-1 ${
                    message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  <span className="text-xs mr-1">{formatTime(message.created_at)}</span>
                  {message.sender_id === user?.id && (
                    <span className="text-xs">
                      {message.is_read ? (
                        <CheckCheck className="w-3 h-3 text-blue-200" />
                      ) : (
                        <Check className="w-3 h-3 text-gray-300" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Mesajınızı yazın..." className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
