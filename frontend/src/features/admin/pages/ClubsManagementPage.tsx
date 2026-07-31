import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, MapPin, Building, Users, Flag, Phone, Mail, Calendar, UserCog, MonitorX, MonitorCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ClubFormDialog from '../components/ClubFormDialog';
import type { Club } from '../../clubs/types.ts'
import { ClubStatus } from "../../clubs/types.ts";

import {useDataClubs} from "@/features/admin/hooks/useDataClubs.ts";
import {useChangeClubStatus} from "@/features/admin/hooks/useChangeClubStatus.ts";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll.ts";

function status(status: string){
  switch (status){
    case 'ACTIVE': return 'active';
    case 'SUSPENDED': return 'suspended';
    case 'ARCHIVED': return 'archived';
    default: return 'unknown';
  }
}

const statusColors: Record<ClubStatus, string> = {
  active:    'border-secondary bg-secondary/15 text-secondary', // green
  suspended: 'border-red-500 bg-red-500/15 text-red-600',       // red
  archived:  'border-border bg-muted text-muted-foreground',    // gray (for archived)
};

export default function ClubsManagementPage() {
  const { t } = useTranslation('app');
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useDataClubs();
  const changeClubStatus = useChangeClubStatus();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const loadMoreRef = useInfiniteScroll(() => fetchNextPage(), hasNextPage);

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

  const clubs = data?.pages.flatMap(p => p) ?? [];

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.city.toLowerCase().includes(q) && !(c.ownerName?.toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      return true;
    });
  }, [clubs, search, statusFilter, cityFilter]);

  if (isLoading) return <div>Loading managers...</div>;
  if (error) return <div>Failed to load managers</div>;

  const handleClick = (club: Club) => {
    setSelected(club);
    setOpen(true);
  };

  const handleChange = (club: Club) => {
    const status = club.status == ClubStatus.ACTIVE ? ClubStatus.SUSPENDED : ClubStatus.ACTIVE;
    changeClubStatus.mutate(
        {
          clubId: club.id,
          status
        },
        {
          onSuccess: () => {
            //something should be changed on success
          },
        });
  }

  const handleAssignManager = () => {
    //later
  };

  const openAssignDialog = (club: Club) => {
    setAssignClubId(club.id);
    setSelectedManagerId(club.ownerId ?? 'none');
    setAssignOpen(true);
  };

  console.log("clubs data: " + clubs);

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <img src={selected.coverURL} alt={selected.name} className="h-32 w-full rounded-lg object-cover" />
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="border border-border">
          {
            selected.logoURL == null
                ? <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
                  {selected.name.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
                : <AvatarImage src={selected.logoURL} />
          }
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.name}</span>
          <Badge className={`w-fit border text-xs ${statusColors[status(selected.status)]}`}>
            {t(`clubsManagement.status.${status(selected.status)}`)}
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
            <Users size={14} className="text-primary" /> {selected.memberCount}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.courses')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Flag size={14} className="text-primary" /> {selected.courseCount}
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
            <Phone size={14} className="text-primary" /> {selected.phone == null ? t('clubsManagement.details.notProvided') : selected.phone}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.email')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Mail size={14} className="text-primary" /> {selected.email == null ? t('clubsManagement.details.notProvided') : selected.email}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('clubsManagement.details.owner')}</span>
          {selected.ownerName ? (
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-secondary/15 text-xs text-secondary">
                  {selected.ownerName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-secondary">{selected.ownerName}</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-red-500">{t('clubsManagement.details.unassigned')}</span>
          )}
        </div>
      </div>
    </div>
  );

  console.log("selected club: " + selected?.ownerName);

  const isActive = selected?.status === ClubStatus.ACTIVE;

  const colorsDetails = isActive
      ? 'border-red-500 text-red-600 hover:bg-red-500/10 hover:text-red-700'
      : 'border-secondary text-secondary hover:bg-secondary/10';

  const iconDetails = isActive ? (
      <>
        <MonitorX size={16} />
      </>
  ) : (
      <MonitorCheck size={16} />
  );

  const detailsFooter = selected && (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className={`flex-1 gap-2 ${colorsDetails} `}
        onClick={() => handleChange(selected)}
      >
        {iconDetails} {selected.status == ClubStatus.ACTIVE ? t('clubsManagement.details.suspend') : t('clubsManagement.details.activate')}

      </Button>

      {(selected.ownerId == null) && (
          <Button
              variant="outline"
              className="flex-1 gap-2 border-secondary text-secondary hover:bg-secondary/10"
              onClick={() => openAssignDialog(selected)}
          >
            <UserCog size={16} /> {selected.ownerName ? t('clubsManagement.details.reassignOwner') : t('clubsManagement.details.assignOwner')}
          </Button>
      )}
    </div>
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
                  <SelectItem value="active">{t('clubsManagement.status.active')}</SelectItem>
                  <SelectItem value="suspended">{t('clubsManagement.status.suspended')}</SelectItem>
                  <SelectItem value="archived">{t('clubsManagement.status.archived')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('clubsManagement.filterCity')}</Label>
              <Select value={cityFilter} onValueChange={(v) => setCityFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                {/*<SelectContent>*/}
                {/*  {cities.map((c) => (*/}
                {/*    <SelectItem key={c} value={c}>{c === 'all' ? t('clubsManagement.allCities') : c}</SelectItem>*/}
                {/*  ))}*/}
                {/*</SelectContent>*/}
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
              <Avatar size="lg" className="border border-border">
                {
                  c.logoURL == null
                      ? <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
                        {c.name.charAt(0).toLocaleUpperCase()}
                      </AvatarFallback>
                      : <AvatarImage src={c.logoURL} />
                }
              </Avatar>
              <Separator orientation="vertical" className="h-14" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium text-secondary">{c.name}</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {c.city}</span>
                  <span className="flex items-center gap-1"><Users size={12} className="text-primary" /> {c.memberCount}</span>
                  <span>
                    {c.ownerId ? c.ownerName : <span className="text-red-500">{t('clubsManagement.item.unassigned')}</span>}
                  </span>
                </div>
              </div>
              <Badge className={`shrink-0 border text-xs ${statusColors[status(c.status)]}`}>
                {t(`clubsManagement.status.${status(c.status)}`)}
              </Badge>
            </div>
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="py-4">
        {isFetchingNextPage && (
            <p className="text-center text-sm text-muted-foreground">Loading more...</p>
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
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}