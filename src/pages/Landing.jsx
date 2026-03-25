import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Loader from "../components/Loader";
import ProductsSection from "../components/ProductsSection";
import HeroSection from "../components/HeroSection";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";

function GlobalStyles() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      *
      body { 
        background: #0a0a0a; 
        color: ${CREAM}; 
        overflow-x: hidden;
        margin: 0;
        padding: 0;
      }
      ::-webkit-scrollbar { display: none; }
      scrollbar-width: none;
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  return null;
}

export default function Landing() {
  const [heroVisible, setHeroVisible] = useState(false);

  // 1. Get raw scroll progress
  const { scrollYProgress } = useScroll();

  // 2. STABLE TRANSFORMS 
  // We use scrollYProgress directly to avoid useSpring initialization bugs
  const heroScale   = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const productsY   = useTransform(scrollYProgress, [0, 0.45], ["100vh", "0vh"]);
  
  // Bloom values - simplified
  const hOpac   = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const hLetter = useTransform(scrollYProgress, [0.4, 0.6], ["-0.05em", "0.05em"]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#0a0a0a] relative w-full">
      <GlobalStyles />
      <Loader onComplete={() => setHeroVisible(true)} />

      <main className="relative w-full">
        {/* HERO: Background layer */}
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1,
            pointerEvents: heroVisible ? "auto" : "none",
          }}
        >
          <HeroSection visible={heroVisible} />
        </motion.div>

        {/* PRODUCTS: Foreground layer */}
        <motion.div
          style={{
            y: productsY,
            position: "relative",
            zIndex: 10,
            backgroundColor: "#0a0a0a",
            boxShadow: "0 -20vh 100px rgba(0,0,0,0.9)",
          }}
        >
          {/* IMPORTANT: Ensure ProductsSection consumes headerOpacity and headerLetterSpacing as MOTION values */}
          <ProductsSection 
            headerOpacity={hOpac} 
            headerLetterSpacing={hLetter} 
          />
        </motion.div>
        
        {/* Forces the page to have height to allow scrolling */}
        <div className="h-[150vh] w-full pointer-events-none" />
      </main>
    </div>
  );
}