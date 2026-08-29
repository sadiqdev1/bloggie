'use client';

/**
 * /notifications — Full activity feed with filters, mark-all-read, grouped by date.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, UserPlus, MessageCircle, Bookmark, Check, Trash2 } from 'lucide-react';
import Link from 'next/link';

import AuthNavbar    from '@/app/components/AuthNavbar';
import Footer        from '@/app/components/Footer';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { fadeUp, stagger } from '@/app/lib/motion';

const ALL_NOTIS = [
  // Today
  { id:1,  group:'Today',     type:'like',    read:false, actor:'Sofia Reyes',   actorInitials:'SR', actorColor:'#f97316', text:'liked your post',              subtext:'"The art of negative space in UI"',     time:'2 min ago',  href:'/blog/negative-space-ui' },
  { id:2,  group:'Today',     type:'follow',  read:false, actor:'James Okafor',  actorInitials:'JO', actorColor:'#8b5cf6', text:'started following you',        subtext:'',                                       time:'18 min ago', href:'/jamesokafor' },
  { id:3,  group:'Today',     type:'comment', read:false, actor:'Priya Nair',    actorInitials:'PN', actorColor:'#10b981', text:'commented on your post',       subtext:'"This is exactly what I needed…"',      time:'1h ago',     href:'/blog/negative-space-ui' },
  { id:4,  group:'Today',     type:'like',    read:true,  actor:'Marcus Tan',    actorInitials:'MT', actorColor:'#3b82f6', text:'liked your post',              subtext:'"Design tokens in 2026"',                time:'3h ago',     href:'/blog/design-tokens-2026' },
  // Yesterday
  { id:5,  group:'Yesterday', type:'follow',  read:true,  actor:'Lena Fischer',  actorInitials:'LF', actorColor:'#f59e0b', text:'started following you',        subtext:'',                                       time:'Yesterday',  href:'/lenafischer' },
  { id:6,  group:'Yesterday', type:'comment', read:true,  actor:'Sofia Delgado', actorInitials:'SD', actorColor:'#8b5cf6', text:'replied to your comment',      subtext:'"Great point about micro-space…"',      time:'Yesterday',  href:'/blog/negative-space-ui' },
  { id:7,  group:'Yesterday', type:'save',    read:true,  actor:'James Okafor',  actorInitials:'JO', actorColor:'#8b5cf6', text:'saved your post',              subtext:'"Typography is 95% of design"',          time:'Yesterday',  href:'/blog/typography-for-ui' },
  // This week
  { id:8,  group:'This week', type:'like',    read:true,  actor:'Priya Nair',    actorInitials:'PN', actorColor:'#10b981', text:'and 42 others liked your post',subtext:'"Figma variables: six months later"',    time:'3 days ago', href:'/blog/figma-variables' },
  { id:9,  group:'This week', type:'follow',  read:true,  actor:'Marcus Tan',    actorInitials:'MT', actorColor:'#3b82f6', text:'and 7 others followed you',    subtext:'',                                       time:'4 days ago', href:'/explore' },
  { id:10, group:'This week', type:'comment', read:true,  actor:'Amara Osei',    actorInitials:'AO', actorColor:'#ef4444', text:'commented on your post',       subtext:'"Micro-interactions that feel alive…"',  time:'5 days ago', href:'/blog/micro-interactions' },
];

const ICON_MAP = {
  like:    { Icon: Heart,          color:'#ef4444', bg:'rgba(239,68,68,0.12)'    },
  follow:  { Icon: UserPlus,       color:'var(--accent)', bg:'var(--accent-dim)' },
  comment: { Icon: MessageCircle,  color:'#3b82f6', bg:'rgba(59,130,246,0.12)'  },
  save:    { Icon: Bookmark,       color:'#f59e0b', bg:'rgba(245,158,11,0.12)'  },
};

const FILTERS = ['All', 'Likes', 'Comments', 'Follows', 'Saves'];

function NotiRow({ n, onToggleRead, onDelete }) {
  const { Icon, color, bg } = ICON_MAP[n.type] ?? ICON_MAP.like;
  return (
    <motion.div layout
      initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:10, height:0, marginBottom:0 }}
      transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}
      className="flex items-start gap-3.5 px-5 py-4 border-b relative group transition-colors hover:bg-[var(--bg-hover)]"
      style={{ borderColor:'var(--border)', opacity: n.read ? 0.7 : 1 }}>

      {/* Unread dot */}
      {!n.read && (
        <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
          className="absolute left-2 top-5 w-1.5 h-1.5 rounded-full"
          style={{ background:'var(--accent)' }} />
      )}

      {/* Type icon */}
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center -ml-1"
           style={{ background: bg }}>
        <Icon size={14} strokeWidth={2} style={{ color }} />
      </div>

      {/* Actor avatar */}
      <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
           style={{ background: n.actorColor }}>
        {n.actorInitials}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug" style={{ color:'var(--fg-2)' }}>
          <span className="font-semibold" style={{ color:'var(--fg)' }}>{n.actor}</span>
          {' '}{n.text}
          {n.subtext && (
            <span className="italic" style={{ color:'var(--fg-4)' }}> {n.subtext}</span>
          )}
        </p>
        <p className="text-xs mt-0.5" style={{ color:'var(--fg-4)' }}>{n.time}</p>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.88 }}
          onClick={() => onToggleRead(n.id)} title={n.read ? 'Mark unread' : 'Mark read'}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card)]"
          style={{ color:'var(--fg-4)' }}>
          <Check size={13} strokeWidth={2.5} style={{ color: n.read ? 'var(--fg-4)' : 'var(--accent)' }} />
        </motion.button>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.88 }}
          onClick={() => onDelete(n.id)} title="Dismiss"
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-card)]"
          style={{ color:'var(--fg-4)' }}>
          <Trash2 size={12} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [notis,        setNotis]   = useState(ALL_NOTIS);
  const [filter,       setFilter]  = useState('All');

  const unread = notis.filter(n => !n.read).length;

  const filtered = notis.filter(n => {
    if (filter === 'All')      return true;
    if (filter === 'Likes')    return n.type === 'like';
    if (filter === 'Comments') return n.type === 'comment';
    if (filter === 'Follows')  return n.type === 'follow';
    if (filter === 'Saves')    return n.type === 'save';
    return true;
  });

  const grouped = ['Today','Yesterday','This week'].reduce((acc, g) => {
    const items = filtered.filter(n => n.group === g);
    if (items.length) acc.push({ group: g, items });
    return acc;
  }, []);

  const toggleRead = (id) => setNotis(ns => ns.map(n => n.id===id ? {...n, read:!n.read} : n));
  const del        = (id) => setNotis(ns => ns.filter(n => n.id!==id));
  const markAll    = ()   => setNotis(ns => ns.map(n => ({...n, read:true})));

  return (
    <>
      <ScrollProgress />
      <AuthNavbar />

      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>
        <div className="max-w-2xl mx-auto px-0 sm:px-5 py-8">

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-0 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background:'var(--accent-dim)' }}>
                <Bell size={17} strokeWidth={1.8} style={{ color:'var(--accent)' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color:'var(--fg)' }}>Notifications</h1>
                {unread > 0 && (
                  <p className="text-xs" style={{ color:'var(--fg-4)' }}>{unread} unread</p>
                )}
              </div>
            </div>
            {unread > 0 && (
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={markAll}
                className="h-8 px-3.5 rounded-xl text-xs font-semibold border transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
                Mark all read
              </motion.button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto px-5 sm:px-0 mb-6"
               style={{ scrollbarWidth:'none' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="shrink-0 h-8 px-3.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: filter===f ? 'var(--accent)' : 'var(--bg-card)',
                  color:      filter===f ? '#fff'          : 'var(--fg-3)',
                  border:     `1px solid ${filter===f ? 'var(--accent)' : 'var(--border)'}`,
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Notifications list */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
            <AnimatePresence>
              {grouped.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="py-20 flex flex-col items-center text-center">
                  <p className="text-3xl mb-3">🔔</p>
                  <p className="font-semibold" style={{ color:'var(--fg)' }}>All caught up</p>
                  <p className="text-sm mt-1" style={{ color:'var(--fg-3)' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} notifications right now.</p>
                </motion.div>
              ) : (
                grouped.map(({ group, items }) => (
                  <div key={group}>
                    <div className="px-5 py-2.5 border-b"
                         style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
                      <p className="text-xs font-semibold" style={{ color:'var(--fg-4)' }}>{group}</p>
                    </div>
                    <AnimatePresence>
                      {items.map(n => (
                        <NotiRow key={n.id} n={n} onToggleRead={toggleRead} onDelete={del} />
                      ))}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
