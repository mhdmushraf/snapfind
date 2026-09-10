import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, MapPin } from 'lucide-react';

const CATEGORIES = ['All', 'Weddings', 'Portraits', 'Fashion', 'Commercial', 'Fine Art', 'Editorial'];

const FALLBACK = [
  { name: 'Elena Marchetti', specialty: 'Weddings', location: 'San Francisco, CA', profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=800&q=80', rating: 5, starting_price: 2400, years_experience: 11 },
  { name: 'Marcus Bell', specialty: 'Fashion', location: 'New York, NY', profile_image: 'https://images.unsplash.com/photo-1500648766838-835d3e93f0b4?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', rating: 5, starting_price: 1200, years_experience: 9 },
  { name: 'Priya Nair', specialty: 'Portraits', location: 'San Francisco, CA', profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=800&q=80', rating: 4.9, starting_price: 450, years_experience: 7 },
  { name: 'Theo Lambert', specialty: 'Commercial', location: 'New York, NY', profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80', rating: 4.8, starting_price: 900, years_experience: 8 },
  { name: 'Sofia Reyes', specialty: 'Fine Art', location: 'Paris, FR', profile_image: 'https://images.unsplash.com/photo-1534528741775-5c1c1f5e5c1c?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', rating: 5, starting_price: 350, years_experience: 12 },
  { name: 'Daniel Cho', specialty: 'Editorial', location: 'San Francisco, CA', profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45817?auto=format&fit=crop&w=600&q=80', portfolio_image: 'https://images.unsplash.com/photo-1469474968028-5669f0772741?auto=format&fit=crop&w=800&q=80', rating: 4.9, starting_price: 800, years_experience: 6 },
];

export default function Gallery() {
  const [cat, setCat] = useState('All');
  const { data, isLoading } = useQuery({
    queryKey: ['photographers'],
    queryFn: () => base44.entities.Photographer.list('-rating', 50),
  });

  const all = data && data.length ? data : FALLBACK;
  const filtered = cat === 'All' ? all : all.filter((p) => p.specialty === cat);

  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">The collective</span>
        <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl text-balance">
          Meet the photographers behind the work.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Browse our roster by specialty. Every photographer is vetted for craft, consistency and character.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat === c ? 'bg-primary text-primary-foreground' : 'border border-border hover:border-foreground/30'}`}
          >
            {c}
          </button>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isLoading ? Array(6).fill(FALLBACK[0]) : filtered).map((p, i) => (
          <div key={i} className="group rounded-3xl overflow-hidden border border-border bg-card">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={p.portfolio_image} alt={`${p.name} — ${p.specialty} photography`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <span className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium">{p.specialty}</span>
            </div>
            <div className="p-6 flex items-center gap-4">
              <img src={p.profile_image} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-heading text-lg">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {p.rating}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.years_experience} yrs</div>
              </div>
            </div>
            <div className="px-6 pb-6 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">from <span className="font-semibold text-foreground">${p.starting_price}</span></span>
              <button className="text-sm font-medium text-accent hover:underline">Book →</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}