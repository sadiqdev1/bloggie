'use client';

/**
 * /profile — Current user's own profile page.
 * View + manage your posts, stats, and quick settings shortcut.
 * Different from /[username]: has edit controls, draft management, analytics.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenSquare, Settings, Eye, Heart, Bookmark,
  TrendingUp, FileText, Clock, Check, Edit3,
  Trash2, MoreHorizontal, ChevronRight, Camera,
  ArrowRight, Users, Star,
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import AuthLayout    from '@/app/components/AuthLayout';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import Reveal from '@/app/components/ui/Reveal';
import { fadeUp, stagger } from '@/app/lib/motion';

// ─── Mock user ────────────────────────────────────────────────────────────────
const USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  color:    'var(--accent)',
  bio:      'Building things on the web. Writing about code, design, and everything in between.',
  joined:   'August 2026',
  stats: {
    posts:      8,
    drafts:     3,
    followers: '142',
    following:  38,
    totalViews: '24.8k',
    totalHearts:'1.2k',
  },
};

const PUBLISHED = [
  { slug:'why-i-write',       title:'Why I started writing publicly',   tag:'Life',        views:'3.2k', hearts:'124', readTime:'4 min', publishedAt:'Aug 28, 2026', status:'published' },
  { slug:'nextjs-tips',        title:'5 Next.js patterns I use daily',  tag:'Engineering', views:'8.7k', hearts:'312', readTime:'6 min', publishedAt:'Aug 20, 2026', status:'published' },
  { slug:'dark-mode-design',   title:'Dark mode done right',            tag:'Design',      views:'5.1k', hearts:'201', readTime:'5 min', publishedAt:'Aug 12, 2026', status:'published' },
  { slug:'remote-work',        title:'Year two of remote work',         tag:'Life',        views:'2.9k', hearts:'98',  readTime:'7 min', publishedAt:'Aug 5, 2026',  status:'published' },
];

const DRAFTS = [
  { slug:'draft-api-design',  title:'API design principles I follow',  tag:'Engineering', updatedAt:'Today' },
  { slug:'draft-typography',   title:'Typography fundamentals in 2026', tag:'Design',      updatedAt:'Yesterday' },
  { slug:'draft-burnout',      title:'What burnout actually feels like',tag:'Life',        updatedAt:'3 days ago' },
];

const TABS = ['Posts', 'Drafts', 'Analytics'];

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div variants={fadeUp}
      className="flex items-center gap-4 p-5 rounded-2xl border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: `${color}18` }}>
        <Icon size={18} strokeWidth={1.8} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-bold tabular-nums"
           style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>{value}</p>
        <p className="text-xs" style={{ color: 'var(--fg-3)' }}>{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Post row ────────────────────────────────────────────────────────────────
function PostRow({ post, isDraft = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div layout
      className="flex items-center gap-4 px-5 py-4 border-b last:border-0 group hover:bg-[var(--bg-hover)] transition-colors"
      style={{ borderColor: 'var(--border)' }}>

      {/* Tag dot */}
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{post.title}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--fg-3)' }}>
          <span>{post.tag}</span>
          {!isDraft && <><span>·</span><span>{post.readTime} read</span></>}
          <span>·</span>
          <span>{isDraft ? `Updated ${post.updatedAt}` : post.publishedAt}</span>
        </div>
      </div>

      {/* Stats (published only) */}
      {!isDraft && (
        <div className="hidden sm:flex items-center gap-4 text-xs shrink-0" style={{ color: 'var(--fg-3)' }}>
          <span className="flex items-center gap-1"><Eye size={11} />{post.views}</span>
          <span className="flex items-center gap-1"><Heart size={11} />{post.hearts}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link href={isDraft ? `/write?draft=${post.slug}` : `/blog/${post.slug}`}>
          <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
            className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-card)]"
            style={{ color: 'var(--fg-3)' }}>
            {isDraft ? <Edit3 size={13} strokeWidth={2} /> : <Eye size={13} strokeWidth={2} />}
          </motion.span>
        </Link>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
          className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-card)]"
          style={{ color: '#ef4444' }}>
          <Trash2 size={12} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [tab, setTab] = useState('Posts');
  const [editBio, setEditBio] = useState(false);
  const [bio, setBio] = useState(USER.bio);

  const STATS = [
    { icon: Eye,       label: 'Total views',   value: USER.stats.totalViews,  color: '#3b82f6' },
    { icon: Heart,     label: 'Total hearts',  value: USER.stats.totalHearts, color: '#ef4444' },
    { icon: Users,     label: 'Followers',     value: USER.stats.followers,   color: '#8b5cf6' },
    { icon: FileText,  label: 'Published',     value: USER.stats.posts,       color: '#10b981' },
  ];

  return (
    <>
      <ScrollProgress />
      <AuthLayout>
      <div className="max-w-4xl mx-auto px-5 py-8">

          {/* ── Profile header card ── */}
          <Reveal>
            <div className="rounded-2xl border overflow-hidden mb-8"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

              {/* Cover strip */}
              <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-glow))' }}>
                <motion.div className="absolute inset-0 opacity-20"
                  style={{ background: 'var(--accent)', filter: 'blur(40px)' }} />
              </div>

              <div className="px-6 pb-6">
                {/* Avatar row */}
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.04 }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-4 shadow-xl"
                      style={{ background: USER.color, borderColor: 'var(--bg-card)' }}>
                      {USER.initials}
                    </motion.div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 cursor-pointer shadow"
                      style={{ background: 'var(--bg-card)', borderColor: 'var(--bg)', color: 'var(--fg-3)' }}>
                      <Camera size={11} strokeWidth={2} />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Link href="/write">
                      <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer text-white"
                        style={{ background: 'var(--accent)' }}>
                        <PenSquare size={13} strokeWidth={2.5} /> Write
                      </motion.span>
                    </Link>
                    <Link href="/settings">
                      <motion.span whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--fg-2)' }}>
                        <Settings size={15} strokeWidth={1.8} />
                      </motion.span>
                    </Link>
                  </div>
                </div>

                {/* Name */}
                <h1 className="text-xl font-bold mb-0.5"
                    style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
                  {USER.name}
                </h1>
                <p className="text-sm mb-3" style={{ color: 'var(--fg-3)' }}>
                  @{USER.username} · Joined {USER.joined}
                </p>

                {/* Bio with inline edit */}
                <div className="max-w-lg">
                  <AnimatePresence mode="wait">
                    {editBio ? (
                      <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col gap-2">
                        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2}
                          className="w-full px-3 py-2 rounded-xl text-sm border resize-none outline-none"
                          style={{ background: 'var(--bg-input)', borderColor: 'var(--accent)', color: 'var(--fg)',
                                   boxShadow: '0 0 0 3px var(--accent-dim)' }} />
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setEditBio(false)}
                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer text-white"
                            style={{ background: 'var(--accent)' }}>
                            <Check size={11} strokeWidth={2.5} /> Save
                          </motion.button>
                          <button onClick={() => setEditBio(false)}
                            className="h-8 px-3 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                            style={{ borderColor: 'var(--border)', color: 'var(--fg-2)' }}>Cancel</button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-start gap-2 group/bio">
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>{bio}</p>
                        <motion.button
                          onClick={() => setEditBio(true)}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg mt-0.5 cursor-pointer opacity-0 group-hover/bio:opacity-100 transition-opacity"
                          style={{ color: 'var(--fg-4)' }}>
                          <Edit3 size={12} strokeWidth={2} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Public profile link */}
                <Link href={`/${USER.username}`}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium cursor-pointer transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--fg-3)' }}>
                  View public profile <ChevronRight size={12} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ── Stats row ── */}
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </motion.div>

          {/* ── Tabs ── */}
          <div className="flex items-center gap-1 mb-4">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="relative h-9 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer"
                style={{
                  color:      tab === t ? 'var(--accent)' : 'var(--fg-3)',
                  background: tab === t ? 'var(--accent-dim)' : 'transparent',
                }}>
                {t}
                {t === 'Drafts' && (
                  <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--accent)', color: '#fff' }}>
                    {USER.stats.drafts}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

              {tab === 'Posts' && (
                <>
                  {PUBLISHED.length > 0
                    ? PUBLISHED.map(p => <PostRow key={p.slug} post={p} />)
                    : <div className="py-16 text-center">
                        <p className="text-3xl mb-3">✍️</p>
                        <p className="font-semibold mb-1" style={{ color: 'var(--fg)' }}>No posts yet</p>
                        <p className="text-sm mb-4" style={{ color: 'var(--fg-3)' }}>Your published stories will appear here.</p>
                        <Link href="/write">
                          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 h-9 px-5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                            style={{ background: 'var(--accent)' }}>
                            Write your first post <ArrowRight size={13} strokeWidth={2.5} />
                          </motion.span>
                        </Link>
                      </div>
                  }
                </>
              )}

              {tab === 'Drafts' && (
                <>
                  {DRAFTS.map(p => <PostRow key={p.slug} post={p} isDraft />)}
                  <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link href="/write"
                      className="flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--fg-3)' }}>
                      <PenSquare size={14} strokeWidth={2} /> Start a new draft
                    </Link>
                  </div>
                </>
              )}

              {tab === 'Analytics' && (
                <div className="p-6 space-y-4">
                  <p className="text-sm font-semibold mb-4" style={{ color: 'var(--fg)' }}>Last 30 days</p>
                  {[
                    { label: 'Total views',    value: '6,420', delta: '+18%', up: true  },
                    { label: 'New followers',  value: '34',    delta: '+12%', up: true  },
                    { label: 'Total hearts',   value: '284',   delta: '+5%',  up: true  },
                    { label: 'Posts published',value: '2',     delta: '-1',   up: false },
                  ].map(({ label, value, delta, up }) => (
                    <div key={label} className="flex items-center justify-between py-3 border-b last:border-0"
                         style={{ borderColor: 'var(--border)' }}>
                      <p className="text-sm" style={{ color: 'var(--fg-2)' }}>{label}</p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold tabular-nums" style={{ color: 'var(--fg)' }}>{value}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                              style={{ background: up ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)',
                                       color:      up ? '#22c55e'               : '#ef4444' }}>
                          {delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
      </div>
      </AuthLayout>
    </>
  );
}
