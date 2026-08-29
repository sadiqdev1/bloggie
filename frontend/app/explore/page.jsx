'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Flame, Clock, Star, ArrowRight, Heart, BookOpen } from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import PageShell from '@/app/components/PageShell';
import Reveal    from '@/app/components/ui/Reveal';
import { stagger, fadeUp, staggerSlow } from '@/app/lib/motion';

// ─── Data ──────────────────────────────────────────────────────────────────
const TAGS = ['All', 'Design', 'Engineering', 'Life', 'Business', 'Science', 'Culture', 'Productivity', 'Health', 'Finance'];

const FEATURED = {
  slug:     'the-future-of-writing',
  tag:      'Essay',
  title:    'The future of writing is human',
  excerpt:  'As AI floods the internet with generated content, the writers who show up with genuine experience, vulnerability, and voice will matter more than ever — not less.',
  author:   { name: 'Amara Osei', initials: 'AO', color: '#ef4444' },
  readTime: '7 min',
  hearts:   '1.2k',
  cover:    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBBESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3FTvJuEEYHkPJWf5bvnBHSmT5AHd8nIAz0Ks8L3s4RQSAP/2Q==',
};

const POSTS = [
  {
    slug: 'negative-space-ui', tag: 'Design', readTime: '5 min',
    title: 'The art of negative space in UI',
    excerpt: 'Less is more — how emptiness shapes user attention.',
    hearts: '318', reads: '4.2k', accent: '#f97316',
    author: { name: 'Sofia Reyes', initials: 'SR', color: '#f97316' },
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
  },
  {
    slug: 'stop-using-orms', tag: 'Engineering', readTime: '8 min',
    title: 'Why I stopped using ORMs',
    excerpt: "Raw SQL isn't scary. It's liberating.",
    hearts: '702', reads: '9.1k', accent: '#8b5cf6',
    author: { name: 'James Okafor', initials: 'JO', color: '#8b5cf6' },
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
  },
  {
    slug: 'slow-mornings', tag: 'Life', readTime: '4 min',
    title: 'Slow mornings as a productivity hack',
    excerpt: 'The ritual that made me 3× more focused.',
    hearts: '541', reads: '6.7k', accent: '#10b981',
    author: { name: 'Priya Nair', initials: 'PN', color: '#10b981' },
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
  },
  {
    slug: 'deep-work-2024', tag: 'Productivity', readTime: '6 min',
    title: 'Deep work in an always-on world',
    excerpt: 'Protecting focus in a world designed to steal it.',
    hearts: '489', reads: '5.3k', accent: '#3b82f6',
    author: { name: 'Marcus Tan', initials: 'MT', color: '#3b82f6' },
    cover: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIBAAAQQCAgMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYTT5MWRzl7lcQ7NXK2TrIPY8zyAeQPPPzQNa0ZBXwHSEuI/9k=',
  },
  {
    slug: 'building-in-public', tag: 'Business', readTime: '5 min',
    title: 'What building in public actually looks like',
    excerpt: 'The messy, uncomfortable, surprisingly effective truth.',
    hearts: '623', reads: '7.8k', accent: '#f59e0b',
    author: { name: 'Lena Fischer', initials: 'LF', color: '#f59e0b' },
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z',
  },
  {
    slug: 'css-container-queries', tag: 'Engineering', readTime: '7 min',
    title: 'Container queries changed everything',
    excerpt: 'Why I\'ll never write a media query the same way again.',
    hearts: '891', reads: '11.2k', accent: '#8b5cf6',
    author: { name: 'Sofia Delgado', initials: 'SD', color: '#8b5cf6' },
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3HTP5O4HZoKj3JKi1Lv4Pb9gzSkT5AHXN5KAAP/2Q==',
  },
];

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending',  icon: Flame },
  { value: 'latest',   label: 'Latest',    icon: Clock },
  { value: 'top',      label: 'Top rated', icon: Star  },
];

// ─── Post card ─────────────────────────────────────────────────────────────
function PostCard({ post, hovered, onHoverStart, onHoverEnd }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }}
      onHoverStart={onHoverStart} onHoverEnd={onHoverEnd}>
      <Link href={`/post/${post.slug}`}
        className="flex flex-col rounded-2xl border overflow-hidden h-full"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="relative h-44 overflow-hidden">
          <NextImage src={post.cover} alt={post.title} fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            loading="lazy" placeholder="blur" blurDataURL={post.blurDataURL} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>{post.tag}</span>
          <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.8)' }}>{post.readTime} read</span>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-semibold leading-snug mb-2 transition-colors"
              style={{ color: hovered ? post.accent : 'var(--fg)' }}>{post.title}</h3>
          <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--fg-3)' }}>{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                   style={{ background: post.author.color }}>{post.author.initials}</div>
              <span className="text-xs font-medium" style={{ color: 'var(--fg-3)' }}>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--fg-4)' }}>
              <span className="flex items-center gap-1"><BookOpen size={10} /> {post.reads}</span>
              <span className="flex items-center gap-1"><Heart size={10} style={hovered ? { color: post.accent } : {}} /> {post.hearts}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [activeTag,  setActiveTag]  = useState('All');
  const [activeSort, setActiveSort] = useState('trending');
  const [query,      setQuery]      = useState('');
  const [hovered,    setHovered]    = useState(null);

  const filtered = POSTS.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (query === '' || p.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <PageShell>

      {/* ── Header ── */}
      <section className="pt-16 pb-12 px-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Explore
            </h1>
            <p className="text-base mb-6" style={{ color: 'var(--fg-2)' }}>
              Discover stories from 12,000+ writers around the world.
            </p>
            {/* Search */}
            <div className="relative max-w-md">
              <Search size={15} strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--fg-3)' }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search stories…"
                className="w-full h-10 pl-9 pr-4 rounded-xl text-sm border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--fg)', outline: 'none' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="sticky top-16 z-30 px-5 py-3 border-b"
               style={{ background: 'var(--bg)', borderColor: 'var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1"
               style={{ scrollbarWidth: 'none' }}>
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className="shrink-0 h-7 px-3 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeTag === tag ? 'var(--accent)' : 'var(--bg-card)',
                  color:      activeTag === tag ? '#fff' : 'var(--fg-2)',
                  border:     `1px solid ${activeTag === tag ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {tag}
              </button>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-1 shrink-0">
            {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setActiveSort(value)}
                className="flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: activeSort === value ? 'var(--accent-dim)' : 'transparent',
                  color:      activeSort === value ? 'var(--accent)' : 'var(--fg-3)',
                }}>
                <Icon size={12} strokeWidth={2} />{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-12">

        {/* ── Featured ── */}
        <Reveal className="mb-10">
          <Link href={`/post/${FEATURED.slug}`}
            className="group relative flex flex-col md:flex-row rounded-2xl border overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="relative md:w-1/2 h-56 md:h-auto overflow-hidden">
              <NextImage src={FEATURED.cover} alt={FEATURED.title} fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy" placeholder="blur" blurDataURL={FEATURED.blurDataURL} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.15))' }} />
            </div>
            <div className="flex flex-col justify-center flex-1 p-8">
              <span className="text-xs font-semibold tracking-widest uppercase mb-3"
                    style={{ color: 'var(--accent)' }}>{FEATURED.tag}</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-[var(--accent)] transition-colors"
                  style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
                {FEATURED.title}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--fg-2)' }}>{FEATURED.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                       style={{ background: FEATURED.author.color }}>{FEATURED.author.initials}</div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>{FEATURED.author.name}</p>
                    <p className="text-xs" style={{ color: 'var(--fg-3)' }}>{FEATURED.readTime} read · {FEATURED.hearts} hearts</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                      style={{ color: 'var(--accent)' }}>
                  Read <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <motion.div initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post, i) => (
              <PostCard key={post.slug} post={post}
                hovered={hovered === i}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)} />
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--fg)' }}>No stories found</p>
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              Try a different tag or search term.
            </p>
          </div>
        )}

        {/* ── Load more ── */}
        {filtered.length > 0 && (
          <Reveal className="flex justify-center mt-14">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="h-11 px-7 rounded-xl text-sm font-semibold border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ color: 'var(--fg-2)', borderColor: 'var(--border)' }}>
              Load more stories
            </motion.button>
          </Reveal>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="py-20 px-5 border-t text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <Reveal>
          <h2 className="text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
            Have a story to tell?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
            Join 12,000+ writers sharing their ideas with the world.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}>
            Start writing — it's free <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </Reveal>
      </section>

    </PageShell>
  );
}
