import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/features/auth/store';

export default function ProfileTab() {
  const { t } = useTranslation('app');
  const { user } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [handicap, setHandicap] = useState('');

  const isPlayer = user?.role === 'PLAYER';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('profile.profileTab.saved'));
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-20 border-2 border-primary">
          <AvatarFallback className="bg-primary/15 text-xl font-bold text-primary">
            {firstName[0] ?? '?'}
            {lastName[0] ?? ''}
          </AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline" className="border-primary text-secondary">
          <Camera size={16} />
          {t('profile.profileTab.avatar')}
        </Button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.profileTab.firstName')}</Label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.profileTab.lastName')}</Label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.profileTab.phone')}</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6 12 34 56 78"
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.profileTab.location')}</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Marrakech, Maroc"
            className="border-border"
          />
        </div>
        {isPlayer && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('profile.profileTab.handicap')}</Label>
            <Input
              value={handicap}
              onChange={(e) => setHandicap(e.target.value)}
              placeholder="12.5"
              className="border-border"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('profile.profileTab.bio')}</Label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="..."
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {t('profile.profileTab.save')}
        </Button>
      </div>
    </form>
  );
}