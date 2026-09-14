const ENTRIES = [
  { id: 'a-1', title: 'Zero-downtime deploys', body: 'Published notes on a blue-green rollout.' },
  { id: 'a-2', title: 'Token refresh strategy', body: 'Published outline for sliding-expiry refresh tokens.' },
];

export default function ViewerPage() {
  return (
    <div className="page">
      <header className="page__header">
        <p className="page__eyebrow">Open to every tier</p>
        <h1 className="page__title">Reading Room</h1>
        <p className="page__lede">
          Published entries, open to Readers, Curators, and Archivists alike — read-only for
          everyone.
        </p>
      </header>

      <section className="card-list">
        {ENTRIES.map((entry) => (
          <article key={entry.id} className="card">
            <h2 className="card__title">{entry.title}</h2>
            <p className="card__hint">{entry.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
