import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MessageList from '../components/Messages/MessageList';
import ChatWindow from '../components/Messages/ChatWindow';

const Messages: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.conversationId) {
      setSelectedConversation(location.state.conversationId);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('messages.loginRequired')}</h2>
          <p className="text-gray-600">{t('messages.loginToView')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="lg:hidden">
          {selectedConversation ? (
            <div className="h-[calc(100vh-4rem)]">
              <ChatWindow
                conversationId={selectedConversation}
                onBack={() => setSelectedConversation(null)}
              />
            </div>
          ) : (
            <MessageList
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
            />
          )}
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-4 lg:gap-6">
            <div className="col-span-1">
              <MessageList
                onSelectConversation={setSelectedConversation}
                selectedConversation={selectedConversation}
              />
            </div>
            <div className="col-span-2">
              {selectedConversation ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[600px]">
                  <ChatWindow
                    conversationId={selectedConversation}
                    onBack={() => setSelectedConversation(null)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[600px] flex items-center justify-center">
                  <div className="text-center text-gray-500 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{t('messages.selectMessage')}</h3>
                    <p className="text-sm">{t('messages.selectToChat')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages; 
