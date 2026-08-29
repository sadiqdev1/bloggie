'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Custom Select — replaces every native <select> in the app.
 *
 * Props:
 *   options   — [{ value, label }] or ['string', ...] 
 *   value     — controlled value
 *   onChange  — (value) => void
 *   placeholder — string shown when nothing is selected
 *   error     — string | boolean — red border + message
 *   label     — optional floating label above
 *   className — extra classes on the trigger
 *   style     — extra inline styles on the trigger
 *   disabled  — boolean
 */
export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  error,
  label,
  className = '',
  style = {},
  disabled = false,
}) {
  const [open,     setOpen]     = useState(false);
  const [focused,  setFocused]  = useState(false);
  const containerRef = useRef(null);

  // Normalise options → [{value, label}]
  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );

  const selected = normalised.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    const fn = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    const idx = normalised.findIndex(o => o.value === value);
    if (e.key === 'Enter' || e.key === ' ')   { e.preventDefault(); setOpen(o => !o); }
    if (e.key === 'Escape')                    { setOpen(false); }
    if (e.key === 'ArrowDown' && !open)        { setOpen(true); }
    if (e.key === 'ArrowDown' && open)         { onChange?.(normalised[Math.min(idx + 1, normalised.length - 1)].value); }
    if (e.key === 'ArrowUp'   && open)         { onChange?.(normalised[Math.max(idx - 1, 0)].value); }
    if (e.key === 'Tab')                       { setOpen(false); setFocused(false); }
  };

  const hasBorder = open || focused;
  const hasError  = !!error;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--fg-2)' }}>{label}</p>
      )}

      {/* Trigger */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => !open && setFocused(false)}
        onKeyDown={handleKeyDown}
        className="w-full h-11 px-4 rounded-xl text-sm flex items-center justify-between gap-2 border transition-all cursor-pointer"
        style={{
          background:   disabled ? 'var(--bg-hover)' : 'var(--bg-input)',
          color:        selected ? 'var(--fg)' : 'var(--fg-4)',
          borderColor:  hasError  ? '#ef4444'
                      : hasBorder ? 'var(--accent)'
                      : 'var(--border-input)',
          boxShadow:    hasBorder && !hasError ? '0 0 0 3px var(--accent-dim)' : 'none',
          opacity:      disabled ? 0.5 : 1,
          outline:      'none',
          ...style,
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <ChevronDown size={15} strokeWidth={2} style={{ color: 'var(--fg-3)' }} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -8,  scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 w-full mt-1.5 rounded-xl border overflow-hidden shadow-2xl"
            style={{
              background:   'var(--bg-dropdown)',
              borderColor:  'var(--border)',
              maxHeight:    '220px',
              overflowY:    'auto',
              scrollbarWidth: 'none',
            }}
          >
            {normalised.map((opt, i) => {
              const isSelected = opt.value === value;
              return (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.15 }}
                  onClick={() => { onChange?.(opt.value); setOpen(false); }}
                  className="flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors"
                  style={{
                    color:      isSelected ? 'var(--accent)'  : 'var(--fg)',
                    background: isSelected ? 'var(--accent-dim)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={13} strokeWidth={2.5} />}
                </motion.li>
              );
            })}

            {normalised.length === 0 && (
              <li className="px-4 py-3 text-sm text-center" style={{ color: 'var(--fg-4)' }}>
                No options available
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && typeof error === 'string' && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs"
          style={{ color: '#ef4444' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
