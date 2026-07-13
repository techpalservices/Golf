import { useTranslation } from 'react-i18next';
import { Calendar, Building2, Trophy, Mail } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/features/auth/store';

export default function PlayerDashboard() {
  const { t } = useTranslation('app');
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-2xl font-bold text-secondary">
        {t('dashboard.welcome', { name: user?.firstName })}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('dashboard.kpis.nextTeeTime')} value="08:00" icon={Calendar} />
        <KpiCard label={t('dashboard.kpis.reservations')} value={12} icon={Calendar} />
        <KpiCard label={t('dashboard.kpis.clubs')} value={3} icon={Building2} />
        <KpiCard label={t('dashboard.kpis.reservations')} value="5" icon={Trophy} trend="+2 ce mois" />
      </div>

      {/* Recent reservations + invitations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-xs font-medium tracking-widest text-primary">
            {t('dashboard.player.recentReservations')}
          </h3>
          <div className="flex flex-col gap-3">
            {['Royal Golf — 15/07', 'Golf d\'Anfa — 20/07', 'Palais Royal — 25/07'].map((r, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">{r}</span>
                <span className="font-medium text-primary">Confirmée</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-medium tracking-widest text-primary">
            <Mail size={14} /> {t('dashboard.player.invitations')}
          </h3>
          <p className="text-sm text-muted-foreground">Aucune invitation en attente</p>
        </Card>
      </div>
    </div>
  );
}