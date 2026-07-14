import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface OfferFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  benefits: string[];
}

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OfferFormData) => void;
  initialData?: OfferFormData;
}

export default function OfferFormDialog({ open, onOpenChange, onSubmit, initialData }: OfferFormDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [benefits, setBenefits] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setPrice(initialData ? String(initialData.price) : '');
      setDuration(initialData ? String(initialData.duration) : '');
      setBenefits(initialData?.benefits.join('\n') ?? '');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      price: Number(price) || 0,
      duration: Number(duration) || 1,
      benefits: benefits.split('\n').map((b) => b.trim()).filter(Boolean),
    });
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('members.offer.form.name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('members.offer.form.namePlaceholder')} className="border-border" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('members.offer.form.description')}</Label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('members.offer.form.descriptionPlaceholder')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('members.offer.form.price')}</Label>
          <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12000" className="border-border" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('members.offer.form.duration')}</Label>
          <Input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="12" className="border-border" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('members.offer.form.benefits')}</Label>
        <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder={t('members.offer.form.benefitsPlaceholder')} rows={4} className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 border-border" onClick={() => onOpenChange(false)}>
          {t('members.offer.form.cancel')}
        </Button>
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('members.offer.form.save')}
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
              {initialData ? t('members.offer.form.editTitle') : t('members.offer.form.title')}
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
            {initialData ? t('members.offer.form.editTitle') : t('members.offer.form.title')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{formFields}</div>
      </DrawerContent>
    </Drawer>
  );
}