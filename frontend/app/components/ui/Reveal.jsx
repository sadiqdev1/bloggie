'use client';

import { motion } from 'framer-motion';

/**
 * Fade-up reveal on scroll into view.
 * @param {React.ReactNode} children
 * @param {number}  delay     - Delay before animation starts (seconds)
 * @param {string}  className - Extra Tailwind classes on the wrapper
 */
export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
