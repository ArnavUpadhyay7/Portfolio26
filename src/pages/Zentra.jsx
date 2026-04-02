import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";
import Zentra_Main from "../assets/videos/Zentra.mp4";
import room from "../assets/zentraImages/room.png";
import elevate_home from "../assets/elevateImages/elevate_home.png";

const CREAM  = "#EAE4D5";
const ORANGE = "#E8400C";
const E      = [0.16, 1, 0.3, 1];

function useFade(margin = "-60px") {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function Label({ children }) {
  return (
    <p className="text-[10px] tracking-[0.4em] uppercase mb-4"
      style={{ color: `${ORANGE}90`, fontWeight: 300, fontFamily: "'Geist', sans-serif" }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="leading-tight mb-6"
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color: CREAM,
      }}>
      {children}
    </h2>
  );
}

function Body({ children }) {
  return (
    <p className="leading-loose max-w-[56ch]"
      style={{ fontFamily: "'Geist', sans-serif", fontWeight: 300, fontSize: "0.95rem", color: "rgba(234,228,213,0.5)" }}>
      {children}
    </p>
  );
}

function Fade({ children, delay = 0, className = "" }) {
  const { ref, inView } = useFade();
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: E, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

function Rule() {
  const { ref, inView } = useFade();
  return (
    <motion.div ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.0, ease: E }}
      className="h-px origin-left my-16 sm:my-20 mx-6 sm:mx-10 lg:mx-20"
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

function HeroVideo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale             = useTransform(scrollYProgress, [0, 0.75], [0.78, 1]);
  const radius            = useTransform(scrollYProgress, [0, 0.75], [14, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>
        <motion.div style={{
          scale, borderRadius: radius,
          position: "absolute", inset: 0,
          overflow: "hidden", willChange: "transform",
        }}>
          <video src={Zentra_Main} autoPlay loop muted playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
          />
        </motion.div>

        <motion.div style={{
          opacity: scrollHintOpacity,
          position: "absolute", bottom: "1.75rem", left: "50%", x: "-50%",
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "0.4rem", pointerEvents: "none", zIndex: 10,
        }}>
          <span style={{
            fontFamily: "'Geist', sans-serif", fontSize: "0.6rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: `${CREAM}55`, fontWeight: 300,
          }}>Scroll</span>
          <motion.svg width="10" height="6" viewBox="0 0 10 6" fill="none"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M1 1L5 5L9 1" stroke={`${CREAM}45`} strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}

// Mobile: static image shown instead of scroll video
function MobileHeroCover() {
  return (
    <Fade>
      <div className="mx-6 mt-2 mb-4 rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={room} alt="Zentra world" className="w-full block" />
      </div>
    </Fade>
  );
}

export default function Zentra() {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]"
      style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>
      <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Geist:wght@200;300;400&display=swap" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-5 sm:py-6"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => navigate("/")}
          className="text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{ color: CREAM, fontWeight: 300 }}>
          ← Back
        </button>
        <span className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Zentra / Case Study
        </span>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <div className="hidden sm:block absolute inset-x-0 top-0 h-105 lg:h-150 pointer-events-none" style={{ zIndex: 0 }}>
          <img src="https://i.pinimg.com/1200x/87/7b/cc/877bcca2b98f312f4c79c7f6b6473f1c.jpg"
            alt="" aria-hidden="true"
            className="w-full h-full" style={{ display: "block" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.85) 80%, #0a0a0a 100%)" }} />
        </div>

        <div className="relative" style={{ zIndex: 1 }}>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.1 }}
            className="text-[10px] tracking-[0.4em] uppercase mb-6 sm:mb-8"
            style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
            Product · 2026
          </motion.p>

          <div className="overflow-hidden mb-4 sm:mb-6">
            <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }}
              transition={{ duration: 1.0, ease: E, delay: 0.15 }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                fontSize: "clamp(3.5rem, 13vw, 12rem)", lineHeight: 0.88,
                letterSpacing: "-0.03em", textTransform: "uppercase", color: CREAM,
              }}>
              Zentra
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.3 }}
            className="text-base sm:text-xl font-light leading-relaxed max-w-[48ch] mb-10 sm:mb-14"
            style={{ color: "rgba(234,228,213,0.5)" }}>
            A 2D spatial world for hanging out online. Create a room in one click,
            share a link, move around together, talk — no account, no setup, no friction.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.5 }}
            className="flex items-center gap-3">
            <a href="https://zentra-space.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{ background: ORANGE, color: "#080808", fontFamily: "'Geist', sans-serif", fontWeight: 500, letterSpacing: "0.12em", borderRadius: "2px" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="#080808" />
                <circle cx="6" cy="6" r="5" stroke="#080808" strokeWidth="1" />
                <path d="M4 6c0-1.1.4-2.1 1-2.8M8 6c0 1.1-.4 2.1-1 2.8M3 6h6M3.5 4h5M3.5 8h5"
                  stroke="#080808" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              Live Site
            </a>
            <a href="https://github.com/ArnavUpadhyay7/zentra" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{ background: "transparent", color: "rgba(234,228,213,0.55)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Geist', sans-serif", fontWeight: 300, letterSpacing: "0.12em", borderRadius: "2px" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)"; e.currentTarget.style.color = "rgba(234,228,213,0.85)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(234,228,213,0.55)"; }}>
              <svg width="20" height="20" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1a5.5 5.5 0 00-1.739 10.716c.275.05.376-.119.376-.265 0-.131-.005-.477-.008-.936-1.531.333-1.854-.738-1.854-.738-.25-.636-.611-.805-.611-.805-.5-.341.038-.334.038-.334.552.039.843.567.843.567.491.841 1.288.598 1.602.457.05-.355.192-.598.35-.735-1.222-.139-2.508-.611-2.508-2.72 0-.601.215-1.092.567-1.477-.057-.138-.246-.699.054-1.457 0 0 .462-.148 1.513.564a5.27 5.27 0 011.379-.186c.467.002.938.063 1.378.186 1.05-.712 1.511-.564 1.511-.564.301.758.112 1.319.055 1.457.353.385.566.876.566 1.477 0 2.115-1.288 2.58-2.514 2.716.198.17.374.506.374 1.02 0 .736-.007 1.329-.007 1.51 0 .147.099.318.378.264A5.501 5.501 0 006.5 1z"
                  fill="currentColor" />
              </svg>
              GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* VIDEO — desktop scroll-driven / mobile static (only shown once) */}
      {isMobile ? <MobileHeroCover /> : <HeroVideo />}

      <Rule />

      {/* ── WHAT IS IT ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <Fade>
            <Label>The Idea</Label>
            <SectionHeading>Online hangouts shouldn't feel like work.</SectionHeading>
            <Body>
              Discord calls, Google Meet, Zoom — they're all built around the premise
              that you have something to discuss. Zentra is built for when you just
              want to be somewhere together. Move around, wander into someone's space,
              talk when you're close. Leave when you're not.
            </Body>
          </Fade>

          {/* Meta strip */}
          <Fade delay={0.1}>
            <div className="flex flex-col gap-px rounded-sm overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Role",  value: "Full Stack Dev" },
                { label: "Stack", value: "React · Node · Socket.io · Phaser.js · LiveKit" },
                { label: "Team",  value: "Solo" },
                { label: "Year",  value: "2026" },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className="flex items-baseline justify-between gap-6 px-5 py-4"
                  style={{
                    background: "#0d0d0d",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                  <span className="text-[9px] tracking-[0.3em] uppercase shrink-0"
                    style={{ color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>{label}</span>
                  <span className="text-sm font-light text-right"
                    style={{ color: "rgba(234,228,213,0.65)" }}>{value}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* ── ROOM SCREENSHOT — desktop only, 80% centered ── */}
      <section className="hidden sm:block px-6 sm:px-10 lg:px-20 mb-4">
        <Fade className="flex flex-col items-center gap-3">
          <div className="rounded-sm overflow-hidden"
            style={{
              width: "80%",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "#0e0e0e",
            }}>
            <img src={room} alt="Zentra shared world" className="w-full block" />
          </div>
          <p className="text-[9px] tracking-[0.2em] uppercase opacity-20"
            style={{ fontFamily: "'Geist', sans-serif" }}>
            Shared world — move around, see each other in real time
          </p>
        </Fade>
      </section>

      <Rule />

      {/* ── ZERO FRICTION ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Design Philosophy</Label>
          <SectionHeading>No database. On purpose.</SectionHeading>
        </Fade>

        <Fade delay={0.08} className="mt-6 mb-10">
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.6rem)",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "rgba(234,228,213,0.08)",
            lineHeight: 1.2,
            maxWidth: "780px",
          }}>
            Every platform that asks you to sign up is making a bet you'll come back.
            Zentra doesn't make that bet.
          </p>
        </Fade>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <Fade>
            <Body>
              Rooms are ephemeral — they exist while people are in them and vanish when they leave.
              No data stored, no cleanup needed, no privacy policy required.
              It's disposable by design, like a phone call, not a project board.
            </Body>
            <div className="mt-5">
              <Body>
                This isn't cutting corners on auth. It's a deliberate call: sign-up friction kills
                casual use. If you have to create an account to hang out for 20 minutes,
                you'll just open Discord instead.
              </Body>
            </div>
          </Fade>

          {/* Three pillars as a tight list */}
          <Fade delay={0.1} className="flex flex-col gap-px rounded-sm overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { n: "No accounts",  d: "Nothing to sign up for. Nothing to forget." },
              { n: "No database",  d: "Rooms live in memory. Gone when you leave." },
              { n: "No install",   d: "Browser only. A link is all you need." },
            ].map(({ n, d }, i, arr) => (
              <div key={n} className="flex items-center gap-5 px-5 py-5"
                style={{
                  background: "#0d0d0d",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                <span className="shrink-0 w-0.75 h-0.75 rounded-full"
                  style={{ background: `${ORANGE}55` }} />
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "1rem", letterSpacing: "0.03em",
                  textTransform: "uppercase", color: CREAM, minWidth: "120px",
                }}>{n}</span>
                <span style={{
                  fontFamily: "'Geist', sans-serif", fontWeight: 300,
                  fontSize: "0.8rem", color: "rgba(234,228,213,0.3)",
                }}>{d}</span>
              </div>
            ))}
          </Fade>
        </div>
      </section>

      <Rule />

      {/* ── FEATURES ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Features</Label>
          <SectionHeading>Small surface area. Does what it says.</SectionHeading>
        </Fade>

        <div className="mt-10 sm:mt-12 flex flex-col gap-px rounded-sm overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { n: "01", h: "Create a room in one click",      b: "A room is created and a shareable link is generated. Send it, they're in." },
            { n: "02", h: "Move around a shared 2D world",   b: "Phaser.js renders the world. Socket.io keeps everyone's position in sync in real time." },
            { n: "03", h: "Proximity audio",                 b: "Built on LiveKit. Walk close — audio opens. Walk away — it closes. No button." },
            { n: "04", h: "Group text chat",                 b: "Shared chat panel for the whole room. For links, reactions, or when audio is off." },
          ].map(({ n, h, b }, i, arr) => (
            <Fade key={n}>
              <div className="grid grid-cols-[40px_1fr] sm:grid-cols-[80px_1fr_2fr] gap-4 sm:gap-8 px-6 sm:px-8 py-6 sm:py-7 items-start"
                style={{
                  background: i % 2 === 0 ? "#0d0d0d" : "#0b0b0b",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.2s",
                }}>
                <span className="text-[10px] tracking-[0.3em] uppercase pt-0.75"
                  style={{ color: `${ORANGE}45`, fontWeight: 300 }}>{n}</span>
                <p className="text-sm font-normal"
                  style={{ color: CREAM, fontFamily: "'Geist', sans-serif" }}>{h}</p>
                {/* Description hidden on mobile to keep it tight */}
                <p className="hidden sm:block text-sm font-light leading-loose"
                  style={{ color: "rgba(234,228,213,0.38)", fontFamily: "'Geist', sans-serif" }}>{b}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── TECH STACK ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <Fade>
            <Label>Tech Stack</Label>
            <SectionHeading>Chosen for lightness, not familiarity.</SectionHeading>
            <Body>
              No database meant no ORM, no migrations, no connection pooling.
              The stack shrinks to what actually runs the experience —
              real-time sync, 2D rendering, and spatial audio.
            </Body>
          </Fade>

          <Fade delay={0.1} className="flex flex-col gap-px rounded-sm overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { name: "React",           role: "UI layer" },
              { name: "Node + Express",  role: "Server — stateless, no DB" },
              { name: "Socket.io",       role: "Real-time position + room state" },
              { name: "Phaser.js",       role: "2D world + avatar rendering" },
              { name: "LiveKit",         role: "Proximity spatial audio" },
            ].map(({ name, role }, i, arr) => (
              <div key={name} className="flex items-center justify-between px-5 py-4"
                style={{
                  background: "#0d0d0d",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "1.05rem", letterSpacing: "0.02em",
                  textTransform: "uppercase", color: CREAM,
                }}>{name}</span>
                <span style={{
                  fontFamily: "'Geist', sans-serif", fontWeight: 300,
                  fontSize: "0.78rem", color: "rgba(234,228,213,0.28)",
                  letterSpacing: "0.04em",
                }}>{role}</span>
              </div>
            ))}
          </Fade>
        </div>
      </section>

      <Rule />

      {/* ── WHAT'S COMING ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>What's Coming</Label>
          <SectionHeading>Games to do together in the world.</SectionHeading>
          <Body>
            The next version adds things to actually do inside the room —
            not productivity features, just stuff that makes hanging out more fun.
          </Body>
        </Fade>

        <div className="mt-10 sm:mt-12 grid sm:grid-cols-3 gap-4">
          {[
            { h: "Collaborative puzzles", b: "Logic or tile-based puzzles that need multiple people to solve. Good for synergy, good for killing time." },
            { h: "Mini games",            b: "Small competitive or co-op games inside the world. Nothing that takes 30 minutes to learn." },
            { h: "Shared canvas",         b: "A drawing board for the whole room. Sketch, annotate, draw something dumb together." },
          ].map(({ h, b }) => (
            <Fade key={h}>
              <div className="rounded-sm p-6 flex flex-col gap-4 h-full"
                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="self-start text-[8px] tracking-[0.3em] uppercase px-2 py-1"
                  style={{
                    color: `${ORANGE}55`,
                    border: `1px dashed ${ORANGE}25`,
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 300,
                    borderRadius: "2px",
                  }}>
                  Planned
                </span>
                <p className="text-sm font-normal" style={{ color: CREAM, fontFamily: "'Geist', sans-serif" }}>{h}</p>
                <p className="text-sm font-light leading-loose mt-auto"
                  style={{ color: "rgba(234,228,213,0.38)", fontFamily: "'Geist', sans-serif" }}>{b}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── LEARNINGS ── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Key Learnings</Label>
          <SectionHeading>What building this taught me.</SectionHeading>
        </Fade>
        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-8 sm:gap-10">
          {[
            { n: "01", h: "Constraints are product decisions.",    b: "No database wasn't a shortcut — it shaped every feature. The constraint became the identity." },
            { n: "02", h: "LiveKit over raw WebRTC — every time.", b: "Proximity audio in raw WebRTC would've taken weeks. LiveKit reduced it to days. Knowing which abstractions to trust is part of shipping." },
            { n: "03", h: "Phaser and React don't share state.",   b: "State lives in React. The world lives in Phaser. The moment you try to mix them, both break. Keep the boundary clean." },
            { n: "04", h: "The best onboarding is no onboarding.", b: "Removing sign-up was the single best product decision here. Every step you remove doubles the chance someone actually tries it." },
          ].map(({ n, h, b }) => (
            <Fade key={n}>
              <div className="flex gap-5 sm:gap-6">
                <span className="text-[10px] tracking-[0.3em] uppercase shrink-0 mt-1"
                  style={{ color: `${ORANGE}60`, fontWeight: 300 }}>{n}</span>
                <div>
                  <p className="text-sm font-normal mb-2" style={{ color: CREAM }}>{h}</p>
                  <p className="text-sm font-light leading-loose" style={{ color: "rgba(234,228,213,0.4)" }}>{b}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* ── NEXT PROJECT ── */}
      <section className="px-6 sm:px-10 lg:px-20 pb-24 sm:pb-32">
        <Fade>
          <p className="text-[9px] tracking-[0.3em] uppercase mb-6 sm:mb-8"
            style={{ color: "rgba(255,255,255,0.18)" }}>Next Project</p>
        </Fade>
        <Fade delay={0.08}>
          <button onClick={() => navigateWithTransition("/elevate")} className="group w-full text-left">
            <div className="relative overflow-hidden rounded-sm transition-all duration-700"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "21/9" }}>
                <img src={elevate_home} alt="Elevate cover"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(13,13,13,0.6) 80%, #0d0d0d 100%)" }} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, #0d0d0d 0%, transparent 15%, transparent 85%, #0d0d0d 100%)" }} />
              </div>
              <div className="px-6 sm:px-10 pb-6 sm:pb-10 pt-4 flex items-end justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase mb-2 sm:mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}>Valorant Coaching</p>
                  <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                    fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.02em",
                    textTransform: "uppercase", color: CREAM,
                  }}>Elevate</h3>
                </div>
                <span className="text-[10px] tracking-[0.25em] uppercase transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-1"
                  style={{ color: ORANGE }}>
                  View Case Study →
                </span>
              </div>
            </div>
          </button>
        </Fade>
      </section>
    </div>
  );
}