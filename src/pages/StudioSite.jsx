import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Loader2, MessageCircle, Mail, MapPin, Instagram, Camera, ArrowRight, X,
  Check, Quote, Globe,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { thumbUrl, previewUrl } from '@/lib/storage';
import { themeOf, themeVars, parseJson, templateOf, DEFAULT_SECTIONS } from '@/lib/studio-theme';
import Reveal from '@/components/Reveal';
import PortfolioGrid from '@/components/PortfolioGrid';

/**
 * Public studio website at /<studio-slug>.
 *
 * Themed per studio and assembled from whichever sections they've switched
 * on, in their chosen order. Renders inside a wrapper carrying the studio's
 * CSS variables so nothing leaks into the rest of the app.
 */
export default function StudioSite({ preview }) {
  const { studioSlug } = useParams();
  const [studio, setStudio] = useState(preview || null);
  const [loading, setLoading] = useState(!preview);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (preview) { setStudio(preview); return; }
    (async () => {
      try {
        const found = await base44.entities.Studio.filter({ slug: studioSlug });
        const s = found?.[0];
        setStudio(s && s.public_site !== false ? s : null);
      } catch { setStudio(null); } finally { setLoading(false); }
    })();
  }, [studioSlug, preview]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }
  if (!studio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <LogoMark size={40} />
        <h1 className="font-heading text-2xl font-bold mt-2">Studio not found</h1>
        <p className="text-muted-foreground">This page doesn't exist, or the studio has hidden it.</p>
        <Link to="/" className="mt-2 text-accent font-medium hover:underline">Go to Snapfind</Link>
      </div>
    );
  }

  const theme = themeOf(studio);
  const T = templateOf(theme);
  const motion = theme.motion !== false;
  const sections = parseJson(studio.sections, DEFAULT_SECTIONS);
  const portfolio = parseJson(studio.portfolio, []);
  const services = parseJson(studio.services, []);
  const packages = parseJson(studio.packages, []);
  const testimonials = parseJson(studio.testimonials, []);
  const faqs = parseJson(studio.faqs, []);
  const wa = studio.phone?.replace(/\D/g, '');
  const hero = portfolio[0] || studio.cover_url;

  const Band = ({ children, alt }) => (
    <section style={alt ? { background: 'hsl(var(--s-band))' } : undefined}>
      <div className={`max-w-5xl mx-auto px-5 sm:px-8 ${T.sectionPad}`}>
        <Reveal enabled={motion}>{children}</Reveal>
      </div>
    </section>
  );
  const H2 = ({ children }) => (
    <h2
      className={`${T.h2} text-balance ${T.uppercaseLabels ? 'uppercase tracking-tight' : ''}`}
      style={{ fontFamily: 'var(--s-heading)' }}
    >
      {children}
    </h2>
  );

  const body = {
    about: studio.about && (
      <Band key="about">
        <div className="max-w-2xl">
          <H2>About</H2>
          <p className="mt-5 text-lg leading-relaxed whitespace-pre-line" style={{ color: 'hsl(var(--s-muted-fg))' }}>
            {studio.about}
          </p>
        </div>
      </Band>
    ),

    portfolio: portfolio.length > 0 && (
      <section key="portfolio">
        <div className={`max-w-5xl mx-auto px-5 sm:px-8 ${T.sectionPad}`}>
          <Reveal enabled={motion}><H2>Work</H2></Reveal>
          <div className="mt-8">
            <PortfolioGrid
              photos={portfolio}
              layout={theme.portfolio}
              rounded={T.rounded}
              motion={motion}
              onOpen={setLightbox}
            />
          </div>
        </div>
      </section>
    ),

    services: services.length > 0 && (
      <Band key="services" alt>
        <H2>What we shoot</H2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div key={i} className="rounded-2xl p-6" style={{ background: 'hsl(var(--s-bg))', border: '1px solid hsl(var(--s-border))' }}>
              <h3 className="font-semibold" style={{ fontFamily: 'var(--s-heading)' }}>{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'hsl(var(--s-muted-fg))' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </Band>
    ),

    packages: packages.length > 0 && (
      <Band key="packages">
        <H2>Packages</H2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: 'hsl(var(--s-bg))',
                border: p.popular ? '2px solid hsl(var(--s-accent))' : '1px solid hsl(var(--s-border))',
              }}
            >
              {p.popular && (
                <span className="self-start text-[10px] px-2 py-0.5 rounded-full font-bold mb-3"
                  style={{ background: 'hsl(var(--s-accent))', color: 'hsl(var(--s-accent-ink))' }}>
                  MOST BOOKED
                </span>
              )}
              <h3 className="font-semibold" style={{ fontFamily: 'var(--s-heading)' }}>{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--s-heading)' }}>{p.price}</span>
                {p.unit && <span className="text-xs" style={{ color: 'hsl(var(--s-muted-fg))' }}>{p.unit}</span>}
              </div>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                {(p.features || []).map((f, j) => (
                  <li key={j} className="flex gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'hsl(var(--s-accent))' }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {wa && (
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${studio.name}, I'd like to know more about the ${p.name} package.`)}`}
                  target="_blank" rel="noreferrer"
                  className="mt-6 py-3 rounded-full text-center text-sm font-semibold transition hover:opacity-90"
                  style={{ background: 'hsl(var(--s-accent))', color: 'hsl(var(--s-accent-ink))' }}>
                  Enquire
                </a>
              )}
            </div>
          ))}
        </div>
      </Band>
    ),

    testimonials: testimonials.length > 0 && (
      <Band key="testimonials" alt>
        <H2>What couples say</H2>
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-2xl p-6" style={{ background: 'hsl(var(--s-bg))', border: '1px solid hsl(var(--s-border))' }}>
              <Quote className="w-5 h-5 mb-3" style={{ color: 'hsl(var(--s-accent))' }} />
              <blockquote className="leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm" style={{ color: 'hsl(var(--s-muted-fg))' }}>
                <span className="font-medium" style={{ color: 'hsl(var(--s-fg))' }}>{t.name}</span>
                {t.detail && <> · {t.detail}</>}
              </figcaption>
            </figure>
          ))}
        </div>
      </Band>
    ),

    faqs: faqs.length > 0 && (
      <Band key="faqs">
        <H2>Questions</H2>
        <div className="mt-8 max-w-2xl divide-y" style={{ borderColor: 'hsl(var(--s-border))' }}>
          {faqs.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none font-medium">
                {f.q}
                <span className="text-xl leading-none group-open:rotate-45 transition" style={{ color: 'hsl(var(--s-accent))' }}>+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'hsl(var(--s-muted-fg))' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </Band>
    ),

    contact: (
      <section key="contact" style={{ background: 'hsl(var(--s-accent))', color: 'hsl(var(--s-accent-ink))' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance" style={{ fontFamily: 'var(--s-heading)' }}>
            Planning a wedding? Let's talk.
          </h2>
          {studio.city && <p className="mt-3 opacity-85">Based in {studio.city}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {wa && (
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold bg-white/95 text-black hover:bg-white transition">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {studio.owner_email && (
              <a href={`mailto:${studio.owner_email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold bg-black/15 hover:bg-black/25 transition">
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
          </div>
        </div>
      </section>
    ),
  };

  return (
    <div style={{ ...themeVars(theme), background: 'hsl(var(--s-bg))', color: 'hsl(var(--s-fg))' }} className="min-h-screen">
      {/* Hero */}
      {theme.hero === 'minimal' || !hero ? (
        <header className={`max-w-5xl mx-auto px-5 sm:px-8 ${T.heroPad}`}>
          <StudioMark studio={studio} />
          <h1 className={`mt-6 ${T.titleSize} ${T.titleWeight} text-balance ${T.uppercaseLabels ? 'uppercase tracking-tighter' : ''}`} style={{ fontFamily: 'var(--s-heading)' }}>{studio.name}</h1>
          {studio.tagline && <p className="mt-5 text-xl max-w-xl" style={{ color: 'hsl(var(--s-muted-fg))' }}>{studio.tagline}</p>}
          <Meta studio={studio} wa={wa} />
        </header>
      ) : theme.hero === 'split' ? (
        <header className={`max-w-6xl mx-auto px-5 sm:px-8 ${T.heroPad} grid lg:grid-cols-2 gap-10 items-center`}>
          <div>
            <StudioMark studio={studio} />
            <h1 className={`mt-6 ${T.titleSize} ${T.titleWeight} text-balance ${T.uppercaseLabels ? 'uppercase tracking-tighter' : ''}`} style={{ fontFamily: 'var(--s-heading)' }}>{studio.name}</h1>
            {studio.tagline && <p className="mt-5 text-lg" style={{ color: 'hsl(var(--s-muted-fg))' }}>{studio.tagline}</p>}
            <Meta studio={studio} wa={wa} />
          </div>
          <img src={previewUrl(hero, 1400)} alt="" className={`w-full h-[26rem] object-cover ${T.rounded === 'rounded-none' ? '' : 'rounded-3xl'}`} />
        </header>
      ) : (
        <header className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <img src={previewUrl(hero, 2000)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--s-bg)) 2%, hsl(var(--s-bg) / 0.45) 60%, hsl(var(--s-bg) / 0.2))' }} />
          </div>
          <div className={`relative max-w-5xl mx-auto px-5 sm:px-8 ${T.heroPad}`}>
            <StudioMark studio={studio} />
            <h1 className={`mt-6 ${T.titleSize} ${T.titleWeight} text-balance ${T.uppercaseLabels ? 'uppercase tracking-tighter' : ''}`} style={{ fontFamily: 'var(--s-heading)' }}>{studio.name}</h1>
            {studio.tagline && <p className="mt-5 text-xl max-w-xl" style={{ color: 'hsl(var(--s-muted-fg))' }}>{studio.tagline}</p>}
            <Meta studio={studio} wa={wa} />
          </div>
        </header>
      )}

      {sections.map((id) => body[id] || null)}

      <footer className="py-8 text-center" style={{ borderTop: '1px solid hsl(var(--s-border))' }}>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition">
          Galleries powered by Snapfind <ArrowRight className="w-3 h-3" />
        </Link>
      </footer>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={() => setLightbox(null)}>
          <div className="flex justify-end p-4">
            <button className="p-2 rounded-full bg-white/15 text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-8">
            <img src={previewUrl(lightbox)} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}

function StudioMark({ studio }) {
  return studio.logo_url
    ? <img src={thumbUrl(studio.logo_url, 240)} alt={studio.name} className="h-12 w-auto max-w-[11rem] object-contain" />
    : <Camera className="w-9 h-9" style={{ color: 'hsl(var(--s-accent))' }} />;
}

function Meta({ studio, wa }) {
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" style={{ color: 'hsl(var(--s-muted-fg))' }}>
        {studio.city && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {studio.city}</span>}
        {studio.instagram && (
          <a href={`https://instagram.com/${studio.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-70 transition">
            <Instagram className="w-4 h-4" /> @{studio.instagram}
          </a>
        )}
        {studio.website && (
          <a href={studio.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-70 transition">
            <Globe className="w-4 h-4" /> Website
          </a>
        )}
      </div>
      {wa && (
        <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${studio.name}, I'd like to check your availability.`)}`}
          target="_blank" rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold hover:opacity-90 transition"
          style={{ background: 'hsl(var(--s-accent))', color: 'hsl(var(--s-accent-ink))' }}>
          <MessageCircle className="w-4 h-4" /> Check availability
        </a>
      )}
    </>
  );
}
