/* Stripe over REST — no SDK, no dependency. The whole surface this shop needs is
   two API calls and a signature check, and the repo installs nothing at build time. */
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.stripe.com/v1";
/* Pinned so a Stripe-side API change cannot alter behaviour without a code change. */
const API_VERSION = "2024-06-20";

/* Stripe takes form-encoded bodies with bracketed nesting: shipping[address][line1]. */
const encode = (obj, prefix = "") =>
  Object.entries(obj)
    .flatMap(([k, v]) => {
      const key = prefix ? `${prefix}[${k}]` : k;
      if (v === undefined || v === null || v === "") return [];
      if (typeof v === "object") return encode(v, key);
      return [`${encodeURIComponent(key)}=${encodeURIComponent(v)}`];
    })
    .join("&");

export async function stripe(path, body, { idempotencyKey } = {}) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": API_VERSION,
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? encode(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data?.error?.message || `Stripe responded ${res.status}`), {
      status: res.status,
      code: data?.error?.code,
    });
  }
  return data;
}

/* Stripe signs `${timestamp}.${rawBody}` with the endpoint secret and sends
   `t=…,v1=…` in Stripe-Signature. Verify against the RAW body — re-serialising
   parsed JSON changes the bytes and the signature will never match. The timestamp
   tolerance is what stops a captured delivery being replayed later. */
export function verifyStripeSignature(raw, header, secret, toleranceSeconds = 300) {
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  if (!header) throw new Error("Missing Stripe-Signature header");

  const parts = Object.create(null);
  for (const pair of String(header).split(",")) {
    const i = pair.indexOf("=");
    if (i < 0) continue;
    const k = pair.slice(0, i).trim();
    (parts[k] ||= []).push(pair.slice(i + 1).trim());
  }
  const t = parts.t?.[0];
  const signatures = parts.v1 || [];
  if (!t || signatures.length === 0) throw new Error("Malformed Stripe-Signature header");
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(t)) > toleranceSeconds) {
    throw new Error("Stripe-Signature timestamp is outside the tolerance window");
  }

  const expected = Buffer.from(createHmac("sha256", secret).update(`${t}.${raw}`, "utf8").digest("hex"), "hex");
  const matches = signatures.some((s) => {
    let got;
    try { got = Buffer.from(s, "hex"); } catch { return false; }
    return got.length === expected.length && timingSafeEqual(expected, got);
  });
  if (!matches) throw new Error("Stripe-Signature did not match");

  return JSON.parse(raw);
}
