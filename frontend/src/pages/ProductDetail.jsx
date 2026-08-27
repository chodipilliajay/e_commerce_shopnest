import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import Loader from '../components/Loader';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = () => {
    setLoading(true);
    api.get(`/product/${id}`).then((res) => {
      setProduct(res.data.product);
      setActiveImg(0);
      setQty(1);
      setLoading(false);
    });
  };

  useEffect(() => { loadProduct(); }, [id]);

  if (loading) return <Loader full />;
  if (!product) return null;

  const hasDiscount = product.cutPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.cutPrice - product.price) / product.cutPrice) * 100) : 0;

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.put('/review', { rating: reviewRating, comment: reviewComment, productId: id });
      toast.success('Review submitted');
      setReviewRating(0);
      setReviewComment('');
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-xl2 bg-ink/5">
            <img src={product.images[activeImg]?.url} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === activeImg ? 'border-brand' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">{product.category}</span>
          <h1 className="mt-2 font-display text-3xl font-700">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <RatingStars value={product.ratings} showValue />
            <span className="text-sm text-slate-soft">{product.numOfReviews} review{product.numOfReviews !== 1 && 's'}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl font-700">₹{product.price.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-slate-soft line-through">₹{product.cutPrice.toLocaleString('en-IN')}</span>
                <span className="price-tag">{discountPercent}% OFF</span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-ink/70">{product.description}</p>

          <div className="mt-6">
            {product.stock > 0 ? (
              <span className="text-sm font-medium text-mint-dark">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-sm font-medium text-brand">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-ink/10">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-3"><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => addToCart(product, qty)} className="btn-secondary">
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn-primary">
                  <Zap className="h-4 w-4" /> Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-ink/10 pt-10">
        <h2 className="mb-6 font-display text-2xl font-700">Customer Reviews</h2>

        <form onSubmit={submitReview} className="mb-10 max-w-lg rounded-xl2 border border-ink/10 bg-white p-5">
          <h3 className="mb-3 font-medium">Write a review</h3>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setReviewRating(n)}>
                <Star size={22} className={n <= reviewRating ? 'fill-sun text-sun' : 'fill-ink/10 text-ink/10'} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={3}
            className="input-field mb-3"
            required
          />
          <button type="submit" disabled={submittingReview} className="btn-primary !py-2.5 text-sm disabled:opacity-60">
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {product.reviews.length === 0 ? (
          <p className="text-slate-soft">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-5">
            {product.reviews.map((r) => (
              <div key={r._id} className="rounded-xl2 border border-ink/10 bg-white p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{r.name}</span>
                  <RatingStars value={r.rating} />
                </div>
                <p className="text-sm text-ink/70">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
