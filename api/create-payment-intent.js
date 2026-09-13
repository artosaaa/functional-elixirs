/* POST /api/create-payment-intent
   The browser sends product ids, quantities and the delivery address — never an
   amount. The price is recomputed here from the catalog and that is what Stripe is
   told to charge, so a tampered cart buys nothing cheaper.

   Returns the PaymentIntent client secret plus the breakdown, so the checkout can
   show exactly the figures that are about to be charged. */
import { price, orderNumber } from "../src/commerce.mjs";
import { stripe } from "../src/stripe.mjs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const str = (v, max = 200) => String(v ?? "").trim().slice(0, max);
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Malformed request." }, 400); }

  const email = str(body.email, 120).toLowerCase();
  if (!looksLikeEmail(email)) return json({ error: "Enter a valid email address." }, 400);

  const name = str(`${str(body.first, 60)} ${str(body.last, 60)}`.trim(), 120) || "Customer";
  const address = {
    line1: str(body.address, 160),
    line2: str(body.address2, 160),
    city: str(body.city, 80),
    state: str(body.state, 40),
    postal_code: str(body.zip, 16),
    country: str(body.country, 2).toUpperCase() || "US",
  };
  if (!address.line1 || !address.city || !address.postal_code) {
    return json({ error: "Enter a complete delivery address." }, 400);
  }

  let quote;
  try {
    quote = price({ items: body.items, promo: body.promo, country: address.country, zip: address.postal_code });
  } catch (e) {
    return json({ error: e.message }, 400);
  }

  const order = str(body.order, 16) || orderNumber();
  const printable = [name, address.line1, address.line2, `${address.city}, ${address.state} ${address.postal_code}`, address.country]
    .filter(Boolean).join("\n").slice(0, 480);

  /* Everything the webhook needs to send a receipt lives on the intent itself, so the
     confirmation path never has to trust the browser a second time. */
  const metadata = {
    order,
    email,
    name,
    lines: quote.lines.map((l) => `${l.id}x${l.qty}`).join(","),
    subtotal: String(quote.subtotal),
    discount: String(quote.discount),
    promo: quote.promo || "",
    shipping: String(quote.shipping),
    tax: String(quote.tax),
    total: String(quote.total),
    address: printable,
  };

  const payload = {
    amount: quote.amount,
    currency: quote.currency,
    /* Deliberately NOT receipt_email. In live mode — but not in test mode, so you
       would not catch it while testing — Stripe emails its own receipt to that
       address if "Successful payments" is on under Settings > Customer emails. The
       customer would get two emails seconds apart: Stripe's, and the branded one the
       webhook sends. The address is on the intent as metadata.email either way, so
       the dashboard still shows who ordered. Want both? Put receipt_email back. */
    description: `Functional Elixirs — ${quote.lines.map((l) => `${l.name} x${l.qty}`).join(", ")}`.slice(0, 350),
    shipping: { name, address },
    metadata,
  };

  try {
    /* A checkout recalculates as the shopper types their ZIP. Reuse the intent it
       already has rather than leaving a trail of abandoned ones in the dashboard. */
    const existing = str(body.intentId, 80);
    let intent;
    if (/^pi_[A-Za-z0-9_]+$/.test(existing)) {
      const current = await stripe(`/payment_intents/${existing}`);
      if (current.status === "requires_payment_method" || current.status === "requires_confirmation") {
        intent = await stripe(`/payment_intents/${existing}`, payload);
      }
    }
    if (!intent) {
      intent = await stripe("/payment_intents", { ...payload, automatic_payment_methods: { enabled: true } });
    }
    return json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
      order,
      ...quote,
    });
  } catch (e) {
    console.error("create-payment-intent failed:", e.message, e.code || "");
    /* Stripe's own message can name a card or an account detail — keep it in the logs. */
    return json({ error: "We couldn't start the payment. Please try again in a moment." }, 502);
  }
}
