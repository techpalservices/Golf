import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchBar from '../components/SearchBar';
import ClubCard from '../components/ClubCard';
import type { Club } from '../types';
import { ECStatus } from '../types';
import type { Course } from '@/features/courses/types.ts';

// Mock catalogue (shapes match the real Club/Course API types) until the
// club search API is wired in.
const course = (
  id: string,
  name: string,
  description: string,
  holeCount: number,
  greenFee: number,
  image: string,
): Course => ({
  id,
  name,
  description,
  holeCount,
  greenFee,
  status: ECStatus.ACTIVE,
  createdAt: '2026-07-15T00:00:00Z',
  imagesUrls: [image],
});

const club = (
  id: string,
  name: string,
  city: string,
  description: string,
  coverURL: string,
  courses: Course[],
): Club => ({
  id,
  name,
  description,
  city,
  address: city,
  phone: '',
  email: '',
  logoURL: '/teetime-logo.png',
  coverURL,
  status: ECStatus.ACTIVE,
  ownerId: null,
  ownerName: null,
  memberCount: 0,
  courseCount: courses.length,
  createdAt: '2026-07-15T00:00:00Z',
  courses,
});

const mockClubs: Club[] = [
  club('1', 'Royal Golf de Marrakech', 'Marrakech', 'Un club légendaire au cœur de la palmeraie, fondé en 1920.', '/club 1.png', [
    course('1-1', 'Parcours Massy', 'Le parcours historique 18 trous conçu par Arnaud Massy.', 18, 500, '/section1.png'),
    course('1-2', 'Parcours Palmeraie', 'Un parcours moderne traversant la palmeraie.', 9, 300, '/section2.png'),
  ]),
  club('2', "Golf d'Anfa", 'Casablanca', "Un club urbain avec une vue imprenable sur l'océan Atlantique.", '/section2.png', [
    course('2-1', 'Parcours Atlantique', "Un parcours 9 trous bordant l'océan.", 9, 300, '/section2.png'),
  ]),
  club('3', 'Golf du Palais Royal', 'Agadir', 'Un club de championnat offrant un défi technique et des vues spectaculaires.', '/club2.png', [
    course('3-1', 'Parcours Royal', "Le parcours principal 18 trous, classé parmi les meilleurs d'Afrique.", 18, 450, '/section3.png'),
    course('3-2', 'Parcours Ocean', 'Un parcours 18 trous longeant la côte.', 18, 400, '/section1.png'),
  ]),
  club('4', 'Royal Golf de Marrakech', 'Marrakech', 'Un club légendaire au cœur de la palmeraie, fondé en 1920.', '/club 1.png', [
    course('1-1', 'Parcours Massy', 'Le parcours historique 18 trous conçu par Arnaud Massy.', 18, 500, '/section1.png'),
    course('1-2', 'Parcours Palmeraie', 'Un parcours moderne traversant la palmeraie.', 9, 300, '/section2.png'),
  ]),
  club('5', 'Royal Golf de Marrakech', 'Marrakech', 'Un club légendaire au cœur de la palmeraie, fondé en 1920.', '/club 1.png', [
    course('1-1', 'Parcours Massy', 'Le parcours historique 18 trous conçu par Arnaud Massy.', 18, 500, '/section1.png'),
    course('1-2', 'Parcours Palmeraie', 'Un parcours moderne traversant la palmeraie.', 9, 300, '/section2.png'),
  ]),
  club('6', 'Royal Golf de Marrakech', 'Marrakech', 'Un club légendaire au cœur de la palmeraie, fondé en 1920.', '/club 1.png', [
    course('1-1', 'Parcours Massy', 'Le parcours historique 18 trous conçu par Arnaud Massy.', 18, 500, '/section1.png'),
    course('1-2', 'Parcours Palmeraie', 'Un parcours moderne traversant la palmeraie.', 9, 300, '/section2.png'),
  ]),
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