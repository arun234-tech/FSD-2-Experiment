import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page--centered">
      <div className="card card--narrow">
        <p className="page__eyebrow">404</p>
        <h1 className="page__title">Nothing filed under that call number</h1>
        <p className="page__lede">Check the address, or head back to a room that exists.</p>
        <Link className="btn btn--primary" to="/dashboard">
          Back to the Reading Desk
        </Link>
      </div>
    </div>
  );
}
