// Shared order status labels and colors for the customer and admin order pages.
// Orders are picked up on campus, so "delivered" is shown as "Picked up".
export const ORDER_STATUSES = {
  pending: { label: 'Pending', badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  processing: { label: 'Processing', badge: 'border-blue-500/30 bg-blue-500/10 text-blue-200' },
  ready: { label: 'Ready for pickup', badge: 'border-indigo-400/40 bg-indigo-500/15 text-indigo-200' },
  shipped: { label: 'Shipped', badge: 'border-purple-500/30 bg-purple-500/10 text-purple-200' },
  delivered: { label: 'Picked up', badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  cancelled: { label: 'Cancelled', badge: 'border-red-500/30 bg-red-500/10 text-red-300' },
};

// Statuses an admin can choose for a pickup order
export const PICKUP_FLOW = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];

export function statusLabel(status) {
  return ORDER_STATUSES[status]?.label || status;
}

export function statusBadgeClass(status) {
  return ORDER_STATUSES[status]?.badge || 'border-white/10 bg-white/5 text-white/70';
}

// "6ab4cfcf67e1e0fb0614aa48" -> "#0614AA48": short enough to read out at the counter
export function shortOrderId(id = '') {
  return `#${id.slice(-8).toUpperCase()}`;
}
