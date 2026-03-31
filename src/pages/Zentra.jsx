import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";
import Zentra_Main from "../assets/videos/Zentra.mp4";
import room from "../assets/zentraImages/room.png";
import elevate_home from "../assets/elevateImages/elevate_home.png";

const CREAM = "#EAE4D5";
const ORANGE = "#E8400C";
const E = [0.16, 1, 0.3, 1];

function useFade(margin = "-60px") {
  const ref = useRef(null);
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
    <p
      className="text-[10px] tracking-[0.4em] uppercase mb-4"
      style={{
        color: `${ORANGE}90`,
        fontWeight: 300,
        fontFamily: "'Geist', sans-serif",
      }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      className="leading-tight mb-6"
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
    <p
      className="leading-loose max-w-[56ch]"
      style={{
        fontFamily: "'Geist', sans-serif",
        fontWeight: 300,
        fontSize: "0.95rem",
        color: "rgba(234,228,213,0.5)",
      }}>
      {children}
    </p>
  );
}

function ImgPlaceholder({ label = "Image placeholder", aspect = "16/9" }) {
  return (
    <div
      className="w-full flex items-center justify-center rounded-sm"
      style={{
        aspectRatio: aspect,
        background: "#0e0e0e",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}>
      <span
        className="text-[9px] tracking-[0.25em] uppercase opacity-25"
        style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>
        {label}
      </span>
    </div>
  );
}

function ScreenImg({ src, alt }) {
  return (
    <div
      className="w-full rounded-sm overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#0e0e0e",
      }}>
      <img src={src} alt={alt} className="w-full h-full object-cover block" />
    </div>
  );
}

function Fade({ children, delay = 0, className = "" }) {
  const { ref, inView } = useFade();
  return (
    <motion.div
      ref={ref}
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
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.0, ease: E }}
      className="h-px origin-left my-16 sm:my-20 mx-6 sm:mx-10 lg:mx-20"
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
  );
}

/* ── Scroll-driven hero video — identical mechanic to Elevate ── */
function HeroVideo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.75], [0.78, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.75], [14, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "180vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
        }}>
        <motion.div
          style={{
            scale,
            borderRadius: radius,
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            willChange: "transform",
          }}>
          <video
            src={Zentra_Main}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
            }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{
            opacity: scrollHintOpacity,
            position: "absolute",
            bottom: "1.75rem",
            left: "50%",
            x: "-50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            pointerEvents: "none",
            zIndex: 10,
          }}>
          <span
            style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: `${CREAM}55`,
              fontWeight: 300,
            }}>
            Scroll
          </span>
          <motion.svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <path
              d="M1 1L5 5L9 1"
              stroke={`${CREAM}45`}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Mobile: static room image ── */
function MobileHeroCover() {
  return (
    <Fade>
      <div
        className="mx-6 mt-2 mb-4 rounded-xl overflow-hidden"
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
    <div
      className="min-h-screen w-full bg-[#0a0a0a]"
      style={{ fontFamily: "'Geist', sans-serif", color: CREAM }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Geist:wght@200;300;400&display=swap"
      />

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-5 sm:py-6"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
        <button
          onClick={() => navigate("/")}
          className="text-[10px] tracking-[0.3em] uppercase opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{ color: CREAM, fontWeight: 300 }}>
          ← Back
        </button>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Zentra / Case Study
        </span>
      </nav>

      {/* HERO */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        {/* Banner */}
        <div
          className="hidden sm:block absolute inset-x-0 top-0 h-105 lg:h-150 pointer-events-none"
          style={{ zIndex: 0 }}>
          <img
            src="https://i.pinimg.com/1200x/ec/31/12/ec31124f9d13dbd3d31efd38f5256cf8.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
            style={{ display: "block" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.85) 80%, #0a0a0a 100%)",
            }}
          />
        </div>

        {/* Hero text */}
        <div className="relative" style={{ zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.1 }}
            className="text-[10px] tracking-[0.4em] uppercase mb-6 sm:mb-8"
            style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
            Product · 2026
          </motion.p>

          <div className="overflow-hidden mb-4 sm:mb-6">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.0, ease: E, delay: 0.15 }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3.5rem, 13vw, 12rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: CREAM,
              }}>
              Zentra
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.3 }}
            className="text-base sm:text-xl font-light leading-relaxed max-w-[48ch] mb-10 sm:mb-14"
            style={{ color: "rgba(234,228,213,0.5)" }}>
            A 2D spatial world for remote teams. Move around a shared map, walk
            into conversations, and feel the ambient presence of your teammates
            — without being on a call all day.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.5 }}
            className="flex items-center gap-3">
            {/* Live Site */}

            <a
              href="https://zentra-space.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                background: ORANGE,
                color: "#080808",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="#080808" />
                <circle cx="6" cy="6" r="5" stroke="#080808" strokeWidth="1" />
                <path
                  d="M4 6c0-1.1.4-2.1 1-2.8M8 6c0 1.1-.4 2.1-1 2.8M3 6h6M3.5 4h5M3.5 8h5"
                  stroke="#080808"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
              Live Site
            </a>

            {/* GitHub */}

            <a
              href="https://github.com/ArnavUpadhyay7/zentra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                background: "transparent",
                color: "rgba(234,228,213,0.55)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 300,
                letterSpacing: "0.12em",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                e.currentTarget.style.color = "rgba(234,228,213,0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(234,228,213,0.55)";
              }}>
              <svg width="20" height="20" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.5 1a5.5 5.5 0 00-1.739 10.716c.275.05.376-.119.376-.265 0-.131-.005-.477-.008-.936-1.531.333-1.854-.738-1.854-.738-.25-.636-.611-.805-.611-.805-.5-.341.038-.334.038-.334.552.039.843.567.843.567.491.841 1.288.598 1.602.457.05-.355.192-.598.35-.735-1.222-.139-2.508-.611-2.508-2.72 0-.601.215-1.092.567-1.477-.057-.138-.246-.699.054-1.457 0 0 .462-.148 1.513.564a5.27 5.27 0 011.379-.186c.467.002.938.063 1.378.186 1.05-.712 1.511-.564 1.511-.564.301.758.112 1.319.055 1.457.353.385.566.876.566 1.477 0 2.115-1.288 2.58-2.514 2.716.198.17.374.506.374 1.02 0 .736-.007 1.329-.007 1.51 0 .147.099.318.378.264A5.501 5.501 0 006.5 1z"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </a>
          </motion.div>
        </div>
      </section>

      <Rule />

      {/* VIDEO — scroll-driven on desktop, static image on mobile */}
      {isMobile ? <MobileHeroCover /> : <HeroVideo />}

      <Rule />

      {/* THE PROBLEM */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Fade>
            <Label>The Problem</Label>
            <SectionHeading>
              Remote work killed ambient presence.
            </SectionHeading>
            <Body>
              The office wasn't just a place to work — it was a place where you
              could feel who was around, overhear a conversation, or catch
              someone between meetings. Remote tools gave us chat and video.
              They didn't give us the hallway. Zentra does.
            </Body>
          </Fade>
          <Fade delay={0.1}>
            <ImgPlaceholder label="Remote work pain points" aspect="4/3" />
          </Fade>
        </div>
      </section>

      <Rule />

      {/* INSIGHT */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Key Insight</Label>
          <SectionHeading>
            People don't want more meetings. They want to know who's around.
          </SectionHeading>
          <Body>
            The overhead of scheduling a call to ask a 30-second question is
            where collaboration dies. Proximity-based audio removes that
            entirely — walk over, talk, walk away. No invite link needed.
          </Body>
        </Fade>
        <Fade delay={0.1} className="mt-10 sm:mt-12">
          <ScreenImg src={room} alt="Zentra world overview" />
          <p
            className="text-[9px] tracking-[0.2em] uppercase mt-3 opacity-20"
            style={{ fontFamily: "'Geist', sans-serif" }}>
            Shared world — move around, see teammates in real time
          </p>
        </Fade>
      </section>

      <Rule />

      {/* SOLUTION 1 */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Fade>
            <Label>Solution · 01</Label>
            <SectionHeading>
              Proximity audio that just works — no buttons, no calls.
            </SectionHeading>
            <Body>
              Move your avatar within range of a teammate and audio opens
              automatically. Walk away and it closes. Built on WebRTC with Redis
              pub/sub for sub-50ms position sync across rooms.
            </Body>
          </Fade>
          <Fade delay={0.1}>
            <ImgPlaceholder label="Proximity audio demo" aspect="4/3" />
          </Fade>
        </div>
      </section>

      <Rule />

      {/* SOLUTION 2 */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Fade delay={0.05}>
            <ImgPlaceholder label="Room zones + status signals" aspect="4/3" />
          </Fade>
          <Fade>
            <Label>Solution · 02</Label>
            <SectionHeading>
              Persistent rooms with presence signals.
            </SectionHeading>
            <Body>
              Teams define their space: a deep work zone, a lounge, a war room.
              Avatars carry status signals — focused, available, in a call.
              Presence is visible at a glance. No DM, no ping, no check-in
              required.
            </Body>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* TECHNICAL */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Technical Depth</Label>
          <SectionHeading>Real-time position sync at scale.</SectionHeading>
          <Body>
            Socket.io rooms handle per-world namespacing. Redis pub/sub syncs
            state across server instances. Canvas rendering via a custom React
            hook keeps the world at 60fps with 50+ concurrent avatars.
          </Body>
        </Fade>
        <Fade delay={0.08} className="mt-10 sm:mt-12 grid grid-cols-2 gap-4">
          <ImgPlaceholder label="Architecture diagram" />
          <ImgPlaceholder label="Latency benchmark" />
        </Fade>
      </section>

      <Rule />

      {/* LEARNINGS */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Key Learnings</Label>
          <SectionHeading>What building this taught me.</SectionHeading>
        </Fade>
        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-8 sm:gap-10">
          {[
            {
              n: "01",
              h: "Real-time is a product decision, not just a technical one.",
              b: "Choosing WebSockets shaped every interaction. The technical constraint became the design constraint. They can't be separated.",
            },
            {
              n: "02",
              h: "Presence is subtle. Don't over-engineer it.",
              b: "Early versions had too many status options. Teams need three states: available, focused, away. Everything else is noise.",
            },
            {
              n: "03",
              h: "Performance is UX.",
              b: "A spatial world that lags feels broken, even if all the features are right. Rendering optimization wasn't yak shaving — it was building the product.",
            },
            {
              n: "04",
              h: "Trust the spatial metaphor.",
              b: "Every time we added a traditional UI pattern — sidebar, member list — it undermined the premise. The world should do the work. Trust it.",
            },
          ].map(({ n, h, b }) => (
            <Fade key={n}>
              <div className="flex gap-5 sm:gap-6">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase shrink-0 mt-1"
                  style={{ color: `${ORANGE}60`, fontWeight: 300 }}>
                  {n}
                </span>
                <div>
                  <p
                    className="text-sm font-normal mb-2"
                    style={{ color: CREAM }}>
                    {h}
                  </p>
                  <p
                    className="text-sm font-light leading-loose"
                    style={{ color: "rgba(234,228,213,0.4)" }}>
                    {b}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Rule />

      {/* NEXT PROJECT */}
      <section className="px-6 sm:px-10 lg:px-20 pb-24 sm:pb-32">
        <Fade>
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-6 sm:mb-8"
            style={{ color: "rgba(255,255,255,0.18)" }}>
            Next Project
          </p>
        </Fade>
        <Fade delay={0.08}>
          <button
            onClick={() =>
              navigateWithTransition("/elevate", {
                label: "Elevate",
                index: "02 / 02",
              })
            }
            className="group w-full text-left">
            <div
              className="relative overflow-hidden rounded-sm transition-all duration-700"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              {/* Cover image with hover zoom */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "21/9" }}>
                <img
                  src={elevate_home}
                  alt="Elevate cover"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(13,13,13,0.6) 80%, #0d0d0d 100%)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, #0d0d0d 0%, transparent 15%, transparent 85%, #0d0d0d 100%)",
                  }}
                />
              </div>

              <div className="px-6 sm:px-10 pb-6 sm:pb-10 pt-4 flex items-end justify-between">
                <div>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase mb-2 sm:mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    Valorant Coaching
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: CREAM,
                    }}>
                    Elevate
                  </h3>
                </div>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-1"
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
