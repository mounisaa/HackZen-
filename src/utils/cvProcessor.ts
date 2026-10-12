import { CVProcessingOptions } from '../types/document';

export const defaultCVOptions: CVProcessingOptions = {
  grayscale: false,
  binarization: false,
  binarizeThreshold: 140,
  contrast: 1.15,
  brightness: 5,
  noiseReduction: false,
  deskewAngle: 0,
  rotationStep: 0,
  edgeDetection: false,
};

/**
 * Apply Computer Vision transformations to an Image / Canvas
 */
export function processImageOnCanvas(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  options: CVProcessingOptions
): void {
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const originalWidth = sourceImage.width;
  const originalHeight = sourceImage.height;

  // Handle rotation step (90, 180, 270)
  const isPerpendicular = options.rotationStep === 90 || options.rotationStep === 270;
  targetCanvas.width = isPerpendicular ? originalHeight : originalWidth;
  targetCanvas.height = isPerpendicular ? originalWidth : originalHeight;

  ctx.save();
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  // Center coordinate translation for rotation
  ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);

  // Apply 90-degree step rotation + fine deskew angle
  const totalRadians = ((options.rotationStep + options.deskewAngle) * Math.PI) / 180;
  ctx.rotate(totalRadians);

  // Draw source image centered
  ctx.drawImage(
    sourceImage,
    -originalWidth / 2,
    -originalHeight / 2,
    originalWidth,
    originalHeight
  );

  ctx.restore();

  // If no pixel-level filter is active, return early
  const needsPixelFilter =
    options.grayscale ||
    options.binarization ||
    options.contrast !== 1.0 ||
    options.brightness !== 0 ||
    options.noiseReduction ||
    options.edgeDetection;

  if (!needsPixelFilter) return;

  const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  const data = imageData.data;
  const width = targetCanvas.width;
  const height = targetCanvas.height;

  // Noise reduction (3x3 smoothing pass) if active
  if (options.noiseReduction) {
    applyBoxBlur(data, width, height);
  }

  // Edge detection (Sobel filter) if active
  if (options.edgeDetection) {
    applySobelFilter(data, width, height);
    ctx.putImageData(imageData, 0, 0);
    return;
  }

  const contrastFactor = options.contrast;
  const brightness = options.brightness;
  const binarize = options.binarization;
  const threshold = options.binarizeThreshold;
  const grayscale = options.grayscale || binarize;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Grayscale luminance conversion (ITU-R BT.601)
    if (grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    // Contrast & Brightness adjustment
    if (contrastFactor !== 1.0 || brightness !== 0) {
      r = (r - 128) * contrastFactor + 128 + brightness;
      g = (g - 128) * contrastFactor + 128 + brightness;
      b = (b - 128) * contrastFactor + 128 + brightness;
    }

    // Adaptive Binarization (Otsu / Thresholding for paper cleanup)
    if (binarize) {
      const grayVal = 0.299 * r + 0.587 * g + 0.114 * b;
      const binVal = grayVal > threshold ? 255 : 18; // Crisp dark ink vs clean paper
      r = binVal;
      g = binVal;
      b = binVal;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);
}

// 3x3 Box blur noise reduction filter
function applyBoxBlur(data: Uint8ClampedArray, width: number, height: number): void {
  const copy = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          rSum += copy[idx];
          gSum += copy[idx + 1];
          bSum += copy[idx + 2];
        }
      }

      const targetIdx = (y * width + x) * 4;
      data[targetIdx] = rSum / 9;
      data[targetIdx + 1] = gSum / 9;
      data[targetIdx + 2] = bSum / 9;
    }
  }
}

// Sobel edge filter to isolate text contours & document boundaries
function applySobelFilter(data: Uint8ClampedArray, width: number, height: number): void {
  const copy = new Uint8ClampedArray(data);

  // Convert copy to grayscale first
  const gray = new Float32Array(width * height);
  for (let i = 0; i < copy.length; i += 4) {
    gray[i / 4] = 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
  }

  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sumX = 0;
      let sumY = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const kernelIdx = (dy + 1) * 3 + (dx + 1);
          const pixelVal = gray[(y + dy) * width + (x + dx)];
          sumX += gx[kernelIdx] * pixelVal;
          sumY += gy[kernelIdx] * pixelVal;
        }
      }

      const mag = Math.min(255, Math.sqrt(sumX * sumX + sumY * sumY));
      const idx = (y * width + x) * 4;
      // High contrast glowing neon cyan/blue edge
      data[idx] = mag > 50 ? 14 : 10;
      data[idx + 1] = mag > 50 ? 210 : 15;
      data[idx + 2] = mag > 50 ? 245 : 30;
      data[idx + 3] = 255;
    }
  }
}
