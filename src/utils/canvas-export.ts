import {
  createQrMatrix,
  getDotPath,
  getEyeFramePath,
  getEyeCenterPath,
  QrOptions,
} from './qr-generator.ts';

/**
 * Loads an image from a URL or Data URL asynchronously
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Draws the custom QR code onto an HTML5 canvas element at a target resolution
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  options: QrOptions,
  targetSize: number = options.size || 1024
): Promise<void> {
  canvas.width = targetSize;
  canvas.height = targetSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  ctx.clearRect(0, 0, targetSize, targetSize);

  // Background
  if (options.bgColor && options.bgColor !== 'transparent') {
    ctx.fillStyle = options.bgColor;
    ctx.fillRect(0, 0, targetSize, targetSize);
  }

  const matrixData = createQrMatrix(options.text, options);
  const { moduleCount, margin, matrix, isEyeModule, isLogoModule, logoZone } = matrixData;
  const totalModules = moduleCount + margin * 2;
  const moduleSize = targetSize / totalModules;

  // Create Foreground Style (Solid or Gradient)
  let fgStyle: string | CanvasGradient = options.fgColor;
  if (options.useGradient) {
    if (options.fgGradient.type === 'radial') {
      const grad = ctx.createRadialGradient(
        targetSize / 2,
        targetSize / 2,
        moduleSize,
        targetSize / 2,
        targetSize / 2,
        targetSize * 0.7
      );
      grad.addColorStop(0, options.fgGradient.colorStart);
      grad.addColorStop(1, options.fgGradient.colorEnd);
      fgStyle = grad;
    } else {
      const angleRad = (options.fgGradient.angle * Math.PI) / 180;
      const x1 = Math.round(targetSize / 2 + (Math.cos(angleRad + Math.PI) * targetSize) / 2);
      const y1 = Math.round(targetSize / 2 + (Math.sin(angleRad + Math.PI) * targetSize) / 2);
      const x2 = Math.round(targetSize / 2 + (Math.cos(angleRad) * targetSize) / 2);
      const y2 = Math.round(targetSize / 2 + (Math.sin(angleRad) * targetSize) / 2);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, options.fgGradient.colorStart);
      grad.addColorStop(1, options.fgGradient.colorEnd);
      fgStyle = grad;
    }
  }

  // Draw Body Dots
  ctx.fillStyle = fgStyle;
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (matrix[r][c] && !isEyeModule(r, c) && !isLogoModule(r, c)) {
        const x = (c + margin) * moduleSize;
        const y = (r + margin) * moduleSize;
        const pathStr = getDotPath(x, y, moduleSize, options.dotStyle);
        const path2d = new Path2D(pathStr);
        ctx.fill(path2d);
      }
    }
  }

  // Draw 3 Corner Eyes
  const eyeColorFrame =
    options.customEyeColors && options.eyeFrameColor ? options.eyeFrameColor : fgStyle;
  const eyeColorCenter =
    options.customEyeColors && options.eyeCenterColor ? options.eyeCenterColor : fgStyle;

  const eyeLocations = [
    { row: 0, col: 0 },
    { row: 0, col: moduleCount - 7 },
    { row: moduleCount - 7, col: 0 },
  ];

  for (const { row, col } of eyeLocations) {
    const frameX = (col + margin) * moduleSize;
    const frameY = (row + margin) * moduleSize;
    const framePath = getEyeFramePath(frameX, frameY, moduleSize, options.eyeFrameStyle);

    ctx.strokeStyle = eyeColorFrame;
    ctx.lineWidth = moduleSize;
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D(framePath));

    const centerX = (col + 2 + margin) * moduleSize;
    const centerY = (row + 2 + margin) * moduleSize;
    const centerPath = getEyeCenterPath(centerX, centerY, moduleSize, options.eyeCenterStyle);

    ctx.fillStyle = eyeColorCenter;
    ctx.fill(new Path2D(centerPath));
  }

  // Draw Embedded Logo
  if (options.logo && options.logo.url && logoZone) {
    const startX = (logoZone.startCol + margin) * moduleSize;
    const startY = (logoZone.startRow + margin) * moduleSize;
    const zoneW = (logoZone.endCol - logoZone.startCol + 1) * moduleSize;
    const zoneH = (logoZone.endRow - logoZone.startRow + 1) * moduleSize;

    // Draw Badge Background
    if (options.logo.background === 'circle') {
      ctx.fillStyle = options.logo.bgColor || '#FFFFFF';
      ctx.beginPath();
      ctx.arc(startX + zoneW / 2, startY + zoneH / 2, zoneW / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (options.logo.background === 'square') {
      ctx.fillStyle = options.logo.bgColor || '#FFFFFF';
      const rx = moduleSize * 0.8;
      ctx.beginPath();
      ctx.roundRect(startX, startY, zoneW, zoneH, rx);
      ctx.fill();
    }

    // Load & Render Logo
    try {
      const img = await loadImage(options.logo.url);
      const padding = (options.logo.padding || 0) * (moduleSize * 0.2);
      const imgX = startX + padding;
      const imgY = startY + padding;
      const imgW = zoneW - padding * 2;
      const imgH = zoneH - padding * 2;

      // Maintain aspect ratio centered
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = imgW;
      let drawH = imgH;
      let drawX = imgX;
      let drawY = imgY;

      if (imgAspect > 1) {
        drawH = imgW / imgAspect;
        drawY = imgY + (imgH - drawH) / 2;
      } else {
        drawW = imgH * imgAspect;
        drawX = imgX + (imgW - drawW) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } catch (err) {
      console.warn('Could not draw logo image to canvas:', err);
    }
  }
}

/**
 * Triggers download of a Blob as a file with specified filename
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads the QR code as PNG at a specified resolution
 */
export async function downloadQrAsPng(
  options: QrOptions,
  resolution: number = 1024,
  filename: string = 'qrcode.png'
): Promise<void> {
  const canvas = document.createElement('canvas');
  await renderQrToCanvas(canvas, options, resolution);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas to Blob failed'));
        return;
      }
      triggerFileDownload(blob, filename);
      resolve();
    }, 'image/png');
  });
}

/**
 * Copies the QR code PNG image to the system clipboard
 */
export async function copyQrImageToClipboard(
  options: QrOptions,
  resolution: number = 1024
): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    await renderQrToCanvas(canvas, options, resolution);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        try {
          if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.warn('Clipboard write failed:', e);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (e) {
    console.warn('Failed to generate image for clipboard:', e);
    return false;
  }
}
