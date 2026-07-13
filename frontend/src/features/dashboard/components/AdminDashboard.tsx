import { useTranslation } from 'react-i18next';
import { Users, Building, DollarSign, AlertCircle } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/card';

export default function AdminDashboard() {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label={t('dashboard.kpis.totalUsers')} value={1240} icon={Users} />
        <KpiCard label={t('dashboard.kpis.totalClubs')} value={18} icon={Building} />
        <KpiCard label={t('dashboard.kpis.monthlyRevenue')} value="320 000 MAD" icon={DollarSign} trend="+8%" />
        <KpiCard label={t('dashboard.kpis.pendingRequests')} value={12} icon={AlertCircle} />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-xs font-medium tracking-widest text-primary">
          {t('dashboard.admin.activityLog')}
        </h3>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {['Nouveau club — Golf de Tanger', 'Gestionnaire assigné — R. Alami', 'Utilisateur suspendu'].map((log, i) => (
            <div key={i} className="border-b border-border pb-2">{log}</div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 text-xs font-medium tracking-widest text-primary">
          {t('dashboard.admin.clubPerformance')}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2">Club</th>
              <th className="pb-2">Membres</th>
              <th className="pb-2">Revenus</th>
              <th className="pb-2">Occupation</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Royal Golf Marrakech', members: 320, revenue: '85 000 MAD', occupancy: '82%' },
              { name: "Golf d'Anfa", members: 180, revenue: '52 000 MAD', occupancy: '74%' },
              { name: 'Golf du Palais Royal', members: 240, revenue: '68 000 MAD', occupancy: '79%' },
            ].map((row) => (
              <tr key={row.name} className="border-b border-border">
                <td className="py-2 font-medium text-secondary">{row.name}</td>
                <td className="py-2 text-muted-foreground">{row.members}</td>
                <td className="py-2 text-muted-foreground">{row.revenue}</td>
                <td className="py-2 text-primary">{row.occupancy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}