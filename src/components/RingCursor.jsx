import { useEffect, useRef } from "react";

const lerp = (a, b, t) => a + (b - a) * t;

export default function RingCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const rafRef  = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot  = dotRef.current;
    if (!ring || !dot) return;

    const raw  = { x: -200, y: -200 };
    const rPos = { x: -200, y: -200 };
    const dPos = { x: -200, y: -200 };

    let visible   = false;
    let hovering  = false;
    let clicking  = false;
    let scale     = 1;

    const onMove = e => {
      raw.x = e.clientX;
      raw.y = e.clientY;
      visible = true;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering = !!(el?.closest("a, button, [data-hover], label, input, select"));
    };
    const onLeave = () => { visible = false; };
    const onDown  = () => { clicking = true; };
    const onUp    = () => { clicking = false; };

    window.addEventListener("mousemove",    onMove,  { passive: true });
    window.addEventListener("mousedown",    onDown,  { passive: true });
    window.addEventListener("mouseup",      onUp,    { passive: true });
    document.addEventListener("mouseleave", onLeave);

    // Fast lerp — feels like the zarcero cursor (snappy, slight float)
    const RING_LERP = 0.28;
    const DOT_LERP  = 0.42;

    const tick = () => {
      rPos.x = lerp(rPos.x, raw.x, RING_LERP);
      rPos.y = lerp(rPos.y, raw.y, RING_LERP);
      dPos.x = lerp(dPos.x, raw.x, DOT_LERP);
      dPos.y = lerp(dPos.y, raw.y, DOT_LERP);

      const targetScale = clicking ? 0.85 : hovering ? 1.4 : 1;
      scale = lerp(scale, targetScale, clicking ? 0.4 : 0.16);

      const op = visible ? "1" : "0";

      // ring: 22px, centered at -11
      ring.style.transform = `translate3d(${rPos.x - 11}px, ${rPos.y - 11}px, 0) scale(${scale.toFixed(4)})`;
      ring.style.opacity   = op;

      // dot: 4px, centered at -2
      dot.style.transform  = `translate3d(${dPos.x - 2}px, ${dPos.y - 2}px, 0)`;
      dot.style.opacity    = op;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove",    onMove);
      window.removeEventListener("mousedown",    onDown);
      window.removeEventListener("mouseup",      onUp);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const base = {
    position:      "fixed",
    top:           0,
    left:          0,
    pointerEvents: "none",
    willChange:    "transform, opacity",
    zIndex:        9999,
    transition:    "opacity 0.15s ease",
  };

  return (
    <>
      {/* Ring */}
      <div ref={ringRef} style={{
        ...base,
        width:           22,
        height:          22,
        borderRadius:    "50%",
        border:          "1.5px solid rgba(255,255,255,0.75)",
        background:      "transparent",
        transformOrigin: "center center",
      }} />
      {/* Center dot */}
      <div ref={dotRef} style={{
        ...base,
        width:        4,
        height:       4,
        borderRadius: "50%",
        background:   "rgba(255,255,255,0.9)",
      }} />
    </>
  );
}