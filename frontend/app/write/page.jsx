'use client';

/**
 * /write — Tiptap-powered rich text editor.
 *
 * Features:
 *  • Tiptap StarterKit + Placeholder + Underline + TextAlign + Highlight + Link + CharacterCount
 *  • Bubble menu (selection toolbar) — appears on text select
 *  • Floating toolbar strip below the sticky header bar
 *  • Auto-growing title (textarea) + optional subtitle
 *  • Cover image upload with preview
 *  • Tag picker (up to 5, sticky bottom bar)
 *  • Word count + read time live display
 *  • Publish modal (review → success)
 *  • All buttons have cursor:pointer
 *  • Integrates with CSS variable design system (no hard-coded colours)
 */

import { useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit         from '@tiptap/starter-kit';
import Placeholder        from '@tiptap/extension-placeholder';
import CharacterCount     from '@tiptap/extension-character-count';
import UnderlineMark      from '@tiptap/extension-underline';
import TextAlign          from '@tiptap/extension-text-align';
import Highlight          from '@tiptap/extension-highlight';
import Link               from '@tiptap/extension-link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, Quote, Code, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Highlighter,
  Link2, Link2Off, Upload, X, Plus, Check, ArrowLeft,
  Eye, Sparkles, ChevronDown,
} from 'lucide-react';
import NextLink  from 'next/link';
import { useRouter } from 'next/navigation';
import AuthNavbar    from '@/app/components/AuthNavbar';
import AuthMobileNav from '@/app/components/AuthMobileNav';
import ScrollProgress from '@/app/components/ui/ScrollProgress';

// ─── Constants ────────────────────────────────────────────────────────────────
const TAGS_LIST = [
  'Design','Engineering','Life','Business','Culture',
  'Productivity','Health','Science','Finance','Philosophy',
];

const WORD_LIMIT = 50_000;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcReadTime(words) { return Math.max(1, Math.round(words / 200)); }

// ─── Toolbar button ───────────────────────────────────────────────────────────
function TB({ icon: Icon, label, onClick, active, size = 14 }) {
  return (
    <motion.button
      type="button"
      title={label}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.84 }}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
      style={{
        background: active ? 'var(--accent-dim)' : 'transparent',
        color:      active ? 'var(--accent)'     : 'var(--fg-3)',
      }}
    >
      <Icon size={size} strokeWidth={2} />
    </motion.button>
  );
}

function Divider() {
  return <div className="w-px h-5 mx-0.5 shrink-0" style={{ background: 'var(--border-2)' }} />;
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────
function TagChip({ label, onRemove }) {
  return (
    <span
      className="flex items-center gap-1 h-6 px-2.5 rounded-lg text-xs font-medium cursor-pointer"
      style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-glow)' }}
      onClick={onRemove}
    >
      {label} <X size={9} strokeWidth={3} />
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WritePage() {
  const router    = useRouter();
  const fileRef   = useRef(null);
  const titleRef  = useRef(null);

  const [title,        setTitle]       = useState('');
  const [subtitle,     setSubtitle]    = useState('');
  const [coverImg,     setCoverImg]    = useState('');
  const [tags,         setTags]        = useState([]);
  const [tagOpen,      setTagOpen]     = useState(false);
  const [publishStep,  setPublishStep] = useState(0); // 0=editor, 1=preview, 2=done
  const [loading,      setLoading]     = useState(false);
  const [linkUrl,      setLinkUrl]     = useState('');
  const [linkOpen,     setLinkOpen]    = useState(false);

  // ── Tiptap editor ────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false, // we use our own styled version
      }),
      Placeholder.configure({
        placeholder: 'Tell your story…',
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({ limit: WORD_LIMIT }),
      UnderlineMark,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    editorProps: {
      attributes: {
        class: 'bloggie-editor outline-none min-h-[420px]',
        spellcheck: 'true',
      },
    },
    immediatelyRender: false,
  });

  const wordCount = editor ? editor.storage.characterCount?.words() ?? 0 : 0;
  const readTime  = calcReadTime(wordCount);

  // ── Toolbar actions ──────────────────────────────────────────────────────
  const setLink = useCallback(() => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!linkUrl.trim()) return;
    editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
    setLinkUrl('');
    setLinkOpen(false);
  }, [editor, linkUrl]);

  const toggleTag = (t) =>
    setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : ts.length < 5 ? [...ts, t] : ts);

  const handleCover = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverImg(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setPublishStep(2);
  };

  // ── Toolbar strip config ─────────────────────────────────────────────────
  const toolbarGroups = [
    [
      { icon: Bold,           label:'Bold',         fn: () => editor?.chain().focus().toggleBold().run(),        active: editor?.isActive('bold')          },
      { icon: Italic,         label:'Italic',       fn: () => editor?.chain().focus().toggleItalic().run(),      active: editor?.isActive('italic')        },
      { icon: UnderlineIcon,  label:'Underline',    fn: () => editor?.chain().focus().toggleUnderline().run(),   active: editor?.isActive('underline')     },
      { icon: Strikethrough,  label:'Strike',       fn: () => editor?.chain().focus().toggleStrike().run(),      active: editor?.isActive('strike')        },
      { icon: Highlighter,    label:'Highlight',    fn: () => editor?.chain().focus().toggleHighlight().run(),   active: editor?.isActive('highlight')     },
    ],
    [
      { icon: Heading2,  label:'Heading 2', fn: () => editor?.chain().focus().toggleHeading({ level:2 }).run(), active: editor?.isActive('heading',{level:2}) },
      { icon: Heading3,  label:'Heading 3', fn: () => editor?.chain().focus().toggleHeading({ level:3 }).run(), active: editor?.isActive('heading',{level:3}) },
      { icon: Quote,     label:'Blockquote',fn: () => editor?.chain().focus().toggleBlockquote().run(),         active: editor?.isActive('blockquote')    },
      { icon: Code,      label:'Code',      fn: () => editor?.chain().focus().toggleCode().run(),               active: editor?.isActive('code')          },
    ],
    [
      { icon: List,          label:'Bullet list',  fn: () => editor?.chain().focus().toggleBulletList().run(),  active: editor?.isActive('bulletList')  },
      { icon: ListOrdered,   label:'Ordered list', fn: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
    ],
    [
      { icon: AlignLeft,   label:'Left',   fn: () => editor?.chain().focus().setTextAlign('left').run(),   active: editor?.isActive({ textAlign:'left'   }) },
      { icon: AlignCenter, label:'Center', fn: () => editor?.chain().focus().setTextAlign('center').run(), active: editor?.isActive({ textAlign:'center' }) },
      { icon: AlignRight,  label:'Right',  fn: () => editor?.chain().focus().setTextAlign('right').run(),  active: editor?.isActive({ textAlign:'right'  }) },
    ],
  ];

  return (
    <>
      <ScrollProgress />
      <AuthNavbar />

      <div className="pt-14 pb-16 md:pb-0 min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

        {/* ── Sticky editor top bar ── */}
        <div
          className="sticky top-14 z-30 border-b flex items-center justify-between gap-3 px-4 md:px-8 h-11"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          {/* Left: back + status */}
          <div className="flex items-center gap-3">
            <NextLink href="/explore">
              <motion.span
                whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.94 }}
                className="flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--fg-3)' }}
              >
                <ArrowLeft size={13} strokeWidth={2} /> Exit
              </motion.span>
            </NextLink>
            <div className="w-px h-4" style={{ background: 'var(--border-2)' }} />
            <span className="text-xs font-medium px-2 py-0.5 rounded-md"
                  style={{ background: 'var(--bg-card)', color: 'var(--fg-4)', border: '1px solid var(--border)' }}>
              Draft
            </span>
          </div>

          {/* Center: word count */}
          <p className="text-xs hidden sm:block" style={{ color: 'var(--fg-4)' }}>
            {wordCount.toLocaleString()} words · {readTime} min read
          </p>

          {/* Right: preview + publish */}
          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setPublishStep(1)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
              style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg-card)' }}
            >
              <Eye size={12} strokeWidth={2} /> Preview
            </motion.button>
            <motion.button
              type="button"
              whileHover={title.trim() ? { scale: 1.04 } : {}}
              whileTap={title.trim() ? { scale: 0.96 } : {}}
              onClick={() => title.trim() && setPublishStep(1)}
              className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-semibold text-white"
              style={{
                background: title.trim() ? 'var(--accent)' : 'var(--fg-4)',
                cursor:     title.trim() ? 'pointer'       : 'not-allowed',
              }}
            >
              Publish
            </motion.button>
          </div>
        </div>

        {/* ── Formatting toolbar ── */}
        <div
          className="sticky z-20 border-b overflow-x-auto px-4 md:px-8"
          style={{ top: '89px', background: 'var(--bg)', borderColor: 'var(--border)', scrollbarWidth: 'none' }}
        >
          <div className="flex items-center gap-0.5 py-1.5 min-w-max">
            {toolbarGroups.map((group, gi) => (
              <div key={gi} className="flex items-center gap-0.5">
                {gi > 0 && <Divider />}
                {group.map(({ icon, label, fn, active }) => (
                  <TB key={label} icon={icon} label={label} onClick={fn} active={active} />
                ))}
              </div>
            ))}

            <Divider />

            {/* Link button + inline input */}
            <div className="relative flex items-center gap-1">
              <TB
                icon={editor?.isActive('link') ? Link2Off : Link2}
                label={editor?.isActive('link') ? 'Remove link' : 'Add link'}
                onClick={() => {
                  if (editor?.isActive('link')) { editor.chain().focus().unsetLink().run(); return; }
                  setLinkOpen(o => !o);
                }}
                active={editor?.isActive('link')}
              />
              <AnimatePresence>
                {linkOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, x: -6 }}
                    animate={{ opacity: 1, scale: 1,    x: 0   }}
                    exit={{   opacity: 0, scale: 0.94,  x: -6  }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-10 left-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border shadow-xl z-50"
                    style={{ background: 'var(--bg-dropdown)', borderColor: 'var(--border)', minWidth: '240px' }}
                    onKeyDown={e => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setLinkOpen(false); }}
                  >
                    <input
                      autoFocus
                      type="url"
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      placeholder="https://…"
                      className="flex-1 text-xs outline-none bg-transparent"
                      style={{ color: 'var(--fg)' }}
                    />
                    <button type="button" onClick={setLink}
                      className="shrink-0 text-xs font-semibold cursor-pointer transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--accent)' }}>
                      Apply
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Editor canvas ── */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-5 md:px-0 py-10">

          {/* Cover image */}
          <div className="mb-8">
            {coverImg ? (
              <div className="relative h-52 rounded-2xl overflow-hidden group mb-4">
                <img src={coverImg} alt="Cover" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                >
                  <button type="button" onClick={() => setCoverImg('')}
                    className="flex items-center gap-1.5 h-8 px-4 rounded-xl text-xs font-semibold text-white border border-white/30 cursor-pointer">
                    <X size={11} strokeWidth={2.5} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <motion.button type="button"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                style={{ borderColor: 'var(--border)', borderStyle: 'dashed', color: 'var(--fg-3)', background: 'var(--bg-card)' }}
              >
                <Upload size={13} strokeWidth={2} /> Add cover image
              </motion.button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
          </div>

          {/* Title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Your title…"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none overflow-hidden leading-tight mb-3"
            style={{
              fontSize:   'clamp(26px, 4vw, 42px)',
              fontWeight: 800,
              fontFamily: 'var(--font-bricolage), sans-serif',
              color:      'var(--fg)',
              minHeight:  '56px',
            }}
          />

          {/* Subtitle */}
          <textarea
            value={subtitle}
            onChange={e => {
              setSubtitle(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Add a subtitle (optional)…"
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none overflow-hidden mb-8"
            style={{ fontSize: '18px', fontWeight: 400, color: 'var(--fg-3)', lineHeight: '1.6' }}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-[11px] tracking-widest uppercase" style={{ color: 'var(--fg-4)' }}>Story</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Tiptap bubble menu (appears on selection) */}
          {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 120 }}>
              <div
                className="flex items-center gap-0.5 px-1.5 py-1 rounded-xl border shadow-2xl"
                style={{ background: 'var(--bg-dropdown)', borderColor: 'var(--border)' }}
              >
                {[
                  { icon: Bold,          label: 'Bold',   fn: () => editor.chain().focus().toggleBold().run(),    active: editor.isActive('bold')    },
                  { icon: Italic,        label: 'Italic', fn: () => editor.chain().focus().toggleItalic().run(),  active: editor.isActive('italic')  },
                  { icon: UnderlineIcon, label: 'U',      fn: () => editor.chain().focus().toggleUnderline().run(),active: editor.isActive('underline')},
                  { icon: Highlighter,   label: 'Mark',   fn: () => editor.chain().focus().toggleHighlight().run(),active: editor.isActive('highlight')},
                  { icon: Link2,         label: 'Link',   fn: () => setLinkOpen(o=>!o),                           active: editor.isActive('link')    },
                ].map(({ icon, label, fn, active }) => (
                  <TB key={label} icon={icon} label={label} onClick={fn} active={active} size={13} />
                ))}
              </div>
            </BubbleMenu>
          )}

          {/* Editor content */}
          <EditorContent editor={editor} />
        </div>

        {/* ── Tags sticky bar ── */}
        <div
          className="sticky bottom-0 border-t flex items-center gap-3 px-4 md:px-8 py-2.5 z-30"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
        >
          <span className="text-xs font-medium shrink-0" style={{ color: 'var(--fg-3)' }}>Tags:</span>
          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
            {tags.map(t => (
              <TagChip key={t} label={t} onRemove={() => toggleTag(t)} />
            ))}
            {tags.length < 5 && (
              <div className="relative">
                <motion.button type="button"
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => setTagOpen(o => !o)}
                  className="flex items-center gap-1 h-6 px-2.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ borderColor: 'var(--border)', borderStyle: 'dashed', color: 'var(--fg-3)', background: 'var(--bg-card)' }}
                >
                  <Plus size={10} strokeWidth={2.5} /> Add tag
                </motion.button>
                <AnimatePresence>
                  {tagOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1    }}
                      exit={{   opacity: 0, y: 6, scale: 0.96  }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-9 left-0 w-52 rounded-2xl border shadow-2xl p-2 z-50"
                      style={{ background: 'var(--bg-dropdown)', borderColor: 'var(--border)' }}
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {TAGS_LIST.map(t => (
                          <button key={t} type="button"
                            onClick={() => { toggleTag(t); if (!tags.includes(t) && tags.length >= 4) setTagOpen(false); }}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer hover:bg-[var(--bg-hover)]"
                            style={{
                              color:      tags.includes(t) ? 'var(--accent)' : 'var(--fg-2)',
                              background: tags.includes(t) ? 'var(--accent-dim)' : 'transparent',
                            }}
                          >
                            {t} {tags.includes(t) && <Check size={10} strokeWidth={2.5} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <span className="text-xs shrink-0 hidden sm:block" style={{ color: 'var(--fg-4)' }}>
            {wordCount} / {WORD_LIMIT.toLocaleString()}
          </span>
        </div>
      </div>

      <AuthMobileNav />

      {/* ── Publish modal ── */}
      <AnimatePresence>
        {publishStep >= 1 && (
          <motion.div
            key="publish-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-5"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPublishStep(0)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 20 }} transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
              className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Step 1 — review */}
              {publishStep === 1 && (
                <div className="p-8">
                  <h2 className="text-xl font-bold mb-1"
                      style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
                    Ready to publish?
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--fg-3)' }}>
                    Your post will be live and visible to everyone.
                  </p>
                  <div className="space-y-3.5 mb-8">
                    {[
                      { label: 'Title',    value: title    || '(no title)'    },
                      { label: 'Subtitle', value: subtitle || '(none)'        },
                      { label: 'Tags',     value: tags.length ? tags.join(', ') : '(none)' },
                      { label: 'Length',   value: `${wordCount} words · ${readTime} min read` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-3 text-sm">
                        <span className="w-20 shrink-0 font-medium" style={{ color: 'var(--fg-4)' }}>{label}</span>
                        <span style={{ color: 'var(--fg-2)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setPublishStep(0)}
                      className="flex-1 h-11 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg)' }}>
                      Keep editing
                    </button>
                    <motion.button type="button"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handlePublish}
                      className="flex-1 h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
                      style={{ background: 'var(--accent)' }}
                    >
                      {loading
                        ? <motion.span animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 rounded-full"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                        : 'Publish now'
                      }
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Step 2 — success */}
              {publishStep === 2 && (
                <div className="p-10 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 380, damping: 18 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: 'rgba(34,197,94,0.12)' }}
                  >
                    <Sparkles size={28} style={{ color: '#22c55e' }} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2"
                      style={{ fontFamily: 'var(--font-bricolage),sans-serif', color: 'var(--fg)' }}>
                    You're live!
                  </h2>
                  <p className="text-sm mb-8" style={{ color: 'var(--fg-3)' }}>
                    "{title || 'Your post'}" is now published.
                  </p>
                  <div className="flex gap-3">
                    <NextLink href="/explore" onClick={() => setPublishStep(0)}
                      className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--fg-2)', background: 'var(--bg)' }}>
                      Back to feed
                    </NextLink>
                    <NextLink href="/post/negative-space-ui"
                      className="flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                      style={{ background: 'var(--accent)' }}>
                      View post →
                    </NextLink>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tiptap + editor styles ── */}
      <style>{`
        /* Placeholder */
        .bloggie-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--fg-4);
          pointer-events: none;
          height: 0;
        }
        /* Typography */
        .bloggie-editor {
          font-size: 17px;
          line-height: 1.9;
          color: var(--fg-2);
          font-family: var(--font-inter), system-ui, sans-serif;
        }
        .bloggie-editor h2 {
          font-family: var(--font-bricolage), sans-serif;
          font-size: 1.65rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--fg);
          margin: 2.25rem 0 0.875rem;
        }
        .bloggie-editor h3 {
          font-family: var(--font-bricolage), sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--fg);
          margin: 1.75rem 0 0.625rem;
        }
        .bloggie-editor p { margin: 0 0 1.1rem; }
        .bloggie-editor strong { color: var(--fg); font-weight: 700; }
        .bloggie-editor em { font-style: italic; }
        .bloggie-editor u { text-decoration: underline; text-underline-offset: 3px; }
        .bloggie-editor s { text-decoration: line-through; }
        .bloggie-editor mark {
          background: var(--accent-dim);
          color: var(--accent);
          border-radius: 3px;
          padding: 0 3px;
        }
        .bloggie-editor a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
        }
        .bloggie-editor a:hover { opacity: 0.8; }
        .bloggie-editor blockquote {
          border-left: 4px solid var(--accent);
          padding: 0.5rem 0 0.5rem 1.25rem;
          font-style: italic;
          color: var(--fg-2);
          margin: 1.75rem 0;
        }
        .bloggie-editor code {
          font-family: var(--font-jetbrains), monospace;
          font-size: 0.9em;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 5px;
          padding: 2px 6px;
          color: var(--accent);
        }
        .bloggie-editor pre {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          font-family: var(--font-jetbrains), monospace;
          font-size: 14px;
          overflow-x: auto;
          margin: 1.75rem 0;
          line-height: 1.7;
        }
        .bloggie-editor pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: var(--fg);
        }
        .bloggie-editor ul, .bloggie-editor ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0 1.25rem;
        }
        .bloggie-editor li { margin: 0.3rem 0; }
        .bloggie-editor ul { list-style: disc; }
        .bloggie-editor ol { list-style: decimal; }
        .bloggie-editor hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2.5rem 0;
        }
        /* Selection */
        .bloggie-editor ::selection {
          background: var(--accent);
          color: #fff;
        }
        /* Focus ring off (we handle it manually) */
        .tiptap:focus { outline: none; }
      `}</style>
    </>
  );
}
