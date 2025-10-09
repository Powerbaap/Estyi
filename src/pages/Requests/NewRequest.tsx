import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PriceRequestModal from '../../components/Dashboard/PriceRequestModal';
import { useNavigate } from 'react-router-dom';

const NewRequest: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSubmitted = (newRequest: any) => {
    navigate('/dashboard', { state: { newRequest } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">{t('priceRequest.title')}</h1>
        <p className="text-gray-600 mb-6">{t('userDashboard.subtitle')}</p>
        <PriceRequestModal isOpen={isOpen} onClose={handleClose} onRequestSubmitted={handleSubmitted} />
      </div>
    </div>
  );
};

export default NewRequest;