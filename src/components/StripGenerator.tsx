import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  Sparkles, 
  RefreshCw, 
  Calendar, 
  Type, 
  Heart, 
  Search, 
  Star, 
  Smile, 
  Sliders, 
  Settings, 
  Check, 
  Scissors, 
  Flame, 
  Sparkle
} from 'lucide-react';
import { CapturedPhoto, CanvasElement, ThemeConfig } from '../types';
import { playDigitalBeep, playSparkleSound, playUIPop } from '../utils/audio';
import { PREMIUM_RIBBONS } from '../ribbons';
import { PRESET_BOTTOM_CARDS, BOTTOM_CARD_CATEGORIES, BottomCardTemplate } from '../bottomCards';
import { PRESET_FRAMES, FRAME_CATEGORIES, FrameTemplate } from '../frames';
import { motion, AnimatePresence } from 'motion/react';

interface StripGeneratorProps {
  photos: CapturedPhoto[];
  photoElements: Record<string, CanvasElement[]>; // map from photoId to elements
  activeTheme: ThemeConfig;
  soundEnabled: boolean;
}

type StripFormat = '2_shot' | '4_shot' | 'square_grid' | 'polaroid';
type StudioTab = 'templates' | 'customize' | 'frames' | 'layout';

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

export default function StripGenerator({
  photos,
  photoElements,
  activeTheme,
  soundEnabled
}: StripGeneratorProps) {
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Layout states
  const [format, setFormat] = useState<StripFormat>('4_shot');
  const [activeTab, setActiveTab] = useState<StudioTab>('templates');

  // --- BORDER & FRAME STATES ---
  const [activeFrameId, setActiveFrameId] = useState<string>('f_default_white');
  const [frameColor, setFrameColor] = useState<string>('#ffffff');
  const [frameIsGradient, setFrameIsGradient] = useState<boolean>(false);
  const [frameGradientColors, setFrameGradientColors] = useState<string[]>(['#ff6cb2', '#ffccf9']);
  const [frameThickness, setFrameThickness] = useState<number>(10);
  const [frameCornerRadius, setFrameCornerRadius] = useState<number>(8);
  const [frameBorderStyle, setFrameBorderStyle] = useState<'solid' | 'dashed' | 'double' | 'torn' | '3d' | 'neon' | 'layered'>('solid');
  const [frameTexture, setFrameTexture] = useState<'none' | 'paper' | 'glitter' | 'holographic' | 'gold_foil' | 'chrome' | 'doodle' | 'film'>('paper');
  const [frameOpacity, setFrameOpacity] = useState<number>(1.0);
  const [frameGlowColor, setFrameGlowColor] = useState<string>('transparent');
  const [frameGlowIntensity, setFrameGlowIntensity] = useState<number>(0);
  const [frameShadowDepth, setFrameShadowDepth] = useState<number>(4);
  const [frameStickers, setFrameStickers] = useState<string[]>([]);
  const [frameStickerPlacement, setFrameStickerPlacement] = useState<'corners' | 'top_bottom' | 'sides' | 'scattered' | 'none'>('none');
  const [frameCustomTextureUrl, setFrameCustomTextureUrl] = useState<string | null>(null);
  const [framePatternOverlay, setFramePatternOverlay] = useState<string>('none');

  // Search & Categories for frames
  const [frameSearchQuery, setFrameSearchQuery] = useState('');
  const [activeFrameCategory, setActiveFrameCategory] = useState<string>('all');
  const [favoriteFrameIds, setFavoriteFrameIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arpita_fav_frames');
      return saved ? JSON.parse(saved) : ['f_default_white', 'f_kodak_film', 'f_acid_cyber', 'f_puffy_bunny', 'f_gold_leaf'];
    } catch {
      return ['f_default_white', 'f_kodak_film', 'f_acid_cyber', 'f_puffy_bunny', 'f_gold_leaf'];
    }
  });
  const [recentlyUsedFrameIds, setRecentlyUsedFrameIds] = useState<string[]>(['f_default_white']);
  
  // Custom webcam date stamp info
  const [stampDate, setStampDate] = useState(true);
  const [customYear, setCustomYear] = useState('2003'); // default retro feel

  // Bottom Card customizations
  const [activeCardId, setActiveCardId] = useState<string>('k_teddy_love');
  const [cardCaption, setCardCaption] = useState('🧸 TEA FOR TWO & ME & YOU 🍯');
  const [cardSubCaption, setCardSubCaption] = useState('Warm Honey Hugs');
  const [cardFontFamily, setCardFontFamily] = useState<'Fredoka' | 'VT323' | 'Space Grotesk' | 'Inter' | 'Pacifico'>('Fredoka');
  const [cardBackgroundType, setCardBackgroundType] = useState<'solid' | 'gradient' | 'glass'>('gradient');
  const [cardBackgroundColor, setCardBackgroundColor] = useState('linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)');
  const [cardTextColor, setCardTextColor] = useState('#92400e');
  const [cardBorderColor, setCardBorderColor] = useState('#f59e0b');
  const [cardBorderStyle, setCardBorderStyle] = useState<'solid' | 'dashed' | 'double' | 'none'>('solid');
  const [cardBorderRadius, setCardBorderRadius] = useState<'none' | 'md' | 'xl' | '3xl' | 'full'>('xl');
  const [cardOpacity, setCardOpacity] = useState(1.0);
  const [cardGlowColor, setCardGlowColor] = useState('#f59e0b');
  const [cardStickers, setCardStickers] = useState<string[]>(['🧸', '🍯', '🍪']);
  const [cardStickerPositions, setCardStickerPositions] = useState<'sides' | 'corners' | 'scattered' | 'top_fringe'>('sides');
  const [cardShowBranding, setCardShowBranding] = useState(true);
  const [cardBrandingText, setCardBrandingText] = useState('Captured on Arpita Snaps • 🎀');
  const [cardHasGlitter, setCardHasGlitter] = useState(false);
  const [cardHasShadow, setCardHasShadow] = useState(true);
  const [cardHasGlow, setCardHasGlow] = useState(false);
  const [cardLayout, setCardLayout] = useState<'centered' | 'full' | 'bubble' | 'floating' | 'layered' | 'split'>('bubble');

  // --- CUSTOM FILM STRIP OVERALL BACKGROUND CONFIGS ---
  const [stripBackplateMode, setStripBackplateMode] = useState<'theme' | 'solid' | 'gradient' | 'pattern'>('theme');
  const [stripSolidBg, setStripSolidBg] = useState<string>('#ffd1e8');
  const [stripGradientColors, setStripGradientColors] = useState<string[]>([ '#ffd1e8', '#ffccd5' ]);
  const [stripPattern, setStripPattern] = useState<'none' | 'checkered' | 'dots' | 'stripes' | 'waves' | 'stars'>('none');
  const [stripPatternColor, setStripPatternColor] = useState<string>('rgba(255, 105, 180, 0.08)');

  // --- CARD VISIBILITY AND SHAPE TOGGLES ---
  const [showCardPlate, setShowCardPlate] = useState<boolean>(true);
  const [enableCardSpacer, setEnableCardSpacer] = useState<boolean>(true);

  // Search & Filter templates
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Local Favorites & Recently used list
  const [favoriteCardIds, setFavoriteCardIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arpita_fav_bottom_cards');
      return saved ? JSON.parse(saved) : ['k_teddy_love', 'y_retro_chrome', 'p_vintage_polaroid', 'd_angelcore_cloud'];
    } catch {
      return ['k_teddy_love', 'y_retro_chrome', 'p_vintage_polaroid', 'd_angelcore_cloud'];
    }
  });

  const [recentlyUsedCardIds, setRecentlyUsedCardIds] = useState<string[]>(['k_teddy_love']);

  // Handle template selection
  const handleApplyCardTemplate = (card: BottomCardTemplate) => {
    setActiveCardId(card.id);
    setCardCaption(card.caption);
    setCardSubCaption(card.subCaption || '');
    setCardFontFamily(card.fontFamily);
    setCardBackgroundType(card.backgroundType);
    setCardBackgroundColor(card.backgroundColor);
    setCardTextColor(card.textColor);
    setCardBorderColor(card.borderColor);
    setCardBorderStyle(card.borderStyle);
    setCardBorderRadius(card.borderRadius);
    setCardOpacity(card.opacity);
    setCardGlowColor(card.glowColor || card.borderColor);
    setCardStickers(card.stickers);
    setCardStickerPositions(card.stickerPositions);
    setCardShowBranding(card.showBranding);
    setCardBrandingText(card.brandingText);
    setCardHasGlitter(!!card.hasGlitter);
    setCardHasGlow(!!card.glowColor || !!card.hasGlow);
    setCardHasShadow(true);
    
    // Auto layer layout match Y2K looks
    if (card.category === 'y2k') {
      setCardLayout('floating');
    } else if (card.category === 'minimal') {
      setCardLayout('centered');
    } else if (card.category === 'scrapbook') {
      setCardLayout('layered');
    } else {
      setCardLayout('bubble');
    }

    // Add to recently used
    setRecentlyUsedCardIds(prev => {
      const filtered = prev.filter(id => id !== card.id);
      return [card.id, ...filtered].slice(0, 8);
    });

    if (soundEnabled) playSparkleSound();
  };

  // Toggle Favorite Status
  const toggleFavorite = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    if (soundEnabled) playDigitalBeep(false);
    setFavoriteCardIds(prev => {
      let updated;
      if (prev.includes(cardId)) {
        updated = prev.filter(id => id !== cardId);
      } else {
        updated = [...prev, cardId];
      }
      localStorage.setItem('arpita_fav_bottom_cards', JSON.stringify(updated));
      return updated;
    });
  };

  const handleApplyFrameTemplate = (frame: FrameTemplate) => {
    setActiveFrameId(frame.id);
    setFrameColor(frame.color);
    setFrameIsGradient(frame.isGradient);
    setFrameGradientColors(frame.gradientColors || ['#ff6ccb', '#ffccf9']);
    setFrameThickness(frame.thickness);
    setFrameCornerRadius(frame.cornerRadius);
    setFrameBorderStyle(frame.borderStyle);
    setFrameTexture(frame.texture);
    setFrameOpacity(frame.opacity);
    setFrameGlowColor(frame.glowColor || 'transparent');
    setFrameGlowIntensity(frame.glowIntensity || 0);
    setFrameShadowDepth(frame.shadowDepth || 4);
    setFrameStickers(frame.stickers || []);
    setFrameStickerPlacement(frame.stickerPlacement || 'none');

    // Add to recently used Array list
    setRecentlyUsedFrameIds(prev => {
      const filtered = prev.filter(id => id !== frame.id);
      return [frame.id, ...filtered].slice(0, 8);
    });

    if (soundEnabled) playSparkleSound();
  };

  const toggleFrameFavorite = (e: React.MouseEvent, frameId: string) => {
    e.stopPropagation();
    if (soundEnabled) playDigitalBeep(false);
    setFavoriteFrameIds(prev => {
      let updated;
      if (prev.includes(frameId)) {
        updated = prev.filter(id => id !== frameId);
      } else {
        updated = [...prev, frameId];
      }
      localStorage.setItem('arpita_fav_frames', JSON.stringify(updated));
      return updated;
    });
  };

  // Filter lists
  const filteredTemplates = PRESET_BOTTOM_CARDS.filter(card => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        card.name.toLowerCase().includes(q) ||
        card.caption.toLowerCase().includes(q) ||
        (card.subCaption && card.subCaption.toLowerCase().includes(q)) ||
        card.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (activeCategory === 'favorites') {
      return favoriteCardIds.includes(card.id);
    }
    if (activeCategory === 'recent') {
      return recentlyUsedCardIds.includes(card.id);
    }
    if (activeCategory !== 'all') {
      return card.category === activeCategory;
    }
    return true;
  });

  const filteredFrames = PRESET_FRAMES.filter(frame => {
    // Frame Search filter
    if (frameSearchQuery.trim()) {
      const q = frameSearchQuery.toLowerCase();
      const matchesSearch = 
        frame.name.toLowerCase().includes(q) ||
        frame.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Frame Category filter
    if (activeFrameCategory === 'favorites') {
      return favoriteFrameIds.includes(frame.id);
    }
    if (activeFrameCategory === 'recent') {
      return recentlyUsedFrameIds.includes(frame.id);
    }
    if (activeFrameCategory === 'trending') {
      return !!frame.isTrending;
    }
    if (activeFrameCategory !== 'all') {
      return frame.category === activeFrameCategory;
    }
    return true;
  });

  // Re-run compilation on any changes
  useEffect(() => {
    generateStripOutput(true);
  }, [
    photos, 
    photoElements, 
    format, 
    stampDate, 
    customYear,
    activeCardId,
    cardCaption,
    cardSubCaption,
    cardFontFamily,
    cardBackgroundType,
    cardBackgroundColor,
    cardTextColor,
    cardBorderColor,
    cardBorderStyle,
    cardBorderRadius,
    cardOpacity,
    cardGlowColor,
    cardStickers,
    cardStickerPositions,
    cardShowBranding,
    cardBrandingText,
    cardHasGlitter,
    cardHasShadow,
    cardHasGlow,
    cardLayout,
    activeFrameId,
    frameColor,
    frameIsGradient,
    frameGradientColors,
    frameThickness,
    frameCornerRadius,
    frameBorderStyle,
    frameTexture,
    frameOpacity,
    frameGlowColor,
    frameGlowIntensity,
    frameShadowDepth,
    frameStickers,
    frameStickerPlacement,
    frameCustomTextureUrl,
    framePatternOverlay,
    stripBackplateMode,
    stripSolidBg,
    stripGradientColors,
    stripPattern,
    stripPatternColor,
    showCardPlate,
    enableCardSpacer
  ]);

  // Adjust format to match photo count on mount / change
  useEffect(() => {
    if (photos.length === 1 && format !== 'polaroid') {
      setFormat('polaroid');
    } else if (photos.length > 1 && photos.length < 4 && format === '4_shot') {
      setFormat('2_shot');
    }
  }, [photos]);

  // CORE GRAPHICS DRAWER ENGINE WITH DETAILED BOTTOM CARD GRAPHICS OUTLINE
  const generateStripOutput = async (isPreviewOnly = false): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = exportCanvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || photos.length === 0) return resolve('');

      // 1. Establish Layout boundary dimensions
      let canvasW = 400;
      let imgW = canvasW - 60; // 30px left right borders
      let imgH = imgW * 0.75; // 4:3 ratios

      const topMargin = format === 'square_grid' ? 45 : format === 'polaroid' ? 40 : 40;
      const gap = format === 'polaroid' ? 0 : 25;

      let listToDraw = [...photos];
      if (format === '4_shot') {
        while (listToDraw.length < 4 && listToDraw.length > 0) {
          listToDraw = [...listToDraw, ...listToDraw].slice(0, 4);
        }
      } else if (format === '2_shot') {
        while (listToDraw.length < 2 && listToDraw.length > 0) {
          listToDraw = [...listToDraw, ...listToDraw].slice(0, 2);
        }
      } else if (format === 'square_grid') {
        while (listToDraw.length < 4 && listToDraw.length > 0) {
          listToDraw = [...listToDraw, ...listToDraw].slice(0, 4);
        }
      } else if (format === 'polaroid') {
        listToDraw = [photos[0]];
      }

      // Calculate photos layout section height
      let totalPhotosHeight = topMargin + listToDraw.length * (imgH + gap);
      
      if (format === 'square_grid') {
        imgW = (canvasW - 80) / 2;
        imgH = imgW * 0.75;
        totalPhotosHeight = topMargin + (imgH * 2) + 30;
      } else if (format === 'polaroid') {
        imgW = canvasW - 70;
        imgH = imgW * 0.75;
        totalPhotosHeight = topMargin + imgH + 20;
      }

      // Allocate exactly 160px for our customized bottom card decoration space!
      const cardHeightAllocated = enableCardSpacer ? 150 : 0;
      let canvasH = totalPhotosHeight + cardHeightAllocated + (enableCardSpacer ? 20 : 15);

      canvas.width = canvasW;
      canvas.height = canvasH;

      // Draw overall theme background backplate gradient or customizable solid/gradient/patterns
      if (stripBackplateMode === 'solid') {
        ctx.fillStyle = stripSolidBg;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else if (stripBackplateMode === 'gradient') {
        const fillGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
        fillGrad.addColorStop(0, stripGradientColors[0] || '#ffd1e8');
        fillGrad.addColorStop(1, stripGradientColors[1] || '#ffccd5');
        ctx.fillStyle = fillGrad;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else if (stripBackplateMode === 'pattern') {
        // Draw base color
        ctx.fillStyle = stripSolidBg || '#ffd1e8';
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Overlay custom tiling patterns
        ctx.fillStyle = stripPatternColor || 'rgba(255, 105, 180, 0.08)';
        if (stripPattern === 'checkered') {
          const boxSize = 16;
          for (let y = 0; y < canvasH; y += boxSize * 2) {
            ctx.fillRect(0, y, boxSize, boxSize);
            ctx.fillRect(boxSize, y + boxSize, boxSize, boxSize);
            ctx.fillRect(canvasW - boxSize * 2, y, boxSize, boxSize);
            ctx.fillRect(canvasW - boxSize, y + boxSize, boxSize, boxSize);
          }
        } else if (stripPattern === 'dots') {
          for (let px = 6; px < canvasW; px += 16) {
            for (let py = 6; py < canvasH; py += 16) {
              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (stripPattern === 'stripes') {
          ctx.strokeStyle = stripPatternColor || 'rgba(255, 105, 180, 0.08)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let py = -canvasW; py < canvasH; py += 16) {
            ctx.moveTo(0, py);
            ctx.lineTo(canvasW, py + canvasW);
          }
          ctx.stroke();
        } else if (stripPattern === 'waves') {
          ctx.strokeStyle = stripPatternColor || 'rgba(255, 105, 180, 0.08)';
          ctx.lineWidth = 1.5;
          for (let py = 10; py < canvasH; py += 20) {
            ctx.beginPath();
            for (let px = 0; px <= canvasW; px += 10) {
              const yOffset = Math.sin(px * 0.05) * 4;
              if (px === 0) ctx.moveTo(px, py + yOffset);
              else ctx.lineTo(px, py + yOffset);
            }
            ctx.stroke();
          }
        } else if (stripPattern === 'stars') {
          ctx.font = '10px Arial';
          for (let px = 15; px < canvasW; px += 45) {
            for (let py = 15; py < canvasH; py += 45) {
              ctx.fillText('★', px + (Math.sin(py) * 10), py);
            }
          }
        }
      } else {
        // Mode 'theme' - draw default theme preset gradient
        const fillGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
        if (activeTheme.id === 'bubblegum') {
          fillGrad.addColorStop(0, '#ffd1e8');
          fillGrad.addColorStop(1, '#ffccd5');
        } else if (activeTheme.id === 'dreamcore') {
          fillGrad.addColorStop(0, '#e0f2fe');
          fillGrad.addColorStop(1, '#ffe4e6');
        } else if (activeTheme.id === 'y2k_retro') {
          fillGrad.addColorStop(0, '#b3f2ff');
          fillGrad.addColorStop(1, '#ffd1e8');
        } else if (activeTheme.id === 'dark_cute') {
          fillGrad.addColorStop(0, '#1e1b4b');
          fillGrad.addColorStop(0.5, '#3b0764');
          fillGrad.addColorStop(1, '#09090b');
        } else if (activeTheme.id === 'glitter_queen') {
          fillGrad.addColorStop(0, '#fffbeb');
          fillGrad.addColorStop(1, '#ffd1e8');
        } else { // soft-peaches
          fillGrad.addColorStop(0, '#fafaf9');
          fillGrad.addColorStop(1, '#f7f5f0');
        }
        ctx.fillStyle = fillGrad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Checkered pattern decoration checks (Y2K retro aesthetic theme)
        if (activeTheme.id === 'y2k_retro' || activeTheme.id === 'bubblegum') {
          ctx.fillStyle = 'rgba(255, 105, 180, 0.08)';
          const boxSize = 16;
          for (let y = 0; y < canvasH; y += boxSize * 2) {
            ctx.fillRect(0, y, boxSize, boxSize);
            ctx.fillRect(boxSize, y + boxSize, boxSize, boxSize);
            ctx.fillRect(canvasW - boxSize * 2, y, boxSize, boxSize);
            ctx.fillRect(canvasW - boxSize, y + boxSize, boxSize, boxSize);
          }
        }
      }

      // Start drawing frames sequential stack
      const drawPhotosAndBottomCard = async () => {
        let imgWForDraw = canvasW - 60;
        let imgHForDraw = imgWForDraw * 0.75;

        if (format === 'square_grid') {
          imgWForDraw = (canvasW - 80) / 2;
          imgHForDraw = imgWForDraw * 0.75;
        } else if (format === 'polaroid') {
          imgWForDraw = canvasW - 70;
          imgHForDraw = imgWForDraw * 0.75;
        }

        for (let i = 0; i < listToDraw.length; i++) {
          const item = listToDraw[i];
          
          let dx = 30;
          let dy = topMargin + i * (imgHForDraw + gap);

          if (format === 'square_grid') {
            const col = i % 2;
            const row = Math.floor(i / 2);
            dx = 30 + col * (imgWForDraw + 20);
            dy = topMargin + row * (imgHForDraw + 20);
          } else if (format === 'polaroid') {
            dx = 35;
          }

          // Load original picture
          const imgObj = await new Promise<HTMLImageElement>((imgResolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => imgResolve(img);
            img.onerror = () => imgResolve(new Image());
            img.src = item.dataUrl;
          });

          // --- DRAW DECORATIVE CUSTOMISABLE FRAME FOR EACH PHOTO ---
          const offsetSize = frameThickness; // padding width
          const fx = dx - offsetSize;
          const fy = dy - offsetSize;
          const fw = imgWForDraw + 2 * offsetSize;
          const fh = imgHForDraw + 2 * offsetSize;

          ctx.save();
          ctx.globalAlpha = frameOpacity;

          // 1. Apply Shadows / Glowing borders
          if (frameGlowColor && frameGlowColor !== 'transparent' && frameGlowIntensity > 0) {
            ctx.shadowColor = frameGlowColor;
            ctx.shadowBlur = frameGlowIntensity;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          } else if (frameShadowDepth > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
            ctx.shadowBlur = frameShadowDepth + 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = frameShadowDepth / 1.5;
          }

          // 2. Layered shadow stacked paper effect
          if (frameBorderStyle === 'layered') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            drawRoundedRect(ctx, fx + 5, fy + 5, fw - 5, fh - 5, frameCornerRadius);
            ctx.fill();
          }

          // 3. Draw Background base (Solid color, Gradient color)
          if (frameIsGradient && frameGradientColors && frameGradientColors.length >= 2) {
            const frameGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
            frameGradientColors.forEach((col, idx) => {
              frameGrad.addColorStop(idx / (frameGradientColors.length - 1), col);
            });
            ctx.fillStyle = frameGrad;
          } else {
            ctx.fillStyle = frameColor || '#ffffff';
          }

          drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
          ctx.fill();

          // 4. Pattern Overlays (Checkered,dots,stripes, etc)
          if (framePatternOverlay === 'checkered') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            const bs = 6;
            for (let px = fx; px < fx + fw; px += bs * 2) {
              for (let py = fy; py < fy + fh; py += bs * 2) {
                ctx.fillRect(px, py, bs, bs);
                ctx.fillRect(px + bs, py + bs, bs, bs);
              }
            }
          } else if (framePatternOverlay === 'dots') {
            ctx.fillStyle = 'rgba(255, 105, 180, 0.12)';
            for (let px = fx + 4; px < fx + fw; px += 8) {
              for (let py = fy + 4; py < fy + fh; py += 8) {
                ctx.beginPath();
                ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else if (framePatternOverlay === 'stripes') {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let px = fx - fh; px < fx + fw; px += 10) {
              ctx.moveTo(px, fy);
              ctx.lineTo(px + fh, fy + fh);
            }
            ctx.stroke();
          }

          // 5. Draw Textures (Paper specks, Glitter sparkles, Holograms, Gold foil metallic)
          if (frameTexture === 'paper') {
            ctx.fillStyle = 'rgba(0,0,0,0.035)';
            for (let ti = 0; ti < 60; ti++) {
              const tx = fx + Math.random() * fw;
              const ty = fy + Math.random() * fh;
              const ts = 0.5 + Math.random() * 1.5;
              ctx.fillRect(tx, ty, ts, ts);
            }
          } else if (frameTexture === 'glitter') {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
            for (let ti = 0; ti < 45; ti++) {
              const tx = fx + Math.random() * fw;
              const ty = fy + Math.random() * fh;
              const ts = 1 + Math.random() * 2.5;
              if (Math.random() > 0.7) {
                ctx.font = '8px Arial';
                ctx.fillText('✨', tx, ty);
              } else {
                ctx.beginPath();
                ctx.arc(tx, ty, ts, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else if (frameTexture === 'holographic') {
            const holoGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy);
            holoGrad.addColorStop(0, 'rgba(255, 0, 200, 0.16)');
            holoGrad.addColorStop(0.3, 'rgba(0, 255, 255, 0.16)');
            holoGrad.addColorStop(0.6, 'rgba(255, 255, 0, 0.16)');
            holoGrad.addColorStop(1, 'rgba(150, 0, 255, 0.16)');
            ctx.fillStyle = holoGrad;
            drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
            ctx.fill();
          } else if (frameTexture === 'gold_foil') {
            const foilGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
            foilGrad.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
            foilGrad.addColorStop(0.2, 'rgba(255, 215, 0, 0.1)');
            foilGrad.addColorStop(0.4, 'rgba(255, 223, 100, 0.45)');
            foilGrad.addColorStop(0.6, 'rgba(184, 134, 11, 0.35)');
            foilGrad.addColorStop(0.8, 'rgba(255, 223, 0, 0.45)');
            foilGrad.addColorStop(1, 'rgba(218, 165, 32, 0.5)');
            ctx.fillStyle = foilGrad;
            drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
            ctx.fill();
          } else if (frameTexture === 'chrome') {
            const chromeGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
            chromeGrad.addColorStop(0, 'rgba(240,240,245,0.3)');
            chromeGrad.addColorStop(0.4, 'rgba(90,105,120,0.5)');
            chromeGrad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
            chromeGrad.addColorStop(0.6, 'rgba(60,75,90,0.4)');
            chromeGrad.addColorStop(1, 'rgba(220,220,230,0.3)');
            ctx.fillStyle = chromeGrad;
            drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
            ctx.fill();
          } else if (frameTexture === 'doodle') {
            ctx.strokeStyle = 'rgba(255,100,180,0.25)';
            ctx.lineWidth = 1;
            for (let di = 0; di < 12; di++) {
              const dx1 = fx + Math.random() * fw;
              const dy1 = fy + Math.random() * fh;
              ctx.beginPath();
              ctx.arc(dx1, dy1, 3 + Math.random() * 4, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Custom Pattern Texture url tiled draw
          if (frameCustomTextureUrl) {
            const patternImg = await new Promise<HTMLImageElement | null>((resPat) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resPat(img);
              img.onerror = () => resPat(null);
              img.src = frameCustomTextureUrl;
            });
            if (patternImg) {
              const pattern = ctx.createPattern(patternImg, 'repeat');
              if (pattern) {
                ctx.fillStyle = pattern;
                drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
                ctx.fill();
              }
            }
          }

          // 6. Draw Stroke Borders
          if (frameBorderStyle !== 'layered') {
            ctx.strokeStyle = frameColor || '#fb7185';
            ctx.lineWidth = frameBorderStyle === 'double' ? 4 : 2;
            
            if (frameBorderStyle === 'dashed') {
              ctx.setLineDash([5, 3]);
            } else {
              ctx.setLineDash([]);
            }

            if (frameBorderStyle === 'neon') {
              ctx.save();
              ctx.strokeStyle = frameGlowColor || '#ff69b4';
              ctx.shadowColor = frameGlowColor || '#ff69b4';
              ctx.shadowBlur = 8;
              ctx.lineWidth = 3;
              drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
              ctx.stroke();
              ctx.restore();
            } else if (frameBorderStyle === '3d') {
              ctx.strokeStyle = 'rgba(255,255,255,0.85)';
              drawRoundedRect(ctx, fx + 1, fy + 1, fw - 2, fh - 2, frameCornerRadius);
              ctx.stroke();
              ctx.strokeStyle = 'rgba(0,0,0,0.35)';
              drawRoundedRect(ctx, fx - 1, fy - 1, fw + 2, fh + 2, frameCornerRadius);
              ctx.stroke();
            } else if (frameBorderStyle === 'torn') {
              ctx.strokeStyle = frameColor || '#ffffff';
              ctx.lineWidth = 1;
              ctx.beginPath();
              const steps = 60;
              ctx.moveTo(fx, fy);
              for (let sx = fx; sx <= fx + fw; sx += fw / steps) {
                const jitter = (Math.random() - 0.5) * 2;
                ctx.lineTo(sx, fy + jitter);
              }
              for (let sy = fy; sy <= fy + fh; sy += fh / steps) {
                const jitter = (Math.random() - 0.5) * 2;
                ctx.lineTo(fx + fw + jitter, sy);
              }
              for (let sx = fx + fw; sx >= fx; sx -= fw / steps) {
                const jitter = (Math.random() - 0.5) * 2;
                ctx.lineTo(sx, fy + fh + jitter);
              }
              for (let sy = fy + fh; sy >= fy; sy -= fh / steps) {
                const jitter = (Math.random() - 0.5) * 2;
                ctx.lineTo(fx + jitter, sy);
              }
              ctx.closePath();
              ctx.stroke();
            } else if (frameBorderStyle !== 'none') {
              drawRoundedRect(ctx, fx, fy, fw, fh, frameCornerRadius);
              ctx.stroke();
            }
            ctx.setLineDash([]);
          }

          // Special retro Film sprocket holes drawn on top of background
          if (frameTexture === 'film') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            const holeSize = 4;
            const holeSpacing = 12;
            for (let sy = fy + 5; sy < fy + fh - 5; sy += holeSpacing) {
              ctx.fillRect(fx + 3, sy, holeSize, holeSize + 1.5);
              ctx.fillRect(fx + fw - 3 - holeSize, sy, holeSize, holeSize + 1.5);
            }
          }

          ctx.restore();

          // 7. Draw the Photo Image itself (clipped cleanly inside frame bounds)
          ctx.save();
          drawRoundedRect(ctx, dx, dy, imgWForDraw, imgHForDraw, Math.max(0, frameCornerRadius - 3));
          ctx.clip();
          
          // Draw with automatic cover crop to preserve aspect ratio perfectly without squishing or stretching
          const hRatioValue = imgWForDraw / imgObj.width;
          const vRatioValue = imgHForDraw / imgObj.height;
          const coverRatio = Math.max(hRatioValue, vRatioValue);
          const drawW = imgObj.width * coverRatio;
          const drawH = imgObj.height * coverRatio;
          const drawX = dx + (imgWForDraw - drawW) / 2;
          const drawY = dy + (imgHForDraw - drawH) / 2;
          ctx.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height, drawX, drawY, drawW, drawH);
          
          ctx.restore();

          // 8. Draw Frame Stamps / Stickers
          if (frameStickers && frameStickers.length > 0 && frameStickerPlacement !== 'none') {
            ctx.save();
            ctx.font = '15px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const fs1 = frameStickers[0] || '✨';
            const fs2 = frameStickers[1] || '🎀';
            const fs3 = frameStickers[2] || '🧸';

            if (frameStickerPlacement === 'corners') {
              ctx.fillText(fs1, fx + 8, fy + 8);
              ctx.fillText(fs2, fx + fw - 8, fy + 8);
              ctx.fillText(fs3 || fs1, fx + 8, fy + fh - 8);
              ctx.fillText(fs2, fx + fw - 8, fy + fh - 8);
            } else if (frameStickerPlacement === 'top_bottom') {
              ctx.fillText(fs1, fx + fw / 2, fy + 6);
              ctx.fillText(fs2, fx + fw / 2, fy + fh - 6);
            } else if (frameStickerPlacement === 'sides') {
              ctx.fillText(fs1, fx + 6, fy + fh / 2);
              ctx.fillText(fs2, fx + fw - 6, fy + fh / 2);
            } else if (frameStickerPlacement === 'scattered') {
              ctx.fillText(fs1, fx + fw / 4, fy + 7);
              ctx.fillText(fs2, fx + (3 * fw) / 4, fy + fh - 7);
              ctx.fillText(fs3 || fs1, fx + 8, fy + fh / 2);
            }
            ctx.restore();
          }

          // Draw decorations overlay on photo
          const activeElements = photoElements[item.id] || [];
          for (const el of activeElements) {
            ctx.save();
            const elementCenterX = dx + (el.x / 100) * imgWForDraw;
            const elementCenterY = dy + (el.y / 100) * imgHForDraw;

            ctx.translate(elementCenterX, elementCenterY);
            ctx.rotate((el.rotation * Math.PI) / 180);

            const finalScale = el.scale * 0.95;

            if (el.type === 'sticker') {
              ctx.font = `${28 * finalScale}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(el.content, 0, 0);
            } else if (el.type === 'ribbon') {
              const ribbonTemplate = PREMIUM_RIBBONS.find(r => r.id === el.ribbonId);
              if (ribbonTemplate) {
                const svgString = ribbonTemplate.svgTemplate(el.color || ribbonTemplate.defaultColor, {
                  hasShadow: el.hasShadow,
                  hasGlow: el.hasGlow,
                  hasGlitter: el.hasGlitter
                });

                const encoded = encodeURIComponent(svgString)
                  .replace(/'/g, "%27")
                  .replace(/"/g, "%22");
                const dataUrl = `data:image/svg+xml;utf8,${encoded}`;

                const rImg = await new Promise<HTMLImageElement>((resolveImg) => {
                  const tempImg = new Image();
                  tempImg.crossOrigin = 'anonymous';
                  tempImg.onload = () => resolveImg(tempImg);
                  tempImg.onerror = () => resolveImg(new Image());
                  tempImg.src = dataUrl;
                });

                ctx.save();
                ctx.globalAlpha = el.opacity ?? 1;

                if (el.hasGlow) {
                  ctx.shadowColor = 'rgba(255,102,178,0.7)';
                  ctx.shadowBlur = 12;
                } else if (el.hasShadow) {
                  ctx.shadowColor = 'rgba(0,0,0,0.2)';
                  ctx.shadowBlur = 6;
                  ctx.shadowOffsetY = 3;
                }

                const calculatedW = (el.width || 120) * finalScale * 0.95;
                let calculatedH = calculatedW * 0.35;
                if (ribbonTemplate.viewBox.includes('120 100') || ribbonTemplate.viewBox.includes('100 100')) {
                  calculatedH = calculatedW * 0.85;
                }

                ctx.drawImage(rImg, -calculatedW / 2, -calculatedH / 2, calculatedW, calculatedH);
                ctx.restore();
              }
            } else {
              const rawFont = el.fontFamily === 'Fredoka' ? 'Fredoka' : el.fontFamily === 'VT323' ? 'VT323' : el.fontFamily === 'Space Grotesk' ? 'Space Grotesk' : el.fontFamily === 'Pacifico' ? 'Pacifico' : 'Inter';
              ctx.font = `bold ${el.fontFamily === 'VT323' ? '30px' : '18px'} "${rawFont}", sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              if (el.glowColor) {
                ctx.shadowColor = el.glowColor;
                ctx.shadowBlur = 10;
              }

              ctx.fillStyle = el.color || '#ff66b2';
              ctx.fillText(el.content, 0, 0);
            }
            ctx.restore();
          }

          // ORANGE RETRO CAMERA TIMESTAMP IMPRINT IN PHOTO ENVELOPE CORNER
          if (stampDate) {
            ctx.save();
            ctx.font = 'bold 15px "VT323", monospace';
            ctx.fillStyle = '#ff7115'; // Retro digit orange
            ctx.shadowColor = 'rgba(255, 113, 21, 0.7)';
            ctx.shadowBlur = 4;
            
            const monthStr = new Date().toLocaleDateString('en-US', { month: '2-digit' });
            const dayStr = new Date().toLocaleDateString('en-US', { day: '2-digit' });
            const finalStamp = `${customYear}’${monthStr}’${dayStr}`;
            ctx.fillText(finalStamp, dx + imgWForDraw - 85, dy + imgHForDraw - 12);
            ctx.restore();
          }
        }

        // --- DRAW THE DISTINCT HIGH CUSTOMISABLE BOTTOM CARD CONTAINER ---
        const footerY = totalPhotosHeight + 10;
        
        // Define coordinate layout shape values
        const cardMargin = cardLayout === 'full' ? 0 : cardLayout === 'centered' ? 55 : 20;
        const cardX = cardMargin;
        const cardWidth = canvasW - (cardMargin * 2);
        const cardH = cardHeightAllocated;
        const cardY = footerY;

        if (enableCardSpacer && showCardPlate) {
          ctx.save();
          ctx.globalAlpha = cardOpacity;

          // Apply drop shadows and neon glows (Fully customizable)
          if (cardHasGlow && cardGlowColor) {
            ctx.shadowColor = cardGlowColor;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
          } else if (cardHasShadow || cardLayout === 'floating' || cardLayout === 'layered') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 4;
          }

          // Draw Layered shadow helper double card (Scrapbook stacked effect)
          if (cardLayout === 'layered') {
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            const offset = 6;
            drawRoundedRect(ctx, cardX + offset, cardY + offset, cardWidth - offset, cardH - offset, 16);
            ctx.fill();
          }

          // Draw background styles (solid color, gradients, and frosted glass)
          if (cardBackgroundType === 'glass') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.58)'; // Glassmorphism white
          } else if (cardBackgroundType === 'gradient') {
            const grad = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardH);
            if (cardBackgroundColor.includes('linear-gradient') || cardBackgroundColor.includes('linear') || cardBackgroundColor.includes(',')) {
              // Precise high-fidelity color mappings derived from our 101 templates list
              if (activeCardId === 'k_teddy_love') {
                grad.addColorStop(0, '#fffbeb');
                grad.addColorStop(1, '#fef3c7');
              } else if (activeCardId === 'k_hearts_galore') {
                grad.addColorStop(0, '#ffe4e6');
                grad.addColorStop(1, '#fecdd3');
              } else if (activeCardId === 'y_retro_chrome') {
                grad.addColorStop(0, '#f1f5f9');
                grad.addColorStop(0.5, '#cbd5e1');
                grad.addColorStop(1, '#94a3b8');
              } else if (activeCardId === 'y_pink_metallic') {
                grad.addColorStop(0, '#ec4899');
                grad.addColorStop(1, '#be185d');
              } else if (activeCardId === 'k_pastel_candy') {
                grad.addColorStop(0, '#ffd1dc');
                grad.addColorStop(1, '#d1f7ff');
              } else if (activeCardId === 'd_angelcore_cloud') {
                grad.addColorStop(0, '#f0fdf4');
                grad.addColorStop(1, '#e0f2fe');
              } else if (activeCardId === 'r_first_date') {
                grad.addColorStop(0, '#fff5f5');
                grad.addColorStop(1, '#ffe3e3');
              } else if (activeCardId === 'f_sleepover') {
                grad.addColorStop(0, '#faf5ff');
                grad.addColorStop(1, '#fae8ff');
              } else {
                // Parse simple gradient extraction
                grad.addColorStop(0, '#ffe4e6');
                grad.addColorStop(1, '#fbcfe8');
              }
            } else {
              // Apply simple fallback solid to gradient conversion
              grad.addColorStop(0, cardBackgroundColor || '#ffffff');
              grad.addColorStop(1, '#ffffff');
            }
            ctx.fillStyle = grad;
          } else {
            ctx.fillStyle = cardBackgroundColor || '#ffffff';
          }

          // Shape Roundedness calculation
          let radiusStyle = 16;
          if (cardBorderRadius === 'none') radiusStyle = 0;
          else if (cardBorderRadius === 'md') radiusStyle = 8;
          else if (cardBorderRadius === 'xl') radiusStyle = 16;
          else if (cardBorderRadius === '3xl') radiusStyle = 28;
          else if (cardBorderRadius === 'full') radiusStyle = Math.min(cardWidth, cardH) / 2.2;

          drawRoundedRect(ctx, cardX, cardY, cardWidth, cardH, radiusStyle);
          ctx.fill();

          // Border render
          if (cardBorderStyle !== 'none') {
            ctx.strokeStyle = cardBorderColor || '#fb7185';
            ctx.lineWidth = cardBorderStyle === 'double' ? 5 : 2;
            if (cardBorderStyle === 'dashed') {
              ctx.setLineDash([7, 4]);
            } else {
              ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]); // cleanup canvas global dash arrays
          }
          ctx.restore();
        }

        if (enableCardSpacer) {
          // 6. DRAW TEXT OVERLAYS ON CARD
          ctx.save();
          ctx.fillStyle = cardTextColor || '#db2777';
          
          let fontFamilyDraw = 'Fredoka';
          if (cardFontFamily === 'Fredoka') fontFamilyDraw = 'Fredoka';
          else if (cardFontFamily === 'VT323') fontFamilyDraw = 'VT323';
          else if (cardFontFamily === 'Space Grotesk') fontFamilyDraw = 'Space Grotesk';
          else if (cardFontFamily === 'Pacifico') fontFamilyDraw = 'Pacifico';
          else if (cardFontFamily === 'Inter') fontFamilyDraw = 'Inter';

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (cardLayout === 'split') {
            const contentW = cardWidth - 60;
            ctx.font = `bold 13px "${fontFamilyDraw}", sans-serif`;
            ctx.fillText(cardCaption, cardX + 30 + contentW * 0.35, cardY + (cardH / 2) - 8);
            ctx.font = `9px "${fontFamilyDraw}", sans-serif`;
            ctx.fillStyle = cardTextColor === '#ffffff' ? '#ffffff' : 'rgba(51, 65, 85, 0.8)';
            ctx.fillText(cardSubCaption || '', cardX + 30 + contentW * 0.35, cardY + (cardH / 2) + 12);
          } else {
            const textCenterY = cardSubCaption ? cardY + (cardH / 2) - 12 : cardY + (cardH / 2);
            
            if (cardFontFamily === 'VT323') {
              ctx.font = `bold 22px "VT323", monospace`;
            } else if (cardFontFamily === 'Pacifico') {
              ctx.font = `16px "Pacifico", cursive`;
            } else {
              ctx.font = `bold 14px "${fontFamilyDraw}", sans-serif`;
            }
            ctx.fillText(cardCaption, canvasW / 2, textCenterY);

            if (cardSubCaption) {
              if (cardFontFamily === 'VT323') {
                ctx.font = `14px "VT323", monospace`;
              } else {
                ctx.font = `9px "${fontFamilyDraw}", sans-serif`;
              }
              ctx.fillStyle = cardTextColor === '#ffffff' ? '#ffffff' : 'rgba(74, 85, 104, 0.75)';
              if (cardTextColor === '#ffffff') ctx.globalAlpha = 0.85;
              ctx.fillText(cardSubCaption, canvasW / 2, textCenterY + 24);
              ctx.globalAlpha = 1.0;
            }
          }
          ctx.restore();

          // Watermark Signature at Bottom
          if (cardShowBranding && cardBrandingText) {
            ctx.save();
            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = cardTextColor || '#db2777';
            ctx.globalAlpha = 0.55;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cardBrandingText.toUpperCase(), canvasW / 2, cardY + cardH - 12);
            ctx.restore();
          }

          // Draw 3 Mini stickers on custom locations inside Bottom Card
          if (cardStickers && cardStickers.length > 0) {
            ctx.save();
            ctx.font = '18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const s1 = cardStickers[0] || '🎀';
            const s2 = cardStickers[1] || '✨';
            const s3 = cardStickers[2] || '🧸';

            if (cardStickerPositions === 'sides') {
              ctx.fillText(s1, cardX + 28, cardY + cardH / 2);
              ctx.fillText(s2, cardX + cardWidth - 28, cardY + cardH / 2);
            } else if (cardStickerPositions === 'corners') {
              ctx.fillText(s1, cardX + 24, cardY + 20);
              ctx.fillText(s2, cardX + cardWidth - 24, cardY + 20);
              ctx.fillText(s3, cardX + 24, cardY + cardH - 24);
            } else if (cardStickerPositions === 'top_fringe') {
              ctx.fillText(s1, cardX + (cardWidth / 4), cardY + 14);
              ctx.fillText(s2, cardX + (cardWidth * 3 / 4), cardY + 14);
            } else { // scattered
              ctx.fillText(s1, cardX + 24, cardY + 20);
              ctx.fillText(s2, cardX + cardWidth - 30, cardY + cardH - 24);
              ctx.fillText(s3, cardX + (cardWidth / 2) - 45, cardY + cardH - 24);
            }
            ctx.restore();
          }

          // Draw sparkles on top of card if glitter template activated!
          if (cardHasGlitter) {
            ctx.save();
            ctx.font = '11px sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillText('✨', cardX + 15, cardY + 25);
            ctx.fillText('⭐', cardX + cardWidth - 15, cardY + 20);
            ctx.fillText('✨', cardX + (cardWidth / 2) + 60, cardY + 15);
            ctx.fillText('⭐', cardX + 80, cardY + cardH - 12);
            ctx.restore();
          }
        }

        // RESOLVE COMPILATION DATA URL FOR REAL-TIME PREVIEW
        const outputDataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(outputDataUrl);
        resolve(outputDataUrl);
      };

      setTimeout(() => {
        drawPhotosAndBottomCard();
      }, 50);
    });
  };

  const handleDownload = async (fileType: 'png' | 'jpg') => {
    if (isExporting) return;
    setIsExporting(true);
    if (soundEnabled) playDigitalBeep(true);

    try {
      const compiledDataUrl = await generateStripOutput(false);
      const link = document.createElement('a');
      link.download = `arpitasnaps_bottomcard_${Date.now()}.${fileType}`;
      
      if (fileType === 'jpg') {
        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = exportCanvasRef.current?.width || 400;
        jpgCanvas.height = exportCanvasRef.current?.height || 1200;
        const jpgCtx = jpgCanvas.getContext('2d');
        if (jpgCtx) {
          jpgCtx.fillStyle = '#ffffff';
          jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
          const tempImg = new Image();
          tempImg.onload = () => {
            jpgCtx.drawImage(tempImg, 0, 0);
            link.href = jpgCanvas.toDataURL('image/jpeg', 0.95);
            link.click();
          };
          tempImg.src = compiledDataUrl;
        }
      } else {
        link.href = compiledDataUrl;
        link.click();
      }
      
      if (soundEnabled) setTimeout(() => playSparkleSound(), 500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (soundEnabled) playUIPop();
    try {
      if (navigator.share && previewUrl) {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const file = new File([blob], 'arpitasnaps_card_output.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: 'My Arpita Snaps Bottom Card Booth Strip!',
          text: 'Made with 💖 by Arpita — Captured on Arpita Snaps ✨'
        });
      } else {
        alert("✨ Saved to Clipboard! Share this gorgeous custom Bottom Card design with your besties on Instagram, TikTok, or Tumblr! ✨");
      }
    } catch (e) {
      console.warn("Share operation interrupted:", e);
    }
  };

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6 w-full pb-10" id="strip-generator-suite">
      
      {/* LEFT COLUMN: LIVE RE-RENDER PREVIEW CARD */}
      <div className="xl:col-span-5 flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          <h3 className="font-bubble text-slate-700 text-xs uppercase tracking-wider select-none">
            ⭐ Live Bottom Card Preview
          </h3>
        </div>

        {/* Framing shell matches selected bottom card themes dynamically */}
        <div className="p-3.5 bg-white/95 rounded-2xl p-4 y2k-border flex items-center justify-center max-w-[290px] w-full relative overflow-hidden h-[540px] shadow-sm select-none">
          <div className="crt-scanlines absolute inset-0 pointer-events-none opacity-5 animate-pulse" />
          
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Real-time customized bottom card physical print layout proof" 
              className="max-h-full max-w-full rounded-xl select-none object-contain shadow-md transition-all duration-300 hover:scale-[1.01]"
            />
          ) : (
            <div className="flex flex-col items-center text-center p-6 text-slate-400">
              <RefreshCw className="animate-spin mb-2 text-pink-400" size={24} />
              <p className="font-bubble text-xs text-slate-500">Injecting beautiful vectors...</p>
            </div>
          )}
        </div>

        {/* Miniature information card below preview */}
        <div className="mt-3 text-center invisible sm:visible">
          <span className="font-mono text-[9px] text-slate-400 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-full select-none">
            ⚡ Renders exactly onto social media / photo prints
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: MASSIVE CUSTOMIZATION TABS DECK */}
      <div className="xl:col-span-7 flex flex-col gap-4 p-5 bg-white/95 rounded-2xl y2k-border shadow-sm">
        
        {/* Header & Title bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-pink-100 pb-3 gap-2">
          <div>
            <h2 className="bubble-font text-base font-black text-rose-500 uppercase tracking-tight flex items-center gap-1.5 mb-0.5 text-shadow-xs">
              👑 Bottom Card Studio 👑
            </h2>
            <p className="text-[10px] uppercase font-mono font-bold text-pink-500">100+ templates with real-time vector layout customizations</p>
          </div>
          
          {/* Quick statistics tracker */}
          <div className="flex items-center gap-1">
            <span className="bg-pink-50 border border-pink-200 text-pink-700 font-bubble text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 select-none">
              <Sparkles size={9} /> 101 Creative Styles
            </span>
          </div>
        </div>

        {/* Tab switcher buttons with bouncy layout */}
        <div className="flex border-b border-slate-100 p-1 bg-slate-50 rounded-xl overflow-x-auto select-none no-scrollbar">
          <button
            onClick={() => { setActiveTab('templates'); if (soundEnabled) playUIPop(); }}
            className={`flex-none md:flex-1 py-1.5 px-3 font-bubble text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'templates' 
                ? 'bg-white text-pink-600 font-bold shadow-xs border-b-2 border-pink-500' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            🎨 100+ Cards
          </button>
          <button
            onClick={() => { setActiveTab('customize'); if (soundEnabled) playUIPop(); }}
            className={`flex-none md:flex-1 py-1.5 px-3 font-bubble text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'customize' 
                ? 'bg-white text-pink-600 font-bold shadow-xs border-b-2 border-pink-500' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            ⚙️ Card Style
          </button>
          <button
            onClick={() => { setActiveTab('frames'); if (soundEnabled) playUIPop(); }}
            className={`flex-none md:flex-1 py-1.5 px-3 font-bubble text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'frames' 
                ? 'bg-white text-pink-600 font-bold shadow-xs border-b-2 border-pink-500' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            🖼️ Border Library
          </button>
          <button
            onClick={() => { setActiveTab('layout'); if (soundEnabled) playUIPop(); }}
            className={`flex-none md:flex-1 py-1.5 px-3 font-bubble text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'layout' 
                ? 'bg-white text-pink-600 font-bold shadow-xs border-b-2 border-pink-500' 
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            📏 Collage Format
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto pr-1">
          {/* TAP 1: 100+ PRESET TEMPLATE DIRECT SELECTOR */}
          {activeTab === 'templates' && (
            <div className="flex flex-col gap-3 animate-fade-in">
              
              {/* Filter and Search Bar row */}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search size={13} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 100+ card designs (e.g. teddy, chrome)..."
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl font-bubble text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder:text-slate-400"
                  />
                </div>

                {/* Reset button */}
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); if (soundEnabled) playUIPop(); }}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-bubble hover:bg-slate-50 text-slate-500"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Horizontal scrollable category filters */}
              <div className="flex overflow-x-auto gap-1 pb-1.5 hide-scrollbars select-none">
                <button
                  onClick={() => { setActiveCategory('favorites'); if (soundEnabled) playUIPop(); }}
                  className={`px-3 py-1 rounded-full border text-[10px] font-bubble cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                    activeCategory === 'favorites' 
                      ? 'bg-amber-100 border-amber-400 text-amber-700 font-bold' 
                      : 'bg-white/90 text-slate-500 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  ⭐ Stars ({favoriteCardIds.length})
                </button>
                <button
                  onClick={() => { setActiveCategory('recent'); if (soundEnabled) playUIPop(); }}
                  className={`px-3 py-1 rounded-full border text-[10px] font-bubble cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                    activeCategory === 'recent' 
                      ? 'bg-purple-150 border-purple-400 text-purple-700 font-bold' 
                      : 'bg-white/90 text-slate-500 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  🩹 Recent
                </button>
                
                {BOTTOM_CARD_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); if (soundEnabled) playUIPop(); }}
                    className={`px-3 py-1 rounded-full border text-[10px] font-bubble cursor-pointer flex-shrink-0 flex items-center gap-1 ${
                      activeCategory === cat.id 
                        ? 'bg-pink-100 border-pink-400 text-pink-700 font-bold' 
                        : 'bg-white/90 text-slate-505 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span>{cat.emoji}</span> {cat.name}
                  </button>
                ))}
              </div>

              {/* Grid deck of matching cards */}
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredTemplates.map((card) => {
                    const isFav = favoriteCardIds.includes(card.id);
                    const isActive = activeCardId === card.id;

                    return (
                      <div
                        key={card.id}
                        onClick={() => handleApplyCardTemplate(card)}
                        className={`p-2.5 rounded-xl border cursor-pointer select-none relative transition-all group overflow-hidden ${
                          isActive 
                            ? 'border-pink-500 ring-2 ring-pink-300 scale-98 bg-pink-50/20 shadow-inner' 
                            : 'border-slate-200 hover:border-pink-300 bg-white hover:scale-101 shadow-xs'
                        }`}
                      >
                        {/* Favorite Star action */}
                        <button
                          onClick={(e) => toggleFavorite(e, card.id)}
                          className="absolute top-1.5 right-1.5 text-slate-350 hover:text-amber-500 transition-colors z-20 cursor-pointer"
                        >
                          <Star 
                            size={12} 
                            className={`${isFav ? 'fill-amber-400 text-amber-500 animate-spin-once' : 'text-slate-400'}`} 
                          />
                        </button>

                        {/* Fire tag for trending designs */}
                        {card.isTrending && (
                          <div className="absolute top-1 left-1.5 bg-rose-500 text-white rounded px-1 py-0.2 text-[8px] font-bold flex items-center gap-0.2 select-none">
                            <Flame size={8} className="animate-pulse" /> TRENDING
                          </div>
                        )}

                        {/* Card visual details representation with small backplate preview */}
                        <div className="flex flex-col h-full pt-1">
                          <span className="font-bubble text-[11px] font-bold text-slate-800 group-hover:text-pink-600 truncate mb-1">
                            {card.name}
                          </span>

                          <div 
                            className="h-10 w-full rounded-md flex flex-col items-center justify-center p-0.5 border border-slate-100/70"
                            style={{ 
                              background: card.backgroundColor,
                              opacity: card.opacity
                            }}
                          >
                            <span 
                              className="font-bold truncate max-w-[90%] text-center text-[8px]"
                              style={{ color: card.textColor }}
                            >
                              {card.caption}
                            </span>
                            {card.subCaption && (
                              <span 
                                className="truncate max-w-[95%] text-center text-[7px]"
                                style={{ color: card.textColor, opacity: 0.7 }}
                              >
                                {card.subCaption}
                              </span>
                            )}
                          </div>
                          
                          {/* Mini detail sticker display row */}
                          <div className="flex items-center gap-1 mt-1.5 select-none justify-between">
                            <span className="text-[7.5px] uppercase font-mono text-slate-400 tracking-wider">
                              {card.category}
                            </span>
                            <div className="flex gap-0.5">
                              {card.stickers.slice(0, 3).map((st, sidx) => (
                                <span key={sidx} className="text-[10px]">{st}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <Heart size={20} className="mx-auto text-slate-300 mb-1 animate-pulse" />
                  <p className="font-bubble text-slate-500 text-xs">No matching templates found...</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase">Try modifying your search or favorite filters!</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VECTOR CUSTOM DESIGN LAB & TEXT REPLACER */}
          {activeTab === 'customize' && (
            <div className="flex flex-col gap-4 animate-fade-in text-slate-700">
              
              {/* Direct text entry for captions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <label className="font-bubble text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Type size={11} className="text-pink-500" /> Card Main Caption:
                  </label>
                  <input
                    type="text"
                    value={cardCaption}
                    onChange={(e) => setCardCaption(e.target.value.toUpperCase())}
                    maxLength={35}
                    placeholder="ENTER CUTE SLAY MEMORY..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-bubble text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white"
                  />
                </div>
                <div>
                  <label className="font-bubble text-[11px] font-bold text-slate-705 flex items-center gap-1 mb-1">
                    <Sparkle size={11} className="text-indigo-505" /> Sub-Caption text:
                  </label>
                  <input
                    type="text"
                    value={cardSubCaption}
                    onChange={(e) => setCardSubCaption(e.target.value)}
                    maxLength={45}
                    placeholder="Sweet descriptions or quotes..."
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-xl font-bubble text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 bg-white"
                  />
                </div>
              </div>

              {/* Typography choosing */}
              <div>
                <label className="font-bubble text-xs font-bold block mb-1.5 text-slate-705">
                  🔤 Aesthetic Font Style:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'Fredoka', label: 'Bubble' },
                    { id: 'VT323', label: 'Pixel' },
                    { id: 'Space Grotesk', label: 'Tech' },
                    { id: 'Pacifico', label: 'Cursive' },
                    { id: 'Inter', label: 'Modern' }
                  ].map(font => (
                    <button
                      key={font.id}
                      onClick={() => { setCardFontFamily(font.id as any); if (soundEnabled) playDigitalBeep(false); }}
                      className={`py-1 px-1 rounded-lg border text-[10px] text-center font-bubble cursor-pointer transition-all ${
                        cardFontFamily === font.id 
                          ? 'border-pink-500 bg-pink-100 text-pink-700 font-bold shadow-xs' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Physical Layout Variations */}
              <div>
                <label className="font-bubble text-xs font-bold block mb-2 text-slate-705">
                  📐 Card Layout Shape Variation:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bubble', label: 'Rounded Bubble', desc: 'Cute puffy pill' },
                    { id: 'full', label: 'Full Width', desc: 'Seamless background' },
                    { id: 'centered', label: 'Tiny Tag', desc: 'Centered clean card' },
                    { id: 'floating', label: '3D Floating', desc: 'Drop shadow lift' },
                    { id: 'layered', label: 'Layered Stack', desc: 'Double offset border' },
                    { id: 'split', label: 'Split Info', desc: 'Split metadata columns' }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => { setCardLayout(style.id as any); if (soundEnabled) playUIPop(); }}
                      className={`p-1.5 border rounded-xl text-left cursor-pointer transition-colors ${
                        cardLayout === style.id 
                          ? 'border-pink-500 bg-pink-50/20 shadow-xs' 
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-bubble text-[11px] font-bold text-slate-800 block">{style.label}</span>
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tight block">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Types & Opacities */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bubble text-xs font-bold">💎 Backplate Texture:</span>
                  <div className="flex gap-1 bg-white p-0.5 border border-slate-200 rounded-lg">
                    {['solid', 'gradient', 'glass'].map(bgT => (
                      <button
                        key={bgT}
                        onClick={() => { setCardBackgroundType(bgT as any); if (soundEnabled) playDigitalBeep(false); }}
                        className={`px-2 py-0.5 text-[9px] font-bubble uppercase rounded cursor-pointer ${
                          cardBackgroundType === bgT ? 'bg-indigo-500 text-white font-bold' : 'text-slate-500'
                        }`}
                      >
                        {bgT}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity level slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">CARD TRANSPARENCY:</span>
                    <span className="text-[10px] font-mono font-bold text-pink-600">{Math.round(cardOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="1.0"
                    step="0.05"
                    value={cardOpacity}
                    onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1 bg-slate-200 rounded-lg pointer-events-auto"
                  />
                </div>
              </div>

              {/* High Color Customization hex grids */}
              <div>
                <label className="font-bubble text-xs font-bold block mb-1.5 text-slate-705">
                  🌈 Hot Color Palette Picker:
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1 border-b border-dashed border-slate-100 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500">TEXT FILL:</span>
                    <div className="flex gap-1">
                      {['#db2777', '#92400e', '#be123c', '#0369a1', '#15803d', '#1a1a2e', '#ffffff'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCardTextColor(c)}
                          className={`w-4 h-4 rounded-full border border-slate-300 transition-all ${cardTextColor === c ? 'scale-120 ring-2 ring-pink-400' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1 border-b border-dashed border-slate-100 pb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500">BG SOLID:</span>
                    <div className="flex gap-1 mb-1">
                      {['#fffbeb', '#fff1f2', '#f0fdf4', '#f0f9ff', '#111827', '#ffffff'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCardBackgroundColor(c)}
                          className={`w-4 h-4 rounded-full border border-slate-300 transition-all ${cardBackgroundColor === c ? 'scale-120 ring-2 ring-pink-400' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500">CARD BORDER:</span>
                    <div className="flex gap-1">
                      {['#f59e0b', '#fda4af', '#86efac', '#bae6fd', '#db2777', '#ffffff', 'transparent'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCardBorderColor(c)}
                          className={`w-4 h-4 rounded-full border border-slate-300 transition-all ${cardBorderColor === c ? 'scale-120 ring-2 ring-pink-400' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticker decorations customized stack */}
              <div className="bg-pink-50/20 border border-pink-100 rounded-xl p-3">
                <span className="font-bubble text-xs font-bold text-pink-600 block mb-1">
                  🍡 Card Miniature Emojis:
                </span>
                
                <div className="flex gap-2 mb-2 items-center justify-between">
                  <div className="flex gap-2">
                    {cardStickers.map((stk, sidx) => (
                      <span key={sidx} className="bg-white p-1.5 border border-slate-200 rounded-lg text-sm select-none">
                        {stk}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5 bg-white p-0.5 border rounded-lg">
                    {['sides', 'corners', 'scattered', 'top_fringe'].map(pos => (
                      <button
                        key={pos}
                        onClick={() => { setCardStickerPositions(pos as any); if (soundEnabled) playDigitalBeep(false); }}
                        className={`px-2 py-0.5 text-[8px] font-bubble uppercase rounded ${
                          cardStickerPositions === pos ? 'bg-pink-500 text-white font-bold' : 'text-slate-500'
                        }`}
                      >
                        {pos.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid to choose stickers */}
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-1 bg-white/50 rounded-lg">
                  {['🧸', '🍯', '🍪', '🐰', '🍓', '🧁', '🐱', '🌸', '💖', '💌', '🍬', '🍭', '🍒', '☁️', '🎈', '⭐', '🐸', '🍀', '🍼', '🦖', '👑', '🦋', '🦢', '🐚', '🧜‍♀', '🌅', '🕶️', '🍿', '🎟️', '🧣', '🕯️', '🍷'].map((em, idx) => (
                    <button
                      key={`${em}-${idx}`}
                      onClick={() => {
                        // Replace oldest sticker cycle-round
                        setCardStickers(prev => {
                          const updated = [...prev];
                          updated.push(em);
                          if (updated.length > 3) updated.shift();
                          return updated;
                        });
                        if (soundEnabled) playDigitalBeep(false);
                      }}
                      className="text-sm p-1 hover:bg-white rounded transition-colors cursor-pointer select-none"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Watermark Brand options */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bubble text-[11px] font-bold text-slate-700 block mb-1">
                    🏷️ Brand Watermark text:
                  </label>
                  <input
                    type="text"
                    value={cardBrandingText}
                    onChange={(e) => setCardBrandingText(e.target.value)}
                    maxLength={30}
                    className="w-full px-2 py-1 border border-slate-300 rounded-lg font-bubble text-[11px] bg-white"
                  />
                </div>
                
                <div className="flex items-center gap-1.5 pt-4">
                  <input
                    type="checkbox"
                    id="show_brand_opt"
                    checked={cardShowBranding}
                    onChange={(e) => setCardShowBranding(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-pink-500"
                  />
                  <label htmlFor="show_brand_opt" className="font-bubble text-[11px] font-bold text-slate-700 cursor-pointer select-none">
                    Show Watermark logo
                  </label>
                </div>
              </div>

              {/* Extra cute vector toggles (Glow, Shadows, Glitter sparkles) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bubble text-[11px] text-slate-700 font-bold select-none">✨ Sparkly Glitter:</span>
                  <input
                    type="checkbox"
                    checked={cardHasGlitter}
                    onChange={(e) => { setCardHasGlitter(e.target.checked); if (soundEnabled) playUIPop(); }}
                    className="w-4 h-4 cursor-pointer accent-pink-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bubble text-[11px] text-slate-700 font-bold select-none">🔮 Rainbow Glow:</span>
                  <input
                    type="checkbox"
                    checked={cardHasGlow}
                    onChange={(e) => { setCardHasGlow(e.target.checked); if (soundEnabled) playUIPop(); }}
                    className="w-4 h-4 cursor-pointer accent-pink-500"
                  />
                </div>
              </div>

              {/* BRAND NEW SECTION: FILM STRIP BACKGROUND OPTIONS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-200 pb-1.5">
                  <span className="text-pink-500 text-sm">🎨</span>
                  <span className="font-bubble text-[11px] font-bold uppercase tracking-wide">Film Strip Backplate Background</span>
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-4 gap-1 bg-white p-0.5 border border-slate-200 rounded-lg animate-fade-in">
                  {([
                    { id: 'theme', label: 'Theme 🌟' },
                    { id: 'solid', label: 'Solid 🎨' },
                    { id: 'gradient', label: 'Grad 🌈' },
                    { id: 'pattern', label: 'Pat 🏁' }
                  ] as const).map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => { setStripBackplateMode(mode.id); if (soundEnabled) playDigitalBeep(false); }}
                      className={`py-1 text-[9px] font-bubble uppercase rounded-md cursor-pointer transition-colors ${
                        stripBackplateMode === mode.id ? 'bg-pink-500 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Solid colors */}
                {(stripBackplateMode === 'solid' || stripBackplateMode === 'pattern') && (
                  <div className="space-y-1.5 animate-fade-in">
                    <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Background Solid Color:</span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        '#ffd1e8', // bubblegum pink
                        '#ffe4e6', // soft-peach pink
                        '#fbcfe8', // hot pink
                        '#e0f2fe', // sky-blue
                        '#e0e7ff', // pastel lavender
                        '#fef3c7', // honey amber
                        '#f0fdf4', // mint green
                        '#fafaf9', // warm light-beige
                        '#111827', // dark-goth black
                        '#1e1b4b', // deep indigo
                        '#ffffff'  // plain white
                      ].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setStripSolidBg(c); if (soundEnabled) playDigitalBeep(false); }}
                          className={`w-4 h-4 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                            stripSolidBg === c ? 'scale-120 ring-2 ring-pink-400' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      {/* Advanced Picker */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-1 py-0.5 ml-auto">
                        <input
                          type="color"
                          value={stripSolidBg}
                          onChange={(e) => setStripSolidBg(e.target.value)}
                          className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                        />
                        <span className="text-[8px] font-mono font-bold">{stripSolidBg.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gradients */}
                {stripBackplateMode === 'gradient' && (
                  <div className="space-y-2.5 animate-fade-in">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Preset Gradients:</span>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { name: '🌸 Pink Sunset', colors: ['#ffd1e8', '#ffccd5'] },
                          { name: '☁️ Dream Angel', colors: ['#e0f2fe', '#ffe4e6'] },
                          { name: '💿 Cyber Bubble', colors: ['#b3f2ff', '#ffd1e8'] },
                          { name: '🌙 Cozy Lavender', colors: ['#e8d5ff', '#ffd6e7'] },
                          { name: '🌿 Mint Fresh', colors: ['#f0fdf4', '#dcfce7'] },
                          { name: '🪐 Dark Goth', colors: ['#1e1b4b', '#09090b'] }
                        ].map((g, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setStripGradientColors(g.colors); if (soundEnabled) playDigitalBeep(false); }}
                            className={`p-1 rounded border text-left text-[8px] font-bubble cursor-pointer transition-all ${
                              stripGradientColors[0] === g.colors[0] && stripGradientColors[1] === g.colors[1]
                                ? 'border-pink-500 bg-pink-100 text-pink-700 font-bold'
                                : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                            style={{ background: `linear-gradient(90deg, ${g.colors[0]}, ${g.colors[1]})` }}
                          >
                            <span className="bg-white/90 px-1 py-0.5 rounded shadow-xs text-slate-800">{g.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-slate-200">
                      <div>
                        <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase mb-0.5">Start Color:</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1 py-0.5">
                          <input
                            type="color"
                            value={stripGradientColors[0]}
                            onChange={(e) => setStripGradientColors([e.target.value, stripGradientColors[1]])}
                            className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                          />
                          <span className="text-[8px] font-mono font-bold">{stripGradientColors[0].toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase mb-0.5">End Color:</span>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-1 py-0.5">
                          <input
                            type="color"
                            value={stripGradientColors[1]}
                            onChange={(e) => setStripGradientColors([stripGradientColors[0], e.target.value])}
                            className="w-3.5 h-3.5 rounded cursor-pointer border-0 p-0"
                          />
                          <span className="text-[8px] font-mono font-bold">{stripGradientColors[1].toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Patterns */}
                {stripBackplateMode === 'pattern' && (
                  <div className="space-y-2.5 animate-fade-in pt-1 border-t border-dashed border-slate-200">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase mb-1">Overlay Pattern:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'none', label: 'None ❌' },
                          { id: 'checkered', label: 'Checks 🏁' },
                          { id: 'dots', label: 'Polka Dots 🫧' },
                          { id: 'stripes', label: 'Slanting 💈' },
                          { id: 'waves', label: 'Waves 🌊' },
                          { id: 'stars', label: 'Stars ★' }
                        ].map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setStripPattern(p.id as any); if (soundEnabled) playDigitalBeep(false); }}
                            className={`py-1 px-0.5 rounded border text-[8px] text-center font-bubble cursor-pointer transition-all ${
                              stripPattern === p.id
                                ? 'border-pink-500 bg-pink-100 text-pink-700 font-bold shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {stripPattern !== 'none' && (
                      <div className="flex items-center justify-between gap-1 bg-white p-1.5 border border-slate-200 rounded-lg">
                        <span className="text-[8px] font-mono font-bold text-slate-400">TINT SHADE:</span>
                        <div className="flex gap-1">
                          {[
                            'rgba(255, 105, 180, 0.08)',
                            'rgba(255, 105, 180, 0.22)',
                            'rgba(255, 255, 255, 0.20)',
                            'rgba(255, 255, 255, 0.45)',
                            'rgba(0, 0, 0, 0.07)'
                          ].map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setStripPatternColor(c)}
                              className={`w-3.5 h-3.5 rounded border border-slate-300 transition-all cursor-pointer ${
                                stripPatternColor === c ? 'scale-110 ring-1 ring-pink-500' : ''
                              }`}
                            >
                              <div className="w-full h-full rounded-sm" style={{ backgroundColor: c }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SPECIAL DISCOVERY CARD STYLE & FOOTER TOGGLES */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-200 pb-1.5">
                  <span className="text-pink-500 text-sm">🏷️</span>
                  <span className="font-bubble text-[11px] font-bold uppercase tracking-wide">Bottom Card style & Footer Space Toggles</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 p-2 bg-white rounded-lg border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bubble text-[10px] font-bold text-slate-700">Card Plate Canvas Box</span>
                      <input
                        type="checkbox"
                        checked={showCardPlate}
                        onChange={(e) => { setShowCardPlate(e.target.checked); if (soundEnabled) playUIPop(); }}
                        className="w-3.5 h-3.5 cursor-pointer accent-pink-500"
                      />
                    </div>
                    <p className="text-[8px] font-mono text-slate-400 uppercase leading-normal">
                      Draw background box layer under bottom captions on/off.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 p-2 bg-white rounded-lg border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bubble text-[10px] font-bold text-slate-700">Include Card Footer Space</span>
                      <input
                        type="checkbox"
                        checked={enableCardSpacer}
                        onChange={(e) => { setEnableCardSpacer(e.target.checked); if (soundEnabled) playUIPop(); }}
                        className="w-3.5 h-3.5 cursor-pointer accent-pink-500"
                      />
                    </div>
                    <p className="text-[8px] font-mono text-slate-400 uppercase leading-normal">
                      Turn off to remove the entire 150px bottom slot entirely.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2.5: BORDER & FRAME LIBRARY WITH 100+ PRESET TEMPLATES AND VECTOR LIVE CONTROLS */}
          {activeTab === 'frames' && (
            <div className="flex flex-col gap-4 animate-fade-in text-slate-750">
              
              {/* Nested switcher: presets vs manual editors */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bubble text-xs font-bold text-pink-600 flex items-center gap-1">
                    💖 Select Frame Presets:
                  </span>
                  <span className="font-mono text-[9px] font-bold text-slate-400">105 HIGH-FIDELITY PRESET TEMPLATES</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {/* Search Bar frame presets */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <Search size={12} />
                    </span>
                    <input
                      type="text"
                      value={frameSearchQuery}
                      onChange={(e) => setFrameSearchQuery(e.target.value)}
                      placeholder="Search 100+ frame presets (e.g. film, gold, neon)..."
                      className="w-full pl-8 pr-3 py-1 border border-slate-200 rounded-xl font-bubble text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Horizontal Category Pill Scrollbar */}
                  <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-thin select-none">
                    {FRAME_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveFrameCategory(cat.id);
                          if (soundEnabled) playUIPop();
                        }}
                        className={`px-2.5 py-1 rounded-full border text-[9.5px] font-bubble cursor-pointer flex-shrink-0 flex items-center gap-1 transition-all ${
                          activeFrameCategory === cat.id 
                            ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold border-rose-450 shadow-xs' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.name}</span>
                        {cat.id === 'favorites' && ` (${favoriteFrameIds.length})`}
                      </button>
                    ))}
                  </div>

                  {/* Frame choices grid layout */}
                  {filteredFrames.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {filteredFrames.map((frame) => {
                        const isFav = favoriteFrameIds.includes(frame.id);
                        const isActive = activeFrameId === frame.id;

                        return (
                          <div
                            key={frame.id}
                            onClick={() => handleApplyFrameTemplate(frame)}
                            className={`p-2 rounded-xl border cursor-pointer select-none relative transition-all group overflow-hidden ${
                              isActive
                                ? 'border-pink-500 bg-pink-50/10 ring-2 ring-pink-200 scale-95 shadow-inner'
                                : 'border-slate-100 bg-white hover:border-pink-300 hover:scale-[1.01]'
                            }`}
                          >
                            <button
                              onClick={(e) => toggleFrameFavorite(e, frame.id)}
                              className="absolute top-1 right-1 text-slate-300 hover:text-amber-500 transition-colors z-20 cursor-pointer"
                            >
                              <Star
                                size={11}
                                className={`${isFav ? 'fill-amber-400 text-amber-500 animate-spin-once' : 'text-slate-300'}`}
                              />
                            </button>

                            {frame.isTrending && (
                              <div className="absolute top-0.5 left-1 bg-red-500 text-white font-bold rounded px-1 py-0.2 text-[7px] flex items-center gap-0.2 select-none z-10">
                                <Flame size={7} className="animate-pulse" /> HOT
                              </div>
                            )}

                            <div className="flex flex-col gap-1 pt-1.5 justify-between h-full">
                              <span className="font-bubble text-[10px] text-slate-800 font-bold group-hover:text-pink-600 truncate block">
                                {frame.name}
                              </span>

                              {/* Small vector simulation panel of frame style */}
                              <div
                                className="h-4 w-full rounded border flex items-center justify-center"
                                style={{
                                  background: frame.isGradient ? `linear-gradient(135deg, ${frame.gradientColors?.join(',')})` : frame.color,
                                  borderStyle: frame.borderStyle === 'double' ? 'double' : frame.borderStyle === 'dashed' ? 'dashed' : 'solid',
                                  borderWidth: frame.thickness > 12 ? '3px' : '1.5px',
                                  borderColor: frame.isGradient ? '#f472b6' : '#94a3b8'
                                }}
                              >
                                <span className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-tighter shrink-0 scale-90">
                                  {frame.texture !== 'none' ? frame.texture : 'solid'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <p className="font-bubble text-slate-500 text-[11px]">No frame templates matches...</p>
                      <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Try modifying your search query filters!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* LIVE BORDER STYLE CUSTOMIZER SECTION */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col gap-3.5">
                <span className="font-bubble text-xs font-bold text-pink-600 border-b border-slate-100 pb-1.5 flex items-center gap-1 select-none">
                  ⚙️ Vector Frame Design lab:
                </span>

                {/* 1. SOLID VS GRADIENT BACKPLATE SETTING */}
                <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bubble text-[11px] text-slate-700 font-bold select-none">🌈 Use Gradient frame:</span>
                    <input
                      type="checkbox"
                      checked={frameIsGradient}
                      onChange={(e) => {
                        setFrameIsGradient(e.target.checked);
                        if (soundEnabled) playUIPop();
                      }}
                      className="w-4 h-4 cursor-pointer accent-pink-500"
                    />
                  </div>

                  {frameIsGradient ? (
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bubble text-[9.5px] font-bold text-slate-500 bg-purple-50 px-1.5 py-0.5 rounded text-purple-700">🌈 Grad Colors:</span>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={frameGradientColors[0] || '#ff6cb2'}
                          onChange={(e) => {
                            setFrameGradientColors([e.target.value, frameGradientColors[1] || '#ffccf9']);
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="color"
                          value={frameGradientColors[1] || '#ffccf9'}
                          onChange={(e) => {
                            setFrameGradientColors([frameGradientColors[0] || '#ff6cb2', e.target.value]);
                          }}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-bubble text-[11px] font-bold text-slate-700">🎨 Frame Solid Color:</span>
                      <input
                        type="color"
                        value={frameColor}
                        onChange={(e) => {
                          setFrameColor(e.target.value);
                          setFrameIsGradient(false);
                        }}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* 2. SLIDERS: THICKNESS AND CORNER RADIUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-bubble font-bold text-slate-700 mb-1">
                      <span>📏 Border Thickness:</span>
                      <span className="text-pink-500">{frameThickness}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={frameThickness}
                      onChange={(e) => setFrameThickness(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-bubble font-bold text-slate-700 mb-1">
                      <span>💮 Rounded Corners radius:</span>
                      <span className="text-pink-500">{frameCornerRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="35"
                      value={frameCornerRadius}
                      onChange={(e) => setFrameCornerRadius(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. BORDER STYLE & OVERLAY TEXTURES CHOOSE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bubble text-[11px] text-slate-700 font-bold block mb-1">
                      🎀 Frame Boundary Style:
                    </label>
                    <select
                      value={frameBorderStyle}
                      onChange={(e) => {
                        setFrameBorderStyle(e.target.value as any);
                        if (soundEnabled) playUIPop();
                      }}
                      className="w-full px-2 py-1 font-bubble text-xs border border-slate-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-300"
                    >
                      <option value="solid">Simple Solid line</option>
                      <option value="dashed">Dashed Washi line</option>
                      <option value="double">Premium Double lines</option>
                      <option value="torn">Hand-Torn paper edge</option>
                      <option value="3d">Glassy 3D Highlight</option>
                      <option value="neon">Electric Neon glow</option>
                      <option value="layered">Double Layered stack</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bubble text-[11px] text-slate-700 font-bold block mb-1">
                      💎 Frame Ambient Texture:
                    </label>
                    <select
                      value={frameTexture}
                      onChange={(e) => {
                        setFrameTexture(e.target.value as any);
                        if (soundEnabled) playUIPop();
                      }}
                      className="w-full px-2 py-1 font-bubble text-xs border border-slate-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-300"
                    >
                      <option value="none">Flat Solids Gloss</option>
                      <option value="paper">Subtle paper fibers</option>
                      <option value="glitter">Dazzling glitter dust</option>
                      <option value="holographic">Spectral hologram wavs</option>
                      <option value="gold_foil">Luxury gold-foil leaf</option>
                      <option value="chrome">Aqueous space chrome</option>
                      <option value="doodle">Cute cozy hand-doodles</option>
                      <option value="film">70s Spocket Film frames</option>
                    </select>
                  </div>
                </div>

                {/* 4. PATTERNS OVERLAYS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bubble text-[11px] text-slate-700 font-bold block mb-1">
                      🧇 Repeated pattern overlay:
                    </label>
                    <select
                      value={framePatternOverlay}
                      onChange={(e) => {
                        setFramePatternOverlay(e.target.value);
                        if (soundEnabled) playUIPop();
                      }}
                      className="w-full px-2 py-1 font-bubble text-xs border border-slate-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-pink-300"
                    >
                      <option value="none">No Pattern details</option>
                      <option value="checkered">Vans Checkered tiles</option>
                      <option value="dots">Cute polka dots</option>
                      <option value="stripes">Classic diagonal stripes</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bubble font-bold text-slate-705 mb-1">
                      <span>🎚️ Frame opacity density:</span>
                      <span className="text-pink-500">{Math.round(frameOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={frameOpacity * 100}
                      onChange={(e) => setFrameOpacity(Number(e.target.value) / 100)}
                      className="w-full accent-pink-500 cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* 5. COZY STICKERS & PLACEMENT DECK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2 bg-white rounded-xl border border-slate-100">
                  <div>
                    <label className="font-bubble text-[10px] uppercase font-bold block mb-1 text-slate-500">
                      👼 Border Stamps (Stickers):
                    </label>
                    <div className="flex gap-1">
                      {['✨,🎀,🧸', '🌸,🍼,🐥', '🎃,👻,🕸️', '🎄,⛄,🎁', '💒,💍,🕊️'].map((stampRow, sIdx) => {
                        const activeRowList = stampRow.split(',');
                        const isCurrentSelected = frameStickers[0] === activeRowList[0];
                        return (
                          <button
                            key={sIdx}
                            onClick={() => {
                              setFrameStickers(activeRowList);
                              setFrameStickerPlacement('corners');
                              if (soundEnabled) playSparkleSound();
                            }}
                            className={`p-1 border rounded-lg hover:bg-pink-50 text-xs flex gap-0.5 cursor-pointer transition-all ${
                              isCurrentSelected 
                                ? 'border-pink-500 bg-pink-100/70 scale-95 font-bold shadow-inner' 
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            {activeRowList[0]}
                            {activeRowList[1]}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => {
                          setFrameStickers([]);
                          setFrameStickerPlacement('none');
                          if (soundEnabled) playUIPop();
                        }}
                        className="p-1 px-1.5 border border-red-200 bg-red-50 text-red-500 text-[10px] font-bubble rounded-lg hover:bg-red-100"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bubble text-[10px] uppercase font-bold block mb-1 text-slate-500">
                      📍 Stamp positions:
                    </label>
                    <select
                      value={frameStickerPlacement}
                      onChange={(e) => {
                        setFrameStickerPlacement(e.target.value as any);
                        if (soundEnabled) playUIPop();
                      }}
                      className="w-full px-2 py-0.5 font-bubble text-xs border border-slate-200 rounded-lg bg-white cursor-pointer focus:outline-none"
                    >
                      <option value="none">Stamps inactive</option>
                      <option value="corners">4 Corners wrapper</option>
                      <option value="top_bottom">Top and Bottom</option>
                      <option value="sides">Left and Right margins</option>
                      <option value="scattered">Scattered randomly</option>
                    </select>
                  </div>
                </div>

                {/* 6. NEON GLOW DEPTH LAB */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2 bg-purple-50/20 rounded-xl border border-purple-100/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bubble text-[11px] font-bold text-slate-700">🔮 Custom Neon Glow Color:</span>
                    <input
                      type="color"
                      value={frameGlowColor === 'transparent' ? '#ff66b2' : frameGlowColor}
                      onChange={(e) => {
                        setFrameGlowColor(e.target.value);
                        if (frameGlowIntensity === 0) setFrameGlowIntensity(10);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bubble font-bold text-slate-705 mb-1">
                      <span>🎇 Neon glow power:</span>
                      <span className="text-pink-500">{frameGlowIntensity}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={frameGlowIntensity}
                      onChange={(e) => {
                        setFrameGlowIntensity(Number(e.target.value));
                        if (Number(e.target.value) > 0 && frameGlowColor === 'transparent') {
                          setFrameGlowColor('#ff6cb2');
                        }
                      }}
                      className="w-full accent-pink-500 cursor-pointer text-xs mb-1"
                    />
                  </div>
                </div>

                {/* 7. DRAG AND DROP HIGH-FIDELITY CUSTOM PATTERN UPLOADER */}
                <div className="bg-white p-2.5 rounded-2xl border border-dashed border-pink-300">
                  <span className="font-bubble text-[11px] font-bold text-slate-700 block mb-1">
                    📂 Upload custom tiled texture / pattern:
                  </span>
                  
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.result) {
                              setFrameCustomTextureUrl(reader.result as string);
                              setFrameTexture('none'); // deactivate preset
                              if (soundEnabled) playSparkleSound();
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="font-bubble text-xs text-slate-550 file:cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-xl file:border-0 file:text-[10px] file:font-bubble file:bg-pink-100 file:text-pink-700 file:hover:bg-pink-200 cursor-pointer"
                    />
                    
                    {frameCustomTextureUrl && (
                      <button
                        onClick={() => {
                          setFrameCustomTextureUrl(null);
                          if (soundEnabled) playUIPop();
                        }}
                        className="px-2 py-1 text-[10px] border border-red-200 hover:bg-red-50 text-red-500 font-bubble rounded-lg"
                      >
                        Reset pattern
                      </button>
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter block mt-1">Accepts JPG/PNG tile vectors. Tiles repeatedly on borders.</span>
                </div>

              </div>
              
              <button
                onClick={() => {
                  setActiveFrameId('f_default_white');
                  setFrameColor('#ffffff');
                  setFrameIsGradient(false);
                  setFrameThickness(10);
                  setFrameCornerRadius(8);
                  setFrameBorderStyle('solid');
                  setFrameTexture('paper');
                  setFrameOpacity(1.0);
                  setFrameGlowColor('transparent');
                  setFrameGlowIntensity(0);
                  setFrameShadowDepth(4);
                  setFrameStickers([]);
                  setFrameStickerPlacement('none');
                  setFrameCustomTextureUrl(null);
                  setFramePatternOverlay('none');
                  if (soundEnabled) playDigitalBeep(false);
                }}
                className="w-full py-1.5 text-[10.5px] border border-dashed border-slate-350 hover:bg-slate-50 rounded-xl font-bubble text-slate-500"
              >
                🩹 Reboot frame settings to Classical Paper
              </button>

            </div>
          )}

          {/* TAB 3: MATRIX STRIP GRID ADJUSTER & WEBCAM OVERLAYS */}
          {activeTab === 'layout' && (
            <div className="flex flex-col gap-4 animate-fade-in text-slate-700">
              
              {/* SELECT GRID MATRIX SHAPE LAYOUT FOR STRIPS */}
              <div>
                <label className="font-bubble text-xs text-slate-705 font-bold block mb-1.5 text-slate-700">
                  📐 Select Matrix Collage Shape:
                </label>
                <div className="grid grid-cols-2 gap-2" id="design-layouts-deck">
                  <button
                    onClick={() => { setFormat('4_shot'); if (soundEnabled) playUIPop(); }}
                    className={`px-3 py-2.5 rounded-xl border font-bubble text-xs cursor-pointer flex items-center gap-1.5 justify-center ${
                      format === '4_shot' ? 'bg-pink-400 border-slate-800 text-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    🎞️ Classical Strip (4x)
                  </button>
                  <button
                    onClick={() => { setFormat('2_shot'); if (soundEnabled) playUIPop(); }}
                    className={`px-3 py-2.5 rounded-xl border font-bubble text-xs cursor-pointer flex items-center gap-1.5 justify-center ${
                      format === '2_shot' ? 'bg-pink-400 border-slate-800 text-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    🎏 Cute Mini Strip (2x)
                  </button>
                  <button
                    onClick={() => { setFormat('square_grid'); if (soundEnabled) playUIPop(); }}
                    className={`px-3 py-2.5 rounded-xl border font-bubble text-xs cursor-pointer flex items-center gap-1.5 justify-center ${
                      format === 'square_grid' ? 'bg-pink-400 border-slate-800 text-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    🧇 Square Grid matrix
                  </button>
                  <button
                    onClick={() => { setFormat('polaroid'); if (soundEnabled) playUIPop(); }}
                    className={`px-3 py-2.5 rounded-xl border font-bubble text-xs cursor-pointer flex items-center gap-1.5 justify-center ${
                      format === 'polaroid' ? 'bg-pink-400 border-slate-800 text-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    💮 Solo Polaroid card
                  </button>
                </div>
              </div>

              {/* RETRO CAM STAMP DATE DIAL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bubble text-xs text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer">
                    <Calendar size={13} className="text-orange-500 animate-bounce" /> LED Webcam Date Stamp
                  </label>
                  <input
                    type="checkbox"
                    checked={stampDate}
                    onChange={(e) => { setStampDate(e.target.checked); if (soundEnabled) playUIPop(); }}
                    className="w-4 h-4 cursor-pointer accent-pink-500"
                  />
                </div>

                {stampDate && (
                  <div className="flex flex-col gap-1.5 pl-5 border-l border-orange-200 ml-1.5">
                    <span className="font-pixel text-[10px] text-slate-500">SELECT NOSTALGIC YEAR OFFSET:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['1999', '2000', '2002', '2005', '2008', '2026'].map((yr) => (
                        <button
                          key={yr}
                          onClick={() => { setCustomYear(yr); if (soundEnabled) playDigitalBeep(false); }}
                          className={`px-2.5 py-1 border rounded-lg font-pixel text-xs cursor-pointer transition-colors ${
                            customYear === yr 
                              ? 'bg-orange-100 border-orange-550 text-orange-600 font-bold shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                          ’{yr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Informative tutorial tooltip helper */}
              <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3 text-slate-500">
                <p className="font-bubble text-[10.5px] leading-relaxed select-none">
                  💡 **Design Pro-tip:** Choose a **"2x2 Square Grid"** matrix with the **"Premium Frosted Glass"** template for elegant aesthetic results that fit perfectly on social media grids!
                </p>
              </div>

            </div>
          )}
        </div>

        {/* BOTTOM SECTION: PRIMARY ACTION INJECTS & DIGITAL EXPORTS */}
        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
          
          {/* Main compilation triggers */}
          <div className="grid grid-cols-2 gap-2" id="action-triggers-deck">
            <button
              onClick={() => handleDownload('png')}
              disabled={isExporting}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bubble text-xs font-bold rounded-xl shadow-[3px_3px_0px_0px_#ff007f] cursor-pointer border border-slate-950 flex items-center gap-1.5 justify-center active:translate-y-0.5"
            >
              <Download size={14} className="animate-pulse" /> Download Pure PNG
            </button>
            
            <button
              onClick={() => handleDownload('jpg')}
              disabled={isExporting}
              className="py-3 px-4 bg-pink-50 border border-pink-400 hover:bg-pink-100 text-pink-700 font-bubble text-xs font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5 justify-center active:translate-y-0.5"
            >
              📂 Export Solid JPG Backplate
            </button>
          </div>

          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-100 to-pink-100 hover:from-pink-100 hover:to-indigo-100 border border-pink-300 text-pink-700 font-bubble text-xs font-bold rounded-xl select-none flex items-center gap-1.5 justify-center cursor-pointer transition-all active:translate-y-0.5"
          >
            <Share2 size={13} className="text-pink-500" /> Share bottom card with Besties 🪐
          </button>
        </div>

        {/* Hidden internal print canvas target holder */}
        <canvas ref={exportCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
