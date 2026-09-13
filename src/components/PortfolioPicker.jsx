import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Loader2, Check, Images } from 'lucide-react';
import { thumbUrl } from '@/lib/storage';

/**
 * Lets a studio pick photos from their own events for the public portfolio.
 *
 * Deliberately manual. Auto-pulling client photos into a public showcase
 * would put a couple's wedding on the internet without anyone asking them,
 * which is both a trust problem and a DPDP problem.
 */
export default function PortfolioPicker({ studio, onClose, onSave }) {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(() => {
    try { return new Set(studio.portfolio ? JSON.parse(studio.portfolio) : []); } catch { return new Set(); }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const events = await base44.entities.Event.filter({ studio_id: studio.id });
        const lists = await Promise.all(
          (events || []).slice(0, 20).map((e) =>
            base44.entities.Photo.filter({ event_id: e.id }, '-quality_score', 60).catch(() => [])
          )
        );
        setPhotos(lists.flat().filter((p) => !p.culled));
      } finally {
        setLoading(false);
      }
    })();
  }, [studio.id]);

  const toggle = (url) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(url) ? n.delete(url) : n.add(url);
      return n;
    });
  };

  const save = async () => {
    setSaving(true);
    const list = [...selected];
    await base44.entities.Studio.update(studio.id, { portfolio: JSON.stringify(list) });
    setSaving(false);
    onSave?.(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl max-h-[85vh] rounded-3xl bg-background border border-border shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold">Choose portfolio photos</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {selected.size} selected. These appear on your public page — pick your best, not your most recent.
            </p>
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
          ) : photos.length === 0 ? (
            <div className="py-16 text-center">
              <Images className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Upload photos to an event first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {photos.map((p) => {
                const on = selected.has(p.r2_key);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.r2_key)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-muted transition ring-offset-2 ${on ? 'ring-2 ring-accent' : ''}`}
                  >
                    <img src={thumbUrl(p.r2_key, 300)} alt="" loading="lazy" className="w-full h-full object-cover" />
                    {on && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border border-border font-medium hover:border-foreground/40 transition">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : `Save ${selected.size}`}
          </button>
        </div>
      </div>
    </div>
  );
}
