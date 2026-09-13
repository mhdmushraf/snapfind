import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, ArrowRight, Search } from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { GALLERY } from '@/lib/images';

/**
 * Snapfind 404.
 *
 * Most people who land here are guests who mistyped a gallery link or whose
 * event has been deleted — not photographers browsing the marketing site.
 * So the page leads with "check with your photographer" rather than a
 * generic "go home".
 */
export default function PageNotFound() {
  const { pathname } = useLocation();
  const attempted = pathname.replace(/^\//, '');

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto w-32 h-32 mb-8">
            {/* viewfinder brackets around a lost frame */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-30 grayscale">
              <img src={GALLERY[0]?.src} alt="" className="w-full h-full object-cover" />
            </div>
            <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full" fill="none">
              <path d="M10 22V14a4 4 0 0 1 4-4h8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
              <path d="M54 22V14a4 4 0 0 0-4-4h-8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
              <path d="M10 42v8a4 4 0 0 0 4 4h8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
              <path d="M54 42v8a4 4 0 0 1-4 4h-8" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-7 h-7 text-accent" />
            </div>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">Nothing in this frame</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {attempted
              ? <>We couldn't find <span className="font-medium text-foreground break-all">/{attempted}</span>.</>
              : "We couldn't find that page."}
          </p>

          <div className="mt-8 rounded-2xl bg-background border border-border p-5 text-left">
            <p className="text-sm font-semibold">Looking for your wedding photos?</p>
            <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
              <li>· Check the link or scan the QR code again — a single wrong character breaks it.</li>
              <li>· The gallery may have closed. Photographers set an end date.</li>
              <li>· Still stuck? Message your photographer directly.</li>
            </ul>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              <Home className="w-4 h-4" /> Go home
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border font-medium hover:border-foreground/40 transition"
            >
              <Camera className="w-4 h-4" /> I'm a photographer
            </Link>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
          <LogoMark size={18} /> Snapfind <ArrowRight className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
