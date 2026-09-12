import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import { IMG } from '@/lib/images';

const CONTACT = {
  company: 'Linkzone Global FZCO',
  address: 'in5 Tech, Dubai Internet City, Dubai, United Arab Emirates',
  india: 'Kochi, Kerala, India',
  email: 'hello@snapfind.in',
  phone: '+971 55 614 0067',
  whatsapp: '971556140067',
  hours: 'Mon–Sat, 9am–7pm IST',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', studio: '', email: '', phone: '', topic: 'Getting started', message: '' });
  const [state, setState] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      await base44.integrations.Core.SendEmail({
        to: CONTACT.email,
        subject: `[Snapfind] ${form.topic} — ${form.studio || form.name}`,
        body: `Name: ${form.name}\nStudio: ${form.studio}\nEmail: ${form.email}\nPhone: ${form.phone}\nTopic: ${form.topic}\n\n${form.message}`,
      });
      setState('sent');
    } catch {
      setState('error');
    }
  };

  const waText = encodeURIComponent(`Hi Snapfind, I'm ${form.name || 'a photographer'}${form.studio ? ` from ${form.studio}` : ''}. ${form.message || 'I want to know more.'}`);

  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-24 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold mt-3 text-balance">Talk to a human, usually within the hour.</h1>
          <p className="mt-5 text-muted-foreground">WhatsApp is fastest. Email works too. We reply in English or Malayalam.</p>

          <div className="mt-10 space-y-5">
            <a href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-full bg-[#25D366]/15 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-[#25D366]" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
                <div className="font-medium group-hover:text-accent transition">{CONTACT.phone}</div>
              </div>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center"><Mail className="w-5 h-5 text-accent" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="font-medium group-hover:text-accent transition">{CONTACT.email}</div>
              </div>
            </a>
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center"><Phone className="w-5 h-5 text-accent" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Phone</div>
                <div className="font-medium group-hover:text-accent transition">{CONTACT.phone}</div>
                <div className="text-xs text-muted-foreground">{CONTACT.hours}</div>
              </div>
            </a>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-accent" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Company</div>
                <div className="font-medium">{CONTACT.company}</div>
                <div className="text-sm text-muted-foreground">{CONTACT.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-accent" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">India team</div>
                <div className="font-medium">{CONTACT.india}</div>
              </div>
            </div>
          </div>

          <img src={IMG.qrTable} alt="Guests finding their photos at a wedding reception" className="mt-10 w-full h-64 object-cover rounded-2xl" />
        </div>

        <div className="rounded-3xl border border-border p-6 sm:p-8 h-fit">
          {state === 'sent' ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
              <h3 className="font-heading text-2xl font-bold mt-4">Got it.</h3>
              <p className="mt-2 text-muted-foreground">We'll reply to {form.email} shortly. Faster on WhatsApp if you're in a hurry.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Your name</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input mt-2" placeholder="Arjun Menon" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Studio</span>
                  <input value={form.studio} onChange={(e) => setForm({ ...form, studio: e.target.value })} className="input mt-2" placeholder="Menon Wedding Studio" />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-2" placeholder="you@studio.com" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp number</span>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input mt-2" placeholder="+91 98XXX XXXXX" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Topic</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="input mt-2">
                  {['Getting started', 'Studio plan / team pricing', 'Live upload during events', 'Billing or GST invoice', 'Privacy / DPDP question', 'Partnership', 'Something else'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input mt-2 resize-none" placeholder="How many weddings a month, what you use today, what's slow..." />
              </label>
              {state === 'error' && <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-xl">Couldn't send. Try WhatsApp instead.</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={state === 'sending'} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-60">
                  {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send message <Send className="w-4 h-4" /></>}
                </button>
                <a href={`https://wa.me/${CONTACT.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition">
                  <MessageCircle className="w-4 h-4" /> WhatsApp us
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
