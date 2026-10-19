import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — AIScrubbers (100% Client-Side Processing)',
  description:
    'Read AIScrubbers’s Privacy Policy. Learn how our 100% client-side browser architecture guarantees zero server uploads and complete GDPR/CCPA/HIPAA privacy.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-black text-gray-950">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last Updated: October 2026</p>

          <h2 className="text-lg font-extrabold text-gray-900">
            1. 100% Client-Side File &amp; Text Processing (Zero Server Uploads)
          </h2>
          <p>
            AIScrubbers is engineered with a strict local-first architecture. When you select an image, PDF, Word document, `conversations.json` export, or paste text into any tool on AIScrubbers, all processing occurs 100% locally inside your web browser using JavaScript, HTML5 Canvas, and WebAssembly. Your files and prompts are never transmitted to, stored on, or inspected by our servers.
          </p>

          <h2 className="text-lg font-extrabold text-gray-900">
            2. Cookies, Analytics &amp; Google AdSense
          </h2>
          <p>
            We use essential local storage (`aiscrubbers_cookie_consent`) to remember your privacy preferences. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visit to AIScrubbers and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h2 className="text-lg font-extrabold text-gray-900">
            3. GDPR, CCPA &amp; Enterprise Compliance
          </h2>
          <p>
            Because AIScrubbers never collects, transmits, or stores personal files or prompt text on external servers, you retain 100% custody of your data at all times. For questions regarding this policy, contact us at support@aiscrubbers.com.
          </p>
        </div>
      </div>
    </div>
  );
}
