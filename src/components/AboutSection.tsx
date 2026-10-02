import React from 'react';
import { HeartHandshake, Compass, Coffee, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { boutiqueImg } from '../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <section id="presentation" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
            01. L'Âme du Lieu
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight text-balance">
            Plus qu'une boutique, un sanctuaire ludique en Normandie.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Implanté au cœur de Dives-sur-Mer, à deux pas de la mer et de la cité de Guillaume le Conquérant,
            <span className="text-white font-medium"> Le Meeple Conquérant</span> est né d'une passion dévorante :
            rassembler autour d'une même table ceux qui aiment jouer, rire et partager.
          </p>
        </div>

        {/* Main Grid: Visual & Editorial storytelling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Photo Showcase */}
          <div className="lg:col-span-6 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-[4/3]">
              <img
                src={boutiqueImg}
                alt="Les rayons de la boutique Le Meeple Conquérant à Dives-sur-Mer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1">
                  Visitez nos rayons
                </p>
                <p className="text-sm text-slate-200">
                  Des étagères du sol au plafond : jeux de plateau, TCG, casse-têtes et jeux d'ambiance.
                </p>
              </div>
            </div>

            {/* Accent badge floating slightly */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-1.5 border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>+2 000 Références</span>
            </div>
          </div>

          {/* Pillars & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#121929]/70 border border-white/10 hover:border-orange-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white mb-1">
                    Conseil d'experts & accueil bienveillant
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Débutant complet, famille à la recherche d'un jeu pour le dimanche, ou joueur aguerri en quête d'un Eurogame costaud : on prend le temps de vous écouter et de vous guider sans jargon intimidant.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121929]/70 border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white mb-1">
                    Café-jeux & saveurs normandes
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Installez-vous sur nos tables en bois massif. Sirotez une bière artisanale du Calvados, un cidre fermier ou un soda bio en grignotant une planche apéro pendant que nous vous expliquons les règles.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#121929]/70 border border-white/10 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white mb-1">
                    Une communauté vivante chaque semaine
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Pas besoin de venir en groupe constitué ! Nos tables sont pensées pour favoriser les rencontres. Les joueurs seuls sont accueillis les bras ouverts et intégrés directement aux parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discord Community Callout Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#172036] via-[#1a233d] to-[#141b2e] border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#5865F2]/25">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white font-['Outfit']">
                  Rejoignez la taverne Discord du Meeple Conquérant
                </h4>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-sm text-slate-300 mt-0.5">
                Plus de 350 membres actifs : organisation de parties, spoilers TCG, arrivages boutique et discussions passionnées.
              </p>
            </div>
          </div>

          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#5865F2] hover:bg-[#4752c4] active:scale-[0.98] transition-all whitespace-nowrap shadow-md"
          >
            <span>Rejoindre le Discord</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
