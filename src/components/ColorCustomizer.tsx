import React from 'react';
import { GradientConfig } from '../utils/qr-generator.ts';
import { Palette, Eye, RotateCw, Check } from 'lucide-react';

interface ColorCustomizerProps {
  useGradient: boolean;
  onChangeUseGradient: (use: boolean) => void;
  fgColor: string;
  onChangeFgColor: (color: string) => void;
  fgGradient: GradientConfig;
  onChangeFgGradient: (grad: GradientConfig) => void;
  bgColor: string;
  onChangeBgColor: (color: string) => void;
  customEyeColors: boolean;
  onChangeCustomEyeColors: (custom: boolean) => void;
  eyeFrameColor: string;
  onChangeEyeFrameColor: (color: string) => void;
  eyeCenterColor: string;
  onChangeEyeCenterColor: (color: string) => void;
}

export const ColorCustomizer: React.FC<ColorCustomizerProps> = ({
  useGradient,
  onChangeUseGradient,
  fgColor,
  onChangeFgColor,
  fgGradient,
  onChangeFgGradient,
  bgColor,
  onChangeBgColor,
  customEyeColors,
  onChangeCustomEyeColors,
  eyeFrameColor,
  onChangeEyeFrameColor,
  eyeCenterColor,
  onChangeEyeCenterColor,
}) => {
  const quickPalettes = [
    { name: 'Indigo Dream', start: '#4F46E5', end: '#9333EA', bg: '#FFFFFF' },
    { name: 'Emerald Wave', start: '#059669', end: '#10B981', bg: '#FFFFFF' },
    { name: 'Sunset Blaze', start: '#EA580C', end: '#E11D48', bg: '#FFFFFF' },
    { name: 'Classic Dark', start: '#0F172A', end: '#334155', bg: '#FFFFFF' },
    { name: 'Cyan Tech', start: '#0284C7', end: '#06B6D4', bg: '#FFFFFF' },
    { name: 'Royal Gold', start: '#B45309', end: '#F59E0B', bg: '#FFFFFF' },
    { name: 'Crimson Night', start: '#BE123C', end: '#7F1D1D', bg: '#FFFFFF' },
    { name: 'Dark Mode Inverse', start: '#38BDF8', end: '#818CF8', bg: '#0F172A' },
  ];

  const isTransparentBg = bgColor === 'transparent';

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      {/* Quick Curated Color Palettes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Palet Warna Cepat</span>
          </label>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {quickPalettes.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                onChangeUseGradient(true);
                onChangeFgGradient({
                  ...fgGradient,
                  colorStart: p.start,
                  colorEnd: p.end,
                });
                onChangeBgColor(p.bg);
              }}
              className="group relative flex flex-col items-center gap-1.5 p-1.5 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-950/60 transition-all cursor-pointer"
              title={p.name}
            >
              <div
                className="w-7 h-7 rounded-lg shadow-inner ring-1 ring-white/10"
                style={{
                  background: `linear-gradient(135deg, ${p.start}, ${p.end})`,
                }}
              />
              <span className="text-[10px] text-slate-400 truncate w-full text-center">
                {p.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Warna QR (Solid vs Linear vs Radial) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Tipe Warna Utama (Foreground)
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChangeUseGradient(false)}
            className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              !useGradient
                ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Satu Warna (Solid)
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeUseGradient(true);
              onChangeFgGradient({ ...fgGradient, type: 'linear' });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              useGradient && fgGradient.type === 'linear'
                ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Gradien Linear
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeUseGradient(true);
              onChangeFgGradient({ ...fgGradient, type: 'radial' });
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              useGradient && fgGradient.type === 'radial'
                ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Gradien Radial
          </button>
        </div>
      </div>

      {/* Foreground Color Pickers */}
      {!useGradient ? (
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Warna Kode QR
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => onChangeFgColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => onChangeFgColor(e.target.value)}
              className="w-32 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Warna Awal Gradien
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgGradient.colorStart}
                  onChange={(e) =>
                    onChangeFgGradient({ ...fgGradient, colorStart: e.target.value })
                  }
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={fgGradient.colorStart}
                  onChange={(e) =>
                    onChangeFgGradient({ ...fgGradient, colorStart: e.target.value })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Warna Akhir Gradien
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgGradient.colorEnd}
                  onChange={(e) =>
                    onChangeFgGradient({ ...fgGradient, colorEnd: e.target.value })
                  }
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={fgGradient.colorEnd}
                  onChange={(e) =>
                    onChangeFgGradient({ ...fgGradient, colorEnd: e.target.value })
                  }
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase outline-none"
                />
              </div>
            </div>
          </div>

          {fgGradient.type === 'linear' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Arah Sudut Gradien: {fgGradient.angle}°</span>
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={fgGradient.angle}
                onChange={(e) =>
                  onChangeFgGradient({ ...fgGradient, angle: Number(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Background Color & Transparent Toggle */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Warna Latar Belakang (Background)
          </label>
          <button
            type="button"
            onClick={() => onChangeBgColor(isTransparentBg ? '#FFFFFF' : 'transparent')}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              isTransparentBg
                ? 'bg-indigo-600 text-white font-medium'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isTransparentBg && <Check className="w-3 h-3" />}
            <span>Latar Transparan</span>
          </button>
        </div>

        {!isTransparentBg ? (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onChangeBgColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => onChangeBgColor(e.target.value)}
              className="w-32 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase outline-none"
            />
            <div className="flex gap-1.5">
              {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#0F172A', '#020617'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChangeBgColor(c)}
                  className="w-6 h-6 rounded-md border border-slate-700 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Latar transparan aktif. Sangat ideal untuk dimasukkan ke dalam poster, desain canva, atau kemasan produk.
          </p>
        )}
      </div>

      {/* Kustomisasi Warna Mata Khusus (Corner Eyes) */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Kustomisasi Warna Mata Mandiri
            </label>
          </div>
          <button
            type="button"
            onClick={() => onChangeCustomEyeColors(!customEyeColors)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              customEyeColors ? 'bg-indigo-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                customEyeColors ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {customEyeColors && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Warna Bingkai Luar Mata
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={eyeFrameColor}
                  onChange={(e) => onChangeEyeFrameColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={eyeFrameColor}
                  onChange={(e) => onChangeEyeFrameColor(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 uppercase outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Warna Titik Pusat Mata
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={eyeCenterColor}
                  onChange={(e) => onChangeEyeCenterColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={eyeCenterColor}
                  onChange={(e) => onChangeEyeCenterColor(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 uppercase outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
