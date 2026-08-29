'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageSquare, Bug, Lightbulb, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Navbar  from '@/app/components/Navbar';
import Footer  from '@/app/components/Footer';
import Reveal  from '@/app/components/ui/Reveal';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

const TOPICS = [
  { id:'general',   icon: MessageSquare, label:'General enquiry' },
  { id:'support',   icon: Mail,          label:'Account support' },
  { id:'bug',       icon: Bug,           label:'Report a bug'    },
  { id:'feedback',  icon: Lightbulb,     label:'Product feedback'},
];

function Field({ label, type='text', value, onChange, placeholder, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color:'var(--fg-2)' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        className="w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all"
        style={{
          background:  'var(--bg-input)',
          color:       'var(--fg)',
          borderColor: error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
          boxShadow:   error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
        }} />
      {error && <p className="flex items-center gap-1.5 text-xs" style={{ color:'#ef4444' }}><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const [topic,   setTopic]   = useState('general');
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim())          e.name    = 'Name is required.';
    if (!email.includes('@'))  e.email   = 'Enter a valid email.';
    if (message.trim().length < 20) e.message = 'Please write at least 20 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
  };

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16 min-h-screen" style={{ background:'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-5 py-20">

          {/* Header */}
          <Reveal className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-3"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              Get in touch
            </h1>
            <p className="text-base" style={{ color:'var(--fg-3)' }}>
              We reply to every message. Usually within a few hours.
            </p>
          </Reveal>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done"
                initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                className="flex flex-col items-center text-center py-16 rounded-2xl border"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:'spring', stiffness:400, damping:18 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background:'rgba(34,197,94,0.12)' }}>
                  <Check size={28} style={{ color:'#22c55e' }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color:'var(--fg)' }}>Message sent!</h2>
                <p className="text-sm" style={{ color:'var(--fg-3)' }}>
                  Thanks for reaching out. We'll get back to you at {email}.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form"
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                className="rounded-2xl border overflow-hidden"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

                {/* Topic selector */}
                <div className="p-6 border-b" style={{ borderColor:'var(--border)' }}>
                  <p className="text-sm font-medium mb-3" style={{ color:'var(--fg-2)' }}>What's this about?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TOPICS.map(({ id, icon: Icon, label }) => (
                      <motion.button key={id} type="button"
                        onClick={() => setTopic(id)}
                        whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                        className="flex flex-col items-center gap-2 p-3.5 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          background:  topic===id ? 'var(--accent-dim)' : 'var(--bg)',
                          borderColor: topic===id ? 'var(--accent)'     : 'var(--border)',
                          color:       topic===id ? 'var(--accent)'     : 'var(--fg-3)',
                        }}>
                        <Icon size={16} strokeWidth={1.8} />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Your name"      value={name}  onChange={e=>{ setName(e.target.value);  setErrors(p=>({...p,name:''}));    }} placeholder="Sofia Reyes" error={errors.name}    />
                    <Field label="Email address"  type="email" value={email} onChange={e=>{ setEmail(e.target.value); setErrors(p=>({...p,email:''}));   }} placeholder="you@email.com" error={errors.email}   />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color:'var(--fg-2)' }}>Message</label>
                    <textarea value={message} onChange={e=>{ setMessage(e.target.value); setErrors(p=>({...p,message:''})); }}
                      placeholder="Tell us what's on your mind…" rows={5}
                      className="w-full px-4 py-3 rounded-xl text-sm border resize-none outline-none transition-all"
                      style={{
                        background:  'var(--bg-input)',
                        color:       'var(--fg)',
                        borderColor: errors.message ? '#ef4444' : message ? 'var(--accent)' : 'var(--border-input)',
                        boxShadow:   errors.message ? '0 0 0 3px rgba(239,68,68,0.12)' : message ? '0 0 0 3px var(--accent-dim)' : 'none',
                      }} />
                    {errors.message && <p className="flex items-center gap-1.5 text-xs" style={{ color:'#ef4444' }}><AlertCircle size={11}/>{errors.message}</p>}
                  </div>
                  <motion.button type="submit"
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                    style={{ background:'var(--accent)' }}>
                    {loading
                      ? <motion.span animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }}
                          className="w-4 h-4 border-2 rounded-full" style={{ borderColor:'rgba(255,255,255,0.3)', borderTopColor:'#fff' }} />
                      : <> Send message <ArrowRight size={15} strokeWidth={2.5} /> </>
                    }
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
