// ─── Brand social SVGs ────────────────────────────────────────────────────────
export const IconTwitterX  = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
export const IconGithub    = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.071 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
  </svg>
);
export const IconFacebook  = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);
export const IconTikTok    = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

// ─── Nav ──────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Explore', href: '/explore' },
  { label: 'About',   href: '/about'   },
  { label: 'Pricing', href: '/pricing' },
];

// ─── Features ─────────────────────────────────────────────────────────────────
// Icons are imported where used (FeatureCard) — pass strings here, resolve in component
export const FEATURES = [
  { iconName: 'PenLine',  title: 'Write without friction', desc: 'A clean, distraction-free editor that gets out of your way so your ideas can flow.'  },
  { iconName: 'Globe',    title: 'Reach the world',        desc: 'Your stories live on the open web — discoverable, shareable, and always yours.'        },
  { iconName: 'Users',    title: 'Grow your audience',     desc: 'Built-in follow system, comments, and reactions that turn readers into a community.'   },
  { iconName: 'Sparkles', title: 'Beautiful by default',   desc: 'Typography-first design that makes every post look like it was crafted by a pro.'      },
  { iconName: 'Shield',   title: 'You own your content',   desc: 'No algorithm decides your reach. No paywall between you and your audience.'            },
  { iconName: 'Zap',      title: 'Blazing fast',           desc: 'Edge-cached, optimised images, and instant navigation — readers stay engaged.'         },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
export const STATS = [
  { value: 12000, display: '12K+', label: 'Writers'         },
  { value: 80000, display: '80K+', label: 'Stories'         },
  { value: 2000,  display: '2M+',  label: 'Monthly Readers' },
  { value: 4.9,   display: '4.9★', label: 'Avg Rating'      },
];

// ─── Posts ────────────────────────────────────────────────────────────────────
export const POSTS = [
  {
    tag: 'Design', readTime: '5 min', slug: 'negative-space-ui',
    title: 'The art of negative space in UI',
    excerpt: 'Less is more — how emptiness shapes user attention and guides intent.',
    reads: '4.2k', hearts: '318', accent: '#f97316',
    author: { name: 'Sofia Reyes',  initials: 'SR', color: '#f97316' },
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
  },
  {
    tag: 'Engineering', readTime: '8 min', slug: 'stop-using-orms',
    title: 'Why I stopped using ORMs',
    excerpt: "Raw SQL isn't scary. It's liberating. Here's what changed my mind.",
    reads: '9.1k', hearts: '702', accent: '#8b5cf6',
    author: { name: 'James Okafor', initials: 'JO', color: '#8b5cf6' },
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
  },
  {
    tag: 'Life', readTime: '4 min', slug: 'slow-mornings',
    title: 'Slow mornings as a productivity hack',
    excerpt: 'The counter-intuitive ritual that made me 3× more focused every afternoon.',
    reads: '6.7k', hearts: '541', accent: '#10b981',
    author: { name: 'Priya Nair',   initials: 'PN', color: '#10b981' },
    cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { quote: 'Bloggie made me fall in love with writing again. The editor is pure joy.',                   name: 'Sofia Reyes',  role: 'Indie blogger & designer', initials: 'SR', color: '#f97316' },
  { quote: "I migrated from Medium and haven't looked back. My readership doubled in 3 months.",         name: 'James Okafor', role: 'Tech writer',              initials: 'JO', color: '#8b5cf6' },
  { quote: 'Finally a platform that respects writers. Clean, fast, and beautiful.',                      name: 'Priya Nair',   role: 'Lifestyle creator',        initials: 'PN', color: '#10b981' },
];

// ─── How it works ─────────────────────────────────────────────────────────────
// iconName resolved in HowItWorks component
export const HOW_STEPS = [
  { iconName: 'UserCircle2', step: '01', title: 'Create your account',  desc: 'Sign up in 60 seconds — no credit card, no commitments.'                        },
  { iconName: 'Pencil',      step: '02', title: 'Write your first post', desc: 'Use our clean editor. Format, embed, and publish with one click.'                },
  { iconName: 'Send',        step: '03', title: 'Reach your audience',   desc: 'Your post goes live on the open web, ready to be shared and discovered.'         },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_LINKS = {
  Product: ['Explore', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal:   ['Privacy', 'Terms', 'Cookies'],
};

export const SOCIAL_LINKS = [
  { Icon: IconTwitterX, href: 'https://x.com',         label: 'X / Twitter' },
  { Icon: IconGithub,   href: 'https://github.com',    label: 'GitHub'      },
  { Icon: IconFacebook, href: 'https://facebook.com',  label: 'Facebook'    },
  { Icon: IconTikTok,   href: 'https://tiktok.com',    label: 'TikTok'      },
];

// ─── Misc ─────────────────────────────────────────────────────────────────────
export const TYPING_WORDS = ['Write.', 'Publish.', 'Inspire.', 'Connect.', 'Grow.'];

export const TICKER_ITEMS = [
  'Start writing today',
  '10,000 new stories this week',
  'Readers in 120+ countries',
  'Zero algorithm. 100% you.',
  'Real conversations. Real community.',
  'Your content, forever yours.',
];
