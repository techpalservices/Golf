import { useMemo, useRef } from 'react';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import ShadcnBigCalendar from '@/components/shadcn-big-calendar/shadcn-big-calendar';
import type { Session } from '../pages/PlanningPage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import '@/components/shadcn-big-calendar/shadcn-big-calendar.css';

const localizer = momentLocalizer(moment);

// Custom day-layout algorithm: renders every event as a FULL-WIDTH bar, and
// when two events overlap in time (e.g. same hour on different courses) it
// pushes the later one DOWN so they stack ONE UNDER THE OTHER instead of
// side-by-side, and never hides one behind the other.
// (The library's built-in "no-overlap" actually places them side-by-side —
//  this is the behavior the planning page does NOT want.)
function stackLayout(step: number, timeslots: number, minDate: Date, maxDate: Date) {
  const slotStepMin = step * timeslots; // minutes covered by one time-band
  return function stackLayoutImpl({ events, slotMetrics, accessors }: any) {
    if (!events || events.length === 0) return [];

    const totalRange = slotMetrics.getRange(minDate, maxDate);
    const totalMin = totalRange.end; // total minutes in the visible day
    const bandPct = (slotStepMin / totalMin) * 100; // height (%) of one time-band

    // Compute the natural top/height and the band each event lives in.
    const mapped = events.map((event: any) => {
      const r = slotMetrics.getRange(accessors.start(event), accessors.end(event));
      const slotIdx = Math.floor(r.start / slotStepMin); // which hour-band it starts in
      return {
        event,
        r,
        slotIdx,
        bandTop: slotIdx * bandPct,
        bandHeight: bandPct,
      };
    });

    // Group events by the band (hour) they start in.
    const groups: Record<number, typeof mapped> = {};
    mapped.forEach((m) => {
      const g = (groups[m.slotIdx] || (groups[m.slotIdx] = []));
      g.push(m);
    });
    // Sort each group so stacking order is deterministic (earliest first).
    Object.values(groups).forEach((g) =>
      g.sort((a, b) => a.r.start - b.r.start || a.r.end - b.r.end)
    );

    // Build the final styles.
    return mapped.map((m) => {
      const group = groups[m.slotIdx];
      // Single event in the band -> keep its natural size/position (full width).
      if (group.length === 1) {
        return {
          event: m.event,
          style: { top: m.r.top, height: m.r.height, width: 100, xOffset: 0 },
        };
      }
      // Several events share this band -> split the band vertically so they sit
      // one UNDER another, fully inside their own hour (label stays aligned).
      const rank = group.indexOf(m);
      const count = group.length;
      const top = m.bandTop + (rank / count) * m.bandHeight;
      const height = m.bandHeight / count;
      return {
        event: m.event,
        style: {
          top,
          height,
          width: 100, // full width -> never beside each other / never hidden
          xOffset: 0,
        },
      };
    });
  };
}



// Map session status → event variant class
const statusToClass: Record<string, string> = {
  available: 'event-variant-secondary',   // green
  partial: 'event-variant-primary',        // gold
  full: 'event-variant-destructive',       // red
  blocked: 'event-variant-outline',        // muted
};

interface PlanningCalendarProps {
  sessions: Session[];
  onSelectEvent: (session: Session) => void;
  onSelectSlot: (slot: { start: Date; end: Date }) => void;
  /** Fired whenever the visible day/week range changes (navigation) */
  onDateRangeChange?: (from?: string, to?: string) => void;
}

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function PlanningCalendar({
  sessions,
  onSelectEvent,
  onSelectSlot,
  onDateRangeChange,
}: PlanningCalendarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const lastRangeRef = useRef('');

  const events = useMemo(
    () =>
      sessions.map((s) => ({
        id: s.id,
        title: `${s.time} — ${s.course}`,
        start: s.start,
        end: s.end,
        resource: s,
      })),
    [sessions]
  );

  const minDate = new Date();
  minDate.setHours(6, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setHours(21, 0, 0, 0);

  const step = 60; // minutes per step
  const timeslots = 1; // one slot per hour → gutter shows every hour

  const eventPropGetter = (event: { resource?: Session }) => {
    const status = event.resource?.status ?? 'available';
    return { className: statusToClass[status] ?? 'event-variant-primary' };
  };

  const handleRangeChange = (range: unknown) => {
    let from: string | undefined;
    let to: string | undefined;

    if (Array.isArray(range)) {
      const dates = range as Date[];
      if (dates.length === 0) return;
      from = isoDay(dates[0]);
      to = isoDay(dates[dates.length - 1]);
    } else if (range && typeof range === 'object' && 'start' in (range as object)) {
      const r = range as { start: Date; end: Date };
      from = isoDay(r.start);
      // range end is exclusive midnight of next day → shift back one day
      to = isoDay(new Date(r.end.getTime() - 24 * 60 * 60 * 1000));
    } else {
      return;
    }

    const key = `${from}..${to}`;
    if (key === lastRangeRef.current) return;
    lastRangeRef.current = key;
    onDateRangeChange?.(from, to);
  };

  return (
    <div
      className="rounded-lg border border-border bg-surface p-2"
      // Very tall grid so each hour gets generous room (lines spread apart)
      // and stacked same-time slots have clear vertical space.
      style={{ height: isDesktop ? 'min(160vh, 2400px)' : 'min(130vh, 1600px)' }}
    >
      <ShadcnBigCalendar
        localizer={localizer}
        events={events}
        defaultView={isDesktop ? 'week' : 'day'}
        views={['week', 'day']}
        culture="fr"
        step={60}
        timeslots={1} // one slot per hour → gutter shows every hour (6:00, 7:00, 8:00…)
        // Custom algorithm: colliding events are stacked one UNDER the other,
        // full-width, inside their own hour band (time labels stay aligned).
        dayLayoutAlgorithm={stackLayout(step, timeslots, minDate, maxDate)}
        showMultiDayTimes
        min={minDate}
        max={maxDate}
        eventPropGetter={eventPropGetter as never}
        onSelectEvent={(event: { resource?: Session }) => onSelectEvent(event.resource as Session)}
        onSelectSlot={onSelectSlot}
        onRangeChange={handleRangeChange as never}
        selectable
        style={{ height: '100%' }}
      />
    </div>
  );
}