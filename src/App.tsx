/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameSlot, Reservation, GameItem } from './types';
import { getStoredSlots, getStoredReservations, getStoredGames } from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SoireesSection } from './components/SoireesSection';
import { ReservationSection } from './components/ReservationSection';
import { BoutiqueSection } from './components/BoutiqueSection';
import { GallerySection } from './components/GallerySection';
import { InfosPratiquesSection } from './components/InfosPratiquesSection';
import { Footer } from './components/Footer';
import { MyReservationsModal } from './components/MyReservationsModal';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [slots, setSlots] = useState<GameSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [games, setGames] = useState<GameItem[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [myReservationsModalOpen, setMyReservationsModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const refreshData = () => {
    setSlots(getStoredSlots());
    setReservations(getStoredReservations());
    setGames(getStoredGames());
  };

  useEffect(() => {
    refreshData();

    // Listen to real-time custom sync event
    const handleDataChanged = () => {
      refreshData();
    };
    window.addEventListener('meeple_data_changed', handleDataChanged);

    // Check if ?admin=true is present in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' || urlParams.get('gerant') === 'true') {
      setAdminModalOpen(true);
    }

    // Keyboard shortcut for shop managers: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('meeple_data_changed', handleDataChanged);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleScrollToReservation = () => {
    const el = document.getElementById('reservations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToBoutique = () => {
    const el = document.getElementById('boutique');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToHours = () => {
    const el = document.getElementById('infos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    handleScrollToReservation();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#e6eaf2] selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenMyReservations={() => setMyReservationsModalOpen(true)}
        onNavigateToReservation={handleScrollToReservation}
      />

      <main className="flex-grow">
        {/* 1. Hero Section (plein écran, meeple canvas, punchlines, 2 CTAs) */}
        <HeroSection
          onScrollToReservation={handleScrollToReservation}
          onScrollToBoutique={handleScrollToBoutique}
        />

        {/* 2. Qui sommes-nous / Présentation */}
        <AboutSection />

        {/* 3. Section Soirées (Cœur du site: Vendredi TCG & Samedi Jeux avec badges places restantes, tri chronologique) */}
        <SoireesSection
          slots={slots}
          onSelectSlot={handleSelectSlot}
        />

        {/* 4. Outil de réservation intégré (dates triées du plus tôt au plus tard) */}
        <ReservationSection
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSlotSelected={setSelectedSlotId}
          onReservationComplete={refreshData}
        />

        {/* 5. Section Boutique (catalogue dynamique modifiable par le gérant) */}
        <BoutiqueSection
          games={games}
          onScrollToHours={handleScrollToHours}
        />

        {/* 6. Galerie photo (ambiance café-jeux, grande image, flèches, miniatures) */}
        <GallerySection />

        {/* 7. Infos pratiques (Adresse, horaires, tarif soirée 4€, restauration, transports, carte) */}
        <InfosPratiquesSection />
      </main>

      {/* 8. Footer (contact, liens réseaux, mentions légales, accès gérants discret) */}
      <Footer onOpenAdmin={() => setAdminModalOpen(true)} />

      {/* My Reservations Modal */}
      <MyReservationsModal
        isOpen={myReservationsModalOpen}
        onClose={() => setMyReservationsModalOpen(false)}
        reservations={reservations}
        onReservationUpdated={refreshData}
      />

      {/* Admin Interface for Managers */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        slots={slots}
        reservations={reservations}
        games={games}
        onDataChanged={refreshData}
      />
    </div>
  );
}
