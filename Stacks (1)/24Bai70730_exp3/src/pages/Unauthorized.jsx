import { Link, useLocation } from 'react-router-dom';
import { roleLabel, roleListLabel } from '../auth/roles';

export default function Unauthorized() {
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles;
  const heldRole = location.state?.heldRole;

  const required = requiredRoles ? roleListLabel(requiredRoles) : null;
  const held = heldRole ? roleLabel(heldRole) : null;

  return (
    <div className="page page--centered">
      <div className="card card--narrow">
        <p className="page__eyebrow">403</p>
        <h1 className="page__title">This room is past your tier</h1>
        {required ? (
          <p className="page__lede">
            This room needs {required} clearance{held ? `, but your card is scoped to ${held}` : ''}.
          </p>
        ) : (
          <p className="page__lede">Your tier doesn&apos;t permit access to this room.</p>
        )}
        <Link className="btn btn--primary" to="/dashboard">
          Back to the Reading Desk
        </Link>
      </div>
    </div>
  );
}
