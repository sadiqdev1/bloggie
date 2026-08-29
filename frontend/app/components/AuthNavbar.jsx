'use client';

/**
 * AuthNavbar — fixed navbar for authenticated pages.
 *
 * Layout (desktop):
 *   [Logo]  ←  flush left        [search | Write | 🔔 | avatar]  →  flush right
 *
 * This is intentionally different from the public Navbar:
 *  • Full-width (no max-w-6xl centering) so logo is truly edge-left
 *  • Thicker left border-accent strip as a visual signature
 *  • Search bar is center-ish between logo and right actions
 *  • No marketing links — only app actions
 *  • Mobile: compact top bar + dedicated bottom tab nav (AuthMobileNav)
 */

import { useState, useEffect, useRef } from 'react';
import Link            from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, PenSquare, X, Settings, LogOut, User,
  Bookmark, LayoutDashboard, ChevronRight,
} from 'lucide-react';
import AppLogo     from '@/app/components/AppLogo';
import ThemeToggle from '@/app/components/ThemeToggle';

const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  color:    'var(--accent)',
};

const NOTIFICATIONS = [
  { id:1, read:false, actor:'Sofia Reyes',  text:'liked your post',        time:'2m ago',  initials:'SR', color:'#f97316' },
  { id:2, read:false, actor:'James Okafor', text:'started following you',  time:'18m ago', initials:'JO', color:'#8b5cf6' },
  { id:3, read:true,  actor:'Priya Nair',   text:'commented on your post', time:'1h ago',  initials:'PN', color:'#10b981' },
  { id:4, read:true,  actor:'Marcus Tan',   text:'liked your post',        time:'3h ago',  initials:'MT', color:'#3b82f6' },
];

export default function AuthNavbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState('');
  const [notiOpen,    setNotiOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notis,       setNotis]       = useState(NOTIFICATIONS);
  const searchRef  = useRef(null);
  const notiRef    = useRef(null);
  const profileRef = useRef(null);
  const pathname   = usePathname();

  const unread = notis.filter(n => !n.read).length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setNotiOpen(false); setProfileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (notiRef.current    && !notiRef.current.contains(e.target))    setNotiOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotis(ns => ns.map(n => ({ ...n, read:true })));

  return (
    <motion.header
      initial={{ y:-64, opacity:0 }}
      animate={{ y:0,   opacity:1 }}
      transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      className="fixed top-0 inset-x-0 z-50 h-14"
      style={{
        borderBottom: scrolled ? 'none' : '1px solid var(--border)',
        boxShadow:    scrolled ? '0 2px 24px rgba(0,0,0,0.10), 0 0 0 1px var(--border)' : 'none',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter:       'blur(24px)',
        background:           scrolled
          ? 'var(--bg-card)'
          : 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
      }}
    >
      {/* Accent left strip — visual brand signature, different from public nav */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
           style={{ background:'var(--accent)' }} />

      <div className="h-full flex items-center pl-5 pr-4 gap-3">

        {/* ── Logo — flush left ── */}
        <div className="shrink-0">
          <AppLogo size="md" />
        </div>

        {/* ── Search — flexible middle ── */}
        <div className="hidden md:flex flex-1 max-w-sm ml-6">
          <div className="relative w-full">
            <Search size={13} strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color:'var(--fg-4)' }} />
            <input
              ref={searchRef}
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => { if (!searchVal) setSearchOpen(false); }}
              placeholder="Search…"
              className="w-full h-8 pl-8 pr-7 rounded-lg text-sm outline-none border transition-all"
              style={{
                background:  'var(--bg-input)',
                color:       'var(--fg)',
                borderColor: searchOpen ? 'var(--accent)' : 'var(--border-input)',
                boxShadow:   searchOpen ? '0 0 0 2px var(--accent-dim)' : 'none',
              }}
            />
            <AnimatePresence>
              {searchVal && (
                <motion.button
                  initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  onClick={() => { setSearchVal(''); searchRef.current?.focus(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color:'var(--fg-4)' }}>
                  <X size={11} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spacer pushes right actions to edge */}
        <div className="flex-1" />

        {/* ── Right actions — flush right ── */}
        <div className="hidden md:flex items-center gap-1">
          <ThemeToggle />

          {/* Write */}
          <Link href="/write">
            <motion.span
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold cursor-pointer"
              style={{ background:'var(--accent)', color:'#fff' }}>
              <PenSquare size={12} strokeWidth={2.5} /> Write
            </motion.span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notiRef}>
            <motion.button
              whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
              onClick={() => { setNotiOpen(o=>!o); setProfileOpen(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor:'var(--border)', color:'var(--fg-2)' }}
              aria-label="Notifications">
              <Bell size={14} strokeWidth={2} />
              <AnimatePresence>
                {unread > 0 && (
                  <motion.span initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    transition={{ type:'spring', stiffness:500, damping:22 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background:'#ef4444' }}>
                    {unread}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {notiOpen && (
                <motion.div
                  initial={{ opacity:0, y:-6, scale:0.96 }}
                  animate={{ opacity:1, y:0,  scale:1    }}
                  exit={{   opacity:0, y:-6,  scale:0.96 }}
                  transition={{ duration:0.16 }}
                  className="absolute right-0 top-10 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Notifications</p>
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        className="text-xs font-medium cursor-pointer transition-colors hover:text-[var(--accent)]"
                        style={{ color:'var(--fg-3)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notis.map((n, i) => (
                      <motion.div key={n.id}
                        initial={{ opacity:0, x:6 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay:i*0.04 }}
                        className="flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor:'var(--border)', opacity:n.read ? 0.6 : 1 }}
                        onClick={() => setNotis(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x))}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                             style={{ background:n.color }}>{n.initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color:'var(--fg-2)' }}>
                            <span className="font-semibold" style={{ color:'var(--fg)' }}>{n.actor}</span> {n.text}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color:'var(--fg-4)' }}>{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background:'var(--accent)' }} />}
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/notifications" onClick={() => setNotiOpen(false)}
                    className="flex items-center justify-center py-3 text-xs font-semibold transition-colors hover:text-[var(--accent)]"
                    style={{ color:'var(--fg-3)' }}>
                    View all
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
              onClick={() => { setProfileOpen(o=>!o); setNotiOpen(false); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer ring-2 ring-offset-1"
              style={{ background:MOCK_USER.color, ringColor:'var(--accent)', ringOffsetColor:'var(--bg)' }}
              aria-label="Account menu">
              {MOCK_USER.initials}
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity:0, y:-6, scale:0.96 }}
                  animate={{ opacity:1, y:0,  scale:1    }}
                  exit={{   opacity:0, y:-6,  scale:0.96 }}
                  transition={{ duration:0.16 }}
                  className="absolute right-0 top-10 w-52 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{MOCK_USER.name}</p>
                    <p className="text-xs" style={{ color:'var(--fg-3)' }}>@{MOCK_USER.username}</p>
                  </div>
                  {[
                    { icon:User,            label:'Profile',      href:`/${MOCK_USER.username}` },
                    { icon:LayoutDashboard, label:'Dashboard',    href:'/dashboard'             },
                    { icon:Bookmark,        label:'Saved posts',  href:'/bookmarks'             },
                    { icon:Settings,        label:'Settings',     href:'/settings'              },
                  ].map(({ icon:Icon, label, href }) => (
                    <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color:'var(--fg-2)' }}>
                      <Icon size={13} strokeWidth={2} style={{ color:'var(--fg-4)' }} /> {label}
                    </Link>
                  ))}
                  <div className="border-t mx-3 my-1" style={{ borderColor:'var(--border)' }} />
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ color:'#ef4444' }}>
                    <LogOut size={13} strokeWidth={2} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile: search + theme only (nav is bottom bar) ── */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
            onClick={() => setSearchOpen(o=>!o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ borderColor:'var(--border)', color: searchOpen ? 'var(--accent)' : 'var(--fg-2)',
                     background: searchOpen ? 'var(--accent-dim)' : 'transparent' }}
            aria-label="Search">
            <Search size={14} strokeWidth={2} />
          </motion.button>
          <ThemeToggle />
          {/* Notifications bell on mobile */}
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer"
            style={{ borderColor:'var(--border)', color:'var(--fg-2)' }}
            aria-label="Notifications">
            <Bell size={14} strokeWidth={2} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background:'#ef4444' }}>{unread}</span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.2 }}
            className="md:hidden border-t overflow-hidden px-3 py-2"
            style={{ borderColor:'var(--border)', background:'var(--bg-card)' }}>
            <div className="relative">
              <Search size={13} strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color:'var(--fg-4)' }} />
              <input autoFocus type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search Bloggie…"
                className="w-full h-10 pl-8 pr-8 rounded-xl text-sm border outline-none"
                style={{ background:'var(--bg-input)', borderColor:'var(--accent)', color:'var(--fg)',
                  boxShadow:'0 0 0 2px var(--accent-dim)' }} />
              {searchVal && (
                <button onClick={() => setSearchVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color:'var(--fg-4)' }}>
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
