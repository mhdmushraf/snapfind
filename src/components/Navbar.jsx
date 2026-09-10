import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Aperture } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Journal', path: '/journal' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border/70' : 'bg-transparent'
    )}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Aperture className="w-6 h-6 text-accent group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
          <span className="font-heading text-xl font-semibold tracking-tight">Lumière</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-full transition-colors',
                pathname === l.path ? 'text-accent' : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="ml-2 px-4 py-2 text-sm font-medium rounded-full border border-foreground/15 hover:border-foreground/40 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Join as photographer
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.path} to={l.path} className={cn('py-2 text-sm', pathname === l.path && 'text-accent')}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="flex-1 text-center py-2.5 text-sm rounded-full border border-foreground/15">Sign in</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 text-sm rounded-full bg-primary text-primary-foreground">Join</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}