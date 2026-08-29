'use client';

import { motion } from 'framer-motion';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

const SECTIONS = [
  {
    title: 'Information we collect',
    body: `When you create a Bloggie account, we collect your name, email address, and a password. If you sign in with Google, we receive your name and email from Google. When you publish a post, we store your content. When you interact with posts (likes, comments, bookmarks), we store those interactions. We also collect basic usage data (pages visited, features used) to improve the product.`,
  },
  {
    title: 'How we use your information',
    body: `We use your information to provide and improve Bloggie: to create your account, display your posts, personalise your feed, send you notifications you have opted into, and occasionally reach out with product updates. We do not sell your data to third parties. We do not run ads. Your data is never used to train external AI models.`,
  },
  {
    title: 'Data sharing',
    body: `We share data with a small number of trusted service providers (hosting, email, analytics) only to the extent necessary to operate the platform. All providers are contractually obligated to keep your data confidential and use it only for the services they provide to us. We will disclose data if required by law, but we will notify you first whenever legally permitted.`,
  },
  {
    title: 'Your rights',
    body: `You may access, correct, or delete your personal data at any time from the Settings page. You can export all your posts and data as a JSON file. You can close your account permanently, and we will delete all your personal data within 30 days. If you are in the EU or UK, you have additional rights under GDPR and UK GDPR, including the right to portability and the right to lodge a complaint with your supervisory authority.`,
  },
  {
    title: 'Cookies',
    body: `We use strictly necessary cookies to keep you signed in. We use a single analytics cookie to count unique visitors — it stores no personal identifiers. You can disable all non-essential cookies in your browser settings without affecting core functionality. We do not use advertising cookies.`,
  },
  {
    title: 'Security',
    body: `All data is encrypted in transit (TLS) and at rest (AES-256). Passwords are hashed with bcrypt. We undergo regular security audits and notify affected users within 72 hours of a confirmed data breach. For security disclosures, email security@bloggie.io.`,
  },
  {
    title: 'Changes to this policy',
    body: `We will notify you by email and via an in-app notice at least 14 days before any material changes take effect. Continued use of Bloggie after that period constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>
        <div className="max-w-2xl mx-auto px-5 py-20">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}>
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color:'var(--accent)' }}>Legal</span>
            <h1 className="text-4xl font-bold tracking-tight mb-2"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm mb-10" style={{ color:'var(--fg-4)' }}>Last updated: August 1, 2026</p>

            <p className="text-base leading-relaxed mb-10" style={{ color:'var(--fg-2)' }}>
              Your privacy matters to us. This policy explains what data Bloggie collects, how we use it, and your rights. We have written it in plain language — not legalese.
            </p>

            <div className="space-y-10">
              {SECTIONS.map(({ title, body }, i) => (
                <motion.div key={title}
                  initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.4, delay: i*0.04 }}>
                  <h2 className="text-xl font-bold mb-3"
                      style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>{title}</h2>
                  <p className="text-[15px] leading-relaxed" style={{ color:'var(--fg-2)' }}>{body}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 p-6 rounded-2xl border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color:'var(--fg)' }}>Questions?</p>
              <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                Email us at{' '}
                <a href="mailto:privacy@bloggie.io" className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                   style={{ color:'var(--fg-2)' }}>privacy@bloggie.io</a>
                {' '}and we will respond within 48 hours.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
