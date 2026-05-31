// Web Audio API Synthesizers for cute nostalgic Y2K sounds
// Safe initialization, user interaction compliant, fully responsive.

let audioCtx: AudioContext | null = null;
let bgMusicIntervalId: any = null;
let isMusicPlaying = false;
let masterSoloMultiplier = 0.5; // low cozy volume

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Shutter camera click sound
export function playCameraClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Shutter sound is structured: White noise blast + oscillator click
    const bufferSize = ctx.sampleRate * 0.12; // 120ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    // Shutter high pass filter
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(1, now);
    
    const gainNoise = ctx.createGain();
    gainNoise.gain.setValueAtTime(0.3 * masterSoloMultiplier, now);
    gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noise.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(ctx.destination);
    
    // Quick heavy sine sweep for the motor click
    const osc = ctx.createOscillator();
    const gainOsc = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
    
    gainOsc.gain.setValueAtTime(0.4 * masterSoloMultiplier, now);
    gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gainOsc);
    gainOsc.connect(ctx.destination);
    
    noise.start(now);
    osc.start(now);
    
    noise.stop(now + 0.15);
    osc.stop(now + 0.1);
  } catch (e) {
    console.warn('Audio click error:', e);
  }
}

// 2. Shiny sparkling chime dings
export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Play a sequence of 3 rapid high notes resembling sprinkles
    const notes = [1320, 1584, 1980]; // E6, G6, B6
    notes.forEach((freq, idx) => {
      const time = now + idx * 0.06;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.12 * masterSoloMultiplier, time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    });
  } catch (e) {}
}

// 3. Retro digital beep (Tamagotchi / pager style)
export function playDigitalBeep(highPitch = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine'; // square wave but filtered is cute too, let's use cozy sine or triangle
    osc.frequency.setValueAtTime(highPitch ? 1800 : 980, now);
    if (highPitch) {
      osc.frequency.setValueAtTime(2200, now + 0.04);
    }
    
    gainNode.gain.setValueAtTime(0.12 * masterSoloMultiplier, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + (highPitch ? 0.14 : 0.08));
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {}
}

// 4. Soft UI bubble pop hover sound
export function playUIPop() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.05);
    
    gainNode.gain.setValueAtTime(0.05 * masterSoloMultiplier, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {}
}

// 5. Retro MIDI cute arpeggio background music loop
export function startDreamyBGMusic() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    let noteIdx = 0;
    // Bubbly magical pentatonic arpeggio: C5, E5, G5, A5, C6, A5, G5, E5
    const melody = [523.25, 659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25];
    
    const playNextNote = () => {
      if (!isMusicPlaying) return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Warm chime tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(melody[noteIdx], now);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.04 * masterSoloMultiplier, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.9);
      
      noteIdx = (noteIdx + 1) % melody.length;
    };
    
    // Play a note every 400ms
    bgMusicIntervalId = setInterval(playNextNote, 400);
  } catch (e) {
    console.warn('BG music error:', e);
  }
}

export function stopDreamyBGMusic() {
  isMusicPlaying = false;
  if (bgMusicIntervalId) {
    clearInterval(bgMusicIntervalId);
    bgMusicIntervalId = null;
  }
}

export function toggleBGMusic(state: boolean) {
  if (state) {
    startDreamyBGMusic();
  } else {
    stopDreamyBGMusic();
  }
}
