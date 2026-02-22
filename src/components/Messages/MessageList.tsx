import React, { useState, useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  clinic_id: string;
  user_id: string;
}

interface MessageListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectConversation, selectedConversation }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const loadConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .or(`user_id.eq.${user.id},clinic_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('Konuşma yükleme hatası:', error);
          setConversations([]);
          return;
        }

        const convList = Array.isArray(data) ? data : [];
        const enriched = await Promise.all(
          convList.map(async (conv: any) => {
            const otherPartyId = conv.user_id === user.id ? conv.clinic_id : conv.user_id;
            let name = 'Bilinmeyen';
            try {
              const { data: clinic } = await supabase
                .from('clinics')
                .select('name')
                .eq('id', otherPartyId)
                .maybeSingle();
              if (clinic?.name) {
                name = clinic.name;
              } else {
                name = `Kullanıcı ${otherPartyId.slice(-4)}`;
              }
            } catch {}

            let lastMessage = '';
            let timestamp = '';
            try {
              const { data: msg } = await supabase.from('messages').select('content, created_at').eq('conversation_id', conv.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
              if (msg) {
                lastMessage = msg.content?.substring(0, 50) || '';
                timestamp = msg.created_at ? new Date(msg.created_at).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';
              }
            } catch {}

            return { id: conv.id, name, lastMessage, timestamp, unreadCount: 0, clinic_id: conv.clinic_id, user_id: conv.user_id };
          })
        );
        setConversations(enriched);
      } catch (err) {
        console.error('Konuşma yükleme hatası:', err);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, [user?.id]);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) || conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && conversation.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('messages.title', { defaultValue: 'Mesajlar' })}</h2>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Mesajlarda ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Tümü</button>
          <button onClick={() => setFilter('unread')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Okunmamış</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-500"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('messages.emptyConversations', { defaultValue: 'Mesaj Yok' })}</p>
            <p className="text-sm text-center">{t('messages.startChatHint', { defaultValue: 'Henüz mesajınız bulunmuyor' })}</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div key={conversation.id} onClick={() => onSelectConversation(conversation.id)} className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedConversation === conversation.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{conversation.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage || 'Mesaj yok'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
