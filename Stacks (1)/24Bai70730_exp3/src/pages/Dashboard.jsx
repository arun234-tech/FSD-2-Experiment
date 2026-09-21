import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { decodeToken } from '../auth/jwt';
import { request } from '../auth/apiClient';
import TokenBadge from '../components/TokenBadge';

function useCountdown(exp) {
  const [remaining, setRemaining] = useState(() => Math.max(0, exp * 1000 - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, exp * 1000 - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [exp]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function Dashboard() {
  const { token, user } = useAuth();
  const decoded = useMemo(() => (token ? decodeToken(token) : null), [token]);
  const countdown = useCountdown(user?.exp ?? Math.floor(Date.now() / 1000));

  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    request('/api/profile').then((result) => {
      if (!cancelled) setApiResult(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Reading Desk</p>
        <h1 className="page__title">Welcome back, {user?.name}</h1>
        <p className="page__lede">
          Your session is stateless — nothing about &quot;who&apos;s signed in&quot; lives on a
          server. The card below is re-verified on every visit, and again on every request it's
          attached to.
        </p>
      </header>

      <section className="grid grid--2">
        <div className="card">
          <h2 className="card__title">Your membership card</h2>
          <p className="card__hint">
            Decoded right here in the browser to show its three parts. The signature is checked
            again on every request — see the front-desk log alongside it.
          </p>
          <TokenBadge decoded={decoded} />
          <div className="stat-row">
            <div>
              <p className="stat-row__label">Card expires in</p>
              <p className="stat-row__value stat-row__value--mono">{countdown}</p>
            </div>
            <div>
              <p className="stat-row__label">Signed with</p>
              <p className="stat-row__value stat-row__value--mono">{decoded?.header.alg}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="card__title">Front-desk lookup</h2>
          <p className="card__hint">
            Arriving here fired a simulated <code>GET /api/profile</code> call. Your card was
            attached as a bearer token, and a mock front desk verified it before answering.
          </p>
          {apiResult ? (
            <div className={`request-log ${apiResult.ok ? 'request-log--ok' : 'request-log--fail'}`}>
              <p className="request-log__status">
                {apiResult.status} {apiResult.ok ? 'OK' : 'Turned away'}
              </p>
              {apiResult.ok ? (
                <pre className="request-log__body">{JSON.stringify(apiResult.data, null, 2)}</pre>
              ) : (
                <p className="request-log__body">{apiResult.error}</p>
              )}
            </div>
          ) : (
            <p className="card__hint">Checking your card…</p>
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Where this card can take you</h2>
        <p className="card__hint">Your tier decides which rooms you can reach from here.</p>
        <ul className="checklist">
          <li>Reading Room — open to every signed-in member</li>
          <li>Curator Studio — requires Curator or Archivist</li>
          <li>Registry Hall — requires Archivist</li>
        </ul>
      </section>
    </div>
  );
}
