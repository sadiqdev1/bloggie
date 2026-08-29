'use client';

/**
 * /explore — authenticated users only.
 * Personalised feed: For You, Following, Trending, Bookmarks.
 * Richer than /blogs: activity sidebar, trending topics, writer recommendations.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Flame, Clock, Star, Bookmark, UserPlus,
  ArrowRight, ArrowLeft, Heart, BookOpen,
  Sparkles, TrendingUp, Users, Bell, PenLine,
} from 'lucide-react';
import Link      from 'next/link';
import NextImage from 'next/image';
import Reveal      from '@/app/components/ui/Reveal';
import MagneticBtn  from '@/app/components/ui/MagneticBtn';
import AuthNavbar   from '@/app/components/AuthNavbar';
import AuthMobileNav from '@/app/components/AuthMobileNav';
import AuthSidebar   from '@/app/components/AuthSidebar';
import Footer       from '@/app/components/Footer';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { stagger, fadeUp, staggerSlow } from '@/app/lib/motion';

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEED_TABS = [
  { id:'foryou',    label:'For You',  icon: Sparkles    },
  { id:'following', label:'Following',icon: Users       },
  { id:'trending',  label:'Trending', icon: TrendingUp  },
  { id:'bookmarks', label:'Saved',    icon: Bookmark    },
];

const TAGS = ['All','Design','Engineering','Life','Business','Culture','Productivity','Health','Science','Finance'];

const SORT_OPTIONS = [
  { value:'trending', label:'Trending',  icon: Flame },
  { value:'latest',   label:'Latest',    icon: Clock },
  { value:'top',      label:'Top rated', icon: Star  },
];

const POSTS = [
  { slug:'negative-space-ui',  tag:'Design',       readTime:'5 min', title:'The art of negative space in UI',            excerpt:'Less is more — how emptiness shapes user attention and guides intent.',               hearts:'318', reads:'4.2k', accent:'#f97316', saved:false, author:{ name:'Sofia Reyes',    initials:'SR', color:'#f97316' }, cover:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=75',    blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==' },
  { slug:'stop-using-orms',    tag:'Engineering',  readTime:'8 min', title:'Why I stopped using ORMs',                   excerpt:"Raw SQL isn't scary. It's liberating. Here's what changed my mind.",                 hearts:'702', reads:'9.1k', accent:'#8b5cf6', saved:true,  author:{ name:'James Okafor',  initials:'JO', color:'#8b5cf6' }, cover:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75',    blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==' },
  { slug:'slow-mornings',      tag:'Life',         readTime:'4 min', title:'Slow mornings as a productivity hack',       excerpt:'The counter-intuitive ritual that made me 3× more focused every afternoon.',          hearts:'541', reads:'6.7k', accent:'#10b981', saved:false, author:{ name:'Priya Nair',     initials:'PN', color:'#10b981' }, cover:'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=75',  blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==' },
  { slug:'deep-work-2024',     tag:'Productivity', readTime:'6 min', title:'Deep work in an always-on world',            excerpt:'Protecting focus in a world designed to steal it.',                                  hearts:'489', reads:'5.3k', accent:'#3b82f6', saved:false, author:{ name:'Marcus Tan',     initials:'MT', color:'#3b82f6' }, cover:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=75',  blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z' },
  { slug:'building-in-public', tag:'Business',     readTime:'5 min', title:'What building in public actually looks like', excerpt:'The messy, uncomfortable, surprisingly effective truth.',                            hearts:'623', reads:'7.8k', accent:'#f59e0b', saved:true,  author:{ name:'Lena Fischer',   initials:'LF', color:'#f59e0b' }, cover:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=75',    blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z' },
  { slug:'container-queries',  tag:'Engineering',  readTime:'7 min', title:'Container queries changed everything',       excerpt:"Why I'll never write a media query the same way again.",                            hearts:'891', reads:'11.2k',accent:'#8b5cf6', saved:false, author:{ name:'Sofia Delgado',  initials:'SD', color:'#8b5cf6' }, cover:'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&q=75',  blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIBAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCsY3HTP5O4HZoKj3JKi1Lv4Pb9gzSkT5AHXN5KAAP/2Q==' },
];

const TRENDING_TOPICS = [
  { tag:'#ReactCompiler', count:'2.4k posts' },
  { tag:'#WritingLife',   count:'1.8k posts' },
  { tag:'#DeepWork',      count:'1.2k posts' },
  { tag:'#DesignSystems', count:'987 posts'  },
  { tag:'#TechEssays',    count:'756 posts'  },
];

const SUGGESTED_WRITERS = [
  { name:'Amara Osei',    role:'CEO & Co-founder',  initials:'AO', color:'#ef4444', following:false },
  { name:'Lena Fischer',  role:'CTO & Co-founder',  initials:'LF', color:'#8b5cf6', following:true  },
  { name:'Marcus Tan',    role:'Head of Design',     initials:'MT', color:'#f97316', following:false },
];

// ─── Post card (explore variant — with save button) ────────────────────────
function ExploreCard({ post, hovered, onHoverStart, onHoverEnd }) {
  const [saved, setSaved] = useState(post.saved);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }}
      onHoverStart={onHoverStart} onHoverEnd={onHoverEnd}
      className="flex flex-col rounded-2xl border overflow-hidden group relative"
      style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

      {/* Save button */}
      <motion.button
        onClick={(e) => { e.preventDefault(); setSaved(s => !s); }}
        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all"
        style={{
          background: saved ? 'var(--accent)' : 'rgba(0,0,0,0.45)',
          borderColor: saved ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
        }}
      >
        <Bookmark size={13} strokeWidth={2.5} style={{ color:'#fff', fill: saved ? '#fff' : 'none' }} />
      </motion.button>

      <Link href={`/post/${post.slug}`} className="contents">
        <div className="relative h-44 overflow-hidden">
          <NextImage src={post.cover} alt={post.title} fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            loading="lazy" placeholder="blur" blurDataURL={post.blur} />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)' }} />
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ background:'rgba(0,0,0,0.4)', color:'#fff' }}>{post.tag}</span>
          <span className="absolute bottom-3 left-3 text-xs text-white/70">{post.readTime} read</span>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="text-base font-semibold leading-snug mb-2 transition-colors"
              style={{ color: hovered ? post.accent : 'var(--fg)' }}>{post.title}</h3>
          <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color:'var(--fg-3)' }}>{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                   style={{ background: post.author.color }}>{post.author.initials}</div>
              <span className="text-xs font-medium" style={{ color:'var(--fg-3)' }}>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color:'var(--fg-4)' }}>
              <motion.button
                onClick={(e) => { e.preventDefault(); setLiked(l => !l); }}
                whileTap={{ scale: 0.8 }}
                className="flex items-center gap-1 transition-colors hover:text-[var(--accent)]"
              >
                <Heart size={11} style={{ fill: liked ? 'var(--accent)' : 'none', color: liked ? 'var(--accent)' : 'inherit' }} />
                {post.hearts}
              </motion.button>
              <span className="flex items-center gap-1"><BookOpen size={10} /> {post.reads}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar() {
  const [following, setFollowing] = useState(
    SUGGESTED_WRITERS.reduce((a, w) => ({ ...a, [w.name]: w.following }), {})
  );

  return (
    <aside className="hidden xl:flex flex-col gap-6 w-72 shrink-0">
      {/* Trending topics */}
      <div className="rounded-2xl border p-5" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} strokeWidth={2} style={{ color:'var(--accent)' }} />
          <p className="text-sm font-bold" style={{ color:'var(--fg)' }}>Trending topics</p>
        </div>
        <div className="space-y-3">
          {TRENDING_TOPICS.map(({ tag, count }, i) => (
            <motion.div key={tag}
              initial={{ opacity:0, x:10 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ delay: i*0.06 }}
              className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-semibold transition-colors group-hover:text-[var(--accent)]"
                    style={{ color:'var(--fg)' }}>{tag}</span>
              <span className="text-xs" style={{ color:'var(--fg-4)' }}>{count}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Writer suggestions */}
      <div className="rounded-2xl border p-5" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} strokeWidth={2} style={{ color:'var(--accent)' }} />
          <p className="text-sm font-bold" style={{ color:'var(--fg)' }}>Writers to follow</p>
        </div>
        <div className="space-y-4">
          {SUGGESTED_WRITERS.map(({ name, role, initials, color }) => {
            const isFollowing = following[name];
            return (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                       style={{ background: color }}>{initials}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color:'var(--fg)' }}>{name}</p>
                    <p className="text-xs truncate" style={{ color:'var(--fg-4)' }}>{role}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setFollowing(f => ({ ...f, [name]: !f[name] }))}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                  className="shrink-0 h-7 px-3 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: isFollowing ? 'var(--bg-hover)' : 'var(--accent)',
                    color:      isFollowing ? 'var(--fg-2)'    : '#fff',
                    border:     `1px solid ${isFollowing ? 'var(--border)' : 'var(--accent)'}`,
                  }}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </motion.button>
              </div>
            );
          })}
        </div>
        <Link href="#"
          className="flex items-center gap-1 mt-4 text-xs font-semibold transition-colors hover:text-[var(--accent)]"
          style={{ color:'var(--fg-3)' }}>
          See more writers <ArrowRight size={11} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Write prompt */}
      <div className="rounded-2xl border p-5 relative overflow-hidden"
           style={{ background:'var(--accent-dim)', borderColor:'var(--accent-glow)' }}>
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-30"
             style={{ background:'var(--accent)' }} />
        <PenLine size={20} strokeWidth={1.8} className="mb-3" style={{ color:'var(--accent)' }} />
        <p className="text-sm font-bold mb-1" style={{ color:'var(--fg)' }}>Got something to say?</p>
        <p className="text-xs mb-4" style={{ color:'var(--fg-3)' }}>
          Your next post could be someone's favourite read.
        </p>
        <Link href="/write">
          <motion.span whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold text-white cursor-pointer"
            style={{ background:'var(--accent)' }}>
            Write now <ArrowRight size={12} strokeWidth={2.5} />
          </motion.span>
        </Link>
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [activeTab,  setActiveTab]  = useState('foryou');
  const [activeTag,  setActiveTag]  = useState('All');
  const [activeSort, setActiveSort] = useState('trending');
  const [query,      setQuery]      = useState('');
  const [hovered,    setHovered]    = useState(null);

  const filtered = POSTS.filter(p =>
    (activeTab === 'bookmarks' ? p.saved : true) &&
    (activeTag === 'All'       || p.tag === activeTag) &&
    (query === ''              || p.title.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ background:'var(--bg)' }}>
      <ScrollProgress />
      <AuthNavbar />
      <AuthMobileNav />

      {/* ── Sidebar + main layout ── */}
      <div className="flex pt-16">
        <AuthSidebar />

        {/* ── All page content inside this flex child ── */}
        <div className="flex-1 min-w-0">

      {/* ── Top bar ── */}
      <div className="sticky top-14 z-30 border-b"
           style={{ background:'var(--bg)', borderColor:'var(--border)', backdropFilter:'blur(24px)' }}>
        <div className="max-w-7xl mx-auto px-5">
          {/* Feed tabs */}
          <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
            {FEED_TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-all relative"
                style={{ color: activeTab === id ? 'var(--accent)' : 'var(--fg-3)' }}>
                <Icon size={14} strokeWidth={2} />
                {label}
                {activeTab === id && (
                  <motion.span layoutId="explore-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background:'var(--accent)' }}
                    transition={{ type:'spring', stiffness:400, damping:30 }} />
                )}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-5 mx-2 shrink-0" style={{ background:'var(--border)' }} />

            {/* Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth:'none' }}>
              {TAGS.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className="shrink-0 h-7 px-3 rounded-lg text-xs font-medium transition-all my-1.5"
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
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8 flex gap-8">
        {/* ── Main feed ── */}
        <div className="flex-1 min-w-0">
          {/* Search + sort row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color:'var(--fg-4)' }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search your feed…"
                className="w-full h-9 pl-8 pr-3 rounded-xl text-sm border"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)', color:'var(--fg)', outline:'none' }} />
            </div>
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setActiveSort(value)}
                  className="flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: activeSort === value ? 'var(--accent-dim)' : 'var(--bg-card)',
                    color:      activeSort === value ? 'var(--accent)'     : 'var(--fg-3)',
                    border:     `1px solid ${activeSort === value ? 'var(--accent-glow)' : 'var(--border)'}`,
                  }}>
                  <Icon size={12} strokeWidth={2} />{label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab + activeTag}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-10 }}
              transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}>

              {filtered.length > 0 ? (
                <motion.div initial="hidden" animate="visible" variants={stagger}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((post, i) => (
                    <ExploreCard key={post.slug} post={post}
                      hovered={hovered === i}
                      onHoverStart={() => setHovered(i)}
                      onHoverEnd={() => setHovered(null)} />
                  ))}
                </motion.div>
              ) : (
                <div className="py-24 text-center rounded-2xl border"
                     style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  {activeTab === 'bookmarks'
                    ? <><p className="text-4xl mb-3">🔖</p>
                        <p className="font-semibold mb-1" style={{ color:'var(--fg)' }}>No saved stories yet</p>
                        <p className="text-sm" style={{ color:'var(--fg-3)' }}>Tap the bookmark icon on any post to save it here.</p></>
                    : <><p className="text-4xl mb-3">🔍</p>
                        <p className="font-semibold mb-1" style={{ color:'var(--fg)' }}>Nothing found</p>
                        <p className="text-sm" style={{ color:'var(--fg-3)' }}>Try a different tag or search term.</p></>
                  }
                </div>
              )}

              {filtered.length > 0 && (
                <div className="flex justify-center mt-10">
                  <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                    className="h-10 px-7 rounded-xl text-sm font-semibold border"
                    style={{ color:'var(--fg-2)', borderColor:'var(--border)' }}>
                    Load more
                  </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Sidebar ── */}
        <Sidebar />
      </div>
      <Footer />
        </div>{/* end flex-1 main content */}
      </div>{/* end flex pt-16 sidebar+content */}
    </div>
  );
}
