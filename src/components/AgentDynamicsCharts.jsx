import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import {
  Bug,
  Apple,
  TrendingDown,
  Info,
  AlertTriangle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  simulateAgentDynamics,
  STRATEGIES,
  INOCULUM_LEVELS,
  INOCULUM_MAP,
  CARRYING_CAPACITY_K
} from '../engine/abmEngine';

export default function AgentDynamicsCharts({
  initialCulture = 'Fraise',
  initialInoculum = 'Modérée',
  initialStrategy = 'Every 3 days',
  initialBudget = 1000
}) {
  const [culture, setCulture] = useState(initialCulture);
  const [inoculumId, setInoculumId] = useState(initialInoculum);
  const [strategyId, setStrategyId] = useState(initialStrategy);
  const [budget, setBudget] = useState(initialBudget);
  const [migrationRate, setMigrationRate] = useState(culture === 'Cerise' ? 8 : 15);
  const [enableMigration, setEnableMigration] = useState(true);
  const [showControlTrajectory, setShowControlTrajectory] = useState(true);

  // Synchronisation du taux de migration par défaut quand la culture change
  const handleCultureChange = (newCult) => {
    setCulture(newCult);
    setMigrationRate(newCult === 'Cerise' ? 8 : 15);
  };

  // Exécution de la simulation active via le moteur ABM
  const simulationResult = useMemo(() => {
    return simulateAgentDynamics({
      culture,
      inoculumId,
      strategyId,
      budget,
      enableMigration,
      dailyMigrationFraiseFemales: migrationRate,
      dailyMigrationFraiseMales: migrationRate,
      dailyMigrationCeriseFemales: migrationRate,
      dailyMigrationCeriseMales: migrationRate
    });
  }, [culture, inoculumId, strategyId, budget, migrationRate, enableMigration]);

  // Simulation témoin SANS TIS (référence d'explosion naturelle non traitée)
  const controlSimulationResult = useMemo(() => {
    return simulateAgentDynamics({
      culture,
      inoculumId,
      strategyId: 'No TIS',
      budget: 0,
      enableMigration,
      dailyMigrationFraiseFemales: migrationRate,
      dailyMigrationFraiseMales: migrationRate,
      dailyMigrationCeriseFemales: migrationRate,
      dailyMigrationCeriseMales: migrationRate
    });
  }, [culture, inoculumId, migrationRate, enableMigration]);

  const { timeline, summary, horizon } = simulationResult;
  const currentInoculum = INOCULUM_MAP.get(inoculumId) || INOCULUM_MAP.get('Modérée');

  // Fusion des dynamiques traitée et témoin sans TIS
  const sampledTimeline = useMemo(() => {
    return timeline.map((pt, i) => {
      const ctrlPt = controlSimulationResult.timeline[i] || {};
      return {
        ...pt,
        controlWildFemales: ctrlPt.wildFemales,
        controlActiveLarvae: ctrlPt.activeLarvae,
        controlTotalWild: ctrlPt.totalWild
      };
    });
  }, [timeline, controlSimulationResult]);

  // Valeurs max pour calcul des ratios
  const maxWild = useMemo(() => {
    return Math.max(...timeline.map((p) => p.totalWild), 1);
  }, [timeline]);

  const maxSterile = useMemo(() => {
    return Math.max(...timeline.map((p) => p.sterileMales), 1);
  }, [timeline]);

  return (
    <div className="space-y-6">
      {/* BANDEAU SUPÉRIEUR : TITRE & OBJECTIF AGRONOMIQUE */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modélisation Individu-Centrée • Dynamiques Temporelles</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] mt-1">
              Trajectoires temporelles des populations d'insectes et destins des fruits
            </h2>
            <p className="text-xs text-[#657068] mt-1 max-w-3xl">
              Visualisation journalière du comportement stochastique des agents dans la parcelle :
              rencontres sexuelles stérile/sauvage, compétition reproductive, immigration continue
              et stades phénologiques de réceptivité des fruits à la ponte.
            </p>
          </div>

          {/* Badge Capacité de Charge K */}
          <div className="shrink-0 p-3 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] text-xs font-mono space-y-1">
            <div className="text-[10px] text-[#657068] uppercase">Capacité de charge du milieu</div>
            <div className="text-sm font-bold text-[#145A3D]">K = {CARRYING_CAPACITY_K.toLocaleString('fr-FR')} adultes</div>
            <div className="text-[10px] text-[#657068]">
              Inoculum actif : {currentInoculum.total} fondateurs ({Math.round((currentInoculum.total / CARRYING_CAPACITY_K) * 100)} % de K)
            </div>
          </div>
        </div>

        {/* BARRE DE CONTRÔLES INTERACTIFS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 mt-4 border-t border-[#E8ECE3]">
          {/* Culture */}
          <div>
            <label className="block text-[11px] font-medium text-[#1B201C] mb-1">Culture hôte</label>
            <select
              value={culture}
              onChange={(e) => handleCultureChange(e.target.value)}
              className="w-full rounded-lg border border-[#D6DDD4] bg-white px-2.5 py-1.5 text-xs text-[#1B201C] cursor-pointer"
            >
              <option value="Fraise">Fraise (100 jours • récolte continue)</option>
              <option value="Cerise">Cerise (25 jours • récolte synchrone)</option>
            </select>
          </div>

          {/* Inoculum de départ */}
          <div>
            <label className="block text-[11px] font-medium text-[#1B201C] mb-1">
              Inoculum de départ
            </label>
            <select
              value={inoculumId}
              onChange={(e) => setInoculumId(e.target.value)}
              className="w-full rounded-lg border border-[#D6DDD4] bg-white px-2.5 py-1.5 text-xs text-[#1B201C] cursor-pointer font-medium"
            >
              {INOCULUM_LEVELS.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} ({inv.total} adultes J0)
                </option>
              ))}
            </select>
          </div>

          {/* Stratégie TIS */}
          <div>
            <label className="block text-[11px] font-medium text-[#1B201C] mb-1">Stratégie de lâcher</label>
            <select
              value={strategyId}
              onChange={(e) => setStrategyId(e.target.value)}
              className="w-full rounded-lg border border-[#D6DDD4] bg-white px-2.5 py-1.5 text-xs text-[#1B201C] cursor-pointer"
            >
              {STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.symbol} {s.short}
                </option>
              ))}
            </select>
          </div>

          {/* Budget de mâles stériles */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-[#1B201C] mb-1">
              <span>Budget lâché</span>
              <span className="font-mono text-[#145A3D] font-bold">{budget.toLocaleString('fr-FR')} ♂</span>
            </div>
            <input
              type="range"
              min="0"
              max="18000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#145A3D] cursor-pointer"
            />
          </div>

          {/* Immigration quotidienne */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-medium text-[#1B201C] mb-1">
              <span>Immigration quotidienne</span>
              <label className="flex items-center gap-1 text-[10px] cursor-pointer text-[#657068]">
                <input
                  type="checkbox"
                  checked={enableMigration}
                  onChange={(e) => setEnableMigration(e.target.checked)}
                  className="rounded text-[#145A3D] accent-[#145A3D]"
                />
                <span>Active</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                disabled={!enableMigration}
                value={migrationRate}
                onChange={(e) => setMigrationRate(Number(e.target.value))}
                className="flex-1 accent-[#BF532E] cursor-pointer disabled:opacity-40"
              />
              <span className="font-mono text-xs text-[#BF532E] w-12 text-right">
                {enableMigration ? `${migrationRate * 2}/j` : '0/j'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          SECTION 1 : DYNAMIQUE DES POPULATIONS D'AGENTS INSECTES AU COURS DU TEMPS
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#EDF5EB] text-[#145A3D]">
              <Bug className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1B201C]">
                1. Dynamique des agents insectes au cours du temps
              </h3>
              <p className="text-xs text-[#657068]">
                Évolution journalière des cohortes d'insectes adultes (sauvages, stériles) et du réservoir larvaire
              </p>
            </div>
          </div>

          {/* Indicateurs clés & Contrôle Témoin */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setShowControlTrajectory((v) => !v)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                showControlTrajectory
                  ? 'bg-[#145A3D] text-white border-[#145A3D] shadow-2xs'
                  : 'bg-[#F8F7F2] text-[#657068] border-[#D6DDD4] hover:bg-[#F0F2EB]'
              }`}
            >
              <span>{showControlTrajectory ? '✓ Témoin sans TIS superposé' : '+ Superposer témoin sans TIS'}</span>
            </button>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F7F2] border border-[#D6DDD4]">
              <span className="text-[#657068] text-[10px] block">Pic Sauvages</span>
              <strong className="text-[#BF532E]">{maxWild} ind.</strong>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F7F2] border border-[#D6DDD4]">
              <span className="text-[#657068] text-[10px] block">Pic Stériles</span>
              <strong className="text-[#145A3D]">{maxSterile} ♂</strong>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-[#F8F7F2] border border-[#D6DDD4]">
              <span className="text-[#657068] text-[10px] block">Compétition P(S)</span>
              <strong className="text-[#547B91]">
                {timeline[Math.min(30, timeline.length - 1)]?.probSterileMating || 0} %
              </strong>
            </div>
          </div>
        </div>

        {/* Graphique Recharts multi-courbes des insectes */}
        <div className="w-full" style={{ height: 300, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height={300} minHeight={300}>
            <LineChart data={sampledTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
              <XAxis dataKey="day" unit=" j" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip
                formatter={(val, name) => [val.toLocaleString('fr-FR') + ' ind.', name]}
                labelFormatter={(day) => `Jour ${day} après intervention`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #D6DDD4',
                  fontSize: '11px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              {/* Mâles stériles lâchés */}
              <Line
                type="monotone"
                dataKey="sterileMales"
                name="Mâles stériles (lâchés)"
                stroke="#145A3D"
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
              {/* Femelles sauvages totales */}
              <Line
                type="monotone"
                dataKey="wildFemales"
                name="Femelles sauvages totales"
                stroke="#BF532E"
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
              {/* Femelles fécondes (pondeuses viables à descendance fertile) */}
              <Line
                type="monotone"
                dataKey="effFertileFemales"
                name="Femelles fécondes (pondeuses viables)"
                stroke="#A83D36"
                strokeWidth={2.0}
                strokeDasharray="4 3"
                dot={false}
                isAnimationActive={false}
              />
              {/* Mâles sauvages */}
              <Line
                type="monotone"
                dataKey="wildMales"
                name="Mâles sauvages"
                stroke="#657068"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              {/* Larves actives */}
              <Line
                type="monotone"
                dataKey="activeLarvae"
                name="Larves actives dans les fruits"
                stroke="#D97706"
                strokeWidth={1.8}
                dot={false}
                isAnimationActive={false}
              />
              {/* Trajectoires témoin sans TIS (superposition) */}
              {showControlTrajectory && (
                <Line
                  type="monotone"
                  dataKey="controlWildFemales"
                  name="Témoin SANS TIS : Femelles sauvages"
                  stroke="#991B1B"
                  strokeWidth={1.8}
                  strokeDasharray="2 2"
                  dot={false}
                  isAnimationActive={false}
                />
              )}
              {showControlTrajectory && (
                <Line
                  type="monotone"
                  dataKey="controlActiveLarvae"
                  name="Témoin SANS TIS : Larves actives"
                  stroke="#B45309"
                  strokeWidth={1.8}
                  strokeDasharray="2 2"
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Explication biologique & Définition entomologique rigoureuse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#F8F7F2] p-3.5 border border-[#E8ECE3] flex items-start gap-3 text-xs text-[#657068] leading-relaxed">
            <Info className="w-4 h-4 text-[#145A3D] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1B201C]">Définition : Femelles fécondes (pondeuses viables) :</strong>{' '}
              Sous-ensemble des femelles sauvages ayant copulé avec un mâle fertile et disposant de sperme fonctionnel dans leur spermathèque.
              <strong className="text-[#A83D36]"> Seules ces femelles</strong> déposent des œufs fécondés qui éclosent en larves destructrices. Les femelles accouplées aux mâles stériles effectuent des piqûres infécondes sans aucune descendance larvaire.
            </div>
          </div>
          <div className="rounded-lg bg-[#F8F7F2] p-3.5 border border-[#E8ECE3] flex items-start gap-3 text-xs text-[#657068] leading-relaxed">
            <TrendingDown className="w-4 h-4 text-[#145A3D] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1B201C]">Effet barrière TIS vs Témoin non traité :</strong>{' '}
              Sans TIS (courbes pointillées sombres), la population explose vers le plafond naturel{' '}
              <span className="font-mono text-[#145A3D]">K = {CARRYING_CAPACITY_K.toLocaleString('fr-FR')} ind.</span>{' '}
              alimenté par les {enableMigration ? migrationRate * 2 : 0} immigrants quotidiens.
              L'introduction de mâles stériles fait chuter le contingent de femelles fécondes, asphyxiant le renouvellement générationnel.
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          SECTION 2 : DYNAMIQUE PHÉNOLOGIQUE DES FRUITS & FENÊTRE DE PONTE
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#FAF1EC] text-[#BF532E]">
              <Apple className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1B201C]">
                2. Phénologie des fruits & Fenêtre de susceptibilité à la ponte
              </h3>
              <p className="text-xs text-[#657068]">
                Stades de réceptivité de l'hôte et cinétique de dégradation de la récolte
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#657068]">Production totale :</span>
            <span className="font-mono font-bold text-[#145A3D]">90 000 fruits</span>
          </div>
        </div>

        {/* FRISE PHÉNOLOGIQUE : QUAND LES INSECTES PEUVENT PONDRE DANS LES FRUITS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Stade 1 : Fruit vert */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DDEADF] text-[#145A3D]">
                STADE 1 • VERT
              </span>
              <span className="text-[10px] text-[#657068]">J0 à J12</span>
            </div>
            <h4 className="text-sm font-serif font-bold text-[#1B201C]">Immature / Vert</h4>
            <div className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-medium">
              NON VULNÉRABLE (0 % ponte)
            </div>
            <p className="text-[11px] text-[#657068] leading-tight">
              Épiderme rigide, haute fermeté mécanique, acidité élevée. L'oviscapte denté de la femelle
              ne parvient pas à perforer la cuticule. Zéro composé volatil attractif émis.
            </p>
          </div>

          {/* Stade 2 : Fruit tournant */}
          <div className="rounded-xl border border-[#F59E0B]/30 bg-[#FEF3C7]/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B45309]">
                STADE 2 • TOURNANT
              </span>
              <span className="text-[10px] text-[#657068]">J12 à J17</span>
            </div>
            <h4 className="text-sm font-serif font-bold text-[#1B201C]">Mi-mûr / Tournant</h4>
            <div className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-medium">
              DÉBUT VULNÉRABILITÉ (30 % ponte)
            </div>
            <p className="text-[11px] text-[#657068] leading-tight">
              Ramollissement de la chair, synthèse des anthocyanes (virage rosé), augmentation des sucres
              solubles (Brix). Les premières pontes ont lieu sous l'épiderme.
            </p>
          </div>

          {/* Stade 3 : Fruit mûr */}
          <div className="rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2]/20 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#B91C1C]">
                STADE 3 • MÛR
              </span>
              <span className="text-[10px] text-[#657068]">J17 à J22</span>
            </div>
            <h4 className="text-sm font-serif font-bold text-[#1B201C]">Mûr / Récoltable</h4>
            <div className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 font-medium">
              VULNÉRABILITÉ MAXIMALE (100 %)
            </div>
            <p className="text-[11px] text-[#657068] leading-tight">
              Attractivité olfactive maximale (esters et alcools de fruits). La femelle pond préférentiellement
              1 à 4 œufs par fruit. Si ponte fertile : asticots en 72h et liquéfaction rapide.
            </p>
          </div>

          {/* Stade 4 : Destin final */}
          <div className="rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8ECE3] text-[#657068]">
                RÉCOLTE & DESTIN
              </span>
              <span className="text-[10px] text-[#657068]">Post J22</span>
            </div>
            <h4 className="text-sm font-serif font-bold text-[#1B201C]">Valorisation commerciale</h4>
            <div className="text-[11px] space-y-1 font-mono">
              <div className="text-[#145A3D]">✓ Sain : {summary.recoltes_sains_pct} %</div>
              <div className="text-[#547B91]">○ Stérile : {summary.recoltes_steriles_pct} %</div>
              <div className="text-[#A83D36]">✗ Pourri/larves : {summary.pourris_larves_pct} %</div>
            </div>
            <p className="text-[10px] text-[#657068] leading-tight">
              Les fruits piqués par des mâles stériles ne développent pas de larves et restent commercialisables.
            </p>
          </div>
        </div>

        {/* Graphique de l'état des fruits au cours du temps */}
        <div className="w-full pt-2" style={{ height: 280, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height={280} minHeight={280}>
            <AreaChart data={sampledTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
              <XAxis dataKey="day" unit=" j" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip
                formatter={(val, name) => [val.toLocaleString('fr-FR') + ' fruits', name]}
                labelFormatter={(day) => `Jour ${day}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="fruitsGreen"
                name="Fruits verts (non réceptifs)"
                stackId="1"
                stroke="#68A57E"
                fill="#DDEADF"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="fruitsTurning"
                name="Fruits tournants (début réceptivité)"
                stackId="1"
                stroke="#D97706"
                fill="#FDE68A"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="fruitsRipe"
                name="Fruits mûrs (réceptivité maximale)"
                stackId="1"
                stroke="#DC2626"
                fill="#FECACA"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===================================================================
          SECTION 3 : VALIDATION DU COMPORTEMENT AGRONOMIQUE
          (Bonne récolte précoce vs Dégradation sur les 30 derniers jours)
         =================================================================== */}
      <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-[#EEF6EF] text-[#145A3D]">
              <TrendingDown className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1B201C]">
                3. Taux de dommage journalier de la récolte (Validation agronomique)
              </h3>
              <p className="text-xs text-[#657068]">
                Vérification du profil temporel : qualité sanitaire en début de saison vs 30 derniers jours
              </p>
            </div>
          </div>

          {/* Badge de synthèse début vs fin */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-[#EDF5EB] text-center">
              <span className="text-[10px] text-[#657068] block">Dommage Début (J0–J{horizon - 30})</span>
              <strong className="text-sm font-mono text-[#145A3D]">{summary.avgDamageEarly} %</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-[#657068]" />
            <div className="px-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-[#FAF1EC] text-center">
              <span className="text-[10px] text-[#657068] block">Dommage Fin (30 derniers jours)</span>
              <strong className="text-sm font-mono text-[#BF532E]">{summary.avgDamageLate30} %</strong>
            </div>
          </div>
        </div>

        {/* Graphique de la courbe de dommage au jour le jour */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampledTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
              <XAxis dataKey="day" unit=" j" tick={{ fontSize: 11 }} />
              <YAxis unit=" %" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <RechartsTooltip
                formatter={(val) => [val + ' %', 'Part endommagée à la récolte']}
                labelFormatter={(day) => `Jour ${day}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Line
                type="monotone"
                dataKey="damageRateToday"
                name="Taux de fruits pourris/larvaires du jour (%)"
                stroke="#BF532E"
                strokeWidth={2.4}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerte et conclusion agronomique */}
        <div className="rounded-lg bg-[#FAF1EC] border border-[#BF532E]/30 p-4 text-xs text-[#1B201C] space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#BF532E]">
            <AlertTriangle className="w-4 h-4" />
            <span>Comportement agronomique validé pour {culture} :</span>
          </div>
          <p className="text-[11px] text-[#657068] leading-relaxed">
            {culture === 'Fraise' ? (
              <>
                Sous un inoculum initial faible ({currentInoculum.total} fondateurs), la récolte des 40 premiers
                jours est saine et abondante (dommages &lt; 10 %). Cependant, sous l'effet de l'immigration continue
                ({enableMigration ? migrationRate * 2 : 0} individus/jour) et de la ponte échelonnée, la population
                explose sur les 30 derniers jours (J70 à J100), entraînant une détérioration marquée{' '}
                <strong className="text-[#BF532E]">
                  ({summary.avgDamageLate30} % de dommages en fin de saison contre {summary.avgDamageEarly} % au début,
                  soit une dégradation de +{summary.lateSeasonDegradation} %)
                </strong>
                . Le maintien d'une stratégie TIS continue (J+3 ou 70 % initial + maintenance hebdomadaire)
                est donc crucial pour empêcher ce décrochage de fin de récolte.
              </>
            ) : (
              <>
                Pour la Cerise ({horizon} jours), la récolte étant ramassée sur une courte fenêtre,
                l'effet décisif réside dans la synchronisation immédiate des lâchers (J0 et J+7) pour inonder
                le milieu avant que les fruits ne passent au stade mûr.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
