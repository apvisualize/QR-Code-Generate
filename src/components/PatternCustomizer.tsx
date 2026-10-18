import React from 'react';
import {
  DotStyle,
  EyeFrameStyle,
  EyeCenterStyle,
  ErrorCorrectionLevel,
} from '../utils/qr-generator.ts';
import { Sliders, ShieldCheck } from 'lucide-react';

interface PatternCustomizerProps {
  dotStyle: DotStyle;
  onChangeDotStyle: (style: DotStyle) => void;
  eyeFrameStyle: EyeFrameStyle;
  onChangeEyeFrameStyle: (style: EyeFrameStyle) => void;
  eyeCenterStyle: EyeCenterStyle;
  onChangeEyeCenterStyle: (style: EyeCenterStyle) => void;
  margin: number;
  onChangeMargin: (margin: number) => void;
  errorCorrectionLevel: ErrorCorrectionLevel;
  onChangeErrorCorrectionLevel: (level: ErrorCorrectionLevel) => void;
  hasLogo: boolean;
}

export const PatternCustomizer: React.FC<PatternCustomizerProps> = ({
  dotStyle,
  onChangeDotStyle,
  eyeFrameStyle,
  onChangeEyeFrameStyle,
  eyeCenterStyle,
  onChangeEyeCenterStyle,
  margin,
  onChangeMargin,
  errorCorrectionLevel,
  onChangeErrorCorrectionLevel,
  hasLogo,
}) => {
  const dotOptions: { id: DotStyle; label: string; preview: React.ReactNode }[] = [
    {
      id: 'square',
      label: 'Kotak Klasik',
      preview: (
        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
          <div className="bg-current rounded-none" />
          <div className="bg-current rounded-none" />
          <div className="bg-current rounded-none" />
          <div className="bg-current rounded-none" />
        </div>
      ),
    },
    {
      id: 'rounded',
      label: 'Kotak Melengkung',
      preview: (
        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
          <div className="bg-current rounded-xs" />
          <div className="bg-current rounded-xs" />
          <div className="bg-current rounded-xs" />
          <div className="bg-current rounded-xs" />
        </div>
      ),
    },
    {
      id: 'dots',
      label: 'Titik Lingkaran',
      preview: (
        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
          <div className="bg-current rounded-full" />
          <div className="bg-current rounded-full" />
          <div className="bg-current rounded-full" />
          <div className="bg-current rounded-full" />
        </div>
      ),
    },
    {
      id: 'diamond',
      label: 'Berlian Tajam',
      preview: (
        <div className="w-5 h-5 grid grid-cols-2 gap-1 place-items-center">
          <div className="w-2 h-2 bg-current rotate-45" />
          <div className="w-2 h-2 bg-current rotate-45" />
          <div className="w-2 h-2 bg-current rotate-45" />
          <div className="w-2 h-2 bg-current rotate-45" />
        </div>
      ),
    },
    {
      id: 'fluid',
      label: 'Organik Fluid',
      preview: (
        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
          <div className="bg-current rounded-sm" />
          <div className="bg-current rounded-full" />
          <div className="bg-current rounded-full" />
          <div className="bg-current rounded-sm" />
        </div>
      ),
    },
    {
      id: 'star',
      label: 'Bintang Sparkle',
      preview: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2 Q12 12 22 12 Q12 12 12 22 Q12 12 2 12 Q12 12 12 2 Z" />
        </svg>
      ),
    },
  ];

  const eyeFrameOptions: { id: EyeFrameStyle; label: string; shapeSvg: React.ReactNode }[] = [
    {
      id: 'square',
      label: 'Kotak Asli',
      shapeSvg: (
        <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" />
      ),
    },
    {
      id: 'rounded',
      label: 'Sudut Halus',
      shapeSvg: (
        <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
      ),
    },
    {
      id: 'circle',
      label: 'Lingkaran Penuh',
      shapeSvg: (
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
      ),
    },
    {
      id: 'leaf',
      label: 'Daun Organik',
      shapeSvg: (
        <path d="M7 2 h15 v15 a5 5 0 0 1 -5 5 h-15 v-15 a5 5 0 0 1 5 -5 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
      ),
    },
    {
      id: 'diamond',
      label: 'Bevel Berlian',
      shapeSvg: (
        <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      ),
    },
  ];

  const eyeCenterOptions: { id: EyeCenterStyle; label: string; shapeSvg: React.ReactNode }[] = [
    {
      id: 'square',
      label: 'Kotak',
      shapeSvg: <rect x="5" y="5" width="14" height="14" fill="currentColor" />,
    },
    {
      id: 'circle',
      label: 'Lingkaran',
      shapeSvg: <circle cx="12" cy="12" r="7" fill="currentColor" />,
    },
    {
      id: 'rounded',
      label: 'Membulat',
      shapeSvg: <rect x="5" y="5" width="14" height="14" rx="4" fill="currentColor" />,
    },
    {
      id: 'diamond',
      label: 'Berlian',
      shapeSvg: <polygon points="12,4 20,12 12,20 4,12" fill="currentColor" />,
    },
    {
      id: 'star',
      label: 'Bintang',
      shapeSvg: (
        <path d="M12 4 Q12 12 20 12 Q12 12 12 20 Q12 12 4 12 Q12 12 12 4 Z" fill="currentColor" />
      ),
    },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-4 sm:space-y-5">
      {/* 1. Pola Titik */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300">
            Pola Titik
          </label>
          <span className="text-[11px] text-indigo-400 capitalize font-medium">{dotStyle}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {dotOptions.map((opt) => {
            const isSelected = dotStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeDotStyle(opt.id)}
                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                  {opt.preview}
                </div>
                <span className="text-xs font-medium truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bingkai Mata */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300">
            Bingkai Mata
          </label>
          <span className="text-[11px] text-indigo-400 capitalize font-medium">{eyeFrameStyle}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {eyeFrameOptions.map((opt) => {
            const isSelected = eyeFrameStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeEyeFrameStyle(opt.id)}
                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <svg viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {opt.shapeSvg}
                </svg>
                <span className="text-xs font-medium truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Titik Pusat Mata */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300">
            Pusat Mata
          </label>
          <span className="text-[11px] text-indigo-400 capitalize font-medium">{eyeCenterStyle}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {eyeCenterOptions.map((opt) => {
            const isSelected = eyeCenterStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeEyeCenterStyle(opt.id)}
                className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <svg viewBox="0 0 24 24" className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {opt.shapeSvg}
                </svg>
                <span className="text-xs font-medium truncate">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Margin & Koreksi Kesalahan */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Margin Quiet Zone */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Margin: {margin}x</span>
            </label>
          </div>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 4].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChangeMargin(m)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  margin === m
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 0 ? 'Nol' : `${m}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Error Correction Level */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Koreksi ECC</span>
            </label>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => {
              const labels: Record<ErrorCorrectionLevel, string> = {
                L: 'L (7%)',
                M: 'M (15%)',
                Q: 'Q (25%)',
                H: 'H (30%)',
              };
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChangeErrorCorrectionLevel(lvl)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    errorCorrectionLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {labels[lvl]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
