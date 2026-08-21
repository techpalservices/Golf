
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Plus, Calendar, MapPin, Users, Pencil, Trash2, Play, CheckCircle, XCircle, Unlock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TournamentFormDialog from '../components/TournamentFormDialog';

type TournamentStatus = 'planned' | 'open' | 'ongoing' | 'completed' | 'cancelled';

interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  clubName: string;
  status: TournamentStatus;
  image: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
}

const statusColors: Record<TournamentStatus, string> = {
  planned: 'border-primary bg-primary/15 text-primary',
  open: 'border-secondary bg-secondary/15 text-secondary',
  ongoing: 'border-secondary bg-secondary/15 text-secondary',
  completed: 'border-blue-500 bg-blue-500/15 text-blue-600',
  cancelled: 'border-border bg-muted text-muted-foreground',
};

const mockTournaments: Tournament[] = [
  { id: '1', name: 'Summer Open 2026', description: 'Tournoi annuel ouvert à tous les membres. Format stroke play sur 18 trous.', date: '15/08/2026', location: 'Marrakech', clubName: 'Royal Golf de Marrakech', status: 'planned', image: '/section1.png', entryFee: 800, maxParticipants: 60, currentParticipants: 0 },
  { id: '2', name: 'Winter Cup', description: 'Compétition hivernale par équipes de 2. Best ball sur 18 trous.', date: '20/12/2026', location: 'Ifrane', clubName: 'Michlifen Golf', status: 'open', image: '/section2.png', entryFee: 600, maxParticipants: 40, currentParticipants: 18 },
  { id: '3', name: 'Spring Championship', description: 'Championnat de printemps réservé aux membres Premium.', date: '10/04/2026', location: 'Casablanca', clubName: 'Golf du Palais', status: 'ongoing', image: '/section3.png', entryFee: 1000, maxParticipants: 50, currentParticipants: 45 },
  { id: '4', name: 'Autumn Classic', description: 'Tournoi classique d\'automne. Format stableford.', date: '05/11/2025', location: 'Rabat', clubName: 'Royal Golf', status: 'completed', image: '/section1.png', entryFee: 700, maxParticipants: 48, currentParticipants: 48 },
  { id: '5', name: 'Junior Open', description: 'Tournoi pour les jeunes golfeurs de moins de 18 ans.', date: '22/09/2026', location: 'Agadir', clubName: 'Ocean Golf', status: 'cancelled', image: '/section2.png', entryFee: 300, maxParticipants: 30, currentParticipants: 12 },
];

export default function ManageTournamentsPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [tournaments, setTournaments] = useState(mockTournaments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);

  const locations = useMemo(() => ['all', ...Array.from(new Set(mockTournaments.map((t) => t.location)))], []);

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.location.toLowerCase().includes(q) && !t.clubName.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (locationFilter !== 'all' && t.location !== locationFilter) return false;
      return true;
    });
  }, [tournaments, search, statusFilter, locationFilter]);

  const handleClick = (tournament: Tournament) => {
    setSelected(tournament);
    setOpen(true);
  };

  const handleStatusChange = (id: string, status: TournamentStatus) => {
    setTournaments((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setSelected((prev) => (prev ? { ...prev, status } : null));
    const msgKey = status === 'open' ? 'opened' : status === 'ongoing' ? 'started' : status === 'completed' ? 'completed' : status === 'cancelled' ? 'cancelled' : 'updated';
    toast.success(t(`manageTournaments.details.${msgKey}`));
    if (status === 'cancelled') setTimeout(() => setOpen(false), 800);
  };

  const handleDelete = (id: string) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setOpen(false);
    toast.success(t('manageTournaments.details.deleted'));
  };

  const handleCreate = (data: Omit<Tournament, 'id' | 'status' | 'currentParticipants'>) => {
    const newTournament: Tournament = { ...data, id: `t-${Date.now()}`, status: 'planned', currentParticipants: 0 };
    setTournaments((prev) => [...prev, newTournament]);
    setFormOpen(false);
    toast.success(t('manageTournaments.details.created'));
  };

  const handleUpdate = (data: Omit<Tournament, 'id' | 'status' | 'currentParticipants'>) => {
    if (!editing) return;
    setTournaments((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
    setSelected((prev) => (prev && prev.id === editing.id ? { ...prev, ...data } : prev));
    setFormOpen(false);
    setEditing(null);
    toast.success(t('manageTournaments.details.updated'));
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <img src={selected.image} alt={selected.name} className="h-40 w-full rounded-lg object-cover" />
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-secondary">{selected.name}</h2>
        <Badge className={`border ${statusColors[selected.status]}`}>
          {t(`manageTournaments.status.${selected.status}`)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{selected.description}</p>
      <Separator />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('manageTournaments.details.date')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.date}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('manageTournaments.details.location')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.location}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('manageTournaments.details.club')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.clubName}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('manageTournaments.details.entryFee')}</span>
          <span className="text-sm font-semibold text-primary">{selected.entryFee} MAD</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('manageTournaments.details.participants')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.currentParticipants}/{selected.maxParticipants}</span>
        </div>
      </div>
    </div>
  );

  const detailsFooter = selected && (
    <div className="flex flex-wrap gap-2">
      {/* Edit — always available */}
      <Button
        variant="outline"
        className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10"
        onClick={() => { setEditing(selected); setOpen(false); setFormOpen(true); }}
      >
        <Pencil size={16} /> {t('manageTournaments.details.edit')}
      </Button>

      {/* Status transitions */}
      {selected.status === 'planned' && (
        <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleStatusChange(selected.id, 'open')}>
          <Unlock size={16} /> {t('manageTournaments.details.openRegistrations')}
        </Button>
      )}
      {selected.status === 'open' && (
        <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleStatusChange(selected.id, 'ongoing')}>
          <Play size={16} /> {t('manageTournaments.details.start')}
        </Button>
      )}
      {selected.status === 'ongoing' && (
        <Button className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-600/80" onClick={() => handleStatusChange(selected.id, 'completed')}>
          <CheckCircle size={16} /> {t('manageTournaments.details.complete')}
        </Button>
      )}

      {/* Cancel — available unless already cancelled/completed */}
      {selected.status !== 'cancelled' && selected.status !== 'completed' && (
        <Button variant="outline" className="flex-1 gap-2 border-red-500 text-red-600 hover:bg-red-500/10" onClick={() => handleStatusChange(selected.id, 'cancelled')}>
          <XCircle size={16} /> {t('manageTournaments.details.cancel')}
        </Button>
      )}

      {/* Delete — always */}
      <Button variant="outline" className="flex-1 gap-2 border-border text-muted-foreground hover:bg-muted" onClick={() => handleDelete(selected.id)}>
        <Trash2 size={16} /> {t('manageTournaments.details.delete')}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('manageTournaments.title')}</h1>

      {/* Filter bar + Add button */}
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('manageTournaments.searchPlaceholder')} className="pl-10 border-primary placeholder:text-secondary" />
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus size={16} />
              <span className="hidden sm:inline">{t('manageTournaments.add')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('manageTournaments.filterStatus')}</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('manageTournaments.all')}</SelectItem>
                  <SelectItem value="planned">{t('manageTournaments.status.planned')}</SelectItem>
                  <SelectItem value="open">{t('manageTournaments.status.open')}</SelectItem>
                  <SelectItem value="ongoing">{t('manageTournaments.status.ongoing')}</SelectItem>
                  <SelectItem value="completed">{t('manageTournaments.status.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('manageTournaments.status.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('manageTournaments.filterLocation')}</Label>
              <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>{l === 'all' ? t('manageTournaments.allLocations') : l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tournament cards grid */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{t('manageTournaments.empty')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tournament) => (
            <Card
              key={tournament.id}
              onClick={() => handleClick(tournament)}
              className="flex cursor-pointer flex-col overflow-hidden p-0 transition-shadow hover:shadow-md"
            >
              <div className="relative w-full">
                <img src={tournament.image} alt={tournament.name} className="h-48 w-full object-cover" />
                <Badge className={`absolute right-3 top-3 border ${statusColors[tournament.status]}`}>
                  {t(`manageTournaments.status.${tournament.status}`)}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-serif text-lg font-bold text-secondary">{tournament.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} className="text-primary" /> {tournament.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} className="text-primary" /> {tournament.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={12} className="text-primary" /> {tournament.currentParticipants}/{tournament.maxParticipants}
                </div>
                <span className="mt-auto font-serif text-lg font-bold text-primary">
                  {tournament.entryFee} MAD
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details dialog/drawer */}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-surface max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {t('manageTournaments.details.title')}
              </DialogTitle>
            </DialogHeader>
            {detailsContent}
            <DialogFooter className="gap-2">{detailsFooter}</DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] bg-surface">
            <DrawerHeader>
              <DrawerTitle className="font-serif text-lg font-bold text-secondary">
                {t('manageTournaments.details.title')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4 max-h-[60vh]">{detailsContent}</div>
            <DrawerFooter className="px-4 pb-6">{detailsFooter}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Form dialog */}
      <TournamentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing ?? undefined}
      />
    </div>
  );
}