import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    const subject = encodeURIComponent(`Message from ${form.name} via ShopNest`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:hello@shopnest.com?subject=${subject}&body=${body}`;
    toast.success('Opening your email client...');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <h1 className="mb-4 font-display text-3xl font-700">Contact Us</h1>
      <p className="mb-8 text-ink/70">Have a question or need help with an order? We'd love to hear from you.</p>
      <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /> hello@shopnest.com</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> +91 98765 43210</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand" /> Hyderabad, India</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          <textarea placeholder="How can we help?" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
}
