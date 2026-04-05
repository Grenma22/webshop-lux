import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Globe, Share2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-luxury bg-bg-secondary pt-32 pb-12 border-t border-white/5">
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <div className="footer-brand-section max-w-xs">
          <Link to="/" className="text-3xl font-bold tracking-[0.2em] text-white inline-block mb-8">LUX<span className="text-accent-primary">.</span></Link>
          <p className="text-text-secondary text-sm leading-relaxed font-light mb-10">
            Curating the world's most exclusive fashion. A sanctuary for the modern connoisseur of style, heritage, and artisan craft.
          </p>
          <div className="flex gap-6">
            <a 
              href="#" 
              className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all duration-500"
              aria-label="Instagram"
            >
              <Globe size={16} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all duration-500"
              aria-label="Facebook"
            >
              <Share2 size={16} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all duration-500"
              aria-label="Twitter"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div className="footer-nav-section">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-10">The Atelier</h4>
          <div className="flex flex-col gap-5 text-sm font-light text-text-secondary">
            <Link to="/shop" className="hover:text-accent-primary transition-colors duration-300">New Collections</Link>
            <Link to="/shop?category=Designer" className="hover:text-accent-primary transition-colors duration-300">Designer Archive</Link>
            <Link to="/shop?category=Vintage" className="hover:text-accent-primary transition-colors duration-300">Vintage Selection</Link>
            <Link to="/shop?category=Schuhe" className="hover:text-accent-primary transition-colors duration-300">Couture Footwear</Link>
          </div>
        </div>

        <div className="footer-nav-section">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-10">Customer Service</h4>
          <div className="flex flex-col gap-5 text-sm font-light text-text-secondary">
            <Link to="/impressum" className="hover:text-accent-primary transition-colors duration-300">Impressum</Link>
            <Link to="/agb" className="hover:text-accent-primary transition-colors duration-300">Terms of Service</Link>
            <Link to="/datenschutz" className="hover:text-accent-primary transition-colors duration-300">Privacy Policy</Link>
            <Link to="/widerruf" className="hover:text-accent-primary transition-colors duration-300">Returns & Shippings</Link>
          </div>
        </div>

        <div className="footer-contact-section">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold mb-10">Editorial</h4>
          <p className="text-sm font-light text-text-secondary leading-relaxed mb-8">Join the inner circle for private access and seasonal lookbooks.</p>
          <form className="relative group" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email for Newsletter" 
              className="w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-accent-primary transition-all duration-700 font-light"
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent-primary transition-colors duration-500">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="container pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-[9px] uppercase tracking-[0.3em] text-text-muted font-bold tracking-widest">
          &copy; {currentYear} LUXURY FASHION ATELIER PARIS.
        </p>
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.4em] text-text-muted font-bold">
          <span className="hover:text-white transition-colors cursor-default">Paris</span>
          <span className="hidden sm:inline hover:text-white transition-colors cursor-default">Milan</span>
          <span className="hidden sm:inline hover:text-white transition-colors cursor-default">London</span>
          <span className="hover:text-white transition-colors cursor-default">New York</span>
        </div>
      </div>
    </footer>
  );
}
