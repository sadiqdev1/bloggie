'use client';

/**
 * AuthNavbar — fixed top bar for all authenticated pages.
 *
 * Desktop layout:
 *  [← 20px] [Logo]  [Search, max-w-xs, centred]  [ThemeToggle | Write | 🔔 | Avatar] [→ 20px]
 *
 * Design decisions vs public Navbar:
 *  • h-16 (taller) + px-5 padding on both sides
 *  • Accent left strip (3px) as persistent brand signature
 *  • Search field sits in the true horizontal centre via absolute positioning trick
 *  • Right-side actions are all given consistent h-9 w-9 touch targets
 *  • On scroll → card background + stronger shadow, no layout shift
 *  • Mobile: logo + right icons only; real nav lives in AuthMobileNav (bottom)
 */

import { useState, useEffect, useRef } from 'react';
import Link            from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, PenSquare, X, Settings, LogOut,
  User, Bookmark, LayoutDashboard,
} from 'lucide-react';
import AppLogo     from '@/app/components/AppLogo';
import ThemeToggle from '@/app/components/ThemeToggle';

// ─── Mock — swap for real auth context ────────────────────────────────────────
const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  color:    'var(--accent)',
};

const NOTIS = [
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
  const [notis,       setNotis]       = useState(NOTIS);
  const searchRef  = useRef(null);
  const notiRef    = useRef(null);
  const profileRef = useRef(null);
  const pathname   = usePathname();

  const unread = notis.filter(n => !n.read).length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setNotiOpen(false); setProfileOpen(false); }, [pathname]);

  useEffect(() => {
    const h = (e) => {
      if (notiRef.current    && !notiRef.current.contains(e.target))    setNotiOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markAllRead = () => setNotis(ns => ns.map(n => ({ ...n, read: true })));

  /* Icon button — consistent 36×36 touch target */
  const IconBtn = ({ children, onClick, active, badge, label, ref: r, className = '' }) => (
    <motion.button
      ref={r}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={label}
      className={`relative w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer transition-colors ${className}`}
      style={{
        borderColor: active ? 'var(--accent-glow)' : 'var(--border)',
        background:  active ? 'var(--accent-dim)'  : 'var(--bg-hover)',
        color:       active ? 'var(--accent)'       : 'var(--fg-2)',
      }}
    >
      {children}
      {badge > 0 && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: '#ef4444' }}>
          {badge}
        </motion.span>
      )}
    </motion.button>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 h-16"
      style={{
        borderBottom:         scrolled ? 'none' : '1px solid var(--border)',
        boxShadow:            scrolled ? '0 4px 32px rgba(0,0,0,0.10), 0 0 0 1px var(--border)' : 'none',
        WebkitBackdropFilter: 'blur(28px)',
        backdropFilter:       'blur(28px)',
        background:           scrolled ? 'var(--bg-card)' : 'color-mix(in srgb, var(--bg-card) 88%, transparent)',
      }}
    >
      {/* Accent left strip */}
      <motion.div
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full origin-top"
        style={{ background: 'var(--accent)' }}
      />

      {/* ── Main row ── */}
      <div className="h-full flex items-center gap-4 px-5 relative">

        {/* Logo */}
        <div className="shrink-0 pl-2">
          <AppLogo size="md" />
        </div>

        {/* Search — centred in remaining space via flex */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-xs">
            <Search size={13} strokeWidth={2}
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
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  onClick={() => { setSearchVal(''); searchRef.current?.focus(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--fg-4)' }}>
                  <X size={11} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
          <ThemeToggle />

          {/* Write CTA */}
          <Link href="/write">
            <motion.span
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer select-none"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <PenSquare size={13} strokeWidth={2.5} /> Write
            </motion.span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notiRef}>
            <IconBtn
              label="Notifications"
              active={notiOpen}
              badge={unread}
              onClick={() => { setNotiOpen(o => !o); setProfileOpen(false); }}>
              <Bell size={15} strokeWidth={1.8} />
            </IconBtn>

            <AnimatePresence>
              {notiOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -8,  scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background: 'var(--bg-dropdown)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Notifications</p>
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        className="text-xs font-medium cursor-pointer transition-colors hover:text-[var(--accent)]"
                        style={{ color: 'var(--fg-3)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notis.map((n, i) => (
                      <motion.div key={n.id}
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setNotis(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
                        className="flex items-start gap-3 px-4 py-3.5 border-b cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ borderColor: 'var(--border)', opacity: n.read ? 0.65 : 1 }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                             style={{ background: n.color }}>{n.initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-2)' }}>
                            <span className="font-semibold" style={{ color: 'var(--fg)' }}>{n.actor}</span> {n.text}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--fg-3)' }}>{n.time}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--accent)' }} />}
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/notifications" onClick={() => setNotiOpen(false)}
                    className="flex items-center justify-center py-3 text-xs font-semibold cursor-pointer transition-colors hover:text-[var(--accent)]"
                    style={{ color: 'var(--fg-3)' }}>
                    View all notifications →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar + profile dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }}
              onClick={() => { setProfileOpen(o => !o); setNotiOpen(false); }}
              aria-label="Account menu"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer ring-2 ring-offset-2 transition-all"
              style={{
                background:      MOCK_USER.color,
                ringColor:       'var(--accent)',
                ringOffsetColor: 'var(--bg)',
                outline:         profileOpen ? '2px solid var(--accent)' : 'none',
                outlineOffset:   '2px',
              }}>
              {MOCK_USER.initials}
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -8,  scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-12 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50"
                  style={{ background: 'var(--bg-dropdown)', borderColor: 'var(--border)' }}>

                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                         style={{ background: MOCK_USER.color }}>{MOCK_USER.initials}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{MOCK_USER.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--fg-3)' }}>@{MOCK_USER.username}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    {[
                      { icon: User,            label: 'Your profile', href: '/profile'                },
                      { icon: LayoutDashboard, label: 'Dashboard',    href: '/dashboard'              },
                      { icon: Bookmark,        label: 'Saved posts',  href: '/bookmarks'              },
                      { icon: Settings,        label: 'Settings',     href: '/settings'               },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link key={href} href={href} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ color: 'var(--fg-2)' }}>
                        <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--fg-3)' }} /> {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t mx-3 my-1" style={{ borderColor: 'var(--border)' }} />
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                          style={{ color: '#ef4444' }}>
                    <LogOut size={14} strokeWidth={1.8} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Mobile right: search + bell + theme ── */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
            onClick={() => setSearchOpen(o => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer transition-colors"
            style={{
              borderColor: 'var(--border)',
              background:  searchOpen ? 'var(--accent-dim)' : 'var(--bg-hover)',
              color:       searchOpen ? 'var(--accent)' : 'var(--fg-2)',
            }}
            aria-label="Search">
            <Search size={15} strokeWidth={2} />
          </motion.button>
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border cursor-pointer"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-hover)', color: 'var(--fg-2)' }}
            aria-label="Notifications">
            <Bell size={15} strokeWidth={2} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: '#ef4444' }}>{unread}</span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile search expand */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="md:hidden border-t overflow-hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <div className="relative px-4 py-2.5">
              <Search size={13} strokeWidth={2}
                className="absolute left-7 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--fg-4)' }} />
              <input autoFocus type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search Bloggie…"
                className="w-full h-10 pl-8 pr-8 rounded-xl text-sm border outline-none"
                style={{
                  background: 'var(--bg-input)',
                  borderColor: 'var(--accent)',
                  color: 'var(--fg)',
                  boxShadow: '0 0 0 3px var(--accent-dim)',
                }} />
              {searchVal && (
                <button onClick={() => setSearchVal('')}
                  className="absolute right-7 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--fg-4)' }}>
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
