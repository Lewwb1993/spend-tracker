import { useState, useEffect, useRef } from 'react';
import { fmtDate } from '../utils';

export default function ReservationSheet({ date, existing, remainingBudget, onSave, onClear, onClose }) {
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState('');
  const inputRef = useRef(null);
  const touchStartY = useRef(0);

  const open = !!date;

  useEffect(() => {
    if (open) {
      setInput(existing != null ? String(existing) : '');
      setWarning('');
      setTimeout(() => inputRef.current?.focus(), 80);
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
        <div className="sheet-title">
          📌 Reserve Day
          {date && <div className="res-date-label">{fmtDate(date)}</div>}
        </div>

        <div className="field">
          <label>Amount £</label>
          <input
            ref={inputRef}
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

        {existing != null && (
          <button className="btn-clear-res" onClick={handleClear}>
            Clear reservation
          </button>
        )}
      </div>
    </>
  );
}
