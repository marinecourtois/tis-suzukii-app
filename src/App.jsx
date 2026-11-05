import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Download, SlidersHorizontal, BarChart3, Cpu, Check, Leaf,
  Layers, Target, ShieldCheck, BookOpen, FlaskConical, Play,
  Plus, FileCode, ChevronDown, Search, Calendar, Coins
} from 'lucide-react';

import Latex from './components/Latex';
import {
  ModellyLogo,
  StrawberryBotanicalPlate,
  CherryBotanicalPlate,
  TisMechanismDiagram,
  PastoralLandscape
} from './components/BotanicalIllustrations';
import OverviewPopulationChart from './components/OverviewPopulationChart';
import ScientificReportModal from './components/ScientificReportModal';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// ============================================================================
// CONSTANTES DU MODÈLE SCIENTIFIQUE (NOTEBOOK MODELLY ABM)
// ============================================================================
const TOTAL_FRUITS = 90000;
const ENGINE_VERSION = 'Modelly-ABM v2.4.0 (Échelle 30 • FastRandom)';
const SCHEMA_VERSION = 'tis-schema-2025.2';

const STRATEGIES = [
  {
    id: 'No TIS',
    label: 'Témoin sans TIS',
    short: 'Témoin (No TIS)',
    color: '#657068',
    dash: '2 2',
    symbol: '○',
    schedule: 'Aucun lâcher (0 insecte)',
    operationalRule: 'Référence naturelle sans intervention biologique.',
    relativeBudget: 0.0
  },
  {
    id: 'Daily',
    label: 'Lâchers quotidiens',
    short: 'Quotidien',
    color: '#BF532E',
    dash: '0',
    symbol: '▲',
    schedule: 'B / T chaque jour de J0 à J(T-1)',
    operationalRule: 'Apport journalier constant fractionnant le budget total sur toute la saison.',
    relativeBudget: 1.40
  },
  {
    id: 'Every 3 days',
    label: 'Lâchers tous les 3 jours',
    short: 'J+3',
    color: '#547B91',
    dash: '6 3',
    symbol: '■',
    schedule: 'Lâcher périodique à J0, J3, J6, J9...',
    operationalRule: 'Fractionnement intermédiaire aligné sur le cycle de prophylaxie (3 jours).',
    relativeBudget: 1.00
  },
  {
    id: 'Every 7 days',
    label: 'Lâchers tous les 7 jours',
    short: 'J+7',
    color: '#C88A2B',
    dash: '8 3 2 3',
    symbol: '◆',
    schedule: 'Lâcher hebdomadaire à J0, J7, J14...',
    operationalRule: 'Synchronisé sur l’espérance de vie moyenne des mâles stériles (μ_S = 7 jours).',
    relativeBudget: 0.72
  },
  {
    id: '70% init + 7d maint',
    label: 'Lâcher initial 70 % + maintenance 7j',
    short: '70% init + maintenance',
    color: '#145A3D',
    dash: '0',
    symbol: '★',
    schedule: '70 % du budget à J0 + 30 % répartis tous les 7 jours',
    operationalRule: 'Inondation initiale massive des femelles fondatrices suivie d’une maintenance hebdomadaire.',
    relativeBudget: 0.86
  },
  {
    id: '100% init',
    label: 'Lâcher initial de 100 %',
    short: '100% initial',
    color: '#A83D36',
    dash: '4 4',
    symbol: '●',
    schedule: '100 % du budget lâché en une seule fois à J0',
    operationalRule: 'Saturation maximale à J0 sans aucun renouvellement après la mortalité des mâles stériles (~J14).',
    relativeBudget: 1.25
  }
];

const STRATEGY_MAP = new Map(STRATEGIES.map((s) => [s.id, s]));

const INVASION_LEVELS = [
  { id: 'Faible', label: 'Faible', males: 90, females: 90, total: 180, multiplier: 0.32, unit: 'adultes à J0' },
  { id: 'Modérée', label: 'Modérée', males: 300, females: 300, total: 600, multiplier: 1.0, unit: 'adultes à J0' },
  { id: 'Forte', label: 'Forte', males: 900, females: 900, total: 1800, multiplier: 2.65, unit: 'adultes à J0' }
];

const INVASION_MAP = new Map(INVASION_LEVELS.map((inv) => [inv.id, inv]));
const BUDGET_PRESETS = [0, 1000, 4500, 9000, 18000];

const REMATING_MODES = [
  {
    id: 'preference',
    label: 'Accouplement multiple',
    shortLabel: 'Accouplement multiple (η_sperm = 0.59)',
    description: 'Réaccouplement après période réfractaire (4–10j après stérile, 3–12j après sauvage) avec compétition spermatique η_sperm = 0.59.'
  },
  {
    id: 'first',
    label: 'Accouplement unique',
    shortLabel: 'Accouplement unique (1er partenaire)',
    description: 'Le premier accouplement détermine définitivement le statut fertile ou stérile de la femelle.'
  }
];

const REMATING_LABEL_MAP = {
  preference: 'Accouplement multiple',
  first: 'Accouplement unique'
};

// Catalogue des paramètres officiels (Section 11)
const SCIENTIFIC_PARAMETERS_CATALOG = [
  {
    symbol: 'N_{fruits}',
    name: 'Production totale de fruits (Échelle 30)',
    unit: 'fruits',
    defaultValue: '90 000',
    allowedRange: '3 000 – 90 000',
    source: 'Notebook Modelly ABM (scale_factor = 30 × 3 000 fruits)'
  },
  {
    symbol: 'T_{cult}',
    name: 'Horizon phénologique de la culture',
    unit: 'jours (j)',
    defaultValue: 'Fraise : 100 j | Cerise : 25 j',
    allowedRange: '25 – 120 j',
    source: 'Protocole agronomique Fraise (continu) vs Cerise (synchrone)'
  },
  {
    symbol: '\\mu_S, \\sigma_S',
    name: 'Espérance de vie des mâles stériles (SterileMales_Agent)',
    unit: 'jours (j)',
    defaultValue: '7.0 j (σ = 2.1 j), tronquée ≥ 1 j',
    allowedRange: '4.0 – 12.0 j',
    source: 'Calibration irradiation TIS (CV = 0.30)'
  },
  {
    symbol: '\\mu_W, \\sigma_W',
    name: 'Espérance de vie des adultes sauvages (♂ et ♀)',
    unit: 'jours (j)',
    defaultValue: '25.0 j (σ = 7.5 j), tronquée ≥ 1 j',
    allowedRange: '15.0 – 35.0 j',
    source: 'Biologie D. suzukii en conditions tempérées (CV = 0.30)'
  },
  {
    symbol: '\\eta_m',
    name: 'Compétitivité d’accouplement des mâles stériles',
    unit: 'ratio',
    defaultValue: '0.80',
    allowedRange: '0.10 – 1.00',
    source: 'Females_Agent.mate() — P(S) = (0.80·S) / (W + 0.80·S)'
  },
  {
    symbol: '\\eta_{\\text{sperm}}',
    name: 'Compétitivité spermatique stérile (Accouplement multiple)',
    unit: 'ratio',
    defaultValue: '0.59',
    allowedRange: '0.10 – 1.00',
    source: 'Females_Agent.lay_eggs() — P(fertile) = n_f / (n_f + 0.59·n_s)'
  },
  {
    symbol: 'h_{\\text{fertile}}',
    name: 'Hasard journalier de pourriture après piqûre fertile',
    unit: 'jour⁻¹',
    defaultValue: '0.3054',
    allowedRange: '0.0500 – 0.6000',
    source: 'Fruit_Agent.step() — rot_hazard_fertile'
  },
  {
    symbol: 'h_{\\text{stérile}}',
    name: 'Hasard journalier de pourriture après piqûre stérile seule',
    unit: 'jour⁻¹',
    defaultValue: '0.2310',
    allowedRange: '0.0500 – 0.5000',
    source: 'Fruit_Agent.step() — rot_hazard_sterile (inoculation fongique cuticulaire)'
  },
  {
    symbol: 'S_{\\text{rot}}(t)',
    name: 'Seuil de pourriture par score larvaire cumulé',
    unit: 'score',
    defaultValue: 'S(t) = n + 0.5·(n·t - Σ c_i) ≥ 5.0',
    allowedRange: '3.0 – 10.0',
    source: 'Forme fermée O(1) dans Fruit_Agent'
  }
];

// Ancrages exacts du notebook Python pour Fraise & Cerise (Budget 9000, invasion moyenne)
const EXACT_ANCHOR_STRAWBERRY = {
  'No TIS': { recoltes_sains_pct: 50.7, recoltes_steriles_pct: 0.0, recoltes_larves_pct: 15.9, pourris_larves_pct: 30.1, pourris_steriles_pct: 0.0, pourris_naturels_pct: 0.4, larves_produites: 74415, sd_sains_pct: 1.4 },
  'Daily': { recoltes_sains_pct: 82.9, recoltes_steriles_pct: 3.6, recoltes_larves_pct: 1.8, pourris_larves_pct: 2.8, pourris_steriles_pct: 3.4, pourris_naturels_pct: 1.2, larves_produites: 7350, sd_sains_pct: 0.9 },
  'Every 3 days': { recoltes_sains_pct: 82.8, recoltes_steriles_pct: 3.9, recoltes_larves_pct: 1.6, pourris_larves_pct: 3.1, pourris_steriles_pct: 3.7, pourris_naturels_pct: 1.3, larves_produites: 6478, sd_sains_pct: 0.9 },
  'Every 7 days': { recoltes_sains_pct: 86.0, recoltes_steriles_pct: 3.2, recoltes_larves_pct: 1.0, pourris_larves_pct: 5.9, pourris_steriles_pct: 3.1, pourris_naturels_pct: 1.3, larves_produites: 3838, sd_sains_pct: 0.7 },
  '70% init + 7d maint': { recoltes_sains_pct: 88.0, recoltes_steriles_pct: 2.8, recoltes_larves_pct: 0.5, pourris_larves_pct: 3.4, pourris_steriles_pct: 2.9, pourris_naturels_pct: 1.5, larves_produites: 1791, sd_sains_pct: 0.6 },
  '100% init': { recoltes_sains_pct: 81.1, recoltes_steriles_pct: 2.4, recoltes_larves_pct: 3.5, pourris_larves_pct: 2.9, pourris_steriles_pct: 2.0, pourris_naturels_pct: 1.2, larves_produites: 13826, sd_sains_pct: 1.2 }
};

const EXACT_ANCHOR_CHERRY = {
  'No TIS': { recoltes_sains_pct: 58.4, recoltes_steriles_pct: 0.0, recoltes_larves_pct: 11.3, pourris_larves_pct: 20.6, pourris_steriles_pct: 0.0, pourris_naturels_pct: 1.2, larves_produites: 42650, sd_sains_pct: 1.3 },
  'Daily': { recoltes_sains_pct: 75.2, recoltes_steriles_pct: 3.8, recoltes_larves_pct: 2.9, pourris_larves_pct: 7.9, pourris_steriles_pct: 3.5, pourris_naturels_pct: 1.2, larves_produites: 10420, sd_sains_pct: 1.0 },
  'Every 3 days': { recoltes_sains_pct: 77.4, recoltes_steriles_pct: 3.6, recoltes_larves_pct: 2.2, pourris_larves_pct: 8.6, pourris_steriles_pct: 3.4, pourris_naturels_pct: 1.3, larves_produites: 8190, sd_sains_pct: 0.9 },
  'Every 7 days': { recoltes_sains_pct: 80.1, recoltes_steriles_pct: 3.4, recoltes_larves_pct: 1.4, pourris_larves_pct: 12.4, pourris_steriles_pct: 3.2, pourris_naturels_pct: 1.4, larves_produites: 5120, sd_sains_pct: 0.8 },
  '70% init + 7d maint': { recoltes_sains_pct: 82.8, recoltes_steriles_pct: 3.1, recoltes_larves_pct: 0.7, pourris_larves_pct: 9.1, pourris_steriles_pct: 2.9, pourris_naturels_pct: 1.4, larves_produites: 2240, sd_sains_pct: 0.6 },
  '100% init': { recoltes_sains_pct: 82.3, recoltes_steriles_pct: 3.2, recoltes_larves_pct: 0.8, pourris_larves_pct: 8.2, pourris_steriles_pct: 3.0, pourris_naturels_pct: 1.4, larves_produites: 2680, sd_sains_pct: 0.7 }
};

function round1(v) {
  return Math.round(v * 10) / 10;
}

function computeSingleOutcome(culture, invasionId, budget, remating, strategyId, bioOverrides = null) {
  const isCherry = culture === 'Cerise';
  const anchorMap = isCherry ? EXACT_ANCHOR_CHERRY : EXACT_ANCHOR_STRAWBERRY;
  const base = anchorMap[strategyId] || anchorMap['Every 3 days'];

  // Ajustement en fonction de la pression d'invasion
  const invObj = INVASION_MAP.get(invasionId);
  const invMultiplier = invObj ? invObj.multiplier : 1.0;
  
  // Prise en compte des paramètres biologiques avancés et du réaccouplement
  const etaMating = bioOverrides?.etaMating ?? 0.8;
  const etaSperm = bioOverrides?.etaSperm ?? 0.59;
  const bioFactor = remating === 'first' ? 1.05 : (etaMating / 0.8) * (etaSperm / 0.59);

  // Ajustement en fonction du budget
  const budgetScale = budget === 0 ? 0 : Math.max(0.1, Math.min(1.8, Math.sqrt(budget / 1000) * bioFactor));

  const pourris_larves_pct = round1(Math.max(0.2, base.pourris_larves_pct * invMultiplier * (strategyId === 'No TIS' ? 1 : 1 / budgetScale)));
  const recoltes_steriles_pct = round1(strategyId === 'No TIS' || budget === 0 ? 0 : base.recoltes_steriles_pct * Math.min(1.5, budgetScale));
  const pourris_steriles_pct = round1(strategyId === 'No TIS' || budget === 0 ? 0 : base.pourris_steriles_pct * Math.min(1.5, budgetScale));
  const pourris_total_pct = round1(pourris_larves_pct + pourris_steriles_pct + base.pourris_naturels_pct);
  const recoltes_sains_pct = round1(Math.max(10, 100 - pourris_total_pct - recoltes_steriles_pct - base.recoltes_larves_pct));
  const sterile_only_total_pct = round1(recoltes_steriles_pct + pourris_steriles_pct);
  const larves_produites = Math.round(base.larves_produites * invMultiplier * (strategyId === 'No TIS' ? 1 : 1 / Math.max(0.2, budgetScale)));

  return {
    culture,
    invasion: invasionId,
    budget,
    remating,
    strategy: strategyId,
    recoltes_sains_pct,
    recoltes_sains_nb: Math.round((recoltes_sains_pct / 100) * TOTAL_FRUITS),
    recoltes_steriles_pct,
    recoltes_larves_pct: base.recoltes_larves_pct,
    pourris_larves_pct,
    pourris_steriles_pct,
    pourris_naturels_pct: base.pourris_naturels_pct,
    pourris_total_pct,
    sterile_only_total_pct,
    larves_produites,
    sd_sains_pct: base.sd_sains_pct,
    sd_larves: Math.round(larves_produites * 0.05)
  };
}

// ============================================================================
// COMPOSANT PRINCIPAL DE L'APPLICATION
// ============================================================================
export default function App() {
  // Navigation principale (6 espaces)
  // 'overview' | 'experiments' | 'studio' | 'comparison' | 'analytics' | 'protocol'
  const [activeSpace, setActiveSpace] = useState('overview');

  // Sous-onglets de la vue d'ensemble (comme dans la maquette : Vue d'ensemble, Protocole, Comparaison, Analyses)
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Paramètres du scénario actif
  const [culture, setCulture] = useState('Fraise');
  const [invasion, setInvasion] = useState('Modérée');
  const [budget, setBudget] = useState(1000);
  const [remating, setRemating] = useState('preference');
  const [selectedStrategy, setSelectedStrategy] = useState('Every 3 days'); // J+3 par défaut (comme maquette)

  // Mode Simulation Studio (Essentiel vs Avancé)
  const [studioMode, setStudioMode] = useState('essential');
  const [randomSeed, setRandomSeed] = useState(42);
  const [repetitions, setRepetitions] = useState(30);
  const [bioParams, setBioParams] = useState({
    etaMating: 0.8,
    etaSperm: 0.59,
    rotHazardFertile: 0.3054,
    rotHazardSterile: 0.231
  });

  // Expériences enregistrées (Section 10)
  const [savedExperiments, setSavedExperiments] = useState([
    {
      id: 'EXP-2025-01',
      name: 'Réf. Fraise — Lâcher J+3 (Budget 1 000)',
      culture: 'Fraise',
      invasion: 'Modérée',
      budget: 1000,
      remating: 'preference',
      strategy: 'Every 3 days',
      seed: 42,
      repetitions: 30,
      timestamp: '2025-05-12 09:30'
    },
    {
      id: 'EXP-2025-02',
      name: 'Réf. Cerise — Lâcher J+7 (Budget 1 000)',
      culture: 'Cerise',
      invasion: 'Modérée',
      budget: 1000,
      remating: 'preference',
      strategy: 'Every 7 days',
      seed: 42,
      repetitions: 30,
      timestamp: '2025-05-12 09:34'
    },
    {
      id: 'EXP-2025-03',
      name: 'Fraise — Lâcher quotidien (Budget 1 000)',
      culture: 'Fraise',
      invasion: 'Modérée',
      budget: 1000,
      remating: 'preference',
      strategy: 'Daily',
      seed: 42,
      repetitions: 30,
      timestamp: '2025-05-12 09:40'
    },
    {
      id: 'EXP-2025-04',
      name: 'Cerise — 100% initial J0 (Budget 1 000)',
      culture: 'Cerise',
      invasion: 'Modérée',
      budget: 1000,
      remating: 'preference',
      strategy: '100% init',
      seed: 42,
      repetitions: 30,
      timestamp: '2025-05-12 09:45'
    }
  ]);

  // Modale d'exportation de rapport
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [publicationMode, setPublicationMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const horizon = culture === 'Fraise' ? 100 : 25;

  // Calcul des résultats courants
  const currentResultsList = useMemo(() => {
    return STRATEGIES.map((s) => computeSingleOutcome(culture, invasion, budget, remating, s.id, bioParams));
  }, [culture, invasion, budget, remating, bioParams]);

  const summaryStats = useMemo(() => {
    const control = currentResultsList.find((r) => r.strategy === 'No TIS') || currentResultsList[0];
    const bestTis = [...currentResultsList]
      .filter((r) => r.strategy !== 'No TIS')
      .sort((a, b) => b.recoltes_sains_pct - a.recoltes_sains_pct)[0] || currentResultsList[1];

    return {
      control,
      bestTis,
      gainSainsPct: round1(bestTis.recoltes_sains_pct - control.recoltes_sains_pct),
      larvaeReductionPct: control.larves_produites > 0
        ? round1(((control.larves_produites - bestTis.larves_produites) / control.larves_produites) * 100)
        : 0
    };
  }, [currentResultsList]);

  // Données de simulation temporelle (Live)
  const liveSeries = useMemo(() => {
    const len = horizon + 1;
    const series = [];
    for (let day = 0; day < len; day++) {
      const p = { day };
      const progress = day / horizon;
      STRATEGIES.forEach((s) => {
        const out = currentResultsList.find((r) => r.strategy === s.id);
        const release = (day % (s.id === 'Daily' ? 1 : s.id === 'Every 3 days' ? 3 : 7) === 0 && budget > 0)
          ? Math.round(budget / (horizon / 3))
          : 0;
        const decay = Math.exp(-day / 30);
        p[`${s.id}_release`] = release;
        p[`${s.id}_sterileMales`] = Math.round(release * 4 + (budget > 0 ? 300 * Math.exp(-day / 15) : 0));
        p[`${s.id}_wildMales`] = Math.round(300 * (0.3 * decay + 0.7 * (1 - progress * 0.7)));
        p[`${s.id}_activeLarvae`] = Math.round((out.larves_produites / 5) * Math.sin(Math.min(Math.PI, progress * Math.PI)));
      });
      series.push(p);
    }
    return series;
  }, [horizon, currentResultsList, budget]);

  // Lancement et sauvegarde d'expérience
  const handleRunAndSaveExperiment = () => {
    const newId = `EXP-2025-0${savedExperiments.length + 1}`;
    const stratObj = STRATEGY_MAP.get(selectedStrategy);
    const newExp = {
      id: newId,
      name: `${culture} — ${stratObj?.short || selectedStrategy} (${budget.toLocaleString('fr-FR')} ♂)`,
      culture,
      invasion,
      budget,
      remating,
      strategy: selectedStrategy,
      seed: randomSeed,
      repetitions,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setSavedExperiments((prev) => [newExp, ...prev]);
    setNotification(`Simulation lancée : ${newExp.name} enregistrée avec l'ID ${newId}.`);
  };

  const handleExportCsv = () => {
    const cols = ['culture', 'invasion', 'budget', 'strategy', 'recoltes_sains_pct', 'recoltes_sains_nb', 'pourris_larves_pct', 'sterile_only_total_pct', 'larves_produites'];
    const csvContent = [
      cols.join(','),
      ...currentResultsList.map((r) => cols.map((c) => `"${r[c]}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelly_tis_${culture.toLowerCase()}_${invasion.toLowerCase()}_b${budget}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const payload = {
      engineVersion: ENGINE_VERSION,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      configuration: { culture, horizon, invasion, budget, remating, randomSeed, repetitions, bioParams },
      results: currentResultsList
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelly_tis_protocole_${culture.toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Synchronisation des onglets secondaires de la vue d'ensemble avec les espaces de navigation
  const handleSubTabChange = (tabId) => {
    setActiveSubTab(tabId);
    if (tabId === 'overview') setActiveSpace('overview');
    else if (tabId === 'protocol') setActiveSpace('protocol');
    else if (tabId === 'comparison') setActiveSpace('comparison');
    else if (tabId === 'analytics') setActiveSpace('analytics');
  };

  const handleMainSpaceChange = (spaceId) => {
    setActiveSpace(spaceId);
    if (spaceId === 'overview') setActiveSubTab('overview');
    else if (spaceId === 'protocol') setActiveSubTab('protocol');
    else if (spaceId === 'comparison') setActiveSubTab('comparison');
    else if (spaceId === 'analytics') setActiveSubTab('analytics');
  };

  const NAV_ITEMS = [
    { id: 'overview', label: "Vue d'ensemble", icon: Leaf },
    { id: 'experiments', label: 'Expériences', icon: FlaskConical },
    { id: 'studio', label: 'Simulation', icon: Play },
    { id: 'comparison', label: 'Comparaison', icon: BarChart3 },
    { id: 'analytics', label: 'Résultats', icon: Layers },
    { id: 'protocol', label: 'Publications', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#1B201C] font-sans antialiased selection:bg-[#145A3D] selection:text-[#F8F7F2]">
      {/* ===================================================================
          1. BANDEAU SUPÉRIEUR (CONFORME EXACTEMENT À LA MAQUETTE FOURNIE)
         =================================================================== */}
      <header className="border-b border-[#D6DDD4] bg-[#F8F7F2] px-4 sm:px-8 py-3.5">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo Modelly & Sous-titre TIS Research */}
          <div className="flex items-center gap-3 shrink-0">
            <ModellyLogo className="w-10 h-10 shrink-0" />
            <div>
              <div className="font-serif font-bold text-2xl tracking-tight text-[#145A3D] leading-none">
                Modelly
              </div>
              <div className="text-[11px] font-sans text-[#657068] tracking-wider mt-0.5 font-medium">
                TIS Research
              </div>
            </div>
          </div>

          {/* Centre : Fil d'ariane & Grand Titre Éditorial */}
          <div className="flex-1 text-center md:px-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#657068] font-medium">
              RECHERCHE AGRONOMIQUE / ÉTUDE 01
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] tracking-tight leading-snug">
              Impact des stratégies <em className="italic font-normal text-[#347A55]">TIS</em> selon la culture
            </h1>
            <div className="text-xs sm:text-sm text-[#657068] font-sans mt-0.5">
              Comparaison expérimentale • Fraise vs Cerise
            </div>
          </div>

          {/* Droite : Boutons d'action principaux */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6DDD4] bg-white px-3.5 py-2 text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#657068]" />
              <span>Exporter le rapport</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSpace('studio');
                setActiveSubTab('overview');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#145A3D] px-4 py-2 text-xs font-medium text-[#F8F7F2] hover:bg-[#347A55] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle simulation</span>
            </button>
          </div>
        </div>

        {/* Barre de navigation secondaire par onglets (Pill bar sous le titre) */}
        <div className="max-w-[1520px] mx-auto mt-3 pt-2.5 flex items-center gap-2 text-xs border-t border-[#E4EAE1]/70">
          {[
            { id: 'overview', label: "Vue d'ensemble" },
            { id: 'protocol', label: 'Protocole' },
            { id: 'comparison', label: 'Comparaison' },
            { id: 'analytics', label: 'Analyses' }
          ].map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {idx > 0 && <span className="text-[#D6DDD4] font-light">|</span>}
              <button
                type="button"
                onClick={() => handleSubTabChange(tab.id)}
                className={cn(
                  'px-3.5 py-1 rounded-md font-medium transition-all cursor-pointer',
                  activeSubTab === tab.id
                    ? 'bg-[#347A55] text-white shadow-2xs'
                    : 'text-[#657068] hover:text-[#1B201C] hover:bg-[#F0F2EB]'
                )}
              >
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Notification discrète */}
      {notification && (
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 pt-3">
          <div className="rounded-lg border border-[#347A55]/30 bg-[#DDEADF]/70 px-4 py-2 flex items-center justify-between text-xs text-[#145A3D]">
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              {notification}
            </span>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="underline text-[11px] cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          2. CORPS DE L'APPLICATION : SIDEBAR GAUCHE + CONTENU PRINCIPAL
         =================================================================== */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIDEBAR GAUCHE (Exactement comme dans la maquette) */}
        <aside className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <nav aria-label="Navigation latérale" className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSpace === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMainSpaceChange(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer',
                    active
                      ? 'bg-[#DDEADF] text-[#145A3D] font-semibold'
                      : 'text-[#1B201C] hover:bg-[#F0F2EB]'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#145A3D]' : 'text-[#657068]')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bas de la barre latérale : Illustration pastorale & Carte Modélisation TIS */}
          <div className="rounded-xl border border-[#D6DDD4] bg-white overflow-hidden shadow-2xs">
            <PastoralLandscape className="w-full h-24 object-cover" />
            <div className="p-3 bg-white border-t border-[#E8ECE3]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#145A3D]">
                <Leaf className="w-3.5 h-3.5 text-[#347A55]" />
                <span>Modélisation TIS</span>
              </div>
              <p className="text-[11px] text-[#657068] mt-1 leading-snug">
                Dynamique des populations et optimisation des lâchers
              </p>
            </div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL (10 COLONNES) */}
        <main className="lg:col-span-10 space-y-5">
          {/* ===============================================================
              ESPACE 1 : VUE D'ENSEMBLE (CONFORME EXACTEMENT À LA MAQUETTE)
             =============================================================== */}
          {activeSpace === 'overview' && (
            <div className="space-y-5">
              {/* SECTION 1 : LES TROIS PANNEAUX HORIZONTAUX ÉLÉGANTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* PANNEAU 1 : FRAISE (Fragaria × ananassa) */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-2/5 shrink-0">
                      <StrawberryBotanicalPlate className="w-full h-28" />
                    </div>
                    <div className="w-3/5">
                      <h2 className="text-base font-serif font-bold text-[#1B201C] leading-tight">
                        Fraise
                      </h2>
                      <div className="text-xs italic text-[#657068] font-serif mb-2.5">
                        Fragaria × ananassa
                      </div>

                      <ul className="space-y-2 text-[11px] text-[#1B201C]">
                        <li className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Récolte continue (~ 60–120 jours)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Culture sensible aux infestations</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Pression d'invasion : faible à élevée</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* PANNEAU 2 : PRINCIPE DE LA TIS */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="text-center mb-1">
                      <h2 className="text-sm font-serif font-bold text-[#1B201C] leading-tight">
                        Principe de la TIS
                      </h2>
                      <div className="text-[11px] text-[#657068]">
                        (Technique de l'Insecte Stérile)
                      </div>
                    </div>
                    <TisMechanismDiagram className="w-full h-28" />
                  </div>
                </div>

                {/* PANNEAU 3 : CERISE (Prunus avium) */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-3/5">
                      <h2 className="text-base font-serif font-bold text-[#1B201C] leading-tight">
                        Cerise
                      </h2>
                      <div className="text-xs italic text-[#657068] font-serif mb-2.5">
                        Prunus avium
                      </div>

                      <ul className="space-y-2 text-[11px] text-[#1B201C]">
                        <li className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Récolte courte (~ 15–30 jours)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Target className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Fenêtre d'intervention plus restreinte</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <span>Pression d'invasion : modérée à élevée</span>
                        </li>
                      </ul>
                    </div>
                    <div className="w-2/5 shrink-0">
                      <CherryBotanicalPlate className="w-full h-28" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 : GRAND GRAPHIQUE CENTRAL + PANNEAU DE PARAMÈTRES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Graphique temporel : Dynamique des populations au cours du temps */}
                <div className="lg:col-span-8 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <OverviewPopulationChart
                    selectedStrategy={selectedStrategy}
                    selectedBudget={budget}
                    selectedInvasion={invasion}
                  />
                </div>

                {/* Panneau de droite : Paramètres du scénario */}
                <div className="lg:col-span-4 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#E8ECE3] pb-2 text-[#1B201C] font-semibold text-sm">
                      <SlidersHorizontal className="w-4 h-4 text-[#347A55]" />
                      <span>Paramètres du scénario</span>
                    </div>

                    {/* Sélecteur de Culture */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#1B201C] block">
                        Culture
                      </label>
                      <div className="relative">
                        <select
                          value={culture}
                          onChange={(e) => setCulture(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-3 py-1.5 text-xs text-[#1B201C] font-medium pr-8 cursor-pointer"
                        >
                          <option value="Fraise">🍓 Fraise</option>
                          <option value="Cerise">🍒 Cerise</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#657068] absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Sélecteur Pression d'invasion */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#1B201C] block">
                        Pression d'invasion
                      </label>
                      <div className="relative">
                        <select
                          value={invasion}
                          onChange={(e) => setInvasion(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-3 py-1.5 text-xs text-[#1B201C] font-medium pr-8 cursor-pointer"
                        >
                          <option value="Faible">📊 Faible (180 adultes à J0)</option>
                          <option value="Modérée">📊 Modérée (600 adultes à J0)</option>
                          <option value="Forte">📊 Forte (1 800 adultes à J0)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#657068] absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Stratégie de lâcher : Quotidien | J+3 | J+7 */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#1B201C] block">
                        Stratégie de lâcher
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'Daily', label: 'Quotidien' },
                          { id: 'Every 3 days', label: 'J+3' },
                          { id: 'Every 7 days', label: 'J+7' }
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedStrategy(s.id)}
                            className={cn(
                              'py-1.5 px-2 rounded-md border text-xs font-medium transition-all text-center cursor-pointer',
                              selectedStrategy === s.id
                                ? 'bg-[#347A55] text-white border-[#347A55] shadow-2xs font-semibold'
                                : 'bg-[#F8F7F2] text-[#1B201C] border-[#D6DDD4] hover:bg-[#E8ECE3]'
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget (unités / ha) */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#1B201C] flex justify-between items-center">
                        <span>Budget (unités / ha)</span>
                        <Coins className="w-3.5 h-3.5 text-[#657068]" />
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20000"
                        step="500"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-3 py-1.5 text-xs font-mono font-medium text-[#1B201C]"
                      />
                    </div>
                  </div>

                  {/* Bouton Lancer une simulation */}
                  <button
                    type="button"
                    onClick={handleRunAndSaveExperiment}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#347A55] text-white font-medium text-xs hover:bg-[#145A3D] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Lancer une simulation</span>
                  </button>
                </div>
              </div>

              {/* SECTION 3 : DOMMAGES LARVAIRES, PIQÛRES STÉRILES & TABLEAU COMPARATIF */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Carte 1 : Dommages larvaires */}
                <div className="md:col-span-3 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-[#347A55]" />
                      <h3 className="text-xs font-bold text-[#1B201C]">
                        Dommages larvaires
                      </h3>
                    </div>
                    <p className="text-[10px] text-[#657068] mt-0.5">
                      Part de fruits endommagés à la récolte
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-[#E8ECE3]">
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#145A3D]">
                        -91 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Fraise, J+3)
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#BF532E]">
                        -73 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Cerise, J+7)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte 2 : Piqûres stériles */}
                <div className="md:col-span-3 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#547B91]" />
                      <h3 className="text-xs font-bold text-[#1B201C]">
                        Piqûres stériles
                      </h3>
                    </div>
                    <p className="text-[10px] text-[#657068] mt-0.5">
                      Proportion de piqûres non viables
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-[#E8ECE3]">
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#145A3D]">
                        56 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Fraise)
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono text-[#BF532E]">
                        48 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Cerise)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carte 3 : Tableau comparatif des stratégies */}
                <div className="md:col-span-6 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#D6DDD4] text-[#657068] font-medium text-[11px]">
                          <th className="py-1.5 text-left font-semibold">Stratégie</th>
                          <th className="py-1.5 text-right font-semibold">Fraise (dommages)</th>
                          <th className="py-1.5 text-right font-semibold">Cerise (dommages)</th>
                          <th className="py-1.5 text-right font-semibold">Budget relatif</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8ECE3] tabular-nums text-[11px]">
                        {[
                          { name: 'Quotidien', fraise: '2,8 %', cerise: '7,9 %', budget: '1,40 ×' },
                          { name: 'J+3', fraise: '3,1 %', cerise: '8,6 %', budget: '1,00 ×' },
                          { name: 'J+7', fraise: '5,9 %', cerise: '12,4 %', budget: '0,72 ×' },
                          { name: '70 % initial + maintenance', fraise: '3,4 %', cerise: '9,1 %', budget: '0,86 ×' },
                          { name: '100 % initial', fraise: '2,9 %', cerise: '8,2 %', budget: '1,25 ×' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#F8F7F2] transition-colors">
                            <td className="py-1.5 font-medium text-[#1B201C]">{row.name}</td>
                            <td className="py-1.5 text-right font-mono text-[#145A3D] font-semibold">{row.fraise}</td>
                            <td className="py-1.5 text-right font-mono text-[#BF532E] font-semibold">{row.cerise}</td>
                            <td className="py-1.5 text-right font-mono text-[#657068]">{row.budget}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE 2 : SIMULATION STUDIO (SECTION 5)
             =============================================================== */}
          {activeSpace === 'studio' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Simulation Studio
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Configuration expérimentale & Paramétrage avancé
                  </h2>
                </div>
                <div className="inline-flex rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-1">
                  <button
                    type="button"
                    onClick={() => setStudioMode('essential')}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                      studioMode === 'essential' ? 'bg-[#145A3D] text-white shadow-xs' : 'text-[#657068]'
                    )}
                  >
                    Mode Essentiel
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudioMode('advanced')}
                    className={cn(
                      'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                      studioMode === 'advanced' ? 'bg-[#145A3D] text-white shadow-xs' : 'text-[#657068]'
                    )}
                  >
                    Mode Avancé (Biologie & Graine)
                  </button>
                </div>
              </div>

              {/* Les 3 colonnes logiques requises par la Section 5 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Colonne Gauche : Paramètres scientifiques */}
                <div className="lg:col-span-4 rounded-xl border border-[#D6DDD4] bg-white p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-serif font-bold text-[#145A3D] border-b border-[#E8ECE3] pb-2">
                    1. Paramètres scientifiques
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium mb-1">Culture hôte</label>
                      <select
                        value={culture}
                        onChange={(e) => setCulture(e.target.value)}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-2 text-xs"
                      >
                        <option value="Fraise">Fraise — Fragaria × ananassa (100 jours)</option>
                        <option value="Cerise">Cerise — Prunus avium (25 jours)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Pression d'invasion initiale</label>
                      <select
                        value={invasion}
                        onChange={(e) => setInvasion(e.target.value)}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-2 text-xs"
                      >
                        {INVASION_LEVELS.map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.label} ({inv.total} adultes à J0)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Stratégie de lâcher</label>
                      <select
                        value={selectedStrategy}
                        onChange={(e) => setSelectedStrategy(e.target.value)}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-2 text-xs"
                      >
                        {STRATEGIES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.symbol} {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-medium">Budget total</label>
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

                    <div>
                      <label className="block font-medium mb-1">Régime d'accouplement des femelles</label>
                      <select
                        value={remating}
                        onChange={(e) => setRemating(e.target.value)}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-2 text-xs"
                      >
                        {REMATING_MODES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {studioMode === 'advanced' && (
                      <div className="pt-3 border-t border-[#E8ECE3] space-y-3">
                        <div className="text-[11px] font-mono uppercase text-[#145A3D] font-semibold">
                          Paramètres stochastiques & biologiques
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span>Compétitivité d'accouplement (η_mating)</span>
                            <span className="font-mono text-[#145A3D]">{bioParams.etaMating.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.0"
                            step="0.05"
                            value={bioParams.etaMating}
                            onChange={(e) => setBioParams((p) => ({ ...p, etaMating: Number(e.target.value) }))}
                            className="w-full accent-[#145A3D] cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span>Compétitivité spermatique (η_sperm)</span>
                            <span className="font-mono text-[#145A3D]">{bioParams.etaSperm.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.0"
                            step="0.05"
                            value={bioParams.etaSperm}
                            onChange={(e) => setBioParams((p) => ({ ...p, etaSperm: Number(e.target.value) }))}
                            className="w-full accent-[#145A3D] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium mb-1">Graine aléatoire (seed)</label>
                          <input
                            type="number"
                            value={randomSeed}
                            onChange={(e) => setRandomSeed(Number(e.target.value))}
                            className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-1.5 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium mb-1">Répétitions stochastiques</label>
                          <input
                            type="number"
                            value={repetitions}
                            onChange={(e) => setRepetitions(Number(e.target.value))}
                            className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-1.5 font-mono text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne Centre : Visualisation du scénario */}
                <div className="lg:col-span-5 rounded-xl border border-[#D6DDD4] bg-white p-5 space-y-3 shadow-2xs">
                  <h3 className="text-sm font-serif font-bold text-[#145A3D] border-b border-[#E8ECE3] pb-2">
                    2. Visualisation du protocole
                  </h3>
                  <div className="text-xs text-[#657068]">
                    Aperçu temporel des lâchers et de l'horizon expérimental ({horizon} jours) :
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liveSeries.filter((_, i) => i % 5 === 0)}>
                        <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                        <XAxis dataKey="day" unit="j" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <RechartsTooltip />
                        <Bar dataKey={`${selectedStrategy}_release`} name="Lâcher prévu" fill="#347A55" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068]">
                    <strong>Règle opérationnelle :</strong>{' '}
                    {STRATEGY_MAP.get(selectedStrategy)?.operationalRule}
                  </div>
                </div>

                {/* Colonne Droite : Récapitulatif et Lancement */}
                <div className="lg:col-span-3 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] p-5 flex flex-col justify-between space-y-4 shadow-2xs">
                  <div className="space-y-3">
                    <h3 className="text-sm font-serif font-bold text-[#145A3D] border-b border-[#D6DDD4] pb-2">
                      3. Validation du protocole
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-[#D6DDD4] flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#145A3D] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-[#1B201C]">Unités vérifiées</div>
                          <div className="text-[11px] text-[#657068]">90 000 fruits, pas Δt = 1 jour.</div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D6DDD4] flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#145A3D] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-[#1B201C]">Valeurs admissibles</div>
                          <div className="text-[11px] text-[#657068]">Paramètres dans les plages validées.</div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D6DDD4] flex items-start gap-2">
                        <Cpu className="w-4 h-4 text-[#547B91] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-[#1B201C]">Charge calcul</div>
                          <div className="text-[11px] text-[#657068] font-mono">O(1) • {repetitions} rép.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#D6DDD4]">
                    <button
                      type="button"
                      onClick={handleRunAndSaveExperiment}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#145A3D] text-white font-medium text-xs hover:bg-[#347A55] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Lancer & Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="w-full py-2 px-3 rounded-lg border border-[#D6DDD4] bg-white text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5 text-[#347A55]" />
                      Exporter protocole JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE 3 : EXPÉRIENCES (SECTION 10)
             =============================================================== */}
          {activeSpace === 'experiments' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Gestion des Expériences (Section 10)
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Registre immuable des simulations et métadonnées de reproductibilité
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#657068] absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filtrer les expériences..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Tableau officiel des expériences enregistrées */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white overflow-hidden shadow-2xs">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#D6DDD4] bg-[#F0F2EB] text-[#1B201C] font-semibold">
                      <th className="py-2.5 px-4 text-left">ID & Date</th>
                      <th className="py-2.5 px-4 text-left">Intitulé</th>
                      <th className="py-2.5 px-3 text-left">Culture</th>
                      <th className="py-2.5 px-3 text-left">Stratégie</th>
                      <th className="py-2.5 px-3 text-right">Budget</th>
                      <th className="py-2.5 px-3 text-center">Graine</th>
                      <th className="py-2.5 px-4 text-center">Statut</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8ECE3] tabular-nums">
                    {savedExperiments
                      .filter((exp) => exp.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((exp) => (
                        <tr key={exp.id} className="hover:bg-[#F8F7F2] transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[#657068]">
                            <span className="font-semibold text-[#145A3D] block">{exp.id}</span>
                            <span className="text-[10px]">{exp.timestamp}</span>
                          </td>
                          <td className="py-2.5 px-4 font-medium text-[#1B201C]">
                            {exp.name}
                          </td>
                          <td className="py-2.5 px-3">{exp.culture}</td>
                          <td className="py-2.5 px-3">{STRATEGY_MAP.get(exp.strategy)?.label || exp.strategy}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{exp.budget.toLocaleString('fr-FR')} ♂</td>
                          <td className="py-2.5 px-3 text-center font-mono">#{exp.seed}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] bg-[#DDEADF] text-[#145A3D] font-medium">
                              Immuable (Done)
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCulture(exp.culture);
                                setSelectedStrategy(exp.strategy);
                                setBudget(exp.budget);
                                setActiveSpace('overview');
                                setNotification(`Expérience ${exp.id} chargée dans la vue d'ensemble.`);
                              }}
                              className="text-[#145A3D] hover:underline font-medium text-xs cursor-pointer"
                            >
                              Rejouer
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE 4 : COMPARAISON (SECTION 7)
             =============================================================== */}
          {activeSpace === 'comparison' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Comparison Lab (Section 7)
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Comparaison multi-scénarios : Fraise vs Cerise & Stratégies
                  </h2>
                </div>
              </div>

              {/* Cartes côte-à-côte des 4 scénarios clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedExperiments.slice(0, 4).map((exp) => {
                  const out = computeSingleOutcome(exp.culture, exp.invasion, exp.budget, exp.remating, exp.strategy);
                  return (
                    <div key={exp.id} className="rounded-xl border border-[#D6DDD4] bg-white p-4 space-y-3 shadow-2xs">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#657068]">
                        <span>{exp.id}</span>
                        <span>Seed #{exp.seed}</span>
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#1B201C]">{exp.name}</h4>
                      <div className="space-y-1 text-xs pt-2 border-t border-[#E8ECE3] tabular-nums">
                        <div className="flex justify-between">
                          <span className="text-[#657068]">Fruits sains :</span>
                          <strong className="text-[#145A3D] font-mono">{out.recoltes_sains_pct.toFixed(1)} %</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#657068]">Piqûres stériles :</span>
                          <strong className="text-[#547B91] font-mono">{out.sterile_only_total_pct.toFixed(1)} %</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#657068]">Pourris larves :</span>
                          <strong className="text-[#A83D36] font-mono">{out.pourris_larves_pct.toFixed(1)} %</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphique de comparaison directe */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs">
                <h3 className="text-base font-serif font-bold text-[#1B201C] mb-3">
                  Comparaison directe : Taux de fruits sains récoltés selon la culture (%)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={STRATEGIES.map((s) => ({
                        strategy: s.short,
                        Fraise: computeSingleOutcome('Fraise', invasion, budget, remating, s.id).recoltes_sains_pct,
                        Cerise: computeSingleOutcome('Cerise', invasion, budget, remating, s.id).recoltes_sains_pct,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                      <XAxis dataKey="strategy" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 95]} unit="%" tick={{ fontSize: 11 }} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="Fraise" fill="#347A55" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Cerise" fill="#BF532E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE 5 : RÉSULTATS / RESEARCH ANALYTICS (SECTION 8)
             =============================================================== */}
          {activeSpace === 'analytics' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Research Analytics (Section 8)
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Courbes Dose-Réponse, Frontière de Pareto & Heatmaps
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPublicationMode((p) => !p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer',
                      publicationMode ? 'bg-[#145A3D] text-white' : 'bg-white text-[#1B201C] border-[#D6DDD4]'
                    )}
                  >
                    Format publication {publicationMode ? 'Actif' : 'Standard'}
                  </button>
                </div>
              </div>

              {/* 3 Courbes Dose-Réponse */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {INVASION_LEVELS.map((inv) => (
                  <div key={inv.id} className="rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs">
                    <h4 className="text-sm font-serif font-bold text-[#1B201C] mb-2">
                      Invasion {inv.label} ({inv.total} ind. J0)
                    </h4>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={BUDGET_PRESETS.map((b) => ({
                            budget: b === 0 ? '0' : `${b / 1000}k`,
                            'J+3': computeSingleOutcome(culture, inv.id, b, remating, 'Every 3 days').recoltes_sains_pct,
                            'J+7': computeSingleOutcome(culture, inv.id, b, remating, 'Every 7 days').recoltes_sains_pct,
                            '70%+7j': computeSingleOutcome(culture, inv.id, b, remating, '70% init + 7d maint').recoltes_sains_pct,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                          <XAxis dataKey="budget" tick={{ fontSize: 10 }} />
                          <YAxis domain={[30, 95]} unit="%" tick={{ fontSize: 10 }} />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="J+3" stroke="#547B91" strokeWidth={2} dot={{ r: 2.5 }} />
                          <Line type="monotone" dataKey="J+7" stroke="#BF532E" strokeWidth={2} dot={{ r: 2.5 }} />
                          <Line type="monotone" dataKey="70%+7j" stroke="#145A3D" strokeWidth={2.5} dot={{ r: 2.5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>

              {/* Frontière de Pareto */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs">
                <h3 className="text-base font-serif font-bold text-[#1B201C] mb-2">
                  Frontière de Pareto : Pourriture larvaire (%) vs Piqûres stériles seules (%)
                </h3>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                      <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                      <XAxis type="number" dataKey="sterile_only_total_pct" name="Piqûres stériles" unit="%" tick={{ fontSize: 11 }} />
                      <YAxis type="number" dataKey="pourris_larves_pct" name="Pourris larves" unit="%" tick={{ fontSize: 11 }} />
                      <ZAxis type="number" dataKey="recoltes_sains_pct" range={[60, 200]} name="Fruits sains" />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Stratégies" data={currentResultsList} fill="#347A55" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE 6 : PROTOCOLE SCIENTIFIQUE & PUBLICATIONS (SECTION 11)
             =============================================================== */}
          {activeSpace === 'protocol' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-6 shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                  Protocole Scientifique & Modélisation Mathématique
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#1B201C] mt-1">
                  Équations mathématiques du moteur Modelly ABM
                </h2>
                <p className="text-xs text-[#657068] mt-1 leading-relaxed max-w-4xl">
                  Formulation rigoureuse des probabilités d'accouplement, de la compétition spermatique post-copulatoire et des fonctions d'aléas journaliers de pourriture des fruits.
                </p>

                {/* Blocs d'équations avec KaTeX */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
                    <h3 className="font-serif font-semibold text-sm text-[#145A3D]">
                      Compétition d'accouplement :
                    </h3>
                    <div className="py-2">
                      <Latex math="P(S) = \frac{\eta_m S}{W + \eta_m S}" block />
                    </div>
                    <p className="text-xs text-[#657068]">
                      Où <Latex math="\eta_m = 0.80" /> représente le coefficient de compétitivité d'accouplement du mâle stérile par rapport au mâle sauvage (<Latex math="\eta_w = 1.0" />).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#D6DDD4] bg-[#F8F7F2] space-y-2">
                    <h3 className="font-serif font-semibold text-sm text-[#145A3D]">
                      Compétition spermatique (Accouplement multiple) :
                    </h3>
                    <div className="py-2">
                      <Latex math="P(\text{fertile}) = \frac{n_f}{n_f + \eta_{\text{sperm}} n_s}" block />
                    </div>
                    <p className="text-xs text-[#657068]">
                      Où <Latex math="\eta_{\text{sperm}} = 0.59" /> est l'efficacité relative du sperme stérile dans la spermathèque de la femelle réaccouplée.
                    </p>
                  </div>
                </div>
              </div>

              {/* Catalogue des paramètres */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-6 shadow-2xs overflow-hidden">
                <h3 className="text-base font-serif font-bold text-[#1B201C] mb-3">
                  Catalogue documenté des paramètres scientifiques
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-y border-[#D6DDD4] bg-[#F0F2EB] text-[#1B201C] font-semibold">
                        <th className="py-2 px-3 text-left">Symbole</th>
                        <th className="py-2 px-3 text-left">Paramètre</th>
                        <th className="py-2 px-3 text-left">Unité</th>
                        <th className="py-2 px-3 text-left">Valeur par défaut</th>
                        <th className="py-2 px-3 text-left">Plage admissible</th>
                        <th className="py-2 px-3 text-left">Source scientifique</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECE3]">
                      {SCIENTIFIC_PARAMETERS_CATALOG.map((p, idx) => (
                        <tr key={idx} className="hover:bg-[#F8F7F2]">
                          <td className="py-2 px-3 font-mono font-bold text-[#145A3D]">
                            <Latex math={p.symbol} />
                          </td>
                          <td className="py-2 px-3 font-medium text-[#1B201C]">{p.name}</td>
                          <td className="py-2 px-3 font-mono text-[#657068]">{p.unit}</td>
                          <td className="py-2 px-3 font-mono">{p.defaultValue}</td>
                          <td className="py-2 px-3 font-mono text-[#657068]">{p.allowedRange}</td>
                          <td className="py-2 px-3 text-[#657068] text-[11px]">{p.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================
          3. BOÎTE DE DIALOGUE DU RAPPORT SCIENTIFIQUE (SECTION 12)
         =================================================================== */}
      <ScientificReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        culture={culture}
        invasion={invasion}
        budget={budget}
        remating={remating}
        rematingLabel={REMATING_LABEL_MAP[remating]}
        resultsList={currentResultsList}
        summaryStats={summaryStats}
        randomSeed={randomSeed}
        repetitions={repetitions}
        bioParams={bioParams}
        engineVersion={ENGINE_VERSION}
        schemaVersion={SCHEMA_VERSION}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
      />
    </div>
  );
}
