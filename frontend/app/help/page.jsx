'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Settings, CreditCard, Shield, Zap, MessageCircle,
  ChevronDown, ArrowRight, Search,
} from 'lucide-react';
import Link      from 'next/link';
import PageShell from '@/app/components/PageShell';
import Reveal    from '@/app/components/ui/Reveal';
import Blob      from '@/app/components/ui/Blob';
import { staggerSlow, fadeUp } from '@/app/lib/motion';

// ─── Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Getting started',
    desc:  'Set up your account and publish your first post in minutes.',
    articles: ['Creating your account', 'Writing & formatting your first post', 'Adding a cover image', 'Publishing and sharing', 'Setting up your profile'],
  },
  {
    icon: Settings,
    title: 'Account & settings',
    desc:  'Manage your profile, notifications, and security.',
    articles: ['Changing your email or password', 'Two-factor authentication', 'Notification preferences', 'Exporting your data', 'Deleting your account'],
  },
  {
    icon: CreditCard,
    title: 'Billing & plans',
    desc:  'Understand your plan, upgrade, or cancel at any time.',
    articles: ['What is the free plan?', 'Upgrading to Pro', 'Cancelling your subscription', 'Refund policy', 'Accepted payment methods'],
  },
  {
    icon: Zap,
    title: 'The editor',
    desc:  'Tips and tricks to get the most out of our writing tools.',
    articles: ['Keyboard shortcuts', 'Embedding images & media', 'Code blocks and syntax highlighting', 'Saving drafts', 'Markdown support'],
  },
  {
    icon: Shield,
    title: 'Privacy & safety',
    desc:  'Control who sees your content and how your data is used.',
    articles: ['Making a post private', 'Blocking a user', 'Reporting content', 'How we store your data', 'Cookie settings'],
  },
  {
    icon: MessageCircle,
    title: 'Community',
    desc:  'Grow your audience and engage with other writers.',
    articles: ['Following other writers', 'Comments and reactions', 'Getting discovered', 'Writer badges', 'Community guidelines'],
  },
];

const FAQS = [
  {
    q: 'Is Bloggie really free?',
    a: 'Yes. The core experience — writing, publishing, and building an audience — is completely free, forever. We offer an optional Pro plan with advanced analytics and custom domains.',
  },
  {
    q: 'Who owns my content?',
    a: 'You do, 100%. We never claim ownership of your writing. You can export or delete everything at any time from your account settings.',
  },
  {
    q: 'Can I use a custom domain?',
    a: 'Custom domains are available on the Pro plan. You can point any domain you own to your Bloggie profile in a few steps.',
  },
  {
    q: 'Does Bloggie use an algorithm to decide what gets seen?',
    a: 'No. We don\'t suppress or amplify posts based on engagement signals. What you publish goes straight to your followers and is discoverable through search and tags.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings → Account → Delete account. Your content is removed immediately and your personal data is purged within 30 days.',
  },
  {
    q: 'Can I import posts from Medium or Substack?',
    a: 'Yes. We support importing from Medium (via their export feature) and from any RSS feed. The importer is in Settings → Import.',
  },
];

// ─── FAQ accordion item ─────────────────────────────────────────────────────
function FaqItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.05}>
      <motion.div
        className="border-b last:border-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          className="w-full flex items-center justify-between gap-4 py-5 text-left"
          onClick={() => setOpen(o => !o)}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>{q}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }} className="shrink-0">
            <ChevronDown size={16} strokeWidth={2} style={{ color: 'var(--fg-3)' }} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{   height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <p className="text-sm leading-relaxed pb-5" style={{ color: 'var(--fg-2)' }}>{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  );
}

// ─── Category card ─────────────────────────────────────────────────────────
function CategoryCard({ icon: Icon, title, desc, articles }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -4 }}
      className="flex flex-col p-7 rounded-2xl border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
           style={{ background: 'var(--accent-dim)' }}>
        <Icon size={20} strokeWidth={2} style={{ color: 'var(--accent)' }} />
      </div>
      <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--fg)' }}>{title}</h3>
      <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--fg-3)' }}>{desc}</p>
      <ul className="space-y-2 mb-4">
        {articles.slice(0, expanded ? articles.length : 3).map(a => (
          <li key={a}>
            <a href="#" className="text-xs flex items-center gap-1.5 group transition-colors hover:text-[var(--accent)]"
               style={{ color: 'var(--fg-3)' }}>
              <ArrowRight size={10} strokeWidth={2.5} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
              {a}
            </a>
          </li>
        ))}
      </ul>
      {articles.length > 3 && (
        <button onClick={() => setExpanded(o => !o)}
          className="text-xs font-semibold transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--fg-4)' }}>
          {expanded ? 'Show less' : `+${articles.length - 3} more`}
        </button>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const [query, setQuery] = useState('');

  return (
    <PageShell>
      {/* ── Hero + search ── */}
      <section className="relative overflow-hidden pt-20 pb-20 px-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <Blob className="w-[440px] h-[440px] -top-24 left-1/2 -translate-x-1/2"
              style={{ background: 'var(--accent)', opacity: 0.08 }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Help centre</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              How can we help?
            </h1>
            {/* Search bar */}
            <div className="relative">
              <Search size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--fg-3)' }} />
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full h-12 pl-10 pr-4 rounded-2xl text-sm border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--fg)', outline: 'none' }}
              />
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--fg-3)' }}>
              Or browse the categories below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>Browse by topic</h2>
          </Reveal>
          <motion.div initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }} variants={staggerSlow}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map(c => <CategoryCard key={c.title} {...c} />)}
          </motion.div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 px-5 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-3xl mx-auto">
          <Reveal className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
            <div className="divide-y px-6" style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' }}>
              {FAQS.map((f, i) => <FaqItem key={f.q} {...f} i={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ── Still need help ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center gap-6 p-8 rounded-2xl border"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--fg)' }}>Still can't find what you need?</h3>
                <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
                  Our support team reads every message and replies within one business day.
                </p>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white shrink-0 transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)' }}>
                Contact support <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
