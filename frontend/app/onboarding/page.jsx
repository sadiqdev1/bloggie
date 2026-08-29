'use client';

/**
 * /onboarding — Post-registration topic & goal picker.
 * Shown after a user creates their account via /register.
 * Step 1: Pick interests (≥2)
 * Step 2: Pick reading goal
 * Step 3: Follow suggested writers
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/app/components/AppLogo';
import Blob    from '@/app/components/ui/Blob';

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOPICS = [
  { id:'design',       label:'Design',       emoji:'🎨' },
  { id:'engineering',  label:'Engineering',  emoji:'⚙️' },
  { id:'life',         label:'Life',         emoji:'🌱' },
  { id:'business',     label:'Business',     emoji:'📈' },
  { id:'science',      label:'Science',      emoji:'🔬' },
  { id:'culture',      label:'Culture',      emoji:'🎭' },
  { id:'productivity', label:'Productivity', emoji:'⚡' },
  { id:'health',       label:'Health',       emoji:'💪' },
  { id:'finance',      label:'Finance',      emoji:'💰' },
  { id:'philosophy',   label:'Philosophy',   emoji:'🧠' },
  { id:'politics',     label:'Politics',     emoji:'🏛️' },
  { id:'travel',       label:'Travel',       emoji:'✈️' },
];

const GOALS = [
  { id:'casual',    label:'Casual reading',    desc:'A few stories a week',  emoji:'☕' },
  { id:'regular',   label:'Regular reader',    desc:'Something every day',   emoji:'📚' },
  { id:'writer',    label:'Writer first',      desc:'I mainly want to write',emoji:'✍️' },
  { id:'researcher',label:'Deep researcher',   desc:'Long-form and analysis', emoji:'🔍' },
];

const SUGGESTED_WRITERS = [
  { name:'Sofia Reyes',   initials:'SR', color:'#f97316', role:'Designer & writer',     followers:'3.4k' },
  { name:'James Okafor',  initials:'JO', color:'#8b5cf6', role:'Engineering writer',    followers:'5.1k' },
  { name:'Priya Nair',    initials:'PN', color:'#10b981', role:'Lifestyle & wellness',  followers:'2.8k' },
  { name:'Marcus Tan',    initials:'MT', color:'#3b82f6', role:'Productivity & work',   followers:'4.2k' },
  { name:'Lena Fischer',  initials:'LF', color:'#f59e0b', role:'Business & startups',   followers:'6.7k' },
  { name:'Amara Osei',    initials:'AO', color:'#ec4899', role:'Culture & society',      followers:'1.9k' },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ step, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({length: total}).map((_,i) => (
        <motion.div key={i}
          animate={{
            width:      i === step ? '32px' : '8px',
            background: i < step  ? '#22c55e' : i === step ? 'var(--accent)' : 'var(--border-2)',
          }}
          transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
          className="h-1.5 rounded-full" />
      ))}
    </div>
  );
}

// ─── Topic chip ───────────────────────────────────────────────────────────────
function TopicChip({ id, label, emoji, selected, onToggle }) {
  return (
    <motion.button type="button"
      onClick={() => onToggle(id)}
      whileHover={{ scale:1.04 }} whileTap={{ scale:0.94 }}
      className="flex items-center gap-2.5 h-11 px-4 rounded-xl text-sm font-medium border cursor-pointer transition-all"
      style={{
        background:  selected ? 'var(--accent-dim)' : 'var(--bg-card)',
        borderColor: selected ? 'var(--accent)'     : 'var(--border)',
        color:       selected ? 'var(--accent)'     : 'var(--fg-2)',
      }}>
      <span>{emoji}</span>
      <span className="truncate">{label}</span>
      {selected && (
        <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
          transition={{ type:'spring', stiffness:500, damping:20 }} className="ml-auto shrink-0">
          <Check size={12} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step,      setStep]     = useState(0);
  const [topics,    setTopics]   = useState(new Set());
  const [goal,      setGoal]     = useState('');
  const [following, setFollowing]= useState(new Set());
  const [loading,   setLoading]  = useState(false);

  const toggleTopic   = (id) => setTopics(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleFollow  = (name) => setFollowing(s => { const n=new Set(s); n.has(name)?n.delete(name):n.add(name); return n; });

  const finish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/explore');
  };

  const STEPS = ['Interests', 'Your goal', 'Follow writers'];

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg)' }}>
      {/* ── Left — form ── */}
      <div className="flex flex-col flex-1 min-h-screen px-6 py-10 lg:max-w-[520px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <AppLogo size="md" />
          <StepBar step={step} total={3} />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
          <AnimatePresence mode="wait">

            {/* ── Step 0: Topics ── */}
            {step === 0 && (
              <motion.div key="topics"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color:'var(--accent)' }}>
                  Step 1 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight mb-2"
                    style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
                  What do you love?
                </h1>
                <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>
                  Pick at least 2 topics to personalise your feed.
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {TOPICS.map(({ id, label, emoji }, i) => (
                    <motion.div key={id}
                      initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay:i*0.03 }}>
                      <TopicChip id={id} label={label} emoji={emoji}
                        selected={topics.has(id)} onToggle={toggleTopic} />
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => topics.size >= 2 && setStep(1)}
                  whileHover={topics.size >= 2 ? { scale:1.02 } : {}}
                  whileTap={topics.size >= 2 ? { scale:0.97 } : {}}
                  className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{
                    background: topics.size >= 2 ? 'var(--accent)' : 'var(--fg-4)',
                    cursor:     topics.size >= 2 ? 'pointer' : 'not-allowed',
                  }}>
                  {topics.size < 2
                    ? `Pick ${2 - topics.size} more topic${topics.size === 1 ? '' : 's'}`
                    : <> Continue <ArrowRight size={15} strokeWidth={2.5} /> </>
                  }
                </motion.button>
                <button onClick={() => setStep(1)}
                  className="mt-3 w-full text-center text-xs cursor-pointer transition-colors hover:text-[var(--fg)]"
                  style={{ color:'var(--fg-4)' }}>
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Goal ── */}
            {step === 1 && (
              <motion.div key="goal"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color:'var(--accent)' }}>
                  Step 2 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight mb-2"
                    style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
                  How do you read?
                </h1>
                <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>
                  We'll tune your feed accordingly.
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {GOALS.map(({ id, label, desc, emoji }, i) => (
                    <motion.button key={id} type="button"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.07 }}
                      onClick={() => setGoal(id)}
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all"
                      style={{
                        background:  goal===id ? 'var(--accent-dim)' : 'var(--bg-card)',
                        borderColor: goal===id ? 'var(--accent)'     : 'var(--border)',
                      }}>
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: goal===id ? 'var(--accent)' : 'var(--fg)' }}>
                          {label}
                        </p>
                        <p className="text-xs" style={{ color:'var(--fg-3)' }}>{desc}</p>
                      </div>
                      {goal===id && (
                        <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                          transition={{ type:'spring', stiffness:500, damping:20 }}>
                          <Check size={16} strokeWidth={2.5} style={{ color:'var(--accent)' }} />
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(0)}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
                    Back
                  </button>
                  <motion.button
                    onClick={() => setStep(2)}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background:'var(--accent)' }}>
                    Continue <ArrowRight size={15} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Follow writers ── */}
            {step === 2 && (
              <motion.div key="writers"
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color:'var(--accent)' }}>
                  Step 3 of 3
                </p>
                <h1 className="text-3xl font-bold tracking-tight mb-2"
                    style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
                  Follow some writers
                </h1>
                <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>
                  Their latest posts will appear in your feed. Follow at least one to get started.
                </p>

                <div className="space-y-2.5 mb-6">
                  {SUGGESTED_WRITERS.map(({ name, initials, color, role, followers }, i) => {
                    const isFollowing = following.has(name);
                    return (
                      <motion.div key={name}
                        initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay:i*0.06 }}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border"
                        style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                               style={{ background:color }}>{initials}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color:'var(--fg)' }}>{name}</p>
                            <p className="text-xs" style={{ color:'var(--fg-4)' }}>{role} · {followers} followers</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => toggleFollow(name)}
                          whileHover={{ scale:1.05 }} whileTap={{ scale:0.94 }}
                          className="shrink-0 h-8 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                          style={{
                            background: isFollowing ? 'var(--bg-hover)' : 'var(--accent)',
                            color:      isFollowing ? 'var(--fg-2)'    : '#fff',
                            border:     `1px solid ${isFollowing ? 'var(--border)' : 'var(--accent)'}`,
                          }}>
                          {isFollowing
                            ? <><Check size={11} strokeWidth={2.5}/> Following</>
                            : <><UserPlus size={11} strokeWidth={2}/> Follow</>}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)}
                    className="h-11 px-5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                    style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
                    Back
                  </button>
                  <motion.button onClick={finish}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background:'var(--accent)' }}>
                    {loading
                      ? <motion.span animate={{ rotate:360 }}
                          transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
                          className="w-4 h-4 border-2 rounded-full"
                          style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />
                      : <><Sparkles size={14} strokeWidth={2}/> Start exploring</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT — visual panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden"
           style={{ background:'var(--bg-card)' }}>
        <Blob className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background:'var(--accent)', opacity:0.08 }} />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16 gap-6">
          {/* Step labels */}
          <div className="w-full max-w-xs space-y-4">
            {[
              { n:1, label:'Pick your interests',     done: step > 0 },
              { n:2, label:'Tell us how you read',    done: step > 1 },
              { n:3, label:'Follow great writers',    done: step > 2 },
            ].map(({ n, label, done }, i) => (
              <motion.div key={n}
                initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.2+i*0.1, ease:[0.16,1,0.3,1] }}
                className="flex items-center gap-4">
                <motion.div
                  animate={{
                    background: done ? '#22c55e' : step === i ? 'var(--accent)' : 'var(--border-2)',
                    scale:      step === i ? 1.1 : 1,
                  }}
                  transition={{ duration:0.3 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {done ? <Check size={14} strokeWidth={3}/> : n}
                </motion.div>
                <span className="text-sm font-medium"
                      style={{ color: done ? '#22c55e' : step === i ? 'var(--fg)' : 'var(--fg-4)' }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Animated stat cards */}
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.4 }}
            className="w-full max-w-xs mt-6 p-6 rounded-2xl border shadow-xl"
            style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color:'var(--accent)' }}>
              Your feed after setup
            </p>
            <div className="space-y-2.5">
              {[
                { label:'Personalised stories',   value:'Daily' },
                { label:'Writers to follow',      value:'6 suggested' },
                { label:'Topics curated',         value:`${topics.size} selected` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span style={{ color:'var(--fg-3)' }}>{label}</span>
                  <span className="font-semibold" style={{ color:'var(--fg)' }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
