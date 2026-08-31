'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftClose, PanelLeftOpen, Menu,
  Search, Bell, Sun, Moon, X,
  User, Settings, Bookmark, LogOut,
  PenSquare, ChevronDown,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

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

// ─── Avatar dropdown ─────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: User,      label: 'Profile',   href: '/profile'   },
  { icon: PenSquare, label: 'Write',     href: '/write'     },
  { icon: Bookmark,  label: 'Bookmarks', href: '/bookmarks' },
  { icon: Settings,  label: 'Settings',  href: '/settings'  },
];

function AvatarDropdown({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1,    y: 0   }}
          exit={{   opacity: 0, scale: 0.95, y: -8   }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-2xl border overflow-hidden"
          style={{
            background:  'var(--bg-card)',
            borderColor: 'var(--border)',
            boxShadow:   '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
          }}>
          {/* User header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
                 style={{ background: MOCK_USER.color }}>{MOCK_USER.initials}</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{MOCK_USER.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--fg-3)' }}>{MOCK_USER.email}</p>
            </div>
          </div>
          {/* Items */}
          <div className="p-1.5">
            {MENU_ITEMS.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href} onClick={onClose}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </div>
          {/* Sign out */}
          <div className="p-1.5 pt-0 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              className="flex items-center gap-2.5 w-full px-3 py-2 mt-1.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              Sign out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Search results dropdown (desktop inline) ─────────────────────────────────
const QUICK_LINKS = [
  { label: 'Your feed',    href: '/explore'  },
  { label: 'Blogs',        href: '/blogs'    },
  { label: 'Write a post', href: '/write'    },
  { label: 'Bookmarks',    href: '/bookmarks'},
];

const MOCK_RESULTS = [
  { slug: 'negative-space-ui',  title: 'The art of negative space in UI',          tag: 'Design'      },
  { slug: 'stop-using-orms',    title: 'Why I stopped using ORMs',                  tag: 'Engineering' },
  { slug: 'slow-mornings',      title: 'Slow mornings as a productivity hack',      tag: 'Life'        },
];

function SearchDropdown({ query, onClose }) {
  const router = useRouter();
  const results = query
    ? MOCK_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scaleY: 0.97 }}
      animate={{ opacity: 1, y: 0,  scaleY: 1     }}
      exit={{   opacity: 0, y: -6,  scaleY: 0.97  }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-[calc(100%+6px)] left-0 right-0 rounded-xl border shadow-2xl overflow-hidden z-50"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="p-1.5">
        {!query && (
          <>
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
               style={{ color: 'var(--fg-4)' }}>Quick links</p>
            {QUICK_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Search size={12} strokeWidth={2} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </>
        )}
        {query && results.length === 0 && (
          <div className="px-3 py-4 text-sm text-center" style={{ color: 'var(--fg-3)' }}>
            No results for &ldquo;{query}&rdquo;
          </div>
        )}
        {query && results.map(r => (
          <Link key={r.slug} href={`/blog/${r.slug}`} onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="truncate">{r.title}</span>
            <span className="text-[10px] ml-2 shrink-0 px-1.5 py-0.5 rounded-md"
                  style={{ background: 'var(--bg-hover)', color: 'var(--fg-4)' }}>{r.tag}</span>
          </Link>
        ))}
      </div>
      {query && (
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-colors cursor-pointer hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--accent)' }}>
            See all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function AuthNavbar({ onMenuClick, onToggleCollapse, collapsed }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname   = usePathname();
  const router     = useRouter();
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchVal,   setSearchVal]   = useState('');
  const searchRef  = useRef(null);
  const searchWrap = useRef(null);
  const avatarRef  = useRef(null);
  const unread     = 2;

  useEffect(() => { setAvatarOpen(false); setSearchFocus(false); setSearchVal(''); }, [pathname]);

  // Close search dropdown on outside click
  useEffect(() => {
    if (!searchFocus) return;
    const h = e => { if (searchWrap.current && !searchWrap.current.contains(e.target)) setSearchFocus(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [searchFocus]);

  // ⌘K focus
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <header className="flex items-center gap-2 px-4 shrink-0 sticky top-0 z-20"
      style={{
        height:       56,
        /* Light mode: white; dark mode: dark card */
        background:   'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
      }}>

      {/* ── Left ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-2)' }} aria-label="Open menu">
          <Menu size={17} strokeWidth={2} />
        </button>
        <button onClick={onToggleCollapse}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-2)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={16} strokeWidth={1.8} /> : <PanelLeftClose size={16} strokeWidth={1.8} />}
        </button>
        <AppLogo size="md" />
      </div>

      {/* ── Centre: inline search (desktop) ── */}
      <div className="flex-1 max-w-xs mx-auto hidden md:flex relative" ref={searchWrap}>
        <div className="relative w-full">
          <Search size={13} strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--fg-4)' }} />
          <input
            ref={searchRef}
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchVal.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
                setSearchFocus(false);
              }
              if (e.key === 'Escape') { setSearchFocus(false); setSearchVal(''); }
            }}
            placeholder="Search posts, writers…"
            className="w-full h-8 pl-8 pr-8 rounded-lg text-[0.8rem] border outline-none transition-all"
            style={{
              background:  'var(--bg)',
              color:       'var(--fg)',
              borderColor: searchFocus ? 'var(--accent)' : 'var(--border)',
              boxShadow:   searchFocus ? '0 0 0 2px var(--accent-dim)' : 'none',
            }}
          />
          {searchVal && (
            <button onClick={() => { setSearchVal(''); searchRef.current?.focus(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors hover:text-[var(--fg)]"
              style={{ color: 'var(--fg-4)' }}>
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>
        <AnimatePresence>
          {searchFocus && (
            <SearchDropdown query={searchVal} onClose={() => { setSearchFocus(false); setSearchVal(''); }} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        {/* Mobile: go to /search */}
        <Link href="/search"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-2)' }} aria-label="Search">
          <Search size={16} strokeWidth={1.8} />
        </Link>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-2)' }}>
          {theme === 'dark' ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
        </button>

        {/* Bell */}
        <Link href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-2)' }}>
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
            aria-label="Account menu">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[0.65rem] font-black shrink-0"
                 style={{ background: MOCK_USER.color }}>
              {MOCK_USER.initials}
            </div>
            <span className="hidden sm:block text-[0.8rem] font-semibold" style={{ color: 'var(--fg)' }}>
              {MOCK_USER.name.split(' ')[0]}
            </span>
            <motion.span animate={{ rotate: avatarOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} strokeWidth={2.5} style={{ color: 'var(--fg-3)' }} />
            </motion.span>
          </button>
          <AvatarDropdown open={avatarOpen} onClose={() => setAvatarOpen(false)} />
        </div>
      </div>
    </header>
  );
}
