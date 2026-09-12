/**
 * Photo upload queue.
 *
 * Files go BROWSER → CLOUDINARY directly. They never pass through Base44,
 * so no integration credits are consumed. Base44 only stores the returned
 * URL in a Photo record, which is an ordinary database write.
 *
 * To move to Cloudflare R2 later, replace `uploadOne` with a presigned PUT.
 * Nothing else in this file needs to change.
 */
import { base44 } from '@/api/base44Client';
import { STORAGE, storageReady } from '@/lib/storage';

const CONCURRENCY = 4;
const MAX_RETRIES = 2;

export class StorageNotConfigured extends Error {
  constructor() {
    super('Photo storage is not set up yet. See src/lib/storage.js for the 5-minute setup.');
    this.name = 'StorageNotConfigured';
  }
}

async function uploadOne(file, eventId) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', STORAGE.uploadPreset);
  form.append('folder', `snapfind/${eventId}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${STORAGE.cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Upload failed (${res.status}) ${detail.slice(0, 120)}`);
  }
  const data = await res.json();
  return { url: data.secure_url, width: data.width, height: data.height };
}

/**
 * Upload `files` for an event, creating a Photo record per file.
 * Calls onProgress({ done, total, failed }) as it goes.
 */
export async function uploadPhotos({ files, eventId, studioId, onProgress }) {
  if (!storageReady()) throw new StorageNotConfigured();

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
          const { url, width, height } = await uploadOne(file, eventId);
          await base44.entities.Photo.create({
            event_id: eventId,
            studio_id: studioId,
            r2_key: url,
            original_filename: file.name,
            file_size: file.size,
            width,
            height,
            status: 'uploaded',
            sort_order: index,
          });
          break;
        } catch (err) {
          attempt++;
          if (attempt > MAX_RETRIES) { failed++; break; }
          await new Promise((r) => setTimeout(r, 500 * attempt));
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
