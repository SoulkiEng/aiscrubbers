'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Menu, X, ChevronDown, Sparkles, Layers, Bot } from 'lucide-react';
import { TOOLS } from '@/lib/toolsConfig';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900">
                AI<span className="text-brand-600">Scrubbers</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 -mt-1">
                C2PA • AI Text • RAG Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/c2pa-remover"
              className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
            >
              C2PA Remover
            </Link>
            <Link
              href="/chatgpt-watermark-remover"
              className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
            >
              Watermark Cleaner
            </Link>
            <Link
              href="/notebooklm-file-merger"
              className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
            >
              NotebookLM Merger
            </Link>
            <Link
              href="/prompt-pii-redactor"
              className="px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
            >
              PII Redactor
            </Link>

            {/* All Tools Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold text-gray-700 hover:text-brand-600 hover:bg-brand-50/50 transition-colors"
              >
                <span>All 16 AI Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full w-[580px] pt-2 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 grid grid-cols-2 gap-2">
                    {TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.bgLight}`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 group-hover:text-brand-600 truncate">
                            {tool.title}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {tool.shortDesc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Privacy Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Client-Side</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            All AI Privacy & File Prep Tools
          </div>
          <div className="grid grid-cols-1 gap-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-800"
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.color}`} />
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
