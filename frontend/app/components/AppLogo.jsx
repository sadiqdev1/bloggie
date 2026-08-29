/**
 * AppLogo — shared brand mark used in Navbar, Footer, auth pages, etc.
 *
 * Props:
 *  size    — 'sm' | 'md' | 'lg'   (default: 'md')
 *  href    — link destination       (default: '/')
 *  asSpan  — render without <Link> wrapper
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AppLogo({ size = 'md', href = '/', asSpan = false }) {
  const sizes = {
    sm: { img: 20, text: 'text-sm',   gap: 'gap-1'   },
    md: { img: 24, text: 'text-base', gap: 'gap-1.5' },
    lg: { img: 30, text: 'text-xl',   gap: 'gap-2'   },
  };
  const s = sizes[size] ?? sizes.md;

  const inner = (
    <span className={`inline-flex items-center ${s.gap} select-none`}>
      <motion.span
        whileHover={{ rotate: -10, scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        className="flex items-center justify-center shrink-0"
      >
        <Image
          src="/logo.png"
          alt="Bloggie logo"
          width={s.img}
          height={s.img}
          className="object-contain"
          priority
        />
      </motion.span>
      <span
        className={`font-bold tracking-tight leading-none ${s.text}`}
        style={{
          fontFamily: 'var(--font-bricolage), sans-serif',
          color: 'var(--fg)',
        }}
      >
        Blog<span style={{ color: 'var(--accent)' }}>gie</span>
      </span>
    </span>
  );

  if (asSpan) return inner;

  return (
    <Link href={href} className="inline-flex" aria-label="Bloggie — home">
      {inner}
    </Link>
  );
}
