'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import AppLogo     from '@/app/components/AppLogo';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import Blob        from '@/app/components/ui/Blob';

// ─── Reusable field ───────────────────────────────────────────────────────────
function Field({ id, label, type = 'text', value, onChange, error, placeholder, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--fg-2)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all"
          style={{
            background:  'var(--bg-input)',
            color:       'var(--fg)',
            borderColor: error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
            boxShadow:   error ? '0 0 0 3px rgba(239,68,68,0.12)'
                        : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
            paddingRight: suffix ? '48px' : '16px',
          }}
        />
        {suffix && (
          <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">
            {suffix}
          </div>
        )}
      </div>
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

// ─── Social button ────────────────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }) {
  return (
    <motion.button type="button" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 h-11 w-full rounded-xl text-sm font-medium border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
      style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
      {icon}
      {label}
    </motion.button>
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

export default function LoginPage() {
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [errors,  setErrors]  = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const set = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email    = 'Enter a valid email address.';
    if (form.password.length < 8)  e.password = 'Password must be at least 8 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen flex" style={{ background:'var(--bg)' }}>
      {/* ── Left panel — form ── */}
      <div className="flex flex-col flex-1 min-h-screen items-center px-6 py-10 lg:max-w-[480px]">
        {/* Logo */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.4 }} className="w-full max-w-sm">
          <AppLogo size="md" />
        </motion.div>

        <div className="flex-1 flex flex-col justify-center w-full max-w-sm py-10">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done"
                initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="flex flex-col items-center text-center py-10">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ delay:0.1, type:'spring', stiffness:400, damping:20 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background:'rgba(34,197,94,0.12)' }}>
                  <Check size={28} style={{ color:'#22c55e' }} />
                </motion.div>
                <h2 className="text-xl font-bold mb-2" style={{ color:'var(--fg)' }}>Welcome back!</h2>
                <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>Redirecting you to your feed…</p>
                <Link href="/explore"
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold text-white"
                  style={{ background:'var(--accent)' }}>
                  Go to explore <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}>

                {/* Heading */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-1.5"
                      style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                    Sign in
                  </h1>
                  <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                    New here?{' '}
                    <Link href="/register" className="font-semibold underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
                          style={{ color:'var(--fg-2)' }}>Create a free account</Link>
                  </p>
                </div>

                {/* Social */}
                <div className="flex flex-col gap-2.5 mb-6">
                  <SocialBtn icon={<GoogleIcon />} label="Continue with Google" />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
                  <span className="text-xs font-medium" style={{ color:'var(--fg-4)' }}>or continue with email</span>
                  <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')}
                    error={errors.email} placeholder="your@email.com" autoComplete="email" />

                  <Field id="password" label="Password"
                    type={showPw ? 'text' : 'password'}
                    value={form.password} onChange={set('password')}
                    error={errors.password} placeholder="••••••••" autoComplete="current-password"
                    suffix={
                      <button type="button" onClick={() => setShowPw(s=>!s)}
                        className="flex items-center justify-center transition-colors hover:text-[var(--fg)]"
                        style={{ color:'var(--fg-4)' }}>
                        {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
                      </button>
                    } />

                  <div className="flex justify-end -mt-1">
                    <Link href="/forgot-password" className="text-xs font-medium transition-colors hover:text-[var(--accent)]"
                          style={{ color:'var(--fg-3)' }}>
                      Forgot password?
                    </Link>
                  </div>

                  <MagneticBtn type="submit"
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer mt-1"
                    style={{ background:'var(--accent)' }}>
                    {loading ? (
                      <motion.span animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
                        className="w-4 h-4 border-2 rounded-full" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />
                    ) : (
                      <> Sign in <ArrowRight size={15} strokeWidth={2.5} /> </>
                    )}
                  </MagneticBtn>
                </form>

                <p className="mt-6 text-xs text-center" style={{ color:'var(--fg-4)' }}>
                  By signing in you agree to our{' '}
                  <Link href="/terms"   className="underline underline-offset-1">Terms</Link> and{' '}
                  <Link href="/privacy" className="underline underline-offset-1">Privacy Policy</Link>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right panel — visual ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden"
           style={{ background:'var(--bg-card)' }}>
        <Blob className="w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background:'var(--accent)', opacity:0.10 }} />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          {/* Testimonial card */}
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.3, ease:[0.16,1,0.3,1] }}
            className="max-w-sm w-full p-8 rounded-2xl border shadow-2xl"
            style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
            <div className="flex gap-0.5 mb-5">
              {Array.from({length:5}).map((_,i) => (
                <motion.svg key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.5+i*0.08 }}
                  width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </motion.svg>
              ))}
            </div>
            <p className="text-base leading-relaxed mb-6 font-medium" style={{ color:'var(--fg)' }}>
              "Bloggie is the only platform where I actually enjoy writing. The editor disappears and the ideas just flow."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                   style={{ background:'#f97316' }}>SR</div>
              <div>
                <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Sofia Reyes</p>
                <p className="text-xs" style={{ color:'var(--fg-3)' }}>Designer & writer · 3.4k followers</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6, duration:0.5 }}
            className="flex items-center gap-8 mt-10">
            {[['12K+','Writers'],['80K+','Stories'],['2M+','Monthly readers']].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="text-2xl font-bold tabular-nums" style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--accent)' }}>{v}</p>
                <p className="text-xs mt-0.5" style={{ color:'var(--fg-4)' }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
