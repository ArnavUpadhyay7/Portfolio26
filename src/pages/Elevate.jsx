import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePageTransition } from "../components/PageTransition";
import elevateVideo from "../assets/videos/Elevate_Main.mp4";
import player_profile from "../assets/elevateImages/player_profile.png";
import coach_profile from "../assets/elevateImages/coach_profile.png";
import player_review from "../assets/elevateImages/player_review.png";
import find_coach from "../assets/elevateImages/find_coach.png";
import elevate_home from "../assets/elevateImages/elevate_home.png";
import player_review_open from "../assets/elevateImages/player_review_open.png";
import realtime_chat from "../assets/elevateImages/realtime_chat.png";
import coach_review from "../assets/elevateImages/coach_review.png";

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
            src={elevateVideo}
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

function MobileHeroCover() {
  return (
    <Fade>
      <div
        className="mx-6 mt-2 mb-4 rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={elevate_home} alt="Elevate Home" className="w-full block" />
      </div>
    </Fade>
  );
}

// Feature row: alternates image left/right on desktop, always stacks on mobile
function FeatureRow({
  label,
  heading,
  body,
  img,
  alt,
  imgFirst = false,
  caption,
}) {
  return (
    <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text — always first on mobile, conditionally second on desktop */}
        <Fade className={imgFirst ? "lg:order-2" : ""}>
          <Label>{label}</Label>
          <SectionHeading>{heading}</SectionHeading>
          <Body>{body}</Body>
        </Fade>

        {/* Image — always second on mobile, conditionally first on desktop */}
        <Fade
          delay={0.1}
          className={`flex flex-col gap-2 ${imgFirst ? "lg:order-1" : ""}`}>
          <ScreenImg src={img} alt={alt} />
          {caption && (
            <p
              className="text-[9px] tracking-[0.2em] uppercase opacity-20"
              style={{ fontFamily: "'Geist', sans-serif" }}>
              {caption}
            </p>
          )}
        </Fade>
      </div>
    </section>
  );
}

// Inline feature list items with dot separator
function FeatureList({ items }) {
  return (
    <ul className="mt-8 flex flex-col gap-3">
      {items.map((item, i) => (
        <Fade key={i} delay={i * 0.06}>
          <li className="flex items-start gap-3">
            <span
              className="mt-[0.35rem] shrink-0 w-[5px] h-[5px] rounded-full"
              style={{ background: `${ORANGE}70` }}
            />
            <span
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "0.9rem",
                color: "rgba(234,228,213,0.55)",
                lineHeight: 1.7,
              }}>
              {item}
            </span>
          </li>
        </Fade>
      ))}
    </ul>
  );
}

export default function Elevate() {
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
          Elevate / Case Study
        </span>
      </nav>

      {/* HERO */}
      <section className="px-6 sm:px-10 lg:px-20 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E, delay: 0.1 }}
          className="text-[10px] tracking-[0.4em] uppercase mb-6 sm:mb-8"
          style={{ color: `${ORANGE}70`, fontWeight: 300 }}>
          Product · 2025
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
            Elevate
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: E, delay: 0.3 }}
          className="text-base sm:text-xl font-light leading-relaxed max-w-[48ch] mb-10 sm:mb-14"
          style={{ color: "rgba(234,228,213,0.5)" }}>
          A competitive coaching platform built for Valorant players who are
          serious about ranking up. Structured paths, VOD reviews, and live
          sessions — without the noise of Discord servers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: E, delay: 0.4 }}
          className="flex items-center gap-3">
          {/* Primary — Live URL */}
          <a
            href="https://elevate-xqw2.onrender.com/"
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
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
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

          {/* Secondary — GitHub */}
          <a
            href="https://github.com/ArnavUpadhyay7/elevate"
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
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5 1a5.5 5.5 0 00-1.739 10.716c.275.05.376-.119.376-.265 0-.131-.005-.477-.008-.936-1.531.333-1.854-.738-1.854-.738-.25-.636-.611-.805-.611-.805-.5-.341.038-.334.038-.334.552.039.843.567.843.567.491.841 1.288.598 1.602.457.05-.355.192-.598.35-.735-1.222-.139-2.508-.611-2.508-2.72 0-.601.215-1.092.567-1.477-.057-.138-.246-.699.054-1.457 0 0 .462-.148 1.513.564a5.27 5.27 0 011.379-.186c.467.002.938.063 1.378.186 1.05-.712 1.511-.564 1.511-.564.301.758.112 1.319.055 1.457.353.385.566.876.566 1.477 0 2.115-1.288 2.58-2.514 2.716.198.17.374.506.374 1.02 0 .736-.007 1.329-.007 1.51 0 .147.099.318.378.264A5.501 5.501 0 006.5 1z"
                fill="currentColor"
              />
            </svg>
            GitHub
          </a>
        </motion.div>
      </section>

      <Rule />

      {/* VIDEO — desktop scroll-driven / mobile static image */}
      {isMobile ? <MobileHeroCover /> : <HeroVideo />}

      <Rule />

      {/* Hero screenshots */}
      <section className="px-6 sm:px-10 lg:px-20 mb-4 mt-4">
        <Fade>
          <div className="mb-8 sm:mb-10">
            <Label>The Product</Label>
            <SectionHeading>
              Built for both sides of the session.
            </SectionHeading>
            <Body>
              Players get a personalised dashboard to find coaches, submit VODs,
              and track feedback. Coaches get a dedicated profile and review
              workspace — everything needed to run sessions professionally.
            </Body>
          </div>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Fade delay={0.05}>
            <div className="flex flex-col gap-2">
              <ScreenImg src={player_profile} alt="Player profile" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase opacity-20"
                style={{ fontFamily: "'Geist', sans-serif" }}>
                Player dashboard
              </p>
            </div>
          </Fade>
          <Fade delay={0.1}>
            <div className="flex flex-col gap-2">
              <ScreenImg src={coach_profile} alt="Coach profile" />
              <p
                className="text-[9px] tracking-[0.2em] uppercase opacity-20"
                style={{ fontFamily: "'Geist', sans-serif" }}>
                Coach profile
              </p>
            </div>
          </Fade>
        </div>
      </section>

      <Rule />

      {/* ── FEATURE 1: Browse coaches ───────────────────────────────────────── */}
      <FeatureRow
        label="Player Experience · 01"
        heading="Browse verified coaches by rank and role."
        body="Players filter the coach roster by their specific rank tier and agent role — no guessing who's qualified. Every coach profile shows rank proof, specialisation, pricing, and showcase clips so players can make an informed decision before spending a rupee."
        img={find_coach}
        alt="Find a coach"
        caption="Coach discovery"
      />

      <Rule />

      {/* ── FEATURE 2: Submit VOD ───────────────────────────────────────────── */}
      <FeatureRow
        label="Player Experience · 02"
        heading="Submit your VOD. Get structured feedback."
        body="Players attach a gameplay recording to a booked session and pay via Razorpay in the same flow. No back-and-forth over DM — the submission is logged, the coach is notified, and the review arrives with skill ratings and timestamped notes."
        img={player_review}
        alt="Player review submission"
        imgFirst
        caption="VOD submission flow"
      />

      <Rule />

      {/* ── FEATURE 3: Receive feedback ─────────────────────────────────────── */}
      <FeatureRow
        label="Player Experience · 03"
        heading="Feedback you can actually act on."
        body="Coach notes are structured around specific skill dimensions — positioning, economy, ability usage, game sense. Each rating is tied to what happened in the VOD, not a vague impression. Players know exactly what to drill in their next ranked session."
        img={player_review_open}
        alt="Player review open"
        caption="Structured feedback view"
      />

      <Rule />

      {/* ── FEATURE 4: Coach dashboard ──────────────────────────────────────── */}
      <FeatureRow
        label="Coach Experience · 01"
        heading="A dashboard built around the coach workflow."
        body="Incoming review requests surface in one place — no inbox chaos, no missed sessions. Coaches see the player's rank, their submitted VOD, and the session details before accepting. The review interface keeps notes and video in sync."
        img={coach_review}
        alt="AI Valorant coach tools"
        imgFirst
        caption="Coach review dashboard"
      />

      <Rule />

      {/* ── FEATURE 5: Real-time messaging ──────────────────────────────────── */}
      <FeatureRow
        label="Shared · Both sides"
        heading="Real-time messaging between players and coaches."
        body="Every booked session opens a persistent chat thread between the player and their coach. Players can ask follow-up questions on their feedback. Coaches can clarify recommendations before the next ranked session. The conversation lives alongside the review — not buried in Discord."
        img={realtime_chat}
        alt="Real-time chat between player and coach"
        caption="In-session messaging"
      />

      <Rule />

      {/* ── LEARNINGS ───────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-20 mb-16 sm:mb-24">
        <Fade>
          <Label>Key Learnings</Label>
          <SectionHeading>What building this taught me.</SectionHeading>
        </Fade>
        <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-8 sm:gap-10">
          {[
            {
              n: "01",
              h: "Niche is a feature.",
              b: "Building for Valorant specifically — not 'esports generally' — made every design decision sharper. The narrower the user, the clearer the product.",
            },
            {
              n: "02",
              h: "AI should reduce friction, not add it.",
              b: "Early versions had too much visible AI surface area. Shipping meant making it invisible: it runs in the background, the user sees the result.",
            },
            {
              n: "03",
              h: "Async > sync for early products.",
              b: "VOD review being async was initially a constraint. It became the biggest advantage — no scheduling friction, higher coach-to-player ratio, better economics.",
            },
            {
              n: "04",
              h: "Progress needs to be felt, not just shown.",
              b: "Users stop using tools when improvement feels invisible. The hardest design problem was making rank progress visceral, not just a number going up.",
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

      {/* ── NEXT PROJECT ────────────────────────────────────────────────────── */}
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
            onClick={() => navigateWithTransition("/zentra")}
            className="group w-full text-left">
            <div
              className="relative overflow-hidden rounded-sm p-6 sm:p-10 transition-colors duration-500 hover:bg-white/2"
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
              <ImgPlaceholder label="Zentra cover image" aspect="21/6" />
              <div className="mt-6 sm:mt-8 flex items-end justify-between">
                <div>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase mb-2 sm:mb-3"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    2D Spatial World
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
                    Zentra
                  </h3>
                </div>
                <span
                  className="text-[10px] tracking-[0.25em] uppercase transition-opacity duration-300 group-hover:opacity-60"
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
