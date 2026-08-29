'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Book, PenLine, User, Settings, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Reveal from '@/app/components/ui/Reveal';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { stagger, fadeUp } from '@/app/lib/motion';

const CATEGORIES = [
  { icon: PenLine,        color:'#f97316', label:'Writing & publishing', count:12 },
  { icon: User,           color:'#8b5cf6', label:'Account & profile',   count:8  },
  { icon: Book,           color:'#3b82f6', label:'Reading & exploring', count:6  },
  { icon: Settings,       color:'#10b981', label:'Settings & privacy',  count:9  },
  { icon: MessageCircle,  color:'#f59e0b', label:'Comments & community',count:5  },
];

const FAQS = [
  {
    q: 'How do I publish my first post?',
    a: 'Click "Write" in the navigation bar to open the editor. Write your title and body, add tags, and click "Publish". Your post will be live instantly.',
  },
  {
    q: 'Can I edit or delete a post after publishing?',
    a: 'Yes. Open the post, click the three-dot menu (⋯) in the toolbar, and select "Edit" or "Delete". Edits are reflected immediately.',
  },
  {
    q: 'How does the feed algorithm work?',
    a: 'Your "For You" tab shows posts based on topics you follow, writers you follow, and your reading history. You can reset your preferences in Settings → Interests.',
  },
  {
    q: 'How do I change my username?',
    a: 'Go to Settings → Profile and update the Username field. Usernames must be unique and contain only letters, numbers, and underscores.',
  },
  {
    q: 'Is Bloggie free?',
    a: 'Yes. Reading and writing are always free. We plan to offer an optional supporter plan in the future, but the core product will remain free forever.',
  },
  {
    q: 'How do I export my data?',
    a: 'Go to Settings → Account → Export data. You will receive a JSON file containing all your posts, comments, and account information within a few minutes.',
  },
  {
    q: 'How do I report a post or account?',
    a: 'Click the three-dot menu (⋯) on any post or profile and select "Report". Select a reason and submit. Our moderation team reviews all reports within 24 hours.',
  },
  {
    q: 'Can I use a custom domain?',
    a: 'Custom domains are on our roadmap and will be available in a future update. Follow our blog for announcements.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout
      className="border-b last:border-0 overflow-hidden"
      style={{ borderColor:'var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 transition-colors hover:bg-[var(--bg-hover)]">
        <span className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.2 }} className="shrink-0">
          <ChevronDown size={16} strokeWidth={2} style={{ color:'var(--fg-4)' }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{   height:0, opacity:0 }} transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}>
            <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color:'var(--fg-3)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HelpPage() {
  const [query, setQuery] = useState('');

  const filtered = FAQS.filter(f =>
    !query.trim() ||
    f.q.toLowerCase().includes(query.toLowerCase()) ||
    f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>

        {/* Hero */}
        <section className="py-20 px-5 text-center border-b" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight mb-3"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              How can we help?
            </h1>
            <p className="text-base mb-8" style={{ color:'var(--fg-3)' }}>
              Search our help articles or browse by category.
            </p>
            <div className="relative max-w-lg mx-auto">
              <Search size={16} strokeWidth={2}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color:'var(--fg-4)' }} />
              <input type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search help articles…"
                className="w-full h-12 pl-11 pr-5 rounded-2xl text-sm border outline-none transition-all"
                style={{
                  background:  'var(--bg)',
                  color:       'var(--fg)',
                  borderColor: query ? 'var(--accent)' : 'var(--border)',
                  boxShadow:   query ? '0 0 0 3px var(--accent-dim)' : '0 4px 24px rgba(0,0,0,0.06)',
                }} />
            </div>
          </Reveal>
        </section>

        {/* Categories */}
        {!query && (
          <section className="px-5 py-16 border-b" style={{ borderColor:'var(--border)' }}>
            <div className="max-w-4xl mx-auto">
              <Reveal className="mb-8">
                <h2 className="text-xl font-bold" style={{ color:'var(--fg)' }}>Browse by category</h2>
              </Reveal>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATEGORIES.map(({ icon: Icon, color, label, count }) => (
                  <motion.div key={label} variants={fadeUp} whileHover={{ y:-3 }}
                    className="flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                         style={{ background:`${color}18` }}>
                      <Icon size={16} strokeWidth={1.8} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color:'var(--fg)' }}>{label}</p>
                      <p className="text-xs" style={{ color:'var(--fg-4)' }}>{count} articles</p>
                    </div>
                    <ArrowRight size={14} strokeWidth={2} style={{ color:'var(--fg-4)' }} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section className="px-5 py-16">
          <div className="max-w-2xl mx-auto">
            <Reveal className="mb-6">
              <h2 className="text-xl font-bold" style={{ color:'var(--fg)' }}>
                {query ? `Results for "${query}"` : 'Frequently asked questions'}
              </h2>
            </Reveal>
            <div className="rounded-2xl border overflow-hidden" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <AnimatePresence>
                {filtered.length > 0
                  ? filtered.map(f => <FAQItem key={f.q} {...f} />)
                  : (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                      className="py-16 text-center">
                      <p className="text-3xl mb-3">🔍</p>
                      <p className="font-semibold mb-1" style={{ color:'var(--fg)' }}>No results found</p>
                      <p className="text-sm" style={{ color:'var(--fg-3)' }}>Try different keywords or contact us directly.</p>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Still stuck CTA */}
        <section className="px-5 pb-20">
          <Reveal className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-7 rounded-2xl border"
                 style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <div>
                <p className="font-semibold mb-1" style={{ color:'var(--fg)' }}>Still need help?</p>
                <p className="text-sm" style={{ color:'var(--fg-3)' }}>Our team replies to every message, usually within a few hours.</p>
              </div>
              <Link href="/contact">
                <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white cursor-pointer shrink-0"
                  style={{ background:'var(--accent)' }}>
                  Contact us <ArrowRight size={14} strokeWidth={2.5} />
                </motion.span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
