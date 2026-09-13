import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft, Loader2, Check, Plus, Trash2, GripVertical, Eye, ExternalLink,
  Palette, Type, LayoutTemplate, Images, Star,
} from 'lucide-react';
import Logo from '@/components/Logo';
import StudioSite from '@/pages/StudioSite';
import PortfolioPicker from '@/components/PortfolioPicker';
import { ensureStudio } from '@/lib/studio';
import { studioUrl } from '@/lib/config';
import {
  ACCENTS, MODES, HEADINGS, HEROES, ALL_SECTIONS,
  DEFAULT_SECTIONS, themeOf, parseJson,
} from '@/lib/studio-theme';

/**
 * Studio website editor. Left = controls, right = a live preview of the
 * real public page component, so what they configure is exactly what ships.
 */
export default function StudioWebsite() {
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [picking, setPicking] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      try { const { studio: s } = await ensureStudio(); setStudio(s); }
      finally { setLoading(false); }
    })();
  }, []);

  const patch = async (fields) => {
    const next = { ...studio, ...fields };
    setStudio(next);
    await base44.entities.Studio.update(studio.id, fields).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const patchJson = (key, value) => patch({ [key]: JSON.stringify(value) });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }
  if (!studio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Couldn't load your studio.</p>
        <Link to="/dashboard" className="text-accent font-medium hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const theme = themeOf(studio);
  const sections = parseJson(studio.sections, DEFAULT_SECTIONS);
  const services = parseJson(studio.services, []);
  const packages = parseJson(studio.packages, []);
  const testimonials = parseJson(studio.testimonials, []);
  const faqs = parseJson(studio.faqs, []);
  const portfolio = parseJson(studio.portfolio, []);

  const setTheme = (k, v) => patch({ theme: JSON.stringify({ ...theme, [k]: v }) });

  const toggleSection = (id) => {
    const next = sections.includes(id) ? sections.filter((s) => s !== id) : [...sections, id];
    patchJson('sections', next);
  };
  const move = (id, dir) => {
    const i = sections.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    patchJson('sections', next);
  };

  return (
    <div className="min-h-screen bg-secondary/25">
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-3">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-2">
            {saved && <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-accent font-medium"><Check className="w-4 h-4" /> Saved</span>}
            <button onClick={() => setShowPreview((v) => !v)} className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm font-medium">
              <Eye className="w-4 h-4" /> {showPreview ? 'Edit' : 'Preview'}
            </button>
            {studio.slug && (
              <a href={studioUrl(studio)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
                <ExternalLink className="w-4 h-4" /> <span className="hidden sm:inline">Open</span>
              </a>
            )}
            <Link to="/studio-settings" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[26rem_1fr] lg:gap-0">
        {/* Controls */}
        <div className={`${showPreview ? 'hidden lg:block' : ''} px-5 sm:px-8 py-8 space-y-5 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto`}>
          <h1 className="font-heading text-2xl font-bold">Your website</h1>
          {!studio.slug && (
            <p className="rounded-xl bg-accent/5 border border-accent/30 p-4 text-sm">
              Set a studio handle in <Link to="/studio-settings" className="text-accent font-medium hover:underline">Settings</Link> to publish this page.
            </p>
          )}

          {/* Look */}
          <Card icon={Palette} title="Colour">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ACCENTS).map(([k, a]) => (
                <button key={k} onClick={() => setTheme('accent', k)}
                  className={`rounded-xl p-3 border-2 transition ${theme.accent === k ? 'border-foreground' : 'border-transparent hover:border-border'}`}>
                  <span className="block w-full h-6 rounded-lg mb-1.5" style={{ background: `hsl(${a.hsl})` }} />
                  <span className="text-[11px] font-medium">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card icon={LayoutTemplate} title="Background">
            <Choices options={MODES} value={theme.mode} onChange={(v) => setTheme('mode', v)} />
          </Card>

          <Card icon={Type} title="Headings">
            <Choices options={HEADINGS} value={theme.heading} onChange={(v) => setTheme('heading', v)} />
          </Card>

          <Card icon={Images} title="Hero style">
            <div className="grid gap-2">
              {Object.entries(HEROES).map(([k, label]) => (
                <button key={k} onClick={() => setTheme('hero', k)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left border transition ${theme.hero === k ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/30'}`}>
                  {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Sections */}
          <Card icon={LayoutTemplate} title="Sections">
            <div className="space-y-1.5">
              {sections.map((id, i) => {
                const label = ALL_SECTIONS.find(([s]) => s === id)?.[1] || id;
                return (
                  <div key={id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
                    <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-sm font-medium">{label}</span>
                    <button onClick={() => move(id, -1)} disabled={i === 0} className="p-1 text-xs disabled:opacity-25">↑</button>
                    <button onClick={() => move(id, 1)} disabled={i === sections.length - 1} className="p-1 text-xs disabled:opacity-25">↓</button>
                    <button onClick={() => toggleSection(id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                );
              })}
            </div>
            {ALL_SECTIONS.filter(([id]) => !sections.includes(id)).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ALL_SECTIONS.filter(([id]) => !sections.includes(id)).map(([id, label]) => (
                  <button key={id} onClick={() => toggleSection(id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-border text-xs font-medium hover:border-foreground/40 transition">
                    <Plus className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Portfolio */}
          <Card icon={Images} title="Portfolio">
            <p className="text-xs text-muted-foreground mb-3">{portfolio.length} photos selected</p>
            <button onClick={() => setPicking(true)} className="w-full py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
              Choose photos
            </button>
          </Card>

          {/* Repeaters */}
          <Repeater
            title="What we shoot" fields={[['title', 'Weddings'], ['body', 'Full-day documentary coverage…']]}
            items={services} onChange={(v) => patchJson('services', v)}
          />
          <Repeater
            title="Packages"
            fields={[['name', 'Silver'], ['price', '₹65,000'], ['unit', 'per wedding'], ['features', 'One shooter\nFull-day coverage\n400 edited photos']]}
            items={packages} onChange={(v) => patchJson('packages', v)} multiline={['features']} starrable
          />
          <Repeater
            title="Reviews" fields={[['quote', 'They caught moments we never saw…'], ['name', 'Anjali & Rahul'], ['detail', 'Kochi, Feb 2026']]}
            items={testimonials} onChange={(v) => patchJson('testimonials', v)} multiline={['quote']}
          />
          <Repeater
            title="FAQ" fields={[['q', 'How far do you travel?'], ['a', 'Anywhere in Kerala…']]}
            items={faqs} onChange={(v) => patchJson('faqs', v)} multiline={['a']}
          />
        </div>

        {/* Live preview */}
        <div className={`${showPreview ? '' : 'hidden lg:block'} border-l border-border bg-muted/20`}>
          <div className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="origin-top scale-[0.85] lg:scale-100 pointer-events-none">
              <StudioSite preview={studio} />
            </div>
          </div>
        </div>
      </div>

      {picking && (
        <PortfolioPicker
          studio={studio}
          onClose={() => setPicking(false)}
          onSave={(list) => setStudio((s) => ({ ...s, portfolio: JSON.stringify(list) }))}
        />
      )}
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl bg-background border border-border p-5">
      <h2 className="flex items-center gap-2 font-semibold text-sm mb-4">
        <Icon className="w-4 h-4 text-accent" /> {title}
      </h2>
      {children}
    </section>
  );
}

function Choices({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(options).map(([k, o]) => (
        <button key={k} onClick={() => onChange(k)}
          className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition ${value === k ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/30'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Generic add/edit/remove list for services, packages, reviews and FAQs. */
function Repeater({ title, fields, items, onChange, multiline = [], starrable }) {
  const blank = Object.fromEntries(fields.map(([k]) => [k, '']));

  const update = (i, key, val) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: key === 'features' ? val.split('\n').filter(Boolean) : val };
    onChange(next);
  };

  return (
    <section className="rounded-2xl bg-background border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-sm">{title}</h2>
        <button onClick={() => onChange([...items, blank])} className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">None yet — this section won't show on your site.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-border p-3 space-y-2">
              {fields.map(([key, placeholder]) => {
                const value = key === 'features' ? (it.features || []).join('\n') : (it[key] || '');
                return multiline.includes(key) || key === 'features' ? (
                  <textarea key={key} rows={key === 'features' ? 3 : 2} value={value}
                    onChange={(e) => update(i, key, e.target.value)}
                    className="input text-xs py-2 resize-none" placeholder={placeholder} />
                ) : (
                  <input key={key} value={value} onChange={(e) => update(i, key, e.target.value)}
                    className="input text-xs py-2" placeholder={placeholder} />
                );
              })}
              <div className="flex items-center justify-between pt-1">
                {starrable ? (
                  <button onClick={() => onChange(items.map((x, j) => ({ ...x, popular: j === i ? !x.popular : false })))}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${it.popular ? 'text-accent' : 'text-muted-foreground'}`}>
                    <Star className={`w-3 h-3 ${it.popular ? 'fill-current' : ''}`} /> Most booked
                  </button>
                ) : <span />}
                <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
