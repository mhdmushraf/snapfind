/**
 * Photo quality analysis for smart culling.
 *
 * Everything here runs on a canvas in the browser, alongside the face pass.
 * No extra model, no extra download, no extra cost — the image is already
 * decoded, so we may as well measure it.
 *
 *   blur       Laplacian variance. Low variance = few sharp edges = soft.
 *   eyesClosed Eye-aspect-ratio from the 68 landmarks face-api already gives.
 *   hash       64-bit average hash, for grouping near-identical burst frames.
 */

/** Draw an image into a small canvas and return its pixel data. */
function pixels(img, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size).data;
}

/**
 * Laplacian variance, normalised to roughly 0–100.
 * Sharp wedding frames land 40–90; visibly soft ones under 15.
 */
export function blurScore(img) {
  const S = 160;
  const data = pixels(img, S);
  const gray = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) {
    const o = i * 4;
    gray[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
  }

  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < S - 1; y++) {
    for (let x = 1; x < S - 1; x++) {
      const i = y * S + x;
      // 4-neighbour Laplacian kernel
      const lap = -4 * gray[i] + gray[i - 1] + gray[i + 1] + gray[i - S] + gray[i + S];
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  return Math.max(0, Math.min(100, Math.round(Math.sqrt(variance) * 4)));
}

/** 64-bit average hash as a hex string, for near-duplicate detection. */
export function averageHash(img) {
  const S = 8;
  const data = pixels(img, S);
  const gray = [];
  for (let i = 0; i < S * S; i++) {
    const o = i * 4;
    gray.push(0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]);
  }
  const avg = gray.reduce((a, b) => a + b, 0) / gray.length;
  let bits = '';
  for (const g of gray) bits += g > avg ? '1' : '0';
  let hex = '';
  for (let i = 0; i < 64; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex;
}

/** Number of differing bits between two average hashes. */
export function hammingDistance(a, b) {
  if (!a || !b || a.length !== b.length) return 64;
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { d += x & 1; x >>= 1; }
  }
  return d;
}

/** Frames within this many bits are treated as the same burst shot. */
export const DUPLICATE_BITS = 5;

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);

/**
 * Eye aspect ratio from face-api's 68-point landmarks.
 * Open eyes sit around 0.25–0.35; a blink drops below 0.18.
 */
function eyeAspect(eye) {
  if (!eye || eye.length < 6) return 1;
  const vertical = dist(eye[1], eye[5]) + dist(eye[2], eye[4]);
  const horizontal = 2 * dist(eye[0], eye[3]);
  return horizontal === 0 ? 1 : vertical / horizontal;
}

export const EYE_CLOSED_BELOW = 0.19;

/**
 * True if any detected face has both eyes closed.
 * `detections` are face-api results that include landmarks.
 */
export function anyEyesClosed(detections) {
  for (const d of detections) {
    const lm = d.landmarks;
    if (!lm) continue;
    const left = eyeAspect(lm.getLeftEye());
    const right = eyeAspect(lm.getRightEye());
    if (left < EYE_CLOSED_BELOW && right < EYE_CLOSED_BELOW) return true;
  }
  return false;
}

/**
 * Overall keep score, 0–100. Sharpness is most of it; closed eyes and
 * having no face at all pull it down.
 */
export function qualityScore({ blur, eyesClosed, faceCount }) {
  let score = blur;
  if (eyesClosed) score -= 30;
  if (faceCount === 0) score -= 15;
  return Math.max(0, Math.min(100, Math.round(score)));
}

/** Below this, a photo is suggested for culling (never auto-deleted). */
export const CULL_BELOW = 35;
