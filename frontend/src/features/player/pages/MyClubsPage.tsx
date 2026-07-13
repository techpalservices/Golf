// src/features/player/pages/MyClubsPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function MyClubsPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('clubs.myClubs')} />;
}