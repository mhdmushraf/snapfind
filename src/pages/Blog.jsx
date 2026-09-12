import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { GALLERY, IMG } from '@/lib/images';

/** Blog leads with the QR-table shot so it doesn't echo Home's hero photo. */
const BLOG_IMAGES = [
  { src: IMG.qrTable,      alt: 'Guests finding their photos by scanning a QR code' },
  { src: IMG.photographer, alt: 'Wedding photographer at work' },
  { src: IMG.oppana,       alt: 'Oppana at a Kerala Muslim wedding' },
  { src: IMG.haldi,        alt: 'Haldi ceremony in a Kerala courtyard' },
  { src: IMG.church,       alt: 'Crowning at a Kerala Christian wedding' },
  { src: IMG.sadya,        alt: 'Wedding sadya on banana leaves' },
  { src: IMG.thali,        alt: 'Tying the thali at a Kerala Hindu wedding' },
  { src: IMG.cakeCutting,  alt: 'Cake cutting at a Kerala wedding reception' },
];

const POSTS = [
  {
    cat: 'Guides',
    mins: 9,
    title: 'How to deliver 8,000 wedding photos without a single WhatsApp forward',
    excerpt: 'The workflow Kerala studios are switching to: upload once, print one QR code, let every guest find themselves. What to put on the table cards and when to share the link.',
  },
  {
    cat: 'Malabar',
    mins: 7,
    title: 'Shooting a Mappila nikah: what a first-time photographer should know',
    excerpt: 'Separate spaces for the nikah, two shooters, oppana lighting, and the gold. Practical coverage notes for Kozhikode and Malappuram weddings.',
  },
  {
    cat: 'Craft',
    mins: 6,
    title: 'Culling 8,000 frames down to 1,500 without losing a day',
    excerpt: 'Burst duplicates, blinks, missed focus. Where AI genuinely helps, where it still gets it wrong, and how to keep final say over every frame.',
  },
  {
    cat: 'Privacy',
    mins: 8,
    title: 'Face recognition at weddings and India\u2019s DPDP Act: what photographers must know',
    excerpt: 'Guest faces are personal data. Who is the data fiduciary, what consent has to look like, and how long you can keep face data. Plain language, no legalese.',
  },
  {
    cat: 'Business',
    mins: 7,
    title: 'Making money after the wedding: prints, downloads and the 300 guests you already have',
    excerpt: 'The album is paid for on the day. Everything after is margin. What converts, what does not, and realistic numbers from Indian weddings.',
  },
  {
    cat: 'Kerala',
    mins: 5,
    title: 'One project, five functions: covering a full Kerala wedding week',
    excerpt: 'Haldi, nikah or muhurtam, reception, sadya, and the after-party. How to keep five galleries organised under one booking without confusing the family.',
  },
  {
    cat: 'Kochi & Kottayam',
    mins: 6,
    title: 'Church weddings in central Kerala: light, timing and the crowning moment',
    excerpt: 'Syro-Malabar and Orthodox ceremonies have a fixed sequence. Knowing it means you are in position before the crowning, not after.',
  },
  {
    cat: 'Craft',
    mins: 4,
    title: 'Why face search struggles at Indian weddings \u2014 and how we fixed it',
    excerpt: 'Mandap uplighting, heavy bridal makeup, 40 relatives who genuinely resemble each other. The threshold problem, explained honestly.',
  },
];

export default function Blog() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The journal</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold mt-3 max-w-3xl text-balance">
          Notes on delivering weddings, from people who shoot them.
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Workflow, culling, privacy law and the business of wedding photography in India.
        </p>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center rounded-3xl border border-border overflow-hidden">
          <img src={BLOG_IMAGES[0].src} alt={BLOG_IMAGES[0].alt} className="w-full h-72 lg:h-96 object-cover" />
          <div className="p-8 lg:pr-12">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-accent font-semibold uppercase tracking-wider">{featured.cat}</span>
              <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.mins} min</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-4">{featured.title}</h2>
            <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-accent font-semibold">Read article <ArrowRight className="w-4 h-4" /></span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((p, i) => {
          const img = BLOG_IMAGES[(i + 1) % BLOG_IMAGES.length];
          return (
            <article key={p.title} className="rounded-2xl border border-border overflow-hidden hover:border-primary/40 transition group">
              <img src={img.src} alt={img.alt} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-accent font-semibold uppercase tracking-wider">{p.cat}</span>
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {p.mins} min</span>
                </div>
                <h3 className="font-heading text-lg font-semibold mt-3 leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 sm:p-14 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold">Try it on your next wedding, free.</h2>
          <p className="mt-3 text-primary-foreground/80">5,000 photo credits. No card needed.</p>
          <Link to="/register" className="mt-7 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
