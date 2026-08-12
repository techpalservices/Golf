import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Flag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CourseCard from '../../courses/components/CourseCard.tsx';
import CourseDialog from '../../courses/components/CourseDialog.tsx';
import type { Club, Course } from '../types';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterDialog, { type FilterValues } from '../components/FilterDialog';

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920. Profitez de deux parcours d\'exception dans un cadre verdoyant.',
    logo: '/teetime-logo.png',
    coverImage: '/club 1.png',
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
        availableTimes: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
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
        availableTimes: ['07:00', '08:00', '09:00'],
      },
    ],
  },
  {
    id: '2',
    name: "Golf d'Anfa",
    location: 'Casablanca',
    description: "Un club urbain avec une vue imprenable sur l'océan Atlantique.",
    logo: '/teetime-logo.png',
    coverImage: '/section2.png',
    courses: [
      {
        id: '2-1',
        name: "Parcours Atlantique",
        description: "Un parcours 9 trous bordant l'océan.",
        courseNumber: 1,
        holesCount: 9,
        date: '16/07/2026',
        price: 300,
        image: '/section2.png',
        availableTimes: ['07:00', '08:00', '09:00'],
      },
    ],
  },
  {
    id: '3',
    name: 'Golf du Palais Royal',
    location: 'Agadir',
    description: "Un club de championnat offrant un défi technique et des vues spectaculaires.",
    logo: '/teetime-logo.png',
    coverImage: '/club2.png',
    courses: [
      {
        id: '3-1',
        name: 'Parcours Royal',
        description: "Le parcours principal 18 trous, classé parmi les meilleurs d'Afrique.",
        courseNumber: 1,
        holesCount: 18,
        date: '17/07/2026',
        price: 450,
        image: '/section3.png',
        availableTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
      },
      {
        id: '3-2',
        name: 'Parcours Ocean',
        description: "Un parcours 18 trous longeant la côte.",
        courseNumber: 2,
        holesCount: 18,
        date: '17/07/2026',
        price: 400,
        image: '/section1.png',
        availableTimes: ['06:00', '07:00', '08:00', '09:00'],
      },
    ],
  },
];

export default function ClubDetailPage() {
  const { t } = useTranslation('clubs');
  const { clubId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const club = mockClubs.find((c) => c.id === clubId);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    date: '',
    timeFrom: '',
    timeTo: '',
    players: '',
    holes: '',
 });

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 text-center">
          <p className="text-muted-foreground">Club not found</p>
        </div>
      </div>
    );
  }

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main className="pt-20">

        {/* Club header — LinkedIn style: cover banner + logo on left */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              {/* Cover image — full width banner */}
              <div className="relative h-32 w-full md:h-48">
                <img
                  src={club.coverImage}
                  alt={club.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Logo + info — logo on left, overlapping cover */}
              <div className="flex flex-col items-center md:items-start gap-2 px-6 pb-6">
                <img
                    src={club.logo}
                    alt={club.name}
                    className="h-24 w-24 -translate-y-12 rounded-full border-4 border-background object-cover bg-background md:h-35 md:w-35"
                />
                <div className="-mt-8 flex flex-col items-center md:items-start gap-2 text-center">
                    <h1 className="font-serif text-2xl font-bold text-secondary md:text-3xl">
                        {club.name}
                    </h1>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={14} />
                        <span>{club.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Flag size={12} className="text-primary" />
                        <span>{club.courses.length} {t('club.courses')}</span>
                    </div>
                </div>
               </div>
            </div>

            {/* Description — below the header card */}
            <div className="mt-6">
              <p className="text-base text-muted-foreground">{club.description}</p>
            </div>
          </div>
        </section>

        {/* Courses list */}
        <section className="border-t border-border py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-secondary">
                    {t('club.courses')}
                </h2>
                <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-primary text-secondary"
                    onClick={() => setFilterOpen(true)}
                >
                    <SlidersHorizontal size={18} />
                    <span className="hidden md:inline">{t('search.filter')}</span>
                </Button>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
              {club.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CourseDialog
        course={selectedCourse}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedCourse(null);
        }}
      />

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        values={filters}
        onChange={setFilters}
        showHoles
      />
    </div>
  );
}