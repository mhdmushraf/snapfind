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
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
      <div className="flex items-center justify-center px-6 py-16 order-2 lg:order-1">
        <div className="w-full max-w-sm">
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
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-11" placeholder="Arjun Menon" />
                </Field>
                <Field label="Studio name" icon={Building2}>
                  <input required value={form.studio} onChange={(e) => setForm({ ...form, studio: e.target.value })} className="input pl-11" placeholder="Menon Wedding Studio" />
                </Field>
                <Field label="City" icon={MapPin}>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input pl-11" placeholder="Kochi" />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-11" placeholder="you@studio.com" />
                </Field>
                <Field label="Password" icon={Lock}>
                  <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-11" placeholder="At least 6 characters" />
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

      {/* Visual panel — mosaic */}
      <div className="relative hidden lg:block overflow-hidden bg-primary order-1 lg:order-2">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-2">
          <img src={GALLERY[0].src} alt="" className="col-span-2 row-span-2 w-full h-full object-cover rounded-2xl" />
          <img src={GALLERY[1].src} alt="" className="w-full h-full object-cover rounded-2xl" />
          <img src={GALLERY[3].src} alt="" className="w-full h-full object-cover rounded-2xl" />
          <img src={GALLERY[4].src} alt="" className="w-full h-full object-cover rounded-2xl" />
          <img src={GALLERY[2].src} alt="" className="col-span-2 w-full h-full object-cover rounded-2xl" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute top-10 right-10"><Logo inverted /></div>
        <div className="absolute bottom-0 left-0 right-0 p-10 text-primary-foreground">
          <p className="font-heading text-3xl font-semibold max-w-md leading-snug">Upload once. Every guest finds their own photos.</p>
          <ul className="mt-5 space-y-2 text-sm text-primary-foreground/85">
            {['No app for guests to install', 'Your studio name on every gallery', 'Selfies deleted within 24 hours'].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
