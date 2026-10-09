import { useState, useEffect } from 'react';
import { getReviews, updateReview, deleteReview } from '../../api/reviews.js';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  function flash(m, isErr = false) {
    if (isErr) { setError(m); setTimeout(() => setError(''), 4000); }
    else { setMsg(m); setTimeout(() => setMsg(''), 4000); }
  }

  function load() {
    setLoading(true);
    getReviews().then((r) => setReviews(r.data.data || [])).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openEdit(r) { setEditId(r._id); setEditComment(r.comment || ''); setEditRating(r.rating); }

  async function handleSave(id) {
    try {
      await updateReview(id, { rating: editRating, comment: editComment });
      flash('Review updated!'); setEditId(null); load();
    } catch { flash('Failed to update review.', true); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview(id); flash('Review deleted.'); load(); }
    catch { flash('Failed to delete review.', true); }
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Admin</p>
          <h1 className="text-3xl font-black text-white">Reviews</h1>
        </div>

        {msg && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400">{msg}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400">{error}</div>}

        {loading ? <div className="py-20 text-center font-bold text-white/70 animate-pulse">Loading…</div> : (
          <div className="space-y-4">
            {reviews.length === 0 && <div className="py-20 text-center text-blue-300/80">No reviews yet.</div>}
            {reviews.map((r) => (
              <div key={r._id} className="rounded-2xl border border-white/10 bg-[#112240] p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-bold text-white">{r.user?.firstName} {r.user?.lastName}</p>
                    <p className="text-xs text-blue-300/80">on: {r.product?.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#F4B41A]/30 bg-[#F4B41A]/10 px-2 py-1 text-[#F4B41A]">
                      {'★'.repeat(r.rating)}
                      <span className="text-white/20">{'★'.repeat(5 - r.rating)}</span>
                    </span>
                    <button onClick={() => openEdit(r)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-white/70 hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]/30 hover:text-[#F4B41A] transition">Edit</button>
                    <button onClick={() => handleDelete(r._id)} aria-label={`Delete review by ${r.user?.firstName || 'user'}`} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase text-red-400 hover:bg-red-500/20 transition">Delete</button>
                  </div>
                </div>
                {editId === r._id ? (
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center gap-1" role="group" aria-label="Edit rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} type="button" onClick={() => setEditRating(s)}
                          className={`text-xl transition ${s <= editRating ? 'text-[#F4B41A]' : 'text-white/20 hover:text-white/40'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                    <label htmlFor={`review-comment-${r._id}`} className="sr-only">Edit comment</label>
                    <textarea
                      id={`review-comment-${r._id}`}
                      rows={3}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#F4B41A]/40 resize-none transition placeholder:text-white/40"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(r._id)} className="rounded-xl bg-[#F4B41A] px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#0A192F] hover:bg-[#FFC72C] transition">Save</button>
                      <button onClick={() => setEditId(null)} className="rounded-xl border border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:border-red-500/30 hover:text-red-400 transition">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-blue-200/80 mt-1">{r.comment || <em className="text-white/20">No comment</em>}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
