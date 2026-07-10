import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Tournament, TournamentStatus } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
}

const statusColors: Record<TournamentStatus, string> = {
  UPCOMING: 'bg-primary text-secondary border-primary',
  ONGOING: 'bg-secondary text-primary border-secondary',
  COMPLETED: 'bg-muted text-white border-border',
};

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  const { t } = useTranslation('tournaments');

  return (
    <Card
      className="overflow-hidden p-0 rounded-sm cursor-pointer transition-shadow hover:shadow-md md:h-full"
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative w-full">
          <img
            src={tournament.image}
            alt={tournament.name}
            className="h-56 w-full object-cover md:h-64"
          />
          {/* Status badge — top right of image */}
          <Badge
            className={`absolute top-3 right-3 border ${statusColors[tournament.status]}`}
          >
            {t(`status.${tournament.status.toLowerCase()}`)}
          </Badge>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <h3 className="font-serif text-xl font-bold text-secondary md:text-2xl">
            {tournament.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{tournament.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>{tournament.date}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy size={12} className="text-primary" />
            <span>{tournament.clubName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={12} className="text-primary" />
            <span>{tournament.currentParticipants}/{tournament.maxParticipants} {t('card.participants')}</span>
          </div>

          <p className="mt-auto font-serif text-2xl font-bold text-primary">
            {tournament.entryFee} MAD
            <span className="text-sm font-normal text-muted-foreground"> {t('card.entryFee')}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}