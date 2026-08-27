import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const statusColor = {
  Processing: 'bg-sun/20 text-sun-dark',
  Shipped: 'bg-brand/10 text-brand',
  Delivered: 'bg-mint/15 text-mint-dark',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/admin/orders').then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/order/${id}`, { status });
      toast.success(`Order marked as ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update order');
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-700">Orders ({orders.length})</h1>
      <div className="overflow-x-auto rounded-xl2 border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/5 text-left text-xs uppercase tracking-wide text-slate-soft">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3"><Link to={`/orders/${o._id}`} className="font-mono text-xs hover:text-brand">#{o._id.slice(-8).toUpperCase()}</Link></td>
                <td className="px-4 py-3">{o.user?.name || 'Deleted user'}</td>
                <td className="px-4 py-3 font-medium">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.orderStatus]}`}>{o.orderStatus}</span></td>
                <td className="px-4 py-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    disabled={o.orderStatus === 'Delivered'}
                    className="rounded-lg border border-ink/10 px-2 py-1.5 text-xs disabled:opacity-50"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
