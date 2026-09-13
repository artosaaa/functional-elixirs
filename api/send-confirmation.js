/* POST /api/send-confirmation
   Called by the order confirmation page once Stripe has redirected the shopper back.

   This exists so receipts do not depend on the Stripe webhook being configured. The
   webhook is still the better mechanism — it runs even if the shopper closes the tab
   — but it needs an endpoint registered in the dashboard and a signing secret, and
   until that is done it sends nothing at all. Between them, whichever arrives first
   sends the emails and the other finds them already recorded and sends nothing.

   Trust: the browser tells us nothing here except WHICH PaymentIntent to look at.
   Whether it was actually paid, what was in it and what it cost all come from asking
   Stripe directly with the secret key. The client_secret is required and compared
   against the real one, so a passer-by cannot make us email a stranger's receipt by
   guessing intent ids. */
import { stripe } from "../src/stripe.mjs";
import { sendOrderEmails } from "../src/order-mail.mjs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Malformed request." }, 400); }

  const id = String(body.paymentIntent ?? "").trim();
  const secret = String(body.clientSecret ?? "").trim();
  if (!/^pi_[A-Za-z0-9_]+$/.test(id) || !secret) return json({ error: "Missing payment reference." }, 400);

  let pi;
  try {
    pi = await stripe(`/payment_intents/${id}`);
  } catch (e) {
    console.error("send-confirmation: could not read", id, ":", e.message);
    return json({ error: "Could not verify that payment." }, 502);
  }

  /* Constant-time-ish equality is overkill here — the secret is already in the URL
     of the page making this call — but the check itself is not optional: without it
     any intent id would do. */
  if (pi.client_secret !== secret) return json({ error: "That payment reference does not match." }, 403);
  if (pi.status !== "succeeded") return json({ error: `Payment is ${pi.status}.`, status: pi.status }, 409);

  const result = await sendOrderEmails(pi, { source: "confirmation-page" });
  if (result.failure) {
    /* The charge is fine; only the email failed. The webhook, if it is configured,
       will try again — and so will the next load of this page. */
    return json({ error: result.failure, emailed: result.emailed }, 502);
  }
  return json({
    ok: true,
    order: result.order,
    emailed: result.emailed,
    alreadySent: result.skipped === "already sent",
    customerEmailed: result.sent.customer,
    shopNotified: result.sent.shop,
  });
}
