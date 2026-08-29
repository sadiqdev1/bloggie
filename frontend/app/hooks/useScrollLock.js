import { useEffect } from 'react';

/**
 * useScrollLock — prevents page scrolling while a modal is open.
 *
 * The DashboardLayout uses a fixed `h-screen overflow-hidden` wrapper with
 * an inner `<main id="main-scroll" overflow-y-auto>` as the scroll container.
 * document.body is NOT the scroller, so locking body.overflow has no effect.
 *
 * This hook locks #main-scroll (and body as a fallback for non-dashboard pages).
 */
export default function useScrollLock() {
  useEffect(() => {
    // Primary target — the dashboard inner scroll container
    const main = document.getElementById('main-scroll');
    // Fallback — regular pages where body scrolls
    const body = document.body;

    const prevMain = main ? main.style.overflow : null;
    const prevBody = body.style.overflow;

    if (main) main.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      if (main) main.style.overflow = prevMain ?? '';
      body.style.overflow = prevBody;
    };
  }, []);
}
