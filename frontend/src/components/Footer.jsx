import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/5 bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
              <circle cx="17" cy="19" r="10" fill="#FF6B4A" />
              <circle cx="10" cy="12" r="7" fill="#FFC857" />
              <circle cx="24" cy="12" r="7" fill="#34D399" />
            </svg>
            <span className="font-display text-lg font-700 text-white">ShopNest</span>
          </div>
          <p className="text-sm leading-relaxed">Everything you need, nested in one place. Quality products, fair prices, fast delivery.</p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-600 text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?sort=newest" className="hover:text-white">New Arrivals</Link></li>
            <li><Link to="/products?category=Electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=Fashion" className="hover:text-white">Fashion</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-600 text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/orders" className="hover:text-white">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-600 text-white">Get in touch</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@shopnest.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Hyderabad, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/40 md:px-8">
        © {new Date().getFullYear()} ShopNest. Built for demo/portfolio purposes.
      </div>
    </footer>
  );
}
