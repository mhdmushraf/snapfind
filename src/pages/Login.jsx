import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Logo, { LogoMark } from '@/components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Unable to sign in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src="https://images.unsplash.com/photo-1452587925148-ce54479d2037?auto=format&fit=crop&w=1200&q=80" alt="Photographer at work" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 p-12 text-white">
          <LogoMark size={40} className="mb-4" />
          <p className="font-heading text-3xl font-semibold max-w-sm leading-snug">Welcome back. Your guests are waiting.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 md:hidden" />

          <h1 className="font-heading text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access your Snapfind studio dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Email</span>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-11" placeholder="you@email.com" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Password</span>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-11" placeholder="••••••••" />
              </div>
            </label>

            {error && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            New to the collective?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}