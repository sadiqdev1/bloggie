'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

import AppLogo      from '@/app/components/AppLogo';
import ThemeToggle  from '@/app/components/ThemeToggle';
import MagneticBtn  from '@/app/components/ui/MagneticBtn';
import { NAV_LINKS } from '@/app/lib/welcome-data';

/**
 * Fixed top navbar.
 *
 * Theme-bug fix: the background is no longer a hardcoded light-mode
 * rgba value. Instead it uses `var(--bg-card)` at reduced opacity via a
 * CSS variable-aware rgba trick. Because `--bg-card` is `#ffffff` in light
 * and `#0d0d0d` in dark, the navbar glass automatically adapts to whichever
 * theme is active without any JS.
 *
 * We accomplish this with a CSS custom property --navbar-bg defined inline
 * that resolves to the correct surface for each theme, combined with
 * backdrop-filter for the frosted glass effect.
 */
export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-50 inset-x-0"
      style={{ top: scrolled ? '8px' : '0px', padding: scrolled ? '0 12px' : '0' }}
    >
      <motion.div
        animate={{
          borderRadius: scrolled ? '20px' : '0px',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.10), 0 0 0 1px var(--border)'
            : '0 1px 0 0 var(--border)',
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl h-16 flex items-center justify-between px-6 navbar-glass"
        style={{
          WebkitBackdropFilter:   'blur(27px)',
          backdropFilter:         'blur(27px)',
        }}
      >
        <AppLogo size="lg" />

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? 'page' : undefined}
                className="relative px-3.5 py-2 rounded-xl text-[15px] font-medium transition-colors"
                style={{ color: active ? 'var(--fg)' : 'var(--fg-2)' }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'var(--bg-hover)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-[15px] font-medium px-4 h-10 flex items-center rounded-xl transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--fg-2)' }}
          >
            Sign in
          </Link>
          <Link href="/register">
            <MagneticBtn
              className="h-10 text-[15px] font-semibold px-5 rounded-xl text-white cursor-pointer flex items-center gap-1.5"
              style={{ background: 'var(--accent)' }}
            >
              Start writing
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={13} strokeWidth={2.5} />
              </motion.span>
            </MagneticBtn>
          </Link>
        </div>

        {/* ── Mobile: theme toggle + hamburger ── */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: open ? 'var(--accent-dim)' : 'var(--bg-hover)' }}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {[
              { yOff: -5, rot: 45  },
              { yOff: 0,  fade: true },
              { yOff: 5,  rot: -45 },
            ].map((bar, i) => (
              <motion.span
                key={i}
                className="block absolute w-4 h-0.5 rounded-full"
                style={{ background: 'var(--fg)' }}
                animate={
                  open
                    ? bar.fade
                      ? { opacity: 0, scaleX: 0 }
                      : { rotate: bar.rot, y: 0 }
                    : { rotate: 0, y: bar.yOff, opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2 }}
              />
            ))}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{   opacity: 0, y: -10,  scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-3 mt-2 rounded-2xl border overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            {/* Nav links */}
            <div className="px-3 pt-3 pb-2">
              {NAV_LINKS.map(({ label, href }, i) => {
                const active = pathname === href;
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1,  x: 0   }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors"
                      style={{
                        color:      active ? 'var(--accent)' : 'var(--fg)',
                        background: active ? 'var(--accent-dim)' : 'transparent',
                      }}
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--fg-4)' }} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mx-3 border-t" style={{ borderColor: 'var(--border)' }} />

            {/* Auth CTAs */}
            <div className="p-3 flex flex-col gap-2">
              {[
                { href: '/login',    label: 'Sign in',                  border: true  },
                { href: '/register', label: "Start writing — it's free", border: false },
              ].map(({ href, label, border }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1,  y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.25 }}
                >
                  <Link
                    href={href}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold"
                    style={border
                      ? { color: 'var(--fg)', border: '1px solid var(--border-2)' }
                      : { color: '#fff',       background: 'var(--accent)' }
                    }
                    onClick={() => setOpen(false)}
                  >
                    {label}
                    {!border && <ArrowRight size={13} strokeWidth={2.5} />}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
