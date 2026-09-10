import { Link } from 'react-router-dom';
import { ArrowRight, Upload, ScanFace, QrCode, MessageCircle, Palette, Shield, Zap, Users, Download, Clock, Globe, BarChart3, Lock, Heart, Bell, Film, Printer, IndianRupee, CheckSquare, Layers, Tv, Eye } from 'lucide-react';
import { IMG, GALLERY } from '@/lib/images';
import { FAQ, FAQS } from '@/pages/Pricing';

const GROUPS = [
  {
    title: 'Upload',
    blurb: 'Get 10,000 photos from your laptop to the cloud without babysitting it.',
    image: IMG.baraat,
    items: [
      [Upload, 'Drag the whole folder', 'JPEG, PNG, HEIC, WebP up to 50 MB each. Thousands at a time.'],
      [Zap, 'Resumable uploads', 'Venue Wi-Fi drops? Upload picks up where it stopped. Nothing restarts.'],
      [Clock, 'Live upload during the event', 'Point Snapfind at your Lightroom export folder. Photos go live as you edit.'],
    ],
  },
  {
    title: 'Find',
    blurb: 'Open-source face recognition, tuned on Indian weddings.',
    image: IMG.garland,
    items: [
      [ScanFace, 'Selfie search', 'A guest takes one selfie and gets every photo they appear in. Under two seconds.'],
      [BarChart3, 'Strict matching', 'Threshold tuned so cousins do not get each other’s photos. Full gallery is one tap away.'],
      [Users, 'Group results', 'Parents can search for their kids. Couples can see photos of both of them together.'],
    ],
  },
  {
    title: 'Cull',
    blurb: 'Skip the 6 hours of deleting blinks and duplicates.',
    image: IMG.jaymal,
    items: [
      [Zap, 'Burst de-duplication', 'Groups near-identical frames and picks the sharpest. You review one, not nine.'],
      [ScanFace, 'Closed eyes + blur flags', 'Every frame gets a quality score. Hide the bottom 20% with one toggle before guests ever see it.'],
      [Download, 'Your call, always', 'Culling only suggests. Nothing is deleted until you say so.'],
    ],
  },
  {
    title: 'Share',
    blurb: 'One QR code does the work of three weeks of WhatsApp forwarding.',
    image: IMG.crowning,
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
    image: IMG.mehndi,
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
    image: IMG.familyDance,
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
    image: IMG.walima,
    items: [
      [Layers, 'Multi-event packages', 'Nikah, walima, haldi, sangeet, reception — one project, one QR, separate galleries.'],
      [Eye, 'Delivery tracker', 'Who has seen their photos, who downloaded, who hasn’t opened. Nudge them on WhatsApp in one tap.'],
      [Users, 'Team seats', 'Second shooters upload, editors cull, you approve. Everyone sees the same event list.'],
    ],
  },
  {
    title: 'Brand & trust',
    blurb: 'Guests remember the studio. Data never leaks.',
    image: IMG.jewelry,
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
            <img src={IMG.nikah} alt="Nikah ceremony" className="w-full h-56 object-cover rounded-2xl" />
            <img src={IMG.crowning} alt="Kerala Christian wedding crowning" className="w-full h-40 object-cover rounded-2xl" />
          </div>
          <div className="space-y-3 pt-8">
            <img src={IMG.mandapam} alt="Hindu bride at the mandapam" className="w-full h-40 object-cover rounded-2xl" />
            <img src={IMG.walima} alt="Muslim wedding reception" className="w-full h-56 object-cover rounded-2xl" />
          </div>
        </div>
      </section>

      {GROUPS.map((g, i) => (
        <section key={g.title} className={`${i % 2 ? 'bg-secondary/40 border-y border-border' : ''}`}>
          <div className={`max-w-7xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <img src={g.image} alt="" className="w-full h-80 lg:h-[420px] object-cover rounded-3xl" />
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
