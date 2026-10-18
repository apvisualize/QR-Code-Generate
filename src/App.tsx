import React, { useState, useEffect, useRef } from 'react';
import {
  QrOptions,
  DEFAULT_QR_OPTIONS,
  DotStyle,
  EyeFrameStyle,
  EyeCenterStyle,
  ErrorCorrectionLevel,
  GradientConfig,
  LogoConfig,
} from './utils/qr-generator.ts';
import { Header } from './components/Header.tsx';
import { ContentInput } from './components/ContentInput.tsx';
import { PatternCustomizer } from './components/PatternCustomizer.tsx';
import { ColorCustomizer } from './components/ColorCustomizer.tsx';
import { LogoManager } from './components/LogoManager.tsx';
import { PreviewCard } from './components/PreviewCard.tsx';
import { PresetsModal } from './components/PresetsModal.tsx';
import { HistoryDrawer, HistoryItem } from './components/HistoryDrawer.tsx';
import { QrPreset, PRESET_THEMES } from './data/presets.ts';
import {
  Link2,
  Shapes,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Download,
  CheckCircle,
  HelpCircle,
  Smartphone,
  Layers,
  Zap,
} from 'lucide-react';

type ActiveTab = 'content' | 'pattern' | 'color' | 'logo';

export default function App() {
  const [options, setOptions] = useState<QrOptions>(() => {
    // Try to load last state from localStorage if available
    try {
      const saved = localStorage.getItem('qr_studio_options');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_QR_OPTIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('content');
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('qr_studio_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [];
  });

  // Ref for scrolling to preview on mobile
  const previewRef = useRef<HTMLDivElement>(null);

  // Save options to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('qr_studio_options', JSON.stringify(options));
    } catch (e) {
      // Ignore
    }
  }, [options]);

  // Save history to localStorage
  const saveToHistory = () => {
    try {
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        text: options.text,
        timestamp: Date.now(),
        options: { ...options },
      };
      const updated = [newItem, ...historyItems.filter((h) => h.text !== options.text)].slice(0, 10);
      setHistoryItems(updated);
      localStorage.setItem('qr_studio_history', JSON.stringify(updated));
    } catch (e) {
      // Ignore
    }
  };

  const clearHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem('qr_studio_history');
    } catch (e) {
      // Ignore
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setOptions(item.options);
  };

  const applyPreset = (preset: QrPreset) => {
    setOptions((prev) => ({
      ...prev,
      ...preset.options,
    }));
  };

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'content', label: 'Konten', icon: <Link2 className="w-3.5 h-3.5" /> },
    { id: 'pattern', label: 'Pola', icon: <Shapes className="w-3.5 h-3.5" /> },
    { id: 'color', label: 'Warna', icon: <Palette className="w-3.5 h-3.5" /> },
    {
      id: 'logo',
      label: 'Logo',
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      badge: options.logo ? 'Aktif' : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Header adhering to Top Bar Contract */}
      <Header
        onQuickDownload={scrollToPreview}
        onOpenPresets={() => setIsPresetsModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-3.5 sm:space-y-6 pb-24 sm:pb-8">
        {/* Hero Section */}
        <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-800/60">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              Generator QR Kustom
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Kustomisasi pola, logo, dan unduh PNG / SVG instan.
            </p>
          </div>

          {/* Quick Preset CTA Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPresetsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-all cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tema</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div id="editor" className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Left Column: Customization Controls (Tabs & Forms) */}
          <div className="lg:col-span-7 space-y-3.5">
            {/* Step Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-xs">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.icon}
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.badge && (
                      <span className="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-white/20 text-white font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Panel */}
            <div className="space-y-4">
              {activeTab === 'content' && (
                <ContentInput
                  value={options.text}
                  onChange={(text) => setOptions((prev) => ({ ...prev, text }))}
                />
              )}

              {activeTab === 'pattern' && (
                <PatternCustomizer
                  dotStyle={options.dotStyle}
                  onChangeDotStyle={(dotStyle: DotStyle) =>
                    setOptions((prev) => ({ ...prev, dotStyle }))
                  }
                  eyeFrameStyle={options.eyeFrameStyle}
                  onChangeEyeFrameStyle={(eyeFrameStyle: EyeFrameStyle) =>
                    setOptions((prev) => ({ ...prev, eyeFrameStyle }))
                  }
                  eyeCenterStyle={options.eyeCenterStyle}
                  onChangeEyeCenterStyle={(eyeCenterStyle: EyeCenterStyle) =>
                    setOptions((prev) => ({ ...prev, eyeCenterStyle }))
                  }
                  margin={options.margin}
                  onChangeMargin={(margin: number) =>
                    setOptions((prev) => ({ ...prev, margin }))
                  }
                  errorCorrectionLevel={options.errorCorrectionLevel}
                  onChangeErrorCorrectionLevel={(errorCorrectionLevel: ErrorCorrectionLevel) =>
                    setOptions((prev) => ({ ...prev, errorCorrectionLevel }))
                  }
                  hasLogo={Boolean(options.logo?.url)}
                />
              )}

              {activeTab === 'color' && (
                <ColorCustomizer
                  useGradient={options.useGradient}
                  onChangeUseGradient={(useGradient: boolean) =>
                    setOptions((prev) => ({ ...prev, useGradient }))
                  }
                  fgColor={options.fgColor}
                  onChangeFgColor={(fgColor: string) =>
                    setOptions((prev) => ({ ...prev, fgColor }))
                  }
                  fgGradient={options.fgGradient}
                  onChangeFgGradient={(fgGradient: GradientConfig) =>
                    setOptions((prev) => ({ ...prev, fgGradient }))
                  }
                  bgColor={options.bgColor}
                  onChangeBgColor={(bgColor: string) =>
                    setOptions((prev) => ({ ...prev, bgColor }))
                  }
                  customEyeColors={options.customEyeColors}
                  onChangeCustomEyeColors={(customEyeColors: boolean) =>
                    setOptions((prev) => ({ ...prev, customEyeColors }))
                  }
                  eyeFrameColor={options.eyeFrameColor}
                  onChangeEyeFrameColor={(eyeFrameColor: string) =>
                    setOptions((prev) => ({ ...prev, eyeFrameColor }))
                  }
                  eyeCenterColor={options.eyeCenterColor}
                  onChangeEyeCenterColor={(eyeCenterColor: string) =>
                    setOptions((prev) => ({ ...prev, eyeCenterColor }))
                  }
                />
              )}

              {activeTab === 'logo' && (
                <LogoManager
                  logo={options.logo}
                  onChangeLogo={(logo: LogoConfig | undefined) =>
                    setOptions((prev) => ({ ...prev, logo }))
                  }
                  onUpgradeEccToHigh={() =>
                    setOptions((prev) => ({ ...prev, errorCorrectionLevel: 'H' }))
                  }
                  isEccHigh={options.errorCorrectionLevel === 'H'}
                />
              )}
            </div>

            {/* Recent History Drawer */}
            <HistoryDrawer
              items={historyItems}
              onLoadItem={loadHistoryItem}
              onClearHistory={clearHistory}
            />
          </div>

          {/* Right Column: Live Sticky Preview & Instant Download Actions */}
          <div ref={previewRef} className="lg:col-span-5">
            <PreviewCard options={options} onSaveToHistory={saveToHistory} />
          </div>
        </div>

        {/* Compact Specifications Bar */}
        <section id="panduan" className="pt-4 border-t border-slate-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-300">
              <span className="font-semibold text-indigo-400">Vector SVG</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 truncate">Vektor skala tak terbatas</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-300">
              <span className="font-semibold text-indigo-400">PNG HD</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 truncate">Hingga 4096px siap cetak</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-300">
              <span className="font-semibold text-indigo-400">ECC Level H</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 truncate">Aman dipindai saat berlogo</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Quick Action on Mobile Devices */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-slate-200 truncate">
            {options.text}
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToPreview}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 active:bg-indigo-700 rounded-xl shadow-md shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Lihat / Unduh</span>
        </button>
      </div>

      {/* Preset Modal */}
      <PresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onSelectPreset={applyPreset}
      />

      {/* Clean Footer adhering to design constitution */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          QR Studio Pro · Generator QR Code Kustom & Siap Cetak · Desain Responsif & Vektor Murni
        </p>
      </footer>
    </div>
  );
}
