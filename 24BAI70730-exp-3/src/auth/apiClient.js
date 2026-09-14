import { verifyToken } from './jwt';
import { STORAGE_KEY, TOKEN_SECRET } from './authService';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulates calling a protected server endpoint with the JWT attached as a
 * bearer token, and the server verifying it before responding — the
 * "attach token to requests" step from Experiment 1, and the role check
 * from Experiment 2 when `allowedRoles` is supplied.
 */
export async function request(path, { allowedRoles } = {}) {
  await delay(350); // simulate request latency

  // Authorization: Bearer <token> — this is the header a real fetch/axios
  // call would send. We read it back out here to stand in for server-side
  // middleware that would normally do this check.
  const token = localStorage.getItem(STORAGE_KEY);
  if (!token) {
    return { ok: false, status: 401, error: 'No token attached to request.' };
  }

  const result = await verifyToken(token, TOKEN_SECRET);
  if (!result.valid) {
    return { ok: false, status: 401, error: `Token rejected: ${result.reason}.` };
  }

  if (allowedRoles && !allowedRoles.includes(result.payload.role)) {
    return { ok: false, status: 403, error: 'Token is valid but this role lacks permission.' };
  }

  return {
    ok: true,
    status: 200,
    data: { path, requestedBy: result.payload.username, role: result.payload.role },
  };
}
