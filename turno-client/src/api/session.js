// The login session lives in localStorage when "Remember Me" is checked,
// otherwise in sessionStorage so it ends when the browser tab is closed.
const SESSION_KEYS = ['token', 'user'];

function activeStorage() {
  return localStorage.getItem('token') ? localStorage : sessionStorage;
}

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getStoredUser() {
  try {
    return JSON.parse(activeStorage().getItem('user'));
  } catch {
    return null;
  }
}

export function saveSession({ token, user }, remember = true) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));
}

export function saveUser(user) {
  activeStorage().setItem('user', JSON.stringify(user));
}

export function clearSession() {
  for (const storage of [localStorage, sessionStorage]) {
    SESSION_KEYS.forEach((key) => storage.removeItem(key));
  }
}
