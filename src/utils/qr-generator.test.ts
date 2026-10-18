import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createQrMatrix,
  isFinderPattern,
  isEyeCenter,
  generateQrSvgString,
  DEFAULT_QR_OPTIONS,
} from './qr-generator.ts';
import type { DotStyle, EyeFrameStyle, EyeCenterStyle } from './qr-generator.ts';

test('createQrMatrix generates valid QR matrix for URL', () => {
  const result = createQrMatrix('https://google.com', { errorCorrectionLevel: 'M', margin: 2 });
  assert.ok(result.moduleCount >= 21, 'QR module count should be at least 21');
  assert.equal(result.totalModules, result.moduleCount + 4);
  assert.equal(result.matrix.length, result.moduleCount);
  assert.equal(result.matrix[0].length, result.moduleCount);
});

test('finder pattern detection correctly identifies 7x7 corner modules', () => {
  const size = 25;
  // Top-left corner
  assert.equal(isFinderPattern(0, 0, size), true);
  assert.equal(isFinderPattern(6, 6, size), true);
  assert.equal(isFinderPattern(7, 7, size), false);

  // Top-right corner
  assert.equal(isFinderPattern(0, size - 7, size), true);
  assert.equal(isFinderPattern(6, size - 1, size), true);
  assert.equal(isFinderPattern(7, size - 8, size), false);

  // Bottom-left corner
  assert.equal(isFinderPattern(size - 7, 0, size), true);
  assert.equal(isFinderPattern(size - 1, 6, size), true);
  assert.equal(isFinderPattern(size - 8, 7, size), false);

  // Middle should not be finder pattern
  assert.equal(isFinderPattern(12, 12, size), false);
});

test('eye center detection identifies 3x3 centers inside finder patterns', () => {
  const size = 25;
  // Top-left center (2..4, 2..4)
  assert.equal(isEyeCenter(2, 2, size), true);
  assert.equal(isEyeCenter(3, 3, size), true);
  assert.equal(isEyeCenter(4, 4, size), true);
  assert.equal(isEyeCenter(1, 1, size), false);
  assert.equal(isEyeCenter(5, 5, size), false);
});

test('logo clearing zone reservation works when logo is configured', () => {
  const result = createQrMatrix('https://example.com/store', {
    errorCorrectionLevel: 'H',
    logo: {
      url: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
      size: 24,
      background: 'circle',
      bgColor: '#FFFFFF',
      padding: 2,
    },
  });

  assert.ok(result.logoZone !== null, 'logoZone must be calculated');
  if (result.logoZone) {
    const center = Math.floor(result.moduleCount / 2);
    assert.equal(result.isLogoModule(center, center), true);
    // Eye module should not be in logo zone
    assert.equal(result.isLogoModule(0, 0), false);
  }
});

test('generateQrSvgString produces valid SVG document with different dot and eye styles', () => {
  const dotStyles: DotStyle[] = ['square', 'dots', 'rounded', 'diamond', 'fluid', 'star'];
  const eyeFrameStyles: EyeFrameStyle[] = ['square', 'rounded', 'circle', 'leaf', 'diamond'];
  const eyeCenterStyles: EyeCenterStyle[] = ['square', 'circle', 'rounded', 'diamond', 'star'];

  for (let i = 0; i < dotStyles.length; i++) {
    const svg = generateQrSvgString({
      ...DEFAULT_QR_OPTIONS,
      text: 'https://mysite.id',
      dotStyle: dotStyles[i],
      eyeFrameStyle: eyeFrameStyles[i % eyeFrameStyles.length],
      eyeCenterStyle: eyeCenterStyles[i % eyeCenterStyles.length],
    });

    assert.ok(svg.startsWith('<svg'), 'SVG string should start with <svg tag');
    assert.ok(svg.endsWith('</svg>'), 'SVG string should end with </svg> tag');
    assert.ok(svg.includes('viewBox="0 0 1000 1000"'), 'SVG must have valid viewBox');
  }
});

test('generateQrSvgString renders gradients and custom eye colors correctly', () => {
  const svg = generateQrSvgString({
    ...DEFAULT_QR_OPTIONS,
    useGradient: true,
    fgGradient: {
      type: 'linear',
      colorStart: '#EC4899',
      colorEnd: '#8B5CF6',
      angle: 90,
    },
    customEyeColors: true,
    eyeFrameColor: '#059669',
    eyeCenterColor: '#D97706',
  });

  assert.ok(svg.includes('linearGradient'), 'Should include linearGradient def');
  assert.ok(svg.includes('#EC4899'), 'Should include gradient start color');
  assert.ok(svg.includes('#8B5CF6'), 'Should include gradient end color');
  assert.ok(svg.includes('#059669'), 'Should include custom eye frame color');
  assert.ok(svg.includes('#D97706'), 'Should include custom eye center color');
});
