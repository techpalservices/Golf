import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type {CreateManager} from "@/features/manager/types.ts";
import {useCreateManager} from "@/features/admin/hooks/useCreateManager.ts";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateManager) => void;
}

export default function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { t } = useTranslation('app');
  const createManager = useCreateManager();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open) {
      setFirstName('');
      setLastName('');
      setGender('');
      setEmail('');
      setPhoneNumber('');
      setUsername('');
      setPassword('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createManager.mutate({ firstName, lastName, gender, email, phoneNumber, username, password },
        {
          onSuccess: () => {
            onOpenChange(false); // close dialog
          },
        }
        );
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.fullName')}</Label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t('users.createForm.fullNamePlaceholder')}
          className="border-border"
          required
        />
        <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('users.createForm.fullNamePlaceholder')}
            className="border-border"
            required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.role')}</Label>
        <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female' | 'other')}>
          <SelectTrigger className="w-full border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">{t('users.gender.male')}</SelectItem>
            <SelectItem value="FEMALE">{t('users.gender.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.email')}</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('users.createForm.emailPlaceholder')}
          className="border-border"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.phone')}</Label>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder={t('users.createForm.phonePlaceholder')}
          className="border-border"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.password')}</Label>
        <Input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('users.createForm.usernamePlaceholder')}
            className="border-border"
            required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.password')}</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('users.createForm.passwordPlaceholder')}
          className="border-border"
          required
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 border-border" onClick={() => onOpenChange(false)}>
          {t('users.createForm.cancel')}
        </Button>
        <Button type="submit" disabled={createManager.isPending} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {createManager.isPending ? 'Saving...' : t('users.createForm.save')}
        </Button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-surface max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-secondary">
              {t('users.createForm.title')}
            </DialogTitle>
          </DialogHeader>
          {formFields}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] bg-surface">
        <DrawerHeader>
          <DrawerTitle className="font-serif text-lg font-bold text-secondary">
            {t('users.createForm.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{formFields}</div>
      </DrawerContent>
    </Drawer>
  );
}