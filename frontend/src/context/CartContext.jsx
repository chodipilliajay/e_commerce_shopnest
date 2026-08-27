import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopnest_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [shippingInfo, setShippingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnest_shipping');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (shippingInfo) localStorage.setItem('shopnest_shipping', JSON.stringify(shippingInfo));
  }, [shippingInfo]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((i) => (i.product === product._id ? { ...i, quantity: newQty } : i));
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((i) => (i.product === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setItems([]);

  const itemsPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 1499 || itemsPrice === 0 ? 0 : 79;
  const taxPrice = Math.round(itemsPrice * 0.08);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addToCart, updateQuantity, removeFromCart, clearCart,
        itemsPrice, shippingPrice, taxPrice, totalPrice, totalItems,
        shippingInfo, setShippingInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
