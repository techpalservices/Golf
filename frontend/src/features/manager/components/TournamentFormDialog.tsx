import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export interface TournamentFormData {
  name: string;
  description: string;
  date: string;
  entryFee: number;
  maxParticipants: number;
  imageUrl?: string;
  imageFile?: File;
}

interface TournamentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TournamentFormData) => void;
  initialData?: TournamentFormData;
}

export default function TournamentFormDialog({ open, onOpenChange, onSubmit, initialData }: TournamentFormDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setDate(initialData?.date ?? '');
      setEntryFee(initialData ? String(initialData.entryFee) : '');
      setMaxParticipants(initialData ? String(initialData.maxParticipants) : '');
      setImagePreview(initialData?.imageUrl ?? '');
      setImageFile(null);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      date,
      entryFee: Number(entryFee) || 0,
      maxParticipants: Number(maxParticipants) || 0,
      imageUrl: imagePreview || '/section1.png',
      imageFile: imageFile || undefined,
    });
  };

  const formFields = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('manageTournaments.form.name')}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('manageTournaments.form.namePlaceholder')} className="border-border" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('manageTournaments.form.description')}</Label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('manageTournaments.form.descriptionPlaceholder')} rows={3} className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('manageTournaments.form.date')}</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-border" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('manageTournaments.form.entryFee')}</Label>
          <Input type="number" min="0" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="800" className="border-border" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('manageTournaments.form.maxParticipants')}</Label>
          <Input type="number" min="1" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} placeholder="60" className="border-border" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('manageTournaments.form.image')}</Label>
        <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="border-border" />
        {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 h-32 w-full object-cover rounded"/>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1 border-border" onClick={() => onOpenChange(false)}>
          {t('manageTournaments.form.cancel')}
        </Button>
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {t('manageTournaments.form.save')}
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
              {initialData ? t('manageTournaments.form.editTitle') : t('manageTournaments.form.createTitle')}
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
            {initialData ? t('manageTournaments.form.editTitle') : t('manageTournaments.form.createTitle')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 max-h-[75vh]">{formFields}</div>
      </DrawerContent>
    </Drawer>
  );
}