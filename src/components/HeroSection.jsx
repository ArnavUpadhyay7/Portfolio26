import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import FireRain from "./FireRain";

const CREAM = "#EAE4D5";
const RED   = "#E8400C";
const E     = [0.16, 1, 0.3, 1];

/* ── Glitch chars pool ── */
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function scramble(target, progress) {
  return target
    .split("")
    .map((char, i) => {
      if (char === " ") return " ";
      if (i / target.length < progress) return char;
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    })
    .join("");
}

/* ── Scramble text hook — fires once, settles, stops ── */
function useScramble(text, trigger, duration = 900) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(null);
  useEffect(() => {
    if (!trigger) return;
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
  const [triggered, setTriggered] = useState(false);
  const display = useScramble(text, triggered);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setTriggered(true), delay);
      return () => clearTimeout(t);
    }
  }, [visible, delay]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.0, ease: E, delay: delay / 1000 }}
      style={{ color, ...style, fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </motion.div>
  );
}

/* ── Dot grid with cursor-following orange glow ── */
function DotGrid() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top  = e.clientY + "px";
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Full-viewport dot grid — no mask, uniform coverage */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: "radial-gradient(circle, rgba(232,64,12,0.22) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.55,
        }}
      />
      {/* Cursor glow — follows mouse, reveals brighter dots beneath */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed"
        style={{
          zIndex: 2,
          width: 320,
          height: 320,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,64,12,0.18) 0%, transparent 70%)",
          filter: "blur(2px)",
          transition: "left 0.08s linear, top 0.08s linear",
          willChange: "left, top",
        }}
      />
    </>
  );
}

/* ── Corner brackets ── */
function Corner({ position }) {
  const SIZE = 20;
  const paths = {
    "top-left":     `M ${SIZE} 0 L 0 0 L 0 ${SIZE}`,
    "top-right":    `M 0 0 L ${SIZE} 0 L ${SIZE} ${SIZE}`,
    "bottom-left":  `M 0 0 L 0 ${SIZE} L ${SIZE} ${SIZE}`,
    "bottom-right": `M 0 ${SIZE} L ${SIZE} ${SIZE} L ${SIZE} 0`,
  };
  const pos = {
    "top-left":     { top: 20, left: 20 },
    "top-right":    { top: 20, right: 20 },
    "bottom-left":  { bottom: 20, left: 20 },
    "bottom-right": { bottom: 20, right: 20 },
  };
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...pos[position], zIndex: 10 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} fill="none">
        <path d={paths[position]} stroke="rgba(232,64,12,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="square" />
      </svg>
    </motion.div>
  );
}

/* ── Status ticker ── */
function StatusTicker({ visible }) {
  const items = ["AVAILABLE FOR WORK", "BASED IN INDIA", "FRONTEND ENGINEER", "OPEN TO FREELANCE"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 2800);
    return () => clearInterval(t);
  }, [visible]);
  return (
    <div className="flex items-center gap-3 overflow-hidden" style={{ height: 16 }}>
      <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
      <div style={{
        width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0,
        animation: "pulse-dot 1.4s ease-in-out infinite",
      }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.28, ease: E }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: "0.28em",
            color: "rgba(234,228,213,0.45)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {items[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
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
  const scale   = useTransform(scrollYProgress, [0.10, 0.50], [1, 0.96]);

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
      className="relative overflow-hidden w-full min-h-screen flex flex-col justify-between px-10 lg:px-20 pt-12 pb-16 bg-[#0a0a0a]"
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;700;900&family=Barlow:wght@300;400&display=swap" />

      {/* Dot grid + cursor glow */}
      <DotGrid />

      {/* Vignette to darken edges so dots fade out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      <FireRain count={5} />

      {/* Ghost year */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute pointer-events-none select-none"
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(120px, 18vw, 240px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: "1px rgba(232,64,12,0.06)",
          right: "-1vw",
          bottom: "-3vh",
          zIndex: 4,
        }}
      >
        2025
      </motion.div>

      {/* Corner brackets */}
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />

      {/* ── Top HUD ── */}
      <div className="relative flex justify-between items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          className="flex items-center gap-3"
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.28em",
            color: "rgba(232,64,12,0.8)",
            textTransform: "uppercase",
          }}>
            Arnav.DEV
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.15 }}
        >
          <StatusTicker visible={visible} />
        </motion.div>
      </div>

      {/* ── Main name block ── */}
      <motion.div
        className="flex flex-col items-start mt-auto relative z-10"
        style={{ opacity, y, scale }}
      >
        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, ease: E, delay: 0.25 }}
          style={{
            height: 1,
            width: "clamp(50px, 6vw, 100px)",
            background: `linear-gradient(to right, ${RED}, transparent)`,
            marginBottom: 14,
            transformOrigin: "left",
          }}
        />

        <ScrambleWord
          text="ARNAV"
          color={CREAM}
          style={nameStyle}
          delay={150}
          visible={visible}
        />

        <ScrambleWord
          text="UPADHYAY"
          color={RED}
          style={nameStyle}
          delay={320}
          visible={visible}
        />

        {/* Sub-label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: E, delay: 1.1 }}
          className="mt-4"
        >
          <span style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.65rem, 1.1vw, 0.82rem)",
            letterSpacing: "0.18em",
            color: "rgba(234,228,213,0.28)",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}>
            Crafting interfaces that feel inevitable
          </span>
        </motion.div>
      </motion.div>

      {/* ── Bottom HUD ── */}
      <motion.div
        className="relative flex justify-between items-end z-10 mt-16"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, ease: E, delay: 0.35 }}
          className="absolute -top-10 left-0 w-full h-px origin-left"
          style={{ background: "linear-gradient(to right, rgba(232,64,12,0.35), rgba(255,255,255,0.05), transparent)" }}
        />

        {/* Left — Role */}
        <div className="flex flex-col gap-1">
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "rgba(234,228,213,0.2)",
            textTransform: "uppercase",
          }}>
            Role
          </span>
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(234,228,213,0.75)",
          }}>
            Frontend Engineer
          </span>
        </div>

        {/* Right — Scroll indicator, same baseline as Role block */}
        <div className="flex items-end gap-3">
          {/* Animated fill bar */}
          <div style={{
            width: 1,
            height: 36,
            background: "rgba(234,228,213,0.1)",
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            flexShrink: 0,
          }}>
            <motion.div
              style={{ width: "100%", background: RED, position: "absolute", top: 0, borderRadius: 1 }}
              animate={{ height: ["0%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
            />
          </div>
          {/* Vertical label */}
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 9,
            letterSpacing: "0.28em",
            color: "rgba(234,228,213,0.3)",
            textTransform: "uppercase",
            writingMode: "vertical-rl",
            lineHeight: 1,
          }}>
            Scroll
          </span>
        </div>
      </motion.div>
    </section>
  );
}