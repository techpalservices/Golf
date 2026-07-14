import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Plus, MapPin, Building, Users, Flag, Phone, Mail, Calendar, Pencil, UserCog, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ClubFormDialog from '../components/ClubFormDialog';

type ClubStatus = 'published' | 'draft' | 'pending';

interface Club {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  status: ClubStatus;
  managerId: string | null;
  managerName: string | null;
  membersCount: number;
  coursesCount: number;
  createdAt: string;
}

interface ManagerOption {
  id: string;
  fullName: string;
  initials: string;
}

const statusColors: Record<ClubStatus, string> = {
  published: 'border-secondary bg-secondary/15 text-secondary',
  draft: 'border-border bg-muted text-muted-foreground',
  pending: 'border-primary bg-primary/15 text-primary',
};

const mockManagers: ManagerOption[] = [
  { id: 'u2', fullName: 'Sara Mansouri', initials: 'SM' },
  { id: 'u5', fullName: 'Karim El Idrissi', initials: 'KE' },
  { id: 'u9', fullName: 'Hassan Tazi', initials: 'HT' },
  { id: 'u10', fullName: 'Imane Rachidi', initials: 'IR' },
];

const mockClubs: Club[] = [
  { id: '1', name: 'Royal Golf de Marrakech', description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.', city: 'Marrakech', address: 'Route de l\'Ourika, Marrakech 40000', phone: '+212 5 24 32 50 50', email: 'contact@royalgolf.ma', logo: '/teetime-logo.png', coverImage: '/club 1.png', status: 'published', managerId: 'u2', managerName: 'Sara Mansouri', membersCount: 142, coursesCount: 2, createdAt: '15/03/2020' },
  { id: '2', name: 'Golf du Palais', description: 'Un club de championnat offrant un défi technique.', city: 'Casablanca', address: 'Boulevard de l\'Océan, Casablanca', phone: '+212 5 22 36 78 90', email: 'contact@golfdupalais.ma', logo: '/teetime-logo.png', coverImage: '/club2.png', status: 'published', managerId: 'u5', managerName: 'Karim El Idrissi', membersCount: 98, coursesCount: 1, createdAt: '22/06/2021' },
  { id: '3', name: 'Michlifen Golf', description: 'Un parcours de montagne à Ifrane.', city: 'Ifrane', address: 'Route d\'Ifrane, Ifrane 53000', phone: '+212 5 35 56 12 34', email: 'contact@michlifen.ma', logo: '/teetime-logo.png', coverImage: '/section3.png', status: 'draft', managerId: null, managerName: null, membersCount: 0, coursesCount: 0, createdAt: '10/01/2026' },
  { id: '4', name: "Golf d'Anfa", description: 'Un club urbain avec vue sur l\'océan.', city: 'Casablanca', address: 'Corniche d\'Anfa, Casablanca', phone: '+212 5 22 79 45 67', email: 'contact@golfanfa.ma', logo: '/teetime-logo.png', coverImage: '/section2.png', status: 'published', managerId: 'u9', managerName: 'Hassan Tazi', membersCount: 120, coursesCount: 1, createdAt: '05/09/2022' },
  { id: '5', name: 'Ocean Golf Agadir', description: 'Golf bordant l\'océan Atlantique.', city: 'Agadir', address: ' Boulevard du 20 Août, Agadir', phone: '+212 5 28 82 11 22', email: 'contact@oceangolf.ma', logo: '/teetime-logo.png', coverImage: '/section1.png', status: 'pending', managerId: null, managerName: null, membersCount: 0, coursesCount: 0, createdAt: '01/07/2026' },
];

export default function ClubsManagementPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [clubs, setClubs] = useState(mockClubs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selected, setSelected] = useState<Club | null>(null);
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignClubId, setAssignClubId] = useState<string | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string>('none');

  const cities = useMemo(() => ['all', ...Array.from(new Set(mockClubs.map((c) => c.city)))], []);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !(c.managerName?.toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      return true;
    });
  }, [clubs, search, statusFilter, cityFilter]);

  const handleClick = (club: Club) => {
    setSelected(club);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setClubs((prev) => prev.filter((c) => c.id !== id));
    setOpen(false);
    toast.success(t('clubsManagement.details.deleted'));
  };

  const handleCreate = (data: Omit<Club, 'id' | 'membersCount' | 'coursesCount' | 'createdAt' | 'managerId' | 'managerName'> & { managerId?: string | null }) => {
    const manager = mockManagers.find((m) => m.id === data.managerId);
    const newClub: Club = {
      ...data,
      id: `club-${Date.now()}`,
      membersCount: 0,
      coursesCount: 0,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      managerId: data.managerId ?? null,
      managerName: manager?.fullName ?? null,
    };
    setClubs((prev) => [...prev, newClub]);
    setFormOpen(false);
    toast.success(t('clubsManagement.form.created'));
  };

  const handleUpdate = (data: Omit<Club, 'id' | 'membersCount' | 'coursesCount' | 'createdAt' | 'managerId' | 'managerName'> & { managerId?: string | null }) => {
    if (!editing) return;
    const manager = mockManagers.find((m) => m.id === data.managerId);
    setClubs((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...data, managerId: data.managerId ?? null, managerName: manager?.fullName ?? null } : c)));
    setSelected((prev) => (prev && prev.id === editing.id ? { ...prev, ...data, managerId: data.managerId ?? null, managerName: manager?.fullName ?? null } : prev));
    setFormOpen(false);
    setEditing(null);
    toast.success(t('clubsManagement.details.updated'));
  };

  const handleAssignManager = () => {
    if (!assignClubId) return;
    const manager = mockManagers.find((m) => m.id === selectedManagerId);
    setClubs((prev) => prev.map((c) => (c.id === assignClubId ? { ...c, managerId: selectedManagerId === 'none' ? null : selectedManagerId, managerName: selectedManagerId === 'none' ? null : manager?.fullName ?? null } : c)));
    setSelected((prev) => (prev && prev.id === assignClubId ? { ...prev, managerId: selectedManagerId === 'none' ? null : selectedManagerId, managerName: selectedManagerId === 'none' ? null : manager?.fullName ?? null } : prev));
    setAssignOpen(false);
    toast.success(t('clubsManagement.details.managerAssigned'));
  };

  const openAssignDialog = (club: Club) => {
    setAssignClubId(club.id);
    setSelectedManagerId(club.managerId ?? 'none');
    setAssignOpen(true);
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <img src={selected.coverImage} alt={selected.name} className="h-32 w-full rounded-lg object-cover" />
      <div className="flex items-center gap-3">
        <img src={selected.logo} alt={selected.name} className="size-12 rounded-full border-2 border-primary object-cover" />
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.name}</span>
          <Badge className={`w-fit border text-xs ${statusColors[selected.status]}`}>
            {t(`clubsManagement.status.${selected.status}`)}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{selected.description}</p>
      <Separator />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.city')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <MapPin size={14} className="text-primary" /> {selected.city}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.createdAt')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Calendar size={14} className="text-primary" /> {selected.createdAt}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.members')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Users size={14} className="text-primary" /> {selected.membersCount}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.courses')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Flag size={14} className="text-primary" /> {selected.coursesCount}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.address')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Building size={14} className="text-primary" /> {selected.address}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.phone')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Phone size={14} className="text-primary" /> {selected.phone}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.email')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Mail size={14} className="text-primary" /> {selected.email}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.manager')}</span>
          {selected.managerName ? (
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-secondary/15 text-xs text-secondary">
                  {selected.managerName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-secondary">{selected.managerName}</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-red-500">{t('clubsManagement.details.unassigned')}</span>
          )}
        </div>
      </div>
    </div>
  );

  const detailsFooter = selected && (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10"
        onClick={() => { setEditing(selected); setOpen(false); setFormOpen(true); }}
      >
        <Pencil size={16} /> {t('clubsManagement.details.edit')}
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2 border-secondary text-secondary hover:bg-secondary/10"
        onClick={() => openAssignDialog(selected)}
      >
        <UserCog size={16} /> {selected.managerName ? t('clubsManagement.details.reassignManager') : t('clubsManagement.details.assignManager')}
      </Button>
      <Button
        variant="outline"
        className="flex-1 gap-2 border-border text-muted-foreground hover:bg-muted"
        onClick={() => handleDelete(selected.id)}
      >
        <Trash2 size={16} /> {t('clubsManagement.details.delete')}
      </Button>
    </div>
  );

  const assignDialog = (
    <>
      <p className="text-sm text-muted-foreground">{t('clubsManagement.form.manager')}</p>
      <Select value={selectedManagerId} onValueChange={(v) => setSelectedManagerId(v ?? 'none')}>
        <SelectTrigger className="w-full border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{t('clubsManagement.form.noManager')}</SelectItem>
          {mockManagers.map((m) => (
            <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('clubsManagement.title')}</h1>

      {/* Filter bar + Add button */}
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('clubsManagement.searchPlaceholder')} className="pl-10 border-primary placeholder:text-secondary" />
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus size={16} />
              <span className="hidden sm:inline">{t('clubsManagement.add')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('clubsManagement.filterStatus')}</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('clubsManagement.all')}</SelectItem>
                  <SelectItem value="published">{t('clubsManagement.status.published')}</SelectItem>
                  <SelectItem value="draft">{t('clubsManagement.status.draft')}</SelectItem>
                  <SelectItem value="pending">{t('clubsManagement.status.pending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('clubsManagement.filterCity')}</Label>
              <Select value={cityFilter} onValueChange={(v) => setCityFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c === 'all' ? t('clubsManagement.allCities') : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Clubs list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('clubsManagement.empty')}</p>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => handleClick(c)}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md"
            >
              <img src={c.logo} alt={c.name} className="size-12 shrink-0 rounded-full border border-border object-cover" />
              <Separator orientation="vertical" className="h-14" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium text-secondary">{c.name}</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {c.city}</span>
                  <span className="flex items-center gap-1"><Users size={12} className="text-primary" /> {c.membersCount}</span>
                  <span>
                    {c.managerName ? c.managerName : <span className="text-red-500">{t('clubsManagement.item.unassigned')}</span>}
                  </span>
                </div>
              </div>
              <Badge className={`shrink-0 border text-xs ${statusColors[c.status]}`}>
                {t(`clubsManagement.status.${c.status}`)}
              </Badge>
            </div>
          ))
        )}
      </div>

      {/* Details dialog/drawer */}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-surface max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {t('clubsManagement.details.title')}
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
                {t('clubsManagement.details.title')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4 max-h-[60vh]">{detailsContent}</div>
            <DrawerFooter className="px-4 pb-6">{detailsFooter}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Club form dialog */}
      <ClubFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing ?? undefined}
        managers={mockManagers}
      />

      {/* Assign manager dialog */}
      {isDesktop ? (
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogContent className="sm:max-w-sm bg-surface">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {t('clubsManagement.details.assignManager')}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">{assignDialog}</div>
            <DialogFooter className="gap-2">
              <Button variant="outline" className="flex-1 border-border" onClick={() => setAssignOpen(false)}>
                {t('clubsManagement.form.cancel')}
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAssignManager}>
                {t('clubsManagement.form.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={assignOpen} onOpenChange={setAssignOpen}>
          <DrawerContent className="max-h-[60vh] bg-surface">
            <DrawerHeader>
              <DrawerTitle className="font-serif text-lg font-bold text-secondary">
                {t('clubsManagement.details.assignManager')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-3 px-4 pb-6">{assignDialog}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 border-border" onClick={() => setAssignOpen(false)}>
                  {t('clubsManagement.form.cancel')}
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAssignManager}>
                  {t('clubsManagement.form.save')}
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}