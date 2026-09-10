import { Link } from 'react-router-dom';
import { ArrowRight, Star, Camera, Heart, Award } from 'lucide-react';

const HERO = 'https://images.unsplash.com/photo-1516055056770-71794a4711c8?auto=format&fit=crop&w=1800&q=80';
const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?auto=format&fit=crop&w=800&q=80', title: 'Golden Hour Bride', cat: 'Weddings' },
  { src: 'https://images.unsplash.com/photo-1487412720507-e7ab377c3c7d?auto=format&fit=crop&w=800&q=80', title: 'Studio Portrait', cat: 'Portraits' },
  { src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80', title: 'Runway Light', cat: 'Fashion' },
  { src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80', title: 'Product Still', cat: 'Commercial' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', title: 'Mountain Fog', cat: 'Fine Art' },
  { src: 'https://images.unsplash.com/photo-1469474968028-5669f0772741?auto=format&fit=crop&w=800&q=80', title: 'Autumn Ridge', cat: 'Editorial' },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[620px] flex items-end overflow-hidden">
        <img src={HERO} alt="Photographer holding a vintage camera in warm golden light" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24 text-white">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-5">
            <Camera className="w-4 h-4" /> Award-winning photography collective
          </span>
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-light leading-[0.95] max-w-4xl text-balance">
            Where light becomes <em className="not-italic text-accent">legacy</em>.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
            A curated collective of photographers for weddings, portraits, fashion and brands — capturing moments worth keeping forever.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/gallery" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition">
              Explore the gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="px-6 py-3.5 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition">
              Join as a photographer
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Camera, n: '120+', l: 'Curated photographers' },
            { icon: Heart, n: '4,800', l: 'Sessions delivered' },
            { icon: Star, n: '4.9★', l: 'Average client rating' },
            { icon: Award, n: '37', l: 'Industry awards' },
          ].map((s) => (
            <div key={s.l} className="flex items-center gap-3">
              <s.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
              <div>
                <div className="font-heading text-2xl font-semibold">{s.n}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-accent">Our philosophy</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-light mt-4 leading-tight">
            Photography that feels less like a service, more like a collaboration.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Every photographer in our collective is hand-picked for their eye, their craft, and their ability to disappear into the moment. The result is imagery with intention — honest, luminous, and unmistakably yours.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 mt-8 font-medium text-accent hover:gap-3 transition-all">
            Read our story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80" alt="Editorial portrait in soft studio light" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-accent">Selected work</span>
            <h2 className="font-heading text-4xl font-light mt-3">A glimpse of the collective</h2>
          </div>
          <Link to="/gallery" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((g, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2 md:col-span-1' : ''}`}>
              <img src={g.src} alt={g.title} className="w-full h-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <div className="text-white">
                  <div className="text-xs uppercase tracking-wider text-accent">{g.cat}</div>
                  <div className="font-heading text-lg">{g.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 mt-24">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground px-8 sm:px-16 py-20 text-center">
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative">
            <h2 className="font-heading text-4xl sm:text-5xl font-light max-w-2xl mx-auto text-balance">
              Have a moment worth keeping? Let's frame it.
            </h2>
            <p className="mt-5 text-primary-foreground/70 max-w-lg mx-auto">
              Tell us your story and we'll match you with the perfect photographer from our collective.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 mt-9 px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-medium hover:opacity-90 transition">
              Start your project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}