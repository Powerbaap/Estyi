import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isDelivered: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock conversation data
  const conversationData = {
    '1': {
      name: 'Dr. Ahmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
      isOnline: true
    },
    '2': {
      name: 'Estetik Kliniği',
      avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=40&h=40&fit=crop&crop=face',
      isOnline: false
    },
    '3': {
      name: 'Dr. Fatma Kaya',
      avatar: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=40&h=40&fit=crop&crop=face',
      isOnline: true
    }
  };

  const conversationInfo = conversationData[conversationId as keyof typeof conversationData] || conversationData['1'];

  // Mock messages based on conversation ID
  useEffect(() => {
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
          content: 'Rinoplasti ameliyatı hakkında bilgi almak istiyorum. Fiyat ve süreç nasıl olacak?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          isRead: true,
          isDelivered: true
        },
        {
          id: '5',
          senderId: 'clinic',
          content: 'Rinoplasti ameliyatı hakkında detaylı bilgi gönderiyorum. Fiyat 3,500 USD ve süreç yaklaşık 2 saat sürüyor.',
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

    const conversationMessages = messagesData[conversationId as keyof typeof messagesData] || messagesData['1'];
    setMessages(conversationMessages);
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [conversationId]);

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
        content: 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.',
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Back button for mobile */}
          <button 
            onClick={onBack}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <img
              src={conversationInfo.avatar}
              alt={conversationInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversationInfo.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{conversationInfo.name}</h3>
            <p className="text-sm text-gray-500">
              {conversationInfo.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
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
    </div>
  );
};

export default ChatWindow; 