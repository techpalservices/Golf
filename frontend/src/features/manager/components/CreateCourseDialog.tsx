import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {useCreateCourse} from "@/features/manager/hooks/useCreateCourse.ts";

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: string;
}

export default function CreateCourseDialog({ open, onOpenChange, clubId }: CreateCourseDialogProps) {
  const { t } = useTranslation('app');
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [holeCount, setHoleCount] = useState(8);
  const [greenFee, setGreenFee] = useState(0);
  const [images, setImages] = useState<Array<File>>([]);
  const [imageUrlCount, setImageUrlCount] = useState(0);

  const createCourse = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('holeCount', String(holeCount));
    formData.append('greenFee', String(greenFee));
    formData.append('description', description);

    // Append each file to FormData under 'imagesUrls' to match CreateCourseRequest.java
    images.forEach((file) => {
      formData.append('imagesUrls', file);
    });
    formData.append('clubId', clubId);

    createCourse.mutate(
        formData as any, // Cast to any if TypeScript complains about FormData vs DTO
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
    );
  };

  // Shared form body — used by both Dialog and Drawer
  const formBody = (
      <div className="flex flex-col gap-3">
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
          <Label className="text-sm text-secondary">{t('myClub.form.holeCount')}</Label>
          <Select value={String(holeCount)} onValueChange={(v) => {
            const num = Number(v);
            if (!isNaN(num)) setHoleCount(num);
          }}>
            <SelectTrigger size="sm" className="w-full border-border">
              <SelectValue>{holeCount}</SelectValue>
           </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
           </SelectContent>
         </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.form.greenFee')}</Label>
          <Input
              required
              type="number"
              value={greenFee}
              min="0"
              onChange={(e) => setGreenFee(Number(e.target.value))}
              placeholder={t('myClub.form.greenFeePlaceholder')}
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
        <div className="flex flex-col gap-1.5">
          <Label className="text-sm text-secondary">{t('myClub.form.image')}</Label>
          <div className="flex flex-row gap-2">
            <Input
                type="file"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                className="border-border"
            />
            {/* type="button" prevents form submission when clicking + */}
            <Button
                type="button"
                className="bg-secondary w-8"
                onClick={() => setImageUrlCount(imageUrlCount + 1)}
            >
              +
            </Button>
          </div>
        </div>
        {Array.from({ length: imageUrlCount }, (_, i) => (
            <div key={i} className="flex flex-row gap-2">
              <Input
                  type="file"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                  className="border-border"
              />
              <Button
                  type="button"
                  className="bg-red-500 w-8"
                  onClick={() => setImageUrlCount(imageUrlCount - 1)}
              >
                -
              </Button>
            </div>
        ))}
      </div>
  );

  // Shared footer buttons — used by both Dialog and Drawer
  const formFooter = (
      <div className="flex gap-2 h-12">
        <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
        >
          {t('myClub.form.cancel')}
        </Button>
        <Button
            type="submit"
            form="create-course-form"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {t('myClub.form.create')}
        </Button>
      </div>
  );

  // Desktop: centered Dialog (matches the fixed-header / scrollable-form / fixed-footer layout)
  if (isDesktop) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md bg-surface max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-5">
              <DialogTitle className="font-serif text-lg font-bold text-secondary">
                {t('myClub.form.title')}
              </DialogTitle>
            </DialogHeader>
            <form
                id="create-course-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 overflow-y-auto flex-1 px-6 pb-6"
            >
              {formBody}
            </form>
            <DialogFooter className="gap-2 px-6 py-3 border-t">
              {formFooter}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    );
  }

  // Mobile: bottom Drawer (exact same pattern as UsersPage.tsx lines 341-352)
  return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] bg-surface">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-lg font-bold text-secondary">
              {t('myClub.form.title')}
            </DrawerTitle>
          </DrawerHeader>
          <form
              id="create-course-form"
              onSubmit={handleSubmit}
              className="overflow-y-auto px-4 pb-4 max-h-[65vh]"
          >
            {formBody}
          </form>
          <DrawerFooter className="px-4 pb-6">
            {formFooter}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  );
}