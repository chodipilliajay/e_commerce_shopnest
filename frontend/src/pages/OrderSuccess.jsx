import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="mb-4 h-20 w-20 text-mint-dark" />
      <h1 className="font-display text-3xl font-700">Order Placed!</h1>
      <p className="mt-2 text-slate-soft">
        Thank you for shopping with ShopNest. A confirmation email with your order details is on its way.
      </p>
      <p className="mt-1 text-sm text-slate-soft">Order ID: <span className="font-mono">{id}</span></p>
      <div className="mt-8 flex gap-3">
        <Link to={`/orders/${id}`} className="btn-primary">Track Order</Link>
        <Link to="/products" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
