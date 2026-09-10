import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, Lock, ArrowRight, Loader2, ScanFace, QrCode, MessageCircle } from 'lucide-react';
import Logo, { LogoMark } from '@/components/Logo';
import PhotoCycle from '@/components/PhotoCycle';
import { IMG, GALLERY, FACES } from '@/lib/images';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Wrong email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* Visual panel */}
      <div className="relative hidden lg:block overflow-hidden bg-primary">
        <PhotoCycle seconds={30} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/45 to-primary/25" />

        {/* floating result card */}
        <div className="absolute top-14 right-10 w-72 rounded-2xl bg-background/95 backdrop-blur shadow-2xl p-4 animate-[float_6s_ease-in-out_infinite]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><ScanFace className="w-5 h-5 text-primary" /></div>
            <div>
              <div className="text-sm font-semibold">Found 63 photos of you</div>
              <div className="text-xs text-muted-foreground">Matched in 1.6 s</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {FACES.slice(0, 4).map((s, i) => (
              <img key={i} src={s} alt="" className="aspect-square object-cover rounded-md" />
            ))}
          </div>
        </div>

        {/* floating QR card */}
        <div className="absolute bottom-40 right-24 w-52 rounded-2xl bg-background/95 backdrop-blur shadow-2xl p-4 animate-[float_7s_ease-in-out_infinite_1s]">
          <div className="flex items-center gap-2 text-xs font-semibold"><QrCode className="w-4 h-4 text-accent" /> Anjali &amp; Rahul</div>
          <div className="mt-2 grid grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-[1px] ${(i * 7 + i % 5) % 3 ? 'bg-foreground' : 'bg-transparent'}`} />
            ))}
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground">Scan · take a selfie · done</div>
        </div>

        {/* whatsapp bubble */}
        <div className="absolute top-28 left-10 flex items-center gap-2 rounded-full bg-background/95 backdrop-blur shadow-xl pl-2 pr-4 py-2 animate-[float_5s_ease-in-out_infinite_2s]">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-[#25D366]" /></div>
          <span className="text-xs font-medium">Gallery link sent on WhatsApp</span>
        </div>

        <div className="absolute top-10 left-10 text-primary-foreground">
          <Logo inverted />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-10 pr-72 text-primary-foreground bg-gradient-to-t from-primary/90 to-transparent">
          <p className="font-heading text-3xl font-semibold max-w-md leading-snug">Welcome back. Your guests are waiting.</p>
        </div>

        <style>{``}</style>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-6 py-16 bg-mesh overflow-hidden">
        <div className="blob w-72 h-72 bg-accent/30 -top-20 -right-20" />
        <div className="blob w-80 h-80 bg-primary/30 -bottom-24 -left-16" style={{ animationDelay: '-9s' }} />
        <div className="relative w-full max-w-sm rounded-3xl bg-background/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-primary/5 p-8">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="font-heading text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your Snapfind studio dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Email</span>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input input-icon" placeholder="you@studio.com" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Password</span>
              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10 pointer-events-none" />
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input input-icon" placeholder="••••••••" />
              </div>
            </label>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted-foreground">
            New to Snapfind? <Link to="/register" className="text-accent font-medium hover:underline">Start free</Link>
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[['< 2 s', 'selfie to results'], ['5,000', 'free photo credits'], ['24 h', 'selfie deletion']].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-secondary/60 p-3">
                <div className="font-heading font-bold text-primary">{n}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
