import { useState, useEffect, useRef } from 'react';
import { fmtDate } from '../utils';

export default function ReservationSheet({ date, existing, remainingBudget, onSave, onClear, onClose }) {
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState('');
  const touchStartY = useRef(0);

  const open = !!date;

  useEffect(() => {
    if (open) {
      setInput(existing != null ? String(existing) : '');
      setWarning('');
      // No auto-focus — keyboard would push Reserve button off-screen
    }
  }, [open, existing]);

  const handleSave = () => {
    const v = parseFloat(input);
    if (!v || v <= 0) return;
    if (v > remainingBudget) {
      setWarning(`Exceeds remaining budget of £${remainingBudget.toFixed(2)}`);
      return;
    }
    onSave(date, v);
    onClose();
  };

  const handleClear = () => {
    onClear(date);
    onClose();
  };

  const handleTouchStart = e => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMove = e => { if (e.touches[0].clientY - touchStartY.current > 60) onClose(); };

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div
        className={`sheet reservation-sheet ${open ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="sheet-handle" />

        <div className="res-sheet-header">
          <div className="sheet-title" style={{ marginBottom: 0 }}>
            📌 Reserve Day
            {date && <div className="res-date-label">{fmtDate(date)}</div>}
          </div>
          {existing != null && (
            <button className="btn-clear-res-inline" onClick={handleClear}>
              × Clear
            </button>
          )}
        </div>

        <div className="field" style={{ marginTop: 20 }}>
          <label>Amount £</label>
          <input
            className="amount-input"
            type="number"
            placeholder="0.00"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={input}
            onChange={e => { setInput(e.target.value); setWarning(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>

        {warning && <div className="res-warning">{warning}</div>}

        <button className="btn-log" onClick={handleSave}>Reserve</button>
      </div>
    </>
  );
}
