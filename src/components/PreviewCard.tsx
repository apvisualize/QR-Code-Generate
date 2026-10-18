import React, { useState, useMemo } from 'react';
import {
  QrOptions,
  generateQrSvgString,
} from '../utils/qr-generator.ts';
import {
  downloadQrAsPng,
  copyQrImageToClipboard,
  triggerFileDownload,
} from '../utils/canvas-export.ts';
import {
  Download,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  Coffee,
  Maximize2,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';

interface PreviewCardProps {
  options: QrOptions;
  onSaveToHistory: () => void;
}

export type MockupMode = 'clean' | 'phone' | 'card' | 'table';

export const PreviewCard: React.FC<PreviewCardProps> = ({ options, onSaveToHistory }) => {
  const [mockupMode, setMockupMode] = useState<MockupMode>('clean');
  const [exportResolution, setExportResolution] = useState<number>(1024);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedSvg, setCopiedSvg] = useState<boolean>(false);

  // Generate real-time SVG string
  const svgString = useMemo(() => {
    try {
      return generateQrSvgString(options);
    } catch (e) {
      console.warn('SVG generation error:', e);
      return '';
    }
  }, [options]);

  // Handler for PNG Download
  const handleDownloadPng = async () => {
    try {
      setIsDownloading(true);
      const cleanName = options.text
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 24)
        .toLowerCase();
      const filename = `qr_${cleanName || 'code'}_${exportResolution}px.png`;
      await downloadQrAsPng(options, exportResolution, filename);
      onSaveToHistory();
    } catch (err) {
      console.error('Download PNG failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handler for SVG Download
  const handleDownloadSvg = () => {
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const cleanName = options.text
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 24)
        .toLowerCase();
      const filename = `qr_${cleanName || 'vector'}.svg`;
      triggerFileDownload(blob, filename);
      onSaveToHistory();
    } catch (err) {
      console.error('Download SVG failed:', err);
    }
  };

  // Handler for Copy Image
  const handleCopyImage = async () => {
    const success = await copyQrImageToClipboard(options, 1024);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
      onSaveToHistory();
    }
  };

  // Handler for Copy SVG Code
  const handleCopySvgCode = async () => {
    try {
      await navigator.clipboard.writeText(svgString);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch (e) {
      console.warn('Copy SVG failed:', e);
    }
  };

  // Scannability analysis
  const scannabilityInfo = useMemo(() => {
    const length = options.text.length;
    let status: 'optimal' | 'warning' | 'good' = 'optimal';
    let message = 'Optimal untuk semua kamera HP & scanner barcode';

    if (options.logo && options.errorCorrectionLevel === 'L') {
      status = 'warning';
      message = 'Disarankan naikkan ke Level Q atau H saat memakai logo';
    } else if (length > 300) {
      status = 'good';
      message = 'Kepadatan data tinggi; gunakan resolusi cetak >= 1024px';
    }

    return { status, message, length };
  }, [options.text, options.logo, options.errorCorrectionLevel]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl sticky top-16 sm:top-20 flex flex-col gap-4 sm:gap-5">
      {/* Top Header of Preview */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Pratinjau QR</span>
          </h2>
        </div>

        {/* Mockup Mode Selector */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 bg-slate-950/80 rounded-lg sm:rounded-xl border border-slate-800/80">
          {[
            { id: 'clean', label: 'Kanvas', icon: <Maximize2 className="w-3.5 h-3.5" /> },
            { id: 'phone', label: 'HP', icon: <Smartphone className="w-3.5 h-3.5" /> },
            { id: 'card', label: 'Kartu', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'table', label: 'Meja', icon: <Coffee className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMockupMode(tab.id as MockupMode)}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                mockupMode === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden sm:inline text-[11px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Preview Surface with Dynamic Mockup Frame */}
      <div className="flex items-center justify-center min-h-[250px] sm:min-h-[320px] p-3 sm:p-4 bg-slate-950/80 rounded-xl sm:rounded-2xl border border-slate-800/80 relative overflow-hidden group">
        {/* Mockup: Clean Studio Canvas */}
        {mockupMode === 'clean' && (
          <div
            className="w-52 h-52 sm:w-64 sm:h-64 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: options.bgColor === 'transparent' ? '#ffffff' : options.bgColor,
              backgroundImage:
                options.bgColor === 'transparent'
                  ? 'radial-gradient(circle, #e2e8f0 10%, transparent 10%)'
                  : undefined,
              backgroundSize: '12px 12px',
            }}
          >
            <div
              className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          </div>
        )}

        {/* Mockup: Smartphone Screen */}
        {mockupMode === 'phone' && (
          <div className="w-56 h-[320px] bg-slate-900 border-4 border-slate-700 rounded-[2.5rem] p-3 shadow-2xl flex flex-col items-center justify-between relative ring-1 ring-slate-600/50">
            {/* Phone Notch */}
            <div className="w-20 h-4 bg-slate-800 rounded-full mb-2" />
            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Pindai Kode QR
              </span>
              <span className="text-[9px] text-slate-500">Arahkan kamera ke layar</span>
            </div>
            <div
              className="w-40 h-40 p-2 rounded-xl shadow-md my-auto flex items-center justify-center"
              style={{
                backgroundColor: options.bgColor === 'transparent' ? '#ffffff' : options.bgColor,
              }}
            >
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>
            {/* Bottom Bar */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mt-2" />
          </div>
        )}

        {/* Mockup: Business Card */}
        {mockupMode === 'card' && (
          <div className="w-80 h-48 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-white relative">
            <div className="space-y-1.5 max-w-[130px]">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                QR
              </div>
              <h4 className="text-xs font-bold text-slate-100 leading-tight">Budi Santoso</h4>
              <p className="text-[10px] text-indigo-400">Creative Director</p>
              <div className="text-[8px] text-slate-400 pt-2 space-y-0.5">
                <p>+62 812-3456-7890</p>
                <p>budi@studio.id</p>
                <p>www.studio.id</p>
              </div>
            </div>
            <div
              className="w-32 h-32 p-2 rounded-xl shadow-lg flex items-center justify-center"
              style={{
                backgroundColor: options.bgColor === 'transparent' ? '#ffffff' : options.bgColor,
              }}
            >
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>
          </div>
        )}

        {/* Mockup: Acrylic Table Tent / Restaurant Stand */}
        {mockupMode === 'table' && (
          <div className="w-64 h-[300px] bg-white/10 backdrop-blur-md border border-white/20 rounded-t-3xl p-4 shadow-2xl flex flex-col items-center justify-between text-center relative ring-1 ring-white/10">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Menu & Pemesanan
              </span>
              <p className="text-[9px] text-slate-300">Pindai untuk melihat menu digital</p>
            </div>
            <div
              className="w-40 h-40 p-2.5 rounded-2xl shadow-xl flex items-center justify-center bg-white my-auto"
              style={{
                backgroundColor: options.bgColor === 'transparent' ? '#ffffff' : options.bgColor,
              }}
            >
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-medium">Meja No. 08</span>
          </div>
        )}
      </div>

      {/* Scannability Assessment Bar */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {scannabilityInfo.status === 'optimal' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-slate-300 text-[11px]">{scannabilityInfo.message}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono tabular-nums shrink-0">
          <span>ECC: {options.errorCorrectionLevel}</span>
          <span>·</span>
          <span>{scannabilityInfo.length} char</span>
        </div>
      </div>

      {/* Resolution Selector for PNG */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Resolusi Unduh PNG
          </label>
          <span className="text-[11px] text-indigo-400 font-mono tabular-nums">
            {exportResolution} × {exportResolution} px
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { res: 512, label: '512 px (Web)' },
            { res: 1024, label: '1024 px (HD)' },
            { res: 2048, label: '2048 px (Cetak)' },
            { res: 4096, label: '4096 px (Billboard)' },
          ].map((item) => (
            <button
              key={item.res}
              type="button"
              onClick={() => setExportResolution(item.res)}
              className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                exportResolution === item.res
                  ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Download Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Download PNG Button */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isDownloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Menyiapkan...' : 'Unduh PNG'}</span>
          </button>

          {/* Download SVG Button */}
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-100 border border-slate-700 transition-all cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unduh SVG</span>
          </button>
        </div>

        {/* Copy to Clipboard Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Gambar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopySvgCode}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {copiedSvg ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Salin SVG</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
