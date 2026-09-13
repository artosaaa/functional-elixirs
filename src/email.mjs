/* Transactional email through Resend — one fetch, no SDK.
   EMAIL_FROM must be on a domain verified in Resend (SPF + DKIM), otherwise every
   send is rejected. ORDERS_EMAIL is where the shop's own copy of an order goes. */
import { BRAND, SITE_URL } from "./site.mjs";

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
const nl2br = (s) => esc(s).replace(/\n/g, "<br>");

/* Email is not the web. No external stylesheets, no web fonts, no flexbox, no
   background-image — Outlook renders with Word's engine and silently drops most of
   it. So: tables, inline styles, web-safe fonts, and the striped masthead built
   from real table cells rather than a gradient. */
const INK = "#2b2620", MUTE = "#8a8073", LINE = "#e8e0d2", GOLD = "#7E6011", STRIPE = "#E9C84B", PAPER = "#faf7f1";
const SERIF = "Georgia, 'Times New Roman', Times, serif";

/* The label's yellow stripe, the one thing that makes a Functional Elixirs
   surface recognisable at a glance. Eight cells, alternating. */
const stripes = () =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr>${
    Array.from({ length: 12 }, (_, i) => `<td width="8.33%" height="8" style="width:8.33%;height:8px;line-height:8px;font-size:0;background:${i % 2 ? "#ffffff" : STRIPE}">&nbsp;</td>`).join("")
  }</tr></table>`;

const masthead = () => `${stripes()}
  <tr><td align="center" style="padding:30px 32px 4px">
    <div style="font:400 21px/1.1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${INK}">${esc(BRAND.name)}</div>
    <div style="font:400 10px/1.6 ${SERIF};letter-spacing:.3em;text-transform:uppercase;color:${GOLD};margin-top:7px">Honey + Fresh Ginger</div>
  </td></tr>`;

const shell = (inner) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"></head>
<body style="margin:0;padding:0;background:${PAPER};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER}">
<tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:3px">
    ${inner}
  </table>
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
    <tr><td align="center" style="padding:20px 24px 8px;font:400 12px/1.7 ${SERIF};color:${MUTE}">
      <a href="${SITE_URL}" style="color:${MUTE};text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}</a>
      &nbsp;·&nbsp; <a href="mailto:${BRAND.email}" style="color:${MUTE};text-decoration:none">${BRAND.email}</a><br>
      ${esc(BRAND.legal)} &nbsp;·&nbsp; ${esc(BRAND.hours)}
    </td></tr>
  </table>
</td></tr></table></body></html>`;

const totalsRows = (t) => {
  const row = (label, value, opts = {}) =>
    `<tr><td style="padding:7px 0;font:400 15px/1.4 ${SERIF};color:${opts.strong ? INK : "#5b5346"}">${esc(label)}</td>
         <td align="right" style="padding:7px 0;font:${opts.strong ? "700" : "400"} ${opts.strong ? "17px" : "15px"}/1.4 ${SERIF};color:${INK}">${esc(value)}</td></tr>`;
  return `${row("Subtotal", money(t.subtotal))}
    ${t.discount ? row(t.promo || "Discount", `−${money(t.discount)}`) : ""}
    ${row("Shipping", t.shipping ? money(t.shipping) : "Free")}
    ${t.tax ? row("Tax", money(t.tax)) : ""}
    <tr><td colspan="2" style="padding:6px 0 0"><div style="border-top:1px solid ${LINE};font-size:0;line-height:0">&nbsp;</div></td></tr>
    ${row("Total", money(t.total), { strong: true })}`;
};

function receiptHTML({ order, lines, totals, address }) {
  return shell(`${masthead()}
  <tr><td align="center" style="padding:18px 32px 0">
    <h1 style="margin:0;font:400 27px/1.25 ${SERIF};color:${INK}">Thank you — your order is confirmed.</h1>
  </td></tr>
  <tr><td align="center" style="padding:16px 32px 0">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border:1px solid ${LINE};border-radius:2px;padding:9px 18px;font:400 12px/1 ${SERIF};letter-spacing:.16em;color:${GOLD}">${esc(order)}</td></tr></table>
  </td></tr>
  <tr><td align="center" style="padding:18px 40px 0;font:400 15px/1.65 ${SERIF};color:#5b5346">
    We pack every jar by hand, so give us a little time. You'll get a note with tracking the moment it leaves.
  </td></tr>

  <tr><td style="padding:26px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding-bottom:10px">Your order</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${lines.map((l) => `<tr>
        <td style="padding:11px 0;border-top:1px solid ${LINE};font:400 15px/1.4 ${SERIF};color:${INK}">${esc(l.name)}${l.qty > 1 ? `<span style="color:${MUTE}"> &times; ${l.qty}</span>` : ""}</td>
        <td align="right" style="padding:11px 0;border-top:1px solid ${LINE};font:400 15px/1.4 ${SERIF};color:${INK}">${money(l.total)}</td></tr>`).join("")}
    </table>
  </td></tr>
  <tr><td style="padding:14px 32px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${totalsRows(totals)}</table>
  </td></tr>

  ${address ? `<tr><td style="padding:26px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding-bottom:9px">Shipping to</div>
    <div style="font:400 15px/1.65 ${SERIF};color:#5b5346">${nl2br(address)}</div>
  </td></tr>` : ""}

  <tr><td style="padding:26px 32px 30px">
    <div style="border-top:1px solid ${LINE};padding-top:18px;font:400 13px/1.75 ${SERIF};color:${MUTE}">
      An unopened jar can be returned any time for a full refund — you arrange and pay the return postage. Opened jars can't be returned; honey is food.<br><br>
      Questions about this order? Just reply to this email and a person will answer.
    </div>
  </td></tr>`);
}

const receiptText = ({ order, lines, totals, address }) =>
  [
    `${BRAND.name} — Honey + Fresh Ginger`,
    ``,
    `Thank you — your order is confirmed.`,
    `Order ${order}`,
    ``,
    `YOUR ORDER`,
    ...lines.map((l) => `  ${l.name}${l.qty > 1 ? ` x${l.qty}` : ""}  ${money(l.total)}`),
    ``,
    `  Subtotal  ${money(totals.subtotal)}`,
    ...(totals.discount ? [`  ${totals.promo || "Discount"}  -${money(totals.discount)}`] : []),
    `  Shipping  ${totals.shipping ? money(totals.shipping) : "Free"}`,
    ...(totals.tax ? [`  Tax  ${money(totals.tax)}`] : []),
    `  TOTAL  ${money(totals.total)}`,
    ...(address ? [``, `SHIPPING TO`, ...address.split("\n").map((l) => `  ${l}`)] : []),
    ``,
    `We pack every jar by hand — you'll get tracking when it ships.`,
    `An unopened jar can be returned any time for a full refund; you pay the return postage.`,
    ``,
    `${SITE_URL}  ·  ${BRAND.email}`,
    `${BRAND.legal}  ·  ${BRAND.hours}`,
  ].join("\n");

/* The shop's own copy. Different job entirely: this one is a picking slip. Big
   order number, what to put in the box, an address block that survives copy-paste
   into a label, and the customer on Reply-To so answering is one tap. */
function shopHTML({ order, lines, totals, address, email, name }) {
  return shell(`${stripes()}
  <tr><td style="padding:26px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE}">New order · paid</div>
    <div style="font:400 26px/1.2 ${SERIF};letter-spacing:.06em;color:${INK};padding-top:8px">${esc(order)}</div>
    <div style="font:400 14px/1.5 ${SERIF};color:${GOLD};padding-top:6px">${money(totals.total)} received${totals.promo ? ` · promo ${esc(totals.promo)}` : ""}</div>
  </td></tr>

  <tr><td style="padding:24px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding-bottom:10px">Pack</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${lines.map((l) => `<tr>
        <td style="padding:11px 0;border-top:1px solid ${LINE};font:700 17px/1.3 ${SERIF};color:${INK}">${l.qty} &times; ${esc(l.name)}</td>
        <td align="right" style="padding:11px 0;border-top:1px solid ${LINE};font:400 15px/1.3 ${SERIF};color:${MUTE}">${money(l.total)}</td></tr>`).join("")}
    </table>
  </td></tr>

  ${address ? `<tr><td style="padding:24px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding-bottom:9px">Ship to</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#f7f4ed;border:1px solid ${LINE};border-radius:2px;padding:14px 16px;font:400 15px/1.6 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;color:${INK}">${nl2br(address)}</td></tr></table>
  </td></tr>` : ""}

  <tr><td style="padding:22px 32px 0">
    <div style="font:400 10px/1 ${SERIF};letter-spacing:.22em;text-transform:uppercase;color:${MUTE};padding-bottom:8px">Customer</div>
    <div style="font:400 15px/1.6 ${SERIF};color:${INK}">${esc(name || "Guest")} · <a href="mailto:${esc(email)}" style="color:${GOLD}">${esc(email)}</a></div>
  </td></tr>

  <tr><td style="padding:22px 32px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${totalsRows(totals)}</table>
  </td></tr>

  <tr><td style="padding:22px 32px 30px">
    <div style="border-top:1px solid ${LINE};padding-top:16px;font:400 13px/1.7 ${SERIF};color:${MUTE}">
      Payment already cleared in Stripe — this email is sent from the webhook, after the charge succeeded. Reply to this message to write to the customer directly.
    </div>
  </td></tr>`);
}

export function orderEmails({ order, lines, totals, address, email, name }) {
  const d = { order, lines, totals, address, email, name };
  return {
    customer: {
      to: email,
      subject: `Your ${BRAND.name} order ${order}`,
      html: receiptHTML(d),
      text: receiptText(d),
    },
    shop: {
      to: process.env.ORDERS_EMAIL,
      replyTo: email,
      subject: `New order ${order} — ${money(totals.total)} — ${lines.map((l) => `${l.qty}x ${l.name}`).join(", ")}`,
      html: shopHTML(d),
      text: [
        `NEW ORDER · PAID`,
        `${order} — ${money(totals.total)}`,
        ``,
        `PACK`,
        ...lines.map((l) => `  ${l.qty} x ${l.name}  ${money(l.total)}`),
        ...(address ? [``, `SHIP TO`, ...address.split("\n").map((l) => `  ${l}`)] : []),
        ``,
        `CUSTOMER`,
        `  ${name || "Guest"} <${email}>`,
        ``,
        `Subtotal ${money(totals.subtotal)}${totals.discount ? ` · ${totals.promo || "Discount"} -${money(totals.discount)}` : ""} · Shipping ${totals.shipping ? money(totals.shipping) : "Free"}${totals.tax ? ` · Tax ${money(totals.tax)}` : ""} · TOTAL ${money(totals.total)}`,
      ].join("\n"),
    },
  };
}
