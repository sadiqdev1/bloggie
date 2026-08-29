'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin red progress bar fixed at the very top of the viewport.
 * Tracks how far the user has scrolled through the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] pointer-events-none"
      style={{ scaleX, background: 'var(--accent)' }}
    />
  );
}
