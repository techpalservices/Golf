import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {useDataManagers} from "@/features/admin/hooks/useDataManagers.ts";
import {useCreateClub} from "@/features/admin/hooks/useCreateClub.ts";
import type {ManagerListProps} from "@/features/manager/types.ts";

interface ClubFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClubFormDialog({ open, onOpenChange }: ClubFormDialogProps) {
  const { t } = useTranslation('app');
  const { data } = useDataManagers();
  const createClub = useCreateClub();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [ddNSNumber, setDdNSNumber] = useState(11111);
  const [ddEWNumber, setDdEWNumber] = useState(34432522);
  const [ownerId, setOwnerId] = useState('');

  const managers : ManagerListProps[] = data || [];

  useEffect(() => {
    if (open) {
      setName('');
      setCity('');
      setAddress('');
      setDdEWNumber(34432522);
      setDdNSNumber(11111);
      setOwnerId('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClub.mutate(
        {
          name,
          city,
          address,
          ddEWNumber,
          ddNSNumber,
          ownerId: ownerId && ownerId !== 'none' ? ownerId : undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false); // close dialog
          },
        }
    )
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('clubsManagement.form.namePlaceholder')} className="border-border" required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.city')}</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('clubsManagement.form.cityPlaceholder')} className="border-border" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.address')}</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('clubsManagement.form.addressPlaceholder')} className="border-border" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.owner')}</Label>
        <Select value={ownerId} onValueChange={(v) => setOwnerId(v ?? 'none')}>
          <SelectTrigger className="w-full border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('clubsManagement.form.noOwner')}</SelectItem>
            {managers.map((m: ManagerListProps) => (
              <SelectItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 border-border" onClick={() => onOpenChange(false)}>
          {t('clubsManagement.form.cancel')}
        </Button>
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('clubsManagement.form.save')}
        </Button>
      </div>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-surface max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-bold text-secondary">
              {t('clubsManagement.form.createTitle')}
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
            {t('clubsManagement.form.createTitle')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{formFields}</div>
      </DrawerContent>
    </Drawer>
  );
}