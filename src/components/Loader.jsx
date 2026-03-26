/**
 * Loader.jsx — fixed
 *
 * Two bugs fixed:
 *  1. "ENTERING" text was hidden — z-index stack was wrong.
 *     Correct order: base(1) → flash(2) → entering-text(3) → curtain(4) → hud(5)
 *     Curtain must NOT cover flash phase content, so it only activates on "wipe".
 *  2. Page was scrollable during load — body overflow is locked until done.
 *
 * Phases:
 *   count → flash (full red + "ENTERING" text) → wipe (black curtain lifts) → done
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#E8400C";
const CREAM  = "rgba(234,228,213,0.75)";
const E_SNAP = [0.76, 0, 0.24, 1];
const E_SOFT = [0.16, 1, 0.3, 1];

export default function Loader({ onComplete }) {
  const [count, setCount]   = useState(0);
  const [phase, setPhase]   = useState("count"); // count | flash | wipe | done
  const rafRef              = useRef(null);
  // once the orange panel has animated in, keep it at scaleY:1 — never re-animate
  const [panelShown, setPanelShown] = useState(false);

  /* ── lock scroll for entire duration ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  /* ── unlock as soon as wipe starts so hero is ready ── */
  useEffect(() => {
    if (phase === "wipe") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  /* ── flash → wipe after text has shown ── */
  useEffect(() => {
    if (phase !== "flash") return;
    setPanelShown(true);
    const t = setTimeout(() => setPhase("wipe"), 600);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── counter RAF ── */
  useEffect(() => {
    if (phase !== "count") return;
    const DURATION = 1600;
    const start    = performance.now();
    const ease     = t => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2.2) / 2;

    const tick = now => {
      const p = Math.min((now - start) / DURATION, 1);
      setCount(Math.floor(ease(p) * 100));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => setPhase("flash"), 260);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "done" && (
        <motion.div
          key="loader"
          style={{ position: "fixed", inset: 0, zIndex: 9000, pointerEvents: "all" }}
        >

          {/* z:1 — black base, always present */}
          <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", zIndex: 1 }} />

          {/* z:2 — red panel, plain div, only exists during flash phase, no animation = no double-pop */}
          {phase === "flash" && (
            <div style={{ position: "absolute", inset: 0, background: ORANGE, zIndex: 2 }} />
          )}

          {/* z:3 — "ENTERING" text, black on orange, only during flash */}
          <AnimatePresence>
            {phase === "flash" && (
              <motion.div
                key="entering"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.01 }}
                style={{
                  position:       "absolute",
                  inset:          0,
                  zIndex:         3,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  gap:            "0.6rem",
                  pointerEvents:  "none",
                }}
              >
                {/* Letter-by-letter stagger */}
                <div style={{ display: "flex", gap: "0.08em", overflow: "hidden" }}>
                  {"ENTERING".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        duration: 0.38,
                        ease:     [0.16, 1, 0.3, 1],
                        delay:    i * 0.045,
                      }}
                      style={{
                        fontFamily:    "'Barlow Condensed', 'Arial Narrow', sans-serif",
                        fontWeight:    800,
                        fontSize:      "clamp(2.5rem, 7vw, 6rem)",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color:         "#0a0a0a",
                        userSelect:    "none",
                        lineHeight:    1,
                        display:       "block",
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>

                {/* Thin underline that draws across */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                  style={{
                    height:          "1.5px",
                    width:           "100%",
                    maxWidth:        "clamp(160px, 22vw, 380px)",
                    background:      "#0a0a0a",
                    transformOrigin: "left",
                    opacity:         0.4,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* z:4 — curtain starts orange (matches flash), wipes upward to reveal site */}
          {phase === "wipe" && (
            <motion.div
              initial={{ y: "0%" }}
              animate={{ y: "-100%" }}
              transition={{ duration: 0.78, ease: E_SNAP, delay: 0.05 }}
              onAnimationComplete={() => setPhase("done")}
              style={{
                position:   "absolute",
                inset:      0,
                background: ORANGE,
                zIndex:     4,
              }}
            />
          )}

          {/* z:5 — HUD (counter + bar + brand), fades out before flash */}
          <AnimatePresence>
            {phase === "count" && (
              <motion.div
                key="hud"
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                style={{
                  position:       "absolute",
                  inset:          0,
                  zIndex:         5,
                  display:        "flex",
                  flexDirection:  "column",
                  justifyContent: "space-between",
                  padding:        "2.2rem 3rem",
                  userSelect:     "none",
                  pointerEvents:  "none",
                }}
              >
                {/* Brand top-left */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.55, ease: E_SOFT }}
                  style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}
                >
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: ORANGE, display: "inline-block", flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily:    "'Geist', system-ui, sans-serif",
                    fontSize:      "10px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color:         ORANGE,
                    fontWeight:    400,
                  }}>
                    Arnav.dev
                  </span>
                </motion.div>

                {/* Counter + progress bar bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <div style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "baseline",
                    marginBottom:   "0.55rem",
                  }}>
                    <span style={{
                      fontFamily:    "'Geist', system-ui, sans-serif",
                      fontSize:      "9px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color:         "rgba(234,228,213,0.22)",
                    }}>
                      Loading
                    </span>
                    <span style={{
                      fontFamily:         "'Geist Mono','JetBrains Mono',monospace",
                      fontSize:           "clamp(1.8rem, 4vw, 3rem)",
                      fontWeight:         300,
                      letterSpacing:      "0.06em",
                      color:              count >= 85 ? ORANGE : CREAM,
                      lineHeight:         1,
                      fontVariantNumeric: "tabular-nums",
                      transition:         "color 0.5s ease",
                    }}>
                      {String(count).padStart(3, "0")}
                    </span>
                  </div>

                  {/* Bar */}
                  <div style={{ position: "relative", height: "1px", background: "rgba(234,228,213,0.08)" }}>
                    <motion.div
                      style={{
                        position:        "absolute",
                        inset:           0,
                        background:      ORANGE,
                        transformOrigin: "left",
                        scaleX:          count / 100,
                      }}
                      transition={{ duration: 0.04 }}
                    />
                    {/* Tip dot */}
                    <motion.div
                      style={{
                        position:     "absolute",
                        top:          "50%",
                        left:         `${count}%`,
                        transform:    "translate(-50%, -50%)",
                        width:        5,
                        height:       5,
                        borderRadius: "50%",
                        background:   ORANGE,
                        boxShadow:    `0 0 10px 3px ${ORANGE}70`,
                        opacity:      count > 1 ? 1 : 0,
                      }}
                      transition={{ duration: 0.04 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}