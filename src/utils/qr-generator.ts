import QRCode from 'qrcode';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotStyle = 'square' | 'dots' | 'rounded' | 'diamond' | 'fluid' | 'star';

export type EyeFrameStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond';

export type EyeCenterStyle = 'square' | 'circle' | 'rounded' | 'diamond' | 'star';

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  colorStart: string;
  colorEnd: string;
  angle: number; // 0 to 360
}

export interface LogoConfig {
  url: string; // Data URL or Image URL
  size: number; // 10 to 32 (percent of QR size)
  background: 'none' | 'circle' | 'square';
  bgColor: string;
  padding: number; // 0 to 10
  crossOrigin?: string;
}

export interface QrOptions {
  text: string;
  size: number; // pixel size for export (default 1024)
  margin: number; // quiet zone in modules (default 2)
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotStyle: DotStyle;
  eyeFrameStyle: EyeFrameStyle;
  eyeCenterStyle: EyeCenterStyle;
  // Colors
  useGradient: boolean;
  fgColor: string;
  fgGradient: GradientConfig;
  bgColor: string; // hex or 'transparent'
  customEyeColors: boolean;
  eyeFrameColor: string;
  eyeCenterColor: string;
  // Logo
  logo?: LogoConfig;
}

export const DEFAULT_QR_OPTIONS: QrOptions = {
  text: 'https://example.com',
  size: 1024,
  margin: 2,
  errorCorrectionLevel: 'Q',
  dotStyle: 'rounded',
  eyeFrameStyle: 'rounded',
  eyeCenterStyle: 'rounded',
  useGradient: true,
  fgColor: '#3B82F6',
  fgGradient: {
    type: 'linear',
    colorStart: '#2563EB',
    colorEnd: '#7C3AED',
    angle: 135,
  },
  bgColor: '#FFFFFF',
  customEyeColors: false,
  eyeFrameColor: '#1E40AF',
  eyeCenterColor: '#1E40AF',
  logo: undefined,
};

export interface QrMatrixData {
  moduleCount: number;
  totalModules: number;
  margin: number;
  matrix: boolean[][];
  isEyeModule: (row: number, col: number) => boolean;
  isLogoModule: (row: number, col: number) => boolean;
  logoZone: { startRow: number; endRow: number; startCol: number; endCol: number } | null;
}

/**
 * Checks if a module is part of the 3 finder pattern eyes (7x7 at 3 corners).
 */
export function isFinderPattern(row: number, col: number, moduleCount: number): boolean {
  // Top-left finder pattern: (0..6, 0..6)
  if (row < 7 && col < 7) return true;
  // Top-right finder pattern: (0..6, size-7..size-1)
  if (row < 7 && col >= moduleCount - 7) return true;
  // Bottom-left finder pattern: (size-7..size-1, 0..6)
  if (row >= moduleCount - 7 && col < 7) return true;
  return false;
}

/**
 * Checks if a coordinate is strictly inside the 3x3 center of an eye
 */
export function isEyeCenter(row: number, col: number, moduleCount: number): boolean {
  // Top-left center: (2..4, 2..4)
  if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
  // Top-right center: (2..4, size-5..size-3)
  if (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3) return true;
  // Bottom-left center: (size-5..size-3, 2..4)
  if (row >= moduleCount - 5 && row <= moduleCount - 3 && col >= 2 && col <= 4) return true;
  return false;
}

/**
 * Generate QR matrix data structure from input text and options
 */
export function createQrMatrix(text: string, options: Partial<QrOptions> = {}): QrMatrixData {
  const ecLevel = options.errorCorrectionLevel || 'M';
  const margin = typeof options.margin === 'number' ? Math.max(0, options.margin) : 2;

  // Use fallback if text is empty
  const safeText = text && text.trim().length > 0 ? text : 'https://example.com';
  const qr = QRCode.create(safeText, {
    errorCorrectionLevel: ecLevel,
  });

  const moduleCount = qr.modules.size;
  const matrix: boolean[][] = [];

  for (let r = 0; r < moduleCount; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < moduleCount; c++) {
      row.push(Boolean(qr.modules.get(r, c)));
    }
    matrix.push(row);
  }

  // Calculate logo clearing zone if logo exists
  let logoZone: { startRow: number; endRow: number; startCol: number; endCol: number } | null = null;
  if (options.logo && options.logo.url) {
    const logoPercent = Math.min(Math.max(options.logo.size || 22, 10), 32) / 100;
    // Calculate how many modules the logo takes
    const logoModuleSpan = Math.max(3, Math.round(moduleCount * logoPercent));
    const half = Math.floor(logoModuleSpan / 2);
    const center = Math.floor(moduleCount / 2);

    logoZone = {
      startRow: center - half,
      endRow: center + half,
      startCol: center - half,
      endCol: center + half,
    };
  }

  const isEyeModule = (row: number, col: number) => isFinderPattern(row, col, moduleCount);
  const isLogoModule = (row: number, col: number) => {
    if (!logoZone) return false;
    return (
      row >= logoZone.startRow &&
      row <= logoZone.endRow &&
      col >= logoZone.startCol &&
      col <= logoZone.endCol
    );
  };

  return {
    moduleCount,
    totalModules: moduleCount + margin * 2,
    margin,
    matrix,
    isEyeModule,
    isLogoModule,
    logoZone,
  };
}

/**
 * Helper to build SVG path data for a single module dot based on DotStyle
 */
export function getDotPath(
  x: number,
  y: number,
  size: number,
  style: DotStyle
): string {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;

  switch (style) {
    case 'dots': {
      // Perfect circle
      const dotRadius = r * 0.9;
      return `M ${cx} ${cy} m -${dotRadius}, 0 a ${dotRadius},${dotRadius} 0 1,0 ${dotRadius * 2},0 a ${dotRadius},${dotRadius} 0 1,0 -${dotRadius * 2},0`;
    }
    case 'rounded': {
      // Rounded rect
      const radius = size * 0.35;
      return `M ${x + radius} ${y} h ${size - 2 * radius} a ${radius} ${radius} 0 0 1 ${radius} ${radius} v ${size - 2 * radius} a ${radius} ${radius} 0 0 1 -${radius} ${radius} h -${size - 2 * radius} a ${radius} ${radius} 0 0 1 -${radius} -${radius} v -${size - 2 * radius} a ${radius} ${radius} 0 0 1 ${radius} -${radius} Z`;
    }
    case 'diamond': {
      // 45 degree diamond
      const d = size * 0.48;
      return `M ${cx} ${cy - d} L ${cx + d} ${cy} L ${cx} ${cy + d} L ${cx - d} ${cy} Z`;
    }
    case 'fluid': {
      // Smooth organic squircle
      const inset = size * 0.05;
      const s = size - inset * 2;
      const ix = x + inset;
      const iy = y + inset;
      const ir = s * 0.45;
      return `M ${ix + ir} ${iy} h ${s - 2 * ir} a ${ir} ${ir} 0 0 1 ${ir} ${ir} v ${s - 2 * ir} a ${ir} ${ir} 0 0 1 -${ir} ${ir} h -${s - 2 * ir} a ${ir} ${ir} 0 0 1 -${ir} -${ir} v -${s - 2 * ir} a ${ir} ${ir} 0 0 1 ${ir} -${ir} Z`;
    }
    case 'star': {
      // 4-pointed sparkle dot
      const inset = size * 0.1;
      const d = size / 2 - inset;
      return `M ${cx} ${cy - d} Q ${cx} ${cy} ${cx + d} ${cy} Q ${cx} ${cy} ${cx} ${cy + d} Q ${cx} ${cy} ${cx - d} ${cy} Q ${cx} ${cy} ${cx} ${cy - d} Z`;
    }
    case 'square':
    default:
      return `M ${x} ${y} h ${size} v ${size} h -${size} Z`;
  }
}

/**
 * Generate Eye Frame path (7x7 outer border)
 */
export function getEyeFramePath(
  x: number,
  y: number,
  moduleSize: number,
  style: EyeFrameStyle
): string {
  const size = 7 * moduleSize;
  const strokeW = moduleSize;
  const halfStroke = strokeW / 2;
  const outerX = x + halfStroke;
  const outerY = y + halfStroke;
  const outerW = size - strokeW;

  switch (style) {
    case 'circle': {
      const radius = outerW / 2;
      const cx = x + size / 2;
      const cy = y + size / 2;
      return `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
    case 'rounded': {
      const r = moduleSize * 2;
      return `M ${outerX + r} ${outerY} h ${outerW - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${outerW - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${outerW - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${outerW - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }
    case 'leaf': {
      // Rounded top-left & bottom-right, square top-right & bottom-left
      const r = moduleSize * 2.8;
      return `M ${outerX + r} ${outerY} h ${outerW - r} v ${outerW - r} a ${r} ${r} 0 0 1 -${r} ${r} h -${outerW - r} v -${outerW - r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }
    case 'diamond': {
      // Beveled cut corners
      const cut = moduleSize * 1.8;
      return `M ${outerX + cut} ${outerY} L ${outerX + outerW - cut} ${outerY} L ${outerX + outerW} ${outerY + cut} L ${outerX + outerW} ${outerY + outerW - cut} L ${outerX + outerW - cut} ${outerY + outerW} L ${outerX + cut} ${outerY + outerW} L ${outerX} ${outerY + outerW - cut} L ${outerX} ${outerY + cut} Z`;
    }
    case 'square':
    default:
      return `M ${outerX} ${outerY} h ${outerW} v ${outerW} h -${outerW} Z`;
  }
}

/**
 * Generate Eye Center path (3x3 inner block)
 */
export function getEyeCenterPath(
  x: number,
  y: number,
  moduleSize: number,
  style: EyeCenterStyle
): string {
  const size = 3 * moduleSize;
  const cx = x + size / 2;
  const cy = y + size / 2;

  switch (style) {
    case 'circle': {
      const r = size / 2;
      return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
    }
    case 'rounded': {
      const r = moduleSize * 0.9;
      return `M ${x + r} ${y} h ${size - 2 * r} a ${r} ${r} 0 0 1 ${r} ${r} v ${size - 2 * r} a ${r} ${r} 0 0 1 -${r} ${r} h -${size - 2 * r} a ${r} ${r} 0 0 1 -${r} -${r} v -${size - 2 * r} a ${r} ${r} 0 0 1 ${r} -${r} Z`;
    }
    case 'diamond': {
      const d = size / 2;
      return `M ${cx} ${cy - d} L ${cx + d} ${cy} L ${cx} ${cy + d} L ${cx - d} ${cy} Z`;
    }
    case 'star': {
      const d = size / 2;
      return `M ${cx} ${cy - d} Q ${cx} ${cy} ${cx + d} ${cy} Q ${cx} ${cy} ${cx} ${cy + d} Q ${cx} ${cy} ${cx - d} ${cy} Q ${cx} ${cy} ${cx} ${cy - d} Z`;
    }
    case 'square':
    default:
      return `M ${x} ${y} h ${size} v ${size} h -${size} Z`;
  }
}

/**
 * Generates an SVG string representation of the QR code
 */
export function generateQrSvgString(options: QrOptions): string {
  const matrixData = createQrMatrix(options.text, options);
  const { moduleCount, margin, matrix, isEyeModule, isLogoModule, logoZone } = matrixData;

  const totalModules = moduleCount + margin * 2;
  const viewBoxSize = 1000;
  const moduleSize = viewBoxSize / totalModules;

  // Foreground definition
  const gradId = `qr-fg-grad-${Math.random().toString(36).substring(2, 8)}`;
  let fgFill = options.fgColor;

  let defs = '';
  if (options.useGradient) {
    fgFill = `url(#${gradId})`;
    const angleRad = (options.fgGradient.angle * Math.PI) / 180;
    const x1 = Math.round(50 + Math.cos(angleRad + Math.PI) * 50);
    const y1 = Math.round(50 + Math.sin(angleRad + Math.PI) * 50);
    const x2 = Math.round(50 + Math.cos(angleRad) * 50);
    const y2 = Math.round(50 + Math.sin(angleRad) * 50);

    if (options.fgGradient.type === 'radial') {
      defs += `
        <defs>
          <radialGradient id="${gradId}" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="${options.fgGradient.colorStart}" />
            <stop offset="100%" stop-color="${options.fgGradient.colorEnd}" />
          </radialGradient>
        </defs>
      `;
    } else {
      defs += `
        <defs>
          <linearGradient id="${gradId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
            <stop offset="0%" stop-color="${options.fgGradient.colorStart}" />
            <stop offset="100%" stop-color="${options.fgGradient.colorEnd}" />
          </linearGradient>
        </defs>
      `;
    }
  }

  // Background rect
  const bgRect =
    options.bgColor && options.bgColor !== 'transparent'
      ? `<rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${options.bgColor}" rx="16" />`
      : '';

  // Body dots
  const bodyPaths: string[] = [];
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c] && !isEyeModule(r, c) && !isLogoModule(r, c)) {
        const x = (c + margin) * moduleSize;
        const y = (r + margin) * moduleSize;
        bodyPaths.push(getDotPath(x, y, moduleSize, options.dotStyle));
      }
    }
  }

  const bodyElements =
    bodyPaths.length > 0
      ? `<path d="${bodyPaths.join(' ')}" fill="${fgFill}" />`
      : '';

  // Eye Patterns (3 corners)
  const eyeColorFrame =
    options.customEyeColors && options.eyeFrameColor ? options.eyeFrameColor : fgFill;
  const eyeColorCenter =
    options.customEyeColors && options.eyeCenterColor ? options.eyeCenterColor : fgFill;

  const eyeLocations = [
    { row: 0, col: 0 }, // top-left
    { row: 0, col: moduleCount - 7 }, // top-right
    { row: moduleCount - 7, col: 0 }, // bottom-left
  ];

  const eyeElements = eyeLocations
    .map(({ row, col }) => {
      const frameX = (col + margin) * moduleSize;
      const frameY = (row + margin) * moduleSize;
      const framePath = getEyeFramePath(frameX, frameY, moduleSize, options.eyeFrameStyle);

      const centerX = (col + 2 + margin) * moduleSize;
      const centerY = (row + 2 + margin) * moduleSize;
      const centerPath = getEyeCenterPath(centerX, centerY, moduleSize, options.eyeCenterStyle);

      return `
        <path d="${framePath}" fill="none" stroke="${eyeColorFrame}" stroke-width="${moduleSize}" stroke-linejoin="round" />
        <path d="${centerPath}" fill="${eyeColorCenter}" />
      `;
    })
    .join('\n');

  // Logo rendering in SVG
  let logoSvg = '';
  if (options.logo && options.logo.url && logoZone) {
    const startX = (logoZone.startCol + margin) * moduleSize;
    const startY = (logoZone.startRow + margin) * moduleSize;
    const zoneW = (logoZone.endCol - logoZone.startCol + 1) * moduleSize;
    const zoneH = (logoZone.endRow - logoZone.startRow + 1) * moduleSize;

    // Background clearing badge
    if (options.logo.background === 'circle') {
      const cx = startX + zoneW / 2;
      const cy = startY + zoneH / 2;
      const radius = zoneW / 2;
      logoSvg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${options.logo.bgColor || '#FFFFFF'}" />`;
    } else if (options.logo.background === 'square') {
      const rx = moduleSize * 0.8;
      logoSvg += `<rect x="${startX}" y="${startY}" width="${zoneW}" height="${zoneH}" rx="${rx}" fill="${options.logo.bgColor || '#FFFFFF'}" />`;
    }

    // Logo image with padding
    const padding = (options.logo.padding || 0) * (moduleSize * 0.2);
    const imgX = startX + padding;
    const imgY = startY + padding;
    const imgW = zoneW - padding * 2;
    const imgH = zoneH - padding * 2;

    logoSvg += `<image href="${options.logo.url}" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid meet" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%">
    ${defs}
    ${bgRect}
    ${bodyElements}
    ${eyeElements}
    ${logoSvg}
  </svg>`.trim();
}
