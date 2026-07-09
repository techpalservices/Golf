import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '../components/SearchBar';
import CourseCard from '../components/CourseCard';
import type { Course } from '../types';

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un parcours légendaire au cœur de la palmeraie, conçu par Arnaud Massy en 1920.',
    courseNumber: 3,
    holesCount: 18,
    date: '15/07/2026',
    price: 500,
    image: '/club 1.png',
    availableTimes: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
  },
  {
    id: '2',
    name: "Golf d'Anfa",
    location: 'Casablanca',
    description: "Un parcours urbain de 9 trous avec une vue imprenable sur l'océan Atlantique.",
    courseNumber: 7,
    holesCount: 9,
    date: '16/07/2026',
    price: 300,
    image: '/section2.png',
    availableTimes: ['07:00', '08:00', '09:00'],
  },
  {
    id: '3',
    name: 'Golf du Palais Royal',
    location: 'Agadir',
    description: "Un parcours de championnat bordant l'océan, offrant un défi technique et des vues spectaculaires.",
    courseNumber: 12,
    holesCount: 18,
    date: '17/07/2026',
    price: 450,
    image: '/club2.png',
    availableTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  },
  {
    id: '3',
    name: 'Golf du Palais Royal',
    location: 'Agadir',
    description: "Un parcours de championnat bordant l'océan, offrant un défi technique et des vues spectaculaires.",
    courseNumber: 12,
    holesCount: 18,
    date: '17/07/2026',
    price: 450,
    image: '/club2.png',
    availableTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  },
  {
    id: '3',
    name: 'Golf du Palais Royal',
    location: 'Agadir',
    description: "Un parcours de championnat bordant l'océan, offrant un défi technique et des vues spectaculaires.",
    courseNumber: 12,
    holesCount: 18,
    date: '17/07/2026',
    price: 450,
    image: '/club2.png',
    availableTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
  },
];

export default function SearchPage() {

  return (
    <div className="min-h-screen bg-background">
      <Header transparent/>

      <main>
        {/* Search bar section */}
        <section className="border-b border-border bg-surface mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <SearchBar />
          </div>
        </section>

        {/* Course list */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}