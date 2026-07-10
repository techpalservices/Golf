import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '../components/SearchBar';
import ClubCard from '../components/ClubCard';
import type { Club } from '../types';

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
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
  {
    id: '4',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
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
    id: '5',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
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
    id: '6',
    name: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    description: 'Un club légendaire au cœur de la palmeraie, fondé en 1920.',
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
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main>
        <section className="border-b border-border bg-surface mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <SearchBar />
          </div>
        </section>

        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}