/**
 * FireRain.jsx
 * Usage:
 *   <section className="relative ...">
 *     <FireRain />
 *     <YourContent />
 *   </section>
 */

import { motion } from "framer-motion";
import { useMemo } from "react";

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

function createParticle(id) {
  const depth = Math.random(); // 0 = far background, 1 = near foreground

  const isBg = depth < 0.42;

  // Core glow color — red-orange for bg, amber-orange for fg
  const r   = 255;
  const g   = isBg ? randInt(55, 95) : randInt(100, 165);
  const b   = isBg ? 15 : 25;
  const rgb = `${r},${g},${b}`;

  return {
    id,
    size:        isBg ? rand(3, 5)   : rand(5, 9),
    startX:      rand(0, 100),        // vw
    startY:      rand(-10, -3),       // vh — above viewport
    driftX:      rand(-16, 16),       // vw offset during fall
    endY:        rand(108, 120),      // vh — below viewport
    duration:    isBg ? rand(10, 15) : rand(5, 9),
    delay:       rand(0, 12),
    repeatDelay: rand(0.2, 2.5),
    opacity:     isBg ? rand(0.15, 0.28) : rand(0.32, 0.55),
    wobbleAmp:   rand(5, 16),
    rgb,
    blur:        isBg ? rand(1.5, 3.0) : rand(0.4, 1.4),
  };
}

export default function FireRain({ count = 12 }) {
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => createParticle(i)),
    // created once — intentionally empty deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        overflow:      "hidden",
        pointerEvents: "none",
        zIndex:        0,
      }}
    >
      {particles.map(p => {
        const glowSize   = p.size * 2;
        const glowSpread = p.size * 0.8;

        return (
          <motion.div
            key={p.id}
            initial={{
              x:       0,
              y:       `${p.startY}vh`,
              opacity: 0,
            }}
            animate={{
              x: [
                0,
                p.wobbleAmp * 0.5,
                p.driftX * 0.4,
                p.driftX * 0.7 - p.wobbleAmp * 0.3,
                p.driftX,
              ],
              y:       `${p.endY}vh`,
              opacity: [0, p.opacity, p.opacity, p.opacity * 0.5, 0],
            }}
            transition={{
              duration:    p.duration,
              delay:       p.delay,
              repeat:      Infinity,
              repeatDelay: p.repeatDelay,
              ease:        "linear",
              opacity: {
                times:    [0, 0.07, 0.80, 0.93, 1],
                ease:     "linear",
                duration: p.duration,
                delay:    p.delay,
                repeat:   Infinity,
                repeatDelay: p.repeatDelay,
              },
              x: {
                times:    [0, 0.25, 0.5, 0.75, 1],
                ease:     "easeInOut",
                duration: p.duration,
                delay:    p.delay,
                repeat:   Infinity,
                repeatDelay: p.repeatDelay,
              },
            }}
            style={{
              position:     "absolute",
              left:         `${p.startX}vw`,
              top:          0,
              width:        p.size,
              height:       p.size,
              borderRadius: "50%",
              // hot white core fading to orange-red
              background:   `radial-gradient(circle at 38% 32%, rgba(255,235,180,0.95) 0%, rgba(${p.rgb},0.9) 45%, rgba(${p.rgb},0.15) 100%)`,
              boxShadow:    `0 0 ${glowSize}px ${glowSpread}px rgba(${p.rgb},0.32)`,
              filter:       `blur(${p.blur}px)`,
              willChange:   "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}