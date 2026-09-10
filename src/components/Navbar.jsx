import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const links = [
  { label: 'How it works', path: '/how-it-works' },
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'For Photographers', path: '/for-photographers' },
  { label: 'Blog', path: '/blog' },
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
        <Logo />

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
          <Link to="/register" className="px-4 py-2 text-sm font-semibold rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
            Start free
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
              <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-semibold rounded-full bg-accent text-accent-foreground">Start free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}