export default function BottomNav({ activePage, onNavigate, onOpenSheet }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-tab ${activePage === 'overview' ? 'active' : ''}`}
        onClick={() => onNavigate('overview')}
      >
        <span className="ni">📊</span>
        Overview
      </button>

      <button className="nav-add-btn" onClick={onOpenSheet}>
        <div className="add-circle">+</div>
        <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--sans)', marginTop: 1 }}>Log</span>
      </button>

      <button
        className={`nav-tab ${activePage === 'history' ? 'active' : ''}`}
        onClick={() => onNavigate('history')}
      >
        <span className="ni">📋</span>
        History
      </button>
    </nav>
  );
}
