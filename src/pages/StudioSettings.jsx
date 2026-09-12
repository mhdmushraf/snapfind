import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Loader2, Upload, Check, Trash2, Building2, MapPin, Phone, Globe, UserPlus, X, IndianRupee } from 'lucide-react';
import Logo from '@/components/Logo';
import { STORAGE, storageReady, thumbUrl } from '@/lib/storage';
import { ensureStudio } from '@/lib/studio';

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

  useEffect(() => {
    (async () => {
      try {
        const { studio: s } = await ensureStudio();
        setStudio(s);
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
