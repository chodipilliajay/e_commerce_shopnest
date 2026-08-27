import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/admin/products').then((res) => {
      setProducts(res.data.products);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/admin/product/${id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete product');
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-700">Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary !py-2.5 text-sm"><Plus className="h-4 w-4" /> Add Product</Link>
      </div>
      <div className="overflow-x-auto rounded-xl2 border border-ink/10 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/5 text-left text-xs uppercase tracking-wide text-slate-soft">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-ink/5 last:border-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={p.images[0]?.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="max-w-xs truncate font-medium">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{p.category}</td>
                <td className="px-4 py-3">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/${p._id}/edit`} className="rounded-lg p-2 hover:bg-ink/5"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(p._id)} className="rounded-lg p-2 text-brand hover:bg-brand/5"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
