// src/features/admin/pages/ClubsManagementPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function ClubsManagementPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('clubsManagement.title')} />;
}