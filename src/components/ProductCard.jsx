import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const imageUrl = product.image_url.startsWith('http') 
    ? product.image_url 
    : `http://localhost:3001${product.image_url}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-bg-secondary mb-6 scroll-mt-24">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.2em] text-white">
          {product.category}
        </div>
        
        {!product.in_stock && (
          <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center text-white text-[10px] uppercase tracking-[0.4em] font-bold">
            Archive Only
          </div>
        )}

        <motion.img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-8 z-30">
          <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
            <button 
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent-primary transition-colors shadow-xl"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              aria-label="Quick Add"
            >
              <ShoppingBag size={18} />
            </button>
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent-primary transition-colors shadow-xl">
              <Eye size={18} />
            </div>
          </div>
        </div>
      </Link>
      
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-accent-primary font-bold mb-2">{product.brand || 'Luxury Atelier'}</div>
        <h3 className="text-base font-light text-white mb-2 tracking-wide group-hover:text-accent-primary transition-colors duration-500">{product.name}</h3>
        <div className="text-sm font-light text-text-secondary tracking-widest italic font-serif">
          {product.sell_price.toFixed(2)}€
        </div>
      </div>
    </motion.div>
  );
}
