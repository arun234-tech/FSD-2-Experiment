import { roleLabel, roleLevel } from '../auth/roles';

const DOT_CLASS = {
  Admin: 'role-badge--admin',
  Editor: 'role-badge--editor',
  Viewer: 'role-badge--viewer',
};

export default function RoleBadge({ role, showLevel = true }) {
  const className = DOT_CLASS[role] ?? '';
  const label = roleLabel(role);
  const level = roleLevel(role);

  return (
    <span className={`role-badge ${className}`}>
      <span className="role-badge__dot" aria-hidden="true" />
      {label}
      {showLevel && level ? <span className="role-badge__level">{level}</span> : null}
    </span>
  );
}
