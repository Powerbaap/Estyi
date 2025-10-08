import React, { useState } from 'react';
import React, { useState } from 'react';
import { X, Send, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Dr. Ahmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Rinoplasti ameliyatı hakkında detaylı bilgi gönderiyorum. Fiyat 3,500 USD ve süreç yaklaşık 2 saat sürüyor.',
      timestamp: '10 dk önce',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Estetik Kliniği',
      avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Teşekkürler! Bilgileri inceledim. Randevu almak istiyorum.',
      timestamp: '45 dk önce',
      unreadCount: 1,
      isOnline: false
    },
    {
      id: '3',
      name: 'Dr. Fatma Kaya',
      avatar: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=40&h=40&fit=crop&crop=face',
      lastMessage: 'Fiyat teklifiniz hazır. İncelemek ister misiniz?',
      timestamp: '2 sa önce',
      unreadCount: 0,
      isOnline: true
    }
  ];

  // Mock messages based on conversation ID
  React.useEffect(() => {
    const messagesData = {
      '1': [
        {
          id: '1',
          senderId: 'clinic',
          content: 'Merhaba! Size nasıl yardımcı olabilirim?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: true,
          isDelivered: true
        },
        {
          id: '2',
          senderId: 'user',
          content: 'Merhaba doktor, tedavi planım hakkında bilgi almak istiyorum.',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          isRead: true,
          isDelivered: true
        },
        {
          id: '3',
          senderId: 'clinic',
          content: 'Tabii ki! Hangi tedavi hakkında bilgi almak istiyorsunuz?',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          isRead: true,
          isDelivered: true
        },
        {
          id: '4',
          senderId: 'user',
          content: t('messages.rhinoplastyInquiry'),
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          isRead: true,
          isDelivered: true
        },
        {
          id: '5',
          senderId: 'clinic',
          content: t('messages.rhinoplastyInfo'),
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          isRead: false,
          isDelivered: true
        }
      ],
      '2': [
        {
          id: '1',
          senderId: 'clinic',
          content: 'Merhaba! Tedavi süreciniz hakkında detaylı bilgi gönderiyorum.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true,
          isDelivered: true
        },
        {
          id: '2',
          senderId: 'user',
          content: 'Teşekkürler! Bilgileri inceledim. Randevu almak istiyorum.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          isRead: false,
          isDelivered: true
        }
      ],
      '3': [
        {
          id: '1',
          senderId: 'clinic',
          content: 'Fiyat teklifiniz hazır. İncelemek ister misiniz?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true,
          isDelivered: true
        }
      ]
    };

    const conversationMessages = messagesData[selectedConversation as keyof typeof messagesData] || messagesData['1'];
    setMessages(conversationMessages);
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate reply
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'clinic',
        content: t('common.messageReceived'),
        timestamp: new Date(),
        isRead: false,
        isDelivered: true
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getReadStatusIcon = (message: Message) => {
    if (!message.isDelivered) {
      return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
    if (!message.isRead) {
      return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
    }
    return (
      <div className="flex">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full -ml-1"></div>
      </div>
    );
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[80vh] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t('common.messages')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {conversations.map((conversation) => (
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
                    <div className="relative">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <div className="flex justify-end mt-1">
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
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConv.avatar}
                      alt={selectedConv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConv.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedConv.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === 'user' && (
                          <div className="flex items-center">
                            {getReadStatusIcon(message)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-2 rounded-2xl bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
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
                <p className="text-lg">Bir konuşma seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal; 