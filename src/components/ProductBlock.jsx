import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const E = [0.16, 1, 0.3, 1];

export function ProductBlock({ product, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      ref={ref} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative px-6 lg:px-20 py-32 border-b border-white/5 transition-colors duration-700 ease-in-out"
      style={{ 
        backgroundColor: isHovered ? `${product.accent}05` : "transparent" 
      }}
    >
      <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${index % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
        
        {/* ── LEFT: CONTENT ── */}
        <div className="flex flex-col lg:w-5/12 items-start text-left z-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] tracking-[0.5em] text-white/20 uppercase font-mono">
              0{index + 1}
            </span>
            <motion.div 
              animate={{ width: isHovered ? 60 : 20 }}
              className="h-px bg-white/10" 
            />
          </div>

          <h2 
            className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10 uppercase transition-colors duration-500"
            style={{ 
              color: isHovered ? product.accent : "white",
              fontFamily: "'Barlow Condensed', sans-serif" 
            }}
          >
            {product.name}
          </h2>

          <div className="space-y-10">
            <p className={`text-xl font-light leading-snug max-w-sm transition-opacity duration-500 ${isHovered ? "text-white/90" : "text-white/40"}`}>
              {product.hook}
            </p>
            
            {/* Tech Stack: Clean Typographic List */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {product.stack.map(tech => (
                <span key={tech} className="text-[9px] tracking-[0.2em] uppercase text-white/30">
                  {tech}
                </span>
              ))}
            </div>

            <button className={`text-[10px] uppercase tracking-[0.4em] pb-2 border-b transition-all duration-500 ${isHovered ? "text-white border-white" : "text-white/20 border-white/5"}`}>
              Explore Project
            </button>
          </div>
        </div>

        {/* ── RIGHT: IMAGE PORTAL ── */}
        <div className="lg:w-7/12 w-full">
          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#0c0c0c] shadow-2xl">
            {/* The Image Logic */}
            <motion.img 
              src={product.mockup.src} 
              alt={product.name}
              initial={{ filter: "grayscale(100%) opacity(0.3)" }}
              animate={{ 
                filter: isHovered ? "grayscale(0%) opacity(1)" : "grayscale(100%) opacity(0.3)",
                scale: isHovered ? 1.05 : 1
              }}
              transition={{ duration: 1, ease: E }}
              className="w-full h-full object-contain p-8 lg:p-12"
            />
            
            {/* Accent Glow Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
              style={{ 
                opacity: isHovered ? 0.1 : 0,
                background: `radial-gradient(circle at center, ${product.accent}, transparent)` 
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}