/**
 * SkillsSection.jsx — full revamp
 *
 * Design: editorial, high-contrast, minimal grid layout
 * - Section header: large editorial type
 * - Cards: borderless rows on desktop, stacked on mobile
 * - Each card: number / category / role / description / tags
 * - Active card highlighted with orange left border + cream text
 * - Horizontal scroll on desktop, vertical stack on mobile
 * - Last card always fully reachable
 * - No orange decorative lines between sections
 */

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useInView,
} from "framer-motion";

/* ── tokens ── */
const BG   = "#0a0a0a";
const CR   = "#EAE4D5";
const OR   = "#E8400C";
const o    = (a) => `rgba(232,64,12,${a})`;
const c    = (a) => `rgba(234,228,213,${a})`;

const EASE = [0.16, 1, 0.3, 1];

/* ── skills data ── */
const SKILLS = [
  {
    num: "01",
    category: "Frontend",
    role: "Interface Engineering",
    summary: "Pixel-precise, performant interfaces with cinematic motion. Component architecture, design systems, and micro-interaction obsession.",
    stack: ["React", "Next.js", "TypeScript", "Framer Motion", "Tailwind"],
    stat: { value: "3+", label: "Years production React" },
  },
  {
    num: "02",
    category: "Creative",
    role: "Motion & Visual Design",
    summary: "Immersive experiences at the intersection of engineering and art. GPU-accelerated visuals, narrative-driven interactions, WebGL experiments.",
    stack: ["Three.js", "GSAP", "WebGL", "Canvas API", "SVG Animation"],
    stat: { value: "∞", label: "Hours in creative rabbit holes" },
  },
  {
    num: "03",
    category: "Backend",
    role: "Systems & Infrastructure",
    summary: "Scalable server-side architecture. Clean REST and GraphQL APIs, efficient data pipelines, containerised production deployments.",
    stack: ["Node.js", "PostgreSQL", "Redis", "Docker", "GraphQL"],
    stat: { value: "99%", label: "Uptime target, always hit" },
  },
  {
    num: "04",
    category: "Tooling",
    role: "Workflow & DX",
    summary: "Developer experience as a first-class concern. Fast builds, clean CI/CD, and zero-friction design-to-production handoffs.",
    stack: ["Vite", "Webpack", "GitHub Actions", "Figma", "Git"],
    stat: { value: "<2s", label: "Target HMR every project" },
  },
];

const N = SKILLS.length;

/* ─────────────────────────────────────────────────────────────────────────────
   HORIZONTAL CARD (desktop)
   Full-width row layout — editorial feel, not boxy
───────────────────────────────────────────────────────────────────────────── */
function HCard({ skill, index, scrollProgress, isActive }) {
  const [hovered, setHovered] = useState(false);
  const hot = hovered || isActive;

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        opacity: isActive ? 1 : 0.42,
        x:       isActive ? 0 : 0,
      }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        width:     "min(680px, 75vw)",
        flexShrink: 0,
        position:  "relative",
      }}
    >
      <motion.div
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{
          position:     "relative",
          padding:      "36px 40px 36px 36px",
          borderRadius: 14,
          background:   hot
            ? "rgba(18,13,10,1)"
            : "rgba(13,10,8,0.9)",
          border: `1px solid ${hot ? o(0.5) : "rgba(255,255,255,0.07)"}`,
          boxShadow: hot
            ? `inset 3px 0 0 ${OR}, 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${o(0.15)}`
            : "0 2px 16px rgba(0,0,0,0.3)",
          transition: "background 0.3s, border 0.3s, box-shadow 0.35s",
          overflow:   "hidden",
        }}
      >
        {/* Ghost number — background decoration */}
        <div style={{
          position:   "absolute",
          right:      -12,
          bottom:     -28,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize:   "clamp(120px, 18vw, 200px)",
          lineHeight: 1,
          color:      CR,
          opacity:    hot ? 0.055 : 0.028,
          userSelect: "none",
          pointerEvents: "none",
          transition: "opacity 0.4s",
          letterSpacing: "-0.03em",
        }}>{skill.num}</div>

        {/* Top section: number + category + stat */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "flex-start",
          marginBottom:   24,
        }}>
          <div>
            <span style={{
              fontFamily:    "'Geist', sans-serif",
              fontWeight:    300,
              fontSize:      10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color:         o(0.55),
              display:       "block",
              marginBottom:  8,
            }}>{skill.num} — {String(N).padStart(2, "0")}</span>

            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(48px, 7vw, 72px)",
              lineHeight:    0.88,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color:         hot ? CR : c(0.75),
              transition:    "color 0.3s",
            }}>{skill.category}</div>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0, paddingTop: 2 }}>
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(32px, 5vw, 48px)",
              lineHeight:    1,
              color:         OR,
              letterSpacing: "-0.02em",
            }}>{skill.stat.value}</div>
            <div style={{
              fontFamily:    "'Geist', sans-serif",
              fontWeight:    300,
              fontSize:      10,
              color:         c(0.32),
              maxWidth:      100,
              lineHeight:    1.5,
              textAlign:     "right",
            }}>{skill.stat.label}</div>
          </div>
        </div>

        {/* Role */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        10,
          marginBottom: 14,
        }}>
          <div style={{ width: 2, height: 14, background: OR, opacity: hot ? 0.9 : 0.35, borderRadius: 1, flexShrink: 0, transition: "opacity 0.3s" }} />
          <span style={{
            fontFamily:    "'Geist', sans-serif",
            fontWeight:    300,
            fontSize:      10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         c(hot ? 0.5 : 0.3),
            transition:    "color 0.3s",
          }}>{skill.role}</span>
        </div>

        {/* Summary */}
        <p style={{
          fontFamily: "'Geist', sans-serif",
          fontWeight: 300,
          fontSize:   14,
          lineHeight: 1.85,
          color:      c(hot ? 0.72 : 0.5),
          margin:     "0 0 24px",
          maxWidth:   500,
          transition: "color 0.3s",
        }}>{skill.summary}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {skill.stack.map(tag => (
            <span key={tag} style={{
              fontFamily:    "'Geist', sans-serif",
              fontWeight:    300,
              fontSize:      11,
              letterSpacing: "0.08em",
              color:         hot ? o(0.9) : c(0.45),
              background:    hot ? o(0.07) : "rgba(255,255,255,0.04)",
              border:        `1px solid ${hot ? o(0.2) : "rgba(255,255,255,0.07)"}`,
              borderRadius:  5,
              padding:       "3px 9px",
              whiteSpace:    "nowrap",
              transition:    "all 0.3s",
            }}>{tag}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE CARD (vertical stack)
───────────────────────────────────────────────────────────────────────────── */
function MobileCard({ skill, index, visible }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      style={{
        padding:      "28px 24px",
        borderRadius: 12,
        background:   "rgba(15,11,9,0.95)",
        border:       "1px solid rgba(255,255,255,0.07)",
        boxShadow:    `inset 3px 0 0 ${OR}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: o(0.55), display: "block", marginBottom: 6 }}>
            {skill.num} — {String(N).padStart(2, "0")}
          </span>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase", color: CR }}>
            {skill.category}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 36, lineHeight: 1, color: OR }}>{skill.stat.value}</div>
          <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 9, color: c(0.32), maxWidth: 90, lineHeight: 1.5, textAlign: "right" }}>{skill.stat.label}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 2, height: 12, background: OR, borderRadius: 1, flexShrink: 0 }} />
        <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: c(0.42) }}>{skill.role}</span>
      </div>
      <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 13.5, lineHeight: 1.8, color: c(0.65), margin: "0 0 18px" }}>{skill.summary}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {skill.stack.map(tag => (
          <span key={tag} style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 10, color: o(0.85), background: o(0.07), border: `1px solid ${o(0.18)}`, borderRadius: 4, padding: "3px 8px" }}>{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROGRESS DOTS
───────────────────────────────────────────────────────────────────────────── */
function ProgressDots({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {SKILLS.map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === active ? 28 : 6, opacity: i === active ? 0.9 : 0.22 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ height: 2, borderRadius: 2, background: OR, flexShrink: 0 }}
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
  const isMobile = vw < 768;

  useEffect(() => {
    const fn = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* ── Card + track dimensions ── */
  const CARD_W   = Math.min(680, vw * 0.75);
  const CARD_GAP = 20;
  const PAD_L    = Math.max(32, vw * 0.055);
  // Last card needs to reach center — extra right padding
  const extraR   = Math.max(0, (vw - CARD_W) / 2);
  const trackW   = PAD_L + N * CARD_W + (N - 1) * CARD_GAP + extraR;
  const travel   = Math.max(trackW - vw, 0);
  const sectionH = vh + travel + 80; // 80px breathing room

  /* ── Scroll ── */
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end end"],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const x    = useSpring(rawX, { stiffness: 58, damping: 22, mass: 0.8 });

  /* Derive active card from scroll */
  useMotionValueEvent(scrollYProgress, "change", v => {
    setActive(Math.max(0, Math.min(N - 1, Math.round(v * (N - 1)))));
  });

  /* Header fade */
  const headerOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const headerY       = useTransform(scrollYProgress, [0, 0.10], [0, -12]);

  /* Scroll hint fade */
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  /* Entry */
  const inView  = useInView(sectionRef, { amount: 0.01, once: true });
  const [ready, setReady] = useState(false);
  useEffect(() => { if (inView) setTimeout(() => setReady(true), 60); }, [inView]);

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <section style={{ background: BG, padding: "80px 20px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: o(0.55), margin: "0 0 10px" }}>Stack Breakdown</p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 10vw, 56px)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: c(0.88), margin: 0 }}>What I Work With</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SKILLS.map((skill, i) => <MobileCard key={skill.num} skill={skill} index={i} />)}
        </div>
      </section>
    );
  }

  /* ── Desktop: horizontal scroll ── */
  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: sectionH, background: BG }}
    >
      <div style={{
        position:   "sticky",
        top:        0,
        height:     "100vh",
        overflow:   "hidden",
        display:    "flex",
        alignItems: "center",
      }}>

        {/* Left + right edge fade — hides card clipping */}
        <div style={{
          position:      "absolute", inset: 0, zIndex: 30,
          pointerEvents: "none",
          background: `
            linear-gradient(to right, ${BG} 0%, ${BG}00 ${PAD_L * 0.8}px),
            linear-gradient(to left,  ${BG} 0%, ${BG}00 60px)
          `,
        }} />

        {/* Very subtle bottom orange glow — ambient only */}
        <div style={{
          position:      "absolute", inset: 0, zIndex: 0,
          pointerEvents: "none",
          background:    `radial-gradient(ellipse 50% 30% at 50% 108%, ${o(0.055)} 0%, transparent 65%)`,
        }} />

        {/* Section header — fades out as scroll starts */}
        <motion.div style={{
          position:      "absolute",
          top:           44,
          left:          PAD_L,
          opacity:       headerOpacity,
          y:             headerY,
          zIndex:        22,
          pointerEvents: "none",
        }}>
          <p style={{
            fontFamily:    "'Geist', sans-serif", fontWeight: 300,
            fontSize:      10, letterSpacing: "0.3em", textTransform: "uppercase",
            color:         o(0.55), margin: "0 0 8px",
          }}>Stack Breakdown</p>
          <h2 style={{
            fontFamily:    "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize:      "clamp(36px, 4vw, 52px)",
            lineHeight:    1, letterSpacing: "-0.02em", textTransform: "uppercase",
            color:         c(0.88), margin: 0,
          }}>What I Work With</h2>
        </motion.div>

        {/* Horizontal track */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          style={{
            display:      "flex",
            gap:          CARD_GAP,
            paddingLeft:  PAD_L,
            x,
            willChange:   "transform",
            position:     "relative",
            zIndex:       15,
            alignItems:   "center",
          }}
        >
          {SKILLS.map((skill, i) => (
            <HCard
              key={skill.num}
              skill={skill}
              index={i}
              scrollProgress={scrollYProgress}
              isActive={i === active}
            />
          ))}
          {/* Invisible spacer so last card travels fully into view */}
          <div style={{ width: extraR, flexShrink: 0 }} />
        </motion.div>

        {/* Bottom bar: dots + hint */}
        <div style={{
          position:       "absolute",
          bottom:         32,
          left:           0,
          right:          0,
          paddingLeft:    PAD_L,
          paddingRight:   40,
          zIndex:         25,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          <ProgressDots active={active} />

          <motion.div
            style={{ opacity: hintOpacity, display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{
              fontFamily:    "'Geist', sans-serif", fontWeight: 300,
              fontSize:      10, letterSpacing: "0.2em", textTransform: "uppercase",
              color:         c(0.2),
            }}>Scroll to explore</span>
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
              <path d="M0 4H15M12 1L15 4L12 7" stroke={o(0.4)} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

      </div>
    </section>
  );
}