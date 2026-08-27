import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(isAuthenticated ? '/checkout/shipping' : '/login?redirect=/checkout/shipping');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-ink/15" />
        <h1 className="font-display text-2xl font-700">Your cart is empty</h1>
        <p className="mt-2 text-slate-soft">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary mt-6">Start Shopping <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="mb-6 font-display text-2xl font-700">Your Cart ({items.length} item{items.length !== 1 && 's'})</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.product} className="flex gap-4 rounded-xl2 border border-ink/10 bg-white p-4">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/product/${item.product}`} className="font-medium hover:text-brand">{item.name}</Link>
                  <button onClick={() => removeFromCart(item.product)} className="text-ink/30 hover:text-brand">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-soft">₹{item.price.toLocaleString('en-IN')} each</span>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-ink/10">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <span className="font-display font-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="h-fit rounded-xl2 border border-ink/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-700">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-soft">Subtotal</span><span>₹{itemsPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-soft">Shipping</span><span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span></div>
            <div className="flex justify-between"><span className="text-slate-soft">Tax (8%)</span><span>₹{taxPrice.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-lg font-700">
            <span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          {shippingPrice > 0 && <p className="mt-2 text-xs text-slate-soft">Add ₹{(1500 - itemsPrice).toLocaleString('en-IN')} more for free shipping</p>}
          <button onClick={handleCheckout} className="btn-primary mt-6 w-full">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
