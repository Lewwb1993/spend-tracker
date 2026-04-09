import { useState, useCallback } from 'react';
import {
  loadMeta, saveMeta, getTxs, saveTxs,
  getReservations, saveReservations,
  localMonthStr, txKey, reservationsKey,
} from '../utils';

export function useSpendTracker() {
  const meta = loadMeta();
  const [budget, setBudgetState] = useState(meta.budget);
  const [currentMonth, setCurrentMonth] = useState(meta.month);
  const [txs, setTxs] = useState(() => getTxs(meta.month));
  const [reservations, setReservationsState] = useState(() => getReservations(meta.month));

  const changeMonth = useCallback((dir) => {
    setCurrentMonth(prev => {
      const [y, m] = prev.split('-').map(Number);
      const d = new Date(y, m - 1 + dir, 1);
      const next = localMonthStr(d);
      saveMeta(budget, next);
      setTxs(getTxs(next));
      setReservationsState(getReservations(next));
      return next;
    });
  }, [budget]);

  const setBudget = useCallback((value) => {
    setBudgetState(value);
    saveMeta(value, currentMonth);
  }, [currentMonth]);

  const addTx = useCallback((tx) => {
    setTxs(prev => {
      const next = [tx, ...prev];
      saveTxs(currentMonth, next);
      return next;
    });
  }, [currentMonth]);

  const deleteTx = useCallback((id) => {
    setTxs(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTxs(currentMonth, next);
      return next;
    });
  }, [currentMonth]);

  const clearMonth = useCallback(() => {
    localStorage.removeItem(txKey(currentMonth));
    setTxs([]);
  }, [currentMonth]);

  const setReservation = useCallback((date, amount) => {
    setReservationsState(prev => {
      const next = { ...prev, [date]: amount };
      saveReservations(currentMonth, next);
      return next;
    });
  }, [currentMonth]);

  const clearReservation = useCallback((date) => {
    setReservationsState(prev => {
      const next = { ...prev };
      delete next[date];
      saveReservations(currentMonth, next);
      return next;
    });
  }, [currentMonth]);

  const clearAllReservations = useCallback(() => {
    localStorage.removeItem(reservationsKey(currentMonth));
    setReservationsState({});
  }, [currentMonth]);

  return {
    budget, setBudget,
    currentMonth, changeMonth,
    txs, addTx, deleteTx, clearMonth,
    reservations, setReservation, clearReservation, clearAllReservations,
  };
}
