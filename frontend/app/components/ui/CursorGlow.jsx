'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Soft accent-coloured glow that follows the cursor.
 * Visible in both light and dark mode (opacity 0.13).
 * Fixed-positioned, pointer-events-none — never blocks clicks.
 */
export default function CursorGlow() {
  const x  = useMotionValue(-400);
  const y  = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const fn = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [x, y]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[480px] h-[480px] rounded-full blur-[110px]"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          background: 'var(--accent)',
          opacity: 0.13,
        }}
      />
    </div>
  );
}
