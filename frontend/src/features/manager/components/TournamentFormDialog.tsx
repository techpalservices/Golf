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
  location: string;
  clubName: string;
  entryFee: number;
  maxParticipants: number;
  image: string;
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
  const [location, setLocation] = useState('');
  const [clubName, setClubName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '');
      setDescription(initialData?.description ?? '');
      setDate(initialData?.date ?? '');
      setLocation(initialData?.location ?? '');
      setClubName(initialData?.clubName ?? '');
      setEntryFee(initialData ? String(initialData.entryFee) : '');
      setMaxParticipants(initialData ? String(initialData.maxParticipants) : '');
      setImage(initialData?.image ?? '');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      date,
      location,
      clubName,
      entryFee: Number(entryFee) || 0,
      maxParticipants: Number(maxParticipants) || 0,
      image: image || '/section1.png',
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

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('manageTournaments.form.date')}</Label>
          <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder={t('manageTournaments.form.datePlaceholder')} className="border-border" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('manageTournaments.form.location')}</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('manageTournaments.form.locationPlaceholder')} className="border-border" required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm text-secondary">{t('manageTournaments.form.clubName')}</Label>
        <Input value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder={t('manageTournaments.form.clubNamePlaceholder')} className="border-border" required />
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
        <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder={t('manageTournaments.form.imagePlaceholder')} className="border-border" />
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