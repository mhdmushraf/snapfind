import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { User, Mail, Lock, ArrowRight, Loader2, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import Logo from '@/components/Logo';
import { IMG, GALLERY } from '@/lib/images';

const makePrefix = () => 'studio_' + Math.random().toString(36).slice(2, 8);

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative mt-2">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        {children}
      </div>
    </label>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', studio: '', city: '', email: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await base44.auth.register({ email: form.email, password: form.password });
      setStep(2);
    } catch (err) {
      setError(err?.message || 'Could not create account.');
    } finally { setLoading(false); }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await base44.auth.verifyOtp({ email: form.email, otpCode: form.otp });
      base44.auth.setToken(res.access_token);
      await base44.auth.updateMe({ full_name: form.name });
      await base44.entities.Studio.create({
        name: form.studio || form.name,
        owner_email: form.email,
        city: form.city,
        r2_prefix: makePrefix(),
        plan: 'trial',
        photo_credits: 5000,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid code. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-background">
      {/* Form panel */}
      <div className="relative flex items-center justify-center px-6 py-16 order-2 lg:order-1 bg-mesh overflow-hidden">
        <div className="blob w-72 h-72 bg-primary/30 -top-20 -left-20" />
        <div className="blob w-80 h-80 bg-accent/30 -bottom-24 -right-16" style={{ animationDelay: '-7s' }} />
        <div className="blob w-56 h-56 bg-[hsl(180_45%_50%)]/30 top-1/2 left-1/3" style={{ animationDelay: '-12s' }} />
        <div className="relative w-full max-w-sm rounded-3xl bg-background/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-primary/5 p-8">
          <Logo className="mb-10 lg:hidden" />
          <div className="flex gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-border'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-border'}`} />
          </div>

          {step === 1 ? (
            <>
              <h1 className="font-heading text-3xl font-bold">Start free</h1>
              <p className="mt-2 text-sm text-muted-foreground">5,000 photo credits. No card needed.</p>
              <form onSubmit={register} className="mt-8 space-y-4">
                <Field label="Full name" icon={User}>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input input-icon" placeholder="Arjun Menon" />
                </Field>
                <Field label="Studio name" icon={Building2}>
                  <input required value={form.studio} onChange={(e) => setForm({ ...form, studio: e.target.value })} className="input input-icon" placeholder="Menon Wedding Studio" />
                </Field>
                <Field label="City" icon={MapPin}>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input input-icon" placeholder="Kochi" />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input input-icon" placeholder="you@studio.com" />
                </Field>
                <Field label="Password" icon={Lock}>
                  <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input input-icon" placeholder="At least 6 characters" />
                </Field>
                {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-[11px] text-muted-foreground text-center">By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy policy</Link>.</p>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-bold">Verify your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">We sent a one-time code to <span className="font-medium text-foreground">{form.email}</span>.</p>
              <form onSubmit={verify} className="mt-8 space-y-4">
                <input autoFocus value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} className="input text-center text-2xl tracking-[0.5em] font-mono" placeholder="••••••" maxLength={6} />
                {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button type="button" onClick={() => base44.auth.resendOtp(form.email)} className="w-full text-sm text-muted-foreground hover:text-foreground transition">Didn't get it? Resend code</button>
              </form>
            </>
          )}

          <p className="mt-8 text-sm text-center text-muted-foreground">
            Already have a studio? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Visual panel — photo with live face-scan overlay */}
      <div className="relative hidden lg:block overflow-hidden bg-primary order-1 lg:order-2">
        <img src={GALLERY[0].src} alt="" className="absolute inset-0 w-full h-full object-cover ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-primary/10" />

        {/* face-detect boxes */}
        {[[22, 30, 9], [41, 26, 8], [58, 34, 10], [74, 29, 8]].map(([x, y, s], i) => (
          <div key={i} className="absolute border-2 border-accent rounded-md" style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, aspectRatio: '1', animation: `float ${5 + i}s ease-in-out infinite`, animationDelay: `${-i * 1.3}s` }}>
            <span className="absolute -top-5 left-0 text-[10px] font-semibold text-accent bg-background/90 px-1.5 rounded">{['Anjali', 'Rahul', 'Amma', 'Guest 47'][i]}</span>
          </div>
        ))}
        <div className="absolute inset-0"><div className="scan-line" /></div>

        {/* result strip */}
        <div className="absolute bottom-40 left-10 right-10 rounded-2xl bg-background/90 backdrop-blur p-4 shadow-2xl" style={{ animation: 'float 6s ease-in-out infinite' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">4 faces indexed · 63 matches for Guest 47</div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">1.6 s</span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {[1, 3, 4, 5, 2, 0].map((n) => <img key={n} src={GALLERY[n].src} alt="" className="aspect-square object-cover rounded-md" />)}
          </div>
        </div>

        <div className="absolute top-10 right-10"><Logo inverted /></div>
        <div className="absolute bottom-0 left-0 right-0 p-10 text-primary-foreground">
          <p className="font-heading text-3xl font-semibold max-w-md leading-snug">Upload once. Every guest finds their own photos.</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
            {['No app for guests', 'Your studio on every gallery', 'Selfies deleted in 24 h'].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
