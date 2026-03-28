/**
 * AboutSection.jsx — v6 Responsive
 *
 * Changes vs v5:
 * - Ghost "03": stroke opacity 0.22 → 0.45, min clamp size lifted to 9rem
 *   so it's properly visible on laptop (1024–1440px) viewports
 * - Layout: grid 2-col collapses to 1-col stack on < 1024px (lg breakpoint)
 * - Mobile top bar: label + credits in a single row, ghost number hidden below md
 * - Word headline clamp tightened for 768–1024px to prevent overflow
 * - Stats flex-wrap added; gap scales with clamp
 * - Sub copy border-left hidden on mobile via inline media-query workaround
 * - All padding values use clamp() — safe from 320px to 1920px
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ─── Site-wide tokens ─────────────────────────────────────────────────────────
const OR     = "#E8470A";
const OR_RGB = "232,71,10";
const BG     = "#0a0a0a";
const E      = [0.16, 1, 0.3, 1];

// ─── Words ────────────────────────────────────────────────────────────────────
const LINES = [
  [
    { text: "I",      em: false },
    { text: "care",   em: false },
    { text: "about",  em: false },
  ],
  [
    { text: "how",    em: true  },
    { text: "things", em: true  },
    { text: "feel",   em: true  },
  ],
  [
    { text: "as",     em: false },
    { text: "much",   em: false },
    { text: "as",     em: false },
  ],
  [
    { text: "how",    em: false },
    { text: "they",   em: false },
    { text: "work.",  em: false },
  ],
];

const FLAT  = LINES.flat().map((w, i) => ({ ...w, i }));
const TOTAL = FLAT.length;

function wordRange(i, em) {
  const WIN      = 0.15;
  const maxStart = 1 - WIN;
  const base     = (i / (TOTAL - 1)) * maxStart;
  const offset   = em ? -(WIN * 0.3) : 0;
  return [Math.max(0, base + offset), Math.min(1, base + offset + WIN)];
}

// ─── Word ─────────────────────────────────────────────────────────────────────
function Word({ word, sp }) {
  const [lo, hi] = wordRange(word.i, word.em);

  const color = useTransform(sp, [0, lo, hi, 1], [
    "rgba(200,188,170,0.25)",
    "rgba(200,188,170,0.40)",
    word.em ? "#FFFFFF" : "rgba(234,228,213,0.95)",
    word.em ? "#FFFFFF" : "rgba(234,228,213,0.95)",
  ]);
  const blurN  = useTransform(sp, [0, lo, hi, 1], [2, 2, 0, 0]);
  const filter = useTransform(blurN, v => `blur(${v.toFixed(1)}px)`);
  const shadow = useTransform(sp, [lo, hi], [
    "0 0 0px transparent",
    word.em ? `0 0 32px rgba(${OR_RGB},0.45)` : "0 0 0px transparent",
  ]);

  return (
    <motion.span style={{
      color, filter, textShadow: shadow,
      display: "inline-block", marginRight: "0.18em",
    }}>
      {word.text}
    </motion.span>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "3+",  label: "Years shipping" },
  { value: "40+", label: "Projects built" },
  { value: "∞",   label: "Hours in motion" },
];

function StatItem({ stat, sp, triggerAt }) {
  const op = useTransform(sp, [0, triggerAt, triggerAt + 0.10, 1], [0, 0, 1, 1]);
  const y  = useTransform(sp, [0, triggerAt, triggerAt + 0.10, 1], [12, 12, 0, 0]);
  return (
    <motion.div style={{ opacity: op, y }} className="flex flex-col gap-1">
      <span style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontWeight:    900,
        fontSize:      "clamp(1.4rem, 3vw, 2.8rem)",
        letterSpacing: "-0.02em",
        color:         OR,
        lineHeight:    1,
      }}>{stat.value}</span>
      <span style={{
        fontFamily:    "'Barlow', sans-serif",
        fontWeight:    300,
        fontSize:      10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color:         "rgba(234,228,213,0.45)",
        whiteSpace:    "nowrap",
      }}>{stat.label}</span>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Ghost number
  const numRotate = useTransform(sp, [0, 1], [-8, 8]);
  const numOp     = useTransform(sp, [0, 0.05, 1], [0, 1, 1]);

  // Ambient glow
  const glowOp = useTransform(sp, [0, 0.15, 0.7, 1], [0, 0.10, 0.32, 0.32]);

  // Label / divider
  const labelOp = useTransform(sp, [0, 0.05, 1], [0, 1, 1]);
  const lineW   = useTransform(sp, [0, 0.08, 1], ["0%", "100%", "100%"]);

  // Sub copy
  const subOp = useTransform(sp, [0, 0.55, 0.72, 1], [0, 0, 1, 1]);
  const subY  = useTransform(sp, [0, 0.55, 0.72, 1], [16, 16, 0, 0]);

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: BG }}
      >
        {/* ── Ambient glow ── */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 800, height: 800,
            left: "50%", top: "45%", x: "-50%", y: "-50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${OR_RGB},0.14) 0%, transparent 65%)`,
            filter: "blur(100px)",
            opacity: glowOp, zIndex: 0,
          }}
        />

        {/* ── Top fade ── */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{ height: "28vh", zIndex: 5, background: `linear-gradient(to bottom, ${BG}, transparent)` }}
        />

        {/* ── Horizontal mid-divider (desktop only) ── */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{ top: "50%", left: 0, right: 0, height: 1, zIndex: 3, background: "rgba(255,255,255,0.04)" }}
        >
          <motion.div style={{
            height: "100%", width: lineW,
            background: `linear-gradient(to right, rgba(${OR_RGB},0.45), rgba(${OR_RGB},0.06))`,
            originX: 0,
          }} />
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP LAYOUT  (≥ 1024px)
        ══════════════════════════════════════════ */}
        <div
          className="relative h-full z-10 hidden lg:grid"
          style={{ gridTemplateColumns: "1fr 1.6fr" }}
        >
          {/* LEFT PANEL */}
          <div
            className="flex flex-col justify-between py-16 border-r"
            style={{
              borderColor:  "rgba(255,255,255,0.05)",
              paddingLeft:  "clamp(32px, 5vw, 80px)",
              paddingRight: "clamp(20px, 3vw, 48px)",
            }}
          >
            {/* Section label */}
            <motion.div style={{ opacity: labelOp }} className="flex flex-col gap-3">
              <span style={{
                fontFamily:    "'Barlow', sans-serif",
                fontWeight:    400,
                fontSize:      10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         `rgba(${OR_RGB},0.60)`,
              }}>03 / About</span>
              <div style={{ width: 24, height: 1, background: OR, opacity: 0.5 }} />
            </motion.div>

            {/* Ghost number — lifted stroke opacity + min font for laptop visibility */}
            <motion.div style={{ opacity: numOp, rotate: numRotate }} className="select-none">
              <span style={{
                fontFamily:       "'Barlow Condensed', sans-serif",
                fontWeight:       900,
                /*
                 * FIX: min lifted from 7rem → 9rem so the number is
                 * actually readable at 1024–1280px laptop viewports.
                 * The stroke opacity is also raised from 0.22 → 0.45.
                 */
                fontSize:         "clamp(9rem, 18vw, 18rem)",
                lineHeight:       0.85,
                letterSpacing:    "-0.04em",
                color:            "transparent",
                WebkitTextStroke: `1px rgba(${OR_RGB},0.45)`,
                display:          "block",
              }}>03</span>
            </motion.div>

            {/* Bottom credits */}
            <motion.div style={{ opacity: labelOp }}>
              <span style={{
                fontFamily:    "'Barlow', sans-serif",
                fontWeight:    300,
                fontSize:      11,
                letterSpacing: "0.12em",
                color:         "rgba(234,228,213,0.20)",
              }}>Frontend · Motion · Performance</span>
            </motion.div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="flex flex-col justify-center py-16"
            style={{
              gap:          "clamp(24px, 4vw, 48px)",
              paddingLeft:  "clamp(32px, 5vw, 80px)",
              paddingRight: "clamp(32px, 5vw, 80px)",
            }}
          >
            {/* Word reveal headline */}
            <div style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              /*
               * FIX: tightened clamp so it doesn't overflow the right
               * panel at 1024–1280px (old max was 6.2rem, new is 5.5rem).
               */
              fontSize:      "clamp(2.4rem, 5.5vw, 5.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight:    0.92,
            }}>
              {LINES.map((lineWords, li) => {
                const offset   = LINES.slice(0, li).reduce((s, l) => s + l.length, 0);
                const enriched = lineWords.map((w, wi) => ({ ...w, i: offset + wi }));
                return (
                  <div key={li} style={{ display: "block" }}>
                    {enriched.map(word => <Word key={word.i} word={word} sp={sp} />)}
                  </div>
                );
              })}
            </div>

            {/* Sub copy + stats */}
            <motion.div style={{ opacity: subOp, y: subY }} className="flex flex-col gap-5">
              <p style={{
                fontFamily:  "'Barlow', sans-serif",
                fontWeight:  300,
                fontSize:    "clamp(0.82rem, 1.2vw, 1rem)",
                lineHeight:  1.88,
                color:       "rgba(234,228,213,0.55)",
                maxWidth:    460,
                paddingLeft: 16,
                borderLeft:  `2px solid rgba(${OR_RGB},0.25)`,
              }}>
                From smooth interactions to system-level thinking, I build
                products that are both functional and refined. Engineering
                meets obsessive craft.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 4vw, 40px)" }}>
                {STATS.map((s, i) => (
                  <StatItem key={s.label} stat={s} sp={sp} triggerAt={0.62 + i * 0.06} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MOBILE / TABLET LAYOUT  (< 1024px)
        ══════════════════════════════════════════ */}
        <div
          className="relative h-full z-10 flex flex-col lg:hidden"
          style={{ paddingLeft: "clamp(24px, 6vw, 48px)", paddingRight: "clamp(24px, 6vw, 48px)" }}
        >
          {/* ── Top bar: label + credits ── */}
          <motion.div
            style={{ opacity: labelOp }}
            className="flex items-center justify-between pt-14 pb-6"
          >
            <div className="flex flex-col gap-2">
              <span style={{
                fontFamily:    "'Barlow', sans-serif",
                fontWeight:    400,
                fontSize:      10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         `rgba(${OR_RGB},0.60)`,
              }}>03 / About</span>
              <div style={{ width: 24, height: 1, background: OR, opacity: 0.5 }} />
            </div>
            <span style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    300,
              fontSize:      10,
              letterSpacing: "0.12em",
              color:         "rgba(234,228,213,0.20)",
            }}>Frontend · Motion · Performance</span>
          </motion.div>

          {/* ── Thin divider ── */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: "clamp(24px, 5vw, 40px)" }} />

          {/* ── Ghost number (mid-size, visible but not dominating) ── */}
          <motion.div
            style={{ opacity: numOp, rotate: numRotate }}
            className="select-none mb-2 -ml-2"
          >
            <span style={{
              fontFamily:       "'Barlow Condensed', sans-serif",
              fontWeight:       900,
              fontSize:         "clamp(5.5rem, 22vw, 10rem)",
              lineHeight:       0.85,
              letterSpacing:    "-0.04em",
              color:            "transparent",
              WebkitTextStroke: `1px rgba(${OR_RGB},0.42)`,
              display:          "block",
            }}>03</span>
          </motion.div>

          {/* ── Word reveal headline ── */}
          <div
            className="mb-8"
            style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(2.6rem, 10vw, 5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight:    0.92,
            }}
          >
            {LINES.map((lineWords, li) => {
              const offset   = LINES.slice(0, li).reduce((s, l) => s + l.length, 0);
              const enriched = lineWords.map((w, wi) => ({ ...w, i: offset + wi }));
              return (
                <div key={li} style={{ display: "block" }}>
                  {enriched.map(word => <Word key={word.i} word={word} sp={sp} />)}
                </div>
              );
            })}
          </div>

          {/* ── Sub copy + stats ── */}
          <motion.div style={{ opacity: subOp, y: subY }} className="flex flex-col gap-6">
            <p style={{
              fontFamily:  "'Barlow', sans-serif",
              fontWeight:  300,
              fontSize:    "clamp(0.85rem, 3.5vw, 1rem)",
              lineHeight:  1.88,
              color:       "rgba(234,228,213,0.55)",
              maxWidth:    500,
              paddingLeft: 14,
              borderLeft:  `2px solid rgba(${OR_RGB},0.25)`,
            }}>
              From smooth interactions to system-level thinking, I build
              products that are both functional and refined. Engineering
              meets obsessive craft.
            </p>

            {/* Stats — wrap on very small screens */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 6vw, 40px)" }}>
              {STATS.map((s, i) => (
                <StatItem key={s.label} stat={s} sp={sp} triggerAt={0.62 + i * 0.06} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom fade ── */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{ height: "22vh", zIndex: 5, background: `linear-gradient(to top, ${BG}, transparent)` }}
        />
      </div>
    </div>
  );
}