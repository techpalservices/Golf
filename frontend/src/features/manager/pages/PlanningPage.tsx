import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Search, Clock, Calendar as CalIcon, Briefcase, Coffee } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import PlanningCalendar from '../components/PlanningCalendar';

type SessionStatus = 'available' | 'partial' | 'full' | 'blocked';

interface Player { name: string; initials: string; }

export interface Session {
  id: string;
  time: string;
  date: string;
  start: Date;
  end: Date;
  status: SessionStatus;
  course: string;
  club: string;
  price: number;
  players: Player[];
  contact?: string;
}

const statusColors: Record<SessionStatus, string> = {
  available: 'bg-secondary/15 text-secondary border-secondary/30',
  partial: 'bg-primary/15 text-primary border-primary/30',
  full: 'bg-red-500/15 text-red-600 border-red-500/30',
  blocked: 'bg-muted text-muted-foreground border-border',
};

function makeDate(dayOffset: number, hour: number): Date {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const d = new Date(monday);
  d.setDate(monday.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function fmtDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const mockSessions: Session[] = [
  { id: '1', time: '07:00', date: fmtDate(makeDate(0, 7)), start: makeDate(0, 7), end: makeDate(0, 8), status: 'full', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [{ name: 'Ahmed B.', initials: 'AB' }, { name: 'Sara M.', initials: 'SM' }, { name: 'Karim E.', initials: 'KE' }, { name: 'Nadia L.', initials: 'NL' }], contact: '+212 6 12 34 56' },
  { id: '2', time: '09:00', date: fmtDate(makeDate(0, 9)), start: makeDate(0, 9), end: makeDate(0, 10), status: 'partial', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [{ name: 'Youssef K.', initials: 'YK' }, { name: 'Omar F.', initials: 'OF' }], contact: '+212 6 98 76 54' },
  { id: '3', time: '11:00', date: fmtDate(makeDate(1, 11)), start: makeDate(1, 11), end: makeDate(1, 12), status: 'full', course: 'Parcours Palmeraie', club: 'Royal Golf', price: 300, players: [{ name: 'Hassan T.', initials: 'HT' }, { name: 'Imane R.', initials: 'IR' }, { name: 'Said M.', initials: 'SM' }, { name: 'Leila A.', initials: 'LA' }] },
  { id: '4', time: '08:00', date: fmtDate(makeDate(2, 8)), start: makeDate(2, 8), end: makeDate(2, 9), status: 'partial', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [{ name: 'Reda B.', initials: 'RB' }] },
  { id: '5', time: '14:00', date: fmtDate(makeDate(2, 14)), start: makeDate(2, 14), end: makeDate(2, 15), status: 'blocked', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [] },
  { id: '6', time: '10:00', date: fmtDate(makeDate(3, 10)), start: makeDate(3, 10), end: makeDate(3, 11), status: 'available', course: 'Parcours Palmeraie', club: 'Royal Golf', price: 300, players: [] },
  { id: '7', time: '13:00', date: fmtDate(makeDate(4, 13)), start: makeDate(4, 13), end: makeDate(4, 14), status: 'partial', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [{ name: 'Anas H.', initials: 'AH' }, { name: 'Meryem C.', initials: 'MC' }, { name: 'Youssef K.', initials: 'YK' }] },
  { id: '8', time: '09:00', date: fmtDate(makeDate(5, 9)), start: makeDate(5, 9), end: makeDate(5, 10), status: 'full', course: 'Parcours Massy', club: 'Royal Golf', price: 500, players: [{ name: 'Ahmed B.', initials: 'AB' }, { name: 'Sara M.', initials: 'SM' }, { name: 'Karim E.', initials: 'KE' }, { name: 'Nadia L.', initials: 'NL' }] },
  { id: '9', time: '15:00', date: fmtDate(makeDate(6, 15)), start: makeDate(6, 15), end: makeDate(6, 16), status: 'available', course: 'Parcours Palmeraie', club: 'Royal Golf', price: 300, players: [] },
];

const timeOptions = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

type TabId = 'sessions' | 'calendar';

export default function PlanningPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [tab, setTab] = useState<TabId>('sessions');
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [timeFrom, setTimeFrom] = useState('all');
  const [timeTo, setTimeTo] = useState('all');

  const [selected, setSelected] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ start: Date; end: Date } | null>(null);

  const courses = useMemo(() => ['all', ...Array.from(new Set(mockSessions.map((s) => s.course)))], []);
  const dates = useMemo(() => ['all', ...Array.from(new Set(mockSessions.map((s) => s.date)))], []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        const match = s.course.toLowerCase().includes(q) || s.players.some((p) => p.name.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (dateFilter !== 'all' && s.date !== dateFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (courseFilter !== 'all' && s.course !== courseFilter) return false;
      if (timeFrom !== 'all' && s.time < timeFrom) return false;
      if (timeTo !== 'all' && s.time > timeTo) return false;
      return true;
    });
  }, [sessions, search, dateFilter, statusFilter, courseFilter, timeFrom, timeTo]);

  const handleClick = (session: Session) => {
    setSelected(session);
    setOpen(true);
  };

  const handleEventDrop = ({ event, start, end }: { event: Session; start: Date; end: Date }) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === event.id
          ? { ...s, start, end, time: `${String(start.getHours()).padStart(2, '0')}:00`, date: fmtDate(start) }
          : s
      )
    );
  };

  const handleEventResize = ({ event, start, end }: { event: Session; start: Date; end: Date }) => {
    setSessions((prev) => prev.map((s) => (s.id === event.id ? { ...s, start, end } : s)));
  };

  const handleSelectSlot = (slot: { start: Date; end: Date }) => {
    setPendingSlot(slot);
    setSlotDialogOpen(true);
  };

  const handleCreateBlock = (type: 'work' | 'break') => {
    if (!pendingSlot) return;
    const newSession: Session = {
      id: `block-${Date.now()}`,
      time: `${String(pendingSlot.start.getHours()).padStart(2, '0')}:00`,
      date: fmtDate(pendingSlot.start),
      start: pendingSlot.start,
      end: pendingSlot.end,
      status: type === 'break' ? 'blocked' : 'available',
      course: type === 'break' ? 'Pause' : 'Travail',
      club: 'Royal Golf',
      price: 0,
      players: [],
    };
    setSessions((prev) => [...prev, newSession]);
    setSlotDialogOpen(false);
    setPendingSlot(null);
    toast.success(type === 'break' ? 'Pause créée' : 'Créneau de travail créé');
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.time}</span>
          <span className="text-sm text-muted-foreground">{selected.date}</span>
        </div>
        <Badge className={`border ${statusColors[selected.status]}`}>
          {t(`planning.status.${selected.status}`)}
        </Badge>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('planning.details.course')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.course}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('planning.details.club')}</span>
          <span className="text-sm font-semibold text-secondary">{selected.club}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{t('planning.details.price')}</span>
          <span className="text-sm font-semibold text-primary">{selected.price} MAD</span>
        </div>
        {selected.contact && (
          <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
            <span className="text-xs text-muted-foreground">{t('planning.details.contact')}</span>
            <span className="text-sm font-semibold text-secondary">{selected.contact}</span>
          </div>
        )}
      </div>
      {selected.players.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-widest text-primary">{t('planning.details.players')}</span>
          <div className="flex flex-col gap-2">
            {selected.players.map((p) => (
              <div key={p.initials} className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="bg-primary/15 text-xs text-primary">{p.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-secondary">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl font-bold text-secondary">{t('planning.title')}</h1>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('sessions')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'sessions'
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border bg-surface text-muted-foreground hover:bg-muted'
          }`}
        >
          <Clock size={16} />
          {t('planning.tabSessions')}
        </button>
        <button
          onClick={() => setTab('calendar')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            tab === 'calendar'
              ? 'border-primary bg-primary/15 text-primary'
              : 'border-border bg-surface text-muted-foreground hover:bg-muted'
          }`}
        >
          <CalIcon size={16} />
          {t('planning.tabCalendar')}
        </button>
      </div>

      {/* Tab content */}
      {tab === 'sessions' ? (
        <div className="flex flex-col gap-4">
          {/* Filter bar */}
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('planning.searchPlaceholder')}
                  className="pl-10 border-primary placeholder:text-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterDate')}</Label>
                  <Select value={dateFilter} onValueChange={(v) => setDateFilter(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dates.map((d) => (
                        <SelectItem key={d} value={d}>{d === 'all' ? t('planning.all') : d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterStatus')}</Label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('planning.all')}</SelectItem>
                      <SelectItem value="available">{t('planning.status.available')}</SelectItem>
                      <SelectItem value="partial">{t('planning.status.partial')}</SelectItem>
                      <SelectItem value="full">{t('planning.status.full')}</SelectItem>
                      <SelectItem value="blocked">{t('planning.status.blocked')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterCourse')}</Label>
                  <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c} value={c}>{c === 'all' ? t('planning.allCourses') : c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterTimeFrom')}</Label>
                  <Select value={timeFrom} onValueChange={(v) => setTimeFrom(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('planning.all')}</SelectItem>
                      {timeOptions.map((tm) => (
                        <SelectItem key={tm} value={tm}>{tm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterTimeTo')}</Label>
                  <Select value={timeTo} onValueChange={(v) => setTimeTo(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('planning.all')}</SelectItem>
                      {timeOptions.map((tm) => (
                        <SelectItem key={tm} value={tm}>{tm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Sessions list */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t('planning.noSessions')}</p>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleClick(s)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-shadow hover:shadow-md"
                >
                  <div className="flex w-14 shrink-0 flex-col items-center">
                    <span className="font-serif text-sm font-bold text-secondary">{s.time}</span>
                    <span className="text-[10px] text-muted-foreground">{s.date}</span>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium text-secondary">{s.course}</span>
                    <Badge className={`w-fit border text-[10px] ${statusColors[s.status]}`}>
                      {t(`planning.status.${s.status}`)}
                    </Badge>
                  </div>
                  {s.players.length > 0 && (
                    <div className="flex -space-x-2">
                      {s.players.slice(0, 3).map((p) => (
                        <Avatar key={p.initials} size="sm" className="ring-2 ring-surface">
                          <AvatarFallback className="bg-primary/15 text-[10px] text-primary">{p.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {s.players.length > 3 && (
                        <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground ring-2 ring-surface">
                          +{s.players.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <PlanningCalendar
  sessions={sessions}
  onSelectEvent={handleClick}
  onSelectSlot={handleSelectSlot}
/>
      )}

      {/* Details dialog/drawer */}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-surface max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {t('planning.details.title')}
              </DialogTitle>
            </DialogHeader>
            {detailsContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[85vh] bg-surface">
            <DrawerHeader>
              <DrawerTitle className="font-serif text-lg font-bold text-secondary">
                {t('planning.details.title')}
              </DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{detailsContent}</div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Slot creation dialog */}
      <Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
        <DialogContent className="sm:max-w-sm bg-surface">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-secondary">
              {pendingSlot && `${String(pendingSlot.start.getHours()).padStart(2, '0')}:00 — ${String(pendingSlot.end.getHours()).padStart(2, '0')}:00`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Créer un créneau :</p>
            <div className="flex gap-3">
              <Button
                className="flex-1 gap-2 bg-secondary text-white hover:bg-secondary/80"
                onClick={() => handleCreateBlock('work')}
              >
                <Briefcase size={16} />
                Travail
              </Button>
              <Button
                className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleCreateBlock('break')}
              >
                <Coffee size={16} />
                Pause
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}