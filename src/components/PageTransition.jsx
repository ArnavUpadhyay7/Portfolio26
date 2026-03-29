import {
  useEffect, useRef, useState, useCallback,
  createContext, useContext,
} from "react";
import { useNavigate } from "react-router-dom";

/* ── timing ────────────────────────────────────────────────────────── */
const FADE_IN_MS    = 600;   
const ROUTE_MS      = 500;  
const HOLD_MS       = 520;  
const FADE_OUT_AT   = FADE_IN_MS + HOLD_MS;      
const FADE_OUT_MS   = 900;
const DONE_MS       = FADE_OUT_AT + FADE_OUT_MS + 100;

const E_IN  = "cubic-bezier(0.3,  0,   0.8,  1)";
const E_OUT = "cubic-bezier(0.0,  0,   0.15, 1)";

export function PageTransition({
  active,
  destination = "Products",
  index        = "01 / 02",
  onComplete,
  onDone,
}) {
  const [mounted,  setMounted]  = useState(false);
  const panelRef   = useRef(null);
  const scanRef    = useRef(null);
  const labelRef   = useRef(null);
  const timers     = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (ms, fn) => { const t = setTimeout(fn, ms); timers.current.push(t); };

  useEffect(() => {
    if (!active) return;
    setMounted(true);
    clearTimers();

    const init = setTimeout(() => {
      const panel = panelRef.current;
      const scan  = scanRef.current;
      const label = labelRef.current;
      if (!panel || !scan || !label) return;

      /* ── RESET without transition ── */
      const snap = (el, styles) => {
        el.style.transition = "none";
        Object.assign(el.style, styles);
      };
      snap(panel, { opacity: "0" });
      snap(scan,  { top: "-2px", opacity: "0" });
      snap(label, { opacity: "0" });

      /* ── FADE IN — one rAF defer ── */
      requestAnimationFrame(() => requestAnimationFrame(() => {

        /* Panel darkens smoothly */
        panel.style.transition = `opacity ${FADE_IN_MS}ms ${E_IN}`;
        panel.style.opacity    = "1";

        /* Label fades in once panel is mostly dark */
        setTimeout(() => {
          label.style.transition = `opacity 380ms ease`;
          label.style.opacity    = "1";
        }, 340);

        /* Scan line: starts invisible at top, drifts down */
        setTimeout(() => {
          scan.style.opacity    = "1";
          scan.style.transition = `top 900ms linear, opacity 180ms ease`;
          scan.style.top        = "100%";
          /* Fade scan out near the end of its travel */
          setTimeout(() => {
            scan.style.transition = "opacity 320ms ease";
            scan.style.opacity    = "0";
          }, 680);
        }, 280);

      }));

      /* ── ROUTE CHANGE: fires when panel is ~85% opaque ── */
      after(ROUTE_MS, () => { onComplete?.(); });

      /* ── LABEL FADE OUT: just before dissolve starts ── */
      after(FADE_OUT_AT - 200, () => {
        label.style.transition = "opacity 260ms ease";
        label.style.opacity    = "0";
      });

      /* ── DISSOLVE: slow fade out ── */
      after(FADE_OUT_AT, () => {
        panel.style.transition = `opacity ${FADE_OUT_MS}ms ${E_OUT}`;
        panel.style.opacity    = "0";
      });

      /* ── DONE ── */
      after(DONE_MS, () => {
        setMounted(false);
        onDone?.();
      });

    }, 16);

    timers.current.push(init);
    return () => clearTimers();
  }, [active]); // eslint-disable-line

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position:      "fixed",
        inset:         0,
        pointerEvents: "none",
        zIndex:        9000,
        overflow:      "hidden",
      }}
    >
      {/* Dark panel — no transform, pure opacity only */}
      <div
        ref={panelRef}
        style={{
          position:   "absolute",
          inset:      0,
          /* Slight warm tint so it's not cold/harsh black */
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, #110a08 0%, #0a0a0a 100%)",
          willChange: "opacity",
        }}
      />

      <div
        ref={scanRef}
        style={{
          position:   "absolute",
          left:       0,
          right:      0,
          top:        "-2px",
          height:     1,
          background: [
            "linear-gradient(to right,",
            "  transparent           0%,",
            "  rgba(232,64,12,0.12) 10%,",
            "  rgba(232,64,12,0.55) 35%,",
            "  #E8400C              50%,",
            "  rgba(232,64,12,0.55) 65%,",
            "  rgba(232,64,12,0.12) 90%,",
            "  transparent          100%",
            ")",
          ].join(" "),
          boxShadow:  "0 0 8px 1px rgba(232,64,12,0.30)",
          willChange: "top, opacity",
        }}
      />

      <div
        ref={labelRef}
        style={{
          position:       "absolute",
          top:            "50%",
          left:           "50%",
          transform:      "translate(-50%, -50%)",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            10,
          willChange:     "opacity",
        }}
      >
        {/* Index */}
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    400,
          fontSize:      10,
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color:         "rgba(232,64,12,0.70)",
          lineHeight:    1,
        }}>{index}</span>

        {/* Destination */}
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    900,
          fontSize:      "clamp(1.8rem, 4.5vw, 3.4rem)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color:         "rgba(234,228,213,0.90)",
          lineHeight:    1,
          whiteSpace:    "nowrap",
          // Subtle entrance feel — handled by parent opacity fade
          display:       "block",
        }}>{destination}</span>

        {/* Orange rule — wider, more presence */}
        <div style={{
          width:      "clamp(80px, 14vw, 180px)",
          height:     1,
          background: `linear-gradient(to right,
            transparent,
            rgba(232,64,12,0.50) 20%,
            rgba(232,64,12,0.65) 50%,
            rgba(232,64,12,0.50) 80%,
            transparent
          )`,
          marginTop:  2,
        }} />
      </div>
    </div>
  );
}

const TransitionCtx = createContext(null);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const [state, setState] = useState({
    active: false,
    dest:   "/",
    label:  "Products",
    index:  "01 / 02",
  });

  const navigateWithTransition = useCallback((to, opts = {}) => {
    if (state.active) return;
    setState({
      active: true,
      dest:   to,
      label:  opts.label ?? to.replace("/", ""),
      index:  opts.index ?? "01 / 02",
    });
  }, [state.active]);

  const handleComplete = useCallback(() => {
    navigate(state.dest);
  }, [navigate, state.dest]);

  const handleDone = useCallback(() => {
    setState(s => ({ ...s, active: false }));
  }, []);

  return (
    <TransitionCtx.Provider value={{ navigateWithTransition }}>
      {children}
      <PageTransition
        active      = {state.active}
        destination = {state.label}
        index       = {state.index}
        onComplete  = {handleComplete}
        onDone      = {handleDone}
      />
    </TransitionCtx.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("usePageTransition must be inside <TransitionProvider>");
  return ctx;
}

export default PageTransition;