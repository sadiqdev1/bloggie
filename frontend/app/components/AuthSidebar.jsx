'use client';

/**
 * AuthSidebar — collapsible left sidebar for authenticated pages.
 *
 * Collapsed (default): 56px wide — icons only with tooltips
 * Expanded:           240px wide — icons + labels
 * Mobile: hidden entirely (AuthMobileNav handles mobile nav)
 *
 * Usage: wrap page content in a flex row:
 *   <div className="flex pt-16">
 *     <AuthSidebar />
 *     <main className="flex-1 min-w-0"> ... </main>
 *   </div>
 */

import { useState } from 'react';
import Link        from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Compass, PenSquare, Bookmark, Bell,
  User, Settings, TrendingUp, Hash, ChevronRight,
  Flame, Users,
} from 'lucide-react';

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Feed',          href: '/explore',       icon: Home      },
  { label: 'Discover',      href: '/blogs',         icon: Compass   },
  { label: 'Trending',      href: '/blogs?sort=trending', icon: TrendingUp },
  { label: 'Write',         href: '/write',         icon: PenSquare, accent: true },
  { label: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark  },
  { label: 'Notifications', href: '/notifications', icon: Bell,     badge: 2 },
];

const BOTTOM_NAV = [
  { label: 'Profile',   href: '/profile',   icon: User     },
  { label: 'Settings',  href: '/settings',  icon: Settings },
];

const TRENDING_TOPICS = [
  { label: 'Design Systems', count: '2.1k', icon: Hash },
  { label: 'AI & Future',    count: '5.8k', icon: Flame },
  { label: 'Productivity',   count: '1.4k', icon: Hash },
  { label: 'Startups',       count: '3.2k', icon: Flame },
];

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
function Tip({ label, children, show }) {
  return (
    <div className="relative group/tip">
      {children}
      {show && (
        <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            className="whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity"
            style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
            {label}
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({ item, expanded, pathname }) {
  const active = pathname === item.href || (item.href !== '/explore' && item.href !== '/blogs' && pathname.startsWith(item.href));

  return (
    <Tip label={item.label} show={!expanded}>
      <Link href={item.href}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 relative cursor-pointer transition-all group/item"
        style={{
          background:  active ? 'var(--accent-dim)'  : 'transparent',
          color:       active ? 'var(--accent)'      : 'var(--fg-2)',
        }}>

        {/* Active indicator bar */}
        {active && (
          <motion.div layoutId="sidebar-indicator"
            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
            style={{ background: 'var(--accent)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
        )}

        {/* Icon */}
        <div className="relative shrink-0 flex items-center justify-center w-5 h-5">
          {item.accent ? (
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                 style={{ background: active ? 'var(--accent)' : 'var(--accent-dim)' }}>
              <item.icon size={14} strokeWidth={2.5}
                style={{ color: active ? '#fff' : 'var(--accent)' }} />
            </div>
          ) : (
            <item.icon size={17} strokeWidth={active ? 2.2 : 1.8}
              style={{ color: active ? 'var(--accent)' : 'var(--fg-2)' }} />
          )}
          {item.badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                  style={{ background: '#ef4444' }}>{item.badge}</span>
          )}
        </div>

        {/* Label — only when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{   opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
              style={{ color: active ? 'var(--accent)' : 'var(--fg-2)' }}>
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </Tip>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthSidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: expanded ? 240 : 56 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3,1] }}
      className="hidden md:flex flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r overflow-hidden"
      style={{
        background:  'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end px-2 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <motion.button
          onClick={() => setExpanded(e => !e)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
          className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: 'var(--fg-3)' }}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronRight size={15} strokeWidth={2.5} />
          </motion.span>
        </motion.button>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-0.5"
           style={{ scrollbarWidth: 'none' }}>
        {NAV.map(item => (
          <NavItem key={item.href} item={item} expanded={expanded} pathname={pathname} />
        ))}

        {/* Trending topics — only shown when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="pt-4 mt-2 border-t"
              style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-bold tracking-widest uppercase px-3 mb-2"
                 style={{ color: 'var(--fg-3)' }}>
                Trending
              </p>
              {TRENDING_TOPICS.map(({ label, count, icon: Icon }) => (
                <Link key={label} href={`/blogs?tag=${encodeURIComponent(label)}`}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--fg-2)' }}>
                  <span className="flex items-center gap-2">
                    <Icon size={11} strokeWidth={2} style={{ color: 'var(--fg-3)' }} />
                    {label}
                  </span>
                  <span style={{ color: 'var(--fg-3)' }}>{count}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav (profile + settings) */}
      <div className="border-t px-2 py-2 space-y-0.5" style={{ borderColor: 'var(--border)' }}>
        {BOTTOM_NAV.map(item => (
          <NavItem key={item.href} item={item} expanded={expanded} pathname={pathname} />
        ))}
      </div>
    </motion.aside>
  );
}
