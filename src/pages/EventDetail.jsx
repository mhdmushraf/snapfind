import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Upload, Loader2, Images, QrCode as QrIcon, Settings2, Trash2,
  Check, Copy, ExternalLink, AlertTriangle, X, Heart, Download, ScanFace,
  Scissors, Users, Eye, EyeOff,
} from 'lucide-react';
import Logo from '@/components/Logo';
import QRCode from '@/components/QRCode';
import { uploadPhotos, validateFiles, ACCEPTED, MAX_FILE_MB, StorageNotConfigured } from '@/lib/upload';
import { storageReady, thumbUrl, previewUrl } from '@/lib/storage';
import { ensureStudio } from '@/lib/studio';
import { guestUrl } from '@/lib/config';
import { describeAll, analyzePhoto } from '@/lib/faces';
import { hammingDistance, DUPLICATE_BITS, CULL_BELOW } from '@/lib/quality';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const [event, setEvent] = useState(null);
  const [studio, setStudio] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selects, setSelects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('photos');
  const [progress, setProgress] = useState(null);
  const [rejected, setRejected] = useState([]);
  const [copied, setCopied] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [indexing, setIndexing] = useState(null);
  const [indexError, setIndexError] = useState('');

  const load = useCallback(async () => {
    try {
      const e = await base44.entities.Event.get(id);
      setEvent(e);
      const [s, p, f, g] = await Promise.all([
        base44.entities.Studio.filter({ id: e.studio_id }),
        base44.entities.Photo.filter({ event_id: id }, 'sort_order', 200),
        base44.entities.Favorite.filter({ event_id: id }),
        base44.entities.GuestSession.filter({ event_id: id }, '-created_date', 100),
      ]);
      setStudio(s?.[0] || null);
      setPhotos(p || []);
      setSelects(f || []);
      setSessions(g || []);
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const onPick = async (e) => {
    const { ok, rejected: bad } = validateFiles(e.target.files);
    setRejected(bad);
    e.target.value = '';
    if (!ok.length) return;

    setProgress({ done: 0, total: ok.length, failed: 0 });
    try {
      await base44.entities.Event.update(id, { status: 'uploading' });

      const { uploaded } = await uploadPhotos({
        files: ok,
        eventId: id,
        studioId: event.studio_id,
        onProgress: setProgress,
      });

      const newCount = (event.photo_count || 0) + uploaded;
      await base44.entities.Event.update(id, {
        photo_count: newCount,
        status: newCount > 0 ? 'live' : 'draft',
      });
      if (studio) {
        await base44.entities.Studio.update(studio.id, {
          photo_credits: Math.max(0, (studio.photo_credits || 0) - uploaded),
        });
      }
    } catch (err) {
      if (err instanceof StorageNotConfigured) setStorageError(true);
      await base44.entities.Event.update(id, { status: event.photo_count > 0 ? 'live' : 'draft' });
    } finally {
      setProgress(null);
      load();
    }
  };

  const runIndexing = async () => {
    const todo = photos.filter((p) => !p.indexed);
    if (!todo.length) return;
    setIndexError('');
    setIndexing({ done: 0, total: todo.length, faces: 0 });
    await base44.entities.Event.update(id, { status: 'processing', photos_processed: 0 });

    let faces = 0;
    let done = 0;
    const hashes = photos.filter((p) => p.image_hash).map((p) => ({ id: p.id, hash: p.image_hash, quality: p.quality_score || 0 }));

    try {
      for (const p of todo) {
        try {
          const a = await analyzePhoto(previewUrl(p.r2_key, 1200));
          faces += a.faceCount;

          // Near-duplicate check against everything seen so far
          let dupOf = null;
          for (const h of hashes) {
            if (hammingDistance(a.hash, h.hash) <= DUPLICATE_BITS) {
              dupOf = a.quality > h.quality ? null : h.id;
              break;
            }
          }
          hashes.push({ id: p.id, hash: a.hash, quality: a.quality });

          await base44.entities.Photo.update(p.id, {
            face_data: JSON.stringify(a.descriptors),
            face_count: a.faceCount,
            blur_score: a.blur,
            eyes_closed: a.eyesClosed,
            image_hash: a.hash,
            quality_score: a.quality,
            duplicate_of: dupOf || '',
            indexed: true,
            status: 'processed',
          });
        } catch {
          await base44.entities.Photo.update(p.id, { indexed: true, status: 'failed' }).catch(() => {});
        }
        done++;
        setIndexing({ done, total: todo.length, faces });
        if (done % 10 === 0) {
          await base44.entities.Event.update(id, { photos_processed: done, faces_indexed: faces });
        }
      }
      await base44.entities.Event.update(id, {
        status: 'live',
        photos_processed: (event.photo_count || 0),
        faces_indexed: faces,
      });
    } catch (err) {
      setIndexError(err?.message || 'Indexing stopped unexpectedly.');
      await base44.entities.Event.update(id, { status: 'live' }).catch(() => {});
    } finally {
      setIndexing(null);
      load();
    }
  };

  const patch = async (fields) => {
    setEvent((e) => ({ ...e, ...fields }));
    await base44.entities.Event.update(id, fields);
  };

  const remove = async () => {
    if (!confirm('Delete this event and all its photos? This cannot be undone.')) return;
    await Promise.all(photos.map((p) => base44.entities.Photo.delete(p.id).catch(() => {})));
    await base44.entities.Event.delete(id);
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Event not found.</p>
        <Link to="/dashboard" className="text-accent font-medium hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const url = guestUrl(event.qr_slug);
  const unindexed = photos.filter((p) => !p.indexed).length;
  const suggested = photos.filter(
    (p) => !p.culled && p.indexed && ((p.quality_score ?? 100) < CULL_BELOW || p.eyes_closed || p.duplicate_of)
  );
  const culledCount = photos.filter((p) => p.culled).length;
  const missed = sessions.filter((s) => s.match_count === 0);

  return (
    <div className="min-h-screen bg-secondary/25">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo to="/dashboard" />
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> All events
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-7">
          <div>
            <h1 className="font-heading text-3xl font-bold">{event.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {(event.photo_count || 0).toLocaleString('en-IN')} photos
              {event.venue && ` · ${event.venue}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileInput.current?.click()}
              disabled={!!progress || !!indexing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              <Upload className="w-4 h-4" /> Upload photos
            </button>
            {unindexed > 0 && (
              <button
                onClick={runIndexing}
                disabled={!!progress || !!indexing}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                <ScanFace className="w-4 h-4" /> Index {unindexed} face{unindexed > 1 ? 's' : ''}
              </button>
            )}
            <input ref={fileInput} type="file" multiple accept={ACCEPTED} onChange={onPick} className="hidden" />
          </div>
        </div>

        {(!storageReady() || storageError) && (
          <div className="mb-6 rounded-2xl bg-accent/5 border border-accent/30 p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Photo storage isn't set up yet</p>
              <p className="mt-1 text-muted-foreground">
                Photos upload straight from the browser to Cloudinary, so they never touch your
                Base44 credits. Create a free Cloudinary account, add an <em>unsigned</em> upload
                preset, and paste the cloud name and preset into <code className="text-xs bg-muted px-1 py-0.5 rounded">src/lib/storage.js</code>.
                Full instructions are in that file.
              </p>
            </div>
          </div>
        )}

        {indexing && (
          <div className="mb-6 rounded-2xl bg-background border border-border p-5">
            <div className="flex justify-between text-sm font-medium">
              <span className="inline-flex items-center gap-2"><ScanFace className="w-4 h-4 text-accent" /> Finding faces…</span>
              <span>{indexing.done} of {indexing.total}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(indexing.done / indexing.total) * 100}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {indexing.faces} faces found so far. This runs in your browser — keep this tab open and
              on screen. Roughly 1–3 photos a second.
            </p>
          </div>
        )}

        {indexError && (
          <div className="mb-6 rounded-2xl bg-destructive/5 border border-destructive/20 p-4 text-sm">
            {indexError}
          </div>
        )}

        {!indexing && unindexed === 0 && photos.length > 0 && (
          <div className="mb-6 rounded-2xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3 text-sm">
            <ScanFace className="w-4 h-4 text-primary shrink-0" />
            <span>
              All {photos.length} photos indexed · {photos.reduce((n, p) => n + (p.face_count || 0), 0)} faces found.
              Guests can now find themselves by selfie.
            </span>
          </div>
        )}

        {progress && (
          <div className="mb-6 rounded-2xl bg-background border border-border p-5">
            <div className="flex justify-between text-sm font-medium">
              <span>Uploading…</span>
              <span>{progress.done} of {progress.total}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
            {progress.failed > 0 && (
              <p className="mt-2 text-xs text-destructive">{progress.failed} failed — they'll be skipped.</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Keep this tab open until it finishes.</p>
          </div>
        )}

        {rejected.length > 0 && (
          <div className="mb-6 rounded-2xl bg-destructive/5 border border-destructive/20 p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{rejected.length} file{rejected.length > 1 ? 's' : ''} skipped</p>
              <ul className="mt-1 text-xs text-muted-foreground space-y-0.5">
                {rejected.slice(0, 5).map(([n, why]) => <li key={n}>{n} — {why}</li>)}
              </ul>
            </div>
            <button onClick={() => setRejected([])} className="p-1 rounded hover:bg-background"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            ['photos', 'Photos', Images],
            ['review', `Review${suggested.length ? ` (${suggested.length})` : ''}`, Scissors],
            ['selects', `Selects${selects.length ? ` (${selects.length})` : ''}`, Heart],
            ['guests', `Guests${sessions.length ? ` (${sessions.length})` : ''}`, Users],
            ['share', 'Share', QrIcon],
            ['settings', 'Settings', Settings2],
          ].map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${
                tab === k ? 'border-accent text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === 'photos' && (
          photos.length === 0 ? (
            <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
              <Images className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-xl font-bold">No photos yet</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Upload JPEG, PNG, WebP or HEIC, up to {MAX_FILE_MB} MB each. Start with a small batch to check it works.
              </p>
              <button
                onClick={() => fileInput.current?.click()}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
              >
                <Upload className="w-4 h-4" /> Choose photos
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {photos.map((p) => (
                  <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={thumbUrl(p.r2_key, 400)} alt={p.original_filename} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {event.photo_count > photos.length && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Showing the first {photos.length} of {event.photo_count.toLocaleString('en-IN')}.
                </p>
              )}
            </>
          )
        )}

        {tab === 'selects' && (
          selects.length === 0 ? (
            <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
              <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-xl font-bold">No selects yet</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                When guests tap the heart on a photo, it shows up here. Useful for album shortlists —
                the couple picks, you don't chase screenshots.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {selects.length} photo{selects.length > 1 ? 's' : ''} saved by guests
                </p>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(selects.map((s) => s.photo_url).join('\n'))}`}
                  download={`${event.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-selects.txt`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
                >
                  <Download className="w-4 h-4" /> Export list
                </a>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {selects.map((s) => (
                  <a
                    key={s.id} href={s.photo_url} target="_blank" rel="noreferrer"
                    className="aspect-square rounded-xl overflow-hidden bg-muted block relative group"
                  >
                    <img src={thumbUrl(s.photo_url, 400)} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <Heart className="absolute top-2 right-2 w-4 h-4 fill-accent text-accent drop-shadow" />
                  </a>
                ))}
              </div>
            </>
          )
        )}

        {tab === 'share' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-background border border-border p-6 flex flex-col items-center">
              <QRCode value={url} size={220} className="border border-border" />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Print on table cards. Guests scan and find their own photos.
              </p>
            </div>
            <div className="rounded-2xl bg-background border border-border p-6">
              <h3 className="font-semibold">Gallery link</h3>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                <span className="flex-1 text-xs truncate font-mono">{url}</span>
                <button
                  onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-background transition"
                >
                  {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <a
                href={url} target="_blank" rel="noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-border font-medium hover:border-foreground/40 transition"
              >
                <ExternalLink className="w-4 h-4" /> Preview as a guest
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Photos from ${event.name} are ready. Find yours here: ${url}`)}`}
                target="_blank" rel="noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-xl space-y-3">
            {[
              ['allow_full_gallery', 'Let guests browse all photos', 'Otherwise they only see their own matches.'],
              ['allow_download', 'Allow full-resolution downloads', 'Off means watermarked previews only.'],
              ['watermark_previews', 'Watermark previews', 'Your studio watermark on every preview image.'],
            ].map(([key, label, help]) => (
              <label key={key} className="flex items-start gap-3 rounded-2xl bg-background border border-border p-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!event[key]}
                  onChange={(e) => patch({ [key]: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[hsl(var(--accent))]"
                />
                <span>
                  <span className="block font-medium text-sm">{label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{help}</span>
                </span>
              </label>
            ))}

            <div className="rounded-2xl bg-background border border-border p-5">
              <label className="block">
                <span className="text-sm font-medium">Gallery password</span>
                <span className="block text-xs text-muted-foreground mt-0.5 mb-2.5">Optional. Leave blank for open access.</span>
                <input
                  defaultValue={event.password || ''}
                  onBlur={(e) => patch({ password: e.target.value })}
                  className="input" placeholder="No password"
                />
              </label>
            </div>

            <div className="rounded-2xl bg-background border border-border p-5">
              <label className="block">
                <span className="text-sm font-medium">Gallery closes on</span>
                <span className="block text-xs text-muted-foreground mt-0.5 mb-2.5">Photos and face data are deleted after this date.</span>
                <input
                  type="date"
                  defaultValue={event.expires_on || ''}
                  onBlur={(e) => patch({ expires_on: e.target.value })}
                  className="input"
                />
              </label>
            </div>

            <button
              onClick={remove}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-destructive/30 text-destructive font-medium hover:bg-destructive/5 transition"
            >
              <Trash2 className="w-4 h-4" /> Delete this event
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
