'use client';

/**
 * /settings — Profile, Account, Notifications, Appearance tabs.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Bell, Palette, Save, Camera, AlertCircle,
  Check, Eye, EyeOff, Trash2, LogOut, ChevronRight, SlidersHorizontal,
} from 'lucide-react';

import AuthLayout    from '@/app/components/AuthLayout';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

// ─── Shared field ─────────────────────────────────────────────────────────────
function Field({ label, type='text', value, onChange, placeholder, hint, error, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color:'var(--fg-2)' }}>{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full h-11 px-4 rounded-xl text-sm border outline-none transition-all"
          style={{
            background:   'var(--bg-input)',
            color:        'var(--fg)',
            borderColor:  error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border-input)',
            boxShadow:    error ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? '0 0 0 3px var(--accent-dim)' : 'none',
            paddingRight: suffix ? '44px' : '16px',
          }} />
        {suffix && <div className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center">{suffix}</div>}
      </div>
      {hint  && !error && <p className="text-xs" style={{ color:'var(--fg-4)' }}>{hint}</p>}
      {error && <p className="flex items-center gap-1.5 text-xs" style={{ color:'#ef4444' }}><AlertCircle size={11}/>{error}</p>}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b last:border-0"
         style={{ borderColor:'var(--border)' }}>
      <div>
        <p className="text-sm font-medium" style={{ color:'var(--fg)' }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color:'var(--fg-4)' }}>{desc}</p>}
      </div>
      <motion.button onClick={() => onChange(!checked)}
        className="relative w-10 h-6 rounded-full transition-colors"
        style={{ background: checked ? 'var(--accent)' : 'var(--border-2)' }}
        aria-checked={checked} role="switch">
        <motion.span
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type:'spring', stiffness:500, damping:30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
      </motion.button>
    </div>
  );
}

// ─── Save toast ───────────────────────────────────────────────────────────────
function SaveToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:20 }} transition={{ duration:0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 h-11 px-5 rounded-2xl border shadow-2xl"
          style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
          <Check size={15} style={{ color:'#22c55e' }} />
          <span className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Changes saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TABS = [
  { id:'profile',       label:'Profile',        icon: User               },
  { id:'account',       label:'Account',        icon: Lock               },
  { id:'notifications', label:'Notifications',  icon: Bell               },
  { id:'appearance',    label:'Appearance',     icon: Palette            },
  { id:'preferences',   label:'Preferences',    icon: SlidersHorizontal  },
];

export default function SettingsPage() {
  const [tab,     setTab]    = useState('profile');
  const [saved,   setSaved]  = useState(false);
  const [showPw,  setShowPw] = useState(false);

  // Profile fields
  const [name,     setName]    = useState('Sadiq Dev');
  const [username, setUsername]= useState('sadiqdev1');
  const [bio,      setBio]     = useState('');
  const [website,  setWebsite] = useState('');
  const [location, setLocation]= useState('');

  // Notif toggles
  const [notifs, setNotifs] = useState({
    likes:     true,
    comments:  true,
    follows:   true,
    digest:    true,
    marketing: false,
  });
  const toggleNotif = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }));

  // Appearance
  const [accentColor, setAccentColor] = useState('#f97316');
  const ACCENT_PRESETS = ['#f97316','#8b5cf6','#3b82f6','#10b981','#ef4444','#f59e0b','#ec4899'];

  // Preferences
  const [theme, setTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [fontSize, setFontSize] = useState('Default');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const applyTheme = (t) => {
    setTheme(t);
    if (t === 'dark')  document.documentElement.classList.add('dark');
    if (t === 'light') document.documentElement.classList.remove('dark');
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark ? document.documentElement.classList.add('dark')
                  : document.documentElement.classList.remove('dark');
    }
  };

  const save = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <ScrollProgress />
      <AuthLayout>
      <SaveToast show={saved} />
        <div className="max-w-4xl mx-auto px-5 py-10">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color:'var(--fg-3)' }}>Manage your account and preferences.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar tabs */}
            <aside className="md:w-52 shrink-0">
              <nav className="flex md:flex-col gap-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setTab(id)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full"
                    style={{
                      background: tab===id ? 'var(--accent-dim)' : 'transparent',
                      color:      tab===id ? 'var(--accent)'     : 'var(--fg-3)',
                    }}>
                    <Icon size={15} strokeWidth={2} />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Panel */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>

                  {/* ── Profile ── */}
                  {tab === 'profile' && (
                    <div className="p-6 space-y-6">
                      <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor:'var(--border)' }}>
                        <div className="relative">
                          <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                               style={{ background:'var(--accent)' }}>SD</div>
                          <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2"
                            style={{ background:'var(--bg-card)', borderColor:'var(--bg)', color:'var(--fg-3)' }}>
                            <Camera size={12} strokeWidth={2} />
                          </motion.button>
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Profile photo</p>
                          <p className="text-xs" style={{ color:'var(--fg-3)' }}>JPG, PNG or GIF. Max 5MB.</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Full name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
                        <Field label="Username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" hint="bloggie.io/@username" />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1.5" style={{ color:'var(--fg-2)' }}>Bio</label>
                        <textarea value={bio} onChange={e=>setBio(e.target.value)}
                          placeholder="Tell the world a little about yourself…" rows={3}
                          maxLength={280}
                          className="w-full px-4 py-3 rounded-xl text-sm border resize-none outline-none transition-all"
                          style={{ background:'var(--bg-input)', borderColor:'var(--border-input)', color:'var(--fg)' }} />
                        <p className="text-xs text-right mt-1" style={{ color:'var(--fg-4)' }}>{bio.length}/280</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Website" value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yoursite.com" />
                        <Field label="Location" value={location} onChange={e=>setLocation(e.target.value)} placeholder="City, Country" />
                      </div>
                    </div>
                  )}

                  {/* ── Account ── */}
                  {tab === 'account' && (
                    <div className="p-6 space-y-6">
                      <Field label="Email address" type="email" value="sadiqdev1@github.com"
                        onChange={()=>{}} hint="Used for sign-in and notifications." />
                      <div className="space-y-4">
                        <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Change password</p>
                        <Field label="Current password" type={showPw?'text':'password'} value="" onChange={()=>{}} placeholder="••••••••"
                          suffix={<button type="button" onClick={()=>setShowPw(s=>!s)} style={{ color:'var(--fg-4)' }}>
                            {showPw ? <EyeOff size={15} strokeWidth={2}/> : <Eye size={15} strokeWidth={2}/>}
                          </button>} />
                        <Field label="New password"      type="password" value="" onChange={()=>{}} placeholder="••••••••" />
                        <Field label="Confirm password"  type="password" value="" onChange={()=>{}} placeholder="••••••••" />
                      </div>
                      <div className="pt-4 border-t space-y-3" style={{ borderColor:'var(--border)' }}>
                        <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>Danger zone</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium border"
                            style={{ borderColor:'#ef4444', color:'#ef4444', background:'rgba(239,68,68,0.06)' }}>
                            <Trash2 size={13} strokeWidth={2} /> Delete account
                          </button>
                          <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium border"
                            style={{ borderColor:'var(--border)', color:'var(--fg-3)', background:'var(--bg)' }}>
                            <LogOut size={13} strokeWidth={2} /> Sign out everywhere
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Notifications ── */}
                  {tab === 'notifications' && (
                    <div className="p-6">
                      <p className="text-sm font-semibold mb-4" style={{ color:'var(--fg)' }}>Email notifications</p>
                      <div className="mb-6">
                        {[
                          { key:'likes',     label:'Likes',     desc:'When someone likes your post'           },
                          { key:'comments',  label:'Comments',  desc:'When someone comments on your post'     },
                          { key:'follows',   label:'New followers', desc:'When someone follows you'           },
                          { key:'digest',    label:'Weekly digest', desc:'Best stories from your feed, Fridays' },
                          { key:'marketing', label:'Updates & tips',desc:'Product updates and writing tips'   },
                        ].map(({ key, label, desc }) => (
                          <Toggle key={key} checked={notifs[key]} onChange={() => toggleNotif(key)}
                            label={label} desc={desc} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Appearance ── */}
                  {tab === 'appearance' && (
                    <div className="p-6 space-y-6">
                      <div>
                        <p className="text-sm font-semibold mb-3" style={{ color:'var(--fg)' }}>Accent colour</p>
                        <div className="flex items-center gap-2.5">
                          {ACCENT_PRESETS.map(c => (
                            <motion.button key={c}
                              whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}
                              onClick={() => setAccentColor(c)}
                              className="w-8 h-8 rounded-full relative"
                              style={{ background: c }}>
                              {accentColor === c && (
                                <motion.span
                                  initial={{ scale:0 }} animate={{ scale:1 }}
                                  className="absolute inset-0 flex items-center justify-center">
                                  <Check size={12} strokeWidth={3} style={{ color:'#fff' }} />
                                </motion.span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                        <p className="text-xs mt-2" style={{ color:'var(--fg-4)' }}>Applied to buttons, links and highlights across the site.</p>
                      </div>
                      <div className="pt-4 border-t" style={{ borderColor:'var(--border)' }}>
                        <p className="text-sm font-semibold mb-3" style={{ color:'var(--fg)' }}>Font size</p>
                        <div className="flex items-center gap-2">
                          {['Small','Default','Large'].map(s => (
                            <button key={s}
                              className="h-8 px-4 rounded-lg text-xs font-medium border transition-colors"
                              style={{ background: s==='Default' ? 'var(--accent-dim)' : 'var(--bg)',
                                       color:      s==='Default' ? 'var(--accent)'     : 'var(--fg-3)',
                                       borderColor:s==='Default' ? 'var(--accent-glow)':'var(--border)' }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Preferences ── */}
                  {tab === 'preferences' && (
                    <div className="p-6 space-y-8">
                      {/* Theme */}
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color:'var(--fg)' }}>Theme</p>
                        <p className="text-xs mb-4" style={{ color:'var(--fg-3)' }}>Choose how Bloggie looks for you.</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id:'light',  label:'Light',  preview:'☀️' },
                            { id:'dark',   label:'Dark',   preview:'🌙' },
                            { id:'system', label:'System', preview:'💻' },
                          ].map(({ id, label, preview }) => (
                            <motion.button key={id}
                              whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                              onClick={() => applyTheme(id)}
                              className="flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all"
                              style={{
                                background:  theme===id ? 'var(--accent-dim)' : 'var(--bg)',
                                borderColor: theme===id ? 'var(--accent)'     : 'var(--border)',
                                color:       theme===id ? 'var(--accent)'     : 'var(--fg-2)',
                              }}>
                              <span className="text-2xl">{preview}</span>
                              {label}
                              {theme===id && <Check size={12} strokeWidth={3} style={{ color:'var(--accent)' }} />}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Font size */}
                      <div className="border-t pt-6" style={{ borderColor:'var(--border)' }}>
                        <p className="text-sm font-semibold mb-1" style={{ color:'var(--fg)' }}>Reading font size</p>
                        <p className="text-xs mb-4" style={{ color:'var(--fg-3)' }}>Affects post body text only.</p>
                        <div className="flex items-center gap-2">
                          {['Small','Default','Large','Extra large'].map(s => (
                            <button key={s} onClick={() => setFontSize(s)}
                              className="h-8 px-3 rounded-lg text-xs font-medium border cursor-pointer transition-all"
                              style={{
                                background:  fontSize===s ? 'var(--accent-dim)' : 'var(--bg)',
                                color:       fontSize===s ? 'var(--accent)'     : 'var(--fg-3)',
                                borderColor: fontSize===s ? 'var(--accent-glow)':'var(--border)',
                              }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Motion + density */}
                      <div className="border-t pt-6 space-y-0" style={{ borderColor:'var(--border)' }}>
                        <p className="text-sm font-semibold mb-4" style={{ color:'var(--fg)' }}>Accessibility & display</p>
                        <Toggle checked={reducedMotion} onChange={setReducedMotion}
                          label="Reduce motion" desc="Minimise animations and transitions" />
                        <Toggle checked={compactMode} onChange={setCompactMode}
                          label="Compact feed" desc="Show more posts with less whitespace" />
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <div className="px-6 py-4 border-t flex justify-end"
                       style={{ borderColor:'var(--border)', background:'var(--bg)' }}>
                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={save}
                      className="flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold text-white"
                      style={{ background:'var(--accent)' }}>
                      <Save size={14} strokeWidth={2} /> Save changes
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
