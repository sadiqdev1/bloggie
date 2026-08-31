'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal,
  Plus, TrendingUp, Users, Flag, UserMinus, Link2,
  AlertTriangle, EyeOff, X,
} from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import AuthLayout from '@/app/components/AuthLayout';
import { fadeUp, stagger } from '@/app/lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEED_TABS = [
  { id: 'foryou',    label: 'For you'    },
  { id: 'following', label: 'Following'  },
];

const POSTS = [
  {
    slug: 'negative-space-ui', tag: 'Design', readTime: '5 min',
    publication: 'UX Collective',
    title: 'The Art of Negative Space in UI Design',
    excerpt: 'Less is more — how emptiness shapes user attention and guides intent through a composition.',
    claps: '10K', comments: 378, reposts: 21, saved: false,
    author: { name: 'Sofia Reyes', initials: 'SR', color: '#f97316' },
    publishedAt: 'Aug 2',
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&q=75',
    blur:  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
    member: true,
  },
  {
    slug: 'stop-using-orms', tag: 'Engineering', readTime: '8 min',
    publication: 'Towards AI',
    title: 'I Wasted 6 Months Using ORMs. Here Are the 14 Patterns That Changed Everything.',
    excerpt: 'From frustrated beginner to power user: The hidden command ecosystem nobody talks about.',
    claps: '5K', comments: 141, reposts: 115, saved: true,
    author: { name: 'James Okafor', initials: 'JO', color: '#8b5cf6' },
    publishedAt: 'Apr 25',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=75',
    blur:  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
    member: false,
  },
  {
    slug: 'slow-mornings', tag: 'Life', readTime: '4 min',
    publication: 'The Daily Draft',
    title: "I'll Instantly Know A Writer Used ChatGPT If They Do These Things",
    excerpt: "There are certain tells. Here's what to avoid if you want to sound like yourself.",
    claps: '8.2K', comments: 203, reposts: 88, saved: false,
    author: { name: 'Priya Nair', initials: 'PN', color: '#10b981' },
    publishedAt: 'Jul 7',
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=200&q=75',
    blur:  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
    member: true,
  },
  {
    slug: 'deep-work-2024', tag: 'Productivity', readTime: '6 min',
    publication: 'Better Humans',
    title: 'Deep Work in an Always-On World',
    excerpt: 'Protecting focus in a world designed to steal it. A framework that actually works in 2026.',
    claps: '3.1K', comments: 67, reposts: 34, saved: false,
    author: { name: 'Marcus Tan', initials: 'MT', color: '#3b82f6' },
    publishedAt: 'Jun 18',
    cover: '',
    blur:  '',
    member: false,
  },
  {
    slug: 'building-in-public', tag: 'Business', readTime: '5 min',
    publication: 'Entrepreneurship Handbook',
    title: 'What Building in Public Actually Looks Like',
    excerpt: 'The messy, uncomfortable, surprisingly effective truth about sharing your work.',
    claps: '6.4K', comments: 182, reposts: 91, saved: true,
    author: { name: 'Lena Fischer', initials: 'LF', color: '#f59e0b' },
    publishedAt: 'Jun 2',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=75',
    blur:  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z',
    member: true,
  },
  {
    slug: 'container-queries', tag: 'Engineering', readTime: '7 min',
    publication: 'CSS Weekly',
    title: 'Container Queries Changed Everything About How I Write CSS',
    excerpt: "Why I'll never write a media query the same way again.",
    claps: '9.1K', comments: 248, reposts: 107, saved: false,
    author: { name: 'Sofia Delgado', initials: 'SD', color: '#8b5cf6' },
    publishedAt: 'May 14',
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=200&q=75',
    blur:  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3HTP5O4HZoKj3JKi1Lv4Pb9gzSkT5AHXN5KAAP/2Q==',
    member: false,
  },
];

const STAFF_PICKS = [
  { publicationInitial: 'A', publicationColor: 'var(--accent)',
    publication: 'In The Acade…', author: 'Malynnda Stewart, PhD',
    title: 'Floaties, Not Shorelines: What We Get Wrong About Helping Someone Grieve', time: '5d ago', member: true },
  { publicationInitial: 'M', publicationColor: '#8b5cf6',
    publication: 'In The Medium Bl…', author: 'The Medium Newslett…',
    title: 'Dolly Parton, Joan Rivers, and the power of mischief', time: 'Jul 18', member: false },
  { publicationInitial: 'L', publicationColor: '#f97316',
    publication: '', author: 'Loren Kantor',
    title: 'My Summer With Dolly Parton', time: '3d ago', member: true },
];

const RECOMMENDED_TOPICS = [
  'Data Science','Self Improvement','Technology','Writing',
  'Relationships','Politics','Productivity','Design','Programming','Health',
];

const FOLLOWING_LIST = [
  { name: 'Samuel Tuoyo',  initials: 'ST', color: '#3b82f6' },
  { name: 'Amara Osei',    initials: 'AO', color: '#ef4444' },
];

// ─── Context menu (three-dot) ─────────────────────────────────────────────────
const MENU_OPTIONS = [
  { icon: EyeOff,     label: 'Hide this story',     danger: false },
  { icon: UserMinus,  label: 'Unfollow author',      danger: false },
  { icon: Link2,      label: 'Copy link',            danger: false },
  { icon: Flag,       label: 'Report this story',    danger: true  },
];

function ContextMenu({ postSlug, authorName, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: -6 }}
      animate={{ opacity: 1, scale: 1,    y: 0   }}
      exit={{   opacity: 0, scale: 0.94, y: -6   }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-0 bottom-6 z-50 w-52 rounded-2xl border shadow-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="p-1.5">
        {MENU_OPTIONS.map(({ icon: Icon, label, danger }) => (
          <button key={label}
            onClick={() => {
              if (label === 'Copy link') navigator.clipboard?.writeText(`${window.location.origin}/blog/${postSlug}`);
              onClose();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            style={{ color: danger ? '#ef4444' : 'var(--fg-2)' }}
            onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.07)' : 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <Icon size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
            {label === 'Unfollow author' ? `Unfollow ${authorName.split(' ')[0]}` : label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Feed card ────────────────────────────────────────────────────────────────
function FeedCard({ post }) {
  const [saved,       setSaved]       = useState(post.saved);
  const [liked,       setLiked]       = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  return (
    <motion.article variants={fadeUp} className="py-5 border-b relative"
      style={{ borderColor: 'var(--border)' }}>

      {/* Author / publication meta */}
      <div className="flex items-center gap-1.5 mb-2.5 text-xs font-medium" style={{ color: 'var(--fg-3)' }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0"
             style={{ background: post.author.color }}>
          {post.publication.charAt(0)}
        </div>
        {post.publication && (
          <span style={{ color: 'var(--fg-2)' }}>In {post.publication} · by</span>
        )}
        <Link href={`/${post.author.name.toLowerCase().replace(' ', '')}`}
          className="hover:underline cursor-pointer" style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>
          {post.author.name}
        </Link>
        <span style={{ color: 'var(--fg-3)' }}>·</span>
        <span style={{ color: 'var(--fg-3)' }}>{post.publishedAt}</span>
      </div>

      {/* Title + excerpt + thumbnail */}
      <div className="flex items-start gap-5">
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <h2 className="font-bold leading-snug mb-1.5 cursor-pointer transition-colors hover:text-[var(--fg-2)]"
                style={{ color: 'var(--fg)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.35 }}>
              {post.member && (
                <span className="mr-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] align-middle"
                      style={{ background: '#f9d71c', color: '#000' }}>★</span>
              )}
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
        <span style={{ color: 'var(--fg-2)' }}>{post.readTime} read</span>

        <button onClick={() => setLiked(l => !l)}
          className="flex items-center gap-1 cursor-pointer transition-colors hover:text-[var(--accent)]"
          style={{ color: liked ? 'var(--accent)' : 'var(--fg-2)' }}>
          👏 {post.claps}
        </button>

        <Link href={`/blog/${post.slug}#comments`}
          className="flex items-center gap-1 cursor-pointer transition-colors hover:text-[var(--fg)]"
          style={{ color: 'var(--fg-2)', textDecoration: 'none' }}>
          <MessageCircle size={12} strokeWidth={2} />
          {post.comments}
        </Link>

        <button className="flex items-center gap-1 cursor-pointer transition-colors hover:text-[var(--fg)]"
                style={{ color: 'var(--fg-2)' }}>
          <Repeat2 size={12} strokeWidth={2} />
          {post.reposts}
        </button>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2.5">
          <button onClick={() => setSaved(s => !s)}
            className="cursor-pointer transition-colors"
            style={{ color: saved ? 'var(--accent)' : 'var(--fg-2)' }}>
            <Bookmark size={14} strokeWidth={2} style={{ fill: saved ? 'var(--accent)' : 'none', color: 'inherit' }} />
          </button>

          {/* Three-dot context menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)}
              className="cursor-pointer transition-colors hover:text-[var(--fg)] flex items-center justify-center"
              style={{ color: 'var(--fg-2)' }}>
              <MoreHorizontal size={15} strokeWidth={2} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <ContextMenu
                  postSlug={post.slug}
                  authorName={post.author.name}
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Right panel ─────────────────────────────────────────────────────────────
function RightPanel() {
  const [following, setFollowing] = useState({});

  return (
    <aside className="hidden lg:block shrink-0 sticky top-0 self-start pt-6 pb-8 px-6 border-l"
           style={{
             width: 260,
             borderColor: 'var(--border)',
             /* Same bg as navbar — white in light, dark card in dark */
             background: 'var(--bg-card)',
           }}>

      {/* Staff Picks */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-4" style={{ color: 'var(--fg)' }}>Staff Picks</p>
        <div className="space-y-5">
          {STAFF_PICKS.map((pick, i) => (
            <div key={i} className="cursor-pointer group">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                     style={{ background: pick.publicationColor }}>
                  {pick.publicationInitial}
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--fg-3)' }}>
                  {pick.publication
                    ? <>{pick.publication} <span style={{ color: 'var(--fg-4)' }}>by</span> {pick.author}</>
                    : pick.author
                  }
                </span>
              </div>
              <p className="text-[0.85rem] font-bold leading-snug group-hover:opacity-75 transition-opacity"
                 style={{ color: 'var(--fg)' }}>
                {pick.member && <span className="mr-1" style={{ color: '#f9d71c' }}>★</span>}
                {pick.title}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--fg-3)' }}>{pick.time}</p>
            </div>
          ))}
        </div>
        <Link href="#" className="block mt-4 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>
          See the full list
        </Link>
      </div>

      {/* Recommended topics */}
      <div className="mb-8">
        <p className="text-sm font-bold mb-3" style={{ color: 'var(--fg)' }}>Recommended topics</p>
        <div className="flex flex-wrap gap-1.5">
          {RECOMMENDED_TOPICS.map(topic => (
            <Link key={topic} href={`/blogs?tag=${encodeURIComponent(topic)}`}
              className="h-7 px-3 rounded-full text-xs font-medium border cursor-pointer transition-all"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-hover)', color: 'var(--fg-2)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--fg)'; e.currentTarget.style.color = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--fg)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* Following — moved to right panel */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-3)' }}>Following</p>
        <div className="space-y-3 mb-3">
          {FOLLOWING_LIST.map(({ name, initials, color }) => (
            <Link key={name} href={`/${name.toLowerCase().replace(' ', '')}`}
              className="flex items-center gap-2.5 cursor-pointer group"
              style={{ textDecoration: 'none' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                   style={{ background: color }}>{initials}</div>
              <span className="text-sm group-hover:underline" style={{ color: 'var(--fg-2)' }}>{name}</span>
            </Link>
          ))}
        </div>
        <Link href="/search?filter=writers"
          className="flex items-center gap-1.5 text-xs cursor-pointer transition-colors hover:text-[var(--fg)]"
          style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>
          <Plus size={12} strokeWidth={2} />
          Find writers to follow
        </Link>
        <Link href="/search?filter=writers"
          className="block mt-1 text-xs cursor-pointer hover:underline"
          style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>
          See suggestions
        </Link>
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('foryou');

  const filtered = activeTab === 'following'
    ? POSTS.filter(p => p.saved)
    : POSTS;

  return (
    <AuthLayout>
      <div className="flex h-full" style={{ background: 'var(--bg)' }}>

        {/* ── Centre feed ── */}
        <div className="flex-1 min-w-0">
          {/* Tabs — proper top padding */}
          <div className="sticky top-0 z-10 border-b pt-5 pb-0 px-5 md:px-8"
               style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-0">
              {FEED_TABS.map(({ id, label }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="relative px-0 mr-7 pb-3 text-[0.95rem] font-semibold cursor-pointer transition-colors"
                  style={{ color: activeTab === id ? 'var(--fg)' : 'var(--fg-3)', background: 'none', border: 'none' }}>
                  {label}
                  {activeTab === id && (
                    <motion.span layoutId="feed-tab-indicator"
                      className="absolute bottom-0 inset-x-0 h-[2px]"
                      style={{ background: 'var(--fg)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feed list */}
          <div className="px-5 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                  {filtered.map(post => <FeedCard key={post.slug} post={post} />)}
                </motion.div>
                <div className="flex justify-center py-10">
                  <button className="h-9 px-6 rounded-full text-sm font-medium cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ border: '1px solid var(--border)', color: 'var(--fg-2)' }}>
                    Load more stories
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right panel ── */}
        <RightPanel />
      </div>
    </AuthLayout>
  );
}
