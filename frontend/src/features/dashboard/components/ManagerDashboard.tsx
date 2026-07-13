import { useTranslation } from 'react-i18next';
import { CalendarCheck, AlertCircle, Users, Banknote } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import ManagerCharts from './ManagerCharts';
import PendingActionsQueue from './PendingActionsQueue';
import TeeSheetMini from './TeeSheetMini';
import ActivityFeed from './ActivityFeed';

export default function ManagerDashboard() {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('dashboard.manager.kpis.todayReservations')} value={24} icon={CalendarCheck} trend="+8%" />
        <KpiCard label={t('dashboard.manager.kpis.pendingRequests')} value={5} icon={AlertCircle} />
        <KpiCard label={t('dashboard.manager.kpis.members')} value={128} icon={Users} trend="+3%" />
        <KpiCard label={t('dashboard.manager.kpis.todayRevenue')} value="12 400 MAD" icon={Banknote} trend="+15%" />
      </div>

      {/* Charts + Pending Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ManagerCharts />
        </div>
        <PendingActionsQueue />
      </div>

      {/* Tee Sheet + Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TeeSheetMini />
        <ActivityFeed />
      </div>
    </div>
  );
}