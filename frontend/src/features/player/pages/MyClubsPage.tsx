import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Flag, Building2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ClubMembership {
  id: string;
  name: string;
  logo: string;
  location: string;
  membership: 'MONTHLY' | 'YEARLY' | 'VIP';
  description: string;
  startDate: string;
  endDate: string;
  coursesCount: number;
}

const mockClubs: ClubMembership[] = [
  {
    id: '1',
    name: 'Royal Golf de Marrakech',
    logo: '/teetime-logo.png',
    location: 'Marrakech',
    membership: 'YEARLY',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
    startDate: '01/01/2026',
    endDate: '31/12/2026',
    coursesCount: 2,
  },
  {
    id: '2',
    name: "Golf d'Anfa",
    logo: '/teetime-logo.png',
    location: 'Casablanca',
    membership: 'MONTHLY',
    description: "Un club urbain avec une vue imprenable sur l'océan.",
    startDate: '01/07/2026',
    endDate: '31/07/2026',
    coursesCount: 1,
  },
  {
    id: '3',
    name: 'Golf du Palais Royal',
    logo: '/teetime-logo.png',
    location: 'Agadir',
    membership: 'VIP',
    description: 'Un club de championnat offrant un défi technique.',
    startDate: '01/06/2026',
    endDate: '31/05/2027',
    coursesCount: 2,
  },
];

const membershipColors: Record<ClubMembership['membership'], string> = {
  MONTHLY: 'border-primary bg-primary/15 text-primary',
  YEARLY: 'border-secondary bg-secondary/15 text-secondary',
  VIP: 'border-primary bg-primary text-primary-foreground',
};

export default function MyClubsPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ClubMembership | null>(null);
  const [open, setOpen] = useState(false);

  const handleClick = (club: ClubMembership) => {
    setSelected(club);
    setOpen(true);
  };

  const dialogContent = selected && (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <img src={selected.logo} alt={selected.name} className="h-16 w-16 rounded-full border-2 border-primary object-cover" />
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-bold text-secondary">{selected.name}</h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            <span>{selected.location}</span>
          </div>
        </div>
      </div>

      <Badge className={`w-fit border ${membershipColors[selected.membership]}`}>
        {t(`type.${selected.membership}`) || selected.membership}
      </Badge>

      <p className="text-sm text-muted-foreground">{selected.description}</p>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Calendar size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('clubs.dialog.startDate')}</span>
          <span className="text-sm font-semibold">{selected.startDate}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Calendar size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('clubs.dialog.endDate')}</span>
          <span className="text-sm font-semibold">{selected.endDate}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Flag size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('clubs.dialog.courses')}</span>
          <span className="text-sm font-semibold">{selected.coursesCount}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <Building2 size={16} className="text-primary" />
          <span className="text-xs text-muted-foreground">{t('clubs.dialog.membership')}</span>
          <span className="text-sm font-semibold">{selected.membership}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full border-primary text-secondary" onClick={() => navigate(`/reservations/${selected.id}`)}>
        {t('clubs.dialog.visit')}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('clubs.myClubs')}</h1>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('clubs.searchPlaceholder')}
          className="pl-10 border-primary placeholder:text-secondary"
        />
      </div>

      <div className="flex flex-col gap-3">
        {mockClubs.map((club) => (
          <div
            key={club.id}
            onClick={() => handleClick(club)}
            className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md"
          >
            <img src={club.logo} alt={club.name} className="h-12 w-12 shrink-0 rounded-full border-2 border-primary object-cover" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="font-serif text-sm font-bold text-secondary">{club.name}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} className="text-primary" />
                <span>{club.location}</span>
              </div>
            </div>
            <Badge className={`shrink-0 border text-xs ${membershipColors[club.membership]}`}>
              {club.membership}
            </Badge>
          </div>
        ))}
      </div>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-surface">{dialogContent}</DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[85vh] bg-surface">
            <div className="overflow-y-auto p-5">{dialogContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}