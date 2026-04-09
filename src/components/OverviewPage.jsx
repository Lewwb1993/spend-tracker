import { useState } from 'react';
import BudgetRing from './BudgetRing';
import DailyChart from './DailyChart';
import CategoryBreakdown from './CategoryBreakdown';
import ReservationSheet from './ReservationSheet';
import { localDateStr, localMonthStr, daysInMonth } from '../utils';

export default function OverviewPage({
  txs, budget, setBudget, currentMonth,
  reservations, onSetReservation, onClearReservation, onClearAllReservations,
}) {
  const [budgetInput, setBudgetInput] = useState('');
  const [tappedDay, setTappedDay] = useState(null); // date string or null

  const total = txs.reduce((s, t) => s + t.amount, 0);
  const rem = budget - total;
  const pct = budget > 0 ? Math.min(total / budget, 1) : 0;
  const today = localDateStr(new Date());
  const thisMonth = localMonthStr(new Date());
  const dim = daysInMonth(currentMonth);

  const todayAmt = txs.filter(t => t.date === today).reduce((s, t) => s + t.amount, 0);

  // Sum of reservations for strictly future days only (past pinned days auto-release)
  const futurePinnedEntries = Object.entries(reservations).filter(
    ([ds]) => ds > today && ds.startsWith(currentMonth)
  );
  const sumFutureReservations = futurePinnedEntries.reduce((s, [, amt]) => s + amt, 0);
  const futurePinnedCount = futurePinnedEntries.length;

  let dailyStatVal, dailyStatLbl, todayLabel, todayVal;
  if (currentMonth === thisMonth) {
    const dom = new Date().getDate();
    const daysLeft = Math.max(dim - dom + 1, 1); // today + future days
    const unpinnedDaysLeft = Math.max(daysLeft - futurePinnedCount, 1);
    const adjustedRemaining = rem - sumFutureReservations;
    dailyStatVal = adjustedRemaining > 0 ? `£${(adjustedRemaining / unpinnedDaysLeft).toFixed(0)}` : '£0';
    dailyStatLbl = 'daily left';
    todayVal = `£${todayAmt.toFixed(0)}`;
    todayLabel = 'today';
  } else if (currentMonth < thisMonth) {
    const daysWithSpend = Object.keys(
      txs.reduce((acc, t) => { acc[t.date] = 1; return acc; }, {})
    ).length;
    const avg = daysWithSpend > 0 ? total / daysWithSpend : 0;
    dailyStatVal = `£${avg.toFixed(0)}`;
    dailyStatLbl = 'avg/day';
    todayVal = `£${total.toFixed(0)}`;
    todayLabel = 'total';
  } else {
    dailyStatVal = `£${(budget / dim).toFixed(0)}`;
    dailyStatLbl = 'daily budget';
    todayVal = `£${total.toFixed(0)}`;
    todayLabel = 'total';
  }

  const handleSetBudget = () => {
    const v = parseFloat(budgetInput);
    if (v && v > 0) {
      setBudget(v);
      setBudgetInput('');
    }
  };

  const handleClearAllReservations = () => {
    if (window.confirm('Clear all reservations for this month?')) {
      onClearAllReservations();
    }
  };

  const showWarn = pct >= 0.8;
  const warnText = rem < 0
    ? `⚠ Over budget by £${Math.abs(rem).toFixed(2)}`
    : `⚠ ${Math.round(pct * 100)}% used — £${rem.toFixed(2)} left`;

  // Only allow tapping future days in the current month
  const canReserve = currentMonth === thisMonth;

  const hasReservations = Object.keys(reservations).length > 0;

  return (
    <div className="page-content">
      <div className="card">
        <div className="hero-row">
          <BudgetRing spent={total} budget={budget} />
          <div className="hero-stats">
            <div className="hstat">
              <div className="hstat-val">£{total.toFixed(0)}</div>
              <div className="hstat-lbl">spent</div>
            </div>
            <div className="hstat">
              <div className="hstat-val">£{budget.toFixed(0)}</div>
              <div className="hstat-lbl">budget</div>
            </div>
            <div className="hstat">
              <div className="hstat-val">{todayVal}</div>
              <div className="hstat-lbl">{todayLabel}</div>
            </div>
            <div className="hstat">
              <div className="hstat-val">{dailyStatVal}</div>
              <div className="hstat-lbl">{dailyStatLbl}</div>
            </div>
          </div>
        </div>

        <div className="budget-row">
          <input
            type="number"
            placeholder="Set budget £"
            inputMode="decimal"
            value={budgetInput}
            onChange={e => setBudgetInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSetBudget()}
          />
          <button className="btn-set" onClick={handleSetBudget}>SET</button>
        </div>

        {showWarn && (
          <div className="warn-banner show">{warnText}</div>
        )}
      </div>

      <div className="card">
        <div className="chart-header">
          <div className="card-label" style={{ marginBottom: 0 }}>This Month — Daily</div>
          {hasReservations && (
            <button className="btn-clear-all-res" onClick={handleClearAllReservations}>
              Clear reservations
            </button>
          )}
        </div>
        <div style={{ marginTop: 14 }}>
          <DailyChart
            txs={txs}
            currentMonth={currentMonth}
            budget={budget}
            reservations={reservations}
            onDayTap={canReserve ? setTappedDay : undefined}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-label">By Category</div>
        <CategoryBreakdown txs={txs} />
      </div>

      <ReservationSheet
        date={tappedDay}
        existing={tappedDay ? reservations[tappedDay] : undefined}
        remainingBudget={rem}
        onSave={onSetReservation}
        onClear={onClearReservation}
        onClose={() => setTappedDay(null)}
      />
    </div>
  );
}
