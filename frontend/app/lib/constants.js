import {
  PenLine, Sparkles, Globe, Users,
  Zap, Shield, UserCircle2, Pencil, Send,
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Explore', href: '/explore' },
  { label: 'About',   href: '/about'   },
  { label: 'Pricing', href: '/pricing' },
];

export const FEATURES = [
  { icon: PenLine,  title: 'Write without friction', desc: 'A clean, distraction-free editor that gets out of your way so your ideas can flow.'    },
  { icon: Globe,    title: 'Reach the world',         desc: 'Your stories live on the open web — discoverable, shareable, and always yours.'        },
  { icon: Users,    title: 'Grow your audience',      desc: 'Built-in follow system, comments, and reactions that turn readers into a community.'   },
  { icon: Sparkles, title: 'Beautiful by default',    desc: 'Typography-first design that makes every post look like it was crafted by a pro.'      },
  { icon: Shield,   title: 'You own your content',    desc: 'No algorithm decides your reach. No paywall between you and your audience.'            },
  { icon: Zap,      title: 'Blazing fast',            desc: 'Edge-cached, optimised images, and instant navigation — readers stay engaged.'         },
];

export const STATS = [
  { value: 12000, display: '12K+', label: 'Writers'         },
  { value: 80000, display: '80K+', label: 'Stories'         },
  { value: 2000,  display: '2M+',  label: 'Monthly Readers' },
  { value: 4.9,   display: '4.9★', label: 'Avg Rating'      },
];

export const POSTS = [
  {
    tag: 'Design', readTime: '5 min', slug: 'negative-space-ui',
    title: 'The art of negative space in UI',
    excerpt: 'Less is more — how emptiness shapes user attention and guides intent.',
    reads: '4.2k', hearts: '318', accent: '#f97316',
    author: { name: 'Sofia Reyes',  initials: 'SR', color: '#f97316' },
    cover:  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIhAAAQQCAgMBAAAAAAAAAAAAAQIDBBEABSExUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCt2jYfbOw+FDxbWlSi8lHAeXWL1G2OWmNl7lSYtI59ydUFKBNkdQB1ByaUpCT/2Q==',
  },
  {
    tag: 'Engineering', readTime: '8 min', slug: 'stop-using-orms',
    title: 'Why I stopped using ORMs',
    excerpt: "Raw SQL isn't scary. It's liberating. Here's what changed my mind.",
    reads: '9.1k', hearts: '702', accent: '#8b5cf6',
    author: { name: 'James Okafor', initials: 'JO', color: '#8b5cf6' },
    cover:  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmtE3JQ7M5FULbz3aSolCipTY3nZPiO3mhRW9RoRdX6MqVEqtsMqUNxDYJ9Y4GPmtKUH/2Q==',
  },
  {
    tag: 'Life', readTime: '4 min', slug: 'slow-mornings',
    title: 'Slow mornings as a productivity hack',
    excerpt: 'The counter-intuitive ritual that made me 3× more focused every afternoon.',
    reads: '6.7k', hearts: '541', accent: '#10b981',
    author: { name: 'Priya Nair',   initials: 'PN', color: '#10b981' },
    cover:  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=75',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFEyExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aj9ZvKy7Lu+xUW2VcMT7IpCVhbzCd0oSo9oB/UKMcrLQhNxSMqjSEJAJGSSAB6mMUpA//2Q==',
  },
];

export const TESTIMONIALS = [
  { quote: 'Bloggie made me fall in love with writing again. The editor is pure joy.',                   name: 'Sofia Reyes',  role: 'Indie blogger & designer', initials: 'SR', color: '#f97316' },
  { quote: "I migrated from Medium and haven't looked back. My readership doubled in 3 months.",         name: 'James Okafor', role: 'Tech writer',              initials: 'JO', color: '#8b5cf6' },
  { quote: 'Finally a platform that respects writers. Clean, fast, and beautiful.',                      name: 'Priya Nair',   role: 'Lifestyle creator',        initials: 'PN', color: '#10b981' },
];

export const HOW_STEPS = [
  { icon: UserCircle2, step: '01', title: 'Create your account',   desc: 'Sign up in 60 seconds — no credit card, no commitments.'                         },
  { icon: Pencil,      step: '02', title: 'Write your first post',  desc: 'Use our clean editor. Format, embed, and publish with one click.'                 },
  { icon: Send,        step: '03', title: 'Reach your audience',    desc: 'Your post goes live on the open web, ready to be shared and discovered.'          },
];

export const FOOTER_LINKS = {
  Product: ['Explore', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal:   ['Privacy', 'Terms', 'Cookies'],
};

export const TYPING_WORDS = ['Write.', 'Publish.', 'Inspire.', 'Connect.', 'Grow.'];

export const TICKER_ITEMS = [
  'Start writing today',
  '10,000 new stories this week',
  'Readers in 120+ countries',
  'Zero algorithm. 100% you.',
  'Real conversations. Real community.',
  'Your content, forever yours.',
];

export const SOCIAL_LINKS = [
  { href: 'https://x.com',           label: 'X / Twitter' },
  { href: 'https://github.com',      label: 'GitHub'      },
  { href: 'https://facebook.com',    label: 'Facebook'    },
  { href: 'https://tiktok.com',      label: 'TikTok'      },
];
