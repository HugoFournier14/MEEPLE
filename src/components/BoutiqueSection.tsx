import React, { useState } from 'react';
import { BOUTIQUE_GAMES } from '../data/mockData';
import { GameItem } from '../types';
import {
  ShoppingBag,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Dice6,
  Check,
  Coffee,
  HelpCircle,
  X,
  Store
} from 'lucide-react';

interface BoutiqueSectionProps {
  games: GameItem[];
  onScrollToHours: () => void;
}

export const BoutiqueSection: React.FC<BoutiqueSectionProps> = ({ games, onScrollToHours }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGameDetail, setActiveGameDetail] = useState<GameItem | null>(null);

  // Le Dé du Meeple state (interactive recommender)
  const [recommenderOpen, setRecommenderOpen] = useState(false);
  const [playersChoice, setPlayersChoice] = useState<'2' | '3-4' | '5+'>('3-4');
  const [timeChoice, setTimeChoice] = useState<'short' | 'medium' | 'long'>('medium');
  const [recommendedGame, setRecommendedGame] = useState<GameItem | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les sélections' },
    { id: 'plateau', label: 'Jeux de Plateau' },
    { id: 'tcg', label: 'TCG & Cartes' },
    { id: 'ambiance', label: 'Jeux d\'Ambiance' },
    { id: 'enquete', label: 'Enquêtes & Énigmes' },
    { id: 'experts', label: 'Jeux Experts' },
    { id: 'accessoires', label: 'Accessoires' },
  ];

  const filteredGames = games.filter((game) => {
    if (selectedCategory === 'all') return true;
    return game.category === selectedCategory;
  });

  const handleRollMeepleDice = () => {
    let pool = games;
    if (playersChoice === '2') {
      pool = pool.filter((g) => g.players.includes('2'));
    } else if (playersChoice === '5+') {
      pool = pool.filter((g) => g.players.includes('6') || g.players.includes('4'));
    }

    if (timeChoice === 'short') {
      pool = pool.filter((g) => g.duration.includes('15') || g.duration.includes('20') || g.duration.includes('30'));
    } else if (timeChoice === 'long') {
      pool = pool.filter((g) => g.duration.includes('90') || g.duration.includes('60') || g.category === 'experts');
    }

    const randomPick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : games[0];
    setRecommendedGame(randomPick);
  };

  return (
    <section id="boutique" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#090d18] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
              04. La Boutique Spécialisée
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight">
              Plus de 2 000 Références Sélectionnées
            </h2>
            <p className="mt-3 text-base text-slate-300 font-normal">
              Des hits incontournables aux éditions de collection introuvables ailleurs en Normandie. Chaque jeu en rayon a été testé et approuvé par notre équipe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setRecommenderOpen(!recommenderOpen)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Dice6 className="w-4 h-4 text-amber-400" />
              <span>{recommenderOpen ? 'Fermer le Dé du Meeple' : 'Quel jeu choisir ? (Le Dé du Meeple)'}</span>
            </button>

            <button
              type="button"
              onClick={onScrollToHours}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Store className="w-4 h-4 text-orange-400" />
              <span>Horaires de la boutique</span>
            </button>
          </div>
        </div>

        {/* Interactive "Le Dé du Meeple" drawer */}
        {recommenderOpen && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#131b2e] to-[#0e1424] border border-amber-500/30 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Dice6 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white">
                    Le Dé du Meeple — Trouvez votre jeu idéal en 2 clics
                  </h3>
                  <p className="text-xs text-slate-300">
                    Indiquez votre configuration, nous tirons le jeu parfait de notre sélection.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRecommenderOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  1. Vous êtes combien autour de la table ?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['2', '3-4', '5+'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPlayersChoice(opt)}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        playersChoice === opt
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900 text-slate-300 border-white/10'
                      }`}
                    >
                      {opt === '2' ? 'En duo (2)' : opt === '3-4' ? '3 à 4 joueurs' : '5 joueurs et +'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  2. De combien de temps disposez-vous ?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'short', label: '15 - 30 min' },
                    { id: 'medium', label: '45 - 60 min' },
                    { id: 'long', label: '90 min +' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTimeChoice(opt.id as any)}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        timeChoice === opt.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-900 text-slate-300 border-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleRollMeepleDice}
                  className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lancer la recommandation</span>
                </button>
              </div>
            </div>

            {/* Recommender Result */}
            {recommendedGame && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center text-xl shrink-0 font-['Outfit']">
                    ★
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Recommandation Meeple Conquérant
                    </span>
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      {recommendedGame.title} — {recommendedGame.categoryLabel}
                    </h4>
                    <p className="text-xs text-slate-300">{recommendedGame.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveGameDetail(recommendedGame)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 whitespace-nowrap"
                >
                  Voir la fiche express
                </button>
              </div>
            )}
          </div>
        )}

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => setActiveGameDetail(game)}
              className="rounded-2xl bg-[#121929] border border-white/10 hover:border-orange-500/40 p-5 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 shadow-xl cursor-pointer"
            >
              <div>
                {/* Tag & badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {game.tag}
                  </span>
                  {game.inCafePlayable && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1" title="Testable sur place au café-jeux">
                      <Coffee className="w-3 h-3 text-orange-400" /> Jouable au café
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-['Outfit'] text-white group-hover:text-amber-300 transition-colors mb-1">
                  {game.title}
                </h3>
                {game.subtitle && (
                  <p className="text-xs text-slate-400 italic mb-3">{game.subtitle}</p>
                )}

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 font-normal">
                  {game.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-auto">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {game.players}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {game.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {game.priceEstimate}
                  </span>
                  <span className="text-xs font-semibold text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Détails <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Detail Modal */}
      {activeGameDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101726] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setActiveGameDetail(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              {activeGameDetail.categoryLabel} · {activeGameDetail.tag}
            </span>

            <h3 className="text-2xl font-bold font-['Outfit'] text-white mb-1">
              {activeGameDetail.title}
            </h3>

            {activeGameDetail.subtitle && (
              <p className="text-sm text-slate-400 italic mb-4">{activeGameDetail.subtitle}</p>
            )}

            <p className="text-sm text-slate-200 leading-relaxed mb-6 font-normal">
              {activeGameDetail.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 border border-white/10 text-center mb-6">
              <div>
                <span className="text-slate-400 text-[11px] block">Joueurs</span>
                <span className="text-white font-bold text-xs sm:text-sm">{activeGameDetail.players}</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-slate-400 text-[11px] block">Durée</span>
                <span className="text-white font-bold text-xs sm:text-sm">{activeGameDetail.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Niveau</span>
                <span className="text-amber-400 font-bold text-xs sm:text-sm">{activeGameDetail.difficulty}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Tarif indicatif boutique :</span>
                <span className="text-lg font-mono font-bold text-white">{activeGameDetail.priceEstimate}</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveGameDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
