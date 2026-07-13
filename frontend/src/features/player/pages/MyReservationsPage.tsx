// src/features/player/pages/MyReservationsPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function MyReservationsPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('reservations.title')} />;
}