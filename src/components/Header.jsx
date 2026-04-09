import { fmtMonth } from '../utils';

export default function Header({ currentMonth, onChangeMonth }) {
  return (
    <header>
      <div className="logo">LEWIS // <b>TRACKER</b></div>
      <div className="month-nav">
        <button className="mnav-btn" onClick={() => onChangeMonth(-1)}>‹</button>
        <div className="month-label">{fmtMonth(currentMonth)}</div>
        <button className="mnav-btn" onClick={() => onChangeMonth(1)}>›</button>
      </div>
    </header>
  );
}
