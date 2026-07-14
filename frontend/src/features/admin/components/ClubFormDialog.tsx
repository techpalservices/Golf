import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface ClubFormData {
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  coverImage: string;
  status: 'published' | 'draft' | 'pending';
  managerId: string | null;
}

interface ManagerOption {
  id: string;
  fullName: string;
  initials: string;
}

interface ClubFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClubFormData) => void;
  initialData?: ClubFormData;
  managers: ManagerOption[];
}

export default function ClubFormDialog({ open, onOpenChange, onSubmit, initialData, managers }: ClubFormDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'pending'>('draft');
  const [managerId, setManagerId] = useState<string>('none');

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setCity(initialData?.city ?? '');
      setAddress(initialData?.address ?? '');
      setPhone(initialData?.phone ?? '');
      setEmail(initialData?.email ?? '');
      setLogo(initialData?.logo ?? '');
      setCoverImage(initialData?.coverImage ?? '');
      setStatus(initialData?.status ?? 'draft');
      setManagerId(initialData?.managerId ?? 'none');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      city,
      address,
      phone,
      email,
      logo: logo || '/teetime-logo.png',
      coverImage: coverImage || '/club 1.png',
      status,
      managerId: managerId === 'none' ? null : managerId,
    });
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('clubsManagement.form.namePlaceholder')} className="border-border" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.description')}</Label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('clubsManagement.form.descriptionPlaceholder')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.city')}</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t('clubsManagement.form.cityPlaceholder')} className="border-border" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.status')}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as 'published' | 'draft' | 'pending')}>
            <SelectTrigger className="w-full border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">{t('clubsManagement.status.published')}</SelectItem>
              <SelectItem value="draft">{t('clubsManagement.status.draft')}</SelectItem>
              <SelectItem value="pending">{t('clubsManagement.status.pending')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.address')}</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t('clubsManagement.form.addressPlaceholder')} className="border-border" required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.phone')}</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('clubsManagement.form.phonePlaceholder')} className="border-border" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.email')}</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('clubsManagement.form.emailPlaceholder')} className="border-border" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.logo')}</Label>
          <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="/teetime-logo.png" className="border-border" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('clubsManagement.form.coverImage')}</Label>
          <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/club 1.png" className="border-border" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('clubsManagement.form.manager')}</Label>
        <Select value={managerId} onValueChange={(v) => setManagerId(v ?? 'none')}>
          <SelectTrigger className="w-full border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('clubsManagement.form.noManager')}</SelectItem>
            {managers.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>
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
              {initialData ? t('clubsManagement.form.editTitle') : t('clubsManagement.form.createTitle')}
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
            {initialData ? t('clubsManagement.form.editTitle') : t('clubsManagement.form.createTitle')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{formFields}</div>
      </DrawerContent>
    </Drawer>
  );
}