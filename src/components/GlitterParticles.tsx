import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px
  rotation: number;
  speed: number;
  content: string;
}

interface GlitterParticlesProps {
  type: 'hearts' | 'clouds' | 'pixels' | 'stars' | 'glitter' | 'pastles';
}

const PARTICLE_SETS: Record<string, string[]> = {
  hearts: ['💖', '💕', '🩰', '🎀', '💌', '🌸'],
  clouds: ['☁️', '👼', '🎈', '⭐', '🌈', '🎐'],
  pixels: ['👾', '💿', '🕹️', '💾', '📟', '✨'],
  stars: ['✨', '⭐', '🌟', '🌙', '💫', '🎆'],
  glitter: ['✨', '💎', '🦄', '💍', '❇️', '⚡'],
  pastles: ['🐰', '🐱', '🦋', '🌸', '🧁', '🍦']
};

export default function GlitterParticles({ type }: GlitterParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate initial particles
    const list: string[] = PARTICLE_SETS[type] || PARTICLE_SETS.hearts;
    const initialParticles: Particle[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 95,
      size: Math.random() * 20 + 16, // 16px to 36px
      rotation: Math.random() * 360,
      speed: Math.random() * 6 + 4, // floating seconds
      content: list[Math.floor(Math.random() * list.length)]
    }));
    setParticles(initialParticles);
  }, [type]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: `${p.x}%`, 
              y: '105%', 
              rotate: p.rotation, 
              opacity: 0,
              scale: 0.6 
            }}
            animate={{ 
              y: '-10%', 
              rotate: p.rotation + (Math.random() > 0.5 ? 360 : -360),
              opacity: [0, 0.7, 0.7, 0],
              scale: [0.6, 1.1, 1.1, 0.7]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.speed + 12,
              repeat: Infinity,
              ease: 'linear',
              delay: (p.id * 0.7) // Staggered entry
            }}
            className="absolute select-none filter drop-shadow-[0_2px_5px_rgba(255,255,255,0.4)]"
            style={{ fontSize: p.size }}
          >
            {p.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
