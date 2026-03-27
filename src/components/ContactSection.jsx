/**
 * ContactSection.jsx
 *
 * Scroll-driven final section.
 * Outer h-[200vh] wrapper pins a sticky h-screen frame.
 * Scroll progress 0→1 drives all reveals sequentially.
 *
 * Font in <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@300;400&display=swap" rel="stylesheet" />
 */

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ─── Theme ────────────────────────────────────────────────────────────────────
const OR     = "#E8470A";
const OR_RGB = "232,71,10";
const BG     = "#080604";
const CREAM  = "rgba(234,228,213,1)";

// ─── Contact items ────────────────────────────────────────────────────────────
const EMAIL = "arnav@arnav.dev"; // ← replace with real email

const LINKS = [
  {
    label:  "Email",
    sub:    EMAIL,
    action: "copy",
  },
  {
    label:  "GitHub",
    sub:    "github.com/arnavupadhyay",   // ← replace
    href:   "https://github.com/arnavupadhyay",
  },
  {
    label:  "LinkedIn",
    sub:    "linkedin.com/in/arnav",       // ← replace
    href:   "https://linkedin.com/in/arnav",
  },
];

// ─── ContactLink ──────────────────────────────────────────────────────────────
function ContactLink({ item, visible }) {
  const [copied, setCopied]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (item.action === "copy") {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    }
  }, [item]);

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{ cursor: "pointer", userSelect: "none" }}
      className="group flex items-baseline justify-between gap-8 py-5 border-b border-white/[0.06] last:border-0"
    >
      {/* Left: label */}
      <motion.span
        animate={{
          color:  hovered ? "#FFFFFF" : "rgba(234,228,213,0.42)",
          scale:  hovered ? 1.01 : 1,
          textShadow: hovered
            ? `0 0 30px rgba(${OR_RGB},0.40)`
            : "0 0 0px transparent",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    900,
          fontSize:      "clamp(2rem, 5vw, 3.8rem)",
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          lineHeight:    1,
          display:       "inline-block",
          transformOrigin: "left center",
        }}
      >
        {item.label}
      </motion.span>

      {/* Right: sub / feedback */}
      <span
        style={{
          fontFamily:  "'Barlow', sans-serif",
          fontWeight:  300,
          fontSize:    "clamp(0.7rem, 1.2vw, 0.85rem)",
          letterSpacing: "0.04em",
          color: copied
            ? `rgba(${OR_RGB},0.85)`
            : hovered
            ? "rgba(234,228,213,0.65)"
            : "rgba(234,228,213,0.22)",
          transition: "color 0.22s ease",
          whiteSpace:  "nowrap",
          paddingBottom: 4,
        }}
      >
        {item.action === "copy" && copied ? "Copied ✓" : item.sub}
      </span>

      {/* Hover arrow */}
      <motion.span
        animate={{
          opacity: hovered ? 1 : 0,
          x:       hovered ? 0 : -6,
          color:   OR,
        }}
        transition={{ duration: 0.18 }}
        style={{
          fontFamily: "'Barlow', sans-serif",
          fontSize:   "0.9rem",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ↗
      </motion.span>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ContactSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // ── Headline: "Let's build something that matters."
  // Reveals across 0 → 0.45
  const headColor = useTransform(
    smooth,
    [0, 0.08, 0.45, 1],
    [
      "rgba(234,228,213,0.10)",
      "rgba(234,228,213,0.22)",
      "rgba(234,228,213,0.96)",
      "rgba(234,228,213,0.96)",
    ]
  );
  const headBlurVal = useTransform(smooth, [0, 0.08, 0.45, 1], [6, 6, 0, 0]);
  const headFilter  = useTransform(headBlurVal, (v) => `blur(${v.toFixed(1)}px)`);
  const headY       = useTransform(smooth, [0, 0.45, 1], [30, 0, 0]);

  // ── Sub-line: "Or just reach out."
  // Reveals 0.35 → 0.58
  const subOpacity = useTransform(smooth, [0, 0.35, 0.58, 1], [0, 0, 1, 1]);
  const subY       = useTransform(smooth, [0, 0.35, 0.58, 1], [14, 14, 0, 0]);

  // ── Links visible after 0.62
  const linksProgress = useTransform(smooth, [0, 0.62, 0.72, 1], [0, 0, 1, 1]);
  // Convert to boolean-ish for stagger — we pass raw value to each link
  // but use a threshold to trigger the animate prop
  const [linksVisible, setLinksVisible] = useState(false);
  linksProgress.on("change", (v) => {
    if (v > 0.15 && !linksVisible) setLinksVisible(true);
    if (v < 0.05 && linksVisible)  setLinksVisible(false);
  });

  // ── Glow ──
  const glowOp    = useTransform(smooth, [0, 0.2, 0.8, 1], [0, 0.12, 0.35, 0.35]);
  const glowScale = useTransform(smooth, [0, 0.7, 1], [0.6, 1.0, 1.0]);

  // ── Left rail (same as About) ──
  const railH = useTransform(smooth, [0, 1], ["0%", "100%"]);

  // ── Section label ──
  const labelOp = useTransform(smooth, [0, 0.06, 1], [0, 1, 1]);

  return (
    <div ref={ref} className="relative h-[200vh]">

      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        style={{ background: BG }}
      >
        {/* Top blend */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{
            height: "20vh",
            background: `linear-gradient(to bottom, ${BG} 0%, transparent 100%)`,
            zIndex: 4,
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 700, height: 700,
            left: "50%", top: "55%",
            x: "-50%", y: "-50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${OR_RGB},0.18) 0%, rgba(${OR_RGB},0.04) 50%, transparent 68%)`,
            filter: "blur(90px)",
            opacity: glowOp,
            scale:   glowScale,
            zIndex:  1,
          }}
        />

        {/* Left progress rail */}
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 2, zIndex: 20, background: "rgba(255,255,255,0.04)" }}
        >
          <motion.div
            style={{
              width:      "100%",
              height:     railH,
              background: `linear-gradient(to bottom, ${OR}, rgba(${OR_RGB},0.25))`,
              boxShadow:  `0 0 12px 2px rgba(${OR_RGB},0.35)`,
              originY:    0,
            }}
          />
        </div>

        {/* ── Content ── */}
        <div
          className="relative z-10 h-full flex flex-col justify-center"
          style={{
            paddingLeft:  "clamp(48px, 8vw, 120px)",
            paddingRight: "clamp(48px, 8vw, 120px)",
          }}
        >
          {/* Section label */}
          <motion.div
            style={{ opacity: labelOp }}
            className="flex items-center gap-4 mb-12"
          >
            <div style={{ width: 28, height: 1, background: OR, opacity: 0.65 }} />
            <span style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    400,
              fontSize:      10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color:         `rgba(${OR_RGB},0.60)`,
            }}>
              Contact
            </span>
          </motion.div>

          {/* ── Main headline ── */}
          <motion.h2
            style={{
              color:  headColor,
              filter: headFilter,
              y:      headY,
            }}
            className="mb-6"
          >
            {/* Line 1 */}
            <span style={{
              display:       "block",
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(2.8rem, 8vw, 7.2rem)",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              lineHeight:    0.92,
            }}>
              Let's build
            </span>
            {/* Line 2 — "something" gets orange accent */}
            <span style={{
              display:       "block",
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(2.8rem, 8vw, 7.2rem)",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              lineHeight:    0.92,
            }}>
              something{" "}
              <motion.span
                style={{
                  color: useTransform(
                    smooth,
                    [0.28, 0.45, 1],
                    ["rgba(234,228,213,0.96)", OR, OR]
                  ),
                }}
              >
                that
              </motion.span>
            </span>
            {/* Line 3 */}
            <span style={{
              display:       "block",
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              fontSize:      "clamp(2.8rem, 8vw, 7.2rem)",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              lineHeight:    0.92,
            }}>
              matters.
            </span>
          </motion.h2>

          {/* ── Sub line ── */}
          <motion.p
            style={{ opacity: subOpacity, y: subY }}
            className="mb-14"
          >
            <span style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    300,
              fontSize:      "clamp(0.9rem, 1.5vw, 1.1rem)",
              letterSpacing: "0.02em",
              color:         "rgba(234,228,213,0.42)",
              borderLeft:    `2px solid rgba(${OR_RGB},0.28)`,
              paddingLeft:   16,
              display:       "inline-block",
            }}>
              Or just reach out. No pitch decks required.
            </span>
          </motion.p>

          {/* ── Contact links ── */}
          <motion.div
            style={{ opacity: linksProgress }}
            className="max-w-2xl"
          >
            {LINKS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={false}
                animate={linksVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.65,
                  ease:     [0.16, 1, 0.3, 1],
                  delay:    i * 0.09,
                }}
              >
                <ContactLink item={item} visible={linksVisible} />
              </motion.div>
            ))}
          </motion.div>

          {/* ── Footer note ── */}
          <motion.p
            style={{ opacity: linksProgress }}
            className="mt-16"
          >
            <span style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    300,
              fontSize:      9,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         "rgba(234,228,213,0.18)",
            }}>
              Based in India · Available for freelance &amp; full-time
            </span>
          </motion.p>
        </div>

        {/* Bottom blend */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            height: "14vh",
            background: `linear-gradient(to top, ${BG} 0%, transparent 100%)`,
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}