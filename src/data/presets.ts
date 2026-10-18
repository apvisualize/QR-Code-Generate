import { QrOptions } from '../utils/qr-generator.ts';

export interface QrPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  options: Partial<QrOptions>;
}

export interface BrandLogo {
  id: string;
  name: string;
  category: 'social' | 'contact' | 'utility' | 'general';
  dataUrl: string; // SVG data URL
}

// Inline SVGs converted to data URLs for zero-network-dependency instant logos
function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const BRAND_LOGOS: BrandLogo[] = [
  {
    id: 'globe',
    name: 'Website / Web',
    category: 'utility',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    `),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.16 7.42C9 7.42 8.78 7.43 8.57 7.86C8.36 8.3 7.76 8.86 7.76 10C7.76 11.14 8.59 12.24 8.71 12.4C8.83 12.56 10.33 14.86 12.63 15.86C13.18 16.1 13.61 16.24 13.94 16.35C14.5 16.52 15 16.5 15.4 16.44C15.85 16.37 16.78 15.87 16.98 15.33C17.17 14.78 17.17 14.32 17.11 14.22C17.06 14.12 16.91 14.06 16.69 13.95C16.47 13.84 15.39 13.31 15.19 13.23C14.99 13.15 14.84 13.11 14.7 13.33C14.55 13.55 14.13 14.06 14 14.22C13.87 14.38 13.75 14.4 13.53 14.29C13.31 14.18 12.6 13.95 11.76 13.2C11.1 12.61 10.66 11.89 10.53 11.67C10.4 11.45 10.52 11.33 10.63 11.22C10.73 11.12 10.85 10.96 10.97 10.82C11.09 10.68 11.13 10.57 11.2 10.43C11.27 10.29 11.24 10.17 11.18 10.06C11.13 9.95 10.7 8.88 10.51 8.44C10.33 8 10.15 8.06 10.01 8.05C9.88 8.04 9.73 8.04 9.58 8.04C9.43 8.04 9.16 7.42 9.16 7.42Z"/>
      </svg>
    `),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    `),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'social',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    `),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Network',
    category: 'utility',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    `),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    `),
  },
  {
    id: 'coffee',
    name: 'Kafe / Resto',
    category: 'general',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    `),
  },
  {
    id: 'shield-check',
    name: 'Verified / Aman',
    category: 'utility',
    dataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    `),
  },
];

export const PRESET_THEMES: QrPreset[] = [
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    category: 'Modern',
    description: 'Pola membulat dengan gradien ungu neon modern',
    options: {
      dotStyle: 'rounded',
      eyeFrameStyle: 'rounded',
      eyeCenterStyle: 'rounded',
      useGradient: true,
      fgGradient: {
        type: 'linear',
        colorStart: '#4F46E5',
        colorEnd: '#9333EA',
        angle: 135,
      },
      bgColor: '#FFFFFF',
      customEyeColors: false,
    },
  },
  {
    id: 'cyber-emerald',
    name: 'Emerald Forest',
    category: 'Fresh',
    description: 'Pola titik halus bernuansa hijau botol dan mint',
    options: {
      dotStyle: 'dots',
      eyeFrameStyle: 'circle',
      eyeCenterStyle: 'circle',
      useGradient: true,
      fgGradient: {
        type: 'linear',
        colorStart: '#059669',
        colorEnd: '#10B981',
        angle: 90,
      },
      bgColor: '#FFFFFF',
      customEyeColors: true,
      eyeFrameColor: '#047857',
      eyeCenterColor: '#059669',
    },
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Glow',
    category: 'Vibrant',
    description: 'Pola tetesan organik dengan gradien matahari terbit',
    options: {
      dotStyle: 'fluid',
      eyeFrameStyle: 'leaf',
      eyeCenterStyle: 'rounded',
      useGradient: true,
      fgGradient: {
        type: 'linear',
        colorStart: '#EA580C',
        colorEnd: '#E11D48',
        angle: 120,
      },
      bgColor: '#FFFFFF',
      customEyeColors: false,
    },
  },
  {
    id: 'monochrome-classic',
    name: 'Onyx Monochrome',
    category: 'Corporate',
    description: 'Klasik tajam dengan kontras hitam pekat maksimal',
    options: {
      dotStyle: 'square',
      eyeFrameStyle: 'square',
      eyeCenterStyle: 'square',
      useGradient: false,
      fgColor: '#0F172A',
      bgColor: '#FFFFFF',
      customEyeColors: false,
    },
  },
  {
    id: 'regal-gold',
    name: 'Golden Luxury',
    category: 'Premium',
    description: 'Pola berlian mewah emas tembaga',
    options: {
      dotStyle: 'diamond',
      eyeFrameStyle: 'diamond',
      eyeCenterStyle: 'diamond',
      useGradient: true,
      fgGradient: {
        type: 'linear',
        colorStart: '#B45309',
        colorEnd: '#F59E0B',
        angle: 45,
      },
      bgColor: '#FFFFFF',
      customEyeColors: true,
      eyeFrameColor: '#92400E',
      eyeCenterColor: '#D97706',
    },
  },
  {
    id: 'ocean-cyan',
    name: 'Deep Cyan',
    category: 'Tech',
    description: 'Pola bintang futuristik dengan biru laut mendalam',
    options: {
      dotStyle: 'star',
      eyeFrameStyle: 'rounded',
      eyeCenterStyle: 'star',
      useGradient: true,
      fgGradient: {
        type: 'linear',
        colorStart: '#0284C7',
        colorEnd: '#06B6D4',
        angle: 160,
      },
      bgColor: '#FFFFFF',
      customEyeColors: false,
    },
  },
];
