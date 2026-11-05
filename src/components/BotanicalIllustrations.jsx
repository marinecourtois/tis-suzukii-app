import React from 'react';

/**
 * Logo officiel Modelly TIS Research
 */
export const ModellyLogo = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Logo Modelly">
    {/* Fond feuille stylisée */}
    <path
      d="M8 36C8 36 9 20 24 9C27 7 32 7 35 9C37 11 38 16 36 19C27 31 8 36 8 36Z"
      fill="#145A3D"
    />
    {/* Nervure centrale */}
    <path
      d="M8 36C17 31 24 22 33 11"
      stroke="#DDEADF"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Nervures secondaires */}
    <path
      d="M16 28C19 26 23 26 26 27"
      stroke="#DDEADF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
    <path
      d="M22 21C25 19 29 19 31 20"
      stroke="#DDEADF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeOpacity="0.85"
    />
  </svg>
);

/**
 * Planche botanique : Fraisier (Fragaria × ananassa)
 * Correspondance exacte avec le panneau gauche de la maquette
 */
export const StrawberryBotanicalPlate = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Planche botanique Fraisier">
    {/* Tige principale arquée */}
    <path d="M40 135 C65 95, 95 65, 150 48" stroke="#347A55" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M75 135 C95 90, 130 70, 185 80" stroke="#347A55" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M110 115 C135 105, 175 100, 220 95" stroke="#4A7C59" strokeWidth="1.5" strokeLinecap="round" />

    {/* Feuilles trifoliées dentées à gauche */}
    <g transform="translate(42, 28)">
      {/* Foliole gauche */}
      <path
        d="M25 45 C10 40, 2 24, 10 12 C20 14, 28 26, 25 45 Z"
        fill="#DDEADF"
        stroke="#145A3D"
        strokeWidth="1.2"
      />
      <path d="M25 45 L11 16 M21 34 L12 28" stroke="#347A55" strokeWidth="0.8" />

      {/* Foliole centrale */}
      <path
        d="M25 45 C20 22, 30 5, 45 6 C52 18, 42 36, 25 45 Z"
        fill="#C9DFC9"
        stroke="#145A3D"
        strokeWidth="1.2"
      />
      <path d="M25 45 L42 10 M31 28 L43 20" stroke="#347A55" strokeWidth="0.8" />

      {/* Foliole droite */}
      <path
        d="M25 45 C38 32, 54 34, 58 48 C45 54, 34 50, 25 45 Z"
        fill="#DDEADF"
        stroke="#145A3D"
        strokeWidth="1.2"
      />
      <path d="M25 45 L54 44 M38 41 L50 36" stroke="#347A55" strokeWidth="0.8" />
    </g>

    {/* Fleur blanche de fraisier (5 pétales à cœur doré) */}
    <g transform="translate(142, 40)">
      <circle cx="0" cy="-9" r="6" fill="#FFFFFF" stroke="#347A55" strokeWidth="0.9" />
      <circle cx="8.5" cy="-2.5" r="6" fill="#FFFFFF" stroke="#347A55" strokeWidth="0.9" />
      <circle cx="5.5" cy="7.5" r="6" fill="#FFFFFF" stroke="#347A55" strokeWidth="0.9" />
      <circle cx="-5.5" cy="7.5" r="6" fill="#FFFFFF" stroke="#347A55" strokeWidth="0.9" />
      <circle cx="-8.5" cy="-2.5" r="6" fill="#FFFFFF" stroke="#347A55" strokeWidth="0.9" />
      {/* Cœur floral doré avec étamines */}
      <circle cx="0" cy="0" r="4.2" fill="#E6A838" stroke="#BF532E" strokeWidth="0.8" />
      <circle cx="-1.5" cy="-1" r="0.8" fill="#F8F7F2" />
    </g>

    {/* Petite fraise verte immature */}
    <g transform="translate(195, 76)">
      <path d="M0 0 C-6 -2, -10 4, -8 12 C-5 18, -1 20, 0 20 C1 20, 5 18, 8 12 C10 4, 6 -2, 0 0 Z" fill="#D5E8D4" stroke="#347A55" strokeWidth="1" />
      <circle cx="-2" cy="7" r="0.8" fill="#145A3D" />
      <circle cx="2" cy="9" r="0.8" fill="#145A3D" />
      <circle cx="0" cy="14" r="0.8" fill="#145A3D" />
    </g>

    {/* Grosse fraise rouge mûre principale avec calice et akènes */}
    <g transform="translate(155, 68)">
      {/* Calice vert denté */}
      <path d="M0 0 C-8 -6, -15 -2, -10 5 C-5 5, -2 3, 0 0 Z" fill="#347A55" stroke="#145A3D" strokeWidth="0.9" />
      <path d="M0 0 C8 -6, 15 -2, 10 5 C5 5, 2 3, 0 0 Z" fill="#347A55" stroke="#145A3D" strokeWidth="0.9" />
      <path d="M0 0 C-2 -7, 2 -7, 0 0 Z" fill="#145A3D" />

      {/* Chair rouge fraise */}
      <path
        d="M0 2 C-15 2, -20 14, -14 28 C-9 38, -3 44, 0 44 C3 44, 9 38, 14 28 C20 14, 15 2, 0 2 Z"
        fill="#A83D36"
        stroke="#1B201C"
        strokeWidth="1.2"
      />
      {/* Dégradé de reflet rouge vif */}
      <path
        d="M-4 6 C-11 8, -14 16, -10 26 C-7 33, -2 38, 0 38 C-2 32, -4 24, -4 16 Z"
        fill="#C94A42"
        fillOpacity="0.75"
      />

      {/* Akènes (graines) jaunes dorées */}
      <circle cx="-6" cy="12" r="1.1" fill="#FFE599" />
      <circle cx="0" cy="10" r="1.1" fill="#FFE599" />
      <circle cx="6" cy="12" r="1.1" fill="#FFE599" />
      <circle cx="-9" cy="20" r="1.1" fill="#FFE599" />
      <circle cx="-2" cy="19" r="1.1" fill="#FFE599" />
      <circle cx="4" cy="19" r="1.1" fill="#FFE599" />
      <circle cx="9" cy="21" r="1.1" fill="#FFE599" />
      <circle cx="-6" cy="28" r="1.1" fill="#FFE599" />
      <circle cx="1" cy="27" r="1.1" fill="#FFE599" />
      <circle cx="6" cy="28" r="1.1" fill="#FFE599" />
      <circle cx="-2" cy="35" r="1.1" fill="#FFE599" />
      <circle cx="3" cy="35" r="1.1" fill="#FFE599" />
    </g>

    {/* Deuxième fraise mûre à droite */}
    <g transform="translate(205, 96)">
      {/* Calice vert */}
      <path d="M0 0 C-6 -5, -12 -1, -8 4 C-3 4, -1 2, 0 0 Z" fill="#347A55" stroke="#145A3D" strokeWidth="0.8" />
      <path d="M0 0 C6 -5, 12 -1, 8 4 C3 4, 1 2, 0 0 Z" fill="#347A55" stroke="#145A3D" strokeWidth="0.8" />
      {/* Corps */}
      <path
        d="M0 2 C-11 2, -15 11, -10 22 C-6 30, -2 35, 0 35 C2 35, 6 30, 10 22 C15 11, 11 2, 0 2 Z"
        fill="#A83D36"
        stroke="#1B201C"
        strokeWidth="1.1"
      />
      <circle cx="-4" cy="10" r="0.9" fill="#FFE599" />
      <circle cx="2" cy="9" r="0.9" fill="#FFE599" />
      <circle cx="-5" cy="17" r="0.9" fill="#FFE599" />
      <circle cx="1" cy="16" r="0.9" fill="#FFE599" />
      <circle cx="5" cy="18" r="0.9" fill="#FFE599" />
      <circle cx="-2" cy="24" r="0.9" fill="#FFE599" />
      <circle cx="2" cy="25" r="0.9" fill="#FFE599" />
    </g>
  </svg>
);

/**
 * Planche botanique : Cerisier (Prunus avium)
 * Correspondance exacte avec le panneau droit de la maquette
 */
export const CherryBotanicalPlate = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Planche botanique Cerisier">
    {/* Rameau ligneux texturé brun-gris */}
    <path d="M20 38 C75 32, 140 36, 260 28" stroke="#4A5550" strokeWidth="3" strokeLinecap="round" />
    <circle cx="75" cy="34" r="2.2" fill="#2E3832" />
    <circle cx="155" cy="34" r="2.2" fill="#2E3832" />

    {/* Feuilles de cerisier lancéolées et dentées */}
    <g transform="translate(75, 34)">
      <path
        d="M0 0 C-22 12, -45 32, -36 54 C-16 50, -2 30, 0 0 Z"
        fill="#DDEADF"
        stroke="#145A3D"
        strokeWidth="1.2"
      />
      <path d="M0 0 L-32 48 M-12 16 L-24 18 M-20 28 L-30 30" stroke="#347A55" strokeWidth="0.8" />
    </g>

    <g transform="translate(155, 34)">
      <path
        d="M0 0 C26 6, 54 20, 64 44 C40 48, 16 30, 0 0 Z"
        fill="#C9DFC9"
        stroke="#145A3D"
        strokeWidth="1.2"
      />
      <path d="M0 0 L58 40 M20 12 L34 10 M36 24 L50 22" stroke="#347A55" strokeWidth="0.8" />
    </g>

    {/* Pédoncules jumeaux fins et souples */}
    <path d="M120 35 C112 55, 102 70, 96 82" stroke="#347A55" strokeWidth="1.5" />
    <path d="M120 35 C128 55, 138 70, 145 82" stroke="#347A55" strokeWidth="1.5" />
    <circle cx="120" cy="35" r="2" fill="#347A55" />

    {/* Cerise 1 (gauche) */}
    <g transform="translate(94, 95)">
      <circle cx="0" cy="0" r="14.5" fill="#A83D36" stroke="#1B201C" strokeWidth="1.2" />
      {/* Reflet brillant galbé */}
      <path d="M-6 -7 C-4 -10, 1 -10, 3 -8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.8" />
      <circle cx="5" cy="-4" r="1.2" fill="#FFFFFF" fillOpacity="0.6" />
    </g>

    {/* Cerise 2 (centre) */}
    <g transform="translate(148, 95)">
      <circle cx="0" cy="0" r="14.5" fill="#A83D36" stroke="#1B201C" strokeWidth="1.2" />
      <path d="M-6 -7 C-4 -10, 1 -10, 3 -8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.8" />
      <circle cx="5" cy="-4" r="1.2" fill="#FFFFFF" fillOpacity="0.6" />
    </g>

    {/* Troisième pédoncule et cerise (droite) */}
    <path d="M175 34 C182 56, 192 68, 198 78" stroke="#347A55" strokeWidth="1.4" />
    <circle cx="175" cy="34" r="1.8" fill="#347A55" />
    <g transform="translate(202, 90)">
      <circle cx="0" cy="0" r="13" fill="#BF532E" stroke="#1B201C" strokeWidth="1.1" />
      <path d="M-5 -6 C-3 -9, 2 -9, 4 -7" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8" />
    </g>
  </svg>
);

/**
 * Schéma Scientifique : Principe de la TIS (Panneau central de la maquette)
 * Mâle stérile (lâché) + Femelle sauvage (terrain) -> Pas de descendance
 */
export const TisMechanismDiagram = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 340 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Principe de la Technique de l'Insecte Stérile">
    {/* 1. MÂLE STÉRILE (LÂCHÉ) */}
    <g transform="translate(52, 60)">
      {/* Halo subtil de stérilisation */}
      <circle cx="0" cy="0" r="24" fill="#DDEADF" fillOpacity="0.4" stroke="#347A55" strokeWidth="0.8" strokeDasharray="2.5 2" />

      {/* Corps Drosophila suzukii mâle */}
      <ellipse cx="-10" cy="-6" rx="12" ry="5.5" transform="rotate(-25 -10 -6)" fill="#F8F7F2" stroke="#4A5550" strokeWidth="0.9" />
      <ellipse cx="10" cy="-6" rx="12" ry="5.5" transform="rotate(25 10 -6)" fill="#F8F7F2" stroke="#4A5550" strokeWidth="0.9" />
      {/* Taches noires alaires caractéristiques du mâle D. suzukii */}
      <circle cx="-17" cy="-9" r="2.4" fill="#1B201C" />
      <circle cx="17" cy="-9" r="2.4" fill="#1B201C" />

      {/* Thorax & abdomen rayé */}
      <ellipse cx="0" cy="2" rx="4.5" ry="9" fill="#8C6D46" stroke="#1B201C" strokeWidth="0.9" />
      <line x1="-3.5" y1="2" x2="3.5" y2="2" stroke="#1B201C" strokeWidth="0.7" />
      <line x1="-3" y1="5" x2="3" y2="5" stroke="#1B201C" strokeWidth="0.7" />
      <line x1="-2.2" y1="8" x2="2.2" y2="8" stroke="#1B201C" strokeWidth="0.7" />
      {/* Tête & yeux rouges caractéristiques */}
      <circle cx="0" cy="-8" r="3.2" fill="#8C6D46" stroke="#1B201C" strokeWidth="0.8" />
      <circle cx="-2.6" cy="-8" r="1.4" fill="#A83D36" />
      <circle cx="2.6" cy="-8" r="1.4" fill="#A83D36" />

      {/* Libellé */}
      <text x="0" y="38" textAnchor="middle" fill="#1B201C" fontSize="10" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
        Mâle stérile
      </text>
      <text x="0" y="49" textAnchor="middle" fill="#657068" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
        (lâché)
      </text>
    </g>

    {/* SYMBOLE + */}
    <g transform="translate(108, 60)">
      <circle cx="0" cy="0" r="9" fill="#F0F2EB" stroke="#D6DDD4" strokeWidth="0.8" />
      <line x1="-4" y1="0" x2="4" y2="0" stroke="#145A3D" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#145A3D" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    {/* 2. FEMELLE SAUVAGE (TERRAIN) */}
    <g transform="translate(164, 60)">
      {/* Ailes sans tache noire */}
      <ellipse cx="-10" cy="-6" rx="12" ry="5.5" transform="rotate(-25 -10 -6)" fill="#F8F7F2" stroke="#4A5550" strokeWidth="0.9" />
      <ellipse cx="10" cy="-6" rx="12" ry="5.5" transform="rotate(25 10 -6)" fill="#F8F7F2" stroke="#4A5550" strokeWidth="0.9" />

      {/* Thorax & abdomen plus gros de femelle */}
      <ellipse cx="0" cy="3" rx="5.2" ry="10" fill="#BF8A49" stroke="#1B201C" strokeWidth="0.9" />
      <line x1="-4.5" y1="2" x2="4.5" y2="2" stroke="#1B201C" strokeWidth="0.7" />
      <line x1="-4" y1="5" x2="4" y2="5" stroke="#1B201C" strokeWidth="0.7" />
      <line x1="-3" y1="8" x2="3" y2="8" stroke="#1B201C" strokeWidth="0.7" />
      {/* Ovipositeur denticulé caractéristique */}
      <path d="M-1.8 12.5 L0 16.5 L1.8 12.5" fill="#1B201C" />

      {/* Tête */}
      <circle cx="0" cy="-8" r="3.2" fill="#BF8A49" stroke="#1B201C" strokeWidth="0.8" />
      <circle cx="-2.6" cy="-8" r="1.4" fill="#A83D36" />
      <circle cx="2.6" cy="-8" r="1.4" fill="#A83D36" />

      {/* Libellé */}
      <text x="0" y="38" textAnchor="middle" fill="#1B201C" fontSize="10" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
        Femelle sauvage
      </text>
      <text x="0" y="49" textAnchor="middle" fill="#657068" fontSize="9" fontFamily="IBM Plex Sans, sans-serif">
        (terrain)
      </text>
    </g>

    {/* FLÈCHE DE DIRECTION → */}
    <g transform="translate(225, 60)">
      <line x1="-12" y1="0" x2="14" y2="0" stroke="#145A3D" strokeWidth="1.6" />
      <polygon points="14,0 7,-3.5 7,3.5" fill="#145A3D" />
    </g>

    {/* 3. PAS DE DESCENDANCE (Cercle barré orange) */}
    <g transform="translate(285, 60)">
      {/* Cercle d'interdiction / absence de descendance */}
      <circle cx="0" cy="0" r="18" fill="#FBF4F1" stroke="#BF532E" strokeWidth="1.8" />
      <line x1="-12" y1="-12" x2="12" y2="12" stroke="#BF532E" strokeWidth="1.8" strokeLinecap="round" />

      {/* Oeufs stériles schématisés à l'intérieur */}
      <ellipse cx="-4" cy="5" rx="3" ry="5" transform="rotate(-15 -4 5)" fill="#D6DDD4" fillOpacity="0.7" />
      <ellipse cx="5" cy="-4" rx="3" ry="5" transform="rotate(20 5 -4)" fill="#D6DDD4" fillOpacity="0.7" />

      {/* Libellé */}
      <text x="0" y="38" textAnchor="middle" fill="#BF532E" fontSize="10" fontWeight="700" fontFamily="IBM Plex Sans, sans-serif">
        Pas de
      </text>
      <text x="0" y="49" textAnchor="middle" fill="#BF532E" fontSize="9.5" fontWeight="600" fontFamily="IBM Plex Sans, sans-serif">
        descendance
      </text>
    </g>
  </svg>
);

/**
 * Illustration bucolique d'arrière-plan pastoral pour le bas de la barre latérale
 * Évoque des collines de cultures en rangs avec feuillage discret au premier plan
 */
export const PastoralLandscape = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {/* Ciel ivoire brumeux */}
    <rect width="240" height="130" fill="#E8ECE3" />

    {/* Collines lointaines estompées */}
    <path
      d="M0 72 C45 62, 95 68, 145 60 C185 54, 215 58, 240 54 L240 130 L0 130 Z"
      fill="#D2DDD0"
      fillOpacity="0.8"
    />
    <path
      d="M0 84 C60 76, 120 82, 175 74 C205 70, 225 72, 240 70 L240 130 L0 130 Z"
      fill="#BDD0BB"
      fillOpacity="0.7"
    />

    {/* Rangs de cultures ordonnés en perspective */}
    <path d="M120 74 L20 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M125 74 L55 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M130 74 L90 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M135 74 L125 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M140 74 L160 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M145 74 L195 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />
    <path d="M150 74 L230 130" stroke="#9EBA9A" strokeWidth="1.2" strokeDasharray="3 2" />

    {/* Colline au premier plan */}
    <path
      d="M0 96 C70 92, 150 98, 240 92 L240 130 L0 130 Z"
      fill="#A8C4A5"
      fillOpacity="0.65"
    />

    {/* Rameau de feuilles botaniques au premier plan gauche et droite */}
    <g transform="translate(185, 55)">
      <path d="M35 75 C25 50, 15 35, 0 10" stroke="#347A55" strokeWidth="2.4" strokeLinecap="round" />
      {/* Feuilles */}
      <path d="M0 10 C-10 12, -18 20, -14 28 C-6 26, -2 18, 0 10 Z" fill="#347A55" fillOpacity="0.85" />
      <path d="M7 26 C-2 30, -8 40, -4 48 C4 46, 8 36, 7 26 Z" fill="#4A7C59" fillOpacity="0.8" />
      <path d="M18 45 C10 50, 6 60, 12 68 C18 64, 20 54, 18 45 Z" fill="#347A55" fillOpacity="0.85" />
    </g>

    <g transform="translate(5, 75)">
      <path d="M-10 55 C10 40, 20 28, 32 15" stroke="#347A55" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 15 C36 24, 34 32, 26 34 C22 28, 26 20, 32 15 Z" fill="#347A55" fillOpacity="0.75" />
      <path d="M18 28 C20 38, 16 45, 8 46 C6 39, 11 33, 18 28 Z" fill="#4A7C59" fillOpacity="0.7" />
    </g>
  </svg>
);
