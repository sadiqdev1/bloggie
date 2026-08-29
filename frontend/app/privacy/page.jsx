'use client';

import PageShell from '@/app/components/PageShell';
import Reveal    from '@/app/components/ui/Reveal';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: 'Information we collect',
    body: [
      'When you create an account we collect your name, email address, and password (hashed — we never store it in plain text).',
      'When you publish a post we store the content, metadata (title, tags, cover image), and timestamps.',
      'We automatically collect basic usage data: pages visited, referrer, browser type, and approximate country. We do not fingerprint individual users.',
    ],
  },
  {
    title: 'How we use your information',
    body: [
      'To operate and improve the Bloggie platform.',
      'To send transactional emails (account confirmation, password resets). We only send marketing emails if you explicitly opt in.',
      'To detect and prevent abuse, spam, and security threats.',
      'We never sell your data to third parties.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use a single session cookie to keep you signed in. We do not use advertising or tracking cookies.',
      'You can clear cookies at any time from your browser settings. Doing so will sign you out.',
    ],
  },
  {
    title: 'Data retention',
    body: [
      'Your account data is retained for as long as your account is active.',
      'If you delete your account, we permanently erase your personal data within 30 days. Published content is removed immediately.',
      'Anonymised, aggregated usage statistics may be retained indefinitely.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You can export all your data at any time from Settings → Data export.',
      'You can request deletion of your account and all associated data from Settings → Delete account.',
      'For any other requests (access, rectification, portability) contact us at privacy@bloggie.app.',
    ],
  },
  {
    title: 'Security',
    body: [
      'All data is transmitted over TLS (HTTPS). Passwords are hashed with bcrypt. We conduct regular security reviews.',
      'In the event of a data breach we will notify affected users within 72 hours.',
    ],
  },
  {
    title: 'Changes to this policy',
    body: [
      'We may update this policy from time to time. We will notify you by email and via an in-app banner for any material changes.',
      'Continued use of Bloggie after the effective date constitutes acceptance of the updated policy.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="pt-20 pb-14 px-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              Last updated: <span style={{ color: 'var(--fg-2)' }}>1 August 2026</span>
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--fg-2)' }}>
              We believe privacy is a right, not a feature. This policy explains what we collect,
              why, and what choices you have. We've written it in plain language — no legalese.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto space-y-12">
          {SECTIONS.map(({ title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <h2 className="text-xl font-bold mb-4 pb-3 border-b"
                    style={{ color: 'var(--fg)', borderColor: 'var(--border)' }}>
                  {title}
                </h2>
                <ul className="space-y-3">
                  {body.map((para, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                      {para}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}

          {/* Contact callout */}
          <Reveal>
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--fg)' }}>Questions about this policy?</p>
              <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
                Email us at{' '}
                <a href="mailto:privacy@bloggie.app"
                   className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                   style={{ color: 'var(--fg-2)' }}>
                  privacy@bloggie.app
                </a>
                . We respond within 2 business days.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
