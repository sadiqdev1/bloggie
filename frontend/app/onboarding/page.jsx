'use client';

/**
 * /onboarding — 4-step post-registration flow.
 *
 * Step 0: Location      — country picker (REST Countries API) + optional city
 * Step 1: Interests     — topic chips, pick ≥ 2
 * Step 2: Reading goal  — casual / regular / writer / researcher
 * Step 3: Follow writers — suggested writers list
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, Sparkles, UserPlus, Search, MapPin, X,
} from 'lucide-react';
import AppLogo from '@/app/components/AppLogo';

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepBar({ step, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i}
          animate={{
            width:      i === step ? 28 : 8,
            background: i < step  ? '#22c55e' : i === step ? 'var(--accent)' : 'var(--border-2)',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

// ─── Topics ────────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: 'design',       label: 'Design',       emoji: '🎨' },
  { id: 'engineering',  label: 'Engineering',  emoji: '⚙️' },
  { id: 'life',         label: 'Life',         emoji: '🌱' },
  { id: 'business',     label: 'Business',     emoji: '📈' },
  { id: 'science',      label: 'Science',      emoji: '🔬' },
  { id: 'culture',      label: 'Culture',      emoji: '🎭' },
  { id: 'productivity', label: 'Productivity', emoji: '⚡' },
  { id: 'health',       label: 'Health',       emoji: '💪' },
  { id: 'finance',      label: 'Finance',      emoji: '💰' },
  { id: 'philosophy',   label: 'Philosophy',   emoji: '🧠' },
  { id: 'politics',     label: 'Politics',     emoji: '🏛️' },
  { id: 'travel',       label: 'Travel',       emoji: '✈️' },
];

const GOALS = [
  { id: 'casual',     label: 'Casual reading',   desc: 'A few good stories a week',    emoji: '☕' },
  { id: 'regular',    label: 'Daily reader',      desc: 'Something to read every day',  emoji: '📚' },
  { id: 'writer',     label: 'Writer first',      desc: 'I mainly want to publish',     emoji: '✍️' },
  { id: 'researcher', label: 'Deep researcher',   desc: 'Long-form & in-depth analysis',emoji: '🔍' },
];

const SUGGESTED_WRITERS = [
  { name: 'Sofia Reyes',   initials: 'SR', color: '#f97316', role: 'Designer & writer',     followers: '3.4k' },
  { name: 'James Okafor',  initials: 'JO', color: '#8b5cf6', role: 'Engineering writer',    followers: '5.1k' },
  { name: 'Priya Nair',    initials: 'PN', color: '#10b981', role: 'Lifestyle & wellness',  followers: '2.8k' },
  { name: 'Marcus Tan',    initials: 'MT', color: '#3b82f6', role: 'Productivity & work',   followers: '4.2k' },
  { name: 'Lena Fischer',  initials: 'LF', color: '#f59e0b', role: 'Business & startups',   followers: '6.7k' },
];

const TOTAL_STEPS = 4;

// ─── Step 0: Location ─────────────────────────────────────────────────────────
function LocationStep({ onNext }) {
  const [countries,  setCountries]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [query,      setQuery]      = useState('');
  const [selected,   setSelected]   = useState(null); // { name, flag, code }
  const [open,       setOpen]       = useState(false);
  const [city,       setCity]       = useState('');
  const inputRef = useRef(null);
  const dropRef  = useRef(null);

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2')
      .then(r => r.json())
      .then(data => {
        const sorted = data
          .map(c => ({ name: c.name.common, flag: c.flags.emoji ?? '🏳', code: c.cca2 }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Close on outside click
  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 60);

  return (
    <motion.div key="location"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
        Step 1 of {TOTAL_STEPS}
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-1.5"
          style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
        Where are you based?
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
        Helps us surface locally relevant stories and writers.
      </p>

      {/* Country picker */}
      <div className="mb-4" ref={dropRef}>
        <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5"
               style={{ color: 'var(--fg-3)' }}>Country</label>

        {/* Trigger */}
        <button type="button"
          onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 60); }}
          className="flex items-center gap-3 w-full h-11 px-4 rounded-xl border text-sm cursor-pointer transition-all"
          style={{
            background:  'var(--bg-input)',
            borderColor: open ? 'var(--accent)' : 'var(--border-input)',
            boxShadow:   open ? '0 0 0 3px var(--accent-dim)' : 'none',
            color:       selected ? 'var(--fg)' : 'var(--fg-4)',
          }}>
          {selected
            ? <><span className="text-xl leading-none">{selected.flag}</span> {selected.name}</>
            : <><MapPin size={14} strokeWidth={2} style={{ color: 'var(--fg-4)' }} /> Select your country…</>
          }
          {selected && (
            <button type="button" onClick={e => { e.stopPropagation(); setSelected(null); setQuery(''); }}
              className="ml-auto cursor-pointer" style={{ color: 'var(--fg-4)' }}>
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0,  scaleY: 1    }}
              exit={{   opacity: 0, y: -6,  scaleY: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full rounded-xl border shadow-2xl overflow-hidden"
              style={{
                background:  'var(--bg-dropdown)',
                borderColor: 'var(--border)',
                maxWidth:    340,
              }}>
              {/* Search inside dropdown */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <Search size={13} strokeWidth={2} style={{ color: 'var(--fg-4)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search country…"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--fg)' }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ color: 'var(--fg-4)' }}>
                    <X size={11} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-52" style={{ scrollbarWidth: 'thin' }}>
                {loading && (
                  <div className="py-6 text-center text-sm" style={{ color: 'var(--fg-3)' }}>
                    Loading countries…
                  </div>
                )}
                {error && (
                  <div className="py-6 text-center text-sm" style={{ color: '#ef4444' }}>
                    Failed to load. Check your connection.
                  </div>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <div className="py-6 text-center text-sm" style={{ color: 'var(--fg-3)' }}>
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
                {!loading && !error && filtered.map(c => (
                  <button key={c.code} type="button"
                    onClick={() => { setSelected(c); setOpen(false); setQuery(''); }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer"
                    style={{ color: 'var(--fg-2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span className="text-xl leading-none w-6 shrink-0">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                    {selected?.code === c.code && (
                      <Check size={12} strokeWidth={2.5} className="ml-auto shrink-0" style={{ color: 'var(--accent)' }} />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* City (optional) */}
      <div className="mb-8">
        <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5"
               style={{ color: 'var(--fg-3)' }}>City <span style={{ color: 'var(--fg-4)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <div className="relative">
          <MapPin size={14} strokeWidth={2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--fg-4)' }} />
          <input
            type="text" value={city} onChange={e => setCity(e.target.value)}
            placeholder="e.g. Lagos, London, New York…"
            className="w-full h-11 pl-9 pr-4 rounded-xl border text-sm outline-none transition-all"
            style={{
              background:  'var(--bg-input)', color: 'var(--fg)',
              borderColor: city ? 'var(--accent)' : 'var(--border-input)',
              boxShadow:   city ? '0 0 0 3px var(--accent-dim)' : 'none',
            }}
          />
        </div>
      </div>

      <motion.button
        onClick={() => onNext({ country: selected, city })}
        whileHover={selected ? { scale: 1.02 } : {}}
        whileTap={selected ? { scale: 0.97 } : {}}
        className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
        style={{
          background: selected ? 'var(--accent)' : 'var(--fg-4)',
          cursor:     selected ? 'pointer'       : 'not-allowed',
        }}>
        Continue <ArrowRight size={15} strokeWidth={2.5} />
      </motion.button>

      <button onClick={() => onNext({ country: null, city: '' })}
        className="mt-3 w-full text-center text-xs font-medium cursor-pointer transition-colors hover:text-[var(--fg)]"
        style={{ color: 'var(--fg-3)' }}>
        Skip for now
      </button>
    </motion.div>
  );
}

// ─── Step 1: Interests ────────────────────────────────────────────────────────
function InterestsStep({ onNext, onBack }) {
  const [topics, setTopics] = useState(new Set());
  const toggle = id => setTopics(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <motion.div key="interests"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
        Step 2 of {TOTAL_STEPS}
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-1.5"
          style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
        What do you love?
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
        Pick at least 2 topics to personalise your feed.
      </p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {TOPICS.map(({ id, label, emoji }, i) => {
          const sel = topics.has(id);
          return (
            <motion.button key={id} type="button"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.025 }}
              onClick={() => toggle(id)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl border text-sm font-medium cursor-pointer transition-all"
              style={{
                background:  sel ? 'var(--accent-dim)' : 'var(--bg-card)',
                borderColor: sel ? 'var(--accent)'     : 'var(--border)',
                color:       sel ? 'var(--accent)'     : 'var(--fg-2)',
              }}>
              <span>{emoji}</span>
              <span className="truncate">{label}</span>
              {sel && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="ml-auto shrink-0">
                  <Check size={12} strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={onBack}
          className="h-11 px-5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}>
          Back
        </button>
        <motion.button
          onClick={() => topics.size >= 2 && onNext(topics)}
          whileHover={topics.size >= 2 ? { scale: 1.02 } : {}}
          whileTap={topics.size >= 2 ? { scale: 0.97 } : {}}
          className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
          style={{
            background: topics.size >= 2 ? 'var(--accent)' : 'var(--fg-4)',
            cursor:     topics.size >= 2 ? 'pointer'       : 'not-allowed',
          }}>
          {topics.size < 2
            ? `Pick ${2 - topics.size} more`
            : <> Continue <ArrowRight size={15} strokeWidth={2.5} /> </>
          }
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 2: Goal ─────────────────────────────────────────────────────────────
function GoalStep({ onNext, onBack }) {
  const [goal, setGoal] = useState('');
  return (
    <motion.div key="goal"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
        Step 3 of {TOTAL_STEPS}
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-1.5"
          style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
        How do you read?
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
        We'll tune your feed based on your rhythm.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {GOALS.map(({ id, label, desc, emoji }, i) => (
          <motion.button key={id} type="button"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => setGoal(id)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all"
            style={{
              background:  goal === id ? 'var(--accent-dim)' : 'var(--bg-card)',
              borderColor: goal === id ? 'var(--accent)'     : 'var(--border)',
            }}>
            <span className="text-2xl">{emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: goal === id ? 'var(--accent)' : 'var(--fg)' }}>
                {label}
              </p>
              <p className="text-xs" style={{ color: 'var(--fg-3)' }}>{desc}</p>
            </div>
            {goal === id && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                <Check size={16} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={onBack}
          className="h-11 px-5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}>
          Back
        </button>
        <motion.button
          onClick={() => setGoal && onNext(goal)}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          Continue <ArrowRight size={15} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Step 3: Follow writers ───────────────────────────────────────────────────
function WritersStep({ onFinish, onBack, loading }) {
  const [following, setFollowing] = useState(new Set());
  const toggle = name => setFollowing(s => { const n = new Set(s); n.has(name) ? n.delete(name) : n.add(name); return n; });

  return (
    <motion.div key="writers"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>

      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'var(--accent)' }}>
        Step 4 of {TOTAL_STEPS}
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-1.5"
          style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
        Follow some writers
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
        Their latest posts will appear in your feed.
      </p>

      <div className="space-y-2.5 mb-6">
        {SUGGESTED_WRITERS.map(({ name, initials, color, role, followers }, i) => {
          const isFollowing = following.has(name);
          return (
            <motion.div key={name}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.055 }}
              className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                     style={{ background: color }}>{initials}</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg)' }}>{name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--fg-4)' }}>{role} · {followers} followers</p>
                </div>
              </div>
              <motion.button
                onClick={() => toggle(name)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                className="shrink-0 h-8 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                style={{
                  background: isFollowing ? 'var(--bg-hover)' : 'var(--accent)',
                  color:      isFollowing ? 'var(--fg-2)'    : '#fff',
                  border:     `1px solid ${isFollowing ? 'var(--border)' : 'var(--accent)'}`,
                }}>
                {isFollowing
                  ? <><Check size={11} strokeWidth={2.5} /> Following</>
                  : <><UserPlus size={11} strokeWidth={2} /> Follow</>
                }
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={onBack}
          className="h-11 px-5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}>
          Back
        </button>
        <motion.button onClick={onFinish}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
          style={{ background: 'var(--accent)' }}>
          {loading
            ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 rounded-full"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
            : <><Sparkles size={14} strokeWidth={2} /> Start exploring</>
          }
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router  = useRouter();
  const [step,     setStep]    = useState(0);
  const [answers,  setAnswers] = useState({ location: null, topics: null, goal: null });
  const [loading,  setLoading] = useState(false);

  const next = (key, value) => {
    setAnswers(a => ({ ...a, [key]: value }));
    setStep(s => s + 1);
  };

  const finish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/explore');
  };

  const STEP_LABELS = ['Location', 'Interests', 'Reading goal', 'Follow writers'];

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: 'var(--bg)' }}>

      {/* ── LEFT — form ── */}
      <div className="flex flex-col w-full items-center justify-center px-8 shrink-0 lg:w-[520px] overflow-y-auto"
           style={{ scrollbarWidth: 'none' }}>
        <div className="w-full max-w-sm">

          {/* Top bar: logo + step bar */}
          <div className="flex items-center justify-between mb-8">
            <AppLogo size="md" />
            <StepBar step={step} total={TOTAL_STEPS} />
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <LocationStep key="s0"
                onNext={val => next('location', val)} />
            )}
            {step === 1 && (
              <InterestsStep key="s1"
                onNext={val => next('topics', val)}
                onBack={() => setStep(0)} />
            )}
            {step === 2 && (
              <GoalStep key="s2"
                onNext={val => next('goal', val)}
                onBack={() => setStep(1)} />
            )}
            {step === 3 && (
              <WritersStep key="s3"
                onFinish={finish}
                onBack={() => setStep(2)}
                loading={loading} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT — progress panel ── */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center border-l relative overflow-hidden"
           style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>

        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
             style={{ background: 'var(--accent)', opacity: 0.04, filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />

        <div className="relative z-10 w-full max-w-xs px-4">
          {/* Step list */}
          <div className="space-y-5 mb-10">
            {STEP_LABELS.map((label, i) => {
              const done    = i < step;
              const current = i === step;
              return (
                <motion.div key={label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      background: done ? '#22c55e' : current ? 'var(--accent)' : 'var(--border-2)',
                      scale:      current ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                  </motion.div>
                  <span className="text-sm font-medium"
                        style={{ color: done ? '#22c55e' : current ? 'var(--fg)' : 'var(--fg-4)' }}>
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Live summary card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-5 rounded-2xl border"
            style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
            <p className="text-[0.66rem] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
              Your profile so far
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--fg-3)' }}>Location</span>
                <span className="font-medium" style={{ color: 'var(--fg)' }}>
                  {answers.location?.country
                    ? `${answers.location.country.flag} ${answers.location.country.name}`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--fg-3)' }}>Topics</span>
                <span className="font-medium" style={{ color: 'var(--fg)' }}>
                  {answers.topics ? `${answers.topics.size} selected` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--fg-3)' }}>Reading goal</span>
                <span className="font-medium" style={{ color: 'var(--fg)' }}>
                  {answers.goal
                    ? GOALS.find(g => g.id === answers.goal)?.label ?? '—'
                    : '—'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
