import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Building2, Trophy, Clock, Users, ChevronRight, MapPin } from 'lucide-react';
import KpiCard from '@/components/shared/KpiCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/features/auth/store';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"

// Mock data — replace with hooks later
const nextReservation = {
  clubName: 'Royal Golf de Marrakech',
  courseName: 'Parcours Massy',
  date: '15/07/2026',
  time: '08:00',
  players: 3,
  status: 'Confirmée',
  image: '/club 1.png',
};

const recentReservations = [
  { id: '1', clubName: 'Royal Golf de Marrakech', date: '10/07/2026', time: '09:00', status: 'Terminée' },
  { id: '2', clubName: "Golf d'Anfa", date: '05/07/2026', time: '14:00', status: 'Terminée' },
  { id: '3', clubName: 'Golf du Palais Royal', date: '01/07/2026', time: '07:00', status: 'Annulée' },
];

const myClubs = [
  { id: '1', name: 'Royal Golf de Marrakech', location: 'Marrakech', logo: '/teetime-logo.png', membership: 'Premium' },
  { id: '2', name: "Golf d'Anfa", location: 'Casablanca', logo: '/teetime-logo.png', membership: 'Mensuel' },
  { id: '3', name: 'Golf du Palais Royal', location: 'Agadir', logo: '/teetime-logo.png', membership: 'VIP' },
  { id: '4', name: 'Golf de Tanger', location: 'Tanger', logo: '/teetime-logo.png', membership: 'Annuel' },
];

export default function PlayerDashboard() {
  const { t } = useTranslation('app');
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <h2 className="font-serif text-2xl font-bold text-secondary">
        {t('dashboard.welcome', { name: user?.firstName })}
      </h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KpiCard label={t('dashboard.kpis.nextTeeTime')} value="08:00" icon={Clock} />
        <KpiCard label={t('dashboard.kpis.reservations')} value={12} icon={Calendar} />
        <KpiCard label={t('dashboard.kpis.clubs')} value={4} icon={Building2} />
        <KpiCard label={t('dashboard.kpis.reservations')} value="5" icon={Trophy} trend="+2" />
      </div>

      {/* Next reservation — big section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-widest text-primary">
            {t('dashboard.player.nextReservation')}
          </h3>
          <Link to="/my-reservations" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover">
            {t('dashboard.player.viewAll')}
            <ChevronRight size={14} />
          </Link>
        </div>

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="h-40 w-full md:h-auto md:w-2/5">
              <img src={nextReservation.image} alt= {nextReservation.clubName} className="h-full w-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-3 p-5">
              
              <div className="flex flex-row justify-between items-center gap-2">
                <h4 className="font-serif text-xl font-bold text-secondary md:text-4xl">
                    {nextReservation.clubName}
                </h4>

                <span className="flex items-center gap-1.5 text-xl font-serif font-bold text-primary md:text-3xl">
                    {nextReservation.time}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-base text-muted-foreground">
                    <MapPin size={14} className="text-primary" />
                    <span>{nextReservation.courseName + " (18 holes)"}</span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  {nextReservation.date}
                </span>
              </div>

              <AvatarGroup className="grayscale mt-25">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
                    <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarImage
                    alt="@evilrabbit"
                    />
                    <AvatarFallback>ER</AvatarFallback>
                </Avatar>
            </AvatarGroup>
            </div>
          </div>
        </Card>
      </section>

      {/* Recent reservations — list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-widest text-primary">
            {t('dashboard.player.recentReservations')}
          </h3>
          <Link to="/my-reservations" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover">
            {t('dashboard.player.viewAll')}
            <ChevronRight size={14} />
          </Link>
        </div>

        <Card className="p-5">
          <div className="flex flex-col gap-3">
            {recentReservations.map((r) => (
              <div key={r.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{r.clubName}</span>
                  <span className="text-xs text-muted-foreground">{r.date} · {r.time}</span>
                </div>
                <Badge
                  className={
                    r.status === 'Terminée'
                      ? 'border border-secondary bg-secondary/15 text-secondary'
                      : 'border border-border bg-muted text-muted-foreground'
                  }
                >
                  {r.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* My clubs — 4 cards grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-widest text-primary">
            {t('dashboard.player.myClubs')}
          </h3>
          <Link to="/my-clubs" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover">
            {t('dashboard.player.manage')}
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {myClubs.map((club) => (
            <Card key={club.id} className="flex flex-col items-center gap-2 p-4 text-center">
              <img src={club.logo} alt={club.name} className="h-12 w-12 rounded-full border-2 border-primary object-cover" />
              <h4 className="font-serif text-sm font-bold text-secondary">{club.name}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} className="text-primary" />
                <span>{club.location}</span>
              </div>
              <Badge className="border border-primary bg-primary/15 text-primary text-xs">
                {club.membership}
              </Badge>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}