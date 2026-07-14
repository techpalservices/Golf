import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, MapPinned, Calendar, BadgeCheck, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CourseCard from '@/features/clubs/components/CourseCard';
import CourseDialog from '@/features/clubs/components/CourseDialog';
import CreateCourseDialog from '../components/CreateCourseDialog';
import type { Course } from '@/features/clubs/types';
import { Pencil } from 'lucide-react';
import EditClubDialog, { type ClubFormData } from '../components/EditClubDialog';

interface ClubData {
  id: string;
  name: string;
  location: string;
  description: string;
  logo: string;
  coverImage: string;
  status: 'published' | 'draft';
  createdAt: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  courses: Course[];
}

const mockClub: ClubData = {
  id: '1',
  name: 'Royal Golf de Marrakech',
  location: 'Marrakech, Maroc',
  description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
  logo: '/teetime-logo.png',
  coverImage: '/club 1.png',
  status: 'published',
  createdAt: '15/03/2020',
  phone: '+212 5 24 32 50 50',
  email: 'contact@royalgolf.ma',
  address: 'Route de l\'Ourika, Marrakech 40000',
  mapsUrl: 'https://maps.google.com/?q=Royal+Golf+de+Marrakech',
  courses: [
    {
      id: '1-1',
      name: 'Parcours Massy',
      description: 'Le parcours historique 18 trous conçu par Arnaud Massy.',
      courseNumber: 1,
      holesCount: 18,
      date: '15/07/2026',
      price: 500,
      image: '/section1.png',
      availableTimes: ['07:00', '08:00', '09:00'],
    },
    {
      id: '1-2',
      name: 'Parcours Palmeraie',
      description: 'Un parcours moderne traversant la palmeraie.',
      courseNumber: 2,
      holesCount: 9,
      date: '15/07/2026',
      price: 300,
      image: '/section2.png',
      availableTimes: ['07:00', '08:00'],
    },
  ],
};

export default function MyClubPage() {
  const { t } = useTranslation('app');
  const [courses, setCourses] = useState<Course[]>(mockClub.courses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [club, setClub] = useState(mockClub);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCourseDialogOpen(true);
  };

  const handleCreate = (course: Course) => {
    setCourses((prev) => [...prev, course]);
    setCreateOpen(false);
  };

  const handleEditSave = (data: ClubFormData) => {
    setClub((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header — cover + logo */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="relative h-32 w-full md:h-48">
          <img src={mockClub.coverImage} alt={mockClub.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col items-center gap-2 px-6 pb-6 md:items-start">
          <img
            src={mockClub.logo}
            alt={mockClub.name}
            className="h-24 w-24 -translate-y-12 rounded-full border-4 border-background object-cover bg-background md:h-32 md:w-32"
          />
          <div className="-mt-8 flex flex-col items-center gap-2 text-center md:items-start">
            <h1 className="font-serif text-2xl font-bold text-secondary md:text-3xl">{mockClub.name}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              <span>{mockClub.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: courses (left) + club info (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Courses */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-secondary">{t('myClub.courses')}</h2>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">{t('myClub.createCourse')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onClick={() => handleCourseClick(course)} />
            ))}
          </div>
        </div>

        {/* Club info sidebar */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-secondary">{t('myClub.clubInfo')}</h3>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-primary text-primary hover:bg-primary/10"
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={14} />
                <span className="hidden sm:inline">{t('myClub.editClub')}</span>
              </Button>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('myClub.status')}</span>
              <Badge
                className={
                  mockClub.status === 'published'
                    ? 'border border-secondary bg-secondary/15 text-xs text-secondary'
                    : 'border border-border bg-muted text-xs text-muted-foreground'
                }
              >
                <BadgeCheck size={12} className="mr-1" />
                {t(`myClub.${mockClub.status}`)}
              </Badge>
            </div>

            <Separator />

            {/* Creation date */}
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{t('myClub.createdAt')}</span>
                <span className="text-sm font-medium text-secondary">{mockClub.createdAt}</span>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium tracking-widest text-primary">{t('myClub.contact')}</span>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                <span className="text-sm text-secondary">{mockClub.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span className="text-sm text-secondary break-all">{mockClub.email}</span>
              </div>
            </div>

            <Separator />

            {/* Address + Maps */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium tracking-widest text-primary">{t('myClub.address')}</span>
              <div className="flex items-start gap-3">
                <MapPinned size={16} className="mt-0.5 text-primary" />
                <span className="text-sm text-secondary">{mockClub.address}</span>
              </div>
              <a
                href={mockClub.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <MapPinned size={14} />
                {t('myClub.viewMap')}
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CourseDialog
        course={selectedCourse}
        open={courseDialogOpen}
        onOpenChange={(open) => {
          setCourseDialogOpen(open);
          if (!open) setSelectedCourse(null);
        }}
      />

      <CreateCourseDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        nextNumber={courses.length + 1}
      />

      <EditClubDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={{
          name: club.name,
          location: club.location,
          description: club.description,
          logo: club.logo,
          coverImage: club.coverImage,
          status: club.status,
          phone: club.phone,
          email: club.email,
          address: club.address,
          mapsUrl: club.mapsUrl,
        }}
        onSave={handleEditSave}
      />
    </div>
  );
}