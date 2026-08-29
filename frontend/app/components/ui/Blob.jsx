'use client';

import { motion } from 'framer-motion';

/**
 * Pulsing radial gradient blob — decorative background element.
 * Position it absolutely from the parent.
 *
 * IMPORTANT: `initial` must be set explicitly to prevent a flash of
 * invisible/un-styled state on first render with the React Compiler.
 */
export default function Blob({ className = '', style = {} }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={style}
      initial={{ scale: 1, opacity: style.opacity ?? 1 }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
