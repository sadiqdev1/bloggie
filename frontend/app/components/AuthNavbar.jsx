'use client';

/**
 * AuthNavbar — shadcn/ui-inspired top bar for authenticated pages.
 *
 * Design language:
 *  • Thin 1px border-bottom only — no shadow/blur gimmicks by default
 *  • On scroll: subtle shadow lifts the bar off the page
 *  • Logo left, command-palette-style search centre, bell + avatar right
 *  • NO ThemeToggle (moved to Settings → Preferences)
 *  • NO Write button (lives in sidebar)
 *  • Height: h-14 (56px) — same as shadcn's default site header
 *  • All interactive elements use consistent h-8 sizing
 *  • Dropdown menus: clean border, tight padding, chevron-free
 */

import { useState, useEffect, useRef } from 'react';
import Link        from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, X, Settings, LogOut,
  User, Bookmark, LayoutDashboard, Command,
  CircleUserRound,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  color:    'var(--accent)',
  email:    'sadiq@bloggie.io',
};

const NOTIS = [
  { id:1, read:false, actor:'Sofia Reyes',  text:'liked your post',        time:'2m',   initials:'SR', color:'#f97316' },
  { id:2, read:false, actor:'James Okafor', text:'started following you',  time:'18m',  initials:'JO', color:'#8b5cf6' },
  { id:3, read:true,  actor:'Priya Nair',   text:'commented on your post', time:'1h',   initials:'PN', color:'#10b981' },
  { id:4, read:true,  actor:'Marcus Tan',   text:'liked your post',        time:'3h',   initials:'MT', color:'#3b82f6' },
];

const MENU_ITEMS = [
  { icon: CircleUserRound, label: 'Profile',     href: '/profile',   shortcut: '⇧P' },
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/dashboard', shortcut: null  },
  { icon: Bookmark,        label: 'Bookmarks',   href: '/bookmarks', shortcut: null  },
  { icon: Settings,        label: 'Settings',    href: '/settings',  shortcut: '⌘,' },
];

export default function AuthNavbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState('');
  const [notiOpen,    setNotiOpen]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [notis,       setNotis]       = useState(NOTIS);
  const searchRef = useRef(null);
  const notiRef   = useRef(null);
  const menuRef   = useRef(null);
  const pathname  = usePathname();
  const unread    = notis.filter(n => !n.read).length;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setNotiOpen(false); setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const h = e => {
      if (notiRef.current && !notiRef.current.contains(e.target)) setNotiOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ⌘K shortcut opens search
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const markAllRead = () => setNotis(ns => ns.map(n => ({ ...n, read: true })));

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-14 flex items-center"
      style={{
        background:   'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        boxShadow:    scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
        transition:   'box-shadow 0.2s',
      }}
    >
      <div className="flex items-center w-full px-4 gap-3">

        {/* ── Logo ── */}
        <div className="shrink-0 flex items-center">
          <AppLogo size="sm" />
        </div>

        {/* ── Separator ── */}
        <div className="hidden md:block w-px h-5 shrink-0" style={{ background: 'var(--border-2)' }} />

        {/* ── Search trigger — command palette style ── */}
        <div className="hidden md:flex flex-1 max-w-sm">
          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            className="flex items-center gap-2 w-full h-8 px-3 rounded-md border text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--fg-3)' }}
          >
            <Search size={13} strokeWidth={2} />
            <span className="flex-1 text-left text-[13px]">Search…</span>
            <span className="hidden lg:flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded border"
                  style={{ borderColor: 'var(--border)', color: 'var(--fg-4)', background: 'var(--bg-card)' }}>
              <Command size={9} strokeWidth={2} />K
            </span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Right: notifications + avatar ── */}
        <div className="flex items-center gap-1.5">

          {/* Bell */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => { setNotiOpen(o => !o); setMenuOpen(false); }}
              aria-label="Notifications"
              className="relative flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: notiOpen ? 'var(--fg)' : 'var(--fg-3)' }}
            >
              <Bell size={16} strokeWidth={1.8} />
              {unread > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>

            <AnimatePresence>
              {notiOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -4,  scale: 0.97 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute right-0 top-10 w-80 rounded-lg border shadow-lg overflow-hidden z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b"
                       style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>
                      Notifications
                      {unread > 0 && (
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'var(--accent)', color: '#fff' }}>
                          {unread}
                        </span>
                      )}
                    </p>
                    {unread > 0 && (
                      <button onClick={markAllRead}
                        className="text-xs cursor-pointer transition-colors hover:text-[var(--fg)]"
                        style={{ color: 'var(--fg-3)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Items */}
                  <div className="max-h-64 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                    {notis.map(n => (
                      <div key={n.id}
                        onClick={() => setNotis(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
                        className="flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ opacity: n.read ? 0.55 : 1 }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                             style={{ background: n.color }}>{n.initials}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] leading-snug" style={{ color: 'var(--fg-2)' }}>
                            <span className="font-semibold" style={{ color: 'var(--fg)' }}>{n.actor}</span>
                            {' '}{n.text}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--fg-3)' }}>{n.time} ago</p>
                        </div>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                               style={{ background: 'var(--accent)' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link href="/notifications" onClick={() => setNotiOpen(false)}
                      className="flex items-center justify-center py-2.5 text-xs font-medium cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: 'var(--fg-3)' }}>
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => { setMenuOpen(o => !o); setNotiOpen(false); }}
              aria-label="Account menu"
              className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-md cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{ border: menuOpen ? '1px solid var(--border)' : '1px solid transparent' }}
            >
              {/* Avatar circle */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                   style={{ background: MOCK_USER.color }}>
                {MOCK_USER.initials}
              </div>
              <span className="hidden sm:block text-[13px] font-medium max-w-[80px] truncate"
                    style={{ color: 'var(--fg-2)' }}>
                {MOCK_USER.name.split(' ')[0]}
              </span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0,  scale: 1    }}
                  exit={{   opacity: 0, y: -4,  scale: 0.97 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute right-0 top-10 w-56 rounded-lg border shadow-lg overflow-hidden z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  {/* User header */}
                  <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[13px] font-semibold leading-none mb-1" style={{ color: 'var(--fg)' }}>
                      {MOCK_USER.name}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--fg-3)' }}>{MOCK_USER.email}</p>
                  </div>

                  {/* Nav items */}
                  <div className="py-1">
                    {MENU_ITEMS.map(({ icon: Icon, label, href, shortcut }) => (
                      <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-[13px] cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                        style={{ color: 'var(--fg-2)' }}>
                        <span className="flex items-center gap-2.5">
                          <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--fg-3)' }} />
                          {label}
                        </span>
                        {shortcut && (
                          <span className="text-[10px]" style={{ color: 'var(--fg-4)' }}>{shortcut}</span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Divider + sign out */}
                  <div className="border-t py-1" style={{ borderColor: 'var(--border)' }}>
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: '#ef4444' }}>
                      <LogOut size={14} strokeWidth={1.8} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: search icon only */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }}
          aria-label="Search">
          <Search size={16} strokeWidth={2} />
        </button>
      </div>

      {/* ── Full-screen search overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60]"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSearchOpen(false)}
            />
            {/* Command palette */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{   opacity: 0, y: -16,  scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-[70] rounded-xl border shadow-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Input row */}
              <div className="flex items-center gap-3 px-4 border-b"
                   style={{ borderColor: 'var(--border)', height: '52px' }}>
                <Search size={16} strokeWidth={2} style={{ color: 'var(--fg-3)', shrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search posts, writers, topics…"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--fg)' }}
                />
                {searchVal ? (
                  <button onClick={() => setSearchVal('')}
                    className="cursor-pointer transition-colors hover:text-[var(--fg)]"
                    style={{ color: 'var(--fg-4)' }}>
                    <X size={14} strokeWidth={2.5} />
                  </button>
                ) : (
                  <kbd className="text-[11px] px-1.5 py-0.5 rounded border font-mono"
                       style={{ borderColor: 'var(--border)', color: 'var(--fg-4)', background: 'var(--bg)' }}>
                    ESC
                  </kbd>
                )}
              </div>

              {/* Empty state / results placeholder */}
              {!searchVal && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-semibold tracking-wider uppercase mb-2"
                     style={{ color: 'var(--fg-4)' }}>
                    Quick links
                  </p>
                  {[
                    { label: 'Your feed',    href: '/explore'       },
                    { label: 'Discover',     href: '/blogs'         },
                    { label: 'Your profile', href: '/profile'       },
                    { label: 'Write a post', href: '/write'         },
                  ].map(({ label, href }) => (
                    <Link key={href} href={href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-md text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: 'var(--fg-2)' }}>
                      <Search size={13} strokeWidth={2} style={{ color: 'var(--fg-4)' }} />
                      {label}
                    </Link>
                  ))}
                </div>
              )}

              {searchVal && (
                <div className="px-4 py-3">
                  <p className="text-[11px] font-semibold tracking-wider uppercase mb-2"
                     style={{ color: 'var(--fg-4)' }}>
                    Results for "{searchVal}"
                  </p>
                  {['negative-space-ui', 'stop-using-orms', 'slow-mornings'].map(slug => (
                    <Link key={slug} href={`/blog/${slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 rounded-md text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: 'var(--fg-2)' }}>
                      <Search size={13} strokeWidth={2} style={{ color: 'var(--fg-4)' }} />
                      {slug.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer hint */}
              <div className="flex items-center gap-3 px-4 py-2 border-t text-[11px]"
                   style={{ borderColor: 'var(--border)', color: 'var(--fg-4)' }}>
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> open</span>
                <span><kbd className="font-mono">ESC</kbd> close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
