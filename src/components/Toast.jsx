import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast, hideToast } = useCart();

  return (
    <AnimatePresence>
      {toast.visible && (
        <div className="toast-container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="toast-luxury"
            onClick={hideToast}
          >
            <div className="toast-icon-box">
              <ShoppingBag size={20} />
            </div>
            <div className="toast-content-luxury">
              <p>Added to Collection</p>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
