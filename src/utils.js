export function localMonthStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function localDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fmtMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export function fmtDate(ds) {
  return new Date(ds + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function daysInMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

const META_KEY = 'spt_meta';
export const txKey = m => `spt_tx_${m}`;
export const reservationsKey = m => `spt_reservations_${m}`;

export function getReservations(month) {
  try {
    return JSON.parse(localStorage.getItem(reservationsKey(month)) || '{}');
  } catch {
    return {};
  }
}

export function saveReservations(month, reservations) {
  localStorage.setItem(reservationsKey(month), JSON.stringify(reservations));
}

export function loadMeta() {
  try {
    const d = JSON.parse(localStorage.getItem(META_KEY) || '{}');
    return {
      budget: d.budget || 1000,
      month: d.month || localMonthStr(new Date()),
    };
  } catch {
    return { budget: 1000, month: localMonthStr(new Date()) };
  }
}

export function saveMeta(budget, month) {
  localStorage.setItem(META_KEY, JSON.stringify({ budget, month }));
}

export function getTxs(month) {
  try {
    return JSON.parse(localStorage.getItem(txKey(month)) || '[]');
  } catch {
    return [];
  }
}

export function saveTxs(month, txs) {
  localStorage.setItem(txKey(month), JSON.stringify(txs));
}
