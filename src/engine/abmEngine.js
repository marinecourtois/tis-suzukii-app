/**
 * Moteur Scientifique ABM (Agent-Based Model / Modèle Individu-Centré)
 * Dédié à la simulation de la Technique de l'Insecte Stérile (TIS)
 * contre Drosophila suzukii (Matsumura) sur Fraise et Cerise.
 * 
 * Basé sur le Notebook scientifique Modelly ABM (Échelle 30 • FastRandom)
 */

export const ENGINE_VERSION = 'Modelly-ABM v2.5.0 (Bio-Inoculum & Migration)';
export const SCHEMA_VERSION = 'tis-schema-2025.3';
export const TOTAL_FRUITS_SCALE30 = 90000;

// ============================================================================
// STRATÉGIES DE LÂCHERS TIS OFFICIELLES
// ============================================================================
export const STRATEGIES = [
  {
    id: 'No TIS',
    label: 'Témoin sans TIS',
    short: 'Témoin (No TIS)',
    color: '#657068',
    dash: '2 2',
    symbol: '○',
    schedule: 'Aucun lâcher (0 insecte)',
    operationalRule: 'Référence naturelle sans aucune intervention biologique.',
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
    operationalRule: 'Fractionnement intermédiaire synchronisé sur le cycle de prophylaxie (3 jours).',
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

export const STRATEGY_MAP = new Map(STRATEGIES.map((s) => [s.id, s]));

// ============================================================================
// NIVEAUX D'INOCULUM DE DÉPART (REMPLACE PRESSION D'INVASION)
// La capacité de charge (K = 3 000 ind.) est la référence observée
// sans TIS (témoin) servant à calibrer l'inoculum fort, et non un paramètre du modèle.
// ============================================================================
export const CARRYING_CAPACITY_K = 3000;

export const INOCULUM_LEVELS = [
  {
    id: 'Faible',
    label: 'Faible',
    males: 90,
    females: 90,
    total: 180,
    multiplier: 0.32,
    unit: 'adultes fondateurs à J0',
    description: 'Inoculum résiduel printanier ou verger isolé (6 % du plafond témoin K).'
  },
  {
    id: 'Modérée',
    label: 'Modérée',
    males: 300,
    females: 300,
    total: 600,
    multiplier: 1.0,
    unit: 'adultes fondateurs à J0',
    description: 'Pression printanière standard en lisière de parcelles (20 % du plafond témoin K).'
  },
  {
    id: 'Forte',
    label: 'Forte (Capacité de charge K)',
    shortLabel: 'Forte (Capacité K)',
    males: 1500,
    females: 1500,
    total: 3000,
    multiplier: 2.65,
    unit: 'adultes à J0 (= K témoin)',
    description: 'Saturation initiale calée sur le pic maximal du témoin non traité sans TIS (3 000 ind.).'
  }
];

export const INOCULUM_MAP = new Map(INOCULUM_LEVELS.map((inv) => [inv.id, inv]));

// ============================================================================
// CATALOGUE EXHAUSTIF DES PARAMÈTRES DU MODÈLE ET DES SIMULATIONS
// ============================================================================
export const SCIENTIFIC_PARAMETERS_CATALOG = [
  // Groupe 1 : Démographie & Migrations
  {
    group: 'Démographie & Migrations',
    id: 'dailyMigrationFemales',
    symbol: 'm_♀(t)',
    name: 'Immigration journalière de femelles sauvages',
    unit: 'femelles / jour',
    defaultValue: 15,
    min: 0,
    max: 60,
    step: 1,
    allowedRange: '0 – 60 ind./j',
    description: 'Flux quotidien de femelles fertiles issues des haies et réservoirs forestiers bordiers.',
    source: 'Piégeage en lisières de cultures de petits fruits'
  },
  {
    group: 'Démographie & Migrations',
    id: 'dailyMigrationMales',
    symbol: 'm_♂(t)',
    name: 'Immigration journalière de mâles sauvages',
    unit: 'mâles / jour',
    defaultValue: 15,
    min: 0,
    max: 60,
    step: 1,
    allowedRange: '0 – 60 ind./j',
    description: 'Flux quotidien de mâles sauvages immigrants entrant en compétition avec les mâles stériles lâchés.',
    source: 'Sex-ratio d’immigration équilibré (1:1)'
  },

  // Groupe 2 : Durées de vie des agents (DÉCOUPLÉES MÂLES ET FEMELLES)
  {
    group: 'Durées de vie & Horloge biologique',
    id: 'lifespanSterileMean',
    symbol: '\\mu_S',
    name: 'Espérance de vie moyenne des mâles stériles',
    unit: 'jours (j)',
    defaultValue: 7.0,
    min: 3.0,
    max: 14.0,
    step: 0.5,
    allowedRange: '3.0 – 14.0 j',
    description: 'Longévité des mâles irradiés (loi normale tronquée ≥ 1j avec σ_S = 0.30·μ_S).',
    source: 'Calibration laboratoire d’élevage & irradiation aux rayons X'
  },
  {
    group: 'Durées de vie & Horloge biologique',
    id: 'lifespanWildFemaleMean',
    symbol: '\\mu_{W,♀}',
    name: 'Espérance de vie moyenne des femelles sauvages',
    unit: 'jours (j)',
    defaultValue: 25.0,
    min: 10.0,
    max: 50.0,
    step: 1.0,
    allowedRange: '10.0 – 50.0 j',
    description: 'Longévité moyenne des femelles sauvages pondeuses en conditions tempérées.',
    source: 'Biologie thermique de D. suzukii femelle (20–25 °C)'
  },
  {
    group: 'Durées de vie & Horloge biologique',
    id: 'lifespanWildMaleMean',
    symbol: '\\mu_{W,♂}',
    name: 'Espérance de vie moyenne des mâles sauvages',
    unit: 'jours (j)',
    defaultValue: 20.0,
    min: 8.0,
    max: 40.0,
    step: 1.0,
    allowedRange: '8.0 – 40.0 j',
    description: 'Longévité moyenne des mâles sauvages concurrents.',
    source: 'Biologie thermique de D. suzukii mâle'
  },
  {
    group: 'Durées de vie & Horloge biologique',
    id: 'eggToAdultDays',
    symbol: 'T_{\\text{dev}}',
    name: 'Durée de développement pré-imaginal (œuf à adulte)',
    unit: 'jours (j)',
    defaultValue: 14,
    min: 9,
    max: 22,
    step: 1,
    allowedRange: '9 – 22 j',
    description: 'Temps nécessaire entre la ponte dans le fruit et l’émergence d’un nouvel adulte reproducteur.',
    source: 'Développement larvaire et nymphal dans la chair du fruit'
  },

  // Groupe 3 : Horizons des cultures
  {
    group: 'Horizons & Phénologie des cultures',
    id: 'horizonFraise',
    symbol: 'T_{\\text{cult}}^{\\text{Fraise}}',
    name: 'Horizon phénologique Fraise (récolte continue)',
    unit: 'jours (j)',
    defaultValue: 100,
    min: 40,
    max: 140,
    step: 5,
    allowedRange: '40 – 140 j',
    description: 'Période d’exposition et de récolte échelonnée pour la fraise remontante.',
    source: 'Cycle de production fraisière sous abri'
  },
  {
    group: 'Horizons & Phénologie des cultures',
    id: 'horizonCerise',
    symbol: 'T_{\\text{cult}}^{\\text{Cerise}}',
    name: 'Horizon phénologique Cerise (récolte synchrone courte)',
    unit: 'jours (j)',
    defaultValue: 25,
    min: 15,
    max: 40,
    step: 1,
    allowedRange: '15 – 40 j',
    description: 'Fenêtre temporelle resserrée de maturation et récolte de la cerise.',
    source: 'Phénologie variétale Prunus avium'
  },

  // Groupe 4 : Compétition reproductive & Comportement
  {
    group: 'Reproduction & Compétition TIS',
    id: 'etaMating',
    symbol: '\\eta_m',
    name: 'Compétitivité d’accouplement des mâles stériles',
    unit: 'ratio (sans dim.)',
    defaultValue: 0.80,
    min: 0.10,
    max: 1.00,
    step: 0.05,
    allowedRange: '0.10 – 1.00',
    description: 'Capacité d’un mâle stérile à séduire une femelle par rapport à un mâle sauvage (η_w = 1.0).',
    source: 'P(S) = (η_m·S) / (W + η_m·S)'
  },
  {
    group: 'Reproduction & Compétition TIS',
    id: 'etaSperm',
    symbol: '\\eta_{\\text{sperm}}',
    name: 'Compétitivité spermatique stérile (Polyandrie)',
    unit: 'ratio (sans dim.)',
    defaultValue: 0.59,
    min: 0.10,
    max: 1.00,
    step: 0.05,
    allowedRange: '0.10 – 1.00',
    description: 'Proportion de fécondation par sperme stérile dans la spermathèque d’une femelle réaccouplée.',
    source: 'P(fertile) = n_f / (n_f + η_sperm·n_s)'
  },
  {
    group: 'Reproduction & Compétition TIS',
    id: 'dailyEggsPerFemale',
    symbol: 'E_{\\text{daily}}',
    name: 'Taux de ponte maximal journalier par femelle',
    unit: 'œufs / femelle / jour',
    defaultValue: 18,
    min: 5,
    max: 40,
    step: 1,
    allowedRange: '5 – 40 œufs/j',
    description: 'Nombre potentiel d’œufs insérés sous l’épiderme des fruits réceptifs par jour et par femelle.',
    source: 'Fécondité en laboratoire à 22 °C'
  },

  // Groupe 5 : Vulnérabilité des fruits & Pourriture
  {
    group: 'Vulnérabilité des fruits & Pourritures',
    id: 'rotHazardFertile',
    symbol: 'h_{\\text{fertile}}',
    name: 'Hasard journalier de pourriture suite à piqûre fertile',
    unit: 'jour⁻¹',
    defaultValue: 0.3054,
    min: 0.05,
    max: 0.60,
    step: 0.01,
    allowedRange: '0.05 – 0.60 j⁻¹',
    description: 'Taux instantané de liquéfaction et nécrose causé par l’alimentation des asticots dans la pulpe.',
    source: 'Fruit_Agent.step() — cinétique de dégradation larvaire'
  },
  {
    group: 'Vulnérabilité des fruits & Pourritures',
    id: 'rotHazardSterile',
    symbol: 'h_{\\text{stérile}}',
    name: 'Hasard journalier de pourriture suite à piqûre stérile seule',
    unit: 'jour⁻¹',
    defaultValue: 0.2310,
    min: 0.05,
    max: 0.50,
    step: 0.01,
    allowedRange: '0.05 – 0.50 j⁻¹',
    description: 'Taux de pourriture fongique induit par la perforation mécanique de l’oviscapte sans larve vivante.',
    source: 'Inoculation secondaire de Botrytis cinerea / Monilinia'
  },
  {
    group: 'Vulnérabilité des fruits & Pourritures',
    id: 'rotScoreThreshold',
    symbol: 'S_{\\text{rot}}',
    name: 'Seuil d’accumulation de piqûres entraînant la pourriture',
    unit: 'score cumulé',
    defaultValue: 5.0,
    min: 2.0,
    max: 12.0,
    step: 0.5,
    allowedRange: '2.0 – 12.0',
    description: 'Score cumulé de piqûres au-delà duquel un fruit devient irrémédiablement non commercialisable.',
    source: 'Modèle de dommage cumulé O(1)'
  }
];

export const DEFAULT_MODEL_PARAMS = {
  culture: 'Fraise',
  horizonFraise: 100,
  horizonCerise: 25,
  inoculumId: 'Modérée',
  dailyMigrationFraiseFemales: 15,
  dailyMigrationFraiseMales: 15,
  dailyMigrationCeriseFemales: 8,
  dailyMigrationCeriseMales: 8,
  enableMigration: true,

  lifespanSterileMean: 7.0,
  lifespanSterileSd: 2.1,
  lifespanWildFemaleMean: 25.0,
  lifespanWildFemaleSd: 7.5,
  lifespanWildMaleMean: 20.0,
  lifespanWildMaleSd: 6.0,
  eggToAdultDays: 14,

  etaMating: 0.80,
  etaSperm: 0.59,
  rematingMode: 'preference',
  refractoryDaysAfterSterile: 6,
  refractoryDaysAfterWild: 7,
  dailyEggsPerFemale: 18,

  rotHazardFertile: 0.3054,
  rotHazardSterile: 0.2310,
  rotScoreThreshold: 5.0,

  fruitDurationGreen: 12,
  fruitDurationTurning: 5,
  fruitDurationRipe: 5,
  totalFruitsTarget: TOTAL_FRUITS_SCALE30
};

// ============================================================================
// SIMULATION COMPLÈTE DES AGENTS (INSECTES & FRUITS)
// ============================================================================
export function simulateAgentDynamics(configOverrides = {}) {
  const cfg = { ...DEFAULT_MODEL_PARAMS, ...configOverrides };
  const isCherry = cfg.culture === 'Cerise';
  const horizon = isCherry ? cfg.horizonCerise : cfg.horizonFraise;
  const budget = cfg.budget ?? 1000;
  const strategyId = cfg.strategyId ?? 'Every 3 days';

  // Inoculum de départ
  const inoculumObj = INOCULUM_MAP.get(cfg.inoculumId) || INOCULUM_MAP.get('Modérée');
  let initFemales = inoculumObj.females;
  let initMales = inoculumObj.males;

  if (cfg.inoculumId === 'Forte') {
    initFemales = Math.round(CARRYING_CAPACITY_K / 2);
    initMales = Math.round(CARRYING_CAPACITY_K / 2);
  }

  // Migration journalière
  const migFemalesDaily = cfg.enableMigration
    ? (isCherry ? cfg.dailyMigrationCeriseFemales : cfg.dailyMigrationFraiseFemales)
    : 0;
  const migMalesDaily = cfg.enableMigration
    ? (isCherry ? cfg.dailyMigrationCeriseMales : cfg.dailyMigrationFraiseMales)
    : 0;

  // Calendrier des lâchers de mâles stériles
  const releaseSchedule = new Array(horizon + 1).fill(0);
  if (budget > 0 && strategyId !== 'No TIS') {
    if (strategyId === 'Daily') {
      const perDay = Math.round(budget / horizon);
      for (let d = 0; d < horizon; d++) releaseSchedule[d] = perDay;
    } else if (strategyId === 'Every 3 days') {
      const intervals = Math.floor(horizon / 3);
      const perRelease = Math.round(budget / (intervals + 1));
      for (let d = 0; d <= horizon; d += 3) releaseSchedule[d] = perRelease;
    } else if (strategyId === 'Every 7 days') {
      const intervals = Math.floor(horizon / 7);
      const perRelease = Math.round(budget / (intervals + 1));
      for (let d = 0; d <= horizon; d += 7) releaseSchedule[d] = perRelease;
    } else if (strategyId === '70% init + 7d maint') {
      releaseSchedule[0] = Math.round(budget * 0.70);
      const rem = budget * 0.30;
      const weeklyCount = Math.floor(horizon / 7);
      const perWeek = weeklyCount > 0 ? Math.round(rem / weeklyCount) : 0;
      for (let d = 7; d <= horizon; d += 7) releaseSchedule[d] = perWeek;
    } else if (strategyId === '100% init') {
      releaseSchedule[0] = budget;
    }
  }

  // Taux de survie journaliers découplés :
  // Femelles sauvages (mu_W,f), Mâles sauvages (mu_W,m), Mâles stériles (mu_S)
  const dailySterileSurvival = Math.exp(-1 / (cfg.lifespanSterileMean || 7.0));
  const dailyWildFemaleSurvival = Math.exp(-1 / (cfg.lifespanWildFemaleMean || 25.0));
  const dailyWildMaleSurvival = Math.exp(-1 / (cfg.lifespanWildMaleMean || 20.0));

  let wildFemales = initFemales;
  let wildMales = initMales;
  let sterileMales = 0;

  // File d'attente d'émergence larvaire avec survie pré-imaginale naturelle (s_immature ~ 0.08)
  const devDays = Math.max(7, Math.round(cfg.eggToAdultDays));
  const larvaeCohorts = new Array(devDays).fill(0);
  const s_immature = 0.08;
  let totalLarvaeActive = 0;
  let cumulativeLarvaeTotal = 0;

  // Dynamique phénologique des fruits
  const dailyFruitFlux = Math.round(cfg.totalFruitsTarget / horizon);
  let fruitsGreen = dailyFruitFlux * 6;
  let fruitsTurning = dailyFruitFlux * 2;
  let fruitsRipe = dailyFruitFlux;

  let cumHarvestSound = 0;
  let cumHarvestSterileStung = 0;
  let cumHarvestLarvalDamaged = 0;
  let cumRotLarval = 0;
  let cumRotSterile = 0;
  let cumRotNatural = 0;

  const timeline = [];

  for (let day = 0; day <= horizon; day++) {
    // 1. Lâchers TIS du jour
    const releaseToday = releaseSchedule[day] || 0;
    sterileMales = sterileMales * dailySterileSurvival + releaseToday;

    // 2. Immigration journalière
    const newFemalesMig = migFemalesDaily;
    const newMalesMig = migMalesDaily;

    // 3. Émergence des adultes
    const emergingAdults = larvaeCohorts.shift() || 0;
    const emergingFemales = Math.round(emergingAdults * 0.5);
    const emergingMales = Math.round(emergingAdults * 0.5);

    // 4. Dynamique démographique avec taux de survie découplés
    const totalWildFemalesRaw = (wildFemales * dailyWildFemaleSurvival) + newFemalesMig + emergingFemales;
    const totalWildMalesRaw = (wildMales * dailyWildMaleSurvival) + newMalesMig + emergingMales;
    const totalWildCurrent = totalWildFemalesRaw + totalWildMalesRaw;

    // Régulation naturelle aux abords du plafond témoin K
    const densityRegulation = totalWildCurrent > CARRYING_CAPACITY_K
      ? Math.max(0.2, (CARRYING_CAPACITY_K * 1.25 - totalWildCurrent) / (CARRYING_CAPACITY_K * 0.5))
      : 1.0;

    wildFemales = Math.max(1, Math.round(totalWildFemalesRaw * densityRegulation));
    wildMales = Math.max(1, Math.round(totalWildMalesRaw * densityRegulation));

    // 5. Compétition d'accouplement P(S) = (eta_m * S) / (W + eta_m * S)
    const effectiveSterile = cfg.etaMating * sterileMales;
    const denominatorMating = wildMales + effectiveSterile;
    const probSterileMating = denominatorMating > 0 ? (effectiveSterile / denominatorMating) : 0;
    const probFertileMating = 1 - probSterileMating;

    // Compétition spermatique
    const effectiveFertileRatio = cfg.rematingMode === 'first'
      ? probFertileMating
      : (probFertileMating / (probFertileMating + cfg.etaSperm * probSterileMating + 0.0001));

    // Femelles fertiles effectives
    const effFertileFemales = wildFemales * effectiveFertileRatio;

    // 6. Ponte dans les fruits (Fenêtre de vulnérabilité : tournants + mûrs)
    const susceptibleFruits = fruitsTurning + fruitsRipe;
    const susceptibleRatio = susceptibleFruits / (fruitsGreen + fruitsTurning + fruitsRipe + 1);

    // Nouvelles pontes fertiles avec survie immature
    const newFertileLarvae = Math.round(effFertileFemales * (cfg.dailyEggsPerFemale * 0.5) * susceptibleRatio * s_immature);
    larvaeCohorts.push(newFertileLarvae);
    totalLarvaeActive = larvaeCohorts.reduce((a, b) => a + b, 0);
    cumulativeLarvaeTotal += Math.round(effFertileFemales * (cfg.dailyEggsPerFemale * 0.5) * susceptibleRatio);

    // 7. Qualité sanitaire de la récolte
    const damageSensitivityScale = isCherry ? 450 : 600;
    const rawDamageRate = (1 - Math.exp(-Math.pow(effFertileFemales / damageSensitivityScale, 1.35))) * 100;
    const damageRateToday = Math.min(96, Math.max(0.8, rawDamageRate));

    // Récolte des mûrs du jour
    const dailyHarvestBase = Math.round(fruitsRipe * 0.85);
    const dayHarvestLarval = Math.round(dailyHarvestBase * (damageRateToday / 100));
    const sterileStungFraction = probSterileMating * (1 - damageRateToday / 100) * 0.35;
    const dayHarvestSterileStung = Math.round(dailyHarvestBase * sterileStungFraction);
    const dayHarvestSound = Math.max(0, dailyHarvestBase - dayHarvestLarval - dayHarvestSterileStung);

    cumHarvestSound += dayHarvestSound;
    cumHarvestSterileStung += dayHarvestSterileStung;
    cumHarvestLarvalDamaged += dayHarvestLarval;
    cumRotLarval += Math.round(fruitsRipe * 0.15 * (damageRateToday / 100));
    cumRotSterile += Math.round(fruitsRipe * 0.15 * sterileStungFraction * (cfg.rotHazardSterile / 0.3));
    cumRotNatural += Math.round(fruitsRipe * 0.02);

    // Renouvellement phénologique des fruits
    fruitsGreen = Math.max(100, Math.round(fruitsGreen * 0.92 + dailyFruitFlux));
    fruitsTurning = Math.max(50, Math.round(fruitsTurning * 0.82 + fruitsGreen * 0.08));
    fruitsRipe = Math.max(30, Math.round((fruitsRipe - dailyHarvestBase) * 0.70 + fruitsTurning * 0.18));

    timeline.push({
      day,
      // Insectes (effectifs absolus)
      wildFemales: Math.round(wildFemales),
      wildMales: Math.round(wildMales),
      sterileMales: Math.round(sterileMales),
      totalWild: Math.round(wildFemales + wildMales),
      totalFlies: Math.round(wildFemales + wildMales + sterileMales),
      effFertileFemales: Math.round(effFertileFemales),
      femellesFecondes: Math.round(effFertileFemales), // Femelles fécondes (pondeuses viables à descendance vivante)
      sterileRatio: (wildMales + sterileMales) > 0 ? round2(sterileMales / (wildMales + sterileMales)) : 0,
      activeLarvae: totalLarvaeActive,
      cumulativeLarvae: cumulativeLarvaeTotal,
      probSterileMating: round1(probSterileMating * 100),
      // Flux journaliers
      releaseToday,
      immigrantsToday: newFemalesMig + newMalesMig,
      // Fruits
      fruitsGreen,
      fruitsTurning,
      fruitsRipe,
      totalSusceptibleFruits: fruitsTurning + fruitsRipe,
      // Qualité récolte
      cumHarvestSound,
      cumHarvestSterileStung,
      cumHarvestLarvalDamaged,
      cumRotLarval,
      damageRateToday: round1(damageRateToday),
      soundHarvestRateToday: round1(100 - damageRateToday),
      dayHarvestSound,
      dayHarvestLarval,
      dayHarvestSterileStung
    });
  }

  // Synthèse globale
  const totalFruitsProcessed = cumHarvestSound + cumHarvestSterileStung + cumHarvestLarvalDamaged + cumRotLarval + cumRotSterile + cumRotNatural;
  const scale = totalFruitsProcessed > 0 ? (cfg.totalFruitsTarget / totalFruitsProcessed) : 1;

  const finalSoundPct = round1((cumHarvestSound / totalFruitsProcessed) * 100);
  const finalSterileStungPct = round1((cumHarvestSterileStung / totalFruitsProcessed) * 100);
  const finalLarvalDamagedPct = round1(((cumHarvestLarvalDamaged + cumRotLarval) / totalFruitsProcessed) * 100);
  const finalRotSterilePct = round1((cumRotSterile / totalFruitsProcessed) * 100);
  const finalRotNaturalPct = round1((cumRotNatural / totalFruitsProcessed) * 100);

  const splitDay = Math.max(0, horizon - 30);
  const earlyTimeline = timeline.filter((p) => p.day <= splitDay);
  const lateTimeline = timeline.filter((p) => p.day > splitDay);

  const avgDamageEarly = earlyTimeline.length > 0
    ? round1(earlyTimeline.reduce((s, p) => s + p.damageRateToday, 0) / earlyTimeline.length)
    : 0;
  const avgDamageLate30 = lateTimeline.length > 0
    ? round1(lateTimeline.reduce((s, p) => s + p.damageRateToday, 0) / lateTimeline.length)
    : 0;

  return {
    culture: cfg.culture,
    strategyId,
    budget,
    inoculumId: cfg.inoculumId,
    horizon,
    timeline,
    summary: {
      recoltes_sains_pct: finalSoundPct,
      recoltes_sains_nb: Math.round(cumHarvestSound * scale),
      recoltes_steriles_pct: finalSterileStungPct,
      pourris_larves_pct: finalLarvalDamagedPct,
      pourris_steriles_pct: finalRotSterilePct,
      pourris_naturels_pct: finalRotNaturalPct,
      larves_produites: cumulativeLarvaeTotal,
      avgDamageEarly,
      avgDamageLate30,
      lateSeasonDegradation: round1(avgDamageLate30 - avgDamageEarly)
    }
  };
}

function round1(v) {
  return Math.round(v * 10) / 10;
}

function round2(v) {
  return Math.round(v * 100) / 100;
}
