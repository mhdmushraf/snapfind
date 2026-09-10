import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Aperture, User, Mail, Lock, ArrowRight, Loader2, Camera } from 'lucide-react';

const SPECIALTIES = ['Weddings', 'Portraits', 'Fashion', 'Commercial', 'Fine Art', 'Editorial'];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', specialty: 'Portraits' });

  const register = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.register({ email: form.email, password: form.password });
      setStep(2);
    } catch (err) {
      setError(err?.message || 'Could not create your account. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await base44.auth.verifyOtp({ email: form.email, otpCode: form.otp });
      base44.auth.setToken(res.access_token);
      await base44.auth.updateMe({ full_name: form.name });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background order-2 md:order-1">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-10 md:hidden">
            <Aperture className="w-6 h-6 text-accent" strokeWidth={1.5} />
            <span className="font-heading text-xl font-semibold">Lumière</span>
          </Link>

          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-accent' : 'bg-border'}`} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <h1 className="font-heading text-3xl font-light">Join the collective</h1>
              <p className="mt-2 text-sm text-muted-foreground">Create your photographer account.</p>
              <form onSubmit={register} className="mt-8 space-y-4">
                <Field label="Full name" icon={User}>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-11" placeholder="Elena Marchetti" />
                </Field>
                <Field label="Email" icon={Mail}>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-11" placeholder="you@email.com" />
                </Field>
                <Field label="Password" icon={Lock}>
                  <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-11" placeholder="At least 6 characters" />
                </Field>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Your specialty</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SPECIALTIES.map((s) => (
                      <button type="button" key={s} onClick={() => setForm({ ...form, specialty: s })} className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${form.specialty === s ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-foreground/30'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </label>
                {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-light">Verify your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">We sent a one-time code to <span className="font-medium text-foreground">{form.email}</span>. Enter it below to activate your account.</p>
              <form onSubmit={verify} className="mt-8 space-y-4">
                <input autoFocus value={form.otp || ''} onChange={(e) => setForm({ ...form, otp: e.target.value })} className="input text-center text-2xl tracking-[0.5em] font-mono" placeholder="••••••" maxLength={6} />
                {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify & continue <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button type="button" onClick={() => base44.auth.resendOtp(form.email)} className="w-full text-sm text-muted-foreground hover:text-foreground transition">Didn't get it? Resend code</button>
              </form>
            </>
          )}

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already a member?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden md:block order-1 md:order-2">
        <img src="https://images.unsplash.com/photo-1516055056770-71794a4711c8?auto=format&fit=crop&w=1200&q=80" alt="Photographer with camera in golden light" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 p-12 text-white">
          <Camera className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
          <p className="font-heading text-3xl font-light max-w-sm leading-snug">Share your work with clients who value craft.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative mt-2">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}