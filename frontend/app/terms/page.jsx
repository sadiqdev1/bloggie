'use client';

import { motion } from 'framer-motion';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

const SECTIONS = [
  {
    title: '1. Who can use Bloggie',
    body: `You must be at least 13 years old (16 in the EU/UK) to create a Bloggie account. By creating an account you confirm that you meet this requirement and that the information you provide is accurate.`,
  },
  {
    title: '2. Your content',
    body: `You own everything you write and publish on Bloggie. By publishing, you grant Bloggie a non-exclusive, royalty-free licence to display your content to other users and in search results. You can revoke this licence at any time by deleting your content or closing your account. You are responsible for ensuring that your content does not infringe the intellectual property rights of others.`,
  },
  {
    title: '3. Acceptable use',
    body: `You agree not to use Bloggie to publish content that is illegal, harmful, threatening, abusive, harassing, defamatory, or discriminatory. You agree not to use Bloggie to spam, phish, distribute malware, scrape content at scale, or attempt to access systems you are not authorised to access. We reserve the right to remove content and suspend accounts that violate these rules.`,
  },
  {
    title: '4. Intellectual property',
    body: `The Bloggie brand, logo, product design, and codebase are owned by Bloggie Ltd and may not be reproduced without written permission. Content published by other users is owned by those users. The Bloggie name and logo may not be used in any way that suggests endorsement without our written approval.`,
  },
  {
    title: '5. Account termination',
    body: `You may close your account at any time from the Settings page. We may suspend or terminate accounts that violate these Terms, with or without notice. Upon termination, your content will be removed from public view within 30 days. You may export your data before closing your account.`,
  },
  {
    title: '6. Disclaimer of warranties',
    body: `Bloggie is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted access, freedom from bugs, or that the service will meet your specific requirements. To the maximum extent permitted by law, Bloggie disclaims all implied warranties.`,
  },
  {
    title: '7. Limitation of liability',
    body: `To the maximum extent permitted by applicable law, Bloggie will not be liable for indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability to you will not exceed the amount you paid us in the 12 months before the claim arose.`,
  },
  {
    title: '8. Changes to these Terms',
    body: `We may update these Terms. We will notify you by email and via an in-app notice at least 14 days before material changes take effect. If you continue using Bloggie after that period, you accept the updated Terms.`,
  },
  {
    title: '9. Governing law',
    body: `These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales, unless you are a consumer located in another jurisdiction that grants you mandatory local protections.`,
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm mb-10" style={{ color:'var(--fg-4)' }}>Last updated: August 1, 2026</p>

            <p className="text-base leading-relaxed mb-10" style={{ color:'var(--fg-2)' }}>
              By using Bloggie you agree to these Terms. Please read them carefully. We have kept them as short and plain-English as possible.
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
              <p className="text-sm font-semibold mb-1" style={{ color:'var(--fg)' }}>Questions about these Terms?</p>
              <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                Email{' '}
                <a href="mailto:legal@bloggie.io" className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                   style={{ color:'var(--fg-2)' }}>legal@bloggie.io</a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
