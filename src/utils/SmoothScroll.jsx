import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const landingScrollRef = { value: 0 };

export default function SmoothScroll({ children }) {
  const location = useLocation();
  const lenisRef = useRef(null);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.lenis = lenis;
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;

    // Leaving landing — save its scroll position
    if (prev === '/') {
      landingScrollRef.value = lenisRef.current?.scroll ?? 0;
    }

    if (curr === '/') {
      // Returning to landing — restore saved position
      requestAnimationFrame(() => {
        window.lenis?.scrollTo(landingScrollRef.value, { immediate: true });
      });
    } else {
      // Any other page — always start at top
      window.lenis?.scrollTo(0, { immediate: true });
    }

    prevPathRef.current = curr;
  }, [location.pathname]);

  return <>{children}</>;
}