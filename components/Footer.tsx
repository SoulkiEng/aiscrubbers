import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cpu, Globe, ExternalLink } from 'lucide-react';
import { TOOLS, SPECIALIZED_SOLUTIONS } from '@/lib/toolsConfig';

export default function Footer() {
  const c2paTools = TOOLS.filter((t) => t.category === 'c2pa');
  const textTools = TOOLS.filter((t) => t.category === 'text');
  const ragTools = TOOLS.filter((t) => t.category === 'rag');
  const geoTools = TOOLS.filter((t) => t.category === 'geo');

  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-slate-800/80 heavy-section-deferred">
      {/* Trust Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Zero Server Uploads (100% Local)</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Every C2PA scrubber, PII redactor, and NotebookLM file merger executes directly inside your browser RAM.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Client-Side Binary & Canvas Engine</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Inspect JUMBF/C2PA boxes, strip zero-width watermarks, and bundle 100+ files with zero cloud latency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">HIPAA, GDPR & Creator Safe</h4>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Engineered for US/UK/EU enterprises, Amazon KDP authors, Etsy sellers, and AI researchers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 text-white mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">
                AI<span className="text-brand-400">Scrubbers</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed mb-5 max-w-sm">
              AIScrubbers is the 100% client-side AI privacy, C2PA metadata scrubber, invisible watermark cleaner, and NotebookLM/Claude context preparation studio.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 max-w-xs">
              <p className="text-[11px] font-bold text-gray-300 mb-1">
                Need Private PDF Compression & Visa Tools?
              </p>
              <a
                href="https://pdfarenaarc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
              >
                <span>Visit Sister Platform PDFArenaArc.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* C2PA & Image Privacy */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
              C2PA & Image Privacy
            </h3>
            <ul className="space-y-2 text-xs">
              {c2paTools.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className="hover:text-white transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Text & Prompt Sanitizer */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
              AI Text & PII Scrubber
            </h3>
            <ul className="space-y-2 text-xs">
              {textTools.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className="hover:text-white transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NotebookLM & RAG Prep */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
              NotebookLM & RAG Prep
            </h3>
            <ul className="space-y-2 text-xs">
              {ragTools.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className="hover:text-white transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* GEO & AI Dev Tools */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
              GEO & AI Dev Tools
            </h3>
            <ul className="space-y-2 text-xs">
              {geoTools.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className="hover:text-white transition-colors">
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* High-Intent Specialized Platform Workflows */}
        <div className="mt-10 pt-8 border-t border-slate-800/80">
          <h3 className="text-xs font-extrabold text-brand-400 uppercase tracking-wider mb-4">
            Specialized Platform & Compliance Solutions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {SPECIALIZED_SOLUTIONS.map((sol) => (
              <Link
                key={sol.slug}
                href={`/${sol.slug}`}
                className="text-gray-400 hover:text-white transition-colors truncate"
              >
                • {sol.h1}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal & Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AIScrubbers. All rights reserved. 100% Client-Side Processing.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/about-us" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact-us" className="hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
