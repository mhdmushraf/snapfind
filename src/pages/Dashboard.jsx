import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Plus, LogOut, Calendar, MapPin, Images, Users, QrCode as QrIcon,
  Loader2, X, Copy, Check, ExternalLink, Sparkles, Settings2,
} from 'lucide-react';
import Logo from '@/components/Logo';
import QRCode from '@/components/QRCode';

const slug = () => Math.random().toString(36).slice(2, 10);
const guestUrl = (s) => `${window.location.origin}/g/${s}`;

const STATUS = {
  draft:      ['Draft', 'bg-muted text-muted-foreground'],
  uploading:  ['Uploading', 'bg-accent/15 text-accent'],
  processing: ['Indexing', 'bg-accent/15 text-accent'],
  live:       ['Live', 'bg-primary/10 text-primary'],
  expired:    ['Expired', 'bg-muted text-muted-foreground'],
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [studio, setStudio] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [qrFor, setQrFor] = useState(null);

  const load = useCallback(async () => {
    try {
      const me = await base44.auth.me();
      setUser(me);
      const studios = await base44.entities.Studio.filter({ created_by_id: me.id });
      const s = studios?.[0] || null;
      setStudio(s);
      if (s) {
        const list = await base44.entities.Event.filter({ studio_id: s.id }, '-event_date');
        setEvents(list || []);
      }
    } catch {
      // handled by ProtectedRoute
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const totalPhotos = events.reduce((n, e) => n + (e.photo_count || 0), 0);
  const liveCount = events.filter((e) => e.status === 'live').length;

  return (
    <div className="min-h-screen bg-secondary/25">
      {/* Top bar */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-muted-foreground mr-1">{studio?.name || user?.full_name}</span>
            <Link
              to="/studio-settings"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
            >
              <Settings2 className="w-4 h-4" /> <span className="hidden sm:inline">Studio</span>
            </Link>
            <button
              onClick={() => base44.auth.logout('/')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold">
              {events.length ? `${events.length} event${events.length > 1 ? 's' : ''}` : 'Your first event'}
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              {studio?.photo_credits?.toLocaleString('en-IN') ?? 0} photo credits left
              {studio?.plan === 'trial' && ' · free trial'}
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> New event
          </button>
        </div>

        {/* Stats */}
        {events.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              ['Events', events.length, Calendar],
              ['Live galleries', liveCount, Images],
              ['Photos uploaded', totalPhotos.toLocaleString('en-IN'), Images],
              ['Faces indexed', events.reduce((n, e) => n + (e.faces_indexed || 0), 0).toLocaleString('en-IN'), Users],
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-2xl bg-background border border-border p-5">
                <Icon className="w-5 h-5 text-accent mb-3" />
                <div className="font-heading text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Events */}
        {events.length === 0 ? (
          <EmptyState onCreate={() => setShowNew(true)} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <EventCard key={e.id} event={e} onQr={() => setQrFor(e)} />
            ))}
          </div>
        )}
      </main>

      {showNew && (
        <NewEventModal
          studio={studio}
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); load(); }}
        />
      )}
      {qrFor && <QrModal event={qrFor} studio={studio} onClose={() => setQrFor(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function EmptyState({ onCreate }) {
  return (
    <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
        <Sparkles className="w-6 h-6 text-accent" />
      </div>
      <h2 className="font-heading text-2xl font-bold">Create your first event</h2>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Name the wedding, pick the date, and Snapfind gives you a QR code to print on the table cards. Upload comes next.
      </p>
      <button
        onClick={onCreate}
        className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
      >
        <Plus className="w-4 h-4" /> New event
      </button>
    </div>
  );
}

function EventCard({ event, onQr }) {
  const [label, cls] = STATUS[event.status] || STATUS.draft;
  const pct = event.photo_count ? Math.round((event.photos_processed / event.photo_count) * 100) : 0;

  return (
    <div className="rounded-2xl bg-background border border-border p-5 hover:border-primary/40 transition">
      <Link to={`/event/${event.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold leading-snug hover:text-accent transition">{event.name}</h3>
          <span className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full font-semibold ${cls}`}>{label}</span>
        </div>
      </Link>

      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {event.event_date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
        {event.venue && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.venue}</div>}
        <div className="flex items-center gap-2">
          <Images className="w-3.5 h-3.5" /> {(event.photo_count || 0).toLocaleString('en-IN')} photos
        </div>
      </div>

      {event.status === 'processing' && (
        <div className="mt-4">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">{pct}% indexed</div>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <Link
          to={`/event/${event.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
        >
          Open
        </Link>
        <button
          onClick={onQr}
          className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-full border border-border hover:border-foreground/40 transition"
          aria-label="QR code"
        >
          <QrIcon className="w-4 h-4" />
        </button>
        <a
          href={guestUrl(event.qr_slug)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-full border border-border hover:border-foreground/40 transition"
          aria-label="Open guest gallery"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function NewEventModal({ studio, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', event_date: '', venue: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!studio) { setError('No studio found on your account. Try signing out and back in.'); return; }
    setSaving(true); setError('');
    try {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      await base44.entities.Event.create({
        studio_id: studio.id,
        name: form.name,
        event_date: form.event_date || null,
        venue: form.venue,
        qr_slug: slug(),
        status: 'draft',
        photo_count: 0,
        photos_processed: 0,
        faces_indexed: 0,
        allow_full_gallery: true,
        allow_download: false,
        watermark_previews: true,
        expires_on: expires.toISOString().slice(0, 10),
      });
      onCreated();
    } catch (err) {
      setError(err?.message || 'Could not create the event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose} title="New event">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Event name</span>
          <input
            autoFocus required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input mt-2" placeholder="Anjali &amp; Rahul — Wedding"
          />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Date</span>
            <input
              type="date" value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Venue</span>
            <input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input mt-2" placeholder="Le Meridien, Kochi"
            />
          </label>
        </div>
        {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
        <button
          type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create event <Plus className="w-4 h-4" /></>}
        </button>
      </form>
    </Modal>
  );
}

function QrModal({ event, studio, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = guestUrl(event.qr_slug);

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const svg = document.getElementById('qr-print')?.outerHTML || '';
    w.document.write(`
      <html><head><title>${event.name}</title>
      <style>
        body{font-family:system-ui,sans-serif;text-align:center;padding:60px}
        h1{font-size:22px;margin:0 0 4px}
        p{color:#666;font-size:13px;margin:0 0 24px}
        .small{margin-top:24px;font-size:12px;color:#888}
        svg{width:300px;height:300px}
      </style></head>
      <body>
        <h1>${event.name}</h1>
        <p>${studio?.name || ''}</p>
        ${svg}
        <div class="small">Scan · take a selfie · get your photos</div>
      </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <Modal onClose={onClose} title={event.name}>
      <div className="flex flex-col items-center">
        <div id="qr-print-wrap">
          <QRCode value={url} size={220} className="border border-border" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Print this on the table cards. Guests scan, take a selfie, and get only their photos.
        </p>
        <div className="mt-5 w-full flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
          <span className="flex-1 text-xs truncate font-mono">{url}</span>
          <button onClick={copy} className="shrink-0 p-1.5 rounded-lg hover:bg-background transition" aria-label="Copy link">
            {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={print}
          className="mt-4 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
        >
          Print table card
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl bg-background border border-border p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className="font-heading text-xl font-bold leading-snug">{title}</h2>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
