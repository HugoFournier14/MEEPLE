import React, { useState, useEffect } from 'react';
import { GameSlot, Reservation, EveningType } from '../types';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Send,
  Ticket,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
  CalendarCheck,
  X,
  Phone,
  Mail,
  User,
  MessageSquare
} from 'lucide-react';
import { makeReservation, generateCalendarUrl } from '../utils/storage';

interface ReservationSectionProps {
  slots: GameSlot[];
  selectedSlotId: string | null;
  onSlotSelected: (slotId: string | null) => void;
  onReservationComplete: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  slots,
  selectedSlotId,
  onSlotSelected,
  onReservationComplete,
}) => {
  const [filterType, setFilterType] = useState<'all' | EveningType>('all');
  const [activeSlot, setActiveSlot] = useState<GameSlot | null>(null);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seatsCount, setSeatsCount] = useState<number>(1);
  const [comment, setComment] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(null);

  // Synchronize when selectedSlotId prop changes
  useEffect(() => {
    if (selectedSlotId) {
      const match = slots.find((s) => s.id === selectedSlotId);
      if (match) {
        setActiveSlot(match);
        setSeatsCount(1);
        setErrorMessage(null);
      }
    }
  }, [selectedSlotId, slots]);

  const filteredSlots = slots.filter((slot) => {
    if (slot.isActive === false) return false;
    if (filterType === 'all') return true;
    return slot.type === filterType;
  });

  const handleOpenBooking = (slot: GameSlot) => {
    const remaining = slot.totalSeats - slot.bookedSeats;
    if (remaining <= 0) return;
    setActiveSlot(slot);
    onSlotSelected(slot.id);
    setSeatsCount(1);
    setErrorMessage(null);
  };

  const handleCloseModal = () => {
    setActiveSlot(null);
    onSlotSelected(null);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSlot) return;

    // Basic validations
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom et votre nom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez fournir une adresse email valide.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Veuillez fournir un numéro de téléphone joignable (ex. 06 12 34 56 78).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Call reservation utility
    const result = makeReservation({
      slotId: activeSlot.id,
      firstName,
      lastName,
      email,
      phone,
      seatsCount,
      comment,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (result.success && result.reservation) {
        setLastConfirmedReservation(result.reservation);
        onReservationComplete();
        // Clear inputs
        setComment('');
      } else {
        setErrorMessage(result.error || 'Erreur lors de la réservation.');
      }
    }, 400);
  };

  return (
    <section id="reservations" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
              03. Réservation en Direct
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight">
              Réservez Votre Table de Jeu
            </h2>
            <p className="mt-3 text-base text-slate-300 font-normal">
              Les places sont limitées à chaque soirée afin de garantir un confort de jeu optimal et une ambiance conviviale. Choisissez votre créneau ci-dessous.
            </p>
          </div>

          {/* Filter Tabs (Functional interactive button controls as permitted by design rules) */}
          <div className="inline-flex p-1.5 rounded-xl bg-slate-900 border border-white/10 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Toutes les dates
            </button>
            <button
              type="button"
              onClick={() => setFilterType('tcg')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'tcg'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vendredi (TCG)
            </button>
            <button
              type="button"
              onClick={() => setFilterType('boardgame')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterType === 'boardgame'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Samedi (Jeux de Société)
            </button>
          </div>
        </div>

        {/* Date Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlots.map((slot) => {
            const seatsRemaining = Math.max(0, slot.totalSeats - slot.bookedSeats);
            const fillPercentage = Math.min(100, Math.round((slot.bookedSeats / slot.totalSeats) * 100));
            const isFull = seatsRemaining === 0;
            const isLowSeats = seatsRemaining > 0 && seatsRemaining <= 6;

            return (
              <div
                key={slot.id}
                className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between relative group ${
                  isFull
                    ? 'bg-[#0f1422]/70 border-white/5 opacity-80'
                    : slot.type === 'tcg'
                    ? 'bg-[#12192c] border-indigo-500/25 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10'
                    : 'bg-[#141b2b] border-orange-500/25 hover:border-orange-500/50 shadow-lg hover:shadow-orange-500/10'
                }`}
              >
                {/* Top Status & Date Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-md ${
                        slot.type === 'tcg'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}
                    >
                      {slot.type === 'tcg' ? 'Vendredi TCG' : 'Samedi Jeux'}
                    </span>

                    {/* Status indicator */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {isFull ? (
                        <span className="text-rose-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Complet
                        </span>
                      ) : isLowSeats ? (
                        <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> Dernières places !
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Places disponibles
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-['Outfit'] text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {slot.shortDate}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-slate-300 mb-3 leading-snug">
                    {slot.title}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Ticket className="w-3.5 h-3.5 text-amber-400" />
                      {slot.pricePerSeat} € / pers.
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-5">
                    {slot.subtitle}
                  </p>
                </div>

                {/* Progress bar of seats remaining */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Jauge des places :</span>
                    <span className={`font-mono font-bold ${isFull ? 'text-rose-400' : isLowSeats ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isFull ? '0 place restante' : `${seatsRemaining} place(s) restante(s)`}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-rose-500'
                          : isLowSeats
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBooking(slot)}
                    disabled={isFull}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isFull
                        ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-white/5'
                        : slot.type === 'tcg'
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-[0.98]'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.98]'
                    }`}
                  >
                    <span>{isFull ? 'Soirée complète' : 'Réserver sur cette date'}</span>
                    {!isFull && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Confirmation immédiate :</strong> Votre inscription sera enregistrée et confirmée. Les places sont limitées pour un cadre intimiste et chaleureux.
            </span>
          </div>
          <div className="text-slate-500 text-xs shrink-0">
            Paiement de l'accès (4 €) sur place à votre arrivée.
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101726] border border-white/15 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer la modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block mb-2 ${
                  activeSlot.type === 'tcg'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}
              >
                {activeSlot.type === 'tcg' ? 'Soirée TCG' : 'Soirée Jeux de Société'}
              </span>
              <h3 className="text-2xl font-bold font-['Outfit'] text-white">
                Inscription pour le {activeSlot.dateStr}
              </h3>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {activeSlot.startTime} à {activeSlot.endTime} · 32 rue Gaston Manneville, Dives-sur-Mer
              </p>
            </div>

            {/* Live seats gauge for this slot */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 mb-6 flex items-center justify-between text-xs">
              <span className="text-slate-300">Places encore disponibles :</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {activeSlot.totalSeats - activeSlot.bookedSeats} places
              </span>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* The Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Prénom <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Guillaume"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 focus:border-orange-500 focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nom <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="le Conquérant"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 focus:border-orange-500 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joueur@exemple.fr"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 focus:border-orange-500 focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Téléphone joignable <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 focus:border-orange-500 focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre de personnes <span className="text-orange-400">*</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const remaining = activeSlot.totalSeats - activeSlot.bookedSeats;
                    const disabled = num > remaining;
                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSeatsCount(num)}
                        className={`py-2 text-sm font-bold rounded-lg border transition-all cursor-pointer ${
                          seatsCount === num
                            ? 'bg-orange-500 border-orange-400 text-white shadow-sm'
                            : disabled
                            ? 'bg-slate-900 text-slate-600 border-white/5 cursor-not-allowed'
                            : 'bg-slate-900 text-slate-300 border-white/15 hover:border-white/30'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Accès café-jeux : {seatsCount * activeSlot.pricePerSeat} € au total (4 € / personne, réglé sur place).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message ou souhaits de jeux (optionnel)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ex : Nous aimerions tester Dune Imperium, ou format Modern pour Magic !"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-white/15 focus:border-orange-500 focus:outline-none text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400 leading-normal mb-4">
                  Votre inscription sera confirmée par email. Les places sont limitées. En cas d'empêchement, merci de prévenir la boutique ou d'annuler pour libérer la table.
                </p>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.98] shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Enregistrement en cours...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirmer mon inscription</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Success Modal */}
      {lastConfirmedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-emerald-500/30 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 text-center relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
              Réservation Validée !
            </p>
            <h3 className="text-2xl font-bold font-['Outfit'] text-white mb-2">
              À très vite au Meeple Conquérant !
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Merci <strong className="text-white">{lastConfirmedReservation.firstName}</strong>, votre inscription est bien prise en compte pour{' '}
              <strong className="text-amber-300">{lastConfirmedReservation.seatsCount} personne(s)</strong>.
            </p>

            {/* Ticket receipt card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-left text-xs space-y-2 mb-6 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Pass Soirée :</span>
                <span className="font-mono font-bold text-amber-300 tracking-wider">
                  {lastConfirmedReservation.ticketCode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date :</span>
                <span className="text-white font-medium">{lastConfirmedReservation.slotDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Créneau :</span>
                <span className="text-white font-medium">{lastConfirmedReservation.slotTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Lieu :</span>
                <span className="text-white font-medium">32 rue Gaston Manneville, Dives-sur-Mer</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateCalendarUrl(lastConfirmedReservation)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>Ajouter à mon agenda</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setLastConfirmedReservation(null);
                  setActiveSlot(null);
                  onSlotSelected(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
              >
                C'est parfait, fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
