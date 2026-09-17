import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './components/Header';
import { Providers } from './providers';
import { SeoContentSection } from './components/SeoContentSection';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jsonshare.dev'),
  title: {
    default: 'JSON Share & Compare — Free Online JSON Suite with Alphabetical Diff',
    template: '%s | JSON Share',
  },
  description:
    'Create, share, format, validate, and compare JSON documents online. Features recursive alphabetical key sorting to eliminate false differences, side-by-side diff, and missing field detection.',
  keywords: [
    'json share',
    'json compare',
    'json diff',
    'compare json files',
    'alphabetical json sort',
    'json key sorter',
    'json diff tool',
    'json tree viewer',
    'json formatter',
    'json validator',
    'json autofix',
  ],
  authors: [{ name: 'JSON Share Team' }],
  creator: 'jsonshare.dev',
  openGraph: {
    title: 'JSON Share & Compare — Free Online JSON Suite',
    description:
      'Compare two JSON files with recursive alphabetical key sorting, semantic difference detection, and instant shareable permalinks.',
    url: 'https://jsonshare.dev',
    siteName: 'JSON Share',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Share & Compare — Free Online JSON Suite',
    description:
      'Compare JSON files with recursive alphabetical key sorting, side-by-side visual diff, and instant permalinks.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'JSON Share & Compare',
      url: 'https://jsonshare.dev',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Free developer platform to create, share, format, and compare JSON documents with recursive alphabetical key sorting and semantic diff detection.',
      featureList: [
        'Instant shareable JSON permalinks',
        'Side-by-side and unified visual diff',
        'Recursive alphabetical key sorting to ignore key order',
        'Missing and added field detection with JSON Paths',
        'Auto-repair common JSON syntax mistakes',
        'Export TypeScript interface definitions',
        'Client-side diff computation for complete data privacy',
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I compare two JSON files if the keys are in different order?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Navigate to jsonshare.dev/compare and ensure "Sort Keys (A→Z)" is turned on. The tool recursively sorts every object’s keys alphabetically, eliminating false diffs caused purely by key order.',
          },
        },
        {
          '@type': 'Question',
          name: 'How to detect missing fields between two API payloads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Semantic Inspector highlights missing/removed fields in red, showing the exact dot-notation JSON path (e.g. user.profile.roles[0]) and original value.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is my JSON data kept private during comparison?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! JSON comparison and normalization run 100% locally in your browser. Data is never uploaded unless you explicitly choose to save and share a link.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <div className="mx-auto w-[95vw] px-3 lg:w-[85vw] lg:px-0">
            <div className="flex flex-col">
              <main style={{ minHeight: 'calc(100vh - 69px)' }}>
                {children}
                <SeoContentSection />
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
