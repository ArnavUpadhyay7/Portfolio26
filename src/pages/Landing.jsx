import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RingCursor from "../components/RingCursor";
import Loader from "../components/Loader";
import DistortedText from "../components/DistortedText";

const CREAM  = "#EAE4D5";
const ORANGE = "#E8400C";
const E      = [0.16, 1, 0.3, 1];

function GlobalStyles() {
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "global-base";
    s.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
}

function useLenis() {
  useEffect(() => {
    let lenis, raf;
    (async () => {
      try {
        const { default: Lenis } = await import("lenis");
        lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        const tick = t => { lenis.raf(t); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      } catch {}
    })();
    return () => { lenis?.destroy(); cancelAnimationFrame(raf); };
  }, []);
}

/* ─── hero ─── */
function HeroSection({ visible }) {
  const [hovered, setHovered] = useState(false);

  /*
   * Default:  Arnav = ORANGE,  Upadhyay = CREAM
   * Hover:    Arnav = CREAM,   Upadhyay = ORANGE
   */
  const firstBase  = hovered ? CREAM  : ORANGE;
  const secondBase = hovered ? ORANGE : CREAM;

  const nameStyle = {
    fontFamily:    "'Bebas Neue', Impact, sans-serif",
    fontWeight:    400,
    lineHeight:    0.88,
    letterSpacing: "-0.01em",
    textTransform: "uppercase",
    fontSize:      "clamp(120px, 26vw, 420px)",
    display:       "block",
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col bg-[#0a0a0a]">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" />

      <div className="relative flex flex-col min-h-screen z-10">

        {/* Top bar */}
        <div className="flex items-start justify-between px-[80px] pt-8">
          <motion.span
            initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.05 }}
            className="font-['Geist',sans-serif] font-light text-[10px] tracking-[0.2em] uppercase text-white/25"
          >
            Arnav.dev
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.1 }}
            className="font-['Geist',sans-serif] font-light text-[10px] tracking-[0.2em] uppercase text-white/25"
          >
            Vol. 1 / 2026
          </motion.span>
        </div>

        {/* Name block */}
        <div
          className="flex-1 flex items-end pl-[80px] pb-0 overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div>
            {/* ARNAV */}
            <div className="overflow-hidden leading-none">
              <motion.div
                initial={{ y: "110%" }} animate={visible ? { y: 0 } : { y: "110%" }}
                transition={{ duration: 1.0, ease: E, delay: 0.08 }}
              >
                <DistortedText
                  text="Arnav"
                  baseColor={firstBase}
                  hoverColor={CREAM}
                  neighborRadius={3}
                  style={nameStyle}
                />
              </motion.div>
            </div>

            {/* UPADHYAY */}
            <div className="overflow-hidden leading-none">
              <motion.div
                initial={{ y: "110%" }} animate={visible ? { y: 0 } : { y: "110%" }}
                transition={{ duration: 1.0, ease: E, delay: 0.2 }}
              >
                <DistortedText
                  text="Upadhyay"
                  baseColor={secondBase}
                  hoverColor={ORANGE}
                  neighborRadius={3}
                  style={nameStyle}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Hairline */}
        <motion.div
          initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: E, delay: 0.55 }}
          className="h-px w-full origin-left mt-2"
          style={{ background: ORANGE }}
        />

        {/* Bottom bar */}
        <div className="flex items-end justify-between px-[80px] pt-2 pb-7">
          <motion.span
            initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.6 }}
            className="font-['Geist',sans-serif] font-light text-[10px] tracking-[0.2em] uppercase text-white/25"
          >
            P. 001
          </motion.span>
          <div className="text-right flex flex-col gap-1">
            <motion.span
              initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease: E, delay: 0.65 }}
              className="font-['Geist',sans-serif] font-light text-[10px] tracking-[0.2em] uppercase text-white/25"
            >
              / Frontend Engineer
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, ease: E, delay: 0.72 }}
              className="font-['Geist',sans-serif] font-light text-[10px] tracking-[0.2em] uppercase text-white/[0.15]"
            >
              ↓ Scroll to Tune In
            </motion.span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── root ─── */
export default function Landing() {
  useLenis();
  const [heroVisible, setHeroVisible] = useState(false);
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <GlobalStyles />
      <RingCursor />
      <Loader onComplete={() => setHeroVisible(true)} />
      <main>
        <HeroSection visible={heroVisible} />
      </main>
    </div>
  );
}