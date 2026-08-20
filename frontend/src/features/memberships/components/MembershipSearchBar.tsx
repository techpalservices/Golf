import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Building2, DollarSign, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { EMStatus } from '../types';

const EM_STATUSES: { value: Exclude<EMStatus, '' | null>; label: string }[] = [
  { value: 'ACTIVE',    label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

interface MembershipSearchBarProps {
  onFiltersChange: (filters: {
    title: string;
    clubName: string;
    price: number | null;
    status: EMStatus;
  }) => void;
}

export default function MembershipSearchBar({ onFiltersChange }: MembershipSearchBarProps) {
  const { t } = useTranslation('memberships');

  const [title, setTitle]         = useState('');
  const [clubName, setClubName]   = useState('');
  const [price, setPrice]         = useState('');
  const [status, setStatus]       = useState<Exclude<EMStatus, '' | null> | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fire debounced request whenever any filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFiltersChange({
        title,
        clubName,
        price: price !== '' && Number(price) > 0 ? Number(price) : null,
        status: status ?? null,
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, clubName, price, status]);

  const toggleStatus = (val: Exclude<EMStatus, '' | null>) => {
    setStatus((prev) => (prev === val ? null : val));
  };

  return (
    <div className="p-4 w-full md:p-6 flex flex-col gap-4">
      {/* Row 1: text inputs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Title */}
        <div className="relative">
          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('search.offerNamePlaceholder', 'Offer name...')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Club name */}
        <div className="relative">
          <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder={t('search.clubNamePlaceholder', 'Club name...')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Max price */}
        <div className="relative">
          <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t('search.pricePlaceholder', 'Max price (MAD)...')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>
      </div>

      {/* Row 2: status multiselect chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium tracking-widest text-secondary">
          {t('search.status', 'Status')}:
        </span>
        {EM_STATUSES.map(({ value, label }) => {
          const active = status === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleStatus(value)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {active && <Check size={12} />}
              {label}
            </button>
          );
        })}
        {status && (
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="text-xs text-muted-foreground underline hover:text-primary"
          >
            {t('search.clearStatus', 'Clear')}
          </button>
        )}
      </div>
    </div>
  );
}