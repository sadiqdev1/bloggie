'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Heart, BookOpen, Search, Bookmark, MoreHorizontal,
  Flame, Clock, Star, ArrowUpRight, PenLine,
} from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import PageShell from '@/app/components/PageShell';
import Reveal    from '@/app/components/ui/Reveal';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import { stagger, fadeUp, staggerSlow } from '@/app/lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    slug:    'future-of-writing',
    tag:     'Essay',
    title:   'The future of writing is human',
    excerpt: 'As AI floods the internet with generated content, writers who show up with genuine experience and vulnerability will matter more than ever — not less.',
    author:  { name: 'Amara Osei',   initials: 'AO', color: '#ef4444' },
    readTime:'7 min', hearts: '1.2k',
    cover:   'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&q=80',
    blur:    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBBESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3FTvJuEEYHkPJWf5bvnBHSmT5AHd8nIAz0Ks8L3s4RQSAP/2Q==',
    accent:  '#ef4444',
  },
  {
    slug:    'writing-in-public',
    tag:     'Culture',
    title:   'Writing in public changed how I think',
    excerpt: 'Publishing half-formed ideas sounds terrifying. What I discovered is that the feedback loop makes you sharper, faster, and more honest than any private journal.',
    author:  { name: 'Lena Fischer',  initials: 'LF', color: '#8b5cf6' },
    readTime:'5 min', hearts: '934',
    cover:   'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=1400&q=80',
    blur:    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
    accent:  '#8b5cf6',
  },
  {
    slug:    'slow-internet',
    tag:     'Life',
    title:   'The case for a slower internet',
    excerpt: 'We optimised for speed and lost depth. Long-form reading, thoughtful replies, and posts that take more than 30 seconds to consume are a quiet act of rebellion.',
    author:  { name: 'Priya Nair',    initials: 'PN', color: '#10b981' },
    readTime:'6 min', hearts: '2.1k',
    cover:   'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1400&q=80',
    blur:    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
    accent:  '#10b981',
  },
  {
    slug:    'craft-of-titles',
    tag:     'Craft',
    title:   'The unreasonable power of a great title',
    excerpt: 'Your title is the only part most people will read. Here\'s what separates headlines that get ignored from the ones that won\'t let you scroll past.',
    author:  { name: 'Marcus Tan',    initials: 'MT', color: '#f97316' },
    readTime:'4 min', hearts: '1.8k',
    cover:   'https://images.unsplash.com/photo-1497091071254-cc9b2ba7c48a?w=1400&q=80',
    blur:    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIBAAAQQCAgMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYTT5MWRzl7lcQ7NXK2TrIPY8zyAeQPPPzQNa0ZBXwHSEuI/9k=',
    accent:  '#f97316',
  },
];

const TAGS = ['All', 'Design', 'Engineering', 'Life', 'Business', 'Culture', 'Productivity', 'Health'];

const POSTS = [
  { slug:'negative-space-ui',   tag:'Design',       readTime:'5 min', title:'The art of negative space in UI',          excerpt:'Less is more — how emptiness shapes user attention.',       hearts:'318', reads:'4.2k', accent:'#f97316', author:{ name:'Sofia Reyes',   initials:'SR', color:'#f97316' }, cover:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==' },
  { slug:'stop-using-orms',      tag:'Engineering',  readTime:'8 min', title:'Why I stopped using ORMs',                excerpt:"Raw SQL isn't scary. It's liberating.",                    hearts:'702', reads:'9.1k', accent:'#8b5cf6', author:{ name:'James Okafor', initials:'JO', color:'#8b5cf6' }, cover:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==' },
  { slug:'slow-mornings',        tag:'Life',         readTime:'4 min', title:'Slow mornings as a productivity hack',     excerpt:'The ritual that made me 3× more focused.',                hearts:'541', reads:'6.7k', accent:'#10b981', author:{ name:'Priya Nair',   initials:'PN', color:'#10b981' }, cover:'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==' },
  { slug:'deep-work-2024',       tag:'Productivity', readTime:'6 min', title:'Deep work in an always-on world',          excerpt:'Protecting focus in a world designed to steal it.',         hearts:'489', reads:'5.3k', accent:'#3b82f6', author:{ name:'Marcus Tan',   initials:'MT', color:'#3b82f6' }, cover:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z' },
  { slug:'building-in-public',   tag:'Business',     readTime:'5 min', title:'What building in public actually looks like',excerpt:'The messy, uncomfortable, surprisingly effective truth.', hearts:'623', reads:'7.8k', accent:'#f59e0b', author:{ name:'Lena Fischer',  initials:'LF', color:'#f59e0b' }, cover:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z' },
  { slug:'container-queries',    tag:'Engineering',  readTime:'7 min', title:'Container queries changed everything',     excerpt:"Why I'll never write a media query the same way again.", hearts:'891', reads:'11.2k',accent:'#8b5cf6', author:{ name:'Sofia Delgado',initials:'SD', color:'#8b5cf6' }, cover:'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3HTP5O4HZoKj3JKi1Lv4Pb9gzSkT5AHXN5KAAP/2Q==' },
];

const SORT_OPTIONS = [
  { value:'trending', label:'Trending',  icon: Flame },
  { value:'latest',   label:'Latest',    icon: Clock },
  { value:'top',      label:'Top rated', icon: Star  },
];

// ─── Auto-slider ──────────────────────────────────────────────────────────────
function HeroSlider() {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);   // 1=forward -1=back
  const [paused,    setPaused]    = useState(false);
  const timerRef = useRef(null);
  const total    = HERO_SLIDES.length;

  const go = useCallback((next) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const prev = () => go((current - 1 + total) % total);
  const next = () => go((current + 1) % total);

  // Auto-advance every 5 s
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => go((current + 1) % total), 5000);
    return () => clearTimeout(timerRef.current);
  }, [current, paused, go, total]);

  const slide = HERO_SLIDES[current];

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0   }),
    center:        { x: '0%',                        opacity: 1   },
    exit:   (d) => ({ x: d > 0 ? '-60%' : '60%',   opacity: 0   }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height: 'clamp(400px, 55vh, 600px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <NextImage
            src={slide.cover}
            alt={slide.title}
            fill
            priority
            sizes="(max-width:768px) 100vw, 1400px"
            className="object-cover"
            placeholder="blur"
            blurDataURL={slide.blur}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-10">
            <motion.span
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xs font-semibold tracking-widest uppercase mb-3 self-start px-3 py-1 rounded-full"
              style={{ background: slide.accent + '33', color: slide.accent, border: `1px solid ${slide.accent}55` }}
            >
              {slide.tag}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 max-w-2xl"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              {slide.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/75 max-w-xl mb-5 leading-relaxed hidden sm:block"
            >
              {slide.excerpt}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                     style={{ background: slide.author.color }}>
                  {slide.author.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{slide.author.name}</p>
                  <p className="text-xs text-white/60">{slide.readTime} read · {slide.hearts} hearts</p>
                </div>
              </div>

              <Link href={`/blog/${slide.slug}`}>
                <motion.span
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
                >
                  Read story <ArrowRight size={14} strokeWidth={2.5} />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrow controls */}
      {[
        { fn: prev, icon: ArrowLeft,  pos: 'left-4'  },
        { fn: next, icon: ArrowRight, pos: 'right-4' },
      ].map(({ fn, icon: Icon, pos }) => (
        <motion.button
          key={pos}
          onClick={fn}
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
          className={`absolute top-1/2 -translate-y-1/2 ${pos} w-10 h-10 rounded-full flex items-center justify-center z-10`}
          style={{ background: 'rgba(0,0,0,0.45)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
        >
          <Icon size={16} strokeWidth={2.5} />
        </motion.button>
      ))}

      {/* Dot indicators + progress bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} className="relative h-1.5 rounded-full overflow-hidden transition-all"
                  style={{ width: i === current ? '28px' : '8px', background: i === current ? 'transparent' : 'rgba(255,255,255,0.35)' }}>
            {i === current && (
              <>
                <span className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
                <motion.span
                  key={current}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: '#fff' }}
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? undefined : '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </>
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-14 text-xs font-semibold text-white/70 z-10 tabular-nums">
        {String(current + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
      </div>
    </div>
  );
}

// ─── Post card — same style as explore feed cards ─────────────────────────────
function PostCard({ post }) {
  const [saved,    setSaved]    = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  return (
    <motion.article variants={fadeUp} className="py-5 border-b relative"
      style={{ borderColor: 'var(--border)' }}>

      {/* Author meta */}
      <div className="flex items-center gap-1.5 mb-2.5 text-xs font-medium" style={{ color: 'var(--fg-3)' }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0"
             style={{ background: post.author.color }}>
          {post.author.initials.charAt(0)}
        </div>
        <span style={{ color: 'var(--fg-2)' }}>{post.author.name}</span>
        <span style={{ color: 'var(--fg-3)' }}>·</span>
        <span className="px-1.5 py-0.5 rounded-md text-[10px]"
              style={{ background: 'var(--bg-hover)', color: 'var(--fg-3)' }}>{post.tag}</span>
      </div>

      {/* Title + excerpt + thumbnail */}
      <div className="flex items-start gap-5">
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <h2 className="font-bold leading-snug mb-1.5 cursor-pointer transition-colors hover:text-[var(--fg-2)]"
                style={{ color: 'var(--fg)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.35 }}>
              {post.title}
            </h2>
          </Link>
          <p className="text-[0.82rem] leading-relaxed line-clamp-2 hidden sm:block"
             style={{ color: 'var(--fg-3)' }}>
            {post.excerpt}
          </p>
        </div>
        {post.cover && (
          <Link href={`/blog/${post.slug}`} className="shrink-0">
            <div className="relative overflow-hidden rounded" style={{ width: 88, height: 66 }}>
              <NextImage src={post.cover} alt={post.title} fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="88px" loading="lazy" placeholder="blur" blurDataURL={post.blur} />
            </div>
          </Link>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3.5 mt-3 text-xs font-medium" style={{ color: 'var(--fg-2)' }}>
        <span>{post.readTime} read</span>

        <button onClick={() => setLiked(l => !l)}
          className="flex items-center gap-1 cursor-pointer transition-colors hover:text-[var(--accent)]"
          style={{ color: liked ? 'var(--accent)' : 'var(--fg-2)' }}>
          👏 {post.hearts}
        </button>

        <span className="flex items-center gap-1" style={{ color: 'var(--fg-2)' }}>
          <BookOpen size={12} strokeWidth={2} /> {post.reads}
        </span>

        <div className="ml-auto flex items-center gap-2.5">
          <button onClick={() => setSaved(s => !s)}
            className="cursor-pointer transition-colors"
            style={{ color: saved ? 'var(--accent)' : 'var(--fg-2)' }}>
            <Bookmark size={14} strokeWidth={2}
              style={{ fill: saved ? 'var(--accent)' : 'none', color: 'inherit' }} />
          </button>

          {/* Three-dot context menu */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)}
              className="cursor-pointer transition-colors hover:text-[var(--fg)]"
              style={{ color: 'var(--fg-2)' }}>
              <MoreHorizontal size={15} strokeWidth={2} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1,    y: 0   }}
                  exit={{   opacity: 0, scale: 0.94, y: -6   }}
                  transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 bottom-6 z-50 w-52 rounded-2xl border shadow-2xl overflow-hidden"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <div className="p-1.5">
                    {[
                      { label: 'Hide this story',    danger: false },
                      { label: `Unfollow ${post.author.name.split(' ')[0]}`, danger: false },
                      { label: 'Copy link',           danger: false },
                      { label: 'Report this story',   danger: true  },
                    ].map(({ label, danger }) => (
                      <button key={label}
                        onClick={() => {
                          if (label === 'Copy link') navigator.clipboard?.writeText(`${window.location.origin}/blog/${post.slug}`);
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        style={{ color: danger ? '#ef4444' : 'var(--fg-2)' }}
                        onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.07)' : 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogsPage() {
  const [activeTag,  setActiveTag]  = useState('All');
  const [activeSort, setActiveSort] = useState('trending');
  const [query,      setQuery]      = useState('');

  const filtered = POSTS.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (query === '' || p.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <PageShell>
      {/* ── Hero slider ── */}
      <section className="pt-6 px-5 pb-4">
        <div className="max-w-6xl mx-auto">
          <HeroSlider />
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-30 border-b"
           style={{ background: 'var(--bg)', borderColor: 'var(--border)', backdropFilter: 'blur(24px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth:'none' }}>
            {TAGS.map(tag => (
              <motion.button key={tag} onClick={() => setActiveTag(tag)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                className="shrink-0 h-7 px-3 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeTag === tag ? 'var(--accent)' : 'var(--bg-card)',
                  color:      activeTag === tag ? '#fff' : 'var(--fg-2)',
                  border:     `1px solid ${activeTag === tag ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {tag}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search size={13} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color:'var(--fg-4)' }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-7 w-36 pl-7 pr-3 rounded-lg text-xs border"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)', color:'var(--fg)', outline:'none' }} />
            </div>

            {/* Sort */}
            {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setActiveSort(value)}
                className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeSort === value ? 'var(--accent-dim)' : 'transparent',
                  color:      activeSort === value ? 'var(--accent)' : 'var(--fg-4)',
                }}>
                <Icon size={11} strokeWidth={2} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="py-12 px-5">
        <div className="max-w-6xl mx-auto">
          {filtered.length > 0 ? (
            <motion.div initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={stagger}
              className="max-w-2xl mx-auto divide-y"
              style={{ borderColor: 'var(--border)' }}>
              {filtered.map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </motion.div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-base font-semibold mb-1" style={{ color:'var(--fg)' }}>No stories found</p>
              <p className="text-sm" style={{ color:'var(--fg-3)' }}>Try a different tag or search term.</p>
            </div>
          )}

          {/* Load more */}
          {filtered.length > 0 && (
            <Reveal className="flex justify-center mt-12">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="h-11 px-7 rounded-xl text-sm font-semibold border"
                style={{ color:'var(--fg-2)', borderColor:'var(--border)' }}>
                Load more stories
              </motion.button>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Logged-in CTA ── */}
      <section className="py-20 px-5 border-t" style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color:'var(--accent)' }}>For writers</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
              Have a story to share?
            </h2>
            <p className="text-sm" style={{ color:'var(--fg-3)' }}>
              Join 12,000+ writers. Sign in to publish, save drafts, and follow writers you love.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/login"
              className="h-11 px-6 rounded-xl text-sm font-semibold border inline-flex items-center"
              style={{ color:'var(--fg)', borderColor:'var(--border-2)' }}>
              Sign in
            </Link>
            <Link href="/register">
              <MagneticBtn
                className="h-11 px-6 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 cursor-pointer"
                style={{ background:'var(--accent)' }}>
                <PenLine size={14} strokeWidth={2} /> Start writing free
              </MagneticBtn>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
