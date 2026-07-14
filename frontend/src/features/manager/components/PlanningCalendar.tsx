import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Session } from '../pages/PlanningPage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const statusToColor: Record<string, string> = {
  available: '#2D6A4F',
  partial: '#C9A84C',
  full: '#dc2626',
  blocked: '#6C757D',
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
  const { t } = useTranslation('app');
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

  const eventStyleGetter = (event: { resource?: Session }) => {
    const status = event.resource?.status ?? 'available';
    const color = statusToColor[status] ?? '#2D6A4F';
    return {
      style: {
        backgroundColor: color,
        opacity: 0.85,
        borderRadius: '4px',
        border: 'none',
        color: '#fff',
        fontSize: '11px',
        padding: '2px 4px',
      },
    };
  };

  const formats = {
    timeGutterFormat: 'HH:mm',
    dayFormat: 'EEE dd/MM',
    eventTimeRangeFormat: () => '',
  };

  return (
    <div
      className="rounded-lg border border-border bg-surface p-2"
      style={{ height: isDesktop ? '70vh' : '60vh' }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={isDesktop ? Views.WEEK : Views.DAY}
        views={[Views.WEEK, Views.DAY]}
        culture="fr"
        formats={formats}
        step={60}
        showMultiDayTimes
        min={minDate}
        max={maxDate}
        eventPropGetter={eventStyleGetter as never}
        onSelectEvent={(event: { resource?: Session }) => onSelectEvent(event.resource as Session)}
        onSelectSlot={onSelectSlot}
        selectable
        messages={{
          next: '›',
          previous: '‹',
          today: new Date().toLocaleDateString('fr-FR'),
          day: 'Jour',
          week: 'Semaine',
        }}
      />
    </div>
  );
}