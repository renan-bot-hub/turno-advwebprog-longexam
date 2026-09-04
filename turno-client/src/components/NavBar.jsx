import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Bell, ChevronDown, LogOut,
  User, LayoutDashboard, Package, ShoppingBag,
  Star, Users, Menu, X, Zap, Tag
} from 'lucide-react';
import logo from '../assets/img/nubdexchange_logo.png';
import { useAuth } from '../context/AuthContext.jsx';


const customerLinks = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
  { label: 'My Orders', to: '/orders' },
];

const adminLinks = [
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
  { label: 'Users', to: '/admin/users', icon: Users },
];

const publicLinks = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const NavBar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const links = user ? (isAdmin ? adminLinks : customerLinks) : publicLinks;

  // Scroll detection for elevated header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);


  // Cart count sync from localStorage
  useEffect(() => {
    function syncCart() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((s, i) => s + (i.quantity || 1), 0));
    }
    syncCart();
    window.addEventListener('storage', syncCart);
    // Also poll since localStorage events don't fire within same tab
    const interval = setInterval(syncCart, 800);
    return () => { window.removeEventListener('storage', syncCart); clearInterval(interval); };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K / ⌘K global shortcut
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); setProfileOpen(false); }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    navigate('/');
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal('');
    }
  }

  return (
    <>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A192F]/97 shadow-xl shadow-black/30 backdrop-blur-md border-b border-white/10'
            : 'bg-[#0A192F] border-b border-white/5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">

          {/* ── Brand ── */}
          <NavLink to="/" className="flex flex-shrink-0 items-center gap-2.5 group">
            <div className="relative h-9 w-9">
              <div className="absolute inset-0 rounded-xl bg-[#F4B41A]/20 blur-sm group-hover:blur-md transition-all" />
              <img
                src={logo}
                alt="BulldogEx"
                className="relative h-9 w-9 rounded-xl border border-[#F4B41A]/30 object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-white">BulldogEx</p>
              {isAdmin
                ? <p className="text-[9px] font-semibold uppercase tracking-widest text-[#F4B41A]">Admin Panel</p>
                : <p className="text-[9px] font-medium uppercase tracking-widest text-blue-300/70">Campus Shop</p>
              }
            </div>
          </NavLink>

          {/* ── Desktop Nav ── */}
          <nav className="hidden flex-1 items-center gap-1 md:flex ml-4">
            {links.map((link) => (
              <NavLink
                key={link.to + link.label}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F4B41A]/10 text-[#F4B41A] border border-[#F4B41A]/20'
                      : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {link.icon && <link.icon size={13} />}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="ml-auto flex items-center gap-2">

            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-blue-200/60 hover:border-[#F4B41A]/30 hover:text-white transition-all group"
            >
              <Search size={13} />
              <span className="hidden lg:inline">Search products…</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-blue-200/40 group-hover:border-white/20">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>

            {/* Cart (customers only) */}
            {user && !isAdmin && (
              <Link
                to="/cart"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-blue-200/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F4B41A] text-[9px] font-black text-[#0A192F]">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              /* Profile dropdown */
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 transition-all hover:border-[#F4B41A]/30 hover:bg-white/10"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F4B41A] text-[9px] font-black text-[#0A192F]">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                  <span className="hidden text-xs font-medium text-white sm:block">{user.firstName}</span>
                  <ChevronDown size={12} className={`text-blue-200/50 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 bg-[#0F2C59] p-1 shadow-2xl shadow-black/40">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-semibold text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-blue-300/60 truncate">{user.email}</p>
                    </div>
                    {!isAdmin && (
                      <>
                        <Link to="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors">
                          <User size={13} /> My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors">
                          <Package size={13} /> My Orders
                        </Link>
                        <Link to="/cart" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors">
                          <ShoppingCart size={13} /> My Cart
                          {cartCount > 0 && (
                            <span className="ml-auto rounded-full bg-[#F4B41A] px-1.5 py-0.5 text-[9px] font-black text-[#0A192F]">{cartCount}</span>
                          )}
                        </Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin/products" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-blue-100/80 hover:bg-white/10 hover:text-white transition-colors">
                        <LayoutDashboard size={13} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="mt-1 border-t border-white/10 pt-1">
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/signin"
                  className="hidden sm:inline-flex rounded-lg px-3 py-1.5 text-xs font-medium text-blue-200/80 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link to="/auth/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F4B41A] px-3 py-1.5 text-xs font-bold text-[#0A192F] shadow-sm transition-all hover:bg-[#FFC72C] hover:shadow-md active:scale-95">
                  <Zap size={12} />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-200/70 hover:bg-white/10 hover:text-white transition-all md:hidden">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-[#0A192F] px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1 mb-3">
              {links.map((link) => (
                <NavLink key={link.to + link.label} to={link.to} end={link.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive ? 'bg-[#F4B41A]/10 text-[#F4B41A] border border-[#F4B41A]/20' : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                    }`
                  }>
                  {link.icon && <link.icon size={15} />}
                  {link.label}
                </NavLink>
              ))}
            </nav>
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-3 flex gap-2">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products…"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#F4B41A]/40"
              />
              <button type="submit" className="rounded-xl bg-[#F4B41A] px-3 py-2">
                <Search size={14} className="text-[#0A192F]" />
              </button>
            </form>
            {!user && (
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <Link to="/auth/signin" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl border border-white/20 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10 transition">
                  Log In
                </Link>
                <Link to="/auth/signup" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl bg-[#F4B41A] py-2.5 text-center text-sm font-bold text-[#0A192F] hover:bg-[#FFC72C] transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Global Search Modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-20 px-4">
          <div ref={searchRef} className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0F2C59] shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search size={16} className="text-blue-300/60 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search campus products…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-blue-300/40 outline-none"
              />
              <kbd className="text-[10px] text-blue-300/40 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </form>
            <div className="px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/40 mb-2">Quick Categories</p>
              <div className="flex flex-wrap gap-2">
                {['Uniforms', 'Books', 'Gadgets', 'Apparel', 'Essentials'].map((cat) => (
                  <button key={cat} type="button"
                    onClick={() => { navigate(`/products?search=${cat}`); setSearchOpen(false); setSearchVal(''); }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-200/70 hover:border-[#F4B41A]/50 hover:text-[#F4B41A] transition-all">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;