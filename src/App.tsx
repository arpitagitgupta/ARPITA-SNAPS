import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Sparkles, Wand2, Download, RefreshCw, Trash2, HelpCircle } from 'lucide-react';
import { ThemeMode, CapturedPhoto, CanvasElement, PhotoFilter } from './types';
import { THEME_PRESETS } from './data';
import { PREMIUM_FILTERS } from './filters';
import { playDigitalBeep, playUIPop, playSparkleSound, toggleBGMusic } from './utils/audio';

// Components
import GlitterParticles from './components/GlitterParticles';
import AudioController from './components/AudioController';
import ThemeSelector from './components/ThemeSelector';
import WebcamBooth from './components/WebcamBooth';
import StickerStudio from './components/StickerStudio';
import StripGenerator from './components/StripGenerator';

export default function App() {
  // 1. Core States
  const [activeStep, setActiveStep] = useState<'landing' | 'capture' | 'stickers' | 'strip'>('landing');
  const [activeThemeId, setActiveThemeId] = useState<ThemeMode>('bubblegum');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
  
  // Webcam & Filters
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>(PREMIUM_FILTERS[0]);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [activeDecoPhotoIndex, setActiveDecoPhotoIndex] = useState<number>(0);
  
  // Canvas Elements (Stickers and text per individual captured photoId)
  const [photoElements, setPhotoElements] = useState<Record<string, CanvasElement[]>>({});

  const activeTheme = THEME_PRESETS[activeThemeId];

  // React and browser compliance: Pause background synthesizer music if page gets blurred/unloaded
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && musicEnabled) {
        toggleBGMusic(false);
      } else if (!document.hidden && musicEnabled) {
        toggleBGMusic(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      toggleBGMusic(false);
    };
  }, [musicEnabled]);

  // HandleCaptured photos from booth
  const handlePhotosCaptured = (photos: CapturedPhoto[]) => {
    setCapturedPhotos(photos);
    // Initialize empty canvas elements for these photos
    const newElementsMap = { ...photoElements };
    photos.forEach(p => {
      if (!newElementsMap[p.id]) {
        newElementsMap[p.id] = [];
      }
    });
    setPhotoElements(newElementsMap);
    setActiveDecoPhotoIndex(0);
    
    // Auto navigate to the sticker decorator studio step!
    setTimeout(() => {
      setActiveStep('stickers');
    }, 400);
  };

  // Clear photobooth sessions entirely to restart
  const handleResetSession = () => {
    if (confirm("🧁 Double check: Want to scrub these captures and restart your photobooth session?")) {
      setCapturedPhotos([]);
      setPhotoElements({});
      setActiveDecoPhotoIndex(0);
      setActiveStep('capture');
      if (soundEnabled) playDigitalBeep(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative w-full flex flex-col justify-between transition-all duration-700 font-sans p-4 md:p-6 select-none"
      style={{ 
        background: activeTheme.background,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* GLITTER PARTICLES BACKPLATE */}
      <GlitterParticles type={activeTheme.particleType} />

      {/* AUDIO DECK PILLS */}
      <AudioController 
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        musicEnabled={musicEnabled}
        setMusicEnabled={setMusicEnabled}
      />

      {/* HEADER BAR AND BRAND GREETINGS IN EDITORIAL THEME */}
      <header className="relative z-30 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-end justify-between gap-4 border-b border-pink-300 pb-3 mb-6 select-none">
        <div 
          onClick={() => { setActiveStep('landing'); if (soundEnabled) playUIPop(); }}
          className="flex flex-col cursor-pointer group"
          id="branding-pack"
        >
          <div className="flex items-baseline gap-2">
            <h1 className="bubble-font text-3xl md:text-4xl text-white drop-shadow-[2.5px_2.5px_0px_#FF69B4] hover:scale-[1.01] transition-transform">
              Arpita Snaps <span className="text-white animate-pulse">✨</span>
            </h1>
            <span className="text-xs uppercase font-mono font-bold text-pink-600 bg-white/60 px-2 py-0.5 rounded-full shadow-inner select-none">
              {activeTheme.emoji} v2.0
            </span>
          </div>
          <span className="editorial-label text-[10px] md:text-xs text-pink-600 font-semibold italic">
            cute memories, captured by Arpita 💖
          </span>
        </div>

        {/* ECO-EDITORIAL MINIMAL STEPPER NAVIGATION */}
        {activeStep !== 'landing' && (
          <nav className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase pb-1 select-none">
            <button 
              onClick={() => { setActiveStep('capture'); if (soundEnabled) playUIPop(); }}
              className={`pb-1 transition-all border-b-2 cursor-pointer ${
                activeStep === 'capture' 
                  ? 'border-pink-500 text-pink-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ★ 1_SNAP
            </button>
            <span className="text-pink-350 select-none">•</span>
            <button 
              disabled={capturedPhotos.length === 0}
              onClick={() => { setActiveStep('stickers'); if (soundEnabled) playUIPop(); }}
              className={`pb-1 transition-all border-b-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                activeStep === 'stickers' 
                  ? 'border-pink-500 text-pink-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ★ 2_STICKER
            </button>
            <span className="text-pink-350 select-none">•</span>
            <button 
              disabled={capturedPhotos.length === 0}
              onClick={() => { setActiveStep('strip'); if (soundEnabled) playUIPop(); }}
              className={`pb-1 transition-all border-b-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                activeStep === 'strip' 
                  ? 'border-pink-500 text-pink-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ★ 3_PRINT
            </button>
          </nav>
        )}
      </header>

      {/* CORE CONTAINER INTERACTIVE FRAMER ANIMS */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center relative z-20">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: HERO LANDING ADVENTURE */}
          {activeStep === 'landing' && (
            <motion.div
              key="landing_view"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center text-center max-w-3xl py-12"
            >
              {/* Retro webcam computer terminal box style */}
              <div className="relative p-6 md:p-8 bg-white/80 border-4 border-slate-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] holo-card mb-10 overflow-hidden text-center">
                
                {/* Floating bubbles styling */}
                <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-pink-100 opacity-60 animate-pulse blur-md" />
                <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-cyan-100 opacity-60 animate-pulse blur-md" />

                {/* Sparkling icon graphics */}
                <div className="relative z-10 select-none inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 border-2 border-slate-800 mb-6 shadow-md anim-bounce">
                  <Camera className="text-white text-3xl" size={32} />
                  <span className="absolute -top-1 -right-1 text-lg">✨</span>
                </div>

                <h1 className="relative z-10 font-bubble text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-4 select-none">
                  Arpita Snaps <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">✨</span>
                </h1>
                
                <p className="relative z-10 font-bubble text-lg md:text-xl text-slate-700 font-semibold mb-6 max-w-xl mx-auto leading-relaxed">
                  Cute memories, captured by Arpita 💖 <br />
                  <span className="text-xs font-mono font-bold tracking-wider text-pink-500 uppercase mt-2 block">★ premium interactive retro photobooth ★</span>
                </p>

                {/* Subtitle list of cute tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-8 px-4 font-mono text-xs text-slate-500 select-none">
                  <span className="px-3 py-1 bg-pink-100/70 border border-pink-200 text-pink-600 rounded-full font-bold">#arpita-snaps</span>
                  <span className="px-3 py-1 bg-cyan-100/70 border border-cyan-200 text-indigo-600 rounded-full font-bold">#capturedbyarpita</span>
                  <span className="px-3 py-1 bg-indigo-100/70 border border-indigo-200 text-indigo-700 rounded-full font-bold">#kawaiiprintbooth</span>
                  <span className="px-3 py-1 bg-purple-100/70 border border-purple-200 text-purple-700 rounded-full font-bold">#aestheticmemories</span>
                </div>

                {/* Landing page big bff actions */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
                  <button
                    onClick={() => { setActiveStep('capture'); if (soundEnabled) playSparkleSound(); }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:scale-[1.01] active:translate-y-0.5 text-white font-bubble text-lg font-bold rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#141414] active:shadow-none cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    🚀 Start Taking Photos!
                  </button>
                  <button
                    onClick={() => { setActiveThemeId('y2k_retro'); setActiveStep('capture'); if (soundEnabled) playDigitalBeep(true); }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-sky-200 hover:bg-sky-300 border-2 border-slate-800 text-slate-800 font-bubble text-md font-bold rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] active:translate-y-0.5 active:shadow-none cursor-pointer"
                  >
                    💿 Explore Filters & Presets
                  </button>
                </div>
              </div>

              {/* Instant theme chooser dashboard on hero for fun! */}
              <div className="w-full relative z-10">
                <ThemeSelector 
                  activeThemeId={activeThemeId}
                  onChangeTheme={setActiveThemeId}
                  soundEnabled={soundEnabled}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: WEBCAM CAPTURE STATION */}
          {activeStep === 'capture' && (
            <motion.div
              key="capture_view"
              initial={{ opacity: 0.3, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.3 }}
              className="lg:grid lg:grid-cols-12 gap-8 w-full max-w-5xl py-4"
            >
              {/* Left explanation board */}
              <div className="lg:col-span-5 flex flex-col gap-5 justify-center py-4">
                <div className="border-3 border-slate-800 p-5 rounded-3xl bg-white shadow-[4px_4px_0_0_#1e293b]">
                  <span className="text-xl">📸</span>
                  <h2 className="font-bubble text-xl font-bold text-slate-900 tracking-tight mt-1 mb-2">
                    Step 1: Cute Webcam Snap
                  </h2>
                  <p className="font-bubble text-xs text-slate-600 leading-relaxed">
                    Grant webcam frame permissions, align your cute chin, select an amazing glittering filter style, and click capture! 
                  </p>
                  <div className="border-t border-slate-100 my-4 pt-3 text-[11px] font-mono font-semibold text-pink-400 leading-normal">
                    💡 HINT: Select <span className="bg-purple-100 font-bold px-1.5 py-0.5 rounded text-purple-600 uppercase">Collage Burst Mode</span> to automatic take 4 photos in sequence to generate standard mall style vertical photo strips!
                  </div>
                </div>

                {/* Mini Theme switch pill overlay */}
                <div className="border-2 border-slate-800/10 p-3 bg-white/40 backdrop-blur-xs rounded-2xl select-none text-center">
                  <ThemeSelector 
                    activeThemeId={activeThemeId}
                    onChangeTheme={setActiveThemeId}
                    soundEnabled={soundEnabled}
                  />
                </div>
              </div>

              {/* Primary webcam terminal frame layout */}
              <div className="lg:col-span-7 flex items-center justify-center">
                <WebcamBooth 
                  soundEnabled={soundEnabled}
                  onPhotosCaptured={handlePhotosCaptured}
                  activeFilter={activeFilter}
                  setActiveFilter={setActiveFilter}
                  primaryColor={activeTheme.primary}
                />
              </div>

            </motion.div>
          )}

          {/* STEP 3: STICKER STUDIO DECORATOR */}
          {activeStep === 'stickers' && capturedPhotos.length > 0 && (
            <motion.div
              key="stickers_view"
              initial={{ opacity: 0.3, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6 w-full py-2"
            >
              {/* Stepper bar for multi-photos decoration choice (e.g. if burst mode took 4 pics) */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white/75 backdrop-blur-sm border-2 border-slate-800 rounded-3xl px-4 py-3 shadow-[5px_5px_0_0_rgba(0,0,0,0.9)] max-w-3xl mx-auto w-full select-none" id="sticker-stepper-panel">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎀</span>
                  <div className="text-left">
                    <h3 className="font-bubble text-xs font-bold text-slate-800 leading-snug">
                      Step 2: Customize Placed Stickers
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 font-semibold uppercase">Decorate photos inside camera workspace grid</p>
                  </div>
                </div>

                {/* Click list selectors for multiple pictures captured */}
                {capturedPhotos.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-500 uppercase">Choosing Photo to Decorate:</span>
                    <div className="flex gap-1">
                      {capturedPhotos.map((photo, idx) => (
                        <button
                          key={photo.id}
                          onClick={() => {
                            setActiveDecoPhotoIndex(idx);
                            if (soundEnabled) playDigitalBeep(false);
                          }}
                          className={`w-7 h-7 rounded-lg font-bubble text-xs cursor-pointer border flex items-center justify-center transition-colors ${
                            activeDecoPhotoIndex === idx
                              ? 'bg-purple-300 border-slate-800 text-slate-900 font-bold'
                              : 'bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proceed button to step 3 */}
                <button
                  onClick={() => { setActiveStep('strip'); if (soundEnabled) playSparkleSound(); }}
                  className="px-5 py-2 hover:scale-[1.01] bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 border-2 border-slate-800 text-slate-950 font-bubble text-xs font-bold rounded-full shadow-[2.5px_2.5px_0_0_#000] cursor-pointer"
                >
                  🍭 Finish Decoration & Build Ribbon!
                </button>
              </div>

              {/* Mounting primary sticker modifier workspace */}
              <div className="w-full">
                <StickerStudio 
                  photo={capturedPhotos[activeDecoPhotoIndex]}
                  elements={photoElements[capturedPhotos[activeDecoPhotoIndex]?.id] || []}
                  setElements={(newElements) => {
                    // Update state targeting current photo Id
                    setPhotoElements((prev) => ({
                      ...prev,
                      [capturedPhotos[activeDecoPhotoIndex].id]: typeof newElements === 'function' 
                        ? newElements(prev[capturedPhotos[activeDecoPhotoIndex].id] || []) 
                        : newElements
                    }));
                  }}
                  activeTheme={activeTheme}
                  soundEnabled={soundEnabled}
                />
              </div>

              {/* Reset snapshot footer choices */}
              <div className="flex justify-center mt-2.5">
                <button
                  onClick={handleResetSession}
                  className="px-4 py-2 text-rose-500 hover:text-rose-700 bg-white/60 hover:bg-white border border-rose-300 hover:border-rose-400 rounded-xl font-bubble text-xs cursor-pointer shadow-xs transition-colors"
                >
                  🗑️ Clear Session & Snap Again
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: EXPORT PHOTO STRIP */}
          {activeStep === 'strip' && capturedPhotos.length > 0 && (
            <motion.div
              key="strip_view"
              initial={{ opacity: 0.3, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-6 w-full py-2"
            >
              {/* Title instructions header navigation option bar */}
              <div className="flex items-center justify-between bg-white border-2 border-slate-850 rounded-3xl p-3 shadow-[5px_5px_0_0_#1e293b] max-w-3xl mx-auto w-full select-none" id="export-header-panel">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎟️</span>
                  <div className="text-left">
                    <h3 className="font-bubble text-xs font-bold text-slate-800">
                      Step 3: Compile & Print Aesthetic Ribbons
                    </h3>
                    <p className="font-mono text-[9px] text-slate-500 font-semibold uppercase">Style frame designs & download physical photo files</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setActiveStep('stickers'); if (soundEnabled) playUIPop(); }}
                    className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-2xl font-bubble text-xs font-bold cursor-pointer transition-colors"
                  >
                    🎛️ Back to Stickers
                  </button>
                  <button
                    onClick={handleResetSession}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-bubble text-xs cursor-pointer transition-colors"
                  >
                    🔄 Take New Photos
                  </button>
                </div>
              </div>

              {/* Rendering high quality dynamic generator layout tool */}
              <div className="w-full">
                <StripGenerator 
                  photos={capturedPhotos}
                  photoElements={photoElements}
                  activeTheme={activeTheme}
                  soundEnabled={soundEnabled}
                />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* GIANT BACKDROP WATERMARK FROM DESIGN HTML */}
      <div className="absolute bottom-[10%] right-[-10px] md:right-[-30px] pointer-events-none opacity-15 select-none z-10 overflow-hidden">
        <span className="text-[180px] md:text-[240px] font-black leading-none text-white select-none whitespace-nowrap tracking-tighter mix-blend-overlay">
          CUTE
        </span>
      </div>

      {/* FOOTER SYSTEM CREDITING IN EDITORIAL DESIGN */}
      <footer className="relative z-35 border-t border-pink-300 mt-12 pt-4 pb-16 select-none max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-2 text-slate-650">
        <p className="font-editorial text-xs italic tracking-wide">
          Made with 💖 by Arpita — Captured on Arpita Snaps ✨
        </p>
        <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-pink-500 animate-pulse">
          ★ ARPITA SNAPS SYSTEM: LIVE ★
        </p>
      </footer>

      {/* ACTIVE MARQUEE STICKY STATUS BANNER FROM DESIGN HTML */}
      <div className="fixed bottom-0 left-0 w-full h-[34px] flex items-center px-6 gap-6 bg-white/80 backdrop-blur-md border-t border-pink-300 text-[9px] font-mono font-bold uppercase tracking-widest z-45 select-none">
        <span className="text-pink-650 shrink-0 font-extrabold">★ ARPITA SNAPS ★</span>
        <span className="text-pink-650 shrink-0 hidden sm:inline border-l border-pink-300 pl-4 font-bold">Status: Ready ✨</span>
        <span className="text-pink-650 shrink-0 hidden md:inline border-l border-pink-300 pl-4">Mood: Cute & Cozy 💖</span>
        <span className="border-l border-pink-300 h-4 hidden sm:inline"></span>
        <marquee className="flex-1 text-slate-650 font-semibold" scrollamount="3">
          WELCOME TO ARPITA SNAPS ✨ — TAKE A PHOTO, DRAG ADORABLE STICKERS, MAKE DREAM COZY MEMORIES WITH BFFS FOREVER — 💖 ★ 🧸 ★ 🦋 ★ 🔮 ★ 🌸 ★ ✨ ★ 🌈
        </marquee>
      </div>
    </div>
  );
}
