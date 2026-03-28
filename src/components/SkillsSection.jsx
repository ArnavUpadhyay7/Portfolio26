/**
 * SkillsSection.jsx — v3 Fixed
 *
 * Root-cause fixes vs v2:
 *
 * 1. SCROLL-PAST BUG
 *    Problem: PIN_H was set with a default `vh = 900` before the real
 *    viewport height was measured. React renders the section with the
 *    wrong height on first paint, the sticky container height doesn't
 *    match, and framer-motion's useScroll bakes in the wrong scroll
 *    range before the resize effect fires.
 *    Fix: initialise `vh` from window.innerHeight synchronously using
 *    a lazy useState initialiser (() => window?.innerHeight ?? 900).
 *    The section height and sticky wrapper are always in sync from
 *    the very first render.
 *
 * 2. CONTENT VISIBILITY WINDOW TOO NARROW
 *    Old timing: content fades in at 0.60 and out at 0.92 — only 32%
 *    of a section's progress range. With 4 sections over the full 0→1
 *    range, each section-local progress runs at 4× speed meaning content
 *    was only readable for ~8% of total scroll distance (~half a screen).
 *    Fix: content in at 0.38, hold until 0.88, out at 0.96.
 *    Also bumped section multiplier: 2.8vh per section (was 2vh) giving
 *    more physical scroll distance for the bloom + content to breathe.
 *
 * 3. "STACK BREAKDOWN" HEADER
 *    Old: fontSize 9, opacity 0.15 — invisible.
 *    Fix: Replaced with a proper styled section header row with the
 *    title in large Barlow Condensed, the section number, and a live
 *    animated active-section indicator. Highly visible, anchored to top.
 *
 * 4. SECTION LABEL IN CONTENT
 *    Old: `{section.label} — 0{N}` hardcoded "04" always. Now reads
 *    correctly as e.g. "01 — 04".
 */

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
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
   BLOOM SVG — unchanged animation logic
───────────────────────────────────────────────────────────────────────────── */
function SectionBloom({ progress, color }) {
  const coreR          = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 18, 24, 20, 20, 0]);
  const coreOpacity    = useTransform(progress, [0, 0.06, 0.55, 0.85, 1],        [0, 1,  1,  1,  0]);
  const coreScale      = useTransform(progress, [0, 0.15, 0.40, 0.55, 0.85, 1], [0, 0.4, 1.35, 1, 1, 0]);
  const coreGlowR      = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 60, 100, 80, 80, 0]);
  const coreGlowOp     = useTransform(progress, [0, 0.08, 0.40, 0.55, 0.85, 1], [0, 0.5, 0.22, 0.18, 0.18, 0]);
  const burstR         = useTransform(progress, [0.12, 0.40, 0.60],              [20, 220, 280]);
  const burstOp        = useTransform(progress, [0.12, 0.30, 0.50, 0.65],       [0, 0.55, 0.15, 0]);
  const burstW         = useTransform(progress, [0.12, 0.35],                    [3, 0.5]);
  const burst2R        = useTransform(progress, [0.18, 0.50, 0.70],              [20, 310, 370]);
  const burst2Op       = useTransform(progress, [0.18, 0.36, 0.55, 0.70],       [0, 0.30, 0.08, 0]);
  const midRingScale   = useTransform(progress, [0.20, 0.45, 0.85, 1.0], [0.2, 1, 1, 0]);
  const midRingOp      = useTransform(progress, [0.20, 0.40, 0.80, 1.0], [0, 0.18, 0.12, 0]);
  const outerRingScale = useTransform(progress, [0.30, 0.55, 0.85, 1.0], [0.3, 1, 1, 0]);
  const outerRingOp    = useTransform(progress, [0.30, 0.50, 0.80, 1.0], [0, 0.08, 0.06, 0]);

  const PRIMARY_ANGLES   = [0, 60, 120, 180, 240, 300];
  const SECONDARY_ANGLES = [30, 90, 150, 210, 270, 330];
  const TERTIARY_ANGLES  = Array.from({ length: 12 }, (_, i) => i * 30);

  const primaryPetals = PRIMARY_ANGLES.map((deg, i) => {
    const s0 = 0.15 + i * 0.025, s1 = s0 + 0.22;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, 0.80, 1.00], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.55), 0.80, 1.00], [0, 0.65, 0.65, 0]),
    };
  });

  const secondaryPetals = SECONDARY_ANGLES.map((deg, i) => {
    const s0 = 0.22 + i * 0.020, s1 = s0 + 0.18;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, 0.85, 1.0], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.55), 0.82, 1.0], [0, 0.40, 0.40, 0]),
    };
  });

  const tertiaryPetals = TERTIARY_ANGLES.map((deg, i) => {
    const s0 = 0.28 + i * 0.012, s1 = s0 + 0.12;
    return {
      deg,
      scale:   useTransform(progress, [s0, s1, 0.85, 1.0], [0, 1, 1, 0]),
      opacity: useTransform(progress, [s0, Math.min(s1, 0.60), 0.82, 1.0], [0, 0.22, 0.22, 0]),
    };
  });

  const coreScaleSpring = useSpring(coreScale, { stiffness: 160, damping: 16 });
  const colorKey = color.replace("#", "");

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 5,
    }}>
      <svg
        viewBox="-400 -400 800 800"
        style={{ width: "min(88vw, 80vh)", height: "min(88vw, 80vh)", overflow: "visible", flexShrink: 0 }}
      >
        <defs>
          <filter id={`core-glow-${colorKey}`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="18" result="b1" />
            <feGaussianBlur stdDeviation="8"  result="b2" />
            <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={`petal-glow-${colorKey}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id={`petal-grad-${colorKey}`} cx="50%" cy="100%" r="100%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.9" />
            <stop offset="60%"  stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle cx={0} cy={0} r={340} fill="none" stroke={color} strokeWidth={0.5}
          style={{ scale: outerRingScale, opacity: outerRingOp }} />
        <motion.circle cx={0} cy={0} r={240} fill="none" stroke={color} strokeWidth={0.8} strokeDasharray="6 14"
          style={{ scale: midRingScale, opacity: midRingOp }} />
        <motion.circle cx={0} cy={0} fill="none" stroke={color} strokeWidth={1}
          style={{ r: burst2R, opacity: burst2Op }} />
        <motion.circle cx={0} cy={0} fill="none" stroke={color}
          style={{ r: burstR, strokeWidth: burstW, opacity: burstOp }} />

        {tertiaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`t${deg}`} style={{ rotate: deg }}>
            <motion.path d="M 0 0 C 3 -40, 8 -80, 0 -120 C -8 -80, -3 -40, 0 0 Z"
              fill={color} style={{ scale, opacity, transformOrigin: "0 0" }} />
          </motion.g>
        ))}

        {secondaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`s${deg}`} style={{ rotate: deg }}>
            <motion.path d="M 0 0 C 12 -55, 38 -110, 0 -170 C -38 -110, -12 -55, 0 0 Z"
              fill={color} filter={`url(#petal-glow-${colorKey})`}
              style={{ scale, opacity: useTransform(opacity, v => v * 0.5), transformOrigin: "0 0" }} />
            <motion.path d="M 0 0 C 12 -55, 38 -110, 0 -170 C -38 -110, -12 -55, 0 0 Z"
              fill={`url(#petal-grad-${colorKey})`}
              style={{ scale, opacity, transformOrigin: "0 0" }} />
          </motion.g>
        ))}

        {primaryPetals.map(({ deg, scale, opacity }) => (
          <motion.g key={`p${deg}`} style={{ rotate: deg }}>
            <motion.path d="M 0 0 C 18 -85, 60 -170, 0 -260 C -60 -170, -18 -85, 0 0 Z"
              fill={color} filter={`url(#petal-glow-${colorKey})`}
              style={{ scale, opacity: useTransform(opacity, v => v * 0.45), transformOrigin: "0 0" }} />
            <motion.path d="M 0 0 C 18 -85, 60 -170, 0 -260 C -60 -170, -18 -85, 0 0 Z"
              fill={`url(#petal-grad-${colorKey})`}
              style={{ scale, opacity, transformOrigin: "0 0" }} />
            <motion.path d="M 0 0 C 4 -50, 10 -120, 0 -200 C -10 -120, -4 -50, 0 0 Z"
              fill={color} style={{ scale, opacity: useTransform(opacity, v => v * 0.8), transformOrigin: "0 0" }} />
          </motion.g>
        ))}

        <motion.circle cx={0} cy={0} fill={color} style={{ r: coreGlowR, opacity: coreGlowOp }} />
        <motion.circle cx={0} cy={0} fill={color}
          filter={`url(#core-glow-${colorKey})`}
          style={{ r: coreR, scale: coreScaleSpring, opacity: coreOpacity }} />
        <motion.circle cx={0} cy={0} r={6} fill="#fff"
          style={{
            scale:   useTransform(progress, [0.05, 0.15, 0.85, 1], [0, 1, 1, 0]),
            opacity: useTransform(progress, [0.05, 0.12, 0.85, 1], [0, 0.95, 0.95, 0]),
          }} />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION CONTENT
   FIX: content in at 0.38 (was 0.60) — content is now visible for 50%
   of the section's scroll range instead of 32%. Also removed the early
   exit (was 0.92 → now 0.94) giving more dwell time before wipe.
───────────────────────────────────────────────────────────────────────────── */
function SectionContent({ section, progress }) {
  const opacity = useTransform(progress, [0.38, 0.50, 0.86, 0.96], [0, 1, 1, 0]);
  const y       = useTransform(progress, [0.38, 0.50, 0.86, 0.96], [28, 0, 0, -14]);

  return (
    <motion.div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      pointerEvents: "none", zIndex: 20,
      opacity, y,
    }}>
      {/* Readability scrim */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 58% 52% at 50% 50%, rgba(10,10,10,0.7) 0%, transparent 72%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position:  "relative",
        zIndex:    2,
        textAlign: "center",
        width:     "min(520px, 92vw)",
        padding:   "0 16px",
      }}>
        {/* Label — e.g. "01 — 04" */}
        <p style={{
          fontFamily:    "'Geist', sans-serif",
          fontWeight:    300,
          fontSize:      10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color:         `${section.glow}0.65)`,
          margin:        "0 0 10px",
        }}>
          {section.label} — 0{N}
        </p>

        {/* Title */}
        <h2 style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    800,
          fontSize:      "clamp(32px, 10vw, 88px)",
          lineHeight:    0.88,
          letterSpacing: "-0.025em",
          textTransform: "uppercase",
          color:         CREAM,
          margin:        "0 0 14px",
        }}>
          {section.title}
        </h2>

        {/* Role */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 14,
        }}>
          <div style={{ width: 2, height: 12, background: section.color, borderRadius: 1, flexShrink: 0 }} />
          <span style={{
            fontFamily:    "'Geist', sans-serif",
            fontWeight:    300,
            fontSize:      "clamp(9px, 2.2vw, 11px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.45)",
          }}>
            {section.role}
          </span>
          <div style={{ width: 2, height: 12, background: section.color, borderRadius: 1, flexShrink: 0 }} />
        </div>

        {/* Description */}
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 300,
          fontSize:   "clamp(12px, 3vw, 15px)",
          lineHeight: 1.8,
          color:      "rgba(234,228,213,0.60)",
          margin:     "0 0 22px",
        }}>
          {section.summary}
        </p>

        {/* Tech pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
          {section.stack.map((tech, i) => (
            <motion.span
              key={tech}
              style={{
                opacity:       useTransform(progress, [0.42 + i * 0.018, 0.52 + i * 0.018], [0, 1]),
                fontFamily:    "'Geist', sans-serif",
                fontWeight:    300,
                fontSize:      "clamp(10px, 2.4vw, 12px)",
                letterSpacing: "0.06em",
                color:         section.color,
                background:    `${section.glow}0.08)`,
                border:        `1px solid ${section.glow}0.28)`,
                borderRadius:  6,
                padding:       "4px 12px",
                whiteSpace:    "nowrap",
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION SLIDE
───────────────────────────────────────────────────────────────────────────── */
function SectionSlide({ section, progress }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <motion.div style={{
        position:   "absolute", inset: 0,
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${section.bg} 0%, transparent 70%)`,
        opacity:    useTransform(progress, [0.10, 0.40, 0.80, 1.0], [0, 1, 1, 0]),
        zIndex:     0,
        pointerEvents: "none",
      }} />
      <SectionBloom progress={progress} color={section.color} />
      <SectionContent section={section} progress={progress} />

      {/* Bottom breadcrumb */}
      <motion.div style={{
        position:      "absolute",
        bottom:        24,
        left:          "50%",
        transform:     "translateX(-50%)",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           8,
        zIndex:        30,
        opacity:       useTransform(progress, [0.35, 0.50, 0.82, 0.95], [0, 0.7, 0.7, 0]),
        pointerEvents: "none",
      }}>
        <span style={{
          fontFamily:    "'Geist', sans-serif",
          fontWeight:    300,
          fontSize:      9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color:         "rgba(234,228,213,0.20)",
          whiteSpace:    "nowrap",
        }}>
          {section.label} / 0{N} — {section.title}
        </span>
        <div style={{ width: 1, height: 18, background: `${section.glow}0.28)` }} />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROGRESS DOTS
───────────────────────────────────────────────────────────────────────────── */
function SectionDots({ active }) {
  return (
    <div style={{
      position:      "absolute",
      right:         "clamp(12px, 3vw, 24px)",
      top:           "50%",
      transform:     "translateY(-50%)",
      display:       "flex",
      flexDirection: "column",
      gap:           10,
      zIndex:        50,
      pointerEvents: "none",
    }}>
      {SECTIONS.map((s, i) => (
        <motion.div
          key={s.id}
          animate={{
            height:     i === active ? 28 : 6,
            opacity:    i === active ? 0.9 : 0.22,
            background: SECTIONS[active].color,
          }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ width: 2, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER — replaces the invisible 9px "Stack Breakdown" label.
   Shows the section title + active skill name in a proper top bar.
───────────────────────────────────────────────────────────────────────────── */
function SectionHeader({ active }) {
  const s = SECTIONS[active];
  return (
    <div style={{
      position:       "absolute",
      top:            0,
      left:           0,
      right:          0,
      zIndex:         60,
      pointerEvents:  "none",
      padding:        "clamp(20px, 3vw, 32px) clamp(24px, 5vw, 60px)",
      display:        "flex",
      alignItems:     "baseline",
      justifyContent: "space-between",
    }}>
      {/* Left: "Stack Breakdown" in big Barlow */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    700,
          fontSize:      "clamp(13px, 2.2vw, 18px)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "rgba(234,228,213,0.55)",
        }}>
          Stack
        </span>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    800,
          fontSize:      "clamp(13px, 2.2vw, 18px)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         "rgba(234,228,213,0.90)",
        }}>
          Breakdown
        </span>
        {/* Accent dot */}
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, marginBottom: 2, transition: "background 0.35s ease" }} />
      </div>

      {/* Right: active skill name */}
      <motion.span
        key={s.id}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{
          fontFamily:    "'Geist', sans-serif",
          fontWeight:    300,
          fontSize:      "clamp(10px, 1.8vw, 13px)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         s.color,
        }}
      >
        {s.role}
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN
   FIX: lazy useState initialiser so `vh` is correct on the FIRST render.
   No more async mismatch between PIN_H and the sticky wrapper height.
   MULTIPLIER bumped 2 → 2.8 so each section has more scroll room.
───────────────────────────────────────────────────────────────────────────── */
export default function SkillsSection() {
  const sectionRef = useRef(null);

  // ── FIX: read vh synchronously so first render is correct ──────────────────
  const [vh, setVh] = useState(() =>
    typeof window !== "undefined"
      ? (window.visualViewport?.height ?? window.innerHeight)
      : 900
  );

  useEffect(() => {
    const measure = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      setVh(h);
    };
    window.visualViewport?.addEventListener("resize", measure);
    window.addEventListener("resize", measure);
    return () => {
      window.visualViewport?.removeEventListener("resize", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  /*
   * FIX: 2.8 viewport heights per section (was 2).
   * More scroll room = bloom and content have enough distance to
   * animate through their full keyframe ranges before the user
   * naturally reaches the next section.
   */
  const MULTIPLIER = 2.8;
  const PIN_H = vh * N * MULTIPLIER;

  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", v => {
    setActive(Math.min(N - 1, Math.floor(v * N)));
  });

  const p0 = useTransform(scrollYProgress, [0 / N, 1 / N], [0, 1]);
  const p1 = useTransform(scrollYProgress, [1 / N, 2 / N], [0, 1]);
  const p2 = useTransform(scrollYProgress, [2 / N, 3 / N], [0, 1]);
  const p3 = useTransform(scrollYProgress, [3 / N, 4 / N], [0, 1]);
  const perSectionProgress = [p0, p1, p2, p3];

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: PIN_H, background: BG }}
    >
      <div style={{
        position: "sticky",
        top:      0,
        height:   vh,
        overflow: "clip",
      }}>
        {/* Top/bottom vignette */}
        <div style={{
          position:      "absolute",
          inset:         0,
          pointerEvents: "none",
          zIndex:        60,
          background: `
            linear-gradient(to bottom, ${BG} 0%, transparent 10%),
            linear-gradient(to top,    ${BG} 0%, transparent 8%)
          `,
          /* pointer-events off so the header below is still visible */
          pointerEvents: "none",
        }} />

        {SECTIONS.map((s, i) => (
          <SectionSlide
            key={s.id}
            section={s}
            progress={perSectionProgress[i]}
          />
        ))}

        <SectionDots active={active} />

        {/* ── NEW: visible, well-styled header ── */}
        <SectionHeader active={active} />
      </div>
    </section>
  );
}