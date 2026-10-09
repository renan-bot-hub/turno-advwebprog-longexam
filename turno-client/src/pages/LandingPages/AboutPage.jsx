import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Store, Wallet, Search } from 'lucide-react';
import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner_clean.jpg';
import { getProducts, categoryName } from '../../api/products.js';

const STEPS = [
  { icon: Search, title: 'Browse the catalog', text: 'Search or filter by category to find campus apparel, study supplies, and daily essentials.' },
  { icon: ShoppingBag, title: 'Place your order', text: 'Add items to your cart and check out. Prices and stock are confirmed the moment you order.' },
  { icon: Store, title: 'Pick it up on campus', text: 'Track your order under My Orders and claim it at the campus store once it is marked ready.' },
];

const AboutPage = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoaded(true));
  }, []);

  // One tile per category, using a real product photo from that category
  const categories = [...new Set(products.map(categoryName))].filter(Boolean).map((name) => ({
    name,
    imageUrl: products.find((item) => categoryName(item) === name && item.imageUrl)?.imageUrl,
    count: products.filter((item) => categoryName(item) === name).length,
  }));

  const stats = [
    { value: loaded ? products.length : '…', label: 'Products' },
    { value: loaded ? categories.length : '…', label: 'Categories' },
    { value: 'Free', label: 'Campus pickup' },
    { value: 'Cash', label: 'Pay on pickup' },
  ];

  return (
    <div className="bg-[#0A192F]">
      {/* ── Intro ── */}
      <section className="border-b border-white/10 bg-[#112240]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          {/* The mascot fills the left half of the banner: a box with that shape, cropped from the
              left, frames just the bulldog, and the box itself is centered in the column */}
          <div className="flex justify-center">
            <div className="aspect-[16/13] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#071428]">
              <img
                src={banner}
                alt="NU Bulldog mascot"
                className="h-full w-full object-cover object-left"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">About BulldogEx</p>
            <h1 className="max-w-xl text-4xl font-black leading-tight text-white">
              A campus shop focused on useful products and simple ordering.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-blue-200/80">
              BulldogEx brings Bulldog merchandise and everyday campus needs into one place. Browse the catalog,
              order online, and pick up your items at the campus store — no shipping fees, no waiting for delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/products" variant="primary">Shop Products</Button>
              <Button to="/">Back Home</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Store at a glance ── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Store at a glance</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#112240] p-6">
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works + categories ── */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">How it works</p>
          <h2 className="mt-2 text-2xl font-black text-white">From browsing to pickup in three steps</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-white/10 border-l-4 border-l-[#F4B41A] bg-[#112240] p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#F4B41A]/15 text-[#F4B41A]">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{i + 1}. {title}</h3>
                  <p className="mt-1 text-sm leading-6 text-blue-200/80">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#112240] p-5">
            <Wallet size={18} className="flex-shrink-0 text-[#F4B41A]" aria-hidden="true" />
            <p className="text-sm text-blue-200/80">Payment is cash on pickup. You only pay when you collect your order.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#112240] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4B41A]">Shop by category</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-blue-900 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F4B41A]"
              >
                {category.imageUrl
                  ? <img src={category.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  : <div className="flex h-full items-center justify-center bg-[#0A192F]"><ShoppingBag size={40} className="text-white/20" aria-hidden="true" /></div>}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent p-4 pt-10">
                  <p className="font-bold text-white">{category.name}</p>
                  <p className="text-xs text-blue-200/80">{category.count} product{category.count === 1 ? '' : 's'}</p>
                </div>
              </Link>
            ))}
            {loaded && categories.length === 0 && (
              <p className="text-sm text-blue-200/80">No products yet.</p>
            )}
          </div>
          <Link to="/products"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4B41A] py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#07111F] transition hover:bg-[#FFD166]">
            View all products <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
