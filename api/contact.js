/* POST /api/contact
   Delivers the contact form to the shop's inbox with the sender on Reply-To, so
   answering is one tap. No database: the email IS the record. */
import { sendEmail } from "../src/email.mjs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const str = (v, max) => String(v ?? "").trim().slice(0, max);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Malformed request." }, 400); }

  /* Honeypot: a field hidden from people and irresistible to bots. Answer 200 so the
     bot believes it succeeded and doesn't come back looking for a different hole. */
  if (str(body.website, 200)) return json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 160).toLowerCase();
  const subject = str(body.subject, 160) || "Website enquiry";
  const message = str(body.message, 5000);

  if (!name) return json({ error: "Please add your name." }, 400);
  if (!looksLikeEmail(email)) return json({ error: "Enter a valid email address." }, 400);
  if (message.length < 5) return json({ error: "Please add a message." }, 400);

  const to = process.env.CONTACT_EMAIL || process.env.ORDERS_EMAIL;
  if (!to) {
    console.error("contact: neither CONTACT_EMAIL nor ORDERS_EMAIL is set");
    return json({ error: "We couldn't send that just now. Please email us directly." }, 500);
  }

  try {
    await sendEmail({
      to,
      replyTo: email,
      subject: `Contact form — ${subject}`,
      html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt; wrote:</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
      text: `${name} <${email}> wrote:\n\n${message}`,
    });
  } catch (e) {
    console.error("contact: send failed:", e.message);
    return json({ error: "We couldn't send that just now. Please email us directly." }, 502);
  }

  return json({ ok: true });
}
