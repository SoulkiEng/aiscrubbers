import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS, SPECIALIZED_SOLUTIONS } from '@/lib/toolsConfig';
import ToolWorkspace from '@/components/ToolWorkspace';
import SeoContent from '@/components/SeoContent';
import SpecializedSolutionView from '@/components/SpecializedSolutionView';
import { ShieldCheck } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const toolParams = TOOLS.map((t) => ({ slug: t.id }));
  const solutionParams = SPECIALIZED_SOLUTIONS.map((s) => ({ slug: s.slug }));
  return [...toolParams, ...solutionParams];
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tool = TOOLS.find((t) => t.id === params.slug);
  if (tool) {
    return {
      title: tool.seoTitle,
      description: tool.seoDescription,
      keywords: tool.keywords,
      alternates: {
        canonical: `/${tool.id}`,
      },
      openGraph: {
        title: tool.seoTitle,
        description: tool.seoDescription,
        url: `/${tool.id}`,
        type: 'website',
      },
    };
  }

  const solution = SPECIALIZED_SOLUTIONS.find((s) => s.slug === params.slug);
  if (solution) {
    return {
      title: solution.seoTitle,
      description: solution.seoDescription,
      keywords: solution.keywords,
      alternates: {
        canonical: `/${solution.slug}`,
      },
      openGraph: {
        title: solution.seoTitle,
        description: solution.seoDescription,
        url: `/${solution.slug}`,
        type: 'website',
      },
    };
  }

  return {
    title: 'Tool Not Found | AIScrubbers',
  };
}

export default function DynamicToolOrSolutionPage({ params }: PageProps) {
  const tool = TOOLS.find((t) => t.id === params.slug);
  if (tool) {
    return (
      <div className="py-10 sm:py-16 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Tool Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold uppercase tracking-wider mb-4 border border-brand-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side • Zero Server Upload</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
              {tool.title}
            </h1>
            <p className="mt-2.5 text-base text-gray-600 max-w-2xl mx-auto">
              {tool.shortDesc}
            </p>
          </div>

          {/* Interactive Tool Workspace */}
          <ToolWorkspace tool={tool} />

          {/* Rich SEO Content, HowTo, Comparison Table, Use Cases & FAQs */}
          <SeoContent tool={tool} />
        </div>
      </div>
    );
  }

  const solution = SPECIALIZED_SOLUTIONS.find((s) => s.slug === params.slug);
  if (solution) {
    return <SpecializedSolutionView solution={solution} />;
  }

  notFound();
}
