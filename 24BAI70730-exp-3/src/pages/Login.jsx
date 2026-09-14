import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { roleLabel } from '../auth/roles';

// Login credentials are unchanged from the original lab — only the role
// each account carries is now shown under its reader-facing name.
const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'editor', password: 'editor123', role: 'Editor' },
  { username: 'viewer', password: 'viewer123', role: 'Viewer' },
];

export default function Login() {
  const { login, isAuthenticated, sessionNotice } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname ?? '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      const redirectTo = location.state?.from?.pathname ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(account) {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  }

  return (
    <div className="auth-screen">
      <div className="auth-screen__panel">
        <div className="auth-card">
          <div className="auth-card__mark" aria-hidden="true" />
          <p className="auth-card__eyebrow">Reading Room Entrance</p>
          <h1 className="auth-card__title">Sign in to Stacks</h1>
          <p className="auth-card__subtitle">
            Present your credentials and we&apos;ll issue a signed membership card for the
            session.
          </p>

          {sessionNotice ? <div className="banner banner--warning">{sessionNotice}</div> : null}
          {error ? <div className="banner banner--danger">{error}</div> : null}

          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field__label">Username</span>
              <input
                className="field__input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="field__input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
              {submitting ? 'Checking the register…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="demo-card">
          <p className="demo-card__title">Sample memberships</p>
          <p className="demo-card__hint">
            There&apos;s no real front desk behind this — pick a tier to try it.
          </p>
          <ul className="demo-card__list">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.username}>
                <button type="button" className="demo-card__item" onClick={() => fillDemo(account)}>
                  <span>{roleLabel(account.role)}</span>
                  <code>
                    {account.username} / {account.password}
                  </code>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
