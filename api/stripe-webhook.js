/* POST /api/stripe-webhook
   The only place an order is treated as real. The browser can be closed, refreshed
   or lied to; Stripe's signed webhook is the single source of truth that money moved.

   Register the endpoint in Stripe → Developers → Webhooks for `payment_intent.succeeded`
   and put the whsec_… signing secret in STRIPE_WEBHOOK_SECRET. */
import { verifyStripeSignature, stripe } from "../src/stripe.mjs";
import { byId } from "../src/products.mjs";
import { sendEmail, orderEmails } from "../src/email.mjs";

const ok = (body = { received: true }) =>
  new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });

export async function POST(request) {
  /* Must be the raw bytes: re-serialising parsed JSON changes them and the HMAC
     will never match. */
  const raw = await request.text();

  let event;
  try {
    event = verifyStripeSignature(raw, request.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("webhook rejected:", e.message);
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  /* Acknowledge everything else so Stripe stops retrying events we don't act on. */
  if (event.type !== "payment_intent.succeeded") return ok({ ignored: event.type });

  const pi = event.data.object;
  const m = pi.metadata || {};
  /* Stripe delivers at least once, so the same event can arrive twice. The intent's
     own metadata is the lock: set it after sending, and skip if it's already set.
     Without a database this is the honest best available — a tight race could still
     double-send, which costs a duplicate receipt, not a duplicate charge. */
  if (m.emailed === "1") return ok({ duplicate: true });

  const money = (v) => Number(v || 0);
  const lines = String(m.lines || "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [id, qty] = part.split("x");
      return { id, qty: Number(qty) || 1 };
    });

  const detail = {
    order: m.order || pi.id,
    email: m.email || pi.receipt_email,
    name: m.name,
    address: m.address,
    lines: lines.map((l) => {
      const p = byId[l.id];
      return { name: p?.name || l.id, qty: l.qty, total: p ? Math.round(p.price * l.qty * 100) / 100 : 0 };
    }),
    totals: {
      subtotal: money(m.subtotal),
      discount: money(m.discount),
      promo: m.promo || null,
      shipping: money(m.shipping),
      tax: money(m.tax),
      total: money(m.total) || pi.amount / 100,
    },
  };

  /* No customer email means this is almost certainly Stripe's "Send test webhook",
     which carries no metadata. Rather than doing nothing, use it as a live check of
     the whole mail path and tell the shop owner it worked. It can only ever deliver
     to ORDERS_EMAIL, never to an address taken from the event. */
  if (!detail.email) {
    const to = process.env.ORDERS_EMAIL;
    if (!to) return ok({ warning: "no customer email on the event, and ORDERS_EMAIL is not set" });
    try {
      await sendEmail({
        to,
        subject: "Functional Elixirs — webhook and email are working",
        html: `<p>This event carried no customer details, so it was almost certainly a test webhook from the Stripe dashboard.</p>
<p>Everything it does exercise is working: Stripe reached the endpoint, the signature verified, and Resend delivered this message — which is why you are reading it.</p>
<p>A real order additionally sends the customer their receipt.</p>`,
        text: "This event carried no customer details, so it was almost certainly a test webhook.\n\nStripe reached the endpoint, the signature verified, and Resend delivered this message. A real order additionally sends the customer their receipt.",
      });
      return ok({ test: true, emailed: [to] });
    } catch (e) {
      console.error("webhook: test event, but the email failed:", e.message);
      return new Response(JSON.stringify({ error: `email failed: ${e.message}` }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  const mail = orderEmails(detail);
  /* Reported back in the 200 body, which Stripe shows in the endpoint's Attempts
     tab — so "did the shop copy go out?" is answerable from the dashboard without
     digging through function logs. */
  const emailed = [];
  try {
    await sendEmail(mail.customer);
    emailed.push(mail.customer.to);
    if (mail.shop.to) {
      await sendEmail(mail.shop);
      emailed.push(mail.shop.to);
    } else {
      /* Silently skipping this used to mean the owner simply never heard about an
         order and had nothing to tell them why. */
      console.error("webhook: ORDERS_EMAIL is not set — order", detail.order, "was paid and no notification was sent to the shop");
    }
  } catch (e) {
    /* A 500 makes Stripe retry with backoff — better than a paid order that silently
       never produced a receipt. The charge already went through either way. */
    console.error("webhook: order", detail.order, "paid but email failed:", e.message);
    return new Response(JSON.stringify({ error: `email failed: ${e.message}`, emailed }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    await stripe(`/payment_intents/${pi.id}`, { metadata: { ...m, emailed: "1" } });
  } catch (e) {
    console.error("webhook: could not mark", pi.id, "as emailed:", e.message);
  }

  return ok({ received: true, order: detail.order, emailed, shopNotified: Boolean(mail.shop.to) });
}
