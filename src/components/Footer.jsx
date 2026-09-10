import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo inverted className="mb-4" />
          <p className="text-sm max-w-sm leading-relaxed">
            AI face-search photo delivery for wedding and event photographers. Upload once, share a QR code, and every guest finds their own photos in seconds.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://instagram.com/snapfind.in" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://youtube.com/@snapfind" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-accent transition-colors"><Youtube className="w-5 h-5" /></a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-accent transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="mailto:hello@snapfind.in" aria-label="Email" className="hover:text-accent transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/how-it-works" className="hover:text-accent">How it works</Link></li>
            <li><Link to="/features" className="hover:text-accent">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            <li><Link to="/for-photographers" className="hover:text-accent">For photographers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/blog" className="hover:text-accent">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/login" className="hover:text-accent">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-accent">Privacy policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms of service</Link></li>
            <li><Link to="/guest-consent" className="hover:text-accent">Guest photo consent</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-primary-foreground/50">
          <span>© {new Date().getFullYear()} Snapfind. Made in Kerala, India.</span>
          <span>Selfies are deleted within 24 hours. We never sell face data.</span>
        </div>
      </div>
    </footer>
  );
}
