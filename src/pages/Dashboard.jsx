import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Camera, Star, MapPin, Plus, LogOut, Image as ImageIcon } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-5 sm:px-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Photographer portal</span>
          <h1 className="font-heading text-4xl font-light mt-2">Hello, {user?.full_name?.split(' ')[0] || 'artist'}.</h1>
        </div>
        <button onClick={() => base44.auth.logout('/')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Profile views', value: '1,284', icon: ImageIcon },
          { label: 'Active inquiries', value: '7', icon: Camera },
          { label: 'Avg. rating', value: '4.9★', icon: Star },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <s.icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="font-heading text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl">Your portfolio</h2>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> New project
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
          ].map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden group relative">
              <img src={src} alt={`Portfolio piece ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" /> Set your home city and rates to start receiving inquiries.
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">← Back to site</Link>
      </div>
    </div>
  );
}