import { Link } from 'react-router-dom';
import { ArrowRight, Upload, ScanFace, QrCode, MessageCircle, Palette, Shield, Zap, Users, Download, Clock, Globe, BarChart3, Lock, Heart, Bell, Film, Printer, IndianRupee, CheckSquare, Layers, Tv, Eye } from 'lucide-react';
import { IMG, GALLERY } from '@/lib/images';
import { FAQ, FAQS } from '@/pages/Pricing';

/* ---------- Purpose-built visuals for the two software-concept sections ---------- */

function CullVisual() {
  const frames = [
    { keep: true,  label: '92' },
    { keep: false, label: 'blink' },
    { keep: false, label: 'dup' },
    { keep: false, label: 'blur' },
    { keep: true,  label: '88' },
    { keep: false, label: 'dup' },
    { keep: true,  label: '95' },
    { keep: false, label: 'dup' },
    { keep: false, label: 'blink' },
  ];
  return (
    <div className="rounded-3xl bg-card border border-border p-6 h-80 lg:h-[420px] flex flex-col justify-center">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold">Burst group · 9 frames</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">3 kept</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {frames.map((f, i) => (
          <div key={i} className={`relative aspect-square rounded-xl border-2 flex items-center justify-center text-xs font-semibold transition ${f.keep ? 'border-accent bg-accent/5 text-accent' : 'border-dashed border-border bg-muted/40 text-muted-foreground opacity-60'}`}>
            {f.keep ? <span>{f.label}</span> : <span className="line-through">{f.label}</span>}
            {f.keep && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">✓</span>}
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">Quality score out of 100. Nothing is deleted — low scores are just hidden until you say otherwise.</p>
    </div>
  );
}

function SortVisual() {
  const rows = [
    { name: "Bride's side", n: 1240, w: '78%' },
    { name: "Groom's side", n: 1105, w: '70%' },
    { name: 'Couple together', n: 386, w: '32%' },
    { name: 'Not yet found', n: 12, w: '8%', warn: true },
  ];
  return (
    <div className="rounded-3xl bg-card border border-border p-6 h-80 lg:h-[420px] flex flex-col justify-center">
      <span className="text-sm font-semibold">Anjali &amp; Rahul · 6,412 photos</span>
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className={r.warn ? 'text-accent font-semibold' : 'font-medium'}>{r.name}</span>
              <span className="text-muted-foreground">{r.n.toLocaleString('en-IN')}{r.warn ? ' guests' : ' photos'}</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${r.warn ? 'bg-accent' : 'bg-primary'}`} style={{ width: r.w }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">12 guests searched and found nothing — the shots you missed, before anyone asks.</p>
    </div>
  );
}

const GROUPS = [
  {
    title: 'Upload',
    blurb: 'Get 10,000 photos from your laptop to the cloud without babysitting it.',
    image: IMG.photographer,
    items: [
      [Upload, 'Drag the whole folder', 'JPEG, PNG, HEIC, WebP up to 50 MB each. Thousands at a time.'],
      [Zap, 'Resumable uploads', 'Venue Wi-Fi drops? Upload picks up where it stopped. Nothing restarts.'],
      [Clock, 'Live upload during the event', 'Point Snapfind at your Lightroom export folder. Photos go live as you edit.'],
    ],
  },
  {
    title: 'Find',
    blurb: 'Open-source face recognition, tuned on Indian weddings.',
    image: IMG.sadya,
    items: [
      [ScanFace, 'Selfie search', 'A guest takes one selfie and gets every photo they appear in. Under two seconds.'],
      [BarChart3, 'Strict matching', 'Threshold tuned so cousins do not get each other’s photos. Full gallery is one tap away.'],
      [Users, 'Group results', 'Parents can search for their kids. Couples can see photos of both of them together.'],
    ],
  },
  {
    title: 'Cull',
    blurb: 'Skip the 6 hours of deleting blinks and duplicates.',
    visual: CullVisual,
    items: [
      [Zap, 'Burst de-duplication', 'Groups near-identical frames and picks the sharpest. You review one, not nine.'],
      [ScanFace, 'Closed eyes + blur flags', 'Every frame gets a quality score. Hide the bottom 20% with one toggle before guests ever see it.'],
      [Download, 'Your call, always', 'Culling only suggests. Nothing is deleted until you say so.'],
    ],
  },
  {
    title: 'Share',
    blurb: 'One QR code does the work of three weeks of WhatsApp forwarding.',
    image: IMG.qrTable,
    items: [
      [QrCode, 'Printable QR + link', 'Put it on table cards, the LED wall, or the thank-you note. No app, no login.'],
      [MessageCircle, 'WhatsApp delivery', 'Guests get their gallery link on WhatsApp. Every share is a referral for your studio.'],
      [Download, 'Downloads you control', 'Watermarked previews by default. Full-resolution on when you say so.'],
      [Tv, 'Live venue screen', 'Guest photos rotate on the LED wall while the reception is still on. The whole hall watches your work.'],
    ],
  },
  {
    title: 'Deliver smarter',
    blurb: 'Once we know who is in every frame, the boring sorting does itself.',
    visual: SortVisual,
    items: [
      [Heart, 'Couple album, auto-built', 'Every frame with both bride and groom, ranked by quality. The album shortlist before you open Lightroom.'],
      [Layers, 'Family sets', 'Bride’s side and groom’s side grouped automatically from who appears with whom.'],
      [Bell, 'Missing-guest alert', 'See who searched and found nothing. Know which guests you missed before they tell you. No one else offers this.'],
      [CheckSquare, 'Client approval', 'The couple picks album photos from the gallery. You get the shortlist, not 40 screenshots.'],
    ],
  },
  {
    title: 'Earn',
    blurb: 'Guests pay for what they love. You keep most of it.',
    image: IMG.baraat,
    items: [
      [Printer, 'Print orders from the gallery', 'A guest sees their 40 photos and orders a frame or album. You earn on every order without touching it.'],
      [IndianRupee, 'Full-res download upsell', 'Free watermarked previews, paid full-resolution downloads. Split 70/30 in your favour.'],
      [Film, 'Same-night reel', 'Top 30 frames by quality score, music, vertical export. Post it on Instagram before the sadya is cleared.'],
      [Users, 'Next-wedding leads', 'Guests who searched are the next couples getting married. A “book this studio” button on every gallery.'],
    ],
  },
  {
    title: 'Run the studio',
    blurb: 'Every function, every community, in one place.',
    image: IMG.oppana,
    items: [
      [Layers, 'Multi-event packages', 'Nikah, walima, haldi, sangeet, reception — one project, one QR, separate galleries.'],
      [Eye, 'Delivery tracker', 'Who has seen their photos, who downloaded, who hasn’t opened. Nudge them on WhatsApp in one tap.'],
      [Users, 'Team seats', 'Second shooters upload, editors cull, you approve. Everyone sees the same event list.'],
    ],
  },
  {
    title: 'Brand & trust',
    blurb: 'Guests remember the studio. Data never leaks.',
    image: IMG.church,
    items: [
      [Palette, 'Your logo everywhere', 'Studio name, logo, colours and watermark on every gallery and message.'],
      [Globe, 'Custom domain', 'gallery.yourstudio.com on the Studio plan.'],
      [Shield, 'DPDP-ready consent', 'Explicit consent before every selfie. Selfies deleted in 24 h. Face data deleted on expiry.'],
      [Lock, 'Password + expiry', 'Optional event password. Galleries expire when you choose.'],
    ],
  },
];

export default function Features() {
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Features</span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold mt-3 text-balance">Everything between the last shutter click and a paid, happy guest.</h1>
          <p className="mt-5 max-w-xl text-muted-foreground">Find, cull, deliver and earn — built for wedding and event photographers across India. Nikah or muhurtam, Malabar or Madurai: once Snapfind knows who is in every frame, the rest of the work does itself.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
            <img src={IMG.groupPortrait} alt="Kerala wedding reception" className="w-full h-56 object-cover rounded-2xl" />
            <img src={IMG.church} alt="Kerala Christian wedding crowning" className="w-full h-40 object-cover rounded-2xl" />
          </div>
          <div className="space-y-3 pt-8">
            <img src={IMG.thali} alt="Kerala Hindu wedding mandapam" className="w-full h-40 object-cover rounded-2xl" />
            <img src={IMG.oppana} alt="Oppana at a Kerala Muslim wedding" className="w-full h-56 object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      {GROUPS.map((g, i) => (
        <section key={g.title} className={`${i % 2 ? 'bg-secondary/40 border-y border-border' : ''}`}>
          <div className={`max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            {g.visual ? <g.visual /> : <img src={g.image} alt="" className="w-full h-80 lg:h-[420px] object-cover rounded-3xl" />}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{g.title}</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3">{g.blurb}</h2>
              <ul className="mt-8 space-y-6">
                {g.items.map(([Icon, t, b]) => (
                  <li key={t} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-semibold">{t}</div>
                      <div className="text-sm text-muted-foreground mt-1">{b}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY.map((g) => (
            <img key={g.src} src={g.src} alt={g.alt} className="aspect-[4/3] w-full object-cover rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <FAQ items={FAQS.slice(0, 8)} />
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 sm:p-16 text-center">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold">Try it on your next wedding, free.</h2>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
