'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Typewriter effect — cycles through an array of words
 */
export function useTypingWord(words, speed = 90, pause = 1800) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let t;
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), pause);
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    else { setDeleting(false); setWordIndex(i => (i + 1) % words.length); }
    return () => clearTimeout(t);
  }, [displayed, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

/**
 * Animated count-up on scroll into view
 */
export function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const raf = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, target, duration]);

  return { ref, count };
}

/**
 * Dark / light theme toggle — reads/writes localStorage + html class
 */
export function useTheme() {
  const [dark, setDark] = useState(false);

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

  return { dark, toggle };
}
