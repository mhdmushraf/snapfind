import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    unit: '5,000 photo credits',
    tagline: 'Try it on your next wedding.',
    features: ['1 studio, 1 user', 'Face search + QR galleries', 'Watermarked previews', 'WhatsApp gallery link', 'Galleries live 30 days'],
    cta: 'Start free',
    to: '/register',
  },
  {
    name: 'Pay per event',
    price: '₹0.08',
    unit: 'per photo · no monthly fee',
    tagline: 'A 6,000-photo wedding costs about ₹480.',
    features: ['Everything in Free', 'Unlimited events', 'Your logo + watermark', 'Full-resolution downloads', 'Galleries live 12 months', 'Email + WhatsApp support'],
    cta: 'Start free, upgrade later',
    to: '/register',
    popular: true,
  },
  {
    name: 'Studio',
    price: '₹2,499',
    unit: 'per month · 40,000 photos',
    tagline: 'For studios shooting 4+ weddings a month.',
    features: ['Everything in Pay per event', '5 team members', 'Live upload during the event', 'Custom domain for galleries', 'Priority indexing', 'Priority WhatsApp support'],
    cta: 'Talk to us',
    to: '/contact',
  },
];

export const FAQS = [
  ['How does the face search actually work?', 'Every photo you upload is scanned by an open-source face-recognition model. Each face becomes a small set of numbers. When a guest takes a selfie, we turn that into numbers too and compare it against every face in the event. Photos above the match threshold come back, usually in under two seconds.'],
  ['Does it work with big Indian weddings — 500+ guests, relatives who look alike?', 'That is exactly what we tuned it on: Kerala and Tamil weddings, mandap lighting, heavy bridal makeup. The match threshold is deliberately strict so a cousin does not get your photos. Guests can always open the full gallery if you allow it.'],
  ['Do guests need to install an app or create an account?', 'No. They scan a QR code, the browser opens the camera, they take a selfie. Works on any phone, any network.'],
  ['What happens to the guest\u2019s selfie and face data?', 'The selfie is used once to search and deleted within 24 hours. Face data for the whole event is deleted when the event expires. Every guest gives explicit consent before the camera opens, in line with India\u2019s DPDP Act. We never sell or share face data.'],
  ['How long does indexing take?', 'Roughly 5,000 photos in 20\u201330 minutes on our standard queue. Studio plan gets priority indexing. You can start sharing the QR code while indexing runs \u2014 results fill in as photos are processed.'],
  ['Can guests download full-resolution photos?', 'That is your call, per event. Free plan serves watermarked previews only. Paid plans let you switch on full-resolution download, with or without watermark.'],
  ['What file types and sizes can I upload?', 'JPEG, PNG, HEIC and WebP up to 50 MB each. RAW files are not supported \u2014 export from Lightroom first. Uploads are resumable, so a dropped connection picks up where it left off.'],
  ['Is my studio branding on the gallery?', 'Yes. Your logo, colours and studio name appear on every guest gallery and every WhatsApp message. Guests remember your studio, not Snapfind.'],
  ['What is the WhatsApp feature?', 'A guest can optionally enter their phone number and receive their gallery link on WhatsApp. It also lets you send a \u201cyour photos are ready\u201d message to everyone who searched.'],
  ['How do photo credits work?', 'One credit is used per photo uploaded. Free plan includes 5,000 credits. Pay per event is billed at \u20b90.08 per photo when you finish uploading an event. Studio plan includes 40,000 photos a month.'],
  ['Can I delete an event early?', 'Yes, any time from the dashboard. Photos, previews and face data are removed within 24 hours of deletion.'],
  ['Do you support multiple photographers or editors in one studio?', 'Studio plan supports 5 team members with a shared events list. Free and Pay per event are single-user.'],
  ['Where is the data stored?', 'Photos and galleries are stored on encrypted object storage with a global CDN. Face vectors are stored separately from photos and are deleted on event expiry.'],
  ['How do I pay?', 'UPI, cards and net banking via Razorpay. GST invoices are issued for every payment.'],
];

export function FAQ({ items = FAQS, title = 'Frequently asked' }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center">{title}</h2>
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {items.map(([q, a], i) => (
          <button key={q} onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left px-6 py-5 bg-card hover:bg-secondary/40 transition">
            <div className="flex justify-between items-start gap-4">
              <span className="font-semibold">{q}</span>
              <span className={`text-accent text-2xl leading-none transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
            </div>
            {open === i && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Pricing</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold mt-3 text-balance">Pay per photo. Nothing per month.</h1>
        <p className="mt-5 max-w-xl mx-auto text-muted-foreground">Start free with 5,000 photos. After that, pay only for the weddings you shoot. A typical Kerala wedding costs less than a single print.</p>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 grid md:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <div key={p.name} className={`relative rounded-3xl border p-8 flex flex-col ${p.popular ? 'border-accent shadow-xl shadow-accent/10' : 'border-border'}`}>
            {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">Most popular</span>}
            <h3 className="font-heading text-xl font-semibold">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-heading text-5xl font-extrabold">{p.price}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{p.unit}</div>
            <p className="mt-3 text-sm">{p.tagline}</p>
            <ul className="mt-6 space-y-2.5 text-sm flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5"><Check className="w-4 h-4 text-accent shrink-0 mt-0.5" /> {f}</li>
              ))}
            </ul>
            <Link to={p.to} className={`mt-8 inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition ${p.popular ? 'bg-accent text-accent-foreground hover:opacity-90' : 'border border-border hover:border-foreground/40'}`}>
              {p.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24">
        <FAQ />
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Still have a question? <Link to="/contact" className="text-accent font-medium hover:underline">Message us on WhatsApp</Link>
        </p>
      </section>
    </div>
  );
}
