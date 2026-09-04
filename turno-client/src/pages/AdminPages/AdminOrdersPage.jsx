import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/orders.js';

const STATUS_OPTIONS = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  processing: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  ready: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  delivered: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  cancelled: 'border-red-500/30 bg-red-500/10 text-red-400',
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  function flash(m, isErr = false) {
    if (isErr) { setError(m); setTimeout(() => setError(''), 4000); }
    else { setMsg(m); setTimeout(() => setMsg(''), 4000); }
  }

  function load() {
    setLoading(true);
    const params = filter ? { status: filter } : {};
    getOrders(params).then((r) => setOrders(r.data.data || [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(id, status) {
    try {
      await updateOrderStatus(id, { status });
      flash('Order status updated! ✅');
      load();
    } catch { flash('Failed to update status.', true); }
  }

  return (
    <div className="min-h-screen bg-[#0A192F] font-['Outfit']">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F4B41A]/70">Admin</p>
            <h1 className="text-3xl font-black text-white">Orders</h1>
          </div>
          <label htmlFor="orders-filter" className="sr-only">Filter by status</label>
          <select
            id="orders-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white outline-none focus:border-[#F4B41A]/40 transition">
            <option value="" className="bg-[#0A192F]">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#0A192F]">{s}</option>)}
          </select>
        </div>

        {msg && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400">{msg}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400">⚠️ {error}</div>}

        {loading ? <div className="py-20 text-center font-bold text-white/50 animate-pulse">Loading…</div> : (
          <div className="space-y-4">
            {orders.length === 0 && <div className="py-20 text-center text-blue-300/40">No orders found.</div>}
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-white/10 bg-[#112240] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">Order ID</p>
                    <p className="font-mono text-sm font-bold text-white">{order._id}</p>
                    <p className="text-sm text-blue-300/50 mt-1">
                      Customer: <strong className="text-white/70">{order.user?.firstName} {order.user?.lastName}</strong>
                      <span className="ml-1 text-blue-300/40">({order.user?.email})</span>
                    </p>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColors[order.status] || 'border-white/10 bg-white/5 text-white/40'}`}>
                      {order.status}
                    </span>
                    {order.status === 'pending' && (
                      <button onClick={() => handleStatusChange(order._id, 'processing')}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase text-blue-300 hover:bg-blue-500/20 transition">
                        ✅ Confirm Order
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button onClick={() => handleStatusChange(order._id, 'ready')}
                        className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase text-indigo-300 hover:bg-indigo-500/20 transition">
                        📦 Ready for Claiming
                      </button>
                    )}
                    <label htmlFor={`status-${order._id}`} className="sr-only">Change order status</label>
                    <select
                      id={`status-${order._id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#0A192F] px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-[#F4B41A]/40 transition">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-blue-200/60">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-bold text-white/70">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-xs text-blue-300/40">{new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</span>
                  <span className="font-black text-[#F4B41A]">Total: ₱{order.total?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
