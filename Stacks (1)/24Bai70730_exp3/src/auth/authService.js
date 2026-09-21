import { createToken } from './jwt';

// localStorage key the signed token is kept under between page loads.
export const STORAGE_KEY = 'stacks.token';

// Demo-only signing secret. In production this lives only on the server —
// see the README's "Security notes" section.
export const TOKEN_SECRET = 'lab-demo-secret-do-not-use-in-production';

// Session length. Short on purpose so the expiry flow (countdown, auto
// sign-out) is easy to see without waiting around.
export const TOKEN_TTL_SECONDS = 15 * 60;

// Static user directory, standing in for a database, per the experiment's
// "mock-based" scope. Three roles cover the RBAC tiers from Experiment 2.
const MOCK_USERS = [
  { id: 'u-1', username: 'admin', password: 'admin123', name: 'Amara Singh', role: 'Admin' },
  { id: 'u-2', username: 'editor', password: 'editor123', name: 'Devon Cole', role: 'Editor' },
  { id: 'u-3', username: 'viewer', password: 'viewer123', name: 'Priya Nair', role: 'Viewer' },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates credentials against the mock directory and, on success, returns
 * a freshly signed JWT carrying the user's identity and role as claims.
 */
export async function authenticate(username, password) {
  await delay(500); // simulate a network round trip to an auth server

  const user = MOCK_USERS.find((u) => u.username === username.trim().toLowerCase());
  if (!user || user.password !== password) {
    throw new Error('Incorrect username or password.');
  }

  return createToken(
    { sub: user.id, username: user.username, name: user.name, role: user.role },
    TOKEN_SECRET,
    TOKEN_TTL_SECONDS,
  );
}
