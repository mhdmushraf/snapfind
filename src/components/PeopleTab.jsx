import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Loader2, Heart, Check, X, Sparkles } from 'lucide-react';
import { thumbUrl } from '@/lib/storage';
import { clusterFaces, photosWithBoth, splitSides } from '@/lib/clustering';

/**
 * People tab. Clusters every face in the event into individuals, lets the
 * photographer name the couple, then derives the couple album and the two
 * family sides from that one choice.
 */
export default function PeopleTab({ event, photos, onSaved }) {
  const [groups, setGroups] = useState(() => {
    try { return event.groups_data ? JSON.parse(event.groups_data) : null; } catch { return null; }
  });
  const [working, setWorking] = useState(false);
  const [naming, setNaming] = useState(null);
  const [nameInput, setNameInput] = useState('');

  const indexed = photos.filter((p) => p.face_data);
  const photoById = useMemo(() => Object.fromEntries(photos.map((p) => [p.id, p])), [photos]);

  const run = async () => {
    setWorking(true);
    // Yield so the spinner paints before the main thread blocks
    await new Promise((r) => setTimeout(r, 30));
    const found = clusterFaces(indexed);
    setGroups(found);
    await base44.entities.Event.update(event.id, { groups_data: JSON.stringify(found) }).catch(() => {});
    setWorking(false);
    onSaved?.();
  };

  const setLabel = async (groupId, label) => {
    const next = groups.map((g) => (g.id === groupId ? { ...g, label } : g));
    setGroups(next);
    setNaming(null);
    setNameInput('');
    await base44.entities.Event.update(event.id, { groups_data: JSON.stringify(next) }).catch(() => {});
  };

  const bride = groups?.find((g) => g.role === 'bride');
  const groom = groups?.find((g) => g.role === 'groom');

  const setRole = async (groupId, role) => {
    const next = groups.map((g) => {
      if (g.id === groupId) return { ...g, role };
      if (g.role === role) return { ...g, role: undefined };
      return g;
    });
    setGroups(next);
    await base44.entities.Event.update(event.id, { groups_data: JSON.stringify(next) }).catch(() => {});
  };

  const coupleIds = bride && groom ? photosWithBoth(bride, groom) : [];
  const sides = bride && groom ? splitSides(groups, bride, groom) : null;

  if (indexed.length === 0) {
    return (
      <Empty icon={Users} title="Index the photos first">
        People grouping uses the face data from indexing. Run indexing and come back.
      </Empty>
    );
  }

  if (!groups) {
    return (
      <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <h2 className="font-heading text-xl font-bold">Group the faces into people</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Snapfind sorts every face across {indexed.length} photos into individuals. Mark the bride and
          groom and you get the couple album and both family sides automatically.
        </p>
        <button
          onClick={run}
          disabled={working}
          className="mt-7 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {working ? <><Loader2 className="w-4 h-4 animate-spin" /> Grouping…</> : <><Sparkles className="w-4 h-4" /> Group people</>}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Couple album */}
      {bride && groom && (
        <section className="rounded-2xl bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <h3 className="font-heading font-semibold">
              Couple album · {coupleIds.length} photo{coupleIds.length === 1 ? '' : 's'} with both
            </h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {coupleIds.slice(0, 16).map((id) => (
              <div key={id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                {photoById[id] && <img src={thumbUrl(photoById[id].r2_key, 300)} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
            ))}
          </div>
          {coupleIds.length > 16 && (
            <p className="mt-3 text-xs text-muted-foreground">and {coupleIds.length - 16} more</p>
          )}
        </section>
      )}

      {/* Family sides */}
      {sides && (sides.sideA.length > 0 || sides.sideB.length > 0) && (
        <section className="grid sm:grid-cols-2 gap-4">
          {[
            [`${bride.label || 'Bride'}'s side`, sides.sideA],
            [`${groom.label || 'Groom'}'s side`, sides.sideB],
          ].map(([title, list]) => (
            <div key={title} className="rounded-2xl bg-background border border-border p-5">
              <h3 className="font-heading font-semibold text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{list.length} people</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {list.slice(0, 12).map((g) => (
                  <img key={g.id} src={thumbUrl(g.cover, 100)} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
                ))}
                {list.length > 12 && (
                  <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                    +{list.length - 12}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Everyone */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold">{groups.length} people found</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tap a face to name them. Mark the bride and groom to unlock the couple album.
            </p>
          </div>
          <button onClick={run} disabled={working} className="text-sm font-medium text-accent hover:underline disabled:opacity-50">
            {working ? 'Regrouping…' : 'Regroup'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {groups.map((g) => (
            <div key={g.id} className="rounded-2xl bg-background border border-border overflow-hidden">
              <div className="aspect-square bg-muted relative">
                <img src={thumbUrl(g.cover, 400)} alt="" loading="lazy" className="w-full h-full object-cover" />
                {g.role && (
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold capitalize">
                    {g.role}
                  </span>
                )}
              </div>
              <div className="p-3">
                {naming === g.id ? (
                  <div className="flex gap-1">
                    <input
                      autoFocus value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setLabel(g.id, nameInput)}
                      className="input py-1.5 text-xs" placeholder="Name"
                    />
                    <button onClick={() => setLabel(g.id, nameInput)} className="p-1.5 rounded-lg bg-accent text-accent-foreground">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setNaming(null)} className="p-1.5 rounded-lg border border-border">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setNaming(g.id); setNameInput(g.label || ''); }}
                    className="text-sm font-medium hover:text-accent transition block truncate w-full text-left"
                  >
                    {g.label || 'Unnamed'}
                  </button>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{g.count} photos</p>
                <div className="mt-2 flex gap-1">
                  {['bride', 'groom'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(g.id, g.role === r ? undefined : r)}
                      className={`flex-1 py-1 rounded-full text-[10px] font-semibold capitalize transition ${
                        g.role === r ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-foreground/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Empty({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
      <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{children}</p>
    </div>
  );
}
