/**
 * DistortedText — zarcerog-style per-letter distortion.
 * Subtle translateY + scaleY with spring overshoot. Opacity falloff on neighbours.
 * Cursor-leave is handled exclusively on the wrapper — one boundary, no races.
 */
import { memo, useCallback, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const SPRING_IN  = { stiffness: 380, damping: 22, mass: 0.45 };
const SPRING_OUT = { stiffness: 240, damping: 28, mass: 0.6  };

// How much each distance bucket gets
const DIST = [
  { y: -7, scaleY: 0.94, opacity: 1    }, // d=0  hovered
  { y: -3, scaleY: 0.97, opacity: 0.70 }, // d=1
  { y: -1, scaleY: 0.99, opacity: 0.45 }, // d=2
];
const REST = { y: 0, scaleY: 1, opacity: 0.25 }; // d>=3 while block hovered
const IDLE = { y: 0, scaleY: 1, opacity: 1    }; // nothing hovered

const Letter = memo(function Letter({
  char, index, activeIndex, baseColor, hoverColor, onEnter,
}) {
  if (char === " ")
    return <span style={{ display: "inline-block", width: "0.22em" }} />;

  const isActive = activeIndex !== null;
  const d        = isActive ? Math.abs(index - activeIndex) : null;
  const bucket   = !isActive ? IDLE : d < DIST.length ? DIST[d] : REST;

  const cfg   = isActive && d <= 2 ? SPRING_IN : SPRING_OUT;
  const y     = useSpring(bucket.y,      cfg);
  const scale = useSpring(bucket.scaleY, cfg);

  y.set(bucket.y);
  scale.set(bucket.scaleY);

  const isHovered = d === 0;
  const color     = isHovered && hoverColor ? hoverColor : (baseColor || "inherit");

  return (
    <motion.span
      onMouseEnter={onEnter}
      style={{
        display:         "inline-block",
        y,
        scaleY:          scale,
        opacity:         bucket.opacity,
        color,
        transformOrigin: "50% 100%",
        willChange:      "transform, opacity",
        transition:      "opacity 0.22s ease, color 0.22s ease",
        cursor:          "default",
      }}
    >
      {char}
    </motion.span>
  );
});

export default function DistortedText({
  text          = "",
  className     = "",
  style         = {},
  baseColor,
  hoverColor,
  neighborRadius = 2, // kept for compat; visual range is fixed in DIST table
}) {
  const [activeIndex, setActiveIndex] = useState(null);

  // ── cursor-leave fix ──────────────────────────────────────────────────────
  // The bug: letters fire their own mouseleave before the next mouseenter fires,
  // briefly snapping activeIndex to null and creating a flicker/reset mid-sweep.
  // Fix: debounce reset with a 1-frame RAF. If a new mouseenter fires before the
  // frame resolves, the reset is cancelled. Wrapper mouseleave always wins for
  // true exits (cursor leaves the whole word boundary).
  const pendingReset = useRef(null);

  const handleEnter = useCallback((i) => {
    if (pendingReset.current) {
      cancelAnimationFrame(pendingReset.current);
      pendingReset.current = null;
    }
    setActiveIndex(i);
  }, []);

  const handleLeave = useCallback(() => {
    pendingReset.current = requestAnimationFrame(() => {
      setActiveIndex(null);
      pendingReset.current = null;
    });
  }, []);

  return (
    <span
      className={className}
      onMouseLeave={handleLeave}
      style={{
        display:    "inline-block",
        lineHeight: "inherit",
        color:      baseColor || "inherit",
        ...style,
      }}
    >
      {text.split("").map((char, i) => (
        <Letter
          key={i}
          char={char}
          index={i}
          activeIndex={activeIndex}
          baseColor={baseColor}
          hoverColor={hoverColor}
          onEnter={() => handleEnter(i)}
        />
      ))}
    </span>
  );
}