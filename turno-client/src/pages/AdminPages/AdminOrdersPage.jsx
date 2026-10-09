import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../api/orders.js';
import { PICKUP_FLOW, statusLabel, statusBadgeClass, shortOrderId } from '../../api/orderStatus.js';

// The one obvious next step for each status, shown as a button
const NEXT_STEP = {
  pending: { status: 'processing', label: 'Confirm order' },
  processing: { status: 'ready', label: 'Mark ready for pickup' },
  ready: { status: 'delivered', label: 'Mark as picked up' },
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
      flash(`Order ${shortOrderId(id)} is now "${statusLabel(status)}".`);
      load();
    } catch (err) { flash(err.response?.data?.message || 'Failed to update status.', true); }
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Admin</p>
            <h1 className="text-3xl font-black text-white">Orders</h1>
          </div>
          <label htmlFor="orders-filter" className="sr-only">Filter by status</label>
          <select
            id="orders-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white outline-none focus:border-[#F4B41A]/40 transition">
            <option value="" className="bg-[#0A192F]">All statuses</option>
            {PICKUP_FLOW.map((s) => <option key={s} value={s} className="bg-[#0A192F]">{statusLabel(s)}</option>)}
          </select>
        </div>

        {msg && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400">{msg}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400">{error}</div>}

        {loading ? <div className="py-20 text-center font-bold text-white/70 animate-pulse">Loading…</div> : (
          <div className="space-y-4">
            {orders.length === 0 && <div className="py-20 text-center text-blue-300/80">No orders found.</div>}
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl border border-white/10 bg-[#112240] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-black text-white" title={order._id}>Order {shortOrderId(order._id)}</p>
                      {/* Status is information, not a button: a plain badge with a dot */}
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(order.status)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-300/80 mt-1">
                      Customer: <strong className="text-white">{order.user?.firstName} {order.user?.lastName}</strong>
                      <span className="ml-1 text-blue-300/80">({order.user?.email})</span>
                    </p>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    {NEXT_STEP[order.status] && (
                      <button onClick={() => handleStatusChange(order._id, NEXT_STEP[order.status].status)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#F4B41A] px-4 py-2 text-sm font-bold text-[#0A192F] shadow-sm transition hover:bg-[#FFC72C]">
                        {NEXT_STEP[order.status].label} <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    )}
                    <label htmlFor={`status-${order._id}`} className="sr-only">Change order status</label>
                    <select
                      id={`status-${order._id}`}
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      title={order.status === 'cancelled' ? 'Cancelled orders cannot be reopened' : 'Set any status'}
                      onChange={(e) => {
                        const status = e.target.value;
                        if (status === 'cancelled' && !window.confirm(`Cancel order ${shortOrderId(order._id)}? Its items go back in stock.`)) return;
                        handleStatusChange(order._id, status);
                      }}
                      className="rounded-xl border border-white/10 bg-[#0A192F] px-3 py-2 text-sm font-semibold text-white outline-none focus:border-[#F4B41A]/40 transition disabled:cursor-not-allowed disabled:opacity-50">
                      {/* Keep an old status (e.g. "shipped") selectable so the dropdown shows it correctly */}
                      {[...new Set([...PICKUP_FLOW, order.status])].map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-blue-200/80">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-bold text-white/70">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-xs text-blue-300/80">{new Date(order.createdAt).toLocaleDateString('en-PH', { dateStyle: 'medium' })}</span>
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
