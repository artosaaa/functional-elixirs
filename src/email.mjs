/* Transactional email through Resend — one fetch, no SDK.
   EMAIL_FROM must be on a domain verified in Resend (SPF + DKIM), otherwise every
   send is rejected. ORDERS_EMAIL is where the shop's own copy of an order goes. */
const API = "https://api.resend.com/emails";

export async function sendEmail({ to, subject, html, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  if (!from) throw new Error("EMAIL_FROM is not set");

  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data?.message || `Resend responded ${res.status}`), { status: res.status });
  return data;
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = (n) => `$${Number(n).toFixed(2)}`;

/* Plain, table-based HTML on purpose: email clients are not browsers, and a receipt
   that renders everywhere beats one that looks like the site in two of them. */
function receiptHTML({ order, lines, totals, address }) {
  const row = (label, value, strong = false) =>
    `<tr><td style="padding:6px 0;color:#5b5346">${esc(label)}</td><td align="right" style="padding:6px 0;${strong ? "font-weight:700;" : ""}color:#2b2620">${esc(value)}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#faf7f1;font-family:Georgia,'Times New Roman',serif;color:#2b2620">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f1;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #e8e0d2;border-radius:4px">
  <tr><td style="padding:32px 32px 8px">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9a8f7c">Functional Elixirs</p>
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:400">Thank you — your order is confirmed.</h1>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#5b5346">Order <strong style="color:#2b2620">${esc(order)}</strong>. We pack by hand, so give us a little time; you'll get a shipping note with tracking when it leaves.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
      ${lines.map((l) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f0ebe0">${esc(l.name)}${l.qty > 1 ? ` &times; ${l.qty}` : ""}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #f0ebe0">${money(l.total)}</td></tr>`).join("")}
    </table>
  </td></tr>
  <tr><td style="padding:12px 32px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
      ${row("Subtotal", money(totals.subtotal))}
      ${totals.discount ? row(totals.promo || "Discount", `-${money(totals.discount)}`) : ""}
      ${row("Shipping", totals.shipping ? money(totals.shipping) : "Free")}
      ${totals.tax ? row("Tax", money(totals.tax)) : ""}
      ${row("Total", money(totals.total), true)}
    </table>
  </td></tr>
  ${address ? `<tr><td style="padding:24px 32px 0"><p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9a8f7c">Shipping to</p><p style="margin:0;font-size:15px;line-height:1.6;color:#5b5346">${esc(address).replace(/\n/g, "<br>")}</p></td></tr>` : ""}
  <tr><td style="padding:24px 32px 32px">
    <p style="margin:0;font-size:13px;line-height:1.7;color:#9a8f7c">An unopened jar can be returned any time for a full refund; you arrange and pay the return postage. Questions? Just reply to this email.</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

const receiptText = ({ order, lines, totals, address }) =>
  [
    `Thank you — your order is confirmed.`,
    ``,
    `Order ${order}`,
    ``,
    ...lines.map((l) => `${l.name}${l.qty > 1 ? ` x${l.qty}` : ""}  ${money(l.total)}`),
    ``,
    `Subtotal  ${money(totals.subtotal)}`,
    ...(totals.discount ? [`${totals.promo || "Discount"}  -${money(totals.discount)}`] : []),
    `Shipping  ${totals.shipping ? money(totals.shipping) : "Free"}`,
    ...(totals.tax ? [`Tax  ${money(totals.tax)}`] : []),
    `Total  ${money(totals.total)}`,
    ...(address ? [``, `Shipping to:`, address] : []),
    ``,
    `We pack by hand — you'll get tracking when it ships.`,
    `An unopened jar can be returned any time for a full refund; you pay the return postage.`,
  ].join("\n");

export function orderEmails({ order, lines, totals, address, email, name }) {
  return {
    customer: {
      to: email,
      subject: `Your Functional Elixirs order ${order}`,
      html: receiptHTML({ order, lines, totals, address }),
      text: receiptText({ order, lines, totals, address }),
    },
    shop: {
      to: process.env.ORDERS_EMAIL,
      replyTo: email,
      subject: `New order ${order} — ${money(totals.total)}`,
      html: `<p><strong>${esc(name || "Customer")}</strong> (${esc(email)}) ordered:</p>
<ul>${lines.map((l) => `<li>${esc(l.name)} &times; ${l.qty} — ${money(l.total)}</li>`).join("")}</ul>
<p>Total <strong>${money(totals.total)}</strong>${totals.promo ? ` (promo ${esc(totals.promo)})` : ""}</p>
${address ? `<p><strong>Ship to</strong><br>${esc(address).replace(/\n/g, "<br>")}</p>` : ""}`,
      text: `${name || "Customer"} (${email}) ordered ${lines.map((l) => `${l.name} x${l.qty}`).join(", ")} — ${money(totals.total)}\n\n${address || ""}`,
    },
  };
}
