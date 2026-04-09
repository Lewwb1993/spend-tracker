import { CAT_MAP } from '../constants';
import { fmtDate, fmtMonth } from '../utils';

export default function HistoryPage({ txs, currentMonth, onDelete, onClear }) {
  const handleClear = () => {
    if (window.confirm(`Clear all transactions for ${fmtMonth(currentMonth)}?`)) {
      onClear();
    }
  };

  return (
    <div className="page-content">
      <div className="tx-header">
        <div className="card-label">Transactions</div>
        <button className="btn-clear" onClick={handleClear}>Clear month</button>
      </div>

      <div className="tx-list">
        {txs.length === 0 ? (
          <div className="empty">
            <div className="ei">📋</div>
            No transactions this month.<br />Tap + to add one.
          </div>
        ) : (
          txs.map(t => {
            const cat = CAT_MAP[t.cat] || CAT_MAP['other'];
            return (
              <div className="tx-item" key={t.id}>
                <div className="tx-dot" style={{ background: cat.color }} />
                <div className="tx-body">
                  <div className="tx-desc">{t.desc}</div>
                  <div className="tx-meta">{fmtDate(t.date)} · {cat.icon} {cat.label}</div>
                </div>
                <div className="tx-amt">-£{t.amount.toFixed(2)}</div>
                <button className="tx-del" onClick={() => onDelete(t.id)}>×</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
