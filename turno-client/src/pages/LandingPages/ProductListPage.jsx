import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, categoryName } from '../../api/products.js';
import { Search, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Each option maps to the API's sort field and direction
const SORT_OPTIONS = {
  newest: { label: 'Newest First', sort: 'createdAt', order: 'desc' },
  'price-asc': { label: 'Price: Low to High', sort: 'price', order: 'asc' },
  'price-desc': { label: 'Price: High to Low', sort: 'price', order: 'desc' },
  'name-asc': { label: 'Name A–Z', sort: 'title', order: 'asc' },
};

// ─── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#112240] animate-pulse">
      <div className="aspect-[4/3] bg-[#0A192F]/60" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-1/3 bg-white/5 rounded" />
        <div className="h-3.5 w-3/4 bg-white/5 rounded" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-5 w-1/4 bg-white/5 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const stockStatus = product.stock === 0
    ? { label: 'Out of Stock', cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
    : product.stock < 5
    ? { label: 'Low Stock', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    : { label: 'In Stock', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

  return (
    <Link to={`/products/${product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#112240] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F4B41A]/30 hover:shadow-2xl hover:shadow-[#F4B41A]/10">

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A192F]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag size={32} className="text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4B41A] px-4 py-1.5 text-xs font-bold text-[#0A192F] shadow-lg">
            View Product <ArrowRight size={11} />
          </span>
        </div>
        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm ${stockStatus.cls}`}>
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#F4B41A] mb-1">{categoryName(product)}</span>
        <h3 className="text-sm font-semibold text-white/90 line-clamp-1 mb-auto">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-black text-[#F4B41A]">₱{product.price?.toLocaleString()}</p>
        </div>
        <p className="text-xs text-blue-300/80 mt-1">{product.stock} in stock</p>
      </div>
    </Link>
  );
}

const ProductListPage = () => {
  // Filters live in the URL so navbar search, footer links, and the back button all work
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortKey = SORT_OPTIONS[searchParams.get('sort')] ? searchParams.get('sort') : 'newest';
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);
  const [pagination, setPagination] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const LIMIT = 12;

  // Keep the search box in sync when the URL's search changes (e.g. from the navbar)
  if (search !== lastSearch) {
    setLastSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const { sort, order } = SORT_OPTIONS[sortKey];
    const params = { page, limit: LIMIT, sort, order };
    if (search) params.search = search;
    if (category) params.category = category;
    getProducts(params)
      .then((res) => { setProducts(res.data.data || []); setPagination(res.data.pagination || {}); })
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, [page, sortKey, category, search, reloadKey]);

  // Changing any filter returns to page 1 unless a page is given
  function updateParams(changes) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(changes)) {
        if (value === '' || value === null || value === undefined) next.delete(key);
        else next.set(key, String(value));
      }
      if (!('page' in changes)) next.delete('page');
      return next;
    });
  }

  function goToPage(p) {
    updateParams({ page: p > 1 ? p : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSearch(e) {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  }

  function clearFilters() {
    setSearchInput('');
    setSearchParams({});
  }

  const hasFilters = search || category || sortKey !== 'newest';

  return (
    <div className="min-h-screen bg-[#0A192F]">

      {/* ── Page Header ── */}
      <section className="border-b border-white/5 bg-[#0F2C59]/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#F4B41A]">Official Bulldogs Merchandise</p>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">All Products</h1>
          <p className="mt-2 text-sm text-blue-300/80">
            Browse {pagination.total ?? '...'} campus essentials — from apparel to study supplies.
          </p>

          {/* ── Filter Bar ── */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[220px] max-w-md">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/80" />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-blue-300/60 outline-none focus:border-[#F4B41A]/40 focus:bg-white/8 transition"
                />
              </div>
              <button type="submit"
                className="rounded-xl bg-[#F4B41A] px-4 py-2.5 text-sm font-bold text-[#0A192F] hover:bg-[#FFC72C] transition shrink-0">
                Search
              </button>
            </form>

            {/* Category filter */}
            <select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              aria-label="Filter by category"
              className="rounded-xl border border-white/10 bg-[#112240] px-4 py-2.5 text-sm text-white/80 outline-none focus:border-[#F4B41A]/40 transition cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? '' : e.target.value })}
              aria-label="Sort products"
              className="rounded-xl border border-white/10 bg-[#112240] px-4 py-2.5 text-sm text-white/80 outline-none focus:border-[#F4B41A]/40 transition cursor-pointer"
            >
              {Object.entries(SORT_OPTIONS).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition">
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* Active filters display */}
          {(search || category) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F4B41A]/20 bg-[#F4B41A]/10 px-3 py-1 text-xs font-medium text-[#F4B41A]">
                  "{search}"
                  <button onClick={() => updateParams({ search: '' })} className="hover:text-white" aria-label="Remove search filter">
                    <X size={10} />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  {category}
                  <button onClick={() => updateParams({ category: '' })} className="hover:text-white" aria-label="Remove category filter">
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="results-heading">
        <div className="mx-auto max-w-7xl">
          <h2 id="results-heading" className="sr-only">Product results</h2>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-red-400 font-medium">{error}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}
                className="mt-4 rounded-xl bg-[#F4B41A] px-5 py-2.5 text-sm font-bold text-[#0A192F]">
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag size={48} className="mx-auto text-white/10 mb-4" />
              <p className="text-lg font-bold text-white/70">No products found</p>
              <p className="text-sm text-blue-300/80 mt-1">Try adjusting your search or filters.</p>
              <button onClick={clearFilters}
                className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}

          {/* ── Pagination ── */}
          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 disabled:opacity-30 hover:bg-white/10 hover:text-white transition"
              >
                <ChevronLeft size={14} /> Prev
              </button>

              <div className="flex gap-1">
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  if (Math.abs(p - page) > 2 && p !== 1 && p !== pagination.pages) {
                    if (p === 2 || p === pagination.pages - 1) return <span key={p} className="px-1 text-white/60">…</span>;
                    return null;
                  }
                  return (
                    <button key={p} onClick={() => goToPage(p)}
                      className={`h-9 w-9 rounded-xl text-sm font-bold transition ${
                        page === p
                          ? 'bg-[#F4B41A] text-[#0A192F]'
                          : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >{p}</button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(Math.min(pagination.pages, page + 1))}
                disabled={page >= pagination.pages}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 disabled:opacity-30 hover:bg-white/10 hover:text-white transition"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductListPage;