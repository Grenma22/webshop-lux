import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100]"
            onClick={() => setIsCartOpen(false)}
          />

          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="cart-drawer-luxury fixed top-0 right-0 w-full max-w-[480px] h-full bg-bg-primary z-[1101] flex flex-col border-l border-white/5 shadow-2xl"
          >
            <div className="cart-header-luxury p-12 flex justify-between items-center border-b border-white/5">
              <h2 className="cart-title-luxury text-2xl font-light">Your <em className="italic text-accent-primary">Selection</em></h2>
              <button 
                className="p-2 text-text-muted hover:text-white transition-colors" 
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-items-luxury flex-1 overflow-y-auto px-12 py-8 scrollbar-hide">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <ShoppingBag size={48} strokeWidth={0.5} className="mb-8 text-neutral-800" />
                  <p className="text-text-secondary font-light mb-8">Your private selection is empty.</p>
                  <button 
                    className="px-10 py-4 border border-white/10 hover:border-accent-primary text-[10px] uppercase tracking-[0.3em] transition-all duration-500" 
                    onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                  >
                    Enter the Atelier
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  {cartItems.map((item, i) => {
                    const imgUrl = item.image_url ? (item.image_url.startsWith('http') ? item.image_url : "http://localhost:3001" + item.image_url) : "/placeholder.png";
                    const price = item.sell_price || item.price || 0;
                    return (
                      <motion.div 
                        key={`${item.id}-${item.size}`} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 group"
                      >
                        <div className="w-24 aspect-[3/4] overflow-hidden bg-bg-secondary flex-shrink-0">
                          <img src={imgUrl} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-[10px] uppercase tracking-widest text-accent-primary font-bold mb-1">{item.brand || 'Luxury Essential'}</div>
                              <h4 className="text-sm font-medium text-white">{item.name}</h4>
                              {item.size && <span className="text-[11px] text-text-muted mt-1 block">Size: {item.size}</span>}
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-[10px] uppercase tracking-tighter text-text-muted hover:text-error transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-end mt-auto">
                            <div className="flex items-center gap-4 py-1 px-3 border border-white/5 rounded-full">
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                                className="text-text-muted hover:text-white transition-colors"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-[11px] w-4 text-center font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="text-text-muted hover:text-white transition-colors"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                            <div className="text-sm font-light text-white tracking-wider">{(price * item.quantity).toFixed(2)}€</div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer-luxury p-12 bg-bg-secondary/50 backdrop-blur-xl border-t border-white/5">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Subtotal</span>
                  <span className="text-2xl font-light text-white tracking-widest">{getCartTotal().toFixed(2)}€</span>
                </div>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mb-10">Excluding delivery fees</p>
                <button 
                  className="w-full py-5 bg-white hover:bg-accent-primary text-black font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-3" 
                  onClick={handleCheckout}
                >
                  Confirm Order <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
