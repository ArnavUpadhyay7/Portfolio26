import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const TRAIL_LIMIT = 8;
let trailId = 0;

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  });
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isTouch;
}

export default function Cursor() {
  const isTouch = useIsTouch();

  const [trail, setTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lastPos    = useRef({ x: -200, y: -200 });
  const frameRef   = useRef(null);
  const pendingTrail = useRef([]);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX  = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.8 });
  const ringY  = useSpring(mouseY, { damping: 28, stiffness: 180, mass: 0.8 });

  const addTrailPoint = useCallback((x, y) => {
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) < 6) return;
    lastPos.current = { x, y };
    pendingTrail.current.push({
      id:   trailId++,
      x:    x + (Math.random() - 0.5) * 6,
      y:    y + (Math.random() - 0.5) * 6,
      size: Math.random() * 3 + 3,
    });
  }, []);

  // Batch trail flushes via rAF
  useEffect(() => {
    if (isTouch) return; // no RAF loop needed on touch
    const flush = () => {
      if (pendingTrail.current.length > 0) {
        const incoming = pendingTrail.current.splice(0);
        setTrail((prev) => [...prev, ...incoming].slice(-TRAIL_LIMIT));
      }
      frameRef.current = requestAnimationFrame(flush);
    };
    frameRef.current = requestAnimationFrame(flush);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return; // no mouse listeners on touch
    const SELECTORS = "a, button, [role='button'], [data-hover], input, textarea, select, label";
    const onMove  = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); addTrailPoint(e.clientX, e.clientY); setIsVisible(true); };
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);
    const onOver  = (e) => { if (e.target.closest(SELECTORS)) setIsHovering(true); };
    const onOut   = (e) => { if (e.target.closest(SELECTORS)) setIsHovering(false); };

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseover",  onOver);
    window.addEventListener("mouseout",   onOut);
    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseover",  onOver);
      window.removeEventListener("mouseout",   onOut);
    };
  }, [isTouch, mouseX, mouseY, addTrailPoint]);

  // On touch devices: render nothing, let browser show default cursor
  if (isTouch) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* ── Fire Trail ── */}
      <AnimatePresence>
        {trail.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            onAnimationComplete={() =>
              setTrail((prev) => prev.filter((t) => t.id !== p.id))
            }
            style={{
              position:      "fixed",
              left:          p.x,
              top:           p.y,
              width:         p.size,
              height:        p.size,
              borderRadius:  "50%",
              background:    "radial-gradient(circle, #ffaa44 0%, #ff4400 55%, transparent 100%)",
              transform:     "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex:        9997,
              filter:        "blur(1.5px)",
              mixBlendMode:  "screen",
            }}
          />
        ))}
      </AnimatePresence>

      {/* ── Glow Ring ── */}
      <motion.div
        style={{
          position:      "fixed",
          left:          ringX,
          top:           ringY,
          width:         isHovering ? 38 : 26,
          height:        isHovering ? 38 : 26,
          borderRadius:  "50%",
          border:        "1px solid rgba(255, 130, 50, 0.4)",
          boxShadow:     isHovering
            ? "0 0 14px 3px rgba(255, 90, 20, 0.2), inset 0 0 8px rgba(255,110,30,0.1)"
            : "0 0 8px 2px rgba(255, 90, 20, 0.1)",
          transform:     "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex:        9998,
          opacity:       isVisible ? 1 : 0,
          transition:    "width 0.22s ease, height 0.22s ease, box-shadow 0.22s ease, opacity 0.3s ease",
        }}
      />

      {/* ── Core Dot ── */}
      <motion.div
        style={{
          position:      "fixed",
          left:          mouseX,
          top:           mouseY,
          width:         isHovering ? 7 : 5,
          height:        isHovering ? 7 : 5,
          borderRadius:  "50%",
          background:    isHovering
            ? "radial-gradient(circle, #fff 0%, #ffcc88 100%)"
            : "#ffffff",
          boxShadow:     isHovering
            ? "0 0 6px 2px rgba(255,150,60,0.55)"
            : "0 0 4px 1px rgba(255,255,255,0.35)",
          transform:     "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex:        10000,
          opacity:       isVisible ? 1 : 0,
          transition:    "width 0.12s ease, height 0.12s ease, background 0.18s ease, box-shadow 0.18s ease, opacity 0.3s ease",
        }}
      />
    </>
  );
}