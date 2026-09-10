import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const POSTS = [
  { title: 'How to prepare for a natural-light portrait session', cat: 'Guides', read: '6 min', img: 'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=900&q=80', excerpt: 'Everything you should do the week before — wardrobe, rest, and how to relax in front of the lens.' },
  { title: 'The golden hour, explained: why photographers chase it', cat: 'Craft', read: '5 min', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', excerpt: 'A short field guide to the hour that makes almost any image better — and how to plan for it.' },
  { title: 'Choosing a wedding photographer: a no-pressure checklist', cat: 'Weddings', read: '8 min', img: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=900&q=80', excerpt: 'Twelve questions to ask before you sign — from style consistency to delivery timelines.' },
  { title: 'Building a brand visual language with one shoot', cat: 'Commercial', read: '7 min', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80', excerpt: 'How a single, well-planned session can supply a brand with imagery for an entire season.' },
  { title: 'Film vs. digital in 2026: a working photographer\'s take', cat: 'Craft', read: '9 min', img: 'https://images.unsplash.com/photo-1452587925148-ce54479d2037?auto=format&fit=crop&w=900&q=80', excerpt: 'We still shoot both. Here is when each earns its place — and why neither is going away.' },
  { title: 'What to wear: a color guide for timeless portraits', cat: 'Guides', read: '4 min', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80', excerpt: 'Earthy, muted, and tonal — the palettes that age well in photographs.' },
];

export default function Blog() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">The journal</span>
        <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl text-balance">
          Notes on light, craft and the business of images.
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
        <Link to="/journal" className="group grid md:grid-cols-2 gap-8 rounded-3xl overflow-hidden border border-border bg-card">
          <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
              <span className="text-accent">{featured.cat}</span> <span>·</span> <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.read}</span>
            </div>
            <h2 className="font-heading text-3xl font-light mt-4 leading-tight">{featured.title}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-accent group-hover:gap-3 transition-all">Read article <ArrowRight className="w-4 h-4" /></span>
          </div>
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((p) => (
          <Link to="/journal" key={p.title} className="group rounded-3xl overflow-hidden border border-border bg-card">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
                <span className="text-accent">{p.cat}</span> <span>·</span> <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.read}</span>
              </div>
              <h3 className="font-heading text-xl mt-3 leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}