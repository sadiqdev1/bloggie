'use client';

import PageShell from '@/app/components/PageShell';
import Reveal    from '@/app/components/ui/Reveal';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Accepting these terms',
    body: [
      'By accessing or using Bloggie you agree to be bound by these Terms of Service and our Privacy Policy.',
      'If you do not agree, please do not use Bloggie.',
      'We may update these terms. Continued use after changes constitutes acceptance.',
    ],
  },
  {
    title: '2. Your account',
    body: [
      'You must be 13 years or older to create an account.',
      'You are responsible for keeping your account credentials secure.',
      'You must not share your account with others or create accounts for automated use without our written permission.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    title: '3. Your content',
    body: [
      'You retain full ownership of the content you publish on Bloggie.',
      'By publishing, you grant Bloggie a non-exclusive, royalty-free licence to display, distribute, and store your content solely for the purpose of operating the platform.',
      'You are solely responsible for ensuring your content does not violate any laws or third-party rights.',
    ],
  },
  {
    title: '4. Prohibited content',
    body: [
      'You may not publish content that is illegal, defamatory, abusive, hateful, or that infringes intellectual property rights.',
      'Spam, phishing, malware, or any content designed to deceive or harm users is strictly prohibited.',
      'We will remove content that violates these rules and may terminate the associated account without notice.',
    ],
  },
  {
    title: '5. Service availability',
    body: [
      'We aim for 99.9% uptime but do not guarantee uninterrupted access.',
      'We may modify, suspend, or discontinue features with reasonable notice.',
      'We are not liable for any loss arising from service interruptions.',
    ],
  },
  {
    title: '6. Limitation of liability',
    body: [
      'Bloggie is provided "as is" without warranties of any kind.',
      'To the maximum extent permitted by law, Bloggie is not liable for indirect, incidental, or consequential damages.',
      'Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.',
    ],
  },
  {
    title: '7. Governing law',
    body: [
      'These terms are governed by the laws of Nigeria.',
      'Any disputes shall be resolved in the courts of Lagos, Nigeria.',
    ],
  },
  {
    title: '8. Contact',
    body: [
      'For questions about these terms, email legal@bloggie.app.',
    ],
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="pt-20 pb-14 px-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Terms of Service
            </h1>
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              Last updated: <span style={{ color: 'var(--fg-2)' }}>1 August 2026</span>
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--fg-2)' }}>
              These terms govern your use of Bloggie. Please read them carefully.
              We've kept them as short and readable as possible.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-5">
        <div className="max-w-3xl mx-auto space-y-12">
          {SECTIONS.map(({ title, body }, i) => (
            <Reveal key={title} delay={i * 0.04}>
              <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
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

          <Reveal>
            <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--fg)' }}>Questions about these terms?</p>
              <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
                Email{' '}
                <a href="mailto:legal@bloggie.app"
                   className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                   style={{ color: 'var(--fg-2)' }}>
                  legal@bloggie.app
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
