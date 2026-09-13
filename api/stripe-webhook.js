/* POST /api/stripe-webhook
   The reliable route: it runs even if the shopper closes the tab before the
   confirmation page loads. The confirmation page calls the same logic, so receipts
   go out with or without this endpoint being registered — but only this one survives
   a closed tab, which is why it is still worth setting up.

   Register it in Stripe → Developers → Webhooks for `payment_intent.succeeded` and
   put the whsec_… signing secret in STRIPE_WEBHOOK_SECRET. */
import { verifyStripeSignature } from "../src/stripe.mjs";
import { sendEmail } from "../src/email.mjs";
import { sendOrderEmails } from "../src/order-mail.mjs";

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

  /* No customer email means this is almost certainly Stripe's "Send test webhook",
     which carries no metadata. Use it as a live check of the whole mail path. It can
     only ever deliver to ORDERS_EMAIL, never to an address taken from the event. */
  if (!m.email && !pi.receipt_email) {
    const to = process.env.ORDERS_EMAIL;
    if (!to) return ok({ warning: "no customer email on the event, and ORDERS_EMAIL is not set" });
    try {
      await sendEmail({
        to,
        subject: "Functional Elixirs — webhook and email are working",
        html: `<p>This event carried no customer details, so it was almost certainly a test webhook from the Stripe dashboard.</p>
<p>Everything it does exercise is working: Stripe reached the endpoint, the signature verified, and Resend delivered this message — which is why you are reading it.</p>
<p>A real order additionally sends the customer their receipt.</p>`,
        text: "This event carried no customer details, so it was almost certainly a test webhook.\n\nStripe reached the endpoint, the signature verified, and Resend delivered this message.",
      });
      return ok({ test: true, emailed: [to] });
    } catch (e) {
      console.error("webhook: test event, but the email failed:", e.message);
      return new Response(JSON.stringify({ error: `email failed: ${e.message}` }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  const result = await sendOrderEmails(pi, { source: "webhook" });
  if (result.skipped === "already sent") return ok({ duplicate: true });

  /* A 500 asks Stripe to retry; delivery is recorded per recipient, so the retry
     picks up only what is still missing. The charge went through either way. */
  if (result.failure) {
    return new Response(JSON.stringify({ error: result.failure, emailed: result.emailed }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  return ok({ received: true, order: result.order, emailed: result.emailed, customerEmailed: result.sent.customer, shopNotified: result.sent.shop });
}
