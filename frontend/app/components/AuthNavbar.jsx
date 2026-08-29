'use client';

/**
 * AuthNavbar — fixed navbar for authenticated pages (explore, post, write, settings, etc.)
 *
 * Features:
 *  • Frosted glass, theme-aware (same navbar-glass class as public Navbar)
 *  • Scrolled → pill shape with shadow (matches public Navbar behaviour)
 *  • Left: logo
 *  • Center: animated search bar (expands on focus)
 *  • Right: write button, notifications bell w/ badge, user avatar dropdown
 *  • Mobile: search icon + hamburger drawer with all nav items
 */

import { useState, useEffect, useRef } from 'react';
import Link            from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, PenSquare, X, Settings, LogOut, User,
  Bookmark, LayoutDashboard, ChevronRight, Home, Compass,
} from 'lucide-react';

import AppLogo    from '@/app/components/AppLogo';
import ThemeToggle from '@/app/components/ThemeToggle';

// ─── Mock auth user (swap for real auth context later) ─────────────────────
const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  color:    'var(--accent)',
  plan:     'Free',
};

// ─── Notification mock data ────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id:1, type:'like',    read:false, actor:'Sofia Reyes',  text:'liked your post',       time:'2m ago',  initials:'SR', color:'#f97316' },
  { id:2, type:'follow',  read:false, actor:'James Okafor', text:'started following you', time:'18m ago', initials:'JO', color:'#8b5cf6' },
  { id:3, type:'comment', read:true,  actor:'Priya Nair',   text:'commented on your post',time:'1h ago',  initials:'PN', color:'#10b981' },
  { id:4, type:'like',    read:true,  actor:'Marcus Tan',   text:'liked your post',       time:'3h ago',  initials:'MT', color:'#3b82f6' },
];

const AUTH_NAV = [
  { label:'Feed',       href:'/explore',    icon: Home      },
  { label:'Discover',   href:'/blogs',      icon: Compass   },
  { label:'Write',      href:'/write',      icon: PenSquare },
  { label:'Bookmarks',  href:'/bookmarks',  icon: Bookmark  },
];

export default function AuthNavbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchVal,     setSearchVal]     = useState('');
  const [notiOpen,      setNotiOpen]      = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [notis,         setNotis]         = useState(NOTIFICATIONS);
  const searchRef  = useRef(null);
  const notiRef    = useRef(null);
  const profileRef = useRef(null);
  const pathname   = usePathname();

  const unread = notis.filter(n => !n.read).length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); setNotiOpen(false); setProfileOpen(false); }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notiRef.current    && !notiRef.current.contains(e.target))    setNotiOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotis(ns => ns.map(n => ({ ...n, read: true })));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-50 inset-x-0"
      style={{ top: scrolled ? '8px' : '0px', padding: scrolled ? '0 12px' : '0' }}
    >
      <motion.div
        animate={{
          borderRadius: scrolled ? '20px' : '0px',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.10), 0 0 0 1px var(--border)'
            : '0 1px 0 0 var(--border)',
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl h-16 flex items-center justify-between px-5 navbar-glass gap-3"
        style={{ WebkitBackdropFilter:'blur(27px)', backdropFilter:'blur(27px)' }}
      >
        {/* Logo */}
        <AppLogo size="md" />

        {/* ── Desktop center: search ── */}
        <div className="hidden md:flex flex-1 max-w-xs mx-4">
          <motion.div
            animate={{ width: searchOpen ? '100%' : '180px' }}
            transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
            className="relative"
          >
            <Search size={14} strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--fg-4)' }} />
            <input
              ref={searchRef}
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => { if (!searchVal) setSearchOpen(false); }}
              placeholder="Search Bloggie…"
              className="w-full h-9 pl-8 pr-8 rounded-xl text-sm outline-none border transition-all"
              style={{
                background:  'var(--bg-input)',
                color:       'var(--fg)',
                borderColor: searchOpen ? 'var(--accent)' : 'var(--border-input)',
                boxShadow:   searchOpen ? '0 0 0 3px var(--accent-dim)' : 'none',
              }}
            />
            <AnimatePresence>
              {searchVal && (
                <motion.button
                  initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.7 }}
                  onClick={() => { setSearchVal(''); searchRef.current?.focus(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  style={{ color:'var(--fg-4)' }}>
                  <X size={12} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Desktop right ── */}
        <div className="hidden md:flex items-center gap-1.5">
          <ThemeToggle />

          {/* Write CTA */}
          <Link href="/write">
            <motion.span
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ background:'var(--accent)', color:'#fff' }}>
              <PenSquare size={13} strokeWidth={2.5} />
              Write
            </motion.span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notiRef}>
            <motion.button
              whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
              onClick={() => { setNotiOpen(o=>!o); setProfileOpen(false); }}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'transparent' }}
              aria-label="Notifications">
              <Bell size={15} strokeWidth={2} />
              <AnimatePresence>
                {unread > 0 && (
                  <motion.span
                    initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                    transition={{ type:'spring', stiffness:500, damping:22 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background:'#ef4444' }}>
                    {unread}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Notifications dropdown */}
            <AnimatePresence>
              {notiOpen && (
                <motion.div
                  initial={{ opacity:0, y:-8, scale:0.96 }}
                  animate={{ opacity:1, y:0,  scale:1    }}
                  exit={{   opacity:0, y:-8,  scale:0.96 }}
                  transition={{ duration:0.18, ease:[0.16,1,0.3,1] }}
                  className="absolute right-0 top-11 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Notifications</p>
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        className="text-xs font-medium transition-colors hover:text-[var(--accent)]"
                        style={{ color:'var(--fg-3)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notis.map((n, i) => (
                      <motion.div key={n.id}
                        initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay: i*0.04 }}
                        className="flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
                        style={{ borderColor:'var(--border)', opacity: n.read ? 0.65 : 1 }}
                        onClick={() => setNotis(ns => ns.map(x => x.id===n.id ? {...x,read:true} : x))}>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                             style={{ background: n.color }}>{n.initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color:'var(--fg-2)' }}>
                            <span className="font-semibold" style={{ color:'var(--fg)' }}>{n.actor}</span>
                            {' '}{n.text}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color:'var(--fg-4)' }}>{n.time}</p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background:'var(--accent)' }} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/notifications"
                    onClick={() => setNotiOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors hover:text-[var(--accent)]"
                    style={{ color:'var(--fg-3)' }}>
                    View all notifications
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar + dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
              onClick={() => { setProfileOpen(o=>!o); setNotiOpen(false); }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: MOCK_USER.color }}
              aria-label="User menu">
              {MOCK_USER.initials}
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity:0, y:-8, scale:0.96 }}
                  animate={{ opacity:1, y:0,  scale:1    }}
                  exit={{   opacity:0, y:-8,  scale:0.96 }}
                  transition={{ duration:0.18, ease:[0.16,1,0.3,1] }}
                  className="absolute right-0 top-11 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>

                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor:'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{MOCK_USER.name}</p>
                    <p className="text-xs" style={{ color:'var(--fg-3)' }}>@{MOCK_USER.username}</p>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: User,            label:'Your profile',   href:`/${MOCK_USER.username}` },
                    { icon: LayoutDashboard, label:'Dashboard',      href:'/dashboard'             },
                    { icon: Bookmark,        label:'Saved posts',    href:'/bookmarks'             },
                    { icon: Settings,        label:'Settings',       href:'/settings'              },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link key={href} href={href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color:'var(--fg-2)' }}>
                      <Icon size={14} strokeWidth={2} style={{ color:'var(--fg-4)' }} />
                      {label}
                    </Link>
                  ))}

                  <div className="border-t mx-3 my-1" style={{ borderColor:'var(--border)' }} />
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ color:'#ef4444' }}>
                    <LogOut size={14} strokeWidth={2} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile: search + theme + hamburger ── */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
            onClick={() => { setSearchOpen(o=>!o); setDrawerOpen(false); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl border"
            style={{ borderColor:'var(--border)', color:'var(--fg-2)', background: searchOpen ? 'var(--accent-dim)' : 'var(--bg-hover)' }}
            aria-label="Search">
            <Search size={15} strokeWidth={2} style={{ color: searchOpen ? 'var(--accent)' : 'var(--fg-2)' }} />
          </motion.button>
          <ThemeToggle />
          <button
            className="relative w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: drawerOpen ? 'var(--accent-dim)' : 'var(--bg-hover)' }}
            onClick={() => { setDrawerOpen(o=>!o); setSearchOpen(false); }}
            aria-label="Toggle menu" aria-expanded={drawerOpen}>
            {[{ yOff:-5, rot:45 },{ yOff:0, fade:true },{ yOff:5, rot:-45 }].map((bar,i) => (
              <motion.span key={i}
                className="block absolute w-4 h-0.5 rounded-full"
                style={{ background:'var(--fg)' }}
                animate={drawerOpen
                  ? bar.fade ? { opacity:0, scaleX:0 } : { rotate:bar.rot, y:0 }
                  : { rotate:0, y:bar.yOff, opacity:1, scaleX:1 }}
                transition={{ duration:0.2 }} />
            ))}
          </button>
        </div>
      </motion.div>

      {/* ── Mobile search bar ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.22 }}
            className="md:hidden mx-3 mt-1.5 overflow-hidden">
            <div className="relative">
              <Search size={14} strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color:'var(--fg-4)' }} />
              <input autoFocus type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search Bloggie…"
                className="w-full h-11 pl-9 pr-9 rounded-xl text-sm border outline-none"
                style={{ background:'var(--bg-card)', borderColor:'var(--accent)', color:'var(--fg)',
                  boxShadow:'0 0 0 3px var(--accent-dim)' }} />
              {searchVal && (
                <button onClick={() => setSearchVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color:'var(--fg-4)' }}>
                  <X size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity:0, y:-10, scale:0.97 }}
            animate={{ opacity:1, y:0,   scale:1    }}
            exit={{   opacity:0, y:-10,  scale:0.97 }}
            transition={{ duration:0.2, ease:[0.16,1,0.3,1] }}
            className="md:hidden mx-3 mt-2 rounded-2xl border overflow-hidden shadow-2xl"
            style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

            {/* User row */}
            <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor:'var(--border)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                   style={{ background: MOCK_USER.color }}>{MOCK_USER.initials}</div>
              <div>
                <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{MOCK_USER.name}</p>
                <p className="text-xs" style={{ color:'var(--fg-3)' }}>@{MOCK_USER.username}</p>
              </div>
            </div>

            {/* Nav */}
            <div className="px-3 pt-2 pb-1">
              {AUTH_NAV.map(({ label, href, icon: Icon }, i) => {
                const active = pathname === href;
                return (
                  <motion.div key={href}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i*0.05 }}>
                    <Link href={href}
                      className="flex items-center justify-between px-3 py-3 rounded-xl transition-colors"
                      style={{ color: active ? 'var(--accent)' : 'var(--fg)', background: active ? 'var(--accent-dim)' : 'transparent' }}
                      onClick={() => setDrawerOpen(false)}>
                      <span className="flex items-center gap-2.5 text-sm font-medium">
                        <Icon size={15} strokeWidth={2} />
                        {label}
                      </span>
                      <ChevronRight size={14} strokeWidth={2} style={{ color:'var(--fg-4)' }} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t mx-3 mt-1" style={{ borderColor:'var(--border)' }} />
            <div className="p-3 flex flex-col gap-1.5">
              {[
                { href:`/${MOCK_USER.username}`, label:'Your profile', icon: User },
                { href:'/settings',              label:'Settings',     icon: Settings },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color:'var(--fg-2)' }}
                  onClick={() => setDrawerOpen(false)}>
                  <Icon size={14} strokeWidth={2} style={{ color:'var(--fg-4)' }} />
                  {label}
                </Link>
              ))}
              <button
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color:'#ef4444' }}>
                <LogOut size={14} strokeWidth={2} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
