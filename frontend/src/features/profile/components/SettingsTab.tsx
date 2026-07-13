import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useThemeStore } from '@/store/theme.store';

export default function SettingsTab() {
  const { t, i18n } = useTranslation('app');
  const { theme, toggleTheme } = useThemeStore();

  const [notifPrefs, setNotifPrefs] = useState({
    reservations: { email: true, push: true, sms: false },
    tournaments: { email: true, push: false, sms: false },
    promotions: { email: false, push: false, sms: false },
  });

  const categories: { key: keyof typeof notifPrefs; label: string }[] = [
    { key: 'reservations', label: t('profile.settingsTab.reservations') },
    { key: 'tournaments', label: t('profile.settingsTab.tournaments') },
    { key: 'promotions', label: t('profile.settingsTab.promotions') },
  ];

  const channels: { key: 'email' | 'push' | 'sms'; label: string }[] = [
    { key: 'email', label: t('profile.settingsTab.email') },
    { key: 'push', label: t('profile.settingsTab.push') },
    { key: 'sms', label: t('profile.settingsTab.sms') },
  ];

  const toggleNotif = (cat: keyof typeof notifPrefs, channel: 'email' | 'push' | 'sms') => {
    setNotifPrefs((prev) => ({
      ...prev,
      [cat]: { ...prev[cat], [channel]: !prev[cat][channel] },
    }));
  };

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.changeLanguage(value);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* System */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-base font-bold text-secondary">
          {t('profile.settingsTab.system')}
        </h3>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-secondary">{t('profile.settingsTab.language')}</span>
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-secondary">{t('profile.settingsTab.theme')}</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-secondary transition-colors hover:bg-muted"
          >
            {theme === 'light' ? <Sun size={16} className="text-primary" /> : <Moon size={16} className="text-primary" />}
            {theme === 'light' ? t('profile.settingsTab.light') : t('profile.settingsTab.dark')}
          </button>
        </div>
      </div>

      <Separator />

      {/* Notifications */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif text-base font-bold text-secondary">
          {t('profile.settingsTab.notifications')}
        </h3>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
            >
              <span className="text-sm font-medium text-secondary">{cat.label}</span>
              <div className="flex items-center gap-4">
                {channels.map((ch) => (
                  <label key={ch.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Switch
                      size="sm"
                      checked={notifPrefs[cat.key][ch.key]}
                      onCheckedChange={() => toggleNotif(cat.key, ch.key)}
                    />
                    {ch.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}