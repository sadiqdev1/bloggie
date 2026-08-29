'use client';

/**
 * /[username] — Author profile page
 * Cover photo with parallax, avatar, stats, tab switcher (Posts / About / Followers),
 * post grid, follow CTA, social links.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Link2, ArrowRight,
  Heart, BookOpen, UserPlus, Check, MoreHorizontal,
  Bookmark, Clock, Eye,
} from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { FaGithub   } from 'react-icons/fa6';
import Link      from 'next/link';
import NextImage from 'next/image';

import AuthNavbar    from '@/app/components/AuthNavbar';
import AuthMobileNav from '@/app/components/AuthMobileNav';
import Footer        from '@/app/components/Footer';
import Reveal        from '@/app/components/ui/Reveal';
import ScrollProgress from '@/app/components/ui/ScrollProgress';
import { stagger, fadeUp } from '@/app/lib/motion';

// ─── Mock author data ─────────────────────────────────────────────────────────
const AUTHOR = {
  name:        'Sofia Reyes',
  username:    'sofiareyes',
  initials:    'SR',
  color:       '#f97316',
  role:        'Product designer & writer',
  bio:         'I write about design systems, typography, and the invisible craft behind great interfaces. Previously at Figma and Linear. Based in Lagos, Nigeria.',
  location:    'Lagos, Nigeria',
  website:     'https://sofiareyes.design',
  twitter:     '@sofiareyes',
  github:      'sofiareyes',
  joined:      'March 2025',
  cover:       'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1400&q=80',
  coverBlur:   'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH',
  stats: {
    posts:      28,
    followers:  '3.4k',
    following:  142,
    totalReads: '84k',
    totalHearts:'12.6k',
  },
};

const AUTHOR_POSTS = [
  { slug:'negative-space-ui', tag:'Design', readTime:'5 min', title:'The art of negative space in UI', excerpt:'Less is more — how emptiness shapes user attention and guides intent.', hearts:'318', reads:'4.2k', accent:'#f97316', cover:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==', publishedAt:'Aug 12, 2026' },
  { slug:'design-tokens-2026', tag:'Design', readTime:'7 min', title:'Design tokens in 2026: the definitive guide', excerpt:'How the industry finally agreed on a standard — and what it means for your system.', hearts:'524', reads:'7.1k', accent:'#f97316', cover:'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAACQoI/8QAIRAAAQQCAgMBAAAAAAAAAAAAAQIDBBEFBhIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Al0eS2bZcUZ+5UalXzFCipZacUjI3LiOQTyNoPoBqXCdmqpJlU8pW7/Z', publishedAt:'Jul 29, 2026' },
  { slug:'typography-for-ui',  tag:'Design', readTime:'6 min', title:'Typography is 95% of design', excerpt:'A deep dive into why choosing the right typeface is the most important design decision you make.', hearts:'891', reads:'11.2k', accent:'#f97316', cover:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==', publishedAt:'Jul 14, 2026' },
  { slug:'figma-variables',    tag:'UI/UX',  readTime:'5 min', title:'Figma variables: six months later', excerpt:'I shipped a real design system with Figma variables. Here is what I learned.', hearts:'433', reads:'5.9k', accent:'#8b5cf6', cover:'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==', publishedAt:'Jun 30, 2026' },
  { slug:'micro-interactions',  tag:'Design', readTime:'4 min', title:'Micro-interactions that feel alive', excerpt:'The tiny moments that make users smile — and how to build them without overdoing it.', hearts:'712', reads:'9.3k', accent:'#f97316', cover:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==', publishedAt:'Jun 18, 2026' },
  { slug:'design-critique',     tag:'Design', readTime:'9 min', title:'How to run a design critique that actually works', excerpt:'Most design reviews are theatre. Here is a framework that produces real decisions.', hearts:'1.1k', reads:'14.7k', accent:'#f97316', cover:'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=75', blur:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYH/8QAIBAAAQMEAgMAAAAAAAAAAAAAAQIDBAUREiFBYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCs2rYXV5LnGdTl7lcJM8zqBfIPR8ASAP/Z', publishedAt:'Jun 2, 2026' },
];

const TABS = ['Posts', 'About', 'Followers'];

// ─── Post card ────────────────────────────────────────────────────────────────
function ProfilePostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -4 }}
      className="flex flex-col rounded-2xl border overflow-hidden"
      style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
      <Link href={`/post/${post.slug}`} className="contents">
        <div className="relative h-44 overflow-hidden">
          <NextImage src={post.cover} alt={post.title} fill
            sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            placeholder="blur" blurDataURL={post.blur} />
          <div className="absolute inset-0"
               style={{ background:'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)' }} />
          <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
                style={{ background:'rgba(0,0,0,0.4)', color:'#fff' }}>{post.tag}</span>
          <span className="absolute bottom-3 right-3 text-[10px] text-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full"
                style={{ background:'rgba(0,0,0,0.3)' }}>{post.readTime} read</span>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="text-sm font-semibold leading-snug mb-1.5" style={{ color:'var(--fg)' }}>{post.title}</h3>
          <p className="text-xs leading-relaxed flex-1 mb-3" style={{ color:'var(--fg-3)' }}>{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs" style={{ color:'var(--fg-4)' }}>
            <span>{post.publishedAt}</span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1"><Heart size={10} />{post.hearts}</span>
              <span className="flex items-center gap-1"><Eye size={10} />{post.reads}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-4">
      <span className="text-xl font-bold tabular-nums"
            style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
        {value}
      </span>
      <span className="text-xs" style={{ color:'var(--fg-4)' }}>{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AuthorPage({ params }) {
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');
  const [coverBlur, setCoverBlur] = useState(0); // 0–12px driven by scroll
  const coverRef = useRef(null);

  // Scroll-driven blur on the cover image (no movement, just blur)
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      // blur increases 0→10px over first 200px of scroll
      const blur = Math.min(10, (scrolled / 200) * 10);
      setCoverBlur(blur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FOLLOWERS = [
    { name:'James Okafor',  initials:'JO', color:'#8b5cf6', role:'Tech writer'       },
    { name:'Priya Nair',    initials:'PN', color:'#10b981', role:'Lifestyle creator'  },
    { name:'Marcus Tan',    initials:'MT', color:'#3b82f6', role:'Productivity writer'},
    { name:'Lena Fischer',  initials:'LF', color:'#f59e0b', role:'Startup founder'   },
  ];

  return (
    <>
      <ScrollProgress />
      <AuthNavbar />
      <AuthMobileNav />

      <main className="pt-14 pb-16 md:pb-0 min-h-screen" style={{ background:'var(--bg)' }}>

        {/* ── Cover — static image, scroll-driven blur ── */}
        <div className="relative overflow-hidden" style={{ height:'clamp(200px,32vh,340px)' }} ref={coverRef}>
          <NextImage src={AUTHOR.cover} alt="Cover photo" fill priority
            sizes="100vw" className="object-cover"
            placeholder="blur" blurDataURL={AUTHOR.coverBlur}
            style={{ filter: `blur(${coverBlur}px)`, transform:'scale(1.04)', transition:'filter 0.05s linear' }} />
          <div className="absolute inset-0"
               style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)' }} />
        </div>

        {/* ── Profile header ── */}
        <div className="px-5 md:px-10 lg:px-20 max-w-5xl mx-auto">

          {/* Avatar row — overlaps cover */}
          <div className="flex items-end justify-between -mt-12 mb-5 relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-24 rounded-3xl border-4 flex items-center justify-center text-3xl font-bold text-white shadow-2xl"
              style={{ background: AUTHOR.color, borderColor: 'var(--bg)' }}>
              {AUTHOR.initials}
            </motion.div>

            {/* Follow + more */}
            <div className="flex items-center gap-2 mb-1">
              <motion.button
                onClick={() => setFollowing(f => !f)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                className="h-10 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer"
                style={{
                  background: following ? 'var(--bg-card)' : 'var(--accent)',
                  color:      following ? 'var(--fg-2)'   : '#fff',
                  border:     `1px solid ${following ? 'var(--border)' : 'var(--accent)'}`,
                }}>
                {following
                  ? <><Check size={13} strokeWidth={2.5} /> Following</>
                  : <><UserPlus size={13} strokeWidth={2.5} /> Follow</>}
              </motion.button>
              <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center border cursor-pointer"
                style={{ borderColor:'var(--border)', color:'var(--fg-3)', background:'var(--bg-card)' }}>
                <MoreHorizontal size={16} strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          {/* Name + bio */}
          <Reveal>
            <h1 className="text-2xl font-bold tracking-tight mb-0.5"
                style={{ fontFamily:'var(--font-bricolage),sans-serif', color:'var(--fg)' }}>
              {AUTHOR.name}
            </h1>
            <p className="text-sm font-medium mb-2" style={{ color:'var(--fg-3)' }}>@{AUTHOR.username}</p>
            <p className="text-sm leading-relaxed max-w-lg mb-4" style={{ color:'var(--fg-2)' }}>
              {AUTHOR.bio}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5 text-sm" style={{ color:'var(--fg-4)' }}>
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {AUTHOR.location}</span>
              <a href={AUTHOR.website} target="_blank" rel="noreferrer"
                 className="flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]">
                <Link2 size={13} /> sofiareyes.design
              </a>
              <a href={`https://x.com/${AUTHOR.twitter}`} target="_blank" rel="noreferrer"
                 className="flex items-center gap-1.5 transition-colors hover:text-[var(--accent)]">
                <FaXTwitter size={13} />  {AUTHOR.twitter}
              </a>
              <span>Joined {AUTHOR.joined}</span>
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal>
            <div className="flex items-center gap-1 mb-8 py-4 border-y overflow-x-auto"
                 style={{ borderColor:'var(--border)', scrollbarWidth:'none' }}>
              <Stat value={AUTHOR.stats.posts}       label="Posts"       />
              <div className="w-px h-8" style={{ background:'var(--border)' }} />
              <Stat value={AUTHOR.stats.followers}   label="Followers"   />
              <div className="w-px h-8" style={{ background:'var(--border)' }} />
              <Stat value={AUTHOR.stats.following}   label="Following"   />
              <div className="w-px h-8" style={{ background:'var(--border)' }} />
              <Stat value={AUTHOR.stats.totalReads}  label="Total reads" />
              <div className="w-px h-8" style={{ background:'var(--border)' }} />
              <Stat value={AUTHOR.stats.totalHearts} label="Total hearts" />
            </div>
          </Reveal>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-8">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="relative px-5 py-2.5 text-sm font-medium rounded-xl transition-colors"
                style={{ color: activeTab === tab ? 'var(--accent)' : 'var(--fg-3)', background: activeTab === tab ? 'var(--accent-dim)' : 'transparent' }}>
                {tab}
                {activeTab === tab && (
                  <motion.span layoutId="profile-tab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background:'var(--accent-dim)', zIndex:-1 }}
                    transition={{ type:'spring', stiffness:400, damping:30 }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">

            {/* Posts */}
            {activeTab === 'Posts' && (
              <motion.div key="posts"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}>
                <motion.div initial="hidden" animate="visible" variants={stagger}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                  {AUTHOR_POSTS.map(post => <ProfilePostCard key={post.slug} post={post} />)}
                </motion.div>
              </motion.div>
            )}

            {/* About */}
            {activeTab === 'About' && (
              <motion.div key="about"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
                className="max-w-xl mb-16 space-y-6">
                {/* Bio */}
                <div className="p-6 rounded-2xl border" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>About</p>
                  <p className="text-sm leading-relaxed" style={{ color:'var(--fg-2)' }}>{AUTHOR.bio}</p>
                </div>
                {/* Contact / links */}
                <div className="p-6 rounded-2xl border space-y-3" style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:'var(--accent)' }}>Links</p>
                  {[
                    { icon: Link2,      label:'Website',  value:'sofiareyes.design', href: AUTHOR.website    },
                    { icon: FaXTwitter, label:'Twitter',  value: AUTHOR.twitter,     href:`https://x.com/sofiareyes` },
                    { icon: FaGithub,   label:'GitHub',   value: AUTHOR.github,      href:`https://github.com/${AUTHOR.github}` },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                       className="flex items-center gap-3 text-sm transition-colors hover:text-[var(--accent)]"
                       style={{ color:'var(--fg-2)' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
                           style={{ background:'var(--bg)', borderColor:'var(--border)' }}>
                        <Icon size={13} strokeWidth={2} style={{ color:'var(--fg-3)' }} />
                      </div>
                      <div>
                        <span className="text-xs" style={{ color:'var(--fg-4)' }}>{label}</span>
                        <p className="text-sm font-medium" style={{ color:'var(--fg)' }}>{value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Followers */}
            {activeTab === 'Followers' && (
              <motion.div key="followers"
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }} transition={{ duration:0.25 }}
                className="max-w-xl mb-16 space-y-3">
                {FOLLOWERS.map(({ name, initials, color, role }, i) => (
                  <motion.div key={name}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between p-4 rounded-2xl border"
                    style={{ background:'var(--bg-card)', borderColor:'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                           style={{ background: color }}>{initials}</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color:'var(--fg)' }}>{name}</p>
                        <p className="text-xs" style={{ color:'var(--fg-4)' }}>{role}</p>
                      </div>
                    </div>
                    <Link href={`/${name.toLowerCase().replace(' ','-')}`}
                      className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color:'var(--fg-2)', borderColor:'var(--border)' }}>
                      View <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
