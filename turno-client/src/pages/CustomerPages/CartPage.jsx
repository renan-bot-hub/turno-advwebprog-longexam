import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../../api/orders.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ShoppingCart, Minus, Plus, Trash2, ArrowRight,
  ShoppingBag, CheckCircle2, AlertCircle, Tag, Truck
} from 'lucide-react';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  function updateQty(id, qty) {
    if (qty < 1) return removeItem(id);
    setCart((c) => {
      const updated = c.map((i) => i._id === id ? { ...i, quantity: qty } : i);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }

  function removeItem(id) {
    setCart((c) => {
      const updated = c.filter((i) => i._id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  async function handlePlaceOrder() {
    if (!user) return navigate('/auth/signin');
    if (cart.length === 0) return setError('Your cart is empty.');
    setLoading(true);
    setError('');
    try {
      await createOrder({
        items: cart.map((i) => ({ product: i._id, name: i.title, quantity: i.quantity, price: i.price })),
        total: subtotal,
        paymentMethod: 'cod',
      });
      localStorage.removeItem('cart');
      setCart([]);
      setSuccess('Order placed successfully! Redirecting to your orders…');
      setTimeout(() => navigate('/orders'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] font-['Outfit']">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F4B41A]/60 mb-2">Checkout</p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Shopping Cart</h1>
          {cart.length > 0 && (
            <p className="mt-1 text-sm text-blue-300/50">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          )}
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-400">
            <CheckCircle2 size={18} /> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Empty Cart */}
        {cart.length === 0 && !success ? (
          <div className="rounded-2xl border border-white/5 bg-[#112240] py-20 text-center">
            <ShoppingBag size={64} className="mx-auto text-white/10 mb-4" />
            <h2 className="text-xl font-black text-white mb-2">Your cart is empty</h2>
            <p className="text-sm text-blue-300/40 mb-8">Browse our collection and add items to your cart.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F4B41A] px-7 py-3.5 text-sm font-bold text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl active:scale-95">
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : cart.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* ── Cart Items ── */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#112240] p-4 transition-all hover:border-white/10">
                  {/* Image */}
                  <Link to={`/products/${item._id}`} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/5 bg-[#0A192F]">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      : <div className="flex h-full items-center justify-center"><ShoppingBag size={20} className="text-white/10" /></div>}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4B41A]/60">{item.category}</span>
                    <Link to={`/products/${item._id}`}>
                      <h3 className="text-sm font-bold text-white truncate hover:text-[#F4B41A] transition">{item.title}</h3>
                    </Link>
                    <p className="text-base font-black text-[#F4B41A] mt-0.5">₱{item.price?.toLocaleString()}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, Math.min(item.stock ?? 99, item.quantity + 1))}
                      className="flex h-9 w-9 items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition">
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="w-24 text-right text-sm font-black text-white hidden sm:block">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Remove */}
                  <button onClick={() => removeItem(item._id)}
                    className="text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* ── Order Summary Sidebar ── */}
            <div className="h-fit rounded-2xl border border-white/5 bg-[#112240] p-6 sticky top-24">
              <h2 className="text-base font-black text-white mb-5">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-2.5 mb-5 max-h-48 overflow-y-auto">
                {cart.map((i) => (
                  <div key={i._id} className="flex justify-between text-xs text-blue-300/60">
                    <span className="truncate max-w-[160px]">{i.title} × {i.quantity}</span>
                    <span className="font-bold text-white/70 ml-2">₱{(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">Subtotal</span>
                  <span className="font-bold text-white">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-blue-300/60">Delivery</span>
                  <span className="font-bold text-emerald-400">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl bg-[#F4B41A]/10 border border-[#F4B41A]/20 px-4 py-3 mb-5">
                <span className="font-black text-white">Total</span>
                <span className="text-xl font-black text-[#F4B41A]">₱{subtotal.toLocaleString()}</span>
              </div>

              {/* Payment method badge */}
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 mb-5">
                <Tag size={13} className="text-blue-300/50" />
                <span className="text-xs text-blue-300/50 font-medium">Payment: Cash on Delivery (COD)</span>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F4B41A] py-4 text-sm font-black uppercase tracking-wider text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0A192F] border-r-transparent" /> Placing Order…</>
                ) : (
                  <>Place Order <ArrowRight size={16} /></>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2 text-center justify-center">
                <Truck size={12} className="text-blue-300/30" />
                <p className="text-[10px] text-blue-300/30">Campus delivery — free for all orders</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CartPage;
