import { useState, useEffect } from 'react';
import { getOrders } from '../../api/orders.js';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  processing: 'bg-blue-100 text-blue-700 border-blue-300',
  shipped: 'bg-purple-100 text-purple-700 border-purple-300',
  delivered: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
};

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

  if (loading) return <div className="py-20 text-center font-bold text-white/50 animate-pulse">Loading orders…</div>;

  return (
    <div className="min-h-screen bg-[#0A192F] font-['Outfit']">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F4B41A]/70">My Account</p>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">{error}</div>}

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#112240] p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-xl font-bold text-white">No orders yet</p>
            <p className="text-blue-300/50 text-sm mt-2">Start shopping and your orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="rounded-3xl border border-white/10 bg-[#112240] p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">Order ID</p>
                    <p className="font-mono text-sm font-bold text-white">{order._id}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || ''}`}>
                    {order.status}
                  </span>
                </div>

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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">Total</p>
                    <p className="text-lg font-black text-white">₱{order.total?.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-blue-300/40">{new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</p>
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
