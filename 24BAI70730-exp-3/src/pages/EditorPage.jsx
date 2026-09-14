import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const SEED_ENTRIES = [
  { id: 'a-1', title: 'Zero-downtime deploys', body: 'Draft notes on a blue-green rollout.' },
  { id: 'a-2', title: 'Token refresh strategy', body: 'Outline for sliding-expiry refresh tokens.' },
];

const SAVE_DEBOUNCE_MS = 600;

// Drafts are namespaced per signed-in member, so an Archivist and a Curator
// sharing the same browser don't overwrite each other's work.
function draftsKey(username) {
  return `stacks.curator.drafts.${username ?? 'anonymous'}`;
}

function loadDrafts(username) {
  try {
    const raw = localStorage.getItem(draftsKey(username));
    if (!raw) return SEED_ENTRIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ENTRIES;
  } catch {
    // Corrupted or missing storage shouldn't take the whole page down —
    // fall back to the seed rather than crashing on JSON.parse.
    return SEED_ENTRIES;
  }
}

export default function EditorPage() {
  const { user } = useAuth();
  const username = user?.username;

  const [entries, setEntries] = useState(() => loadDrafts(username));
  const [status, setStatus] = useState('saved'); // saved | pending | saving | error
  const [savedAt, setSavedAt] = useState(null);

  const saveTimer = useRef(null);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  const flush = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setStatus('saving');
    try {
      localStorage.setItem(draftsKey(username), JSON.stringify(entriesRef.current));
      setStatus('saved');
      setSavedAt(new Date());
    } catch {
      setStatus('error');
    }
  }, [username]);

  // Debounced autosave — a short pause after typing stops writes to
  // localStorage, rather than on every keystroke.
  useEffect(() => {
    setStatus('pending');
    saveTimer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  // This is the fix for the original draft-saving bug: drafts only ever
  // lived in this component's React state, so navigating to another route,
  // switching tabs, or closing the tab silently discarded anything typed —
  // there was no persistence at all. Flushing immediately on these signals
  // (plus on unmount) means the debounce above is purely a typing-smoother,
  // never the only thing standing between an edit and losing it.
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'hidden') flush();
    }
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
      flush();
    };
  }, [flush]);

  function updateBody(id, body) {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, body } : entry)));
  }

  function addEntry() {
    const id = `a-${entries.length + 1}-${Date.now()}`;
    setEntries((prev) => [...prev, { id, title: 'Untitled draft', body: '' }]);
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const statusCopy = {
    saved: savedAt ? `Saved to this browser · ${savedAt.toLocaleTimeString()}` : 'Saved to this browser',
    pending: 'Unsaved changes…',
    saving: 'Saving…',
    error: "Couldn't save — storage may be full or blocked",
  };

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Curator or Archivist tier</p>
        <h1 className="page__title">Curator Studio</h1>
        <p className="page__lede">
          Curators and Archivists can reach this room — Readers are turned back before this
          component ever renders. Drafts now save automatically to this browser as you type, so
          leaving mid-sentence won&apos;t lose them.
        </p>
      </header>

      <section className="card-list">
        {entries.map((entry) => (
          <article key={entry.id} className="card">
            <div className="card__row">
              <h2 className="card__title">{entry.title}</h2>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => removeEntry(entry.id)}
              >
                Delete
              </button>
            </div>
            <textarea
              className="field__input field__input--textarea"
              value={entry.body}
              onChange={(e) => updateBody(entry.id, e.target.value)}
              rows={3}
              placeholder="Start writing…"
            />
          </article>
        ))}
        <button type="button" className="btn btn--secondary" onClick={addEntry}>
          + Add draft
        </button>
      </section>

      <div className="draft-card__meta">
        <span className={`save-status save-status--${status}`}>
          <span className="save-status__dot" aria-hidden="true" />
          {statusCopy[status]}
        </span>
        <button type="button" className="btn btn--ghost btn--small" onClick={flush}>
          Save now
        </button>
      </div>
    </div>
  );
}
