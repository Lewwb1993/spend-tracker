import { useState, useEffect, useRef } from 'react';
import { CATS } from '../constants';
import { localDateStr } from '../utils';

export default function AddSheet({ open, onClose, onAdd }) {
  const [amt, setAmt] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('groceries');
  const [date, setDate] = useState(localDateStr(new Date()));
  const [amtError, setAmtError] = useState(false);
  const [descError, setDescError] = useState(false);
  const amtRef = useRef(null);
  const touchStartY = useRef(0);

  // Auto-focus amount when sheet opens, reset form
  useEffect(() => {
    if (open) {
      setAmt('');
      setDesc('');
      setCat('groceries');
      setDate(localDateStr(new Date()));
      setAmtError(false);
      setDescError(false);
      setTimeout(() => amtRef.current?.focus(), 80);
    }
  }, [open]);

  const handleAdd = () => {
    const parsedAmt = parseFloat(amt);
    const trimDesc = desc.trim();

    if (!parsedAmt || parsedAmt <= 0) {
      setAmtError(true);
      amtRef.current?.focus();
      setTimeout(() => setAmtError(false), 900);
      return;
    }
    if (!trimDesc) {
      setDescError(true);
      setTimeout(() => setDescError(false), 900);
      return;
    }

    onAdd({
      id: Date.now(),
      desc: trimDesc,
      amount: parsedAmt,
      cat,
      date: date || localDateStr(new Date()),
    });
    onClose();
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 60) onClose();
  };

  return (
    <>
      <div
        className={`sheet-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />
      <div
        className={`sheet ${open ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="sheet-handle" />
        <div className="sheet-title">Log Spend</div>

        <div className="field">
          <label>Amount £</label>
          <input
            ref={amtRef}
            className="amount-input"
            type="number"
            placeholder="0.00"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amt}
            onChange={e => setAmt(e.target.value)}
            style={amtError ? { borderColor: 'var(--warn)' } : {}}
          />
        </div>

        <div className="field">
          <label>Description</label>
          <input
            type="text"
            placeholder="e.g. Tesco shop"
            autoComplete="off"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={descError ? { borderColor: 'var(--warn)' } : {}}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
        </div>

        <div className="field">
          <label>Category</label>
          <div className="cat-grid">
            {CATS.map(c => (
              <div
                key={c.key}
                className={`cat-chip ${cat === c.key ? 'selected' : ''}`}
                onClick={() => setCat(c.key)}
              >
                <span className="ce">{c.icon}</span>
                <span className="cl">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-log" onClick={handleAdd}>Add Transaction</button>
      </div>
    </>
  );
}
