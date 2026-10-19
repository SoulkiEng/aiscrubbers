import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — AIScrubbers',
  description:
    'Terms of Service and acceptable use guidelines for AIScrubbers’s client-side C2PA, AI text sanitization, and NotebookLM file preparation tools.',
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsOfServicePage() {
  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <h1 className="text-3xl font-black text-gray-950">Terms of Service</h1>
          <p className="text-xs text-gray-400">Last Updated: October 2026</p>

          <h2 className="text-lg font-extrabold text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AIScrubbers, you agree to comply with and be bound by these Terms of Service. All utilities are provided free of charge and execute locally within your web browser.
          </p>

          <h2 className="text-lg font-extrabold text-gray-900">2. User Responsibility &amp; Ownership</h2>
          <p>
            You retain full ownership and responsibility for all images, documents, prompts, and datasets you process using AIScrubbers. Because all processing occurs locally on your device, AIScrubbers does not host, review, or retain copies of your files. You agree to use these utilities in compliance with applicable copyright laws and platform terms.
          </p>

          <h2 className="text-lg font-extrabold text-gray-900">3. Disclaimer of Warranties</h2>
          <p>
            AIScrubbers is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Always verify your exported files before submitting them to publishing, employment, or compliance portals.
          </p>
        </div>
      </div>
    </div>
  );
}
