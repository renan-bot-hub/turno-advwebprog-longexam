import rateLimit from 'express-rate-limit';
import { HttpStatus } from '../config/constants.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const tooMany = (message) => ({ success: false, message });

// Every API request: generous cap that only stops runaway clients
export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany('Too many requests. Please try again later.'),
});

// Login: 20 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany('Too many login attempts. Please try again after 15 minutes.'),
});

// Registration: stops mass account creation
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany('Too many accounts created from this network. Please try again after an hour.'),
});

// Creating orders, reviews, and uploads: stops spam
export const writeLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: tooMany('Too many requests of this kind. Please slow down and try again later.'),
});

/* ── Failed-login lockout ─────────────────────────────────────────────
   Each failed login for the same email + IP adds to a counter.
   5 failures → locked 3 minutes, 8 → 5 minutes, 10 or more → 30 minutes.
   A successful login clears the counter. */
const failedLogins = new Map();

const LOCKOUT_RULES = [
  { attempts: 10, minutes: 30 },
  { attempts: 8, minutes: 5 },
  { attempts: 5, minutes: 3 },
];

function lockoutKey(req) {
  return `${req.ip}:${String(req.body?.email || '').trim().toLowerCase()}`;
}

export function lockoutMinutesFor(attempts) {
  return LOCKOUT_RULES.find((rule) => attempts >= rule.attempts)?.minutes || 0;
}

// Blocks the login request while the account/IP pair is locked
export function loginLockout(req, res, next) {
  const state = failedLogins.get(lockoutKey(req));
  if (state?.lockedUntil > Date.now()) {
    const retryAfter = Math.ceil((state.lockedUntil - Date.now()) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: `Too many failed login attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
      failedAttempts: state.attempts,
      retryAfterSeconds: retryAfter,
    });
  }
  next();
}

export function recordFailedLogin(req) {
  const key = lockoutKey(req);
  const attempts = (failedLogins.get(key)?.attempts || 0) + 1;
  const minutes = lockoutMinutesFor(attempts);
  failedLogins.set(key, { attempts, lockedUntil: minutes ? Date.now() + minutes * 60 * 1000 : 0 });
  return { attempts, lockedMinutes: minutes };
}

export function clearFailedLogins(req) {
  failedLogins.delete(lockoutKey(req));
}

export default apiLimiter;
