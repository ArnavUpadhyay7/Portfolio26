import { useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Ensure motion is imported
import { ProductBlock } from "../components/ProductBlock";

import ElevateThumbnail from "../assets/thumbnails/elevate.png";
import ZentraThumbnail from "../assets/thumbnails/zentra.png";

const PRODUCTS = [
  {
    id: "elevate",
    name: "Elevate",
    hook: "Learn faster. Build sooner. Ship earlier.",
    stack: ["Next.js", "MongoDB", "Tailwind", "OpenAI"],
    accent: "#E8400C",
    mockup: { src: ElevateThumbnail },
  },
  {
    id: "zentra",
    name: "Zentra",
    hook: "The operating system for modern teams.",
    stack: ["MERN", "Socket.io", "Tailwind", "Redis"],
    accent: "#EAE4D5",
    mockup: { src: ZentraThumbnail },
  },
];

// 1. Receive the props here
export default function ProductsSection({ headerOpacity, headerLetterSpacing }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleGlobalMouse = (e) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const rect = containerRef.current.getBoundingClientRect();
      containerRef.current.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
      containerRef.current.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
    };
    window.addEventListener("mousemove", handleGlobalMouse);
    return () => window.removeEventListener("mousemove", handleGlobalMouse);
  }, []);

  return (
    <section className="relative w-full bg-[#0a0a0a]">
      {/* Editorial Header */}
      <div className="px-10 lg:px-20 pt-48 pb-24 relative z-10">
        <motion.div style={{ opacity: headerOpacity }} className="h-px w-full bg-white/10 mb-16" />
        <div className="flex flex-col gap-4">
          <motion.h2 style={{ opacity: headerOpacity }} className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-light">
            Studio Archive
          </motion.h2>
          <motion.h3 
            style={{ opacity: headerOpacity, letterSpacing: headerLetterSpacing }}
            className="text-7xl lg:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8]"
          >
            Selected<br/><span className="text-white/10 italic font-serif lowercase">Works</span>
          </motion.h3>
        </div>
      </div>

      <div className="divide-y divide-white/5 border-t border-white/5">
        {PRODUCTS.map((product, i) => (
          <ProductBlock key={product.id} product={product} index={i} />
        ))}
      </div>
      
      {/* Bottom Padding to ensure the Hero doesn't show at the end */}
      <div className="h-[20vh] bg-[#0a0a0a]" />
    </section>
  );
}