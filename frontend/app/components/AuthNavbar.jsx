'use client';

/**
 * AuthNavbar (TopBar) — Taskora-style top bar adapted for Bloggie.
 *
 * Exact pattern from /c/xampp/htdocs/taskora/frontend/src/components/TopBar.jsx:
 *  • height: 56px sticky, surface bg, 1px border-bottom
 *  • Left: mobile menu trigger | collapse toggle (desktop) | page title
 *  • Right: theme toggle | notifications bell (dot badge) | avatar dropdown
 *  • Notifications: link to /notifications page (no inline dropdown overload)
 *  • Avatar dropdown: settings + sign out (exact Taskora mouseEnter/Leave style)
 *  • Command-palette search accessible via ⌘K (full-screen overlay)
 */

import { useState, useEffect, useRef } from 'react';
import Link        from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, Bell, ChevronDown, PanelLeftClose, PanelLeftOpen,
  Settings, LogOut, Sun, Moon, Search, X, Command,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  email:    'sadiq@bloggie.io',
  color:    'var(--accent)',
};

// ─── Theme hook (mirrors Taskora exactly) ─────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('bloggie_theme') ?? 'light';
    setTheme(stored);
    if (stored === 'dark') document.documentElement.classList.add('dark');
    else                   document.documentElement.classList.remove('dark');
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('bloggie_theme', next);
    if (next === 'dark') document.documentElement.classList.add('dark');
    else                 document.documentElement.classList.remove('dark');
  }

  return { theme, toggle };
}

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_TITLES = {
  '/explore':       { title: 'Feed',          subtitle: 'Your personalised reading feed' },
  '/blogs':         { title: 'Discover',       subtitle: 'Browse all public posts'       },
  '/write':         { title: 'Write',          subtitle: 'Compose a new post'             },
  '/bookmarks':     { title: 'Bookmarks',      subtitle: 'Your saved posts'               },
  '/notifications': { title: 'Notifications',  subtitle: null                             },
  '/profile':       { title: 'Profile',        subtitle: null                             },
  '/dashboard':     { title: 'Dashboard',      subtitle: null                             },
  '/settings':      { title: 'Settings',       subtitle: null                             },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthNavbar({ onMenuClick, onToggleCollapse, collapsed }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname     = usePathname();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const searchRef    = useRef(null);
  const unread       = 2; // mock — swap for real

  const { title, subtitle } = PAGE_TITLES[pathname] ?? { title: 'Bloggie', subtitle: null };

  useEffect(() => { setAvatarOpen(false); }, [pathname]);

  // ⌘K to open search
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 40); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      <header
        className="flex items-center gap-3 px-4 sticky top-0 z-20 shrink-0"
        style={{
          height:       56,
          background:   'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* ── Left ── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            style={{ color: 'var(--fg-3)' }}
            aria-label="Open menu">
            <Menu size={18} strokeWidth={2} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            style={{ color: 'var(--fg-3)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed
              ? <PanelLeftOpen  size={17} strokeWidth={1.8} />
              : <PanelLeftClose size={17} strokeWidth={1.8} />
            }
          </button>

          {/* Page title — desktop */}
          <div className="hidden sm:block ml-1">
            <h1 className="font-bold text-[0.95rem] leading-tight tracking-[-0.01em]"
                style={{ color: 'var(--fg)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-[0.72rem]" style={{ color: 'var(--fg-3)' }}>{subtitle}</p>
            )}
          </div>

          {/* Logo on mobile when no title */}
          <div className="sm:hidden">
            <AppLogo size="sm" />
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center ml-auto shrink-0 gap-1"
             style={{ borderLeft: '1px solid var(--border)', paddingLeft: 10 }}>

          {/* Search trigger */}
          <button
            onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 40); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            style={{ color: 'var(--fg-3)' }}
            aria-label="Search (⌘K)"
            title="Search (⌘K)">
            <Search size={16} strokeWidth={1.8} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            style={{ color: 'var(--fg-3)' }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark'
              ? <Sun  size={16} strokeWidth={1.8} />
              : <Moon size={16} strokeWidth={1.8} />
            }
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
            style={{ color: 'var(--fg-3)' }}
            aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}>
            <Bell size={17} strokeWidth={1.8} />
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full border-2"
                style={{ background: 'var(--accent)', borderColor: 'var(--bg-card)' }}
              />
            )}
          </Link>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setAvatarOpen(o => !o)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl transition-colors hover:bg-[var(--bg-hover)] cursor-pointer"
              aria-label="Account menu"
              style={{ color: 'var(--fg)' }}>
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-white text-[0.65rem] font-black shrink-0"
                   style={{ background: MOCK_USER.color }}>
                {MOCK_USER.initials}
              </div>
              <span className="hidden sm:block text-[0.875rem] font-semibold max-w-[96px] truncate"
                    style={{ color: 'var(--fg)' }}>
                {MOCK_USER.name.split(' ')[0]}
              </span>
              <ChevronDown size={12} strokeWidth={2.5}
                className={`transition-transform duration-150 ${avatarOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--fg-3)' }} />
            </button>

            {avatarOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setAvatarOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden py-1 min-w-[180px]"
                     style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-[0.875rem] font-semibold leading-none mb-1" style={{ color: 'var(--fg)' }}>
                      {MOCK_USER.name}
                    </p>
                    <p className="text-[0.72rem]" style={{ color: 'var(--fg-3)' }}>{MOCK_USER.email}</p>
                  </div>

                  <Link href="/settings" onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[0.875rem] font-medium transition-colors cursor-pointer"
                    style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Settings size={14} strokeWidth={1.8} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                    Settings
                  </Link>

                  <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />

                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.875rem] font-medium transition-colors cursor-pointer"
                    style={{ color: 'var(--fg-3)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-3)'; }}>
                    <LogOut size={14} strokeWidth={1.8} className="shrink-0" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Full-screen search overlay (⌘K) ── */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSearchOpen(false)}
          />
          <div
            className="fixed top-[14vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-[70] rounded-xl border overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)',
                     boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b" style={{ height: 52, borderColor: 'var(--border)' }}>
              <Search size={16} strokeWidth={2} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search posts, writers, topics…"
                className="flex-1 bg-transparent text-[0.9rem] outline-none"
                style={{ color: 'var(--fg)' }}
              />
              {searchVal
                ? <button onClick={() => setSearchVal('')} style={{ color: 'var(--fg-4)' }} className="cursor-pointer hover:text-[var(--fg)] transition-colors"><X size={14} strokeWidth={2.5} /></button>
                : <kbd className="text-[0.68rem] px-1.5 py-0.5 rounded border font-mono" style={{ borderColor: 'var(--border)', color: 'var(--fg-4)', background: 'var(--bg)' }}>ESC</kbd>
              }
            </div>

            {/* Results */}
            <div className="px-2 py-2">
              <p className="px-2 py-1.5 text-[0.66rem] font-bold uppercase tracking-widest" style={{ color: 'var(--fg-4)' }}>
                {searchVal ? `Results for "${searchVal}"` : 'Quick links'}
              </p>
              {(searchVal
                ? ['negative-space-ui', 'stop-using-orms', 'slow-mornings']
                : [{ label: 'Your feed', href: '/explore' }, { label: 'Discover', href: '/blogs' }, { label: 'Write a post', href: '/write' }, { label: 'Bookmarks', href: '/bookmarks' }]
              ).map((item, i) => {
                const href  = typeof item === 'string' ? `/blog/${item}` : item.href;
                const label = typeof item === 'string' ? item.replace(/-/g, ' ') : item.label;
                return (
                  <Link key={i} href={href} onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-[0.875rem] transition-colors cursor-pointer"
                    style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Search size={13} strokeWidth={1.8} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t text-[0.7rem]"
                 style={{ borderColor: 'var(--border)', color: 'var(--fg-4)' }}>
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">ESC</kbd> close</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
