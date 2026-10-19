import React from 'react';
import { Metadata } from 'next';
import { Mail, ShieldCheck, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us — AIScrubbers Support & Feedback',
  description:
    'Get in touch with the AIScrubbers engineering team for support, feature requests, C2PA compliance questions, or partnership inquiries.',
  alternates: { canonical: '/contact-us' },
};

export default function ContactUsPage() {
  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
          <h1 className="text-3xl font-black text-gray-950 mb-3">Contact Us</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Have a question about our client-side C2PA metadata remover, ChatGPT watermark cleaner, or NotebookLM context bundler? Reach out to our team below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-brand-50/60 border border-brand-200">
              <Mail className="w-6 h-6 text-brand-600 mb-3" />
              <h3 className="text-sm font-extrabold text-gray-900">Email Support</h3>
              <p className="text-xs text-gray-600 mt-1">support@aiscrubbers.com</p>
              <p className="text-[11px] text-gray-400 mt-2">Typical response time: Under 24 hours</p>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="text-sm font-extrabold text-gray-900">Privacy &amp; Security Notice</h3>
              <p className="text-xs text-gray-600 mt-1">
                Because AIScrubbers never uploads or stores your files on any server, we never have access to your documents, images, or prompts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
