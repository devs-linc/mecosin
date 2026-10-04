import products from '../data/products.json' with { type: 'json' };
export const CART_KEY = 'mecosin-demo-cart-v1';
const ids = new Set(products.map(p => p.slug));
// ponytail: one fixed illustrative unit price; replace only with an approved price service.
export const price = id => ids.has(id) ? 25000 : 0;
export function cleanCart(raw) {
  try {
    const rows = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(rows)) return [];
    const items = new Map();
    for (const row of rows.slice(0, 1000)) {
      if (!row || !ids.has(row.id) || !Number.isSafeInteger(row.qty) || row.qty < 1) continue;
      items.set(row.id, Math.min(99, (items.get(row.id) || 0) + row.qty));
    }
    return [...items].map(([id, qty]) => ({id, qty}));
  } catch { return []; }
}
export function totals(rows, promo = false) {
  const cart = cleanCart(rows);
  const subtotal = cart.reduce((sum, row) => sum + price(row.id) * row.qty, 0);
  const count = cart.reduce((sum, row) => sum + row.qty, 0);
  const discount = promo ? Math.floor(subtotal / 10) : 0;
  const shipping = count ? 10000 : 0;
  const tax = 0;
  return {subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax, count};
}
