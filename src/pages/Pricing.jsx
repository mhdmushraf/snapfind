import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  { name: 'Essential', price: '450', tag: 'Portraits & headshots', features: ['1-hour session', '1 location', '30 edited images', 'Online gallery', 'Print release'], img: 'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Signature', price: '1,200', tag: 'Most popular', popular: true, features: ['3-hour session', '2 locations', '120 edited images', 'Online gallery + downloads', 'Print release', '10 fine-art prints'], img: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Atelier', price: '2,400', tag: 'Weddings & campaigns', features: ['Full-day coverage', 'Unlimited locations', '400+ edited images', 'Second photographer', 'Heirloom album', 'Rush delivery'], img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80' },
];

const FAQ = [
  { q: 'How do you match me with a photographer?', a: 'Share your project details and we recommend photographers by specialty, style and availability — you choose who you book.' },
  { q: 'What is included in editing?', a: 'Every package includes professional color and tone editing. Retouching beyond standard is available as an add-on.' },
  { q: 'How fast is delivery?', a: 'Galleries are delivered within 7–14 days. Rush delivery is available on Signature and Atelier plans.' },
  { q: 'Do you travel?', a: 'Yes — our photographers work worldwide. Travel is included within 50 miles of their home city and billed at cost beyond that.' },
];

export default function Pricing() {
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">Pricing</span>
        <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl mx-auto text-balance">
          Transparent packages, no surprises.
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          Choose a starting point — every session is tailored to your story, and add-ons are always optional.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.name} className={`relative rounded-3xl border bg-card p-8 flex flex-col ${p.popular ? 'border-accent shadow-lg shadow-accent/10 md:-translate-y-3' : 'border-border'}`}>
            {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-medium px-4 py-1.5 rounded-full">{p.tag}</span>}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-heading text-2xl">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">from $</span>
              <span className="font-heading text-4xl font-semibold">{p.price}</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className={`mt-8 text-center py-3 rounded-full font-medium transition ${p.popular ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-foreground/15 hover:border-foreground/40'}`}>
              Choose {p.name}
            </Link>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <h2 className="font-heading text-3xl font-light text-center mb-10">Frequently asked</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition">
            Get a custom quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}