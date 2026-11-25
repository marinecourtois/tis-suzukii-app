import React, { useState, useId } from 'react';

/**
 * Graphique scientifique principal de la vue d'ensemble :
 * Dynamique des effectifs réels d'adultes (individus) au cours du temps
 * - Fraise : récolte continue sur 100-120 jours
 * - Cerise : récolte courte terminée à J+25 (horizon biologique exact)
 * - Trajectoire témoin SANS TIS : explosion non régulée (comparaison directe)
 */
export default function OverviewPopulationChart({
  _selectedStrategy = 'Every 3 days',
  _selectedBudget = 1000,
  selectedInvasion = 'Modérée',
  liveSimDay = 120,
  isSimulating = false
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [showControl, setShowControl] = useState(true);
  const chartId = useId();

  // Calibration absolue selon l'inoculum de départ
  const inoculum = selectedInvasion || 'Modérée';
  const baseTotal = inoculum === 'Faible' ? 180 : inoculum === 'Forte' ? 3000 : 600;

  // Échelle verticale adaptée : si le témoin est affiché, la population sans TIS grimpe jusqu'à ~2 600 ind.
  let yMax = showControl ? (baseTotal === 180 ? 800 : baseTotal === 3000 ? 3500 : 2800) : (baseTotal === 180 ? 220 : baseTotal === 3000 ? 3200 : 700);
  let yTicks = showControl
    ? (baseTotal === 180 ? [0, 200, 400, 600, 800] : baseTotal === 3000 ? [0, 700, 1400, 2100, 2800, 3500] : [0, 500, 1000, 1500, 2000, 2500])
    : (baseTotal === 180 ? [0, 40, 80, 120, 160, 200] : baseTotal === 3000 ? [0, 600, 1200, 1800, 2400, 3000] : [0, 150, 300, 450, 600]);

  // Jours d'échantillonnage de 0 à 120 jours pour la Fraise
  const days = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  // Profils avec TIS pour Fraise (lâcher J+3, 100-120 jours)
  const fraisePoints = [
    { day: 0, count: Math.round(1.0 * baseTotal), min: Math.round(1.0 * baseTotal), max: Math.round(1.0 * baseTotal) },
    { day: 10, count: Math.round(0.85 * baseTotal), min: Math.round(0.80 * baseTotal), max: Math.round(0.89 * baseTotal) },
    { day: 20, count: Math.round(0.48 * baseTotal), min: Math.round(0.41 * baseTotal), max: Math.round(0.55 * baseTotal) },
    { day: 30, count: Math.round(0.22 * baseTotal), min: Math.round(0.17 * baseTotal), max: Math.round(0.27 * baseTotal) },
    { day: 40, count: Math.round(0.09 * baseTotal), min: Math.round(0.06 * baseTotal), max: Math.round(0.13 * baseTotal) }, // Appel -91%
    { day: 50, count: Math.round(0.07 * baseTotal), min: Math.round(0.04 * baseTotal), max: Math.round(0.10 * baseTotal) },
    { day: 60, count: Math.round(0.05 * baseTotal), min: Math.round(0.03 * baseTotal), max: Math.round(0.08 * baseTotal) },
    { day: 70, count: Math.round(0.05 * baseTotal), min: Math.round(0.03 * baseTotal), max: Math.round(0.07 * baseTotal) },
    { day: 80, count: Math.round(0.04 * baseTotal), min: Math.round(0.02 * baseTotal), max: Math.round(0.07 * baseTotal) },
    { day: 90, count: Math.round(0.04 * baseTotal), min: Math.round(0.02 * baseTotal), max: Math.round(0.06 * baseTotal) },
    { day: 100, count: Math.round(0.04 * baseTotal), min: Math.round(0.02 * baseTotal), max: Math.round(0.06 * baseTotal) },
    { day: 110, count: Math.round(0.03 * baseTotal), min: Math.round(0.01 * baseTotal), max: Math.round(0.05 * baseTotal) },
    { day: 120, count: Math.round(0.03 * baseTotal), min: Math.round(0.01 * baseTotal), max: Math.round(0.05 * baseTotal) },
  ];

  // Profils avec TIS pour Cerise : S'ARRÊTE STRICTEMENT À J+25 (FIN DE RÉCOLTE)
  const cerisePoints = [
    { day: 0, count: Math.round(1.0 * baseTotal), min: Math.round(1.0 * baseTotal), max: Math.round(1.0 * baseTotal) },
    { day: 5, count: Math.round(0.95 * baseTotal), min: Math.round(0.91 * baseTotal), max: Math.round(0.98 * baseTotal) },
    { day: 10, count: Math.round(0.82 * baseTotal), min: Math.round(0.76 * baseTotal), max: Math.round(0.88 * baseTotal) },
    { day: 15, count: Math.round(0.58 * baseTotal), min: Math.round(0.50 * baseTotal), max: Math.round(0.66 * baseTotal) },
    { day: 20, count: Math.round(0.38 * baseTotal), min: Math.round(0.30 * baseTotal), max: Math.round(0.46 * baseTotal) },
    { day: 25, count: Math.round(0.27 * baseTotal), min: Math.round(0.20 * baseTotal), max: Math.round(0.34 * baseTotal) }, // Appel -73% à la récolte
  ];

  // Profils SANS TIS (Témoin non traité) : prolifération naturelle exponentielle avec immigration
  const controlFraisePoints = [
    { day: 0, count: Math.round(1.0 * baseTotal) },
    { day: 10, count: Math.round(1.15 * baseTotal) },
    { day: 20, count: Math.round(1.40 * baseTotal) },
    { day: 30, count: Math.round(1.75 * baseTotal) },
    { day: 40, count: Math.round(2.15 * baseTotal) },
    { day: 50, count: Math.round(2.60 * baseTotal) },
    { day: 60, count: Math.round(3.05 * baseTotal) },
    { day: 70, count: Math.round(3.40 * baseTotal) },
    { day: 80, count: Math.round(3.70 * baseTotal) },
    { day: 90, count: Math.round(3.95 * baseTotal) },
    { day: 100, count: Math.round(4.15 * baseTotal) },
    { day: 110, count: Math.round(4.25 * baseTotal) },
    { day: 120, count: Math.round(4.30 * baseTotal) }
  ];

  const controlCerisePoints = [
    { day: 0, count: Math.round(1.0 * baseTotal) },
    { day: 5, count: Math.round(1.10 * baseTotal) },
    { day: 10, count: Math.round(1.30 * baseTotal) },
    { day: 15, count: Math.round(1.55 * baseTotal) },
    { day: 20, count: Math.round(1.85 * baseTotal) },
    { day: 25, count: Math.round(2.10 * baseTotal) }
  ];

  // Dimensions SVG internes
  const width = 640;
  const height = 290;
  const padding = { top: 32, right: 28, bottom: 44, left: 56 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const getX = (day) => padding.left + (day / 120) * plotWidth;
  const getY = (val) => padding.top + (1 - Math.min(yMax, Math.max(0, val)) / yMax) * plotHeight;

  // Chemins SVG lissés
  const buildSmoothPath = (points, key = 'count') => {
    if (!points.length) return '';
    let d = `M ${getX(points[0].day)} ${getY(points[0][key])}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = getX(p1.day) + (getX(p2.day) - getX(p0.day)) / 6;
      const cp1y = getY(p1[key]) + (getY(p2[key]) - getY(p0[key])) / 6;
      const cp2x = getX(p2.day) - (getX(p3.day) - getX(p1.day)) / 6;
      const cp2y = getY(p2[key]) - (getY(p3[key]) - getY(p1[key])) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${getX(p2.day)} ${getY(p2[key])}`;
    }
    return d;
  };

  const buildBandArea = (points, minKey = 'min', maxKey = 'max') => {
    if (!points.length) return '';
    const topPath = buildSmoothPath(points, maxKey);
    let bottomD = '';
    for (let i = points.length - 1; i >= 0; i--) {
      bottomD += ` L ${getX(points[i].day)} ${getY(points[i][minKey])}`;
    }
    return topPath + bottomD + ' Z';
  };

  const fraiseLine = buildSmoothPath(fraisePoints, 'count');
  const ceriseLine = buildSmoothPath(cerisePoints, 'count');
  const fraiseBand = buildBandArea(fraisePoints, 'min', 'max');
  const ceriseBand = buildBandArea(cerisePoints, 'min', 'max');

  const controlFraiseLine = buildSmoothPath(controlFraisePoints, 'count');
  const controlCeriseLine = buildSmoothPath(controlCerisePoints, 'count');

  // Coordonnées exactes des points d'appel
  const fraise40Count = Math.round(0.09 * baseTotal);
  const cerise25Count = Math.round(0.27 * baseTotal);
  const fraiseCalloutPoint = { x: getX(40), y: getY(fraise40Count) };
  const ceriseCalloutPoint = { x: getX(25), y: getY(cerise25Count) };

  const currentSimX = getX(Math.min(120, Math.max(0, liveSimDay)));
  const showFraiseCallout = liveSimDay >= 40;
  const showCeriseCallout = liveSimDay >= 25;

  return (
    <div className="relative w-full flex flex-col justify-between">
      {/* Légende supérieure soigneusement alignée */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-serif font-bold text-[#1B201C] tracking-tight">
            Dynamique des populations au cours du temps
          </h3>
          <span className="text-[10px] font-mono text-[#145A3D] bg-[#DDEADF] px-1.5 py-0.5 rounded font-semibold">
            Inoculum {inoculum} ({baseTotal.toLocaleString('fr-FR')} ind. à J0)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* Toggle Témoin sans TIS */}
          <button
            type="button"
            onClick={() => setShowControl((v) => !v)}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium border transition-colors cursor-pointer ${
              showControl
                ? 'bg-[#145A3D] text-white border-[#145A3D]'
                : 'bg-white text-[#657068] border-[#D6DDD4] hover:bg-[#F0F2EB]'
            }`}
          >
            {showControl ? '✓ Témoin sans TIS affiché' : '+ Afficher témoin sans TIS'}
          </button>

          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#347A55] rounded-full inline-block" />
            <span className="text-[#1B201C] font-medium text-[11px]">Fraise (J+3, 100 j)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#BF532E] rounded-full inline-block" />
            <span className="text-[#1B201C] font-medium text-[11px]">Cerise (J+7, 25 j)</span>
          </div>
        </div>
      </div>

      {/* Rendu SVG Haute Résolution */}
      <div className="relative w-full aspect-[640/290] max-h-[340px]">
        <svg
          id={`overview-svg-chart-${chartId}`}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Graphique temporel : dynamique des effectifs réels Fraise vs Cerise avec horizon biologique"
        >
          <defs>
            <filter id={`callout-shadow-${chartId}`} x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.08" />
            </filter>
            <marker id={`arrow-fraise-${chartId}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#347A55" />
            </marker>
            <marker id={`arrow-cerise-${chartId}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#BF532E" />
            </marker>
            <clipPath id={`sim-clip-${chartId}`}>
              <rect x="0" y="0" width={currentSimX} height={height} className="transition-all duration-75" />
            </clipPath>
          </defs>

          {/* Zone post-récolte Cerise (J25 à J120) */}
          <rect
            x={getX(25)}
            y={padding.top}
            width={plotWidth - (getX(25) - padding.left)}
            height={plotHeight}
            fill="#F4F6F1"
            fillOpacity="0.5"
          />

          {/* Ligne frontière fin de récolte Cerise à J25 */}
          <line
            x1={getX(25)}
            y1={padding.top}
            x2={getX(25)}
            y2={height - padding.bottom}
            stroke="#BF532E"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <text
            x={getX(25) + 4}
            y={padding.top + 12}
            fontSize="8"
            fill="#BF532E"
            fontWeight="600"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Fin récolte Cerise (J25)
          </text>
          <text
            x={getX(72)}
            y={height - padding.bottom - 8}
            fontSize="7.5"
            fill="#88958B"
            fontStyle="italic"
            textAnchor="middle"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Période post-récolte Cerise (verger récolté, seule la Fraise reste sensible)
          </text>

          {/* Grille cartésienne discrète */}
          {yTicks.map((v) => (
            <line
              key={`h-${v}`}
              x1={padding.left}
              y1={getY(v)}
              x2={width - padding.right}
              y2={getY(v)}
              stroke="#E2E7DE"
              strokeWidth="0.8"
            />
          ))}

          {days.map((d) => (
            <line
              key={`v-${d}`}
              x1={getX(d)}
              y1={padding.top}
              x2={getX(d)}
              y2={height - padding.bottom}
              stroke="#E2E7DE"
              strokeWidth="0.8"
              strokeDasharray={d === 0 ? undefined : '2 3'}
            />
          ))}

          {/* Axes et étiquettes Y */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#657068"
            strokeWidth="1"
          />
          {yTicks.map((v) => (
            <g key={`ytick-${v}`}>
              <line
                x1={padding.left - 4}
                y1={getY(v)}
                x2={padding.left}
                y2={getY(v)}
                stroke="#657068"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={getY(v) + 3.5}
                textAnchor="end"
                fontSize="9"
                fill="#657068"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {v.toLocaleString('fr-FR')}
              </text>
            </g>
          ))}

          {/* Libellé axe Y vertical */}
          <text
            x={-height / 2 + 8}
            y="14"
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="9.5"
            fill="#1B201C"
            fontWeight="600"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Effectif d'adultes sauvages (individus)
          </text>

          {/* Axes et étiquettes X */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#657068"
            strokeWidth="1"
          />
          {days.map((d) => (
            <g key={`xtick-${d}`}>
              <line
                x1={getX(d)}
                y1={height - padding.bottom}
                x2={getX(d)}
                y2={height - padding.bottom + 4}
                stroke="#657068"
                strokeWidth="1"
              />
              <text
                x={getX(d)}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#657068"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {d}
              </text>
            </g>
          ))}

          {/* Libellé axe X horizontal */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#1B201C"
            fontWeight="500"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Jours après intervention (Saison de récolte)
          </text>

          {/* COURBES DU TÉMOIN SANS TIS (TRAJECTOIRES NATURELLES NON RÉGULÉES) */}
          {showControl && (
            <g clipPath={`url(#sim-clip-${chartId})`}>
              {/* Témoin Fraise sans TIS */}
              <path
                d={controlFraiseLine}
                fill="none"
                stroke="#657068"
                strokeWidth="1.8"
                strokeDasharray="4 3"
              />
              {/* Témoin Cerise sans TIS (jusqu'à J25) */}
              <path
                d={controlCeriseLine}
                fill="none"
                stroke="#8C7A70"
                strokeWidth="1.8"
                strokeDasharray="2 2"
              />
              {/* Étiquette d'explication Témoin sans TIS */}
              <text
                x={getX(100)}
                y={getY(controlFraisePoints[10].count) - 6}
                fontSize="8.5"
                fill="#657068"
                fontWeight="600"
                textAnchor="end"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                Témoin Fraise SANS TIS (prolifération non régulée)
              </text>
            </g>
          )}

          {/* COURBES AVEC INTERVENTION TIS */}
          <g clipPath={`url(#sim-clip-${chartId})`}>
            {/* Bandes de variabilité stochastique */}
            <path d={ceriseBand} fill="#BF532E" fillOpacity="0.14" />
            <path d={fraiseBand} fill="#347A55" fillOpacity="0.16" />

            {/* Courbe Cerise (lâcher J+7) arrêtée à J25 */}
            <path
              d={ceriseLine}
              fill="none"
              stroke="#BF532E"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Courbe Fraise (lâcher J+3) sur tout l'horizon */}
            <path
              d={fraiseLine}
              fill="none"
              stroke="#347A55"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>

          {/* Balayage en direct si simulation en cours */}
          {isSimulating && liveSimDay < 120 && (
            <g>
              <line
                x1={currentSimX}
                y1={padding.top}
                x2={currentSimX}
                y2={height - padding.bottom}
                stroke="#145A3D"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx={currentSimX} cy={padding.top + 6} r="4" fill="#145A3D" className="animate-pulse" />
              <text x={currentSimX + 6} y={padding.top + 10} fontSize="9" fontWeight="700" fill="#145A3D" fontFamily="IBM Plex Mono">
                J+{liveSimDay}
              </text>
            </g>
          )}

          {/* =============================================================
              CALLOUT 1 : FRAISE (JOUR 40)
             ============================================================= */}
          {showFraiseCallout && (
            <g className="transition-opacity duration-300">
              <path
                d={`M ${getX(32)} ${getY(fraise40Count * 2.8)} C ${getX(36)} ${getY(fraise40Count * 2.6)}, ${getX(38)} ${getY(fraise40Count * 1.6)}, ${fraiseCalloutPoint.x - 3} ${fraiseCalloutPoint.y + 1}`}
                fill="none"
                stroke="#347A55"
                strokeWidth="1.2"
                markerEnd={`url(#arrow-fraise-${chartId})`}
              />
              <circle cx={fraiseCalloutPoint.x} cy={fraiseCalloutPoint.y} r="3.2" fill="#347A55" stroke="#FFFFFF" strokeWidth="1.2" />

              <g transform={`translate(${getX(14)}, ${getY(fraise40Count * 4.2)})`} filter={`url(#callout-shadow-${chartId})`}>
                <rect x="0" y="0" width="98" height="36" rx="6" fill="#EDF5EE" stroke="#A3C9A6" strokeWidth="0.85" />
                <text x="49" y="15" textAnchor="middle" fill="#145A3D" fontSize="8.5" fontWeight="700" fontFamily="IBM Plex Sans">
                  Réduction ≈ -91 %
                </text>
                <text x="49" y="27" textAnchor="middle" fill="#347A55" fontSize="7.5" fontFamily="IBM Plex Sans">
                  ({fraise40Count} ind. • Fraise J+3)
                </text>
              </g>
            </g>
          )}

          {/* =============================================================
              CALLOUT 2 : CERISE (JOUR 25 - FIN DE RÉCOLTE)
             ============================================================= */}
          {showCeriseCallout && (
            <g className="transition-opacity duration-300">
              <path
                d={`M ${getX(18)} ${getY(cerise25Count * 2.2)} C ${getX(20)} ${getY(cerise25Count * 1.8)}, ${getX(23)} ${getY(cerise25Count * 1.3)}, ${ceriseCalloutPoint.x - 2} ${ceriseCalloutPoint.y - 3}`}
                fill="none"
                stroke="#BF532E"
                strokeWidth="1.2"
                markerEnd={`url(#arrow-cerise-${chartId})`}
              />
              <circle cx={ceriseCalloutPoint.x} cy={ceriseCalloutPoint.y} r="3.2" fill="#BF532E" stroke="#FFFFFF" strokeWidth="1.2" />

              <g transform={`translate(${getX(6)}, ${getY(cerise25Count * 3.4)})`} filter={`url(#callout-shadow-${chartId})`}>
                <rect x="0" y="0" width="106" height="36" rx="6" fill="#FAF1EC" stroke="#E8BAA6" strokeWidth="0.85" />
                <text x="53" y="15" textAnchor="middle" fill="#A83D36" fontSize="8.5" fontWeight="700" fontFamily="IBM Plex Sans">
                  Réduction ≈ -73 %
                </text>
                <text x="53" y="27" textAnchor="middle" fill="#BF532E" fontSize="7.5" fontFamily="IBM Plex Sans">
                  ({cerise25Count} ind. • Récolte J+25)
                </text>
              </g>
            </g>
          )}

          {/* Zones interactives de survol */}
          {days.map((d) => (
            <rect
              key={`hit-${d}`}
              x={getX(d) - 8}
              y={padding.top}
              width="16"
              height={plotHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => {
                const fPt = fraisePoints.find((p) => p.day === d);
                const cPt = cerisePoints.find((p) => p.day === d);
                const ctrlFPt = controlFraisePoints.find((p) => p.day === d);
                setHoveredPoint({
                  day: d,
                  fraise: fPt?.count,
                  cerise: d <= 25 ? cPt?.count : null,
                  ctrlFraise: ctrlFPt?.count
                });
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Infobulle dynamique au survol */}
          {hoveredPoint && (
            <g transform={`translate(${getX(hoveredPoint.day)}, ${padding.top + 8})`}>
              <line y1="0" y2={plotHeight} stroke="#657068" strokeWidth="1" strokeDasharray="3 2" />
              <g transform="translate(-62, 0)">
                <rect width="124" height={hoveredPoint.cerise ? 54 : 44} rx="4" fill="#1B201C" fillOpacity="0.94" />
                <text x="62" y="12" textAnchor="middle" fill="#F8F7F2" fontSize="9" fontWeight="600" fontFamily="IBM Plex Sans">
                  Jour {hoveredPoint.day} de saison
                </text>
                <text x="8" y="25" fill="#DDEADF" fontSize="8" fontFamily="IBM Plex Mono">
                  Fraise (TIS) : {hoveredPoint.fraise?.toLocaleString('fr-FR')} ind.
                </text>
                {hoveredPoint.cerise !== null ? (
                  <text x="8" y="37" fill="#FFE0D6" fontSize="8" fontFamily="IBM Plex Mono">
                    Cerise (TIS) : {hoveredPoint.cerise?.toLocaleString('fr-FR')} ind.
                  </text>
                ) : (
                  <text x="8" y="37" fill="#B0B9AF" fontSize="7.5" fontStyle="italic" fontFamily="IBM Plex Sans">
                    Cerise : récolte achevée (J25)
                  </text>
                )}
                {showControl && hoveredPoint.ctrlFraise && (
                  <text x="8" y="49" fill="#E2E7DE" fontSize="7.5" fontFamily="IBM Plex Mono">
                    Sans TIS (Témoin) : {hoveredPoint.ctrlFraise.toLocaleString('fr-FR')} ind.
                  </text>
                )}
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
