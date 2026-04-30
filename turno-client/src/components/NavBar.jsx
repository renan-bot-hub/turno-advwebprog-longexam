import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400',
    isActive
      ? 'border-blue-900 bg-blue-900 text-yellow-400'
      : 'border-transparent text-slate-500 hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900',
  ].join(' ');

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-blue-900 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-full">
          <img src={logo} alt="BulldogEx" className="h-9 w-9 rounded-full border-2 border-blue-900 bg-slate-50 object-contain" />
          <div className="space-y-0.5">
            <p className="text-xl font-bold text-blue-900">BulldogEx Shop</p>
          </div>
        </NavLink>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            to="/auth/signin" 
            className="hidden sm:inline-flex items-center justify-center rounded-full border-2 border-blue-900 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-900 transition hover:bg-blue-900 hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Log In
          </Link>
          <Link 
            to="/auth/signup" 
            className="inline-flex items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-400 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-900 transition hover:border-blue-900 hover:bg-blue-900 hover:text-yellow-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  );
};

export default NavBar;