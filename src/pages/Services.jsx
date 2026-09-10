import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SERVICES = [
  { icon: '💍', title: 'Weddings & Elopements', desc: 'Unobtrusive, documentary-style coverage that honors the day as it unfolds — from first look to last dance.', price: 'from $2,400', img: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=900&q=80' },
  { icon: '👤', title: 'Portraits', desc: 'Editorial and lifestyle portraits with natural light and honest expression, in studio or on location.', price: 'from $450', img: 'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=900&q=80' },
  { icon: '👗', title: 'Fashion & Editorial', desc: 'Bold, magazine-grade direction for lookbooks, campaigns and designer collections.', price: 'from $1,200', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80' },
  { icon: '📦', title: 'Commercial & Product', desc: 'Clean, conversion-driven imagery for brands — e-commerce, lifestyle and advertising.', price: 'from $900', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80' },
  { icon: '🎨', title: 'Fine Art', desc: 'Limited-edition prints and gallery commissions — landscape, abstract and conceptual work.', price: 'from $350', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
  { icon: '🎬', title: 'Brand Story & Film', desc: 'Cinematic stills and short-form motion that give your brand a coherent visual voice.', price: 'from $1,800', img: 'https://images.unsplash.com/photo-1469474968028-5669f0772741?auto=format&fit=crop&w=900&q=80' },
];

export default function Services() {
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">What we do</span>
        <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl text-balance">
          Photography services for every story worth telling.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          From intimate elopements to global campaigns, our collective covers the full spectrum of professional photography — each specialty led by photographers who live and breathe their craft.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-12 grid md:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <div key={s.title} className="group rounded-3xl overflow-hidden border border-border bg-card">
            <div className="relative h-56 overflow-hidden">
              <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <span className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium">{s.price}</span>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <h3 className="font-heading text-2xl">{s.title}</h3>
              </div>
              <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-accent hover:gap-3 transition-all">
                Book this service <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="rounded-3xl bg-secondary p-10 sm:p-16">
          <h2 className="font-heading text-3xl font-light max-w-xl">Not sure which fits your project?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg">Tell us what you're envisioning and we'll recommend the right photographer and package — no obligation.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Get a recommendation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}