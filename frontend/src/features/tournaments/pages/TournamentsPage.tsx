import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TournamentSearchBar from '../components/TournamentSearchBar';
import TournamentCard from '../components/TournamentCard';
import TournamentDialog from '../components/TournamentDialog';
import type { Tournament } from '../types';

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Open de Marrakech',
    description: 'Le tournoi annuel du Royal Golf de Marrakech, réunissant les meilleurs joueurs amateurs du Maroc. Format stroke play sur 18 trous.',
    date: '15/08/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'UPCOMING',
    image: '/section1.png',
    entryFee: 800,
    maxParticipants: 60,
    currentParticipants: 42,
  },
  {
    id: '2',
    name: "Coupe d'Anfa",
    description: "Un tournoi convivial au Golf d'Anfa, ouvert à tous les niveaux. Format Stableford sur 9 trous.",
    date: '28/07/2026',
    location: 'Casablanca',
    clubName: "Golf d'Anfa",
    status: 'ONGOING',
    image: '/section2.png',
    entryFee: 500,
    maxParticipants: 40,
    currentParticipants: 40,
  },
  {
    id: '3',
    name: 'Championnat Royal d\'Agadir',
    description: "Le championnat le plus prestigieux du Maroc, sur le parcours du Palais Royal. Réservé aux joueurs classés.",
    date: '10/09/2026',
    location: 'Agadir',
    clubName: 'Golf du Palais Royal',
    status: 'UPCOMING',
    image: '/section3.png',
    entryFee: 1200,
    maxParticipants: 80,
    currentParticipants: 15,
  },
  {
    id: '4',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '5',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '6',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '7',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '8',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '9',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
  {
    id: '10',
    name: 'Trophée Atlas',
    description: "Un tournoi annuel célébrant le golf amateur au Maroc. Format match play, élimination directe.",
    date: '20/06/2026',
    location: 'Marrakech',
    clubName: 'Royal Golf de Marrakech',
    status: 'COMPLETED',
    image: '/club 1.png',
    entryFee: 600,
    maxParticipants: 32,
    currentParticipants: 32,
  },
];

export default function TournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTournamentClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main>
        {/* Search bar */}
        <section className="border-b border-border bg-surface mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <TournamentSearchBar />
          </div>
        </section>

        {/* Tournament list */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
              {mockTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onClick={() => handleTournamentClick(tournament)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <TournamentDialog
        tournament={selectedTournament}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedTournament(null);
        }}
      />
    </div>
  );
}