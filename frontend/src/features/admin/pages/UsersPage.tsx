// src/features/admin/pages/UsersPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function UsersPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('users.title')} />;
}