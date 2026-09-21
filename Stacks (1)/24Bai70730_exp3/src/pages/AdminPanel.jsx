import { useState } from 'react';
import RoleBadge from '../components/RoleBadge';
import { ROLE_META } from '../auth/roles';

const INITIAL_MEMBERS = [
  { id: 'u-1', name: 'Amara Singh', username: 'admin', role: 'Admin', status: 'Active' },
  { id: 'u-2', name: 'Devon Cole', username: 'editor', role: 'Editor', status: 'Active' },
  { id: 'u-3', name: 'Priya Nair', username: 'viewer', role: 'Viewer', status: 'Active' },
];

// The <select> below stores and reports the internal role value (Admin /
// Editor / Viewer) even though it displays the reader-facing label — the
// RBAC logic elsewhere in the app only ever sees the former.
const ROLE_OPTIONS = Object.keys(ROLE_META);

export default function AdminPanel() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  function toggleStatus(id) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'Active' ? 'Suspended' : 'Active' } : m)),
    );
  }

  function changeRole(id, role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Archivist tier</p>
        <h1 className="page__title">Registry Hall</h1>
        <p className="page__lede">
          Only Archivists can reach this room. Changes here live in local state and reset on
          reload — this room isn&apos;t wired to the draft-persistence fix in Curator Studio.
        </p>
      </header>

      <section className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Member</th>
              <th>Tier</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>
                  <code>{m.username}</code>
                </td>
                <td>
                  <select
                    className="field__input field__input--compact"
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_META[role].label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <RoleBadge role={m.role} showLevel={false} />
                  <span className={`status-pill status-pill--${m.status.toLowerCase()}`}>{m.status}</span>
                </td>
                <td>
                  <button type="button" className="btn btn--ghost btn--small" onClick={() => toggleStatus(m.id)}>
                    {m.status === 'Active' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
