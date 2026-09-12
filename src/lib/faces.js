/**
 * Browser-side face recognition.
 *
 * Uses face-api.js (TensorFlow.js under the hood) loaded from a CDN. Runs
 * entirely in the browser — no server, no GPU box, no per-image API cost.
 *
 * HOW IT WORKS
 *   1. Photographer clicks "Index faces". Their browser loads each photo,
 *      finds every face, and turns each one into a 128-number descriptor.
 *      Descriptors are saved on the Photo record as JSON.
 *   2. Guest takes a selfie. Their browser computes one descriptor the same
 *      way, pulls the event's descriptors, and compares by Euclidean
 *      distance. Under THRESHOLD = same person.
 *
 * HONEST LIMITS
 *   - Indexing runs at roughly 1–3 photos/second on a laptop. Fine for a few
 *     hundred photos; an 8,000-photo wedding is ~1 hour with the tab open.
 *     That is exactly what the server-side worker is for later.
 *   - face-api descriptors are 128-d (ArcFace/InsightFace uses 512-d and is
 *     more accurate). Good enough to validate the product, not the final
 *     answer for production.
 *   - The tab must stay open while indexing.
 */

const CDN = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15';
const MODELS = `${CDN}/model`;

/** Euclidean distance below this = same person. Lower is stricter. */
export const THRESHOLD = 0.52;

let loadPromise = null;

/** Load the library + models once, lazily. */
export function loadFaceApi() {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    if (!window.faceapi) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `${CDN}/dist/face-api.js`;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Could not load the face recognition library.'));
        document.head.appendChild(s);
      });
    }
    const faceapi = window.faceapi;
    await faceapi.tf.setBackend('webgl').catch(() => faceapi.tf.setBackend('cpu'));
    await faceapi.tf.ready();
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS),
    ]);
    return faceapi;
  })();

  return loadPromise;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

/**
 * Find every face in an image and return an array of 128-number descriptors.
 * `src` should be a reasonably sized image — pass a Cloudinary preview URL,
 * not the full-resolution original.
 */
export async function describeAll(src) {
  const faceapi = await loadFaceApi();
  const img = await loadImage(src);
  const results = await faceapi
    .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 }))
    .withFaceLandmarks()
    .withFaceDescriptors();
  return results.map((r) => Array.from(r.descriptor));
}

/**
 * Describe the single largest face in an image — used for the guest selfie.
 * Returns null if no face is found.
 */
export async function describeOne(src) {
  const faceapi = await loadFaceApi();
  const img = await loadImage(src);
  const result = await faceapi
    .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  return result ? Array.from(result.descriptor) : null;
}

export function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/**
 * Match one selfie descriptor against photos.
 * `photos` are Photo records whose `face_data` holds a JSON array of
 * descriptor arrays. Returns matching photos, closest first.
 */
export function matchPhotos(selfie, photos, threshold = THRESHOLD) {
  const hits = [];
  for (const p of photos) {
    if (!p.face_data) continue;
    let faces;
    try { faces = JSON.parse(p.face_data); } catch { continue; }
    let best = Infinity;
    for (const f of faces) {
      const d = distance(selfie, f);
      if (d < best) best = d;
    }
    if (best <= threshold) hits.push({ photo: p, score: best });
  }
  hits.sort((a, b) => a.score - b.score);
  return hits.map((h) => h.photo);
}
