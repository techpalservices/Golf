import { MapPin } from 'lucide-react';
import CourseBookingRow from './CourseBookingRow';
import type { ClubAvailability, CourseAvailability, SlotAvailability } from '../types';

interface ClubBookingCardProps {
  club: ClubAvailability;
  date: string;
  onSlotSelect: (course: CourseAvailability, slot: SlotAvailability, club: ClubAvailability) => void;
}

export default function ClubBookingCard({ club, date, onSlotSelect }: ClubBookingCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
          <img src={club.logoUrl || '/teetime-logo.png'} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-serif text-lg font-bold text-secondary sm:text-xl">{club.name}</h2>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={13} className="shrink-0 text-primary" />
            <span className="truncate">{club.city}</span>
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-2 p-2.5 sm:p-3">
        {club.courses.map((course) => (
          <CourseBookingRow
            key={course.id}
            course={course}
            date={date}
            openTime={club.openTime}
            closeTime={club.closeTime}
            clubBlocked={club.blockedForPlayer}
            onSlotSelect={(selectedCourse, slot) => onSlotSelect(selectedCourse, slot, club)}
          />
        ))}
      </div>
    </section>
  );
}
