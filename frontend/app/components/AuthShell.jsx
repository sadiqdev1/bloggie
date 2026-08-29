'use client';

/**
 * AuthShell — wraps all authenticated pages.
 * Provides AuthNavbar (top) + AuthMobileNav (bottom) + correct padding.
 *
 * Usage:
 *   <AuthShell>
 *     <YourPageContent />
 *   </AuthShell>
 *
 * pt-14  = AuthNavbar height (h-14 = 56px)
 * pb-16  = AuthMobileNav height on mobile (h-16 = 64px), 0 on md+
 */

import ScrollProgress  from '@/app/components/ui/ScrollProgress';
import AuthNavbar      from '@/app/components/AuthNavbar';
import AuthMobileNav   from '@/app/components/AuthMobileNav';

export default function AuthShell({ children, noPadding = false }) {
  return (
    <>
      <ScrollProgress />
      <AuthNavbar />
      <div
        className={noPadding ? '' : 'pt-14 pb-16 md:pb-0 min-h-screen'}
        style={{ background:'var(--bg)' }}>
        {children}
      </div>
      <AuthMobileNav />
    </>
  );
}
