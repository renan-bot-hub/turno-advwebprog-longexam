import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-slate-50 text-blue-900 font-['Outfit']">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        
        <div className="relative flex items-center justify-center overflow-hidden border-b-4 border-yellow-400 bg-blue-900 p-8 sm:p-10 lg:border-b-0 lg:border-r-4 lg:p-16">
          
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/20 blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]"></div>

          <div className="relative flex w-full max-w-md flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-yellow-400/50 bg-blue-800/40 p-10 text-center shadow-2xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-yellow-400">
            
            <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-400 bg-white shadow-[0_0_40px_rgba(250,204,21,0.2)]">
              <img src={logo} alt="BulldogEx Logo" className="h-20 w-20 object-contain" />
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              BulldogEx <span className="text-yellow-400">Shop</span>
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-blue-200">
              Your central hub for campus uniforms, study essentials, and university merch. Log in to track your orders and fast-track your pickup.
            </p>

          </div>
        </div>

        <main className="relative flex items-center bg-white px-6 py-10 sm:px-10 lg:px-16">
          
          <div className="absolute left-6 top-8 sm:left-10 lg:left-16">
            <Link 
              to="/" 
              className="inline-flex items-center rounded-md text-xs font-extrabold uppercase tracking-widest text-slate-400 transition-colors hover:text-yellow-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              &larr; Back to Store
            </Link>
          </div>

          <div className="mx-auto mt-12 w-full max-w-md lg:mt-0">
            <Outlet />
          </div>
          
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;