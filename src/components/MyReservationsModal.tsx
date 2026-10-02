import React, { useState } from 'react';
import { Reservation } from '../types';
import { X, Ticket, CalendarCheck, Trash2, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cancelReservation, generateCalendarUrl } from '../utils/storage';

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onReservationUpdated: () => void;
}

export const MyReservationsModal: React.FC<MyReservationsModalProps> = ({
  isOpen,
  onClose,
  reservations,
  onReservationUpdated,
}) => {
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelledFeedback, setCancelledFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteCancel = (resId: string) => {
    const success = cancelReservation(resId);
    if (success) {
      setConfirmCancelId(null);
      setCancelledFeedback('Votre réservation a bien été annulée et la place a été libérée.');
      onReservationUpdated();
      setTimeout(() => {
        setCancelledFeedback(null);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101726] border border-white/15 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              Mes Réservations de Soirée
            </h3>
            <p className="text-xs text-slate-300">
              Historique de vos inscriptions actives sur cet appareil.
            </p>
          </div>
        </div>

        {cancelledFeedback && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{cancelledFeedback}</span>
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/60 rounded-2xl border border-white/5 p-6">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">Aucune réservation active pour le moment.</p>
            <p className="text-xs text-slate-500 mt-1">
              Réservez une soirée dès maintenant pour vendredi (TCG) ou samedi (Jeux de société) !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => {
              const isConfirming = confirmCancelId === res.id;

              return (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        res.type === 'tcg'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}
                    >
                      {res.type === 'tcg' ? 'Vendredi TCG' : 'Samedi Jeux'}
                    </span>

                    <span className="font-mono text-xs font-bold text-amber-300">
                      N° {res.ticketCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{res.slotTitle}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {res.slotDate} · {res.slotTime}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Réservé pour : <strong className="text-white">{res.seatsCount} personne(s)</strong>
                    </span>
                    <span>Au nom de : {res.firstName} {res.lastName}</span>
                  </div>

                  {/* Inline Cancel Confirmation */}
                  {isConfirming ? (
                    <div className="pt-3 border-t border-rose-500/20 bg-rose-500/10 -mx-5 -mb-3 p-4 rounded-b-2xl">
                      <p className="text-xs text-rose-300 font-medium mb-3">
                        Voulez-vous vraiment annuler votre place pour cette soirée ? Les places seront immédiatement remises à disposition du public.
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                        >
                          Conserver ma place
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExecuteCancel(res.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
                        >
                          Oui, confirmer l'annulation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <a
                        href={generateCalendarUrl(res)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>Ajouter à l'agenda</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(res.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer py-1 px-2 rounded-md hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Annuler ma réservation</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
