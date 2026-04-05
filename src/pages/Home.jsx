import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  const categories = [
    { name: 'Couture', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Atelier', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800' },
    { name: 'Vintage', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <div className="page-home-luxury">
      {/* ===== EDITORIAL HERO ===== */}
      <section className="hero-luxury">
        <div className="hero-image-overlay"></div>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          src="/hero.png" 
          alt="Luxury Fashion" 
          className="hero-bg-img" 
        />
        <div className="container hero-luxury-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hero-text-block"
          >
            <div className="hero-subtitle-luxury">
              <Sparkles size={14} className="text-accent" /> Est. 2026 • Private Collection
            </div>
            <h1 className="hero-title-luxury">
              Modern <br /> 
              <em>Luxury</em> <br /> 
              Atelier
            </h1>
            <p className="hero-desc-luxury text-sm md:text-base lg:text-lg mb-10 md:mb-12">
              A sanctuary for the modern connoisseur of style, where artisan craft meets avant-garde vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Link to="/shop" className="btn-luxury-primary w-full sm:w-auto justify-center">
                Enter the Shop <ArrowRight size={18} />
              </Link>
              <Link to="/shop?category=Designer" className="btn-luxury-outline w-full sm:w-auto justify-center">
                The Collection
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORY REVEAL ===== */}
      <section className="category-reveal-luxury container">
        <div className="reveal-grid">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="reveal-item"
            >
              <Link to={`/shop?category=${cat.name}`} className="reveal-img-box">
                <img src={cat.img} alt={cat.name} className="product-img-premium" />
                <div className="reveal-overlay">
                  <h3>{cat.name}</h3>
                  <p>Explore</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CURATED HIGHLIGHTS ===== */}
      <section className="highlights-luxury container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header-luxury mb-16"
        >
          <div className="header-text">
            <span className="text-accent uppercase tracking-[0.2em] text-[10px] font-bold">Featured Selection</span>
            <h2 className="section-title-luxury">Curated <br /> <em>Excellence</em></h2>
          </div>
          <Link to="/shop" className="link-luxury group">
            View Entire Atelier <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
        </motion.div>
        
        <div className="products-grid-luxury">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== STATEMENT BANNER ===== */}
      <section className="statement-luxury overflow-hidden">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="statement-box"
          >
            <span className="text-accent uppercase tracking-[0.4em] text-[10px] block mb-8">The Philosophy</span>
            <h2>Uncompromising <br /> <span>Artistry.</span></h2>
            <p>We source only the rarest materials from across the globe, ensuring every piece tells a story of heritage, luxury, and meticulous skill.</p>
            <div className="statement-footer">
              <div className="h-[1px] w-12 bg-accent-primary/30" />
              <Sparkles size={20} className="text-accent-primary" /> 
              <div className="h-[1px] w-12 bg-accent-primary/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TRUST LUXURY ===== */}
      <section className="trust-luxury container">
        <div className="trust-grid-luxury">
          {[
            { title: 'White-Glove Shipping', desc: 'Seamless global delivery with dedicated personal tracking and insurance.' },
            { title: 'Artisan Verification', desc: 'Every piece is verified by our master curators to ensure original provenance.' },
            { title: 'Private Concierge', desc: 'Direct access to our personal stylists for bespoke wardrobe consultations.' }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="trust-card-luxury"
            >
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
