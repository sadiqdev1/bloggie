'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

/**
 * Sun / Moon toggle that:
 * 1. Reads the stored preference from localStorage on mount
 * 2. Falls back to the OS prefers-color-scheme
 * 3. Applies / removes the `.dark` class on <html>
 * 4. Persists the choice in localStorage under 'bloggie-theme'
 *
 * Place this anywhere in the tree — it syncs with the global class directly.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync with stored / system preference on first render
  useEffect(() => {
    const stored      = localStorage.getItem('bloggie-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark      = stored ? stored === 'dark' : prefersDark;

    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bloggie-theme', next ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center rounded-xl border transition-colors"
      style={{
        borderColor: 'var(--border)',
        color:       'var(--fg-2)',
        background:  'var(--bg-hover)',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0,   opacity: 1, scale: 1   }}
          exit={{    rotate:  90, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {dark
            ? <Sun  size={14} strokeWidth={2} />
            : <Moon size={14} strokeWidth={2} />
          }
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
