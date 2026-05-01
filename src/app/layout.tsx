import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ScrollProgress, ScrollToTop } from '@/components/ui/ScrollEffects';
import { StyledToaster } from '@/components/ui/StyledToaster';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { getSiteUrlForMetadata } from '@/lib/site-url';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: false,
});

const metadataBaseUrl = getSiteUrlForMetadata();
const SITE_URL = metadataBaseUrl.href.replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: 'Robotix Institute — Zambia\'s Premier Robotics Education Platform',
    template: '%s | Robotix Institute',
  },
  description:
    'The most advanced robotics education platform in Zambia and Africa. Learn robotics, coding, IoT, AI, and drone programming with hands-on projects and competitions.',
  keywords: [
    'robotics', 'education', 'Zambia', 'Africa', 'coding', 'Arduino', 'ESP32',
    'IoT', 'AI', 'drones', 'STEM', 'programming', 'engineering',
  ],
  authors: [{ name: 'Robotix Institute Zambia' }],
  applicationName: 'Robotix Institute',
  category: 'education',
  icons: {
    icon: '/favicon.png',
    apple: '/images/icon-color.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    siteName: 'Robotix Institute',
    title: 'Robotix Institute — Zambia\'s Premier Robotics Education Platform',
    description: 'Learn robotics, coding, and engineering with Africa\'s most advanced platform.',
    images: [{ url: '/images/logo-color.png', width: 1200, height: 630, alt: 'Robotix Institute' }],
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robotix Institute',
    description: 'Zambia\'s premier robotics education platform.',
    images: ['/images/logo-color.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0638',
  width: 'device-width',
  initialScale: 1,
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Robotix Institute',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-color.png`,
  description: 'Premier robotics, IoT and AI education platform for Zambia and Africa.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ZM',
    addressLocality: 'Lusaka',
  },
  sameAs: [
    'https://twitter.com/robotixinstitute',
    'https://github.com/robotixinstitute',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${inter.variable} ${poppins.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-brand-dark font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-accent focus:text-brand-dark focus:rounded-lg focus:font-semibold"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CustomCursor />
        <div id="main-content">{children}</div>
        <ScrollToTop />
        <StyledToaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
