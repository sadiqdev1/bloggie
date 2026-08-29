'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mail, Check, AlertCircle, RefreshCw } from 'lucide-react';
import AppLogo     from '@/app/components/AppLogo';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import Blob        from '@/app/components/ui/Blob';

// ─── Stages ───────────────────────────────────────────────────────────────────
// 'email'   → enter email
// 'sent'    → check your inbox
// 'expired' → link expired, resend

const TIPS = [
  'Check your spam or junk folder.',
  'Make sure you typed the right email.',
  'The link expires in 30 minutes.',
];

export default function ForgotPasswordPage() {
  const [stage,    setStage]    = useState('email');
  const [email,    setEmail]    = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [focused,  setFocused]  = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [resending,setResending]= useState(false);

  const startCooldown = () => {
    setResendIn(60);
    const iv = setInterval(() => {
      setResendIn(n => { if (n <= 1) { clearInterval(iv); return 0; } return n - 1; });
    }, 1000);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStage('sent');
    startCooldown();
  };

  const handleResend = async () => {
    if (resendIn > 0 || resending) return;
    setResending(true);
    await new Promise(r => setTimeout(r, 800));
    setResending(false);
    startCooldown();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
         style={{ background:'var(--bg)' }}>
      <Blob className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background:'var(--accent)', opacity:0.07 }} />

      {/* Top-left logo */}
      <div className="absolute top-8 left-8">
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
          <AppLogo size="md" />
        </motion.div>
      </div>

      {/* Back link */}
      <div className="absolute top-8 right-8">
        <Link href="/login"
          className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--fg)]"
          style={{ color:'var(--fg-3)' }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to sign in
        </Link>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:24, scale:0.97 }}
        animate={{ opacity:1, y:0,  scale:1    }}
        transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
        className="relative z-10 w-full max-w-md"
      >
        <AnimatePresence mode="wait">

          {/* ── Stage: email ── */}
          {stage === 'email' && (
            <motion.div key="email"
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
              className="flex flex-col p-8 rounded-2xl border"
              style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

              {/* Icon */}
              <motion.div initial={{ scale:0, rotate:-15 }} animate={{ scale:1, rotate:0 }}
                transition={{ delay:0.1, type:'spring', stiffness:380, damping:20 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ background:'var(--accent-dim)' }}>
                <Mail size={24} strokeWidth={1.8} style={{ color:'var(--accent)' }} />
              </motion.div>

              <h1 className="text-2xl font-bold tracking-tight mb-2"
                  style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                Forgot your password?
              </h1>
              <p className="text-sm leading-relaxed mb-6" style={{ color:'var(--fg-3)' }}>
                No worries — it happens to everyone. Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium" style={{ color:'var(--fg-2)' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email" type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="your@email.com" autoComplete="email"
                      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                      className="w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all"
                      style={{
                        background:  'var(--bg-input)',
                        color:       'var(--fg)',
                        borderColor: error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
                        boxShadow:   error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
                      }} />
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

                <MagneticBtn type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background:'var(--accent)' }}>
                  {loading ? (
                    <motion.span animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
                      className="w-4 h-4 border-2 rounded-full" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />
                  ) : (
                    <> Send reset link <ArrowRight size={15} strokeWidth={2.5} /> </>
                  )}
                </MagneticBtn>
              </form>

              <p className="mt-5 text-xs text-center" style={{ color:'var(--fg-4)' }}>
                Remembered it?{' '}
                <Link href="/login" className="underline underline-offset-1 transition-colors hover:text-[var(--accent)]"
                      style={{ color:'var(--fg-3)' }}>Sign in</Link>
              </p>
            </motion.div>
          )}

          {/* ── Stage: sent ── */}
          {stage === 'sent' && (
            <motion.div key="sent"
              initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.96 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
              className="flex flex-col items-center p-8 rounded-2xl border text-center"
              style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

              {/* Animated envelope */}
              <motion.div
                initial={{ scale:0, rotate:-10 }}
                animate={{ scale:1, rotate:0 }}
                transition={{ delay:0.1, type:'spring', stiffness:380, damping:20 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                style={{ background:'var(--accent-dim)' }}>
                <Mail size={26} strokeWidth={1.8} style={{ color:'var(--accent)' }} />
                {/* Success dot */}
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ delay:0.4, type:'spring', stiffness:500, damping:20 }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background:'#22c55e' }}>
                  <Check size={12} strokeWidth={3} style={{ color:'#fff' }} />
                </motion.div>
              </motion.div>

              <h2 className="text-2xl font-bold tracking-tight mb-2"
                  style={{ fontFamily:'var(--font-bricolage), sans-serif', color:'var(--fg)' }}>
                Check your inbox
              </h2>
              <p className="text-sm leading-relaxed mb-1" style={{ color:'var(--fg-3)' }}>
                We've sent a password reset link to
              </p>
              <p className="text-sm font-semibold mb-6 break-all" style={{ color:'var(--fg)' }}>
                {email}
              </p>

              {/* Tips */}
              <div className="w-full p-4 rounded-xl mb-6 text-left"
                   style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                <p className="text-xs font-semibold mb-2.5" style={{ color:'var(--fg-3)' }}>Didn't get it?</p>
                <ul className="space-y-1.5">
                  {TIPS.map(tip => (
                    <li key={tip} className="flex items-start gap-2 text-xs" style={{ color:'var(--fg-3)' }}>
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background:'var(--accent)' }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resend */}
              <motion.button type="button" onClick={handleResend}
                whileHover={resendIn === 0 ? { scale:1.03 } : {}}
                whileTap={resendIn === 0 ? { scale:0.97 } : {}}
                className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold mb-4 w-full justify-center border transition-all"
                style={{
                  borderColor: 'var(--border)',
                  color:       resendIn > 0 ? 'var(--fg-4)' : 'var(--fg-2)',
                  background:  'var(--bg)',
                  cursor:      resendIn > 0 ? 'not-allowed' : 'pointer',
                  opacity:     resendIn > 0 ? 0.6 : 1,
                }}>
                {resending
                  ? <motion.span animate={{ rotate:360 }} transition={{ duration:0.6, repeat:Infinity, ease:'linear' }}>
                      <RefreshCw size={14} strokeWidth={2} />
                    </motion.span>
                  : <RefreshCw size={14} strokeWidth={2} />
                }
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend email'}
              </motion.button>

              <Link href="/login"
                className="text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]"
                style={{ color:'var(--fg-3)' }}>
                <ArrowLeft size={13} strokeWidth={2} /> Back to sign in
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
