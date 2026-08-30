'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose, PanelLeftOpen, Menu,
  Search, Bell, Sun, Moon,
  User, Settings, Bookmark, LogOut,
  PenSquare, ChevronDown,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

// ─── Mock user ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  email:    'sadiq@bloggie.io',
  color:    'var(--accent)',
};

// ─── Theme ────────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const stored = localStorage.getItem('bloggie_theme') ?? 'light';
    setTheme(stored);
    document.documentElement.classList.toggle('dark', stored === 'dark');
  }, []);
  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('bloggie_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }
  return { theme, toggle };
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: User,      label: 'Profile',    href: '/profile'  },
  { icon: PenSquare, label: 'Write',      href: '/write'    },
  { icon: Bookmark,  label: 'Bookmarks',  href: '/bookmarks'},
  { icon: Settings,  label: 'Settings',   href: '/settings' },
];

function AvatarDropdown({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1,    y: 0   }}
          exit={{   opacity: 0, scale: 0.95, y: -8   }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-2xl border overflow-hidden"
          style={{
            background:  'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow:   '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* User header */}
          <div className="px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                   style={{ background: MOCK_USER.color }}>
                {MOCK_USER.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{MOCK_USER.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--fg-3)' }}>{MOCK_USER.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href} onClick={onClose}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>

          {/* Divider + sign out */}
          <div className="p-1.5 pt-0 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2 mt-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function AuthNavbar({ onMenuClick, onToggleCollapse, collapsed }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const router     = useRouter();
  const pathname   = usePathname();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef  = useRef(null);
  const unread     = 2;

  useEffect(() => { setAvatarOpen(false); }, [pathname]);

  return (
    <header
      className="flex items-center gap-2 px-3 shrink-0 sticky top-0 z-20"
      style={{
        height:         56,
        background:     'var(--bg-card)',
        borderBottom:   '1px solid var(--border)',
      }}
    >
      {/* ── Left: collapse toggle + logo ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile hamburger */}
        <button onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }} aria-label="Open menu">
          <Menu size={17} strokeWidth={2} />
        </button>

        {/* Desktop collapse toggle */}
        <button onClick={onToggleCollapse}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed
            ? <PanelLeftOpen  size={16} strokeWidth={1.8} />
            : <PanelLeftClose size={16} strokeWidth={1.8} />
          }
        </button>

        {/* Brand logo */}
        <AppLogo size="md" />
      </div>

      {/* ── Centre: search ── */}
      <div className="flex-1 max-w-xs mx-auto hidden md:flex">
        <button
          onClick={() => router.push('/search')}
          className="flex items-center gap-2 w-full h-8 px-3 rounded-lg text-sm border cursor-pointer transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-hover)]"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--fg-3)' }}
        >
          <Search size={13} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span className="text-[0.8rem] flex-1 text-left">Search…</span>
          <kbd className="hidden lg:inline text-[0.62rem] px-1.5 py-0.5 rounded border font-mono"
               style={{ borderColor: 'var(--border)', color: 'var(--fg-4)', background: 'var(--bg-card)' }}>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Right: theme | bell | avatar ── */}
      <div className="flex items-center gap-1 ml-auto shrink-0">

        {/* Mobile search */}
        <Link href="/search"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }} aria-label="Search">
          <Search size={16} strokeWidth={1.8} />
        </Link>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
          {theme === 'dark'
            ? <Sun  size={16} strokeWidth={1.8} />
            : <Moon size={16} strokeWidth={1.8} />
          }
        </button>

        {/* Notifications */}
        <Link href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }}
          aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full border-2"
                  style={{ background: 'var(--accent)', borderColor: 'var(--bg-card)' }} />
          )}
        </Link>

        {/* Avatar */}
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen(o => !o)}
            className="flex items-center gap-1.5 h-9 pl-1 pr-2 rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            aria-label="Account menu"
            style={{ color: 'var(--fg)' }}
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[0.65rem] font-black shrink-0"
                 style={{ background: MOCK_USER.color }}>
              {MOCK_USER.initials}
            </div>
            <span className="hidden sm:block text-[0.8rem] font-semibold"
                  style={{ color: 'var(--fg)' }}>
              {MOCK_USER.name.split(' ')[0]}
            </span>
            <motion.span animate={{ rotate: avatarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} strokeWidth={2.5} style={{ color: 'var(--fg-4)' }} />
            </motion.span>
          </button>

          <AvatarDropdown open={avatarOpen} onClose={() => setAvatarOpen(false)} />
        </div>
      </div>
    </header>
  );
}
