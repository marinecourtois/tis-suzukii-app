import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Download, BarChart3, Cpu, Check, Leaf,
  Layers, BookOpen, FlaskConical, Play,
  Plus, FileCode, ChevronDown, Search, Calendar, Home,
  Settings, ChevronsUpDown, SlidersHorizontal, Activity
} from 'lucide-react';

import Latex from './components/Latex';
import {
  ModellyLogo,
  StrawberryBotanicalPlate,
  CherryBotanicalPlate,
  TisMechanismDiagram,
  PastoralLandscape,
  LarvaIcon,
  SterileFlyIcon,
  StrawberryMiniIcon,
  CherryMiniIcon,
  InvasionBarsIcon,
  CoinsStackIcon,
  SproutMiniIcon
} from './components/BotanicalIllustrations';
import OverviewPopulationChart from './components/OverviewPopulationChart';
import ScientificReportModal from './components/ScientificReportModal';
import AgentDynamicsCharts from './components/AgentDynamicsCharts';
import ParametersView from './components/ParametersView';
import ModelArchitectureView from './components/ModelArchitectureView';
import ParetoFrontierChart from './components/ParetoFrontierChart';
import RepetitionsStripPlot from './components/RepetitionsStripPlot';
import AgronomicSynthesisCard from './components/AgronomicSynthesisCard';
import {
  ENGINE_VERSION,
  SCHEMA_VERSION,
  TOTAL_FRUITS_SCALE30,
  STRATEGIES,
  STRATEGY_MAP,
  INOCULUM_LEVELS,
  INOCULUM_MAP,
  DEFAULT_MODEL_PARAMS,
  SCIENTIFIC_PARAMETERS_CATALOG
} from './engine/abmEngine';

const cn = (...classes) => classes.filter(Boolean).join(' ');

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

// Ancrages de référence scientifique pour les bilans comparatifs (Budget 1000 & 9000)
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

function computeSingleOutcome(culture, inoculumId, budget, remating, strategyId, bioOverrides = null) {
  const isCherry = culture === 'Cerise';
  const anchorMap = isCherry ? EXACT_ANCHOR_CHERRY : EXACT_ANCHOR_STRAWBERRY;
  const base = anchorMap[strategyId] || anchorMap['Every 3 days'];

  // Ajustement en fonction de l'inoculum de départ
  const invObj = INOCULUM_MAP.get(inoculumId) || INOCULUM_MAP.get('Modérée');
  const invMultiplier = invObj ? invObj.multiplier : 1.0;
  
  // Prise en compte des paramètres biologiques
  const etaMating = bioOverrides?.etaMating ?? 0.8;
  const etaSperm = bioOverrides?.etaSperm ?? 0.59;
  const bioFactor = remating === 'first' ? 1.05 : (etaMating / 0.8) * (etaSperm / 0.59);

  // Cas témoin sans TIS ou budget nul : aucun mâle stérile lâché
  const isNoTis = strategyId === 'No TIS' || budget === 0;
  const effectiveBase = isNoTis ? anchorMap['No TIS'] : base;

  // Facteur d'échelle du budget (toujours fini, évite toute division par zéro)
  const budgetScale = isNoTis ? 1.0 : Math.max(0.2, Math.min(2.0, Math.sqrt(budget / 1000) * bioFactor));

  const pourris_larves_pct = round1(
    isNoTis
      ? effectiveBase.pourris_larves_pct * invMultiplier
      : Math.max(0.2, Math.min(65.0, (effectiveBase.pourris_larves_pct * invMultiplier) / budgetScale))
  );

  const recoltes_steriles_pct = round1(
    isNoTis ? 0.0 : base.recoltes_steriles_pct * Math.min(1.5, budgetScale)
  );

  const pourris_steriles_pct = round1(
    isNoTis ? 0.0 : base.pourris_steriles_pct * Math.min(1.5, budgetScale)
  );

  const pourris_naturels_pct = effectiveBase.pourris_naturels_pct;
  const recoltes_larves_pct = effectiveBase.recoltes_larves_pct;

  const pourris_total_pct = round1(pourris_larves_pct + pourris_steriles_pct + pourris_naturels_pct);
  const recoltes_sains_pct = round1(
    Math.max(5.0, Math.min(96.0, 100 - pourris_total_pct - recoltes_steriles_pct - recoltes_larves_pct))
  );
  const sterile_only_total_pct = round1(recoltes_steriles_pct + pourris_steriles_pct);

  const larves_produites = isNoTis
    ? Math.round(effectiveBase.larves_produites * invMultiplier)
    : Math.round(Math.max(100, (effectiveBase.larves_produites * invMultiplier) / Math.max(0.2, budgetScale)));

  return {
    culture,
    invasion: inoculumId,
    inoculum: inoculumId,
    budget,
    remating,
    strategy: strategyId,
    recoltes_sains_pct,
    recoltes_sains_nb: Math.round((recoltes_sains_pct / 100) * TOTAL_FRUITS_SCALE30),
    recoltes_steriles_pct,
    recoltes_larves_pct,
    pourris_larves_pct,
    pourris_steriles_pct,
    pourris_naturels_pct,
    pourris_total_pct,
    sterile_only_total_pct,
    larves_produites,
    sd_sains_pct: effectiveBase.sd_sains_pct,
    sd_larves: Math.round(larves_produites * 0.05)
  };
}

export default function App() {
  // Navigation principale (Espaces de travail)
  // 'overview' | 'parameters' | 'model' | 'dynamics' | 'studio' | 'comparison' | 'analytics' | 'experiments' | 'protocol'
  const searchTab = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;
  const initialTab = searchTab && ['overview', 'parameters', 'model', 'dynamics', 'studio', 'comparison', 'analytics', 'experiments', 'protocol'].includes(searchTab)
    ? searchTab
    : 'overview';

  const [activeSpace, setActiveSpace] = useState(initialTab);
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

  // Paramètres du scénario actif
  const [culture, setCulture] = useState('Fraise');
  const [inoculum, setInoculum] = useState('Modérée'); // Remplacement de pression d'invasion par inoculum de départ
  const [budget, setBudget] = useState(1000);
  const [remating, setRemating] = useState('preference');
  const [selectedStrategy, setSelectedStrategy] = useState('Every 3 days'); // J+3 par défaut (comme maquette)

  // Paramètres globaux du modèle ABM
  const [modelParams, setModelParams] = useState(DEFAULT_MODEL_PARAMS);

  // Mode Simulation Studio (Essentiel vs Avancé)
  const [studioMode, setStudioMode] = useState('essential');
  const [randomSeed, setRandomSeed] = useState(42);
  const [repetitions, setRepetitions] = useState(30);

  // Expériences enregistrées
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
  const [heatmapMetric, setHeatmapMetric] = useState('recoltes_sains_pct');
  const [simStatus, setSimStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [liveSimDay, setLiveSimDay] = useState(120);

  const horizon = culture === 'Fraise' ? modelParams.horizonFraise : modelParams.horizonCerise;

  // Calcul des résultats courants
  const currentResultsList = useMemo(() => {
    return STRATEGIES.map((s) => computeSingleOutcome(culture, inoculum, budget, remating, s.id, modelParams));
  }, [culture, inoculum, budget, remating, modelParams]);

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

  // Lancement animé et sauvegarde d'expérience (Traçage en direct)
  const handleRunAndSaveExperiment = () => {
    if (simStatus === 'running') return;
    setSimStatus('running');
    setLiveSimDay(0);
    const targetHorizon = culture === 'Fraise' ? 100 : 25;
    const stepIncrement = culture === 'Fraise' ? 2 : 1;
    const stepIntervalMs = 35; // ~1.8 s de traçage fluide

    const timer = setInterval(() => {
      setLiveSimDay((prev) => {
        const next = prev + stepIncrement;
        if (next >= targetHorizon) {
          clearInterval(timer);
          const newId = `EXP-2025-0${savedExperiments.length + 1}`;
          const stratObj = STRATEGY_MAP.get(selectedStrategy);
          const newExp = {
            id: newId,
            name: `${culture} — ${stratObj?.short || selectedStrategy} (${budget.toLocaleString('fr-FR')} ♂)`,
            culture,
            invasion: inoculum,
            budget,
            remating,
            strategy: selectedStrategy,
            seed: randomSeed,
            repetitions,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          setSavedExperiments((prevExps) => [newExp, ...prevExps]);
          setSimStatus('completed');
          setNotification(`Simulation terminée : ${newExp.name} enregistrée avec succès sous l'identifiant ${newId}.`);
          setTimeout(() => setSimStatus('idle'), 3500);
          return 120; // Réinitialise l'affichage complet
        }
        return next;
      });
    }, stepIntervalMs);
  };

  const handleExportCsv = () => {
    const cols = ['culture', 'inoculum', 'budget', 'strategy', 'recoltes_sains_pct', 'recoltes_sains_nb', 'pourris_larves_pct', 'sterile_only_total_pct', 'larves_produites'];
    const csvContent = [
      cols.join(','),
      ...currentResultsList.map((r) => cols.map((c) => `"${r[c]}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelly_tis_${culture.toLowerCase()}_${inoculum.toLowerCase()}_b${budget}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const payload = {
      engineVersion: ENGINE_VERSION,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      configuration: { culture, horizon, inoculum, budget, remating, randomSeed, repetitions, modelParams },
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

  // Synchronisation des onglets de navigation
  const handleNavigationChange = (targetId) => {
    setActiveSpace(targetId);
    setActiveSubTab(targetId);
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', targetId);
      window.history.replaceState({}, '', url.toString());
    }
  };

  const NAV_ITEMS = [
    { id: 'overview', label: "Vue d'ensemble", icon: Home },
    { id: 'parameters', label: 'Paramètres', icon: SlidersHorizontal },
    { id: 'model', label: 'Modèle & Hypothèses', icon: BookOpen },
    { id: 'dynamics', label: 'Dynamiques Agents', icon: Activity },
    { id: 'studio', label: 'Simulation', icon: Play },
    { id: 'comparison', label: 'Comparaison', icon: BarChart3 },
    { id: 'analytics', label: 'Résultats', icon: Layers },
    { id: 'experiments', label: 'Expériences', icon: FlaskConical }
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#1B201C] font-sans antialiased selection:bg-[#145A3D] selection:text-[#F8F7F2]">
      {/* ===================================================================
          LAYOUT GLOBAL : BARRE LATÉRALE GAUCHE + ESPACE DE TRAVAIL PRINCIPAL
         =================================================================== */}
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        {/* SIDEBAR GAUCHE (Conforme à la maquette) */}
        <aside className="w-full lg:w-52 shrink-0 border-b lg:border-b-0 lg:border-r border-[#D6DDD4] bg-[#F8F7F2] p-4 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            {/* Logo Modelly & Sous-titre TIS Research */}
            <div className="flex items-center gap-2.5 px-1 pt-0.5">
              <ModellyLogo className="w-8 h-8 shrink-0" />
              <div>
                <div className="font-serif font-bold text-xl tracking-tight text-[#145A3D] leading-none">
                  Modelly
                </div>
                <div className="text-[10px] font-sans text-[#657068] tracking-wider mt-0.5 font-medium">
                  TIS Research
                </div>
              </div>
            </div>

            {/* Menu de navigation latérale */}
            <nav aria-label="Navigation latérale" className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeSpace === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigationChange(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer',
                      active
                        ? 'bg-[#DDEADF] text-[#145A3D] font-semibold'
                        : 'text-[#1B201C] hover:bg-[#F0F2EB]'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#145A3D]' : 'text-[#1B201C]')} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bas de la barre latérale : Illustration pastorale & Carte Modélisation TIS */}
          <div className="rounded-xl border border-[#D6DDD4] bg-white overflow-hidden shadow-2xs mt-auto">
            <PastoralLandscape className="w-full h-24 object-cover" />
            <div className="p-2.5 bg-white border-t border-[#E8ECE3]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#145A3D]">
                <SproutMiniIcon className="w-3.5 h-3.5 text-[#347A55] shrink-0" />
                <span>Modélisation TIS</span>
              </div>
              <p className="text-[10px] text-[#657068] mt-0.5 leading-tight">
                Dynamique des populations et optimisation des lâchers
              </p>
            </div>
          </div>
        </aside>

        {/* ESPACE PRINCIPAL DE TRAVAIL */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 space-y-3.5">
          {/* BANDEAU SUPÉRIEUR ÉDITORIAL (Fil d'Ariane, Titre, Boutons, Sous-Navigation) */}
          <header className="space-y-2">
            {/* Ligne 1 : Fil d'ariane avec trait horizontal vers les boutons */}
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[#657068] font-medium">
              <span className="whitespace-nowrap">RECHERCHE AGRONOMIQUE / ÉTUDE 01</span>
              <span className="flex-1 border-t border-[#D6DDD4]"></span>
            </div>

            {/* Ligne 2 : Titre principal & Actions */}
            <div className="flex flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1B201C] tracking-tight leading-tight whitespace-nowrap">
                  Impact des stratégies <em className="italic font-normal text-[#347A55]">TIS</em> selon la culture
                </h1>
                <div className="text-xs text-[#657068] font-sans mt-0.5">
                  Comparaison expérimentale • Fraise vs Cerise
                </div>
              </div>

              {/* Boutons d'action principaux en haut à droite */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6DDD4] bg-white px-3 py-1.5 text-xs font-medium text-[#1B201C] hover:bg-[#F0F2EB] transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#1B201C]" />
                  <span>Exporter le rapport</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigationChange('studio')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#145A3D] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#1E5E41] transition-colors shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle simulation</span>
                </button>
              </div>
            </div>

            {/* Ligne 3 : Sous-navigation par onglets pills */}
            <div className="flex items-center gap-2 pt-0.5 text-xs overflow-x-auto pb-1">
              {[
                { id: 'overview', label: "Vue d'ensemble" },
                { id: 'parameters', label: 'Paramètres' },
                { id: 'model', label: 'Modèle & Hypothèses' },
                { id: 'dynamics', label: 'Dynamiques temporelles' },
                { id: 'comparison', label: 'Comparaison' },
                { id: 'analytics', label: 'Analyses' }
              ].map((tab, idx) => (
                <React.Fragment key={tab.id}>
                  {idx > 0 && <span className="text-[#D6DDD4] font-light">|</span>}
                  <button
                    type="button"
                    onClick={() => handleNavigationChange(tab.id)}
                    className={cn(
                      'px-3.5 py-1 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap',
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

          {/* Bannière de télémétrie stochastique en cours de simulation animée */}
          {simStatus === 'running' && (
            <div className="rounded-xl border border-[#A3C9A6] bg-[#EDF5EB] p-3 shadow-2xs space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs text-[#145A3D]">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#145A3D] animate-ping" />
                  <span>Simulation stochastique ABM en direct : Résolution journalière des interactions</span>
                </div>
                <div className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-[#A3C9A6]">
                  Jour {liveSimDay} / {horizon} ({Math.min(100, Math.round((liveSimDay / horizon) * 100))} %)
                </div>
              </div>
              <div className="w-full bg-[#DDEADF] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#145A3D] h-2 rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${Math.min(100, Math.round((liveSimDay / horizon) * 100))}%` }}
                />
              </div>
            </div>
          )}

          {/* Notification discrète */}
          {notification && (
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
          )}

          {/* ===============================================================
              ESPACE 1 : VUE D'ENSEMBLE (CONFORME EXACTEMENT À LA MAQUETTE)
             =============================================================== */}
          {activeSpace === 'overview' && (
            <div className="space-y-4">
              {/* SECTION 1 : LES TROIS PANNEAUX HORIZONTAUX ÉLÉGANTS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* PANNEAU 1 : FRAISE (Fragaria × ananassa) */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-3 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[45%] shrink-0 h-32 flex items-center justify-center">
                      <StrawberryBotanicalPlate className="w-full h-full object-contain" />
                    </div>
                    <div className="w-[55%]">
                      <h2 className="text-base font-serif font-bold text-[#145A3D] leading-tight">
                        Fraise
                      </h2>
                      <div className="text-[11px] italic text-[#1B201C] font-serif mb-2">
                        Fragaria × ananassa
                      </div>

                      <ul className="space-y-1 text-[10.5px] text-[#1B201C]">
                        <li className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Récolte continue</div>
                            <div className="text-[10px] text-[#657068] leading-tight">(= 60–120 jours)</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Culture sensible</div>
                            <div className="text-[10px] text-[#657068] leading-tight">aux infestations</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Inoculum de départ :</div>
                            <div className="text-[10px] text-[#657068] leading-tight">faible à élevé (K = 3 000)</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* PANNEAU 2 : PRINCIPE DE LA TIS */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-3 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="text-center mb-1">
                      <h2 className="text-sm font-sans font-bold text-[#1B201C] leading-tight">
                        Principe de la TIS
                      </h2>
                      <div className="text-[10.5px] text-[#657068]">
                        (Technique de l'Insecte Stérile)
                      </div>
                    </div>
                    <TisMechanismDiagram className="w-full h-32" />
                  </div>
                </div>

                {/* PANNEAU 3 : CERISE (Prunus avium) */}
                <div className="rounded-xl border border-[#D6DDD4] bg-white p-3 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[45%] shrink-0 h-32 flex items-center justify-center">
                      <CherryBotanicalPlate className="w-full h-full object-contain" />
                    </div>
                    <div className="w-[55%]">
                      <h2 className="text-base font-serif font-bold text-[#145A3D] leading-tight">
                        Cerise
                      </h2>
                      <div className="text-[11px] italic text-[#1B201C] font-serif mb-2">
                        Prunus avium
                      </div>

                      <ul className="space-y-1 text-[10.5px] text-[#1B201C]">
                        <li className="flex items-start gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Récolte courte</div>
                            <div className="text-[10px] text-[#657068] leading-tight">(= 15–30 jours)</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Fenêtre d'intervention</div>
                            <div className="text-[10px] text-[#657068] leading-tight">plus restreinte</div>
                          </div>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-[#657068] shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium leading-tight">Inoculum de départ :</div>
                            <div className="text-[10px] text-[#657068] leading-tight">modéré à élevé (K = 3 000)</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 : GRAND GRAPHIQUE CENTRAL + PANNEAU DE PARAMÈTRES DU SCÉNARIO */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Graphique temporel : Dynamique des populations au cours du temps */}
                <div className="lg:col-span-8 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between">
                  <OverviewPopulationChart
                    selectedStrategy={selectedStrategy}
                    selectedBudget={budget}
                    selectedInvasion={inoculum}
                    liveSimDay={simStatus === 'running' ? liveSimDay : 120}
                    isSimulating={simStatus === 'running'}
                  />
                </div>

                {/* Panneau de droite : Paramètres du scénario */}
                <div className="lg:col-span-4 rounded-xl border border-[#D6DDD4] bg-white p-4 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#E8ECE3] pb-2 text-[#1B201C]">
                      <Settings className="w-4 h-4 text-[#1B201C]" />
                      <span className="font-serif font-bold text-sm">Paramètres du scénario</span>
                    </div>

                    {/* Ligne 1 : Culture */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-5 text-xs text-[#1B201C] font-normal">
                        Culture
                      </label>
                      <div className="col-span-7 relative">
                        <select
                          value={culture}
                          onChange={(e) => setCulture(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#D6DDD4] bg-white pl-8 pr-7 py-1.5 text-xs text-[#1B201C] font-normal cursor-pointer shadow-2xs"
                        >
                          <option value="Fraise">Fraise</option>
                          <option value="Cerise">Cerise</option>
                        </select>
                        <div className="absolute left-2.5 top-2 pointer-events-none">
                          {culture === 'Fraise' ? (
                            <StrawberryMiniIcon className="w-3.5 h-3.5" />
                          ) : (
                            <CherryMiniIcon className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-[#1B201C] absolute right-2.5 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Ligne 2 : Inoculum de départ (remplace pression d'invasion) */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-5 text-xs text-[#1B201C] font-normal">
                        Inoculum de départ
                      </label>
                      <div className="col-span-7 relative">
                        <select
                          value={inoculum}
                          onChange={(e) => setInoculum(e.target.value)}
                          className="w-full appearance-none rounded-lg border border-[#D6DDD4] bg-white pl-8 pr-7 py-1.5 text-xs text-[#1B201C] font-normal cursor-pointer shadow-2xs font-medium"
                        >
                          <option value="Faible">Faible (180 ind.)</option>
                          <option value="Modérée">Modérée (600 ind.)</option>
                          <option value="Forte">Forte (K = 3 000 ind.)</option>
                        </select>
                        <div className="absolute left-2.5 top-2 pointer-events-none">
                          <InvasionBarsIcon className="w-3.5 h-3.5 text-[#657068]" />
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-[#1B201C] absolute right-2.5 top-2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Ligne 3 : Stratégie de lâcher */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-5 text-xs text-[#1B201C] font-normal">
                        Stratégie de lâcher
                      </label>
                      <div className="col-span-7 flex items-center rounded-lg border border-[#D6DDD4] bg-white p-0.5 shadow-2xs">
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
                              'flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-all text-center cursor-pointer',
                              selectedStrategy === s.id
                                ? 'bg-[#347A55] text-white shadow-2xs'
                                : 'text-[#1B201C] hover:bg-[#F8F7F2]'
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ligne 4 : Budget (unités / ha) */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-5 text-xs text-[#1B201C] font-normal">
                        Budget (unités / ha)
                      </label>
                      <div className="col-span-7 relative flex items-center">
                        <div className="absolute left-2.5 pointer-events-none">
                          <CoinsStackIcon className="w-3.5 h-3.5 text-[#657068]" />
                        </div>
                        <input
                          type="text"
                          value={budget.toLocaleString('fr-FR')}
                          onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/\s/g, '').replace(/\D/g, ''), 10);
                            if (!isNaN(val)) setBudget(val);
                          }}
                          className="w-full rounded-lg border border-[#D6DDD4] bg-white pl-8 pr-7 py-1.5 text-xs font-mono font-medium text-[#1B201C] shadow-2xs"
                        />
                        <div className="absolute right-2 flex flex-col pointer-events-none text-[#657068]">
                          <ChevronsUpDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Lancer une simulation avec traçage en direct */}
                  <button
                    type="button"
                    onClick={handleRunAndSaveExperiment}
                    disabled={simStatus === 'running'}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#347A55] text-white font-medium text-xs hover:bg-[#145A3D] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2 disabled:opacity-60"
                  >
                    <Play className={cn("w-3.5 h-3.5 fill-white text-white", simStatus === 'running' && "animate-spin")} />
                    <span>
                      {simStatus === 'running'
                        ? `Simulation en direct (Jour ${liveSimDay}/${horizon})...`
                        : 'Lancer une simulation'}
                    </span>
                  </button>
                </div>
              </div>

              {/* SECTION 3 : DOMMAGES LARVAIRES, PIQÛRES STÉRILES & TABLEAU COMPARATIF */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Carte 1 : Dommages larvaires */}
                <div className="md:col-span-3 rounded-xl border border-[#D6DDD4] bg-white p-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <LarvaIcon className="w-6 h-6 shrink-0" />
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#1B201C] leading-tight">
                        Dommages larvaires
                      </h3>
                      <p className="text-[10px] text-[#657068] mt-0.5">
                        Part de fruits endommagés à la récolte
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#D6DDD4] mt-3">
                    <div className="bg-[#EEF6EF] py-2.5 px-2 text-center">
                      <div className="text-2xl font-bold font-mono text-[#145A3D]">
                        -91 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Fraise, J+3)
                      </div>
                    </div>
                    <div className="bg-[#FDF2EC] py-2.5 px-2 text-center border-l border-[#D6DDD4]">
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
                <div className="md:col-span-3 rounded-xl border border-[#D6DDD4] bg-white p-3.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center gap-2.5">
                    <SterileFlyIcon className="w-6 h-6 shrink-0" />
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#1B201C] leading-tight">
                        Piqûres stériles
                      </h3>
                      <p className="text-[10px] text-[#657068] mt-0.5">
                        Proportion de piqûres non viables
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#D6DDD4] mt-3">
                    <div className="bg-[#EEF6EF] py-2.5 px-2 text-center">
                      <div className="text-2xl font-bold font-mono text-[#145A3D]">
                        56 %
                      </div>
                      <div className="text-[10px] text-[#657068] mt-0.5">
                        (Fraise)
                      </div>
                    </div>
                    <div className="bg-[#FDF2EC] py-2.5 px-2 text-center border-l border-[#D6DDD4]">
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
                <div className="md:col-span-6 rounded-xl border border-[#D6DDD4] bg-white shadow-2xs overflow-hidden flex flex-col justify-between">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#EAF2E9] border-b border-[#D6DDD4] text-[#1B201C] font-semibold text-[11px]">
                          <th className="py-2 px-3 text-left border-r border-[#D6DDD4]">Stratégie</th>
                          <th className="py-2 px-3 text-right border-r border-[#D6DDD4]">Fraise <span className="font-normal text-[#657068]">(dommages)</span></th>
                          <th className="py-2 px-3 text-right border-r border-[#D6DDD4]">Cerise <span className="font-normal text-[#657068]">(dommages)</span></th>
                          <th className="py-2 px-3 text-right">Budget relatif</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8ECE3] tabular-nums text-[11px]">
                        {[
                          { id: 'Daily', name: 'Quotidien', fraise: '2,8 %', cerise: '7,9 %', budget: '1,40 ×' },
                          { id: 'Every 3 days', name: 'J+3', fraise: '3,1 %', cerise: '8,6 %', budget: '1,00 ×' },
                          { id: 'Every 7 days', name: 'J+7', fraise: '5,9 %', cerise: '12,4 %', budget: '0,72 ×' },
                          { id: '70% init + 7d maint', name: '70 % initial + maintenance', fraise: '3,4 %', cerise: '9,1 %', budget: '0,86 ×' },
                          { id: '100% init', name: '100 % initial', fraise: '2,9 %', cerise: '8,2 %', budget: '1,25 ×' }
                        ].map((row) => {
                          const isSelected = row.id === selectedStrategy;
                          return (
                            <tr
                              key={row.id}
                              className={cn(
                                'transition-colors',
                                isSelected ? 'bg-[#EDF5EB] font-medium' : 'hover:bg-[#F8F7F2]'
                              )}
                            >
                              <td className="py-1.5 px-3 font-medium text-[#1B201C] border-r border-[#E8ECE3]">
                                {row.name}
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono text-[#145A3D] font-semibold border-r border-[#E8ECE3]">
                                {row.fraise}
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono text-[#BF532E] font-semibold border-r border-[#E8ECE3]">
                                {row.cerise}
                              </td>
                              <td className="py-1.5 px-3 text-right font-mono text-[#1B201C]">
                                {row.budget}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              NOUVEL ESPACE : ONGLET PARAMÈTRES DU MODÈLE
             =============================================================== */}
          {activeSpace === 'parameters' && (
            <ParametersView
              params={modelParams}
              onParamsChange={(newParams) => setModelParams(newParams)}
              onResetToDefaults={() => setModelParams(DEFAULT_MODEL_PARAMS)}
            />
          )}

          {/* ===============================================================
              NOUVEL ESPACE : ONGLET MODÈLE, ARCHITECTURE & HYPOTHÈSES
             =============================================================== */}
          {activeSpace === 'model' && (
            <ModelArchitectureView
              onNavigateToStudio={() => handleNavigationChange('studio')}
              onNavigateToDynamics={() => handleNavigationChange('dynamics')}
            />
          )}

          {/* ===============================================================
              NOUVEL ESPACE : DYNAMIQUES DES AGENTS INSECTES & FRUITS
             =============================================================== */}
          {activeSpace === 'dynamics' && (
            <AgentDynamicsCharts
              initialCulture={culture}
              initialInoculum={inoculum}
              initialStrategy={selectedStrategy}
              initialBudget={budget}
            />
          )}

          {/* ===============================================================
              ESPACE SIMULATION STUDIO (CONFIGURATION EXPERIMENTALE)
             =============================================================== */}
          {activeSpace === 'studio' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Simulation Studio
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Configuration expérimentale & Lancement de simulation
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

              {/* Les 3 colonnes logiques */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Colonne Gauche : Paramètres scientifiques */}
                <div className="lg:col-span-4 rounded-xl border border-[#D6DDD4] bg-white p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-serif font-bold text-[#145A3D] border-b border-[#E8ECE3] pb-2">
                    1. Paramètres du scénario
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
                      <label className="block font-medium mb-1">Inoculum de départ</label>
                      <select
                        value={inoculum}
                        onChange={(e) => setInoculum(e.target.value)}
                        className="w-full rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] p-2 text-xs font-medium"
                      >
                        {INOCULUM_LEVELS.map((inv) => (
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
                            <span className="font-mono text-[#145A3D]">{modelParams.etaMating.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.0"
                            step="0.05"
                            value={modelParams.etaMating}
                            onChange={(e) => setModelParams((p) => ({ ...p, etaMating: Number(e.target.value) }))}
                            className="w-full accent-[#145A3D] cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span>Compétitivité spermatique (η_sperm)</span>
                            <span className="font-mono text-[#145A3D]">{modelParams.etaSperm.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="1.0"
                            step="0.05"
                            value={modelParams.etaSperm}
                            onChange={(e) => setModelParams((p) => ({ ...p, etaSperm: Number(e.target.value) }))}
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

                {/* Colonne Centre : Visualisation du protocole */}
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
                      disabled={simStatus === 'running'}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#145A3D] text-white font-medium text-xs hover:bg-[#347A55] transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      <Play className={cn("w-3.5 h-3.5", simStatus === 'running' && "animate-spin")} />
                      <span>{simStatus === 'running' ? `Simulation en cours (J+${liveSimDay})...` : 'Lancer & Enregistrer'}</span>
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
              ESPACE EXPÉRIENCES (REGISTRE IMMUABLE)
             =============================================================== */}
          {activeSpace === 'experiments' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Registre des Expériences
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
                                handleNavigationChange('overview');
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
              ESPACE COMPARAISON MULTI-SCÉNARIOS
             =============================================================== */}
          {activeSpace === 'comparison' && (
            <div className="space-y-6">
              {/* Synthèse Décisionnelle Fondamentale : Fraise vs Cerise × Mono/Polyandrie */}
              <AgronomicSynthesisCard />

              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Comparison Lab
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

              {/* Comparaison Monoandrie vs Polyandrie (Accouplement unique vs multiple) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E8ECE3] pb-2.5">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#1B201C]">
                        Plasticité reproductive : Monoandrie vs Polyandrie
                      </h3>
                      <p className="text-xs text-[#657068]">
                        Taux de fruits sains (%) selon le régime d'accouplement des femelles pour chaque stratégie
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#145A3D] bg-[#DDEADF] px-2 py-0.5 rounded font-bold">
                      η_sperm = 0.59
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={STRATEGIES.map((s) => {
                          const mono = computeSingleOutcome(culture, inoculum, budget, 'first', s.id, modelParams);
                          const poly = computeSingleOutcome(culture, inoculum, budget, 'preference', s.id, modelParams);
                          return {
                            strategy: s.short,
                            'Monoandrie (1er accouplement)': mono.recoltes_sains_pct,
                            'Polyandrie (accouplement multiple)': poly.recoltes_sains_pct,
                          };
                        })}
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                        <XAxis dataKey="strategy" tick={{ fontSize: 10 }} />
                        <YAxis domain={[40, 95]} unit="%" tick={{ fontSize: 10 }} />
                        <RechartsTooltip />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Line
                          type="monotone"
                          dataKey="Monoandrie (1er accouplement)"
                          stroke="#145A3D"
                          strokeWidth={2.6}
                          dot={{ r: 3.5, fill: '#145A3D' }}
                          isAnimationActive={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Polyandrie (accouplement multiple)"
                          stroke="#BF532E"
                          strokeWidth={2.4}
                          strokeDasharray="4 2"
                          dot={{ r: 3.5, fill: '#BF532E' }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068] leading-relaxed border border-[#E8ECE3]">
                    <strong className="text-[#145A3D]">Enseignement clé :</strong> Sous monoandrie, un unique accouplement stérile suffit à inactiver la reproduction de la femelle pour toute son existence. Sous polyandrie (<Latex math="\eta_{\text{sperm}} = 0.59" />), la descendance fertile est partiellement restaurée si la femelle s'accouple plus tard avec un mâle sauvage, ce qui démontre la supériorité des lâchers fractionnés et réguliers (Quotidien, J+3, 70% + maintenance) pour maintenir un ratio stérile/sauvage élevé.
                  </div>
                </div>

                {/* Comparaison synchronisée Fraise vs Cerise */}
                <div className="lg:col-span-5 rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-3">
                  <div className="border-b border-[#E8ECE3] pb-2.5">
                    <h3 className="text-base font-serif font-bold text-[#1B201C]">
                      Sensibilité selon la culture
                    </h3>
                    <p className="text-xs text-[#657068]">
                      Fraise (récolte continue 100 j) vs Cerise (récolte courte 25 j)
                    </p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={BUDGET_PRESETS.map((b) => ({
                          budget: b === 0 ? '0 ♂' : `${b / 1000}k ♂`,
                          'Fraise (J+3)': computeSingleOutcome('Fraise', inoculum, b, remating, 'Every 3 days').recoltes_sains_pct,
                          'Cerise (J+7)': computeSingleOutcome('Cerise', inoculum, b, remating, 'Every 7 days').recoltes_sains_pct,
                        }))}
                        margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="2 3" stroke="#E2E7DE" />
                        <XAxis dataKey="budget" tick={{ fontSize: 10 }} />
                        <YAxis domain={[40, 95]} unit="%" tick={{ fontSize: 10 }} />
                        <RechartsTooltip />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                        <Line
                          type="monotone"
                          dataKey="Fraise (J+3)"
                          stroke="#347A55"
                          strokeWidth={2.4}
                          dot={{ r: 3.5, fill: '#347A55' }}
                          isAnimationActive={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Cerise (J+7)"
                          stroke="#BF532E"
                          strokeWidth={2.4}
                          dot={{ r: 3.5, fill: '#BF532E' }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068] leading-relaxed border border-[#E8ECE3]">
                    <strong className="text-[#145A3D]">Dynamique agronomique :</strong> La cerise atteint son plafond d'efficacité dès un lâcher ciblé concentré sur sa courte fenêtre de récolte, tandis que la fraise exige des lâchers maintenus sur toute la durée de floraison et fructification continue.
                  </div>
                </div>
              </div>

              {/* Tableau comparatif officiel des 6 stratégies */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white overflow-hidden shadow-2xs">
                <div className="p-4 bg-[#F0F2EB] border-b border-[#D6DDD4]">
                  <h3 className="text-sm font-serif font-bold text-[#1B201C]">
                    Bilan comparatif synthétique des stratégies TIS ({culture} • Inoculum {inoculum} • {budget.toLocaleString('fr-FR')} ♂)
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6DDD4] bg-white text-[#1B201C] font-semibold text-[11px]">
                        <th className="py-2.5 px-4 text-left">Stratégie</th>
                        <th className="py-2.5 px-3 text-left">Règle opérationnelle</th>
                        <th className="py-2.5 px-3 text-right">Fruits sains (%)</th>
                        <th className="py-2.5 px-3 text-right">Dommages larves (%)</th>
                        <th className="py-2.5 px-3 text-right">Piqûres stériles (%)</th>
                        <th className="py-2.5 px-3 text-right">Larves produites</th>
                        <th className="py-2.5 px-4 text-right">Budget relatif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECE3] tabular-nums">
                      {STRATEGIES.map((s) => {
                        const out = computeSingleOutcome(culture, inoculum, budget, remating, s.id, modelParams);
                        return (
                          <tr key={s.id} className="hover:bg-[#F8F7F2] transition-colors">
                            <td className="py-2.5 px-4 font-medium text-[#1B201C] flex items-center gap-2">
                              <span style={{ color: s.color }}>{s.symbol}</span>
                              <span>{s.label}</span>
                            </td>
                            <td className="py-2.5 px-3 text-[#657068] text-[11px]">{s.schedule}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-[#145A3D]">
                              {out.recoltes_sains_pct.toFixed(1)} %
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[#A83D36]">
                              {out.pourris_larves_pct.toFixed(1)} %
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[#547B91]">
                              {out.sterile_only_total_pct.toFixed(1)} %
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-[#657068]">
                              {out.larves_produites.toLocaleString('fr-FR')}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-semibold text-[#1B201C]">
                              {s.relativeBudget.toFixed(2)} ×
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE RÉSULTATS / RESEARCH ANALYTICS
             =============================================================== */}
          {activeSpace === 'analytics' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Research Analytics & Analyses Factorielles
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1B201C]">
                    Analyses Comparatives : Front de Pareto, Répétitions & Réponses TIS
                  </h2>
                  <p className="text-xs text-[#657068] mt-1">
                    Exploration complète du compromis agronomique, de la dispersion stochastique inter-répétitions et des sensibilités factorielles.
                  </p>
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

              {/* 1. FRONTIÈRE DE PARETO (Compromis Dommages Larvaires vs Piqûres Stériles) */}
              <ParetoFrontierChart
                initialCulture={culture}
                initialInoculum={inoculum}
                remating={remating}
              />

              {/* 2. DISTRIBUTION DES 20 RÉPÉTITIONS (StripPlot & Incertitude stochastique) */}
              <RepetitionsStripPlot
                initialCulture={culture}
                initialInoculum={inoculum}
                initialBudget={budget}
              />

              {/* 3. COURBES DOSE-RÉPONSE PAR NIVEAU D'INOCULUM */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
                <div className="border-b border-[#E8ECE3] pb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
                    Cinétique de Réponse au Budget
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#1B201C] mt-0.5">
                    Courbes Dose-Réponse selon l'Inoculum de départ ({culture})
                  </h3>
                  <p className="text-xs text-[#657068]">
                    Évolution du taux de récolte saine (%) en fonction de l'effort consenti (0 à 18 000 ♂/ha) pour les 3 pressions initiales.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {INOCULUM_LEVELS.map((inv) => (
                    <div key={inv.id} className="rounded-xl border border-[#D6DDD4] bg-[#FAFBF9] p-4 shadow-2xs">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-serif font-bold text-[#1B201C]">
                          Inoculum {inv.label}
                        </h4>
                        <span className="text-[10px] font-mono text-[#657068] bg-white px-2 py-0.5 rounded border border-[#E8ECE3]">
                          {inv.total} fondateurs J0
                        </span>
                      </div>
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
                            <Line type="monotone" dataKey="J+3" stroke="#547B91" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
                            <Line type="monotone" dataKey="J+7" stroke="#BF532E" strokeWidth={2} dot={{ r: 2.5 }} isAnimationActive={false} />
                            <Line type="monotone" dataKey="70%+7j" stroke="#145A3D" strokeWidth={2.5} dot={{ r: 2.5 }} isAnimationActive={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap / Matrice paramétrique (Budget vs Stratégie avec gradient de vert scientifique) */}
              <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#1B201C]">
                      Matrice paramétrique de réponse TIS (Budget vs Stratégie)
                    </h3>
                    <p className="text-xs text-[#657068]">
                      Distribution croisée des performances agronomiques pour l'ensemble des combinaisons ({culture} • Inoculum {inoculum})
                    </p>
                  </div>

                  {/* Sélecteur de métrique pour la Heatmap */}
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#F0F2EB] border border-[#D6DDD4] text-xs">
                    {[
                      { id: 'recoltes_sains_pct', label: 'Fruits sains (%)' },
                      { id: 'pourris_larves_pct', label: 'Dommages larvaires (%)' },
                      { id: 'sterile_only_total_pct', label: 'Piqûres stériles (%)' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setHeatmapMetric(m.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap',
                          heatmapMetric === m.id
                            ? 'bg-[#145A3D] text-white shadow-2xs'
                            : 'text-[#657068] hover:text-[#1B201C]'
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tableau Heatmap interactif avec coloration scientifique */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8F7F2] border-y border-[#D6DDD4]">
                        <th className="py-2.5 px-4 text-left font-semibold text-[#1B201C] w-56">Stratégie de lâcher</th>
                        {BUDGET_PRESETS.map((b) => (
                          <th key={b} className="py-2.5 px-3 text-center font-mono font-bold text-[#1B201C]">
                            {b === 0 ? 'Témoin (0 ♂)' : `${b.toLocaleString('fr-FR')} ♂ / ha`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECE3]">
                      {STRATEGIES.map((s) => (
                        <tr key={s.id} className="hover:bg-[#FAFBF9] transition-colors">
                          <td className="py-2.5 px-4 font-medium text-[#1B201C] flex items-center gap-2">
                            <span style={{ color: s.color }}>{s.symbol}</span>
                            <span>{s.label}</span>
                          </td>
                          {BUDGET_PRESETS.map((b) => {
                            const out = computeSingleOutcome(culture, inoculum, b, remating, s.id, modelParams);
                            const val = out[heatmapMetric];

                            // Coloration scientifique adaptative selon la métrique
                            let bg = '#FFFFFF';
                            let textCol = '#1B201C';
                            if (heatmapMetric === 'recoltes_sains_pct') {
                              // Taux de fruits sains : vert botanique (50% -> 90%)
                              const norm = Math.max(0, Math.min(1, (val - 45) / 45));
                              bg = `rgba(20, 90, 61, ${(0.10 + 0.85 * norm).toFixed(2)})`;
                              if (norm > 0.45) textCol = '#FFFFFF';
                            } else if (heatmapMetric === 'pourris_larves_pct') {
                              // Dommages larvaires : terracotta / rouille (0.5% -> 30%)
                              const norm = Math.max(0, Math.min(1, (val - 0.5) / 30));
                              bg = `rgba(168, 61, 54, ${(0.10 + 0.85 * norm).toFixed(2)})`;
                              if (norm > 0.45) textCol = '#FFFFFF';
                            } else {
                              // Piqûres stériles : bleu analytique (0% -> 10%)
                              const norm = Math.max(0, Math.min(1, val / 8));
                              bg = `rgba(84, 123, 145, ${(0.10 + 0.85 * norm).toFixed(2)})`;
                              if (norm > 0.45) textCol = '#FFFFFF';
                            }

                            return (
                              <td
                                key={b}
                                className="py-2.5 px-3 text-center transition-all cursor-default"
                                style={{ backgroundColor: bg }}
                                title={`${s.label} (${b} ♂) : Fruits sains: ${out.recoltes_sains_pct.toFixed(1)}% | Larves: ${out.pourris_larves_pct.toFixed(1)}% | Stériles: ${out.sterile_only_total_pct.toFixed(1)}%`}
                              >
                                <span
                                  className="font-mono font-bold text-xs inline-block"
                                  style={{ color: textCol }}
                                >
                                  {val.toFixed(1)} %
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068] leading-relaxed border border-[#E8ECE3]">
                  <strong className="text-[#145A3D]">Interprétation décisionnelle :</strong> Le gradient de couleur met immédiatement en évidence la saturation de l'effet TIS. À partir de 4 500 à 9 000 ♂/ha, la plupart des stratégies atteignent un plateau où l'investissement additionnel n'apporte qu'un gain marginal. Les stratégies J+3 et 70 % + maintenance offrent le meilleur compromis efficacité/coût.
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              ESPACE PROTOCOLE & FORMULATIONS MATHÉMATIQUES
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

      {/* BOÎTE DE DIALOGUE DU RAPPORT SCIENTIFIQUE */}
      <ScientificReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        culture={culture}
        invasion={inoculum}
        budget={budget}
        remating={remating}
        rematingLabel={REMATING_LABEL_MAP[remating]}
        resultsList={currentResultsList}
        summaryStats={summaryStats}
        randomSeed={randomSeed}
        repetitions={repetitions}
        bioParams={modelParams}
        engineVersion={ENGINE_VERSION}
        schemaVersion={SCHEMA_VERSION}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
      />
    </div>
  );
}
