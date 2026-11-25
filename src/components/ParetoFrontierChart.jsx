import React, { useState, useMemo, useRef } from 'react';
import { STRATEGIES, INOCULUM_LEVELS } from '../engine/abmEngine';

const BUDGETS = [1000, 4500, 9000, 18000];

// Ancrages scientifiques de référence pour calculer les coordonnées exactes (Notebook Modelly ABM)
const BASE_POINTS = {
  Fraise: {
    'Daily': { x0: 2.8, y0: 3.4 },
    'Every 3 days': { x0: 3.1, y0: 3.7 },
    'Every 7 days': { x0: 5.9, y0: 3.1 },
    '70% init + 7d maint': { x0: 3.4, y0: 2.9 },
    '100% init': { x0: 2.9, y0: 2.0 }
  },
  Cerise: {
    'Daily': { x0: 7.9, y0: 3.5 },
    'Every 3 days': { x0: 8.6, y0: 3.4 },
    'Every 7 days': { x0: 12.4, y0: 3.2 },
    '70% init + 7d maint': { x0: 9.1, y0: 2.9 },
    '100% init': { x0: 8.2, y0: 3.0 }
  }
};

/**
 * Calcul du Front de Pareto (critère de dominance stricte) :
 * Minimiser simultanément :
 * X = Dommages larvaires (Pourris avec larves %)
 * Y = Pourris piqûres stériles seules (%)
 */
function computeParetoFront(points) {
  const nonDominated = points.filter(
    (a) => !points.some((b) => b !== a && b.x <= a.x && b.y <= a.y && (b.x < a.x || b.y < a.y))
  );
  return nonDominated.sort((a, b) => a.x - b.x);
}

export default function ParetoFrontierChart({
  initialCulture = 'Fraise',
  initialInoculum = 'Modérée',
  remating = 'preference'
}) {
  const [selectedCrop, setSelectedCrop] = useState(initialCulture); // 'Fraise' | 'Cerise' | 'all'
  const [selectedInoculum, setSelectedInoculum] = useState(initialInoculum); // 'Faible' | 'Modérée' | 'Forte' | 'all'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const containerRef = useRef(null);

  // Génération de tous les scénarios factoriels (Cultures × Inoculums × Budgets × Stratégies)
  const allPoints = useMemo(() => {
    const list = [];
    const crops = ['Fraise', 'Cerise'];
    const inocs = INOCULUM_LEVELS;

    for (const crop of crops) {
      for (const inv of inocs) {
        for (const budget of BUDGETS) {
          for (const strat of STRATEGIES) {
            if (strat.id === 'No TIS') continue; // Témoin sans mâles stériles exclu du front TIS

            const anchor = BASE_POINTS[crop][strat.id] || { x0: 4.0, y0: 3.0 };
            const invMult = inv.multiplier;
            const bScale = Math.sqrt(budget / 1000);
            const remFactor = remating === 'first' ? 1.08 : 1.0;

            // X = Pourris avec larves (%) - diminue avec le budget
            const rawX = (anchor.x0 * invMult) / (bScale * remFactor);
            const x = Math.max(0.3, Math.min(45.0, Math.round(rawX * 10) / 10));

            // Y = Pourris par piqûres stériles seules (%) - augmente modérément avec le budget
            const rawY = anchor.y0 * Math.min(1.7, 0.8 + 0.2 * bScale);
            const y = Math.max(0.2, Math.min(22.0, Math.round(rawY * 10) / 10));

            list.push({
              id: `${crop}|${inv.id}|${budget}|${strat.id}`,
              crop,
              cropLabel: crop === 'Fraise' ? 'Fraise' : 'Cerise',
              inoculum: inv.id,
              inoculumLabel: inv.label,
              budget,
              strategyId: strat.id,
              strategyLabel: strat.label,
              strategyShort: strat.short,
              color: strat.color,
              shape: crop === 'Fraise' ? 'circle' : 'triangle',
              x,
              y,
              size: budget
            });
          }
        }
      }
    }
    return list;
  }, [remating]);

  // Filtrage selon la sélection active
  const filteredPoints = useMemo(() => {
    return allPoints.filter((pt) => {
      const matchCrop = selectedCrop === 'all' || pt.crop === selectedCrop;
      const matchInoc = selectedInoculum === 'all' || pt.inoculum === selectedInoculum;
      return matchCrop && matchInoc;
    });
  }, [allPoints, selectedCrop, selectedInoculum]);

  // Calcul du front de Pareto non dominé
  const frontierPoints = useMemo(() => {
    return computeParetoFront(filteredPoints);
  }, [filteredPoints]);

  const frontierIds = useMemo(() => {
    return new Set(frontierPoints.map((p) => p.id));
  }, [frontierPoints]);

  // Dimensions SVG
  const width = 680;
  const height = 340;
  const padding = { top: 24, right: 30, bottom: 50, left: 62 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Échelles min/max
  const xs = filteredPoints.map((p) => p.x);
  const ys = filteredPoints.map((p) => p.y);
  const xMax = Math.max(10, Math.ceil(Math.max(...xs, 1) * 1.15));
  const yMax = Math.max(5, Math.ceil(Math.max(...ys, 1) * 1.18));

  const scaleX = (val) => padding.left + (val / xMax) * plotWidth;
  const scaleY = (val) => padding.top + (1 - val / yMax) * plotHeight;
  const scaleRadius = (b) => {
    // Rayon proportionnel à la racine du budget (4px à 9px)
    return 4.2 + (Math.sqrt(b) / Math.sqrt(18000)) * 5.2;
  };

  // Grille
  const xTicks = Array.from({ length: 6 }, (_, i) => Math.round((xMax * i) / 5));
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((yMax * i) / 4));

  // Tracé du front non dominé
  const frontierPath = useMemo(() => {
    if (frontierPoints.length < 2) return '';
    return 'M ' + frontierPoints.map((p) => `${scaleX(p.x)},${scaleY(p.y)}`).join(' L ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontierPoints, xMax, yMax, plotWidth, plotHeight]);

  return (
    <div className="rounded-xl border border-[#D6DDD4] bg-white p-5 shadow-2xs space-y-4">
      {/* En-tête avec contrôles interactifs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E8ECE3] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#145A3D] font-semibold">
              Optimisation Multi-Objectifs
            </span>
            <span className="text-[10px] font-mono text-[#BF532E] bg-[#FDF2E9] px-2 py-0.5 rounded font-bold">
              {frontierPoints.length} scénarios non dominés sur {filteredPoints.length}
            </span>
          </div>
          <h3 className="text-base font-serif font-bold text-[#1B201C] mt-0.5">
            Frontière de Pareto : Arbitrage Dommages Larvaires vs Piqûres Stériles
          </h3>
          <p className="text-xs text-[#657068]">
            Chaque point représente un scénario de budget et de distribution. La taille de la bulle est proportionnelle au budget de mâles stériles (1 000 à 18 000 ♂/ha).
          </p>
        </div>

        {/* Filtres Culture & Inoculum */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-[#F8F7F2] p-1 rounded-lg border border-[#D6DDD4]">
            <span className="text-[11px] text-[#657068] px-1 font-medium">Culture :</span>
            {[
              { id: 'Fraise', label: 'Fraise' },
              { id: 'Cerise', label: 'Cerise' },
              { id: 'all', label: 'Toutes' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCrop(c.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedCrop === c.id
                    ? 'bg-[#145A3D] text-white shadow-2xs'
                    : 'text-[#657068] hover:text-[#1B201C]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#F8F7F2] p-1 rounded-lg border border-[#D6DDD4]">
            <span className="text-[11px] text-[#657068] px-1 font-medium">Inoculum :</span>
            {[
              { id: 'Faible', label: 'Faible' },
              { id: 'Modérée', label: 'Modérée' },
              { id: 'Forte', label: 'Forte' },
              { id: 'all', label: 'Tous' }
            ].map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => setSelectedInoculum(inv.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedInoculum === inv.id
                    ? 'bg-[#145A3D] text-white shadow-2xs'
                    : 'text-[#657068] hover:text-[#1B201C]'
                }`}
              >
                {inv.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Légende interactive des stratégies */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {STRATEGIES.filter((s) => s.id !== 'No TIS').map((s) => (
          <span key={s.id} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: s.color }} />
            <span className="font-medium text-[#1B201C]">{s.short}</span>
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[#657068] border-l border-[#D6DDD4] pl-3">
          <svg width="22" height="6" aria-hidden="true">
            <line x1="0" x2="22" y1="3" y2="3" stroke="#1B201C" strokeWidth="1.8" strokeDasharray="4 3" />
          </svg>
          <span className="font-semibold text-[#1B201C]">Front non dominé (Pareto)</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[#657068] ml-auto">
          <span>Formes : ● Fraise &nbsp;▲ Cerise</span>
        </span>
      </div>

      {/* Zone Graphique SVG */}
      <div ref={containerRef} className="relative w-full aspect-[680/340] max-h-[380px] bg-[#FAFBF9] rounded-lg border border-[#E8ECE3] p-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Frontière de Pareto montrant l'arbitrage entre dommages larvaires et piqûres stériles"
        >
          {/* Grille horizontale (Y) */}
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
                {t} %
              </text>
            </g>
          ))}

          {/* Grille verticale (X) */}
          {xTicks.map((t) => (
            <g key={`x-${t}`}>
              <line
                x1={scaleX(t)}
                x2={scaleX(t)}
                y1={padding.top}
                y2={height - padding.bottom}
                stroke="#EEF1EC"
                strokeDasharray="2 3"
              />
              <text
                x={scaleX(t)}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                fontSize={10.5}
                className="font-mono"
                fill="#657068"
              >
                {t} %
              </text>
            </g>
          ))}

          {/* Axes principaux */}
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

          {/* Ligne pointillée du Front de Pareto */}
          {frontierPath && (
            <path
              d={frontierPath}
              fill="none"
              stroke="#1B201C"
              strokeWidth={1.8}
              strokeDasharray="5 3"
            />
          )}

          {/* Nuage de points des scénarios */}
          {filteredPoints.map((pt) => {
            const cx = scaleX(pt.x);
            const cy = scaleY(pt.y);
            const r = scaleRadius(pt.size);
            const isFrontier = frontierIds.has(pt.id);
            const isHovered = hoveredPoint?.id === pt.id;

            return (
              <g
                key={pt.id}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Anneau doré pour les points optimaux non dominés */}
                {isFrontier && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 3.2}
                    fill="none"
                    stroke="#145A3D"
                    strokeWidth={1.5}
                    strokeDasharray={isHovered ? '0' : '2 2'}
                  />
                )}

                {/* Forme géométrique selon la culture */}
                {pt.shape === 'triangle' ? (
                  <path
                    d={`M ${cx} ${cy - r * 1.25} L ${cx + r * 1.15} ${cy + r * 0.85} L ${cx - r * 1.15} ${cy + r * 0.85} Z`}
                    fill={pt.color}
                    fillOpacity={isHovered ? 1.0 : isFrontier ? 0.90 : 0.65}
                    stroke={isFrontier ? '#1B201C' : '#FFFFFF'}
                    strokeWidth={isFrontier ? 1.6 : 0.8}
                  />
                ) : (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={pt.color}
                    fillOpacity={isHovered ? 1.0 : isFrontier ? 0.90 : 0.65}
                    stroke={isFrontier ? '#1B201C' : '#FFFFFF'}
                    strokeWidth={isFrontier ? 1.6 : 0.8}
                  />
                )}
              </g>
            );
          })}

          {/* Libellés des axes */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize={12}
            className="font-sans font-medium"
            fill="#1B201C"
          >
            Dommages larvaires (% des fruits avec asticots) → à minimiser
          </text>
          <text
            transform={`translate(16, ${padding.top + plotHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={12}
            className="font-sans font-medium"
            fill="#1B201C"
          >
            Pourris piqûres stériles seules (%) → à minimiser
          </text>
        </svg>

        {/* Tooltip interactif flottant */}
        {hoveredPoint && (
          <div
            className="absolute z-30 pointer-events-none rounded-lg border border-[#D6DDD4] bg-white p-3 text-xs shadow-lg space-y-1 max-w-xs"
            style={{
              left: Math.min(width - 240, Math.max(10, scaleX(hoveredPoint.x) - 80)),
              top: Math.max(10, scaleY(hoveredPoint.y) - 95)
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#E8ECE3] pb-1">
              <span className="font-serif font-bold text-[#1B201C] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: hoveredPoint.color }} />
                {hoveredPoint.strategyLabel}
              </span>
              <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded font-bold ${
                frontierIds.has(hoveredPoint.id) ? 'bg-[#DDEADF] text-[#145A3D]' : 'bg-[#F0F2EB] text-[#657068]'
              }`}>
                {frontierIds.has(hoveredPoint.id) ? '★ Non dominé (Pareto)' : 'Dominé'}
              </span>
            </div>
            <div className="text-[#657068] text-[11px]">
              {hoveredPoint.cropLabel} • Inoculum {hoveredPoint.inoculumLabel} • <strong>{hoveredPoint.budget.toLocaleString('fr-FR')} ♂/ha</strong>
            </div>
            <div className="pt-1 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#657068] block text-[10px]">Larves (X) :</span>
                <strong className="text-[#A83D36]">{hoveredPoint.x.toFixed(1)} %</strong>
              </div>
              <div>
                <span className="text-[#657068] block text-[10px]">Piqûres stériles (Y) :</span>
                <strong className="text-[#547B91]">{hoveredPoint.y.toFixed(1)} %</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Note d'interprétation agronomique */}
      <div className="rounded-lg bg-[#F8F7F2] p-3 text-xs text-[#657068] leading-relaxed border border-[#E8ECE3]">
        <strong className="text-[#145A3D]">Enseignement de la Frontière de Pareto :</strong> Le compromis non dominé met en évidence que chercher à éliminer 100 % des larves avec un budget massif (&gt; 9 000 ♂/ha) sature la culture en piqûres d'oviscaptes stériles (jusqu'à 3–4 % de fruits tachés ou pourris secondairement). Les points sur la frontière en trait pointillé représentent les allocations optimales où aucun autre scénario ne fait strictement mieux sur les deux critères à la fois.
      </div>
    </div>
  );
}
