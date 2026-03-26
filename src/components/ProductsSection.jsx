import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ProductBlock } from "./ProductBlock";

import ElevateThumbnail from "../assets/thumbnails/elevate.png";
import ZentraThumbnail from "../assets/thumbnails/zentra.png";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";
const E = [0.16, 1, 0.3, 1];

const PRODUCTS = [
  {
    id: "elevate",
    name: "Elevate",
    hook: "Learn faster. Build sooner. Ship earlier.",
    desc: "An adaptive learning platform for developers. Curated paths, live coding environments, and progress tracking — all in one focused interface.",
    stack: ["Next.js", "MongoDB", "Tailwind", "OpenAI"],
    accent: ORANGE,
    mockup: { src: ElevateThumbnail },
  },
  {
    id: "zentra",
    name: "Zentra",
    hook: "The operating system for modern teams.",
    desc: "Real-time project management built for speed. Assign, track, and ship — without the noise. Designed around how async teams actually work.",
    stack: ["MERN", "Socket.io", "Tailwind", "Redis"],
    accent: CREAM,
    mockup: { src: ZentraThumbnail },
  },
];

export default function ProductsSection() {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative w-full bg-[#0a0a0a]"
      style={{ fontFamily: "'Geist', sans-serif" }}>
      {/* ── Section Header ── */}
      <div ref={headRef} className="px-10 lg:px-20 pt-28 pb-16">
        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, ease: E }}
          className="h-px w-full origin-left mb-12"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* Label row */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[10px] tracking-[0.4em] uppercase mb-6"
          style={{ color: `${ORANGE}80`, fontWeight: 300 }}>
          Studio Archive
        </motion.p>

        {/* Heading: ~~Projects~~ Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: E, delay: 0.18 }}
          className="flex items-baseline gap-6 flex-wrap">
          <span
            className="line-through leading-none select-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              color: "rgba(234,228,213,0.12)",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}>
            Projects
          </span>
          <span
            className="leading-none select-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              color: CREAM,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}>
            Products
          </span>
          <span
            className="text-[10px] tracking-[0.2em] uppercase self-center"
            style={{ color: `${ORANGE}60`, fontWeight: 300 }}>
            ({PRODUCTS.length})
          </span>
        </motion.div>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={headInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: E, delay: 0.28 }}
          className="mt-5 text-[11px] tracking-[0.18em] uppercase"
          style={{ color: "rgba(234,228,213,0.2)", fontWeight: 300 }}>
          Things I shipped, not just built.
        </motion.p>
      </div>

      {/* ── Product Blocks ── */}
      <div className="border-t border-white/5">
        {PRODUCTS.map((product, i) => (
          <ProductBlock key={product.id} product={product} index={i} />
        ))}
      </div>

      {/* Bottom rule */}
      <div
        className="h-px w-full mx-auto"
        style={{ background: `${ORANGE}20` }}
      />

      {/* Footer breathing room */}
      <div className="h-32" />
    </section>
  );
}
