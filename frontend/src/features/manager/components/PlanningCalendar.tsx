import { useMemo } from 'react';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import ShadcnBigCalendar from '@/components/shadcn-big-calendar/shadcn-big-calendar';
import type { Session } from '../pages/PlanningPage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import '@/components/shadcn-big-calendar/shadcn-big-calendar.css';

const localizer = momentLocalizer(moment);

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
}

export default function PlanningCalendar({
  sessions,
  onSelectEvent,
  onSelectSlot,
}: PlanningCalendarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

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

  const eventPropGetter = (event: { resource?: Session }) => {
    const status = event.resource?.status ?? 'available';
    return { className: statusToClass[status] ?? 'event-variant-primary' };
  };

  return (
    <div
      className="rounded-lg border border-border bg-surface p-2"
      style={{ height: isDesktop ? '70vh' : '60vh' }}
    >
      <ShadcnBigCalendar
        localizer={localizer}
        events={events}
        defaultView={isDesktop ? 'week' : 'day'}
        views={['week', 'day']}
        culture="fr"
        step={60}
        showMultiDayTimes
        min={minDate}
        max={maxDate}
        eventPropGetter={eventPropGetter as never}
        onSelectEvent={(event: { resource?: Session }) => onSelectEvent(event.resource as Session)}
        onSelectSlot={onSelectSlot}
        selectable
        style={{ height: '100%' }}
      />
    </div>
  );
}