import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { getOrders } from '../../api/orders.js';
import { statusLabel, statusBadgeClass, shortOrderId } from '../../api/orderStatus.js';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A192F] py-20 text-center font-bold text-white/70 animate-pulse">Loading orders…</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">My Account</p>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">{error}</div>}

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#112240] p-12 text-center">
            <p className="text-xl font-bold text-white">No orders yet</p>
            <p className="text-blue-300/80 text-sm mt-2">Start shopping and your orders will appear here.</p>
            <Link to="/products"
              className="mt-6 inline-flex rounded-xl bg-[#F4B41A] px-6 py-3 text-sm font-bold text-[#0A192F] transition hover:bg-[#FFC72C]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-3xl border border-white/10 bg-[#112240] p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="text-lg font-black text-white" title={order._id}>Order {shortOrderId(order._id)}</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    {statusLabel(order.status)}
                  </span>
                </div>

                {order.status === 'ready' && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
                    <Store size={16} aria-hidden="true" />
                    Your order is ready. Show order number <strong>{shortOrderId(order._id)}</strong> at the campus store and pay on pickup.
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-blue-200/70">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-bold">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-300/80">Total</p>
                    <p className="text-lg font-black text-white">₱{order.total?.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-blue-300/80">{new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
