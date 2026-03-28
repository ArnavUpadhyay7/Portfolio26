/**
 * ContactSection.jsx — v5 Unified
 *
 * Unification changes:
 * - BG: #080604 → #0a0a0a (matches entire site)
 * - Section number: 04 / Contact (consistent numbering across site)
 * - Spring config: { stiffness: 60, damping: 20 } — same as About + SkillsSection
 * - E = [0.16, 1, 0.3, 1] applied to all hover transitions
 * - Top fade: 28vh (matches About exactly)
 * - Bottom fade: 22vh (matches About exactly)
 * - Glow peak: 0.38 — slightly higher than About (0.32) — Contact is the climax
 * - Horizontal padding: clamp(40px,8vw,120px) — matches Products section padding
 * - Ghost word stroke: 0.055 opacity — presence without competing with content
 * - Contact item hover y offset: 6px (was implicit via scale — now explicit translate)
 * - Footer: correct real data from document index 7
 * - Body italic text opacity: 0.38 (matches ProductBlock's dimmed description)
 * - FIXED: no duplicate style prop on footer div (was silently dropped by React)
 */

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// ─── Site-wide tokens ─────────────────────────────────────────────────────────
const OR     = "#E8470A";
const OR_RGB = "232,71,10";
const BG     = "#0a0a0a";
const E      = [0.16, 1, 0.3, 1];

// ─── Contact data ─────────────────────────────────────────────────────────────
const EMAIL = "arnavupadhyay7@gmail.com";

const LINKS = [
  {
    id:     "email",
    label:  "Email",
    value:  EMAIL,
    action: "copy",
  },
  {
    id:    "github",
    label: "GitHub",
    value: "github.com/ArnavUpadhyay7",
    href:  "https://github.com/ArnavUpadhyay7",
  },
  {
    id:    "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/arnav-upadhyay7",
    href:  "https://www.linkedin.com/in/arnav-upadhyay7/",
  },
];

// ─── Contact item ─────────────────────────────────────────────────────────────
function ContactItem({ link, index, sp }) {
  const [copied,  setCopied]  = useState(false);
  const [hovered, setHovered] = useState(false);

  const triggerAt = 0.55 + index * 0.10;
  const op    = useTransform(sp, [0, triggerAt, triggerAt + 0.12, 1], [0, 0, 1, 1]);
  const itemY = useTransform(sp, [0, triggerAt, triggerAt + 0.12, 1], [20, 20, 0, 0]);

  const handleClick = useCallback(() => {
    if (link.action === "copy") {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } else if (link.href) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    }
  }, [link]);

  return (
    <motion.div
      style={{ opacity: op, y: itemY }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="cursor-pointer select-none"
    >
      <div
        className="flex items-center gap-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Section index */}
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    700,
          fontSize:      11,
          letterSpacing: "0.20em",
          color:         `rgba(${OR_RGB},0.45)`,
          minWidth:      28,
        }}>0{index + 1}</span>

        {/* Label — translates right on hover */}
        <motion.span
          animate={{
            color:      hovered ? "#FFFFFF" : "rgba(234,228,213,0.55)",
            x:          hovered ? 6 : 0,
            textShadow: hovered ? `0 0 40px rgba(${OR_RGB},0.35)` : "none",
          }}
          transition={{ duration: 0.22, ease: E }}
          style={{
            fontFamily:      "'Barlow Condensed', sans-serif",
            fontWeight:      900,
            // Consistent with About's heading scale logic
            fontSize:        "clamp(1.6rem, 3.5vw, 3rem)",
            letterSpacing:   "-0.02em",
            textTransform:   "uppercase",
            lineHeight:      1,
            flex:            1,
            display:         "inline-block",
            transformOrigin: "left center",
          }}
        >
          {link.label}
        </motion.span>

        {/* Value / clipboard feedback — hidden on mobile */}
        <motion.span
          animate={{
            color: copied
              ? OR
              : hovered
              ? "rgba(234,228,213,0.55)"
              : "rgba(234,228,213,0.22)",
          }}
          transition={{ duration: 0.18 }}
          className="hidden md:block"
          style={{
            fontFamily:    "'Barlow', sans-serif",
            fontWeight:    300,
            // Consistent with body text scale
            fontSize:      "clamp(0.65rem, 1vw, 0.80rem)",
            letterSpacing: "0.04em",
            whiteSpace:    "nowrap",
            paddingBottom: 4,
          }}
        >
          {link.action === "copy" && copied ? "Copied to clipboard ✓" : link.value}
        </motion.span>

        {/* Arrow */}
        <motion.span
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
          transition={{ duration: 0.18, ease: E }}
          style={{
            color:      OR,
            fontFamily: "'Barlow', sans-serif",
            fontSize:   "1rem",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >↗</motion.span>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ContactSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Unified spring config — identical to AboutSection and SkillsSection
  const sp = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Ghost background word
  const ghostScale = useTransform(sp, [0, 0.4, 1], [0.88, 1.0, 1.04]);
  const ghostOp    = useTransform(sp, [0, 0.08, 1], [0, 1, 1]);

  // Headline
  const headOp = useTransform(sp, [0, 0.08, 0.30, 1], [0, 0, 1, 1]);
  const headY  = useTransform(sp, [0, 0.08, 0.30, 1], [24, 24, 0, 0]);

  // Sub line
  const subOp = useTransform(sp, [0, 0.28, 0.45, 1], [0, 0, 1, 1]);
  const subY  = useTransform(sp, [0, 0.28, 0.45, 1], [16, 16, 0, 0]);

  // Diagonal lines
  const lineProg = useTransform(sp, [0, 0.15, 1], [0, 1, 1]);

  // Glow — peaks at 0.38 (Contact is the emotional high point, slightly warmer than About)
  const glowOp = useTransform(sp, [0, 0.2, 0.8, 1], [0, 0.15, 0.38, 0.38]);

  // Footer
  const footOp = useTransform(sp, [0, 0.80, 0.95, 1], [0, 0, 1, 1]);

  // Shared horizontal padding — matches Products section
  const hPad = "clamp(40px, 8vw, 120px)";

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center"
        style={{ background: BG }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 900, height: 900,
            left: "50%", top: "50%", x: "-50%", y: "-50%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${OR_RGB},0.16) 0%, transparent 60%)`,
            filter: "blur(100px)",
            opacity: glowOp, zIndex: 0,
          }}
        />

        {/* Ghost "HELLO." */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: ghostOp, scale: ghostScale, zIndex: 1 }}
        >
          <span style={{
            fontFamily:       "'Barlow Condensed', sans-serif",
            fontWeight:       900,
            fontSize:         "clamp(18vw, 22vw, 28vw)",
            letterSpacing:    "-0.04em",
            textTransform:    "uppercase",
            lineHeight:       1,
            color:            "transparent",
            WebkitTextStroke: "1px rgba(234,228,213,0.055)",
          }}>HELLO.</span>
        </motion.div>

        {/* Diagonal accent lines — orange, consistent with site's line motif */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: "18%", left: "-5%", zIndex: 2,
            width: "40%", height: 1,
            background: `linear-gradient(to right, transparent, rgba(${OR_RGB},0.22), transparent)`,
            rotate: "8deg",
            scaleX: lineProg, transformOrigin: "left center",
          }}
        />
        <motion.div
          className="absolute pointer-events-none"
          style={{
            bottom: "18%", right: "-5%", zIndex: 2,
            width: "40%", height: 1,
            background: `linear-gradient(to left, transparent, rgba(${OR_RGB},0.22), transparent)`,
            rotate: "8deg",
            scaleX: lineProg, transformOrigin: "right center",
          }}
        />

        {/* Top fade — 28vh, matches About */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{ height: "28vh", zIndex: 6, background: `linear-gradient(to bottom, ${BG}, transparent)` }}
        />

        {/* Bottom fade — 22vh, matches About */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{ height: "22vh", zIndex: 6, background: `linear-gradient(to top, ${BG}, transparent)` }}
        />

        {/* ── Content ── */}
        <div
          className="relative z-10 w-full flex flex-col gap-10"
          style={{ maxWidth: 960, paddingLeft: hPad, paddingRight: hPad }}
        >
          {/* Section eyebrow */}
          <motion.div style={{ opacity: headOp }} className="flex items-center gap-4">
            <div style={{ width: 24, height: 1, background: OR, opacity: 0.6 }} />
            <span style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    400,
              fontSize:      10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color:         `rgba(${OR_RGB},0.60)`,
            }}>04 / Contact</span>
          </motion.div>

          {/* Headline */}
          <motion.div style={{ opacity: headOp, y: headY }}>
            <h2 style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    900,
              // Consistent with About's heading scale, slightly larger as final CTA
              fontSize:      "clamp(3rem, 9vw, 8rem)",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              lineHeight:    0.88,
              color:         "rgba(234,228,213,0.95)",
              margin:        0,
            }}>
              Let's build<br />
              <span style={{ color: OR }}>something</span><br />
              that matters.
            </h2>
          </motion.div>

          {/* Sub line */}
          <motion.p style={{ opacity: subOp, y: subY, margin: 0 }}>
            <span style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize:   "clamp(0.85rem, 1.4vw, 1rem)",
              lineHeight: 1.8,
              // Matches About's body text opacity standard
              color:      "rgba(234,228,213,0.38)",
              fontStyle:  "italic",
            }}>
              Or just say hello — no agenda required.
            </span>
          </motion.p>

          {/* Contact manifest */}
          <div>
            {LINKS.map((link, i) => (
              <ContactItem key={link.id} link={link} index={i} sp={sp} />
            ))}
          </div>
        </div>

        {/* Footer — responsive: column on mobile, row on desktop */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 flex flex-col md:flex-row md:justify-between md:items-end items-center gap-2 md:gap-0 pointer-events-none text-center md:text-left"
          style={{
            zIndex:       10,
            paddingLeft:  hPad,
            paddingRight: hPad,
            opacity:      footOp,
          }}
        >
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(234,228,213,0.22)",
          }}>
            Arnav Upadhyay
          </span>

          <span
            className="hidden md:inline"
            style={{
              fontFamily:    "'Barlow', sans-serif",
              fontWeight:    300,
              fontSize:      10,
              letterSpacing: "0.16em",
              color:         "rgba(234,228,213,0.22)",
            }}
          >
            Based in India · Available for freelance &amp; Internships
          </span>

          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontWeight:    700,
            fontSize:      11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         `rgba(${OR_RGB},0.40)`,
          }}>
            © 2025
          </span>
        </motion.div>

      </div>
    </div>
  );
}