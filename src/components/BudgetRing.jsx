const CIRC = 314.16;

export default function BudgetRing({ spent, budget }) {
  const pct = budget > 0 ? Math.min(spent / budget, 1) : 0;
  const rem = budget - spent;
  const stroke = pct > 0.9 ? '#ff6b4a' : pct > 0.7 ? '#ffc94a' : '#4fffb0';
  const offset = CIRC * (1 - pct);

  return (
    <div className="ring-wrap">
      <svg width="116" height="116" viewBox="0 0 116 116" style={{ transform: 'rotate(-90deg)' }}>
        <circle className="ring-track" cx="58" cy="58" r="50" />
        <circle
          className="ring-fill"
          cx="58" cy="58" r="50"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          stroke={stroke}
        />
      </svg>
      <div className="ring-center">
        <div className="ring-val" style={{ color: rem < 0 ? 'var(--warn)' : 'var(--text)' }}>
          £{Math.max(rem, 0).toFixed(0)}
        </div>
        <div className="ring-sub">remaining</div>
      </div>
    </div>
  );
}
