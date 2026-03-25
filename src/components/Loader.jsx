import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const E = [0.76, 0, 0.24, 1];

export default function Loader({ onComplete }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("count"); // "count" | "wipe" | "done"
  const rafRef            = useRef(null);

  useEffect(() => {
    if (phase !== "count") return;
    const DURATION = 1500;
    const start    = performance.now();
    const ease     = t => t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2.2) / 2;

    const tick = now => {
      const p = Math.min((now - start) / DURATION, 1);
      setCount(Math.floor(ease(p) * 100));
      if (p < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setCount(100); setTimeout(() => setPhase("wipe"), 240); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase !== "done" && (
        <motion.div
          key="loader"
          style={{ position: "fixed", inset: 0, zIndex: 9000, pointerEvents: phase === "wipe" ? "none" : "all" }}
        >
          {/* Left panel */}
          <motion.div
            animate={phase === "wipe" ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 0.72, ease: E }}
            onAnimationComplete={() => phase === "wipe" && setPhase("done")}
            style={{ position: "absolute", inset: 0, right: "50%", background: "#0b0b0e" }}
          />
          {/* Right panel */}
          <motion.div
            animate={phase === "wipe" ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 0.72, ease: E }}
            style={{ position: "absolute", inset: 0, left: "50%", background: "#0b0b0e" }}
          />

          {/* Counter + line — only during count phase */}
          <AnimatePresence>
            {phase === "count" && (
              <motion.div
                key="hud"
                exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                style={{
                  position:   "absolute",
                  bottom:     "2.8rem",
                  left:       "3rem",
                  right:      "3rem",
                  zIndex:     1,
                  userSelect: "none",
                }}
              >
                {/* Label row */}
                <div style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "baseline",
                  marginBottom:   "0.55rem",
                }}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                      fontFamily:    "'Geist', system-ui, sans-serif",
                      fontSize:      "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         "rgba(220,218,212,0.28)",
                    }}
                  >
                    Loading
                  </motion.span>
                  <span
                    style={{
                      fontFamily:         "'Geist Mono','JetBrains Mono',monospace",
                      fontSize:           "clamp(1.8rem, 4vw, 3rem)",
                      fontWeight:         300,
                      letterSpacing:      "0.06em",
                      color:              "rgba(220,218,212,0.78)",
                      lineHeight:         1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(count).padStart(3, "0")}
                  </span>
                </div>

                {/* Progress line */}
                <div style={{ position: "relative", height: "1px", background: "rgba(220,218,212,0.1)" }}>
                  <motion.div
                    style={{
                      position:     "absolute",
                      inset:        0,
                      background:   "rgba(220,218,212,0.5)",
                      transformOrigin: "left",
                      scaleX:       count / 100,
                    }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}