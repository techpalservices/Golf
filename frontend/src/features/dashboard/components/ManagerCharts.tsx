import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { Card } from '@/components/ui/card';

const GOLD = '#C9A84C';
const GREEN = '#2D6A4F';
const SAGE = '#6B8E7F';

// deterministic mock data
const utilizationData = Array.from({ length: 30 }, (_, i) => ({
  date: `${String(i + 1).padStart(2, '0')}/07`,
  rate: 40 + ((i * 13) % 50),
}));

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `${String(i + 1).padStart(2, '0')}/07`,
  revenue: 2000 + ((i * 173) % 4000),
}));

const typeData = [
  { name: 'individual', value: 45, color: GOLD },
  { name: 'social', value: 30, color: GREEN },
  { name: 'squadParty', value: 25, color: SAGE },
];

// heatmap: 18 weeks × 7 days
const heatmapWeeks = Array.from({ length: 18 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => ({
    value: ((w * 7 + d) * 37) % 100,
  }))
);

function heatColor(v: number) {
  if (v === 0) return 'bg-muted';
  if (v < 25) return 'bg-primary/20';
  if (v < 50) return 'bg-primary/40';
  if (v < 75) return 'bg-primary/70';
  return 'bg-primary';
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-xs font-medium tracking-widest text-primary">{title}</h3>
      {children}
    </Card>
  );
}

export default function ManagerCharts() {
  const { t } = useTranslation('app');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Line: Utilization */}
      <ChartCard title={t('dashboard.manager.charts.utilization')}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={utilizationData} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E5E0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} stroke="#6C757D" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#6C757D" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5E0', fontSize: 12 }} />
            <Line type="monotone" dataKey="rate" stroke={GOLD} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Donut: By Type */}
      <ChartCard title={t('dashboard.manager.charts.byType')}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
              {typeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5E0', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-center gap-4">
          {typeData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-xs text-muted-foreground">{t(`dashboard.manager.charts.${d.name}`)}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Area: Revenue */}
      <ChartCard title={t('dashboard.manager.charts.revenue')}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GREEN} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E5E0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} stroke="#6C757D" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6C757D" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E5E0', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke={GREEN} strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Heatmap: Frequency */}
      <ChartCard title={t('dashboard.manager.charts.frequency')}>
        <div className="flex gap-1 overflow-x-auto">
          {heatmapWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`size-3 rounded-sm ${heatColor(cell.value)}`}
                  title={`${cell.value} joueurs`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <span>−</span>
          <span className="size-2.5 rounded-sm bg-muted" />
          <span className="size-2.5 rounded-sm bg-primary/20" />
          <span className="size-2.5 rounded-sm bg-primary/40" />
          <span className="size-2.5 rounded-sm bg-primary/70" />
          <span className="size-2.5 rounded-sm bg-primary" />
          <span>+</span>
        </div>
      </ChartCard>
    </div>
  );
}