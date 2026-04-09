export const CATS = [
  { key: 'groceries',     label: 'Groceries',  icon: '🛒', color: '#4fffb0' },
  { key: 'fuel',          label: 'Fuel',        icon: '⛽', color: '#ffc94a' },
  { key: 'eating_out',    label: 'Eating Out',  icon: '🍔', color: '#ff6b4a' },
  { key: 'shopping',      label: 'Shopping',    icon: '📦', color: '#a78bfa' },
  { key: 'entertainment', label: 'Fun',         icon: '🎮', color: '#38bdf8' },
  { key: 'nicotine',      label: 'Nicotine',    icon: '🚬', color: '#f472b6' },
  { key: 'transport',     label: 'Transport',   icon: '🚌', color: '#34d399' },
  { key: 'kids',          label: 'Kids',        icon: '👶', color: '#fbbf24' },
  { key: 'subscriptions', label: 'Subs',        icon: '📺', color: '#818cf8' },
  { key: 'other',         label: 'Other',       icon: '📌', color: '#6b7394' },
];

export const CAT_MAP = Object.fromEntries(CATS.map(c => [c.key, c]));
