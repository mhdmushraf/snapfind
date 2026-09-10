import { Link } from 'react-router-dom';
import { ArrowRight, Upload, ScanFace, QrCode, MessageCircle, Palette, Shield, Zap, Users, Download, Clock, Globe, BarChart3, Lock } from 'lucide-react';
import { IMG, GALLERY } from '@/lib/images';
import { FAQ, FAQS } from '@/pages/Pricing';

const GROUPS = [
  {
    title: 'Upload',
    blurb: 'Get 10,000 photos from your laptop to the cloud without babysitting it.',
    image: IMG.garland,
    items: [
      [Upload, 'Drag the whole folder', 'JPEG, PNG, HEIC, WebP up to 50 MB each. Thousands at a time.'],
      [Zap, 'Resumable uploads', 'Venue Wi-Fi drops? Upload picks up where it stopped. Nothing restarts.'],
      [Clock, 'Live upload during the event', 'Point Snapfind at your Lightroom export folder. Photos go live as you edit.'],
    ],
  },
  {
    title: 'Find',
    blurb: 'Open-source face recognition, tuned on Indian weddings.',
    image: IMG.muhurtam,
    items: [
      [ScanFace, 'Selfie search', 'A guest takes one selfie and gets every photo they appear in. Under two seconds.'],
      [BarChart3, 'Strict matching', 'Threshold tuned so cousins do not get each other\u2019s photos. Full gallery is one tap away.'],
      [Users, 'Group results', 'Parents can search for their kids. Couples can see photos of both of them together.'],
    ],
  },
  {
    title: 'Share',
    blurb: 'One QR code does the work of three weeks of WhatsApp forwarding.',
    image: IMG.hero,
    items: [
      [QrCode, 'Printable QR + link', 'Put it on table cards, the LED wall, or the thank-you note. No app, no login.'],
      [MessageCircle, 'WhatsApp delivery', 'Guests get their gallery link on WhatsApp. Every share is a referral for your studio.'],
      [Download, 'Downloads you control', 'Watermarked previews by default. Full-resolution on when you say so.'],
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
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Features</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold mt-3 max-w-3xl text-balance">Everything between the last shutter click and a happy guest.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">Built for wedding and event photographers in India. Nothing you don\u2019t need, nothing you have to explain to a guest.</p>
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
