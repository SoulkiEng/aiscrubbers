'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOLS, SPECIALIZED_SOLUTIONS } from '@/lib/toolsConfig';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Bot,
  Lock,
  Zap,
  ArrowRight,
  Search,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'c2pa' | 'text' | 'rag' | 'geo'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-14 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-extrabold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Browser Engine • 0 Bytes Uploaded</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            The Private <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">AI Metadata, Watermark &amp; Context</span> Studio
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Strip hidden <strong>C2PA Content Credentials</strong>, clean <strong>invisible ChatGPT zero-width watermarks</strong>, redact <strong>HIPAA/GDPR prompt PII</strong>, and bundle <strong>100+ files for Google NotebookLM &amp; Claude</strong> — 100% inside your browser.
          </p>

          {/* Search & Quick Filter Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g., C2PA remover, NotebookLM 50 limit, zero-width, PII, llms.txt)..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-brand-400 text-sm text-white placeholder-gray-400 outline-none shadow-2xl"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All 16 Core Tools' },
              { id: 'c2pa', label: 'C2PA & Image Privacy (4)' },
              { id: 'text', label: 'AI Text & PII Scrubber (4)' },
              { id: 'rag', label: 'NotebookLM & Claude Prep (4)' },
              { id: 'geo', label: 'GEO & AI Dev Tools (4)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-900 text-gray-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 16 Core Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm hover:shadow-xl hover:border-brand-400 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md`}
                  >
                    {tool.category === 'c2pa' ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : tool.category === 'text' ? (
                      <Sparkles className="w-6 h-6" />
                    ) : tool.category === 'rag' ? (
                      <Layers className="w-6 h-6" />
                    ) : (
                      <Bot className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tool.bgLight} ${tool.borderLight}`}
                  >
                    {tool.category === 'c2pa'
                      ? 'C2PA / EXIF'
                      : tool.category === 'text'
                      ? 'Text / PII'
                      : tool.category === 'rag'
                      ? 'NotebookLM / RAG'
                      : 'GEO / Dev'}
                  </span>
                </div>

                <h2 className="text-base font-black text-gray-900 group-hover:text-brand-600 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-brand-600">
                <span>Launch Local Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* High-Intent Platform Compliance Solutions Section (Below the Fold) */}
      <section className="py-16 bg-white border-t border-gray-200 heavy-section-deferred">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200">
              Platform-Specific Workflows
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-950 mt-3">
              Solve Urgent AI Platform &amp; Portal Rejections
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Purpose-built presets for LinkedIn/Instagram C2PA flags, Amazon KDP 300 DPI rules, Etsy prompt protection, and Google NotebookLM’s 50-source limit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SPECIALIZED_SOLUTIONS.map((sol) => (
              <Link
                key={sol.slug}
                href={`/${sol.slug}`}
                className="group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-gray-200 hover:border-brand-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-100 text-brand-700 mb-3">
                    {sol.badge}
                  </span>
                  <h3 className="text-base font-black text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {sol.h1}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {sol.subtitle}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200/70 flex items-center justify-between text-xs font-bold text-gray-700 group-hover:text-brand-600">
                  <span>{sol.portalSpecs.portalName}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why AIScrubbers Architecture Section */}
      <section className="py-16 bg-slate-50 border-t border-gray-200 heavy-section-deferred">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-200">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                100% Air-Gapped Browser Privacy
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Unlike cloud converters that log your prompts, client contracts, and unreleased AI artwork, AIScrubbers runs entirely in your browser RAM using WebAssembly, HTML5 Canvas, and local binary streams.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 border border-indigo-200">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                True Binary C2PA &amp; Unicode Forensics
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Inspect and strip JPEG APP11 JUMBF manifests, PNG tEXt/iTXt prompt graphs, IPTC trainedAlgorithmicMedia tags, and invisible zero-width Unicode characters (U+200B, U+202F) in milliseconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-200">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                Built for 2026 LLM &amp; RAG Limits
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Combine 100+ PDFs, Word docs, and code files into a single XML-indexed source to bypass Google NotebookLM’s 50-source cap and Claude’s 20-file upload limit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
