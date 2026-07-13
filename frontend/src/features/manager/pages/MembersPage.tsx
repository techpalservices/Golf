// src/features/manager/pages/MembersPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function MembersPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('members.title')} />;
}