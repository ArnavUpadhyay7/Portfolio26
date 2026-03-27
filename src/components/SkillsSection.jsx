/**
 * SkillsSection.jsx — Full-Screen Per-Section Bloom
 *
 * Each section (Frontend, Backend, Realtime, Tools) has its own
 * full-screen bloom explosion. On scroll into a section:
 *   1. Glowing core bursts from center
 *   2. 12 petals explode outward (300px–520px radius)
 *   3. Content fades in AFTER petals settle
 *   4. On exit: everything collapses + fades
 *
 * Scroll structure:
 *   PIN_H = vh * (N * 2)   →  2vh per section (1 for bloom, 1 for reading)
 *   Each section occupies scrollYProgress range [i/N, (i+1)/N]
 *   Within that range: 0→0.35 = bloom open, 0.35→0.65 = hold, 0.65→1 = close
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
} from "framer-motion";

/* ── tokens ── */
const BG    = "#0a0a0a";
const CREAM = "#EAE4D5";
const EASE  = [0.16, 1, 0.3, 1];

const SECTIONS = [
  {
    id:      "frontend",
    label:   "01",
    title:   "Frontend",
    role:    "Interface Engineering",
    summary: "Pixel-precise interfaces with cinematic motion. Design systems, component architecture, micro-interaction obsession.",
    stack:   ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Lenis"],
    color:   "#E8400C",
    glow:    "rgba(232,64,12,",
    bg:      "rgba(232,64,12,0.04)",
  },
  {
    id:      "backend",
    label:   "02",
    title:   "Backend",
    role:    "Systems & APIs",
    summary: "Scalable server-side architecture. Clean REST APIs, efficient data pipelines, containerised deployments.",
    stack:   ["Node.js", "Express", "MongoDB", "PostgreSQL", "Docker"],
    color:   "#6366F1",
    glow:    "rgba(99,102,241,",
    bg:      "rgba(99,102,241,0.04)",
  },
  {
    id:      "realtime",
    label:   "03",
    title:   "Realtime",
    role:    "Live Experiences",
    summary: "Sub-50ms synchronised experiences. Spatial audio, presence systems, and collaborative environments at scale.",
    stack:   ["Socket.io", "WebRTC", "LiveKit", "Redis Pub/Sub", "WebSockets"],
    color:   "#10B981",
    glow:    "rgba(16,185,129,",
    bg:      "rgba(16,185,129,0.04)",
  },
  {
    id:      "tools",
    label:   "04",
    title:   "Tooling",
    role:    "Workflow & DX",
    summary: "Developer experience as a first-class concern. Fast builds, clean CI/CD, zero-friction handoffs.",
    stack:   ["Git / GitHub", "Linux", "Postman", "Figma", "Vite", "GitHub Actions"],
    color:   "#94A3B8",
    glow:    "rgba(148,163,184,",
    bg:      "rgba(148,163,184,0.04)",
  },
];

const N = SECTIONS.length;

/* ─────────────────────────────────────────────────────────────────────────────
   FULL-SCREEN BLOOM SVG
   progress: 0 (closed) → 1 (fully open)
   All sizes in SVG units where 1 unit ≈ 1px at viewBox="−400 −400 800 800"
───────────────────────────────────────────────────────────────────────────── */
function SectionBloom({ progress, color, glow }) {

  /* ── Core pulse ── */
  // 0→0.15: tiny dot appears with strong blur
  // 0.15→0.40: burst to 1.3x
  // 0.40→0.55: settle to 1x
  // 0.55→0.85: hold
  // 0.85→1.0: collapse
  const coreR       = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 18,  24,  20,  20,  0]);
  const coreOpacity = useTransform(progress, [0, 0.06, 0.55, 0.85, 1],        [0, 1,   1,   1,   0]);
  const coreScale   = useTransform(progress, [0, 0.15, 0.40, 0.55, 0.85, 1], [0, 0.4, 1.35, 1,  1,   0]);
  const coreBlur    = useTransform(progress, [0, 0.10, 0.40, 0.60],           [40, 16, 6,    4]);
  const coreGlowR   = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 60, 100, 80, 80, 0]);
  const coreGlowOp  = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 0.5, 0.22, 0.18, 0.18, 0]);

  /* ── Burst ring — expands on explosion moment ── */
  const burstR   = useTransform(progress, [0.12, 0.40, 0.60],    [20,  220, 280]);
  const burstOp  = useTransform(progress, [0.12, 0.30, 0.50, 0.65], [0, 0.55, 0.15, 0]);
  const burstW   = useTransform(progress, [0.12, 0.35],           [3,  0.5]);

  /* ── Second burst ring ── */
  const burst2R  = useTransform(progress, [0.18, 0.50, 0.70],    [20, 310, 370]);
  const burst2Op = useTransform(progress, [0.18, 0.36, 0.55, 0.70], [0, 0.30, 0.08, 0]);

  /* ── Mid orbit ring — stays visible ── */
  const midRingScale = useTransform(progress, [0.20, 0.45, 0.85, 1.0], [0.2, 1, 1, 0]);
  const midRingOp    = useTransform(progress, [0.20, 0.40, 0.80, 1.0], [0, 0.18, 0.12, 0]);

  /* ── Outer ring ── */
  const outerRingScale = useTransform(progress, [0.30, 0.55, 0.85, 1.0], [0.3, 1, 1, 0]);
  const outerRingOp    = useTransform(progress, [0.30, 0.50, 0.80, 1.0], [0, 0.08, 0.06, 0]);

  /* ── Primary petals (6) — large teardrops, 260px long ── */
  // Each petal opens staggered, 0.025 scroll apart
  const PRIMARY_ANGLES = [0, 60, 120, 180, 240, 300];
  const primaryPetals = PRIMARY_ANGLES.map((deg, i) => {
    const s0 = 0.15 + i * 0.025;
    const s1 = s0 + 0.22;
    const e0 = 0.80;
    const e1 = 1.00;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, e0, e1], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.55), e0, e1], [0, 0.65, 0.65, 0]),
    };
  });

  /* ── Secondary petals (6) — 30° offset, shorter (170px) ── */
  const SECONDARY_ANGLES = [30, 90, 150, 210, 270, 330];
  const secondaryPetals = SECONDARY_ANGLES.map((deg, i) => {
    const s0 = 0.22 + i * 0.020;
    const s1 = s0 + 0.18;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, 0.85, 1.0], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.55), 0.82, 1.0], [0, 0.40, 0.40, 0]),
    };
  });

  /* ── Tertiary petals (12) — thin spike-like, 120px ── */
  const TERTIARY_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);
  const tertiaryPetals = TERTIARY_ANGLES.map((deg, i) => {
    const s0 = 0.28 + i * 0.012;
    const s1 = s0 + 0.12;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, 0.85, 1.0], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.60), 0.82, 1.0], [0, 0.22, 0.22, 0]),
    };
  });

  /* Spring the coreScale for bounce feel */
  const coreScaleSpring = useSpring(coreScale, { stiffness: 160, damping: 16 });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <svg
        viewBox="-400 -400 800 800"
        style={{ width: "min(90vw, 90vh)", height: "min(90vw, 90vh)", overflow: "visible" }}
      >
        <defs>
          <filter id={`core-glow-${color.replace("#","")}`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="18" result="b1" />
            <feGaussianBlur stdDeviation="8"  result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`petal-glow-${color.replace("#","")}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`petal-grad-${color.replace("#","")}`} cx="50%" cy="100%" r="100%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.9" />
            <stop offset="60%"  stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Outer ring ── */}
        <motion.circle cx={0} cy={0} r={340}
          fill="none" stroke={color} strokeWidth={0.5}
          style={{ scale: outerRingScale, opacity: outerRingOp }}
        />

        {/* ── Mid dashed ring ── */}
        <motion.circle cx={0} cy={0} r={240}
          fill="none" stroke={color} strokeWidth={0.8} strokeDasharray="6 14"
          style={{ scale: midRingScale, opacity: midRingOp }}
        />

        {/* ── Burst ring 2 ── */}
        <motion.circle cx={0} cy={0}
          fill="none" stroke={color} strokeWidth={1}
          style={{ r: burst2R, opacity: burst2Op }}
        />

        {/* ── Burst ring 1 ── */}
        <motion.circle cx={0} cy={0}
          fill="none" stroke={color}
          style={{ r: burstR, strokeWidth: burstW, opacity: burstOp }}
        />

        {/* ── Tertiary petals — thin spikes ── */}
        {tertiaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`t${deg}`} style={{ rotate: deg }}>
            <motion.path
              d="M 0 0 C 3 -40, 8 -80, 0 -120 C -8 -80, -3 -40, 0 0 Z"
              fill={color}
              style={{ scale, opacity, transformOrigin: "0 0" }}
            />
          </motion.g>
        ))}

        {/* ── Secondary petals — medium ── */}
        {secondaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`s${deg}`} style={{ rotate: deg }}>
            {/* Glow layer */}
            <motion.path
              d="M 0 0 C 12 -55, 38 -110, 0 -170 C -38 -110, -12 -55, 0 0 Z"
              fill={color}
              filter={`url(#petal-glow-${color.replace("#","")})`}
              style={{ scale, opacity: useTransform(opacity, v => v * 0.5), transformOrigin: "0 0" }}
            />
            <motion.path
              d="M 0 0 C 12 -55, 38 -110, 0 -170 C -38 -110, -12 -55, 0 0 Z"
              fill={`url(#petal-grad-${color.replace("#","")})`}
              style={{ scale, opacity, transformOrigin: "0 0" }}
            />
          </motion.g>
        ))}

        {/* ── Primary petals — large ── */}
        {primaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`p${deg}`} style={{ rotate: deg }}>
            {/* Outer glow */}
            <motion.path
              d="M 0 0 C 18 -85, 60 -170, 0 -260 C -60 -170, -18 -85, 0 0 Z"
              fill={color}
              filter={`url(#petal-glow-${color.replace("#","")})`}
              style={{ scale, opacity: useTransform(opacity, v => v * 0.45), transformOrigin: "0 0" }}
            />
            {/* Solid fill */}
            <motion.path
              d="M 0 0 C 18 -85, 60 -170, 0 -260 C -60 -170, -18 -85, 0 0 Z"
              fill={`url(#petal-grad-${color.replace("#","")})`}
              style={{ scale, opacity, transformOrigin: "0 0" }}
            />
            {/* Inner bright spine */}
            <motion.path
              d="M 0 0 C 4 -50, 10 -120, 0 -200 C -10 -120, -4 -50, 0 0 Z"
              fill={color}
              style={{
                scale,
                opacity: useTransform(opacity, v => v * 0.8),
                transformOrigin: "0 0",
              }}
            />
          </motion.g>
        ))}

        {/* ── Core glow halo ── */}
        <motion.circle cx={0} cy={0}
          fill={color}
          style={{ r: coreGlowR, opacity: coreGlowOp }}
        />

        {/* ── Core circle — the main dot ── */}
        <motion.circle cx={0} cy={0}
          fill={color}
          filter={`url(#core-glow-${color.replace("#","")})`}
          style={{ r: coreR, scale: coreScaleSpring, opacity: coreOpacity }}
        />

        {/* ── White hot center ── */}
        <motion.circle cx={0} cy={0} r={6}
          fill="#fff"
          style={{
            scale:   useTransform(progress, [0.05, 0.15, 0.85, 1], [0, 1, 1, 0]),
            opacity: useTransform(progress, [0.05, 0.12, 0.85, 1], [0, 0.95, 0.95, 0]),
          }}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION SLIDE
   progress: 0→1 for this section's window
───────────────────────────────────────────────────────────────────────────── */
function SectionSlide({ section, progress }) {
  // Content appears after bloom starts settling (~40%)
  const contentOpacity = useTransform(progress, [0.38, 0.55, 0.80, 0.95], [0, 1, 1, 0]);
  const contentY       = useTransform(progress, [0.38, 0.55], [24, 0]);

  // Left text
  const leftX = useTransform(progress, [0.40, 0.55], [-28, 0]);

  // Right pills
  const rightX = useTransform(progress, [0.42, 0.56], [28, 0]);

  return (
    <div className="absolute inset-0" style={{ zIndex: 8 }}>

      {/* Full-screen background color pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:  `radial-gradient(ellipse 60% 60% at 50% 50%, ${section.bg} 0%, transparent 70%)`,
          opacity:     useTransform(progress, [0.10, 0.40, 0.80, 1.0], [0, 1, 1, 0]),
          zIndex:      0,
        }}
      />

      {/* BLOOM */}
      <SectionBloom progress={progress} color={section.color} glow={section.glow} />

      {/* ── CONTENT ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 15, opacity: contentOpacity }}
      >

        {/* Left — title + role + summary */}
        <motion.div
          style={{
            position:  "absolute",
            left:      "5vw",
            top:       "50%",
            transform: "translateY(-50%)",
            maxWidth:  "clamp(200px, 22vw, 300px)",
            x:         leftX,
          }}
        >
          <p style={{
            fontFamily:    "'Geist', sans-serif",
            fontWeight:    300,
            fontSize:      10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color:         `${section.glow}0.6)`,
            marginBottom:  10,
            margin:        "0 0 10px",
          }}>{section.label} — 0{N}</p>

          <h2 style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    800,
            fontSize:      "clamp(52px, 6vw, 90px)",
            lineHeight:    0.86,
            letterSpacing: "-0.025em",
            textTransform: "uppercase",
            color:         CREAM,
            margin:        "0 0 18px",
          }}>{section.title}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 2, height: 14, background: section.color, borderRadius: 1, flexShrink: 0 }} />
            <span style={{
              fontFamily:    "'Geist', sans-serif",
              fontWeight:    300,
              fontSize:      10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "rgba(234,228,213,0.45)",
            }}>{section.role}</span>
          </div>

          <p style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 300,
            fontSize:   13.5,
            lineHeight: 1.9,
            color:      "rgba(234,228,213,0.58)",
            margin:     0,
          }}>{section.summary}</p>
        </motion.div>

        {/* Right — tech stack */}
        <motion.div
          style={{
            position:  "absolute",
            right:     "5vw",
            top:       "50%",
            transform: "translateY(-50%)",
            display:   "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap:        10,
            x:          rightX,
          }}
        >
          {section.stack.map((tech, i) => (
            <motion.span
              key={tech}
              style={{
                opacity:    useTransform(progress, [0.42 + i * 0.03, 0.56 + i * 0.03], [0, 1]),
                x:          useTransform(progress, [0.42 + i * 0.03, 0.56 + i * 0.03], [16, 0]),
                fontFamily:    "'Geist', sans-serif",
                fontWeight:    300,
                fontSize:      12,
                letterSpacing: "0.08em",
                color:         section.color,
                background:    `${section.glow}0.07)`,
                border:        `1px solid ${section.glow}0.25)`,
                borderRadius:  6,
                padding:       "5px 14px",
                whiteSpace:    "nowrap",
              }}
            >{tech}</motion.span>
          ))}
        </motion.div>

        {/* Bottom center — section indicator */}
        <div
          style={{
            position:       "absolute",
            bottom:         32,
            left:           "50%",
            transform:      "translateX(-50%)",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            8,
            zIndex:         20,
          }}
        >
          <span style={{
            fontFamily:    "'Geist', sans-serif",
            fontWeight:    300,
            fontSize:      9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.18)",
          }}>{section.label} / 0{N} — {section.title}</span>
          <div style={{ width: 1, height: 20, background: `${section.glow}0.25)` }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE CARD
───────────────────────────────────────────────────────────────────────────── */
function MobileCard({ s, i }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
      style={{
        padding:      "28px 22px",
        borderRadius: 12,
        background:   "rgba(15,11,9,0.96)",
        border:       "1px solid rgba(255,255,255,0.07)",
        boxShadow:    `inset 3px 0 0 ${s.color}`,
      }}
    >
      <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: `${s.glow}0.55)`, margin: "0 0 6px" }}>{s.label} — 0{N}</p>
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", color: CREAM, margin: "0 0 14px" }}>{s.title}</h3>
      <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, color: "rgba(234,228,213,0.62)", margin: "0 0 16px" }}>{s.summary}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {s.stack.map(tech => (
          <span key={tech} style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 10, color: s.color, background: `${s.glow}0.07)`, border: `1px solid ${s.glow}0.2)`, borderRadius: 4, padding: "3px 9px" }}>{tech}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROGRESS DOTS
───────────────────────────────────────────────────────────────────────────── */
function SectionDots({ active }) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3" style={{ zIndex: 40 }}>
      {SECTIONS.map((s, i) => (
        <motion.div
          key={s.id}
          animate={{ height: i === active ? 28 : 6, opacity: i === active ? 0.9 : 0.2, background: SECTIONS[active].color }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ width: 2, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────────── */
export default function SkillsSection() {
  const sectionRef  = useRef(null);
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth  : 1440);
  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 900);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fn = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const isMobile = vw < 768;

  /*
    2 viewports per section:
    Total pinned height = N * 2 * vh
    Section i occupies progress [i/N, (i+1)/N]
    Within that band, we use a local 0→1 progress
  */
  const PIN_H = vh * N * 2;

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  });

  /* Drive active dot */
  useMotionValueEvent(scrollYProgress, "change", v => {
    setActive(Math.min(N - 1, Math.floor(v * N)));
  });

  /*
    Per-section progress values — each section gets a useTransform
    that maps the global [i/N, (i+1)/N] band → [0, 1]
    We compute all 4 upfront (no hooks in loops).
  */
  const p0 = useTransform(scrollYProgress, [0/N, 1/N], [0, 1]);
  const p1 = useTransform(scrollYProgress, [1/N, 2/N], [0, 1]);
  const p2 = useTransform(scrollYProgress, [2/N, 3/N], [0, 1]);
  const p3 = useTransform(scrollYProgress, [3/N, 4/N], [0, 1]);
  const perSectionProgress = [p0, p1, p2, p3];

  if (isMobile) {
    return (
      <section style={{ background: BG, padding: "80px 20px" }}>
        <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(232,64,12,0.55)", marginBottom: 10 }}>Stack Breakdown</p>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 10vw, 56px)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: CREAM, marginBottom: 48 }}>What I Work With</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SECTIONS.map((s, i) => <MobileCard key={s.id} s={s} i={i} />)}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: PIN_H, background: BG }}
    >
      <div style={{
        position:   "sticky",
        top:        0,
        height:     "100vh",
        overflow:   "hidden",
      }}>

        {/* Top/bottom vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex:     50,
          background: `
            linear-gradient(to bottom, ${BG} 0%, transparent 12%),
            linear-gradient(to top,    ${BG} 0%, transparent 10%)
          `,
        }} />

        {/* Each section slide — only the active one is really visible */}
        {SECTIONS.map((s, i) => (
          <SectionSlide
            key={s.id}
            section={s}
            progress={perSectionProgress[i]}
          />
        ))}

        {/* Progress dots */}
        <SectionDots active={active} />

        {/* Top label */}
        <div className="absolute pointer-events-none" style={{ top: 36, left: "5vw", zIndex: 60 }}>
          <p style={{
            fontFamily:    "'Geist', sans-serif",
            fontWeight:    300,
            fontSize:      9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.15)",
          }}>Stack Breakdown</p>
        </div>
      </div>
    </section>
  );
}