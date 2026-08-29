'use client';

/**
 * PageShell — wraps every public page with:
 *   • ScrollProgress bar
 *   • CursorGlow
 *   • Navbar (fixed, theme-aware)
 *   • main content with correct top padding for the h-16 navbar
 *   • Footer
 *
 * Usage:
 *   <PageShell>
 *     <YourPageContent />
 *   </PageShell>
 */

import ScrollProgress from '@/app/components/ui/ScrollProgress';
import CursorGlow     from '@/app/components/ui/CursorGlow';
import Navbar         from '@/app/components/Navbar';
import Footer         from '@/app/components/Footer';

export default function PageShell({ children }) {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      {/* pt-16 = navbar height (h-16 = 64px) */}
      <main className="min-h-screen pt-16" style={{ background: 'var(--bg)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
