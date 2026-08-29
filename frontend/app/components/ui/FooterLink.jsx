'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Footer nav link with an animated red underline that slides in on hover.
 * Renders as a <li> — place inside a <ul>.
 */
export default function FooterLink({ href, children }) {
  const [hov, setHov] = useState(false);

  return (
    <li>
      <Link
        href={href}
        className="inline-flex flex-col"
        style={{ color: hov ? 'var(--fg)' : 'var(--fg-3)', transition: 'color 0.2s' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <span className="text-sm">{children}</span>
        <motion.span
          className="rounded-full"
          style={{ background: 'var(--accent)', height: '2px' }}
          animate={{ width: hov ? '100%' : '0%' }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        />
      </Link>
    </li>
  );
}
