import React from 'react';
import LegalPageLayout from '../../components/Legal/LegalPageLayout';

const MedicalDisclaimer: React.FC = () => (
  <LegalPageLayout
    titleKey="legal.pages.medicalDisclaimer"
    introKey="legal.medicalDisclaimerIntro"
  />
);

export default MedicalDisclaimer;
