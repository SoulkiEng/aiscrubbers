'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ToolMetadata, TOOLS } from '@/lib/toolsConfig';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  ChevronDown,
  ArrowRight,
  Building2,
  GraduationCap,
  ShoppingBag,
  Code2,
} from 'lucide-react';

interface SeoContentProps {
  tool: ToolMetadata;
}

export default function SeoContent({ tool }: SeoContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const relatedTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.title} - AIScrubbers`,
    url: `https://aiscrubbers.com${tool.href}`,
    description: tool.seoDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.title}`,
    description: tool.shortDesc,
    step: tool.howToSteps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="mt-16 space-y-16 heavy-section-deferred">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 3-Step How-To Guide */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Step-by-Step Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            How to Use {tool.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Complete your workflow in seconds with 100% browser-based execution and zero cloud uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-gray-50 border border-gray-200/80 hover:border-brand-300 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black text-base flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                {idx + 1}
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client-Side vs Cloud Comparison Table */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm overflow-hidden">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Why Choose Client-Side Browser Processing Over Cloud AI Tools?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Traditional online converters upload your confidential prompts, images, and documents to remote servers. AIScrubbers executes strictly on your device.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3.5 px-4 font-extrabold text-gray-900">Security & Performance Metric</th>
                <th className="py-3.5 px-4 font-extrabold text-brand-600 bg-brand-50/50">AIScrubbers (Client-Side Engine)</th>
                <th className="py-3.5 px-4 font-bold text-gray-500">Legacy Cloud Uploaders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3.5 px-4 font-bold text-gray-800">Data Privacy & Server Storage</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 bg-brand-50/20">0 Bytes Uploaded (100% RAM Execution)</td>
                <td className="py-3.5 px-4 text-gray-500">Files stored on third-party cloud buckets</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-gray-800">HIPAA / GDPR / NDA Compliance</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 bg-brand-50/20">Compliant by Design (Air-Gapped Capable)</td>
                <td className="py-3.5 px-4 text-gray-500">Requires DPA & risks prompt logging</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-gray-800">Processing Speed</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 bg-brand-50/20">Instantaneous (&lt;150ms local binary parse)</td>
                <td className="py-3.5 px-4 text-gray-500">Slow upload + queue + download wait</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-gray-800">Cost & Daily Limits</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 bg-brand-50/20">100% Free & Unlimited (No Paywalls)</td>
                <td className="py-3.5 px-4 text-gray-500">3-file daily limits & credit card trials</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4 Industry Use Cases */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
          Built for High-Compliance & Creator Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Amazon KDP, Etsy & Social Creators
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Strip C2PA Content Credentials, protect proprietary Midjourney/ComfyUI prompts inside PNG chunks, and normalize artwork to 300 DPI for print-on-demand portals.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Healthcare, Legal & Enterprise Teams
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Scrub HIPAA/GDPR PII (names, SSNs, emails, API keys) into reversible tokens locally before pasting confidential contracts or medical notes into ChatGPT or Claude.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                NotebookLM Researchers & Job Seekers
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Combine 100+ PDFs and notes to bypass Google NotebookLM’s 50-source cap, and clean invisible zero-width Unicode watermarks before submitting resumes to Workday ATS.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600 shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                AI Engineers & Technical SEO Teams
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Generate official `llms.txt` files, configure `OAI-SearchBot` vs. `GPTBot` rules, validate `.jsonl` fine-tuning datasets, and build error-free `mcp.json` server configs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Frequently Asked Questions — {tool.title}
        </h2>
        <div className="space-y-3">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-gray-50/60 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-extrabold text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Tools Internal Linking Matrix */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">
            Explore Related AI Privacy & Context Tools
          </h2>
          <Link
            href="/"
            className="text-xs font-extrabold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            <span>View All 16 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.map((rel) => (
            <Link
              key={rel.id}
              href={rel.href}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-brand-400 hover:shadow-lg transition-all"
            >
              <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md mb-3 ${rel.bgLight}`}>
                {rel.category.toUpperCase()}
              </span>
              <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-brand-600 transition-colors">
                {rel.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                {rel.shortDesc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
