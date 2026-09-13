import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Loader2, MessageCircle, Mail, MapPin, Instagram, Camera, ArrowRight, X,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { thumbUrl, previewUrl } from '@/lib/storage';

/**
 * Public studio microsite at /<studio-slug>.
 *
 * Every guest who scans a QR sees this studio's name; this is the page that
 * turns that attention into an enquiry. Portfolio photos are chosen by the
 * studio in settings — never auto-pulled from client galleries, because
 * those belong to the couple, not to us.
 */
export default function StudioSite() {
  const { studioSlug } = useParams();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const found = await base44.entities.Studio.filter({ slug: studioSlug });
        const s = found?.[0];
        setStudio(s && s.public_site !== false ? s : null);
      } catch {
        setStudio(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [studioSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
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

  let portfolio = [];
  try { portfolio = studio.portfolio ? JSON.parse(studio.portfolio) : []; } catch { /* ignore */ }

  const wa = studio.phone?.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {studio.cover_url || portfolio[0] ? (
            <>
              <img src={previewUrl(studio.cover_url || portfolio[0], 2000)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40" />
            </>
          ) : (
            <div className="w-full h-full bg-primary" />
          )}
        </div>

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-32 text-primary-foreground">
          {studio.logo_url ? (
            <img src={thumbUrl(studio.logo_url, 240)} alt={studio.name} className="h-14 w-auto max-w-[12rem] object-contain mb-6" />
          ) : (
            <LogoMark size={44} className="mb-6" />
          )}
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-balance">{studio.name}</h1>
          {studio.tagline && (
            <p className="mt-4 text-lg sm:text-xl text-primary-foreground/85 max-w-xl">{studio.tagline}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
            {studio.city && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {studio.city}</span>}
            {studio.instagram && (
              <a href={`https://instagram.com/${studio.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent transition">
                <Instagram className="w-4 h-4" /> @{studio.instagram}
              </a>
            )}
          </div>
          {wa && (
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${studio.name}, I'd like to check your availability.`)}`}
              target="_blank" rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition"
            >
              <MessageCircle className="w-4 h-4" /> Check availability
            </a>
          )}
        </div>
      </header>

      {/* About */}
      {studio.about && (
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{studio.about}</p>
        </section>
      )}

      {/* Portfolio */}
      {portfolio.length > 0 ? (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="columns-2 sm:columns-3 gap-3 [column-fill:_balance]">
            {portfolio.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-muted group"
              >
                <img
                  src={thumbUrl(src, 700)}
                  alt=""
                  loading="lazy"
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-20 text-center">
          <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">This studio hasn't added portfolio photos yet.</p>
        </section>
      )}

      {/* Contact */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-balance">
            Planning a wedding? Let's talk.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {studio.owner_email && (
              <a
                href={`mailto:${studio.owner_email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary-foreground/15 font-semibold hover:bg-primary-foreground/25 transition"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition">
          Galleries powered by Snapfind <ArrowRight className="w-3 h-3" />
        </Link>
      </footer>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex flex-col" onClick={() => setLightbox(null)}>
          <div className="flex justify-end p-4">
            <button className="p-2 rounded-full bg-background/15 text-background" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-8">
            <img src={previewUrl(lightbox)} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
}
