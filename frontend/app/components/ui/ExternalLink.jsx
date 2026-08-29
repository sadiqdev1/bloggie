'use client';

import { motion } from 'framer-motion';

/**
 * Reusable external anchor — always opens in a new tab with
 * rel="noopener noreferrer" for security.
 */
export default function ExternalLink({ href, label, children, className = '', style = {} }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      whileHover={{ y: -3, scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.a>
  );
}
