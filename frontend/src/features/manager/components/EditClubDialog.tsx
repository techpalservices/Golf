import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface ClubFormData {
  name: string;
  location: string;
  description: string;
  logo: string;
  coverImage: string;
  status: 'published' | 'draft';
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
}

interface EditClubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ClubFormData;
  onSave: (data: ClubFormData) => void;
}

export default function EditClubDialog({ open, onOpenChange, initialData, onSave }: EditClubDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [form, setForm] = useState<ClubFormData>(initialData);

  useEffect(() => {
    if (open) setForm(initialData);
  }, [open, initialData]);

  const update = (key: keyof ClubFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    toast.success(t('myClub.editForm.saved'));
    onOpenChange(false);
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.name')}</Label>
        <Input value={form.name} onChange={(e) => update('name', e.target.value)} className="border-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.location')}</Label>
        <Input value={form.location} onChange={(e) => update('location', e.target.value)} className="border-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.description')}</Label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.editForm.logo')}</Label>
          <Input value={form.logo} onChange={(e) => update('logo', e.target.value)} className="border-border" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.editForm.coverImage')}</Label>
          <Input value={form.coverImage} onChange={(e) => update('coverImage', e.target.value)} className="border-border" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.status')}</Label>
        <Select value={form.status} onValueChange={(v) => v && update('status', v)}>
          <SelectTrigger className="w-full border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">{t('myClub.published')}</SelectItem>
            <SelectItem value="draft">{t('myClub.draft')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.editForm.phone')}</Label>
          <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="border-border" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.editForm.email')}</Label>
          <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="border-border" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.address')}</Label>
        <Input value={form.address} onChange={(e) => update('address', e.target.value)} className="border-border" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('myClub.editForm.mapsUrl')}</Label>
        <Input value={form.mapsUrl} onChange={(e) => update('mapsUrl', e.target.value)} className="border-border" />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-border">
          {t('myClub.editForm.cancel')}
        </Button>
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('myClub.editForm.save')}
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
              {t('myClub.editForm.title')}
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
            {t('myClub.editForm.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[80vh]">
          {formFields}
        </div>
      </DrawerContent>
    </Drawer>
  );
}