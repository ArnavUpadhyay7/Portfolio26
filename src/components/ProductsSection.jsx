import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ProductBlock } from "./ProductBlock";

import ElevateThumbnail from "../assets/thumbnails/elevate.png";
import ZentraThumbnail from "../assets/zentraImages/room.png";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";
const E = [0.16, 1, 0.3, 1];

const PRODUCTS = [
  {
    id: "elevate",
    name: "Elevate",
    hook: "For players who take gaming seriously.",
    desc: "A competitive coaching platform for Valorant players. Get expert guidance, review gameplay, and improve faster with structured feedback and real-time sessions.",
    stack: ["MERN", "Tailwind", "socket.io", "razorpay"],
    accent: ORANGE,
    mockup: { src: ElevateThumbnail },
  },
  {
    id: "zentra",
    name: "Zentra",
    hook: "Zero friction 2d chill space.",
    desc: "A real-time 2D social space where users can move, chat, and connect through text and voice — designed to feel effortless and alive.",
    stack: ["React", "Phaser", "Node", "Express", "WebSocket", "WebRTC", "Tailwind"],
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
          style={{ color: "rgba(234,228,213,0.4)", fontWeight: 300 }}>
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
