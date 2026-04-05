import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [orderNumber] = useState(() => 'LUX-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [orderData, setOrderData] = useState(null);
  const hasCleared = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length > 0 && !hasCleared.current) {
      setOrderData({
        items: [...cartItems],
        total: getCartTotal()
      });
      hasCleared.current = true;
      // Small delay to capture data before clearing
      setTimeout(() => clearCart(), 100);
    } else if (cartItems.length === 0 && !orderData) {
      navigate('/');
    }
  }, [cartItems, getCartTotal, clearCart, orderData, navigate]);

  if (!orderData) return null;

  return (
    <div className="page-order-confirmation container pt-32 pb-20">
      {/* Confetti particles */}
      <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{
            '--delay': `${Math.random() * 3}s`,
            '--x': `${Math.random() * 100}vw`,
            '--rotation': `${Math.random() * 360}deg`,
            '--color': ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)]
          }}></div>
        ))}
      </div>

      <div className="order-success-card glass-panel">
        <div className="order-success-icon">
          <CheckCircle size={64} />
        </div>
        <h1 className="order-success-title">Vielen Dank für deine Bestellung!</h1>
        <p className="order-success-subtitle">
          Deine Bestellung wurde erfolgreich aufgegeben.
        </p>

        <div className="order-number-box">
          <Package size={20} />
          <span>Bestellnummer: <strong>{orderNumber}</strong></span>
        </div>

        <div className="order-summary-section">
          <h3>Bestellübersicht</h3>
          <div className="order-items-list">
            {orderData.items.map(item => (
              <div key={item.id} className="order-item-row">
                <span className="order-item-qty">{item.quantity}×</span>
                <span className="order-item-name">{item.name}</span>
                <span className="order-item-price">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
              </div>
            ))}
          </div>
          <div className="order-total-row">
            <span>Gesamt</span>
            <span className="text-gradient"><strong>{orderData.total.toFixed(2).replace('.', ',')} €</strong></span>
          </div>
        </div>

        <p className="order-demo-notice">
          Dies ist ein Demo-Shop. Es werden keine Zahlungen verarbeitet und keine Waren versendet.
        </p>

        <div className="order-actions">
          <Link to="/shop" className="btn-primary">
            Weiter einkaufen <ArrowRight size={18} />
          </Link>
          <Link to="/" className="btn-secondary">
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
