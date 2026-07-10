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