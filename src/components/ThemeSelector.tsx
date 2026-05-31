import React from 'react';
import { motion } from 'motion/react';
import { Heart, Stars, Cloud, Moon, Sparkles, Footprints } from 'lucide-react';
import { ThemeMode, ThemeConfig } from '../types';
import { THEME_PRESETS } from '../data';
import { playDigitalBeep, playUIPop } from '../utils/audio';

interface ThemeSelectorProps {
  activeThemeId: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  soundEnabled: boolean;
}

export default function ThemeSelector({
  activeThemeId,
  onChangeTheme,
  soundEnabled
}: ThemeSelectorProps) {
  const list = Object.values(THEME_PRESETS);

  // Return specific visual icon based on theme
  const getThemeSymbol = (id: ThemeMode) => {
    switch (id) {
      case 'bubblegum': return <Heart size={14} className="fill-pink-500 text-pink-500" />;
      case 'dreamcore': return <Cloud size={14} className="fill-sky-400 text-sky-400" />;
      case 'y2k_retro': return <Stars size={14} className="fill-blue-500 text-blue-500" />;
      case 'dark_cute': return <Moon size={14} className="fill-amber-300 text-amber-300" />;
      case 'glitter_queen': return <Sparkles size={14} className="fill-amber-400 text-amber-400 animate-pulse" />;
      case 'soft_pastel': return <Sparkles size={14} className="fill-emerald-400 text-emerald-400" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full items-center select-none" id="theme-selector-suite">
      <div className="flex items-center gap-1.5 justify-center">
        <span className="text-xl">🍭</span>
        <h3 className="font-bubble text-sm font-bold text-slate-800 uppercase tracking-wide">
          Select Your Y2K Mood Theme:
        </h3>
      </div>
      
      {/* Horizontally scrolling cute bouncy theme array pillbox */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl px-2">
        {list.map((theme) => {
          const isSelected = theme.id === activeThemeId;
          
          return (
            <motion.button
              key={theme.id}
              onClick={() => {
                onChangeTheme(theme.id);
                if (soundEnabled) playDigitalBeep(true);
              }}
              onMouseEnter={() => soundEnabled && playUIPop()}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-2xl text-xs font-bubble border-2 cursor-pointer shadow-[2px_2px_0_0_#1e293b] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all duration-300 ${
                isSelected
                  ? 'border-slate-800 text-slate-900 font-bold scale-103'
                  : 'bg-white/80 border-slate-300 text-slate-600 hover:border-slate-500 hover:bg-white'
              }`}
              style={{
                background: isSelected ? theme.background : undefined,
                color: isSelected ? '#ffffff' : undefined,
                borderColor: isSelected ? '#1e293b' : undefined,
                textShadow: isSelected ? '1px 1px 2px rgba(0,0,0,0.2)' : undefined
              }}
            >
              <span className="text-sm select-none">{theme.emoji}</span>
              <span>{theme.name}</span>
              <span className="mb-0.5">{getThemeSymbol(theme.id)}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
