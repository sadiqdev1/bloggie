'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppLogo     from '@/app/components/AppLogo';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import Blob        from '@/app/components/ui/Blob';

// ─── Shared field ────────────────────────────────────────────────────────────
function Field({ id, label, type='text', value, onChange, error, placeholder, autoComplete, suffix, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color:'var(--fg-2)' }}>{label}</label>
      <div className="relative">
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all"
          style={{
            background:   'var(--bg-input)',
            color:        'var(--fg)',
            borderColor:  error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
            boxShadow:    error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
            paddingRight: suffix ? '48px' : '16px',
          }} />
        {suffix && (
          <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">{suffix}</div>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs" style={{ color:'var(--fg-4)' }}>{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="flex items-center gap-1.5 text-xs" style={{ color:'#ef4444' }}>
            <AlertCircle size={11} strokeWidth={2} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Password strength meter ──────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label:'8+ characters',             pass: password.length >= 8         },
    { label:'Uppercase letter',           pass: /[A-Z]/.test(password)       },
    { label:'Number or symbol',           pass: /[0-9!@#$%^&*]/.test(password) },
  ];
  const score  = checks.filter(c => c.pass).length;
  const colors = ['#ef4444','#f97316','#22c55e'];
  const labels = ['Weak','Fair','Strong'];

  if (!password) return null;

  return (
    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
      exit={{ opacity:0, height:0 }} transition={{ duration:0.2 }} className="space-y-2">
      {/* Bar */}
      <div className="flex gap-1.5">
        {Array.from({length:3}).map((_,i) => (
          <motion.div key={i}
            initial={{ scaleX:0 }} animate={{ scaleX: i < score ? 1 : 0 }}
            transition={{ duration:0.3, delay: i*0.06 }}
            className="h-1 flex-1 rounded-full origin-left"
            style={{ background: i < score ? colors[score-1] : 'var(--border-2)' }} />
        ))}
      </div>
      {/* Checklist */}
      <div className="flex gap-3 flex-wrap">
        {checks.map(({ label, pass }) => (
          <span key={label} className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: pass ? '#22c55e' : 'var(--fg-4)' }}>
            <CheckCircle2 size={11} strokeWidth={2} style={{ color: pass ? '#22c55e' : 'var(--fg-4)' }} />
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({length: total}).map((_,i) => (
        <motion.div key={i}
          animate={{
            width:      i === current ? '24px' : '8px',
            background: i <= current ? 'var(--accent)' : 'var(--border-2)',
          }}
          transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
          className="h-1.5 rounded-full" />
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const [step,    setStep]    = useState(0); // 0=account, 1=profile
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [errors,  setErrors]  = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]:'' }));
  };

  const validateStep0 = () => {
    const e = {};
    if (!form.name.trim())                       e.name    = 'Name is required.';
    if (!form.email.includes('@'))               e.email   = 'Enter a valid email.';
    if (form.password.length < 8)                e.password = 'At least 8 characters required.';
    if (form.password !== form.confirmPassword)  e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleNext = (ev) => {
    ev.preventDefault();
    const e = validateStep0();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(1);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    setDone(true);
  };

  const BENEFITS = [
    'Publish unlimited posts — always free',
    'Custom profile with your own URL',
    'Grow an audience, earn followers',
    'Full data export whenever you want',
  ];

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg)' }}>
      {/* ── Left — visual ── */}
      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden"
           style={{ background:'var(--bg-card)' }}>
        <Blob className="w-[500px] h-[500px] -top-20 -left-20"
              style={{ background:'var(--accent)', opacity:0.09 }} />
        <Blob className="w-[380px] h-[380px] bottom-0 right-0"
              style={{ background:'var(--accent)', opacity:0.06 }} />

        <div className="relative z-10 flex flex-col justify-center flex-1 px-16 py-16">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.2, ease:[0.16,1,0.3,1] }}>
            <AppLogo size="lg" />
            <p className="mt-6 text-lg leading-relaxed font-medium mb-8 max-w-xs"
               style={{ color:'var(--fg-2)' }}>
              Join thousands of independent writers sharing their ideas with the world.
            </p>
            <ul className="space-y-3.5">
              {BENEFITS.map((b, i) => (
                <motion.li key={b}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.35+i*0.08, duration:0.35 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color:'var(--fg-2)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                       style={{ background:'var(--accent-dim)' }}>
                    <Check size={11} strokeWidth={2.5} style={{ color:'var(--accent)' }} />
                  </div>
                  {b}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mini post preview */}
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.55, ease:[0.16,1,0.3,1] }}
            className="mt-12 p-6 rounded-2xl border max-w-xs"
            style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                   style={{ background:'#8b5cf6' }}>JO</div>
              <div>
                <p className="text-xs font-semibold" style={{ color:'var(--fg)' }}>James Okafor</p>
                <p className="text-[10px]" style={{ color:'var(--fg-4)' }}>Just published</p>
              </div>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color:'var(--fg)' }}>
              Why I stopped using ORMs
            </p>
            <p className="text-xs leading-relaxed" style={{ color:'var(--fg-3)' }}>
              Raw SQL isn't scary. It's liberating…
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs" style={{ color:'var(--fg-4)' }}>
              <span>❤️ 702</span><span>💬 34</span><span>8 min read</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right — form ── */}
      <div className="flex flex-col flex-1 min-h-screen px-6 py-10 lg:max-w-[480px]">
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          className="flex items-center justify-between">
          <div className="lg:hidden"><AppLogo size="md" /></div>
          <div className="hidden lg:block" />
          <StepDots current={done ? 2 : step} total={3} />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-10">
          <AnimatePresence mode="wait">

            {/* ── Success ── */}
            {done && (
              <motion.div key="done"
                initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="flex flex-col items-center text-center py-8">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ delay:0.1, type:'spring', stiffness:400, damping:18 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background:'rgba(34,197,94,0.12)' }}>
                  <Check size={28} style={{ color:'#22c55e' }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2"
                    style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                  You're in, {form.name.split(' ')[0]}!
                </h2>
                <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>
                  Your account is ready. Time to write something great.
                </p>
                <Link href="/explore"
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold text-white"
                  style={{ background:'var(--accent)' }}>
                  Go to my feed <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </motion.div>
            )}

            {/* ── Step 0 ── */}
            {!done && step === 0 && (
              <motion.div key="step0" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-1.5"
                      style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                    Create your account
                  </h1>
                  <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                    Already a writer?{' '}
                    <Link href="/login" className="font-semibold underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                          style={{ color:'var(--fg-2)' }}>Sign in</Link>
                  </p>
                </div>

                {/* Google */}
                <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="flex items-center justify-center gap-2.5 h-11 w-full rounded-xl text-sm font-medium border mb-6 transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
                  <GoogleIcon /> Continue with Google
                </motion.button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
                  <span className="text-xs font-medium" style={{ color:'var(--fg-4)' }}>or with email</span>
                  <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
                </div>

                <form onSubmit={handleNext} noValidate className="flex flex-col gap-4">
                  <Field id="name" label="Full name" value={form.name} onChange={set('name')}
                    error={errors.name} placeholder="Your name" autoComplete="name" />
                  <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')}
                    error={errors.email} placeholder="your@email.com" autoComplete="email" />
                  <div className="flex flex-col gap-2">
                    <Field id="password" label="Password"
                      type={showPw ? 'text' : 'password'}
                      value={form.password} onChange={set('password')}
                      error={errors.password} placeholder="••••••••" autoComplete="new-password"
                      suffix={
                        <button type="button" onClick={() => setShowPw(s=>!s)}
                          className="flex items-center justify-center hover:text-[var(--fg)]"
                          style={{ color:'var(--fg-4)' }}>
                          {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                        </button>
                      } />
                    <AnimatePresence>
                      {form.password && <PasswordStrength password={form.password} />}
                    </AnimatePresence>
                  </div>
                  <Field id="confirmPassword" label="Confirm password"
                    type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
                    error={errors.confirmPassword} placeholder="••••••••" autoComplete="new-password" />

                  <MagneticBtn type="submit"
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer mt-1"
                    style={{ background:'var(--accent)' }}>
                    Continue <ArrowRight size={15} strokeWidth={2.5} />
                  </MagneticBtn>
                </form>

                <p className="mt-5 text-xs text-center" style={{ color:'var(--fg-4)' }}>
                  By creating an account you agree to our{' '}
                  <Link href="/terms"   className="underline underline-offset-1">Terms</Link> and{' '}
                  <Link href="/privacy" className="underline underline-offset-1">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}

            {/* ── Step 1 — interests (optional onboarding) ── */}
            {!done && step === 1 && (
              <motion.div key="step1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
                <div className="mb-8">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color:'var(--accent)' }}>
                    Step 2 of 2
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight mb-1.5"
                      style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                    What do you love?
                  </h1>
                  <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                    Pick at least 2 topics to personalise your feed. You can change this later.
                  </p>
                </div>

                <TopicPicker onDone={() => handleSubmit({ preventDefault: ()=>{} })} loading={loading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Topic picker (step 2) ────────────────────────────────────────────────────
const TOPICS = [
  { id:'design',      label:'Design',       emoji:'🎨' },
  { id:'engineering', label:'Engineering',  emoji:'⚙️' },
  { id:'life',        label:'Life',         emoji:'🌱' },
  { id:'business',    label:'Business',     emoji:'📈' },
  { id:'science',     label:'Science',      emoji:'🔬' },
  { id:'culture',     label:'Culture',      emoji:'🎭' },
  { id:'productivity',label:'Productivity', emoji:'⚡' },
  { id:'health',      label:'Health',       emoji:'💪' },
  { id:'finance',     label:'Finance',      emoji:'💰' },
  { id:'philosophy',  label:'Philosophy',   emoji:'🧠' },
];

function TopicPicker({ onDone, loading }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2.5">
        {TOPICS.map(({ id, label, emoji }, i) => {
          const active = selected.has(id);
          return (
            <motion.button key={id} type="button"
              initial={{ opacity:0, scale:0.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: i*0.04, duration:0.25 }}
              onClick={() => toggle(id)}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
              className="flex items-center gap-2.5 h-11 px-4 rounded-xl text-sm font-medium border text-left transition-all"
              style={{
                background:   active ? 'var(--accent-dim)' : 'var(--bg-card)',
                borderColor:  active ? 'var(--accent)'     : 'var(--border)',
                color:        active ? 'var(--accent)'     : 'var(--fg-2)',
              }}>
              <span>{emoji}</span>
              <span className="truncate">{label}</span>
              {active && (
                <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:'spring', stiffness:500, damping:20 }}
                  className="ml-auto shrink-0">
                  <Check size={13} strokeWidth={2.5} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <MagneticBtn type="button" onClick={onDone}
        className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        style={{
          background: selected.size >= 2 ? 'var(--accent)' : 'var(--fg-4)',
          cursor:     selected.size >= 2 ? 'pointer' : 'not-allowed',
        }}>
        {loading ? (
          <motion.span animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
            className="w-4 h-4 border-2 rounded-full" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />
        ) : (
          <> {selected.size < 2 ? `Select ${2-selected.size} more` : 'Finish & explore'} <ArrowRight size={15} strokeWidth={2.5} /> </>
        )}
      </MagneticBtn>

      <button type="button" onClick={onDone} className="text-xs text-center transition-colors hover:text-[var(--fg)]"
              style={{ color:'var(--fg-4)' }}>
        Skip for now
      </button>
    </div>
  );
}
