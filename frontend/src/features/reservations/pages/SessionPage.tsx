import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SlotButton from '../components/SlotButton';
import ReservationDialog from '../components/ReservationDialog';
import type { Slot } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterDialog, { type FilterValues } from '@/features/clubs/components/FilterDialog';

// Mock data — 24 time slots
function generateMockSlots(): Slot[] {
  const slots: Slot[] = [];
  for (let h = 6; h < 22; h++) {
    const time = `${String(h).padStart(2, '0')}:00`;
    const playerCount = Math.floor(Math.random() * 5);
    const players = Array.from({ length: playerCount }).map((_, i) => ({
      name: `Player ${i + 1}`,
    }));
    const available = playerCount < 4;
    slots.push({
      time,
      available,
      totalSlots: 4,
      players,
    });
  }
  return slots;
}

export default function SessionPage() {
  const { t } = useTranslation('reservations');
  const { courseId } = useParams();
  const [slots] = useState<Slot[]>(generateMockSlots());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    date: '',
    timeFrom: '',
    timeTo: '',
    players: '',
    holes: '',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-medium tracking-widest text-muted-foreground">
                {t('page.availableSlots')}
              </h2>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-primary text-secondary"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden md:inline">{t('search.filter')}</span>
              </Button>
            </div>
            {slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('page.noSlots')}</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {slots.map((slot) => (
                  <SlotButton key={slot.time} slot={slot} onClick={() => handleSlotClick(slot)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <ReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        courseName={courseId || 'Golf Club'}
        date=""
        slot={selectedSlot}
        pricePerPlayer={500}
      />

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        values={filters}
        onChange={setFilters}
        showHoles={false}
      />
    </div>
  );
}
