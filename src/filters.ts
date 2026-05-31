import { PhotoFilter } from './types';

export interface PremiumFilter extends PhotoFilter {
  category: 'classic' | 'polaroid' | 'y2k' | 'aesthetic' | 'retro' | 'cinematic' | 'romantic' | 'color' | 'viral';
  isTrending?: boolean;
}

export const PREMIUM_FILTERS: PremiumFilter[] = [
  // ==================== 1. CLASSIC CAMERA FILTERS ====================
  {
    id: 'bw_classic',
    name: 'Classic B&W',
    category: 'classic',
    cssFilter: 'grayscale(1) contrast(1.1) brightness(1.02)',
    emoji: '🖤'
  },
  {
    id: 'bw_soft',
    name: 'Soft Black & White',
    category: 'classic',
    cssFilter: 'grayscale(1) contrast(0.9) brightness(1.08)',
    emoji: '🩶'
  },
  {
    id: 'bw_contrast',
    name: 'High Contrast B&W',
    category: 'classic',
    cssFilter: 'grayscale(1) contrast(1.45) brightness(0.95)',
    emoji: '💀'
  },
  {
    id: 'film_noir',
    name: 'Film Noir',
    category: 'classic',
    cssFilter: 'grayscale(1) contrast(1.3) brightness(0.85) sepia(0.05)',
    emoji: '🕶️'
  },
  {
    id: 'vintage_mono',
    name: 'Vintage Monochrome',
    category: 'classic',
    cssFilter: 'grayscale(1) sepia(0.2) contrast(1.05)',
    emoji: '♟️'
  },
  {
    id: 'silver_film',
    name: 'Silver Film',
    category: 'classic',
    cssFilter: 'grayscale(0.95) contrast(1.2) brightness(1.1) saturate(0.05)',
    emoji: '🥈'
  },
  {
    id: 'sepia_classic',
    name: 'Warm Sepia',
    category: 'classic',
    cssFilter: 'sepia(0.7) contrast(0.95) brightness(1.02)',
    emoji: '🪵'
  },
  {
    id: 'warm_vintage',
    name: 'Warm Vintage',
    category: 'classic',
    cssFilter: 'sepia(0.25) saturate(1.1) brightness(1.05) contrast(0.98)',
    emoji: '🍂',
    isTrending: true
  },
  {
    id: 'cool_vintage',
    name: 'Cool Vintage',
    category: 'classic',
    cssFilter: 'hue-rotate(15deg) saturate(0.9) contrast(1.05) brightness(1.02)',
    emoji: '❄️'
  },
  {
    id: 'retro_film_cam',
    name: 'Retro Film Camera',
    category: 'classic',
    cssFilter: 'contrast(1.12) brightness(0.96) saturate(1.08) sepia(0.08)',
    emoji: '📷'
  },
  {
    id: 'disposable_cam',
    name: 'Disposable Camera',
    category: 'classic',
    cssFilter: 'contrast(1.15) saturate(1.2) sepia(0.05) hue-rotate(-5deg)',
    emoji: '⚡'
  },
  {
    id: 'old_digicam_classic',
    name: 'Old Digital Camera',
    category: 'classic',
    cssFilter: 'contrast(1.25) saturate(0.9) brightness(0.95)',
    emoji: '💾'
  },
  {
    id: 'dslr_portrait',
    name: 'DSLR Portrait',
    category: 'classic',
    cssFilter: 'contrast(1.05) saturate(1.05) brightness(1.04) blur(0.1px)',
    emoji: '📸'
  },
  {
    id: 'analog_film',
    name: 'Analog Film',
    category: 'classic',
    cssFilter: 'sepia(0.12) contrast(1.15) saturate(1.12) brightness(1.02)',
    emoji: '🎞️'
  },

  // ==================== 2. POLAROID COLLECTION ====================
  {
    id: 'classic_polaroid',
    name: 'Classic Polaroid',
    category: 'polaroid',
    cssFilter: 'contrast(1.05) brightness(1.1) saturate(0.9) sepia(0.12)',
    emoji: '🖼️',
    isTrending: true
  },
  {
    id: 'vintage_polaroid',
    name: 'Vintage Polaroid',
    category: 'polaroid',
    cssFilter: 'contrast(0.95) brightness(1.05) saturate(0.85) sepia(0.2)',
    emoji: '📜'
  },
  {
    id: 'faded_polaroid',
    name: 'Faded Polaroid',
    category: 'polaroid',
    cssFilter: 'contrast(0.85) brightness(1.12) saturate(0.8) sepia(0.1)',
    emoji: '🪁'
  },
  {
    id: 'dreamy_polaroid',
    name: 'Dreamy Polaroid',
    category: 'polaroid',
    cssFilter: 'blur(0.3px) brightness(1.18) contrast(0.9) saturate(1.1) sepia(0.05)',
    emoji: '☁️'
  },
  {
    id: 'pink_polaroid',
    name: 'Pink Polaroid',
    category: 'polaroid',
    cssFilter: 'brightness(1.15) saturate(1.15)',
    overlayClass: 'overlay-pink',
    emoji: '🌸'
  },
  {
    id: 'cream_polaroid',
    name: 'Cream Polaroid',
    category: 'polaroid',
    cssFilter: 'sepia(0.15) brightness(1.12) contrast(0.96) saturate(1.05)',
    emoji: '🍨'
  },
  {
    id: 'retro_instant',
    name: 'Retro Instant',
    category: 'polaroid',
    cssFilter: 'contrast(1.12) saturate(1.1) hue-rotate(-8deg) sepia(0.05)',
    emoji: '⚡'
  },
  {
    id: 'soft_flash',
    name: 'Soft Flash',
    category: 'polaroid',
    cssFilter: 'brightness(1.2) contrast(1.05) saturate(0.95) blur(0.1px)',
    emoji: '🔦'
  },
  {
    id: 'summer_polaroid',
    name: 'Summer Polaroid',
    category: 'polaroid',
    cssFilter: 'saturate(1.3) contrast(1.02) sepia(0.08) brightness(1.08)',
    emoji: '🌞'
  },
  {
    id: 'y2k_polaroid',
    name: 'Y2K Polaroid',
    category: 'polaroid',
    cssFilter: 'brightness(1.12) saturate(1.25) sepia(0.04)',
    overlayClass: 'glow-pink',
    emoji: '🛹'
  },
  {
    id: '90s_instant',
    name: '90s Instant Film',
    category: 'polaroid',
    cssFilter: 'contrast(1.15) grayscale(0.05) sepia(0.15) brightness(0.98)',
    emoji: '🍿'
  },
  {
    id: 'film_border',
    name: 'Film Border Mode',
    category: 'polaroid',
    cssFilter: 'contrast(1.1) brightness(1.02) saturate(0.95)',
    overlayClass: 'overlay-grain',
    emoji: '📼'
  },
  {
    id: 'white_frame',
    name: 'White Frame',
    category: 'polaroid',
    cssFilter: 'saturate(1.05) contrast(1.02) brightness(1.06)',
    emoji: '▫️'
  },
  {
    id: 'torn_edge_filter',
    name: 'Torn Polaroid',
    category: 'polaroid',
    cssFilter: 'sepia(0.1) contrast(1.08) brightness(1.04)',
    emoji: '📝'
  },

  // ==================== 3. Y2K & CUTE FILTERS ====================
  {
    id: 'glitter_glow',
    name: 'Glitter Glow',
    category: 'y2k',
    cssFilter: 'brightness(1.12) contrast(1.15) saturate(1.22)',
    overlayClass: 'glow-pink',
    emoji: '❇️',
    isTrending: true
  },
  {
    id: 'pink_dream',
    name: 'Pink Dream',
    category: 'y2k',
    cssFilter: 'brightness(1.14) contrast(0.98) saturate(1.26)',
    overlayClass: 'overlay-pink',
    emoji: '🎀'
  },
  {
    id: 'chrome_pop',
    name: 'Chrome Pop',
    category: 'y2k',
    cssFilter: 'contrast(1.35) saturate(1.4) brightness(1.08)',
    overlayClass: 'overlay-chrome',
    emoji: '🔮'
  },
  {
    id: 'cyber_princess',
    name: 'Cyber Princess',
    category: 'y2k',
    cssFilter: 'saturate(1.5) contrast(1.12) brightness(1.06)',
    overlayClass: 'overlay-cyan',
    emoji: '👑'
  },
  {
    id: 'angel_aura_y2k',
    name: 'Angel Aura',
    category: 'y2k',
    cssFilter: 'brightness(1.22) saturate(1.3) contrast(0.95)',
    overlayClass: 'overlay-rainbow',
    emoji: '🦋',
    isTrending: true
  },
  {
    id: 'cute_blur',
    name: 'Cute Blur',
    category: 'y2k',
    cssFilter: 'blur(0.5px) brightness(1.18) contrast(0.92) saturate(1.2)',
    overlayClass: 'glow-lavender',
    emoji: '☁️'
  },
  {
    id: 'soft_sparkles',
    name: 'Soft Sparkles',
    category: 'y2k',
    cssFilter: 'brightness(1.2) contrast(1.08) saturate(1.28)',
    overlayClass: 'overlay-purikura',
    emoji: '✨'
  },
  {
    id: 'dreamcore_y2k',
    name: 'Dreamcore',
    category: 'y2k',
    cssFilter: 'contrast(0.85) saturate(1.35) brightness(1.2) sepia(0.08)',
    overlayClass: 'glow-lavender',
    emoji: '🌌'
  },
  {
    id: 'bubblegum_mood',
    name: 'Bubblegum Mood',
    category: 'y2k',
    cssFilter: 'saturate(1.48) brightness(1.1) contrast(1.02)',
    overlayClass: 'overlay-pink',
    emoji: '🍬'
  },
  {
    id: 'fairy_dust',
    name: 'Fairy Dust',
    category: 'y2k',
    cssFilter: 'brightness(1.25) saturate(1.22) contrast(0.98)',
    overlayClass: 'glow-lavender',
    emoji: '🧚‍♀️'
  },
  {
    id: 'kawaii_glow',
    name: 'Kawaii Glow',
    category: 'y2k',
    cssFilter: 'brightness(1.18) contrast(0.96) saturate(1.2)',
    overlayClass: 'overlay-bunny',
    emoji: '🐰'
  },
  {
    id: 'heart_glow',
    name: 'Heart Glow',
    category: 'y2k',
    cssFilter: 'brightness(1.15) contrast(1.05) saturate(1.3)',
    overlayClass: 'overlay-lolita',
    emoji: '💝'
  },
  {
    id: 'blush_filter',
    name: 'Blush Filter',
    category: 'y2k',
    cssFilter: 'sepia(0.08) saturate(1.4) brightness(1.14) contrast(1.02)',
    overlayClass: 'overlay-peach',
    emoji: '💖'
  },
  {
    id: 'doll_skin',
    name: 'Doll Skin',
    category: 'y2k',
    cssFilter: 'brightness(1.24) contrast(0.88) saturate(1.18) blur(0.1px)',
    emoji: '🩰'
  },
  {
    id: 'princess_mode',
    name: 'Princess Mode',
    category: 'y2k',
    cssFilter: 'brightness(1.2) contrast(1.05) saturate(1.25)',
    overlayClass: 'overlay-purikura',
    emoji: '👸'
  },
  {
    id: 'anime_glow',
    name: 'Anime Glow',
    category: 'y2k',
    cssFilter: 'contrast(1.18) saturate(1.4) brightness(1.12) blur(0.15px)',
    emoji: '💫'
  },

  // ==================== 4. AESTHETIC FILTERS ====================
  {
    id: 'soft_girl',
    name: 'Soft Girl',
    category: 'aesthetic',
    cssFilter: 'brightness(1.14) contrast(0.96) saturate(1.24) sepia(0.05)',
    overlayClass: 'overlay-pink',
    emoji: '🎀',
    isTrending: true
  },
  {
    id: 'clean_girl',
    name: 'Clean Girl',
    category: 'aesthetic',
    cssFilter: 'contrast(1.04) brightness(1.06) saturate(1.08) sepia(0.02)',
    emoji: '🚿'
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    category: 'aesthetic',
    cssFilter: 'sepia(0.32) saturate(1.42) contrast(1.02) brightness(1.12)',
    emoji: '🌇',
    isTrending: true
  },
  {
    id: 'moody_coffee',
    name: 'Moody Coffee Shop',
    category: 'aesthetic',
    cssFilter: 'sepia(0.24) contrast(1.12) brightness(0.92) saturate(0.95)',
    emoji: '☕'
  },
  {
    id: 'pinterest_aesthetic',
    name: 'Pinterest Aesthetic',
    category: 'aesthetic',
    cssFilter: 'contrast(0.96) brightness(1.08) saturate(1.1) sepia(0.08)',
    emoji: '📌'
  },
  {
    id: 'vintage_tumblr',
    name: 'Vintage Tumblr',
    category: 'aesthetic',
    cssFilter: 'contrast(0.88) saturate(0.85) sepia(0.12) brightness(1.04)',
    emoji: '🪁'
  },
  {
    id: 'soft_pastel_aes',
    name: 'Soft Pastel',
    category: 'aesthetic',
    cssFilter: 'brightness(1.18) contrast(0.92) saturate(1.28) sepia(0.02)',
    overlayClass: 'overlay-lolita',
    emoji: '🌸'
  },
  {
    id: 'beige_mood',
    name: 'Beige Mood',
    category: 'aesthetic',
    cssFilter: 'sepia(0.18) contrast(0.98) brightness(1.08) saturate(0.9)',
    emoji: '🪵'
  },
  {
    id: 'warm_cozy',
    name: 'Warm Cozy',
    category: 'aesthetic',
    cssFilter: 'sepia(0.2) saturate(1.2) brightness(1.05) contrast(0.95)',
    emoji: '🧸'
  },
  {
    id: 'indie_film',
    name: 'Indie Film',
    category: 'aesthetic',
    cssFilter: 'contrast(1.2) saturate(1.35) brightness(1.02) hue-rotate(-5deg)',
    emoji: '🎸'
  },
  {
    id: 'cloudy_mood_aes',
    name: 'Cloudy Mood',
    category: 'aesthetic',
    cssFilter: 'blur(0.2px) brightness(1.14) contrast(0.94) saturate(1.08)',
    overlayClass: 'overlay-bunny',
    emoji: '☁️'
  },
  {
    id: 'sunset_dream',
    name: 'Sunset Dream',
    category: 'aesthetic',
    cssFilter: 'sepia(0.18) saturate(1.5) hue-rotate(-12deg) brightness(1.1)',
    emoji: '🌅'
  },
  {
    id: 'dreamy_glow_aes',
    name: 'Dreamy Glow',
    category: 'aesthetic',
    cssFilter: 'blur(0.35px) brightness(1.2) contrast(0.92) saturate(1.12)',
    overlayClass: 'glow-lavender',
    emoji: '✨'
  },
  {
    id: 'calm_blue',
    name: 'Calm Blue Tone',
    category: 'aesthetic',
    cssFilter: 'hue-rotate(180deg) saturate(0.92) contrast(1.05) brightness(1.04)',
    emoji: '🐳'
  },
  {
    id: 'cotton_candy_aes',
    name: 'Cotton Candy',
    category: 'aesthetic',
    cssFilter: 'brightness(1.16) contrast(0.9) saturate(1.35) hue-rotate(-20deg)',
    overlayClass: 'overlay-rainbow',
    emoji: '🍭'
  },

  // ==================== 5. RETRO INTERNET / OLD CAMERAS ====================
  {
    id: 'vhs_cam',
    name: 'VHS Cam',
    category: 'retro',
    cssFilter: 'contrast(0.9) brightness(1.06) saturate(0.88) sepia(0.08)',
    overlayClass: 'overlay-vhs',
    emoji: '📟',
    isTrending: true
  },
  {
    id: 'vhs_static',
    name: 'VHS Static',
    category: 'retro',
    cssFilter: 'contrast(0.96) brightness(1.12) saturate(0.75)',
    overlayClass: 'overlay-grain',
    emoji: '📼'
  },
  {
    id: 'crt_screen',
    name: 'CRT Screen',
    category: 'retro',
    cssFilter: 'contrast(1.1) brightness(0.92) saturate(0.98)',
    emoji: '📺'
  },
  {
    id: 'pixel_cam',
    name: 'Pixel Cam',
    category: 'retro',
    cssFilter: 'contrast(1.2) saturation(1.1) brightness(0.98) contrast(1.15)',
    emoji: '👾'
  },
  {
    id: 'webcam_2005',
    name: '2005 Webcam',
    category: 'retro',
    cssFilter: 'contrast(1.25) brightness(0.98) saturate(0.92)',
    overlayClass: 'overlay-digicam',
    emoji: '💻',
    isTrending: true
  },
  {
    id: 'retro_laptop',
    name: 'Retro Laptop Camera',
    category: 'retro',
    cssFilter: 'contrast(1.18) saturate(0.9) brightness(1.04)',
    overlayClass: 'overlay-vhs',
    emoji: '🖥️'
  },
  {
    id: 'nokia_cam',
    name: 'Nokia Camera',
    category: 'retro',
    cssFilter: 'contrast(1.3) brightness(0.95) saturate(0.8)',
    emoji: '📱'
  },
  {
    id: 'flip_phone',
    name: 'Flip Phone Camera',
    category: 'retro',
    cssFilter: 'contrast(1.4) saturate(0.85) brightness(0.94) blur(0.25px)',
    emoji: '🤳'
  },
  {
    id: 'old_flash_phone',
    name: 'Old Phone Flash',
    category: 'retro',
    cssFilter: 'brightness(1.25) contrast(1.15) saturate(0.88)',
    emoji: '🔦'
  },
  {
    id: 'lq_funny',
    name: 'LQ Funny Cam',
    category: 'retro',
    cssFilter: 'contrast(1.5) saturate(1.2) brightness(1.12)',
    emoji: '🔥'
  },
  {
    id: 'myspace_era',
    name: 'MySpace Era',
    category: 'retro',
    cssFilter: 'contrast(0.8) brightness(1.15) saturate(0.85) sepia(0.12)',
    emoji: '🕸️'
  },
  {
    id: 'y2k_digicam_retro',
    name: 'Y2K Digicam',
    category: 'retro',
    cssFilter: 'contrast(1.22) brightness(0.97) saturate(0.96) sepia(0.04)',
    overlayClass: 'overlay-digicam',
    emoji: '📠'
  },

  // ==================== 6. FILM & CINEMATIC ====================
  {
    id: 'kodak_film',
    name: 'Kodak Film',
    category: 'cinematic',
    cssFilter: 'sepia(0.14) contrast(1.12) saturate(1.18) brightness(1.04)',
    emoji: '🎞️',
    isTrending: true
  },
  {
    id: 'fuji_film',
    name: 'Fuji Film',
    category: 'cinematic',
    cssFilter: 'hue-rotate(10deg) saturation(1.15) contrast(1.1) brightness(1.02)',
    emoji: '🗻'
  },
  {
    id: 'cine_warm',
    name: 'Cinematic Warm',
    category: 'cinematic',
    cssFilter: 'sepia(0.20) contrast(1.08) saturate(1.22) brightness(1.06)',
    emoji: '🏺'
  },
  {
    id: 'cine_cool',
    name: 'Cinematic Cool',
    category: 'cinematic',
    cssFilter: 'hue-rotate(190deg) contrast(1.14) saturate(1.12) brightness(1.02)',
    emoji: '🦕'
  },
  {
    id: 'movie_scene',
    name: 'Movie Scene',
    category: 'cinematic',
    cssFilter: 'contrast(1.18) saturate(1.08) brightness(0.96) sepia(0.05)',
    emoji: '🎬'
  },
  {
    id: 'soft_cinema',
    name: 'Soft Cinema',
    category: 'cinematic',
    cssFilter: 'contrast(0.96) brightness(1.1) saturate(1.05) blur(0.1px)',
    emoji: '🍿'
  },
  {
    id: 'moody_cinema',
    name: 'Moody Cinema',
    category: 'cinematic',
    cssFilter: 'contrast(1.25) saturate(0.92) brightness(0.88) sepia(0.08)',
    emoji: '🪐'
  },
  {
    id: 'vintage_movie',
    name: 'Vintage Movie',
    category: 'cinematic',
    cssFilter: 'contrast(1.08) grayscale(0.1) sepia(0.18) brightness(0.95)',
    overlayClass: 'overlay-grain',
    emoji: '🎥'
  },
  {
    id: 'retro_hollywood',
    name: 'Retro Hollywood',
    category: 'cinematic',
    cssFilter: 'sepia(0.12) contrast(1.3) brightness(1.06) saturate(0.8)',
    emoji: '⭐'
  },
  {
    id: 'film_grain_cine',
    name: 'Film Grain',
    category: 'cinematic',
    cssFilter: 'contrast(1.08) sepia(0.04)',
    overlayClass: 'overlay-grain',
    emoji: '🧂'
  },
  {
    id: 'dust_scratches',
    name: 'Dust & Scratches',
    category: 'cinematic',
    cssFilter: 'contrast(1.1) brightness(0.98)',
    overlayClass: 'overlay-vhs',
    emoji: '✂️'
  },
  {
    id: 'grainy_vintage',
    name: 'Grainy Vintage',
    category: 'cinematic',
    cssFilter: 'sepia(0.16) contrast(1.12) brightness(1.02)',
    overlayClass: 'overlay-grain',
    emoji: '📦'
  },

  // ==================== 7. ROMANTIC / CUTE MOOD ====================
  {
    id: 'soft_pink_romance',
    name: 'Soft Pink Romance',
    category: 'romantic',
    cssFilter: 'brightness(1.14) contrast(0.98) saturate(1.28)',
    overlayClass: 'overlay-pink',
    emoji: '💌',
    isTrending: true
  },
  {
    id: 'valentine_glow',
    name: 'Valentine Glow',
    category: 'romantic',
    cssFilter: 'brightness(1.18) contrast(1.04) saturate(1.32)',
    overlayClass: 'overlay-purikura',
    emoji: '💝'
  },
  {
    id: 'blush_mood',
    name: 'Blush Mood',
    category: 'romantic',
    cssFilter: 'sepia(0.08) saturate(1.4) brightness(1.12) contrast(1.04)',
    overlayClass: 'overlay-peach',
    emoji: '🍑',
    isTrending: true
  },
  {
    id: 'heart_sparkle',
    name: 'Heart Sparkle',
    category: 'romantic',
    cssFilter: 'brightness(1.2) saturate(1.25) contrast(1.05)',
    overlayClass: 'overlay-purikura',
    emoji: '💖'
  },
  {
    id: 'couple_glow',
    name: 'Couple Mode Glow',
    category: 'romantic',
    cssFilter: 'blur(0.2px) brightness(1.22) contrast(0.9) saturate(1.22)',
    overlayClass: 'glow-lavender',
    emoji: '💑'
  },
  {
    id: 'dream_romance',
    name: 'Dream Romance',
    category: 'romantic',
    cssFilter: 'blur(0.35px) brightness(1.18) saturate(1.15)',
    overlayClass: 'overlay-lolita',
    emoji: '🎈'
  },
  {
    id: 'soft_angel',
    name: 'Soft Angel',
    category: 'romantic',
    cssFilter: 'brightness(1.25) contrast(0.92) saturate(1.18)',
    overlayClass: 'overlay-bunny',
    emoji: '👼'
  },
  {
    id: 'cotton_candy_rom',
    name: 'Cotton Candy Romance',
    category: 'romantic',
    cssFilter: 'brightness(1.16) contrast(0.94) saturate(1.32)',
    overlayClass: 'overlay-rainbow',
    emoji: '🍭'
  },

  // ==================== 8. COLOR FILTERS ====================
  {
    id: 'bright_pop',
    name: 'Bright Pop',
    category: 'color',
    cssFilter: 'saturate(1.65) contrast(1.12) brightness(1.08)',
    emoji: '💥'
  },
  {
    id: 'saturated_colors',
    name: 'Saturated Colors',
    category: 'color',
    cssFilter: 'saturate(1.8) contrast(1.05)',
    emoji: '🎨'
  },
  {
    id: 'pastel_colors',
    name: 'Pastel Colors',
    category: 'color',
    cssFilter: 'brightness(1.22) contrast(0.85) saturate(1.4)',
    emoji: '🍡'
  },
  {
    id: 'neon_pop',
    name: 'Neon Pop',
    category: 'color',
    cssFilter: 'saturate(1.9) contrast(1.25) brightness(1.04)',
    emoji: '⚡'
  },
  {
    id: 'cool_blue_color',
    name: 'Cool Blue',
    category: 'color',
    cssFilter: 'hue-rotate(20deg) saturate(1.15) contrast(1.05)',
    emoji: '🐠'
  },
  {
    id: 'warm_orange',
    name: 'Warm Orange',
    category: 'color',
    cssFilter: 'sepia(0.25) saturate(1.4) hue-rotate(-8deg)',
    emoji: '🍊'
  },
  {
    id: 'purple_glow_color',
    name: 'Purple Glow',
    category: 'color',
    cssFilter: 'hue-rotate(30deg) saturate(1.25) brightness(1.1)',
    overlayClass: 'glow-lavender',
    emoji: '☂️'
  },
  {
    id: 'mint_fresh',
    name: 'Mint Fresh',
    category: 'color',
    cssFilter: 'hue-rotate(100deg) saturate(1.1) brightness(1.05) contrast(1.02)',
    emoji: '🌱'
  },
  {
    id: 'peach_mood_color',
    name: 'Peach Mood',
    category: 'color',
    cssFilter: 'sepia(0.12) saturate(1.48) brightness(1.15)',
    overlayClass: 'overlay-peach',
    emoji: '🍑'
  },
  {
    id: 'pink_bloom',
    name: 'Pink Bloom',
    category: 'color',
    cssFilter: 'saturate(1.35) brightness(1.16)',
    overlayClass: 'overlay-pink',
    emoji: '🏵️'
  },
  {
    id: 'lavender_glow_color',
    name: 'Lavender Glow',
    category: 'color',
    cssFilter: 'brightness(1.18) saturate(1.24)',
    overlayClass: 'glow-lavender',
    emoji: '🪻'
  },

  // ==================== 9. FUN & VIRAL FILTERS ====================
  {
    id: 'cartoon_cam',
    name: 'Cartoon Cam',
    category: 'viral',
    cssFilter: 'contrast(1.58) saturate(1.48) sepia(0.05)',
    emoji: '🤡'
  },
  {
    id: 'anime_cam',
    name: 'Anime Cam',
    category: 'viral',
    cssFilter: 'brightness(1.18) contrast(1.12) saturate(1.42)',
    emoji: '🎏'
  },
  {
    id: 'comic_book',
    name: 'Comic Book',
    category: 'viral',
    cssFilter: 'contrast(1.68) saturate(0.5) sepia(0.1)',
    emoji: '📰'
  },
  {
    id: 'mirror_mode_filt',
    name: 'Mirror Mode',
    category: 'viral',
    cssFilter: 'brightness(1.05) contrast(1.02)',
    emoji: '🪞'
  },
  {
    id: 'fisheye_lens_filt',
    name: 'Fisheye Lens',
    category: 'viral',
    cssFilter: 'contrast(1.15) brightness(1.02)',
    emoji: '🐟'
  },
  {
    id: 'beauty_glow_viral',
    name: 'Beauty Glow',
    category: 'viral',
    cssFilter: 'brightness(1.2) contrast(0.92) saturate(1.18) blur(0.1px)',
    overlayClass: 'overlay-purikura',
    emoji: '💅',
    isTrending: true
  },
  {
    id: 'funny_distortion',
    name: 'Funny Distortion',
    category: 'viral',
    cssFilter: 'contrast(1.35) saturate(1.5)',
    emoji: '🤪'
  },
  {
    id: 'bubble_lens_filt',
    name: 'Bubble Lens',
    category: 'viral',
    cssFilter: 'brightness(1.12) blur(0.2px)',
    emoji: '🫧'
  },
  {
    id: 'tiny_face_filt',
    name: 'Tiny Face Effect',
    category: 'viral',
    cssFilter: 'saturate(1.2) brightness(1.06)',
    emoji: '👶'
  },
  {
    id: 'big_eyes_filt',
    name: 'Big eyes Cute',
    category: 'viral',
    cssFilter: 'brightness(1.18) saturate(1.25) contrast(1.05)',
    emoji: '👁️'
  }
];

export const FILTER_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🌈' },
  { id: 'favorite', name: 'Favorites', emoji: '⭐' },
  { id: 'trending', name: 'Trending', emoji: '🔥' },
  { id: 'classic', name: 'Classic Cam', emoji: '📷' },
  { id: 'polaroid', name: 'Polaroids', emoji: '🖼️' },
  { id: 'y2k', name: 'Y2K Cute', emoji: '👑' },
  { id: 'aesthetic', name: 'Aesthetic', emoji: '🎀' },
  { id: 'retro', name: 'Retro Net', emoji: '📟' },
  { id: 'cinematic', name: 'Cinematic', emoji: '🎥' },
  { id: 'romantic', name: 'Romance', emoji: '💝' },
  { id: 'color', name: 'Colors', emoji: '🎨' },
  { id: 'viral', name: 'Fun Viral', emoji: '🤪' }
];
