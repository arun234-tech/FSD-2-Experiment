# Stacks — JWT Authentication & RBAC Lab

A single React app that implements **Experiment 1** (JWT-based authentication)
and **Experiment 2** (role-based access control) together, as one connected
system: signing in produces a signed token, and that token's `role` claim is
what the router checks on every subsequent page.

This is a reskin of the original "Clearance" lab — same auth flow, same
route guards, same token lifecycle — restyled as a members' archive, with
its roles renamed to match, and with the Editor page's draft-saving bug
fixed. See **"What changed in this pass"** below for specifics.

There is no backend server. A mock auth service and a mock API client stand
in for one, so the full token lifecycle — create, store, attach, verify,
expire — can be observed entirely in the browser, per both experiments'
"mock-based" software requirements.

---

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

> **First run:** this project uses `react-router-dom`, which your existing
> `node_modules` won't have yet — `npm install` picks it up.

### Demo accounts

Login credentials are unchanged from the original lab. Only the tier name
shown after signing in has changed.

| Username | Password   | Tier shown in the UI | Internal role value |
|----------|-----------|-----------------------|----------------------|
| `admin`  | admin123  | Archivist             | `Admin`              |
| `editor` | editor123 | Curator                | `Editor`             |
| `viewer` | viewer123 | Reader                 | `Viewer`             |

The login screen also has one-click buttons for each of these.

---

## What changed in this pass

**Visual remake.** New palette, type pairing (Fraunces / Public Sans / IBM
Plex Mono), and a members'-archive visual language throughout — the navbar,
buttons, cards, forms, and the JWT display are all restyled. The design
system lives in `src/index.css`; the component-level class names (`.card`,
`.btn`, `.navbar`, etc.) were kept stable so the styling could change
without needing to touch every page's markup.

**Roles renamed.** `Admin` / `Editor` / `Viewer` are now shown as
**Archivist** / **Curator** / **Reader**. This is a *display-only* rename —
`src/auth/roles.js` maps the internal role values to their new labels, and
every route guard, `allowedRoles` check, and JWT `role` claim still uses
`Admin` / `Editor` / `Viewer` exactly as before. Access-control behavior is
unchanged; only what's printed on screen changed.

**Pages renamed to match:**

| Route        | Old name       | New name         |
|--------------|----------------|-------------------|
| `/dashboard` | Dashboard      | Reading Desk      |
| `/viewer`    | Viewer Area    | Reading Room      |
| `/editor`    | Editor Tools   | Curator Studio    |
| `/admin`     | Admin Panel    | Registry Hall     |

**Draft-saving bug fixed.** The Editor page (`src/pages/EditorPage.jsx`,
now "Curator Studio") used to keep every draft purely in React state —
`useState` with no persistence anywhere. Navigating to another route,
refreshing, or closing the tab silently discarded anything typed, with no
warning that it hadn't been saved.

It now:
- Autosaves drafts to `localStorage`, debounced ~600ms after typing stops,
  under a key namespaced to the signed-in member (`stacks.curator.drafts.<username>`)
  so different accounts on the same browser don't overwrite each other.
- Flushes immediately (bypassing the debounce) when the tab is hidden, the
  page is about to unload, or the component unmounts — so switching tabs or
  routes mid-sentence no longer loses the last few keystrokes.
- Shows a visible save-status indicator ("Saving…" / "Saved to this browser
  · 3:41 PM" / "Unsaved changes…") plus a manual **Save now** button, so
  it's never ambiguous whether an edit stuck.
- Falls back gracefully (rather than crashing) if `localStorage` is
  unavailable or its contents are corrupted.

Reloading Curator Studio, or signing out and back in as the same member,
now restores exactly what was there before.

---

## Experiment 1 — JWT Authentication

**Aim:** design and implement a secure authentication system using JWT for
user login and session management.

**Conceptual flow → where it lives:**

| Step | Implementation |
|---|---|
| User logs in with credentials | `src/pages/Login.jsx` |
| Server validates user | `src/auth/authService.js` → `authenticate()` |
| JWT token is generated | `src/auth/jwt.js` → `createToken()` (HS256, real HMAC-SHA256 via the browser's Web Crypto API) |
| Token is stored on client | `src/auth/AuthContext.jsx` → `localStorage`, key `stacks.token` |
| Token is sent with each request | `src/auth/apiClient.js` → `request()`, invoked from `Dashboard.jsx` |

A JWT's three parts are rendered visually on the Reading Desk as a
membership card:

- **Header** — `{ alg: "HS256", typ: "JWT" }`
- **Payload** — the claims: `sub`, `username`, `name`, `role`, `iat`, `exp`
- **Signature** — HMAC-SHA256 over the header and payload, proving the token
  wasn't tampered with

Sessions are stateless: nothing about "who's logged in" is stored on a
server. Every check re-verifies the token that's already sitting in
`localStorage` — that's what `AuthContext` does on page load, and what
`apiClient.request()` does before returning mock data. Tokens expire 15
minutes after issue (`TOKEN_TTL_SECONDS` in `authService.js`); the Reading
Desk shows a live countdown, and expiry triggers an automatic sign-out with
a "session expired" notice on the login screen.

---

## Experiment 2 — Role-Based Access Control

**Aim:** implement role-based access control and secure application routes
based on user permissions.

**Roles:** `Admin`, `Editor`, `Viewer` — carried as the `role` claim inside
the JWT issued in Experiment 1, so authorization is built directly on top of
authentication rather than as a separate system. Shown in the UI as
Archivist / Curator / Reader (see `src/auth/roles.js`).

**Implementation → where it lives:**

| Requirement | Implementation |
|---|---|
| Define user roles | `src/auth/authService.js` → `MOCK_USERS` |
| Store role in auth state | `role` claim inside the JWT payload, read via `AuthContext` |
| Protect routes with React Router | `src/components/ProtectedRoute.jsx` (must be signed in) and `src/components/RoleBasedRoute.jsx` (must hold an allowed role), composed in `src/App.jsx` |
| Restrict access by role | `/admin` → Admin only · `/editor` → Editor or Admin · `/viewer` and `/dashboard` → any signed-in role |
| Conditionally render UI | `src/components/Navbar.jsx` filters nav links by role before rendering them |
| Redirect unauthorized users | `RoleBasedRoute` redirects to `/unauthorized`, which explains what tier was required |

---

## Project structure

```
src/
  auth/
    jwt.js            create/decode/verify a JWT (HS256, Web Crypto)
    authService.js     mock user directory + login
    apiClient.js        simulated protected API call
    AuthContext.jsx      session state, login/logout, expiry timer
    roles.js             internal role value -> display label map
  components/
    ProtectedRoute.jsx    auth guard
    RoleBasedRoute.jsx    role guard
    Layout.jsx            navbar + page outlet
    Navbar.jsx             role-aware navigation
    RoleBadge.jsx           tier pill
    TokenBadge.jsx           membership-card visual (decoded JWT)
  pages/
    Login.jsx, Dashboard.jsx, ViewerPage.jsx, EditorPage.jsx,
    AdminPanel.jsx, Unauthorized.jsx, NotFound.jsx
  App.jsx    route table
  main.jsx    entry point
  index.css   design system
```

## Security notes (read before reusing this anywhere real)

This lab intentionally simplifies things that a production system must not:

- **The signing secret lives in frontend code** (`TOKEN_SECRET` in
  `authService.js`). In a real system, only the server ever sees the secret —
  if the browser can sign tokens, so can an attacker.
- **Tokens sit in `localStorage`**, which is readable by any script on the
  page (an XSS risk). Production systems typically use an `httpOnly`,
  `Secure` cookie instead, so client-side JavaScript can't read the token at
  all. The same caveat applies to the drafts introduced in this pass — they
  sit in `localStorage` too, unencrypted.
- **Passwords are plaintext in a JS array.** A real backend hashes passwords
  (e.g. bcrypt/argon2) and never compares them directly.
- **No refresh tokens.** Real systems pair a short-lived access token with a
  longer-lived refresh token so users aren't fully logged out every 15
  minutes.

None of this blocks the lab's learning goals — the token structure, signing,
verification, storage, and role-based routing all behave exactly as they
would with a real server behind them.
