import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Calendar, Globe, Settings2, LogOut, Menu, X, ExternalLink, Loader2, Zap,
} from 'lucide-react';
import Logo, { LogoMark } from '@/components/Logo';
import { ensureStudio } from '@/lib/studio';
import { studioUrl } from '@/lib/config';

const NAV = [
  { to: '/dashboard', label: 'Events', icon: Calendar },
  { to: '/studio-website', label: 'Website', icon: Globe },
  { to: '/studio-settings', label: 'Settings', icon: Settings2 },
];

/**
 * Signed-in app shell: one persistent sidebar, one place for studio identity
 * and plan status. Pages render into the outlet and own only their content.
 *
 * The studio is loaded once here and handed down through the outlet context,
 * so every page no longer re-fetches it on mount.
 */
export default function AppLayout() {
  const [studio, setStudio] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const { user: u, studio: s } = await ensureStudio();
        setUser(u);
        setStudio(s);
      } catch { /* ProtectedRoute handles auth */ }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const credits = studio?.photo_credits ?? 0;
  const low = credits < 500;

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 h-16 flex items-center border-b border-border">
        <Logo to="/dashboard" />
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`
            }
          >
            <Icon className="w-4 h-4" /> {label}
          </NavLink>
        ))}

        {studio?.slug && (
          <a
            href={studioUrl(studio)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <ExternalLink className="w-4 h-4" /> View public page
          </a>
        )}
      </nav>

      <div className="p-3 border-t border-border space-y-3">
        <div className="px-2">
          <div className="text-sm font-medium truncate">{studio?.name || user?.full_name || 'Studio'}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
        </div>

        <div className={`rounded-xl p-3 ${low ? 'bg-accent/10' : 'bg-secondary/60'}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Zap className={`w-3.5 h-3.5 ${low ? 'text-accent' : 'text-primary'}`} />
            {credits.toLocaleString('en-IN')} photo credits
          </div>
          {studio?.plan === 'trial' && (
            <Link to="/pricing" className="mt-1.5 block text-[11px] text-accent hover:underline">
              Free trial · see plans
            </Link>
          )}
        </div>

        <button
          onClick={() => base44.auth.logout('/')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="min-h-screen bg-secondary/25">
      {/* Mobile bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border h-16 px-4 flex items-center justify-between">
        <Logo to="/dashboard" />
        <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="w-72 bg-background border-l border-border relative">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-4 p-1.5 rounded-lg hover:bg-secondary" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block h-screen sticky top-0 bg-background border-r border-border">
          {sidebar}
        </aside>
        <main className="min-w-0">
          <Outlet context={{ studio, setStudio, user }} />
        </main>
      </div>
    </div>
  );
}
