'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Clock, Star, Bookmark, Heart,
  BookOpen, Sparkles, TrendingUp, Users,
  ArrowRight, PenLine, MoreHorizontal,
} from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import AuthLayout from '@/app/components/AuthLayout';
import { fadeUp, stagger } from '@/app/lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEED_TABS = [
  { id: 'foryou',    label: 'For You',  icon: Sparkles },
  { id: 'bookmarks', label: 'Saved',    icon: Bookmark },
];

const TAGS = ['All','Design','Engineering','Life','Business','Productivity','Health','Science'];

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending', icon: Flame },
  { value: 'latest',   label: 'Latest',   icon: Clock },
  { value: 'top',      label: 'Top',      icon: Star  },
];

const POSTS = [
  {
    slug: 'negative-space-ui', tag: 'Design', readTime: '5 min',
    title: 'The art of negative space in UI',
    excerpt: 'Less is more — how emptiness shapes user attention and guides intent through a composition.',
    hearts: '318', reads: '4.2k', saved: false,
    author: { name: 'Sofia Reyes', initials: 'SR', color: '#f97316' },
    publishedAt: 'Aug 28',
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
  },
  {
    slug: 'stop-using-orms', tag: 'Engineering', readTime: '8 min',
    title: 'Why I stopped using ORMs',
    excerpt: "Raw SQL isn't scary. It's liberating. Here's what changed my mind after 6 years of abstraction.",
    hearts: '702', reads: '9.1k', saved: true,
    author: { name: 'James Okafor', initials: 'JO', color: '#8b5cf6' },
    publishedAt: 'Aug 25',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
  },
  {
    slug: 'slow-mornings', tag: 'Life', readTime: '4 min',
    title: 'Slow mornings as a productivity hack',
    excerpt: 'The counter-intuitive ritual that made me 3× more focused every afternoon.',
    hearts: '541', reads: '6.7k', saved: false,
    author: { name: 'Priya Nair', initials: 'PN', color: '#10b981' },
    publishedAt: 'Aug 22',
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
  },
  {
    slug: 'deep-work-2024', tag: 'Productivity', readTime: '6 min',
    title: 'Deep work in an always-on world',
    excerpt: 'Protecting focus in a world designed to steal it. A framework that actually works.',
    hearts: '489', reads: '5.3k', saved: false,
    author: { name: 'Marcus Tan', initials: 'MT', color: '#3b82f6' },
    publishedAt: 'Aug 18',
    cover: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z',
  },
  {
    slug: 'building-in-public', tag: 'Business', readTime: '5 min',
    title: 'What building in public actually looks like',
    excerpt: 'The messy, uncomfortable, surprisingly effective truth about sharing your work.',
    hearts: '623', reads: '7.8k', saved: true,
    author: { name: 'Lena Fischer', initials: 'LF', color: '#f59e0b' },
    publishedAt: 'Aug 14',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z',
  },
  {
    slug: 'container-queries', tag: 'Engineering', readTime: '7 min',
    title: 'Container queries changed everything',
    excerpt: "Why I'll never write a media query the same way again. A deep dive into modern CSS.",
    hearts: '891', reads: '11.2k', saved: false,
    author: { name: 'Sofia Delgado', initials: 'SD', color: '#8b5cf6' },
    publishedAt: 'Aug 10',
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=75',
    blur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3HTP5O4HZoKj3JKi1Lv4Pb9gzSkT5AHXN5KAAP/2Q==',
  },
];

const TRENDING_TOPICS = [
  { tag: '#ReactCompiler', count: '2.4k' },
  { tag: '#WritingLife',   count: '1.8k' },
  { tag: '#DeepWork',      count: '1.2k' },
  { tag: '#DesignSystems', count: '987'  },
  { tag: '#TechEssays',    count: '756'  },
];

const SUGGESTED_WRITERS = [
  { name: 'Amara Osei',   role: 'Founder & writer',  initials: 'AO', color: '#ef4444', followers: '3.4k' },
  { name: 'Lena Fischer', role: 'Business & startups',initials: 'LF', color: '#f59e0b', followers: '6.7k' },
  { name: 'Marcus Tan',   role: 'Productivity writer',initials: 'MT', color: '#3b82f6', followers: '4.2k' },
];

// ─── Feed card — single column list item ────────────────────────────────────
function FeedCard({ post }) {
  const [saved, setSaved] = useState(post.saved);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Number(post.hearts.replace(',', '')));

  return (
    <motion.article
      variants={fadeUp}
      className="flex gap-4 py-5 border-b last:border-0"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`} className="shrink-0 relative w-24 h-24 rounded-xl overflow-hidden block">
        <NextImage
          src={post.cover} alt={post.title} fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="96px" loading="lazy"
          placeholder="blur" blurDataURL={post.blur}
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                 style={{ background: post.author.color }}>
              {post.author.initials}
            </div>
            <span className="text-xs font-medium truncate" style={{ color: 'var(--fg-3)' }}>
              {post.author.name}
            </span>
            <span style={{ color: 'var(--border-2)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--fg-4)' }}>{post.publishedAt}</span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-auto shrink-0"
                  style={{ background: 'var(--bg-hover)', color: 'var(--fg-3)' }}>
              {post.tag}
            </span>
          </div>

          {/* Title */}
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-[0.925rem] font-bold leading-snug mb-1 hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--fg)' }}>
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--fg-3)' }}>
            {post.excerpt}
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-3 mt-2.5 text-xs" style={{ color: 'var(--fg-4)' }}>
          <span>{post.readTime} read</span>
          <span style={{ color: 'var(--border-2)' }}>·</span>

          {/* Like */}
          <button
            onClick={() => { setLiked(l => !l); setLikes(n => n + (liked ? -1 : 1)); }}
            className="flex items-center gap-1 transition-colors hover:text-[var(--accent)] cursor-pointer"
            style={{ color: liked ? 'var(--accent)' : 'inherit' }}>
            <Heart size={12} strokeWidth={2}
              style={{ fill: liked ? 'var(--accent)' : 'none', color: 'inherit' }} />
            {likes.toLocaleString()}
          </button>

          <span style={{ color: 'var(--border-2)' }}>·</span>
          <span className="flex items-center gap-1"><BookOpen size={11} />{post.reads}</span>

          {/* Save */}
          <button
            onClick={() => setSaved(s => !s)}
            className="ml-auto flex items-center gap-1 transition-colors hover:text-[var(--accent)] cursor-pointer"
            style={{ color: saved ? 'var(--accent)' : 'inherit' }}>
            <Bookmark size={12} strokeWidth={2} style={{ fill: saved ? 'var(--accent)' : 'none', color: 'inherit' }} />
          </button>

          {/* More */}
          <button className="hover:text-[var(--fg)] transition-colors cursor-pointer">
            <MoreHorizontal size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Right panel ─────────────────────────────────────────────────────────────
function RightPanel() {
  const [following, setFollowing] = useState(
    SUGGESTED_WRITERS.reduce((a, w) => ({ ...a, [w.name]: false }), {})
  );

  return (
    <aside className="hidden lg:flex flex-col gap-5 w-64 xl:w-72 shrink-0 sticky top-0 h-fit pt-4 pb-6">

      {/* Trending */}
      <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>Trending</p>
        </div>
        <div className="space-y-2.5">
          {TRENDING_TOPICS.map(({ tag, count }) => (
            <div key={tag}
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => {}}>
              <span className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--fg-2)' }}>{tag}</span>
              <span className="text-[0.7rem] font-medium px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--bg-hover)', color: 'var(--fg-4)' }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Writers to follow */}
      <div className="rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <p className="text-sm font-bold" style={{ color: 'var(--fg)' }}>Who to follow</p>
        </div>
        <div className="space-y-4">
          {SUGGESTED_WRITERS.map(({ name, role, initials, color, followers }) => (
            <div key={name} className="flex items-center gap-3">
              <Link href={`/${name.toLowerCase().replace(' ', '-')}`} className="shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white cursor-pointer"
                     style={{ background: color }}>
                  {initials}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--fg)' }}>{name}</p>
                <p className="text-[0.65rem] truncate" style={{ color: 'var(--fg-4)' }}>{followers} followers</p>
              </div>
              <button
                onClick={() => setFollowing(f => ({ ...f, [name]: !f[name] }))}
                className="shrink-0 h-6 px-2.5 rounded-lg text-[0.65rem] font-semibold transition-all cursor-pointer"
                style={{
                  background: following[name] ? 'var(--bg-hover)' : 'var(--accent)',
                  color:      following[name] ? 'var(--fg-3)'    : '#fff',
                  border:     `1px solid ${following[name] ? 'var(--border)' : 'var(--accent)'}`,
                }}>
                {following[name] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
        <Link href="/search?filter=writers"
          className="flex items-center gap-1 mt-3 text-xs font-medium transition-colors hover:text-[var(--accent)]"
          style={{ color: 'var(--fg-3)' }}>
          Show more <ArrowRight size={11} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Write CTA */}
      <div className="rounded-2xl border p-5 relative overflow-hidden"
           style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent-glow)' }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-40"
             style={{ background: 'var(--accent)' }} />
        <PenLine size={18} strokeWidth={1.8} className="mb-2.5" style={{ color: 'var(--accent)' }} />
        <p className="text-sm font-bold mb-1" style={{ color: 'var(--fg)' }}>Share your ideas</p>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--fg-3)' }}>
          Your next post could be someone's favourite read.
        </p>
        <Link href="/write">
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold text-white cursor-pointer"
            style={{ background: 'var(--accent)' }}>
            Write now <ArrowRight size={12} strokeWidth={2.5} />
          </motion.span>
        </Link>
      </div>
    </aside>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [activeTab,  setActiveTab]  = useState('foryou');
  const [activeTag,  setActiveTag]  = useState('All');
  const [activeSort, setActiveSort] = useState('trending');

  const filtered = POSTS.filter(p =>
    (activeTab === 'bookmarks' ? p.saved : true) &&
    (activeTag === 'All' || p.tag === activeTag)
  );

  return (
    <AuthLayout>
      {/*
        3-column layout:
        Col 1 = AuthSidebar (in AuthLayout)
        Col 2 = this centre feed
        Col 3 = RightPanel
      */}
      <div className="flex gap-6 max-w-[1200px] mx-auto px-4 md:px-6">

        {/* ── Col 2: centre feed ── */}
        <div className="flex-1 min-w-0">

          {/* Sticky tab + filter bar */}
          <div className="sticky top-0 z-10 -mx-4 md:-mx-6 px-4 md:px-6 border-b py-0"
               style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {FEED_TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium relative cursor-pointer transition-colors"
                  style={{ color: activeTab === id ? 'var(--accent)' : 'var(--fg-3)' }}>
                  <Icon size={13} strokeWidth={2} />
                  {label}
                  {activeTab === id && (
                    <motion.span layoutId="feed-tab"
                      className="absolute bottom-0 inset-x-0 h-[2px] rounded-full"
                      style={{ background: 'var(--accent)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </button>
              ))}

              {/* Tag chips */}
              <div className="flex items-center gap-1.5 ml-3 overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
                {TAGS.map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    className="shrink-0 h-6 px-2.5 rounded-md text-xs font-medium my-1.5 cursor-pointer transition-all"
                    style={{
                      background: activeTag === tag ? 'var(--accent)' : 'transparent',
                      color:      activeTag === tag ? '#fff' : 'var(--fg-3)',
                    }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort row */}
          <div className="flex items-center gap-1.5 pt-4 pb-2">
            {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setActiveSort(value)}
                className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: activeSort === value ? 'var(--accent-dim)' : 'transparent',
                  color:      activeSort === value ? 'var(--accent)'     : 'var(--fg-3)',
                  border:     `1px solid ${activeSort === value ? 'var(--accent-glow)' : 'transparent'}`,
                }}>
                <Icon size={11} strokeWidth={2} />{label}
              </button>
            ))}
          </div>

          {/* Feed */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + activeTag}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

              {filtered.length > 0 ? (
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                  {filtered.map(post => <FeedCard key={post.slug} post={post} />)}
                </motion.div>
              ) : (
                <div className="py-20 text-center rounded-2xl border mt-4"
                     style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {activeTab === 'bookmarks'
                    ? <><p className="text-3xl mb-2">🔖</p>
                        <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>No saved posts yet</p>
                        <p className="text-sm" style={{ color: 'var(--fg-3)' }}>Bookmark any post to find it here.</p></>
                    : <><p className="text-3xl mb-2">🔍</p>
                        <p className="font-semibold" style={{ color: 'var(--fg)' }}>Nothing found</p></>
                  }
                </div>
              )}

              {filtered.length > 0 && (
                <div className="flex justify-center py-8">
                  <button
                    className="h-9 px-6 rounded-xl text-sm font-medium border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--fg-2)', borderColor: 'var(--border)' }}>
                    Load more
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Col 3: right panel ── */}
        <RightPanel />
      </div>
    </AuthLayout>
  );
}
