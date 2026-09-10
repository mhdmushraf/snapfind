import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';

const VALUES = [
  { title: 'Craft over volume', desc: 'We shoot fewer sessions, deliberately — so every frame gets the attention it deserves.' },
  { title: 'People first', desc: 'Behind every lens is a human. We earn trust before we press the shutter.' },
  { title: 'Light, always', desc: 'Natural, sculpted, or staged — light is the only material we work with.' },
];

const TEAM = [
  { name: 'Elena Marchetti', role: 'Founder · Weddings', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
  { name: 'Marcus Bell', role: 'Fashion Director', img: 'https://images.unsplash.com/photo-1500648766838-835d3e93f0b4?auto=format&fit=crop&w=600&q=80' },
  { name: 'Priya Nair', role: 'Portraits Lead', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80' },
  { name: 'Theo Lambert', role: 'Commercial', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
];

export default function About() {
  return (
    <div className="pt-16">
      <section className="relative h-[60vh] min-h-[420px] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1452587925148-ce54479d2037?auto=format&fit=crop&w=1800&q=80" alt="Photographer at work in soft window light" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-white">
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Our story</span>
          <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl text-balance">
            A collective built on light, trust and quiet obsession.
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="aspect-[4/5] rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80" alt="Camera equipment laid out on a wooden surface" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-heading text-3xl font-light">Founded in 2014, refined every season since.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Lumière began as a single darkroom in San Francisco and grew into a collective of photographers who share one belief: a great image isn't taken, it's earned. We've spent a decade refining a process that pairs technical precision with genuine human connection.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Today our photographers work across three cities and dozens of disciplines, but the standard never changes — only the light does.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid md:grid-cols-3 gap-6">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-3xl border border-border bg-card p-8">
            <h3 className="font-heading text-xl">{v.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <h2 className="font-heading text-3xl font-light mb-10">The people behind the lens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((t) => (
            <div key={t.name} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <h3 className="font-heading text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
        <div className="rounded-3xl bg-secondary p-10 sm:p-16 relative">
          <Quote className="w-10 h-10 text-accent mb-6" />
          <p className="font-heading text-2xl sm:text-3xl font-light max-w-3xl leading-snug text-balance">
            "They didn't just photograph our wedding — they understood it. Every image feels like a memory we actually had."
          </p>
          <p className="mt-6 text-sm text-muted-foreground">— Ana & James, married in Big Sur</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          Work with us <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}