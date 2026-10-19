import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, Lock, Cpu, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — AIScrubbers Client-Side AI Privacy & Context Studio',
  description:
    'Learn how AIScrubbers delivers 100% browser-based C2PA metadata removal, invisible AI watermark cleaning, PII redaction, and NotebookLM file bundling with zero server uploads.',
  alternates: { canonical: '/about-us' },
};

export default function AboutUsPage() {
  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 mt-4 mb-4">
            Privacy-First Utilities for the 2026 AI Era
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            AIScrubbers was built to solve a critical gap in modern AI workflows: creators, enterprises, researchers, and developers need powerful ways to inspect and strip C2PA Content Credentials, clean hidden LLM Unicode watermarks, redact confidential PII before prompting ChatGPT, and bundle 100+ files for Google NotebookLM and Claude Projects—<strong>without uploading private files to third-party cloud servers</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200">
              <Lock className="w-6 h-6 text-brand-600 mb-3" />
              <h3 className="text-base font-extrabold text-gray-900 mb-1">
                Zero Server Uploads
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every image, prompt, JSON export, and document you process on AIScrubbers stays strictly inside your device’s local browser memory (RAM).
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200">
              <Cpu className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="text-base font-extrabold text-gray-900 mb-1">
                WebAssembly &amp; Binary Precision
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We engineer client-side binary JUMBF/EXIF parsers, HTML5 Canvas pixel reconstructors, and reversible PII tokenizers that execute in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
