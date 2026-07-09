import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation('clubs');

  return (
    <Card className="overflow-hidden p-0 rounded-sm md:h-full">
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="w-full">
            <img
                src={course.image}
                alt={course.name}
                className="h-48 w-full object-cover md:h-52"
            />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
          <h3 className="font-serif text-xl font-bold text-secondary md:text-2xl">
            {course.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} />
            <span>{course.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{t('course.courseNumber')} #{course.courseNumber}</span>
            <Separator orientation="vertical" className="h-3" />
            <span>{course.holesCount} {t('course.holes')}</span>
          </div>

          <p className="font-semibold text-primary font-serif text-xl md:text-2xl">
            {course.price} {t('course.currency')}
            <span className="text-sm font-normal text-muted-foreground"> / {t('course.perPlayer')}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}