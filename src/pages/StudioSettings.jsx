import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Loader2, Upload, Check, Trash2, Building2, MapPin, Phone, Globe, UserPlus, X, IndianRupee } from 'lucide-react';
import Logo from '@/components/Logo';
import { STORAGE, storageReady, thumbUrl } from '@/lib/storage';
import { ensureStudio } from '@/lib/studio';
import { slugify, isValidSlug, studioUrl, PUBLIC_BASE_URL } from '@/lib/config';
import PortfolioPicker from '@/components/PortfolioPicker';

async function uploadLogo(file) {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', STORAGE.uploadPreset);
  form.append('folder', 'snapfind/branding');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${STORAGE.cloudName}/image/upload`, {
    method: 'POST', body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

export default function StudioSettings() {
  const navigate = useNavigate();
  const logoInput = useRef(null);
  const markInput = useRef(null);

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [saved, setSaved] = useState(false);
  const [team, setTeam] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('shooter');
  const [slugInput, setSlugInput] = useState('');
  const [slugError, setSlugError] = useState('');
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { studio: s } = await ensureStudio();
        setStudio(s);
        setSlugInput(s.slug || slugify(s.name));
        const t = await base44.entities.TeamMember.filter({ studio_id: s.id });
        setTeam((t || []).filter((m) => m.status !== 'removed'));
      } catch {
        setStudio(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const patch = async (fields) => {
    setStudio((s) => ({ ...s, ...fields }));
    await base44.entities.Studio.update(studio.id, fields);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const pickImage = async (e, field) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(field);
    try {
      const url = await uploadLogo(file);
      await patch({ [field]: url });
    } catch {
      alert('Could not upload that image. Try a smaller PNG or JPEG.');
    } finally {
      setBusy('');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }
  if (!studio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground">Couldn't load your studio. Try signing out and back in.</p>
        <Link to="/dashboard" className="text-accent font-medium hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/25">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo to="/dashboard" />
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">Studio settings</h1>
          {saved && <span className="inline-flex items-center gap-1.5 text-sm text-accent font-medium"><Check className="w-4 h-4" /> Saved</span>}
        </div>

        {!storageReady() && (
          <p className="rounded-2xl bg-accent/5 border border-accent/30 p-4 text-sm">
            Set up Cloudinary in <code className="text-xs bg-muted px-1 py-0.5 rounded">src/lib/storage.js</code> before uploading a logo.
          </p>
        )}

        {/* Branding */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Branding</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This is what every guest sees on their gallery. Your studio, not ours.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <ImageField
              label="Studio logo"
              help="Shown at the top of every guest gallery. PNG with transparency works best."
              value={studio.logo_url}
              busy={busy === 'logo_url'}
              onPick={() => logoInput.current?.click()}
              onClear={() => patch({ logo_url: '' })}
            />
            <ImageField
              label="Watermark"
              help="Overlaid on preview images when watermarking is on for an event."
              value={studio.watermark_url}
              busy={busy === 'watermark_url'}
              onPick={() => markInput.current?.click()}
              onClear={() => patch({ watermark_url: '' })}
            />
          </div>
          <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, 'logo_url')} />
          <input ref={markInput} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, 'watermark_url')} />
        </section>

        {/* Details */}
        <section className="rounded-2xl bg-background border border-border p-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Studio details</h2>
          <Field label="Studio name" icon={Building2} defaultValue={studio.name} onBlur={(v) => patch({ name: v })} placeholder="Menon Wedding Studio" />
          <Field label="City" icon={MapPin} defaultValue={studio.city} onBlur={(v) => patch({ city: v })} placeholder="Kochi" />
          <Field label="WhatsApp number" icon={Phone} defaultValue={studio.phone} onBlur={(v) => patch({ phone: v })} placeholder="+91 98XXX XXXXX" />
          <p className="text-xs text-muted-foreground">
            Guests see your number on their gallery so they can reach you directly.
          </p>
        </section>

        {/* Public studio page */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Your public page</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every guest who scans your QR sees your studio name. This is the page that turns
            that into an enquiry.
          </p>

          <label className="block mt-5">
            <span className="text-sm font-medium">Studio handle</span>
            <div className="mt-2 flex items-stretch rounded-xl border border-input overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
              <span className="px-3 flex items-center text-xs text-muted-foreground bg-muted/50 border-r border-input whitespace-nowrap">
                {PUBLIC_BASE_URL.replace('https://', '')}/
              </span>
              <input
                value={slugInput}
                onChange={(e) => { setSlugInput(slugify(e.target.value)); setSlugError(''); }}
                onBlur={async () => {
                  const s = slugify(slugInput);
                  if (s === (studio.slug || '')) return;
                  if (!isValidSlug(s)) {
                    setSlugError('Use 3+ letters, numbers and dashes. Some words are reserved.');
                    return;
                  }
                  const taken = await base44.entities.Studio.filter({ slug: s });
                  if (taken?.length && taken[0].id !== studio.id) {
                    setSlugError('That handle is taken. Try another.');
                    return;
                  }
                  patch({ slug: s });
                }}
                className="flex-1 px-3 py-3 text-sm outline-none bg-background"
                placeholder="menon-studio"
              />
            </div>
            {slugError
              ? <p className="mt-2 text-sm text-destructive">{slugError}</p>
              : studio.slug && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Live at{' '}
                  <a href={studioUrl(studio)} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {studioUrl(studio).replace('https://', '')}
                  </a>
                  {' '}· galleries now use {studio.slug}/&lt;event&gt;
                </p>
              )}
          </label>

          <label className="block mt-5">
            <span className="text-sm font-medium">Tagline</span>
            <input
              defaultValue={studio.tagline || ''}
              onBlur={(e) => patch({ tagline: e.target.value })}
              className="input mt-2" placeholder="Wedding stories from Kerala, told honestly."
            />
          </label>

          <label className="block mt-4">
            <span className="text-sm font-medium">About</span>
            <textarea
              rows={4}
              defaultValue={studio.about || ''}
              onBlur={(e) => patch({ about: e.target.value })}
              className="input mt-2 resize-none"
              placeholder="Who you are, how you shoot, how many weddings a year…"
            />
          </label>

          <label className="block mt-4">
            <span className="text-sm font-medium">Instagram handle</span>
            <input
              defaultValue={studio.instagram || ''}
              onBlur={(e) => patch({ instagram: e.target.value.replace('@', '') })}
              className="input mt-2" placeholder="menonweddings"
            />
          </label>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <div className="text-sm font-medium">Portfolio photos</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {portfolioCount} selected · shown on your public page
              </div>
            </div>
            <button
              onClick={() => setPicking(true)}
              className="px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
            >
              Choose photos
            </button>
          </div>

          <label className="mt-4 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={studio.public_site !== false}
              onChange={(e) => patch({ public_site: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-[hsl(var(--accent))]"
            />
            <span className="text-sm">
              Show my public page
              <span className="block text-xs text-muted-foreground mt-0.5">
                Turn off and the page 404s. Guest galleries keep working either way.
              </span>
            </span>
          </label>
        </section>

        {/* Team */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Team</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Second shooters and editors who can work on your events.
          </p>

          {team.length > 0 && (
            <div className="mt-4 divide-y divide-border">
              {team.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.name || m.email}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {m.role} · {m.status}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await base44.entities.TeamMember.update(m.id, { status: 'removed' });
                      setTeam((t) => t.filter((x) => x.id !== m.id));
                    }}
                    className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!inviteEmail) return;
              const created = await base44.entities.TeamMember.create({
                studio_id: studio.id,
                email: inviteEmail,
                role: inviteRole,
                status: 'invited',
                invited_at: new Date().toISOString(),
              });
              setTeam((t) => [...t, created]);
              setInviteEmail('');
            }}
            className="mt-4 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email" value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input flex-1" placeholder="teammate@studio.com"
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="input sm:w-36">
              <option value="shooter">Shooter</option>
              <option value="editor">Editor</option>
            </select>
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              <UserPlus className="w-4 h-4" /> Invite
            </button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Invited teammates sign up at Snapfind with this email and are linked to your studio.
            Automatic invite emails need the Meta/email integration — for now, send them the link yourself.
          </p>
        </section>

        {/* Gallery domain */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Gallery domain</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Guest galleries and QR codes use this address. Leave blank to use the default.
          </p>
          <div className="relative mt-4">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <input
              defaultValue={studio.custom_domain || ''}
              onBlur={(e) => patch({ custom_domain: e.target.value.replace(/^https?:\/\//, '').replace(/\/$/, '') })}
              className="input input-icon" placeholder="gallery.yourstudio.com"
            />
          </div>
          <div className="mt-4 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">To make this work:</p>
            <p>1. Add a CNAME record at your domain registrar pointing to <code className="bg-background px-1 py-0.5 rounded">snapfind.base44.app</code></p>
            <p>2. Connect the same domain in the Base44 editor under Publish → Connect a custom domain</p>
            <p>3. Paste it above. New QR codes will use it; codes already printed keep working.</p>
          </div>
        </section>

        {/* Guest orders */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Guest orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What guests pay for prints and full-resolution downloads.
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {[
              ['download_price', 'Per download', 49],
              ['print_price', 'Per print', 299],
              ['revenue_share', 'Your share (%)', 70],
            ].map(([key, label, fallback]) => (
              <label key={key} className="block">
                <span className="text-sm font-medium">{label}</span>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="number" min="0"
                    defaultValue={studio[key] ?? fallback}
                    onBlur={(e) => patch({ [key]: Number(e.target.value) })}
                    className="input input-icon"
                  />
                </div>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Orders are recorded and shown in each event's Orders tab. Taking payment online needs a
            Razorpay account and an Indian entity — until then, collect by UPI and mark orders paid manually.
          </p>
        </section>

        {/* Plan */}
        <section className="rounded-2xl bg-background border border-border p-6">
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="font-medium capitalize">{studio.plan || 'trial'}</div>
              <div className="text-sm text-muted-foreground">
                {(studio.photo_credits || 0).toLocaleString('en-IN')} photo credits left
              </div>
            </div>
            <Link to="/pricing" className="px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
              View plans
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function ImageField({ label, help, value, busy, onPick, onClear }) {
  return (
    <div>
      <span className="text-sm font-medium">{label}</span>
      <p className="text-xs text-muted-foreground mt-0.5 mb-3">{help}</p>
      {value ? (
        <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center gap-3">
          <img src={thumbUrl(value, 160)} alt="" className="h-12 w-auto max-w-[8rem] object-contain" />
          <div className="flex-1" />
          <button onClick={onPick} className="p-2 rounded-lg hover:bg-background transition" aria-label="Replace">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={onClear} className="p-2 rounded-lg hover:bg-background transition text-destructive" aria-label="Remove">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onPick}
          disabled={busy}
          className="w-full rounded-xl border border-dashed border-border p-6 flex flex-col items-center gap-2 hover:border-foreground/30 transition disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin text-accent" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
          <span className="text-sm text-muted-foreground">{busy ? 'Uploading…' : 'Upload image'}</span>
        </button>
      )}
    </div>
  );
}

function Field({ label, icon: Icon, defaultValue, onBlur, placeholder }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative mt-2">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <input
          defaultValue={defaultValue || ''}
          onBlur={(e) => onBlur(e.target.value)}
          placeholder={placeholder}
          className="input input-icon"
        />
      </div>
    </label>
  );
}
