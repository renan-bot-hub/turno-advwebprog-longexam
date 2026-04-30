import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const inputClasses =
  'mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-blue-900 outline-none transition placeholder:text-slate-400 focus:border-blue-900 focus:bg-white focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-1';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] font-bold tracking-[0.2em]';

const SignUpPage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">Sign Up</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create a store account for faster checkout, order updates, and pickup details.
      </p>

      <form className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="text-sm font-bold text-blue-900">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="First name"
              autoComplete="given-name"
              required
              aria-required="true"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="last-name" className="text-sm font-bold text-blue-900">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
              required
              aria-required="true"
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="text-sm font-bold text-blue-900">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="student@email.com"
            autoComplete="email"
            required
            aria-required="true"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="text-sm font-bold text-blue-900">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            required
            aria-required="true"
            className={inputClasses}
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Use a secure password with letters, numbers, and symbols.
          </p>
        </div>

        <Button type="submit" variant="primary" className={actionButtonClassName}>
          Create Account
        </Button>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" className={actionButtonClassName} aria-label="Sign up with Google">
            Google Sign Up
          </Button>
          <Button type="button" variant="secondary" className={actionButtonClassName} aria-label="Sign up with Apple">
            Apple Sign Up
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/auth/signin" className="font-bold text-blue-900 transition hover:text-yellow-500 focus-visible:outline-none focus-visible:underline">
          Log In
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;