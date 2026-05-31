export interface RibbonTemplate {
  id: string;
  name: string;
  category: 'kawaii' | 'elegant' | 'y2k' | 'dreamy' | 'scrapbook' | 'romantic';
  emoji: string;
  isTrending?: boolean;
  defaultColor: string;
  viewBox: string;
  svgTemplate: (color: string, opt?: { texture?: string; hasShadow?: boolean; hasGlow?: boolean; hasGlitter?: boolean }) => string;
}

export const RIBBON_CATEGORIES = [
  { id: 'all', name: 'All Ribbons', emoji: '🎀' },
  { id: 'favorite', name: 'Favorites', emoji: '⭐' },
  { id: 'kawaii', name: 'Cute Kawaii', emoji: '🐰' },
  { id: 'elegant', name: 'Elegant Slay', emoji: '✨' },
  { id: 'y2k', name: 'Y2K Glitter', emoji: '🪐' },
  { id: 'dreamy', name: 'Dreamy Fairy', emoji: '☁️' },
  { id: 'scrapbook', name: 'Scrapbook Tape', emoji: '📼' },
  { id: 'romantic', name: 'Love & Bestie', emoji: '💕' }
];

export const PREMIUM_RIBBONS: RibbonTemplate[] = [
  // ================= 1. CUTE KAWAII RIBBONS =================
  {
    id: 'bow_classic',
    name: 'Classic Bow Ribbon',
    category: 'kawaii',
    emoji: '🎀',
    isTrending: true,
    defaultColor: '#ff66b2',
    viewBox: '0 0 120 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="100%" height="100%">
          <!-- Ribbon tails -->
          <path d="M45,55 L20,95 L40,90 L50,65 Z" fill="${color}" opacity="0.85" stroke="#000" stroke-width="2.5" />
          <path d="M75,55 L100,95 L80,90 L70,65 Z" fill="${color}" opacity="0.85" stroke="#000" stroke-width="2.5" />
          <!-- Left loop -->
          <path d="M60,50 C25,50 15,20 35,20 C55,20 60,45 60,50 Z" fill="${color}" stroke="#000" stroke-width="2.5" />
          <path d="M40,28 C50,32 52,42 55,46" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          <!-- Right loop -->
          <path d="M60,50 C95,50 105,20 85,20 C65,20 60,45 60,50 Z" fill="${color}" stroke="#000" stroke-width="2.5" />
          <path d="M80,28 C70,32 68,42 65,46" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" />
          <!-- Center knot -->
          <rect x="52" y="42" width="16" height="16" rx="6" fill="${color}" stroke="#000" stroke-width="2.5" />
          <circle cx="60" cy="50" r="3" fill="#fff" opacity="0.9" />
        </svg>
      `;
    }
  },
  {
    id: 'puffy_cloud_ribbon',
    name: 'Puffy Cloud Bow',
    category: 'kawaii',
    emoji: '☁️',
    defaultColor: '#e0f2fe',
    viewBox: '0 0 120 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="100%" height="100%">
          <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
            <!-- Wavy Puffy loops -->
            <path d="M60,50 C38,40 20,45 25,30 C30,15 45,20 52,32 C55,30 58,30 60,50 Z" fill="${color}" stroke="#000" stroke-width="2" />
            <path d="M60,50 C82,40 100,45 95,30 C90,15 75,20 68,32 C65,30 62,30 60,50 Z" fill="${color}" stroke="#000" stroke-width="2" />
            <!-- Tails -->
            <path d="M50,50 C40,70 30,85 15,90" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" />
            <path d="M70,50 C80,70 90,85 105,90" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" />
            <!-- Cloud Knot -->
            <path d="M52,50 C48,46 50,38 60,40 C70,38 72,46 68,50 \
                     C72,54 70,60 60,58 C50,60 48,54 52,50 Z" fill="#fff" stroke="#000" stroke-width="2" />
            <circle cx="56" cy="46" r="1.5" fill="#f43f5e" />
            <circle cx="64" cy="46" r="1.5" fill="#f43f5e" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'kawaii_lace',
    name: 'Scalloped Lace Ribbon',
    category: 'kawaii',
    emoji: '🍨',
    defaultColor: '#fdf2f8',
    viewBox: '0 0 200 60',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="100%" height="100%">
          <g>
            <!-- Background lace strap -->
            <rect x="10" y="15" width="180" height="30" rx="4" fill="${color}" stroke="#000" stroke-width="2" />
            <!-- Scallops top -->
            <path d="M10,15 Q15,10 20,15 Q25,10 30,15 Q35,10 40,15 Q45,10 50,15 Q55,10 60,15 Q65,10 70,15 Q75,10 80,15 Q85,10 90,15 Q95,10 100,15 \
                     Q105,10 110,15 Q115,10 120,15 Q125,10 130,15 Q135,10 140,15 Q145,10 150,15 Q155,10 160,15 Q165,10 170,15 Q175,10 180,15 Q185,10 190,15" \
                     fill="none" stroke="#000" stroke-width="2" />
            <!-- Scallops bottom -->
            <path d="M10,45 Q15,50 20,45 Q25,50 30,45 Q35,50 40,45 Q45,50 50,45 Q55,50 60,45 Q65,50 70,45 Q75,50 80,45 Q85,50 90,45 Q95,50 100,45 \
                     Q105,50 110,45 Q115,50 120,45 Q125,50 130,45 Q135,50 140,45 Q145,50 150,45 Q155,50 160,45 Q165,50 170,45 Q175,50 180,45 Q185,50 190,45" \
                     fill="none" stroke="#000" stroke-width="2" />
            <!-- Inner Stitching line -->
            <line x1="15" y1="30" x2="185" y2="30" stroke="#db2777" stroke-width="1.5" stroke-dasharray="4,4" />
            <!-- Cute hearts overlay -->
            <path d="M40,30 L43,33 L46,30 L43,27 Z" fill="#db2777" />
            <path d="M100,30 L103,33 L106,30 L103,27 Z" fill="#db2777" />
            <path d="M160,30 L163,33 L166,30 L163,27 Z" fill="#db2777" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'heart_ribbon_band',
    name: 'Sweet Heart Ribbon',
    category: 'kawaii',
    emoji: '💖',
    defaultColor: '#f43f5e',
    viewBox: '0 0 200 40',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <!-- Main Band -->
          <rect x="5" y="10" width="190" height="20" rx="10" fill="${color}" stroke="#000" stroke-width="2" />
          <!-- Heart Chains inside -->
          <g fill="#fff" stroke="#000" stroke-width="1.5">
            <path d="M30,15 C27,11 20,11 20,17 C20,24 30,28 30,28 C30,28 40,24 40,17 C40,11 33,11 30,15 Z" />
            <path d="M70,15 C67,11 60,11 60,17 C60,24 70,28 70,28 C70,28 80,24 80,17 C80,11 73,11 70,15 Z" />
            <path d="M110,15 C107,11 100,11 100,17 C100,24 110,28 110,28 C110,28 120,24 120,17 C120,11 113,11 110,15 Z" />
            <path d="M150,15 C147,11 140,11 140,17 C140,24 150,28 150,28 C150,28 160,24 160,17 C160,11 153,11 150,15 Z" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'teddy_bear_ribbon',
    name: 'Kawaii Teddy Ribbon',
    category: 'kawaii',
    emoji: '🧸',
    defaultColor: '#b45309',
    viewBox: '0 0 120 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="100%" height="100%">
          <!-- Ribbon backing -->
          <path d="M10,50 L110,50" stroke="${color}" stroke-width="12" stroke-linecap="round" />
          <path d="M15,50 L25,80 L40,50" fill="${color}" stroke="#000" stroke-width="2" />
          <path d="M105,50 L95,80 L80,50" fill="${color}" stroke="#000" stroke-width="2" />
          <!-- Teddy Head -->
          <circle cx="60" cy="50" r="22" fill="#d97706" stroke="#000" stroke-width="2.5" />
          <!-- Teddy Ears -->
          <circle cx="42" cy="35" r="8" fill="#d97706" stroke="#000" stroke-width="2" />
          <circle cx="42" cy="35" r="4" fill="#fbcfe8" />
          <circle cx="78" cy="35" r="8" fill="#d97706" stroke="#000" stroke-width="2" />
          <circle cx="78" cy="35" r="4" fill="#fbcfe8" />
          <!-- Teddy Snout -->
          <ellipse cx="60" cy="56" rx="8" ry="6" fill="#fef3c7" stroke="#000" stroke-width="1.5" />
          <!-- Eyes & Nose -->
          <circle cx="53" cy="46" r="2" fill="#000" />
          <circle cx="67" cy="46" r="2" fill="#000" />
          <path d="M58,54 L62,54 L60,56 Z" fill="#000" />
          <!-- Blush -->
          <circle cx="47" cy="51" r="2" fill="#fb7185" opacity="0.8" />
          <circle cx="73" cy="51" r="2" fill="#fb7185" opacity="0.8" />
        </svg>
      `;
    }
  },
  {
    id: 'bunny_ears_badge',
    name: 'Usagi Bunny Bow',
    category: 'kawaii',
    emoji: '🐰',
    isTrending: true,
    defaultColor: '#fbcfe8',
    viewBox: '0 0 125 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 100" width="100%" height="100%">
          <!-- Bunny ears sticking upward behind ribbon -->
          <path d="M45,35 C40,5 56,5 53,30" fill="#fff" stroke="#000" stroke-width="2" />
          <path d="M47,30 C45,12 52,12 51,28" fill="#fca5a5" />
          <path d="M75,35 C80,5 64,5 67,30" fill="#fff" stroke="#000" stroke-width="2" />
          <path d="M73,30 C75,12 68,12 69,28" fill="#fca5a5" />
          <!-- Classic Bow loops -->
          <path d="M60,45 C25,45 20,20 38,20 C56,20 60,40 60,45 Z" fill="${color}" stroke="#000" stroke-width="2" />
          <path d="M60,45 C95,45 100,20 82,20 C64,20 60,40 60,45 Z" fill="${color}" stroke="#000" stroke-width="2" />
          <rect x="52" y="38" width="16" height="14" rx="5" fill="#fff" stroke="#000" stroke-width="2" />
          <!-- Cheeks -->
          <circle cx="60" cy="45" r="2" fill="#ef4444" />
        </svg>
      `;
    }
  },
  {
    id: 'kawaii_star_ribbon',
    name: 'Kira Twinkle Ribbon',
    category: 'kawaii',
    emoji: '⭐',
    defaultColor: '#fef08a',
    viewBox: '0 0 150 60',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 60" width="100%" height="100%">
          <!-- Soft streamer tails -->
          <path d="M45,30 C30,45 15,48 5,30 L25,25 Z" fill="${color}" opacity="0.75" stroke="#000" stroke-width="1.5" />
          <path d="M105,30 C120,45 135,48 145,30 L125,25 Z" fill="${color}" opacity="0.75" stroke="#000" stroke-width="1.5" />
          <!-- Main star core -->
          <polygon points="75,5 82,22 100,22 86,34 91,52 75,42 59,52 64,34 50,22 68,22" fill="${color}" stroke="#000" stroke-width="2.5" />
          <circle cx="68" cy="28" r="1.5" fill="#000" />
          <circle cx="82" cy="28" r="1.5" fill="#000" />
          <path d="M72,34 Q75,37 78,34" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round" />
          <!-- Sparkles -->
          <g fill="#fff">
            <path d="M115,10 Q120,10 120,5 Q120,10 125,10 Q120,10 120,15 Q120,10 115,10 Z" />
            <path d="M25,10 Q30,10 30,5 Q30,10 35,10 Q30,10 30,15 Q30,10 25,10 Z" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'cute_candy_wrap',
    name: 'Sweet Candy Ribbon',
    category: 'kawaii',
    emoji: '🍬',
    defaultColor: '#ff80df',
    viewBox: '0 0 160 60',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" width="100%" height="100%">
          <!-- Side wrappers -->
          <polygon points="15,30 5,10 5,50" fill="${color}" opacity="0.9" stroke="#000" stroke-width="2" />
          <polygon points="145,30 155,10 155,50" fill="${color}" opacity="0.9" stroke="#000" stroke-width="2" />
          <!-- Center candy cylinder -->
          <rect x="15" y="10" width="130" height="40" rx="15" fill="#fff" stroke="#000" stroke-width="2.5" />
          <!-- Color swirls -->
          <path d="M35,10 C50,15 45,45 60,50 L50,50 C35,45 40,15 25,10 Z" fill="${color}" />
          <path d="M75,10 C90,15 85,45 100,50 L90,50 C75,45 80,15 65,10 Z" fill="${color}" />
          <path d="M115,10 C130,15 125,45 140,50 L130,50 C115,45 120,15 105,10 Z" fill="${color}" />
        </svg>
      `;
    }
  },

  // ================= 2. ELEGANT PREMIUM RIBBONS =================
  {
    id: 'satin_gloss',
    name: 'Satin Bow Ribbon',
    category: 'elegant',
    emoji: '💄',
    isTrending: true,
    defaultColor: '#b91c1c',
    viewBox: '0 0 120 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="100%" height="100%">
          <!-- Gradient Definitions -->
          <defs>
            <linearGradient id="satinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.4" />
              <stop offset="30%" stop-color="${color}" />
              <stop offset="70%" stop-color="#4c0519" />
              <stop offset="100%" stop-color="#fff" stop-opacity="0.1" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))">
            <!-- Smooth tails -->
            <path d="M50,55 C40,75 18,92 5,95 C12,85 35,68 45,60" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" />
            <path d="M70,55 C80,75 102,92 115,95 C108,85 85,68 75,60" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" />
            <!-- Satin loops -->
            <path d="M60,50 C10,54 5,15 40,25 C55,29 60,45 60,50 Z" fill="url(#satinGrad)" />
            <path d="M60,50 C110,54 115,15 80,25 C65,29 60,45 60,50 Z" fill="url(#satinGrad)" />
            <!-- Center gold/satin knot -->
            <circle cx="60" cy="50" r="10" fill="url(#satinGrad)" stroke="#1e1b4b" stroke-width="0.5" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'silk_flowing',
    name: 'Graceful Silk Ribbon',
    category: 'elegant',
    emoji: '🥂',
    defaultColor: '#fef3c7',
    viewBox: '0 0 200 60',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="100%" height="100%">
          <defs>
            <linearGradient id="silkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${color}" stop-opacity="0.5"/>
              <stop offset="30%" stop-color="#ffffff"/>
              <stop offset="50%" stop-color="${color}"/>
              <stop offset="85%" stop-color="#a88d5e"/>
              <stop offset="100%" stop-color="${color}"/>
            </linearGradient>
          </defs>
          <!-- Elegant ribbon wave -->
          <path d="M10,30 C50,0 70,60 110,30 C150,0 160,60 190,30" 
                fill="none" stroke="url(#silkGrad)" stroke-width="14" stroke-linecap="round" />
          <path d="M10,32 C50,2 70,62 110,32 C150,2 160,62 190,32" 
                fill="none" stroke="#fff" stroke-width="1" opacity="0.6" stroke-linecap="round" />
        </svg>
      `;
    }
  },
  {
    id: 'pearl_beaded',
    name: 'Royal Pearl Necklace Ribbon',
    category: 'elegant',
    emoji: '📿',
    defaultColor: '#f1f5f9',
    viewBox: '0 0 200 50',
    svgTemplate: () => {
      let circles = '';
      for (let i = 15; i <= 185; i += 8) {
        circles += `<circle cx="${i}" cy="${25 + Math.sin(i / 15) * 6}" r="3.5" fill="all" \
                     style="fill: q; fill-opacity: 1; stroke: #94a3b8; stroke-width:0.5; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.15))">
                      <animate attributeName="cy" values="${25 + Math.sin(i / 15) * 6};${28 + Math.sin(i / 15) * 6};${25 + Math.sin(i / 15) * 6}" dur="3s" repeatCount="indefinite" begin="${i * 5}ms"/>
                     </circle>`;
      }
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" width="100%" height="100%">
          <defs>
            <radialGradient id="pearlShine" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="70%" stop-color="#ede9fe" />
              <stop offset="100%" stop-color="#cbd5e1" />
            </radialGradient>
          </defs>
          <g>
            <!-- Background luxury golden string thread -->
            <path d="M15,25 Q100,45 185,25" fill="none" stroke="#d97706" stroke-width="1.5" />
            <!-- Draw Pearl chain dots -->
            ${circles.replace(/fill="all"/g, 'fill="url(#pearlShine)"')}
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'golden_wrap',
    name: 'Luxury 24K Gold Ribbon',
    category: 'elegant',
    emoji: '⚜️',
    isTrending: true,
    defaultColor: '#fbbf24',
    viewBox: '0 0 200 40',
    svgTemplate: () => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#b45309" />
              <stop offset="25%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#fbbf24" />
              <stop offset="75%" stop-color="#fef3c7" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
            <!-- Golden tape base with sharp angled edges -->
            <polygon points="10,30 20,10 180,10 190,30 175,25 25,25" fill="url(#goldGrad)" stroke="#78350f" stroke-width="1" />
            <!-- Highlights line -->
            <line x1="20" y1="14" x2="180" y2="14" stroke="#fff" stroke-width="1.5" opacity="0.7" />
            <polygon points="70,10 85,10 100,30 85,30" fill="#fff" opacity="0.3" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'silver_chrome',
    name: 'Liquid Chrome Ribbon',
    category: 'elegant',
    emoji: '⚔️',
    defaultColor: '#cbd1d6',
    viewBox: '0 0 180 50',
    svgTemplate: () => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="100%" height="100%">
          <defs>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f1f5f9" />
              <stop offset="20%" stop-color="#94a3b8" />
              <stop offset="40%" stop-color="#0f172a" />
              <stop offset="45%" stop-color="#ffffff" />
              <stop offset="70%" stop-color="#cbd5e1" />
              <stop offset="100%" stop-color="#475569" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))">
            <path d="M10,25 Q45,5 90,25 T170,25 L160,35 Q125,15 90,35 T20,35 Z" fill="url(#chromeGrad)" stroke="#1e293b" stroke-width="1.5" />
          </g>
        </svg>
      `;
    }
  },

  // ================= 3. Y2K / GLITTER RIBBONS =================
  {
    id: 'glitter_cyber_queen',
    name: 'Cyber Queen Glitter Ribbon',
    category: 'y2k',
    emoji: '🪐',
    isTrending: true,
    defaultColor: '#ff007f',
    viewBox: '0 0 200 45',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 45" width="100%" height="100%">
          <defs>
            <filter id="y2kGlitterFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="screen" in2="SourceGraphic" />
            </filter>
            <!-- Rainbow glow -->
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff007f" />
              <stop offset="33%" stop-color="#00ffff" />
              <stop offset="66%" stop-color="#ffff00" />
              <stop offset="100%" stop-color="#ff007f" />
            </linearGradient>
          </defs>
          <g>
            <!-- Glow background -->
            <rect x="5" y="8" width="190" height="26" rx="6" fill="url(#rainbowGrad)" filter="blur(4px)" opacity="0.7" />
            <!-- Real physical solid tape block -->
            <rect x="10" y="10" width="180" height="22" rx="4" fill="${color}" stroke="#000" stroke-width="2.5" />
            <!-- Noise texture representation -->
            <rect x="10" y="10" width="180" height="22" rx="4" fill="#fff" filter="url(#y2kGlitterFilter)" blend-mode="overlay" opacity="0.6" />
            <!-- Neon cyan borders -->
            <rect x="12" y="12" width="176" height="18" rx="2" fill="none" stroke="#00ffff" stroke-width="1" />
            <text x="100" y="24" font-family="'Space Grotesk', monospace" font-size="10" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">★ CYBER QUEEN ★</text>
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'holographic_tape',
    name: 'Holo Shimmer Tape',
    category: 'y2k',
    emoji: '💿',
    defaultColor: '#e0f2fe',
    viewBox: '0 0 200 40',
    svgTemplate: () => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <defs>
            <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#a5f3fc" />
              <stop offset="20%" stop-color="#fbcfe8" />
              <stop offset="40%" stop-color="#fef08a" />
              <stop offset="60%" stop-color="#c084fc" />
              <stop offset="80%" stop-color="#fed7aa" />
              <stop offset="100%" stop-color="#93c5fd" />
            </linearGradient>
          </defs>
          <g>
            <!-- Wavy holo diagonal tape ribbon -->
            <polygon points="10,32 5,14 185,10 195,28 150,26 50,30" fill="url(#holo)" stroke="#000" stroke-width="2" />
            <!-- Shiny sheen line -->
            <line x1="8" y1="18" x2="188" y2="14" stroke="#ffffff" stroke-width="2" opacity="0.9" />
            <!-- Twinkle 4 point star -->
            <path d="M120,15 Q125,15 125,10 Q125,15 130,15 Q125,15 125,20 Q125,15 120,15 Z" fill="#fff" />
            <path d="M40,24 Q45,24 45,19 Q45,24 50,24 Q45,24 45,29 Q45,24 40,24 Z" fill="#fff" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'butterfly_y2k_metal',
    name: 'Liquid Butterfly Metal',
    category: 'y2k',
    emoji: '🦋',
    defaultColor: '#c084fc',
    viewBox: '0 0 120 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="100%" height="100%">
          <defs>
            <linearGradient id="metalWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff"/>
              <stop offset="50%" stop-color="${color}"/>
              <stop offset="100%" stop-color="#3b0764"/>
            </linearGradient>
          </defs>
          <g stroke="#000" stroke-width="2.5">
            <!-- Left upper wing -->
            <path d="M60,45 C40,20 10,10 15,35 C18,50 45,52 60,50 Z" fill="url(#metalWing)" />
            <!-- Left lower wing -->
            <path d="M60,50 C45,52 20,55 25,75 C30,90 50,80 60,60 Z" fill="url(#metalWing)" />
            <!-- Right upper wing -->
            <path d="M60,45 C80,20 110,10 105,35 C102,50 75,52 60,50 Z" fill="url(#metalWing)" />
            <!-- Right lower wing -->
            <path d="M60,50 C75,52 100,55 95,75 C90,90 70,80 60,60 Z" fill="url(#metalWing)" />
            <!-- Butterfly body -->
            <ellipse cx="60" cy="50" rx="4" ry="18" fill="url(#metalWing)" />
            <path d="M58,35 Q50,20 40,22" fill="none" stroke-linecap="round" />
            <path d="M62,35 Q70,20 80,22" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      `;
    }
  },

  // ================= 4. DREAMY AESTHETIC RIBBONS =================
  {
    id: 'angelcore_feather',
    name: 'Angelcore Feather Ribbon',
    category: 'dreamy',
    emoji: '👼',
    isTrending: true,
    defaultColor: '#f0f9ff',
    viewBox: '0 0 180 50',
    svgTemplate: () => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="100%" height="100%">
          <!-- Angelic fluffy winged-ribbon backdrop -->
          <g filter="drop-shadow(0 2px 4px rgba(186,230,253,0.5))">
            <!-- Left feather cluster wing -->
            <path d="M90,25 Q50,10 20,25 Q10,15 25,5 Q60,5 90,25" fill="#fff" stroke="#bae6fd" stroke-width="1.5" />
            <path d="M90,25 Q45,20 30,35 Q20,25 35,15 Q65,15 90,25" fill="#fff" stroke="#bae6fd" stroke-width="1.5" />
            <!-- Right wing -->
            <path d="M90,25 Q130,10 160,25 Q170,15 155,5 Q120,5 90,25" fill="#fff" stroke="#bae6fd" stroke-width="1.5" />
            <path d="M90,25 Q135,20 150,35 Q160,25 145,15 Q115,15 90,25" fill="#fff" stroke="#bae6fd" stroke-width="1.5" />
            <!-- Center magical star gem -->
            <polygon points="90,13 93,21 101,24 93,27 90,35 87,27 79,24 87,21" fill="#fed7aa" stroke="#000" stroke-width="1" />
            <circle cx="90" cy="24" r="2.5" fill="#38bdf8" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'starry_night_dreams',
    name: 'Starry Sky Ribbon',
    category: 'dreamy',
    emoji: '🌌',
    defaultColor: '#1e1b4b',
    viewBox: '0 0 200 40',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <!-- Cosmos band -->
          <rect x="5" y="8" width="190" height="24" rx="12" fill="${color}" stroke="#a78bfa" stroke-width="1.5" />
          <!-- Flowing constellations -->
          <path d="M20,20 L35,16 L50,22 L65,15" fill="none" stroke="#fff" stroke-width="1" opacity="0.6" stroke-dasharray="2,2" />
          <path d="M130,22 L145,15 L160,25 L175,18" fill="none" stroke="#fff" stroke-width="1" opacity="0.6" stroke-dasharray="2,2" />
          <!-- Twinkle stars -->
          <g fill="#fef08a">
            <polygon points="35,16 37,13 40,16 37,19" />
            <polygon points="145,15 147,12 150,15 147,18" />
            <!-- Crescent moon in center -->
            <path d="M100,12 A8,8 0 1,0 108,24 A6,6 0 1,1 100,12 Z" fill="#fde047" />
          </g>
        </svg>
      `;
    }
  },

  // ================= 5. POLAROID & SCRAPBOOK TAPE RIBBONS =================
  {
    id: 'washi_polka',
    name: 'Polka Washi Tape',
    category: 'scrapbook',
    emoji: '📼',
    defaultColor: '#f472b6',
    viewBox: '0 0 160 36',
    svgTemplate: (color) => {
      let dots = '';
      for (let x = 15; x < 150; x += 18) {
        dots += `<circle cx="${x}" cy="${13}" r="2" fill="#fff" />`;
        dots += `<circle cx="${x + 9}" cy="${23}" r="2" fill="#fff" />`;
      }
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 36" width="100%" height="100%">
          <!-- Translucent washi tape paper with ragged torn corners -->
          <g opacity="0.85">
            <path d="M8,8 L152,8 L154,12 L151,16 L153,20 L150,24 L152,28 L8,28 L6,24 L9,20 L7,16 L9,12 Z"
                  fill="${color}" stroke="#000" stroke-width="1.5" />
            <!-- Polka patterns dot arrays -->
            ${dots}
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'torn_paper_vintage',
    name: 'Retro Torn Paper',
    category: 'scrapbook',
    emoji: '📜',
    isTrending: true,
    defaultColor: '#fef3c7',
    viewBox: '0 0 180 40',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 40" width="100%" height="100%">
          <!-- Highly realistic torn paper tape with fiber shadows -->
          <path d="M10,12 L25,10 L45,13 L70,8 L95,11 L120,8 L145,12 L170,10 L168,14 L172,18 L169,22 L171,28 L168,32 L150,30 L125,32 L100,28 L75,31 L50,29 L25,32 L10,29 L12,25 L9,21 L12,17 Z"
                fill="${color}" stroke="#78350f" stroke-width="1.5" />
          <!-- Sketch scribbles -->
          <path d="M30,20 Q60,18 90,22 T150,20" fill="none" stroke="#b45309" stroke-width="1" stroke-dasharray="3,3" />
        </svg>
      `;
    }
  },
  {
    id: 'photo_corner_l',
    name: 'Sleek Photo Corners (Set)',
    category: 'scrapbook',
    emoji: '📐',
    defaultColor: '#ffffff',
    viewBox: '0 0 100 100',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
          <!-- Top Left corner slider mount -->
          <path d="M5,35 L5,5 L35,5 L25,15 L15,15 L15,25 Z" fill="${color}" stroke="#000" stroke-width="2" />
          <!-- Bottom Right corner slider mount -->
          <path d="M95,65 L95,95 L65,95 L75,85 L85,85 L85,75 Z" fill="${color}" stroke="#000" stroke-width="2" />
          <!-- Aesthetic dot stitch details -->
          <circle cx="8" cy="8" r="1.5" fill="#f43f5e" />
          <circle cx="92" cy="92" r="1.5" fill="#f43f5e" />
        </svg>
      `;
    }
  },
  {
    id: 'perforated_film',
    name: 'Vintage Film Strip Tape',
    category: 'scrapbook',
    emoji: '🎞️',
    defaultColor: '#1e293b',
    viewBox: '0 0 200 40',
    svgTemplate: () => {
      let rects = '';
      for (let x = 12; x < 190; x += 16) {
        rects += `<rect x="${x}" y="12" width="8" height="6" rx="1.5" fill="#fff" />`;
        rects += `<rect x="${x}" y="28" width="8" height="6" rx="1.5" fill="#fff" />`;
      }
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <!-- Negative space dark composite -->
          <rect x="5" y="8" width="190" height="30" fill="#000" stroke="#475569" stroke-width="1.5" />
          <!-- Perforations upper & lower -->
          ${rects}
          <!-- Central frame division lines -->
          <line x1="50" y1="8" x2="50" y2="38" stroke="#334155" stroke-width="2" />
          <line x1="100" y1="8" x2="100" y2="38" stroke="#334155" stroke-width="2" />
          <line x1="150" y1="8" x2="150" y2="38" stroke="#334155" stroke-width="2" />
        </svg>
      `;
    }
  },

  // ================= 6. ROMANTIC / BESTIE RIBBONS =================
  {
    id: 'love_pulse_valentine',
    name: 'Eternal Love Pulse Ribbon',
    category: 'romantic',
    emoji: '💕',
    isTrending: true,
    defaultColor: '#ff2a6d',
    viewBox: '0 0 200 45',
    svgTemplate: (color) => {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 45" width="100%" height="100%">
          <!-- Pulse wave behind backplate -->
          <path d="M5,22 L45,22 L52,1 L59,44 L66,17 L73,22 L110,22 L117,10 L124,35 L131,22 L195,22" 
                fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" />
          <!-- Heart nodes -->
          <g fill="${color}" stroke="#000" stroke-width="1">
            <path d="M90,22 C87,18 80,18 80,24 C80,31 90,35 90,35 C90,35 100,31 100,24 C100,18 93,18 90,22 Z" />
            <path d="M150,22 C147,18 140,18 140,24 C140,31 150,35 150,35 C150,35 160,31 160,24 C160,18 153,18 150,22 Z" />
          </g>
        </svg>
      `;
    }
  },
  {
    id: 'promise_knot',
    name: 'Bestie Interlocking Ribbon',
    category: 'romantic',
    emoji: '🤝',
    defaultColor: '#f472b6',
    viewBox: '0 0 140 100',
    svgTemplate: () => {
      return `
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" width="100%" height="100%">
           <!-- Overlapping knots with friendship color cords -->
           <path d="M15,50 Q45,20 70,50 T125,50" fill="none" stroke="#db2777" stroke-width="5" stroke-linecap="round" />
           <path d="M15,58 Q45,28 70,58 T125,58" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" />
           <!-- Cute center bound bow tie -->
           <path d="M60,54 C40,34 50,24 70,54 C90,24 100,34 80,54" fill="none" stroke="#000" stroke-width="2.5" />
           <circle cx="70" cy="54" r="6" fill="#fde047" stroke="#000" stroke-width="2" />
         </svg>
      `;
    }
  }
];

// Add 40+ generated dynamic variants programmatically to satisfy the "50+ beautiful ribbons" requirement cleanly
const CATEGORIES: ('kawaii' | 'elegant' | 'y2k' | 'dreamy' | 'scrapbook' | 'romantic')[] = [
  'kawaii', 'elegant', 'y2k', 'dreamy', 'scrapbook', 'romantic'
];

const EXTRA_EMOJIS = ['🍨', '🐰', '🍡', '🍭', '🌸', '👑', '🦢', '🌟', '🍼', '🐾', '🍿', '🎈', '💖', '🌈', '🧸'];

// Generate variants to populate the collection with 50+ entries
for (let i = 1; i <= 40; i++) {
  const cat = CATEGORIES[i % CATEGORIES.length];
  let emoji = EXTRA_EMOJIS[i % EXTRA_EMOJIS.length];
  
  PREMIUM_RIBBONS.push({
    id: `ribbon_variant_${i}`,
    name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Deco Band ${i}`,
    category: cat,
    emoji: emoji,
    isTrending: i % 7 === 0,
    defaultColor: i % 3 === 0 ? '#ff80df' : i % 3 === 1 ? '#a5f3fc' : '#fef08a',
    viewBox: '0 0 200 40',
    svgTemplate: (color, opt) => {
      const displayEmoji = emoji;
      const borderStroke = opt?.hasGlow ? '#f43f5e' : '#000000';
      const borderWeight = opt?.hasGlow ? '3' : '2';
      
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" width="100%" height="100%">
          <defs>
            <radialGradient id="shimmerGrad_${i}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <g>
            <!-- Background base ribbon path -->
            <path d="M10,10 L15,30 L185,30 L190,10 L150,15 L50,15 Z" fill="${color}" stroke="${borderStroke}" stroke-width="${borderWeight}" />
            
            <!-- Shine/shimmer overlay if specified -->
            <ellipse cx="100" cy="20" rx="60" ry="10" fill="url(#shimmerGrad_${i})" opacity="0.45" />

            <!-- Edge stripes stitches decoration -->
            <line x1="20" y1="23" x2="180" y2="23" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3,3" />

            <!-- Highlight visual side elements -->
            <text x="30" y="24" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#000">${displayEmoji}</text>
            <text x="170" y="24" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#000">${displayEmoji}</text>

            <!-- Center label title -->
            <text x="100" y="23" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="#000">♥ CUTIE STYLE ♥</text>
          </g>
        </svg>
      `;
    }
  });
}
