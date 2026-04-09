import { localDateStr, daysInMonth } from '../utils';

export default function DailyChart({ txs, currentMonth, budget, reservations = {}, onDayTap }) {
  const today = localDateStr(new Date());
  const dim = daysInMonth(currentMonth);
  const dailyAvg = budget / dim;

  const dailyMap = {};
  txs.forEach(t => { dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount; });

  // Scale includes both actual spend values and reservation amounts so bars stay proportional
  const futureReservationVals = Object.entries(reservations)
    .filter(([ds]) => ds > today && ds.startsWith(currentMonth))
    .map(([, amt]) => amt);

  const maxD = Math.max(...Object.values(dailyMap), ...futureReservationVals, 1);

  const days = [];
  for (let d = 1; d <= dim; d++) {
    const ds = `${currentMonth}-${String(d).padStart(2, '0')}`;
    const amt = dailyMap[ds] || 0;
    const isFuture = ds > today;
    const isToday = ds === today;
    const isPinned = isFuture && reservations[ds] != null;
    const resAmt = reservations[ds];

    let bh, col;
    if (isPinned) {
      // Show reservation bar in amber; if somehow there's also spend, use spend height
      const displayAmt = amt > 0 ? amt : resAmt;
      bh = Math.max((displayAmt / maxD) * 62, 3);
      col = '#ffc94a';
    } else if (amt > 0) {
      bh = Math.max((amt / maxD) * 62, 3);
      col = amt > dailyAvg * 1.5 ? '#ff6b4a' : amt > dailyAvg ? '#ffc94a' : '#4fffb0';
    } else {
      bh = 0;
      col = '#4fffb0';
    }

    const tappable = isFuture && onDayTap;

    days.push({ d, ds, bh, col, isToday, isFuture, isPinned, tappable });
  }

  return (
    <div className="daily-grid">
      {days.map(({ d, ds, bh, col, isToday, isFuture, isPinned, tappable }) => (
        <div
          className={`day-col${tappable ? ' day-col--tappable' : ''}`}
          key={d}
          onClick={tappable ? () => onDayTap(ds) : undefined}
        >
          <div className="day-bar-wrap">
            <div
              className={`day-bar${isPinned ? ' day-bar--pinned' : ''}`}
              style={{
                height: bh,
                background: col,
                opacity: isToday ? 1 : isFuture ? 0.55 : 0.65,
              }}
            />
          </div>
          <div className="day-lbl" style={{ color: isToday ? 'var(--accent)' : isPinned ? '#ffc94a' : 'var(--muted)' }}>
            {d}
          </div>
          {isPinned && <div className="day-pin">📌</div>}
        </div>
      ))}
    </div>
  );
}
