import React from 'react';
import { QrCode, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  onQuickDownload: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onQuickDownload, onOpenPresets }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/75 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Clean, refined Brand Wordmark */}
        <a
          href="/"
          className="flex items-center gap-2.5 text-slate-100 font-semibold text-sm tracking-tight whitespace-nowrap shrink-0 group transition-opacity hover:opacity-90"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/15 transition-colors">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100">QR Studio</span>
        </a>

        {/* Zone 2: Minimalist Nav Links with generous breathing room */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={onOpenPresets}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tema Pilihan</span>
          </button>
          <a
            href="#panduan"
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            Panduan Format
          </a>
        </nav>

        {/* Zone 3: Refined, elegant action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onQuickDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unduh QR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
