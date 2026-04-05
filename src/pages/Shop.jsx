import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (categoryParam !== 'All') {
      result = result.filter(p => p.category === categoryParam);
    }

    // Search Filter
    if (queryParam) {
      const q = queryParam.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
  }, [products, categoryParam, queryParam]);

  const categories = ['All', 'Streetwear', 'Designer', 'Vintage', 'Schuhe'];

  const setCategory = (cat) => {
    setSearchParams(prev => {
      if (cat === 'All') prev.delete('category');
      else prev.set('category', cat);
      return prev;
    });
  };

  return (
    <div className="page-shop-luxury pt-44 md:pt-52 container bg-primary min-h-screen">
      <header className="shop-header-luxury mb-12 md:mb-20 scroll-mt-32 md:scroll-mt-48">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12 border-b border-white/5 pb-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="header-intro max-w-xl"
          >
            <span className="text-accent-primary uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block">Archive Collection</span>
            <h1 className="page-title leading-tight md:leading-none">The <em className="italic text-white">Atelier</em></h1>
            <p className="page-description text-text-secondary mt-4 md:mt-6 font-light leading-relaxed text-sm md:text-base">
              Curated garments that define the intersection of heritage and avant-garde. 
              Each piece in our archives is selected for its craftsmanship and historical significance.
            </p>
          </motion.div>

          <div className="shop-controls-luxury w-full md:w-auto">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => setCategory(cat)}
                  className={`px-8 py-3 rounded-full text-[11px] uppercase tracking-widest transition-all duration-500 border ${
                    categoryParam === cat 
                      ? 'border-accent-primary bg-accent-primary text-black font-bold' 
                      : 'border-white/10 hover:border-white/30 text-white font-medium'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 mt-10 text-[10px] text-text-muted uppercase tracking-[0.2em]"
        >
          <SlidersHorizontal size={12} className="text-accent-primary" />
          <span>{filteredProducts.length} Objects Found</span>
          {categoryParam !== 'All' && (
            <span className="text-accent-primary">• Filtered by {categoryParam}</span>
          )}
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40"
          >
            <div className="w-12 h-12 rounded-full border-t border-accent-primary animate-spin" />
            <p className="mt-8 text-[11px] uppercase tracking-[0.3em] font-light">Decrypting Archive...</p>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="products-grid-luxury grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20 pb-32"
          >
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <Search size={48} strokeWidth={0.5} className="mb-8 text-neutral-800" />
            <h3 className="text-2xl font-light italic mb-4">No match found in our logs</h3>
            <p className="text-text-muted max-w-md font-light">Your specific inquiry did not match any objects in our current digital archive.</p>
            <button 
              onClick={() => { setSearchParams({}); }} 
              className="mt-12 px-10 py-4 border border-white/10 hover:border-accent-primary text-[11px] uppercase tracking-[0.3em] transition-all duration-500"
            >
              Clear All Logs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
