import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, UsersRound, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterDialog, { type FilterValues } from './FilterDialog';

export default function SearchBar() {
  const { t } = useTranslation('clubs');
  const [city, setCity] = useState('');
  const [clubName, setClubName] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    date: '',
    timeFrom: '',
    timeTo: '',
    players: '',
    holes: '',
  });

  return (
    <div className="p-4 w-full border-b-[] md:p-6">
      <div className="flex flex-row justify-between">
        {/* City + Club name */}
        <div className="flex flex-row gap-1 md:gap-4">
            <div className="relative flex-1 w-5 md:w-full">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('search.cityPlaceholder')}
                    className="pl-10 border border-primary placeholder:text-secondary"
                />
            </div>

            <div className="relative flex-1">
                <UsersRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"/>
                <Input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder={t('search.clubNamePlaceholder')}
                    className="pl-10 border border-primary placeholder:text-secondary"
                />
            </div>
        </div>

        {/* Filter + Search buttons */}
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-primary text-secondary"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden md:inline">{t('search.filter')}</span>
          </Button>

          <Button size="lg" className="gap-2">
            <Search size={18} />
            <span className="hidden md:inline">{t('search.button')}</span>
          </Button>
        </div>
      </div>

      {/* Filter popup */}
      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        values={filters}
        onChange={setFilters}
      />
    </div>
  );
}