/**
 * Shared Framer Motion variants used across Taskora pages.
 * Import what you need — keeps animation behaviour consistent site-wide.
 */

/** Fade + slide up (snappy) — for dashboard cards, rows, content blocks */
export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

/** Fade + slide up (slower/bigger) — for landing page sections */
export const fadeUpSlow = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6,  ease: [0.16, 1, 0.3, 1] } },
};

/** Stagger container — wrap a list of animated children */
export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

/** Stagger container — slightly slower for landing page grids */
export const staggerSlow = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Fade only — for overlays, banners */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/** Scale pop — for stat cards */
export const scalePop = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
};

/** Slide in from left — for sidebar active indicator */
export const slideInLeft = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
};

/** Generic spring transition shorthand */
export const spring = { type: 'spring', stiffness: 380, damping: 30 };
