'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Heart, Globe, Zap, Shield } from 'lucide-react';
import Navbar  from '@/app/components/Navbar';
import Footer  from '@/app/components/Footer';
import Reveal  from '@/app/components/ui/Reveal';
import Blob    from '@/app/components/ui/Blob';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { stagger, fadeUp } from '@/app/lib/motion';

const TEAM = [
  { name:'Amara Osei',    role:'CEO & Co-founder',   initials:'AO', color:'#ef4444', bio:'Former PM at Notion. Obsessed with writing tools.' },
  { name:'Lena Fischer',  role:'CTO & Co-founder',   initials:'LF', color:'#8b5cf6', bio:'Ex-Stripe infrastructure. Built things people rely on.' },
  { name:'Marcus Tan',    role:'Head of Design',     initials:'MT', color:'#3b82f6', bio:'10 years of product design. Figma power user.' },
  { name:'Priya Nair',    role:'Head of Growth',     initials:'PN', color:'#10b981', bio:'Grew three B2C products to 1M+ users.' },
];

const VALUES = [
  { icon: Heart,  color:'#ef4444', title:'Writers first',       desc:'Every product decision starts with one question: does this make writing better?' },
  { icon: Globe,  color:'#3b82f6', title:'Open web forever',    desc:'Your content belongs to you. No lock-in, full data export, always.' },
  { icon: Zap,    color:'#f97316', title:'Fast above all else', desc:'Readers stay when pages load fast. We obsess over performance.' },
  { icon: Shield, color:'#10b981', title:'Privacy by default',  desc:'We do not sell your data. We do not show ads. We never will.' },
];

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>

        {/* Hero */}
        <section className="relative overflow-hidden py-28 px-5 text-center">
          <Blob className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ background:'var(--accent)', opacity:0.07 }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.span initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.4 }}
              className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ background:'var(--accent-dim)', color:'var(--accent)', border:'1px solid var(--accent-glow)' }}>
              Our story
            </motion.span>
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              Writing deserves a better home.
            </motion.h1>
            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.2, duration:0.5 }}
              className="text-lg leading-relaxed" style={{ color:'var(--fg-3)' }}>
              We built Bloggie because every platform we tried got in the way of the writing. We wanted a place that disappears — and lets the ideas take over.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className="px-5 py-20 border-t" style={{ borderColor:'var(--border)' }}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color:'var(--accent)' }}>Mission</p>
              <h2 className="text-3xl font-bold tracking-tight mb-5"
                  style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
                Give every idea a place to live.
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color:'var(--fg-2)' }}>
                The internet has made it possible for anyone to publish. But most platforms buried the writing under metrics, ads, and noise. We think the story should be the product.
              </p>
              <p className="text-base leading-relaxed" style={{ color:'var(--fg-2)' }}>
                Bloggie is designed around one principle: give writers the simplest, most beautiful tool to share what they know — and connect them with the readers who need it.
              </p>
            </Reveal>
            {/* Stats */}
            <Reveal>
              <div className="grid grid-cols-2 gap-4">
                {[['2025','Founded'],['12K+','Writers'],['80K+','Stories'],['2M+','Monthly readers']].map(([v,l]) => (
                  <div key={l} className="p-6 rounded-2xl border text-center"
                       style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                    <p className="text-3xl font-bold mb-1"
                       style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--accent)' }}>{v}</p>
                    <p className="text-sm" style={{ color:'var(--fg-3)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values */}
        <section className="px-5 py-20 border-t" style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>What we believe</h2>
            </Reveal>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
              className="grid sm:grid-cols-2 gap-5">
              {VALUES.map(({ icon: Icon, color, title, desc }) => (
                <motion.div key={title} variants={fadeUp}
                  className="flex gap-4 p-6 rounded-2xl border"
                  style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                       style={{ background:`${color}18` }}>
                    <Icon size={18} strokeWidth={1.8} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-base font-semibold mb-1.5" style={{ color:'var(--fg)' }}>{title}</p>
                    <p className="text-sm leading-relaxed" style={{ color:'var(--fg-3)' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="px-5 py-20 border-t" style={{ borderColor:'var(--border)' }}>
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-14">
              <h2 className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>The team</h2>
              <p className="mt-3 text-sm" style={{ color:'var(--fg-3)' }}>
                Four people who love good writing and hate bad software.
              </p>
            </Reveal>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once:true }} variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TEAM.map(({ name, role, initials, color, bio }) => (
                <motion.div key={name} variants={fadeUp} whileHover={{ y:-5 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border"
                  style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <motion.div whileHover={{ scale:1.06 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white mb-4"
                    style={{ background: color }}>{initials}</motion.div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color:'var(--fg)' }}>{name}</p>
                  <p className="text-xs mb-3" style={{ color:'var(--accent)' }}>{role}</p>
                  <p className="text-xs leading-relaxed" style={{ color:'var(--fg-3)' }}>{bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-24 text-center border-t" style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
          <Reveal>
            <h2 className="text-3xl font-bold mb-4"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              Ready to start writing?
            </h2>
            <p className="text-base mb-8" style={{ color:'var(--fg-3)' }}>
              Join 12,000+ writers publishing on Bloggie. Free forever.
            </p>
            <Link href="/register">
              <motion.span whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-base font-semibold text-white cursor-pointer"
                style={{ background:'var(--accent)' }}>
                Create your account <ArrowRight size={16} strokeWidth={2.5} />
              </motion.span>
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
