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
/**
 * Planche botanique : Fraisier (Fragaria × ananassa)
 * Rendu haute précision style atlas botanique scientifique
 */
export const StrawberryBotanicalPlate = ({ className = 'w-full h-28' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Planche botanique Fraisier">
    <defs>
      <linearGradient id="strawGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D93829" />
        <stop offset="40%" stopColor="#B32417" />
        <stop offset="100%" stopColor="#7A120B" />
      </linearGradient>
      <linearGradient id="strawGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E24B3C" />
        <stop offset="60%" stopColor="#C0261A" />
        <stop offset="100%" stopColor="#8A150D" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6DAF62" />
        <stop offset="60%" stopColor="#4A8C40" />
        <stop offset="100%" stopColor="#2E6327" />
      </linearGradient>
    </defs>

    {/* Feuilles du fraisier (dentées, vertes avec nervures) */}
    {/* Foliole gauche */}
    <path
      d="M48 68 C30 52 14 58 10 74 C8 88 22 96 46 82 Z"
      fill="url(#leafGrad)"
      stroke="#1B4716"
      strokeWidth="0.9"
    />
    <path d="M46 80 C32 74 20 74 12 76" stroke="#8ED483" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M30 76 L25 70 M36 78 L34 72 M22 75 L18 80" stroke="#8ED483" strokeWidth="0.6" strokeLinecap="round" />

    {/* Foliole supérieure */}
    <path
      d="M48 68 C38 42 46 22 62 20 C76 18 86 36 68 64 Z"
      fill="#529946"
      stroke="#1B4716"
      strokeWidth="0.9"
    />
    <path d="M52 64 C56 46 58 34 62 22" stroke="#8ED483" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M56 48 L48 42 M58 38 L68 34 M54 54 L64 50" stroke="#8ED483" strokeWidth="0.6" strokeLinecap="round" />

    {/* Foliole droite */}
    <path
      d="M58 64 C76 48 98 54 102 68 C104 80 92 90 68 76 Z"
      fill="#438538"
      stroke="#1B4716"
      strokeWidth="0.9"
    />
    <path d="M64 72 C78 68 88 66 98 68" stroke="#8ED483" strokeWidth="0.8" strokeLinecap="round" />

    {/* Tiges fines courbées */}
    <path d="M50 75 Q40 95 30 115" stroke="#4A8C40" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M58 72 Q85 85 95 105" stroke="#4A8C40" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M55 58 Q50 35 44 26" stroke="#4A8C40" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M60 55 Q95 40 120 45" stroke="#4A8C40" strokeWidth="1.3" strokeLinecap="round" />

    {/* Fleur de fraisier (blanche à cœur jaune staminifère) */}
    <g transform="translate(42, 22)">
      {/* 5 pétales arrondis blancs à doux contours */}
      <circle cx="-1" cy="-7" r="5" fill="#FFFFFF" stroke="#D0DEC9" strokeWidth="0.6" />
      <circle cx="6" cy="-2" r="5" fill="#FFFFFF" stroke="#D0DEC9" strokeWidth="0.6" />
      <circle cx="4" cy="6" r="5" fill="#FFFFFF" stroke="#D0DEC9" strokeWidth="0.6" />
      <circle cx="-4" cy="5" r="5" fill="#FFFFFF" stroke="#D0DEC9" strokeWidth="0.6" />
      <circle cx="-7" cy="-1" r="5" fill="#FFFFFF" stroke="#D0DEC9" strokeWidth="0.6" />
      {/* Cœur jaune doré avec étamines */}
      <circle cx="0" cy="0" r="3.6" fill="#F4B41A" stroke="#C48408" strokeWidth="0.7" />
      <circle cx="-1" cy="-1" r="0.8" fill="#FDEEAA" />
      <circle cx="1" cy="1" r="0.6" fill="#FDEEAA" />
    </g>

    {/* Petite fraise verte immature (en haut à droite) */}
    <g transform="translate(122, 47)">
      {/* Calice vert */}
      <path d="M-4 -3 L0 0 L4 -3 L2 2 L0 0 L-2 2 Z" fill="#4A8C40" stroke="#2E6327" strokeWidth="0.6" />
      {/* Baie conique verte */}
      <path d="M0 0 C-4 1 -6 6 -4 10 C-2 13 0 15 2 13 C4 11 4 4 0 0 Z" fill="#9CD488" stroke="#3D7D34" strokeWidth="0.8" />
      <circle cx="-1" cy="5" r="0.5" fill="#2E6327" />
      <circle cx="1" cy="7" r="0.5" fill="#2E6327" />
      <circle cx="0" cy="10" r="0.5" fill="#2E6327" />
    </g>

    {/* Deuxième fraise mûre (moyenne, à droite) */}
    <g transform="translate(112, 85)">
      {/* Calice vert denté */}
      <path d="M-6 -2 C-4 -6 0 -4 0 0 C0 -4 4 -6 6 -2 C4 2 0 1 0 0 C0 1 -4 2 -6 -2 Z" fill="#3D7D34" stroke="#1B4716" strokeWidth="0.7" />
      {/* Corps rouge conique */}
      <path
        d="M0 1 C-9 2 -12 10 -9 18 C-6 24 0 28 4 24 C8 18 8 6 0 1 Z"
        fill="url(#strawGrad1)"
        stroke="#590A05"
        strokeWidth="0.9"
      />
      {/* Graines dorées */}
      <circle cx="-4" cy="7" r="0.7" fill="#FDEEAA" />
      <circle cx="1" cy="6" r="0.7" fill="#FDEEAA" />
      <circle cx="-5" cy="13" r="0.7" fill="#FDEEAA" />
      <circle cx="0" cy="12" r="0.7" fill="#FDEEAA" />
      <circle cx="-2" cy="18" r="0.7" fill="#FDEEAA" />
      <circle cx="2" cy="16" r="0.7" fill="#FDEEAA" />
    </g>

    {/* Grosse fraise mûre principale (centrale gauche) */}
    <g transform="translate(72, 82)">
      {/* Calice denté luxuriant */}
      <path d="M-8 -3 C-10 -8 -4 -6 -2 0 C-1 -6 6 -8 8 -3 C5 3 0 1 0 0 C0 2 -5 3 -8 -3 Z" fill="#4A8C40" stroke="#1B4716" strokeWidth="0.8" />
      <path d="M-4 -6 L0 0 L4 -6" stroke="#2E6327" strokeWidth="0.8" />
      {/* Chair rouge brillante */}
      <path
        d="M0 2 C-14 3 -18 14 -12 26 C-7 35 0 40 4 37 C10 32 14 14 0 2 Z"
        fill="url(#strawGrad2)"
        stroke="#590A05"
        strokeWidth="1.1"
      />
      {/* Reflet courbe de brillance */}
      <path
        d="M-8 8 C-13 15 -11 25 -7 30 C-9 24 -10 16 -6 10 Z"
        fill="#FFFFFF"
        fillOpacity="0.32"
      />
      {/* Akènes (graines) jaunes dorées avec petit creux */}
      <circle cx="-7" cy="10" r="0.8" fill="#FDEEAA" />
      <circle cx="-1" cy="8" r="0.8" fill="#FDEEAA" />
      <circle cx="5" cy="10" r="0.8" fill="#FDEEAA" />
      <circle cx="-9" cy="17" r="0.8" fill="#FDEEAA" />
      <circle cx="-3" cy="15" r="0.8" fill="#FDEEAA" />
      <circle cx="3" cy="16" r="0.8" fill="#FDEEAA" />
      <circle cx="-8" cy="24" r="0.8" fill="#FDEEAA" />
      <circle cx="-2" cy="22" r="0.8" fill="#FDEEAA" />
      <circle cx="4" cy="23" r="0.8" fill="#FDEEAA" />
      <circle cx="-5" cy="30" r="0.8" fill="#FDEEAA" />
      <circle cx="0" cy="29" r="0.8" fill="#FDEEAA" />
    </g>
  </svg>
);

/**
 * Planche botanique : Cerisier (Prunus avium)
 * Rendu haute précision style atlas botanique scientifique
 */
export const CherryBotanicalPlate = ({ className = 'w-full h-28' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Planche botanique Cerisier">
    <defs>
      <radialGradient id="cherryG1" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#E23E32" />
        <stop offset="45%" stopColor="#A81D17" />
        <stop offset="85%" stopColor="#6E0E0A" />
        <stop offset="100%" stopColor="#400604" />
      </radialGradient>
      <radialGradient id="cherryG2" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#D93428" />
        <stop offset="50%" stopColor="#9E1812" />
        <stop offset="85%" stopColor="#610A07" />
        <stop offset="100%" stopColor="#3B0503" />
      </radialGradient>
    </defs>

    {/* Rameau ligneux brun texturé */}
    <path d="M8 24 C55 20 105 22 152 18" stroke="#5C4535" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M12 25 C55 21 105 23 148 19" stroke="#7A604D" strokeWidth="1.2" strokeLinecap="round" />
    {/* Nœuds du rameau */}
    <circle cx="48" cy="22" r="2.2" fill="#3D2D22" />
    <circle cx="98" cy="21" r="2.2" fill="#3D2D22" />

    {/* Feuilles de cerisier dentées élégantes */}
    {/* Feuille gauche arquée vers le bas */}
    <g transform="translate(48, 22)">
      <path
        d="M0 0 C-18 10 -36 30 -32 55 C-24 68 -8 52 0 0 Z"
        fill="#55994A"
        stroke="#275E1F"
        strokeWidth="1"
      />
      <path d="M0 0 C-16 25 -24 45 -28 54" stroke="#8ED483" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M-8 14 L-18 18 M-14 26 L-24 30 M-18 38 L-26 42" stroke="#8ED483" strokeWidth="0.6" strokeLinecap="round" />
    </g>

    {/* Feuille droite déployée */}
    <g transform="translate(98, 21)">
      <path
        d="M0 0 C18 6 42 18 50 40 C34 46 16 32 0 0 Z"
        fill="#4A8C40"
        stroke="#275E1F"
        strokeWidth="1"
      />
      <path d="M0 0 C22 18 36 28 46 38" stroke="#8ED483" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M12 10 L24 8 M20 20 L32 18 M28 28 L38 26" stroke="#8ED483" strokeWidth="0.6" strokeLinecap="round" />
    </g>

    {/* Pédoncules graciles verts pour les cerises */}
    <path d="M78 22 C72 45 62 65 52 82" stroke="#4A8C40" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M78 22 C82 45 88 64 92 82" stroke="#4A8C40" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M78 22 C80 40 108 55 120 78" stroke="#4A8C40" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M78 22 C68 40 40 55 32 75" stroke="#4A8C40" strokeWidth="1.4" strokeLinecap="round" />
    {/* Point d'attache commun au rameau */}
    <circle cx="78" cy="22" r="2.4" fill="#3D7D34" />

    {/* Grappe de 4 cerises charnues et luisantes */}
    {/* Cerise 1 (fond gauche) */}
    <g transform="translate(32, 84)">
      <circle cx="0" cy="0" r="11.5" fill="url(#cherryG2)" stroke="#260402" strokeWidth="0.9" />
      {/* Reflet brillant galbé */}
      <path d="M-4 -5 C-3 -8 1 -8 3 -6" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <circle cx="4" cy="-3" r="1" fill="#FFFFFF" fillOpacity="0.7" />
    </g>

    {/* Cerise 2 (fond droite) */}
    <g transform="translate(122, 86)">
      <circle cx="0" cy="0" r="11" fill="url(#cherryG2)" stroke="#260402" strokeWidth="0.9" />
      <path d="M-4 -5 C-3 -8 1 -8 3 -6" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.85" />
      <circle cx="4" cy="-3" r="0.9" fill="#FFFFFF" fillOpacity="0.7" />
    </g>

    {/* Cerise 3 (avant-plan gauche) */}
    <g transform="translate(56, 94)">
      <circle cx="0" cy="0" r="13.5" fill="url(#cherryG1)" stroke="#260402" strokeWidth="1.1" />
      {/* Reflet de brillance principal */}
      <path d="M-5 -6 C-4 -10 2 -10 5 -7" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
      <circle cx="5" cy="-4" r="1.3" fill="#FFFFFF" fillOpacity="0.75" />
    </g>

    {/* Cerise 4 (avant-plan droite) */}
    <g transform="translate(94, 94)">
      <circle cx="0" cy="0" r="13.5" fill="url(#cherryG1)" stroke="#260402" strokeWidth="1.1" />
      {/* Reflet de brillance */}
      <path d="M-5 -6 C-4 -10 2 -10 5 -7" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
      <circle cx="5" cy="-4" r="1.3" fill="#FFFFFF" fillOpacity="0.75" />
    </g>
  </svg>
);

/**
 * Schéma Scientifique : Principe de la TIS (Panneau central de la maquette)
 * Mâle stérile (lâché) + Femelle sauvage (terrain) -> Pas de descendance
 */
export const TisMechanismDiagram = ({ className = 'w-full h-28' }) => (
  <svg viewBox="15 20 310 95" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="Principe de la Technique de l'Insecte Stérile">
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

/**
 * Icône Larve / Chenille pour la carte Dommages Larvaires
 */
export const LarvaIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M5 18C4 16.5 4.5 14 6 12.5C7.5 11 9 12 10.5 10.5C12 9 11.5 7.5 13.5 6C15.5 4.5 17.5 5 19 6.5C20.5 8 20 10 18.5 12C17 14 15 13.5 13.5 15C12 16.5 12.5 18 10.5 19.5C8.5 21 6 19.5 5 18Z"
      fill="#DDEADF"
      stroke="#145A3D"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Segments corporels */}
    <path d="M8 12.5C8.5 14 9.5 15.5 11 16" stroke="#145A3D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 9.5C11.5 11 12.5 12.5 14 13" stroke="#145A3D" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 6.5C14.5 8 15.5 9.5 17 10" stroke="#145A3D" strokeWidth="1.2" strokeLinecap="round" />
    {/* Œil tête */}
    <circle cx="17.5" cy="7.5" r="0.9" fill="#145A3D" />
  </svg>
);

/**
 * Icône Mouche / Piqûres Stériles
 */
export const SterileFlyIcon = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Aile gauche */}
    <ellipse cx="7.5" cy="9.5" rx="5.5" ry="2.8" transform="rotate(-30 7.5 9.5)" fill="#DDEADF" stroke="#145A3D" strokeWidth="1.2" />
    <line x1="4.5" y1="10.5" x2="10" y2="8.5" stroke="#145A3D" strokeWidth="0.8" />
    {/* Aile droite */}
    <ellipse cx="16.5" cy="9.5" rx="5.5" ry="2.8" transform="rotate(30 16.5 9.5)" fill="#DDEADF" stroke="#145A3D" strokeWidth="1.2" />
    <line x1="19.5" y1="10.5" x2="14" y2="8.5" stroke="#145A3D" strokeWidth="0.8" />
    {/* Corps central & tête */}
    <ellipse cx="12" cy="14" rx="2.5" ry="5.5" fill="#C9DFC9" stroke="#145A3D" strokeWidth="1.3" />
    <circle cx="12" cy="7.5" r="2.2" fill="#145A3D" />
    <circle cx="10.6" cy="7.2" r="0.7" fill="#A83D36" />
    <circle cx="13.4" cy="7.2" r="0.7" fill="#A83D36" />
    {/* Pattes */}
    <path d="M10 13L7 16M14 13L17 16" stroke="#145A3D" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/**
 * Mini icône Fraise pour le sélecteur de culture
 */
export const StrawberryMiniIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M10 18C10 18 4 14 4 8.5C4 5.5 6 4 9 4C9.5 4 10 4.5 10 4.5C10 4.5 10.5 4 11 4C14 4 16 5.5 16 8.5C16 14 10 18 10 18Z"
      fill="#BF532E"
      stroke="#A83D36"
      strokeWidth="1.2"
    />
    {/* Graines */}
    <circle cx="8" cy="8" r="0.6" fill="#FFE599" />
    <circle cx="12" cy="8" r="0.6" fill="#FFE599" />
    <circle cx="10" cy="11" r="0.6" fill="#FFE599" />
    <circle cx="7.5" cy="13" r="0.6" fill="#FFE599" />
    <circle cx="12.5" cy="13" r="0.6" fill="#FFE599" />
    <circle cx="10" cy="15" r="0.6" fill="#FFE599" />
    {/* Calice vert */}
    <path d="M7 4C8 5.5 10 5 10 5C10 5 12 5.5 13 4C13 4 11.5 3 10 3C8.5 3 7 4 7 4Z" fill="#347A55" />
    <path d="M10 3V1.5" stroke="#347A55" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/**
 * Mini icône Cerise pour le sélecteur
 */
export const CherryMiniIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <circle cx="7" cy="14" r="4.5" fill="#A83D36" stroke="#8C2C26" strokeWidth="1" />
    <circle cx="14" cy="13" r="4" fill="#BF532E" stroke="#8C2C26" strokeWidth="1" />
    <path d="M7 10C8 6 10 3 12 2" stroke="#347A55" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 9C13 6 12 3 12 2" stroke="#347A55" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="5.5" cy="12.5" r="1" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

/**
 * Mini icône Pression d'invasion (3 barres croissantes)
 */
export const InvasionBarsIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <rect x="2" y="10" width="3" height="4" rx="0.8" fill="#657068" />
    <rect x="6.5" y="6.5" width="3" height="7.5" rx="0.8" fill="#657068" />
    <rect x="11" y="3" width="3" height="11" rx="0.8" fill="#657068" />
  </svg>
);

/**
 * Mini icône Pièces de monnaie empilées (Coins stack)
 */
export const CoinsStackIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Pièce haute */}
    <ellipse cx="9" cy="5" rx="6" ry="2.5" fill="#FFFFFF" stroke="#657068" strokeWidth="1.2" />
    {/* Pièce milieu */}
    <path d="M3 5V8.5C3 9.9 5.7 11 9 11C12.3 11 15 9.9 15 8.5V5" stroke="#657068" strokeWidth="1.2" />
    {/* Pièce bas */}
    <path d="M3 9V12.5C3 13.9 5.7 15 9 15C12.3 15 15 13.9 15 12.5V9" stroke="#657068" strokeWidth="1.2" />
  </svg>
);

/**
 * Petite pousse / germe pour la carte latérale
 */
export const SproutMiniIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M10 17V10" stroke="#145A3D" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 10C8 6 4 6 3 9C5 12 8 11 10 10Z" fill="#347A55" stroke="#145A3D" strokeWidth="1.2" />
    <path d="M10 10C12 6 16 6 17 9C15 12 12 11 10 10Z" fill="#DDEADF" stroke="#145A3D" strokeWidth="1.2" />
    <line x1="6" y1="17" x2="14" y2="17" stroke="#145A3D" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
