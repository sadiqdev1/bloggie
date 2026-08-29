'use client';

import { useState, useEffect } from 'react';

/**
 * Types and deletes words from an array in a loop.
 * @param {string[]} words   - Array of words to cycle through
 * @param {number}   speed   - Typing speed in ms per character
 * @param {number}   pause   - Pause in ms after fully typing a word before deleting
 * @returns {string} The currently displayed string
 */
export function useTypingWord(words, speed = 90, pause = 1800) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let t;

    if (!deleting && displayed.length < word.length) {
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
    } else if (!deleting && displayed.length === word.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    } else {
      setDeleting(false);
      setWordIndex(i => (i + 1) % words.length);
    }

    return () => clearTimeout(t);
  }, [displayed, deleting, wordIndex, words, speed, pause]);

  return displayed;
}
