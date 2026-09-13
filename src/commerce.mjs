/* Authoritative pricing.
   The browser computes the same numbers for display (assets/js/site.js — keep in
   sync), but only these are ever charged. The client sends product ids and
   quantities; it never sends an amount, and an amount it did send is ignored. */
import { byId } from "./products.mjs";

export const FREE_SHIP_OVER = 50;
export const STANDARD_SHIPPING = 5.95;
/* Single hardcoded California rate. Real rates vary by city (7.25–10.75%) and by
   wherever else there is nexus — switch this for Stripe Tax before selling at volume. */
export const TAX_RATE_CA = 0.0875;
export const MAX_QTY = 10;
export const CURRENCY = "usd";

export const PROMOS = {
  FIRSTJAR: { type: "pct", value: 15, max: 5 },
  MORNING10: { type: "pct", value: 10 },
  STEEP5: { type: "amt", value: 5 },
  FREESHIP: { type: "ship", value: 0 },
};

const round = (n) => Math.round(n * 100) / 100;
export const cents = (n) => Math.round(n * 100);
export const isCA = (country, zip) => {
  const n = parseInt(String(zip ?? "").slice(0, 3), 10);
  return country === "US" && n >= 900 && n <= 961;
};

/* Throws on anything the catalog does not recognise. An unknown id or a quantity
   outside 1..MAX_QTY is a tampered cart, not a rounding problem — reject it rather
   than clamping, so the shopper sees an error instead of a silently different order. */
export function price({ items, promo, country = "US", zip = "" } = {}) {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Your cart is empty.");
  if (items.length > 20) throw new Error("Too many items in the cart.");

  const lines = items.map((raw) => {
    const p = byId[String(raw?.id)];
    if (!p) throw new Error("That product is no longer available.");
    const qty = Number(raw?.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new Error(`Choose between 1 and ${MAX_QTY} jars.`);
    if (qty > p.stock) throw new Error(`${p.name} is out of stock.`);
    return { id: p.id, sku: p.sku, name: p.name, unit: p.price, qty, total: round(p.price * qty) };
  });

  const subtotal = round(lines.reduce((s, l) => s + l.total, 0));
  const code = String(promo || "").trim().toUpperCase();
  const rule = PROMOS[code];
  let discount = 0;
  if (rule?.type === "pct") discount = round(Math.min(rule.max ?? Infinity, (subtotal * rule.value) / 100));
  if (rule?.type === "amt") discount = Math.min(rule.value, subtotal);

  const afterDiscount = round(subtotal - discount);
  /* Threshold is read off the pre-discount subtotal, matching what the cart drawer
     tells the shopper ("$X away from free shipping"). */
  const shipping = subtotal >= FREE_SHIP_OVER || rule?.type === "ship" ? 0 : STANDARD_SHIPPING;
  const tax = isCA(country, zip) ? round(afterDiscount * TAX_RATE_CA) : 0;
  const total = round(afterDiscount + shipping + tax);
  if (total < 0.5) throw new Error("That total is below the minimum we can charge.");

  return { lines, subtotal, discount, promo: rule ? code : null, shipping, tax, total, amount: cents(total), currency: CURRENCY };
}

/* FE-XXXXXXXX. Unambiguous alphabet: no O/0, I/1, S/5. */
export function orderNumber() {
  const A = "ABCDEFGHJKLMNPQRTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += A[Math.floor(Math.random() * A.length)];
  return `FE-${s}`;
}
