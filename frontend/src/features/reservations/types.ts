export interface SlotPlayer {
  avatar?: string;
  name: string;
}

export interface Slot {
  time: string;
  available: boolean;
  totalSlots: number;
  players: SlotPlayer[];
}

export interface ReservationSummary {
  courseName: string;
  date: string;
  time: string;
  slotCount: number;
  pricePerPlayer: number;
  total: number;
}

// ─── Availability (from POST /time-slots/search) ───

export interface SlotAvailability {
  id: string;
  startTime: string; // ISO LocalDateTime
  endTime: string;
  bookedPlayers: number; // PENDING + ACCEPTED reservations
}

export interface CourseAvailability {
  id: string;
  name: string;
  holeCount: number;
  greenFee: number;
  description: string;
  imagesUrl: string[];
  timeSlots: SlotAvailability[];
}

export interface ClubAvailability {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  openTime: string; // HH:mm:ss
  closeTime: string;
  blockedForPlayer: boolean; // true → player already booked at this club on this date, whole club is blocked
  courses: CourseAvailability[];
}

export interface SearchTimeSlots {
  clubName: string;
  city: string;
  address: string;
  date: string | null; // ISO date, null → tomorrow
  page: number;
  size: number;
}