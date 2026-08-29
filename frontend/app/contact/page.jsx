'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageShell   from '@/app/components/PageShell';
import Reveal      from '@/app/components/ui/Reveal';
import Blob        from '@/app/components/ui/Blob';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import { staggerSlow, fadeUp } from '@/app/lib/motion';
import { FaXTwitter } from 'react-icons/fa6';

const CHANNELS = [
  {
    icon: Mail,
    title:   'Email us',
    desc:    'For account issues, billing, and anything that needs a proper paper trail.',
    action:  'hello@bloggie.app',
    href:    'mailto:hello@bloggie.app',
    badge:   'Replies within 24 h',
  },
  {
    icon: MessageCircle,
    title:   'Help centre',
    desc:    'Instant answers to the most common questions about writing, publishing, and your account.',
    action:  'Browse articles',
    href:    '/help',
    badge:   'Available 24 / 7',
  },
  {
    icon: FaXTwitter,
    title:   'Twitter / X',
    desc:    'Catch us at @bloggie for quick questions, feature ideas, and general chat.',
    action:  '@bloggie',
    href:    'https://x.com/bloggie',
    badge:   'Social',
  },
];

const TOPICS = [
  'Account & login',
  'Billing & plans',
  'Publishing a post',
  'Technical issue',
  'Partnership / press',
  'Feature request',
  'Other',
];

export default function ContactPage() {
  const [form,    setForm]    = useState({ name: '', email: '', topic: '', message: '' });
  const [errors,  setErrors]  = useState({});
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name    = 'Name is required.';
    if (!form.email.includes('@'))     e.email   = 'Enter a valid email.';
    if (!form.topic)                   e.topic   = 'Please choose a topic.';
    if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate network
    setLoading(false);
    setSent(true);
  };

  const Field = ({ id, label, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--fg-2)' }}>{label}</label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-xs" style={{ color: '#ef4444' }}>{error}</motion.p>
      )}
    </div>
  );

  const inputStyle = (hasError) => ({
    background:  'var(--bg-input)',
    color:       'var(--fg)',
    borderColor: hasError ? '#ef4444' : 'var(--border-input)',
    outline:     'none',
  });

  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-20 px-5">
        <Blob className="w-[460px] h-[460px] -top-24 -left-20"   style={{ background: 'var(--accent)', opacity: 0.09 }} />
        <Blob className="w-[340px] h-[340px] bottom-0 -right-16" style={{ background: 'var(--accent)', opacity: 0.06 }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3"
               style={{ color: 'var(--accent)' }}>Contact</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              We're here to help.
            </h1>
            <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--fg-2)' }}>
              Pick the channel that works best for you, or fill in the form below and we'll get back to you as fast as we can.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Channels ── */}
      <section className="pb-20 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }} variants={staggerSlow}
            className="grid sm:grid-cols-3 gap-5">
            {CHANNELS.map(({ icon: Icon, title, desc, action, href, badge }) => (
              <motion.a key={title} variants={fadeUp} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.07)' }}
                className="group flex flex-col p-7 rounded-2xl border transition-shadow"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                     style={{ background: 'var(--accent-dim)' }}>
                  <Icon size={20} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                </div>
                <span className="text-[10px] font-semibold tracking-widest uppercase mb-3 px-2 py-0.5 rounded-full self-start"
                      style={{ background: 'var(--bg-hover)', color: 'var(--fg-3)' }}>{badge}</span>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>{title}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--fg-3)' }}>{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                      style={{ color: 'var(--accent)' }}>
                  {action} <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="pb-28 px-5 border-t pt-20" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-2xl mx-auto">
          <Reveal className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Send us a message
            </h2>
            <p className="text-sm" style={{ color: 'var(--fg-3)' }}>
              We read every message and reply within one business day.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-16 px-8 rounded-2xl border"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Message sent!</h3>
                <p className="text-sm max-w-xs" style={{ color: 'var(--fg-3)' }}>
                  We'll get back to you at <strong style={{ color: 'var(--fg-2)' }}>{form.email}</strong> within one business day.
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} noValidate
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field id="name" label="Name" error={errors.name}>
                    <input id="name" type="text" value={form.name} placeholder="Your name"
                      onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      className="h-11 px-4 rounded-xl text-sm border"
                      style={inputStyle(errors.name)} />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <input id="email" type="email" value={form.email} placeholder="your@email.com"
                      onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                      className="h-11 px-4 rounded-xl text-sm border"
                      style={inputStyle(errors.email)} />
                  </Field>
                </div>

                <Field id="topic" label="Topic" error={errors.topic}>
                  <select id="topic" value={form.topic}
                    onChange={e => { setForm(p => ({ ...p, topic: e.target.value })); setErrors(p => ({ ...p, topic: '' })); }}
                    className="h-11 px-4 rounded-xl text-sm border"
                    style={inputStyle(errors.topic)}>
                    <option value="">Select a topic…</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>

                <Field id="message" label="Message" error={errors.message}>
                  <textarea id="message" rows={5} value={form.message} placeholder="How can we help?"
                    onChange={e => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: '' })); }}
                    className="px-4 py-3 rounded-xl text-sm border resize-none"
                    style={inputStyle(errors.message)} />
                </Field>

                <MagneticBtn type="submit"
                  className="self-start inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold text-white cursor-pointer"
                  style={{ background: 'var(--accent)' }}>
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                  ) : (
                    <> Send message <ArrowRight size={14} strokeWidth={2.5} /> </>
                  )}
                </MagneticBtn>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}
