import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  role: 'player' | 'manager' | 'admin';
  password: string;
}

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserData) => void;
}

export default function CreateUserDialog({ open, onOpenChange, onSubmit }: CreateUserDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'player' | 'manager' | 'admin'>('player');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (open) {
      setFullName('');
      setEmail('');
      setPhone('');
      setRole('player');
      setPassword('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, email, phone, role, password });
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.fullName')}</Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t('users.createForm.fullNamePlaceholder')}
          className="border-border"
          required
        />
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('users.createForm.phonePlaceholder')}
          className="border-border"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('users.createForm.role')}</Label>
        <Select value={role} onValueChange={(v) => setRole(v as 'player' | 'manager' | 'admin')}>
          <SelectTrigger className="w-full border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">{t('users.role.player')}</SelectItem>
            <SelectItem value="manager">{t('users.role.manager')}</SelectItem>
            <SelectItem value="admin">{t('users.role.admin')}</SelectItem>
          </SelectContent>
        </Select>
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
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('users.createForm.save')}
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