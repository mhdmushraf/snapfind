/**
 * Photo upload queue.
 *
 * PHASE 2 (now): uploads through Base44's Core.UploadFile integration.
 * Good for pilot events of a few hundred photos. Each file costs one
 * integration credit, so this is NOT the shape for 8,000-photo weddings.
 *
 * PHASE 2b (when Cloudflare R2 is set up): replace `uploadOne` with a
 * presigned PUT straight to R2. Nothing else in this file changes — the
 * queue, concurrency, retry and progress reporting all stay as they are.
 */
import { base44 } from '@/api/base44Client';

const CONCURRENCY = 4;
const MAX_RETRIES = 2;

async function uploadOne(file) {
  const { file_url } = await base44.integrations.Core.UploadFile({ file });
  return file_url;
}

function readDimensions(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve({ width: 0, height: 0 }); };
    img.src = url;
  });
}

/**
 * Upload `files` for an event, creating a Photo record per file.
 * Calls onProgress({ done, total, failed }) as it goes.
 * Returns { uploaded, failed }.
 */
export async function uploadPhotos({ files, eventId, studioId, onProgress }) {
  const total = files.length;
  let done = 0;
  let failed = 0;
  const queue = [...files.entries()];

  const worker = async () => {
    while (queue.length) {
      const [index, file] = queue.shift();
      let attempt = 0;
      while (attempt <= MAX_RETRIES) {
        try {
          const [url, dims] = await Promise.all([uploadOne(file), readDimensions(file)]);
          await base44.entities.Photo.create({
            event_id: eventId,
            studio_id: studioId,
            r2_key: url,
            original_filename: file.name,
            file_size: file.size,
            width: dims.width,
            height: dims.height,
            status: 'uploaded',
            sort_order: index,
          });
          break;
        } catch (err) {
          attempt++;
          if (attempt > MAX_RETRIES) { failed++; break; }
          await new Promise((r) => setTimeout(r, 400 * attempt));
        }
      }
      done++;
      onProgress?.({ done, total, failed });
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));
  return { uploaded: done - failed, failed };
}

export const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic';
export const MAX_FILE_MB = 50;

export function validateFiles(fileList) {
  const files = Array.from(fileList);
  const ok = [];
  const rejected = [];
  for (const f of files) {
    if (!f.type.startsWith('image/')) { rejected.push([f.name, 'not an image']); continue; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) { rejected.push([f.name, `over ${MAX_FILE_MB} MB`]); continue; }
    ok.push(f);
  }
  return { ok, rejected };
}
