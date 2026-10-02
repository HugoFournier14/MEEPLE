import React, { useState } from 'react';
import { Calendar, ShoppingBag, MapPin, Dice5, Users, Sparkles, ChevronDown } from 'lucide-react';
import { MeepleCanvas } from './MeepleCanvas';
import { heroImg } from '../data/mockData';

interface HeroSectionProps {
  onScrollToReservation: () => void;
  onScrollToBoutique: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToReservation,
  onScrollToBoutique,
}) => {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollHeroDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 6) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#070b14]">
      {/* Background Image with Measured Scrim & Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Ambiance chaleureuse du café-jeux Le Meeple Conquérant à Dives-sur-Mer"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient scrim according to frontend-design specs */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/85 to-[#0b0f19]/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-[#070b14]/90" />
      </div>

      {/* Floating Canvas Particles */}
      <MeepleCanvas />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Location Trust Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-amber-300 mb-6 shadow-inner">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>Dives-sur-Mer · Calvados, Normandie</span>
        </div>

        {/* Main Logo & Headline */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-rose-700 p-0.5 shadow-xl shadow-orange-500/25 rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-[#0e1424] rounded-[14px] flex items-center justify-center text-amber-400">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" aria-hidden="true">
                <circle cx="12" cy="5" r="3" />
                <path d="M7 9 L3 12 L4 15 L7 13 L6 21 L9 21 L12 17 L15 21 L18 21 L17 13 L20 15 L21 12 L17 9 Z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Outfit'] text-white tracking-tight leading-[1.08] mb-4 text-balance">
          Le Meeple{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500">
            Conquérant
          </span>
        </h1>

        <p className="text-lg sm:text-2xl font-medium text-amber-200/90 font-['Outfit'] mb-4 tracking-wide">
          Boutique & Café-Jeux à Dives-sur-Mer
        </p>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 text-balance font-normal">
          <strong className="text-white font-semibold">Viens jouer. Reste pour la communauté.</strong>
          <br className="hidden sm:inline" /> Plus de 2 000 références en boutique, 200+ jeux en libre accès et des soirées épiques chaque week-end.
        </p>

        {/* 2 Main Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
          <button
            type="button"
            onClick={onScrollToReservation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.98] shadow-lg shadow-orange-500/25 border border-orange-400/30 transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Réserver une soirée</span>
          </button>

          <button
            type="button"
            onClick={onScrollToBoutique}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 hover:text-white border border-white/15 active:scale-[0.98] backdrop-blur-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Découvrir la boutique</span>
          </button>
        </div>

        {/* Interactive dice roll widget */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
          <span className="text-xs text-slate-300">Prêt à lancer les dés ?</span>
          <button
            type="button"
            onClick={rollHeroDice}
            disabled={isRolling}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
          >
            <Dice5 className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{diceValue ? `Résultat : ${diceValue} ! Relancer` : 'Lancer un D6'}</span>
          </button>
          {diceValue === 6 && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Coup critique !
            </span>
          )}
        </div>

        {/* Unboxed Metadata Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-400 border-t border-white/10 pt-6 max-w-xl">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            +2 000 Jeux & Accessoires
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200">Vendredi TCG 19h–00h</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200">Samedi Soirée Jeux 19h–00h</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400 font-medium">Accès soirée 4 €</span>
        </div>

        {/* Address hint */}
        <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span>32 rue Gaston Manneville / Avenue des Résistants – 14160 Dives-sur-Mer</span>
        </p>

        {/* Scroll indicator */}
        <a
          href="#presentation"
          className="mt-8 text-slate-500 hover:text-slate-300 transition-colors flex flex-col items-center gap-1 animate-bounce"
          aria-label="Descendre vers la présentation"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
