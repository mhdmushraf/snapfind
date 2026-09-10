import { Link } from 'react-router-dom';
import { Aperture, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Aperture className="w-6 h-6 text-accent" strokeWidth={1.5} />
            <span className="font-heading text-xl font-semibold text-primary-foreground">Lumière</span>
          </Link>
          <p className="text-sm max-w-sm leading-relaxed">
            A collective of award-winning photographers crafting timeless, editorial-grade imagery for weddings, portraits, fashion and brands worldwide.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="mailto:hello@lumiere.studio" aria-label="Email" className="hover:text-accent transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-accent">Gallery</Link></li>
            <li><Link to="/pricing" className="hover:text-accent">Pricing</Link></li>
            <li><Link to="/journal" className="hover:text-accent">Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-primary-foreground mb-4">Studio</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            <li><Link to="/login" className="hover:text-accent">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-accent">Join as photographer</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-primary-foreground/50">
          <span>© {new Date().getFullYear()} Lumière Studio. Crafted with light.</span>
          <span>San Francisco · New York · Paris</span>
        </div>
      </div>
    </footer>
  );
}