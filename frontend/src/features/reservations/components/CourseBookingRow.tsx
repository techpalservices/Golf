import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Flame, ImageOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { CourseAvailability, SlotAvailability } from '../types';

interface CourseRowProps {
  course: CourseAvailability;
  date: string; // YYYY-MM-DD
  openTime: string; // HH:mm:ss
  closeTime: string; // HH:mm:ss
  clubBlocked?: boolean; // true → player already has a reservation at this club today
  onSlotSelect: (course: CourseAvailability, slot: SlotAvailability) => void;
}

const MAX_PLAYERS = 4;
const SLOT_INTERVAL_MIN = 5;
const BATCH = 24; // slots rendered per lazy-load batch (~2 hours of 5-min slots)

export default function CourseBookingRow({ course, date, openTime, closeTime, clubBlocked = false, onSlotSelect }: CourseRowProps) {
  const { t } = useTranslation('reservations');
  const [imgIndex, setImgIndex] = useState(0);
  const images = course.imagesUrl ?? [];

  const prevImage = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setImgIndex((i) => (i + 1) % images.length);

  // Index existing slots by "HH:mm" so we can overlay their booked status on the grid.
  const slotByStart: Record<string, SlotAvailability> = {};
  (course.timeSlots ?? []).forEach((s) => {
    slotByStart[s.startTime.slice(11, 16)] = s;
  });

  // Always render the full grid for the club's opening hours, even when the
  // backend has no slots for this date. Existing slots only overlay their
  // booked count on top of the generated cells.
  const openMin = timeToMinutes(openTime || '07:00:00');
  const closeMin = timeToMinutes(closeTime || '19:00:00');

  const cells: { time: string; booked: number }[] = [];
  for (let m = openMin; m < closeMin; m += SLOT_INTERVAL_MIN) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    const key = `${hh}:${mm}`;
    cells.push({ time: key, booked: slotByStart[key]?.bookedPlayers ?? 0 });
  }

  // Client-side lazy rendering: render slots in batches as the user scrolls.
  // All data is already here — we just defer mounting DOM nodes to avoid lag.
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const hasMoreSlots = visibleCount < cells.length;
  const sentinelRef = useInfiniteScroll(
    () => setVisibleCount((c) => Math.min(c + BATCH, cells.length)),
    hasMoreSlots,
  );
  const visibleCells = cells.slice(0, visibleCount);

  const handleClick = (cell: { time: string; booked: number }) => {
    if (clubBlocked || cell.booked >= MAX_PLAYERS) return;
    const existing = slotByStart[cell.time];
    onSlotSelect(
      { ...course, timeSlots: undefined }, // avoid passing slots back (kept in page state)
      {
        id: existing?.id ?? '',
        startTime: `${date}T${cell.time}:00`,
        endTime: `${date}T${cell.time}:${String(SLOT_INTERVAL_MIN).padStart(2, '0')}`,
        bookedPlayers: cell.booked,
      },
    );
  };

  return (
    <article className="rounded-lg border border-border bg-background/50 p-2 sm:p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        {/* Course info + image carousel */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-col lg:items-start lg:gap-2 lg:pt-0">
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-40 lg:h-60 lg:w-96">
            {images.length > 0 ? (
              <>
                <img src={images[imgIndex]} alt="" className="h-full w-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white transition-colors hover:bg-black/60"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white transition-colors hover:bg-black/60"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={cn('h-1 rounded-full transition-all', i === imgIndex ? 'w-3 bg-white' : 'w-1 bg-white/50')}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageOff size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-bold text-secondary sm:text-xl lg:text-2xl">{course.name}</h3>
            <p className="mt-1 text-base text-muted-foreground sm:text-base">
              {course.holeCount} {t('slot.holes')} <span className="mx-1.5 text-border">|</span>
              <span className="font-serif text-lg font-bold text-primary lg:text-xl">{course.greenFee} MAD</span>
           </p>
         </div>
        </div>

        {/* Slots — horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="min-w-0 flex-1 lg:max-w-[70%]">
          <div className="flex gap-2.5 overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:gap-2.5 lg:overflow-x-visible lg:pb-0 lg:pr-1 lg:max-h-[288px] lg:overflow-y-auto">
            <>
            {visibleCells.map((cell) => {
              const availableCount = Math.max(0, MAX_PLAYERS - cell.booked);
              const available = availableCount > 0 && !clubBlocked;

              return (
                <button
                  key={cell.time}
                  onClick={available ? () => handleClick(cell) : undefined}
                  disabled={!available}
                  className={cn(
                    'flex w-[150px] shrink-0 flex-col gap-2 rounded-lg border p-2 text-left transition-all lg:w-auto',
                    clubBlocked
                      ? 'border-secondary/40 bg-secondary/10 cursor-not-allowed opacity-50'
                      : available
                        ? 'border-primary bg-primary/5 hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-sm cursor-pointer'
                        : 'border-border bg-muted/50 cursor-not-allowed opacity-60',
                  )}
                >
                  {/* Time + available count */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'font-serif text-base font-bold',
                        clubBlocked ? 'text-secondary/60' : available ? 'text-secondary' : 'text-muted-foreground',
                      )}
                    >
                      {cell.time}
                   </span>
                    {clubBlocked ? (
                      <span className="rounded-full bg-secondary/15 px-1.5 py-0.5 text-[10px] font-medium text-secondary/60 lg:px-2 lg:text-xs">
                        {t('slot.blocked') || 'Booked'}
                      </span>
                    ) : available && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary lg:px-2 lg:text-xs">
                        {availableCount <= 2 && <Flame size={11} />}
                        {availableCount} {t('slot.places')}
                     </span>
                    )}
                 </div>

                  {/* Avatar group — 4 spots */}
                  <div className="flex -space-x-2">
                    {Array.from({ length: MAX_PLAYERS }).map((_, i) => {
                      const isBooked = i < cell.booked;
                      return (
                        <Avatar
                          key={i}
                          className={cn(
                            'h-6 w-6 rounded-full border-2',
                            isBooked ? 'border-primary bg-secondary' : 'border-border bg-background',
                          )}
                        >
                          <AvatarImage src="" alt="" />
                          <AvatarFallback className={isBooked ? 'bg-primary/10' : 'bg-muted'}>
                            {isBooked ? (
                              <FaUser className="size-2.5 text-primary" />
                            ) : (
                              <div className="h-full w-full" />
                            )}
                         </AvatarFallback>
                       </Avatar>
                      );
                    })}
                 </div>
               </button>
              );
            })}
            <div ref={sentinelRef} className="h-1 lg:h-2 lg:col-span-3 shrink-0 w-1 lg:w-auto" />
            </>
         </div>
        </div>
      </div>
    </article>
  );
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}