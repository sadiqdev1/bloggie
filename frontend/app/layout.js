import { Inter, JetBrains_Mono, Bricolage_Grotesque } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import RouteProgress from "@/app/components/ui/RouteProgress";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const inter = Inter({
  variable: '--font-inter',
  subsets:  ['latin'],
  display:  'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets:  ['latin'],
  display:  'swap',
});

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets:  ['latin'],
  display:  'swap',
});

// ── Viewport — fix #6: themeColor matches light --bg, not #000 ───────────────
export const viewport = {
  themeColor:   [
    { media: '(prefers-color-scheme: light)', color: '#f2f3f5' },
    { media: '(prefers-color-scheme: dark)',  color: '#000000' },
  ],
  colorScheme:   'light dark',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  1,
};

// ── Metadata — fix #20: Open Graph + Twitter card ────────────────────────────
export const metadata = {
  title:       'Bloggie — Share your thoughts and experience with others.',
  description: 'Bloggie is the open platform for thinkers, creators, and storytellers. Share your ideas with the world — no gatekeepers, no algorithms, no noise.',
  manifest:    '/manifest.json',

  icons: {
    icon:     [{ url: '/logo.png', type: 'image/png' }],
    apple:    '/logo.png',
    shortcut: '/logo.png',
  },

  // fix #20 — Open Graph
  openGraph: {
    type:        'website',
    url:         'https://bloggie.app',
    title:       'Bloggie — Share your thoughts and experience with others.',
    description: 'The open platform for thinkers, creators, and storytellers. Zero algorithms. 100% you.',
    siteName:    'Bloggie',
    images: [
      {
        url:    '/logo.png',
        width:  1200,
        height: 630,
        alt:    'Bloggie — Share your thoughts',
      },
    ],
  },

  // fix #20 — Twitter / X card
  twitter: {
    card:        'summary_large_image',
    title:       'Bloggie — Share your thoughts and experience with others.',
    description: 'The open platform for independent writers. Write, publish, and grow your audience.',
    images:      ['/logo.png'],
    creator:     '@bloggie',
  },

  robots: {
    index:  false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${bricolage.variable} light h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
