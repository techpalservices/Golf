import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TournamentFilterValues } from '../types';

interface TournamentSearchBarProps {
  name: string;
  onNameChange: (value: string) => void;
  filters: TournamentFilterValues;
  onFiltersChange: (values: TournamentFilterValues) => void;
}

export default function TournamentSearchBar({ name, onNameChange, filters, onFiltersChange }: TournamentSearchBarProps) {
  const { t } = useTranslation('tournaments');

  const handleChange = (field: keyof TournamentFilterValues, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="p-4 w-full md:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Name */}
        <div className="relative">
          <Trophy size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t('search.namePlaceholder')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder={t('search.locationPlaceholder')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
            placeholder={t('search.datePlaceholder')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Status */}
        <Select value={filters.status || undefined} onValueChange={(v) => handleChange('status', v ?? '')}>
          <SelectTrigger className="w-full border-primary text-secondary">
            <Trophy size={18} className="text-secondary" />
            {/* Base UI's SelectValue renders the raw value — render the label explicitly */}
            <SelectValue>
              {filters.status
                ? t(`status.${filters.status.toLowerCase()}`)
                : t('search.statusPlaceholder')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('search.statusPlaceholder')}</SelectItem>
            <SelectItem value="PENDING">{t('status.pending')}</SelectItem>
            <SelectItem value="ACTIVE">{t('status.active')}</SelectItem>
            <SelectItem value="COMPLETED">{t('status.completed')}</SelectItem>
            <SelectItem value="CANCELED">{t('status.canceled')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}   