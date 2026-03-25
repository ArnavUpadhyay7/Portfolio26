/**
 * Zentra.jsx — Case Study
 * 2D spatial world / virtual office platform
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
      className="h-px origin-left my-20 mx-10 lg:mx-20"
      style={{ background: "rgba(255,255,255,0.07)", width: "calc(100% - 5rem)" }}
    />
  );
}

export default function Zentra() {
  const navigate = useNavigate();

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
          Zentra / Case Study
        </span>
      </nav>

      {/* HERO */}
      <section className="px-10 lg:px-20 pt-40 pb-20">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[10px] tracking-[0.4em] uppercase mb-8"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Product · 2025
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
            Zentra
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: E, delay: 0.3 }}
          className="text-xl font-light leading-relaxed max-w-[48ch] mb-16"
          style={{ color: "rgba(234,228,213,0.5)" }}>
          A 2D spatial world for remote teams. Move around a virtual office, walk into meetings,
          and feel the ambient presence of your teammates — without being on a call all day.
        </motion.p>

        {/* Meta */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: E, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Role",  value: "Full Stack Dev" },
            { label: "Stack", value: "MERN · Socket.io · Tailwind · Redis" },
            { label: "Team",  value: "2 Engineers" },
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
        <Fade><VideoPlaceholder label="Main product walkthrough — spatial world" /></Fade>
      </section>

      {/* Two screenshots */}
      <section className="px-10 lg:px-20 grid grid-cols-2 gap-4 mb-4">
        <Fade delay={0.05}><ImgPlaceholder label="World overview screenshot" /></Fade>
        <Fade delay={0.1}><ImgPlaceholder label="Avatar + proximity chat UI" /></Fade>
      </section>

      <Rule />

      {/* PROBLEM */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade>
            <Label>The Problem</Label>
            <SectionHeading>Remote work killed ambient presence. We're all on calls or completely invisible.</SectionHeading>
            <Body>
              The office wasn't just a place to work — it was a place where you could feel who was around,
              overhear a conversation, or catch someone between meetings. Remote tools gave us chat and video calls.
              They didn't give us the hallway. Zentra does.
            </Body>
          </Fade>
          <Fade delay={0.1}>
            <ImgPlaceholder label="Remote work pain points research" aspect="4/3" />
          </Fade>
        </div>
      </section>

      <Rule />

      {/* INSIGHT 1 */}
      <section className="px-10 lg:px-20 mb-24">
        <Fade>
          <Label>Key Insight</Label>
          <SectionHeading>People don't want more meetings. They want to know who's around.</SectionHeading>
          <Body>
            Research with remote workers surfaced one consistent frustration:
            the overhead of scheduling a call to ask a 30-second question.
            Proximity-based audio in a spatial world removes that overhead entirely.
            Walk over, talk, walk away. No invite link needed.
          </Body>
        </Fade>
        <Fade delay={0.1} className="mt-12">
          <ImgPlaceholder label="User research synthesis / quotes" />
        </Fade>
        <p className="text-[9px] tracking-[0.2em] uppercase mt-3 opacity-20 px-10 lg:px-0"
          style={{ fontFamily: "'Geist', sans-serif" }}>Remote worker interviews — key themes</p>
      </section>

      <Rule />

      {/* INSIGHT 2 */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade delay={0.05}><ImgPlaceholder label="Gather.town / Teamflow competitive analysis" aspect="4/3" /></Fade>
          <Fade>
            <Label>Key Insight</Label>
            <SectionHeading>Existing spatial tools feel like games. Teams don't adopt games.</SectionHeading>
            <Body>
              Gather.town and similar tools lean into pixel art and game aesthetics. That lowers the perceived legitimacy
              for professional teams. Zentra's visual language is minimal and abstract — it reads like a productivity tool,
              not an MMO. Adoption follows trust.
            </Body>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* SOLUTION 1 */}
      <section className="px-10 lg:px-20 mb-10">
        <Fade>
          <Label>Solution</Label>
          <SectionHeading>Proximity audio that just works — no buttons, no calls.</SectionHeading>
          <Body>
            Move your avatar within range of a teammate and audio opens automatically.
            Walk away and it closes. The interaction model is spatial, not transactional.
            Built on WebRTC with Redis pub/sub for sub-50ms position sync across rooms.
          </Body>
        </Fade>
      </section>
      <section className="px-10 lg:px-20 mb-4">
        <Fade><VideoPlaceholder label="Proximity audio demo — two avatars meeting" /></Fade>
      </section>
      <p className="text-[9px] tracking-[0.2em] uppercase mt-3 opacity-20 px-10 lg:px-20"
        style={{ fontFamily: "'Geist', sans-serif" }}>Proximity audio — live demo</p>

      <Rule />

      {/* SOLUTION 2 */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade>
            <Label>Solution</Label>
            <SectionHeading>Persistent rooms for focused work — with presence signals.</SectionHeading>
            <Body>
              Teams define their space: a deep work zone, a lounge, a war room.
              Avatars carry status signals — focused, available, in a call.
              Presence is visible at a glance without a DM, a ping, or a check-in.
              The world reflects the team's actual rhythm.
            </Body>
          </Fade>
          <Fade delay={0.1}><VideoPlaceholder label="Persistent rooms + status signals demo" tall /></Fade>
        </div>
      </section>

      <Rule />

      {/* TECHNICAL */}
      <section className="px-10 lg:px-20 mb-24">
        <Fade>
          <Label>Technical Depth</Label>
          <SectionHeading>Real-time position sync at scale.</SectionHeading>
          <Body>
            The core challenge was broadcasting avatar position to all connected clients with minimal latency.
            Socket.io rooms handle per-world namespacing. Redis pub/sub syncs state across server instances.
            Canvas rendering via a custom React hook keeps the world at 60fps even with 50+ concurrent avatars.
          </Body>
        </Fade>
        <Fade delay={0.08} className="mt-12 grid grid-cols-2 gap-4">
          <ImgPlaceholder label="Architecture diagram" />
          <ImgPlaceholder label="Latency benchmark screenshot" />
        </Fade>
      </section>

      <Rule />

      {/* DESIGN DECISION */}
      <section className="px-10 lg:px-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Fade delay={0.05}><ImgPlaceholder label="Avatar design explorations" aspect="4/3" /></Fade>
          <Fade>
            <Label>Design Decision</Label>
            <SectionHeading>Minimal avatars. Maximum readability.</SectionHeading>
            <Body>
              Avatars are geometric — a circle with a status ring, a name tag, a presence indicator.
              No pixel art, no customization rabbit holes. The world is the product, not the avatar.
              Teams can tell who's where and what they're doing in under a second.
            </Body>
          </Fade>
        </div>
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
            { n: "01", h: "Real-time is a product decision, not just a technical one.", b: "Choosing WebSockets shaped every interaction in the product. The technical constraint became the design constraint. They can't be separated." },
            { n: "02", h: "Presence is subtle. Don't over-engineer it.", b: "Early versions had too many status options. Teams need three states: available, focused, away. Everything else is noise that makes the signal harder to read." },
            { n: "03", h: "Performance is UX.", b: "A spatial world that lags feels broken, even if the features are perfect. Spending time on rendering optimization wasn't yak shaving — it was building the product." },
            { n: "04", h: "Trust the spatial metaphor.", b: "Every time we added a traditional UI pattern — a chat sidebar, a member list — it undermined the spatial premise. The world should do the work. Trust it." },
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
          <button onClick={() => navigate("/elevate")} className="group w-full text-left">
            <div className="relative overflow-hidden rounded-sm p-10 transition-colors duration-500 hover:bg-white/[0.02]"
              style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ImgPlaceholder label="Elevate cover image" aspect="21/6" />
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>Valorant Coaching</p>
                  <h3 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 5vw, 4rem)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    color: CREAM,
                  }}>Elevate</h3>
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