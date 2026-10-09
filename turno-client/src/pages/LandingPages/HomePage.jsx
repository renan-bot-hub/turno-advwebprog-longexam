import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShoppingBag, BookOpen,
  Shirt, ChevronRight, TrendingUp,
  Flame, Award
} from 'lucide-react';
import { getProducts, categoryName } from '../../api/products.js';
import banner from '../../assets/img/nu_bulldogex_banner_clean.jpg';

// ─── Category Chips ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Campus Apparel', icon: Shirt, color: 'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:border-blue-400/60 hover:text-blue-200 hover:bg-blue-500/20' },
  { label: 'Study Supplies', icon: BookOpen, color: 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:border-amber-400/60 hover:text-amber-200 hover:bg-amber-500/20' },
  { label: 'Daily Essentials', icon: ShoppingBag, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-500/20' },
];

// ─── Product Card ──────────────────────────────────────────────────────────────
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
        {/* Dark gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Quick view CTA */}
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
      </div>
    </Link>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#112240] animate-pulse">
      <div className="aspect-[4/3] bg-[#0A192F]/60" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-1/3 bg-white/5 rounded" />
        <div className="h-3.5 w-3/4 bg-white/5 rounded" />
        <div className="h-5 w-1/4 bg-white/5 rounded mt-3" />
      </div>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getProducts({ limit: 6, sort: 'createdAt', order: 'desc' })
      .then((r) => setFeatured(r.data.data || []))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A192F]">

      {/* ── Hero ── */}
      <section className="relative aspect-[1709/651] w-full overflow-hidden bg-[#071428]">

        {/* Bulldog banner — large, left-anchored, full opacity */}
        <img
          src={banner}
          alt="NU Bulldog mascot"
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: 0.95, objectPosition: 'left center' }}
        />

        {/* Right-half gradient for text readability, left stays fully clear */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#071428]/90 via-[#071428]/55 to-transparent" />

        {/* ── Content column — right half ── */}
        <div className="relative z-10 flex h-full min-h-[62vh] items-center justify-center px-6 text-center md:justify-end md:text-left sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[560px]">

            {/* Badge */}
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#F4B41A]/40 bg-[#071428]/60 px-4 py-1.5 backdrop-blur-sm">
              <TrendingUp size={11} className="text-[#F4B41A]" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4B41A]">Official Bulldogs Shop</p>
            </div>

            {/* Heading */}
            <h1 className="text-6xl font-black leading-[0.98] text-white sm:text-7xl">
              The <span className="text-[#F4B41A]">Official</span>
              <br />Bulldogs Store
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm leading-relaxed text-blue-200/80 sm:text-[15px]">
              Your one-stop official shop for National University merchandise —
              uniforms, apparel, accessories, and more, all under the Bulldog badge.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4B41A] px-7 py-3.5 text-sm font-bold text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl active:scale-95">
                Shop Now <ArrowRight size={15} />
              </Link>
              <Link to="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/12 active:scale-95">
                About Us
              </Link>
            </div>

          </div>
        </div>

        {/* ── Gold divider ── */}
        <div className="relative z-10 h-[3px] bg-[#F4B41A]" />
      </section>


      {/* ── Category Chips ── */}
      <section className="relative z-10 border-y border-white/5 bg-[#0F2C59]/80 backdrop-blur-sm px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="shrink-0 text-xs font-bold uppercase tracking-widest text-blue-300/80">Browse by Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, icon: Icon, color }) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${color}`}
              >
                <Icon size={13} />
                {label}
              </Link>
            ))}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              View All <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-[#F4B41A]" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#F4B41A]">Just Arrived</p>
              </div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">Featured Products</h2>
            </div>
            <Link to="/products"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-300/80 hover:border-[#F4B41A]/30 hover:text-[#F4B41A] transition-all">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loadingProducts
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : featured.map((p) => <ProductCard key={p._id} product={p} />)
            }
          </div>

          <div className="mt-8 text-center">
            <Link to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-white transition-all hover:border-[#F4B41A]/30 hover:bg-[#F4B41A]/5 hover:text-[#F4B41A] active:scale-95">
              Browse all products <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Browse by Section ── */}
      <section className="border-t border-white/5 bg-[#0F2C59]/40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F4B41A] mb-2">Shop Sections</p>
              <h2 className="text-2xl font-black text-white sm:text-3xl">Browse by Section</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Daily Essentials',
                desc: 'Lanyards, tumblers, bags, and everyday campus items.',
                img: 'https://varsitylifestyleco.com/cdn/shop/files/NULanyard.jpg',
                cta: 'Shop Essentials',
                badge: 'Best Sellers',
              },
              {
                title: 'Study Supplies',
                desc: 'Notes, desk tools, and gear for class and review season.',
                img: 'https://ecommerce.datablitz.com.ph/cdn/shop/files/dfbfdb_1dfa5b1d-0153-4b2c-b91d-f6dba679d87f_1024x.jpg?v=1703065790',
                cta: 'Shop Supplies',
                badge: 'New Arrivals',
              },
              {
                title: 'Campus Apparel',
                desc: 'Hoodies, jerseys, and NU merch for every Bulldog.',
                img: 'https://ph-live-01.slatic.net/p/mdc/dc6f40dc1118bce32be03e63248b19e2.jpg',
                cta: 'Shop Apparel',
                badge: 'Popular',
              },
            ].map((card) => (
              <article key={card.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#112240] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F4B41A]/20 hover:shadow-2xl hover:shadow-black/30">
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full bg-[#F4B41A] px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#0A192F]">
                    {card.badge}
                  </span>
                </div>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={card.img} alt={card.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/30 to-transparent" />
                </div>
                <div className="relative p-5">
                  <h3 className="text-base font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-sm text-blue-300/80 mb-4">{card.desc}</p>
                  <Link to={`/products?category=${encodeURIComponent(card.title)}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#F4B41A]/10 border border-[#F4B41A]/20 px-3 py-1.5 text-xs font-semibold text-[#F4B41A] hover:bg-[#F4B41A]/20 transition-all">
                    {card.cta} <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-white/5 bg-[#0F2C59]/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F4B41A]/20 bg-[#F4B41A]/10 px-4 py-1.5">
            <Award size={12} className="text-[#F4B41A]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F4B41A]">Official NU Merchandise</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3 sm:text-4xl">
            Shop the <span className="text-[#F4B41A]">Official</span> Bulldogs Collection
          </h2>
          <p className="text-sm text-blue-300/80 mb-5 leading-relaxed">
            Campus apparel, study supplies, and everyday essentials — all in one place, ready for pickup on campus.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F4B41A] px-8 py-3.5 text-sm font-bold text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl active:scale-95">
              Browse Products <ArrowRight size={15} />
            </Link>
            <Link to="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-95">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;