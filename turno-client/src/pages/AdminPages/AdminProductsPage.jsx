import { useState, useEffect } from 'react';
import {
  getProducts, createProduct, updateProduct, deleteProduct, deleteProductImage,
  getCategories, getSuppliers, categoryName, supplierName,
} from '../../api/products.js';

const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F4B41A]/40 focus:bg-white/8 transition placeholder:text-white/40';
const EMPTY = { name: '', title: '', category: '', supplier: '', price: '', stock: '', description: '', imageUrl: '' };
// Sent even when empty, so clearing them in the form really clears them
const ALWAYS_SEND = ['description', 'supplier'];

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.data || [])).catch(() => {});
    getSuppliers().then((r) => setSuppliers(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function flash(msg, isError = false) {
    if (isError) { setError(msg); setTimeout(() => setError(''), 4000); }
    else { setMsg(msg); setTimeout(() => setMsg(''), 4000); }
  }

  function load() {
    setLoading(true);
    getProducts({ limit: 50, sort: 'createdAt', order: 'desc' })
      .then((r) => {
        const data = r.data.data || [];
        setProducts(data);
        // Show the real total from pagination if available, otherwise fall back to loaded length
        setTotal(r.data.pagination?.total ?? data.length);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  function openCreate() {
    setForm(EMPTY); setImageFile(null); setImagePreview(''); setEditId(null); setShowForm(true);
  }
  function openEdit(p) {
    setForm({
      name: p.name,
      title: p.title,
      category: p.category?._id || '',
      supplier: p.supplier?._id || '',
      price: p.price,
      stock: p.stock,
      description: Array.isArray(p.description) ? p.description.join('\n') : p.description || '',
      imageUrl: p.imageUrl || '',
    });
    setImageFile(null); setImagePreview(p.imageUrl || '');
    setEditId(p._id); setShowForm(true);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid image type. Choose a JPEG, PNG, or WebP file.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. The maximum file size is 5 MB.');
      e.target.value = '';
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const payload = new FormData();
    Object.entries({ ...form, price: Number(form.price), stock: Number(form.stock), description: form.description }).forEach(([key, value]) => {
      if (ALWAYS_SEND.includes(key) || (value !== undefined && value !== '')) payload.append(key, value ?? '');
    });
    if (imageFile) payload.append('image', imageFile);
    try {
      if (editId) { await updateProduct(editId, payload); flash('Product updated!'); }
      else { await createProduct(payload); flash('Product created!'); }
      setShowForm(false); load();
    } catch (err) { flash(err.response?.data?.message || 'Failed to save.', true); }
    finally { setSubmitting(false); }
  }

  // Removes the current image from the product and from Cloudinary
  async function handleRemoveImage() {
    if (!window.confirm('Remove this product\'s image?')) return;
    try {
      await deleteProductImage(editId);
      setForm((f) => ({ ...f, imageUrl: '' }));
      setImagePreview('');
      flash('Image removed.');
      load();
    } catch (err) { flash(err.response?.data?.message || 'Failed to remove the image.', true); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); flash('Product deleted.'); load(); }
    catch (err) { flash(err.response?.data?.message || 'Failed to delete.', true); }
  }

  const FORM_FIELDS = [
    ['name', 'Slug Name'],
    ['title', 'Title'],
    ['imageUrl', 'Image URL'],
  ];

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Admin</p>
            <h1 className="text-3xl font-black text-white">Products</h1>
            {!loading && total > products.length && (
              <p className="text-xs text-amber-400 mt-1">Showing {products.length} of {total} products — use search/filters for full list.</p>
            )}
          </div>
          <button onClick={openCreate}
            className="rounded-xl bg-[#F4B41A] px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#0A192F] shadow-lg transition hover:bg-[#FFC72C]">
            + New Product
          </button>
        </div>

        {msg && <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-400 font-medium">{msg}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400 font-medium">{error}</div>}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F2C59] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl font-black text-white mb-5">{editId ? 'Edit Product' : 'New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {FORM_FIELDS.map(([n, l]) => (
                  <div key={n}>
                    <label htmlFor={`prod-${n}`} className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">{l}</label>
                    <input id={`prod-${n}`} name={n} value={form[n]} onChange={handleChange} className={inputCls} required={n !== 'imageUrl'}
                      placeholder={n === 'name' ? 'e.g. nu-varsity-cap' : undefined} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prod-category" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Category</label>
                    <select id="prod-category" name="category" value={form.category} onChange={handleChange} className={`${inputCls} cursor-pointer`} required>
                      <option value="" className="bg-[#0A192F]">Choose a category</option>
                      {categories.map((c) => <option key={c._id} value={c._id} className="bg-[#0A192F]">{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="prod-supplier" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Supplier</label>
                    <select id="prod-supplier" name="supplier" value={form.supplier} onChange={handleChange} className={`${inputCls} cursor-pointer`}>
                      <option value="" className="bg-[#0A192F]">None</option>
                      {suppliers.map((s) => <option key={s._id} value={s._id} className="bg-[#0A192F]">{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="prod-image" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Upload Image</label>
                  <input id="prod-image" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white file:mr-3 file:rounded-lg file:border-0 file:bg-[#F4B41A] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#0A192F]" />
                  {imagePreview && <img src={imagePreview} alt="Selected product preview" className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-white object-contain" />}
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-xs text-white/70">JPEG, PNG, or WebP. Maximum 5 MB. A new image replaces the old one.</p>
                    {editId && form.imageUrl && !imageFile && (
                      <button type="button" onClick={handleRemoveImage}
                        className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300 hover:bg-red-500/20 transition">
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prod-price" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Price (₱)</label>
                    <input id="prod-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={inputCls} required />
                  </div>
                  <div>
                    <label htmlFor="prod-stock" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Stock</label>
                    <input id="prod-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className={inputCls} required />
                  </div>
                </div>
                <div>
                  <label htmlFor="prod-description" className="text-xs font-bold uppercase tracking-widest text-blue-300/80 block mb-1">Description (one per line)</label>
                  <textarea id="prod-description" name="description" rows={3} value={form.description} onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#F4B41A]/40 resize-none transition placeholder:text-white/40" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex-1 rounded-xl bg-[#F4B41A] py-2.5 text-xs font-black uppercase tracking-[0.2em] text-[#0A192F] hover:bg-[#FFC72C] disabled:opacity-50 transition">
                    {submitting ? 'Saving…' : (editId ? 'Update' : 'Create')}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:border-red-500/30 hover:text-red-400 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center font-bold text-white/70 animate-pulse">Loading…</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#112240]">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-[#0F2C59]/60">
                <tr>{['Image', 'Title', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest text-blue-300/80">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-blue-300/80">No products yet.</td></tr>
                )}
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded-lg border border-white/10 bg-[#0A192F] overflow-hidden">
                        {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-[11px] text-white/20">N/A</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-white max-w-[180px] truncate">{p.title}</td>
                    <td className="px-4 py-3 text-blue-300/80">
                      {categoryName(p)}
                      {supplierName(p) && <span className="block text-xs text-blue-300/60">{supplierName(p)}</span>}
                    </td>
                    <td className="px-4 py-3 font-black text-[#F4B41A]">₱{p.price?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${p.stock === 0 ? 'text-red-400' : p.stock < 5 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-white/70 hover:bg-[#F4B41A]/10 hover:border-[#F4B41A]/30 hover:text-[#F4B41A] transition">Edit</button>
                        <button onClick={() => handleDelete(p._id)} aria-label={`Delete ${p.title}`} className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase text-red-400 hover:bg-red-500/20 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
