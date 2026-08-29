'use client';

/**
 * AuthSidebar — shadcn/ui-inspired collapsible sidebar.
 *
 * Expanded (default on desktop): 220px — icon + label + section headers
 * Collapsed:                      56px  — icon only + tooltip on hover
 *
 * Design:
 *  • Same bg as the page (var(--bg)) not card — blends in like shadcn
 *  • Clean 1px right border
 *  • Section labels (PLATFORM, LIBRARY, etc.) only visible when expanded
 *  • Active item: subtle bg + accent-coloured text (not filled pill)
 *  • Collapse toggle lives at the very bottom of the sidebar
 *  • Write CTA moves from navbar to bottom of sidebar (prominent)
 *  • Mobile: hidden (AuthMobileNav covers mobile)
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Compass, PenSquare, Bookmark, Bell,
  User, Settings, TrendingUp, Hash,
  ChevronLeft, ChevronRight, Flame,
  LayoutDashboard, Rss,
} from 'lucide-react';

// ─── Sidebar data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    title: 'Platform',
    items: [
      { label: 'Feed',          href: '/explore',       icon: Home          },
      { label: 'Discover',      href: '/blogs',         icon: Compass       },
      { label: 'Trending',      href: '/blogs?tab=trending', icon: TrendingUp },
      { label: 'Following',     href: '/explore?tab=following', icon: Rss   },
    ],
  },
  {
    title: 'Library',
    items: [
      { label: 'Bookmarks',     href: '/bookmarks',     icon: Bookmark      },
      { label: 'Notifications', href: '/notifications', icon: Bell, badge: 2 },
    ],
  },
  {
    title: 'You',
    items: [
      { label: 'Profile',       href: '/profile',       icon: User          },
      { label: 'Dashboard',     href: '/dashboard',     icon: LayoutDashboard },
      { label: 'Settings',      href: '/settings',      icon: Settings      },
    ],
  },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ label, children, show }) {
  if (!show) return <>{children}</>;
  return (
    <div className="relative group/tt">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[100]
                      opacity-0 group-hover/tt:opacity-100 transition-opacity duration-150">
        <div className="whitespace-nowrap text-xs font-medium px-2 py-1 rounded-md shadow-md"
             style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────
function Item({ item, collapsed, pathname }) {
  const active = pathname === item.href
    || (item.href.length > 1 && !item.href.includes('?') && pathname.startsWith(item.href));

  return (
    <Tooltip label={item.label} show={collapsed}>
      <Link
        href={item.href}
        className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm outline-none cursor-pointer transition-colors"
        style={{
          background: active ? 'var(--bg-hover)' : 'transparent',
          color:      active ? 'var(--fg)'       : 'var(--fg-3)',
          fontWeight: active ? 600 : 400,
        }}
      >
        <div className="relative flex items-center justify-center shrink-0 w-4 h-4">
          <item.icon
            size={15}
            strokeWidth={active ? 2.2 : 1.8}
            style={{ color: active ? 'var(--accent)' : 'var(--fg-3)' }}
          />
          {item.badge > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
              style={{ background: 'var(--accent)' }}>
              {item.badge}
            </span>
          )}
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{   opacity: 0, width: 0 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="truncate overflow-hidden whitespace-nowrap flex-1 min-w-0"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Right-side badge when expanded */}
        {!collapsed && item.badge > 0 && (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--accent)', color: '#fff' }}>
            {item.badge}
          </span>
        )}
      </Link>
    </Tooltip>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AuthSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:flex flex-col shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-hidden border-r"
      style={{
        background:  'var(--bg)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex flex-col h-full py-3 px-2 overflow-y-auto overflow-x-hidden"
           style={{ scrollbarWidth: 'none' }}>

        {/* Nav sections */}
        <div className="flex-1 space-y-4">
          {SECTIONS.map(({ title, items }) => (
            <div key={title}>
              {/* Section header — hidden when collapsed */}
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.p
                    key="title"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-2 mb-1 text-[10px] font-semibold tracking-wider uppercase select-none"
                    style={{ color: 'var(--fg-4)' }}
                  >
                    {title}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-0.5">
                {items.map(item => (
                  <Item key={item.href} item={item} collapsed={collapsed} pathname={pathname} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Write CTA — lives in sidebar, not navbar */}
        <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <Tooltip label="Write" show={collapsed}>
            <Link href="/write"
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-semibold cursor-pointer transition-colors"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <PenSquare size={15} strokeWidth={2} className="shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="write-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{   opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="truncate overflow-hidden whitespace-nowrap">
                    Write a post
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </Tooltip>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="mt-1 flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--fg-4)' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="shrink-0 flex items-center justify-center w-4 h-4">
              {collapsed
                ? <ChevronRight size={14} strokeWidth={2} />
                : <ChevronLeft  size={14} strokeWidth={2} />}
            </span>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  key="collapse-label"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{   opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs truncate overflow-hidden whitespace-nowrap">
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
