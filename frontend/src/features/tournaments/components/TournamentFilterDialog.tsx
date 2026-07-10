import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface TournamentFilterValues {
  date: string;
  location: string;
  status: string;
}

interface TournamentFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: TournamentFilterValues;
  onChange: (values: TournamentFilterValues) => void;
}

export default function TournamentFilterDialog({ open, onOpenChange, values, onChange }: TournamentFilterDialogProps) {
  const { t } = useTranslation('tournaments');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleChange = (field: keyof TournamentFilterValues, value: string | null) => {
    onChange({ ...values, [field]: value ?? '' });
  };

  const filterFields = (
    <div className="flex flex-col gap-4">
      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('search.date')}</label>
        <div className="relative">
          <Calendar size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="date"
            value={values.date}
            onChange={(e) => handleChange('date', e.target.value)}
            placeholder={t('search.datePlaceholder')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('search.location')}</label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={values.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder={t('search.locationPlaceholder')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium tracking-widest text-primary">{t('search.status')}</label>
        <Select value={values.status} onValueChange={(v) => handleChange('status', v)}>
          <SelectTrigger className="w-full border-primary text-secondary">
            <Trophy size={18} className="text-secondary" />
            <SelectValue placeholder={t('search.statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UPCOMING">{t('status.upcoming')}</SelectItem>
            <SelectItem value="ONGOING">{t('status.ongoing')}</SelectItem>
            <SelectItem value="COMPLETED">{t('status.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Apply button */}
      <Button size="lg" className="mt-2 w-full" onClick={() => onOpenChange(false)}>
        {t('search.apply')}
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white">
          <h2 className="mb-4 font-serif text-xl font-bold text-secondary">{t('search.filter')}</h2>
          {filterFields}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] bg-white">
        <div className="overflow-y-auto p-5">
          <h2 className="mb-4 font-serif text-xl font-bold text-secondary">{t('search.filter')}</h2>
          {filterFields}
        </div>
      </DrawerContent>
    </Drawer>
  );
}