import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Layers,
  HeartPulse,
  Clock,
  Apple,
  Bug,
  ShieldCheck,
  FileCode,
  Sparkles
} from 'lucide-react';
import Latex from './Latex';
import {
  DEFAULT_MODEL_PARAMS,
  SCIENTIFIC_PARAMETERS_CATALOG,
  INOCULUM_LEVELS,
  CARRYING_CAPACITY_K
} from '../engine/abmEngine';

export default function ParametersView({
  params = DEFAULT_MODEL_PARAMS,
  onParamsChange = () => {},
  onResetToDefaults = () => {}
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const categories = [
    { id: 'all', label: 'Tous les paramètres', icon: SlidersHorizontal },
    { id: 'demography', label: 'Démographie & Inoculum', icon: Bug },
    { id: 'lifespan', label: 'Durées de vie & Horloge', icon: Clock },
    { id: 'phenology', label: 'Cultures & Horizons', icon: Layers },
    { id: 'reproduction', label: 'Reproduction & TIS', icon: HeartPulse },
    { id: 'fruitHazard', label: 'Vulnérabilité des fruits', icon: Apple }
  ];

  const updateParam = (key, value) => {
    onParamsChange({ ...params, [key]: value });
  };

  const handleReset = () => {
    onResetToDefaults();
    setFeedbackMsg('Paramètres réinitialisés aux valeurs scientifiques de référence.');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(params, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelly_tis_parametres_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* BANDEAU SUPÉRIEUR ÉDITORIAL */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Laboratoire de Paramétrage Expérimental</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] mt-1">
              Paramètres scientifiques du modèle ABM & des simulations
            </h2>
            <p className="text-xs text-[#657068] mt-1 max-w-3xl leading-relaxed">
              Visualisez et ajustez l'ensemble des constantes démographiques, des durées de vie découplées des agents
              (mâles et femelles), des flux d'immigration quotidienne et des caractéristiques de vulnérabilité phénologique
              qui régissent le comportement de <em className="italic font-serif">Drosophila suzukii</em> et des mâles stériles.
            </p>
          </div>

          {/* Boutons d'action rapides */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-white text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#657068]" />
              <span>Valeurs par défaut</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#145A3D] text-white text-xs font-medium hover:bg-[#1E5E41] cursor-pointer shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Exporter JSON</span>
            </button>
          </div>
        </div>

        {/* Message de confirmation discret */}
        {feedbackMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-[#EDF5EB] border border-[#A3C9A6] text-xs text-[#145A3D] flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Onglets de catégories */}
        <div className="flex items-center gap-1.5 pt-4 mt-4 border-t border-[#E8ECE3] overflow-x-auto text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#145A3D] text-white shadow-2xs'
                    : 'text-[#657068] hover:text-[#1B201C] hover:bg-[#F0F2EB]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          GROUPE 1 : DÉMOGRAPHIE, INOCULUM DE DÉPART & MIGRATIONS
         =================================================================== */}
      {(activeCategory === 'all' || activeCategory === 'demography') && (
        <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#EDF5EB] text-[#145A3D]">
                <Bug className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1B201C]">
                  1. Démographie, Inoculum de départ & Capacité de charge (K)
                </h3>
                <p className="text-xs text-[#657068]">
                  Conditions initiales d'infestation, repère de saturation du témoin et immigration quotidienne
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#145A3D] bg-[#DDEADF] px-2 py-0.5 rounded font-bold">
              K = {CARRYING_CAPACITY_K.toLocaleString('fr-FR')} ind. (repère fixe)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Inoculum de départ */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">Inoculum de départ</label>
                <span className="font-mono text-[#145A3D] font-bold">{params.inoculumId}</span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Niveau initial d'adultes fondateurs à J0 dans la parcelle.
              </p>
              <select
                value={params.inoculumId}
                onChange={(e) => updateParam('inoculumId', e.target.value)}
                className="w-full rounded-lg border border-[#D6DDD4] bg-white p-2 text-xs font-medium cursor-pointer"
              >
                {INOCULUM_LEVELS.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} — {inv.total} adultes ({inv.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Capacité de charge K (Ancrage écologique fixe, NON paramètre) */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Capacité de charge biotique (K)
                </label>
                <span className="font-mono text-[#145A3D] font-bold">
                  {CARRYING_CAPACITY_K.toLocaleString('fr-FR')} adultes
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Pic maximal observé sans régulation TIS (témoin). Calibre le niveau d'infestation « Forte » et n'est en aucun cas un paramètre réglable du modèle.
              </p>
              <div className="p-2 rounded-lg bg-white border border-[#D6DDD4] flex items-center justify-between text-[11px]">
                <span className="text-[#657068]">Statut épistémologique :</span>
                <span className="font-mono text-[#145A3D] font-semibold text-[10.5px]">Ancrage fixe de référence</span>
              </div>
            </div>

            {/* Immigration journalière continue */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Immigration quotidienne (m_♀, m_♂)
                </label>
                <span className="font-mono text-[#BF532E] font-bold">
                  {params.dailyMigrationFraiseFemales} ind. / sexe / j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Arrivée continue d'insectes fertiles depuis les lisières forestières et réservoirs sauvages.
              </p>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={params.dailyMigrationFraiseFemales}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateParam('dailyMigrationFraiseFemales', val);
                  updateParam('dailyMigrationFraiseMales', val);
                  updateParam('dailyMigrationCeriseFemales', Math.round(val * 0.53));
                  updateParam('dailyMigrationCeriseMales', Math.round(val * 0.53));
                }}
                className="w-full accent-[#BF532E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>0 ind./j (fermé)</span>
                <span>Défaut : 15 ind./j</span>
                <span>50 ind./j</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          GROUPE 2 : DURÉES DE VIE DES AGENTS DÉCOUPLÉES & HORLOGE BIOLOGIQUE
         =================================================================== */}
      {(activeCategory === 'all' || activeCategory === 'lifespan') && (
        <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#FAF1EC] text-[#BF532E]">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1B201C]">
                  2. Durées de vie des agents (découplées) & Horloge biologique
                </h3>
                <p className="text-xs text-[#657068]">
                  Longévité stochastique découplée des femelles et des mâles sauvages, des mâles stériles et durée de développement pré-imaginal
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Espérance femelles sauvages (DÉCOUPLÉE) */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Espérance femelles sauvages (μ_W,♀)
                </label>
                <span className="font-mono text-[#BF532E] font-bold">
                  {(params.lifespanWildFemaleMean ?? 25.0).toFixed(1)} j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Longévité moyenne des femelles pondeuses en conditions tempérées (reproduction active).
              </p>
              <input
                type="range"
                min="10.0"
                max="50.0"
                step="1.0"
                value={params.lifespanWildFemaleMean ?? 25.0}
                onChange={(e) => updateParam('lifespanWildFemaleMean', Number(e.target.value))}
                className="w-full accent-[#BF532E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>10.0 j</span>
                <span>Défaut : 25.0 j</span>
                <span>50.0 j</span>
              </div>
            </div>

            {/* Espérance mâles sauvages (DÉCOUPLÉE) */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Espérance mâles sauvages (μ_W,♂)
                </label>
                <span className="font-mono text-[#657068] font-bold">
                  {(params.lifespanWildMaleMean ?? 20.0).toFixed(1)} j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Longévité moyenne des mâles sauvages compétiteurs de terrain.
              </p>
              <input
                type="range"
                min="8.0"
                max="40.0"
                step="1.0"
                value={params.lifespanWildMaleMean ?? 20.0}
                onChange={(e) => updateParam('lifespanWildMaleMean', Number(e.target.value))}
                className="w-full accent-[#657068] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>8.0 j</span>
                <span>Défaut : 20.0 j</span>
                <span>40.0 j</span>
              </div>
            </div>

            {/* Espérance de vie mâles stériles */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Espérance mâles stériles (μ_S)
                </label>
                <span className="font-mono text-[#145A3D] font-bold">
                  {(params.lifespanSterileMean ?? 7.0).toFixed(1)} j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Durée de vie des mâles irradiés (loi normale tronquée ≥ 1j, σ = {((params.lifespanSterileMean ?? 7.0) * 0.3).toFixed(1)}j).
              </p>
              <input
                type="range"
                min="3.0"
                max="14.0"
                step="0.5"
                value={params.lifespanSterileMean ?? 7.0}
                onChange={(e) => updateParam('lifespanSterileMean', Number(e.target.value))}
                className="w-full accent-[#145A3D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>3.0 j (faible)</span>
                <span>Défaut : 7.0 j</span>
                <span>14.0 j (élevé)</span>
              </div>
            </div>

            {/* Durée développement larvaire */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Cycle pré-imaginal (T_dev)
                </label>
                <span className="font-mono text-[#D97706] font-bold">
                  {params.eggToAdultDays} j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Délai entre la ponte dans le fruit et l'émergence d'un nouvel adulte reproducteur.
              </p>
              <input
                type="range"
                min="9"
                max="22"
                step="1"
                value={params.eggToAdultDays}
                onChange={(e) => updateParam('eggToAdultDays', Number(e.target.value))}
                className="w-full accent-[#D97706] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>9 j (chaleur)</span>
                <span>Défaut : 14 j</span>
                <span>22 j (frais)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          GROUPE 3 : PHÉNOLOGIE DES CULTURES & HORIZONS DE SIMULATION
         =================================================================== */}
      {(activeCategory === 'all' || activeCategory === 'phenology') && (
        <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#EDF5EB] text-[#145A3D]">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1B201C]">
                  3. Phénologie des cultures & Horizons temporels de simulation
                </h3>
                <p className="text-xs text-[#657068]">
                  Durée de récolte selon l'espèce végétale et stocks globaux de fruits
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Horizon Fraise */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Horizon Fraise (T_cult)
                </label>
                <span className="font-mono text-[#145A3D] font-bold">
                  {params.horizonFraise} jours
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Période de production continue pour la fraise remontante (60 à 120 jours).
              </p>
              <input
                type="range"
                min="40"
                max="140"
                step="5"
                value={params.horizonFraise}
                onChange={(e) => updateParam('horizonFraise', Number(e.target.value))}
                className="w-full accent-[#145A3D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>40 j</span>
                <span>Défaut : 100 j</span>
                <span>140 j</span>
              </div>
            </div>

            {/* Horizon Cerise */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Horizon Cerise (T_cult)
                </label>
                <span className="font-mono text-[#BF532E] font-bold">
                  {params.horizonCerise} jours
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Fenêtre de récolte synchrone courte pour la cerise de table (15 à 35 jours).
              </p>
              <input
                type="range"
                min="15"
                max="40"
                step="1"
                value={params.horizonCerise}
                onChange={(e) => updateParam('horizonCerise', Number(e.target.value))}
                className="w-full accent-[#BF532E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>15 j</span>
                <span>Défaut : 25 j</span>
                <span>40 j</span>
              </div>
            </div>

            {/* Stock total de fruits */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">Production totale de fruits</label>
                <span className="font-mono text-[#547B91] font-bold">
                  {params.totalFruitsTarget.toLocaleString('fr-FR')} fruits
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Échelle 30 du modèle calibré (3 000 fruits réels × facteur d'échelle 30).
              </p>
              <div className="p-2 rounded bg-white border border-[#D6DDD4] text-[11px] font-mono text-[#657068]">
                Échelle : 90 000 fruits = 1 hectare équivalent
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          GROUPE 4 : COMPÉTITION REPRODUCTIVE & POLYANDRIE
         =================================================================== */}
      {(activeCategory === 'all' || activeCategory === 'reproduction') && (
        <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#EEF6EF] text-[#145A3D]">
                <HeartPulse className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1B201C]">
                  4. Reproduction, Compétition TIS & Polyandrie
                </h3>
                <p className="text-xs text-[#657068]">
                  Efficacité d'accouplement du mâle stérile (<Latex math="\eta_m" />) et préséance spermatique (<Latex math="\eta_{\text{sperm}}" />)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Compétitivité accouplement */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Compétitivité d'accouplement (η_m)
                </label>
                <span className="font-mono text-[#145A3D] font-bold">
                  {params.etaMating.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Aptitude du mâle stérile à séduire la femelle sauvage par rapport au sauvage (<Latex math="\eta_w = 1.0" />).
              </p>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={params.etaMating}
                onChange={(e) => updateParam('etaMating', Number(e.target.value))}
                className="w-full accent-[#145A3D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>0.10 (faible)</span>
                <span>Défaut : 0.80</span>
                <span>1.00 (parfait)</span>
              </div>
            </div>

            {/* Compétitivité spermatique */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Compétitivité spermatique (η_sperm)
                </label>
                <span className="font-mono text-[#547B91] font-bold">
                  {params.etaSperm.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Poids relatif du sperme stérile dans la spermathèque de la femelle polyandre.
              </p>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={params.etaSperm}
                onChange={(e) => updateParam('etaSperm', Number(e.target.value))}
                className="w-full accent-[#547B91] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>0.10</span>
                <span>Défaut : 0.59</span>
                <span>1.00</span>
              </div>
            </div>

            {/* Taux de ponte maximal */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Fécondité journalière (E_daily)
                </label>
                <span className="font-mono text-[#BF532E] font-bold">
                  {params.dailyEggsPerFemale} œufs / ♀ / j
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Potentiel maximal d'insertion d'œufs par femelle réceptive dans les fruits sensibles.
              </p>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={params.dailyEggsPerFemale}
                onChange={(e) => updateParam('dailyEggsPerFemale', Number(e.target.value))}
                className="w-full accent-[#BF532E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>5 œufs/j</span>
                <span>Défaut : 18 œufs/j</span>
                <span>40 œufs/j</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          GROUPE 5 : VULNÉRABILITÉ DES FRUITS & PATHOGÉNICITÉ
         =================================================================== */}
      {(activeCategory === 'all' || activeCategory === 'fruitHazard') && (
        <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#FAF1EC] text-[#BF532E]">
                <Apple className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1B201C]">
                  5. Vulnérabilité des fruits & Aléas journaliers de pourriture
                </h3>
                <p className="text-xs text-[#657068]">
                  Risque de pourriture induit par les larves viables (h_fertile) vs piqûres stériles (h_stérile)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Hasard pourriture piqûre fertile */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Aléa piqûre fertile (h_fertile)
                </label>
                <span className="font-mono text-[#A83D36] font-bold">
                  {params.rotHazardFertile.toFixed(4)} j⁻¹
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Hasard journalier de liquéfaction causée par le développement des asticots.
              </p>
              <input
                type="range"
                min="0.05"
                max="0.60"
                step="0.01"
                value={params.rotHazardFertile}
                onChange={(e) => updateParam('rotHazardFertile', Number(e.target.value))}
                className="w-full accent-[#A83D36] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>0.0500 j⁻¹</span>
                <span>Défaut : 0.3054 j⁻¹</span>
                <span>0.6000 j⁻¹</span>
              </div>
            </div>

            {/* Hasard pourriture piqûre stérile */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Aléa piqûre stérile (h_stérile)
                </label>
                <span className="font-mono text-[#547B91] font-bold">
                  {params.rotHazardSterile.toFixed(4)} j⁻¹
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Risque d'infection fongique opportuniste sans larve vivante (*Botrytis*).
              </p>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.01"
                value={params.rotHazardSterile}
                onChange={(e) => updateParam('rotHazardSterile', Number(e.target.value))}
                className="w-full accent-[#547B91] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>0.0500 j⁻¹</span>
                <span>Défaut : 0.2310 j⁻¹</span>
                <span>0.5000 j⁻¹</span>
              </div>
            </div>

            {/* Seuil cumulé S_rot */}
            <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="font-semibold text-[#1B201C]">
                  Seuil de pourriture (S_rot)
                </label>
                <span className="font-mono text-[#1B201C] font-bold">
                  {params.rotScoreThreshold.toFixed(1)}
                </span>
              </div>
              <p className="text-[11px] text-[#657068]">
                Score cumulé de piqûres au-delà duquel le fruit est disqualifié commercialement.
              </p>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={params.rotScoreThreshold}
                onChange={(e) => updateParam('rotScoreThreshold', Number(e.target.value))}
                className="w-full accent-[#657068] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#657068]">
                <span>2.0 (sensible)</span>
                <span>Défaut : 5.0</span>
                <span>10.0 (tolérant)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLEAU RÉCAPITULATIF SCIENTIFIQUE DES PARAMÈTRES */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#145A3D]" />
          <h3 className="text-sm font-serif font-bold text-[#1B201C]">
            Catalogue complet des paramètres avec références et bornes de validation
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#F0F2EB] border-y border-[#D6DDD4] text-[#1B201C] font-semibold text-[11px]">
                <th className="py-2 px-3 text-left">Symbole</th>
                <th className="py-2 px-3 text-left">Paramètre</th>
                <th className="py-2 px-3 text-left">Groupe</th>
                <th className="py-2 px-3 text-left">Unité</th>
                <th className="py-2 px-3 text-right">Valeur actuelle</th>
                <th className="py-2 px-3 text-left">Plage admissible</th>
                <th className="py-2 px-3 text-left">Source scientifique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECE3]">
              {SCIENTIFIC_PARAMETERS_CATALOG.map((p) => {
                const curVal = params[p.id] !== undefined ? params[p.id] : p.defaultValue;
                return (
                  <tr key={p.id} className="hover:bg-[#F8F7F2] transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-[#145A3D]">
                      <Latex math={p.symbol} />
                    </td>
                    <td className="py-2 px-3 font-medium text-[#1B201C]">{p.name}</td>
                    <td className="py-2 px-3 text-[#657068] text-[10px]">{p.group}</td>
                    <td className="py-2 px-3 font-mono text-[#657068]">{p.unit}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#145A3D]">
                      {typeof curVal === 'number' ? curVal.toLocaleString('fr-FR') : curVal}
                    </td>
                    <td className="py-2 px-3 font-mono text-[#657068] text-[10px]">{p.allowedRange}</td>
                    <td className="py-2 px-3 text-[#657068] text-[10.5px] max-w-xs">{p.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
