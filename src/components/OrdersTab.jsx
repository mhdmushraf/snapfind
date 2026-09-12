import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { IndianRupee, Loader2, Check, MessageCircle, Package } from 'lucide-react';

const STATUS_STYLE = {
  pending:   'bg-accent/10 text-accent',
  paid:      'bg-primary/10 text-primary',
  fulfilled: 'bg-muted text-muted-foreground',
  cancelled: 'bg-muted text-muted-foreground line-through',
};

/**
 * Orders tab. Guests place orders from their gallery; the studio sees them
 * here, collects payment (UPI for now), and marks them paid or fulfilled.
 *
 * Online payment needs a Razorpay account, which needs an Indian entity.
 * Until that exists the flow is deliberately manual rather than fake.
 */
export default function OrdersTab({ event, studio }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const list = await base44.entities.Order.filter({ event_id: event.id }, '-created_date', 100);
      setOrders(list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [event.id]);

  const setStatus = async (order, status) => {
    setOrders((o) => o.map((x) => (x.id === order.id ? { ...x, status } : x)));
    await base44.entities.Order.update(order.id, { status }).catch(() => {});
  };

  if (loading) {
    return <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;
  }

  const earned = orders
    .filter((o) => o.status === 'paid' || o.status === 'fulfilled')
    .reduce((n, o) => n + (o.studio_share || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;

  if (!event.allow_orders) {
    return (
      <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
        <IndianRupee className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-heading text-xl font-bold">Orders are switched off</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Turn on "Allow guest orders" in this event's Settings tab and guests can order prints and
          full-resolution downloads straight from their gallery.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ['Orders', orders.length],
          ['Awaiting payment', pending],
          ['You earned', `₹${earned.toLocaleString('en-IN')}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-background border border-border p-5">
            <div className="font-heading text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-background border border-dashed border-border p-12 text-center">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Guests order from their gallery. You'll see each one here with what they picked and your share.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            let items = [];
            try { items = JSON.parse(o.items); } catch { /* ignore */ }
            return (
              <div key={o.id} className="rounded-2xl bg-background border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium">{o.guest_name || 'Guest'}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.created_date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                      {o.phone && ` · ${o.phone}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLE[o.status] || ''}`}>
                      {o.status}
                    </span>
                    <div className="text-right">
                      <div className="font-heading font-bold">₹{(o.total || 0).toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-muted-foreground">you: ₹{(o.studio_share || 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {items.map((it, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-2 py-1.5">
                        {it.photo_url && <img src={it.photo_url} alt="" className="w-8 h-8 rounded object-cover" />}
                        <span className="text-xs">
                          {it.qty}× {it.product} · ₹{it.unit_price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {o.status === 'pending' && (
                    <button
                      onClick={() => setStatus(o, 'paid')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
                    >
                      <Check className="w-4 h-4" /> Mark paid
                    </button>
                  )}
                  {o.status === 'paid' && (
                    <button
                      onClick={() => setStatus(o, 'fulfilled')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
                    >
                      <Package className="w-4 h-4" /> Mark delivered
                    </button>
                  )}
                  {o.phone && (
                    <a
                      href={`https://wa.me/${o.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi${o.guest_name ? ' ' + o.guest_name : ''}, about your order from ${event.name} — total ₹${o.total}. `
                      )}`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground/40 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp
                    </a>
                  )}
                  {o.status !== 'cancelled' && o.status !== 'fulfilled' && (
                    <button
                      onClick={() => setStatus(o, 'cancelled')}
                      className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-destructive transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Payments are collected manually for now — send the guest a UPI request and mark the order paid.
        Automatic checkout needs a Razorpay account, which needs an Indian company.
      </p>
    </div>
  );
}
