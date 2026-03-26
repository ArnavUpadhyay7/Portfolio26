import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CREAM = "#EAE4D5";
const E     = [0.16, 1, 0.3, 1];

export function ProductBlock({ product, index }) {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const isEven = index % 2 === 0;
  // Route: /elevate or /zentra directly
  const route  = `/${product.id}`;

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(route)}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: E, delay: index * 0.08 }}
      className="relative px-10 lg:px-20 py-24 border-b border-white/5 transition-colors duration-700"
      style={{
        backgroundColor: hovered ? `${product.accent}06` : "transparent",
        fontFamily:      "'Geist', sans-serif",
        cursor:          "pointer",        // custom cursor stays active
      }}
    >
      {/* Subtle accent glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity:    hovered ? 1 : 0,
          background: `radial-gradient(ellipse 60% 50% at ${isEven ? "80%" : "20%"} 50%, ${product.accent}08, transparent)`,
        }}
      />

      <div className={`relative flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-24 ${!isEven ? "lg:flex-row-reverse" : ""}`}>

        {/* ── TEXT SIDE ── */}
        <div className="flex flex-col gap-8 lg:w-5/12">

          {/* Index + animated line */}
          <div className="flex items-center gap-4">
            <span
              className="text-[9px] tracking-[0.5em] uppercase"
              style={{ color: "rgba(255,255,255,0.18)", fontWeight: 300 }}
            >
              0{index + 1}
            </span>
            <motion.div
              animate={{ width: hovered ? 48 : 16 }}
              transition={{ duration: 0.4, ease: E }}
              className="h-px"
              style={{ background: `${product.accent}50` }}
            />
          </div>

          {/* Product name */}
          <motion.h2
            animate={{ color: hovered ? product.accent : CREAM }}
            transition={{ duration: 0.4, ease: E }}
            style={{
              fontFamily:    "'Barlow Condensed', sans-serif",
              fontWeight:    800,
              fontSize:      "clamp(3.5rem, 7vw, 7rem)",
              lineHeight:    0.88,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {product.name}
          </motion.h2>

          {/* Hook */}
          <p
            className="text-base font-light leading-relaxed transition-opacity duration-500"
            style={{
              color:     hovered ? "rgba(234,228,213,0.85)" : "rgba(234,228,213,0.4)",
              maxWidth:  "34ch",
            }}
          >
            {product.hook}
          </p>

          {/* Description */}
          <p
            className="text-sm font-light leading-loose transition-opacity duration-700"
            style={{
              color:    hovered ? "rgba(234,228,213,0.45)" : "rgba(234,228,213,0.2)",
              maxWidth: "38ch",
            }}
          >
            {product.desc}
          </p>

          {/* Stack tags */}
          <div className="flex flex-wrap gap-2">
            {product.stack.map(tech => (
              <span
                key={tech}
                className="text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full transition-all duration-500"
                style={{
                  fontWeight: 300,
                  color:      hovered ? `${product.accent}90` : "rgba(255,255,255,0.22)",
                  border:     `1px solid ${hovered ? `${product.accent}35` : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA — stops propagation so only the button nav fires, not double-nav */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.stopPropagation(); navigate(route); }}
            className="self-start flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase py-3 px-6 rounded-full transition-all duration-300"
            style={{
              fontWeight: 400,
              color:      hovered ? product.accent : "rgba(255,255,255,0.3)",
              border:     `1px solid ${hovered ? `${product.accent}60` : "rgba(255,255,255,0.1)"}`,
              background: hovered ? `${product.accent}08` : "transparent",
            }}
          >
            View Case Study
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.3, ease: E }}
            >
              →
            </motion.span>
          </motion.button>
        </div>

        {/* ── IMAGE SIDE ── */}
        <div className="lg:w-7/12">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.0, ease: E, delay: 0.12 + index * 0.06 }}
            className="relative overflow-hidden rounded-sm"
            style={{
              aspectRatio: "16 / 10",
              background:  "linear-gradient(135deg, #111 0%, #0d0d0d 100%)",
              border:      "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <motion.img
              src={product.mockup.src}
              alt={product.name}
              animate={{
                scale:  hovered ? 1.04 : 1,
                filter: hovered
                  ? "grayscale(0%) brightness(1)"
                  : "grayscale(80%) brightness(0.55)",
              }}
              transition={{ duration: 0.9, ease: E }}
              className="w-full h-full object-contain p-8 lg:p-10"
            />

            {/* Accent overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
              style={{
                opacity:    hovered ? 0.08 : 0,
                background: `radial-gradient(circle at center, ${product.accent}, transparent 70%)`,
              }}
            />

            {/* Corner label */}
            <div className="absolute bottom-4 right-5">
              <span
                className="text-[8px] tracking-[0.22em] uppercase transition-opacity duration-500"
                style={{
                  fontWeight: 300,
                  color:      hovered ? `${product.accent}70` : "rgba(255,255,255,0.15)",
                }}
              >
                {product.name} / Preview
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}