import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t-4 border-yellow-400 bg-blue-900 px-4 py-10 sm:px-6 lg:px-8 font-['Outfit']">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          
          {/* Brand Section */}
          <div className="max-w-xs">
            <p className="text-xl font-extrabold text-yellow-400">BulldogEx Shop</p>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              Your central hub for campus essentials, simple ordering, and official university merchandise.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-400">
              Store
            </p>
            <nav className="flex flex-col gap-2 text-sm font-medium text-blue-200">
              <Link to="/products" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                Products
              </Link>
              <Link to="/" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                Cart
              </Link>
              <Link to="/about" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                Pickup Details
              </Link>
            </nav>
          </div>

          {/* Social Media Links (These trigger the 404 NotFoundPage) */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-yellow-500">
              Connect With Us
            </p>
            <nav className="flex flex-col gap-2 text-sm font-medium text-blue-200">
              <Link to="/social/facebook" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                Facebook
              </Link>
              <Link to="/social/twitter" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                X (Twitter)
              </Link>
              <Link to="/social/instagram" className="transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:text-yellow-400">
                Instagram
              </Link>
            </nav>
          </div>

        </div>
        
        {/* Copyright Bar */}
        <div className="mt-10 border-t border-blue-800 pt-6 text-center sm:text-left">
          <p className="text-xs text-blue-400">
            &copy; {new Date().getFullYear()} National University BulldogEx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;