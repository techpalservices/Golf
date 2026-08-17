import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/features/auth/store';
import {useActivateMfa} from "@/features/auth/hooks/useActivateMfa.ts";

export default function SecurityTab() {
  const { t } = useTranslation('app');
  const { user } = useAuthStore();

  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const activateMfa = useActivateMfa();

  const handleChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('profile.securityTab.emailChanged'));
    setNewEmail('');
    setEmailPassword('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success(t('profile.securityTab.passwordChanged'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Change email */}
      <form onSubmit={handleChangeEmail} className="flex flex-col gap-4">
        <h3 className="font-serif text-base font-bold text-secondary">
          {t('profile.securityTab.changeEmail')}
        </h3>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-muted-foreground">
            {t('profile.securityTab.currentEmail')}
          </Label>
          <span className="text-sm font-semibold text-secondary">{user?.email}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.securityTab.newEmail')}</Label>
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="nouvel@email.com"
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.securityTab.password')}</Label>
          <Input
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            className="border-border"
          />
        </div>
        <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
          {t('profile.securityTab.changeEmailBtn')}
        </Button>
      </form>

      <Separator />

      {/* Change password */}
      <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
        <h3 className="font-serif text-base font-bold text-secondary">
          {t('profile.securityTab.changePassword')}
        </h3>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">
            {t('profile.securityTab.currentPassword')}
          </Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('profile.securityTab.newPassword')}</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-border"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">
            {t('profile.securityTab.confirmPassword')}
          </Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-border"
          />
        </div>
        <Button type="submit" className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
          {t('profile.securityTab.changePasswordBtn')}
        </Button>
      </form>

      <Separator />

      {/* MFA */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-base font-bold text-secondary">
            {t('profile.securityTab.mfa')}
          </span>
          <span className="text-sm text-muted-foreground">
            {t('profile.securityTab.mfaDesc')}
          </span>
        </div>
        {!user?.isTotpEnabled
        ? (<Button
                onClick={() => activateMfa.mutate()}
                disabled={activateMfa.isPending}
                className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {activateMfa.isPending
                  ? t('profile.securityTab.mfaActivating')
                  : t('profile.securityTab.mfaActivate')}
            </Button>)
        : (<Button
                onClick={() => activateMfa.mutate()}
                disabled
                className="w-fit bg-secondary text-primary-foreground"
            >
              {
                   t('profile.securityTab.mfaEnabled')}
            </Button>)}

      </div>
    </div>
  );
}