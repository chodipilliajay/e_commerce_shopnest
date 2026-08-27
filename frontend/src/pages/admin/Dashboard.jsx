import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, IndianRupee } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/products'),
      api.get('/admin/orders'),
      api.get('/admin/users'),
    ]).then(([productsRes, ordersRes, usersRes]) => {
      setStats({
        products: productsRes.data.products.length,
        orders: ordersRes.data.orders.length,
        users: usersRes.data.users.length,
        revenue: ordersRes.data.totalAmount,
      });
    });
  }, []);

  if (!stats) return <Loader full />;

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-mint/15 text-mint-dark' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-brand/10 text-brand', to: '/admin/orders' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-sun/20 text-sun-dark', to: '/admin/products' },
    { label: 'Users', value: stats.users, icon: Users, color: 'bg-ink/10 text-ink', to: '/admin/users' },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-700">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const content = (
            <div className="rounded-xl2 border border-ink/10 bg-white p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${c.color}`}><Icon className="h-5 w-5" /></div>
              <p className="font-display text-2xl font-700">{c.value}</p>
              <p className="text-sm text-slate-soft">{c.label}</p>
            </div>
          );
          return c.to ? <Link key={c.label} to={c.to}>{content}</Link> : <div key={c.label}>{content}</div>;
        })}
      </div>
    </div>
  );
}
