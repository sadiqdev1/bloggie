'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Heart, Bookmark, Share2, MessageCircle, ArrowLeft,
  ArrowRight, MoreHorizontal, Link2,
  ChevronUp, Eye, Clock, UserPlus, Check,
} from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import AuthNavbar from '@/app/components/AuthNavbar';
import Footer    from '@/app/components/Footer';
import Reveal    from '@/app/components/ui/Reveal';
import { staggerSlow, fadeUp } from '@/app/lib/motion';
import { FaXTwitter } from 'react-icons/fa6';

// ─── Mock post data ────────────────────────────────────────────────────────────
const POST = {
  slug:      'negative-space-ui',
  tag:       'Design',
  readTime:  '5 min',
  views:     '4,230',
  publishedAt: 'August 12, 2026',
  cover:     'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1400&q=80',
  blur:      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
  title:     'The art of negative space in UI',
  subtitle:  'How emptiness shapes attention, guides behaviour, and makes interfaces breathe',
  author:    {
    name:    'Sofia Reyes',
    initials:'SR',
    color:   '#f97316',
    role:    'Product designer & writer',
    bio:     'I write about design systems, typography, and the invisible craft behind great interfaces. Based in Lagos.',
    followers: '3.4k',
    posts:     '28',
  },
  stats:     { hearts: 318, comments: 47, views: 4230 },
  tags:      ['Design', 'UI/UX', 'Typography', 'Product'],
  content: [
    {
      type: 'lead',
      text: 'The best interfaces have one thing in common: they know when to get out of the way. Negative space — the empty area around and between elements — is not wasted space. It is the grammar that makes everything else legible.',
    },
    {
      type: 'h2',
      text: 'What negative space actually does',
    },
    {
      type: 'p',
      text: 'In visual design, space has weight. A densely packed layout feels urgent, anxious, cheap. A layout with generous breathing room feels confident, premium, trustworthy. This is not subjective. It is cognitive. When the eye has room to rest between elements, the brain processes them as distinct objects rather than a single undifferentiated mass.',
    },
    {
      type: 'p',
      text: 'The spacing system in your design is making a silent argument about the relationship between elements. Elements that are close together say "we belong together." Elements separated by space say "consider us individually." Get the hierarchy wrong and users will misread the page before they have even consciously looked at it.',
    },
    {
      type: 'blockquote',
      text: '"White space is to be regarded as an active element, not a passive background." — Jan Tschichold',
    },
    {
      type: 'h2',
      text: 'The three types of negative space',
    },
    {
      type: 'p',
      text: 'Macro space is the large, structural emptiness — the margins around your page, the padding inside a card, the gap between a headline and the body text. This is where you establish the overall rhythm of the layout. Most designers get this right because it is obvious.',
    },
    {
      type: 'p',
      text: 'Micro space is the small, local emptiness — the letter-spacing in your type, the padding between an icon and its label, the gap between list items. This is where most designs quietly fall apart. A button with 8px horizontal padding and a button with 20px horizontal padding feel like they belong to entirely different products.',
    },
    {
      type: 'p',
      text: 'Active space is intentional emptiness used as a design element in its own right. Apple\'s product pages are the canonical example. The white surrounding their hardware is not the absence of content — it is content. It says: look here, and nowhere else.',
    },
    {
      type: 'h2',
      text: 'A practical system',
    },
    {
      type: 'p',
      text: 'Stop adding space by eye. Build a spacing scale — 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 — and use nothing else. When your spacing is systematic, the whole layout achieves internal consistency without you having to check every component against every other component.',
    },
    {
      type: 'p',
      text: 'Then audit every component against two questions. First: is there enough space for this element to be read as a distinct object? Second: is the space between this element and its neighbours correctly communicating their relationship in the hierarchy? If the answer to either is no, you do not need more content. You need better space.',
    },
    {
      type: 'callout',
      text: 'Rule of thumb: if your UI feels cluttered, the problem is almost never that you need to remove content. It is that the content you have is not spaced to communicate its own hierarchy.',
    },
    {
      type: 'h2',
      text: 'The courage of restraint',
    },
    {
      type: 'p',
      text: 'Here is the uncomfortable truth about negative space: using it properly requires resisting pressure. Product managers want more features on the screen. Sales wants the value proposition bigger. Engineering wants to move fast and skip spacing passes. The designer who understands space knows that adding one more thing often makes everything worse — including the one more thing.',
    },
    {
      type: 'p',
      text: 'Restraint is a skill. It requires the confidence to defend empty space in a room that has been trained to see emptiness as wasted opportunity. But that defence is part of the craft. The negative space you protect is as much your work as the pixels you place.',
    },
  ],
  related: [
    { slug:'building-in-public', tag:'Business', readTime:'5 min', title:'What building in public actually looks like', author:{ name:'Lena Fischer',  initials:'LF', color:'#f59e0b' }, cover:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=70', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' },
    { slug:'deep-work-2024',     tag:'Productivity',readTime:'6 min',title:'Deep work in an always-on world',           author:{ name:'Marcus Tan',    initials:'MT', color:'#3b82f6' }, cover:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=70', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' },
    { slug:'slow-mornings',      tag:'Life',       readTime:'4 min', title:'Slow mornings as a productivity hack',     author:{ name:'Priya Nair',    initials:'PN', color:'#10b981' }, cover:'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=70', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH' },
  ],
};

const COMMENTS = [
  { id:1, author:{ name:'James Okafor', initials:'JO', color:'#8b5cf6' }, time:'2 hours ago', text:'This is exactly what I needed to read today. The audit framework at the end is something I\'m taking into every design review this week.', likes:12 },
  { id:2, author:{ name:'Marcus Tan',   initials:'MT', color:'#3b82f6' }, time:'4 hours ago', text:'The distinction between macro and micro space is so underrated. Most design feedback I get is at the macro level but it\'s always the micro-space that makes the real difference.', likes:8 },
  { id:3, author:{ name:'Lena Fischer', initials:'LF', color:'#f59e0b' }, time:'6 hours ago', text:'Bookmarked. "Restraint is a skill" — I\'m printing that and taping it to my monitor.', likes:21 },
];

// ─── Reading progress bar ─────────────────────────────────────────────────────
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] pointer-events-none"
      style={{ scaleX, background: 'var(--accent)' }} />
  );
}

// ─── Floating action toolbar ──────────────────────────────────────────────────
function FloatingToolbar({ liked, saved, onLike, onSave }) {
  const [shared, setShared] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const actions = [
    { icon: liked  ? Heart    : Heart,     label: `${POST.stats.hearts + (liked ? 1 : 0)}`, fn: onLike,  active: liked,  activeColor:'#ef4444' },
    { icon: MessageCircle,                  label: `${POST.stats.comments}`,                 fn: () => document.getElementById('comments')?.scrollIntoView({ behavior:'smooth' }), active: false, activeColor:'var(--accent)' },
    { icon: saved  ? Bookmark : Bookmark,  label: 'Save',                                   fn: onSave,  active: saved,  activeColor:'var(--accent)' },
    { icon: shared ? Check    : Share2,    label: shared ? 'Copied!' : 'Share',              fn: handleShare, active: shared, activeColor:'#22c55e' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{   opacity: 0, y: 20,  scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-2 rounded-2xl border shadow-2xl"
          style={{ background:'var(--bg-card)', borderColor:'var(--border)', backdropFilter:'blur(20px)' }}
        >
          {actions.map(({ icon: Icon, label, fn, active, activeColor }, i) => (
            <motion.button key={i} onClick={fn}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[48px]"
              style={{ background: active ? `${activeColor}18` : 'transparent' }}>
              <Icon size={16} strokeWidth={2}
                style={{
                  color: active ? activeColor : 'var(--fg-3)',
                  fill:  (i===0 && active) || (i===2 && active) ? activeColor : 'none',
                }} />
              <span className="text-[10px] font-medium"
                    style={{ color: active ? activeColor : 'var(--fg-4)' }}>{label}</span>
            </motion.button>
          ))}

          {/* Divider + back to top */}
          <div className="w-px h-8 mx-1" style={{ background:'var(--border)' }} />
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior:'smooth' })}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
          >
            <ChevronUp size={16} strokeWidth={2} style={{ color:'var(--fg-3)' }} />
            <span className="text-[10px] font-medium" style={{ color:'var(--fg-4)' }}>Top</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Content renderer ─────────────────────────────────────────────────────────
function ContentBlock({ block }) {
  const base = 'text-[17px] leading-[1.85] font-normal';
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-xl md:text-2xl leading-relaxed font-medium mb-8 first-of-type:mt-0"
           style={{ color:'var(--fg-2)', fontFamily:'var(--font-bricolage), sans-serif' }}>
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-12 mb-5"
            style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
          {block.text}
        </h2>
      );
    case 'p':
      return <p className={`${base} mb-5`} style={{ color:'var(--fg-2)' }}>{block.text}</p>;
    case 'blockquote':
      return (
        <blockquote
          className="my-8 pl-6 py-1 italic text-lg leading-relaxed border-l-4"
          style={{ borderColor:'var(--accent)', color:'var(--fg-2)' }}
        >
          {block.text}
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-8 p-6 rounded-2xl border-l-4"
             style={{ background:'var(--accent-dim)', borderColor:'var(--accent)', borderLeftWidth:'4px', borderTopWidth:'1px', borderRightWidth:'1px', borderBottomWidth:'1px', borderTopColor:'var(--accent-glow)', borderRightColor:'var(--accent-glow)', borderBottomColor:'var(--accent-glow)' }}>
          <p className={`${base} font-medium m-0`} style={{ color:'var(--fg)' }}>{block.text}</p>
        </div>
      );
    default:
      return null;
  }
}

// ─── Comment ──────────────────────────────────────────────────────────────────
function Comment({ author, time, text, likes: initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
           style={{ background: author.color }}>{author.initials}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{author.name}</span>
          <span className="text-xs" style={{ color:'var(--fg-4)' }}>{time}</span>
        </div>
        <p className="text-sm leading-relaxed mb-2.5" style={{ color:'var(--fg-2)' }}>{text}</p>
        <motion.button
          onClick={() => { setLiked(l => !l); setLikes(n => n + (liked ? -1 : 1)); }}
          whileTap={{ scale: 0.85 }}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: liked ? '#ef4444' : 'var(--fg-4)' }}>
          <Heart size={12} strokeWidth={2} style={{ fill: liked ? '#ef4444' : 'none' }} />
          {likes}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PostPage({ params }) {
  const [liked,      setLiked]      = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [following,  setFollowing]  = useState(false);
  const [comment,    setComment]    = useState('');
  const [shareOpen,  setShareOpen]  = useState(false);
  const contentRef = useRef(null);

  /* Parallax cover — spring-smoothed for physical feel */
  const { scrollY } = useScroll();
  const rawCoverY = useTransform(scrollY, [0, 600], [0, 110]);
  const coverY    = useSpring(rawCoverY, { stiffness: 60, damping: 20, mass: 0.8 });

  return (
    <>
      <ReadingProgress />
      <AuthNavbar />
      <FloatingToolbar liked={liked} saved={saved} onLike={() => setLiked(l=>!l)} onSave={() => setSaved(s=>!s)} />

      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>

        {/* ── Hero cover ── */}
        <section className="relative overflow-hidden" style={{ height:'clamp(320px,50vh,540px)' }}>
          <motion.div className="absolute inset-0 will-change-transform" style={{ y: coverY }}>
            <NextImage src={POST.cover} alt={POST.title} fill priority
              sizes="100vw" className="object-cover"
              placeholder="blur" blurDataURL={POST.blur} />
            <div className="absolute inset-0"
                 style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.6) 70%, var(--bg) 100%)' }} />
          </motion.div>

          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Link href="/blogs">
              <motion.span whileHover={{ scale:1.06, x:-2 }} whileTap={{ scale:0.95 }}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium backdrop-blur-sm cursor-pointer"
                style={{ background:'rgba(0,0,0,0.35)', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.15)' }}>
                <ArrowLeft size={14} strokeWidth={2} /> Back
              </motion.span>
            </Link>
          </div>

          {/* Cover meta */}
          <div className="absolute bottom-8 left-0 right-0 px-5 md:px-10 lg:px-20">
            <div className="max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                style={{ background:'rgba(239,68,68,0.3)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.4)' }}>
                {POST.tag}
              </motion.span>
              <motion.h1
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18, ease:[0.16,1,0.3,1] }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.08]"
                style={{ fontFamily:'var(--font-bricolage), sans-serif', textShadow:'0 2px 24px rgba(0,0,0,0.4)' }}>
                {POST.title}
              </motion.h1>
            </div>
          </div>
        </section>

        {/* ── Article ── */}
        <article className="px-5 md:px-10 lg:px-20">
          <div className="max-w-3xl mx-auto">

            {/* Subtitle */}
            <Reveal>
              <p className="text-lg mt-8 mb-8 leading-relaxed" style={{ color:'var(--fg-3)' }}>
                {POST.subtitle}
              </p>
            </Reveal>

            {/* Author row */}
            <Reveal>
              <div className="flex items-center justify-between gap-4 py-5 border-y mb-10"
                   style={{ borderColor:'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <Link href="#author">
                    <motion.div whileHover={{ scale:1.06 }}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer"
                      style={{ background: POST.author.color }}>
                      {POST.author.initials}
                    </motion.div>
                  </Link>
                  <div>
                    <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{POST.author.name}</p>
                    <div className="flex items-center gap-3 text-xs" style={{ color:'var(--fg-4)' }}>
                      <span className="flex items-center gap-1"><Clock size={11} /> {POST.readTime} read</span>
                      <span className="flex items-center gap-1"><Eye   size={11} /> {POST.views} views</span>
                      <span>{POST.publishedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setFollowing(f=>!f)}
                    whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
                    className="h-8 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      background: following ? 'var(--bg-hover)' : 'var(--accent)',
                      color:      following ? 'var(--fg-2)'    : '#fff',
                      border:     `1px solid ${following ? 'var(--border)' : 'var(--accent)'}`,
                    }}>
                    {following ? <><Check size={11} /> Following</> : <><UserPlus size={11} /> Follow</>}
                  </motion.button>
                  {/* Share dropdown */}
                  <div className="relative">
                    <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                      onClick={() => setShareOpen(s=>!s)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center border"
                      style={{ borderColor:'var(--border)', color:'var(--fg-3)', background:'var(--bg-card)' }}>
                      <Share2 size={14} strokeWidth={2} />
                    </motion.button>
                    <AnimatePresence>
                      {shareOpen && (
                        <motion.div
                          initial={{ opacity:0, y:-8, scale:0.96 }}
                          animate={{ opacity:1, y:0,  scale:1    }}
                          exit={{   opacity:0, y:-8,  scale:0.96 }}
                          transition={{ duration:0.18 }}
                          className="absolute right-0 top-10 w-44 rounded-xl border shadow-2xl overflow-hidden z-20"
                          style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>
                          {[
                            { icon: FaXTwitter, label:'Share on X' },
                            { icon: Link2,   label:'Copy link'  },
                          ].map(({ icon: Icon, label }) => (
                            <button key={label}
                              onClick={() => { navigator.clipboard?.writeText(window.location.href).catch(()=>{}); setShareOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                              style={{ color:'var(--fg-2)' }}>
                              <Icon size={14} strokeWidth={2} style={{ color:'var(--fg-3)' }} />
                              {label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Body */}
            <div ref={contentRef} className="mb-12">
              {POST.content.map((block, i) => (
                <motion.div key={i}
                  initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:'-40px' }}
                  transition={{ duration:0.45, ease:[0.16,1,0.3,1], delay: i < 3 ? i*0.06 : 0 }}>
                  <ContentBlock block={block} />
                </motion.div>
              ))}
            </div>

            {/* Tags */}
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t" style={{ borderColor:'var(--border)' }}>
                {POST.tags.map(tag => (
                  <motion.span key={tag} whileHover={{ scale:1.05 }}
                    className="h-7 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors hover:bg-[var(--accent)] hover:text-white"
                    style={{ background:'var(--bg-card)', color:'var(--fg-3)', border:'1px solid var(--border)' }}>
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </Reveal>

            {/* Reaction bar */}
            <Reveal>
              <div className="flex items-center justify-between py-6 px-6 rounded-2xl border mb-14"
                   style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <div className="flex items-center gap-4">
                  <motion.button onClick={() => setLiked(l=>!l)}
                    whileHover={{ scale:1.08 }} whileTap={{ scale:0.85 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: liked ? 'rgba(239,68,68,0.1)' : 'var(--bg)',
                      color:      liked ? '#ef4444' : 'var(--fg-2)',
                      border:     `1px solid ${liked ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                    }}>
                    <motion.span animate={{ scale: liked ? [1,1.4,1] : 1 }} transition={{ duration:0.3 }}>
                      <Heart size={16} strokeWidth={2} style={{ fill: liked ? '#ef4444' : 'none' }} />
                    </motion.span>
                    {POST.stats.hearts + (liked ? 1 : 0)} hearts
                  </motion.button>
                  <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                    onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior:'smooth' })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ color:'var(--fg-3)', background:'var(--bg)', border:'1px solid var(--border)' }}>
                    <MessageCircle size={16} strokeWidth={2} /> {POST.stats.comments} comments
                  </motion.button>
                </div>
                <motion.button onClick={() => setSaved(s=>!s)}
                  whileHover={{ scale:1.08 }} whileTap={{ scale:0.85 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: saved ? 'var(--accent-dim)' : 'var(--bg)',
                    color:      saved ? 'var(--accent)'     : 'var(--fg-3)',
                    border:     `1px solid ${saved ? 'var(--accent-glow)' : 'var(--border)'}`,
                  }}>
                  <Bookmark size={16} strokeWidth={2} style={{ fill: saved ? 'var(--accent)' : 'none' }} />
                  {saved ? 'Saved' : 'Save'}
                </motion.button>
              </div>
            </Reveal>

            {/* Author card */}
            <Reveal id="author">
              <div className="flex flex-col sm:flex-row gap-5 p-7 rounded-2xl border mb-14"
                   style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <motion.div whileHover={{ scale:1.05 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: POST.author.color }}>
                  {POST.author.initials}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-bold text-base" style={{ color:'var(--fg)' }}>{POST.author.name}</p>
                      <p className="text-xs" style={{ color:'var(--fg-3)' }}>{POST.author.role}</p>
                    </div>
                    <motion.button onClick={() => setFollowing(f=>!f)}
                      whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
                      className="h-8 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      style={{
                        background: following ? 'var(--bg-hover)' : 'var(--accent)',
                        color:      following ? 'var(--fg-2)'    : '#fff',
                        border:     `1px solid ${following ? 'var(--border)' : 'var(--accent)'}`,
                      }}>
                      {following ? 'Following' : '+ Follow'}
                    </motion.button>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color:'var(--fg-2)' }}>{POST.author.bio}</p>
                  <div className="flex items-center gap-4 text-xs" style={{ color:'var(--fg-4)' }}>
                    <span><strong style={{ color:'var(--fg-2)' }}>{POST.author.followers}</strong> followers</span>
                    <span><strong style={{ color:'var(--fg-2)' }}>{POST.author.posts}</strong> posts</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Comments */}
            <section id="comments" className="mb-16">
              <Reveal>
                <h2 className="text-xl font-bold mb-6" style={{ color:'var(--fg)' }}>
                  Comments <span style={{ color:'var(--fg-4)' }}>({COMMENTS.length})</span>
                </h2>
              </Reveal>

              {/* Comment form */}
              <Reveal className="mb-8">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                       style={{ background:'var(--accent)' }}>ME</div>
                  <div className="flex-1">
                    <textarea value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="Share your thoughts…" rows={3}
                      className="w-full px-4 py-3 rounded-xl text-sm border resize-none outline-none transition-all"
                      style={{
                        background:  'var(--bg-card)',
                        borderColor: comment ? 'var(--accent)' : 'var(--border)',
                        color:       'var(--fg)',
                        boxShadow:   comment ? '0 0 0 3px var(--accent-dim)' : 'none',
                      }} />
                    <AnimatePresence>
                      {comment.length > 0 && (
                        <motion.div
                          initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                          exit={{ opacity:0, height:0 }} transition={{ duration:0.2 }}
                          className="flex justify-end mt-2">
                          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                            onClick={() => setComment('')}
                            className="h-9 px-5 rounded-xl text-sm font-semibold text-white"
                            style={{ background:'var(--accent)' }}>
                            Post comment
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>

              {/* Comments list */}
              <div className="space-y-6">
                {COMMENTS.map((c, i) => (
                  <Reveal key={c.id} delay={i * 0.08}>
                    <Comment {...c} />
                  </Reveal>
                ))}
              </div>
            </section>
          </div>
        </article>

        {/* ── Related posts ── */}
        <section className="border-t py-16 px-5 md:px-10 lg:px-20"
                 style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
          <div className="max-w-5xl mx-auto">
            <Reveal className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color:'var(--fg)' }}>More to read</h2>
              <Link href="/blogs" className="text-sm font-semibold flex items-center gap-1"
                    style={{ color:'var(--accent)' }}>
                Browse all <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </Reveal>

            <motion.div initial="hidden" whileInView="visible"
              viewport={{ once:true }} variants={staggerSlow}
              className="grid sm:grid-cols-3 gap-5">
              {POST.related.map((rel) => (
                <motion.div key={rel.slug} variants={fadeUp} whileHover={{ y:-5 }}>
                  <Link href={`/post/${rel.slug}`}
                    className="flex flex-col rounded-2xl border overflow-hidden h-full"
                    style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
                    <div className="relative h-36 overflow-hidden">
                      <NextImage src={rel.cover} alt={rel.title} fill
                        sizes="(max-width:640px) 100vw,33vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy" placeholder="blur" blurDataURL={rel.blur} />
                      <div className="absolute inset-0"
                           style={{ background:'linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)' }} />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background:'rgba(0,0,0,0.45)', color:'#fff' }}>{rel.tag}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold leading-snug mb-3" style={{ color:'var(--fg)' }}>{rel.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                             style={{ background: rel.author.color }}>{rel.author.initials}</div>
                        <span className="text-xs" style={{ color:'var(--fg-4)' }}>{rel.author.name} · {rel.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
