'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * A button that gently nudges toward the cursor (magnetic effect).
 * Drop-in replacement for <button> / <motion.button>.
 */
export default function MagneticBtn({ children, className = '', style = {}, onClick, type = 'button' }) {
  const ref = useRef(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 280, damping: 22 });
  const sy  = useSpring(y, { stiffness: 280, damping: 22 });

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width  / 2) * 0.3);
    y.set((e.clientY - r.top  - r.height / 2) * 0.3);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button
      ref={ref}
      type={type}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
