import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';

const statusColor = {
  Processing: 'bg-sun/20 text-sun-dark',
  Shipped: 'bg-brand/10 text-brand',
  Delivered: 'bg-mint/15 text-mint-dark',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/me').then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader full />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <h1 className="mb-6 font-display text-2xl font-700">My Orders</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl2 border border-dashed border-ink/15 py-20 text-center">
          <Package className="mb-3 h-12 w-12 text-ink/15" />
          <p className="font-medium">No orders yet</p>
          <Link to="/products" className="btn-primary mt-5">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex items-center justify-between gap-4 rounded-xl2 border border-ink/10 bg-white p-5 transition hover:border-brand"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.orderItems.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image} alt="" className="h-12 w-12 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-slate-soft">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.orderItems.length} item{order.orderItems.length !== 1 && 's'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.orderStatus]}`}>{order.orderStatus}</span>
                <span className="font-display font-700">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                <ChevronRight className="h-4 w-4 text-slate-soft" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
