/**
 * AboutSection.jsx
 *
 * Pinned scroll-driven section.
 * - Outer tall div (300vh) pins an inner sticky viewport
 * - Scroll drives word reveal across the full scroll budget
 * - Sub-copy is ALWAYS visible (no opacity animation — avoids disappearing)
 * - Left-aligned editorial layout matching arnav.dev black/orange/cream theme
 * - Orange vertical progress rail on left edge
 *
 * Font in <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400&display=swap" rel="stylesheet" />
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Theme ────────────────────────────────────────────────────────────────────
const OR     = "#E8470A";
const OR_RGB = "232,71,10";
const CREAM  = "#EAE4D5";
const BG     = "#080604";

// ─── Words ────────────────────────────────────────────────────────────────────
// Grouped into visual lines so they wrap intentionally
const LINES = [
  [
    { text: "I",      emphasis: false },
    { text: "care",   emphasis: false },
    { text: "about",  emphasis: false },
  ],
  [
    { text: "how",    emphasis: true  },
    { text: "things", emphasis: true  },
    { text: "feel",   emphasis: true  },
  ],
  [
    { text: "as",     emphasis: false },
    { text: "much",   emphasis: false },
    { text: "as",     emphasis: false },
    { text: "how",    emphasis: false },
    { text: "they",   emphasis: false },
    { text: "work.",  emphasis: false },
  ],
];

// Flat word list with global index assigned
const WORDS = LINES.flat().map((w, i) => ({ ...w, i }));
const TOTAL = WORDS.length; // 12

// Each word occupies a reveal window. Start points evenly distributed so
// word 0 starts at 0 and word 11 ends at 1. Windows overlap for fluid feel.
function wordRange(i, emphasis) {
  const WIN     = 0.16;
  const maxStart = 1 - WIN;
  const base    = (i / (TOTAL - 1)) * maxStart;
  const offset  = emphasis ? -(WIN * 0.28) : 0;
  return [
    Math.max(0,   base + offset),
    Math.min(1.0, base + offset + WIN),
  ];
}

// ─── Single word ──────────────────────────────────────────────────────────────
function Word({ word, scrollYProgress }) {
  const [lo, hi] = wordRange(word.i, word.emphasis);

  // Unrevealed: warm dim but still legible. Revealed: crisp white/cream.
  const color = useTransform(
    scrollYProgress,
    [0, lo, hi, 1],
    [
      `rgba(${CREAM.replace('#','')},0.18)`,   // start of section — very dim
      `rgba(200,188,170,0.40)`,                // just before reveal — readable
      word.emphasis ? "#FFFFFF" : CREAM,       // fully revealed
      word.emphasis ? "#FFFFFF" : CREAM,       // stays revealed
    ]
  );

  // Subtle blur only — keeps text readable even when unrevealed
  const blurVal = useTransform(scrollYProgress, [0, lo, hi, 1], [1.5, 1.5, 0, 0]);
  const filter  = useTransform(blurVal, (v) => `blur(${v.toFixed(2)}px)`);

  // Emphasis words get a faint orange glow when fully revealed
  const textShadow = useTransform(
    scrollYProgress,
    [lo, hi],
    [
      "0 0 0px transparent",
      word.emphasis
        ? `0 0 28px rgba(${OR_RGB},0.35)`
        : "0 0 0px transparent",
    ]
  );

  return (
    <motion.span
      style={{
        color,
        filter,
        textShadow,
        display:     "inline-block",
        marginRight: "0.20em",
      }}
    >
      {word.text}
    </motion.span>
  );
}

// ─── Line of words ────────────────────────────────────────────────────────────
function Line({ words, scrollYProgress }) {
  return (
    <div style={{ display: "block", lineHeight: 0.95 }}>
      {words.map((word) => (
        <Word key={`${word.i}`} word={word} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Orange glow — builds then holds
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.55, 1],
    [0,  0.12, 0.38, 0.38]
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [0.7, 1.05, 1.05]
  );

  // Vertical progress rail height (left edge)
  const railH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Label slides in at the very start
  const labelY  = useTransform(scrollYProgress, [0, 0.06, 1], [8, 0, 0]);
  const labelOp = useTransform(scrollYProgress, [0, 0.06, 1], [0, 1, 1]);

  return (
    <div ref={ref} className="relative h-[300vh]">

      {/* ── Sticky frame ── */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: BG }}
      >
        {/* Top edge blend */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{
            height: "22vh",
            background: `linear-gradient(to bottom, ${BG} 0%, transparent 100%)`,
            zIndex: 4,
          }}
        />

        {/* Orange background glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width:        700,
            height:       700,
            left:         "50%",
            top:          "52%",
            x:            "-50%",
            y:            "-50%",
            borderRadius: "50%",
            background:   `radial-gradient(circle, rgba(${OR_RGB},0.20) 0%, rgba(${OR_RGB},0.04) 50%, transparent 68%)`,
            filter:       "blur(80px)",
            scale:        glowScale,
            opacity:      glowOpacity,
            zIndex:       1,
          }}
        />

        {/* ── Left progress rail ── */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 2, zIndex: 20, background: "rgba(255,255,255,0.04)" }}
        >
          <motion.div
            style={{
              width:       "100%",
              height:      railH,
              background:  `linear-gradient(to bottom, ${OR}, rgba(${OR_RGB},0.3))`,
              boxShadow:   `0 0 12px 2px rgba(${OR_RGB},0.4)`,
              originY:     0,
            }}
          />
        </div>

        {/* ── Content — left-aligned, vertically centred ── */}
        <div
          className="relative h-full flex flex-col justify-center"
          style={{
            paddingLeft:  "clamp(48px, 8vw, 120px)",
            paddingRight: "clamp(48px, 8vw, 120px)",
            zIndex:       10,
          }}
        >
          {/* Section label */}
          <motion.div
            style={{ opacity: labelOp, y: labelY }}
            className="flex items-center gap-4 mb-10"
          >
            <div
              style={{ width: 28, height: 1, background: OR, opacity: 0.7 }}
            />
            <span
              style={{
                fontFamily:    "'Barlow', sans-serif",
                fontWeight:    400,
                fontSize:      10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color:         `rgba(${OR_RGB},0.65)`,
              }}
            >
              About
            </span>
          </motion.div>

          {/* ── Word reveal headline ── */}
          <div
            style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(3rem, 8.5vw, 7.5rem)",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight:    0.95,
              marginBottom:  "clamp(32px, 4vw, 56px)",
            }}
          >
            {LINES.map((lineWords, li) => {
              // Attach global index back to each word
              let offset = LINES.slice(0, li).reduce((s, l) => s + l.length, 0);
              const enriched = lineWords.map((w, wi) => ({ ...w, i: offset + wi }));
              return (
                <Line key={li} words={enriched} scrollYProgress={scrollYProgress} />
              );
            })}
          </div>

          {/* ── Sub copy — always fully visible, no opacity animation ── */}
          <div
            style={{
              maxWidth:     520,
              borderLeft:   `2px solid rgba(${OR_RGB},0.30)`,
              paddingLeft:  20,
            }}
          >
            <p
              style={{
                fontFamily:  "'Barlow', sans-serif",
                fontWeight:  300,
                fontSize:    "clamp(0.88rem, 1.4vw, 1.05rem)",
                lineHeight:  1.85,
                color:       "rgba(234,228,213,0.52)",
                margin:      "0 0 16px",
              }}
            >
              From smooth interactions to system-level thinking,
              I focus on building products that are both functional
              and refined.
            </p>
            <p
              style={{
                fontFamily:    "'Barlow', sans-serif",
                fontWeight:    400,
                fontSize:      9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         `rgba(${OR_RGB},0.45)`,
                margin:        0,
              }}
            >
              Frontend · Motion · Performance
            </p>
          </div>
        </div>

        {/* Bottom edge blend */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            height: "18vh",
            background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}