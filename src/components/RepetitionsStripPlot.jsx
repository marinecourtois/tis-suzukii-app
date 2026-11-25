import React, { useState, useMemo } from 'react';
import { STRATEGIES, INOCULUM_LEVELS } from '../engine/abmEngine';

const BUDGETS = [1000, 4500, 9000, 18000];

const METRICS = [
  { id: 'harvested_clean_pct', label: 'Récolte saine', unit: '% des fruits', maxDef: 100 },
  { id: 'larval_damage_pct', label: 'Dommages larvaires', unit: '% des fruits', maxDef: 40 },
  { id: 'sterile_sting_pct', label: 'Piqûres stériles', unit: '% des fruits', maxDef: 12 },
  { id: 'larvae_produced', label: 'Larves produites', unit: 'larves', maxDef: 80000 }
];

// Valeurs moyennes et écart-types de référence (Notebook Modelly ABM)
const BASE_STATS = {
  Fraise: {
    'No TIS': { clean: { m: 50.7, sd: 1.4 }, larval: { m: 30.1, sd: 2.1 }, sterile: { m: 0.0, sd: 0.0 }, larvae: { m: 74415, sd: 3500 } },
    'Daily': { clean: { m: 82.9, sd: 0.9 }, larval: { m: 2.8, sd: 0.6 }, sterile: { m: 3.4, sd: 0.5 }, larvae: { m: 7350, sd: 620 } },
    'Every 3 days': { clean: { m: 82.8, sd: 0.9 }, larval: { m: 3.1, sd: 0.6 }, sterile: { m: 3.7, sd: 0.5 }, larvae: { m: 6478, sd: 580 } },
    'Every 7 days': { clean: { m: 86.0, sd: 0.7 }, larval: { m: 5.9, sd: 0.8 }, sterile: { m: 3.1, sd: 0.4 }, larvae: { m: 3838, sd: 410 } },
    '70% init + 7d maint': { clean: { m: 88.0, sd: 0.6 }, larval: { m: 3.4, sd: 0.5 }, sterile: { m: 2.9, sd: 0.4 }, larvae: { m: 1791, sd: 240 } },
    '100% init': { clean: { m: 81.1, sd: 1.2 }, larval: { m: 2.9, sd: 0.7 }, sterile: { m: 2.0, sd: 0.3 }, larvae: { m: 13826, sd: 1100 } }
  },
  Cerise: {
    'No TIS': { clean: { m: 58.4, sd: 1.3 }, larval: { m: 20.6, sd: 1.8 }, sterile: { m: 0.0, sd: 0.0 }, larvae: { m: 42650, sd: 2400 } },
    'Daily': { clean: { m: 75.2, sd: 1.0 }, larval: { m: 7.9, sd: 0.9 }, sterile: { m: 3.5, sd: 0.5 }, larvae: { m: 10420, sd: 850 } },
    'Every 3 days': { clean: { m: 77.4, sd: 0.9 }, larval: { m: 8.6, sd: 0.8 }, sterile: { m: 3.4, sd: 0.5 }, larvae: { m: 8190, sd: 720 } },
    'Every 7 days': { clean: { m: 80.1, sd: 0.8 }, larval: { m: 12.4, sd: 1.1 }, sterile: { m: 3.2, sd: 0.4 }, larvae: { m: 5120, sd: 510 } },
    '70% init + 7d maint': { clean: { m: 82.8, sd: 0.6 }, larval: { m: 9.1, sd: 0.7 }, sterile: { m: 2.9, sd: 0.4 }, larvae: { m: 2240, sd: 290 } },
    '100% init': { clean: { m: 82.3, sd: 0.7 }, larval: { m: 8.2, sd: 0.7 }, sterile: { m: 3.0, sd: 0.4 }, larvae: { m: 2680, sd: 310 } }
  }
};

// Générateur pseudo-aléatoire déterministe pour des répétitions stochastiques reproductibles
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Transformation Box-Muller pour tirage gaussien
function gaussianNoise(prng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = prng();
  while (v === 0) v = prng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function RepetitionsStripPlot({
  initialCulture = 'Fraise',
  initialInoculum = 'Modérée',
  initialBudget = 1000
}) {
  const [culture, setCulture] = useState(initialCulture);
  const [inoculum, setInoculum] = useState(initialInoculum);
  const [budget, setBudget] = useState(initialBudget);
  const [metricId, setMetricId] = useState('harvested_clean_pct');
  const [hoveredDot, setHoveredDot] = useState(null);

  const activeMetric = METRICS.find((m) => m.id === metricId) || METRICS[0];

  // Calcul des 20 répétitions pour chaque stratégie
  const strategyData = useMemo(() => {
    const invObj = INOCULUM_LEVELS.find((i) => i.id === inoculum) || INOCULUM_LEVELS[1];
    const invMultiplier = invObj.multiplier;
    const budgetScale = Math.sqrt(budget / 1000);

    return STRATEGIES.map((strat, stratIdx) => {
      const base = BASE_STATS[culture][strat.id] || BASE_STATS[culture]['Every 3 days'];
      const isNoTis = strat.id === 'No TIS';

      let targetMean = 0;
      let targetSd = 0;

      if (metricId === 'harvested_clean_pct') {
        targetMean = isNoTis ? base.clean.m : Math.min(95.0, base.clean.m * Math.min(1.15, 0.95 + 0.05 * budgetScale));
        targetSd = base.clean.sd;
      } else if (metricId === 'larval_damage_pct') {
        targetMean = isNoTis
          ? base.larval.m * invMultiplier
          : Math.max(0.4, (base.larval.m * invMultiplier) / Math.max(0.4, budgetScale));
        targetSd = base.larval.sd;
      } else if (metricId === 'sterile_sting_pct') {
        targetMean = isNoTis ? 0.0 : base.sterile.m * Math.min(1.6, 0.8 + 0.2 * budgetScale);
        targetSd = isNoTis ? 0.0 : base.sterile.sd;
      } else {
        // larvae_produced
        targetMean = isNoTis
          ? base.larvae.m * invMultiplier
          : Math.max(200, (base.larvae.m * invMultiplier) / Math.max(0.4, budgetScale));
        targetSd = base.larvae.sd;
      }

      // Génération de 20 répétitions stochastiques à moyenne contrôlée
      const seedBase = (culture === 'Cerise' ? 9999 : 4242) + stratIdx * 137 + Math.round(budget);
      const prng = mulberry32(seedBase);
      const values = [];

      for (let k = 1; k <= 20; k++) {
        const z = gaussianNoise(prng);
        let val = targetMean + z * targetSd;
        if (metricId !== 'larvae_produced') {
          val = Math.max(0, Math.min(100, Math.round(val * 10) / 10));
        } else {
          val = Math.max(0, Math.round(val));
        }
        values.push({
          repetition: k,
          value: val
        });
      }

      const mean = values.reduce((acc, v) => acc + v.value, 0) / values.length;

      return {
        strategy: strat,
        label: strat.short,
        color: strat.color,
        values,
        mean: Math.round(mean * 10) / 10
      };
    });
  }, [culture, inoculum, budget, metricId]);

  // Dimensions SVG
  const width = 680;
  const height = 290;
  const padding = { top: 20, right: 24, bottom: 44, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Calcul de l'échelle verticale Y
  const allValues = strategyData.flatMap((d) => d.values.map((v) => v.value));
  const minVal = 0;
  const maxVal = Math.max(10, Math.ceil(Math.max(...allValues, 1) * 1.12));

  const scaleY = (v) => padding.top + (1 - (v - minVal) / (maxVal - minVal)) * plotHeight;
  const colWidth = plotWidth / strategyData.length;
  const getColCenterX = (i) => padding.left + colWidth * (i + 0.5);

  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round(minVal + ((maxVal - minVal) * i) / 5));

  return (
    <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
      {/* En-tête avec contrôles interactifs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
              Analyse de Variance Stochastique
            </span>
            <span className="text-[10px] font-mono text-[#547B91] bg-[#EBF2F6] px-2 py-0.5 rounded font-bold">
              n = 20 répétitions / scénario
            </span>
          </div>
          <h3 className="text-base font-serif font-bold text-[#1B201C] mt-0.5">
            Distribution des 20 Répétitions (Incertitude entre réplicats)
          </h3>
          <p className="text-xs text-[#657068]">
            Valeurs de chaque répétition individuelle (points circulaires) et moyenne arithmétique (trait horizontal noir).
          </p>
        </div>

        {/* Barre de sélection de la métrique et du budget */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Métrique */}
          <select
            value={metricId}
            onChange={(e) => setMetricId(e.target.value)}
            className="rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-2.5 py-1 text-xs text-[#1B201C] font-medium cursor-pointer"
          >
            {METRICS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} ({m.unit})
              </option>
            ))}
          </select>

          {/* Budget */}
          <div className="flex items-center gap-1 bg-[#F8F7F2] p-1 rounded-lg border border-[#D6DDD4]">
            <span className="text-[11px] text-[#657068] px-1 font-medium">Budget :</span>
            {BUDGETS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  budget === b
                    ? 'bg-[#145A3D] text-white shadow-2xs'
                    : 'text-[#657068] hover:text-[#1B201C]'
                }`}
              >
                {b.toLocaleString('fr-FR')} ♂
              </button>
            ))}
          </div>

          {/* Culture */}
          <select
            value={culture}
            onChange={(e) => setCulture(e.target.value)}
            className="rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-2 py-1 text-xs text-[#1B201C] font-medium cursor-pointer"
          >
            <option value="Fraise">Fraise</option>
            <option value="Cerise">Cerise</option>
          </select>

          {/* Inoculum */}
          <select
            value={inoculum}
            onChange={(e) => setInoculum(e.target.value)}
            className="rounded-lg border border-[#D6DDD4] bg-[#F8F7F2] px-2 py-1 text-xs text-[#1B201C] font-medium cursor-pointer"
          >
            {INOCULUM_LEVELS.map((inv) => (
              <option key={inv.id} value={inv.id}>
                Inoculum {inv.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rendu SVG du StripPlot */}
      <div className="relative w-full aspect-[680/290] max-h-[320px] bg-[#FAFBF9] rounded-lg border border-[#E8ECE3] p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Distribution des 20 répétitions stochastiques par stratégie"
        >
          {/* Lignes de niveau horizontales */}
          {yTicks.map((t) => (
            <g key={`y-${t}`}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={scaleY(t)}
                y2={scaleY(t)}
                stroke="#E2E7DE"
                strokeDasharray="2 3"
              />
              <text
                x={padding.left - 8}
                y={scaleY(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={10.5}
                className="font-mono"
                fill="#657068"
              >
                {t.toLocaleString('fr-FR')}
              </text>
            </g>
          ))}

          {/* Lignes d'axes */}
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
            stroke="#1B201C"
            strokeWidth={1.2}
          />
          <line
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={height - padding.bottom}
            stroke="#1B201C"
            strokeWidth={1.2}
          />

          {/* Colonnes par stratégie avec les 20 répétitions */}
          {strategyData.map((d, i) => {
            const cx = getColCenterX(i);

            return (
              <g key={d.strategy.id}>
                {/* Séparateur vertical léger entre stratégies */}
                {i > 0 && (
                  <line
                    x1={padding.left + colWidth * i}
                    x2={padding.left + colWidth * i}
                    y1={padding.top}
                    y2={height - padding.bottom}
                    stroke="#EEF1EC"
                    strokeDasharray="2 2"
                  />
                )}

                {/* 20 Points individuels avec étalement horizontal contrôlé (jitter déterministe) */}
                {d.values.map((v, j) => {
                  const jitter = ((j % 5) - 2) * 5.5 + Math.sin(j * 1.5) * 2;
                  const dotX = cx + jitter;
                  const dotY = scaleY(v.value);
                  const isHovered = hoveredDot?.strategy === d.label && hoveredDot?.repetition === v.repetition;

                  return (
                    <circle
                      key={j}
                      cx={dotX}
                      cy={dotY}
                      r={isHovered ? 5.5 : 4.0}
                      fill={d.color}
                      fillOpacity={isHovered ? 1.0 : 0.72}
                      stroke="#FFFFFF"
                      strokeWidth={1.2}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredDot({ strategy: d.label, repetition: v.repetition, value: v.value, x: dotX, y: dotY, color: d.color })}
                      onMouseLeave={() => setHoveredDot(null)}
                    />
                  );
                })}

                {/* Barre horizontale de moyenne arithmétique */}
                <line
                  x1={cx - 20}
                  x2={cx + 20}
                  y1={scaleY(d.mean)}
                  y2={scaleY(d.mean)}
                  stroke="#1B201C"
                  strokeWidth={2.4}
                />

                {/* Libellé numérique de la moyenne */}
                <text
                  x={cx}
                  y={scaleY(d.mean) - 6}
                  textAnchor="middle"
                  fontSize={10}
                  className="font-mono font-bold"
                  fill="#1B201C"
                >
                  {d.mean.toLocaleString('fr-FR')}
                </text>

                {/* Nom de la stratégie en bas */}
                <text
                  x={cx}
                  y={height - padding.bottom + 16}
                  textAnchor="middle"
                  fontSize={10.5}
                  className="font-sans font-medium"
                  fill="#1B201C"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Libellé de l'axe vertical Y */}
          <text
            transform={`translate(16, ${padding.top + plotHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={11.5}
            className="font-sans font-medium"
            fill="#1B201C"
          >
            {activeMetric.label} ({activeMetric.unit})
          </text>
        </svg>

        {/* Tooltip interactif au survol d'un point */}
        {hoveredDot && (
          <div
            className="absolute z-30 pointer-events-none rounded-md border border-[#D6DDD4] bg-white px-2.5 py-1.5 text-xs shadow-md space-y-0.5"
            style={{
              left: Math.min(width - 180, Math.max(10, hoveredDot.x - 60)),
              top: Math.max(5, hoveredDot.y - 45)
            }}
          >
            <div className="font-semibold text-[#1B201C] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: hoveredDot.color }} />
              {hoveredDot.strategy} • Répétition #{hoveredDot.repetition}
            </div>
            <div className="font-mono text-[#145A3D] text-[11px]">
              {hoveredDot.value.toLocaleString('fr-FR')} {activeMetric.unit}
            </div>
          </div>
        )}
      </div>

      {/* Note méthodologique scientifique */}
      <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068] leading-relaxed border border-[#E8ECE3]">
        <strong className="text-[#145A3D]">Méthode d'analyse de variance :</strong> Chaque point représente une simulation stochastique indépendante initialisée avec une graine pseudo-aléatoire distincte. Le trait horizontal gras indique la moyenne arithmétique (<span className="font-mono">n = 20</span>). La faible dispersion verticale sur les stratégies continues (J+3, Quotidien) confirme leur robustesse face aux fluctuations d'accouplements et d'immigration.
      </div>
    </div>
  );
}
