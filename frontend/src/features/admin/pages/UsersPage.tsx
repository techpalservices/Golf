import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Mail, Phone, Calendar, Building, CalendarCheck, Check, X, UserCog, UserMinus, Trash2 } from 'lucide-react';
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

type Role = 'player' | 'manager' | 'admin';
type UserStatus = 'active' | 'suspended' | 'pending';

interface User {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  registeredAt: string;
  managedClub?: string;
  reservationsCount: number;
}

const roleColors: Record<Role, string> = {
  player: 'border-primary bg-primary/15 text-primary',
  manager: 'border-secondary bg-secondary/15 text-secondary',
  admin: 'border-blue-500 bg-blue-500/15 text-blue-600',
};

const statusColors: Record<UserStatus, string> = {
  active: 'border-secondary bg-secondary/15 text-secondary',
  suspended: 'border-red-500 bg-red-500/15 text-red-600',
  pending: 'border-primary bg-primary/15 text-primary',
};

const mockUsers: User[] = [
  { id: '1', fullName: 'Ahmed Benali', initials: 'AB', email: 'ahmed.benali@email.com', phone: '+212 6 12 34 56 78', role: 'player', status: 'active', registeredAt: '15/01/2024', reservationsCount: 24 },
  { id: '2', fullName: 'Sara Mansouri', initials: 'SM', email: 'sara.mansouri@email.com', phone: '+212 6 98 76 54 32', role: 'manager', status: 'active', registeredAt: '03/06/2024', managedClub: 'Royal Golf de Marrakech', reservationsCount: 0 },
  { id: '3', fullName: 'Youssef Khalfouni', initials: 'YK', email: 'youssef.k@email.com', phone: '+212 6 55 44 33 22', role: 'player', status: 'suspended', registeredAt: '20/09/2023', reservationsCount: 8 },
  { id: '4', fullName: 'Imane Rachidi', initials: 'IR', email: 'imane.r@email.com', phone: '+212 6 77 88 99 00', role: 'player', status: 'active', registeredAt: '11/02/2024', reservationsCount: 15 },
  { id: '5', fullName: 'Karim El Idrissi', initials: 'KE', email: 'karim.e@email.com', phone: '+212 6 11 22 33 44', role: 'manager', status: 'active', registeredAt: '28/11/2023', managedClub: 'Golf du Palais', reservationsCount: 0 },
  { id: '6', fullName: 'Nadia Lamrani', initials: 'NL', email: 'nadia.l@email.com', phone: '+212 6 90 80 70 60', role: 'player', status: 'pending', registeredAt: '01/07/2026', reservationsCount: 0 },
  { id: '7', fullName: 'Omar Fassi', initials: 'OF', email: 'omar.f@email.com', phone: '+212 6 33 22 11 00', role: 'admin', status: 'active', registeredAt: '15/03/2023', reservationsCount: 0 },
  { id: '8', fullName: 'Leila Alaoui', initials: 'LA', email: 'leila.a@email.com', phone: '+212 6 44 55 66 77', role: 'player', status: 'active', registeredAt: '22/05/2024', reservationsCount: 32 },
];

export default function UsersPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.fullName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleClick = (user: User) => {
    setSelected(user);
    setOpen(true);
  };

  const handleSuspend = (id: string, status: UserStatus) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setSelected((prev) => (prev ? { ...prev, status } : null));
    toast.success(status === 'suspended' ? t('users.details.suspended') : t('users.details.reinstated'));
  };

  const handleRoleChange = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role, managedClub: role === 'manager' ? u.managedClub : undefined } : u)));
    setSelected((prev) => (prev ? { ...prev, role } : null));
    toast.success(role === 'manager' ? t('users.details.assignedManager') : t('users.details.removedManager'));
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpen(false);
    toast.success(t('users.details.deleted'));
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="border-2 border-primary">
          <AvatarFallback className="bg-primary/15 font-bold text-primary">{selected.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.fullName}</span>
          <div className="flex gap-2">
            <Badge className={`border text-xs ${roleColors[selected.role]}`}>
              {t(`users.role.${selected.role}`)}
            </Badge>
            <Badge className={`border text-xs ${statusColors[selected.status]}`}>
              {t(`users.status.${selected.status}`)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('users.details.email')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Mail size={14} className="text-primary" /> {selected.email}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('users.details.phone')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Phone size={14} className="text-primary" /> {selected.phone}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('users.details.registeredAt')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Calendar size={14} className="text-primary" /> {selected.registeredAt}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('users.details.reservations')}</span>
          <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <CalendarCheck size={14} className="text-primary" /> {selected.reservationsCount}
          </span>
        </div>
        {selected.managedClub && (
          <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-border p-3">
            <span className="text-xs text-muted-foreground">{t('users.details.club')}</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <Building size={14} className="text-primary" /> {selected.managedClub}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const detailsFooter = selected && (
    <div className="flex flex-wrap gap-2">
      {/* Suspend / Reinstate */}
      {selected.status === 'active' ? (
        <Button className="flex-1 gap-2 bg-red-500 text-white hover:bg-red-500/80" onClick={() => handleSuspend(selected.id, 'suspended')}>
          <X size={16} /> {t('users.details.suspend')}
        </Button>
      ) : (
        <Button className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80" onClick={() => handleSuspend(selected.id, 'active')}>
          <Check size={16} /> {t('users.details.reinstate')}
        </Button>
      )}

      {/* Assign / Remove manager — only for players */}
      {selected.role === 'player' && (
        <Button variant="outline" className="flex-1 gap-2 border-secondary text-secondary hover:bg-secondary/10" onClick={() => handleRoleChange(selected.id, 'manager')}>
          <UserCog size={16} /> {t('users.details.assignManager')}
        </Button>
      )}
      {selected.role === 'manager' && (
        <Button variant="outline" className="flex-1 gap-2 border-primary text-primary hover:bg-primary/10" onClick={() => handleRoleChange(selected.id, 'player')}>
          <UserMinus size={16} /> {t('users.details.removeManager')}
        </Button>
      )}

      {/* Delete */}
      <Button variant="outline" className="flex-1 gap-2 border-border text-muted-foreground hover:bg-muted" onClick={() => handleDelete(selected.id)}>
        <Trash2 size={16} /> {t('users.details.delete')}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('users.title')}</h1>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('users.searchPlaceholder')}
              className="pl-10 border-primary placeholder:text-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('users.filterRole')}</Label>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('users.all')}</SelectItem>
                  <SelectItem value="player">{t('users.role.player')}</SelectItem>
                  <SelectItem value="manager">{t('users.role.manager')}</SelectItem>
                  <SelectItem value="admin">{t('users.role.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('users.filterStatus')}</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('users.all')}</SelectItem>
                  <SelectItem value="active">{t('users.status.active')}</SelectItem>
                  <SelectItem value="suspended">{t('users.status.suspended')}</SelectItem>
                  <SelectItem value="pending">{t('users.status.pending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Users list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('users.empty')}</p>
        ) : (
          filtered.map((u) => (
            <div
              key={u.id}
              onClick={() => handleClick(u)}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md"
            >
              <Avatar size="lg" className="border border-border">
                <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">{u.initials}</AvatarFallback>
              </Avatar>
              <Separator orientation="vertical" className="h-12" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium text-secondary">{u.fullName}</span>
                <span className="text-xs text-muted-foreground">{u.email}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={`border text-xs ${roleColors[u.role]}`}>
                  {t(`users.role.${u.role}`)}
                </Badge>
                <Badge className={`border text-xs ${statusColors[u.status]}`}>
                  {t(`users.status.${u.status}`)}
                </Badge>
              </div>
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
                {t('users.details.title')}
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
                {t('users.details.title')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4 max-h-[60vh]">{detailsContent}</div>
            <DrawerFooter className="px-4 pb-6">{detailsFooter}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}