import React, { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Camera, 
  Check, 
  RefreshCw, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Heart, 
  Search, 
  Star, 
  Sliders, 
  RotateCcw, 
  Eye, 
  Flame,
  Grid,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Zap,
  ZapOff,
  Trash2,
  Volume2,
  VolumeX,
  Smile
} from 'lucide-react';
import { 
  playCameraClick, 
  playDigitalBeep, 
  playSparkleSound, 
  playUIPop 
} from '../utils/audio';
import { PhotoFilter, CapturedPhoto } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PREMIUM_FILTERS, FILTER_CATEGORIES, PremiumFilter } from '../filters';

interface WebcamBoothProps {
  soundEnabled: boolean;
  onPhotosCaptured: (photos: CapturedPhoto[]) => void;
  activeFilter: PhotoFilter;
  setActiveFilter: (filter: PhotoFilter) => void;
  primaryColor: string;
}

const RETRO_MODELS = [
  { id: 'bunny', name: 'Kawaii Bunny', url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=400', emoji: '🐰' },
  { id: 'retro_cyber', name: 'Cyber Space Star', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', emoji: '🪐' },
  { id: 'pixel_kitty', name: 'Tamagotchi Neko', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400', emoji: '🐱' }
];

export default function WebcamBooth({
  soundEnabled,
  onPhotosCaptured,
  activeFilter,
  setActiveFilter,
  primaryColor
}: WebcamBoothProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const capturedPhotosRef = useRef<CapturedPhoto[]>([]);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mode, setMode] = useState<'live' | 'upload' | 'preset'>('preset');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({ width: 640, height: 480 });

  // Premium & Smart Camera States
  const [zoomLevel, setZoomLevel] = useState<number>(1); // Range: 1x to 3x digital zoom selection
  const [aspectRatio, setAspectRatio] = useState<'4/3' | '16/9' | '1/1' | '9/16'>('4/3'); // Immersive bounding selections
  const [isMirrored, setIsMirrored] = useState<boolean>(true); // Mirrored previews
  const [showGrid, setShowGrid] = useState<boolean>(false); // Framing grid overlays
  const [autoLightingEnhance, setAutoLightingEnhance] = useState<boolean>(false); // Smart high dynamic brightness boost
  const [voiceCommandEnabled, setVoiceCommandEnabled] = useState<boolean>(false); // Hands-free speech clicks
  const [countdownLength, setCountdownLength] = useState<number>(3); // Customizable auto stopwatch timer length: 0s, 3s, 5s, 10s
  const [shutterSoundStyle, setShutterSoundStyle] = useState<'vintage' | 'toy' | 'cyber' | 'anime'>('vintage'); // Dynamic beepers sound selections
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // Immersive fullscreen viewfinders
  const [isInitializingCamera, setIsInitializingCamera] = useState<boolean>(false); // Cute retro loading shutters
  const [isSmileMode, setIsSmileMode] = useState<boolean>(false); // Auto timer capture triggered by smile simulation meter
  const [smileTriggerPercent, setSmileTriggerPercent] = useState<number>(0);
  const [isSmileActive, setIsSmileActive] = useState<boolean>(false);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(true); // Toggle real-time click flash effect
  const [antiBlurEnabled, setAntiBlurEnabled] = useState<boolean>(true); // Smoothest HD image capture pipeline
  const [successConfettiTrigger, setSuccessConfettiTrigger] = useState<boolean>(false); // Animate sparkles/confetti on success captures
  const [tempPhotosForReview, setTempPhotosForReview] = useState<CapturedPhoto[] | null>(null); // Interactive retake stage modal

  // Selected preset/uploaded image
  const [selectedPhotoSource, setSelectedPhotoSource] = useState<string>(RETRO_MODELS[0].url);
  const [uploadedImageName, setUploadedImageName] = useState<string>('');

  // Counting state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(1); // 1 = Single, 4 = Burst (Grid Strip)
  const [flashActive, setFlashActive] = useState<boolean>(false);

  // Temporary captured pictures in active capture session
  const [capturedSessionPhotos, setCapturedSessionPhotos] = useState<CapturedPhoto[]>([]);

  // ==================== PREMIUM FILTER SELECTIONS ====================
  const [activeTab, setActiveTab] = useState<'filters' | 'tune'>('filters');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Persistence for user favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('arpitasnaps_favorite_filters');
      return saved ? JSON.parse(saved) : ['glitter_glow', 'soft_girl', 'golden_hour', 'beauty_glow_viral'];
    } catch {
      return ['glitter_glow', 'soft_girl', 'golden_hour', 'beauty_glow_viral'];
    }
  });

  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(['bw_classic', 'bunny_cloud_aes', 'film_border']);

  // ==================== EDITING CONTROLS ====================
  const [sliders, setSliders] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    tint: 0,
    exposure: 100,
    blur: 0,
    grain: 25,
    sharpness: 0,
    glow: 0,
    shadowLevel: 0,
    highlightControl: 100
  });

  // Save favorites to LocalStorage
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('arpitasnaps_favorite_filters', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save favorite filters to localStorage', err);
    }
    if (soundEnabled) playSparkleSound();
  };

  // Reset Adjustments
  const handleResetSliders = () => {
    setSliders({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      warmth: 0,
      tint: 0,
      exposure: 100,
      blur: 0,
      grain: 25,
      sharpness: 0,
      glow: 0,
      shadowLevel: 0,
      highlightControl: 100
    });
    if (soundEnabled) playUIPop();
  };

  // Compute final composite CSS filter
  const compositeCssFilter = useMemo(() => {
    let base = activeFilter.cssFilter === 'none' ? '' : activeFilter.cssFilter;
    
    // Sliders
    if (sliders.brightness !== 100) {
      base += ` brightness(${sliders.brightness}%)`;
    }
    if (sliders.exposure !== 100) {
      base += ` brightness(${sliders.exposure}%)`;
    }
    if (sliders.contrast !== 100) {
      base += ` contrast(${sliders.contrast}%)`;
    }
    if (sliders.saturation !== 100) {
      base += ` saturate(${sliders.saturation}%)`;
    }
    if (sliders.warmth > 0) {
      base += ` sepia(${sliders.warmth / 100})`;
    }
    if (sliders.tint !== 0) {
      base += ` hue-rotate(${sliders.tint}deg)`;
    }
    if (sliders.blur > 0) {
      base += ` blur(${sliders.blur}px)`;
    }
    if (sliders.sharpness > 0) {
      base += ` contrast(${100 + sliders.sharpness}%) brightness(${100 - sliders.sharpness / 10}%)`;
    }
    if (sliders.glow > 0) {
      base += ` drop-shadow(0 0 ${sliders.glow}px rgba(255,102,178,0.5))`;
    }
    if (sliders.shadowLevel > 0) {
      base += ` brightness(${100 - sliders.shadowLevel / 3}%) contrast(${100 + sliders.shadowLevel / 4}%)`;
    }
    if (sliders.highlightControl !== 100) {
      base += ` contrast(${sliders.highlightControl}%)`;
    }

    return base.trim() || 'none';
  }, [activeFilter, sliders]);

  // Compute filtered list
  const filteredFilters = useMemo(() => {
    return PREMIUM_FILTERS.filter((filt) => {
      // Category filter
      if (selectedCategory === 'favorite') {
        if (!favorites.includes(filt.id)) return false;
      } else if (selectedCategory === 'trending') {
        if (!filt.isTrending) return false;
      } else if (selectedCategory !== 'all') {
        if (filt.category !== selectedCategory) return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        return filt.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [selectedCategory, searchQuery, favorites]);

  // Handle selected filter selection
  const handleSelectFilter = (filt: PhotoFilter) => {
    setActiveFilter(filt);
    if (soundEnabled) playDigitalBeep(false);

    // Track recently used
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== filt.id);
      return [filt.id, ...filtered].slice(0, 5);
    });
  };

  // Custom synthesizer for retro camera shutter sound style packs!
  const playCustomShutter = (style: 'vintage' | 'toy' | 'cyber' | 'anime') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const masterSoloMultiplier = 0.5;

      if (style === 'vintage') {
        // Physical physical SLR slap + high shutter white noise decay
        const bufferSize = ctx.sampleRate * 0.14; // 140ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(900, now);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25 * masterSoloMultiplier, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        
        // Sweeping triangle click for physical motor mirror slap
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.08);
        oscGain.gain.setValueAtTime(0.35 * masterSoloMultiplier, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (style === 'toy') {
        // High-pitched cute squeaky toy lens pop
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(2200, now + 0.07);
        oscGain.gain.setValueAtTime(0.18 * masterSoloMultiplier, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (style === 'cyber') {
        // Retro arcade lasers zap click
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2500, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.12);
        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(1200, now);
        oscGain.gain.setValueAtTime(0.15 * masterSoloMultiplier, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(bandpass);
        bandpass.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (style === 'anime') {
        // Dreamy crystal chime chord arpeggio
        const notes = [987.77, 1318.51, 1567.98, 2093.00]; // B5, E6, G6, C7 chord
        notes.forEach((freq, idx) => {
          const time = now + idx * 0.04;
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          
          oscGain.gain.setValueAtTime(0, time);
          oscGain.gain.linearRampToValueAtTime(0.08 * masterSoloMultiplier, time + 0.02);
          oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
          
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.22);
        });
      }
    } catch (e) {
      console.warn("Synth shutter click failed:", e);
    }
  };

  // Physical touch shutter haptics vibration for phone devices
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([70]);
      } catch (e) {
        // Blocked in iframe/browser permissions gracefully
      }
    }
  };

  // Initialize camera
  const startCamera = async (explicitFacing?: 'user' | 'environment') => {
    setCameraError(null);
    setIsInitializingCamera(true);
    const modeToUse = explicitFacing || facingMode;

    // 1. Detect Secure Context / HTTPS requirements
    const isSecure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isSecure) {
      setCameraError("⚠️ HTTPS Secure Context Required: Mobile browsers strictly block camera streams on unsecure connections. Please switch to 'https://' in your browser URL to snap live photos! ✨");
      setMode('preset');
      setIsInitializingCamera(false);
      return;
    }

    // 2. Check general browser Support
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    if (!hasMediaDevices) {
      setCameraError("📷 Camera Interface Unsupported: Live streams are not supported on this browser/app shell. Please use Chrome/Safari or use our gorgeous local file Upload or Preset tools! 😊");
      setMode('preset');
      setIsInitializingCamera(false);
      return;
    }

    try {
      // Clean up previous active tracks completely
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped old track:", track.label);
        });
      }
    } catch (e) {
      console.warn("Disposing old tracks threw a warning:", e);
    }

    // 3. Cascade of constraints. Ideal: 720p 16:9 or 4:3 target on mobile, descending to basic resolutions
    const constraintsList = [
      {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          facingMode: { ideal: modeToUse } 
        },
        audio: false
      },
      {
        video: { 
          width: { ideal: 800 }, 
          height: { ideal: 600 }, 
          facingMode: { ideal: modeToUse } 
        },
        audio: false
      },
      {
        video: { 
          facingMode: modeToUse 
        },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    ];

    let lastError: any = null;
    let fallbackStream: MediaStream | null = null;

    // Iterate through constraint cascade
    for (const constraints of constraintsList) {
      try {
        console.log("Requesting camera stream with constraints:", constraints);
        fallbackStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (fallbackStream) {
          console.log("Successfully acquired camera stream!");
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn("Media constraints attempt refused:", err);
      }
    }

    if (fallbackStream) {
      setStream(fallbackStream);
      if (videoRef.current) {
        videoRef.current.srcObject = fallbackStream;
        // Reinforce playsinline and muted for iOS Safari to initiate autoplay right away
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        videoRef.current.muted = true;

        try {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("Inline play started successfully!");
            }).catch((playErr) => {
              console.warn("AutoPlay check: attempting click gesture play bypass:", playErr);
            });
          }
        } catch (playErr) {
          console.warn("Direct play error:", playErr);
        }
      }
      setMode('live');
      setIsMirrored(modeToUse === 'user');
    } else {
      console.error("Camera constraints failed completely:", lastError);
      
      // Auto fallback to alternative camera stream if rear fails on standard front-only phones:
      if (modeToUse === 'environment') {
        console.log("Rear camera environment is unavailable. Falling back to active User (Front) stream...");
        setFacingMode('user');
        setIsInitializingCamera(false);
        await startCamera('user');
        return;
      }

      // Format custom clear troubleshooting error guides for specific browsers
      if (lastError) {
        if (lastError.name === 'NotAllowedError' || lastError.name === 'PermissionDeniedError') {
          setCameraError("🔒 Camera Permission Blocked: Arpita Snaps needs your camera access. Please click the lock 🔒 or settings icon in Safari/Chrome's address bar, select ALLOW camera, and tap 'Retry CameraStream'!");
        } else if (lastError.name === 'NotFoundError' || lastError.name === 'DevicesNotFoundError') {
          setCameraError("🔍 No Camera Hardware Found: We couldn't locate a valid camera module on this machine. Feel free to use our gorgeous local Upload or Preset modes below! ✨");
        } else if (lastError.name === 'NotReadableError' || lastError.name === 'TrackStartError') {
          setCameraError("⚡ Camera in Active Use: Another application or browser page (Zoom, FaceTime, etc) is locking your camera. Please close other app views and click 'Retry Camera Stream' below!");
        } else {
          setCameraError(`❌ Camera Access Problem (${lastError.name}): ${lastError.message || 'Stream block.'} Please refresh or retry camera.`);
        }
      } else {
        setCameraError("Camera not supported on this device/browser. Please try Chrome, Safari, Samsung Internet, or Edge via secure HTTPS.");
      }
      setMode('preset');
    }

    setTimeout(() => {
      setIsInitializingCamera(false);
    }, 600);
  };

  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacing);
    if (mode === 'live') {
      await startCamera(nextFacing);
    }
    if (soundEnabled) playUIPop();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      if (w && h) {
        console.log("Webcam live resolution detected:", w, "x", h);
        setVideoSize({ width: w, height: h });
      }
    }
  };

  // Stop camera stream when component is unmounted
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Keep camera playing on focus and stop tracks when tab is hidden or minimized to prevent overheating
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Application hidden. Stopping tracks to prevent heating and save device resources...");
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      } else {
        // Automatically restart the stream if they were using the active camera feed!
        if (mode === 'live') {
          console.log("Application returned to foreground. Self-healing active camera stream...");
          startCamera();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stream, mode, facingMode]);

  // Watch stream state changes and reinforce native .play() handler to guarantee bypass of black freeze-frames
  useEffect(() => {
    let checkTimeout: any;
    if (stream && videoRef.current && mode === 'live') {
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            checkTimeout = setTimeout(async () => {
              if (videoRef.current) {
                await videoRef.current.play();
                console.log("Camera play validated successfully.");
              }
            }, 100);
          }
        } catch (err) {
          console.warn("Self-healing stream play error bypassed:", err);
        }
      };
      playVideo();
    }
    return () => {
      if (checkTimeout) clearTimeout(checkTimeout);
    };
  }, [stream, mode]);

  // Voice command detection listener via Web Speech API
  useEffect(() => {
    let recognition: any = null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (voiceCommandEnabled && mode === 'live' && !isCapturing && !tempPhotosForReview && SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.onresult = (event: any) => {
          const lastResultIndex = event.results.length - 1;
          const text = event.results[lastResultIndex][0].transcript.toLowerCase();
          console.log("Voice Command Detected:", text);
          if (
            text.includes("take photo") || 
            text.includes("click") || 
            text.includes("snap") || 
            text.includes("cheese") || 
            text.includes("smile") ||
            text.includes("shoot")
          ) {
            handleTriggerCapture();
          }
        };
        recognition.start();
      } catch (err) {
        console.warn("Speech API start block:", err);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [voiceCommandEnabled, mode, isCapturing, tempPhotosForReview]);

  // Simulated Smile/Gesture Auto triggers
  useEffect(() => {
    let interval: any = null;
    if (isSmileActive && mode === 'live' && !isCapturing && !tempPhotosForReview) {
      setSmileTriggerPercent(12);
      interval = setInterval(() => {
        setSmileTriggerPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSmileActive(false);
            handleTriggerCapture();
            return 100;
          }
          const increment = Math.floor(Math.random() * 22) + 16;
          return Math.min(100, prev + increment);
        });
      }, 450);
    } else {
      setSmileTriggerPercent(0);
    }
    return () => clearInterval(interval);
  }, [isSmileActive, mode, isCapturing, tempPhotosForReview]);

  // Handle local image uploads
  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedPhotoSource(event.target.result as string);
          setMode('upload');
          if (soundEnabled) playSparkleSound();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // High performance picture capture with active CSS filters baked directly onto canvas
  const performActualCapture = (): Promise<CapturedPhoto> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current || document.createElement('canvas');

      const finalizeLiveCapture = () => {
        let videoW = 640;
        let videoH = 480;

        if (videoRef.current) {
          videoW = videoRef.current.videoWidth || 640;
          videoH = videoRef.current.videoHeight || 480;
        }

        // 1. Calculate aspect ratio crops automatically
        let targetRatio = 4 / 3;
        if (aspectRatio === '1/1') targetRatio = 1;
        else if (aspectRatio === '16/9') targetRatio = 16 / 9;
        else if (aspectRatio === '9/16') targetRatio = 9 / 16;
        else if (aspectRatio === '4/3') targetRatio = 4 / 3;

        // 2. Calculate digital zoom crop coordinates
        const scaleFactor = 1 / zoomLevel;
        let sWidth = videoW * scaleFactor;
        let sHeight = videoH * scaleFactor;

        if (sWidth / sHeight > targetRatio) {
          sWidth = sHeight * targetRatio;
        } else {
          sHeight = sWidth / targetRatio;
        }

        const sx = (videoW - sWidth) / 2;
        const sy = (videoH - sHeight) / 2;

        // Establish output size (highly optimized HD target resolution)
        canvas.width = Math.min(2048, Math.max(800, Math.round(sWidth)));
        canvas.height = Math.round(canvas.width / targetRatio);

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve({ id: 'cap_err_' + Date.now(), dataUrl: '', timestamp: '00:00:00' });

        // Ensure Anti-Blur smoothing settings are enabled
        if (antiBlurEnabled) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Auto Lighting Enhancer filter calculations
        let compositeFilterToApply = compositeCssFilter;
        if (autoLightingEnhance) {
          compositeFilterToApply = `brightness(108%) contrast(106%) saturate(102%) shadow(5%) ${compositeFilterToApply === 'none' ? '' : compositeFilterToApply}`.trim();
        }
        ctx.filter = compositeFilterToApply;

        // Draw from live video
        ctx.save();
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        
        ctx.drawImage(
          videoRef.current!, 
          sx, 
          sy, 
          sWidth, 
          sHeight, 
          0, 
          0, 
          canvas.width, 
          canvas.height
        );
        ctx.restore();

        const dataUrl = canvas.toDataURL('image/png', 0.95);
        resolve({
          id: 'cap_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          dataUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      };

      if (mode === 'live' && videoRef.current) {
        finalizeLiveCapture();
      } else {
        // Draw upload or preset background
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          let targetRatio = 4 / 3;
          if (aspectRatio === '1/1') targetRatio = 1;
          else if (aspectRatio === '16/9') targetRatio = 16 / 9;
          else if (aspectRatio === '9/16') targetRatio = 9 / 16;
          else if (aspectRatio === '4/3') targetRatio = 4 / 3;

          const imgW = img.naturalWidth || 640;
          const imgH = img.naturalHeight || 480;

          const scaleFactor = 1 / zoomLevel;
          let sWidth = imgW * scaleFactor;
          let sHeight = imgH * scaleFactor;

          if (sWidth / sHeight > targetRatio) {
            sWidth = sHeight * targetRatio;
          } else {
            sHeight = sWidth / targetRatio;
          }

          const sx = (imgW - sWidth) / 2;
          const sy = (imgH - sHeight) / 2;

          canvas.width = Math.round(sWidth);
          canvas.height = Math.round(sHeight);
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve({ id: 'cap_err_' + Date.now(), dataUrl: '', timestamp: '00:00:00' });

          if (antiBlurEnabled) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let compositeFilterToApply = compositeCssFilter;
          if (autoLightingEnhance) {
            compositeFilterToApply = `brightness(108%) contrast(106%) saturate(102%) ${compositeFilterToApply === 'none' ? '' : compositeFilterToApply}`.trim();
          }
          ctx.filter = compositeFilterToApply;

          ctx.save();
          if (isMirrored && mode === 'upload') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          const dataUrl = canvas.toDataURL('image/png', 0.95);
          const photoObj: CapturedPhoto = {
            id: 'cap_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            dataUrl,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          resolve(photoObj);
        };
        img.onerror = () => {
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '24px sans-serif';
            ctx.fillStyle = '#ff66b2';
            ctx.fillText("Cute selfie snap!", 150, 200);
          }
          const dataUrl = canvas.toDataURL('image/png');
          resolve({
            id: 'cap_err_' + Date.now(),
            dataUrl,
            timestamp: '00:00:00'
          });
        };
        img.src = selectedPhotoSource;
      }
    });
  };

  // Capture sequence timer handler
  const handleTriggerCapture = () => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCapturedSessionPhotos([]);
    capturedPhotosRef.current = [];

    // 1. Determine countdown scale
    let countLeft = countdownLength;
    if (countLeft === 0) {
      // Direct snapshot snapshot
      setCountdown(null);
      if (flashEnabled) setFlashActive(true);
      playCustomShutter(shutterSoundStyle);
      triggerHaptic();

      setTimeout(async () => {
        setFlashActive(false);
        const newPhoto = await performActualCapture();
        capturedPhotosRef.current = [newPhoto];
        setCapturedSessionPhotos(capturedPhotosRef.current);

        if (burstCount > 1) {
          triggerSequence(1, null);
        } else {
          setIsCapturing(false);
          setTempPhotosForReview(capturedPhotosRef.current);
          if (soundEnabled) playSparkleSound();
        }
      }, 150);
      return;
    }

    // 2. Continuous Countdown Timer loop
    setCountdown(countLeft);
    if (soundEnabled) playDigitalBeep(false);

    const timer = setInterval(async () => {
      countLeft -= 1;
      if (countLeft > 0) {
        setCountdown(countLeft);
        if (soundEnabled) playDigitalBeep(false);
      } else if (countLeft === 0) {
        setCountdown(null);
        if (flashEnabled) setFlashActive(true);
        playCustomShutter(shutterSoundStyle);
        triggerHaptic();

        setTimeout(async () => {
          setFlashActive(false);
          const newPhoto = await performActualCapture();
          capturedPhotosRef.current = [newPhoto];
          setCapturedSessionPhotos(capturedPhotosRef.current);

          if (burstCount > 1) {
            triggerSequence(1, timer);
          } else {
            clearInterval(timer);
            setIsCapturing(false);
            setTempPhotosForReview(capturedPhotosRef.current);
            if (soundEnabled) playSparkleSound();
          }
        }, 150);
      }
    }, 1000);
  };

  const triggerSequence = (completedCount: number, mainTimer: any) => {
    if (mainTimer) clearInterval(mainTimer);

    const totalToCapture = burstCount;
    let countdownSec = 2; // Quick timer interval between multi shots in bursts
    setCountdown(countdownSec);
    if (soundEnabled) playDigitalBeep(true);

    const subTimer = setInterval(async () => {
      countdownSec -= 1;
      if (countdownSec > 0) {
        setCountdown(countdownSec);
        if (soundEnabled) playDigitalBeep(true);
      } else {
        setCountdown(null);
        if (flashEnabled) setFlashActive(true);
        playCustomShutter(shutterSoundStyle);
        triggerHaptic();

        setTimeout(async () => {
          setFlashActive(false);
          const newPhoto = await performActualCapture();

          capturedPhotosRef.current = [...capturedPhotosRef.current, newPhoto];
          const currentList = capturedPhotosRef.current;
          setCapturedSessionPhotos(currentList);

          if (currentList.length === totalToCapture) {
            clearInterval(subTimer);
            setIsCapturing(false);
            setTempPhotosForReview(currentList);
            if (soundEnabled) playSparkleSound();
          } else {
            setTimeout(() => {
              triggerSequence(currentList.length, subTimer);
            }, 100);
          }
        }, 150);
      }
    }, 1000);
  };

  // Perform single frame spot retake during reviews!
  const triggerSingleRetake = (indexToReplace: number) => {
    if (isCapturing) return;
    setIsCapturing(true);

    let countLeft = 3;
    setCountdown(countLeft);
    if (soundEnabled) playDigitalBeep(false);

    const timer = setInterval(async () => {
      countLeft -= 1;
      if (countLeft > 0) {
        setCountdown(countLeft);
        if (soundEnabled) playDigitalBeep(false);
      } else if (countLeft === 0) {
        setCountdown(null);
        if (flashEnabled) setFlashActive(true);
        playCustomShutter(shutterSoundStyle);
        triggerHaptic();

        setTimeout(async () => {
          setFlashActive(false);
          const newPhoto = await performActualCapture();
          
          if (tempPhotosForReview) {
            const updated = [...tempPhotosForReview];
            updated[indexToReplace] = newPhoto;
            setTempPhotosForReview(updated);
          }
          
          clearInterval(timer);
          setIsCapturing(false);
          if (soundEnabled) playSparkleSound();
        }, 150);
      }
    }, 1000);
  };

  return (
    <div className={`w-full flex flex-col gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950/98 p-4 md:p-8 overflow-y-auto' : ''}`} id="webcam-booth-station">
      
      {/* IMMERSIVE HEADER (Only visible in fullscreen) */}
      {isFullscreen && (
        <div className="flex justify-between items-center bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-md mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
            </span>
            <h2 className="font-bubble text-slate-100 text-lg font-black tracking-widest uppercase">
              ✨ Arpita Snaps - Pro Booth Mode ✨
            </h2>
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-2xl cursor-pointer transition-colors border border-rose-500/30 font-bold"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      )}

      {/* BOOTH CORE SPLIT LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COMPONENT: LIVE CAMERA VIEWPORT & REVIEWS PANEL */}
        <div className={`${isFullscreen ? 'xl:col-span-7' : 'xl:col-span-6'} flex flex-col gap-4`}>
          
          {/* THE VIEWFINDER CONTAINER */}
          {tempPhotosForReview && !isCapturing ? (
            /* ==================== INTERACTIVE REVIEW GRID PANEL ==================== */
            <div className="relative rounded-[32px] border-4 border-slate-900 bg-slate-900 p-5 shadow-[8px_8px_0px_0px_#1e293b] flex flex-col gap-4 min-h-[420px] justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
                  <div>
                    <h3 className="font-bubble text-pink-400 font-extrabold text-lg flex items-center gap-1.5 uppercase tracking-wider">
                      ★ Snapshot Gallery Reviews
                    </h3>
                    <p className="text-slate-400 font-mono text-[9px]">
                      Inspect your frames! Tap any frame to retake it perfectly.
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-slate-800 border border-slate-700 font-mono text-[9px] text-pink-300 rounded-lg">
                    {tempPhotosForReview.length} SAVED SHOTS
                  </span>
                </div>

                <div className={`grid gap-3 ${
                  tempPhotosForReview.length === 1 ? 'grid-cols-1' :
                  tempPhotosForReview.length === 2 ? 'grid-cols-2' :
                  tempPhotosForReview.length === 3 ? 'grid-cols-3' :
                  tempPhotosForReview.length === 4 ? 'grid-cols-2' : 'grid-cols-3'
                }`}>
                  {tempPhotosForReview.map((photo, idx) => (
                    <div 
                      key={photo.id} 
                      className="group relative rounded-2xl border-2 border-slate-800 bg-slate-950 overflow-hidden shadow-md hover:border-pink-500 transition-all duration-200 aspect-[4/3] flex flex-col justify-between"
                    >
                      <img 
                        src={photo.dataUrl} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-[1.03]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 opacity-80" />
                      
                      <span className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-slate-950/85 border border-white/20 text-[9px] font-mono text-white rounded-lg flex items-center gap-1">
                        📷 SLOT {idx + 1}
                      </span>

                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-1.5">
                        <button
                          onClick={() => triggerSingleRetake(idx)}
                          className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-xl shadow border border-pink-400 flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
                        >
                          <RefreshCw size={11} /> RETAKE THIS
                        </button>
                        <span className="text-[8px] font-mono text-slate-300">
                          Resnaps single frame
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 text-right">
                        <span className="text-[8px] font-mono text-pink-200 select-none bg-slate-950/50 px-1 py-0.5 rounded">
                          {photo.timestamp || "SNAP"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 border-t border-slate-800 pt-4 mt-2">
                <button
                  onClick={() => {
                    setTempPhotosForReview(null);
                    if (soundEnabled) playUIPop();
                  }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] font-bold uppercase tracking-widest border border-slate-700 rounded-xl cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={13} /> Scraps & Retake All
                </button>
                <button
                  onClick={() => {
                    if (tempPhotosForReview) {
                      onPhotosCaptured(tempPhotosForReview);
                    }
                  }}
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-mono text-[10px] font-black uppercase tracking-widest border border-pink-400 rounded-xl cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.25)] transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Check size={13} /> Looks Perfect! Decorate ✨
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="relative rounded-[32px] border-4 border-slate-900 bg-slate-950 overflow-hidden shadow-[8px_8px_0px_0px_#1e293b] select-none w-full max-w-full mx-auto transition-all duration-300"
              style={{ 
                aspectRatio: aspectRatio === '4/3' ? '1.33' : 
                             aspectRatio === '16/9' ? '1.77' : 
                             aspectRatio === '9/16' ? '0.56' : '1.0',
                maxHeight: isFullscreen ? '75vh' : '65vh'
              }}
            >
            
            {/* NO HARDWARE / INITIAL WATERMARK HINTS */}
            {mode === 'preset' && (
              <div className="absolute inset-0 z-40 bg-pink-50/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                <span className="text-4xl animate-bounce mb-2">🧁</span>
                <p className="font-bubble text-slate-800 font-bold mb-3 select-none text-sm leading-snug">
                  Camera is waiting for you! ✨<br />
                  Activate live stream, upload files, or click one of Arpita's cute presets!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startCamera()}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase rounded-xl shadow border border-indigo-400 cursor-pointer transition-transform active:scale-95"
                  >
                    ★ Launch Webcam
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase rounded-xl shadow border border-pink-400 cursor-pointer transition-transform active:scale-95"
                  >
                    ★ Upload Selfie
                  </button>
                </div>
              </div>
            )}

            {/* CUTE APERTURE LENS BUFFER / STARTUP INDICATOR */}
            {isInitializingCamera && (
              <div className="absolute inset-0 z-45 bg-slate-950/90 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 border-4 border-dashed border-pink-500 rounded-full animate-spin flex items-center justify-center">
                  <Camera className="text-pink-400 rotate-12" size={24} />
                </div>
                <span className="mt-4 font-mono text-[9px] text-pink-300 tracking-widest uppercase animate-pulse">
                  Powering up glass lenses...
                </span>
              </div>
            )}

            {/* WEBCAM VIDEO STREAM */}
            {mode === 'live' ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => console.log("Video source play started")}
                onEmptied={() => console.log("Video stream emptied")}
                onStalled={() => {
                  console.warn("Video stream stalled, attempting recovery...");
                  videoRef.current?.play().catch(e => console.warn("Video stall play recovery failed:", e));
                }}
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: 'cover',
                  transform: isMirrored ? `scaleX(-1) scale(${zoomLevel})` : `scale(${zoomLevel})`,
                  filter: compositeCssFilter
                }}
              />
            ) : (
              <img
                src={selectedPhotoSource}
                alt="Cute webcam model preset"
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: compositeCssFilter
                }}
              />
            )}

            {/* BULLETPROOF MOBILE CAMERA ERROR LAYER */}
            {cameraError && (
              <div className="absolute inset-0 z-46 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center overflow-y-auto select-text">
                <div className="flex flex-col items-center max-w-sm mx-auto gap-2.5 text-white">
                  <div className="p-3 bg-pink-500/20 border border-pink-500/35 rounded-full text-pink-400">
                    <AlertCircle size={26} />
                  </div>
                  
                  <h3 className="font-bubble text-pink-400 font-black text-sm uppercase tracking-widest leading-none">
                    ★ Camera Connection Snag ★
                  </h3>
                  
                  <p className="font-sans text-[10.5px] text-slate-200 leading-relaxed font-semibold bg-slate-1000 border border-slate-800 p-3 rounded-xl shadow-inner select-all">
                    {cameraError}
                  </p>

                  <div className="w-full text-left bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
                    <span className="font-mono text-[8px] text-pink-300 font-extrabold uppercase tracking-wider block mb-1 leading-none">
                      💡 Quick Permission Troubleshooting:
                    </span>
                    <ul className="list-decimal list-inside font-sans text-[9px] text-slate-300 space-y-1">
                      <li><b className="text-white">iPhone Safari:</b> Tap the <b className="text-pink-300">aA</b> or lock icon in the address bar ➜ select <b className="text-white">Website Settings</b> ➜ set Camera to <b className="text-pink-300">Allow</b>.</li>
                      <li><b className="text-white">Android Chrome:</b> Tap URL lock icon <span className="text-white">🔒</span> ➜ select <b className="text-white">Permissions</b> ➜ toggle Camera to <b className="text-pink-300">ON</b>.</li>
                      <li>Close all other camera-blocking applications (FaceTime, Zoom, video-chats).</li>
                    </ul>
                  </div>

                  <div className="flex gap-2 w-full mt-1">
                    <button
                      onClick={() => startCamera()}
                      className="flex-1 py-2 bg-pink-500 hover:bg-pink-600 text-white font-mono text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-pink-400 flex items-center justify-center gap-1 active:scale-95 shadow"
                    >
                      <RefreshCw size={11} className="animate-spin" /> Retry Stream
                    </button>
                    <button
                      onClick={() => {
                        setCameraError(null);
                        setMode('preset');
                      }}
                      className="py-1.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[9px] uppercase tracking-wider rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Use Presets
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HARDWARE FILTER LIVE COLOR GRADIENT OVERLAYS */}
            {activeFilter.overlayClass && (
              <div className={`absolute inset-0 pointer-events-none z-10 ${activeFilter.overlayClass}`} />
            )}

            {/* CRT SCANLINES SCANNER */}
            <div 
              className="absolute inset-0 pointer-events-none crt-scanlines z-15"
              style={{ opacity: (sliders.grain / 100) * 0.4 }}
            />

            {/* RULE OF THIRDS ALIGNMENT OVERLAY GRID */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-15 grid grid-cols-3 grid-rows-3 border border-white/10 divide-x divide-y divide-white/10">
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}

            {/* WATERMARK HUD LABELS */}
            <div className="absolute bottom-3 left-4 z-20 font-pixel text-white text-xs tracking-wider opacity-90 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.55)] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              LIVE: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="absolute bottom-3 right-4 z-20 font-cyber font-bold text-xs text-rose-300 drop-shadow-[0_2px_4px_rgba(255,102,178,0.8)] flex items-center gap-1 select-none animate-pulse">
              <Sparkles size={12} /> ARPITA SNAPS ✨
            </div>

            {/* SMILE TRIGGER SIMULATION CHARGING METER */}
            {isSmileActive && (
              <div className="absolute top-3 left-3 right-3 z-35 bg-slate-950/80 border border-white/15 p-2.5 rounded-2xl flex flex-col gap-1 backdrop-blur-md">
                <div className="flex justify-between items-center text-[9px] font-mono text-white">
                  <span className="flex items-center gap-1 text-pink-300">
                    <Smile size={12} className="animate-bounce" /> 
                    {smileTriggerPercent < 40 ? 'SMILE TO SNAP 😊' : 
                     smileTriggerPercent < 80 ? 'CUTE SMILE DETECTED! 😄' : 'PERFECT LOCK IN 😆!'}
                  </span>
                  <span>{smileTriggerPercent}% MATCH</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300 rounded-full"
                    style={{ width: `${smileTriggerPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* DETAILED DIGITAL BEEP COUNTDOWN LAYER OVERLAY */}
            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 z-45 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white"
                >
                  <span className="font-bubble text-md text-pink-300 animate-pulse tracking-wide font-extrabold select-none">
                    GET READY!
                  </span>
                  <span className="font-bubble text-7xl md:text-8xl font-black drop-shadow-[4px_4px_0px_#db2777] select-none text-white animate-bounce">
                    {countdown}
                  </span>
                  <span className="px-3 py-1 bg-slate-950/80 border border-white/20 text-white rounded-lg font-mono text-[9px] mt-2 select-none uppercase tracking-widest">
                    📸 Keep cute posture - Capture!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SHUTTER WHITE FLASH FLASH EFFECT */}
            <AnimatePresence>
              {flashActive && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 z-40 bg-white"
                />
              )}
            </AnimatePresence>

            {/* RETRO VIEWFINDER FRAME HUD BORDERS */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/60 pointer-events-none z-10" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/60 pointer-events-none z-10" />

            {/* QUICK FLOATING HUD ACTIONS COLUMN */}
            {mode === 'live' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 p-1.5 bg-slate-950/65 border border-white/10 rounded-2xl backdrop-blur-md">
                
                {/* Touch-Friendly camera Flip lens */}
                <button
                  onClick={toggleCameraFacing}
                  className="p-2 hover:bg-white/20 text-white/90 hover:text-white rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5"
                  title="Flip Camera front/back (Front ↔ Back)"
                >
                  <RotateCcw size={13} className="text-pink-300 animate-pulse" />
                  <span className="text-[7.5px] font-mono font-bold leading-none">{facingMode === 'user' ? 'FRONT' : 'BACK'}</span>
                </button>

                {/* Aspect Ratio Cycler */}
                <button
                  onClick={() => {
                    const ratios: ('4/3' | '16/9' | '1/1' | '9/16')[] = ['4/3', '1/1', '16/9', '9/16'];
                    const nextIdx = (ratios.indexOf(aspectRatio) + 1) % ratios.length;
                    setAspectRatio(ratios[nextIdx]);
                    if (soundEnabled) playUIPop();
                  }}
                  className="p-2 hover:bg-white/20 text-white/90 hover:text-white rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5"
                  title="Toggle Aspect Ratio"
                >
                  <Grid size={13} />
                  <span className="text-[7px] font-mono font-bold">{aspectRatio}</span>
                </button>

                {/* Horizontal Mirroring Toggle */}
                <button
                  onClick={() => {
                    setIsMirrored(!isMirrored);
                    if (soundEnabled) playUIPop();
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    isMirrored ? 'bg-pink-500/20 text-pink-300' : 'text-white/80 hover:bg-white/10 '
                  }`}
                  title="Mirror Horizontal Stream"
                >
                  <RefreshCw size={13} className={isMirrored ? 'rotate-180' : ''} />
                  <span className="text-[7px] font-mono font-bold">MIRROR</span>
                </button>

                {/* Anti-shudder Gridline Overlay */}
                <button
                  onClick={() => {
                    setShowGrid(!showGrid);
                    if (soundEnabled) playUIPop();
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    showGrid ? 'bg-pink-500/20 text-pink-300' : 'text-white/80 hover:bg-white/10 '
                  }`}
                  title="Camera alignment grid"
                >
                  <Grid size={13} />
                  <span className="text-[7px] font-mono font-bold">{showGrid ? 'GRID ON' : 'GRID OFF'}</span>
                </button>

                {/* Digital Zoom Preset badge */}
                <button
                  onClick={() => {
                    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : prev === 2 ? 3 : 1));
                    if (soundEnabled) playUIPop();
                  }}
                  className="p-2 hover:bg-white/20 text-white/90 hover:text-white rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5"
                  title="Digital Zoom Preset"
                >
                  <span className="text-[9px] font-black">{zoomLevel}x</span>
                  <span className="text-[7px] font-mono font-bold">ZOOM</span>
                </button>

                {/* Dynamic Voice command toggle */}
                <button
                  onClick={() => {
                    setVoiceCommandEnabled(!voiceCommandEnabled);
                    if (soundEnabled) playUIPop();
                  }}
                  className={`p-2 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    voiceCommandEnabled ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'text-white/80 hover:bg-white/10 '
                  }`}
                  title="Voice command take photo (cheese / click / snap)"
                >
                  {voiceCommandEnabled ? <Mic size={13} /> : <MicOff size={13} />}
                  <span className="text-[7px] font-mono font-bold">VOICE</span>
                </button>

                {/* Fullscreen HUD Toggle */}
                <button
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    if (soundEnabled) playUIPop();
                  }}
                  className="p-2 hover:bg-white/20 text-white hover:text-pink-300 rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5"
                  title="Toggle Fullscreen view"
                >
                  {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  <span className="text-[7px] font-mono font-bold">FS</span>
                </button>
              </div>
            )}

            {/* BURST CAPTURED MINI THUMBNAILS */}
            {isCapturing && capturedSessionPhotos.length > 0 && (
              <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 p-1.5 bg-slate-950/80 border border-white/15 rounded-xl max-h-[160px] overflow-y-auto">
                {capturedSessionPhotos.map((photo, idx) => (
                  <div key={photo.id} className="relative w-11 h-9 rounded border border-white overflow-hidden shadow">
                    <img src={photo.dataUrl} className="w-full h-full object-cover animate-fade-in" />
                    <span className="absolute bottom-0.5 right-0.5 text-[7px] bg-pink-500 text-white px-1 font-mono rounded font-bold">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {/* ACTIVE SHUTTER CONTROLS */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setBurstCount(1);
                  if (soundEnabled) playUIPop();
                }}
                className={`py-2 px-3 rounded-xl font-mono text-[9px] font-bold uppercase tracking-wider border-2 cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition-all ${
                  burstCount === 1
                    ? 'bg-pink-100 border-black text-pink-700 font-extrabold -translate-y-0.5'
                    : 'bg-white border-black text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                ★ Single Shot
              </button>
              <button
                onClick={() => {
                  setBurstCount(4);
                  if (soundEnabled) playUIPop();
                }}
                className={`py-2 px-3 rounded-xl font-mono text-[9px] font-bold uppercase tracking-wider border-2 cursor-pointer shadow-[2px_2px_0_0_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition-all ${
                  burstCount === 4
                    ? 'bg-pink-400 border-black text-white font-extrabold -translate-y-0.5'
                    : 'bg-white border-black text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                ★ Collage Burst (4x)
              </button>
            </div>

            <button
              disabled={isCapturing}
              onClick={handleTriggerCapture}
              className={`relative group h-12 rounded-2xl cursor-pointer border-2 border-black font-mono text-[10px] font-black uppercase tracking-widest transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 overflow-hidden ${
                isCapturing
                  ? 'bg-zinc-200 text-zinc-500 border-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-rose-400 hover:bg-rose-500 text-rose-950'
              }`}
            >
              {isCapturing ? (
                <RefreshCw className="animate-spin text-rose-950" size={13} />
              ) : (
                <Camera className="group-hover:rotate-12 transition-transform text-rose-950" size={13} />
              )}
              {isCapturing ? "SMILE! Snap active..." : (burstCount === 4 ? "★ Start 4X BURST ★" : "★ Snap Photo ★")}
            </button>
          </div>

          {/* SOURCING PANEL ALT */}
          <div className="bg-slate-50/80 border-2 border-slate-700/60 p-3 rounded-2xl">
            <h4 className="font-bubble text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-1">
              📷 Alternative Selfie Source & Quick Models:
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => startCamera()}
                  className={`flex-1 min-w-[100px] py-1 px-2.5 rounded-lg font-bubble text-[9px] font-bold border cursor-pointer hover:bg-white flex items-center justify-center gap-1 ${
                    mode === 'live' ? 'bg-indigo-100 border-indigo-500 text-indigo-805' : 'bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <Camera size={10} /> {mode === 'live' ? 'Restart Stream' : 'Active Webcam'}
                </button>
                <button
                  onClick={toggleCameraFacing}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg hover:bg-white text-slate-800 font-bubble text-[9px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                  title="Flip camera mode between front and back"
                >
                  🔄 {facingMode === 'user' ? 'Front' : 'Back'} Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 min-w-[100px] py-1 px-2.5 rounded-lg font-bubble text-[9px] font-bold border cursor-pointer hover:bg-white flex items-center justify-center gap-1 ${
                    mode === 'upload' ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <Upload size={10} /> {uploadedImageName ? "Selfie Loaded" : "Upload Image"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUploaded}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Character grid */}
              <div className="grid grid-cols-3 gap-1">
                {RETRO_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedPhotoSource(model.url);
                      setMode('preset');
                      if (soundEnabled) playSparkleSound();
                    }}
                    className={`py-1 px-1.5 border rounded-xl flex items-center gap-1.5 transition-all text-left cursor-pointer ${
                      mode === 'preset' && selectedPhotoSource === model.url
                        ? 'border-pink-500 bg-pink-100/50 scale-[1.02]'
                        : 'border-slate-300 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-xs select-none">{model.emoji}</span>
                    <span className="text-[8px] font-bubble leading-none text-slate-700 truncate max-w-full font-bold">
                      {model.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: AESTHETIC FILTER STUDIO SUITE (Span 6) */}
        <div className="xl:col-span-6 flex flex-col border-3 border-slate-800 bg-white rounded-[28px] overflow-hidden shadow-[6px_6px_0px_0px_#1e293b]">
          
          {/* TAB HEADER HEADINGS */}
          <div className="flex border-b-2 border-slate-800 bg-slate-50">
            <button
              onClick={() => {
                setActiveTab('filters');
                if (soundEnabled) playUIPop();
              }}
              className={`flex-1 py-3 font-bubble text-[11px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'filters'
                  ? 'bg-white text-rose-500 border-r-2 border-slate-800 font-bold shadow-inner'
                  : 'text-slate-500 hover:text-slate-800 border-r-2 border-slate-800'
              }`}
            >
              <Sparkles size={13} className={activeTab === 'filters' ? 'animate-pulse' : ''} />
              🎈 Filter Studio
            </button>
            <button
              onClick={() => {
                setActiveTab('tune');
                if (soundEnabled) playUIPop();
              }}
              className={`flex-1 py-3 font-bubble text-[11px] font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'tune'
                  ? 'bg-white text-rose-500 font-bold shadow-inner'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders size={13} />
              🎚️ Fine-Tune Edit
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between gap-4 max-h-[580px] overflow-y-auto">
            
            {/* TAB CONTENT: FILTERS */}
            {activeTab === 'filters' ? (
              <div className="flex flex-col gap-3 flex-1">
                {/* Search Bar and controls */}
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Arpita's filters... ✨"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1 bg-slate-100 text-[10px] font-bubble text-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-400 border border-slate-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-650"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories Tab scrolling strip */}
                <div className="flex overflow-x-auto gap-1 pb-1 px-0.5 scrollbar-thin hide-scrollbars">
                  {FILTER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        if (soundEnabled) playUIPop();
                      }}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-bubble font-bold border transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-rose-450 text-rose-950 border-slate-800 shadow-[1px_1px_0_0_#000]'
                          : 'bg-stone-50 text-slate-600 border-slate-300 hover:bg-stone-100'
                      }`}
                    >
                      <span className="mr-0.5">{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Filter list header details */}
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 border-b border-pink-100 pb-1.5 select-none">
                  <span>Showing {filteredFilters.length} aesthetic snap presets</span>
                  <span className="animate-pulse flex items-center gap-1">
                    Active: <b className="text-pink-600 uppercase font-bold">({activeFilter.name})</b>
                  </span>
                </div>

                {/* Filters Grid scrolling container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-0.5 max-h-[300px] scrollbar-thin">
                  {filteredFilters.map((filt) => {
                    const isFav = favorites.includes(filt.id);
                    const isActive = activeFilter.id === filt.id;
                    return (
                      <div
                        key={filt.id}
                        onClick={() => handleSelectFilter(filt)}
                        className={`group relative rounded-xl border-2 p-1.5 transition-all text-left flex items-start gap-1 cursor-pointer select-none active:scale-[0.98] ${
                          isActive
                            ? 'bg-rose-100/70 border-slate-800 ring-1 ring-slate-800'
                            : 'bg-white border-slate-200 hover:border-slate-800 hover:bg-stone-50'
                        }`}
                      >
                        {/* Emoji visual indicator */}
                        <div className="w-6 h-6 rounded-lg bg-pink-100/50 flex items-center justify-center text-md border border-pink-200/50">
                          {filt.emoji}
                        </div>

                        {/* Filter Name & Category */}
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="font-bubble text-[9.5px] font-bold text-slate-800 leading-snug truncate">
                            {filt.name}
                          </p>
                          <p className="font-mono text-[7.5px] text-slate-500 uppercase font-semibold">
                            {filt.category}
                          </p>
                        </div>

                        {/* Favorite Star action Button */}
                        <button
                          onClick={(e) => handleToggleFavorite(filt.id, e)}
                          className="absolute right-1 top-1 p-0.5 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            size={10}
                            className={`${
                              isFav ? 'fill-yellow-400 text-yellow-600 font-bold' : 'text-slate-300 group-hover:text-slate-400'
                            }`}
                          />
                        </button>

                        {/* Trend Star label */}
                        {filt.isTrending && (
                          <div className="absolute right-1 bottom-1 text-[8px] text-orange-400 animate-pulse">
                            <Flame size={10} className="fill-orange-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredFilters.length === 0 && (
                    <div className="col-span-full py-8 text-center font-bubble text-slate-400 text-xs">
                      🌈 No custom filters match your filter! <br />
                      Try favoriting key presets or search with an alternate term!
                    </div>
                  )}
                </div>

                {/* Recently Used collection bar */}
                {recentlyUsed.length > 0 && (
                  <div className="border-t border-dashed border-slate-200 pt-2 pb-1.5">
                    <p className="text-[8.5px] text-slate-500 font-mono font-bold uppercase mb-1">⏱️ Recently Snap-tested Filter deck:</p>
                    <div className="flex gap-1.5">
                      {recentlyUsed.map((id) => {
                        const filtObj = PREMIUM_FILTERS.find((f) => f.id === id);
                        if (!filtObj) return null;
                        const isSelected = activeFilter.id === filtObj.id;
                        return (
                          <button
                            key={id}
                            onClick={() => handleSelectFilter(filtObj)}
                            className={`px-2 py-0.5 border text-[8.5px] font-bubble font-bold rounded-lg cursor-pointer ${
                              isSelected ? 'bg-indigo-100 border-indigo-400 text-indigo-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {filtObj.emoji} {filtObj.name.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // TAB CONTENT: SLIDERS ADJUSTMENT FINE TUNE
              <div className="flex flex-col gap-3 flex-1 select-none">
                <div className="flex justify-between items-center bg-pink-50 p-2 rounded-xl border border-pink-100">
                  <span className="font-bubble text-[9px] font-semibold text-pink-700 leading-normal flex items-center gap-1">
                    <Sliders size={11} /> Tuning base preset: <b>{activeFilter.name}</b>
                  </span>
                  <button
                    onClick={handleResetSliders}
                    className="flex items-center gap-0.5 px-2 py-0.5 bg-white border border-slate-300 hover:border-slate-800 font-mono text-[8px] font-bold text-slate-700 rounded-lg shadow-xs cursor-pointer active:translate-y-0.5"
                  >
                    <RotateCcw size={9} /> Reset Studio
                  </button>
                </div>

                {/* SLIDERS LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 max-h-[300px] overflow-y-auto pr-0.5 scrollbar-thin">
                  
                  {/* Slider Element: Brightness */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🔆 Exposure (Brightness)</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="175"
                      value={sliders.brightness}
                      onChange={(e) => setSliders({ ...sliders, brightness: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Contrast */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🌓 Dynamic Contrast</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="180"
                      value={sliders.contrast}
                      onChange={(e) => setSliders({ ...sliders, contrast: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Saturation */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🎨 Saturation (Saturate)</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sliders.saturation}
                      onChange={(e) => setSliders({ ...sliders, saturation: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Warmth */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🏺 Cozy Warmth (Sepia)</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.warmth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliders.warmth}
                      onChange={(e) => setSliders({ ...sliders, warmth: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Tint */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🎡 Hue Tint Shift</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.tint}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={sliders.tint}
                      onChange={(e) => setSliders({ ...sliders, tint: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Blur */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>☁️ Dreamy Blur Depth</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={sliders.blur}
                      onChange={(e) => setSliders({ ...sliders, blur: parseFloat(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Grain */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>📼 Scanline / Grain Noise</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.grain}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliders.grain}
                      onChange={(e) => setSliders({ ...sliders, grain: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Sharpness */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>📐 Face Edge Sharpness</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.sharpness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliders.sharpness}
                      onChange={(e) => setSliders({ ...sliders, sharpness: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Glow */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>✨ Princess Glow Halo</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.glow}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={sliders.glow}
                      onChange={(e) => setSliders({ ...sliders, glow: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Shadow level */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🌚 Deep Shadow Level</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.shadowLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliders.shadowLevel}
                      onChange={(e) => setSliders({ ...sliders, shadowLevel: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>

                  {/* Slider Element: Highlights */}
                  <div className="flex flex-col gap-1 border-b border-stone-50 pb-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bubble font-semibold text-slate-700">
                      <span>🌖 Dynamic Highlights</span>
                      <span className="font-mono font-bold text-pink-600">{sliders.highlightControl}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="160"
                      value={sliders.highlightControl}
                      onChange={(e) => setSliders({ ...sliders, highlightControl: parseInt(e.target.value) })}
                      className="w-full accent-pink-500 h-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* QUICK FOOTER HINT INFO */}
            <div className="flex items-center gap-1 mt-1 bg-slate-50 text-[8px] font-mono text-slate-500 justify-center p-2 rounded-lg border border-slate-200 select-none">
              <Eye size={10} className="text-pink-500 animate-pulse" /> 
              <span>Real-time adjustments are directly baked into captured PNG strips on demand!</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
