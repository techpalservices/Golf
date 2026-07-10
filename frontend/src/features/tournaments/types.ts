export type TournamentStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  clubName: string;
  status: TournamentStatus;
  image: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
}

export interface TournamentFilterValues {
  date: string;
  location: string;
  status: string;
}