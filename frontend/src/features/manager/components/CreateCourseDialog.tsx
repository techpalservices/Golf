import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Course } from '@/features/clubs/types';

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (course: Course) => void;
  nextNumber: number;
}

export default function CreateCourseDialog({ open, onOpenChange, onCreate, nextNumber }: CreateCourseDialogProps) {
  const { t } = useTranslation('app');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [holes, setHoles] = useState('18');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `new-${Date.now()}`,
      name,
      description,
      courseNumber: nextNumber,
      holesCount: Number(holes),
      date: new Date().toLocaleDateString('fr-FR'),
      price: Number(price) || 0,
      image: image || '/section1.png',
      availableTimes: [],
    };
    onCreate(newCourse);
    toast.success(t('myClub.form.created'));
    setName('');
    setDescription('');
    setHoles('18');
    setPrice('');
    setImage('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-bold text-secondary">
            {t('myClub.form.title')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('myClub.form.name')}</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('myClub.form.namePlaceholder')}
              className="border-border"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('myClub.form.description')}</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('myClub.form.descriptionPlaceholder')}
              rows={3}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-secondary">{t('myClub.form.holes')}</Label>
              <Input
                type="number"
                min="1"
                max="36"
                value={holes}
                onChange={(e) => setHoles(e.target.value)}
                className="border-border"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm text-secondary">{t('myClub.form.price')}</Label>
              <Input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="500"
                className="border-border"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm text-secondary">{t('myClub.form.image')}</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/section1.png"
              className="border-border"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              {t('myClub.form.cancel')}
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t('myClub.form.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}