import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-blue-900 outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-1';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] font-bold tracking-[0.2em]';

const SignInPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">Log In</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Access your store account to review orders, saved items, and pickup details.
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="signin-email" className="text-sm font-bold text-blue-900">
            Email Address
          </label>
          <input
            id="signin-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            required
            aria-required="true"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="text-sm font-bold text-blue-900">
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            aria-required="true"
            className={inputClasses}
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-blue-900 focus-visible:ring-2 focus-visible:ring-yellow-400" />
            <span>Remember me</span>
          </label>
          <button type="button" className="font-bold text-blue-700 transition hover:text-blue-900 focus-visible:outline-none focus-visible:underline">
            Forgot Password?
          </button>
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName}>
          Log In
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" className={actionButtonClassName} aria-label="Log in with Google">
            Google Log In
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName} aria-label="Log in with Apple">
            Apple Log In
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
        No account yet?{' '}
        <Link to="/auth/signup" className="font-bold text-blue-900 transition hover:text-yellow-500 focus-visible:outline-none focus-visible:underline">
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignInPage;