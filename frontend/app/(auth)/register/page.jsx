'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import NextImage   from 'next/image';
import AppLogo     from '@/app/components/AppLogo';
import MagneticBtn from '@/app/components/ui/MagneticBtn';

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ id, label, type = 'text', value, onChange, error, placeholder, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide"
             style={{ color: 'var(--fg-3)' }}>{label}</label>
      <div className="relative">
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full h-10 px-3.5 rounded-lg text-sm border outline-none transition-all"
          style={{
            background:   'var(--bg-input)', color: 'var(--fg)',
            borderColor:  error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
            boxShadow:    error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
            paddingRight: suffix ? '44px' : '14px',
          }}
        />
        {suffix && (
          <div className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center">{suffix}</div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-[11px]" style={{ color: '#ef4444' }}>
            <AlertCircle size={10} strokeWidth={2} />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars',  pass: password.length >= 8         },
    { label: 'Uppercase', pass: /[A-Z]/.test(password)       },
    { label: 'Number',    pass: /[0-9!@#$%^&*]/.test(password) },
  ];
  const score  = checks.filter(c => c.pass).length;
  const colors = ['#ef4444', '#f97316', '#22c55e'];
  if (!password) return null;
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-300"
               style={{ background: i < score ? colors[score - 1] : 'var(--border-2)' }} />
        ))}
      </div>
      <div className="flex gap-3">
        {checks.map(({ label, pass }) => (
          <span key={label} className="flex items-center gap-1 text-[10px]"
                style={{ color: pass ? '#22c55e' : 'var(--fg-4)' }}>
            <CheckCircle2 size={9} strokeWidth={2} />{label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function RegisterPage() {
  const router  = useRouter();
  const [form,    setForm]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors,  setErrors] = useState({});
  const [showPw,  setShowPw] = useState(false);
  const [loading, setLoading]= useState(false);

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name            = 'Name is required.';
    if (!form.email.includes('@'))              e.email           = 'Enter a valid email.';
    if (form.password.length < 8)               e.password        = 'Min 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/onboarding');
  };

  return (
    /* h-screen + overflow-hidden → never scrollable */
    <div className="h-screen overflow-hidden flex" style={{ background: 'var(--bg)' }}>

      {/* ── LEFT — form panel ── */}
      <div className="flex flex-col w-full items-center justify-center px-8 shrink-0 lg:w-[440px] overflow-y-auto"
           style={{ scrollbarWidth: 'none' }}>
        <div className="w-full max-w-[340px]">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }} className="mb-7">
            <AppLogo size="md" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

            <h1 className="text-2xl font-bold tracking-tight mb-0.5"
                style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
              Create your account
            </h1>
            <p className="text-sm mb-5" style={{ color: 'var(--fg-3)' }}>
              Already a writer?{' '}
              <Link href="/login" className="font-semibold hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--fg)' }}>Sign in</Link>
            </p>

            {/* Google */}
            <motion.button type="button" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
              className="flex items-center justify-center gap-2 h-10 w-full rounded-lg text-sm font-medium border mb-4 cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}>
              <GoogleIcon /> Continue with Google
            </motion.button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-[11px]" style={{ color: 'var(--fg-4)' }}>or email</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <Field id="name"  label="Full name" value={form.name}  onChange={set('name')}
                error={errors.name} placeholder="Your name" autoComplete="name" />
              <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')}
                error={errors.email} placeholder="you@email.com" autoComplete="email" />
              <div className="flex flex-col gap-1.5">
                <Field id="password" label="Password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={set('password')}
                  error={errors.password} placeholder="••••••••" autoComplete="new-password"
                  suffix={
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="flex items-center justify-center cursor-pointer" style={{ color: 'var(--fg-4)' }}>
                      {showPw ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
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
                className="w-full h-10 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer mt-1"
                style={{ background: 'var(--accent)' }}>
                {loading
                  ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 rounded-full"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  : <> Create account <ArrowRight size={14} strokeWidth={2.5} /> </>
                }
              </MagneticBtn>
            </form>

            <p className="mt-4 text-[10px] text-center leading-relaxed" style={{ color: 'var(--fg-4)' }}>
              By continuing you agree to our{' '}
              <Link href="/terms"   className="underline underline-offset-1 hover:text-[var(--accent)]">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline underline-offset-1 hover:text-[var(--accent)]">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT — full-bleed editorial photo ── */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <NextImage
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1400&q=85"
          alt="Person writing at a desk"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 60vw, 0px"
          priority
        />

        {/* Dark gradient left→right so text is readable */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 100%)' }} />

        {/* Bottom overlay with quote */}
        <div className="absolute inset-x-0 bottom-0 p-10 pt-32"
             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-white text-xl font-bold leading-snug mb-4 max-w-sm"
               style={{ fontFamily: 'var(--font-bricolage),sans-serif' }}>
              "Write not to impress, but to express — and the right readers will find you."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                   style={{ background: '#f97316' }}>SR</div>
              <div>
                <p className="text-white text-sm font-semibold leading-none mb-0.5">Sofia Reyes</p>
                <p className="text-white/55 text-xs">Designer & writer · 3.4k followers</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top stats */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5 }}
          className="absolute top-10 left-10 flex items-center gap-8">
          {[['12K+', 'Writers'], ['80K+', 'Stories'], ['2M+', 'Readers']].map(([v, l]) => (
            <div key={l}>
              <p className="text-white text-xl font-bold leading-none"
                 style={{ fontFamily: 'var(--font-bricolage),sans-serif' }}>{v}</p>
              <p className="text-white/55 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
