// src/features/manager/pages/PlanningPage.tsx
import { useTranslation } from 'react-i18next';
import PagePlaceholder from '@/components/shared/PagePlaceholder';

export default function PlanningPage() {
  const { t } = useTranslation('app');
  return <PagePlaceholder title={t('planning.title')} />;
}