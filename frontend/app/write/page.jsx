'use client';

/**
 * /write — Rich post editor page.
 * Toolbar, title/subtitle/cover upload, body editor, tag picker, publish flow.
 * Full $1.5m design — no external editor lib, pure contentEditable + Framer.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link2, Image as ImageIcon,
  List, ListOrdered, Quote, Code, Heading2, AlignLeft, AlignCenter,
  Eye, ChevronDown, X, Plus, Check, ArrowLeft, Upload, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import AuthNavbar    from '@/app/components/AuthNavbar';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

// ─── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, onClick, active }) {
  return (
    <motion.button
      type="button" title={label} onClick={onClick}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
      style={{
        background: active ? 'var(--accent-dim)' : 'transparent',
        color:      active ? 'var(--accent)'     : 'var(--fg-3)',
      }}>
      <Icon size={14} strokeWidth={2} />
    </motion.button>
  );
}

const TAGS_LIST = ['Design','Engineering','Life','Business','Culture','Productivity','Health','Science','Finance','Philosophy'];
const PUBLISH_STEPS = ['Draft', 'Preview', 'Publish'];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WritePage() {
  const [title,       setTitle]      = useState('');
  const [subtitle,    setSubtitle]   = useState('');
  const [tags,        setTags]       = useState([]);
  const [tagOpen,     setTagOpen]    = useState(false);
  const [publishStep, setPublishStep]= useState(0); // 0=editing, 1=preview modal, 2=published
  const [wordCount,   setWordCount]  = useState(0);
  const [showToolbar, setShowToolbar]= useState(false);
  const [coverImg,    setCoverImg]   = useState('');
  const bodyRef    = useRef(null);
  const fileRef    = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => {
      const text = el.innerText || '';
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setShowToolbar(document.getSelection()?.toString().length > 0);
    };
    el.addEventListener('input', update);
    el.addEventListener('mouseup', update);
    el.addEventListener('keyup', update);
    return () => { el.removeEventListener('input', update); el.removeEventListener('mouseup', update); el.removeEventListener('keyup', update); };
  }, []);

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    bodyRef.current?.focus();
  };

  const toggleTag = (t) =>
    setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : ts.length < 5 ? [...ts, t] : ts);

  const readTime = Math.max(1, Math.round(wordCount / 200));

  const TOOLBAR_BTNS = [
    { icon: Bold,         label:'Bold',         cmd:'bold'          },
    { icon: Italic,       label:'Italic',       cmd:'italic'        },
    { icon: UnderlineIcon,label:'Underline',    cmd:'underline'     },
    { icon: Strikethrough,label:'Strikethrough',cmd:'strikethrough' },
    { icon: Heading2,     label:'Heading',      cmd:'formatBlock',  val:'h2' },
    { icon: Quote,        label:'Quote',        cmd:'formatBlock',  val:'blockquote' },
    { icon: Code,         label:'Code',         cmd:'formatBlock',  val:'pre' },
    { icon: List,         label:'Bullet list',  cmd:'insertUnorderedList'    },
    { icon: ListOrdered,  label:'Numbered list',cmd:'insertOrderedList'      },
  ];

  return (
    <>
      <ScrollProgress />
      <AuthNavbar />

      <div className="pt-16 min-h-screen flex flex-col" style={{ background:'var(--bg)' }}>

        {/* ── Editor header bar ── */}
        <div className="sticky top-16 z-30 border-b px-5 md:px-10 py-2.5 flex items-center justify-between gap-4"
             style={{ background:'var(--bg)', borderColor:'var(--border)', backdropFilter:'blur(24px)' }}>
          <div className="flex items-center gap-3">
            <Link href="/explore">
              <motion.span whileHover={{ scale:1.06, x:-2 }} whileTap={{ scale:0.94 }}
                className="flex items-center gap-1.5 text-sm font-medium cursor-pointer transition-colors hover:text-[var(--accent)]"
                style={{ color:'var(--fg-3)' }}>
                <ArrowLeft size={14} strokeWidth={2} /> Exit
              </motion.span>
            </Link>
            <div className="w-px h-4" style={{ background:'var(--border)' }} />
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg"
                  style={{ background:'var(--bg-card)', color:'var(--fg-4)', border:'1px solid var(--border)' }}>
              Draft
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color:'var(--fg-4)' }}>
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => setPublishStep(1)}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg-card)' }}>
              <Eye size={14} strokeWidth={2} /> Preview
            </motion.button>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => setPublishStep(2)}
              className="flex items-center gap-1.5 h-9 px-5 rounded-xl text-sm font-semibold text-white"
              style={{ background: title.trim() ? 'var(--accent)' : 'var(--fg-4)', cursor: title.trim() ? 'pointer' : 'not-allowed' }}>
              Publish
            </motion.button>
          </div>
        </div>

        {/* ── Editor body ── */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-0 py-10 pb-32">

          {/* Cover image upload */}
          <div className="mb-6">
            {coverImg ? (
              <div className="relative h-48 rounded-2xl overflow-hidden group mb-4">
                <img src={coverImg} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                     style={{ background:'rgba(0,0,0,0.45)' }}>
                  <button onClick={() => setCoverImg('')}
                    className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-semibold text-white border border-white/30">
                    <X size={12} /> Remove cover
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderColor:'var(--border)', color:'var(--fg-3)', borderStyle:'dashed', background:'var(--bg-card)' }}>
                <Upload size={14} strokeWidth={2} /> Add cover image
              </motion.button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setCoverImg(URL.createObjectURL(file));
              }} />
          </div>

          {/* Title */}
          <textarea
            value={title}
            onChange={e => { setTitle(e.target.value); e.target.style.height='auto'; e.target.style.height=e.target.scrollHeight+'px'; }}
            placeholder="Your title…"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none leading-tight mb-3 overflow-hidden"
            style={{
              fontSize:'clamp(26px,4vw,42px)',
              fontWeight:800,
              fontFamily:'var(--font-bricolage),sans-serif',
              color:'var(--fg)',
              minHeight:'56px',
            }}
          />

          {/* Subtitle */}
          <textarea
            value={subtitle}
            onChange={e => { setSubtitle(e.target.value); e.target.style.height='auto'; e.target.style.height=e.target.scrollHeight+'px'; }}
            placeholder="Add a subtitle (optional)…"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none leading-relaxed mb-8 overflow-hidden"
            style={{ fontSize:'18px', fontWeight:400, color:'var(--fg-3)', lineHeight:'1.6' }}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
            <span className="text-xs" style={{ color:'var(--fg-4)' }}>Start writing below</span>
            <div className="flex-1 h-px" style={{ background:'var(--border)' }} />
          </div>

          {/* Floating format toolbar */}
          <AnimatePresence>
            {showToolbar && (
              <motion.div
                initial={{ opacity:0, y:8, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1    }}
                exit={{   opacity:0, y:8, scale:0.95  }}
                transition={{ duration:0.15 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 px-2 py-1.5 rounded-2xl border shadow-2xl"
                style={{ background:'var(--bg-card)', borderColor:'var(--border)', backdropFilter:'blur(20px)' }}>
                {TOOLBAR_BTNS.map(({ icon, label, cmd, val }) => (
                  <ToolBtn key={label} icon={icon} label={label} onClick={() => exec(cmd, val)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Inline static toolbar */}
          <div className="flex items-center gap-0.5 mb-4 flex-wrap">
            {TOOLBAR_BTNS.map(({ icon, label, cmd, val }) => (
              <ToolBtn key={label} icon={icon} label={label} onClick={() => exec(cmd, val)} />
            ))}
            <div className="w-px h-6 mx-1" style={{ background:'var(--border)' }} />
            <ToolBtn icon={AlignLeft}   label="Left"   onClick={() => exec('justifyLeft'   )} />
            <ToolBtn icon={AlignCenter} label="Center" onClick={() => exec('justifyCenter' )} />
          </div>

          {/* Body */}
          <div
            ref={bodyRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Tell your story…"
            className="min-h-[400px] outline-none leading-[1.9] text-[17px] prose-editor"
            style={{ color:'var(--fg-2)' }}
          />
        </div>

        {/* ── Tags bar (sticky bottom) ── */}
        <div className="sticky bottom-0 border-t px-5 md:px-10 py-3 flex items-center gap-3 z-30"
             style={{ background:'var(--bg)', borderColor:'var(--border)', backdropFilter:'blur(24px)' }}>
          <span className="text-xs font-medium shrink-0" style={{ color:'var(--fg-3)' }}>Tags:</span>
          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
            {tags.map(t => (
              <span key={t}
                className="flex items-center gap-1 h-6 px-2.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{ background:'var(--accent-dim)', color:'var(--accent)', border:'1px solid var(--accent-glow)' }}
                onClick={() => toggleTag(t)}>
                {t} <X size={9} strokeWidth={3} />
              </span>
            ))}
            {tags.length < 5 && (
              <div className="relative">
                <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
                  onClick={() => setTagOpen(o=>!o)}
                  className="flex items-center gap-1 h-6 px-2.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor:'var(--border)', color:'var(--fg-3)', background:'var(--bg-card)', borderStyle:'dashed' }}>
                  <Plus size={10} strokeWidth={2.5} /> Add tag
                </motion.button>
                <AnimatePresence>
                  {tagOpen && (
                    <motion.div
                      initial={{ opacity:0, y:8, scale:0.96 }}
                      animate={{ opacity:1, y:0, scale:1    }}
                      exit={{   opacity:0, y:8, scale:0.96  }}
                      transition={{ duration:0.15 }}
                      className="absolute bottom-9 left-0 w-56 rounded-2xl border shadow-2xl p-2 z-50"
                      style={{ background:'var(--bg-dropdown)', borderColor:'var(--border)' }}>
                      <div className="grid grid-cols-2 gap-1">
                        {TAGS_LIST.map(t => (
                          <button key={t} onClick={() => { toggleTag(t); setTagOpen(false); }}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
                            style={{ color: tags.includes(t) ? 'var(--accent)' : 'var(--fg-2)', background: tags.includes(t) ? 'var(--accent-dim)' : 'transparent' }}>
                            {t}
                            {tags.includes(t) && <Check size={10} strokeWidth={2.5} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <span className="text-xs shrink-0" style={{ color:'var(--fg-4)' }}>{wordCount} words · {readTime} min</span>
        </div>
      </div>

      {/* ── Publish modal ── */}
      <AnimatePresence>
        {publishStep >= 1 && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-5"
            style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}
            onClick={() => setPublishStep(0)}>
            <motion.div
              initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }}
              exit={{ scale:0.94, y:20 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
              className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}
              onClick={e => e.stopPropagation()}>

              {publishStep === 1 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-1" style={{ color:'var(--fg)' }}>Ready to publish?</h2>
                  <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>Review your post before it goes live.</p>
                  <div className="space-y-4 mb-8">
                    {[
                      { label:'Title',    value: title    || '(no title)'    },
                      { label:'Subtitle', value: subtitle || '(no subtitle)' },
                      { label:'Tags',     value: tags.length ? tags.join(', ') : '(no tags)' },
                      { label:'Length',   value: `${wordCount} words · ${readTime} min read` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-3 text-sm">
                        <span className="w-20 shrink-0 font-medium" style={{ color:'var(--fg-4)' }}>{label}</span>
                        <span style={{ color:'var(--fg-2)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setPublishStep(0)}
                      className="flex-1 h-11 rounded-xl text-sm font-semibold border"
                      style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg)' }}>
                      Edit more
                    </button>
                    <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      onClick={() => setPublishStep(2)}
                      className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
                      style={{ background:'var(--accent)' }}>
                      Publish now
                    </motion.button>
                  </div>
                </div>
              )}

              {publishStep === 2 && (
                <div className="p-10 flex flex-col items-center text-center">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ delay:0.1, type:'spring', stiffness:400, damping:18 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background:'rgba(34,197,94,0.12)' }}>
                    <Sparkles size={28} style={{ color:'#22c55e' }} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2"
                      style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
                    Your post is live!
                  </h2>
                  <p className="text-sm mb-6" style={{ color:'var(--fg-3)' }}>
                    "{title || 'Your post'}" is now published and visible to everyone.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/explore" onClick={() => setPublishStep(0)}
                      className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-semibold border"
                      style={{ borderColor:'var(--border)', color:'var(--fg-2)', background:'var(--bg)' }}>
                      Back to feed
                    </Link>
                    <Link href="/post/negative-space-ui"
                      className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-semibold text-white"
                      style={{ background:'var(--accent)' }}>
                      View post <ArrowLeft size={13} strokeWidth={2.5} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: var(--fg-4);
          pointer-events: none;
        }
        .prose-editor h2 { font-size:1.5rem; font-weight:700; margin:2rem 0 0.75rem; color:var(--fg); }
        .prose-editor blockquote { border-left:4px solid var(--accent); padding-left:1rem; font-style:italic; margin:1.5rem 0; color:var(--fg-2); }
        .prose-editor pre { background:var(--bg-card); border:1px solid var(--border); border-radius:0.75rem; padding:1rem; font-family:monospace; font-size:14px; overflow-x:auto; margin:1.5rem 0; }
        .prose-editor ul { list-style:disc; padding-left:1.5rem; margin:0.75rem 0; }
        .prose-editor ol { list-style:decimal; padding-left:1.5rem; margin:0.75rem 0; }
        .prose-editor a  { color:var(--accent); text-decoration:underline; }
      `}</style>
    </>
  );
}
