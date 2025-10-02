import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, HandPlatter as Translate, X } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  translatedContent?: string;
  timestamp: Date;
  seen: boolean;
  delivered: boolean;
}

interface Conversation {
  id: string;
  userId: string;
  procedure: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  language: string;
  messages: Message[];
}

const ClinicMessages: React.FC = () => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      userId: 'User1234',
      procedure: 'Rhinoplasty',
      lastMessage: 'Thank you for the offer. When can we schedule the consultation?',
      lastMessageTime: new Date('2025-01-20T14:30:00'),
      unreadCount: 1,
      isOnline: true,
      language: 'English',
      messages: [
        {
          id: 'm1',
          senderId: 'clinic',
          receiverId: 'User1234',
          content: 'Thank you for accepting our offer! We are excited to help you with your rhinoplasty procedure.',
          timestamp: new Date('2025-01-20T10:00:00'),
          seen: true,
          delivered: true
        },
        {
          id: 'm2',
          senderId: 'User1234',
          receiverId: 'clinic',
          content: 'Thank you for the offer. When can we schedule the consultation?',
          timestamp: new Date('2025-01-20T14:30:00'),
          seen: false,
          delivered: true
        }
      ]
    },
    {
      id: '2',
      userId: 'User5678',
      procedure: 'Hair Transplant',
      lastMessage: 'I have some questions about the procedure details.',
      lastMessageTime: new Date('2025-01-19T16:45:00'),
      unreadCount: 0,
      isOnline: false,
      language: 'Turkish',
      messages: [
        {
          id: 'm3',
          senderId: 'clinic',
          receiverId: 'User5678',
          content: 'We have received your request for hair transplant. Here is our detailed offer.',
          timestamp: new Date('2025-01-19T14:00:00'),
          seen: true,
          delivered: true
        },
        {
          id: 'm4',
          senderId: 'User5678',
          receiverId: 'clinic',
          content: 'I have some questions about the procedure details.',
          timestamp: new Date('2025-01-19T16:45:00'),
          seen: true,
          delivered: true
        }
      ]
    },
    {
      id: '3',
      userId: 'User9012',
      procedure: 'Breast Surgery',
      lastMessage: 'The consultation date works perfectly for me.',
      lastMessageTime: new Date('2025-01-18T11:20:00'),
      unreadCount: 0,
      isOnline: true,
      language: 'Arabic',
      messages: [
        {
          id: 'm5',
          senderId: 'clinic',
          receiverId: 'User9012',
          content: 'We have scheduled your consultation for next week. Please confirm if this works for you.',
          timestamp: new Date('2025-01-18T10:00:00'),
          seen: true,
          delivered: true
        },
        {
          id: 'm6',
          senderId: 'User9012',
          receiverId: 'clinic',
          content: 'The consultation date works perfectly for me.',
          timestamp: new Date('2025-01-18T11:20:00'),
          seen: true,
          delivered: true
        }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, conversations]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'clinic',
      receiverId: conversation.userId,
      content: newMessage,
      timestamp: new Date(),
      seen: false,
      delivered: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        };
      }
      return conv;
    }));

    setNewMessage('');

    // Simulate patient response after 3 seconds
    setTimeout(() => {
      const responses = [
        'Thank you for the information!',
        'That sounds good, when can we proceed?',
        'I need to think about it.',
        'Can you provide more details?'
      ];
      
      const response: Message = {
        id: `m${Date.now() + 1}`,
        senderId: conversation.userId,
        receiverId: 'clinic',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        seen: false,
        delivered: true
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, response],
            lastMessage: response.content,
            lastMessageTime: new Date(),
            unreadCount: conv.unreadCount + 1
          };
        }
        return conv;
      }));
    }, 3000);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, seen: true }))
        };
      }
      return conv;
    }));
  };

  // Modal'ı kapat
  const closeModal = () => {
    setSelectedConversation(null);
  };

  // Modal dışına tıklayınca kapat
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200 flex">
      {/* Conversations List */}
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
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>{t('clinic.noConversations')}</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    markAsRead(conversation.id);
                  }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {conversation.userId.slice(-4)}
                        </span>
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.userId}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessageTime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {conversation.procedure} • {conversation.language}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area - Only show when conversation is selected */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {selectedConv.userId.slice(-4)}
                    </span>
                  </div>
                  {selectedConv.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConv.userId}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConv.procedure} • {selectedConv.language}
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
                <button 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`p-2 rounded-lg transition-colors ${
                    showTranslation ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Translate className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConv.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'clinic' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === 'clinic'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {showTranslation && message.translatedContent && message.senderId !== 'clinic' && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-600 italic">{message.translatedContent}</p>
                      </div>
                    )}
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      message.senderId === 'clinic' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.senderId === 'clinic' && (
                        <div className="flex items-center">
                          {message.delivered ? (
                            message.seen ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          ) : (
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
              {showTranslation && (
                <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <Translate className="w-3 h-3" />
                  <span>{t('clinic.translationEnabled')}</span>
                </div>
              )}
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

      {/* Chat Modal */}
      {selectedConversation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] max-h-[700px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Modal içeriğine tıklayınca kapanmasın
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Mesaj</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              {selectedConv ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {selectedConv.userId.slice(-4)}
                          </span>
                        </div>
                        {selectedConv.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConv.userId}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConv.procedure} • {selectedConv.language}
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
                      <button 
                        onClick={() => setShowTranslation(!showTranslation)}
                        className={`p-2 rounded-lg transition-colors ${
                          showTranslation ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Translate className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'clinic' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.senderId === 'clinic'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {showTranslation && message.translatedContent && message.senderId !== 'clinic' && (
                            <div className="mt-2 pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600 italic">{message.translatedContent}</p>
                            </div>
                          )}
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            message.senderId === 'clinic' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {message.timestamp.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {message.senderId === 'clinic' && (
                              <div className="flex items-center">
                                {message.delivered ? (
                                  message.seen ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )
                                ) : (
                                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
                    {showTranslation && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                        <Translate className="w-3 h-3" />
                        <span>{t('clinic.translationEnabled')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicMessages;