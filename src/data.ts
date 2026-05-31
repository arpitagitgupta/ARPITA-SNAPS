import { ThemeConfig, PhotoFilter, StickerTemplate, StripTemplate } from './types';

export const THEME_PRESETS: Record<string, ThemeConfig> = {
  bubblegum: {
    id: 'bubblegum',
    name: 'Editorial Y2K',
    emoji: '🎀',
    primary: '#ff69b4',
    primaryText: 'text-pink-500',
    secondary: '#e6e6fa',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#ff69b4',
    starColor: '#ff69b4',
    particleType: 'hearts',
    cardBg: 'bg-white/90 rounded-2xl y2k-border',
    borderColor: 'border-pink-300'
  },
  dreamcore: {
    id: 'dreamcore',
    name: 'Editorial Angel',
    emoji: '☁',
    primary: '#a3c2f7',
    primaryText: 'text-blue-500',
    secondary: '#e6e6fa',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#4a90e2',
    starColor: '#a855f7',
    particleType: 'clouds',
    cardBg: 'bg-white/95 rounded-2xl y2k-border',
    borderColor: 'border-blue-200'
  },
  y2k_retro: {
    id: 'y2k_retro',
    name: 'Nostalgia Zine',
    emoji: '💿',
    primary: '#0ea5e9',
    primaryText: 'text-sky-500',
    secondary: '#e6e6fa',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#2563eb',
    starColor: '#06b6d4',
    particleType: 'pixels',
    cardBg: 'bg-white/95 rounded-2xl y2k-border',
    borderColor: 'border-sky-300'
  },
  dark_cute: {
    id: 'dark_cute',
    name: 'Dark Zine Goth',
    emoji: '🌙',
    primary: '#a855f7',
    primaryText: 'text-purple-400',
    secondary: '#3b0764',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#f43f5e',
    starColor: '#fbbf24',
    particleType: 'stars',
    cardBg: 'bg-slate-900/90 rounded-2xl y2k-border',
    borderColor: 'border-purple-500/50'
  },
  glitter_queen: {
    id: 'glitter_queen',
    name: 'Glitter editorial',
    emoji: '✨',
    primary: '#f59e0b',
    primaryText: 'text-amber-500',
    secondary: '#fef08a',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#ec4899',
    starColor: '#ec4899',
    particleType: 'glitter',
    cardBg: 'bg-white/95 rounded-2xl y2k-border',
    borderColor: 'border-amber-300'
  },
  soft_pastel: {
    id: 'soft_pastel',
    name: 'Kawaii Print',
    emoji: '🦋',
    primary: '#4ade80',
    primaryText: 'text-emerald-500',
    secondary: '#fbcfe8',
    background: 'linear-gradient(180deg, #ffd1e8 0%, #ffd1e8 100%)',
    accent: '#ec4899',
    starColor: '#f43f5e',
    particleType: 'pastles',
    cardBg: 'bg-white/95 rounded-2xl y2k-border',
    borderColor: 'border-pink-200'
  }
};

export const INSTANT_CAPTIONS = [
  'Main Character Energy ✨',
  'Cute Chaos 💖',
  'Best Day Ever ☁️',
  'Soft Girl Era 🎀',
  'Dreamy Mood 🌸',
  'Arpita Snaps Memory ✨',
  '⭐ Bestie Energy ⭐',
  '🧸 Sweet Bunny Era',
  '⚡ Slay Mode Activate',
  '👼 Angel Baby 👼'
];

export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'normal', name: 'Original', cssFilter: 'none', emoji: '📸' },
  { id: 'dream_glow', name: 'Dream Glow', cssFilter: 'blur(0.3px) brightness(1.2) contrast(0.92) saturate(1.15)', overlayClass: 'glow-lavender', emoji: '✨' },
  { id: 'soft_pink', name: 'Soft Pink', cssFilter: 'brightness(1.12) contrast(1.02) saturate(1.2)', overlayClass: 'overlay-pink', emoji: '🎀' },
  { id: 'cloudy_mood', name: 'Cloudy Mood', cssFilter: 'blur(0.2px) brightness(1.15) contrast(0.95) saturate(1.1)', overlayClass: 'overlay-bunny', emoji: '☁️' },
  { id: 'y2k_glitter', name: 'Y2K Glitter', cssFilter: 'brightness(1.12) contrast(1.1) saturate(1.25) sepia(0.04)', overlayClass: 'glow-pink', emoji: '💿' },
  { id: 'soft_pastel', name: 'Soft Pastel', cssFilter: 'brightness(1.18) contrast(0.9) saturate(1.3) sepia(0.02)', overlayClass: 'overlay-lolita', emoji: '🌸' },
  { id: 'angel_aura', name: 'Angel Aura', cssFilter: 'brightness(1.2) saturate(1.3) contrast(0.98)', overlayClass: 'overlay-rainbow', emoji: '🦋' },
  { id: 'retro_camera', name: 'Retro Camera', cssFilter: 'contrast(1.2) brightness(0.98) saturate(0.92)', overlayClass: 'overlay-digicam', emoji: '📸' },
  { id: 'vintage_film', name: 'Vintage Film', cssFilter: 'contrast(1.08) grayscale(0.12) sepia(0.18)', overlayClass: 'overlay-grain', emoji: '🌙' },
  { id: 'sparkle_cam', name: 'Sparkle Cam', cssFilter: 'brightness(1.22) contrast(1.12) saturate(1.32)', overlayClass: 'overlay-purikura', emoji: '✨' },
  { id: 'blush_glow', name: 'Blush Glow', cssFilter: 'sepia(0.1) saturate(1.35) brightness(1.12) contrast(1.05)', overlayClass: 'overlay-peach', emoji: '💖' }
];

export const STICKER_CATALOG: StickerTemplate[] = [
  // Hearts
  { id: 'h1', category: 'hearts', content: '💖', type: 'emoji' },
  { id: 'h2', category: 'hearts', content: '💞', type: 'emoji' },
  { id: 'h3', category: 'hearts', content: '🎀', type: 'emoji' },
  { id: 'h4', category: 'hearts', content: '💌', type: 'emoji' },
  { id: 'h5', category: 'hearts', content: '💕', type: 'emoji' },
  { id: 'h6', category: 'hearts', content: '❣️', type: 'emoji' },
  { id: 'h7', category: 'hearts', content: '❤️‍🔥', type: 'emoji' },
  
  // Stars & Sparkles
  { id: 's1', category: 'stars', content: '✨', type: 'emoji' },
  { id: 's2', category: 'stars', content: '⭐', type: 'emoji' },
  { id: 's3', category: 'stars', content: '🌟', type: 'emoji' },
  { id: 's4', category: 'stars', content: '💫', type: 'emoji' },
  { id: 's5', category: 'stars', content: '⚡', type: 'emoji' },
  { id: 's6', category: 'stars', content: '🔮', type: 'emoji' },
  
  // Butterflies & Nature
  { id: 'b1', category: 'butterflies', content: '🦋', type: 'emoji' },
  { id: 'b2', category: 'butterflies', content: '🌸', type: 'emoji' },
  { id: 'b3', category: 'butterflies', content: '🌈', type: 'emoji' },
  { id: 'b4', category: 'butterflies', content: '🪐', type: 'emoji' },
  { id: 'b5', category: 'butterflies', content: '🍄', type: 'emoji' },
  { id: 'b6', category: 'butterflies', content: '🍀', type: 'emoji' },

  // Kawaii Icons
  { id: 'k1', category: 'kawaii', content: '🐰', type: 'emoji' },
  { id: 'k2', category: 'kawaii', content: '🐱', type: 'emoji' },
  { id: 'k3', category: 'kawaii', content: '🧸', type: 'emoji' },
  { id: 'k4', category: 'kawaii', content: '🦖', type: 'emoji' },
  { id: 'k5', category: 'kawaii', content: '🦄', type: 'emoji' },
  { id: 'k6', category: 'kawaii', content: '🐾', type: 'emoji' },
  { id: 'k7', category: 'kawaii', content: '🍓', type: 'emoji' },
  { id: 'k8', category: 'kawaii', content: '🍒', type: 'emoji' },
  { id: 'k9', category: 'kawaii', content: '🍭', type: 'emoji' },
  { id: 'k10', category: 'kawaii', content: '🍮', type: 'emoji' },

  // Pixels & Cyber
  { id: 'p1', category: 'pixel', content: '📟', type: 'emoji' },
  { id: 'p2', category: 'pixel', content: '🎮', type: 'emoji' },
  { id: 'p3', category: 'pixel', content: '💿', type: 'emoji' },
  { id: 'p4', category: 'pixel', content: '💾', type: 'emoji' },
  { id: 'p5', category: 'pixel', content: '👾', type: 'emoji' },
  { id: 'p6', category: 'pixel', content: '🎈', type: 'emoji' },
  { id: 'p7', category: 'pixel', content: '💅', type: 'emoji' },
  { id: 'p8', category: 'pixel', content: '👑', type: 'emoji' },

  // Dialog Bubbles
  { id: 'tb1', category: 'text_bubble', content: '💬 OK!', type: 'emoji' },
  { id: 'tb2', category: 'text_bubble', content: '💘 XOXO', type: 'emoji' },
  { id: 'tb3', category: 'text_bubble', content: '✨ OMG ✨', type: 'emoji' },
  { id: 'tb4', category: 'text_bubble', content: '📟 SLAY', type: 'emoji' },
  { id: 'tb5', category: 'text_bubble', content: '🦋 DREAM', type: 'emoji' },
  { id: 'tb6', category: 'text_bubble', content: '🧸 KAWAII', type: 'emoji' },
  { id: 'tb7', category: 'text_bubble', content: '🎀 CUTIE', type: 'emoji' },
  { id: 'tb8', category: 'text_bubble', content: '🍒 SWEET', type: 'emoji' }
];

export const STRIP_TEMPLATES: StripTemplate[] = [
  {
    id: 'pink_glitter',
    name: '🎀 Bubblegum Pink',
    background: 'bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300',
    borderColor: 'border-pink-300',
    labelFont: 'font-bubble',
    textColor: 'text-pink-600',
    stickers: ['🎀', '💖', '✨'],
    frameStyle: 'pink-neon'
  },
  {
    id: 'retro_chrome',
    name: '💿 Chrome Wave',
    background: 'bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400',
    borderColor: 'border-slate-400',
    labelFont: 'font-cyber',
    textColor: 'text-indigo-800',
    stickers: ['🪐', '💿', '💫'],
    frameStyle: 'chrome-metallic'
  },
  {
    id: 'angelcore',
    name: '☁ Angelcore Blue',
    background: 'bg-gradient-to-b from-sky-100 via-indigo-50 to-blue-200',
    borderColor: 'border-sky-200',
    labelFont: 'font-sans',
    textColor: 'text-sky-600',
    stickers: ['☁️', '👼', '⭐'],
    frameStyle: 'cloud-fringe'
  },
  {
    id: 'dreamcore',
    name: '🌌 Retro Cyber Goth',
    background: 'bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-900',
    borderColor: 'border-purple-500',
    labelFont: 'font-pixel',
    textColor: 'text-purple-300',
    stickers: ['🌙', '👾', '⚡'],
    frameStyle: 'cyan-cyber-lines'
  },
  {
    id: 'bubblegum',
    name: '🏁 Cyber Princess Check',
    background: 'bg-gradient-to-b from-lime-100 via-emerald-50 to-pink-100',
    borderColor: 'border-pink-400',
    labelFont: 'font-cyber',
    textColor: 'text-rose-500',
    stickers: ['🦋', '💾', '👑'],
    frameStyle: 'checkered-sides'
  }
];
