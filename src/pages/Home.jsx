import { Link } from 'react-router-dom';
import { ArrowRight, Upload, QrCode, ScanFace, MessageCircle, Shield, Zap, Palette, Download, Clock, Users, CheckCircle2, Bell, Heart, Printer, Film, Scissors } from 'lucide-react';
import { LogoMark } from '@/components/Logo';

/* ---------- Phone mockup: guest flow, pure CSS/SVG, no external images ---------- */
function PhoneMock() {
  const tiles = Array.from({ length: 9 });
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      <div className="absolute -inset-6 bg-accent/20 blur-3xl rounded-full" />
      <div className="relative rounded-[2.4rem] border-[10px] border-foreground bg-foreground shadow-2xl">
        <div className="rounded-[1.8rem] bg-background overflow-hidden">
          <div className="h-6 flex justify-center items-end pb-1">
            <div className="w-20 h-4 bg-foreground rounded-b-2xl" />
          </div>
          <div className="px-4 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={22} />
              <span className="text-xs font-semibold">Anjali &amp; Rahul</span>
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">Live</span>
            </div>
            <div className="rounded-2xl bg-secondary p-3 flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center">
                <ScanFace className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold">Found 47 photos of you</div>
                <div className="text-[10px] text-muted-foreground">Matched in 1.8 seconds</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {tiles.map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{
                    background: `linear-gradient(${135 + i * 20}deg, hsl(180 45% ${72 - (i % 3) * 8}%), hsl(9 80% ${78 - (i % 4) * 6}%))`,
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 h-9 rounded-full bg-accent text-accent-foreground text-[11px] font-semibold flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download all
              </div>
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const STEPS = [
  { icon: Upload, title: 'Upload the wedding', body: 'Drag the whole folder in — 5,000 or 15,000 photos. Uploads go straight to storage and resume if the network drops.' },
  { icon: ScanFace, title: 'Snapfind indexes every face', body: 'Open-source face recognition finds and maps every person in every frame. Usually done before the reception ends.' },
  { icon: QrCode, title: 'Share one QR code', body: 'Print it on the table cards or send it on WhatsApp. No app to install, no login for guests.' },
  { icon: MessageCircle, title: 'Guests get only their photos', body: 'A guest takes a selfie and sees just the photos they appear in — with the full gallery a tap away if you allow it.' },
];

const FEATURES = [
  { icon: Zap, title: 'Same-day delivery', body: 'Index 10,000 photos in under an hour. Guests find themselves before they leave the venue.' },
  { icon: Scissors, title: 'Smart culling', body: 'Blinks, blur and burst duplicates flagged automatically. Skip 6 hours of deleting.' },
  { icon: Bell, title: 'Missing-guest alert', body: 'See who searched and found nothing. Know who you missed before they tell you. Only on Snapfind.' },
  { icon: Heart, title: 'Couple album, auto-built', body: 'Every frame with both bride and groom, ranked by quality. The shortlist before you open Lightroom.' },
  { icon: Printer, title: 'Earn from every gallery', body: 'Guests order prints and full-res downloads. You keep 70% without lifting a finger.' },
  { icon: Film, title: 'Same-night reel', body: 'Top 30 frames, music, vertical export. On Instagram before the sadya is cleared.' },
  { icon: MessageCircle, title: 'WhatsApp built in', body: 'Guests get their gallery link on WhatsApp. Every share is a referral for your studio.' },
  { icon: Palette, title: 'Your brand, not ours', body: 'Your logo, colours and watermark on every preview. Guests remember the studio, not the software.' },
  { icon: Shield, title: 'DPDP-ready consent', body: 'Explicit consent before every selfie. Selfies deleted in 24 hours. Face data deleted on expiry.' },
];

const FAQS = [
  { q: 'Does it work with Indian wedding crowds — 500 guests, hundreds of relatives who look alike?', a: 'That is exactly what we tuned it on. Kerala and Tamil Nadu weddings, mandap lighting, heavy makeup. The match threshold is set so a cousin does not get your photos.' },
  { q: 'Do guests need to install an app?', a: 'No. They scan a QR code, the browser opens the camera, they take a selfie. Works on any phone.' },
  { q: 'What happens to the selfie?', a: 'It is used once to search, then deleted within 24 hours. Face data for the whole event is deleted when the event expires. We never sell or share it.' },
  { q: 'How much does it cost?', a: 'Start free with 5,000 photo credits. After that it is priced per photo, with no monthly fee — pay only for the weddings you shoot.' },
];

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden grain">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-5">
              <ScanFace className="w-4 h-4" /> AI face search for wedding photographers
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold leading-[1.05] text-balance">
              Every guest finds their own photos <span className="text-primary">in seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Upload once. Share a QR code. Guests take a selfie and get only the photos they are in. No app, no login, no sending 3,000 photos on WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/register" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
                Start free — 5,000 photos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/how-it-works" className="px-6 py-3.5 rounded-full border border-border font-medium hover:border-foreground/40 transition">
                See how it works
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">No credit card. Made in Kerala for Indian weddings.</p>
          </div>
          <PhoneMock />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: '< 2 sec', l: 'Selfie to results' },
            { n: '10,000+', l: 'Photos per event' },
            { n: '0', l: 'Apps guests install' },
            { n: '24 hrs', l: 'Until selfies are deleted' },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-heading text-3xl font-bold text-primary">{s.n}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How it works</span>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold mt-3 max-w-2xl text-balance">From memory card to every guest's phone in four steps.</h2>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute top-6 right-6 font-heading text-4xl font-extrabold text-border">{i + 1}</div>
              <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why photographers switch</span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold mt-3 text-balance">You shot 8,000 photos. Every guest wants the 40 with them in it.</h2>
          </div>
          <ul className="space-y-4 text-primary-foreground/85">
            {[
              'No more "send me my photos" messages for three weeks after the wedding.',
              'No more Google Drive links that expire, get forwarded, or leak the whole album.',
              'No more manually sorting family sets for each side of the wedding.',
              'Every guest who scans your QR sees your studio name. That is 500 people who now know who shot the wedding.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Features</span>
        <h2 className="font-heading text-3xl sm:text-5xl font-bold mt-3 max-w-2xl text-balance">The only delivery tool that also culls, sorts, and pays you back.</h2>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border p-6 hover:border-primary/40 transition">
              <f.icon className="w-6 h-6 text-accent mb-4" />
              <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/features" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">All features <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Questions</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3">What photographers ask us first.</h2>
          <div className="mt-10 divide-y divide-border">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex justify-between items-start gap-4 cursor-pointer list-none font-semibold">
                  {f.q}
                  <span className="text-accent text-xl leading-none group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 sm:p-16 text-center">
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-balance">Your next wedding is the free trial.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">5,000 photo credits, no card, no monthly fee. Upload one real wedding and watch guests find themselves.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition">
            Start free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
