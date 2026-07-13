import { useTranslation } from 'react-i18next';
import { Users, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/card';

export default function ManagerDashboard() {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('dashboard.kpis.revenue')} value="45 200 MAD" icon={DollarSign} trend="+12%" />
        <KpiCard label={t('dashboard.kpis.members')} value={128} icon={Users} />
        <KpiCard label={t('dashboard.kpis.occupancy')} value="78%" icon={TrendingUp} />
        <KpiCard label={t('dashboard.kpis.pendingRequests')} value={5} icon={AlertCircle} />
      </div>

      {/* Charts + pending actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 text-xs font-medium tracking-widest text-primary">
            {t('dashboard.manager.charts')}
          </h3>
          <div className="flex h-48 items-end justify-around gap-2">
            {[40, 65, 50, 80, 70, 90, 60].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-primary" style={{ height: `${h}%` }} />
                <span className="text-xs text-muted-foreground">{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-medium tracking-widest text-primary">
            <AlertCircle size={14} /> {t('dashboard.manager.pendingActions')}
          </h3>
          <div className="flex flex-col gap-3">
            {['3 demandes de réservation', '2 inscriptions en attente'].map((action, i) => (
              <div key={i} className="rounded-md border border-border p-2 text-sm text-muted-foreground">
                {action}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tee sheet + activity feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-medium tracking-widest text-primary">
            <Clock size={14} /> {t('dashboard.manager.teeSheet')}
          </h3>
          <div className="flex flex-col gap-2">
            {['07:00 — Occupé', '08:00 — Disponible', '09:00 — Occupé', '10:00 — Disponible'].map((slot, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{slot.split(' — ')[0]}</span>
                <span className={slot.includes('Disponible') ? 'text-primary' : 'text-muted-foreground'}>
                  {slot.split(' — ')[1]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-xs font-medium tracking-widest text-primary">
            {t('dashboard.manager.activityFeed')}
          </h3>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>• Nouvelle réservation — J. Dupont</p>
            <p>• Nouveau membre — M. Martin</p>
            <p>• Tournoi créé — Open d'été</p>
          </div>
        </Card>
      </div>
    </div>
  );
}