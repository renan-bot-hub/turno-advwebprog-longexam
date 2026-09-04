import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import { Shield, Truck, Star } from 'lucide-react';

const PERKS = [
  { icon: Shield, text: 'Official NU Store' },
  { icon: Truck, text: 'Campus Delivery' },
  { icon: Star, text: 'Quality Guaranteed' },
];

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen h-screen grid-cols-1 overflow-hidden font-['Outfit'] lg:grid-cols-2">

      {/* ── Left Branding Panel (hidden on mobile) ── */}
      <div className="relative hidden overflow-hidden bg-[#00205B] lg:flex lg:flex-col">
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group mb-auto">
            <div className="relative h-11 w-11">
              <div className="absolute inset-0 rounded-xl bg-[#F4B41A]/20 blur-sm group-hover:blur-md transition-all" />
              <img src={logo} alt="BulldogEx" className="relative h-11 w-11 rounded-xl border border-[#F4B41A]/30 object-contain" />
            </div>
            <div>
              <p className="text-base font-bold text-white">BulldogEx</p>
              <p className="text-[9px] font-medium uppercase tracking-widest text-[#F4B41A]/70">Official Campus Shop</p>
            </div>
          </Link>

          {/* Headline */}
          <div className="my-auto max-w-lg py-12">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#F4B41A]">National University</p>
            <h2 className="text-5xl font-black leading-[1.05] text-white xl:text-6xl">
              Your Campus.<br />
              Your <span className="text-[#F4B41A]">Store.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75">
              Join thousands of Bulldogs shopping official NU merchandise — from campus apparel to everyday essentials.
            </p>

            {/* Perks */}
            <div className="mt-9 space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B41A]/15">
                    <Icon size={15} className="text-[#F4B41A]" />
                  </div>
                  <span className="text-base font-medium text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <p className="text-[10px] text-blue-300/30 uppercase tracking-widest">
            © {new Date().getFullYear()} BulldogEx — All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#071428] px-5 py-12 sm:px-8 lg:px-12">

        {/* Mobile background */}
        {/* Back link */}
        <div className="absolute left-5 top-5 z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-300/40 transition-colors hover:text-[#F2A900]"
          >
            ← Back to Store
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="relative z-10 mb-8 flex flex-col items-center lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F4B41A]/30 bg-white/5 shadow-[0_0_40px_rgba(244,180,26,0.15)] backdrop-blur-sm mb-3">
            <img src={logo} alt="BulldogEx" className="object-contain h-10 w-10" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#F4B41A]/70">Official Bulldogs Shop</p>
        </div>

        {/* Form Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 px-6 py-8 shadow-2xl shadow-black/40 backdrop-blur-md ring-1 ring-white/5 sm:px-8 sm:py-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;