import { CATS } from '../constants';

export default function CategoryBreakdown({ txs }) {
  const catMap = {};
  txs.forEach(t => { catMap[t.cat] = (catMap[t.cat] || 0) + t.amount; });
  const maxC = Math.max(...Object.values(catMap), 1);
  const active = CATS.filter(c => catMap[c.key]);

  if (active.length === 0) {
    return (
      <div style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', padding: '8px 0' }}>
        Nothing logged yet
      </div>
    );
  }

  return (
    <div className="cat-rows">
      {active.map(c => {
        const amt = catMap[c.key] || 0;
        return (
          <div className="cat-row" key={c.key}>
            <div className="cat-dot" style={{ background: c.color }} />
            <div className="cat-name">{c.label}</div>
            <div className="cat-track">
              <div className="cat-fill" style={{ width: `${(amt / maxC) * 100}%`, background: c.color }} />
            </div>
            <div className="cat-amt">£{amt.toFixed(0)}</div>
          </div>
        );
      })}
    </div>
  );
}
