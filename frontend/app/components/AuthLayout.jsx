'use client';

/**
 * AuthLayout — Taskora DashboardLayout pattern adapted for Bloggie.
 *
 * Wires together: AuthSidebar + AuthNavbar (TopBar) + AuthMobileNav (BottomNav)
 *
 * Usage (replace AuthNavbar + AuthSidebar + AuthMobileNav in every auth page):
 *   <AuthLayout>
 *     <YourPageContent />
 *   </AuthLayout>
 */

import { useState } from 'react';
import AuthSidebar  from '@/app/components/AuthSidebar';
import AuthNavbar   from '@/app/components/AuthNavbar';
import AuthMobileNav from '@/app/components/AuthMobileNav';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

export default function AuthLayout({ children }) {
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg)' }}>
      <ScrollProgress />

      <AuthSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AuthNavbar
          onMenuClick={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed(c => !c)}
          collapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 lg:pb-6" id="main-scroll">
          {children}
        </main>
      </div>

      <AuthMobileNav onMenuClick={() => setMobileOpen(true)} />
    </div>
  );
}
