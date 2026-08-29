'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Search } from 'lucide-react';
import Navbar     from '@/app/components/Navbar';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import Blob       from '@/app/components/ui/Blob';
import { staggerSlow, fadeUp } from '@/app/lib/motion';

const SUGGESTIONS = [
  { label: 'Go home',       href: '/',        icon: Home   },
  { label: 'Explore stories', href: '/explore', icon: Search },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden pt-16"
        style={{ background: 'var(--bg)' }}
      >
        {/* Blobs */}
        <Blob className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background: 'var(--accent)', opacity: 0.06 }} />

        <div className="relative z-10 max-w-lg text-center">

          {/* Giant 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="select-none mb-4 leading-none font-bold tracking-tighter"
            style={{
              fontSize: 'clamp(120px, 22vw, 200px)',
              fontFamily: 'var(--font-bricolage), sans-serif',
              color: 'var(--accent-dim)',
              WebkitTextStroke: '2px var(--accent)',
            }}
          >
            404
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}
          >
            This page doesn't exist.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="text-sm leading-relaxed mb-10 max-w-xs mx-auto"
            style={{ color: 'var(--fg-3)' }}
          >
            The story you're looking for may have moved, been deleted, or never existed.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {SUGGESTIONS.map(({ label, href, icon: Icon }) => (
              <motion.div key={href} variants={fadeUp}>
                <Link href={href}>
                  {href === '/' ? (
                    <MagneticBtn
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{ background: 'var(--accent)' }}
                    >
                      <Icon size={14} strokeWidth={2} />
                      {label}
                      <ArrowRight size={13} strokeWidth={2.5} />
                    </MagneticBtn>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold border cursor-pointer"
                      style={{ color: 'var(--fg-2)', borderColor: 'var(--border-2)', background: 'var(--bg-card)' }}
                    >
                      <Icon size={14} strokeWidth={2} />
                      {label}
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Fun micro-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 text-xs"
            style={{ color: 'var(--fg-4)' }}
          >
            Error 404 · Bloggie
          </motion.p>
        </div>
      </main>
    </>
  );
}
