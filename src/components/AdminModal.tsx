import React, { useState, useEffect } from 'react';
import { GameSlot, Reservation, GameItem, EveningType } from '../types';
import {
  X,
  Lock,
  Settings,
  Calendar,
  Users,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Search,
  LogOut,
  Save,
  ShoppingBag,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  addSlot,
  updateSlot,
  deleteSlot,
  toggleSlotActive,
  updateSlotSeats,
  makeReservation,
  cancelReservation,
  exportReservationsToCSV,
  resetDemoData,
  addGame,
  updateGame,
  deleteGame,
  parseFrenchDateToISO
} from '../utils/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: GameSlot[];
  reservations: Reservation[];
  games: GameItem[];
  onDataChanged: () => void;
}

const FRENCH_MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const FRENCH_DAY_NAMES = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

const FRENCH_SHORT_DAYS = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
const FRENCH_SHORT_MONTHS = ['Jan.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  slots,
  reservations,
  games,
  onDataChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'slots' | 'reservations' | 'new-slot' | 'boutique'>('slots');

  // Inline confirmations to avoid window.confirm (which fails in iframes)
  const [confirmDeleteSlotId, setConfirmDeleteSlotId] = useState<string | null>(null);
  const [confirmCancelResId, setConfirmCancelResId] = useState<string | null>(null);
  const [confirmDeleteGameId, setConfirmDeleteGameId] = useState<string | null>(null);
  const [confirmResetDemo, setConfirmResetDemo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search states for reservations
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing a slot
  const [editingSlot, setEditingSlot] = useState<GameSlot | null>(null);

  // Editing / adding a game
  const [editingGame, setEditingGame] = useState<GameItem | null>(null);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [gameTitle, setGameTitle] = useState('');
  const [gameSubtitle, setGameSubtitle] = useState('');
  const [gameCategory, setGameCategory] = useState<'plateau' | 'tcg' | 'ambiance' | 'enquete' | 'experts' | 'accessoires'>('plateau');
  const [gameCategoryLabel, setGameCategoryLabel] = useState('Jeux de Plateau');
  const [gamePlayers, setGamePlayers] = useState('2 - 4 joueurs');
  const [gameDuration, setGameDuration] = useState('30 - 45 min');
  const [gameAge, setGameAge] = useState('10 ans +');
  const [gameDifficulty, setGameDifficulty] = useState<'Facile' | 'Intermédiaire' | 'Expert'>('Intermédiaire');
  const [gamePrice, setGamePrice] = useState('34,90 €');
  const [gameTag, setGameTag] = useState('Nouveauté');
  const [gameInCafe, setGameInCafe] = useState(true);
  const [gameDescription, setGameDescription] = useState('');

  // Manual reservation form state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualSlotId, setManualSlotId] = useState('');
  const [manualFirstName, setManualFirstName] = useState('');
  const [manualLastName, setManualLastName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualSeats, setManualSeats] = useState(1);
  const [manualComment, setManualComment] = useState('Réservation comptoir / téléphone');

  // New slot form state with datepicker
  const [newIsoDate, setNewIsoDate] = useState('2026-10-30');
  const [newType, setNewType] = useState<EveningType>('tcg');
  const [newTitle, setNewTitle] = useState('Soirée TCG Magic & Lorcana');
  const [newSubtitle, setNewSubtitle] = useState('Tournois amicaux et tables de prêt');
  const [newDateStr, setNewDateStr] = useState('Vendredi 30 Octobre 2026');
  const [newShortDate, setNewShortDate] = useState('Ven. 30 Oct.');
  const [newStartTime, setNewStartTime] = useState('19h00');
  const [newEndTime, setNewEndTime] = useState('00h00');
  const [newTotalSeats, setNewTotalSeats] = useState(24);
  const [newPrice, setNewPrice] = useState(4);
  const [newHostName, setNewHostName] = useState('Équipe Meeple');
  const [newThemes, setNewThemes] = useState('Magic, Lorcana, Échanges');
  const [newDescription, setNewDescription] = useState('Venez jouer et partager une soirée conviviale au café-jeux !');

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // When datepicker changes, compute day of week, titles and dates
  const handleDateChange = (val: string) => {
    setNewIsoDate(val);
    if (!val) return;
    const d = new Date(val + 'T12:00:00');
    if (isNaN(d.getTime())) return;

    const dayOfWeek = d.getDay(); // 5 = Friday, 6 = Saturday
    const dayName = FRENCH_DAY_NAMES[dayOfWeek];
    const shortDay = FRENCH_SHORT_DAYS[dayOfWeek];
    const dayNum = d.getDate();
    const monthName = FRENCH_MONTH_NAMES[d.getMonth()];
    const shortMonth = FRENCH_SHORT_MONTHS[d.getMonth()];
    const year = d.getFullYear();

    const formattedDateStr = `${dayName} ${dayNum} ${monthName} ${year}`;
    const formattedShortDate = `${shortDay} ${dayNum} ${shortMonth}`;

    setNewDateStr(formattedDateStr);
    setNewShortDate(formattedShortDate);

    // Auto set type if Friday vs Saturday
    if (dayOfWeek === 5) {
      setNewType('tcg');
      setNewTitle('Soirée TCG : Tournoi & Initiations');
      setNewSubtitle('Magic, Pokémon, Lorcana, One Piece');
      setNewThemes('Magic Modern, Disney Lorcana, Échanges');
    } else {
      setNewType('boardgame');
      setNewTitle('Soirée Jeux de Société & Découvertes');
      setNewSubtitle('Plus de 200 jeux en libre accès avec animateurs');
      setNewThemes('Ambiance, Pose d\'ouvriers, Coopératif');
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPinInput('');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    onClose();
  };

  // Toggle active/inactive
  const handleToggleActive = (slotId: string) => {
    toggleSlotActive(slotId);
    onDataChanged();
    showToast('Statut de la soirée mis à jour avec succès.');
  };

  // Quick seat adjust
  const handleAdjustSeats = (slotId: string, currentTotal: number, delta: number) => {
    const newTotal = Math.max(1, currentTotal + delta);
    updateSlotSeats(slotId, newTotal);
    onDataChanged();
    showToast(`Capacité ajustée à ${newTotal} places.`);
  };

  // Delete slot execution
  const handleExecuteDeleteSlot = (slotId: string) => {
    deleteSlot(slotId);
    setConfirmDeleteSlotId(null);
    onDataChanged();
    showToast('Soirée supprimée du planning.');
  };

  // Save edited slot
  const handleSaveEditedSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    updateSlot(editingSlot);
    setEditingSlot(null);
    onDataChanged();
    showToast('Modifications enregistrées !');
  };

  // Create new slot
  const handleCreateNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `slot-${newType}-${newIsoDate}-${Date.now().toString(36)}`;
    const slot: GameSlot = {
      id,
      type: newType,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim(),
      dateStr: newDateStr.trim(),
      shortDate: newShortDate.trim(),
      isoDate: newIsoDate,
      startTime: newStartTime.trim(),
      endTime: newEndTime.trim(),
      totalSeats: Number(newTotalSeats),
      bookedSeats: 0,
      featuredThemes: newThemes.split(',').map((t) => t.trim()).filter(Boolean),
      description: newDescription.trim(),
      hostName: newHostName.trim(),
      pricePerSeat: Number(newPrice),
      isActive: true,
    };
    addSlot(slot);
    onDataChanged();
    setActiveTab('slots');
    showToast(`La soirée "${slot.title}" a été créée et classée chronologiquement !`);
  };

  // Handle manual reservation
  const handleCreateManualReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSlotId) {
      showToast('Veuillez sélectionner une soirée.');
      return;
    }
    const res = makeReservation({
      slotId: manualSlotId,
      firstName: manualFirstName.trim() || 'Client',
      lastName: manualLastName.trim() || 'Comptoir',
      email: manualEmail.trim() || 'boutique@lemeepleconquerant.fr',
      phone: manualPhone.trim() || '02 31 24 14 60',
      seatsCount: Number(manualSeats),
      comment: manualComment.trim(),
      isManual: true,
    });

    if (res.success) {
      onDataChanged();
      setManualModalOpen(false);
      setManualFirstName('');
      setManualLastName('');
      setManualPhone('');
      setManualEmail('');
      setManualSeats(1);
      showToast('Inscription manuelle enregistrée et places décomptées en direct !');
    } else {
      showToast(res.error || 'Erreur lors de la réservation manuelle.');
    }
  };

  // Handle cancel registration execution
  const handleExecuteCancelRegistration = (resId: string) => {
    cancelReservation(resId);
    setConfirmCancelResId(null);
    onDataChanged();
    showToast('Inscription annulée et places remises à disposition.');
  };

  // Game management handlers
  const handleOpenAddGame = () => {
    setEditingGame(null);
    setGameTitle('');
    setGameSubtitle('');
    setGameCategory('plateau');
    setGameCategoryLabel('Jeux de Plateau');
    setGamePlayers('2 - 4 joueurs');
    setGameDuration('30 - 45 min');
    setGameAge('10 ans +');
    setGameDifficulty('Intermédiaire');
    setGamePrice('34,90 €');
    setGameTag('Nouveauté');
    setGameInCafe(true);
    setGameDescription('');
    setIsAddingGame(true);
  };

  const handleOpenEditGame = (game: GameItem) => {
    setEditingGame(game);
    setGameTitle(game.title);
    setGameSubtitle(game.subtitle || '');
    setGameCategory(game.category);
    setGameCategoryLabel(game.categoryLabel);
    setGamePlayers(game.players);
    setGameDuration(game.duration);
    setGameAge(game.age);
    setGameDifficulty(game.difficulty);
    setGamePrice(game.priceEstimate);
    setGameTag(game.tag);
    setGameInCafe(game.inCafePlayable);
    setGameDescription(game.description);
    setIsAddingGame(true);
  };

  const handleSaveGameForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) {
      showToast('Veuillez saisir au moins un titre de jeu.');
      return;
    }

    const catLabels: Record<string, string> = {
      plateau: 'Jeux de Plateau',
      tcg: 'TCG & Cartes',
      ambiance: 'Jeux d\'Ambiance',
      enquete: 'Enquêtes & Énigmes',
      experts: 'Jeux Experts',
      accessoires: 'Accessoires',
    };

    const item: GameItem = {
      id: editingGame ? editingGame.id : `game-${Date.now()}`,
      title: gameTitle.trim(),
      subtitle: gameSubtitle.trim() || undefined,
      category: gameCategory,
      categoryLabel: catLabels[gameCategory] || 'Jeux de Plateau',
      players: gamePlayers.trim(),
      duration: gameDuration.trim(),
      age: gameAge.trim(),
      difficulty: gameDifficulty,
      priceEstimate: gamePrice.trim(),
      tag: gameTag.trim(),
      inCafePlayable: gameInCafe,
      description: gameDescription.trim(),
    };

    if (editingGame) {
      updateGame(item);
      showToast(`Le jeu "${item.title}" a été mis à jour !`);
    } else {
      addGame(item);
      showToast(`Le jeu "${item.title}" a été ajouté à la boutique !`);
    }

    setIsAddingGame(false);
    setEditingGame(null);
    onDataChanged();
  };

  const handleExecuteDeleteGame = (gameId: string) => {
    deleteGame(gameId);
    setConfirmDeleteGameId(null);
    onDataChanged();
    showToast('Jeu retiré du catalogue boutique.');
  };

  // Filtered reservations list
  const filteredReservations = reservations.filter((r) => {
    const matchesSlot = selectedSlotFilter === 'all' || r.slotId === selectedSlotFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.ticketCode.toLowerCase().includes(q);
    return matchesSlot && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-white/20 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
                  Espace Gérants · Le Meeple Conquérant
                </h3>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Connecté
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Gestion des soirées du week-end, catalogue boutique & réservations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Toast inside Modal */}
        {toastMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold font-['Outfit'] text-white mb-2">
                Connexion Gérant Sécurisée
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Cet espace est réservé à l'équipe du Meeple Conquérant pour piloter les soirées, le catalogue et les inscriptions.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mot de passe ou Code PIN Gérant
                  </label>
                  <input
                    type="password"
                    required
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Entrez votre code (ex. 14160)"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 focus:border-orange-500 focus:outline-none text-white text-sm"
                  />
                  {authError && (
                    <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Code erroné. (Indice : code postal de Dives 14160)
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2">
                    Code par défaut : <code className="text-amber-400 font-mono">14160</code> ou <code className="text-amber-400 font-mono">meeple14160</code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Accéder à l'administration
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD */
            <div>
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('slots');
                    setEditingSlot(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'slots'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Soirées & Places ({slots.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reservations');
                    setEditingSlot(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'reservations'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Inscrits & Export ({reservations.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('boutique');
                    setIsAddingGame(false);
                    setEditingGame(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'boutique'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Catalogue Boutique ({games.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('new-slot');
                    setEditingSlot(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'new-slot'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer une Soirée</span>
                </button>
              </div>

              {/* TAB 1: SOIRÉES & PLACES */}
              {activeTab === 'slots' && !editingSlot && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-300">
                      Les soirées sont automatiquement <strong className="text-emerald-400">classées par ordre chronologique (du plus tôt au plus tard)</strong>.
                    </p>

                    {confirmResetDemo ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-rose-300 font-semibold">Réinitialiser ?</span>
                        <button
                          type="button"
                          onClick={() => {
                            resetDemoData();
                            setConfirmResetDemo(false);
                            onDataChanged();
                            showToast('Données démo réinitialisées.');
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmResetDemo(false)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmResetDemo(true)}
                        className="text-xs text-slate-400 hover:text-slate-200 underline self-start sm:self-auto cursor-pointer"
                      >
                        Réinitialiser démo
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {slots.map((slot) => {
                      const seatsRemaining = Math.max(0, slot.totalSeats - slot.bookedSeats);
                      const isFull = seatsRemaining === 0;
                      const isActive = slot.isActive !== false;
                      const isConfirmingDelete = confirmDeleteSlotId === slot.id;

                      return (
                        <div
                          key={slot.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            !isActive
                              ? 'bg-slate-900/40 border-white/5 opacity-60'
                              : 'bg-slate-900 border-white/10'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Left: Info */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                    slot.type === 'tcg'
                                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                  }`}
                                >
                                  {slot.type === 'tcg' ? 'Vendredi TCG' : 'Samedi Jeux'}
                                </span>
                                <span className="text-xs font-bold text-white">
                                  {slot.dateStr}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                  [{slot.isoDate}]
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    isActive
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}
                                >
                                  {isActive ? 'Actif' : 'Désactivé'}
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-white font-['Outfit']">
                                {slot.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {slot.subtitle}
                              </p>
                            </div>

                            {/* Middle: Seats Gauge & Fast Adjusters */}
                            <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-white/10">
                              <div className="text-center min-w-[110px]">
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                                  Places occupées
                                </span>
                                <span className="text-sm font-bold font-mono text-white">
                                  <span className="text-orange-400">{slot.bookedSeats}</span> / {slot.totalSeats}
                                </span>
                                <span
                                  className={`text-[11px] block font-semibold ${
                                    isFull ? 'text-rose-400' : 'text-emerald-400'
                                  }`}
                                >
                                  {isFull ? 'Complet' : `${seatsRemaining} dispo`}
                                </span>
                              </div>

                              {/* Plus/minus buttons to adjust capacity */}
                              <div className="flex flex-col gap-1 border-l border-white/10 pl-3">
                                <span className="text-[10px] text-slate-400">Total chaises :</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustSeats(slot.id, slot.totalSeats, -2)}
                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                                    title="Diminuer la capacité de 2 places"
                                  >
                                    -2
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustSeats(slot.id, slot.totalSeats, +2)}
                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer"
                                    title="Augmenter la capacité de 2 places"
                                  >
                                    +2
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2">
                              {/* Toggle active button */}
                              <button
                                type="button"
                                onClick={() => handleToggleActive(slot.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  isActive
                                    ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                                    : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                                }`}
                                title={isActive ? 'Désactiver la soirée' : 'Réactiver la soirée'}
                              >
                                {isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{isActive ? 'Désactiver' : 'Activer'}</span>
                              </button>

                              {/* Edit details */}
                              <button
                                type="button"
                                onClick={() => setEditingSlot(slot)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                                title="Modifier la soirée"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete with inline confirmation */}
                              {isConfirmingDelete ? (
                                <div className="flex items-center gap-1 bg-rose-500/20 p-1.5 rounded-xl border border-rose-500/30">
                                  <span className="text-[11px] text-rose-300 px-1 font-semibold">Sûr ?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleExecuteDeleteSlot(slot.id)}
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteSlotId(null)}
                                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteSlotId(slot.id)}
                                  className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                                  title="Supprimer la soirée"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* EDITING A SLOT */}
              {editingSlot && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-orange-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      Modifier la soirée : {editingSlot.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingSlot(null)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedSlot} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Titre de la soirée
                        </label>
                        <input
                          type="text"
                          required
                          value={editingSlot.title}
                          onChange={(e) => setEditingSlot({ ...editingSlot, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Date ISO (AAAA-MM-JJ pour le classement)
                        </label>
                        <input
                          type="date"
                          required
                          value={editingSlot.isoDate || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              const d = new Date(val + 'T12:00:00');
                              const dayName = FRENCH_DAY_NAMES[d.getDay()];
                              const shortDay = FRENCH_SHORT_DAYS[d.getDay()];
                              const monthName = FRENCH_MONTH_NAMES[d.getMonth()];
                              const shortMonth = FRENCH_SHORT_MONTHS[d.getMonth()];
                              setEditingSlot({
                                ...editingSlot,
                                isoDate: val,
                                dateStr: `${dayName} ${d.getDate()} ${monthName} ${d.getFullYear()}`,
                                shortDate: `${shortDay} ${d.getDate()} ${shortMonth}`,
                              });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nombre total de places
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editingSlot.totalSeats}
                          onChange={(e) =>
                            setEditingSlot({ ...editingSlot, totalSeats: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Places déjà réservées
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={editingSlot.bookedSeats}
                          onChange={(e) =>
                            setEditingSlot({ ...editingSlot, bookedSeats: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Tarif par joueur (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={editingSlot.pricePerSeat}
                          onChange={(e) =>
                            setEditingSlot({ ...editingSlot, pricePerSeat: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Sous-titre / Thème vedette
                      </label>
                      <input
                        type="text"
                        value={editingSlot.subtitle}
                        onChange={(e) => setEditingSlot({ ...editingSlot, subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingSlot(null)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Enregistrer les modifications</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: INSCRIPTIONS & EXPORT */}
              {activeTab === 'reservations' && (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={selectedSlotFilter}
                        onChange={(e) => setSelectedSlotFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white focus:outline-none"
                      >
                        <option value="all">Toutes les soirées ({reservations.length} inscrits)</option>
                        {slots.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.shortDate} — {s.title}
                          </option>
                        ))}
                      </select>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Rechercher nom, email, tél..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white focus:outline-none w-48 sm:w-60"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setManualSlotId(slots[0]?.id || '');
                          setManualModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajout manuel (Comptoir/Tél)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const res = exportReservationsToCSV(selectedSlotFilter === 'all' ? undefined : selectedSlotFilter);
                          if (res.message) {
                            showToast(res.message);
                          } else {
                            showToast('Fichier Excel / CSV téléchargé !');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md whitespace-nowrap cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Exporter CSV / Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Reservations Table / Cards */}
                  {filteredReservations.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5 p-6">
                      <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-300 font-medium">Aucune inscription trouvée.</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Les inscriptions prises sur le site ou au comptoir s'afficheront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredReservations.map((res) => {
                        const isConfirmingCancel = confirmCancelResId === res.id;

                        return (
                          <div
                            key={res.id}
                            className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-400">
                                  {res.ticketCode}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="font-bold text-white text-sm">
                                  {res.firstName} {res.lastName}
                                </span>
                                <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-bold">
                                  {res.seatsCount} place(s)
                                </span>
                                {res.isManual && (
                                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                    Comptoir
                                  </span>
                                )}
                              </div>

                              <div className="text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="text-slate-400">{res.slotDate} ({res.slotTime})</span>
                                <a href={`tel:${res.phone}`} className="flex items-center gap-1 hover:text-white">
                                  <Phone className="w-3 h-3 text-orange-400" /> {res.phone}
                                </a>
                                <a href={`mailto:${res.email}`} className="flex items-center gap-1 hover:text-white">
                                  <Mail className="w-3 h-3 text-orange-400" /> {res.email}
                                </a>
                              </div>

                              {res.comment && (
                                <p className="text-[11px] text-slate-400 italic bg-black/30 p-1.5 rounded">
                                  Note : {res.comment}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center sm:self-center">
                              {isConfirmingCancel ? (
                                <div className="flex items-center gap-1 bg-rose-500/20 p-1.5 rounded-xl border border-rose-500/30">
                                  <span className="text-[11px] text-rose-300 px-1 font-semibold">Annuler ?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleExecuteCancelRegistration(res.id)}
                                    className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmCancelResId(null)}
                                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmCancelResId(res.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title="Annuler cette réservation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Annuler l'inscription</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CATALOGUE BOUTIQUE (+2000 RÉFÉRENCES) */}
              {activeTab === 'boutique' && (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Outfit']">
                        Références mises en avant en Boutique ({games.length})
                      </h4>
                      <p className="text-xs text-slate-400">
                        Ajoutez, modifiez le prix, le statut ou la description des jeux de la boutique.
                      </p>
                    </div>

                    {!isAddingGame && (
                      <button
                        type="button"
                        onClick={handleOpenAddGame}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-md cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un jeu</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Game Form */}
                  {isAddingGame && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-orange-500/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-base font-bold text-white font-['Outfit']">
                          {editingGame ? `Modifier le jeu : ${editingGame.title}` : 'Ajouter un nouveau jeu en boutique'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingGame(false);
                            setEditingGame(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Fermer
                        </button>
                      </div>

                      <form onSubmit={handleSaveGameForm} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Nom du jeu <span className="text-orange-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={gameTitle}
                              onChange={(e) => setGameTitle(e.target.value)}
                              placeholder="Ex: Harmonies, Dune Imperium..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Sous-titre ou accroche
                            </label>
                            <input
                              type="text"
                              value={gameSubtitle}
                              onChange={(e) => setGameSubtitle(e.target.value)}
                              placeholder="Ex: Poésie visuelle et création d'écosystèmes"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Catégorie
                            </label>
                            <select
                              value={gameCategory}
                              onChange={(e) => setGameCategory(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            >
                              <option value="plateau">Jeux de Plateau</option>
                              <option value="tcg">TCG & Cartes</option>
                              <option value="ambiance">Jeux d'Ambiance</option>
                              <option value="enquete">Enquêtes & Énigmes</option>
                              <option value="experts">Jeux Experts</option>
                              <option value="accessoires">Accessoires</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Prix indicatif
                            </label>
                            <input
                              type="text"
                              value={gamePrice}
                              onChange={(e) => setGamePrice(e.target.value)}
                              placeholder="Ex: 34,90 €"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Badge / Tag
                            </label>
                            <input
                              type="text"
                              value={gameTag}
                              onChange={(e) => setGameTag(e.target.value)}
                              placeholder="Ex: Coup de Cœur, As d'Or..."
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Nombre de joueurs
                            </label>
                            <input
                              type="text"
                              value={gamePlayers}
                              onChange={(e) => setGamePlayers(e.target.value)}
                              placeholder="Ex: 1 - 4 joueurs"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Durée moyenne
                            </label>
                            <input
                              type="text"
                              value={gameDuration}
                              onChange={(e) => setGameDuration(e.target.value)}
                              placeholder="Ex: 30 - 45 min"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Âge recommandé
                            </label>
                            <input
                              type="text"
                              value={gameAge}
                              onChange={(e) => setGameAge(e.target.value)}
                              placeholder="Ex: 10 ans +"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">
                              Difficulté
                            </label>
                            <select
                              value={gameDifficulty}
                              onChange={(e) => setGameDifficulty(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                            >
                              <option value="Facile">Facile</option>
                              <option value="Intermédiaire">Intermédiaire</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-white/10">
                          <input
                            type="checkbox"
                            id="gameInCafe"
                            checked={gameInCafe}
                            onChange={(e) => setGameInCafe(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-0"
                          />
                          <label htmlFor="gameInCafe" className="text-slate-300 cursor-pointer">
                            Jouable sur place au café-jeux (exemplaire de démo disponible pour les clients)
                          </label>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Description du jeu
                          </label>
                          <textarea
                            rows={3}
                            value={gameDescription}
                            onChange={(e) => setGameDescription(e.target.value)}
                            placeholder="Pourquoi ce jeu est génial, le principe..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingGame(false);
                              setEditingGame(null);
                            }}
                            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md cursor-pointer"
                          >
                            {editingGame ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Games List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {games.map((g) => {
                      const isConfirmingDelete = confirmDeleteGameId === g.id;

                      return (
                        <div
                          key={g.id}
                          className="p-4 rounded-xl bg-slate-900 border border-white/10 flex flex-col justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                {g.tag}
                              </span>
                              <span className="font-mono font-bold text-white text-sm">
                                {g.priceEstimate}
                              </span>
                            </div>

                            <h5 className="font-bold text-white text-sm font-['Outfit']">
                              {g.title}
                            </h5>
                            {g.subtitle && (
                              <p className="text-slate-400 italic text-[11px] mb-1">{g.subtitle}</p>
                            )}
                            <p className="text-slate-300 line-clamp-2 text-[11px] mb-2">{g.description}</p>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400">
                              <span>{g.players}</span>
                              <span>·</span>
                              <span>{g.duration}</span>
                              <span>·</span>
                              <span className="text-amber-400">{g.difficulty}</span>
                              {g.inCafePlayable && (
                                <span className="text-orange-400 flex items-center gap-1 ml-auto">
                                  <Coffee className="w-3 h-3" /> Café
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditGame(g)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Modifier</span>
                            </button>

                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1 bg-rose-500/20 p-1 rounded-lg border border-rose-500/30">
                                <span className="text-[10px] text-rose-300 px-1 font-semibold">Supprimer ?</span>
                                <button
                                  type="button"
                                  onClick={() => handleExecuteDeleteGame(g.id)}
                                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Oui
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteGameId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                                >
                                  Non
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteGameId(g.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                                title="Supprimer ce jeu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: CREATE NEW SLOT */}
              {activeTab === 'new-slot' && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <h4 className="text-lg font-bold text-white font-['Outfit']">
                      Créer une nouvelle Soirée
                    </h4>
                    <p className="text-xs text-slate-400">
                      Sélectionnez simplement la date sur le calendrier : le jour de la semaine et le type de soirée (Vendredi TCG ou Samedi Jeux) sont configurés automatiquement !
                    </p>
                  </div>

                  <form onSubmit={handleCreateNewSlot} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Datepicker */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          1. Choisir la date dans le calendrier <span className="text-orange-400">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newIsoDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-orange-500/50 text-white text-xs focus:outline-none"
                        />
                      </div>

                      {/* Evening Type */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          2. Type de soirée
                        </label>
                        <select
                          value={newType}
                          onChange={(e) => {
                            const val = e.target.value as EveningType;
                            setNewType(val);
                            if (val === 'tcg') {
                              setNewTitle('Soirée TCG : Tournoi & Initiations');
                              setNewSubtitle('Magic, Pokémon, Lorcana, One Piece');
                            } else {
                              setNewTitle('Soirée Jeux de Société & Découvertes');
                              setNewSubtitle('Plus de 200 jeux en libre accès avec animateurs');
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none"
                        >
                          <option value="tcg">Vendredi soir — Soirée TCG (Cartes)</option>
                          <option value="boardgame">Samedi soir — Jeux de Société (+200 jeux)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          3. Date calculée automatiquement
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={newDateStr}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/10 text-amber-300 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Titre public de la soirée
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Sous-titre / Jeux phares
                        </label>
                        <input
                          type="text"
                          value={newSubtitle}
                          onChange={(e) => setNewSubtitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Nombre total de places
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={newTotalSeats}
                          onChange={(e) => setNewTotalSeats(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Horaires (Début – Fin)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs text-center"
                          />
                          <input
                            type="text"
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Tarif par joueur (€)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Thèmes vedettes (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        value={newThemes}
                        onChange={(e) => setNewThemes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                        placeholder="Ex: Magic Modern, Draft Lorcana, Échanges"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Description de la soirée
                      </label>
                      <textarea
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs"
                      />
                    </div>

                    <div className="pt-2 text-right">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md cursor-pointer"
                      >
                        Publier cette soirée (Classée chronologiquement)
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Le Meeple Conquérant · Interface de Gestion Sécurisée</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Manual Registration Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#101726] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-base font-bold text-white font-['Outfit']">
                Inscription Comptoir ou Téléphone
              </h4>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualReservation} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Choisir la soirée
                </label>
                <select
                  value={manualSlotId}
                  onChange={(e) => setManualSlotId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shortDate} ({s.totalSeats - s.bookedSeats} places libres) — {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={manualFirstName}
                    onChange={(e) => setManualFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={manualLastName}
                    onChange={(e) => setManualLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nb places</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={manualSeats}
                    onChange={(e) => setManualSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email (facultatif)</label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="contact@exemple.fr"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Note gérant</label>
                <input
                  type="text"
                  value={manualComment}
                  onChange={(e) => setManualComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
                >
                  Enregistrer l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
