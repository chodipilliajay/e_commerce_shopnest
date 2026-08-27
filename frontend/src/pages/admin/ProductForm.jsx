import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Fruits & Vegetables'];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', cutPrice: '', category: CATEGORIES[0], stock: '', imageUrl: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/product/${id}`).then((res) => {
        const p = res.data.product;
        setForm({
          name: p.name, description: p.description, price: p.price, cutPrice: p.cutPrice || '',
          category: p.category, stock: p.stock, imageUrl: p.images[0]?.url || '',
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      cutPrice: form.cutPrice ? Number(form.cutPrice) : 0,
      category: form.category,
      stock: Number(form.stock),
      images: [{ url: form.imageUrl || `https://loremflickr.com/600/600/${encodeURIComponent(form.category)}` }],
    };
    try {
      if (isEdit) {
        await api.put(`/admin/product/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/product/new', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-700">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          <input type="number" placeholder="Original price (optional, for discount)" value={form.cutPrice} onChange={(e) => setForm({ ...form, cutPrice: e.target.value })} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input required type="number" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
        </div>
        <input placeholder="Image URL (leave blank for a category-relevant placeholder)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-field" />
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
