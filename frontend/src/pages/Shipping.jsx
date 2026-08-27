import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

export default function Shipping() {
  const { shippingInfo, setShippingInfo } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(shippingInfo || {
    address: '', city: '', state: '', country: 'India', pinCode: '', phoneNo: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShippingInfo(form);
    navigate('/checkout/confirm');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
      <CheckoutSteps active={0} />
      <h1 className="mb-6 font-display text-2xl font-700">Shipping Address</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl2 border border-ink/10 bg-white p-6">
        <input name="address" value={form.address} onChange={handleChange} placeholder="Street Address" required className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="input-field" />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="PIN Code" type="number" required className="input-field" />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required className="input-field" />
        </div>
        <input name="phoneNo" value={form.phoneNo} onChange={handleChange} placeholder="Phone Number" type="tel" required className="input-field" />
        <button type="submit" className="btn-primary w-full">Continue <ArrowRight className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
