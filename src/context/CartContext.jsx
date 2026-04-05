import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimeout = useRef(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('lux_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('lux_cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lux_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const showToast = useCallback((message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, message });
    toastTimeout.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: false, message: '' });
  }, []);

  const addToCart = (product, quantity = 1, size = null) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.size === size) 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity, size }];
    });
    showToast('"' + product.name + '" zum Warenkorb hinzugefügt');
  };

  const removeFromCart = (id, size = null) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setCartItems(prev => prev.map(item => (item.id === id && item.size === size) ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + ((item.sell_price || item.price || 0) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      toast,
      showToast,
      hideToast
    }}>
      {children}
    </CartContext.Provider>
  );
};
