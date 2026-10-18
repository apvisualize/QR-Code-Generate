import React, { useRef } from 'react';
import { LogoConfig } from '../utils/qr-generator.ts';
import { BRAND_LOGOS } from '../data/presets.ts';
import { Upload, Trash2, Image as ImageIcon, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LogoManagerProps {
  logo: LogoConfig | undefined;
  onChangeLogo: (logo: LogoConfig | undefined) => void;
  onUpgradeEccToHigh: () => void;
  isEccHigh: boolean;
}

export const LogoManager: React.FC<LogoManagerProps> = ({
  logo,
  onChangeLogo,
  onUpgradeEccToHigh,
  isEccHigh,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChangeLogo({
          url: result,
          size: logo?.size || 22,
          background: logo?.background || 'circle',
          bgColor: logo?.bgColor || '#FFFFFF',
          padding: logo?.padding || 2,
        });
        onUpgradeEccToHigh();
      }
    };
    reader.readAsDataURL(file);
  };

  const selectBrandLogo = (dataUrl: string) => {
    onChangeLogo({
      url: dataUrl,
      size: logo?.size || 22,
      background: logo?.background || 'circle',
      bgColor: logo?.bgColor || '#FFFFFF',
      padding: logo?.padding || 2,
    });
    onUpgradeEccToHigh();
  };

  const removeLogo = () => {
    onChangeLogo(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sematkan Logo</span>
        </label>
        {logo && (
          <button
            type="button"
            onClick={removeLogo}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        )}
      </div>

      {/* Safety info when logo is added */}
      {logo && !isEccHigh && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-[11px]">Gunakan ECC Level H agar logo mudah dipindai.</span>
          </div>
          <button
            type="button"
            onClick={onUpgradeEccToHigh}
            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium shrink-0 cursor-pointer"
          >
            Aktifkan Level H
          </button>
        </div>
      )}

      {/* Upload File Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-950/60 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-slate-900/50"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Upload className="w-3.5 h-3.5" />
          </div>
          <div className="text-center">
            <span className="text-xs font-medium text-slate-200 block">
              Unggah Gambar
            </span>
            <span className="text-[10px] text-slate-500">
              PNG, JPG, SVG (Maks 5MB)
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Brand Presets */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5">
          <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
            Ikon Cepat:
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {BRAND_LOGOS.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => selectBrandLogo(brand.dataUrl)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer"
                title={brand.name}
              >
                <img
                  src={brand.dataUrl}
                  alt={brand.name}
                  className="w-5 h-5 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] text-slate-400 truncate w-full text-center">
                  {brand.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Customization Settings (only visible when logo active) */}
      {logo && (
        <div className="space-y-4 pt-3 border-t border-slate-800/80">
          {/* Logo Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Ukuran Logo: {logo.size}%
              </label>
              <span className="text-[11px] text-slate-500">
                Rentang aman: 15% - 25%
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="30"
              step="1"
              value={logo.size}
              onChange={(e) => onChangeLogo({ ...logo, size: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Badge Background Shape */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Bentuk Badge Latar Logo
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'circle', label: 'Lingkaran' },
                  { id: 'square', label: 'Kotak Halus' },
                  { id: 'none', label: 'Tanpa Badge' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onChangeLogo({ ...logo, background: b.id as any })}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all cursor-pointer truncate ${
                      logo.background === b.id
                        ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Background Color */}
            {logo.background !== 'none' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Warna Latar Badge
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={logo.bgColor}
                    onChange={(e) => onChangeLogo({ ...logo, bgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input
                    type="text"
                    value={logo.bgColor}
                    onChange={(e) => onChangeLogo({ ...logo, bgColor: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 uppercase outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logo Padding Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Jarak Bantalan (Padding Logo): {logo.padding}
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={logo.padding}
              onChange={(e) => onChangeLogo({ ...logo, padding: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
