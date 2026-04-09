import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import OverviewPage from './components/OverviewPage';
import HistoryPage from './components/HistoryPage';
import AddSheet from './components/AddSheet';
import { useSpendTracker } from './hooks/useSpendTracker';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    budget, setBudget,
    currentMonth, changeMonth,
    txs, addTx, deleteTx, clearMonth,
    reservations, setReservation, clearReservation, clearAllReservations,
  } = useSpendTracker();

  return (
    <>
      <Header currentMonth={currentMonth} onChangeMonth={changeMonth} />

      <div className="pages">
        <div className={`page ${activePage === 'overview' ? 'active' : ''}`}>
          <OverviewPage
            txs={txs}
            budget={budget}
            setBudget={setBudget}
            currentMonth={currentMonth}
            reservations={reservations}
            onSetReservation={setReservation}
            onClearReservation={clearReservation}
            onClearAllReservations={clearAllReservations}
          />
        </div>
        <div className={`page ${activePage === 'history' ? 'active' : ''}`}>
          <HistoryPage
            txs={txs}
            currentMonth={currentMonth}
            onDelete={deleteTx}
            onClear={clearMonth}
          />
        </div>
      </div>

      <BottomNav
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenSheet={() => setSheetOpen(true)}
      />

      <AddSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={addTx}
      />
    </>
  );
}
