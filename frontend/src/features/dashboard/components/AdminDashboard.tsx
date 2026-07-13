import { useTranslation } from 'react-i18next';
import { Users, Building, CalendarCheck, AlertCircle, Trophy, Banknote } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import AdminCharts from './AdminCharts';
import AdminPendingActions from './AdminPendingActions';
import AdminActivityLog from './AdminActivityLog';
import ClubPerformanceTable from './ClubPerformanceTable';

export default function AdminDashboard() {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-6">
      {/* 6 KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label={t('dashboard.admin.kpis.totalUsers')} value={1240} icon={Users} trend="+5%" />
        <KpiCard label={t('dashboard.admin.kpis.totalClubs')} value={18} icon={Building} trend="+2" />
        <KpiCard label={t('dashboard.admin.kpis.totalReservations')} value={3420} icon={CalendarCheck} trend="+12%" />
        <KpiCard label={t('dashboard.admin.kpis.pendingApprovals')} value={12} icon={AlertCircle} />
        <KpiCard label={t('dashboard.admin.kpis.activeTournaments')} value={4} icon={Trophy} />
        <KpiCard label={t('dashboard.admin.kpis.revenue')} value="320 000 MAD" icon={Banknote} trend="+8%" />
      </div>

      {/* Charts */}
      <AdminCharts />

      {/* Pending Actions + Activity Log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminPendingActions />
        <AdminActivityLog />
      </div>

      {/* Club Performance Table */}
      <ClubPerformanceTable />
    </div>
  );
}