import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount, setIsCartOpen } = useCart();
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [searchOpen]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);
  const cartCount = getCartCount();

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <motion.div 
        className="container nav-container"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-left">
          <Link to="/" className="logo-link" onClick={closeMobile}>
            LUX<span className="text-accent">.</span>
          </Link>
        </div>
        
        <nav className="nav-links desktop-only">
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            Collection
            {window.location.pathname === '/' && <motion.div layoutId="nav-underline" className="nav-underline" />}
          </NavLink>
          <NavLink to="/shop" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            Shop
            {window.location.pathname === '/shop' && <motion.div layoutId="nav-underline" className="nav-underline" />}
          </NavLink>
          <NavLink to="/shop?category=Designer" className="nav-link">
            Couture
          </NavLink>
        </nav>
        
        <div className="nav-right">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="nav-search-expanded js-search-focus"
                key="search-input"
              >
                <form onSubmit={handleSearch} className="w-full flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search the atelier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="nav-search-input-premium"
                    onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  />
                  <button type="submit" className="text-accent-primary ml-2">
                    <Search size={16} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="nav-icon-btn-premium"
                onClick={() => setSearchOpen(true)}
                key="search-trigger"
                aria-label="Search"
              >
                <Search size={19} />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cart-btn-premium" 
            onClick={() => setIsCartOpen(true)}
            aria-label="View Cart"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="cart-badge-luxury"
                >
                  {cartCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Luxury Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-overlay-premium"
              onClick={closeMobile}
            />
            <motion.nav 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="mobile-nav-premium"
            >
              <div className="mobile-nav-header">
                <span className="logo-link-sm">LUX.</span>
                <button onClick={closeMobile} className="text-white hover:text-accent-primary transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-nav-links">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Shop All', path: '/shop' },
                  { name: 'Designer', path: '/shop?category=Designer' },
                  { name: 'Vintage', path: '/shop?category=Vintage' }
                ].map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link to={link.path} onClick={closeMobile} className="mobile-nav-item">
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mobile-nav-footer mt-auto pt-10 border-t border-white/10">
                <p className="text-xs text-text-muted uppercase tracking-widest mb-4">Paris • Milan • London</p>
                <div className="flex gap-4">
                  {/* Social placeholders */}
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent-primary transition-colors cursor-pointer">
                    <Search size={14} />
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
