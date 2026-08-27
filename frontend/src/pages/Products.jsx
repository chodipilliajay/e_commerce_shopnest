import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('page', page);

    api.get(`/products?${params.toString()}`).then((res) => {
      setProducts(res.data.products);
      setTotalPages(Math.ceil(res.data.filteredCount / res.data.resultsPerPage));
      setLoading(false);
    });
  }, [keyword, category, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700">{keyword ? `Results for "${keyword}"` : category || 'All Products'}</h1>
          <p className="text-sm text-slate-soft">{products.length > 0 && `Showing ${products.length} products`}</p>
        </div>
        <button onClick={() => setFiltersOpen(true)} className="btn-ghost border border-ink/10 md:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden md:block">
          <FilterPanel categories={categories} category={category} sort={sort} updateParam={updateParam} />
        </aside>

        {/* Mobile filters drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-700">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <FilterPanel categories={categories} category={category} sort={sort} updateParam={updateParam} />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <Loader full />
          ) : products.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-ink/15 py-20 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-slate-soft">Try a different search or clear filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`h-9 w-9 rounded-full text-sm font-medium ${p === page ? 'bg-brand text-white' : 'border border-ink/10 hover:border-brand'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ categories, category, sort, updateParam }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-soft">Sort By</h4>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${sort === opt.value ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-ink/5'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-soft">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${!category ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-ink/5'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${category === cat ? 'bg-brand/10 font-semibold text-brand' : 'hover:bg-ink/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
