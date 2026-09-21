import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import RoleBadge from './RoleBadge';

// Each link declares which internal role values may see it — this is the
// "dynamically render UI based on permissions" piece from Experiment 2.
// Labels are the reader-facing names; access is still decided by the
// Admin/Editor/Viewer values underneath.
const NAV_LINKS = [
  { to: '/dashboard', label: 'Reading Desk', roles: ['Admin', 'Editor', 'Viewer'] },
  { to: '/viewer', label: 'Reading Room', roles: ['Admin', 'Editor', 'Viewer'] },
  { to: '/editor', label: 'Curator Studio', roles: ['Admin', 'Editor'] },
  { to: '/admin', label: 'Registry Hall', roles: ['Admin'] },
];

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        <span className="navbar__wordmark">Stacks</span>
      </div>

      <nav className="navbar__links" aria-label="Primary">
        {NAV_LINKS.filter((link) => hasRole(link.roles)).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__user">
        {user ? (
          <>
            <div className="navbar__identity">
              <span className="navbar__identity-name">{user.name}</span>
              <RoleBadge role={user.role} showLevel={false} />
            </div>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
