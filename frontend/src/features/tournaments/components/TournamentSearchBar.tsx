import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TournamentFilterDialog, { type TournamentFilterValues } from './TournamentFilterDialog';

export default function TournamentSearchBar() {
  const { t } = useTranslation('tournaments');
  const [name, setName] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<TournamentFilterValues>({
    date: '',
    location: '',
    status: '',
  });

  return (
    <div className="p-4 w-full md:p-6">
      <div className="flex flex-row justify-between">
        {/* Search input */}
        <div className="flex flex-row gap-1 md:gap-4">
          <div className="relative flex-1 w-5 md:w-full">
            <Trophy size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('search.namePlaceholder')}
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

      <TournamentFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        values={filters}
        onChange={setFilters}
      />
    </div>
  );
}   