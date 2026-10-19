'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SpecializedSolution, TOOLS, SPECIALIZED_SOLUTIONS } from '@/lib/toolsConfig';
import ToolWorkspace from '@/components/ToolWorkspace';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SpecializedSolutionViewProps {
  solution: SpecializedSolution;
}

export default function SpecializedSolutionView({ solution }: SpecializedSolutionViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const baseTool = TOOLS.find((t) => t.id === solution.baseToolId) || TOOLS[0];
  const otherSolutions = SPECIALIZED_SOLUTIONS.filter((s) => s.slug !== solution.slug).slice(0, 4);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: solution.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Urgent Compliance Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold uppercase tracking-wider mb-4 border border-brand-200">
            <ShieldCheck className="w-4 h-4" />
            <span>{solution.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 leading-tight">
            {solution.h1}
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
            {solution.subtitle}
          </p>
        </div>

        {/* Portal / Platform Specification Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase text-gray-400">Target Platform</p>
            <p className="text-xs font-extrabold text-gray-900 mt-1">{solution.portalSpecs.portalName}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase text-gray-400">Requirement</p>
            <p className="text-xs font-extrabold text-brand-600 mt-1">{solution.portalSpecs.maxSize}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase text-gray-400">Accepted Output</p>
            <p className="text-xs font-extrabold text-gray-900 mt-1">{solution.portalSpecs.format}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold uppercase text-gray-400">Compliance Rule</p>
            <p className="text-xs font-extrabold text-emerald-700 mt-1">{solution.portalSpecs.rule}</p>
          </div>
        </div>

        {/* Interactive Tool Workspace */}
        <ToolWorkspace tool={baseTool} />

        {/* Below-the-Fold Deep Portal Guide */}
        <div className="mt-14 space-y-10 heavy-section-deferred">
          {/* Why It Fails Alert Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-950 mb-2">
                Why {solution.portalSpecs.portalName} Flags or Rejects Standard Files
              </h2>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                {solution.whyItFails}
              </p>
            </div>
          </div>

          {/* 3-Step Compliance Walkthrough */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              3-Step Compliance Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {solution.stepByStep.map((s, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips & Sister Cross-Link */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-sm">
              <Lightbulb className="w-5 h-5" />
              <span>Expert Compliance Tips</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {solution.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-400">
                Also submitting PDF documents to US Visa (CEAC), IRCC Canada, or Job Portals?
              </span>
              <a
                href="https://pdfarenaarc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-400 hover:text-brand-300"
              >
                <span>Compress & Merge PDFs at PDFArenaArc.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {solution.faqs.map((f, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl border border-gray-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100/70"
                    >
                      <span className="text-sm font-extrabold text-gray-900">{f.q}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Specialized Solutions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-gray-900">
                More Platform-Specific AI Solutions
              </h3>
              <Link href="/" className="text-xs font-bold text-brand-600 inline-flex items-center gap-1">
                <span>All Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherSolutions.map((sol) => (
                <Link
                  key={sol.slug}
                  href={`/${sol.slug}`}
                  className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-brand-400 transition-all group"
                >
                  <span className="text-[10px] font-extrabold text-brand-600 uppercase">
                    {sol.badge}
                  </span>
                  <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-brand-600 mt-1">
                    {sol.h1}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
