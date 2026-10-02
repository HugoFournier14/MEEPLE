import { GameSlot, Reservation, GameItem } from '../types';
import { INITIAL_SLOTS, BOUTIQUE_GAMES } from '../data/mockData';

const SLOTS_KEY = 'le_meeple_slots_v1';
const RESERVATIONS_KEY = 'le_meeple_reservations_v1';
const GAMES_KEY = 'le_meeple_games_v1';
const ADMIN_AUTH_KEY = 'le_meeple_admin_auth_v1';

// Custom event to sync data across all components immediately
export function notifyDataChanged(): void {
  window.dispatchEvent(new CustomEvent('meeple_data_changed'));
}

// Robust date parser for French dates (e.g. "Vendredi 30 Octobre 2026")
const FRENCH_MONTHS: Record<string, string> = {
  janvier: '01',
  fevrier: '02',
  février: '02',
  mars: '03',
  avril: '04',
  mai: '05',
  juin: '06',
  juillet: '07',
  aout: '08',
  août: '08',
  septembre: '09',
  octobre: '10',
  novembre: '11',
  decembre: '12',
  décembre: '12',
};

export function parseFrenchDateToISO(dateStr: string): string {
  if (!dateStr) return '9999-99-99';
  const clean = dateStr.toLowerCase().replace(/[,.-]/g, ' ');
  const parts = clean.split(/\s+/).filter(Boolean);

  let day: string | null = null;
  let month: string | null = null;
  let year: string | null = null;

  for (const part of parts) {
    if (!day && /^\d{1,2}$/.test(part)) {
      day = part.padStart(2, '0');
    } else if (!year && /^\d{4}$/.test(part)) {
      year = part;
    } else if (!month && FRENCH_MONTHS[part]) {
      month = FRENCH_MONTHS[part];
    }
  }

  if (year && month && day) {
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

// Always sort slots from earliest to latest
export function sortSlotsChronologically(slots: GameSlot[]): GameSlot[] {
  return [...slots].sort((a, b) => {
    const isoA = a.isoDate && a.isoDate.length === 10 ? a.isoDate : parseFrenchDateToISO(a.dateStr);
    const isoB = b.isoDate && b.isoDate.length === 10 ? b.isoDate : parseFrenchDateToISO(b.dateStr);

    if (isoA !== isoB) {
      return isoA.localeCompare(isoB);
    }
    return (a.startTime || '').localeCompare(b.startTime || '');
  });
}

export function getStoredSlots(): GameSlot[] {
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    if (!raw) {
      const sorted = sortSlotsChronologically(INITIAL_SLOTS);
      localStorage.setItem(SLOTS_KEY, JSON.stringify(sorted));
      return sorted;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return sortSlotsChronologically(parsed);
    }
    return sortSlotsChronologically(INITIAL_SLOTS);
  } catch {
    return sortSlotsChronologically(INITIAL_SLOTS);
  }
}

export function saveStoredSlots(slots: GameSlot[]): void {
  try {
    const sorted = sortSlotsChronologically(slots);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(sorted));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save slots to localStorage', err);
  }
}

// Slot Management for Gérants
export function addSlot(slot: GameSlot): void {
  const slots = getStoredSlots();
  // Ensure isoDate is set
  if (!slot.isoDate || slot.isoDate.length !== 10) {
    slot.isoDate = parseFrenchDateToISO(slot.dateStr);
  }
  const updated = sortSlotsChronologically([...slots, slot]);
  saveStoredSlots(updated);
}

export function updateSlot(updated: GameSlot): void {
  const slots = getStoredSlots();
  if (!updated.isoDate || updated.isoDate.length !== 10) {
    updated.isoDate = parseFrenchDateToISO(updated.dateStr);
  }
  const index = slots.findIndex((s) => s.id === updated.id);
  if (index !== -1) {
    slots[index] = updated;
    saveStoredSlots(sortSlotsChronologically(slots));
  }
}

export function deleteSlot(slotId: string): void {
  const slots = getStoredSlots();
  const updated = slots.filter((s) => s.id !== slotId);
  saveStoredSlots(updated);
}

export function toggleSlotActive(slotId: string): void {
  const slots = getStoredSlots();
  const index = slots.findIndex((s) => s.id === slotId);
  if (index !== -1) {
    const current = slots[index];
    current.isActive = current.isActive === false ? true : false;
    slots[index] = current;
    saveStoredSlots(slots);
  }
}

export function updateSlotSeats(slotId: string, totalSeats: number, bookedSeats?: number): void {
  const slots = getStoredSlots();
  const index = slots.findIndex((s) => s.id === slotId);
  if (index !== -1) {
    slots[index].totalSeats = Math.max(1, totalSeats);
    if (typeof bookedSeats === 'number') {
      slots[index].bookedSeats = Math.max(0, Math.min(slots[index].totalSeats, bookedSeats));
    }
    saveStoredSlots(slots);
  }
}

// Reservations
export function getStoredReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(RESERVATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredReservations(reservations: Reservation[]): void {
  try {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save reservations to localStorage', err);
  }
}

export function makeReservation(data: {
  slotId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatsCount: number;
  comment?: string;
  isManual?: boolean;
}): { success: boolean; reservation?: Reservation; error?: string } {
  const slots = getStoredSlots();
  const slotIndex = slots.findIndex((s) => s.id === data.slotId);

  if (slotIndex === -1) {
    return { success: false, error: 'Créneau introuvable.' };
  }

  const slot = slots[slotIndex];
  if (slot.isActive === false && !data.isManual) {
    return { success: false, error: 'Ce créneau est actuellement indisponible.' };
  }

  const seatsAvailable = slot.totalSeats - slot.bookedSeats;
  if (seatsAvailable < data.seatsCount) {
    return {
      success: false,
      error: `Il ne reste que ${seatsAvailable} place(s) disponible(s) sur ce créneau.`,
    };
  }

  const ticketCode = `MPC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const reservation: Reservation = {
    id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slotId: slot.id,
    slotTitle: slot.title,
    slotDate: slot.dateStr,
    slotTime: `${slot.startTime} – ${slot.endTime}`,
    type: slot.type,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    seatsCount: data.seatsCount,
    comment: data.comment?.trim(),
    createdAt: new Date().toISOString(),
    ticketCode,
    isManual: !!data.isManual,
  };

  slot.bookedSeats += data.seatsCount;
  slots[slotIndex] = slot;
  saveStoredSlots(slots);

  const currentReservations = getStoredReservations();
  saveStoredReservations([reservation, ...currentReservations]);

  return { success: true, reservation };
}

export function cancelReservation(reservationId: string): boolean {
  const currentReservations = getStoredReservations();
  const target = currentReservations.find((r) => r.id === reservationId);
  if (!target) return false;

  const slots = getStoredSlots();
  const slotIndex = slots.findIndex((s) => s.id === target.slotId);
  if (slotIndex !== -1) {
    slots[slotIndex].bookedSeats = Math.max(0, slots[slotIndex].bookedSeats - target.seatsCount);
    saveStoredSlots(slots);
  }

  const updatedReservations = currentReservations.filter((r) => r.id !== reservationId);
  saveStoredReservations(updatedReservations);
  return true;
}

export function resetDemoData(): void {
  const sorted = sortSlotsChronologically(INITIAL_SLOTS);
  localStorage.setItem(SLOTS_KEY, JSON.stringify(sorted));
  localStorage.setItem(GAMES_KEY, JSON.stringify(BOUTIQUE_GAMES));
  localStorage.removeItem(RESERVATIONS_KEY);
  notifyDataChanged();
}

export function generateCalendarUrl(reservation: Reservation): string {
  const title = encodeURIComponent(`Le Meeple Conquérant: ${reservation.slotTitle}`);
  const details = encodeURIComponent(
    `Soirée au Meeple Conquérant (${reservation.seatsCount} place(s)). Ticket: ${reservation.ticketCode}. Adresse: 32 rue Gaston Manneville / Avenue des Résistants, 14160 Dives-sur-Mer. Téléphone: 02 31 24 14 60.`
  );
  const location = encodeURIComponent('32 Rue Gaston Manneville, 14160 Dives-sur-Mer, France');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
}

// Export reservations to CSV
export function exportReservationsToCSV(slotId?: string): { success: boolean; message?: string } {
  const reservations = getStoredReservations();
  const filtered = slotId ? reservations.filter((r) => r.slotId === slotId) : reservations;

  if (filtered.length === 0) {
    return { success: false, message: 'Aucune inscription à exporter pour ce créneau.' };
  }

  const headers = [
    'Code Ticket',
    'Date Soirée',
    'Créneau',
    'Type de Soirée',
    'Titre',
    'Nom',
    'Prénom',
    'Email',
    'Téléphone',
    'Nombre de Places',
    'Commentaire / Jeux',
    'Date Inscription',
    'Source',
  ];

  const rows = filtered.map((r) => [
    r.ticketCode,
    r.slotDate,
    r.slotTime,
    r.type === 'tcg' ? 'Vendredi TCG' : 'Samedi Jeux',
    `"${(r.slotTitle || '').replace(/"/g, '""')}"`,
    `"${(r.lastName || '').replace(/"/g, '""')}"`,
    `"${(r.firstName || '').replace(/"/g, '""')}"`,
    r.email,
    r.phone,
    r.seatsCount,
    `"${(r.comment || '').replace(/"/g, '""')}"`,
    new Date(r.createdAt).toLocaleDateString('fr-FR'),
    r.isManual ? 'Manuel (Comptoir/Tel)' : 'En ligne',
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateSuffix = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `inscriptions_meeple_conquerant_${dateSuffix}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return { success: true };
}

// Boutique Games Management for Gérants
export function getStoredGames(): GameItem[] {
  try {
    const raw = localStorage.getItem(GAMES_KEY);
    if (!raw) {
      localStorage.setItem(GAMES_KEY, JSON.stringify(BOUTIQUE_GAMES));
      return BOUTIQUE_GAMES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : BOUTIQUE_GAMES;
  } catch {
    return BOUTIQUE_GAMES;
  }
}

export function saveStoredGames(games: GameItem[]): void {
  try {
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save games to localStorage', err);
  }
}

export function addGame(game: GameItem): void {
  const games = getStoredGames();
  saveStoredGames([game, ...games]);
}

export function updateGame(updated: GameItem): void {
  const games = getStoredGames();
  const index = games.findIndex((g) => g.id === updated.id);
  if (index !== -1) {
    games[index] = updated;
    saveStoredGames(games);
  }
}

export function deleteGame(gameId: string): void {
  const games = getStoredGames();
  const updated = games.filter((g) => g.id !== gameId);
  saveStoredGames(updated);
}

// Authentication & Session for Gérants
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loginAdmin(pinOrPassword: string): boolean {
  const clean = pinOrPassword.trim().toLowerCase();
  if (clean === '14160' || clean === 'meeple14160' || clean === 'conquerant' || clean === 'admin') {
    try {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } catch {}
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  } catch {}
}
