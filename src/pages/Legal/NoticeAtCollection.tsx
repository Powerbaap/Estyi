import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalPageLayout from '../../components/Legal/LegalPageLayout';

const NoticeAtCollection: React.FC = () => (
  <LegalPageLayout
    titleKey="legal.pages.noticeAtCollection"
    introKey="legal.noticeAtCollectionIntro"
  />
);

export default NoticeAtCollection;
