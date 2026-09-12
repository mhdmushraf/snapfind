import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Camera, Loader2, ShieldCheck, Images, Clock, Lock, Heart, Download,
  MessageCircle, ArrowLeft, X,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import SelfieCapture from '@/components/SelfieCapture';
import { thumbUrl, previewUrl } from '@/lib/storage';
import { describeOne, matchPhotos } from '@/lib/faces';

/** Stable anonymous id per browser, so a guest can unstar their own picks. */
function deviceId() {
  const KEY = 'snapfind_device';
  let id = null;
  try { id = window.localStorage.getItem(KEY); } catch { /* private mode */ }
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { window.localStorage.setItem(KEY, id); } catch { /* ignore */ }
  }
  return id;
}

const downloadUrl = (url) =>
  url?.includes('/upload/') ? url.replace('/upload/', '/upload/fl_attachment/') : url;

export default function GuestGallery() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [studio, setStudio] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [favs, setFavs] = useState({});           // photoId -> favoriteId
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [camera, setCamera] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);   // null = not searched, [] = no match
  const [searchError, setSearchError] = useState('');

  const load = useCallback(async () => {
    try {
      const found = await base44.entities.Event.filter({ qr_slug: slug });
      const e = found?.[0];
      setEvent(e || null);
      if (!e) return;
      if (!e.password) setUnlocked(true);

      const [s, p, f] = await Promise.all([
        e.studio_id ? base44.entities.Studio.filter({ id: e.studio_id }) : [],
        base44.entities.Photo.filter({ event_id: e.id }, 'sort_order', 200),
        base44.entities.Favorite.filter({ event_id: e.id, device_id: deviceId() }),
      ]);
      setStudio(s?.[0] || null);
      setPhotos(p || []);
      setFavs(Object.fromEntries((f || []).map((x) => [x.photo_id, x.id])));
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const toggleFav = async (photo) => {
    const existing = favs[photo.id];
    if (existing) {
      setFavs((f) => { const n = { ...f }; delete n[photo.id]; return n; });
      await base44.entities.Favorite.delete(existing).catch(() => {});
    } else {
      setFavs((f) => ({ ...f, [photo.id]: 'pending' }));
      try {
        const created = await base44.entities.Favorite.create({
          event_id: event.id,
          photo_id: photo.id,
          photo_url: photo.r2_key,
          device_id: deviceId(),
        });
        setFavs((f) => ({ ...f, [photo.id]: created.id }));
      } catch {
        setFavs((f) => { const n = { ...f }; delete n[photo.id]; return n; });
      }
    }
  };

  const onSelfie = async ({ url }) => {
    setCamera(false);
    setSearching(true);
    setSearchError('');
    try {
      const descriptor = await describeOne(url);
      if (!descriptor) {
        setSearchError("We couldn't find a face in that photo. Try again in better light, facing the camera.");
        setSearching(false);
        return;
      }
      const indexed = photos.filter((p) => p.face_data);
      if (!indexed.length) {
        setSearchError('This gallery has not been indexed yet. Ask your photographer to run face indexing.');
        setSearching(false);
        return;
      }
      const matches = matchPhotos(descriptor, indexed);
      setResults(matches);
      base44.entities.GuestSession.create({
        event_id: event.id,
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        matched_photo_ids: matches.map((m) => m.id),
        match_count: matches.length,
      }).catch(() => {});
    } catch (err) {
      setSearchError(err?.message || 'Something went wrong while searching. Try again.');
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!event) {
    return (
      <Shell>
        <h1 className="font-heading text-2xl font-bold">Gallery not found</h1>
        <p className="mt-2 text-muted-foreground">
          This link may have expired, or the code was mistyped. Check with your photographer.
        </p>
      </Shell>
    );
  }

  /* ---- password gate ---- */
  if (event.password && !unlocked) {
    return (
      <Shell studio={studio}>
        <div className="rounded-2xl border border-border bg-background p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-heading text-xl font-bold">{event.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">This gallery is password protected.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwInput === event.password) { setUnlocked(true); setPwError(false); }
              else setPwError(true);
            }}
            className="mt-5"
          >
            <input
              autoFocus type="password" value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              className="input text-center" placeholder="Enter password"
            />
            {pwError && <p className="mt-2 text-sm text-destructive">That's not right. Try again.</p>}
            <button type="submit" className="mt-4 w-full py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
              Open gallery
            </button>
          </form>
        </div>
      </Shell>
    );
  }

  const notReady = event.status === 'draft' || (event.status === 'uploading' && photos.length === 0);
  const indexing = event.status === 'processing';
  const expired = event.status === 'expired';
  const favCount = Object.keys(favs).length;

  /* ---- full gallery view ---- */
  if (browsing) {
    return (
      <Shell studio={studio} wide>
        <button onClick={() => setBrowsing(false)} className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold">{event.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{photos.length} photos</p>
          </div>
          {favCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <Heart className="w-4 h-4 fill-current" /> {favCount} saved
            </span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photos.map((p) => (
            <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
              <button onClick={() => setLightbox(p)} className="w-full h-full">
                <img src={thumbUrl(p.r2_key, 400)} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>
              <button
                onClick={() => toggleFav(p)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/85 backdrop-blur hover:bg-background transition"
                aria-label={favs[p.id] ? 'Remove from selects' : 'Save photo'}
              >
                <Heart className={`w-4 h-4 ${favs[p.id] ? 'fill-accent text-accent' : 'text-foreground'}`} />
              </button>
            </div>
          ))}
        </div>

        {favCount > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Your {favCount} saved photo{favCount > 1 ? 's are' : ' is'} shared with {studio?.name || 'the studio'} as your picks.
          </p>
        )}

        {lightbox && (
          <Lightbox
            photo={lightbox}
            allowDownload={event.allow_download}
            isFav={!!favs[lightbox.id]}
            onFav={() => toggleFav(lightbox)}
            onClose={() => setLightbox(null)}
          />
        )}
      </Shell>
    );
  }

  /* ---- landing ---- */
  return (
    <Shell studio={studio}>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold">{event.name}</h1>
      {event.venue && <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>}

      {expired ? (
        <Notice icon={Clock} title="This gallery has closed">
          The photographer set an end date for this event. Get in touch with {studio?.name || 'the studio'} if you still need your photos.
        </Notice>
      ) : notReady ? (
        <Notice icon={Images} title="Photos aren't up yet">
          {studio?.name || 'The studio'} is still uploading. Scan this code again after the event and your photos will be here.
        </Notice>
      ) : indexing ? (
        <Notice icon={Loader2} title="Finding faces now" spin>
          {(event.photos_processed || 0).toLocaleString('en-IN')} of {(event.photo_count || 0).toLocaleString('en-IN')} photos done.
          Come back in a few minutes.
        </Notice>
      ) : (
        <div className="mt-7">
          <div className="rounded-2xl border border-border bg-background p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-heading text-lg font-semibold">Take a selfie to find your photos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We compare it against {(event.photo_count || photos.length).toLocaleString('en-IN')} photos and show you only the ones you're in.
            </p>

            <label className="mt-5 flex items-start gap-3 text-left cursor-pointer">
              <input
                type="checkbox" checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[hsl(var(--accent))]"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to Snapfind using my selfie once to find my photos. I understand the selfie is deleted
                within 24 hours and my face data is deleted when this gallery closes.
                <span className="block mt-1">
                  എന്റെ ഫോട്ടോകൾ കണ്ടെത്താൻ എന്റെ സെൽഫി ഒരിക്കൽ ഉപയോഗിക്കുന്നതിന് ഞാൻ സമ്മതിക്കുന്നു.
                </span>
              </span>
            </label>

            <button
              disabled={!consent}
              onClick={() => setCamera(true)}
              className="mt-5 w-full py-3.5 rounded-full bg-accent text-accent-foreground font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Open camera
            </button>
            {searched && (
              <div className="mt-4 rounded-xl bg-secondary/60 p-4 text-left">
                <p className="text-sm font-medium">Selfie received</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Face matching isn't switched on for this gallery yet. Browse all the photos below —
                  your photographer will enable matching soon.
                </p>
              </div>
            )}
            {!searched && (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Your selfie is used once and deleted within 24 hours.
              </p>
            )}
          </div>

          {event.allow_full_gallery && photos.length > 0 && (
            <button
              onClick={() => setBrowsing(true)}
              className="mt-4 w-full py-3 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
            >
              Or browse all {(event.photo_count || photos.length).toLocaleString('en-IN')} photos
            </button>
          )}
        </div>
      )}

      {studio?.phone && (
        <a
          href={`https://wa.me/${studio.phone.replace(/\D/g, '')}`}
          target="_blank" rel="noreferrer"
          className="mt-6 flex items-center justify-center gap-2 py-3 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" /> Message {studio.name}
        </a>
      )}

      <div className="mt-8 flex items-start gap-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <span>
          Selfies are deleted within 24 hours. Face data is deleted when this gallery closes.
          We never sell or share it.
        </span>
      </div>

      {camera && <SelfieCapture onCapture={onSelfie} onClose={() => setCamera(false)} />}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */

function Lightbox({ photo, allowDownload, isFav, onFav, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/90 flex flex-col" onClick={onClose}>
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="p-2 rounded-full bg-background/15 text-background hover:bg-background/25 transition" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        <img src={previewUrl(photo.r2_key)} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
      </div>
      <div className="p-4 flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onFav}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-background font-medium text-sm"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-accent text-accent' : ''}`} /> {isFav ? 'Saved' : 'Save'}
        </button>
        {allowDownload && (
          <a
            href={downloadUrl(photo.r2_key)}
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        )}
      </div>
    </div>
  );
}

function Shell({ studio, children, wide }) {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <div className={`flex-1 px-5 py-10 ${wide ? '' : 'flex items-center justify-center'}`}>
        <div className={`w-full mx-auto ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
          <div className="flex items-center gap-2.5 mb-6">
            {studio?.logo_url
              ? <img src={thumbUrl(studio.logo_url, 200)} alt={studio.name} className="h-10 w-auto max-w-[10rem] object-contain" />
              : <><LogoMark size={34} /><span className="font-heading font-bold">{studio?.name || 'Snapfind'}</span></>}
          </div>
          {children}
        </div>
      </div>
      <footer className="py-5 text-center text-[11px] text-muted-foreground">
        Powered by Snapfind
      </footer>
    </div>
  );
}

function Notice({ icon: Icon, title, children, spin }) {
  return (
    <div className="mt-7 rounded-2xl border border-border bg-background p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <Icon className={`w-5 h-5 text-primary ${spin ? 'animate-spin' : ''}`} />
      </div>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
