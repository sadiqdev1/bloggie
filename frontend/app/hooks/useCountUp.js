'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Counts from 0 up to `target` with an ease-out cubic when the
 * ref element enters the viewport.
 *
 * @param {number} target   - The final numeric value
 * @param {number} duration - Animation duration in ms
 * @returns {{ ref: React.RefObject, count: number }}
 */
export function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();

    const raf = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, count };
}
