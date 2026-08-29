'use client';

/**
 * AuthMobileNav — bottom tab bar for authenticated pages on mobile.
 * Hidden on md+ (handled by AuthNavbar desktop layout).
 *
 * Tabs: Feed · Discover · Write · Notifications · Profile
 */

import Link        from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, PenSquare, Bell, User } from 'lucide-react';

const TABS = [
  { label:'Feed',          href:'/explore',       icon: Home      },
  { label:'Discover',      href:'/blogs',         icon: Compass   },
  { label:'Write',         href:'/write',         icon: PenSquare, accent: true },
  { label:'Notifications', href:'/notifications', icon: Bell,      badge: 2    },
  { label:'Profile',       href:'/sadiqdev1',     icon: User      },
];

export default function AuthMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 flex items-stretch border-t"
      style={{
        background:           'color-mix(in srgb, var(--bg-card) 94%, transparent)',
        borderColor:          'var(--border)',
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter:       'blur(24px)',
      }}
      aria-label="Mobile navigation">
      {TABS.map(({ label, href, icon: Icon, accent, badge }) => {
        const active = pathname === href || (href !== '/explore' && pathname.startsWith(href));
        return (
          <Link key={href} href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative cursor-pointer"
            aria-label={label} aria-current={active ? 'page' : undefined}>

            {/* Active pill indicator */}
            {active && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full"
                style={{ background:'var(--accent)' }}
                transition={{ type:'spring', stiffness:500, damping:35 }}
              />
            )}

            {/* Write tab — special pill style */}
            {accent ? (
              <motion.span
                whileHover={{ scale:1.1 }} whileTap={{ scale:0.88 }}
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: active ? 'var(--accent)' : 'var(--accent-dim)',
                  border:     `1.5px solid ${active ? 'var(--accent)' : 'var(--accent-glow)'}`,
                }}>
                <Icon size={18} strokeWidth={2}
                  style={{ color: active ? '#fff' : 'var(--accent)' }} />
              </motion.span>
            ) : (
              <div className="relative">
                <motion.span
                  whileTap={{ scale:0.82 }}
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type:'spring', stiffness:500, damping:30 }}
                  className="flex items-center justify-center w-7 h-7">
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.8}
                    style={{ color: active ? 'var(--accent)' : 'var(--fg-4)' }} />
                </motion.span>
                {/* Badge */}
                {badge && badge > 0 && (
                  <motion.span
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:'spring', stiffness:500, damping:22 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background:'#ef4444' }}>
                    {badge}
                  </motion.span>
                )}
              </div>
            )}

            {/* Label */}
            {!accent && (
              <motion.span
                animate={{ color: active ? 'var(--accent)' : 'var(--fg-4)' }}
                className="text-[10px] font-medium leading-none">
                {label}
              </motion.span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
