'use client';

/**
 * AuthMobileNav — Taskora BottomNav pattern adapted for Bloggie.
 *
 * Exact pattern from /c/xampp/htdocs/taskora/frontend/src/components/BottomNav.jsx:
 *  • Fixed bottom, surface bg, 1px border-top, boxShadow
 *  • Tab items: icon in rounded pill (active = accent bg) + label
 *  • "More" button → opens sidebar drawer via onMenuClick
 *  • Hidden on lg+ (lg:hidden)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, ClipboardList, Menu } from 'lucide-react';

const TABS = [
  { label: 'Feed',      href: '/explore',       Icon: Home          },
  { label: 'Discover',  href: '/blogs',         Icon: Compass       },
  { label: 'Saved',     href: '/bookmarks',     Icon: Bookmark      },
  { label: 'Activity',  href: '/notifications', Icon: ClipboardList },
];

function isActive(href, pathname) {
  if (href === '/explore' || href === '/blogs') return pathname === href;
  return pathname.startsWith(href);
}

export default function AuthMobileNav({ onMenuClick }) {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
      style={{
        background:    'var(--bg-card)',
        backdropFilter:'blur(20px)',
        borderTop:     '1px solid var(--border)',
        boxShadow:     '0 -4px 24px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Mobile navigation"
    >
      {TABS.map(({ label, href, Icon }) => {
        const active = isActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-95"
            style={{ color: active ? 'var(--accent)' : 'var(--fg-3)', textDecoration: 'none' }}
          >
            <span
              className="w-10 h-8 rounded-xl flex items-center justify-center transition-all duration-150"
              style={{ background: active ? 'var(--accent-dim)' : 'transparent' }}
            >
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
            </span>
            <span className="text-[0.6rem] font-bold tracking-wide"
                  style={{ color: active ? 'var(--accent)' : 'var(--fg-3)' }}>
              {label}
            </span>
          </Link>
        );
      })}

      {/* More → opens sidebar drawer */}
      <button
        onClick={onMenuClick}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-95 cursor-pointer"
        style={{ color: 'var(--fg-3)' }}
        aria-label="More"
      >
        <span className="w-10 h-8 rounded-xl flex items-center justify-center">
          <Menu size={19} strokeWidth={1.8} />
        </span>
        <span className="text-[0.6rem] font-bold tracking-wide" style={{ color: 'var(--fg-3)' }}>
          More
        </span>
      </button>
    </nav>
  );
}
