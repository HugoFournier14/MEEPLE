import React, { useState, useEffect } from 'react';
import { Menu, X, CalendarCheck, Ticket } from 'lucide-react';
import { getStoredReservations } from '../utils/storage';

interface NavbarProps {
  onOpenMyReservations: () => void;
  onNavigateToReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyReservations,
  onNavigateToReservation,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reservationsCount, setReservationsCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      setReservationsCount(getStoredReservations().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    // Polling event for local updates
    const interval = setInterval(updateCount, 2500);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { label: 'Soirées', href: '#soirees' },
    { label: 'Réservations', href: '#reservations' },
    { label: 'La Boutique', href: '#boutique' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Infos Pratiques', href: '#infos' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0f19]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-bold font-['Outfit'] tracking-tight text-white group"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              {/* Meeple SVG logo mark */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <circle cx="12" cy="5" r="3" />
                <path d="M7 9 L3 12 L4 15 L7 13 L6 21 L9 21 L12 17 L15 21 L18 21 L17 13 L20 15 L21 12 L17 9 Z" />
              </svg>
            </span>
            <span>Le Meeple Conquérant</span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-200 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {reservationsCount > 0 && (
              <button
                type="button"
                onClick={onOpenMyReservations}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap"
                title="Consulter mes réservations sur cet appareil"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Mes places ({reservationsCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateToReservation}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.98] rounded-lg shadow-md shadow-orange-500/20 transition-all whitespace-nowrap cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Réserver une soirée</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1424] border-b border-white/10 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-base font-medium text-slate-200 hover:text-orange-400 py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}

            {reservationsCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyReservations();
                }}
                className="flex items-center justify-between text-left text-sm font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg mt-2"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  Mes réservations actives
                </span>
                <span className="bg-amber-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {reservationsCount}
                </span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
