'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Globe, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PageShell  from '@/app/components/PageShell';
import Reveal     from '@/app/components/ui/Reveal';
import Blob       from '@/app/components/ui/Blob';
import MagneticBtn from '@/app/components/ui/MagneticBtn';
import { staggerSlow, fadeUp } from '@/app/lib/motion';

const VALUES = [
  { icon: Heart,  title: 'Writers first',     desc: 'Every product decision starts with one question: does this make writing better? Monetisation never comes at the cost of the craft.'  },
  { icon: Globe,  title: 'Open by default',   desc: 'Your content belongs to you. No lock-in, no paywalls between you and your readers, no algorithm deciding who sees your work.'         },
  { icon: Users,  title: 'Real community',    desc: 'We believe in genuine connection — not follower counts. Comments, reactions, and follows are tools for conversation, not vanity metrics.' },
  { icon: Zap,    title: 'Speed & simplicity', desc: 'Complexity is the enemy of creativity. We obsess over performance and simplicity so nothing gets between you and your next idea.'       },
];

const TEAM = [
  { name: 'Amara Osei',      role: 'Co-founder & CEO',     initials: 'AO', color: '#ef4444' },
  { name: 'Lena Fischer',    role: 'Co-founder & CTO',     initials: 'LF', color: '#8b5cf6' },
  { name: 'Marcus Tan',      role: 'Head of Design',       initials: 'MT', color: '#f97316' },
  { name: 'Sofia Delgado',   role: 'Head of Engineering',  initials: 'SD', color: '#10b981' },
  { name: 'James Okafor',    role: 'Growth',               initials: 'JO', color: '#3b82f6' },
  { name: 'Priya Nair',      role: 'Community',            initials: 'PN', color: '#ec4899' },
];

const MILESTONES = [
  { year: '2022', event: 'Bloggie founded in Lagos with a simple idea: writers deserve better tools.' },
  { year: '2023', event: 'Launched in private beta. 500 writers signed up in the first 48 hours.'   },
  { year: '2024', event: 'Opened to the public. Crossed 10,000 active writers within 3 months.'      },
  { year: '2025', event: 'Launched the editor v2, communities, and the Bloggie mobile app.'           },
  { year: 'Now',  event: '12,000+ writers. 80,000+ stories. Growing every single day.'               },
];

export default function AboutPage() {
  return (
    <PageShell>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-28 px-5">
        <Blob className="w-[500px] h-[500px] -top-32 -left-20" style={{ background: 'var(--accent)', opacity: 0.10 }} />
        <Blob className="w-[380px] h-[380px] bottom-0 -right-16" style={{ background: 'var(--accent)', opacity: 0.07 }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent-glow)', color: 'var(--accent)' }}
            >
              Our story
            </motion.span>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}
            >
              Built for people who<br />
              <span style={{ color: 'var(--accent)' }}>have something to say.</span>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-2)' }}>
              Bloggie started as a frustration. Great writers were being silenced by algorithms,
              paywalled from their own readers, and squeezed into formats that didn't fit their voice.
              We decided to build the platform we wished existed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y py-14 px-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '12K+',  label: 'Writers'        },
            { value: '80K+',  label: 'Stories'        },
            { value: '120+',  label: 'Countries'      },
            { value: '2026',  label: 'Founded'        },
          ].map(({ value, label }) => (
            <Reveal key={label}>
              <p className="text-4xl font-bold mb-1 tabular-nums"
                 style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--accent)' }}>
                {value}
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--fg-3)' }}>{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-28 px-5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>
              Our mission
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Give every writer a home on the web.
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--fg-2)' }}>
              We believe the internet is better when more people write on it. Long-form thinking,
              personal essays, technical deep-dives, creative fiction — all of it matters, and all of
              it deserves a beautiful, permanent home.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--fg-2)' }}>
              Bloggie is our answer to the question: what if a publishing platform was built entirely
              around the writer's experience, not the advertiser's?
            </p>
          </Reveal>

          {/* Visual quote card */}
          <Reveal delay={0.15}>
            <motion.div
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border relative overflow-hidden"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <span className="absolute top-4 right-6 text-8xl font-serif leading-none opacity-[0.04] select-none"
                    style={{ color: 'var(--fg)' }}>"</span>
              <p className="text-xl leading-relaxed font-medium mb-6" style={{ color: 'var(--fg)' }}>
                "The best writing tools get out of the way. The best platforms do the same."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: 'var(--accent)' }}>AO</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Amara Osei</p>
                  <p className="text-xs" style={{ color: 'var(--fg-3)' }}>Co-founder & CEO, Bloggie</p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-28 px-5 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>What we believe</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Our values.
            </h2>
          </Reveal>
          <motion.div initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }} variants={staggerSlow}
            className="grid sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ y: -4 }}
                className="p-8 rounded-2xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                     style={{ background: 'var(--accent-dim)' }}>
                  <Icon size={20} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--fg)' }}>{title}</h3>
                <p className="text-sm leading-relaxed"      style={{ color: 'var(--fg-3)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-28 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>How we got here</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              The journey so far.
            </h2>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px" style={{ background: 'var(--border-2)' }} />

            <div className="space-y-10">
              {MILESTONES.map(({ year, event }, i) => (
                <Reveal key={year} delay={i * 0.08}>
                  <div className="flex gap-6 items-start">
                    {/* Dot */}
                    <motion.div
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 z-10"
                      style={{
                        background: i === MILESTONES.length - 1 ? 'var(--accent)' : 'var(--bg-card)',
                        borderColor: i === MILESTONES.length - 1 ? 'var(--accent)' : 'var(--border-2)',
                        color: i === MILESTONES.length - 1 ? '#fff' : 'var(--fg-2)',
                      }}
                    >
                      {year}
                    </motion.div>
                    <div className="pt-2.5">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-2)' }}>{event}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-28 px-5 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>The people</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
              Meet the team.
            </h2>
          </Reveal>
          <motion.div initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }} variants={staggerSlow}
            className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {TEAM.map(({ name, role, initials, color }) => (
              <motion.div key={name} variants={fadeUp} whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border"
                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white mb-4"
                  style={{ background: color }}
                >
                  {initials}
                </motion.div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--fg)' }}>{name}</p>
                <p className="text-xs"                       style={{ color: 'var(--fg-3)' }}>{role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-5 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-bricolage), sans-serif', color: 'var(--fg)' }}>
            Ready to start writing?
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto" style={{ color: 'var(--fg-2)' }}>
            Join 12,000+ writers sharing their ideas with the world.
          </p>
          <Link href="/register">
            <MagneticBtn
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white cursor-pointer"
              style={{ background: 'var(--accent)', boxShadow: '0 4px 24px var(--accent-glow)' }}
            >
              Create your free blog <ArrowRight size={16} strokeWidth={2.5} />
            </MagneticBtn>
          </Link>
        </Reveal>
      </section>

    </PageShell>
  );
}
