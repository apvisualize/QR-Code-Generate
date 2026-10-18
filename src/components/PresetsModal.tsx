import React from 'react';
import { PRESET_THEMES, QrPreset } from '../data/presets.ts';
import { QrOptions } from '../utils/qr-generator.ts';
import { X, Sparkles, Check } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: QrPreset) => void;
  currentPresetId?: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Pilihan Tema & Gaya Siap Pakai
              </h3>
              <p className="text-xs text-slate-400">
                Pilih kombinasi pola dot, mata kode, dan warna gradien yang telah teruji keterbacaannya.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PRESET_THEMES.map((preset) => {
            const grad = preset.options.fgGradient;
            const isGrad = preset.options.useGradient && grad;
            const bgStyle = isGrad
              ? `linear-gradient(${grad.angle}deg, ${grad.colorStart}, ${grad.colorEnd})`
              : preset.options.fgColor || '#0F172A';

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="group relative p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/60 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                      {preset.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Visual Swatch */}
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 shadow-md ring-1 ring-white/10 flex items-center justify-center"
                    style={{ background: bgStyle }}
                  >
                    <div className="w-4 h-4 rounded-xs bg-white/20" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                  <span>Pola: {preset.options.dotStyle}</span>
                  <span>Mata: {preset.options.eyeFrameStyle}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
