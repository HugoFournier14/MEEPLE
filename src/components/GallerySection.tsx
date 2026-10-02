import React, { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/mockData';
import { ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_PHOTOS.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev === GALLERY_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const activePhoto = GALLERY_PHOTOS[currentIndex];

  return (
    <section id="galerie" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#0b0f19] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mb-3">
            05. Immersion Visuelle
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white tracking-tight leading-tight">
            L'Atmosphère du Meeple Conquérant
          </h2>
          <p className="mt-3 text-base text-slate-300 font-normal">
            Lumières tamisées, rires complices, concentration au sommet d'un tournoi TCG et découverte de nouveaux mondes ludiques à Dives-sur-Mer.
          </p>
        </div>

        {/* Big Single Photo Showcase with Modern Navigation */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 aspect-[16/9] sm:aspect-[16/10] group">
            {/* Image */}
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Top Tag & Counter */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="text-xs font-bold text-amber-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                {activePhoto.tag}
              </span>

              <span className="font-mono text-xs font-semibold text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                {currentIndex + 1} / {GALLERY_PHOTOS.length}
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 pointer-events-none">
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-white mb-1 drop-shadow-md">
                {activePhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl drop-shadow">
                {activePhoto.description}
              </p>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevPhoto}
              aria-label="Photo précédente"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Photo suivante"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 h-2.5 bg-orange-500 shadow-sm shadow-orange-500/50'
                    : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Aller à la photo ${idx + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails Strip */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6">
            {GALLERY_PHOTOS.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative rounded-xl overflow-hidden aspect-[4/3] border transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-orange-500 ring-2 ring-orange-500/40 opacity-100 scale-[1.02]'
                    : 'border-white/10 opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
