import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ConfirmOrder() {
  const { items, shippingInfo, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingInfo) navigate('/checkout/shipping');
    if (items.length === 0) navigate('/cart');
  }, [shippingInfo, items, navigate]);

  if (!shippingInfo || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <CheckoutSteps active={1} />
      <h1 className="mb-6 font-display text-2xl font-700">Confirm Your Order</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="rounded-xl2 border border-ink/10 bg-white p-5">
            <h3 className="mb-2 font-display font-700">Shipping To</h3>
            <p className="text-sm text-ink/70">
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}
              <br />Phone: {shippingInfo.phoneNo}
            </p>
            <Link to="/checkout/shipping" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Edit address</Link>
          </div>
          <div className="rounded-xl2 border border-ink/10 bg-white p-5">
            <h3 className="mb-3 font-display font-700">Items ({items.length})</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-slate-soft">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-fit rounded-xl2 border border-ink/10 bg-white p-6">
          <h3 className="mb-4 font-display font-700">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-soft">Subtotal</span><span>₹{itemsPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-slate-soft">Shipping</span><span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span></div>
            <div className="flex justify-between"><span className="text-slate-soft">Tax</span><span>₹{taxPrice.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-lg font-700">
            <span>Total</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={() => navigate('/checkout/payment')} className="btn-primary mt-6 w-full">
            Proceed to Payment <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
