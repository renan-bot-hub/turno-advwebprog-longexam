import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignUpPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { firstName, lastName, email, password } = form;
    if (!firstName || !lastName || !email || !password) return setError('All fields are required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    const result = await register(firstName, lastName, email, password);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.message);
    }
  }

  const inputBase = 'w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#F4B41A]/50 focus:bg-white/8 focus:ring-1 focus:ring-[#F4B41A]/30';

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#F4B41A]">Join the Bulldogs</p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Create Account</h1>
        <p className="mt-2 text-sm leading-relaxed text-blue-200/75">
          Sign up for faster checkout, order updates, and pickup details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
          <span>⚠️</span> {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name row */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-blue-200/70">
              First Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
              <input id="first-name" name="firstName" type="text" placeholder="First name"
                autoComplete="given-name" required value={form.firstName} onChange={handleChange}
                className={`${inputBase} pl-10 pr-4`} />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-blue-200/70">
              Last Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
              <input id="last-name" name="lastName" type="text" placeholder="Last name"
                autoComplete="family-name" required value={form.lastName} onChange={handleChange}
                className={`${inputBase} pl-10 pr-4`} />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-blue-200/70">
            Email Address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
            <input id="signup-email" name="email" type="email" placeholder="student@email.com"
              autoComplete="email" required value={form.email} onChange={handleChange}
              className={`${inputBase} pl-10 pr-4`} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-blue-200/70">
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/30" />
            <input id="signup-password" name="password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
              autoComplete="new-password" required value={form.password} onChange={handleChange}
              className={`${inputBase} pl-10 pr-11`} />
            <button type="button" onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/30 hover:text-white/60 transition">
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {/* Password strength hint */}
          {form.password && (
            <div className="mt-2 flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                  form.password.length >= (i + 1) * 3
                    ? form.password.length >= 10 ? 'bg-emerald-400' : 'bg-[#F4B41A]'
                    : 'bg-white/10'
                }`} />
              ))}
            </div>
          )}
          <p className="mt-1.5 text-[10px] text-blue-200/55">Must be at least 6 characters long</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#F4B41A] py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0A192F] shadow-lg shadow-[#F4B41A]/20 transition-all hover:bg-[#FFC72C] hover:shadow-xl hover:shadow-[#F4B41A]/30 active:scale-95 disabled:opacity-60"
        >
          {loading
            ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0A192F] border-r-transparent" /> Creating Account…</>
            : <>Create Account <ArrowRight size={14} /></>
          }
        </button>
      </form>

      <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-blue-200/65">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-bold text-[#F4B41A] transition hover:text-[#FFC72C]">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;