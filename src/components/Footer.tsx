import React, { useState } from 'react';
import {
  MessageSquare,
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  Heart,
  X,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);

  return (
    <footer className="bg-[#05080e] border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <circle cx="12" cy="5" r="3" />
                  <path d="M7 9 L3 12 L4 15 L7 13 L6 21 L9 21 L12 17 L15 21 L18 21 L17 13 L20 15 L21 12 L17 9 Z" />
                </svg>
              </span>
              <span className="text-lg font-bold font-['Outfit'] text-white">
                Le Meeple Conquérant
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Boutique spécialisée & Café-Jeux à Dives-sur-Mer. Plus de 2 000 références, soirées TCG le vendredi, soirées jeux de société le samedi.
            </p>
            <p className="text-xs text-amber-400/90 font-medium">
              « Viens jouer. Reste pour la communauté. »
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#presentation" className="hover:text-white transition-colors">
                  Présentation du lieu
                </a>
              </li>
              <li>
                <a href="#soirees" className="hover:text-white transition-colors">
                  Soirées du week-end
                </a>
              </li>
              <li>
                <a href="#reservations" className="hover:text-white transition-colors text-orange-400 font-medium">
                  Réserver une soirée
                </a>
              </li>
              <li>
                <a href="#boutique" className="hover:text-white transition-colors">
                  Notre sélection boutique
                </a>
              </li>
              <li>
                <a href="#galerie" className="hover:text-white transition-colors">
                  Galerie photo
                </a>
              </li>
              <li>
                <a href="#infos" className="hover:text-white transition-colors">
                  Accès & Horaires
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Socials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Communauté
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors text-indigo-400"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discord Communautaire</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram @lemeepleconquerant</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook Le Meeple Conquérant</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Practical Info & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact Direct
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>32 rue Gaston Manneville / Avenue des Résistants, 14160 Dives-sur-Mer</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:0231241460" className="hover:text-white transition-colors">
                  02 31 24 14 60
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:contact@lemeepleconquerant.fr" className="hover:text-white transition-colors">
                  contact@lemeepleconquerant.fr
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Le Meeple Conquérant. Tous droits réservés.</p>
            <span aria-hidden="true" className="hidden sm:inline text-slate-700">·</span>
            <p>
              Site créé par{' '}
              <a
                href="https://hugofournier.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-amber-400 transition-colors font-medium underline underline-offset-2"
              >
                hugofournier.fr
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setLegalModalOpen(true)}
              className="hover:text-slate-300 transition-colors underline cursor-pointer"
            >
              Mentions légales & Confidentialité
            </button>
            <span>Fait avec passion pour le jeu en Normandie</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-slate-600 hover:text-slate-400 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Accès réservé aux gérants de la boutique"
              >
                <span>Accès Gérants</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {legalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#101726] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 text-left relative text-slate-300 text-xs space-y-4">
            <button
              type="button"
              onClick={() => setLegalModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              Mentions Légales & Confidentialité
            </h3>

            <div>
              <h4 className="font-bold text-white mb-1">Éditeur du site</h4>
              <p>Le Meeple Conquérant SARL — Boutique & Café-Jeux</p>
              <p>32 rue Gaston Manneville / Avenue des Résistants, 14160 Dives-sur-Mer</p>
              <p>RCS Lisieux · TVA intracommunautaire : FR84920194821</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">Réservations & Données personnelles</h4>
              <p>
                Les informations recueillies dans le formulaire de réservation (nom, email, téléphone) sont utilisées uniquement pour gérer l'accès aux tables de soirées et vous notifier par email ou SMS en cas de modification. Aucune donnée n'est cédée à des tiers.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">Propriété intellectuelle</h4>
              <p>
                Les logos Magic: The Gathering, Pokémon, Disney Lorcana, One Piece et Star Wars sont la propriété de leurs éditeurs respectifs.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setLegalModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
