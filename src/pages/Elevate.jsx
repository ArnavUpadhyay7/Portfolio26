import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";

const CREAM  = "#EAE4D5";
const ORANGE = "#E8400C";
const E      = [0.16, 1, 0.3, 1];

function useFade(margin = "-60px") {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
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

function VideoPlaceholder({ label = "Video placeholder", tall = false }) {
  return (
    <div className="w-full flex items-center justify-center rounded-sm overflow-hidden"
      style={{ aspectRatio: tall ? "4/3" : "16/9", background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex flex-col items-center gap-3 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke={CREAM} strokeWidth="1"/>
          <polygon points="16,13 30,20 16,27" fill={CREAM}/>
        </svg>
        <span className="text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>{label}</span>
      </div>
    </div>
  );
}

function ImgPlaceholder({ label = "Image placeholder", aspect = "16/9" }) {
  return (
    <div className="w-full flex items-center justify-center rounded-sm"
      style={{ aspectRatio: aspect, background: "#0e0e0e", border: "1px dashed rgba(255,255,255,0.08)" }}>
      <span className="text-[9px] tracking-[0.25em] uppercase opacity-25"
        style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>{label}</span>
    </div>
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
      className="h-px w-full origin-left my-20 mx-10 lg:mx-20"
      style={{ background: "rgba(255,255,255,0.07)", width: "calc(100% - 5rem)" }}
    />
  );
}

export default function Elevate() {
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]" style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Geist:wght@200;300;400&display=swap" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 lg:px-20 py-6"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => navigate("/")}
          className="text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{ color: CREAM, fontWeight: 300 }}>
          ← Back
        </button>
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Elevate / Case Study
        </span>
      </nav>

      {/* HERO */}
      <section className="px-10 lg:px-20 pt-40 pb-20">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[10px] tracking-[0.4em] uppercase mb-8"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Product · 2026
        </motion.p>

        <div className="overflow-hidden mb-6">
          <motion.h1 initial={{ y: "110%" }} animate={{ y: 0 }}
            transition={{ duration: 1.0, ease: E, delay: 0.15 }}
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(4.5rem, 13vw, 12rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: CREAM,
            }}>
            Elevate
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: E, delay: 0.3 }}
          className="text-xl font-light leading-relaxed max-w-[48ch] mb-16"
          style={{ color: "rgba(234,228,213,0.5)" }}>
          A competitive coaching platform built for Valorant players who are serious about ranking up.
          Structured paths, VOD reviews, and live sessions — without the noise of Discord servers.
        </motion.p>

        {/* Meta */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: E, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Role",  value: "Full Stack Dev" },
            { label: "Stack", value: "React.js · MongoDB · OpenAI · Tailwind" },
            { label: "Team",  value: "Solo" },
            { label: "Year",  value: "2025" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[9px] tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.22)", fontWeight: 300 }}>{label}</p>
              <p className="text-sm font-light" style={{ color: "rgba(234,228,213,0.6)" }}>{value}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* MAIN VIDEO */}
      <section className="px-10 lg:px-20 mb-4">
        <Fade><VideoPlaceholder label="Main product walkthrough" /></Fade>
      </section>

      {/* Two screenshots */}
      <section className="px-10 lg:px-20 grid grid-cols-2 gap-4 mb-4">
        <Fade delay={0.05}><ImgPlaceholder label="Dashboard screenshot" /></Fade>
        <Fade delay={0.1}><ImgPlaceholder label="Coaching session UI" /></Fade>
      </section>

      <Rule />

      {/* PROBLEM */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade>
            <Label>The Problem</Label>
            <SectionHeading>Getting better at Valorant requires coaching. Getting coaching is a mess.</SectionHeading>
            <Body>
              The gap between a casual player and a high-rank player isn't mechanics — it's structured feedback.
              Existing options are fragmented: Discord servers full of noise, expensive 1-on-1 sessions with no accountability,
              and YouTube guides that don't adapt to your specific weaknesses. Elevate was built to close that gap.
            </Body>
          </Fade>
          <Fade delay={0.1}>
            <ImgPlaceholder label="Problem space / competitive analysis" aspect="4/3" />
          </Fade>
        </div>
      </section>

      <Rule />

      {/* INSIGHT 1 */}
      <section className="px-10 lg:px-20 mb-24">
        <Fade>
          <Label>Key Insight</Label>
          <SectionHeading>Players know what rank they want. They don't know what to fix.</SectionHeading>
          <Body>
            User interviews revealed a consistent pattern: players have a goal rank in mind but no structured path to get there.
            They grind ranked games reinforcing bad habits instead of breaking them.
            A coaching platform needs to diagnose before it prescribes.
          </Body>
        </Fade>
        <Fade delay={0.1} className="mt-12">
          <ImgPlaceholder label="User research affinity map" />
        </Fade>
        <p className="text-[9px] tracking-[0.2em] uppercase mt-3 opacity-20 px-10 lg:px-0"
          style={{ fontFamily: "'Geist', sans-serif" }}>User interview synthesis</p>
      </section>

      <Rule />

      {/* INSIGHT 2 */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade delay={0.05}><ImgPlaceholder label="Competitor audit" aspect="4/3" /></Fade>
          <Fade>
            <Label>Key Insight</Label>
            <SectionHeading>Existing platforms optimize for revenue, not improvement.</SectionHeading>
            <Body>
              Competitors sell coaching hours. Elevate sells rank improvement. The distinction matters:
              a platform built around hours has no incentive for you to need fewer of them.
              Elevate tracks performance metrics session-over-session, surfacing exactly what's holding you back.
            </Body>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* SOLUTION 1 */}
      <section className="px-10 lg:px-20 mb-10">
        <Fade>
          <Label>Solution</Label>
          <SectionHeading>Structured rank paths with AI-assisted gap analysis.</SectionHeading>
          <Body>
            Elevate generates a personalized improvement roadmap based on your rank, role, and agent pool.
            Each session targets a specific weakness — positioning, economy, ability usage —
            so every hour has a defined outcome.
          </Body>
        </Fade>
      </section>
      <section className="px-10 lg:px-20 mb-4">
        <Fade><VideoPlaceholder label="Rank path builder — feature demo" /></Fade>
      </section>
      <p className="text-[9px] tracking-[0.2em] uppercase mt-3 opacity-20 px-10 lg:px-20"
        style={{ fontFamily: "'Geist', sans-serif" }}>Rank path builder</p>

      <Rule />

      {/* SOLUTION 2 */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade>
            <Label>Solution</Label>
            <SectionHeading>VOD review with timestamped, frame-level feedback.</SectionHeading>
            <Body>
              Coaches annotate recordings frame-by-frame. Players review feedback asynchronously —
              no scheduling conflicts, no $80/hr rates wasted on pleasantries.
              Every note is tied to a specific in-game moment, making feedback immediately actionable.
            </Body>
          </Fade>
          <Fade delay={0.1}><VideoPlaceholder label="VOD review demo" tall /></Fade>
        </div>
      </section>

      <Rule />

      {/* DESIGN DECISION */}
      <section className="px-10 lg:px-20 mb-24">
        <Fade>
          <Label>Design Decision</Label>
          <SectionHeading>Making rank progress feel real, not abstract.</SectionHeading>
          <Body>
            Rank in Valorant is a tier + RR number. Elevate maps that to a visual progress bar anchored to your stated goal —
            so you see not just where you are, but how far the gap has closed since you started.
            Small wins compound. The dashboard makes them visible.
          </Body>
        </Fade>
        <Fade delay={0.08} className="mt-12 grid grid-cols-2 gap-4">
          <ImgPlaceholder label="Progress dashboard" />
          <ImgPlaceholder label="Session history view" />
        </Fade>
      </section>

      <Rule />

      {/* LEARNINGS */}
      <section className="px-10 lg:px-20 mb-24">
        <Fade>
          <Label>Key Learnings</Label>
          <SectionHeading>What building this taught me.</SectionHeading>
        </Fade>
        <div className="mt-10 grid md:grid-cols-2 gap-10">
          {[
            { n: "01", h: "Niche is a feature.", b: "Building for Valorant specifically — not 'esports generally' — made every design decision sharper. The narrower the user, the clearer the product." },
            { n: "02", h: "AI should reduce friction, not add it.", b: "Early versions had too much visible AI surface area. Shipping meant making it invisible: it runs in the background, the user sees the result." },
            { n: "03", h: "Async > sync for early products.", b: "VOD review being async was initially a constraint. It became the biggest advantage — no scheduling friction, higher coach-to-player ratio, better economics." },
            { n: "04", h: "Progress needs to be felt, not just shown.", b: "Users stop using tools when improvement feels invisible. The hardest design problem was making rank progress visceral, not just a number going up." },
          ].map(({ n, h, b }) => (
            <Fade key={n}>
              <div className="flex gap-6">
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

      {/* NEXT */}
      <section className="px-10 lg:px-20 pb-32">
        <Fade>
          <p className="text-[9px] tracking-[0.3em] uppercase mb-8" style={{ color: "rgba(255,255,255,0.18)" }}>Next Project</p>
        </Fade>
        <Fade delay={0.08}>
          <button onClick={() => navigateWithTransition("/zentra")} className="group w-full text-left">
            <div className="relative overflow-hidden rounded-sm p-10 transition-colors duration-500 hover:bg-white/2"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ImgPlaceholder label="Zentra cover image" aspect="21/6" />
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>2D Spatial World</p>
                  <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: CREAM,
                  }}>Zentra</h3>
                </div>
                <span className="text-[10px] tracking-[0.25em] uppercase transition-opacity duration-300 group-hover:opacity-60"
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