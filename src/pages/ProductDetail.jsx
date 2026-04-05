import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch("http://localhost:3001/api/products/" + id)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        if (data.sizes) {
          setSelectedSize(data.sizes.split(',')[0].trim());
        }
        return fetch('http://localhost:3001/api/products');
      })
      .then(res => res.json())
      .then(all => {
        setRelatedProducts(all.filter(p => p.id !== parseInt(id) && p.category === product?.category).slice(0, 4));
        if (relatedProducts.length === 0) {
           setRelatedProducts(all.filter(p => p.id !== parseInt(id)).slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, product?.category]);

  if (loading) return (
    <div className="shop-loading-luxury">
      <div className="luxury-spinner-container">
        <div className="luxury-spinner"></div>
      </div>
    </div>
  );

  if (!product) return <div className="container pt-44 md:pt-48 pb-20 text-center min-h-screen">Piece not found in archive.</div>;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    // Future: Trigger luxury toast
  };

  const sizesArray = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
  const imageUrl = product.image_url.startsWith('http') ? product.image_url : "http://localhost:3001" + product.image_url;

  return (
    <div className="page-product-luxury pt-44 md:pt-48 container bg-primary min-h-screen">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 md:mb-12"
      >
        <Link to="/shop" className="back-link-luxury group inline-flex items-center gap-3">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" /> 
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Return to Archive</span>
        </Link>
      </motion.div>

      <div className="product-detail-grid-luxury grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="detail-visuals relative"
        >
          <div className="main-image-box-luxury aspect-[3/4] overflow-hidden bg-bg-secondary">
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.2em] text-white font-bold z-[10]">
              {product.condition}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="detail-content-luxury"
        >
          <div className="detail-header-luxury">
            <div className="detail-meta-luxury">
              <span className="text-accent uppercase tracking-widest text-xs font-semibold">{product.brand || 'Luxury Atelier'}</span>
              <span className="dot-divider"></span>
              <span className="text-muted text-xs uppercase tracking-widest">{product.category}</span>
            </div>
            <h1 className="detail-title-luxury">{product.name}</h1>
            <div className="detail-price-luxury">{product.sell_price.toFixed(2)}€</div>
          </div>
          
          <div className="detail-description-luxury">
            <p>{product.description}</p>
          </div>

          {sizesArray.length > 0 && (
            <div className="detail-sizes-luxury">
              <span className="detail-label-luxury">Select Size</span>
              <div className="size-options-luxury">
                {sizesArray.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn-luxury ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-actions-luxury">
            <button 
              onClick={handleAddToCart} 
              className="btn-luxury-primary w-full"
              disabled={!product.in_stock}
            >
              <ShoppingBag size={18} />
              {product.in_stock ? 'Add to Collection' : 'Archive Selection Sold Out'}
            </button>
          </div>

          <div className="detail-trust-luxury">
            <div className="trust-item-luxury">
              <ShieldCheck size={18} className="text-accent" />
              <span>Authenticity Certified</span>
            </div>
            <div className="trust-item-luxury">
              <Truck size={18} className="text-accent" />
              <span>Complimentary White-Glove Shipping</span>
            </div>
          </div>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-section-luxury mt-32">
          <div className="section-header-luxury">
             <h2 className="section-title-luxury">You May Also <br /> <em>Admire</em></h2>
          </div>
          <div className="products-grid-luxury">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
