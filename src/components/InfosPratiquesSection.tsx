import React from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  Utensils,
  Car,
  Train,
  MessageSquare,
  Instagram,
  Facebook,
  Phone,
  Mail,
  ExternalLink,
  Beer,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const InfosPratiquesSection: React.FC = () => {
  return (
    <section id="infos" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#080c16] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
            06. Venir & Profiter
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight">
            Infos Pratiques & Accès
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Tout ce qu'il faut savoir pour préparer votre venue au Meeple Conquérant, que ce soit pour dénicher un nouveau jeu ou passer une soirée mémorable.
          </p>
        </div>

        {/* 4 Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Horaires */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white mb-3">
                Horaires d'Ouverture
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">Mar. – Jeu. :</span>
                  <span className="font-semibold text-white">10h-12h30 / 14h-19h</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1.5 text-indigo-300 font-semibold">
                  <span>Vendredi (Nocturne TCG) :</span>
                  <span>10h-12h30 / 14h-00h</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1.5 text-amber-300 font-semibold">
                  <span>Samedi (Nocturne Jeux) :</span>
                  <span>10h00 – 00h00</span>
                </li>
                <li className="flex justify-between text-slate-500 pt-1">
                  <span>Dimanche & Lundi :</span>
                  <span>Fermé</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Tarif Soirée */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white mb-2">
                Tarif Accès Soirée
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-extrabold font-['Outfit'] text-amber-300">4 €</span>
                <span className="text-xs text-slate-400">/ joueur par soirée</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Donne un accès illimité aux 200+ jeux de 19h à minuit, avec aide aux règles par l'équipe.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300 font-medium">
                ★ 4 € déduits pour tout achat de jeu supérieur à 30 € le soir même !
              </div>
            </div>
          </div>

          {/* Card 3: Restauration & Bar */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white mb-3">
                Boissons & Grignotages
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Une carte locale pour agrémenter vos parties :
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  Bières artisanales normandes
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  Cidres fermiers & jus de pomme bio
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  Planches saucissons & fromages
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400" />
                  Cookies maison & friandises
                </li>
              </ul>
            </div>
          </div>

          {/* Card 4: Localisation & Contact */}
          <div className="p-6 rounded-2xl bg-[#101726] border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white mb-2">
                Adresse & Contact
              </h3>
              <p className="text-xs text-slate-200 font-semibold mb-1">
                32 rue Gaston Manneville
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Avenue des Résistants · 14160 Dives-sur-Mer
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <a
                  href="tel:0231240000"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <span>02 31 24 14 60</span>
                </a>
                <a
                  href="mailto:contact@lemeepleconquerant.fr"
                  className="flex items-center gap-2 hover:text-white transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">contact@lemeepleconquerant.fr</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Access & Interactive stylized map */}
        <div className="rounded-3xl bg-[#101726] border border-white/10 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold font-['Outfit'] text-white">
              Comment venir nous voir ?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              La boutique et le café sont situés à l'angle stratégique de la rue Gaston Manneville et de l'Avenue des Résistants, en plein centre de Dives-sur-Mer.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-orange-400 flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">En Voiture & Stationnement</h4>
                  <p className="text-xs text-slate-300">
                    Nombreuses places gratuites à moins de 2 minutes à pied : parking de la Halle Guillaume le Conquérant et le long de l'Avenue des Résistants.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">En Train / Transports</h4>
                  <p className="text-xs text-slate-300">
                    Gare de Dives-Cabourg à seulement 450 mètres (ligne Trouville-Deauville / Dives). Lignes de bus Nomad Normandie à proximité immédiate.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=32+rue+Gaston+Manneville+14160+Dives-sur-Mer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-white/15 transition-colors shadow-md"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Ouvrir l'itinéraire Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Stylized interactive Map Frame */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1422] aspect-[16/10] flex flex-col items-center justify-center p-6 text-center shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3 animate-bounce">
              <MapPin className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold font-['Outfit'] text-white mb-1">
              Le Meeple Conquérant
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              32 rue Gaston Manneville / Avenue des Résistants<br />
              14160 Dives-sur-Mer (Calvados)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="px-2 py-1 rounded bg-black/40 border border-white/10">À 5 min de Cabourg</span>
              <span className="px-2 py-1 rounded bg-black/40 border border-white/10">À 25 min de Caen</span>
              <span className="px-2 py-1 rounded bg-black/40 border border-white/10">À 20 min de Deauville</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
