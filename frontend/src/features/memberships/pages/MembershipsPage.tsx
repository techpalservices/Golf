import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MembershipSearchBar from '../components/MembershipSearchBar';
import MembershipItem from '../components/MembershipItem';
import MembershipDialog from '../components/MembershipDialog';
import type { Membership } from '../types';

const mockMemberships: Membership[] = [
  {
    id: '1',
    offerName: 'Pass Découverte',
    clubName: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    type: 'MONTHLY',
    price: 1200,
    description: 'Une offre idéale pour découvrir le golf à Marrakech. Accès au parcours 9 trous, initiation et matériel inclus.',
    benefits: [
      'Accès au parcours 9 trous',
      '1 heure de practice par semaine',
      'Matériel inclus',
      'Accès au restaurant du club',
    ],
    duration: '1 mois',
  },
  {
    id: '2',
    offerName: 'Pass Premium',
    clubName: 'Royal Golf de Marrakech',
    location: 'Marrakech',
    type: 'YEARLY',
    price: 12000,
    description: 'L\'offre complète pour les golfeurs réguliers. Accès illimité aux deux parcours et avantages exclusifs.',
    benefits: [
      'Accès illimité aux 18 trous',
      'Practice illimité',
      'Casier personnel',
      'Invité gratuit 2x par mois',
      'Réduction 15% sur le restaurant',
    ],
    duration: '12 mois',
  },
  {
    id: '3',
    offerName: 'Pass Anfa',
    clubName: "Golf d'Anfa",
    location: 'Casablanca',
    type: 'MONTHLY',
    price: 800,
    description: 'Une adhésion mensuelle au Golf d\'Anfa, parfait pour les urbains souhaitant jouer régulièrement.',
    benefits: [
      'Accès au parcours 9 trous',
      'Practice illimité en semaine',
      'Casier partagé',
    ],
    duration: '1 mois',
  },
  {
    id: '4',
    offerName: 'Pass Royal VIP',
    clubName: 'Golf du Palais Royal',
    location: 'Agadir',
    type: 'VIP',
    price: 25000,
    description: 'L\'expérience ultime au Golf du Palais Royal. Accès prioritaire, services premium et événements exclusifs.',
    benefits: [
      'Accès prioritaire aux deux parcours 18 trous',
      'Practice illimité 7j/7',
      'Casier VIP personnalisé',
      'Invités illimités',
      'Accès aux événements privés du club',
      'Voiturier inclus',
      'Réduction 20% sur le pro-shop',
    ],
    duration: '12 mois',
  },
  {
    id: '5',
    offerName: 'Pass Atlantique',
    clubName: "Golf d'Anfa",
    location: 'Casablanca',
    type: 'YEARLY',
    price: 8000,
    description: 'Une adhésion annuelle au Golf d\'Anfa avec accès complet et avantages.',
    benefits: [
      'Accès illimité au parcours 9 trous',
      'Practice illimité',
      'Casier personnel',
      'Invité gratuit 1x par mois',
    ],
    duration: '12 mois',
  },
];

export default function MembershipsPage() {
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMembershipClick = (membership: Membership) => {
    setSelectedMembership(membership);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header transparent />

      <main>
        {/* Search bar */}
        <section className="border-b border-border bg-surface mt-20">
          <div className="mx-auto max-w-7xl px-6">
            <MembershipSearchBar />
          </div>
        </section>

        {/* List */}
        <section className="py-8">
          <div className="mx-auto w-full px-6">
            <div className="flex flex-col gap-3">
              {mockMemberships.map((membership) => (
                <MembershipItem
                  key={membership.id}
                  membership={membership}
                  onClick={() => handleMembershipClick(membership)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MembershipDialog
        membership={selectedMembership}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedMembership(null);
        }}
      />
    </div>
  );
}