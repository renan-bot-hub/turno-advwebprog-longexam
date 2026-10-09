import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const guestLinks = [
  { label: 'Sign In', to: '/auth/signin' },
  { label: 'Create Account', to: '/auth/signup' },
];

const customerLinks = [
  { label: 'My Cart', to: '/cart' },
  { label: 'My Orders', to: '/orders' },
  { label: 'My Profile', to: '/profile' },
];

const adminLinks = [
  { label: 'Manage Products', to: '/admin/products' },
  { label: 'Manage Orders', to: '/admin/orders' },
  { label: 'Manage Users', to: '/admin/users' },
];

const Footer = () => {
  const { user, isAdmin } = useAuth();
  const year = new Date().getFullYear();
  const accountLinks = !user ? guestLinks : isAdmin ? adminLinks : customerLinks;

  return (
    <footer className="border-t border-white/5 bg-[#060F1E]">

      {/* ── Main Footer Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-xl font-black text-white mb-1">
              Bulldog<span className="text-[#F4B41A]">Ex</span>
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F4B41A] mb-4">Official Campus Shop</p>
            <p className="text-sm leading-relaxed text-blue-300/80 mb-5">
              Your official hub for National University merchandise. Authentic. Quality. Bulldog-approved.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300/80 mb-4">Shop</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'Campus Apparel', to: '/products?category=Campus+Apparel' },
                { label: 'Study Supplies', to: '/products?category=Study+Supplies' },
                { label: 'Daily Essentials', to: '/products?category=Daily+Essentials' },
                { label: 'New Arrivals', to: '/products?sort=newest' },
              ].map(({ label, to }) => (
                <Link key={label} to={to}
                  className="text-sm text-blue-300/80 hover:text-[#F4B41A] transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300/80 mb-4">Account</p>
            <nav className="flex flex-col gap-2.5">
              {accountLinks.map(({ label, to }) => (
                <Link key={label} to={to}
                  className="text-sm text-blue-300/80 hover:text-[#F4B41A] transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300/80 mb-4">Contact Us</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-[#F4B41A] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-300/80 leading-relaxed">
                  National University, Manila<br />551 M.F. Jhocson St, Sampaloc
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#F4B41A] flex-shrink-0" />
                <p className="text-sm text-blue-300/80">shop@nu.edu.ph</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-[#F4B41A] flex-shrink-0" />
                <p className="text-sm text-blue-300/80">(02) 8831-8631</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-blue-300/80 text-center sm:text-left">
            © {year} BulldogEx. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-xs text-blue-300/80 hover:text-[#F4B41A] transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;