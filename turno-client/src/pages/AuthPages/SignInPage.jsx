import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please fill in all fields.');
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin/products' : from, { replace: true });
    } else {
      setError(result.message);
    }
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F4B41A]/70 mb-2">Welcome back</p>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Log In</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-blue-200/50">
          Access your orders, cart, and profile.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          <span>⚠️</span> {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* ID or email */}
        <div>
          <label htmlFor="signin-email" className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50 block mb-1.5">
            Student/Employee ID or Email
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
            <input
              id="signin-email" name="email" type="text"
              placeholder="ID number or NU email" autoComplete="username"
              required value={form.email} onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#F4B41A]/50 focus:bg-white/8 focus:ring-1 focus:ring-[#F4B41A]/30"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signin-password" className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50 block mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
            <input
              id="signin-password" name="password" type={showPw ? 'text' : 'password'}
              placeholder="Your password" autoComplete="current-password"
              required value={form.password} onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-11 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#F4B41A]/50 focus:bg-white/8 focus:ring-1 focus:ring-[#F4B41A]/30"
            />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/30 hover:text-white/60 transition">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-1 text-xs">
          <label htmlFor="remember-me" className="flex cursor-pointer items-center gap-2 text-blue-200/60">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#F2A900]"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => setError('Please contact the NU campus store support team to reset your password.')}
            className="font-semibold text-[#F2A900] transition hover:text-[#FFC72C]"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#F2A900] py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#00205B] shadow-lg shadow-[#F2A900]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl hover:shadow-[#F2A900]/30 active:scale-95 disabled:opacity-60"
        >
          {loading
            ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0A192F] border-r-transparent" /> Logging in…</>
            : <>Log In <ArrowRight size={14} /></>
          }
        </button>
      </form>

      <div className="mt-6 border-t border-white/5 pt-5 text-center text-sm text-blue-300/50">
        Don&apos;t have an account?{' '}
        <Link to="/auth/signup" className="font-bold text-[#F2A900] transition hover:text-[#FFC72C]">
          Register here
        </Link>
      </div>
    </>
  );
};

export default SignInPage;