import React, { useState, useId } from 'react';
import { Download } from 'lucide-react';

/**
 * Graphique scientifique principal de la vue d'ensemble :
 * Dynamique des populations relatives au cours du temps (0 à 120 jours)
 * avec bandes d'incertitude (±SD) et annotations éditoriales
 */
export default function OverviewPopulationChart({
  selectedStrategy = 'Every 3 days',
  selectedBudget = 1000,
  selectedInvasion = 'Modérée',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const chartId = useId();

  // Données calibrées sur 120 jours pour Fraise (J+3) et Cerise (J+7)
  // conformes aux ancrages exacts du modèle
  const days = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

  const dataPoints = [
    { day: 0, fraise: 1.0, fraiseMin: 1.0, fraiseMax: 1.0, cerise: 1.0, ceriseMin: 1.0, ceriseMax: 1.0 },
    { day: 10, fraise: 0.85, fraiseMin: 0.80, fraiseMax: 0.89, cerise: 0.93, ceriseMin: 0.89, ceriseMax: 0.97 },
    { day: 20, fraise: 0.48, fraiseMin: 0.41, fraiseMax: 0.55, cerise: 0.74, ceriseMin: 0.67, ceriseMax: 0.81 },
    { day: 30, fraise: 0.22, fraiseMin: 0.17, fraiseMax: 0.27, cerise: 0.54, ceriseMin: 0.47, ceriseMax: 0.61 },
    { day: 40, fraise: 0.09, fraiseMin: 0.06, fraiseMax: 0.13, cerise: 0.39, ceriseMin: 0.32, ceriseMax: 0.46 }, // Point d'appel Fraise (-91%)
    { day: 50, fraise: 0.07, fraiseMin: 0.04, fraiseMax: 0.10, cerise: 0.31, ceriseMin: 0.24, ceriseMax: 0.38 },
    { day: 60, fraise: 0.05, fraiseMin: 0.03, fraiseMax: 0.08, cerise: 0.27, ceriseMin: 0.21, ceriseMax: 0.33 }, // Point d'appel Cerise (-73%)
    { day: 70, fraise: 0.05, fraiseMin: 0.03, fraiseMax: 0.07, cerise: 0.24, ceriseMin: 0.18, ceriseMax: 0.30 },
    { day: 80, fraise: 0.04, fraiseMin: 0.02, fraiseMax: 0.07, cerise: 0.22, ceriseMin: 0.16, ceriseMax: 0.28 },
    { day: 90, fraise: 0.04, fraiseMin: 0.02, fraiseMax: 0.06, cerise: 0.21, ceriseMin: 0.15, ceriseMax: 0.27 },
    { day: 100, fraise: 0.04, fraiseMin: 0.02, fraiseMax: 0.06, cerise: 0.20, ceriseMin: 0.14, ceriseMax: 0.26 },
    { day: 110, fraise: 0.03, fraiseMin: 0.01, fraiseMax: 0.05, cerise: 0.19, ceriseMin: 0.13, ceriseMax: 0.25 },
    { day: 120, fraise: 0.03, fraiseMin: 0.01, fraiseMax: 0.05, cerise: 0.19, ceriseMin: 0.13, ceriseMax: 0.25 },
  ];

  // Dimensions SVG internes
  const width = 640;
  const height = 290;
  const padding = { top: 30, right: 28, bottom: 44, left: 48 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const getX = (day) => padding.left + (day / 120) * plotWidth;
  const getY = (val) => padding.top + (1 - val) * plotHeight;

  // Chemins SVG lissés
  const buildSmoothPath = (points, key) => {
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

  const buildBandArea = (points, minKey, maxKey) => {
    const topPath = buildSmoothPath(points, maxKey);
    let bottomD = '';
    for (let i = points.length - 1; i >= 0; i--) {
      bottomD += ` L ${getX(points[i].day)} ${getY(points[i][minKey])}`;
    }
    return topPath + bottomD + ' Z';
  };

  const fraiseLine = buildSmoothPath(dataPoints, 'fraise');
  const ceriseLine = buildSmoothPath(dataPoints, 'cerise');
  const fraiseBand = buildBandArea(dataPoints, 'fraiseMin', 'fraiseMax');
  const ceriseBand = buildBandArea(dataPoints, 'ceriseMin', 'ceriseMax');

  // Coordonnées exactes des points d'appel
  const fraiseCalloutPoint = { x: getX(40), y: getY(0.09) };
  const ceriseCalloutPoint = { x: getX(60), y: getY(0.27) };

  const handleDownloadSvg = () => {
    const svgEl = document.getElementById(`overview-svg-chart-${chartId}`);
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dynamique_populations_tis_${selectedStrategy}_b${selectedBudget}_${selectedInvasion.toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full flex flex-col justify-between">
      {/* Légende supérieure soigneusement alignée */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 px-1">
        <h3 className="text-base sm:text-lg font-serif font-semibold text-[#1B201C] tracking-tight">
          Dynamique des populations au cours du temps
        </h3>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#347A55] rounded-full inline-block" />
            <span className="text-[#1B201C] font-medium">Fraise (lâcher J+3)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 bg-[#BF532E] rounded-full inline-block" />
            <span className="text-[#1B201C] font-medium">Cerise (lâcher J+7)</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadSvg}
            title="Exporter la figure SVG"
            className="p-1 rounded text-[#657068] hover:text-[#1B201C] hover:bg-[#F0F2EB] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rendu SVG Haute Résolution */}
      <div className="relative w-full aspect-[640/290] max-h-[340px]">
        <svg
          id={`overview-svg-chart-${chartId}`}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          role="img"
          aria-label="Graphique temporel : dynamique des populations Fraise vs Cerise"
        >
          {/* Grille cartésienne discrète */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
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
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
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
                fontSize="10"
                fill="#657068"
                fontFamily="IBM Plex Sans, sans-serif"
              >
                {v.toFixed(1).replace('.', ',')}
              </text>
            </g>
          ))}

          {/* Libellé axe Y vertical */}
          <text
            x={-height / 2 + 8}
            y="14"
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize="10.5"
            fill="#1B201C"
            fontWeight="500"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Population relative
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
            fontSize="10.5"
            fill="#1B201C"
            fontWeight="500"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            Jours après intervention
          </text>

          {/* Bandes de variabilité stochastique semi-transparentes */}
          <path d={ceriseBand} fill="#BF532E" fillOpacity="0.14" />
          <path d={fraiseBand} fill="#347A55" fillOpacity="0.16" />

          {/* Courbe Cerise (lâcher J+7) */}
          <path
            d={ceriseLine}
            fill="none"
            stroke="#BF532E"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Courbe Fraise (lâcher J+3) */}
          <path
            d={fraiseLine}
            fill="none"
            stroke="#347A55"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* =============================================================
              CALLOUT 1 : FRAISE (JOUR 40)
             ============================================================= */}
          <g>
            <path
              d={`M ${fraiseCalloutPoint.x} ${fraiseCalloutPoint.y} L ${fraiseCalloutPoint.x - 22} ${fraiseCalloutPoint.y - 12} L ${fraiseCalloutPoint.x - 50} ${fraiseCalloutPoint.y - 12}`}
              fill="none"
              stroke="#347A55"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
            <circle cx={fraiseCalloutPoint.x} cy={fraiseCalloutPoint.y} r="3.5" fill="#347A55" stroke="#FFFFFF" strokeWidth="1.2" />

            <g transform={`translate(${fraiseCalloutPoint.x - 125}, ${fraiseCalloutPoint.y - 38})`}>
              <rect
                x="0"
                y="0"
                width="72"
                height="32"
                rx="5"
                fill="#F0F6F1"
                stroke="#347A55"
                strokeWidth="0.9"
                strokeOpacity="0.8"
              />
              <text x="36" y="13" textAnchor="middle" fill="#145A3D" fontSize="8.5" fontWeight="700" fontFamily="IBM Plex Sans, sans-serif">
                Réduction ≈ -91 %
              </text>
              <text x="36" y="24" textAnchor="middle" fill="#347A55" fontSize="8" fontFamily="IBM Plex Sans, sans-serif">
                (Fraise, J+3)
              </text>
            </g>
          </g>

          {/* =============================================================
              CALLOUT 2 : CERISE (JOUR 60)
             ============================================================= */}
          <g>
            <path
              d={`M ${ceriseCalloutPoint.x} ${ceriseCalloutPoint.y} L ${ceriseCalloutPoint.x + 8} ${ceriseCalloutPoint.y - 20} L ${ceriseCalloutPoint.x + 22} ${ceriseCalloutPoint.y - 20}`}
              fill="none"
              stroke="#BF532E"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
            <circle cx={ceriseCalloutPoint.x} cy={ceriseCalloutPoint.y} r="3.5" fill="#BF532E" stroke="#FFFFFF" strokeWidth="1.2" />

            <g transform={`translate(${ceriseCalloutPoint.x + 24}, ${ceriseCalloutPoint.y - 36})`}>
              <rect
                x="0"
                y="0"
                width="72"
                height="32"
                rx="5"
                fill="#FAF2EE"
                stroke="#BF532E"
                strokeWidth="0.9"
                strokeOpacity="0.8"
              />
              <text x="36" y="13" textAnchor="middle" fill="#A83D36" fontSize="8.5" fontWeight="700" fontFamily="IBM Plex Sans, sans-serif">
                Réduction ≈ -73 %
              </text>
              <text x="36" y="24" textAnchor="middle" fill="#BF532E" fontSize="8" fontFamily="IBM Plex Sans, sans-serif">
                (Cerise, J+7)
              </text>
            </g>
          </g>

          {/* Zones de survol */}
          {dataPoints.map((pt) => (
            <rect
              key={`hit-${pt.day}`}
              x={getX(pt.day) - 8}
              y={padding.top}
              width="16"
              height={plotHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Infobulle dynamique au survol */}
          {hoveredPoint && (
            <g transform={`translate(${getX(hoveredPoint.day)}, ${padding.top + 8})`}>
              <line y1="0" y2={plotHeight} stroke="#657068" strokeWidth="1" strokeDasharray="3 2" />
              <g transform="translate(-50, 0)">
                <rect width="100" height="42" rx="4" fill="#1B201C" fillOpacity="0.88" />
                <text x="50" y="12" textAnchor="middle" fill="#F8F7F2" fontSize="9" fontWeight="600" fontFamily="IBM Plex Sans">
                  Jour {hoveredPoint.day}
                </text>
                <text x="10" y="24" fill="#DDEADF" fontSize="8.5" fontFamily="IBM Plex Mono">
                  Fraise: {(hoveredPoint.fraise * 100).toFixed(0)}% (±{((hoveredPoint.fraiseMax - hoveredPoint.fraiseMin) * 50).toFixed(0)}%)
                </text>
                <text x="10" y="35" fill="#FFE0D6" fontSize="8.5" fontFamily="IBM Plex Mono">
                  Cerise: {(hoveredPoint.cerise * 100).toFixed(0)}% (±{((hoveredPoint.ceriseMax - hoveredPoint.ceriseMin) * 50).toFixed(0)}%)
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
