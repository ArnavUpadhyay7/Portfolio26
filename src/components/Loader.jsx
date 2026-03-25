/**
 * Loader.jsx
 * Red + black theme. Feels like entering something.
 *
 * Phases:
 *   "count"  → counter 0→100, red progress line, ARNAV.DEV top-left
 *   "flash"  → full-screen red with "ENTERING" — brief, punchy
 *   "wipe"   → black curtain lifts upward, revealing site beneath
 *   "done"   → unmounts, onComplete fires
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORANGE = "#E8400C";
const CREAM  = "rgba(234,228,213,0.75)";
const E_SNAP = [0.76, 0, 0.24, 1];
const E_SOFT = [0.16, 1, 0.3, 1];

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count");
  const rafRef            = useRef(null);

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
        setTimeout(() => setPhase("flash"), 280);
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
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            pointerEvents: phase === "wipe" ? "none" : "all",
          }}
        >
          {/* Black base */}
          <div style={{ position: "absolute", inset: 0, background: "#0a0a0a" }} />

          {/* Red flash overlay */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={phase === "flash" ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.32, ease: E_SNAP }}
            onAnimationComplete={() => {
              if (phase === "flash") setTimeout(() => setPhase("wipe"), 120);
            }}
            style={{
              position:        "absolute",
              inset:           0,
              background:      ORANGE,
              transformOrigin: "bottom",
              zIndex:          1,
            }}
          />

          {/* Black curtain wipes upward — reveals site */}
          <motion.div
            initial={{ y: "0%" }}
            animate={phase === "wipe" ? { y: "-100%" } : { y: "0%" }}
            transition={{ duration: 0.8, ease: E_SNAP, delay: 0.05 }}
            onAnimationComplete={() => {
              if (phase === "wipe") setPhase("done");
            }}
            style={{
              position:   "absolute",
              inset:      0,
              background: "#0a0a0a",
              zIndex:     2,
            }}
          />

          {/* HUD — visible only during count phase */}
          <AnimatePresence>
            {phase === "count" && (
              <motion.div
                key="hud"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                style={{
                  position:       "absolute",
                  inset:          0,
                  zIndex:         3,
                  display:        "flex",
                  flexDirection:  "column",
                  justifyContent: "space-between",
                  padding:        "2.2rem 3rem",
                  userSelect:     "none",
                  pointerEvents:  "none",
                }}
              >
                {/* Top: brand */}
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

                {/* Bottom: counter + progress */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  {/* Counter row */}
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

                  {/* Progress bar */}
                  <div style={{ position: "relative", height: "1px", background: "rgba(234,228,213,0.08)" }}>
                    {/* Red fill */}
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
                    {/* Glowing tip dot */}
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

          {/* "ENTERING" text — appears on the red flash */}
          <AnimatePresence>
            {phase === "flash" && (
              <motion.div
                key="entering"
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, letterSpacing: "0.35em" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                style={{
                  position:       "absolute",
                  inset:          0,
                  zIndex:         4,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  pointerEvents:  "none",
                }}
              >
                <span style={{
                  fontFamily:    "'Barlow Condensed', sans-serif",
                  fontWeight:    800,
                  fontSize:      "clamp(1rem, 2.5vw, 1.8rem)",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color:         "#0a0a0a",
                  userSelect:    "none",
                }}>
                  Entering
                </span>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}