// A minimal, spec-shaped JWT implementation (HS256) built on the browser's
// native Web Crypto API.
//
// It exists so the token lifecycle from Experiment 1 — create, store,
// attach, verify, expire — can be observed end-to-end without standing up
// a real backend. The header/payload/signature structure, base64url
// encoding, and HMAC-SHA256 signing here match a real JWT exactly.
//
// Production note: token *creation* and *signing* must happen on a trusted
// server that holds the secret key. Shipping a signing secret to the
// browser (as this lab does, for demo purposes) means anyone can forge a
// token — see the README's "Security notes" section.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlToBytes(value) {
  const padded = value.length % 4 === 0 ? value : value + '='.repeat(4 - (value.length % 4));
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeJson(value) {
  return bytesToBase64Url(encoder.encode(JSON.stringify(value)));
}

function decodeJson(value) {
  return JSON.parse(decoder.decode(base64UrlToBytes(value)));
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * Create and sign a JWT (HS256). Adds standard `iat` (issued-at) and `exp`
 * (expiry) claims on top of whatever custom claims are passed in.
 */
export async function createToken(claims, secret, expiresInSeconds = 900) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = { ...claims, iat: issuedAt, exp: issuedAt + expiresInSeconds };

  const encodedHeader = encodeJson(header);
  const encodedPayload = encodeJson(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await importHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));

  return `${signingInput}.${bytesToBase64Url(new Uint8Array(signatureBuffer))}`;
}

/**
 * Read a token's header and payload without checking the signature.
 * Useful for client-side display — never trust this alone for access
 * decisions, since anyone can craft a token with an arbitrary payload.
 */
export function decodeToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  return {
    header: decodeJson(encodedHeader),
    payload: decodeJson(encodedPayload),
    encodedHeader,
    encodedPayload,
    encodedSignature,
  };
}

/**
 * Verify a token's signature and expiry — this is what a real server does
 * for every incoming request on a protected route.
 */
export async function verifyToken(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'malformed' };
  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  try {
    const key = await importHmacKey(secret);
    const signatureBytes = base64UrlToBytes(encodedSignature);
    const signingInput = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const isAuthentic = await crypto.subtle.verify('HMAC', key, signatureBytes, signingInput);

    if (!isAuthentic) return { valid: false, reason: 'signature' };

    const payload = decodeJson(encodedPayload);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now >= payload.exp) return { valid: false, reason: 'expired', payload };

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: 'error' };
  }
}
