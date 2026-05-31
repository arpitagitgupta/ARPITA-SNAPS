import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, RotateCw, Plus, ArrowUp, ArrowDown, Type, Sparkles, Check, Heart, Search, Star, Sliders, RotateCcw, Flame } from 'lucide-react';
import { CanvasElement, StickerTemplate, ThemeConfig, CapturedPhoto } from '../types';
import { STICKER_CATALOG, INSTANT_CAPTIONS } from '../data';
import { playDigitalBeep, playUIPop, playSparkleSound } from '../utils/audio';
import { PREMIUM_RIBBONS, RIBBON_CATEGORIES, RibbonTemplate } from '../ribbons';


interface StickerStudioProps {
  photo: CapturedPhoto;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  activeTheme: ThemeConfig;
  soundEnabled: boolean;
}

const TEXT_COLORS = [
  { name: 'Y2K Pink', color: '#ff66b2', glow: '#fb7185' },
  { name: 'Sky Cyan', color: '#06b6d4', glow: '#67e8f9' },
  { name: 'Tamago Lime', color: '#84cc16', glow: '#a3e635' },
  { name: 'Cyber Purple', color: '#a855f7', glow: '#c084fc' },
  { name: 'Goth Black', color: '#0f172a', glow: '#ffffff' },
  { name: 'Gloss White', color: '#ffffff', glow: '#ffccf9' }
];

const svgStringCleanViewBox = (svgStr: string) => {
  return svgStr
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, 'height="100%"')
    .replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMid meet"');
};

export default function StickerStudio({
  photo,
  elements,
  setElements,
  activeTheme,
  soundEnabled
}: StickerStudioProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'hearts' | 'stars' | 'butterflies' | 'pixel' | 'kawaii' | 'text_bubble'>('hearts');
  
  // Custom Studio Main Tabs
  const [activeStudioTab, setActiveStudioTab] = useState<'stickers' | 'ribbons'>('stickers');

  // Ribbon Studio specific states
  const [ribbonCategory, setRibbonCategory] = useState<string>('all');
  const [ribbonSearch, setRibbonSearch] = useState<string>('');
  const [ribbonFavorites, setRibbonFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arpitasnaps_fav_ribbons');
      return saved ? JSON.parse(saved) : ['bow_classic', 'puffy_cloud_ribbon', 'angelcore_feather', 'love_pulse_valentine'];
    } catch {
      return ['bow_classic', 'puffy_cloud_ribbon', 'angelcore_feather', 'love_pulse_valentine'];
    }
  });

  // Ribbon interactive custom configuration
  const [ribbonColor, setRibbonColor] = useState('#ff66b2');
  const [ribbonOpacity, setRibbonOpacity] = useState(1.0);
  const [ribbonGlow, setRibbonGlow] = useState(false);
  const [ribbonGlitter, setRibbonGlitter] = useState(false);
  const [ribbonShadow, setRibbonShadow] = useState(true);
  const [ribbonSway, setRibbonSway] = useState(false);
  const [ribbonWidth, setRibbonWidth] = useState(120);

  // Custom text builder states
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState<'Fredoka' | 'VT323' | 'Space Grotesk' | 'Pacifico'>('Fredoka');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [useGlow, setUseGlow] = useState(true);

  // Dragging event reference status
  const dragStartRef = useRef<{ x: number; y: number; elemX: number; elemY: number } | null>(null);
  const transformRef = useRef<{ elemId: string; startAngle: number; startScale: number; startX: number; startY: number } | null>(null);

  // Sync selected element ribbon configuration to input state on highlight focus
  useEffect(() => {
    const activeEl = elements.find((el) => el.id === selectedId);
    if (activeEl && activeEl.type === 'ribbon') {
      // Sync state parameters so widgets bind cleanly
      setRibbonColor(activeEl.color || '#ff66b2');
      setRibbonOpacity(activeEl.opacity ?? 1.0);
      setRibbonGlow(!!activeEl.hasGlow);
      setRibbonGlitter(!!activeEl.hasGlitter);
      setRibbonShadow(!!activeEl.hasShadow);
      setRibbonSway(!!activeEl.hasSway);
      setRibbonWidth(activeEl.width || 120);
      setActiveStudioTab('ribbons'); // Auto shift focus tab to Customize Ribbons
    }
  }, [selectedId]);

  // Handler to push live color, opacity etc down to highlighted active element
  const updateSelectedRibbonAttr = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedId && el.type === 'ribbon') {
          return { ...el, ...updates };
        }
        return el;
      })
    );
  };

  // Close selection when outer container is tapped
  const handleOuterClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('non-sticker-click')) {
      setSelectedId(null);
    }
  };

  // 1. Add STICKER from Catalog
  const handleAddSticker = (sticker: StickerTemplate) => {
    const newId = 'stk_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    const newElement: CanvasElement = {
      id: newId,
      type: 'sticker',
      content: sticker.content,
      x: 40 + Math.random() * 20, // offset randomly in center area
      y: 40 + Math.random() * 20,
      scale: 1.3,
      rotation: Math.random() * 30 - 15,
      layer: elements.length + 1
    };
    
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newId);
    if (soundEnabled) playSparkleSound();
  };

  // 2. Add CUSTOM TEXT Overlay
  const handleAddText = (customText?: string) => {
    const textToAdd = customText || textInput.trim();
    if (!textToAdd) return;

    const newId = 'txt_' + Date.now();
    const activeColor = TEXT_COLORS[selectedColorIdx];
    const newElement: CanvasElement = {
      id: newId,
      type: 'text',
      content: textToAdd,
      x: 30 + Math.random() * 20,
      y: 45 + Math.random() * 10,
      scale: 1.4,
      rotation: 0,
      layer: elements.length + 1,
      fontFamily: selectedFont,
      color: activeColor.color,
      glowColor: useGlow ? activeColor.glow : undefined,
      isGradient: Math.random() > 0.6 // Random stylish gradient text flag
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newId);
    if (!customText) setTextInput(''); // Reset input if typed
    if (soundEnabled) playSparkleSound();
  };

  // 3. Add PREMIUM RIBBON Deco
  const handleAddRibbon = (ribObj: RibbonTemplate) => {
    const newId = 'rib_' + Date.now() + '_' + Math.floor(Math.random() * 100);
    const newElement: CanvasElement = {
      id: newId,
      type: 'ribbon',
      content: ribObj.id, // Identifier string
      ribbonId: ribObj.id,
      x: 35 + Math.random() * 15, // center area placement
      y: 40 + Math.random() * 10,
      scale: 1.0,
      rotation: ribObj.category.includes('corner') ? 45 : 0,
      layer: elements.length + 1,
      color: ribbonColor || ribObj.defaultColor,
      opacity: ribbonOpacity,
      hasGlow: ribbonGlow,
      hasGlitter: ribbonGlitter,
      hasShadow: ribbonShadow,
      hasSway: ribbonSway,
      width: ribbonWidth
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newId);
    if (soundEnabled) playSparkleSound();
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
    if (soundEnabled) playDigitalBeep(false);
  };

  // Update layering score index
  const changeLayer = (id: string, direction: 'up' | 'down') => {
    setElements((prev) => {
      const items = [...prev];
      const idx = items.findIndex((el) => el.id === id);
      if (idx === -1) return prev;
      
      const step = direction === 'up' ? 1 : -1;
      const targetIdx = idx + step;
      
      if (targetIdx >= 0 && targetIdx < items.length) {
        // Swap layers
        const temp = items[idx].layer;
        items[idx].layer = items[targetIdx].layer;
        items[targetIdx].layer = temp;
        
        // Sort items by layer
        return items.sort((a, b) => a.layer - b.layer);
      }
      return prev;
    });
    if (soundEnabled) playUIPop();
  };

  // Mouse / Touch handlers for reliable manual dragging inside absolute frame
  const handleElementDragStart = (e: React.MouseEvent | React.TouchEvent, el: CanvasElement) => {
    e.stopPropagation();
    setSelectedId(el.id);
    if (soundEnabled) playUIPop();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      elemX: el.x,
      elemY: el.y
    };

    document.addEventListener('mousemove', handleElementDragMove);
    document.addEventListener('mouseup', handleElementDragEnd);
    document.addEventListener('touchmove', handleElementDragMove, { passive: false });
    document.addEventListener('touchend', handleElementDragEnd);
  };

  const handleElementDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragStartRef.current || !selectedId || !containerRef.current) return;
    e.preventDefault(); // stop scroll jitter of page

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    const rect = containerRef.current.getBoundingClientRect();
    
    // convert px delta back to percentage points relative to aspect-ratio box
    const percentDeltaX = (deltaX / rect.width) * 100;
    const percentDeltaY = (deltaY / rect.height) * 100;

    const startX = dragStartRef.current.elemX;
    const startY = dragStartRef.current.elemY;

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? {
              ...el,
              x: Math.min(Math.max(startX + percentDeltaX, -20), 110),
              y: Math.min(Math.max(startY + percentDeltaY, -20), 110)
            }
          : el
      )
    );
  };

  const handleElementDragEnd = () => {
    dragStartRef.current = null;
    document.removeEventListener('mousemove', handleElementDragMove);
    document.removeEventListener('mouseup', handleElementDragEnd);
    document.removeEventListener('touchmove', handleElementDragMove);
    document.removeEventListener('touchend', handleElementDragEnd);
  };

  // Math-heavy handle calculations for Drag Custom Rotator & Scale
  const handleTransformStart = (e: React.MouseEvent | React.TouchEvent, el: CanvasElement) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Center coordinates
    const centerX = rect.left + (el.x / 100) * rect.width;
    const centerY = rect.top + (el.y / 100) * rect.height;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const startAngle = Math.atan2(dy, dx);
    const startScale = el.scale;

    transformRef.current = {
      elemId: el.id,
      startAngle,
      startScale,
      startX: clientX,
      startY: clientY
    };

    document.addEventListener('mousemove', handleTransformMove);
    document.addEventListener('mouseup', handleTransformEnd);
    document.addEventListener('touchmove', handleTransformMove, { passive: false });
    document.addEventListener('touchend', handleTransformEnd);
  };

  const handleTransformMove = (e: MouseEvent | TouchEvent) => {
    if (!transformRef.current || !containerRef.current) return;
    e.preventDefault();

    const elId = transformRef.current.elemId;
    const el = elements.find((item) => item.id === elId);
    if (!el) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const centerX = rect.left + (el.x / 100) * rect.width;
    const centerY = rect.top + (el.y / 100) * rect.height;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Angle calculation:
    const currentAngle = Math.atan2(dy, dx);
    const angleDiff = currentAngle - transformRef.current.startAngle;
    const newRotation = el.rotation + (angleDiff * 180) / Math.PI;

    // Scale calculation:
    const initialDistance = Math.hypot(
      transformRef.current.startX - centerX,
      transformRef.current.startY - centerY
    );
    const currentDistance = Math.hypot(dx, dy);
    
    // Smooth factor limit
    const newScale = Math.min(Math.max((currentDistance / initialDistance) * transformRef.current.startScale, 0.4), 4.5);

    setElements((prev) =>
      prev.map((item) =>
        item.id === elId
          ? {
              ...item,
              rotation: Math.round(newRotation),
              scale: Number(newScale.toFixed(2))
            }
          : item
      )
    );
  };

  const handleTransformEnd = () => {
    transformRef.current = null;
    document.removeEventListener('mousemove', handleTransformMove);
    document.removeEventListener('mouseup', handleTransformEnd);
    document.removeEventListener('touchmove', handleTransformMove);
    document.removeEventListener('touchend', handleTransformEnd);
  };

  const categories = [
    { id: 'hearts', name: '🎀 Bows', list: STICKER_CATALOG.filter(s => s.category === 'hearts') },
    { id: 'stars', name: '✨ Sparkle', list: STICKER_CATALOG.filter(s => s.category === 'stars') },
    { id: 'butterflies', name: '🦋 Pastel', list: STICKER_CATALOG.filter(s => s.category === 'butterflies') },
    { id: 'kawaii', name: '🐰 Cute', list: STICKER_CATALOG.filter(s => s.category === 'kawaii') },
    { id: 'pixel', name: '👾 Pixel', list: STICKER_CATALOG.filter(s => s.category === 'pixel') },
    { id: 'text_bubble', name: '💬 Word', list: STICKER_CATALOG.filter(s => s.category === 'text_bubble') }
  ];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 w-full non-sticker-click" onClick={handleOuterClick}>
      {/* LEFT: DRAGGABLE WORKSPACE CANVAS VIEW */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center non-sticker-click">
        <center className="font-bubble text-slate-500 text-xs mb-2 select-none">
          ✨ Press and drag stickers to slide. Tap corner rotators 🔄 to twist & stretch!
        </center>
        
        <div 
          ref={containerRef}
          className="relative aspect-[4/3] w-full max-w-[550px] bg-zinc-900 rounded-2xl y2k-border overflow-hidden select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Captured Selfie image background */}
          <img 
            src={photo.dataUrl} 
            alt="Active photobooth capture frame"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* DYNAMIC CANVAS STICKER RENDER GRID */}
          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            
            return (
              <div
                key={el.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 select-none ${
                  isSelected ? 'z-40' : 'z-20'
                }`}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  zIndex: el.layer + 10,
                  touchAction: 'none'
                }}
              >
                {/* Visual Bounding Circle outlines to select/edit stickers */}
                <div 
                  className={`relative p-2 rounded-lg cursor-grab active:cursor-grabbing ${
                    isSelected ? 'border-2 border-dashed border-rose-500 ring-2 ring-pink-300' : 'hover:border-2 hover:border-dashed hover:border-slate-400'
                  }`}
                  onMouseDown={(e) => handleElementDragStart(e, el)}
                  onTouchStart={(e) => handleElementDragStart(e, el)}
                  style={{
                    transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
                    transition: dragStartRef.current ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  {/* STICKER TEXT/EMOJI CONTENT TARGETS */}
                  {el.type === 'sticker' ? (
                    <span className="text-4xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] select-none pointer-events-none">
                      {el.content}
                    </span>
                  ) : el.type === 'ribbon' ? (
                    (() => {
                      const ribbonTemplate = PREMIUM_RIBBONS.find(r => r.id === el.ribbonId);
                      const svgString = ribbonTemplate 
                        ? ribbonTemplate.svgTemplate(el.color || ribbonTemplate.defaultColor, {
                            hasShadow: el.hasShadow,
                            hasGlow: el.hasGlow,
                            hasGlitter: el.hasGlitter
                          })
                        : '';
                      return (
                        <div
                          className={`select-none pointer-events-none ${el.hasSway ? 'animate-bounce-subtle' : ''} ${el.hasGlitter ? 'animate-glitter' : ''}`}
                          style={{
                            opacity: el.opacity ?? 1,
                            width: `${(el.width || 120)}px`,
                            height: 'auto',
                            filter: el.hasGlow ? 'drop-shadow(0 0 10px rgba(255,102,178,0.75))' : undefined,
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          dangerouslySetInnerHTML={{ __html: svgString }}
                        />
                      );
                    })()
                  ) : (
                    // TEXT OVERLAY RENDER
                    <span 
                      className={`text-2xl select-none font-bold whitespace-nowrap block drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] leading-none`}
                      style={{
                        fontFamily: el.fontFamily === 'Fredoka' ? 'var(--font-bubble)' : el.fontFamily === 'VT323' ? 'var(--font-pixel)' : el.fontFamily === 'Space Grotesk' ? 'var(--font-cyber)' : 'var(--font-handwriting)',
                        color: el.color,
                        textShadow: el.glowColor ? `0 0 8px ${el.glowColor}, 0 0 15px ${el.glowColor}` : undefined,
                        background: el.isGradient ? `linear-gradient(135deg, ${el.color}, #f472b6, #fb7185)` : undefined,
                        WebkitBackgroundClip: el.isGradient ? 'text' : undefined,
                        WebkitTextFillColor: el.isGradient ? 'transparent' : undefined
                      }}
                    >
                      {el.content}
                    </span>
                  )}

                  {/* MINI TRANSFORM ACTION ARRAYS FOR SELECTION HUD */}
                  {isSelected && (
                    <>
                      {/* Delete node handle */}
                      <button
                        onMouseDown={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                        onTouchStart={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}
                        className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-rose-500 border border-white flex items-center justify-center text-white cursor-pointer shadow-md"
                        title="Delete sticker"
                      >
                        <Trash2 size={12} />
                      </button>

                      {/* Rotate and Stretch handle */}
                      <div
                        onMouseDown={(e) => handleTransformStart(e, el)}
                        onTouchStart={(e) => handleTransformStart(e, el)}
                        className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-cyan-400 border border-white flex items-center justify-center text-white cursor-pointer shadow-md select-none"
                        title="Rotate / Scale sticker"
                      >
                        <RotateCw size={12} />
                      </div>

                      {/* Bring Forward node indices */}
                      <button
                        onMouseDown={(e) => { e.stopPropagation(); changeLayer(el.id, 'up'); }}
                        onTouchStart={(e) => { e.stopPropagation(); changeLayer(el.id, 'up'); }}
                        className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-white text-slate-800 border border-slate-400 flex items-center justify-center cursor-pointer shadow-xs"
                        title="Bring to front"
                      >
                        <ArrowUp size={10} />
                      </button>

                      {/* Send Backward layer indices */}
                      <button
                        onMouseDown={(e) => { e.stopPropagation(); changeLayer(el.id, 'down'); }}
                        onTouchStart={(e) => { e.stopPropagation(); changeLayer(el.id, 'down'); }}
                        className="absolute -bottom-3 -left-3 w-5 h-5 rounded-full bg-white text-slate-800 border border-slate-400 flex items-center justify-center cursor-pointer shadow-xs"
                        title="Send to back"
                      >
                        <ArrowDown size={10} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: DECORATOR ACCORDION PANELS */}
      <div className="lg:col-span-5 flex flex-col gap-4 p-5 bg-white/95 rounded-2xl y2k-border">
        {/* TAB HEADER SWITCH PANEL */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h2 className="bubble-font text-lg font-black text-rose-500 tracking-tight flex items-center gap-1.5 text-shadow-xs">
              Y2K DECO STUDIO ★
            </h2>
            <p className="text-[10px] uppercase font-mono font-bold text-pink-500">Decorate snapshots with cute ribbons & stickers</p>
          </div>
        </div>

        {/* WORKSPACE MODE MAIN TABS */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {
              setActiveStudioTab('stickers');
              if (soundEnabled) playUIPop();
            }}
            className={`py-2 text-xs font-bubble rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStudioTab === 'stickers'
                ? 'bg-rose-400 border border-slate-700 text-rose-950 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            🧸 Stickers & Tags
          </button>
          <button
            onClick={() => {
              setActiveStudioTab('ribbons');
              if (soundEnabled) playUIPop();
            }}
            className={`py-2 text-xs font-bubble rounded-lg transition-all flex items-center justify-center gap-1.5 relative cursor-pointer ${
              activeStudioTab === 'ribbons'
                ? 'bg-purple-400 border border-slate-700 text-purple-950 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
            }`}
          >
            🎀 Ribbon Studio
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono font-black text-[8px] px-1.5 py-0.5 rounded-full animate-bounce">
              NEW
            </span>
          </button>
        </div>

        {activeStudioTab === 'stickers' ? (
          /* ================== STICKERS & TEXT WORKSPACE ================== */
          <div className="flex flex-col gap-4">
            {/* DRAGGABLE CUSTOM CATEGORY SELECTORS */}
            <div className="flex border-b border-slate-200 pb-2 overflow-x-auto gap-1 hide-scrollbars">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as any);
                    if (soundEnabled) playUIPop();
                  }}
                  className={`px-2.5 py-1 text-xs font-bubble rounded-lg transition-colors border select-none cursor-pointer flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-rose-100 border-rose-300 text-rose-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* STICKER DISPENSARY DISPLAY */}
            <div className="max-h-[140px] overflow-y-auto grid grid-cols-5 gap-2 p-1 bg-pink-50/20 border border-slate-200 rounded-2xl hide-scrollbars">
              {categories.find((c) => c.id === activeCategory)?.list.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleAddSticker(stk)}
                  className="aspect-square bg-white border-2 border-slate-300 rounded-xl flex items-center justify-center hover:border-pink-400 hover:scale-105 active:scale-95 transition-all text-2xl select-none container-sticker shadow-xs cursor-pointer"
                >
                  {stk.content}
                </button>
              ))}
            </div>

            {/* TYPEWRITE AESTHETIC TEXT ENTRY DOCKS */}
            <div className="border-t border-slate-200 pt-3">
              <label className="font-bubble text-xs text-slate-700 font-semibold flex items-center gap-1 mb-1.5">
                <Type size={12} className="text-purple-500" /> Type Cute Text or Captions:
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. BFF Angel..."
                  maxLength={20}
                  className="flex-1 px-3 py-1.5 border-2 border-slate-700 rounded-xl text-xs font-bubble text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddText();
                  }}
                />
                <button
                  onClick={() => handleAddText()}
                  className="px-3.5 bg-purple-400 hover:bg-purple-500 border-2 border-slate-800 rounded-xl font-bubble text-xs text-slate-900 font-bold active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)] cursor-pointer"
                >
                  Add!
                </button>
              </div>

              {/* QUICK CHOOSE COMMONLY USED COOL RETRO SLOGANS */}
              <div className="mb-3">
                <span className="text-[9px] uppercase font-mono font-bold text-indigo-400 mb-1 block">⚡ Fast Aesthetic Slap Captions:</span>
                <div className="flex flex-wrap gap-1 max-h-[70px] overflow-y-auto pr-1 hide-scrollbars">
                  {INSTANT_CAPTIONS.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => handleAddText(cap)}
                      className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-[9px] font-bubble text-indigo-700 cursor-pointer"
                    >
                      + {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* STYLISH FONT FAMILY OPTIONS */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-500 mb-1 block">🎀 Y2K Font Select</span>
                  <select
                    value={selectedFont}
                    onChange={(e: any) => setSelectedFont(e.target.value)}
                    className="w-full p-1 border-2 border-slate-300 rounded-lg text-[10px] font-bubble focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Fredoka">Bubbly Fredoka</option>
                    <option value="VT323">Pixel VT323</option>
                    <option value="Space Grotesk">Cyber Space</option>
                    <option value="Pacifico">Cute Sketch</option>
                  </select>
                </div>

                {/* NEON SHINE GLOW OPTION BUTTON */}
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-slate-500 mb-1 block">✨ Glow Filter</span>
                  <button
                    onClick={() => setUseGlow(!useGlow)}
                    className={`w-full p-1 border-2 rounded-lg text-[10px] font-bubble flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      useGlow 
                        ? 'border-pink-500 bg-pink-100/50 text-pink-700 font-bold' 
                        : 'border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    <Sparkles size={10} /> {useGlow ? "Glow ON!" : "Glow Off"}
                  </button>
                </div>
              </div>

              {/* PALETTE DISPENSARY DISPLAY */}
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-slate-500 mb-1 block">🎨 Select Word Paint Palette</span>
                <div className="flex items-center gap-2">
                  {TEXT_COLORS.map((tc, idx) => (
                    <button
                      key={tc.name}
                      onClick={() => {
                        setSelectedColorIdx(idx);
                        if (soundEnabled) playUIPop();
                      }}
                      className={`w-5 h-5 rounded-full border-2 cursor-pointer shadow-xs relative flex-shrink-0 transition-all ${
                        selectedColorIdx === idx 
                          ? 'border-slate-800 scale-110 ring-1 ring-offset-1 ring-purple-400' 
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: tc.color }}
                      title={tc.name}
                    >
                      {selectedColorIdx === idx && (
                        <Check size={8} className={`absolute inset-0 m-auto ${tc.color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================== PREMIUM RIBBON & FRAME STUDIO ================== */
          <div className="flex flex-col gap-3">
            {/* RIBBON CATEGORY WRAP ROW */}
            <div className="flex gap-1 overflow-x-auto pb-1.5 hide-scrollbars border-b border-purple-100">
              <button
                onClick={() => { setRibbonCategory('all'); if (soundEnabled) playUIPop(); }}
                className={`px-2 py-1 text-[10px] whitespace-nowrap font-bubble rounded-md transition-colors border select-none cursor-pointer flex-shrink-0 duration-150 ${
                  ribbonCategory === 'all'
                    ? 'bg-purple-100 border-purple-300 text-purple-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                🎀 All Cute
              </button>
              {RIBBON_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setRibbonCategory(cat.id); if (soundEnabled) playUIPop(); }}
                  className={`px-2 py-1 text-[10px] whitespace-nowrap font-bubble rounded-md transition-colors border select-none cursor-pointer flex-shrink-0 duration-150 ${
                    ribbonCategory === cat.id
                      ? 'bg-purple-100 border-purple-300 text-purple-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
              <button
                onClick={() => { setRibbonCategory('favorites'); if (soundEnabled) playUIPop(); }}
                className={`px-2 py-1 text-[10px] whitespace-nowrap font-bubble rounded-md transition-colors border select-none cursor-pointer flex-shrink-0 duration-150 ${
                  ribbonCategory === 'favorites'
                    ? 'bg-amber-100 border-amber-300 text-amber-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                }`}
              >
                ⭐ Favorites ({ribbonFavorites.length})
              </button>
            </div>

            {/* SEARCH AND TRENDING BADGES */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 50+ beautiful designs..."
                  value={ribbonSearch}
                  onChange={(e) => setRibbonSearch(e.target.value)}
                  className="w-full pl-7 pr-3 py-1 border border-slate-300 focus:border-purple-400 rounded-xl text-[10px] font-bubble text-slate-700 focus:outline-none bg-slate-50/50"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] bg-red-100 hover:bg-red-200 text-red-600 font-bold font-mono px-1.5 py-1 rounded-md cursor-pointer flex items-center gap-0.5 select-none"
                  onClick={() => { setRibbonSearch('bow'); if (soundEnabled) playUIPop(); }}
                >
                  🔥 Bows
                </span>
                <span className="text-[8px] bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold font-mono px-1.5 py-1 rounded-md cursor-pointer flex items-center gap-0.5 select-none"
                  onClick={() => { setRibbonSearch('lace'); if (soundEnabled) playUIPop(); }}
                >
                  🦋 Lace
                </span>
              </div>
            </div>

            {/* RIBBONS SELECTION FRAMEWORK GRID */}
            <div className="max-h-[140px] overflow-y-auto grid grid-cols-4 gap-2.5 p-1 bg-purple-50/10 border border-slate-200 rounded-2xl hide-scrollbars">
              {PREMIUM_RIBBONS.filter((rib) => {
                if (ribbonCategory === 'favorites') {
                  if (!ribbonFavorites.includes(rib.id)) return false;
                } else if (ribbonCategory !== 'all' && rib.category !== ribbonCategory) {
                  return false;
                }
                if (ribbonSearch.trim()) {
                  const q = ribbonSearch.toLowerCase();
                  return rib.name.toLowerCase().includes(q) || rib.category.toLowerCase().includes(q);
                }
                return true;
              }).map((rib) => {
                const isFav = ribbonFavorites.includes(rib.id);
                // Create clean live color thumbnail representation
                const thumbColor = ribbonColor || rib.defaultColor;
                const thumbSvg = rib.svgTemplate(thumbColor, { hasShadow: true, hasGlow: false, hasGlitter: false });

                return (
                  <div
                    key={rib.id}
                    className="group relative h-16 bg-white border border-slate-200 hover:border-purple-400 rounded-xl flex items-center justify-center p-1 transition-all shadow-xs cursor-pointer hover:scale-[1.03] active:scale-95 duration-150"
                    onClick={() => handleAddRibbon(rib)}
                    title={rib.name}
                  >
                    {/* Render Ribbon vector */}
                    <div className="w-11 h-11 flex items-center justify-center overflow-hidden" dangerouslySetInnerHTML={{ __html: svgStringCleanViewBox(thumbSvg) }} />

                    {/* Ribbon Name tooltip on hover */}
                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                      <p className="text-[7px] text-white font-mono truncate px-1 max-w-full font-bold">{rib.name}</p>
                    </div>

                    {/* Custom Star Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (soundEnabled) playUIPop();
                        setRibbonFavorites(prev => {
                          const updated = prev.includes(rib.id) ? prev.filter(x => x !== rib.id) : [...prev, rib.id];
                          localStorage.setItem('arpitasnaps_fav_ribbons', JSON.stringify(updated));
                          return updated;
                        });
                      }}
                      className="absolute top-1 right-1 p-0.5 bg-white/80 hover:bg-white rounded-full border border-slate-200 cursor-pointer text-amber-500 transition-colors z-10 shadow-xs"
                    >
                      <Star size={8} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                );
              })}
              {PREMIUM_RIBBONS.filter((rib) => {
                if (ribbonCategory === 'favorites') {
                  if (!ribbonFavorites.includes(rib.id)) return false;
                } else if (ribbonCategory !== 'all' && rib.category !== ribbonCategory) {
                  return false;
                }
                if (ribbonSearch.trim()) {
                  const q = ribbonSearch.toLowerCase();
                  return rib.name.toLowerCase().includes(q) || rib.category.toLowerCase().includes(q);
                }
                return true;
              }).length === 0 && (
                <div className="col-span-4 py-8 text-center text-slate-400 font-bubble text-[10px]">
                  🌈 No ribbons matching query. Check out our lovely presets!
                </div>
              )}
            </div>

            {/* DYNAMIC RIBBON CUSTOMIZATION AND PARAMETER TUNES */}
            <div className="bg-purple-100/40 p-3 rounded-2xl border border-purple-200 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-600 flex items-center gap-1">
                  <Sliders size={11} className="text-purple-600 animate-spin-slow" />
                  {elements.find(el => el.id === selectedId)?.type === 'ribbon'
                    ? `💫 Tuning Highlighted Ribbon`
                    : `🎨 Custom Ribbon Core Options`}
                </span>
                {elements.find(el => el.id === selectedId)?.type === 'ribbon' && (
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      if (soundEnabled) playUIPop();
                    }}
                    className="text-[9px] text-purple-600 hover:text-purple-800 font-semibold font-bubble bg-purple-200/50 px-2 py-0.5 rounded-md cursor-pointer decoration-dotted underline"
                  >
                    Deselect
                  </button>
                )}
              </div>

              {/* RIBBON COLOR presets */}
              <div>
                <span className="text-[9px] text-slate-500 font-bubble mb-1 block">Ribbon Canvas Theme Paint:</span>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {[
                    { name: 'Kawaii Pink', color: '#ff66b2' },
                    { name: 'Lavender Mist', color: '#cb9fff' },
                    { name: 'Peach Cream', color: '#ffb3a7' },
                    { name: 'Lemon Silk', color: '#ffeb84' },
                    { name: 'Aqua Mint', color: '#a7f3d0' },
                    { name: 'Silk Blue', color: '#93c5fd' },
                    { name: 'Golden Satin', color: '#f59e0b' },
                    { name: 'Velvet Rose', color: '#b91c1c' },
                    { name: 'Pearly Gloss', color: '#ffffff' },
                    { name: 'Onyx Leather', color: '#1e293b' }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setRibbonColor(preset.color);
                        updateSelectedRibbonAttr({ color: preset.color });
                        if (soundEnabled) playUIPop();
                      }}
                      className={`w-5 h-5 rounded-full border border-slate-300 shadow-xs relative cursor-pointer transition-transform hover:scale-110 active:scale-90 ${
                        ribbonColor === preset.color ? 'ring-2 ring-offset-1 ring-purple-500' : ''
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    >
                      {ribbonColor === preset.color && (
                        <Check size={8} className={`absolute inset-0 m-auto ${preset.color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                  {/* Manual hex box */}
                  <input
                    type="color"
                    value={ribbonColor.startsWith('#') && ribbonColor.length === 7 ? ribbonColor : '#ff66b2'}
                    onChange={(e) => {
                      setRibbonColor(e.target.value);
                      updateSelectedRibbonAttr({ color: e.target.value });
                    }}
                    className="w-5 h-5 p-0 bg-transparent rounded-full border border-slate-300 ring-0 cursor-pointer overflow-hidden outline-none flex-shrink-0"
                    title="Manual custom color hex"
                  />
                  <input
                    type="text"
                    value={ribbonColor}
                    onChange={(e) => {
                      setRibbonColor(e.target.value);
                      updateSelectedRibbonAttr({ color: e.target.value });
                    }}
                    placeholder="#hex..."
                    className="px-1.5 py-0.5 border border-slate-300 text-[8px] rounded-md font-mono w-14 focus:outline-none bg-white text-slate-700 uppercase"
                  />
                </div>
              </div>

              {/* SLIDERS: WIDTH AND OPACITY */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-purple-200/50 pt-2 pb-0.5">
                <div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bubble mb-0.5">
                    <span>Width Stretch:</span>
                    <span className="font-mono text-purple-600">{ribbonWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    step="5"
                    value={ribbonWidth}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setRibbonWidth(val);
                      updateSelectedRibbonAttr({ width: val });
                    }}
                    className="w-full accent-purple-500 h-1.5 cursor-pointer rounded-lg bg-purple-200"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-bubble mb-0.5">
                    <span>Opacity:</span>
                    <span className="font-mono text-purple-600">{Math.round(ribbonOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={Math.round(ribbonOpacity * 100)}
                    onChange={(e) => {
                      const val = parseFloat((parseInt(e.target.value) / 100).toFixed(2));
                      setRibbonOpacity(val);
                      updateSelectedRibbonAttr({ opacity: val });
                    }}
                    className="w-full accent-purple-500 h-1.5 cursor-pointer rounded-lg bg-purple-200"
                  />
                </div>
              </div>

              {/* MAGIC TOGGLE PREFERENCES */}
              <div className="border-t border-purple-200/50 pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const next = !ribbonSway;
                    setRibbonSway(next);
                    updateSelectedRibbonAttr({ hasSway: next });
                    if (soundEnabled) playUIPop();
                  }}
                  className={`py-1 rounded-lg border text-[9px] font-bubble leading-none flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    ribbonSway
                      ? 'bg-purple-200 border-purple-400 text-purple-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <Flame size={10} className={ribbonSway ? 'animate-pulse text-purple-600' : ''} />
                  💫 Sway Sway
                </button>

                <button
                  onClick={() => {
                    const next = !ribbonGlitter;
                    setRibbonGlitter(next);
                    updateSelectedRibbonAttr({ hasGlitter: next });
                    if (soundEnabled) playUIPop();
                  }}
                  className={`py-1 rounded-lg border text-[9px] font-bubble leading-none flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    ribbonGlitter
                      ? 'bg-amber-100 border-amber-300 text-amber-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <Sparkles size={10} className={ribbonGlitter ? 'animate-bounce text-amber-500' : ''} />
                  ✨ Glitter Sparkle
                </button>

                <button
                  onClick={() => {
                    const next = !ribbonGlow;
                    setRibbonGlow(next);
                    updateSelectedRibbonAttr({ hasGlow: next });
                    if (soundEnabled) playUIPop();
                  }}
                  className={`py-1 rounded-lg border text-[9px] font-bubble leading-none flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    ribbonGlow
                      ? 'bg-pink-100 border-pink-300 text-pink-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <Sparkles size={10} className={ribbonGlow ? 'text-pink-600' : ''} />
                  💫 Princess Glow
                </button>

                <button
                  onClick={() => {
                    const next = !ribbonShadow;
                    setRibbonShadow(next);
                    updateSelectedRibbonAttr({ hasShadow: next });
                    if (soundEnabled) playUIPop();
                  }}
                  className={`py-1 rounded-lg border text-[9px] font-bubble leading-none flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    ribbonShadow
                      ? 'bg-slate-200 border-slate-400 text-slate-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <Plus size={10} />
                  🌑 3D Shadow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
