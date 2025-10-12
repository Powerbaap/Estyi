import React, { useEffect, useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface MessageListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ onSelectConversation, selectedConversation }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [dbStatus, setDbStatus] = useState<{ state: 'checking' | 'ok' | 'reachable_needs_auth' | 'error'; detail?: string }>({ state: 'checking' });

  // Yeni hesaplar için başlangıçta boş konuşma listesi
  const conversations: Conversation[] = [];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && conversation.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const checkDb = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!url || !key) {
        setDbStatus({ state: 'error', detail: 'Supabase ortam değişkenleri eksik' });
        return;
      }

      try {
        const { error } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true });

        if (error) {
          const msg = (error.message || '').toLowerCase();
          const code = (error as any).code as string | undefined;
          const isPermission = msg.includes('permission') || (code && code.startsWith('PGRST'));
          if (isPermission) {
            setDbStatus({ state: 'reachable_needs_auth', detail: 'Erişilebilir, RLS/yetki gerekli' });
          } else if (msg.includes('fetch') || msg.includes('network')) {
            setDbStatus({ state: 'error', detail: 'Ağ/erişim hatası' });
          } else {
            setDbStatus({ state: 'error', detail: error.message });
          }
        } else {
          setDbStatus({ state: 'ok' });
        }
      } catch (e: any) {
        const msg = (e?.message || '').toLowerCase();
        if (msg.includes('fetch') || msg.includes('network')) {
          setDbStatus({ state: 'error', detail: 'Ağ/erişim hatası' });
        } else {
          setDbStatus({ state: 'error', detail: e?.message || 'Bilinmeyen hata' });
        }
      }
    };

    checkDb();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Mesajlar</h2>
        </div>

        {/* Supabase Bağlantı Durumu */}
        <div className="mb-3">
          {dbStatus.state === 'checking' && (
            <div className="text-sm text-gray-600">Veritabanı bağlantısı kontrol ediliyor…</div>
          )}
          {dbStatus.state === 'ok' && (
            <div className="text-sm px-3 py-2 rounded-md bg-green-50 text-green-700 border border-green-200">
              Supabase veritabanı durumu: Bağlı
            </div>
          )}
          {dbStatus.state === 'reachable_needs_auth' && (
            <div className="text-sm px-3 py-2 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
              Supabase veritabanı durumu: Ulaşılabilir (RLS/yetki gerekli)
            </div>
          )}
          {dbStatus.state === 'error' && (
            <div className="text-sm px-3 py-2 rounded-md bg-red-50 text-red-700 border border-red-200">
              Supabase veritabanı durumu: Sorun var{dbStatus.detail ? ` — ${dbStatus.detail}` : ''}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Mesajlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Okunmamış
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('messages.emptyConversations', { defaultValue: 'Mesaj Yok' })}</p>
            <p className="text-sm text-center">{t('messages.startChatHint', { defaultValue: 'Henüz mesajınız bulunmuyor' })}</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
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