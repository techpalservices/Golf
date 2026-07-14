import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Clock, Calendar, Users, Check, X } from 'lucide-react';
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

type RequestStatus = 'pending' | 'approved' | 'rejected';

interface BookingRequest {
  id: string;
  userFullName: string;
  userInitials: string;
  courseNumber: number;
  courseName: string;
  playersCount: number;
  time: string;
  date: string;
  requestedAt: string;
  status: RequestStatus;
  price: number;
  contact: string;
}

const statusColors: Record<RequestStatus, string> = {
  pending: 'border-primary bg-primary/15 text-primary',
  approved: 'border-secondary bg-secondary/15 text-secondary',
  rejected: 'border-border bg-muted text-muted-foreground',
};

const mockRequests: BookingRequest[] = [
  { id: '1', userFullName: 'Ahmed Benali', userInitials: 'AB', courseNumber: 1, courseName: 'Parcours Massy', playersCount: 3, time: '09:30', date: '14/07/2026', requestedAt: 'il y a 2h', status: 'pending', price: 500, contact: '+212 6 12 34 56 78' },
  { id: '2', userFullName: 'Sara Mansouri', userInitials: 'SM', courseNumber: 2, courseName: 'Parcours Palmeraie', playersCount: 2, time: '11:00', date: '15/07/2026', requestedAt: 'il y a 5h', status: 'pending', price: 300, contact: '+212 6 98 76 54 32' },
  { id: '3', userFullName: 'Youssef Khalfouni', userInitials: 'YK', courseNumber: 1, courseName: 'Parcours Massy', playersCount: 4, time: '08:00', date: '14/07/2026', requestedAt: 'il y a 6h', status: 'pending', price: 500, contact: '+212 6 55 44 33 22' },
  { id: '4', userFullName: 'Imane Rachidi', userInitials: 'IR', courseNumber: 1, courseName: 'Parcours Massy', playersCount: 1, time: '14:00', date: '16/07/2026', requestedAt: 'il y a 1j', status: 'pending', price: 500, contact: '+212 6 77 88 99 00' },
  { id: '5', userFullName: 'Karim El Idrissi', userInitials: 'KE', courseNumber: 2, courseName: 'Parcours Palmeraie', playersCount: 2, time: '10:00', date: '15/07/2026', requestedAt: 'il y a 1j', status: 'approved', price: 300, contact: '+212 6 11 22 33 44' },
  { id: '6', userFullName: 'Nadia Lamrani', userInitials: 'NL', courseNumber: 1, courseName: 'Parcours Massy', playersCount: 4, time: '07:00', date: '14/07/2026', requestedAt: 'il y a 2j', status: 'rejected', price: 500, contact: '+212 6 90 80 70 60' },
];

export default function RequestsPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selected, setSelected] = useState<BookingRequest | null>(null);
  const [open, setOpen] = useState(false);

  const courses = useMemo(() => ['all', ...Array.from(new Set(mockRequests.map((r) => r.courseName)))], []);
  const dates = useMemo(() => ['all', ...Array.from(new Set(mockRequests.map((r) => r.date)))], []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.userFullName.toLowerCase().includes(q) && !r.courseName.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (courseFilter !== 'all' && r.courseName !== courseFilter) return false;
      if (dateFilter !== 'all' && r.date !== dateFilter) return false;
      return true;
    });
  }, [requests, search, statusFilter, courseFilter, dateFilter]);

  const handleClick = (req: BookingRequest) => {
    setSelected(req);
    setOpen(true);
  };

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
    setSelected((prev) => (prev ? { ...prev, status: action } : null));
    toast.success(action === 'approved' ? t('requests.details.accepted') : t('requests.details.rejected'));
    if (action === 'rejected') setTimeout(() => setOpen(false), 800);
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      {/* Player header */}
      <div className="flex items-center gap-3">
        <Avatar size="lg" className="border-2 border-primary">
          <AvatarFallback className="bg-primary/15 font-bold text-primary">{selected.userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.userFullName}</span>
          <Badge className={`w-fit border text-xs ${statusColors[selected.status]}`}>
            {t(`requests.status.${selected.status}`)}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.course')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.courseName}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.date')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.date}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.time')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.time}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.players')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.playersCount}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.price')}</span>
          <span className="text-sm font-semibold text-primary">{selected.price} MAD</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('requests.details.contact')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.contact}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock size={12} className="text-primary" />
        <span>{t('requests.details.requestedAt')} {selected.requestedAt}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('requests.title')}</h1>

      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('requests.searchPlaceholder')}
              className="pl-10 border-primary placeholder:text-secondary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('requests.filterStatus')}</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('requests.all')}</SelectItem>
                  <SelectItem value="pending">{t('requests.status.pending')}</SelectItem>
                  <SelectItem value="approved">{t('requests.status.approved')}</SelectItem>
                  <SelectItem value="rejected">{t('requests.status.rejected')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('requests.filterCourse')}</Label>
              <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c} value={c}>{c === 'all' ? t('requests.allCourses') : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">{t('requests.filterDate')}</Label>
              <Select value={dateFilter} onValueChange={(v) => setDateFilter(v ?? 'all')}>
                <SelectTrigger size="sm" className="w-full border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dates.map((d) => (
                    <SelectItem key={d} value={d}>{d === 'all' ? t('requests.allDates') : d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Requests list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('requests.empty')}</p>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              onClick={() => handleClick(req)}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md"
            >
              <Avatar size="lg" className="border border-border">
                <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">{req.userInitials}</AvatarFallback>
              </Avatar>
              <Separator orientation="vertical" className="h-12" />
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium text-secondary">{req.userFullName}</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-primary" />
                    {req.date} {t('requests.item.at')} {req.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-primary" />
                    {req.playersCount} {t('requests.item.players')}
                  </span>
                  <span>#{req.courseNumber}</span>
                </div>
              </div>
              <Badge className={`shrink-0 border text-xs ${statusColors[req.status]}`}>
                {t(`requests.status.${req.status}`)}
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
                {t('requests.details.title')}
              </DialogTitle>
            </DialogHeader>
            {detailsContent}
            {selected?.status === 'pending' && (
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-muted-foreground hover:bg-muted"
                  onClick={() => handleAction(selected.id, 'rejected')}
                >
                  <X size={16} />
                  {t('requests.details.reject')}
                </Button>
                <Button
                  className="flex-1 bg-secondary text-white hover:bg-secondary/80"
                  onClick={() => handleAction(selected.id, 'approved')}
                >
                  <Check size={16} />
                  {t('requests.details.accept')}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] bg-surface">
            <DrawerHeader>
              <DrawerTitle className="font-serif text-lg font-bold text-secondary">
                {t('requests.details.title')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-4 max-h-[65vh]">{detailsContent}</div>
            {selected?.status === 'pending' && (
              <DrawerFooter className="px-4 pb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-muted-foreground hover:bg-muted"
                    onClick={() => handleAction(selected.id, 'rejected')}
                  >
                    <X size={16} />
                    {t('requests.details.reject')}
                  </Button>
                  <Button
                    className="flex-1 bg-secondary text-white hover:bg-secondary/80"
                    onClick={() => handleAction(selected.id, 'approved')}
                  >
                    <Check size={16} />
                    {t('requests.details.accept')}
                  </Button>
                </div>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}