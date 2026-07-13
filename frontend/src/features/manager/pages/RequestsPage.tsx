// src/features/manager/pages/RequestsPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function RequestsPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('requests.title')} />;
}