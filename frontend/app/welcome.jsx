'use client';

/**
 * Welcome / landing page.
 *
 * Architecture decision: only truly reusable components live in /components.
 * Sections that are exclusive to this page (Hero, Stats, Features, etc.) live
 * here inline — splitting them out would just add indirection with zero benefit.
 *
 * Reusable components used:
 *   Navbar, Footer        — used on every page
 *   ThemeToggle           — used inside Navbar + potentially settings
 *   AppLogo               — used in Navbar, Footer, auth pages
 *   ui/Reveal, Blob, etc. — generic animation utilities
 */

import Link from 'next/link';
import NextImage from 'next/image';
import { useRef, useState } from 'react';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring,
  useMotionValue, useInView,
} from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowUpRight, BookOpen,
  CheckCircle2, Heart, Users, Share2, Star,
  PenLine, Globe, Zap, Shield, Send, Pencil, UserCircle2,
} from 'lucide-react';

// ── Reusable components ───────────────────────────────────────────────────────
import Navbar       from '@/app/components/Navbar';
import Footer       from '@/app/components/Footer';   // reusable — privacy/terms can use it too
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import CursorGlow   from '@/app/components/ui/CursorGlow';
import Divider      from '@/app/components/ui/Divider';
import Reveal       from '@/app/components/ui/Reveal';
import Blob         from '@/app/components/ui/Blob';
import MagneticBtn  from '@/app/components/ui/MagneticBtn';

// ── Hooks & data ──────────────────────────────────────────────────────────────
import { useTypingWord } from '@/app/hooks/useTypingWord';
import { useCountUp }    from '@/app/hooks/useCountUp';
import {
  TYPING_WORDS, STATS, FEATURES, HOW_STEPS,
  POSTS, TESTIMONIALS, TICKER_ITEMS,
} from '@/app/lib/welcome-data';
import { fadeUp, stagger, staggerSlow, scalePop } from '@/app/lib/motion';

// ── Icon map for data-driven sections ─────────────────────────────────────────
import { PenLine as PL, Globe as GL, Users as US, Sparkles as SP, Shield as SH, Zap as ZP } from 'lucide-react';
const FEATURE_ICONS = { PenLine: PL, Globe: GL, Users: US, Sparkles: SP, Shield: SH, Zap: ZP };
const STEP_ICONS    = { UserCircle2, Pencil, Send };

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const typed   = useTypingWord(TYPING_WORDS, 85, 1800);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)', paddingTop: '88px' }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
        backgroundSize:  '32px 32px',
      }} />

      <Blob className="w-[560px] h-[560px] -top-40 -left-28"   style={{ background: 'var(--accent)', opacity: 0.14 }} />
      <Blob className="w-[440px] h-[440px] bottom-0 -right-32" style={{ background: 'var(--accent)', opacity: 0.08 }} />

      {/* Floating decorative cards */}
      {[
        { title: 'The Art of Negative Space', tag: 'Design',      delay: 1.0, side: 'left'  },
        { title: 'Why I Stopped Using ORMs',  tag: 'Engineering', delay: 1.2, side: 'right' },
      ].map(({ title, tag, delay, side }) => (
        <motion.div key={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -9, 0] }}
          transition={{ opacity: { delay, duration: 0.4 }, y: { delay, duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }}
          className="absolute hidden lg:block p-4 rounded-2xl border shadow-xl w-44 text-left z-10"
          style={{
            background: 'var(--bg-card)', borderColor: 'var(--border)', top: '36%',
            ...(side === 'left'  ? { left:  'clamp(8px, 3vw, 60px)' } : {}),
            ...(side === 'right' ? { right: 'clamp(8px, 3vw, 60px)' } : {}),
            rotate: side === 'left' ? -4 : 4,
          }}
        >
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>{tag}</span>
          <p className="mt-2 text-xs font-semibold leading-snug" style={{ color: 'var(--fg)' }}>{title}</p>
          <div className="flex items-center gap-1.5 mt-3">
            <div className="w-4 h-4 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
            <div className="h-2 rounded-full flex-1"        style={{ background: 'var(--border-2)' }} />
          </div>
        </motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto px-5 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
          style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent-glow)', color: 'var(--accent)' }}
        >
          <motion.span animate={{ rotate: [0, 18, -10, 18, 0] }}
            transition={{ duration: 1.5, delay: 2, repeat: Infinity, repeatDelay: 4 }}>
            <Sparkles size={12} />
          </motion.span>
          The home for independent voices
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.06] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}
        >
          Your words,<br />
          <span style={{ color: 'var(--fg-2)' }}>your world. </span>
          <span className="relative inline-block" style={{ color: 'var(--accent)', minWidth: '3.5ch' }}>
            {typed}
            <motion.span className="inline-block w-[3px] rounded-full ml-0.5"
              style={{ background: 'var(--accent)', height: '0.8em', verticalAlign: 'baseline', marginBottom: '-1px' }}
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.85, repeat: Infinity }} />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: 'var(--fg-2)' }}
        >
          Bloggie is the open platform for thinkers, creators, and storytellers.
          Share your ideas with the world — no gatekeepers, no algorithms, no noise.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register">
            <MagneticBtn
              className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl text-base font-semibold text-white cursor-pointer"
              style={{ background: 'var(--accent)', boxShadow: '0 4px 24px var(--accent-glow)' }}
            >
              Start writing for free <ArrowRight size={16} strokeWidth={2.5} />
            </MagneticBtn>
          </Link>
          <Link href="/explore">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-2xl text-base font-semibold border cursor-pointer"
              style={{ color: 'var(--fg)', borderColor: 'var(--border-2)', background: 'var(--bg-card)' }}
            >
              <BookOpen size={16} strokeWidth={2} /> Explore stories
            </motion.button>
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-9 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[{i:'SR',c:'#ef4444'},{i:'JO',c:'#f97316'},{i:'PN',c:'#8b5cf6'},{i:'MK',c:'#10b981'},{i:'AL',c:'#3b82f6'}]
              .map(({ i: initials, c: color }, idx) => (
              <motion.div key={initials}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + idx * 0.07, duration: 0.28 }}
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: color, borderColor: 'var(--bg)' }}>
                {initials}
              </motion.div>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
            <span style={{ color: 'var(--fg-2)', fontWeight: 600 }}>12,000+</span> writers worldwide
          </p>
        </motion.div>

        {/* Mobile mini-editor */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 lg:hidden mx-auto max-w-xs rounded-2xl border overflow-hidden shadow-xl"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            {['#ef4444','#f59e0b','#22c55e'].map((c,i) => <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
            <div className="flex-1 mx-2 h-3 rounded" style={{ background: 'var(--bg-hover)' }} />
          </div>
          <div className="px-4 py-4 space-y-2">
            {['w-2/3','w-full','w-5/6','w-3/4'].map((w, i) => (
              <motion.div key={i} className={`h-2.5 ${w} rounded-full`}
                style={{ background: i === 0 ? 'var(--fg)' : 'var(--border-2)' }}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.08 }} />
            ))}
            <motion.div className="inline-block w-0.5 h-3.5 rounded-full" style={{ background: 'var(--accent)' }}
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.85, repeat: Infinity }} />
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-t text-xs"
               style={{ borderColor: 'var(--border)', color: 'var(--fg-4)' }}>
            <span>Draft saved</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={9} style={{ color: '#22c55e' }} /> Auto-saved</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — minimal: label + thin animated line */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.6, duration: 0.8 }}
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
>

  <motion.div
    animate={{ y: [0, 5, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="flex h-7 w-7 items-center justify-center rounded-full border"
    style={{
      borderColor: "var(--border-2)",
      color: "var(--fg-3)",
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-3.5 w-3.5"
    >
      <path d="M12 5v14" />
      <path d="m7 14 5 5 5-5" />
    </svg>
  </motion.div>
</motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
function StatItem({ value, display, label }) {
  const isFloat = !Number.isInteger(value);
  const target  = isFloat ? Math.round(value * 10) : value;
  const { ref, count } = useCountUp(target, 1600);
  const formatted = isFloat
    ? (count / 10).toFixed(1) + '★'
    : display.endsWith('+') ? count.toLocaleString() + '+'
    : display.includes('M')  ? (count / 1000).toFixed(1) + 'M+'
    : display;
  return (
    <motion.div ref={ref} variants={scalePop} className="text-center">
      <motion.p className="text-4xl md:text-5xl font-bold mb-1 tabular-nums"
        style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--accent)' }}
        whileHover={{ scale: 1.07 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
        {formatted}
      </motion.p>
      <p className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: 'var(--fg-3)' }}>{label}</p>
    </motion.div>
  );
}

function Stats() {
  return (
    <section className="py-20 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="max-w-5xl mx-auto px-5">
        <motion.div initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }} variants={staggerSlow}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map(s => <StatItem key={s.label} {...s} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITOR SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────
function EditorMockup() {
  const lines = [
    {w:'w-3/4',h:'h-5',bold:true }, {w:'w-full',h:'h-3',bold:false},
    {w:'w-5/6', h:'h-3',bold:false},{w:'w-2/3', h:'h-3',bold:false},
    {w:'w-0',   h:'h-3',bold:false},{w:'w-full',h:'h-3',bold:false},
    {w:'w-4/5', h:'h-3',bold:false},{w:'w-3/5', h:'h-3',bold:false},
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.75, ease: [0.16,1,0.3,1], delay: 0.2 }}
      className="relative w-full max-w-md mx-auto px-8 py-4">
      <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-25 pointer-events-none" style={{ background: 'var(--accent)' }} />
      <div className="relative rounded-2xl border overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          {['#ef4444','#f59e0b','#22c55e'].map((c,i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
          <div className="flex-1 mx-3 h-4 rounded-md" style={{ background: 'var(--bg-hover)' }} />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
          {['B','I','U'].map(t => (
            <span key={t} className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
              style={{ color: t==='B'?'var(--accent)':'var(--fg-3)', background: t==='B'?'var(--accent-dim)':'transparent' }}>{t}</span>
          ))}
          <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
          {['H1','H2','"'].map(t => <span key={t} className="w-6 h-6 rounded flex items-center justify-center text-xs" style={{ color: 'var(--fg-4)' }}>{t}</span>)}
        </div>
        <div className="px-5 py-5 space-y-2.5">
          {lines.map((l,i) => (
            <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.5+i*0.07, duration: 0.35 }}
              className={`${l.h} ${l.w} rounded-full`}
              style={{ background: l.bold?'var(--fg)':'var(--border-2)', opacity: l.w==='w-0'?0:1 }} />
          ))}
          <motion.div className="inline-block w-0.5 h-4 rounded-full ml-1" style={{ background: 'var(--accent)' }}
            animate={{ opacity:[1,0,1] }} transition={{ duration:0.9, repeat:Infinity }} />
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t text-xs" style={{ borderColor:'var(--border)', color:'var(--fg-4)' }}>
          <span>Draft saved</span>
          <span className="flex items-center gap-1"><CheckCircle2 size={10} style={{ color:'#22c55e' }} /> Auto-saved</span>
        </div>
      </div>
      <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:1.2, duration:0.4 }}
        className="absolute right-0 top-1/3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg text-xs font-medium"
        style={{ background:'var(--bg-card)', borderColor:'var(--border)', color:'var(--fg-2)' }}>
        <Heart size={11} fill="var(--accent)" style={{ color:'var(--accent)' }} /> 2.4k loves
      </motion.div>
      <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:1.4, duration:0.4 }}
        className="absolute left-0 bottom-1/4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg text-xs font-medium"
        style={{ background:'var(--bg-card)', borderColor:'var(--border)', color:'var(--fg-2)' }}>
        <Users size={11} style={{ color:'var(--accent)' }} /> 840 readers
      </motion.div>
    </motion.div>
  );
}

function EditorShowcase() {
  return (
    <section className="py-28 px-5 overflow-visible" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal delay={0}><p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color:'var(--accent)' }}>The editor</p></Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
                style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
              Writing that feels<br /><span style={{ color:'var(--accent)' }}>like thinking.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base leading-relaxed mb-8" style={{ color:'var(--fg-2)' }}>
              A minimal, distraction-free editor that supports rich formatting, embeds, code blocks,
              and beautiful typography out of the box. Your drafts are auto-saved in real-time so you never lose a word.
            </p>
          </Reveal>
          <motion.ul initial="hidden" whileInView="visible" viewport={{ once:true }}
            variants={{ visible:{ transition:{ staggerChildren:0.1, delayChildren:0.2 } } }} className="space-y-3">
            {['Real-time auto-save','Rich embeds & code blocks','Custom cover images','SEO-ready metadata'].map(item => (
              <motion.li key={item} variants={fadeUp} className="flex items-center gap-2.5 text-sm font-medium" style={{ color:'var(--fg-2)' }}>
                <CheckCircle2 size={16} style={{ color:'var(--accent)', flexShrink:0 }} />{item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <EditorMockup />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────────────────────
function FeatureCard({ iconName, title, desc }) {
  const [hov, setHov] = useState(false);
  const Icon = FEATURE_ICONS[iconName];
  return (
    <motion.div variants={fadeUp}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      animate={{ y: hov?-6:0, boxShadow: hov?'0 16px 48px rgba(0,0,0,0.07)':'0 0px 0px rgba(0,0,0,0)' }}
      className="p-7 rounded-2xl border cursor-default relative overflow-hidden"
      style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
      <motion.div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ background:'var(--accent)', translateX:'50%', translateY:'-50%' }}
        animate={{ opacity: hov?0.18:0 }} transition={{ duration:0.3 }} />
      <motion.div animate={{ rotate:hov?-10:0, scale:hov?1.18:1 }}
        transition={{ type:'spring', stiffness:380, damping:18 }}
        className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
        style={{ background:'var(--accent-dim)' }}>
        {Icon && <Icon size={20} strokeWidth={2} style={{ color:'var(--accent)' }} />}
      </motion.div>
      <h3 className="text-base font-semibold mb-2 relative" style={{ color:'var(--fg)' }}>{title}</h3>
      <p className="text-sm leading-relaxed relative"          style={{ color:'var(--fg-3)' }}>{desc}</p>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="py-28 px-5" style={{ background:'var(--bg-card)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>Why Bloggie</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
            Everything a writer needs.<br /><span style={{ color:'var(--fg-2)' }}>Nothing they don't.</span>
          </h2>
        </Reveal>
        <motion.div initial="hidden" whileInView="visible"
          viewport={{ once:true, margin:'-60px' }} variants={staggerSlow}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section className="py-28 px-5" style={{ background:'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>Get started</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
            Up and running in minutes.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute" style={{
            top:'40px', left:'calc(33.33% + 24px)', right:'calc(33.33% + 24px)',
            height:'1px', background:'linear-gradient(to right, transparent, var(--border-2), transparent)',
          }} />
          {HOW_STEPS.map(({ iconName, step, title, desc }, i) => {
            const Icon = STEP_ICONS[iconName];
            return (
              <Reveal key={step} delay={i * 0.12}>
                <motion.div whileHover={{ y:-5 }}
                  className="relative flex flex-col items-center text-center p-8 rounded-2xl border"
                  style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <span className="text-xs font-bold tabular-nums mb-4 px-2.5 py-1 rounded-full"
                        style={{ background:'var(--accent-dim)', color:'var(--accent)' }}>{step}</span>
                  <motion.div whileHover={{ rotate:-8, scale:1.12 }}
                    transition={{ type:'spring', stiffness:380, damping:18 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background:'var(--accent-dim)' }}>
                    {Icon && <Icon size={24} strokeWidth={1.8} style={{ color:'var(--accent)' }} />}
                  </motion.div>
                  <h3 className="text-base font-semibold mb-2" style={{ color:'var(--fg)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed"          style={{ color:'var(--fg-3)' }}>{desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS PREVIEW
// ─────────────────────────────────────────────────────────────────────────────
function PostsPreview() {
  const [hovered, setHovered] = useState(null);
  return (
    <section className="py-28 px-5" style={{ background:'var(--bg-card)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>Trending now</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>Stories people love.</h2>
          </div>
          <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-semibold group" style={{ color:'var(--accent)' }}>
            Browse all
            <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </Reveal>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }} variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((post, i) => (
            <motion.div key={post.title} variants={fadeUp} whileHover={{ y:-8 }}
              onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)}>
              <Link href={`/blog/${post.slug}`}
                className="flex flex-col rounded-2xl border overflow-hidden cursor-pointer h-full"
                style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
                <div className="relative h-44 overflow-hidden">
                  <NextImage src={post.cover} alt={post.title} fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500"
                    style={{ transform: hovered===i?'scale(1.06)':'scale(1)' }}
                    loading="lazy" placeholder="blur" blurDataURL={post.blurDataURL} />
                  <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ background:'rgba(0,0,0,0.4)', color:'#fff' }}>{post.tag}</span>
                  <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                        style={{ background:'rgba(0,0,0,0.35)', color:'rgba(255,255,255,0.8)' }}>{post.readTime} read</span>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-base font-semibold leading-snug mb-2 transition-colors"
                      style={{ color: hovered===i?post.accent:'var(--fg)' }}>{post.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color:'var(--fg-3)' }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                           style={{ background:post.author.color }}>{post.author.initials}</div>
                      <span className="text-xs font-medium" style={{ color:'var(--fg-3)' }}>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color:'var(--fg-4)' }}>
                      <span className="flex items-center gap-1">
                        <Heart size={11} style={hovered===i?{ color:post.accent }:{}} />{post.hearts}
                      </span>
                      <Share2 size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────────────────────────────────────────
function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="py-3.5 overflow-hidden" style={{ background:'var(--accent)' }}>
      <motion.div className="flex whitespace-nowrap"
        animate={{ x:['0%','-50%'] }} transition={{ duration:25, repeat:Infinity, ease:'linear' }}>
        {items.map((item, i) => (
          <span key={i} className="text-sm font-semibold text-white shrink-0 flex items-center">
            <span className="mx-5 opacity-40 font-light select-none">·</span>{item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
function Testimonials() {
  const hideScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none' };
  return (
    <section className="py-28 px-5 overflow-hidden" style={{ background:'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>Writers love us</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
            Don't take our word for it.
          </h2>
        </Reveal>
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible"
             style={hideScrollbar}>
          {TESTIMONIALS.map(({ quote, name, role, initials, color }, i) => (
            <motion.div key={name}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-60px' }}
              transition={{ duration:0.6, ease:[0.16,1,0.3,1], delay:i*0.1 }}
              whileHover={{ y:-5 }}
              className={['flex flex-col p-7 rounded-2xl border relative overflow-hidden',
                'shrink-0 w-[82vw] sm:w-[55vw] md:w-auto snap-center',
                i===1?'md:mt-8':''].join(' ')}
              style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
              <span className="absolute top-3 right-5 text-7xl font-serif leading-none opacity-[0.05] select-none pointer-events-none"
                    style={{ color:'var(--fg)' }}>"</span>
              <div className="flex gap-0.5 mb-5">
                {Array.from({length:5}).map((_,j) => (
                  <motion.span key={j} initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}}
                    viewport={{once:true}} transition={{delay:0.25+j*0.06}}>
                    <Star size={13} fill="var(--accent)" style={{color:'var(--accent)'}} />
                  </motion.span>
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{color:'var(--fg-2)'}}>&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <motion.div whileHover={{scale:1.1,rotate:-4}}
                  transition={{type:'spring',stiffness:380,damping:18}}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{background:color}}>{initials}</motion.div>
                <div>
                  <p className="text-sm font-semibold" style={{color:'var(--fg)'}}>{name}</p>
                  <p className="text-xs"               style={{color:'var(--fg-3)'}}>{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA BANNER
// ─────────────────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="relative py-32 px-5 overflow-hidden" style={{ background:'var(--bg-card)' }}>
      <div className="absolute inset-0 pointer-events-none"
           style={{ background:'radial-gradient(ellipse 65% 55% at 50% 50%, var(--accent-dim) 0%, transparent 70%)' }} />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <motion.div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto"
            style={{ background:'var(--accent-dim)', border:'1px solid var(--accent-glow)' }}
            animate={{ rotate:[0,-7,7,-4,4,0] }} transition={{ duration:2.2, delay:0.8, repeat:Infinity, repeatDelay:5 }}>
            <PenLine size={28} strokeWidth={1.8} style={{color:'var(--accent)'}} />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5"
              style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
            Your story deserves<br /><span style={{color:'var(--accent)'}}>to be heard.</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{color:'var(--fg-2)'}}>
            Join thousands of writers sharing what they know, love, and believe.
            Free forever. No credit card. Just write.
          </p>
          <Link href="/register">
            <MagneticBtn className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white cursor-pointer mx-auto"
              style={{background:'var(--accent)', boxShadow:'0 0 48px var(--accent-glow)'}}>
              Create your blog — it's free <ArrowRight size={16} strokeWidth={2.5} />
            </MagneticBtn>
          </Link>
          <p className="mt-6 text-sm" style={{color:'var(--fg-4)'}}>
            Already writing?{' '}
            <Link href="/login" className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]">Sign in</Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />

      <noscript>
        <style>{`[style*="opacity: 0"]{opacity:1!important}[style*="transform"]{transform:none!important}`}</style>
      </noscript>

      <main>
        <Navbar />
        <Hero />
        <Stats />
        <Divider fromColor="var(--bg-card)" toColor="var(--bg)" />
        <EditorShowcase />
        <Divider fromColor="var(--bg)" toColor="var(--bg-card)" />
        <Features />
        <Divider fromColor="var(--bg-card)" toColor="var(--bg)" />
        <HowItWorks />
        <Divider fromColor="var(--bg)" toColor="var(--bg-card)" />
        <PostsPreview />
        <Marquee />
        <Testimonials />
        <CTABanner />
        <Footer />
      </main>
    </>
  );
}
