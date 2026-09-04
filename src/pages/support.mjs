/* FAQ · Contact · Shipping · Returns · Privacy · Terms · Cookies · Sitemap · 404 */
import { page, jsonld, breadcrumbs, faqList, ctaBand, ICONS, esc, BRAND, CFG, HERO_URL, abs } from "../layout.mjs";
import { PRODUCTS, COLLECTIONS } from "../products.mjs";
import { ARTICLES } from "../articles.mjs";

const UPDATED = "September 1, 2026";
const head = (crumb, path, eyebrow, h1, lede) => `${breadcrumbs([{ name: crumb, href: path }])}<div class="wrap--narrow page-head"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}</div>`;
const policy = ({ path, crumb, title, description, h1, lede, body, ld = [] }) => ({ path, html: page({ title, description, path, jsonld: ld, breadcrumbs: [{ name: crumb, href: path }], body: `${head(crumb, path, "Policies", h1, lede)}<section class="section--tight"><div class="wrap--prose prose"><p class="updated">Last updated ${UPDATED}</p>${body}</div></section>` }) });

const FAQ = [
  ["What exactly is in the jar?", "Raw honey and fresh ginger root. Nothing else — no added sugar, flavourings, colours or preservatives. <a href='/sourcing/'>Ingredients &amp; sourcing</a>."],
  ["How do I use it?", `One teaspoon in about 8 oz of warm water is the classic. It also replaces sugar in tea one-for-one, and works in oats, smoothies, dressings and glazes. <a href="/ritual/">The ritual</a> has all eight ways.`],
  ["How much is in a jar, and how long does it last?", "The signature jar is 15 oz (425 g) — about six weeks of daily teaspoons. The 8 oz jar is about three weeks. Honey is shelf-stable; for peak ginger flavour, enjoy within 12 months of opening."],
  ["Does it need to be refrigerated?", "No. Room temperature, lid closed, dry spoon. Cold speeds crystallization."],
  ["My honey is cloudy / thick / grainy. Is it bad?", `No — raw honey crystallizes naturally. Set the closed jar in warm water for 20–30 minutes and stir. <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">Full guide</a>.`],
  ["Is it safe for children and during pregnancy?", "Honey must not be given to infants under 12 months. For older children it’s food. If you’re pregnant or managing a health condition, ask your doctor as you would about any food — we don’t give medical advice."],
  ["Is it vegan, gluten-free, nut-free?", "It contains honey, so it isn’t vegan. It is naturally gluten-free, dairy-free and nut-free."],
  ["Where is it made?", "Blended and jarred in small batches in the USA."],
  ["How fast will it ship?", `Orders ship in 1–2 business days. Standard delivery is 2–7 business days depending on distance, Express 1–3. Free standard shipping over $${CFG.freeShipOver}. <a href="/shipping/">Rates and calculator</a>.`],
  ["Can I return it?", `Unopened jars within ${CFG.returnsDays} days, free. Opened and not for you? Tell us — we’ll refund or replace. <a href="/returns/">Returns policy</a>.`],
  ["Do you offer Apple Pay?", "Yes — Apple Pay, Google Pay and Shop Pay on the product page, in the cart and at checkout, plus all major cards. Guest checkout is always available."],
  ["Do you ship internationally?", "Canada, the UK and Australia, with tracked rates shown at checkout. Duties and taxes may apply on delivery."],
  ["Can I send it as a gift?", `Yes. Enter their address, add a note at checkout (we hand-write it and never include prices), or choose the <a href="/shop/honey-with-fresh-ginger-gift-box/">Gift Box</a>.`],
  ["Is there a subscription?", "Not yet. The two-jar set is our low-tech version — it ships free and covers about three months."],
];

function faq() {
  const path = "/faq/";
  const body = `${head("FAQ", path, "Help", "Questions, answered.", "The things people ask before the first jar — and after.")}
<section class="section--tight"><div class="wrap--narrow">${faqList(FAQ)}<p class="center muted" style="margin-top:var(--s-7)">Something else? <a href="/contact/">Write to us</a> — a person replies within one business day.</p></div></section>${ctaBand()}`;
  return { path, html: page({ title: "FAQ — Honey with Fresh Ginger", description: "Answers about Functional Elixirs Honey with Fresh Ginger: ingredients, how to use it, storage and crystallization, kids, shipping times, returns, Apple Pay and gifting.", path, body, jsonld: [jsonld.faq(FAQ)], breadcrumbs: [{ name: "FAQ", href: path }] }) };
}

function contact() {
  const path = "/contact/";
  const body = `${breadcrumbs([{ name: "Contact", href: path }])}
<div class="wrap page-head"><p class="eyebrow">Contact</p><h1>Say hello.</h1><p class="lede measure--wide">A person reads every message and replies within one business day, ${BRAND.hours}.</p></div>
<section class="section--tight"><div class="wrap contact-grid">
  <div>
    <div class="contact-card"><strong>Email</strong><a href="mailto:${BRAND.email}">${BRAND.email}</a><span class="muted small">Orders, wholesale, press, and recipe ideas — all welcome.</span></div>
    <div class="contact-card"><strong>Order help</strong><span class="small">Have your order number (FE-XXXXXX) handy. Or <a href="/track-order/">track it yourself</a>.</span></div>
    <div class="contact-card"><strong>Wholesale &amp; stockists</strong><span class="small">Cafés, farm shops and gift stores: email with “Wholesale” in the subject and we’ll send the sheet.</span></div>
    <div class="contact-card"><strong>Social</strong><span class="small"><a href="${BRAND.social.instagram}" rel="noopener">Instagram</a> · <a href="${BRAND.social.facebook}" rel="noopener">Facebook</a></span></div>
  </div>
  <form id="contact-form" class="form-card form" novalidate>
    <div class="field-row"><div class="field"><label for="c-name">Name</label><input class="input" id="c-name" name="name" autocomplete="name" required><p class="error">Please enter your name.</p></div><div class="field"><label for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required><p class="error">Enter a valid email.</p></div></div>
    <div class="field"><label for="c-topic">Topic</label><select class="select" id="c-topic" name="topic"><option>Order question</option><option>Product question</option><option>Gift or wholesale</option><option>Press</option><option>Something else</option></select></div>
    <div class="field"><label for="c-order">Order number <span class="muted">(optional)</span></label><input class="input" id="c-order" name="order" placeholder="FE-"></div>
    <div class="field"><label for="c-msg">Message</label><textarea class="textarea" id="c-msg" name="message" required></textarea><p class="error">Tell us a little more.</p></div>
    <p class="form-msg" role="status"></p>
    <button class="btn btn--primary" type="submit">Send message</button>
    <p class="form__foot">We use your details only to reply. <a href="/privacy/">Privacy</a>.</p>
  </form>
</div></section>`;
  return { path, html: page({ title: "Contact", description: "Contact Functional Elixirs — order help, product questions, gifting, wholesale and press. A person replies within one business day.", path, body, breadcrumbs: [{ name: "Contact", href: path }] }) };
}

function shipping() {
  const path = "/shipping/";
  const body = `${head("Shipping & delivery", path, "Help", "Shipping &amp; delivery", `Ships in 1–2 business days from the USA. Free standard shipping on orders over $${CFG.freeShipOver}.`)}
<section class="section--tight"><div class="wrap--narrow stack" style="--flow:var(--s-7)">
  <div class="form-card"><h2 style="font-size:var(--fs-md);margin-bottom:var(--s-4)">Estimate for your address</h2>
    <form class="ship-calc" data-ship-calc novalidate><div class="field-row"><div class="field"><label for="sp-country">Country</label><select class="select" id="sp-country" name="country"><option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="AU">Australia</option><option value="OTHER">Other</option></select></div><div class="field"><label for="sp-zip">ZIP / postcode</label><input class="input" id="sp-zip" name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="94103"></div></div><button class="btn btn--ghost btn--sm" type="submit">Estimate</button><div class="ship-calc__result" aria-live="polite"><p class="small muted">Enter a ZIP to see live rates and arrival windows.</p></div></form></div>
  <div class="prose">
    <h2>United States</h2>
    <table class="rate-table"><thead><tr><th>Method</th><th>Transit</th><th>Cost</th></tr></thead><tbody>
      <tr><td><strong>Standard</strong> — USPS Ground Advantage / UPS Ground</td><td>2–7 business days (West 2–4 · Central 3–5 · East 4–7)</td><td>$5.95 · free over $${CFG.freeShipOver}</td></tr>
      <tr><td><strong>Express</strong> — USPS Priority Express / UPS 2nd Day</td><td>1–3 business days</td><td>$14.00</td></tr>
      <tr><td><strong>Local pickup</strong></td><td>Same day — we email when it’s boxed</td><td>Free</td></tr>
    </tbody></table>
    <h2>Processing</h2>
    <p>Orders placed before 1pm Pacific on a business day ship the same day; otherwise the next business day. We don’t ship on US federal holidays. You’ll get a tracking email the moment the label is scanned, and you can always check <a href="/track-order/">Track order</a>.</p>
    <h2>Packaging</h2>
    <p>Glass jars are wrapped in paper and cushioned in a recycled-fibre box. If a jar arrives broken — it happens rarely, but glass is glass — photograph the box and jar and <a href="/contact/">tell us</a>. We’ll send a replacement immediately, no return needed.</p>
    <h2>International</h2>
    <table class="rate-table"><thead><tr><th>Destination</th><th>Standard</th><th>Express</th></tr></thead><tbody>
      <tr><td>Canada</td><td>$12.95 · 6–10 days</td><td>$24.00 · 3–5 days</td></tr>
      <tr><td>United Kingdom</td><td>$15.95 · 7–12 days</td><td>$29.00 · 3–6 days</td></tr>
      <tr><td>Australia</td><td>$19.95 · 9–15 days</td><td>$34.00 · 4–7 days</td></tr>
      <tr><td>Elsewhere</td><td>$19.95 · 8–14 days</td><td>$32.00 · 4–7 days</td></tr>
    </tbody></table>
    <p>International orders are shipped DDU: duties, VAT and import fees, if any, are collected by the carrier on delivery and are the recipient’s responsibility. Honey is a food product; a small number of countries restrict its import — check your local rules before ordering.</p>
    <h2>Addresses &amp; changes</h2>
    <p>We can change an address until the label is printed (usually within a few hours). Email us right away with your order number. PO Boxes and APO/FPO are fine via USPS Standard. We can’t deliver to freight forwarders.</p>
    <h2>Heat</h2>
    <p>Honey is unbothered by heat in transit — it may thin slightly, then settle. It won’t spoil. In deep winter it may arrive firmer; a warm-water bath brings it back (<a href="/journal/how-to-store-honey-and-why-it-crystallizes/">how</a>).</p>
    <p>Questions about returns? See <a href="/returns/">Returns &amp; exchanges</a>.</p>
  </div>
</div></section>`;
  return { path, html: page({ title: "Shipping & Delivery — Rates, Times and Free Shipping over $40", description: "Functional Elixirs shipping: free US standard shipping over $40, $5.95 standard (2–7 days), $14 express (1–3 days), free local pickup, and tracked international rates to Canada, UK and Australia.", path, body, breadcrumbs: [{ name: "Shipping & delivery", href: path }] }) };
}

const returns = () => policy({
  path: "/returns/", crumb: "Returns & exchanges", title: "Returns & Exchanges — 30-Day Happiness Guarantee", description: "Functional Elixirs returns: 30-day happiness guarantee, free returns on unopened jars, and a straightforward promise if an opened jar isn’t for you. Damaged in transit? Replaced free.",
  h1: "Returns &amp; exchanges", lede: "If a jar isn’t for you, we’ll make it right. That’s the whole policy; the rest is detail.", body: `
<h2>The 30-day happiness guarantee</h2>
<p>Within ${CFG.returnsDays} days of delivery, if you’re not happy for any reason, email <a href="mailto:${BRAND.email}">${BRAND.email}</a> with your order number and a sentence about what went wrong. We’ll offer a refund to your original payment method, a replacement, or store credit — your choice.</p>
<h2>Unopened jars</h2>
<p>Return within ${CFG.returnsDays} days for a full refund of the product price. We email a prepaid USPS label; drop it at any post office. Refunds post within 5 business days of the jar reaching us. Original shipping charges are refunded when the return is our error (wrong item, damage) and otherwise not.</p>
<h2>Opened jars</h2>
<p>Because honey is food, we can’t resell an opened jar — so please don’t ship it back. If it’s not for you, tell us and we’ll refund or replace it once per customer, no jar required. If something tastes off or looks wrong, a photo helps us fix the batch.</p>
<h2>Damaged or wrong items</h2>
<p>Photograph the box and the jar and send them to us within 7 days of delivery. We’ll ship a replacement immediately — no return, no charge. If you’d rather a refund, say so.</p>
<h2>Gifts</h2>
<p>Gift recipients can exchange or take store credit with the order number or the recipient email; refunds go to the purchaser’s original payment method. We never include prices in gift boxes.</p>
<h2>Exchanges</h2>
<p>Want a different size or set? Email us; we’ll send the new item and a label for the unopened original, and settle any price difference.</p>
<h2>Not covered</h2>
<p>Crystallized honey (it’s natural — <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">here’s how to restore it</a>), jars past 30 days, and purchases from third-party retailers (please return to them).</p>
<h2>California residents</h2>
<p>Nothing here limits your rights under California law, including the Consumer Legal Remedies Act. Refunds for returns made under this policy are issued in the original form of payment within the timeframes above.</p>
<h2>How to start</h2>
<p>Email <a href="mailto:${BRAND.email}">${BRAND.email}</a> or use the <a href="/contact/">contact form</a> with your order number (FE-XXXXXX). No forms, no restocking fees, no hoops.</p>`,
});

const privacy = () => policy({
  path: "/privacy/", crumb: "Privacy policy", title: "Privacy Policy", description: "How Functional Elixirs collects, uses and protects your information — orders, accounts, email, cookies — and your rights under the CCPA/CPRA and other US state privacy laws.",
  h1: "Privacy policy", lede: "We collect what we need to send you honey and reply to your emails. We don’t sell your data. Here’s the detail.", body: `
<h2>Who we are</h2>
<p>${BRAND.legal} (“we”) operates this website. Questions about this policy: <a href="mailto:${BRAND.email}">${BRAND.email}</a>.</p>
<h2>What we collect</h2>
<ul>
<li><strong>Order information</strong> — name, shipping and billing address, email, phone (optional), and what you bought. Payment card details go directly to our payment processor (Stripe, Apple Pay, Google Pay or PayPal); we never see or store full card numbers.</li>
<li><strong>Account information</strong> — if you create an account: name, email, password (hashed), saved addresses, order history, wishlist.</li>
<li><strong>Messages</strong> — what you send us by email or the contact form.</li>
<li><strong>Newsletter</strong> — your email, if you join.</li>
<li><strong>Device &amp; usage data</strong> — IP address, browser, pages viewed, referring site, collected via server logs and, if you accept them, analytics cookies. See <a href="/cookies/">Cookies</a>.</li>
</ul>
<h2>How we use it</h2>
<ul><li>To fulfil and deliver orders, send receipts and shipping updates, and handle returns.</li><li>To run your account and remember your cart.</li><li>To answer your messages.</li><li>To send the newsletter if you asked for it (unsubscribe in one click, any time).</li><li>To understand how the site is used and fix what’s broken.</li><li>To prevent fraud and meet legal obligations (tax, accounting).</li></ul>
<h2>Who we share it with</h2>
<p>Only service providers who need it to do a job for us: payment processors, shipping carriers and label services, our email provider, our web host, and analytics (if you’ve opted in). Each is bound by contract to use your data only for that job. We do not sell personal information, and we do not “share” it for cross-context behavioural advertising as defined by California law.</p>
<h2>Cookies</h2>
<p>Essential cookies and local storage keep your cart and login working. Analytics cookies are off until you accept them in the banner. Details, and how to change your mind, in the <a href="/cookies/">Cookie notice</a>.</p>
<h2>How long we keep it</h2>
<p>Order records for 7 years (tax law). Account data until you delete your account. Newsletter email until you unsubscribe. Messages for 2 years. Server logs for 30 days.</p>
<h2>Your rights</h2>
<p>Wherever you live, you can ask us to access, correct or delete your personal information, or to stop sending you marketing. Email <a href="mailto:${BRAND.email}">${BRAND.email}</a>; we respond within 45 days and will verify your identity by matching your request to the email on the account or order.</p>
<h3>California (CCPA / CPRA)</h3>
<p>California residents also have the right to know the categories and specific pieces of personal information we’ve collected, the categories of sources, our purposes, and the categories of third parties we’ve disclosed it to; the right to delete; the right to correct; the right to limit use of sensitive personal information (we collect none beyond what’s needed to process a payment); and the right not to be discriminated against for exercising these rights. We do not sell or share personal information, so there is nothing to opt out of — but we honour Global Privacy Control signals regardless. You may designate an authorised agent to make a request on your behalf.</p>
<h3>Other US states</h3>
<p>Residents of Colorado, Connecticut, Virginia, Utah, Texas, Oregon and other states with comprehensive privacy laws have similar rights; use the same email. If we decline a request you may appeal by replying to our response.</p>
<h2>Children</h2>
<p>The site isn’t directed at children under 13 and we don’t knowingly collect their data. (Also: no honey for infants under 12 months.)</p>
<h2>Security</h2>
<p>TLS everywhere, hashed passwords, payment data handled by PCI-compliant processors, and access limited to the people who need it. No system is perfect; if we ever have a breach affecting you, we’ll tell you as the law requires.</p>
<h2>Changes</h2>
<p>We’ll post updates here and change the date at the top. Material changes get an email if we have your address.</p>`,
});

const terms = () => policy({
  path: "/terms/", crumb: "Terms of service", title: "Terms of Service", description: "Terms of service for functionalelixirs.com — ordering, pricing, shipping, returns, accounts, acceptable use, food product notices and governing law.",
  h1: "Terms of service", lede: "The plain-English agreement between you and us when you use this site or buy a jar.", body: `
<h2>1. Who’s agreeing</h2><p>These terms are between you and ${BRAND.legal}. By using the site or placing an order you accept them. If you don’t, please don’t use the site.</p>
<h2>2. Products</h2><p>Our products are foods. Honey with Fresh Ginger contains honey and fresh ginger root and is not intended for infants under 12 months. Batches vary naturally in colour and taste; raw honey may crystallize. Nothing on this site is medical advice; statements about traditional use are not evaluated by the FDA and the product is not intended to diagnose, treat, cure or prevent any disease. If you have a medical condition or allergy, consult your clinician.</p>
<h2>3. Orders &amp; pricing</h2><p>Prices are in US dollars and exclude shipping and any applicable sales tax, which are shown before you pay. We may correct pricing errors and will tell you before shipping; you can cancel for a full refund. An order is accepted when we email a shipping confirmation. We may decline or cancel orders that look fraudulent, exceed available stock, or are for resale without a wholesale agreement.</p>
<h2>4. Payment</h2><p>We accept major cards, Apple Pay, Google Pay, Shop Pay and PayPal through PCI-compliant processors. You confirm you’re authorised to use the payment method.</p>
<h2>5. Shipping</h2><p>Per our <a href="/shipping/">Shipping &amp; delivery</a> page. Delivery windows are estimates. Risk of loss passes to you on delivery to the address you gave us; if something arrives damaged, see returns below.</p>
<h2>6. Returns</h2><p>Per our <a href="/returns/">Returns &amp; exchanges</a> policy, including the 30-day happiness guarantee.</p>
<h2>7. Promotions</h2><p>Promo codes are one per order, can’t be applied retroactively, and may be withdrawn at any time. Free-shipping thresholds are calculated on the subtotal after discounts.</p>
<h2>8. Accounts</h2><p>Keep your password private; you’re responsible for activity under your account. We may close accounts used for fraud or abuse. You can delete your account any time by emailing us.</p>
<h2>9. Content &amp; conduct</h2><p>Site content, the Functional Elixirs name and the F·E plaque mark are ours. Don’t copy them commercially without permission. Reviews and messages you send us may be used (with your first name and initial) in our marketing unless you tell us otherwise. Don’t scrape, attack, or misuse the site.</p>
<h2>10. Disclaimers &amp; liability</h2><p>The site is provided “as is”. To the extent permitted by law, we aren’t liable for indirect or consequential losses, and our total liability for any order is limited to the amount you paid for it. Nothing here limits liability that can’t be limited by law, including for death, personal injury caused by negligence, or fraud, and nothing limits rights you have under consumer protection law in your state.</p>
<h2>11. Disputes</h2><p>Talk to us first — nearly everything is fixable by email. These terms are governed by the laws of the State of California, without regard to conflict-of-law rules. Any dispute that can’t be resolved informally will be brought in the state or federal courts of California, except that either party may bring individual claims in small-claims court. Class actions are waived to the extent permitted by law.</p>
<h2>12. Changes</h2><p>We may update these terms; the version posted at the time of your order applies to that order.</p>
<h2>13. Contact</h2><p><a href="mailto:${BRAND.email}">${BRAND.email}</a></p>`,
});

const cookies = () => policy({
  path: "/cookies/", crumb: "Cookie notice", title: "Cookie Notice", description: "Which cookies functionalelixirs.com uses — essential cart and login storage, and optional analytics — and how to change your choice.",
  h1: "Cookie notice", lede: "Short version: a few essential cookies to run the cart, and nothing else unless you say so.", body: `
<h2>Essential (always on)</h2>
<table><thead><tr><th>Name</th><th>Purpose</th><th>Lifetime</th></tr></thead><tbody>
<tr><td><code>sw_cart</code>, <code>sw_promo</code>, <code>sw_ship</code></td><td>Your cart, promo code and shipping estimate (browser local storage)</td><td>Until cleared</td></tr>
<tr><td><code>sw_user</code>, <code>sw_addresses</code>, <code>sw_wishlist</code>, <code>sw_orders</code></td><td>Account session and saved data</td><td>Until sign-out</td></tr>
<tr><td><code>sw_cookie</code></td><td>Remembers your cookie choice</td><td>12 months</td></tr>
</tbody></table>
<h2>Analytics (only if you accept)</h2>
<p>If you click “Accept all” we load a privacy-respecting analytics script to count visits and see which pages help. No cross-site tracking, no ad networks. Click “Essential only” and nothing loads.</p>
<h2>Payment providers</h2>
<p>When you pay, Stripe, Apple Pay, Google Pay or PayPal may set their own cookies for fraud prevention. Those are governed by their policies.</p>
<h2>Changing your mind</h2>
<p>Clear this site’s data in your browser settings and the banner reappears. Or email <a href="mailto:${BRAND.email}">${BRAND.email}</a>. Browsers also let you block cookies entirely; the cart may not work if you do.</p>
<p>More in the <a href="/privacy/">Privacy policy</a>.</p>`,
});

function sitemap() {
  const path = "/sitemap/";
  const group = (t, items) => `<div><h2 style="font-size:var(--fs-md);margin-bottom:var(--s-3)">${t}</h2><ul class="stack small" style="list-style:none;padding:0;--flow:.4rem">${items.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("")}</ul></div>`;
  const body = `${head("Sitemap", path, "Index", "Sitemap", "Every page on the site. Search engines: see <a href='/sitemap.xml'>/sitemap.xml</a>.")}
<section class="section--tight"><div class="wrap grid grid--3">
  ${group("Shop", [["All products", "/shop/"], ...PRODUCTS.map((p) => [`${p.name} — ${p.size}`, p.url]), ...Object.entries(COLLECTIONS).map(([s, c]) => [c.title, `/collections/${s}/`]), ["Cart", "/cart/"], ["Checkout", "/checkout/"], ["Track order", "/track-order/"]])}
  ${group("Functional Elixirs", [["Home", "/"], ["About us", "/about-us/"], ["The ritual", "/ritual/"], ["Ingredients & sourcing", "/sourcing/"], ["Sustainability", "/sustainability/"], ["Gift guide", "/gift-guide/"], ["Journal", "/journal/"], ...ARTICLES.map((a) => [a.title, a.url])])}
  ${group("Help & account", [["FAQ", "/faq/"], ["Contact", "/contact/"], ["Shipping & delivery", "/shipping/"], ["Returns & exchanges", "/returns/"], ["Privacy", "/privacy/"], ["Terms", "/terms/"], ["Cookies", "/cookies/"], ["Sign up", "/account/signup/"], ["Log in", "/account/login/"], ["Forgot password", "/account/forgot-password/"], ["Account", "/account/"], ["Addresses", "/account/addresses/"], ["Wishlist", "/account/wishlist/"]])}
</div></section>`;
  return { path, html: page({ title: "Sitemap", description: "All pages on functionalelixirs.com — shop, story, ritual, journal, help and account.", path, body, breadcrumbs: [{ name: "Sitemap", href: path }] }) };
}

const notFound = () => ({ path: "/404.html", html: page({ title: "Page not found", description: "That page isn’t here.", path: "/404/", noindex: true, body: `<section class="auth"><div class="wrap center stack" style="--flow:var(--s-5)"><p class="eyebrow">404</p><h1>That page isn’t here.</h1><p class="lede mx-auto measure">The jar, however, is. Try the shop, the ritual, or the journal.</p><div class="cluster" style="justify-content:center"><a class="btn btn--primary" href="${HERO_URL}">The 15 oz jar</a><a class="btn btn--ghost" href="/">Home</a><a class="btn btn--ghost" href="/sitemap/">Sitemap</a></div></div></section>` }) });

export default () => [faq(), contact(), shipping(), returns(), privacy(), terms(), cookies(), sitemap(), notFound()];
