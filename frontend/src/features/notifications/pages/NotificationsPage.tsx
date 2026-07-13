// src/features/notifications/pages/NotificationsPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function NotificationsPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('notifications.title')} />;
}