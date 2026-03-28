import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Loader from "../components/Loader";
import ProductsSection from "../components/ProductsSection";
import HeroSection from "../components/HeroSection";
import SkillsSection from "../components/SkillsSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";

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

  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0.18, 0.26], [1, 0]);

  // Products panel slides up — unchanged
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
            scale: heroScale,
            opacity: heroOpacity,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            zIndex: 1,
            pointerEvents: "auto",
            transformOrigin: "center top",
          }}>
          <HeroSection visible={heroVisible} />
        </motion.div>

        <div style={{ height: "50vh", pointerEvents: "none" }} />

        <motion.div
          style={{
            y: productsY,
            position: "relative",
            zIndex: 10,
            backgroundColor: "#0a0a0a",
            boxShadow: "0 -60px 120px 40px #0a0a0a",
          }}>
          <ProductsSection />
          <SkillsSection />
          <AboutSection />
          <ContactSection />
        </motion.div>
      </main>
    </div>
  );
}
