import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  const { t } = useTranslation('clubs');
  const [city, setCity] = useState('');
  const [clubName, setClubName] = useState('');

  return (
    <div className="p-4 w-full border-b-[] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4 px-4">
        {/* City */}
        <div className="relative flex-1">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t('search.city')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Club name */}
        <div className="relative flex-1">
          <UsersRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"/>
          <Input
            type="text"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder={t('search.clubName')}
            className="pl-10 border border-primary placeholder:text-secondary"
          />
        </div>

        {/* Search button */}
        <Button size="lg" className="gap-2">
          <Search size={18} />
          <span className="hidden md:inline">{t('search.button')}</span>
        </Button>
      </div>
    </div>
  );
}