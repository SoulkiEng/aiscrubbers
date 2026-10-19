import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiscrubbers.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AIScrubbers — Free C2PA Metadata Remover, AI Watermark Cleaner & NotebookLM Studio',
    template: '%s',
  },
  description:
    '100% Client-Side C2PA Content Credentials Remover, ChatGPT Invisible Unicode Watermark Cleaner, Prompt PII Redactor, and NotebookLM / Claude 100+ File Context Merger.',
  keywords: [
    'c2pa metadata remover',
    'remove content credentials image',
    'chatgpt invisible watermark cleaner',
    'zero width character remover',
    'bypass notebooklm 50 source limit',
    'combine files for claude projects',
    'prompt pii redactor hipaa',
    'llms.txt generator',
    'chatgpt conversations.json viewer to pdf',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'AIScrubbers',
    title: 'AIScrubbers — 100% Private C2PA Scrubber, AI Text Cleaner & NotebookLM Merger',
    description:
      'Strip C2PA AI metadata, remove hidden ChatGPT zero-width watermarks, anonymize prompt PII, and combine 100+ files for Google NotebookLM & Claude locally in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIScrubbers — 100% Client-Side AI Privacy & RAG Context Studio',
    description:
      'Zero server uploads. Strip C2PA tags, clean invisible Unicode watermarks, and bundle 100+ files for NotebookLM & Claude.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AIScrubbers',
    url: SITE_URL,
    description:
      '100% client-side AI metadata scrubber, invisible Unicode watermark remover, PII prompt sanitizer, and NotebookLM/Claude file preparation studio.',
    sameAs: ['https://pdfarenaarc.com'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AIScrubbers',
    url: SITE_URL,
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
