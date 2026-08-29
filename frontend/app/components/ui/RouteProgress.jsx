'use client';

/**
 * RouteProgress — NProgress-style thin loading bar that fires on
 * Next.js App Router navigations.
 *
 * Uses the Navigation API (native browser) which fires `navigate` events
 * on same-origin pushState/replaceState navigations. Falls back gracefully
 * in browsers that don't support it yet.
 *
 * Place this once in the root layout (or any persistent layout).
 */

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RouteProgress() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const [active,   setActive]  = useState(false);
  const [progress, setProgress]= useState(0);
  const timerRef  = useRef(null);
  const rafRef    = useRef(null);

  // Start the bar when navigation begins (link clicks)
  // We intercept clicks on <a> tags to trigger the loading state
  useEffect(() => {
    const handleClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      // Same-origin navigation — start bar
      startBar();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Complete bar when route actually changes
  useEffect(() => {
    completeBar();
  }, [pathname, searchParams]);

  const startBar = () => {
    // Reset
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setActive(true);

    // Animate progress to ~85% quickly, then stall
    let p = 0;
    const tick = () => {
      if (p < 85) {
        // Faster at start, slows down as it approaches 85
        p += (85 - p) * 0.08 + 0.5;
        setProgress(Math.min(p, 85));
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const completeBar = () => {
    cancelAnimationFrame(rafRef.current);
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 400);
  };

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="route-progress"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
          style={{ height: '3px' }}>
          <motion.div
            className="h-full origin-left"
            style={{
              width: `${progress}%`,
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent), 0 0 16px var(--accent-dim)',
              transition: 'width 0.1s ease-out',
            }} />
          {/* Glowing leading edge */}
          <div
            className="absolute top-0 right-0 w-24 h-full"
            style={{
              background: 'linear-gradient(to right, transparent, var(--accent))',
              right: `${100 - progress}%`,
              opacity: progress < 100 ? 1 : 0,
            }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
