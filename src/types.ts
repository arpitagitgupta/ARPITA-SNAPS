export type ThemeMode = 'bubblegum' | 'dreamcore' | 'y2k_retro' | 'dark_cute' | 'glitter_queen' | 'soft_pastel';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  emoji: string;
  primary: string; // Tailwind class e.g. 'bg-pink-500' or hex
  primaryText: string;
  secondary: string;
  background: string; // css gradient
  accent: string;
  starColor: string;
  particleType: 'hearts' | 'clouds' | 'pixels' | 'stars' | 'glitter' | 'pastles';
  cardBg: string;
  borderColor: string;
}

export interface PhotoFilter {
  id: string;
  name: string;
  cssFilter: string;
  overlayClass?: string;
  emoji: string;
}

export interface StickerTemplate {
  id: string;
  category: 'hearts' | 'stars' | 'butterflies' | 'pixel' | 'kawaii' | 'text_bubble';
  content: string; // Emoji, icon name, or symbol
  type: 'emoji' | 'custom';
}

export interface CanvasElement {
  id: string;
  type: 'sticker' | 'text' | 'ribbon';
  content: string; // Emoji, custom text, or ribbon SVG/Id references
  x: number; // Percent of container width (0-100)
  y: number; // Percent of container height (0-100)
  scale: number;
  rotation: number; // Degrees
  layer: number;
  fontFamily?: 'Fredoka' | 'VT323' | 'Space Grotesk' | 'Inter' | 'Pacifico';
  color?: string; // Text color index or hex / Ribbon color
  glowColor?: string;
  isGradient?: boolean;
  // Premium Ribbon properties
  ribbonId?: string;
  opacity?: number; // range 0 to 1
  hasGlow?: boolean;
  hasGlitter?: boolean;
  hasShadow?: boolean;
  hasSway?: boolean;
  width?: number; // Aspect ratio width tuning multiplier
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string; // Base64 of captured frame
  timestamp: string;
}

export interface StripTemplate {
  id: string;
  name: string;
  background: string; // Tailwind class or custom style
  borderColor: string;
  labelFont: string;
  textColor: string;
  stickers: string[]; // preset icons/decorations
  frameStyle: string;
}
