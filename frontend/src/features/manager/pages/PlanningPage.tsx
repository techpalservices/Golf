import { useState, useMemo, useEffect } from 'react';
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
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import PlanningCalendar from '../components/PlanningCalendar';
import {
  useManagerPlanning,
  type ManagerPlanningSlot,
} from '../hooks/useManagerPlanning';

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

const pad = (n: number) => String(n).padStart(2, '0');

const fmtDate = (d: Date): string =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

// ISO (YYYY-MM-DD) day-string for a date
const isoDay = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Monday..Sunday of the current week
function currentWeekRange(): { from: string; to: string } {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { from: isoDay(monday), to: isoDay(sunday) };
}

const fmtIso = (iso?: string): string =>
  iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '';

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// Map an API slot to the display model used by both tabs.
// NOTE: booked slots created via the booking flow can have a very short
// duration (e.g. 5 min), which makes them near-invisible in the calendar grid.
// Since this is "planning of the day", each slot is rendered as a fixed 1-hour
// block so every reservation is clearly visible in both list and calendar.
function deriveSession(s: ManagerPlanningSlot): Session {
  const start = new Date(s.startTime);
  let status: SessionStatus;
  if (s.status === 'CLOSED') status = 'blocked';
  else if (s.bookedPlayers >= 4) status = 'full';
  else if (s.bookedPlayers > 0 || s.status === 'RESERVED') status = 'partial';
  else status = 'available';

  return {
    id: s.id,
    time: s.startTime.slice(11, 16),
    date: fmtIso(s.startTime),
    start,
    end: new Date(start.getTime() + 60 * 60 * 1000), // fixed 1-hour display block
    status,
    course: s.courseName ?? '',
    club: '',
    price: Number(s.greenFee ?? 0),
    players: s.players.map((p) => ({
      name: p.playerName,
      initials: initialsOf(p.playerName),
    })),
    contact: s.players.find((p) => p.phone)?.phone,
  };
}

const timeOptions = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

type TabId = 'sessions' | 'calendar';

export default function PlanningPage() {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [tab, setTab] = useState<TabId>('sessions');

  // ── Server-driven filters ────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  // Debounce search input (500ms delay)
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 500);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Date range for the list tab
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Range driven by calendar navigation in the calendar tab — initialized to
  // the current week so the initial load (and Today/Back/Next) shows today.
  const [calendarRange, setCalendarRange] = useState<{ from?: string; to?: string }>(() => currentWeekRange());

  const [courseFilter, setCourseFilter] = useState('all');

  // ── Client-side-only filters (small data volume per query) ───────
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFrom, setTimeFrom] = useState('all');
  const [timeTo, setTimeTo] = useState('all');

  const activeFilters = tab === 'calendar'
    ? {
        q: search,
        courseId: courseFilter === 'all' ? undefined : courseFilter,
        dateFrom: calendarRange.from,
        dateTo: calendarRange.to,
      }
    : {
        q: search,
        courseId: courseFilter === 'all' ? undefined : courseFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useManagerPlanning(activeFilters);

  // Infinite scroll sentinel — lazy loads the next page at the bottom of the list
  const loadMoreRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, hasNextPage);

  const [selected, setSelected] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ start: Date; end: Date } | null>(null);

  // Local "work/break" blocks created from the calendar — kept in-memory until
  // the create-slot API supports them without a course context.
  const [localBlocks, setLocalBlocks] = useState<Session[]>([]);

  const fetchedSlots = useMemo(
    () => data?.pages.flatMap((p) => p.content) ?? [],
    [data],
  );

  // Accumulate course options (id → name) from fetched pages — never shrink
  const [courseOptions, setCourseOptions] = useState<Record<string, string>>({});
  useEffect(() => {
    setCourseOptions((prev) => {
      const next = { ...prev };
      fetchedSlots.forEach((s) => {
        next[s.courseId] = s.courseName;
      });
      return next;
    });
  }, [fetchedSlots]);

  const sessions: Session[] = useMemo(
    () => [...fetchedSlots.map(deriveSession), ...localBlocks],
    [fetchedSlots, localBlocks],
  );

  // Client-side extras on the already-fetched pages
  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (timeFrom !== 'all' && s.time < timeFrom) return false;
      if (timeTo !== 'all' && s.time > timeTo) return false;
      return true;
    });
  }, [sessions, statusFilter, timeFrom, timeTo]);


  const handleClick = (session: Session) => {
    setSelected(session);
    setOpen(true);
  };

  // const handleEventDrop = ({ event, start, end }: { event: Session; start: Date; end: Date }) => {
  //   setSessions((prev) =>
  //     prev.map((s) =>
  //       s.id === event.id
  //         ? { ...s, start, end, time: `${String(start.getHours()).padStart(2, '0')}:00`, date: fmtDate(start) }
  //         : s
  //     )
  //   );
  // };

  // const handleEventResize = ({ event, start, end }: { event: Session; start: Date; end: Date }) => {
  //   setSessions((prev) => prev.map((s) => (s.id === event.id ? { ...s, start, end } : s)));
  // };

  const handleSelectSlot = (slot: { start: Date; end: Date }) => {
    setPendingSlot(slot);
    setSlotDialogOpen(true);
  };

  const handleCreateBlock = (type: 'work' | 'break') => {
    if (!pendingSlot) return;
    const newSession: Session = {
      id: `block-${Date.now()}`,
      time: `${pad(pendingSlot.start.getHours())}:00`,
      date: fmtDate(pendingSlot.start),
      start: pendingSlot.start,
      end: pendingSlot.end,
      status: type === 'break' ? 'blocked' : 'available',
      course: type === 'break' ? 'Pause' : 'Travail',
      club: '',
      price: 0,
      players: [],
    };
    setLocalBlocks((prev) => [...prev, newSession]);
    setSlotDialogOpen(false);
    setPendingSlot(null);
    toast.success(type === 'break' ? 'Pause créée' : 'Créneau de travail créé');
  };

  const detailsContent = selected && (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-secondary">{selected.date}</span>
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('planning.searchPlaceholder')}
                  className="pl-10 border-primary placeholder:text-secondary"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterFrom')}</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border-border"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterTo')}</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border-border"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterStatus')}</Label>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue>
                        {statusFilter === 'all' ? t('planning.all') : t(`planning.status.${statusFilter}`)}
                      </SelectValue>
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
                      <SelectValue>
                        {courseFilter === 'all'
                          ? t('planning.allCourses')
                          : courseOptions[courseFilter] ?? courseFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('planning.allCourses')}</SelectItem>
                      {Object.entries(courseOptions).map(([id, name]) => (
                        <SelectItem key={id} value={id}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-muted-foreground">{t('planning.filterTimeFrom')}</Label>
                  <Select value={timeFrom} onValueChange={(v) => setTimeFrom(v ?? 'all')}>
                    <SelectTrigger size="sm" className="w-full border-border">
                      <SelectValue>{timeFrom === 'all' ? t('planning.all') : timeFrom}</SelectValue>
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
                      <SelectValue>{timeTo === 'all' ? t('planning.all') : timeTo}</SelectValue>
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
            {isLoading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Chargement...</p>
            ) : filtered.length === 0 ? (
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

            {/* Lazy loading sentinel */}
            <div ref={loadMoreRef} className="py-4">
              {isFetchingNextPage && (
                <p className="text-center text-sm text-muted-foreground">Chargement...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PlanningCalendar
          sessions={sessions}
          onSelectEvent={handleClick}
          onSelectSlot={handleSelectSlot}
          onDateRangeChange={(from, to) => setCalendarRange({ from, to })}
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