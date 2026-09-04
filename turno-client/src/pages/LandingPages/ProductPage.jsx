import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../../api/products.js';
import { getReviews, createReview } from '../../api/reviews.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Star, ShoppingCart, ArrowLeft, Minus, Plus,
  ShoppingBag, CheckCircle2, AlertCircle, Package, Shield
} from 'lucide-react';

// ─── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ value, onChange, size = 'md' }) => {
  const sz = size === 'sm' ? 14 : 22;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange?.(star)}
          className={`transition-transform ${onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}>
          <Star size={sz} className={star <= value ? 'fill-[#F4B41A] text-[#F4B41A]' : 'text-white/20'} />
        </button>
      ))}
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState('');

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProduct(id), getReviews({ productId: id })])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data.data);
        setReviews(revRes.data.data || []);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart() {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i) => i._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, product.stock);
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartMsg('Added to cart!');
    setTimeout(() => setCartMsg(''), 3000);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!user) return navigate('/auth/signin');
    setReviewError('');
    setSubmitting(true);
    try {
      await createReview({ product: id, rating: reviewForm.rating, comment: reviewForm.comment });
      setReviewSuccess('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      const res = await getReviews({ productId: id });
      setReviews(res.data.data || []);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally { setSubmitting(false); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#F4B41A] border-r-transparent" />
          <p className="mt-4 text-sm text-blue-300/50">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-lg font-bold text-white">{error || 'Product not found.'}</p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F4B41A] px-5 py-2.5 text-sm font-bold text-[#0A192F]">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : null;

  const stockStatus = product.stock === 0
    ? { label: 'Out of Stock', color: 'text-red-400 bg-red-500/10 border-red-500/20' }
    : product.stock < 5
    ? { label: `Only ${product.stock} left!`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    : { label: `${product.stock} in stock`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };

  return (
    <div className="min-h-screen bg-[#0A192F] font-['Outfit']">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-blue-300/40">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white transition">Products</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main Layout */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* ── Product Image ── */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-[#112240]">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ShoppingBag size={64} className="text-white/5" />
                </div>
              )}
              {/* Stock badge overlay */}
              <div className="absolute top-4 left-4">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>
          </div>

          {/* ── Product Details ── */}
          <div className="flex flex-col gap-5">
            {/* Category */}
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F4B41A]/70">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
              {product.title}
            </h1>

            {/* Rating summary */}
            {avgRating && (
              <div className="flex items-center gap-3">
                <StarRating value={Math.round(avgRating)} size="sm" />
                <span className="text-sm font-bold text-white/70">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-blue-300/40">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-black text-[#F4B41A]">
                ₱{product.price?.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed text-blue-200/60 border-t border-white/5 pt-4">
                {Array.isArray(product.description) ? product.description.join(' ') : product.description}
              </p>
            )}

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Quantity + Add to Cart */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-300/50">Qty</label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex h-10 w-10 items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition">
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-white">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="flex h-10 w-10 items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button onClick={addToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F4B41A] py-4 text-sm font-black uppercase tracking-wider text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl hover:shadow-[#F4B41A]/30 active:scale-95">
                  <ShoppingCart size={18} />
                  Add to Cart — ₱{(product.price * qty).toLocaleString()}
                </button>

                {cartMsg && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
                    <CheckCircle2 size={16} /> {cartMsg}
                  </div>
                )}
              </div>
            ) : (
              <button disabled
                className="w-full rounded-xl border border-red-500/20 bg-red-500/10 py-4 text-sm font-bold text-red-400 opacity-60 cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Trust mini-badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Shield, text: 'Official NU Product' },
                { icon: Package, text: 'Campus Delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#112240] px-3 py-2.5">
                  <Icon size={13} className="text-[#F4B41A]" />
                  <span className="text-[11px] font-medium text-blue-300/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-[#112240] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-white">Customer Reviews</h2>
              {avgRating && (
                <div className="mt-1 flex items-center gap-2">
                  <StarRating value={Math.round(avgRating)} size="sm" />
                  <span className="text-sm text-blue-300/50">{avgRating.toFixed(1)} out of 5</span>
                </div>
              )}
            </div>
            <span className="text-sm text-blue-300/40">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          {reviews.length === 0 ? (
            <div className="py-8 text-center border border-white/5 rounded-xl">
              <Star size={32} className="mx-auto text-white/10 mb-3" />
              <p className="text-sm text-blue-300/40">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-white/5 bg-[#0A192F]/60 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4B41A]/10 text-[10px] font-black text-[#F4B41A]">
                        {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{r.user?.firstName} {r.user?.lastName}</p>
                        <StarRating value={r.rating} size="sm" />
                      </div>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-blue-200/60 leading-relaxed pl-11">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Review Form */}
          {isCustomer ? (
            <form onSubmit={handleReviewSubmit} className="border-t border-white/5 pt-8 space-y-5">
              <h3 className="text-base font-bold text-white">Write a Review</h3>
              {reviewError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={14} /> {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={14} /> {reviewSuccess}
                </div>
              )}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-blue-300/50 block mb-2">Your Rating</label>
                <StarRating value={reviewForm.rating} onChange={(v) => setReviewForm((f) => ({ ...f, rating: v }))} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-blue-300/50 block mb-2">Comment</label>
                <textarea rows={4} value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience with this product…"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#F4B41A]/40 resize-none transition" />
              </div>
              <button type="submit" disabled={submitting}
                className="rounded-xl bg-[#F4B41A] px-8 py-3 text-[11px] font-black uppercase tracking-wider text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl active:scale-95 disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          ) : !user ? (
            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-sm text-blue-300/40 mb-3">Sign in to write a review</p>
              <Link to="/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4B41A] px-6 py-2.5 text-sm font-bold text-[#0A192F] hover:bg-[#FFC72C] transition">
                Log In to Review
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;