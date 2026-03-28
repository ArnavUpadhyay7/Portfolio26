import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const CREAM  = "#EAE4D5";
const RED    = "#E8400C";
const E      = [0.16, 1, 0.3, 1];
const BG     = "#0a0a0a";

/* ── Glitch scramble ── */
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function scramble(target, progress) {
  return target.split("").map((char, i) => {
    if (i / target.length < progress) return char;
    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }).join("");
}

function useScramble(text, trigger, duration = 800) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(scramble(text, t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger]); // eslint-disable-line
  return display;
}

function ScrambleWord({ text, color, style, delay = 0, visible }) {
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setSeed((s) => s + 1), delay);
      return () => clearTimeout(t);
    }
  }, [visible]); // eslint-disable-line
  const display = useScramble(text, seed);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: E, delay: delay / 1000 }}
      style={{ color, ...style, fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </motion.div>
  );
}

/* ── Background Grid ──
   Dot grid + structural lines.

   LIGHTING CHANGE:
   - Removed: all radial gradients, oval/circular glows, centered glow shapes
   - Removed: the rgba(232,64,12,0.018) rect with radial mask
   - Removed: the center vertical orange axis line
   - Added: a single left-to-right linear energy gradient overlay (div, not SVG)
     that lives outside the SVG so it's fully responsive without SVG coordinate math.
     Left edge: very faint warm orange tint. Right edge: pure transparent (black).
     Transition is extremely gradual — 0% → 58% still has color, then fades to 0.
     This mimics a directional light field from the left (where the name lives).
── */
function BackgroundGrid({ visible }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : {}}
      transition={{ duration: 1.4, ease: E, delay: 0.3 }}
    >
      {/*
        Directional light field — left to right linear gradient.
        No radial shapes. No blobs. No centered glows.
        Just a warm left-side tint that dies out naturally before center.

        Using a div (not SVG rect) so it's 100% responsive by default
        and doesn't require SVG coordinate recalculation.

        Three-stop gradient:
          0%   → rgba(232,64,12, 0.055)  — warm but very subtle at the far left
          42%  → rgba(232,64,12, 0.018)  — nearly gone by mid-screen
          100% → transparent             — full black on the right

        This keeps the right side (contrast side) completely dark.
      */}
      <div
        style={{
          position:   "absolute",
          inset:      0,
          background: `linear-gradient(
            to right,
            rgba(232,64,12,0.055)  0%,
            rgba(232,64,12,0.028)  22%,
            rgba(232,64,12,0.010)  42%,
            transparent            72%
          )`,
          // No border-radius — this is a directional field, not a shape
        }}
      />

      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="0.85" fill="rgba(234,228,213,0.10)" />
          </pattern>

          <pattern id="hero-dots-accent" x="0" y="0" width="192" height="192" patternUnits="userSpaceOnUse">
            <circle cx="96" cy="96" r="1.4" fill="rgba(234,228,213,0.18)" />
          </pattern>

          <radialGradient id="grid-fade" cx="50%" cy="45%" r="65%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grid-fade-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="55%"  stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>

        {/* Dot fields — unchanged */}
        <rect width="100%" height="100%" fill="url(#hero-dots)"        mask="url(#grid-mask)" />
        <rect width="100%" height="100%" fill="url(#hero-dots-accent)" mask="url(#grid-mask)" />

        {/* Horizontal structural rules */}
        {[22, 44, 67].map((pct) => (
          <line
            key={pct}
            x1="0%" y1={`${pct}%`} x2="100%" y2={`${pct}%`}
            stroke="rgba(234,228,213,0.045)"
            strokeWidth="0.5"
          />
        ))}

        {/* Vertical structural rules — flanking content zone */}
        {[12, 88].map((pct) => (
          <line
            key={pct}
            x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%"
            stroke="rgba(234,228,213,0.04)"
            strokeWidth="0.5"
          />
        ))}

        {/* Corner tick marks — unchanged */}
        <line x1="5%"  y1="4%"  x2="8%"  y2="4%"  stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="5%"  y1="4%"  x2="5%"  y2="8%"  stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="92%" y1="4%"  x2="95%" y2="4%"  stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="95%" y1="4%"  x2="95%" y2="8%"  stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="5%"  y1="96%" x2="8%"  y2="96%" stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="5%"  y1="92%" x2="5%"  y2="96%" stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="92%" y1="96%" x2="95%" y2="96%" stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />
        <line x1="95%" y1="92%" x2="95%" y2="96%" stroke="rgba(232,64,12,0.22)" strokeWidth="0.75" />

        {/* Diagonal accent — bottom right */}
        <line
          x1="78%" y1="85%" x2="92%" y2="98%"
          stroke="rgba(234,228,213,0.04)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
      </svg>

      {/* Right-side coordinate HUD — unchanged */}
      <div style={{
        position:      "absolute",
        right:         "clamp(16px, 4vw, 48px)",
        top:           "38%",
        display:       "flex",
        flexDirection: "column",
        gap:           6,
        zIndex:        2,
      }}>
        {["X 48.2291° N", "Y 11.6942° E", "Z 00:00:00"].map((label, i) => (
          <span key={i} style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    400,
            fontSize:      9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.14)",
            display:       "block",
          }}>{label}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Status ticker ── */
function StatusTicker({ visible }) {
  const items = ["AVAILABLE FOR WORK", "BASED IN INDIA", "FRONTEND ENGINEER", "OPEN TO FREELANCE"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 2800);
    return () => clearInterval(t);
  }, [visible]);
  return (
    <div className="flex items-center gap-3 overflow-hidden" style={{ height: 16 }}>
      <style>{`@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      <div style={{
        width: 5, height: 5, borderRadius: "50%", background: RED, flexShrink: 0,
        animation: "pulse-dot 1.4s ease-in-out infinite",
      }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25, ease: E }}
          style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    500,
            fontSize:      10,
            letterSpacing: "0.28em",
            color:         "rgba(234,228,213,0.38)",
            textTransform: "uppercase",
            whiteSpace:    "nowrap",
          }}
        >
          {items[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ── Scan line ── */
function ScanLine({ visible }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left:       0,
        right:      0,
        height:     1,
        background: `linear-gradient(to right, transparent 0%, rgba(232,64,12,0.18) 30%, rgba(232,64,12,0.28) 50%, rgba(232,64,12,0.18) 70%, transparent 100%)`,
        zIndex:     3,
        top:        0,
      }}
      initial={{ top: "0%", opacity: 0 }}
      animate={visible ? {
        top:     ["8%", "92%", "8%"],
        opacity: [0, 0.7, 0.7, 0.7, 0],
      } : {}}
      transition={{
        duration:   12,
        ease:       "linear",
        repeat:     Infinity,
        repeatType: "loop",
        delay:      2,
        times:      [0, 0.4, 0.6, 0.9, 1],
      }}
    />
  );
}

/* ── Side label ── */
function SideLabel({ visible }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left:            "clamp(12px, 2.5vw, 28px)",
        top:             "50%",
        transform:       "translateY(-50%) rotate(-90deg)",
        transformOrigin: "center center",
        zIndex:          6,
        whiteSpace:      "nowrap",
        display:         "flex",
        alignItems:      "center",
        gap:             12,
      }}
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : {}}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <div style={{ width: 18, height: 1, background: "rgba(232,64,12,0.4)" }} />
      <span style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontWeight:    400,
        fontSize:      9,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color:         "rgba(234,228,213,0.20)",
      }}>
        00 / Hero
      </span>
    </motion.div>
  );
}

/* ── Main ── */
export default function HeroSection({ visible }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.12, 0.50], [1, 0]);
  const y       = useTransform(scrollYProgress, [0.10, 0.50], ["0px", "-40px"]);
  const scale   = useTransform(scrollYProgress, [0.10, 0.50], [1, 0.97]);

  const nameStyle = {
    fontFamily:    "'Bebas Neue', sans-serif",
    fontSize:      "clamp(64px, 13vw, 220px)",
    lineHeight:    "0.85",
    letterSpacing: "-0.03em",
    textTransform: "uppercase",
    display:       "block",
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden w-full min-h-screen flex flex-col justify-between px-10 lg:px-20 pt-12 pb-16"
      style={{ background: BG }}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;700;900&family=Barlow:wght@300;400&display=swap" />

      <BackgroundGrid visible={visible} />
      <ScanLine visible={visible} />
      <SideLabel visible={visible} />

      {/* Ghost year */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute pointer-events-none select-none"
        style={{
          fontFamily:       "'Barlow Condensed', sans-serif",
          fontWeight:       900,
          fontSize:         "clamp(120px, 18vw, 240px)",
          lineHeight:       1,
          letterSpacing:    "-0.06em",
          color:            "transparent",
          WebkitTextStroke: "1px rgba(232,64,12,0.06)",
          right:            "-1vw",
          bottom:           "-3vh",
          zIndex:           4,
        }}
      >
        2026
      </motion.div>

      {/* Top HUD */}
      <div className="relative flex justify-between items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          className="flex items-center gap-3"
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED }} />
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      11,
            letterSpacing: "0.28em",
            color:         "rgba(232,64,12,0.85)",
            textTransform: "uppercase",
          }}>
            Arnav.DEV
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.4 }}
          className="hidden md:flex items-center gap-2"
        >
          <div style={{ width: 16, height: 1, background: "rgba(234,228,213,0.12)" }} />
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    400,
            fontSize:      9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.16)",
          }}>
            PORTFOLIO 2026
          </span>
          <div style={{ width: 16, height: 1, background: "rgba(234,228,213,0.12)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.15 }}
        >
          <StatusTicker visible={visible} />
        </motion.div>
      </div>

      {/* Main name block */}
      <motion.div
        className="flex flex-col items-start mt-auto relative z-10"
        style={{ opacity, y, scale }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: E, delay: 0.2 }}
          style={{
            height:          1,
            width:           "clamp(48px, 6vw, 96px)",
            background:      `linear-gradient(to right, ${RED}, transparent)`,
            marginBottom:    14,
            transformOrigin: "left",
          }}
        />

        <ScrambleWord text="ARNAV"    color={CREAM} style={nameStyle} delay={120} visible={visible} />
        <ScrambleWord text="UPADHYAY" color={RED}   style={nameStyle} delay={280} visible={visible} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: E, delay: 1.0 }}
          className="mt-4"
        >
          <span style={{
            fontFamily:    "'Barlow', sans-serif",
            fontWeight:    300,
            fontSize:      "clamp(0.65rem, 1.1vw, 0.82rem)",
            letterSpacing: "0.18em",
            color:         "rgba(234,228,213,0.22)",
            textTransform: "uppercase",
            fontStyle:     "italic",
          }}>
            Crafting interfaces that feel inevitable
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom HUD */}
      <motion.div
        className="relative flex justify-between items-end z-10 mt-16"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.3, ease: E, delay: 0.3 }}
          className="absolute -top-10 left-0 w-full h-px origin-left"
          style={{ background: "linear-gradient(to right, rgba(232,64,12,0.28), rgba(255,255,255,0.04), transparent)" }}
        />

        <div className="flex flex-col gap-1">
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    500,
            fontSize:      9,
            letterSpacing: "0.3em",
            color:         "rgba(234,228,213,0.18)",
            textTransform: "uppercase",
          }}>Role</span>
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.70)",
          }}>Frontend Engineer</span>
        </div>

        <div className="flex items-end gap-3">
          <div style={{
            width: 1, height: 32,
            background:   "rgba(234,228,213,0.08)",
            position:     "relative",
            overflow:     "hidden",
            borderRadius: 1,
            flexShrink:   0,
          }}>
            <motion.div
              style={{ width: "100%", background: RED, position: "absolute", top: 0, borderRadius: 1 }}
              animate={{ height: ["0%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.9 }}
            />
          </div>
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    500,
            fontSize:      9,
            letterSpacing: "0.28em",
            color:         "rgba(234,228,213,0.28)",
            textTransform: "uppercase",
            writingMode:   "vertical-rl",
            lineHeight:    1,
          }}>Scroll</span>
        </div>
      </motion.div>
    </section>
  );
}