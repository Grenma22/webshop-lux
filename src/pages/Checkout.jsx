import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    zip: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 4.90;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich';
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Bitte eine gültige E-Mail Adresse eingeben';
    }
    if (!formData.street.trim()) newErrors.street = 'Straße & Hausnummer ist erforderlich';
    if (!formData.zip.trim()) newErrors.zip = 'PLZ ist erforderlich';
    if (!formData.city.trim()) newErrors.city = 'Stadt ist erforderlich';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const payload = {
          customer_email: formData.email,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            size: item.size
          }))
        };

        const response = await fetch('http://localhost:3001/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok && data.url) {
          clearCart(); // Clear cart before redirecting to Stripe
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
          throw new Error(data.error || 'Fehler beim Checkout');
        }
      } catch (err) {
        alert(err.message);
        setIsSubmitting(false);
      }
    }
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="container pt-32 pb-20 fade-up animate-in text-center">
        <div className="max-w-md mx-auto bg-black/40 border border-white/5 p-8 rounded-2xl">
          <CheckCircle size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-4">Dein Warenkorb ist leer</h2>
          <p className="text-text-secondary mb-8">Du hast noch keine Artikel im Warenkorb. Kehre zum Shop zurück, um exklusive Designs zu entdecken.</p>
          <Link to="/shop" className="btn-primary justify-center w-full">Zum Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-32 pb-20 fade-up animate-in">
      <Link to="/shop" className="back-link mb-6">
        <ArrowLeft size={18} /> Zurück zum Shop
      </Link>
      <h1 className="page-title mb-10">Kasse</h1>
      
      <form onSubmit={handleSubmit} className="checkout-row">
        {/* Left Column: Form Info */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-xs">1</span>
              Kontakt & Lieferung
            </h2>
            
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className={"form-group " + (errors.firstName ? 'has-error' : '')}>
                  <label>Vorname *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" placeholder="Max" />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className={"form-group " + (errors.lastName ? 'has-error' : '')}>
                  <label>Nachname *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" placeholder="Mustermann" />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className={"form-group " + (errors.email ? 'has-error' : '')}>
                <label>E-Mail Adresse *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="max@beispiel.de" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              
              <div className={"form-group " + (errors.street ? 'has-error' : '')}>
                <label>Straße & Hausnummer *</label>
                <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="form-input" placeholder="Musterstraße 1" />
                {errors.street && <span className="form-error">{errors.street}</span>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={"form-group " + (errors.zip ? 'has-error' : '')}>
                  <label>PLZ *</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="form-input" placeholder="12345" />
                  {errors.zip && <span className="form-error">{errors.zip}</span>}
                </div>
                <div className={"form-group " + (errors.city ? 'has-error' : '')}>
                  <label>Stadt *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="form-input" placeholder="Berlin" />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-primary text-white flex items-center justify-center text-xs">2</span>
              Sichere Bezahlung via Stripe
            </h2>
            <div className="text-text-secondary mb-4 text-sm bg-white/5 p-4 rounded-md flex items-start gap-4">
              <ShieldCheck className="text-accent-primary flex-shrink-0" size={24} />
              <p>Du wirst im nächsten Schritt zu Stripe weitergeleitet, um die Zahlung sicher abzuschließen. Die dort angebotenen Zahlungsmethoden wie Kreditkarte, PayPal oder Klarna richten sich nach deiner Region.</p>
            </div>
          </div>
          
        </div>

        {/* Right Column: Order Summary */}
        <div>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Bestellübersicht</h2>
            
            <div className="flex flex-col gap-2 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map(item => {
                const imageUrl = item.image_url.startsWith('http') ? item.image_url : "http://localhost:3001" + item.image_url;
                return (
                <div key={item.id + "-" + item.size} className="checkout-item-row">
                  <div className="relative">
                    <img src={imageUrl} alt={item.name} className="checkout-item-img" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-qty">
                      {item.size ? "Größe: " + item.size : "Menge: " + item.quantity}
                    </span>
                  </div>
                  <div className="checkout-item-price">
                    {(item.sell_price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              )})}
            </div>
            
            <div className="checkout-totals">
              <div className="checkout-total-line">
                <span>Zwischensumme</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="checkout-total-line">
                <span>Versand</span>
                {shipping === 0 ? <span className="free-shipping">Kostenlos</span> : <span>{shipping.toFixed(2)} €</span>}
              </div>
              <div className="checkout-total-line total-final">
                <span>Gesamt</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="btn-primary checkout-submit-btn">
              <CreditCard size={20} />
              {isSubmitting ? 'Verbinde mit Stripe...' : 'Zur Kasse (Stripe)'}
            </button>
            <p className="checkout-demo-notice">SSL-Verschlüsselte Verbindung via Stripe Checkout.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
