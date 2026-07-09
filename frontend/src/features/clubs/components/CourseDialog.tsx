import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Flag, Users } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { Course } from '../types';
import { useMediaQuery } from '@/hooks/useMediacQuery';

interface CourseDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CourseDialog({ course, open, onOpenChange }: CourseDialogProps) {
  const { t } = useTranslation('clubs');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!course) return null;

  const details = (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Flag size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('course.courseNumber')}</span>
        <span className="text-sm font-semibold text-foreground">#{course.courseNumber}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Users size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">{t('course.holes')}</span>
        <span className="text-sm font-semibold text-foreground">{course.holesCount}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <Calendar size={16} className="text-primary" />
        <span className="text-xs text-muted-foreground">Date</span>
        <span className="text-sm font-semibold text-foreground">{course.date}</span>
      </div>
      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <span className="text-xs text-muted-foreground">{t('course.currency')}</span>
        <span className="text-sm font-semibold text-primary">
          {course.price} {t('course.currency')}
        </span>
        <span className="text-xs text-muted-foreground">{t('dialog.perPlayer')}</span>
      </div>
    </div>
  );

  // ─── Desktop: centered Dialog (UNCHANGED) ───
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-4xl bg-white">
          <div className="flex flex-col md:flex-row h-full">
            <div className="relative h-56 w-full md:h-auto md:w-2/5 md:min-h-125">
              <img src={course.image} alt={course.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:bg-linear-to-b" />
            </div>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 md:max-h-[90vh]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-secondary sm:text-3xl">{course.name}</h2>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{course.location}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </div>
              <div>{details}</div>
              <div className="mt-auto">
                <Button size="lg" className="w-full">{t('dialog.reserve')}</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Mobile: bottom sheet Drawer (drag down to close) ───
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] bg-white">
        <div className="flex flex-col overflow-y-auto">
          <div className="relative h-44 w-full shrink-0">
            <img src={course.image} alt={course.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col gap-5 p-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-secondary">{course.name}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>{course.location}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </div>
            <div>{details}</div>
            <div className="mt-auto pt-2">
              <Button size="lg" className="w-full">{t('dialog.reserve')}</Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}