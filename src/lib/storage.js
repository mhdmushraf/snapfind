/**
 * Storage configuration.
 *
 * WHY THIS EXISTS: photos must NOT go through Base44's UploadFile
 * integration — that costs one integration credit per file and would drain
 * the Elite plan that the rest of the studio's apps depend on. Files go
 * straight from the browser to a third-party store; Base44 only ever stores
 * the resulting URL in a Photo record (entity writes are database
 * operations, not integration credits).
 *
 * ── SETUP (5 minutes, free) ──────────────────────────────────────────────
 * 1. Sign up at cloudinary.com (free tier: 25 GB storage, 25 GB/month
 *    bandwidth — roughly 3,000 wedding photos).
 * 2. Dashboard → note your "Cloud name".
 * 3. Settings → Upload → Upload presets → "Add upload preset".
 *      - Signing mode: **Unsigned**
 *      - Folder: snapfind
 *      - Save, then copy the preset name.
 * 4. Paste both values below and publish.
 *
 * Unsigned presets are safe for this: they can only create files in the
 * folder you set, and carry no account credentials. Anyone who inspects the
 * page can upload to that folder, which is the accepted trade-off for
 * browser-direct uploads. Turn on Cloudinary's rate limiting if abused.
 *
 * ── LATER, AT SCALE ──────────────────────────────────────────────────────
 * Move to Cloudflare R2 (10 GB free, zero egress fees). Only `uploadOne` in
 * src/lib/upload.js changes — it becomes a presigned PUT. The queue,
 * retries, progress and Photo records all stay exactly as they are.
 */

export const STORAGE = {
  provider: 'cloudinary',
  cloudName: 'ves1ve5j',
  uploadPreset: '',   // ← paste your unsigned upload preset name here
};

export const storageReady = () =>
  Boolean(STORAGE.cloudName && STORAGE.uploadPreset);

/** Cloudinary can resize and compress on the fly — free, and saves bandwidth. */
export const thumbUrl = (url, w = 400) =>
  url?.includes('/upload/')
    ? url.replace('/upload/', `/upload/c_fill,w_${w},h_${w},q_auto,f_auto/`)
    : url;

export const previewUrl = (url, w = 1600) =>
  url?.includes('/upload/')
    ? url.replace('/upload/', `/upload/c_limit,w_${w},q_auto,f_auto/`)
    : url;
