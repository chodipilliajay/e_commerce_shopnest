import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductRow({ title, subtitle, products }) {
  const scrollRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-700">{title}</h2>
          {subtitle && <p className="text-sm text-slate-soft">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={() => scroll('left')} className="rounded-full border border-ink/10 p-2 hover:bg-ink/5"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll('right')} className="rounded-full border border-ink/10 p-2 hover:bg-ink/5"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="scroll-row flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div key={p._id} className="w-[220px] shrink-0 sm:w-[240px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
