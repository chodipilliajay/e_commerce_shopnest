import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.cutPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.cutPrice - product.price) / product.cutPrice) * 100) : 0;

  return (
    <div className="card group relative flex w-full shrink-0 flex-col overflow-hidden">
      {hasDiscount && <span className="price-tag absolute left-0 top-4 z-10">{discountPercent}% OFF</span>}
      <Link to={`/product/${product._id}`} className="block overflow-hidden bg-ink/5">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">{product.category}</span>
        <Link to={`/product/${product._id}`} className="line-clamp-2 font-medium leading-snug hover:text-brand">
          {product.name}
        </Link>
        <RatingStars value={product.ratings} />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-700">₹{product.price.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className="text-xs text-slate-soft line-through">₹{product.cutPrice.toLocaleString('en-IN')}</span>}
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/20"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {product.stock === 0 && <span className="text-xs font-semibold text-brand">Out of stock</span>}
      </div>
    </div>
  );
}
