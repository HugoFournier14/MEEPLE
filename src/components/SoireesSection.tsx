import React from 'react';
import { GameSlot } from '../types';
import { Sparkles, Users, Clock, Flame, CalendarPlus, ChevronRight } from 'lucide-react';
import { tcgImg, boardgameImg } from '../data/mockData';

interface SoireesSectionProps {
  slots: GameSlot[];
  onSelectSlot: (slotId: string) => void;
}

export const SoireesSection: React.FC<SoireesSectionProps> = ({ slots, onSelectSlot }) => {
  // Find next upcoming Friday TCG slot and next upcoming Saturday BG slot
  const nextTcgSlot = slots.find((s) => s.type === 'tcg' && s.isActive !== false);
  const nextBgSlot = slots.find((s) => s.type === 'boardgame' && s.isActive !== false);

  const getSlotAvailability = (slot?: GameSlot) => {
    if (!slot) return { remaining: 0, status: 'Complet', color: 'text-rose-400', isAvailable: false };
    const remaining = slot.totalSeats - slot.bookedSeats;
    if (remaining <= 0) {
      return { remaining: 0, status: 'Complet', color: 'text-rose-400', isAvailable: false };
    }
    if (remaining <= 6) {
      return { remaining, status: `${remaining} places restantes (Dernières places)`, color: 'text-amber-400', isAvailable: true };
    }
    return { remaining, status: `${remaining} places restantes`, color: 'text-emerald-400', isAvailable: true };
  };

  const tcgAvail = getSlotAvailability(nextTcgSlot);
  const bgAvail = getSlotAvailability(nextBgSlot);

  return (
    <section id="soirees" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#080c16] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
            02. Nos Rendez-Vous Hebdomadaires
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight text-balance">
            Deux Soirées Épiques. Chaque Week-End.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-balance">
            De 19h à minuit, plongez dans l'effervescence de nos nocturnes. Que vous veniez pour lancer des sorts sur playmat ou tester les dernières sorties ludiques de l'année.
          </p>
        </div>

        {/* The Two Distinct Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Vendredi Soir - Soirée TCG */}
          <div className="rounded-3xl bg-[#111728] border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Visual Header Image */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 border border-white/10">
              <img
                src={tcgImg}
                alt="Soirée TCG cartes au Meeple Conquérant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111728] via-[#111728]/40 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-[#5865F2]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Tous les Vendredis</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> 19h00 – 00h00
                </span>
                <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-amber-300 font-semibold">
                  Tarif : 4 € / joueur
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Cartes à Collectionner & Compétition Amicale</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white mb-3">
                Vendredi Soir — Soirée TCG
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Magic: The Gathering, Disney Lorcana, Pokémon, One Piece Card Game, Star Wars: Unlimited. 
                Que vous souhaitiez disputer un tournoi amical, perfectionner votre deck Commander ou vous initier avec nos decks de prêt, la communauté vous accueille avec passion.
              </p>

              {/* Supported Games List */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Magic: The Gathering', 'Disney Lorcana', 'Pokémon JCC', 'One Piece', 'Star Wars: Unlimited', 'Initiations gratuites'].map(
                  (game) => (
                    <span
                      key={game}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300"
                    >
                      {game}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Availability Box & CTA */}
            <div className="pt-6 border-t border-white/10 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">Prochain créneau :</span>
                  <span className="text-sm font-semibold text-white">
                    {nextTcgSlot ? nextTcgSlot.dateStr : 'Vendredi prochain'}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Disponibilité :</span>
                  <span className={`text-sm font-bold flex items-center sm:justify-end gap-1.5 ${tcgAvail.color}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {tcgAvail.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => nextTcgSlot && onSelectSlot(nextTcgSlot.id)}
                disabled={!tcgAvail.isAvailable}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  tcgAvail.isAvailable
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{tcgAvail.isAvailable ? 'Réserver ma table TCG pour vendredi' : 'Créneau complet'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Samedi Soir - Soirée Jeux de Société */}
          <div className="rounded-3xl bg-[#111728] border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Visual Header Image */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 border border-white/10">
              <img
                src={boardgameImg}
                alt="Soirée jeux de société au Meeple Conquérant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111728] via-[#111728]/40 to-transparent" />
              
              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-yellow-200" />
                <span>Tous les Samedis</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5 text-orange-400" /> 19h00 – 00h00
                </span>
                <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-amber-300 font-semibold">
                  Tarif : 4 € / joueur
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <span>Grand Public, Amis, Familles & Experts</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white mb-3">
                Samedi Soir — Jeux de Société
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Plus de 200 jeux en accès libre et illimité. Ne perdez plus 45 minutes à déchiffrer les règles : nos animateurs vous installent, vous suggèrent le jeu idéal et vous expliquent les règles sur le pouce. 
                Que vous veniez en solo, en couple ou à dix !
              </p>

              {/* Supported Themes List */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['+200 jeux en libre accès', 'Explication des règles', 'Ambiance & Fêtes', 'Stratégie & Coopératif', 'Solos bienvenus', 'Planches & Boissons'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Availability Box & CTA */}
            <div className="pt-6 border-t border-white/10 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs text-slate-400 block">Prochain créneau :</span>
                  <span className="text-sm font-semibold text-white">
                    {nextBgSlot ? nextBgSlot.dateStr : 'Samedi prochain'}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Disponibilité :</span>
                  <span className={`text-sm font-bold flex items-center sm:justify-end gap-1.5 ${bgAvail.color}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {bgAvail.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => nextBgSlot && onSelectSlot(nextBgSlot.id)}
                disabled={!bgAvail.isAvailable}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  bgAvail.isAvailable
                    ? 'bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 active:scale-[0.98]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{bgAvail.isAvailable ? 'Réserver ma table Jeux pour samedi' : 'Créneau complet'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
