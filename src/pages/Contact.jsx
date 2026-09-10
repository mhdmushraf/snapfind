import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', service: 'Portraits', message: '' });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="pt-16">
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">Contact</span>
        <h1 className="font-heading text-5xl sm:text-6xl font-light mt-4 max-w-3xl text-balance">
          Let's start with a conversation.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
          Tell us about your project. We'll reply within one business day with photographer recommendations and a tailored quote.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-6">
          {[
            { icon: Mail, label: 'Email', value: 'hello@lumiere.studio' },
            { icon: Phone, label: 'Phone', value: '+1 (415) 555-0142' },
            { icon: MapPin, label: 'Studio', value: '240 Sutter St, San Francisco' },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="font-medium mt-0.5">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="rounded-3xl overflow-hidden aspect-[4/3] mt-4">
            <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80" alt="Inside the Lumière studio" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="md:col-span-3">
          {sent ? (
            <div className="h-full min-h-[400px] rounded-3xl border border-border bg-card flex flex-col items-center justify-center text-center p-10">
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-5">
                <Check className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-heading text-2xl">Thank you, {form.name || 'friend'}.</h3>
              <p className="mt-3 text-muted-foreground max-w-sm">Your message is on its way. We'll be in touch within one business day.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', service: 'Portraits', message: '' }); }} className="mt-6 text-sm font-medium text-accent hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Jane Doe" />
                </Field>
                <Field label="Email">
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="jane@email.com" />
                </Field>
              </div>
              <Field label="Service interested in">
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="input">
                  {['Weddings', 'Portraits', 'Fashion', 'Commercial', 'Fine Art', 'Editorial'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Tell us about your project">
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Dates, location, vibe, anything that helps…" />
              </Field>
              <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                Send message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}