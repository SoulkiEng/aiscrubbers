'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  statusText?: string;
}

export default function ProgressBar({
  progress,
  statusText = 'Processing locally in your browser...',
}: ProgressBarProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm my-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
          <span className="text-sm font-bold text-gray-800">{statusText}</span>
        </div>
        <span className="text-sm font-extrabold text-brand-600">{progress}%</span>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-violet-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[11px] text-gray-400 mt-2 text-center">
        Running 100% locally in your device RAM — zero files uploaded.
      </p>
    </div>
  );
}
