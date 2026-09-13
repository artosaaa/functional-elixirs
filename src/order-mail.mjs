/* Sending the order emails for one PaymentIntent.

   Shared by two callers on purpose. The Stripe webhook is the reliable one — it
   runs even if the shopper closes the tab — but it needs an endpoint registered in
   the Stripe dashboard and a signing secret, and until that exists it sends nothing
   at all. The confirmation page calls this too, so receipts go out from the moment
   payment succeeds with no dashboard configuration whatsoever.

   Both routes are safe to run for the same order: delivery is recorded per recipient
   on the PaymentIntent itself, so whichever gets there first wins and the other
   sends nothing. */
import { stripe } from "./stripe.mjs";
import { byId } from "./products.mjs";
import { sendEmail, orderEmails } from "./email.mjs";

const num = (v) => Number(v || 0);

/* Rebuild the order from the intent's metadata — the figures the server itself
   computed at checkout, never anything the browser said afterwards. */
export function orderFromIntent(pi) {
  const m = pi.metadata || {};
  const lines = String(m.lines || "")
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const [id, qty] = part.split("x");
      const p = byId[id];
      const q = Number(qty) || 1;
      return { name: p?.name || id, qty: q, total: p ? Math.round(p.price * q * 100) / 100 : 0 };
    });
  return {
    order: m.order || pi.id,
    email: m.email || pi.receipt_email || "",
    name: m.name || "",
    address: m.address || "",
    lines,
    totals: {
      subtotal: num(m.subtotal),
      discount: num(m.discount),
      promo: m.promo || null,
      shipping: num(m.shipping),
      total: num(m.total) || pi.amount / 100,
    },
  };
}

/* Returns { sent, emailed, failure, skipped } — never throws, so a caller can
   decide for itself whether a failure is worth a retry. */
export async function sendOrderEmails(pi, { source = "unknown" } = {}) {
  const m = pi.metadata || {};
  const detail = orderFromIntent(pi);
  const emailed = [];
  const sent = { customer: m.emailedCustomer === "1", shop: m.emailedShop === "1" };

  if (!detail.email) {
    console.error(`[${source}] payment`, pi.id, "succeeded with no email on the intent");
    return { sent, emailed, failure: null, skipped: "no customer email on the intent" };
  }
  if (sent.customer && (sent.shop || !process.env.ORDERS_EMAIL)) {
    return { sent, emailed, failure: null, skipped: "already sent" };
  }

  const mail = orderEmails(detail);
  let failure = null;

  /* The customer's copy goes first: it matters more than ours, and a failure on ours
     must not stop theirs being retried. */
  if (!sent.customer) {
    try {
      await sendEmail(mail.customer);
      sent.customer = true;
      emailed.push(mail.customer.to);
    } catch (e) {
      console.error(`[${source}] order`, detail.order, "paid but the customer receipt failed:", e.message);
      failure = `customer receipt: ${e.message}`;
    }
  }

  if (!sent.shop) {
    if (mail.shop.to) {
      try {
        await sendEmail(mail.shop);
        sent.shop = true;
        emailed.push(mail.shop.to);
      } catch (e) {
        console.error(`[${source}] order`, detail.order, "paid but the shop copy failed:", e.message);
        failure = failure ? `${failure}; shop copy: ${e.message}` : `shop copy: ${e.message}`;
      }
    } else {
      console.error(`[${source}] ORDERS_EMAIL is not set — order`, detail.order, "was paid and the shop was not notified");
    }
  }

  /* Record what landed before answering, so the other caller — and any retry —
     sends only what is still missing. */
  if (emailed.length) {
    try {
      await stripe(`/payment_intents/${pi.id}`, {
        metadata: { ...m, emailedCustomer: sent.customer ? "1" : "", emailedShop: sent.shop ? "1" : "" },
      });
    } catch (e) {
      console.error(`[${source}] could not record what was emailed for`, pi.id, ":", e.message);
    }
  }

  return { sent, emailed, failure, skipped: null, order: detail.order };
}
