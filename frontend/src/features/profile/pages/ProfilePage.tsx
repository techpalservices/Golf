// src/features/profile/pages/ProfilePage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function ProfilePage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('profile.title')} />;
}