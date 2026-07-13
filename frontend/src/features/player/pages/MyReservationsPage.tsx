import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Calendar, Clock, Users, MapPin, Download, XCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { toast } from 'sonner';

interface Reservation {
  id: string;
  clubName: string;
  clubLogo: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
  price: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  description: string;
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    clubName: 'Royal Golf de Marrakech',
    clubLogo: '/teetime-logo.png',
    courseName: 'Parcours Massy',
    date: '15/07/2026',
    time: '08:00',
    players: 3,
    price: 1500,
    status: 'CONFIRMED',
    description: 'Réservation confirmée pour 3 joueurs sur le parcours Massy.',
  },
  {
    id: '2',
    clubName: "Golf d'Anfa",
    clubLogo: '/teetime-logo.png',
    courseName: 'Parcours Atlantique',
    date: '20/07/2026',
    time: '14:00',
    players: 2,
    price: 600,
    status: 'PENDING',
    description: 'En attente de confirmation par le club.',
  },
  {
    id: '3',
    clubName: 'Golf du Palais Royal',
    clubLogo: '/teetime-logo.png',
    courseName: 'Parcours Royal',
    date: '01/07/2026',
    time: '07:00',
    players: 4,
    price: 1800,
    status: 'COMPLETED',
    description: 'Partie terminée.',
  },
  {
    id: '4',
    clubName: 'Royal Golf de Marrakech',
    clubLogo: '/teetime-logo.png',
    courseName: 'Parcours Palmeraie',
    date: '05/07/2026',
    time: '10:00',
    players: 1,
    price: 300,
    status: 'CANCELLED',
    description: 'Réservation annulée.',
  },
];

const statusColors: Record<Reservation['status'], string> = {
  CONFIRMED: 'border-primary bg-primary/15 text-primary',
  PENDING: 'border-secondary bg-secondary/15 text-secondary',
  COMPLETED: 'border-secondary bg-secondary/15 text-secondary',
  CANCELLED: 'border-border bg-muted text-muted-foreground',
};

export default function MyReservationsPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReservationClick = (r: Reservation) => {
    setSelectedReservation(r);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    toast.success('Réservation annulée');
    setDialogOpen(false);
  };

  const reservationItem = (r: Reservation) => (
    <div
      key={r.id}
      onClick={() => handleReservationClick(r)}
      className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md"
    >
      <img src={r.clubLogo} alt={r.clubName} className="h-12 w-12 shrink-0 rounded-full border-2 border-primary object-cover" />
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-serif text-sm font-bold text-secondary">{r.clubName}</span>
        <span className="text-xs text-muted-foreground">{r.courseName}</span>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" />{r.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-primary" />{r.time}</span>
          <span className="flex items-center gap-1"><Users size={12} className="text-primary" />{r.players}</span>
        </div>
      </div>
      <Badge className={`hidden shrink-0 border text-xs sm:inline-flex ${statusColors[r.status]}`}>
        {t(`reservations.tabs.${r.status.toLowerCase() === 'confirmed' ? 'upcoming' : r.status.toLowerCase() === 'pending' ? 'upcoming' : r.status.toLowerCase() === 'cancelled' ? 'cancelled' : 'past'}`)}
      </Badge>
    </div>
  );

  const dialogContent = selectedReservation && (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <img src={selectedReservation.clubLogo} alt={selectedReservation.clubName} className="h-16 w-16 rounded-full border-2 border-primary object-cover" />
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-bold text-secondary">{selectedReservation.clubName}</h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span>{selectedReservation.courseName}</span>
          </div>
        </div>
      </div>

      <Badge className={`w-fit border ${statusColors[selectedReservation.status]}`}>
        {selectedReservation.status}
      </Badge>

      <p className="text-sm text-muted-foreground">{selectedReservation.description}</p>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Calendar size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('reservations.dialog.date')}</span>
          <span className="text-sm font-semibold">{selectedReservation.date}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Clock size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('reservations.dialog.time')}</span>
          <span className="text-sm font-semibold">{selectedReservation.time}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Users size={16} className="text-primary" />
          <span className="/text-xs text-muted-foreground">{t('reservations.dialog.players')}</span>
          <span className="text-sm font-semibold">{selectedReservation.players}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('reservations.dialog.price')}</span>
          <span className="text-sm font-semibold text-primary">{selectedReservation.price} MAD</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full gap-2 border-primary text-secondary" onClick={() => toast.success('Reçu téléchargé')}>
          <Download size={16} />
          {t('reservations.dialog.download')}
        </Button>
        {(selectedReservation.status === 'CONFIRMED' || selectedReservation.status === 'PENDING') && (
          <Button variant="destructive" className="w-full gap-2" onClick={handleCancel}>
            <XCircle size={16} />
            {t('reservations.dialog.cancel')}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('reservations.title')}</h1>

      {/* Search bar */}
      <div className="flex flex-row justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('reservations.clubNamePlaceholder')}
            className="pl-10 border-primary placeholder:text-secondary"
          />
        </div>
        <Button variant="outline" size="lg" className="ml-2 gap-2 border-primary text-secondary" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal size={18} />
          <span className="hidden md:inline">{t('reservations.filter')}</span>
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {mockReservations.map(reservationItem)}
      </div>

      {/* Details dialog */}
      {isDesktop ? (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-surface">
            {dialogContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={dialogOpen} onOpenChange={setDialogOpen}>
          <DrawerContent className="max-h-[85vh] bg-surface">
            <div className="overflow-y-auto p-5">
              {dialogContent}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}