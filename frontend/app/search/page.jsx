'use client';

/**
 * /search — Dedicated search page.
 * Pre-fills from ?q= query param. Live filtering across posts, writers, tags.
 * Wrapped in Suspense because useSearchParams() requires it in Next.js App Router.
 */

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, User, Hash, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AuthLayout from '@/app/components/AuthLayout';
import { fadeUp, stagger } from '@/app/lib/motion';

// ─── Mock data ────────────────────────────────────────────────────────────────
const ALL_POSTS = [
  { slug:'negative-space-ui',  title:'The art of negative space in UI',             tag:'Design',       author:'Sofia Reyes',   cover:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=75', readTime:'5 min', hearts:'318' },
  { slug:'stop-using-orms',    title:'Why I stopped using ORMs',                    tag:'Engineering',  author:'James Okafor',  cover:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=75', readTime:'8 min', hearts:'702' },
  { slug:'slow-mornings',      title:'Slow mornings as a productivity hack',        tag:'Life',         author:'Priya Nair',    cover:'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=75', readTime:'4 min', hearts:'541' },
  { slug:'deep-work-2024',     title:'Deep work in an always-on world',             tag:'Productivity', author:'Marcus Tan',    cover:'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=75', readTime:'6 min', hearts:'489' },
  { slug:'building-in-public', title:'What building in public actually looks like', tag:'Business',     author:'Lena Fischer',  cover:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=75', readTime:'5 min', hearts:'623' },
  { slug:'container-queries',  title:'Container queries changed everything',        tag:'Engineering',  author:'Sofia Delgado', cover:'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&q=75', readTime:'7 min', hearts:'891' },
  { slug:'design-tokens-2026', title:'Design tokens in 2026: the definitive guide', tag:'Design',       author:'Sofia Reyes',   cover:'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=400&q=75', readTime:'7 min', hearts:'524' },
  { slug:'typography-for-ui',  title:'Typography is 95% of design',                tag:'Design',       author:'Sofia Reyes',   cover:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&q=75', readTime:'6 min', hearts:'891' },
];

const ALL_WRITERS = [
  { username:'sofiareyes',  name:'Sofia Reyes',  role:'Designer & writer',    initials:'SR', color:'#f97316', posts:28, followers:'3.4k' },
  { username:'jamesokafor', name:'James Okafor', role:'Engineering writer',   initials:'JO', color:'#8b5cf6', posts:19, followers:'5.1k' },
  { username:'priyanair',   name:'Priya Nair',   role:'Lifestyle & wellness', initials:'PN', color:'#10b981', posts:14, followers:'2.8k' },
  { username:'marcustan',   name:'Marcus Tan',   role:'Productivity & work',  initials:'MT', color:'#3b82f6', posts:22, followers:'4.2k' },
  { username:'lenafischer', name:'Lena Fischer', role:'Business & startups',  initials:'LF', color:'#f59e0b', posts:31, followers:'6.7k' },
];

const ALL_TAGS = ['Design','Engineering','Life','Business','Culture','Productivity','Health','Science','Finance','Philosophy'];

const FILTER_TABS = [
  { id:'all',     label:'All',     icon: Search   },
  { id:'posts',   label:'Posts',   icon: FileText },
  { id:'writers', label:'Writers', icon: User     },
  { id:'tags',    label:'Topics',  icon: Hash     },
];

function match(text, q) { return text.toLowerCase().includes(q.toLowerCase()); }

// ─── Inner component (uses useSearchParams) ───────────────────────────────────
function SearchInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const inputRef     = useRef(null);

  const [query,  setQuery]  = useState(searchParams.get('q') ?? '');
  const [filter, setFilter] = useState('all');

  // Sync URL
  useEffect(() => {
    const trimmed = query.trim();
    const current = searchParams.get('q') ?? '';
    if (trimmed === current) return;
    if (trimmed) router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    else         router.replace('/search', { scroll: false });
  }, [query]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim();

  const posts   = ALL_POSTS.filter(p   => !q || match(p.title, q) || match(p.tag, q)  || match(p.author, q));
  const writers = ALL_WRITERS.filter(w => !q || match(w.name,  q) || match(w.role, q) || match(w.username, q));
  const tags    = ALL_TAGS.filter(t    => !q || match(t, q));

  const total = posts.length + writers.length + tags.length;

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">

      {/* ── Search input ── */}
      <div className="relative mb-5">
        <Search size={18} strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--fg-3)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Escape' && setQuery('')}
          placeholder="Search posts, writers, topics…"
          className="w-full h-12 pl-11 pr-10 rounded-xl text-[0.95rem] border outline-none transition-all"
          style={{
            background:  'var(--bg-card)',
            color:       'var(--fg)',
            borderColor: q ? 'var(--accent)' : 'var(--border)',
            boxShadow:   q ? '0 0 0 3px var(--accent-dim)' : 'none',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer transition-colors hover:text-[var(--fg)]"
            style={{ color: 'var(--fg-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 mb-6 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        {FILTER_TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setFilter(id)}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: filter === id ? 'var(--accent)'     : 'var(--bg-card)',
              color:      filter === id ? '#fff'              : 'var(--fg-3)',
              border:     `1px solid ${filter === id ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            <Icon size={12} strokeWidth={2} />
            {label}
          </button>
        ))}
        {q && (
          <span className="ml-auto text-xs" style={{ color: 'var(--fg-4)' }}>
            {total} result{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* Empty state */}
        {!q && (
          <motion.div key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-[0.66rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-4)' }}>
              Browse topics
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {ALL_TAGS.map(tag => (
                <button key={tag} onClick={() => setQuery(tag)}
                  className="h-8 px-4 rounded-lg text-xs font-semibold border cursor-pointer transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.color = 'var(--fg-2)';   e.currentTarget.style.background = 'var(--bg-card)'; }}>
                  #{tag}
                </button>
              ))}
            </div>
            <p className="text-[0.66rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-4)' }}>
              Featured writers
            </p>
            <div className="space-y-2">
              {ALL_WRITERS.slice(0, 4).map(w => (
                <Link key={w.username} href={`/${w.username}`}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-colors"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                       style={{ background: w.color }}>{w.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{w.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--fg-3)' }}>{w.role}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--fg-4)' }}>{w.followers} followers</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* No results */}
        {q && total === 0 && (
          <motion.div key="no-results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--fg)' }}>
              No results for &ldquo;{q}&rdquo;
            </p>
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              Try different keywords or browse topics above.
            </p>
          </motion.div>
        )}

        {/* Results */}
        {q && total > 0 && (
          <motion.div key={`results-${q}-${filter}`}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="space-y-8">

            {/* Posts */}
            {(filter === 'all' || filter === 'posts') && posts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.66rem] font-bold uppercase tracking-widest" style={{ color: 'var(--fg-4)' }}>Posts</p>
                  {filter === 'all' && posts.length > 3 && (
                    <button onClick={() => setFilter('posts')}
                      className="text-xs font-semibold cursor-pointer transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--fg-3)' }}>See all {posts.length}</button>
                  )}
                </div>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-2">
                  {(filter === 'all' ? posts.slice(0, 3) : posts).map(post => (
                    <motion.div key={post.slug} variants={fadeUp}>
                      <Link href={`/blog/${post.slug}`}
                        className="flex items-center gap-4 p-3.5 rounded-xl border transition-colors"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                          <NextImage src={post.cover} alt={post.title} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate mb-0.5" style={{ color: 'var(--fg)' }}>{post.title}</p>
                          <p className="text-xs" style={{ color: 'var(--fg-3)' }}>
                            by {post.author} · {post.tag} · {post.readTime} read
                          </p>
                        </div>
                        <ArrowRight size={13} strokeWidth={2} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Writers */}
            {(filter === 'all' || filter === 'writers') && writers.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[0.66rem] font-bold uppercase tracking-widest" style={{ color: 'var(--fg-4)' }}>Writers</p>
                  {filter === 'all' && writers.length > 3 && (
                    <button onClick={() => setFilter('writers')}
                      className="text-xs font-semibold cursor-pointer transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--fg-3)' }}>See all {writers.length}</button>
                  )}
                </div>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-2">
                  {(filter === 'all' ? writers.slice(0, 3) : writers).map(w => (
                    <motion.div key={w.username} variants={fadeUp}>
                      <Link href={`/${w.username}`}
                        className="flex items-center gap-3 p-3.5 rounded-xl border transition-colors"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                             style={{ background: w.color }}>{w.initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{w.name}</p>
                          <p className="text-xs" style={{ color: 'var(--fg-3)' }}>{w.role} · {w.posts} posts</p>
                        </div>
                        <span className="text-xs shrink-0" style={{ color: 'var(--fg-4)' }}>{w.followers} followers</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Tags */}
            {(filter === 'all' || filter === 'tags') && tags.length > 0 && (
              <section>
                <p className="text-[0.66rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--fg-4)' }}>Topics</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`}
                      className="h-8 px-4 rounded-lg text-xs font-semibold border transition-all"
                      style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.color = 'var(--fg-2)';   e.currentTarget.style.background = 'var(--bg-card)'; }}>
                      #{tag}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page export — Suspense wrapper required for useSearchParams ───────────────
export default function SearchPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} strokeWidth={2} className="animate-spin" style={{ color: 'var(--accent)' }} />
        </div>
      }>
        <SearchInner />
      </Suspense>
    </AuthLayout>
  );
}
