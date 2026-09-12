import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Camera, Loader2, ShieldCheck, Images, Clock } from 'lucide-react';
import { LogoMark } from '@/components/Logo';

/**
 * Guest-facing page. This is where the QR code lands.
 *
 * Phase 1: shows the event, the consent gate, and honest status.
 * Selfie capture and face search arrive with the worker (Phase 3) — until
 * then the page tells guests the truth rather than pretending to search.
 */
export default function GuestGallery() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const found = await base44.entities.Event.filter({ qr_slug: slug });
        const e = found?.[0];
        setEvent(e || null);
        if (e?.studio_id) {
          const s = await base44.entities.Studio.filter({ id: e.studio_id });
          setStudio(s?.[0] || null);
        }
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

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

  const notReady = event.status === 'draft' || event.status === 'uploading';
  const indexing = event.status === 'processing';
  const expired = event.status === 'expired';

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
              We compare it against {(event.photo_count || 0).toLocaleString('en-IN')} photos and show you only the ones you're in.
            </p>

            <label className="mt-5 flex items-start gap-3 text-left cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
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
              className="mt-5 w-full py-3.5 rounded-full bg-accent text-accent-foreground font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Open camera
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Face search goes live once your photographer finishes setup.
            </p>
          </div>

          {event.allow_full_gallery && (
            <button className="mt-4 w-full py-3 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
              Or browse all {(event.photo_count || 0).toLocaleString('en-IN')} photos
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex items-start gap-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <span>
          Selfies are deleted within 24 hours. Face data is deleted when this gallery closes.
          We never sell or share it.
        </span>
      </div>
    </Shell>
  );
}

function Shell({ studio, children }) {
  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-6">
            {studio?.logo_url
              ? <img src={studio.logo_url} alt="" className="h-9 w-auto" />
              : <LogoMark size={34} />}
            <span className="font-heading font-bold">{studio?.name || 'Snapfind'}</span>
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
