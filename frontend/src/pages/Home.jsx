import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import api from '../api/axios';
import ProductRow from '../components/ProductRow';
import HeroCarousel from '../components/HeroCarousel';
import Loader from '../components/Loader';

const CATEGORY_ICONS = {
  Electronics: '🎧',
  Fashion: '👕',
  'Home & Kitchen': '🏠',
  Books: '📚',
  Sports: '🏸',
  Beauty: '💄',
  'Fruits & Vegetables': '🥦',
};

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [fresh, setFresh] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dealsRes, arrivalsRes, catRes, freshRes] = await Promise.all([
          api.get('/products/deals?limit=12'),
          api.get('/products/new-arrivals?limit=12'),
          api.get('/products/categories'),
          api.get('/products?category=' + encodeURIComponent('Fruits & Vegetables')),
        ]);
        setDeals(dealsRes.data.deals);
        setArrivals(arrivalsRes.data.products);
        setCategories(catRes.data.categories);
        setFresh(freshRes.data.products);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <HeroCarousel />

      {/* Trust strip */}
      <section className="border-b border-ink/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 text-sm sm:grid-cols-3 md:px-8">
          <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-brand" /> Free shipping over ₹1,499</div>
          <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand" /> Secure checkout</div>
          <div className="flex items-center gap-3"><RotateCcw className="h-5 w-5 text-brand" /> Easy 7-day returns</div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <h2 className="mb-5 font-display text-2xl font-700">Shop by category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium transition hover:border-brand hover:text-brand"
              >
                <span>{CATEGORY_ICONS[cat] || '🛍️'}</span> {cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <Loader full />
      ) : (
        <>
          <ProductRow title="🔥 Best Deals" subtitle="Prices this good won't last" products={deals} />
          <ProductRow title="🥦 Fresh from the Farm" subtitle="Fruits & vegetables, picked daily" products={fresh} />
          <ProductRow title="✨ New Arrivals" subtitle="Just landed in the nest" products={arrivals} />
        </>
      )}
    </div>
  );
}
