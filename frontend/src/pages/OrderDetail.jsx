import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Truck, CheckCircle2, MapPin } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const STATUS_STEPS = [
  { key: 'Processing', label: 'Order Placed', icon: Package },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/order/${id}`).then((res) => {
      setOrder(res.data.order);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader full />;
  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <h1 className="mb-1 font-display text-2xl font-700">Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="mb-8 text-sm text-slate-soft">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      {/* Tracking stepper */}
      <div className="mb-10 rounded-xl2 border border-ink/10 bg-white p-6">
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i <= currentStepIndex;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${done ? 'bg-mint text-white' : 'bg-ink/10 text-ink/30'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs ${done ? 'font-semibold text-ink' : 'text-slate-soft'}`}>{step.label}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < currentStepIndex ? 'bg-mint' : 'bg-ink/10'}`} />}
              </React.Fragment>
            );
          })}
        </div>
        {order.orderStatus === 'Delivered' && order.deliveredAt && (
          <p className="mt-4 text-center text-sm text-mint-dark">Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl2 border border-ink/10 bg-white p-5">
          <h3 className="mb-2 flex items-center gap-2 font-display font-700"><MapPin className="h-4 w-4" /> Shipping Address</h3>
          <p className="text-sm text-ink/70">
            {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.country} - {order.shippingInfo.pinCode}
            <br />Phone: {order.shippingInfo.phoneNo}
          </p>
        </div>
        <div className="rounded-xl2 border border-ink/10 bg-white p-5">
          <h3 className="mb-2 font-display font-700">Payment</h3>
          <p className="text-sm text-ink/70">Status: <span className="font-medium text-mint-dark">{order.paymentInfo?.status || 'Paid'}</span></p>
          <p className="text-sm text-ink/70">Reference: <span className="font-mono text-xs">{order.paymentInfo?.id}</span></p>
        </div>
      </div>

      <div className="mt-6 rounded-xl2 border border-ink/10 bg-white p-5">
        <h3 className="mb-3 font-display font-700">Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-soft">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-soft">Subtotal</span><span>₹{order.itemsPrice.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-slate-soft">Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`}</span></div>
          <div className="flex justify-between"><span className="text-slate-soft">Tax</span><span>₹{order.taxPrice.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between pt-2 font-display text-base font-700"><span>Total</span><span>₹{order.totalPrice.toLocaleString('en-IN')}</span></div>
        </div>
      </div>
    </div>
  );
}
