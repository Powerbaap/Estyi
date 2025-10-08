import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MessageList from '../components/Messages/MessageList';
import ChatWindow from '../components/Messages/ChatWindow';
import { X } from 'lucide-react';

const Messages: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Klinik ile iletişim için gelen state'i handle et
  useEffect(() => {
    if (location.state?.messageType === 'clinic_contact' && location.state?.selectedClinic) {
      // Klinik ile yeni konuşma başlat
      // Burada klinik ile yeni konuşma oluşturulabilir
    }
  }, [location.state]);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Message List - Full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <MessageList
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
            />
          </div>

          {/* Desktop placeholder - Only show when no conversation selected */}
          <div className="hidden lg:block lg:col-span-2">
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
          </div>
        </div>
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
              <h2 className="text-lg font-semibold text-gray-900">{t('messages.title')}</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                conversationId={selectedConversation}
                onBack={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 