import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Loader from "../components/Loader";
import ProductsSection from "../components/ProductsSection";
import HeroSection from "../components/HeroSection";

const CREAM = "#EAE4D5";

function GlobalStyles() {
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "global-landing";
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
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

  // Scroll progress over the FULL page
  const { scrollYProgress } = useScroll();

  // Hero shrinks + fades as you scroll into the products section
  const heroScale   = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  // Products panel slides up from below the fold
  // [0 → 0.2] products travels from 100vh → 0
  const productsY = useTransform(scrollYProgress, [0, 0.22], ["100vh", "0vh"]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#0a0a0a] w-full">
      <GlobalStyles />
      <Loader onComplete={() => setHeroVisible(true)} />

      <main className="relative w-full">
        <motion.div
          style={{
            scale:        heroScale,
            opacity:      heroOpacity,
            position:     "fixed",
            top:          0,
            left:         0,
            width:        "100%",
            height:       "100vh",
            zIndex:       1,
            pointerEvents: "auto",
            transformOrigin: "center top",
          }}
        >
          <HeroSection visible={heroVisible} />
        </motion.div>

        <div style={{ height: "140vh", pointerEvents: "none" }} />

        <motion.div
          style={{
            y:               productsY,
            position:        "relative",
            zIndex:          10,
            backgroundColor: "#0a0a0a",
            // hard shadow to hide the hero peeking beneath during transition
            boxShadow:       "0 -60px 120px 40px #0a0a0a",
          }}
        >
          <ProductsSection />
        </motion.div>
      </main>
    </div>
  );
}