'use client';

/**
 * AuthSidebar — Taskora-style sidebar adapted for Bloggie.
 *
 * Exact pattern from /c/xampp/htdocs/taskora/frontend/src/components/Sidebar.jsx:
 *  • Fixed left, CSS-transitioned width (not framer-motion)
 *  • Collapsed (64px) → icon only + CSS tooltip on hover
 *  • Expanded (260px) → icon + label + section group + badge
 *  • Animated layoutId active background pill (framer-motion)
 *  • User footer row → click → popover (settings / sign out)
 *  • Mobile: hidden; mobile nav is bottom bar
 */

import { useState } from 'react';
import Link       from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Compass, PenSquare, Bookmark, Bell,
  User, Settings, TrendingUp, Rss, LayoutDashboard,
  ChevronsUpDown, LogOut, X, Gift,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { label: 'Feed',          href: '/explore',              icon: Home          },
  { label: 'Discover',      href: '/blogs',                icon: Compass       },
  { label: 'Trending',      href: '/blogs?tab=trending',   icon: TrendingUp    },
  { label: 'Following',     href: '/explore?tab=following',icon: Rss           },
];
const NAV_LIBRARY = [
  { label: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark            },
  { label: 'Notifications', href: '/notifications', icon: Bell, badge: 2      },
];
const NAV_YOU = [
  { label: 'Profile',       href: '/profile',       icon: User                },
  { label: 'Dashboard',     href: '/dashboard',     icon: LayoutDashboard     },
  { label: 'Settings',      href: '/settings',      icon: Settings            },
];

// Mock user — swap for real auth context
const MOCK_USER = {
  name:     'Sadiq Dev',
  username: 'sadiqdev1',
  initials: 'SD',
  email:    'sadiq@bloggie.io',
  color:    'var(--accent)',
};

function isActive(href, pathname) {
  const exact = ['/explore', '/blogs', '/dashboard', '/settings'];
  if (exact.includes(href)) return pathname === href;
  if (href.includes('?')) return pathname === href.split('?')[0];
  return pathname.startsWith(href);
}

// ─── Single nav link ──────────────────────────────────────────────────────────
function NavLink({ item, collapsed, pathname, onClick }) {
  const active = isActive(item.href, pathname);
  const Icon   = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="sidebar-link group relative flex items-center rounded-lg transition-colors duration-150 outline-none focus-visible:ring-2"
      style={{
        padding:         collapsed ? '10px 0' : '9px 12px',
        justifyContent:  collapsed ? 'center' : 'flex-start',
        gap:             collapsed ? 0 : 10,
        background:      'transparent',
        textDecoration:  'none',
      }}
    >
      {/* Animated active pill */}
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-lg"
          style={{ background: 'var(--accent-dim)', borderLeft: '2px solid var(--accent)' }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}

      {/* Icon */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: 18, height: 18 }}>
        <Icon
          size={17}
          strokeWidth={active ? 2.2 : 1.8}
          className="relative transition-transform duration-150 group-hover:scale-110"
          style={{ color: active ? 'var(--accent)' : 'var(--fg-3)' }}
        />
        {/* Dot badge when collapsed */}
        {collapsed && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2"
                style={{ background: 'var(--accent)', ringColor: 'var(--bg-card)' }} />
        )}
      </div>

      {/* Tooltip (collapsed only) */}
      {collapsed && (
        <span
          className="sidebar-tooltip pointer-events-none absolute left-full z-[200]
                     px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0
                     group-hover:opacity-100 transition-opacity duration-150"
          style={{
            top:        '50%',
            transform:  'translateY(-50%)',
            marginLeft: 10,
            background: 'var(--fg)',
            color:      'var(--bg)',
            boxShadow:  '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {/* Arrow */}
          <span className="absolute top-1/2 -translate-y-1/2"
                style={{ right:'100%', width:0, height:0,
                  borderTop:'5px solid transparent', borderBottom:'5px solid transparent',
                  borderRight:`5px solid var(--fg)` }} />
          {item.label}{item.badge ? ` (${item.badge})` : ''}
        </span>
      )}

      {/* Label */}
      {!collapsed && (
        <span className="relative flex-1 truncate text-[0.875rem]"
              style={{ color: active ? 'var(--accent)' : 'var(--fg-2)', fontWeight: active ? 600 : 400 }}>
          {item.label}
        </span>
      )}

      {/* Expanded badge */}
      {!collapsed && item.badge > 0 && (
        <span className="relative text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center text-white leading-none"
              style={{ background: 'var(--accent)' }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── Section group ────────────────────────────────────────────────────────────
function SectionGroup({ title, items, collapsed, pathname }) {
  return (
    <div>
      {!collapsed && (
        <p className="px-3 pt-3 pb-1.5 text-[0.66rem] font-bold uppercase tracking-widest"
           style={{ color: 'var(--fg-4)' }}>
          {title}
        </p>
      )}
      {collapsed && <div className="mt-3 mx-auto w-5 border-t" style={{ borderColor: 'var(--border)' }} />}
      <div className="flex flex-col gap-px">
        {items.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthSidebar({ collapsed, mobileOpen, onMobileClose }) {
  const pathname         = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dismissed,    setDismissed]   = useState(false);

  const W = collapsed ? 64 : 260;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className="fixed lg:static inset-y-0 left-0 z-40 h-full flex flex-col"
        data-open={mobileOpen ? 'true' : undefined}
        style={{
          width:       W,
          minWidth:    W,
          background:  'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          overflow:    collapsed ? 'visible' : 'hidden',
          transition:
            'width 220ms cubic-bezier(0.4,0,0.2,1), ' +
            'min-width 220ms cubic-bezier(0.4,0,0.2,1), ' +
            'transform 300ms cubic-bezier(0.4,0,0.2,1)',
          /* Mobile: slide in/out via transform */
          transform:   mobileOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center h-[56px] shrink-0 px-4 gap-3"
             style={{ borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          {collapsed
            ? <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                   style={{ background: 'var(--accent)' }}>B</div>
            : <AppLogo size="sm" />
          }
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 flex flex-col px-3 py-2 gap-px"
             style={{ overflowY: collapsed ? 'visible' : 'auto', overflowX: 'visible', scrollbarWidth: 'none' }}>
          <SectionGroup title="Platform" items={NAV_MAIN}    collapsed={collapsed} pathname={pathname} />
          <SectionGroup title="Library"  items={NAV_LIBRARY} collapsed={collapsed} pathname={pathname} />
          <SectionGroup title="You"      items={NAV_YOU}     collapsed={collapsed} pathname={pathname} />

          {/* Write CTA card (expanded only) */}
          {!collapsed && !dismissed && (
            <div className="mt-4 mx-0 p-4 rounded-xl shrink-0 relative"
                 style={{ background: 'var(--accent)', marginTop: 16 }}>
              <button onClick={() => setDismissed(true)}
                className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/20 transition-all cursor-pointer">
                <X size={11} strokeWidth={2.5} />
              </button>
              <div className="flex items-center gap-2 mb-0.5 pr-5">
                <PenSquare size={12} className="text-white/80" strokeWidth={2} />
                <p className="text-white font-bold text-xs">Start writing</p>
              </div>
              <p className="text-[0.7rem] mb-3 text-white/70 leading-relaxed">
                Share your ideas with the world. Your next post is one click away.
              </p>
              <Link href="/write"
                className="block w-full py-1.5 rounded-lg text-center text-xs font-semibold text-white hover:opacity-80 transition-opacity"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)' }}>
                Write a post
              </Link>
            </div>
          )}

          {/* Collapsed write icon */}
          {collapsed && (
            <div className="mt-3 flex justify-center">
              <NavLink
                item={{ label: 'Write', href: '/write', icon: PenSquare }}
                collapsed={collapsed}
                pathname={pathname}
              />
            </div>
          )}
        </nav>

        {/* ── User footer ── */}
        <div className="shrink-0 p-2" style={{ borderTop: '1px solid var(--border)' }}>
          {!collapsed ? (
            <div className="relative">
              {/* Popover */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute bottom-full left-0 right-0 mb-1.5 z-50 rounded-xl overflow-hidden py-1"
                       style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                    <Link href="/settings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                      style={{ color: 'var(--fg-2)', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <Settings size={14} strokeWidth={1.8} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                      Settings
                    </Link>
                    <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                      style={{ color: 'var(--fg-3)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-3)'; }}>
                      <LogOut size={14} strokeWidth={1.8} className="shrink-0" />
                      Sign out
                    </button>
                  </div>
                </>
              )}

              {/* User row */}
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
                style={{ background: userMenuOpen ? 'var(--bg-hover)' : 'transparent' }}
                onMouseEnter={e => { if (!userMenuOpen) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!userMenuOpen) e.currentTarget.style.background = 'transparent'; }}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                     style={{ background: MOCK_USER.color }}>
                  {MOCK_USER.initials}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[0.875rem] font-semibold leading-snug truncate" style={{ color: 'var(--fg)' }}>
                    {MOCK_USER.name}
                  </p>
                  <p className="text-[0.72rem] truncate" style={{ color: 'var(--fg-3)' }}>
                    {MOCK_USER.email}
                  </p>
                </div>
                <ChevronsUpDown size={13} strokeWidth={1.8}
                  className={`transition-transform duration-150 shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--fg-4)' }} />
              </button>
            </div>
          ) : (
            /* Collapsed: avatar + logout */
            <div className="flex flex-col items-center gap-1">
              <Link href="/profile"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                style={{ background: MOCK_USER.color }}
                title={MOCK_USER.name}>
                {MOCK_USER.initials}
              </Link>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer"
                style={{ color: 'var(--fg-4)' }}
                title="Sign out"
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-4)'; }}>
                <LogOut size={13} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
