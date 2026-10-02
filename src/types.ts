export type EveningType = 'tcg' | 'boardgame';

export interface GameSlot {
  id: string;
  type: EveningType;
  title: string;
  subtitle: string;
  dateStr: string; // e.g. "Vendredi 3 Octobre 2026"
  shortDate: string; // e.g. "Ven. 3 Oct."
  isoDate: string; // e.g. "2026-10-03"
  startTime: string; // e.g. "19:00"
  endTime: string; // e.g. "00:00"
  totalSeats: number;
  bookedSeats: number;
  featuredThemes: string[];
  description: string;
  hostName: string;
  pricePerSeat: number; // in Euros
  isActive?: boolean; // enable or disable slot (visible or hidden/cancelled)
}

export interface Reservation {
  id: string;
  slotId: string;
  slotTitle: string;
  slotDate: string;
  slotTime: string;
  type: EveningType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatsCount: number;
  comment?: string;
  createdAt: string;
  ticketCode: string;
  isManual?: boolean; // added manually by shop manager
}

export interface GameItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'plateau' | 'tcg' | 'ambiance' | 'enquete' | 'experts' | 'accessoires';
  categoryLabel: string;
  players: string;
  duration: string;
  age: string;
  difficulty: 'Facile' | 'Intermédiaire' | 'Expert';
  description: string;
  tag: string;
  inCafePlayable: boolean;
  priceEstimate: string;
  highlight?: boolean;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  description: string;
  tag: string;
}
