import { useTranslation } from 'react-i18next';
import { Users, Building, CalendarCheck, AlertCircle, Trophy, Banknote } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import AdminCharts from './AdminCharts';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-MA').format(Math.round(value));
}

function trendLabel(pct: number) {
  if (pct > 0) return `+${pct}%`;
  if (pct < 0) return `${pct}%`;
  return undefined;
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[92px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-[232px] animate-pulse rounded-xl bg-muted" />
      <div className="h-[232px] animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation('app');
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {t('dashboard.admin.error')}
      </div>
    );
  }

  const k = data.kpis;
  const pendingApprovals = k.pendingReservations + k.pendingMembershipRequests;

  return (
    <div className="flex flex-col gap-6">
      {/* 6 KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard label={t('dashboard.admin.kpis.totalUsers')} value={formatNumber(k.totalUsers)} icon={Users} />
        <KpiCard label={t('dashboard.admin.kpis.totalClubs')} value={formatNumber(k.totalClubs)} icon={Building} />
        <KpiCard label={t('dashboard.admin.kpis.totalReservations')} value={formatNumber(k.reservationsLast30Days)} icon={CalendarCheck} trend={trendLabel(k.reservationsTrendPct)} />
        <KpiCard label={t('dashboard.admin.kpis.pendingApprovals')} value={formatNumber(pendingApprovals)} icon={AlertCircle} />
        <KpiCard label={t('dashboard.admin.kpis.activeTournaments')} value={formatNumber(k.activeTournaments)} icon={Trophy} />
        {/*<KpiCard label={t('dashboard.admin.kpis.revenue')} value={`${formatNumber(k.revenueLast30Days)} MAD`} icon={Banknote} trend={trendLabel(k.revenueTrendPct)} />*/}
      </div>

      <AdminCharts data={data} />
    </div>
  );
}