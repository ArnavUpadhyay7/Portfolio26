import { useState } from "react";
import { motion } from "framer-motion";
import DistortedText from "../components/DistortedText";

const CREAM = "#EAE4D5";
const RED = "#E8400C";
const E = [0.16, 1, 0.3, 1];

export default function HeroSection({ visible }) {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const isAnyHovered = hoveredWord !== null;

  const nameStyle = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(100px, 23vw, 420px)",
    lineHeight: "0.78",
    letterSpacing: "-0.04em",
    textTransform: "uppercase",
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between px-10 lg:px-20 pt-12 pb-16 bg-[#0a0a0a] overflow-hidden">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
      />

      {/* Top HUD */}
      <div className="flex justify-between items-start z-10">
        <span className="text-[12px] text-red-500 uppercase">Arnav.DEV</span>
        {/* <span className="text-[12px] font-light text-right">2026</span> */}
      </div>

      {/* Main Name Block */}
      <div className="flex flex-col items-start mt-auto">
        {/* ARNAV */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={visible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: E }}>
          <DistortedText
            text="ARNAV"
            activeIndex={hoveredWord === "first" ? activeIndex : null}
            onEnter={(i) => {
              setHoveredWord("first");
              setActiveIndex(i);
            }}
            onLeave={() => {
              setHoveredWord(null);
              setActiveIndex(null);
            }}
            color={isAnyHovered ? RED : CREAM}
            style={nameStyle}
          />
        </motion.div>

        {/* UPADHYAY */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={visible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: E, delay: 0.1 }}>
          <DistortedText
            text="UPADHYAY"
            activeIndex={hoveredWord === "last" ? activeIndex : null}
            onEnter={(i) => {
              setHoveredWord("last");
              setActiveIndex(i);
            }}
            onLeave={() => {
              setHoveredWord(null);
              setActiveIndex(null);
            }}
            color={isAnyHovered ? CREAM : RED}
            style={nameStyle}
          />
        </motion.div>
      </div>

      {/* Bottom HUD */}
      <div className="relative flex justify-between items-end z-10 mt-16">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, ease: E, delay: 0.4 }}
          className="absolute -top-10 left-0 w-full h-px bg-white/10 origin-left"
        />
        <div className="flex flex-col gap-1">
          <span className="text-[9px] tracking-[0.3em] text-white/20 uppercase">
            Role
          </span>
          <span className="text-xs uppercase font-light">
            Frontend Engineer
          </span>
        </div>
        <div className="fixed bottom-6 right-6 flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
          <span>Scroll</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
