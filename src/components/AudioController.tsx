import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, HelpCircle } from 'lucide-react';
import { toggleBGMusic, playDigitalBeep, playUIPop } from '../utils/audio';

interface AudioControllerProps {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (val: boolean) => void;
}

export default function AudioController({
  soundEnabled,
  setSoundEnabled,
  musicEnabled,
  setMusicEnabled
}: AudioControllerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Play beep on load to test when sound is turned on
  const handleSFXToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => {
        playDigitalBeep(true);
      }, 50);
    }
  };

  const handleMusicToggle = () => {
    const nextState = !musicEnabled;
    setMusicEnabled(nextState);
    toggleBGMusic(nextState);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 select-none" id="audio-panel">
      {/* Sound SFX Button */}
      <button
        id="sfx-toggle-btn"
        onClick={handleSFXToggle}
        onMouseEnter={() => soundEnabled && playUIPop()}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bubble text-lg border-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
          soundEnabled
            ? 'bg-rose-300 border-rose-600 text-rose-800'
            : 'bg-slate-200 border-slate-400 text-slate-500'
        }`}
        title={soundEnabled ? "Mute cute sounds" : "Enable cute sounds"}
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* Music Button */}
      <button
        id="music-toggle-btn"
        onClick={handleMusicToggle}
        onMouseEnter={() => soundEnabled && playUIPop()}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bubble text-lg border-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
          musicEnabled
            ? 'bg-purple-300 border-purple-600 text-purple-800 animate-spin-slow'
            : 'bg-slate-200 border-slate-400 text-slate-500'
        }`}
        title={musicEnabled ? "Pause background music" : "Play Y2K MIDI loop"}
      >
        <Music size={16} className={musicEnabled ? 'animate-pulse' : ''} />
      </button>

      {/* Tooltip explanation */}
      <div className="relative">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="w-6 h-6 rounded-full bg-white/40 hover:bg-white/70 border border-slate-300 flex items-center justify-center text-slate-600 text-xs transition-colors cursor-pointer"
        >
          <HelpCircle size={12} />
        </button>

        {showTooltip && (
          <div className="absolute bottom-12 left-0 w-52 p-3 bg-white border-2 border-slate-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] text-xs text-slate-700 font-bubble leading-relaxed z-50">
            <p className="font-semibold text-rose-500 mb-1">📢 Retro Jukebox Mode!</p>
            <p>Our sound effects and music are synthetically compiled in your browser using the <span className="text-purple-600 font-semibold">Web Audio API</span>. Click music to experience early 2000s cyber tunes!</p>
          </div>
        )}
      </div>
    </div>
  );
}
