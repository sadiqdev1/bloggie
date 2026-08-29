'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Heart } from 'lucide-react';
import Link from 'next/link';

import AppLogo      from '@/app/components/AppLogo';
import FooterLink   from '@/app/components/ui/FooterLink';
import ExternalLink from '@/app/components/ui/ExternalLink';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/app/lib/welcome-data';

export default function Footer() {
  const [email,   setEmail]   = useState('');
  const [subDone, setSubDone] = useState(false);
  const [error,   setError]   = useState('');

  const handleSub = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubDone(true);
    setEmail('');
  };

  return (
    <>
      {/* Visual separation from CTABanner — gradient fade + hairline */}
      <div className="h-px"  style={{ background: 'linear-gradient(to right, transparent, var(--border-2), transparent)' }} />
      <div className="h-8"   style={{ background: 'linear-gradient(to bottom, var(--bg-card), var(--bg))' }} />

      <footer className="pt-12 pb-8 px-5" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">

          {/* ── Newsletter strip ── */}
          <div
            className="rounded-2xl border p-8 mb-14 flex flex-col md:flex-row md:items-center gap-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--accent)' }}>
                Weekly digest
              </p>
              <h3 className="text-lg font-bold"   style={{ color: 'var(--fg)' }}>Get the best stories in your inbox.</h3>
              <p className="text-sm mt-1"          style={{ color: 'var(--fg-3)' }}>Curated picks every Friday. No spam, ever.</p>
            </div>

            <AnimatePresence mode="wait">
              {subDone ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#22c55e' }}
                >
                  <CheckCircle2 size={18} /> You're subscribed!
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSub}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2 w-full md:w-auto"
                  noValidate
                >
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com"
                      className="flex-1 md:w-56 h-10 px-4 rounded-xl text-sm outline-none border transition-colors"
                      style={{
                        background:   'var(--bg-input)',
                        color:        'var(--fg)',
                        borderColor:  error ? '#ef4444' : 'var(--border-input)',
                      }}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="h-10 px-5 rounded-xl text-sm font-semibold text-white shrink-0 cursor-pointer"
                      style={{ background: 'var(--accent)' }}
                    >
                      Subscribe
                    </motion.button>
                  </div>

                  {/* Inline validation error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs"
                      style={{ color: '#ef4444' }}
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ── Main grid ── */}
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Brand column */}
            <div className="col-span-2">
              <AppLogo size="lg" />
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--fg-3)' }}>
                The open platform for independent writers and curious readers.
                Built for people who have something to say.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2.5 mt-5">
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <ExternalLink
                    key={label}
                    href={href}
                    label={label}
                    className="w-8 h-8 rounded-xl flex items-center justify-center border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--fg-3)' }}
                  >
                    <Icon size={14} />
                  </ExternalLink>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: 'var(--fg-4)' }}
                >
                  {section}
                </p>
                <ul className="space-y-3">
                  {links.map(link => (
                    <FooterLink key={link} href={`/${link.toLowerCase()}`}>
                      {link}
                    </FooterLink>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ color: 'var(--fg-4)' }}
          >
            <span>© {new Date().getFullYear()} Bloggie. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2.5 }}
              >
                <Heart size={10} fill="var(--accent)" style={{ color: 'var(--accent)' }} />
              </motion.span>{' '}
              for writers
            </span>
          </div>

        </div>
      </footer>
    </>
  );
}
