import { memo, useMemo } from "react";
import { motion, useSpring } from "framer-motion";

const SPRING = { stiffness: 500, damping: 35, mass: 0.5 };

const Letter = memo(({ char, index, activeIndex, color }) => {
  if (char === " ") return <span className="inline-block w-[0.22em]" />;

  const isActive = activeIndex !== null;
  const isHovered = activeIndex === index;

  // Ultra-minimal jump: only the hovered letter moves
  const yTarget = isHovered ? -12 : 0;
  const opacityTarget = isActive ? (isHovered ? 1 : 0.3) : 1;

  const y = useSpring(0, SPRING);
  y.set(yTarget);

  return (
    <motion.span
      style={{
        display: "inline-block",
        y,
        opacity: opacityTarget,
        color: color,
        transition: "opacity 0.3s ease, color 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {char}
    </motion.span>
  );
});

export default function DistortedText({ text = "", activeIndex, onEnter, onLeave, color, style }) {
  return (
    <div 
      className="inline-flex relative overflow-visible" 
      style={{ ...style, cursor: "none" }}
      onMouseLeave={onLeave}
    >
      {text.split("").map((char, i) => (
        <span 
          key={i} 
          onMouseEnter={() => onEnter(i)}
          className="relative inline-block"
        >
          <Letter 
            char={char} 
            index={i} 
            activeIndex={activeIndex} 
            color={color} 
          />
        </span>
      ))}
    </div>
  );
}