/* Page shell: <head> with SEO + JSON-LD, header, footer, cart drawer, cookie notice, runtime catalog */
import { BRAND, CFG, NAV, FOOTER, SITE_URL, HERO_URL, esc, money, abs, ICONS, stars, logoMark, REVIEWS_VERIFIED } from "./site.mjs";
import { PRODUCTS, catalogJSON } from "./products.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

/* Short content hash appended to the CSS/JS URLs. A redeploy changes the hash,
   so browsers fetch the new file instead of serving a cached one. */
const assetHash = (rel) => {
  try { return createHash("sha1").update(readFileSync(new URL(`../${rel}`, import.meta.url))).digest("hex").slice(0, 8); }
  catch { return "0"; }
};
const CSS_V = assetHash("assets/css/site.css");
const JS_V = assetHash("assets/js/site.js");
import { art, altFor } from "./art.mjs";

export const OG_DEFAULT = abs("/assets/img/og-default.svg");

export const jsonld = {
  org: () => ({
    "@context": "https://schema.org", "@type": "Organization", "@id": abs("/#organization"), name: BRAND.legal, alternateName: BRAND.name, url: SITE_URL, logo: abs("/assets/img/logo.png"),
    email: BRAND.email, foundingDate: String(BRAND.founded), slogan: BRAND.tagline, description: BRAND.positioning,
    address: { "@type": "PostalAddress", addressRegion: BRAND.address.region, addressCountry: BRAND.address.country },
    sameAs: Object.values(BRAND.social), contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", email: BRAND.email, availableLanguage: "English", hoursAvailable: "Mo-Fr 09:00-17:00" }],
  }),
  site: () => ({ "@context": "https://schema.org", "@type": "WebSite", "@id": abs("/#website"), url: SITE_URL, name: BRAND.name, publisher: { "@id": abs("/#organization") } }),
  breadcrumbs: (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ name: "Home", href: "/" }, ...items].map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: abs(b.href) })) }),
  product: (p) => ({
    "@context": "https://schema.org", "@type": "Product", "@id": abs(p.url + "#product"), name: `${p.name} — ${p.sub}`, description: p.short, sku: p.sku, brand: { "@type": "Brand", name: BRAND.name },
    image: [abs(`/assets/img/og-${p.slug}.svg`)], url: abs(p.url), category: p.type === "Accessory" ? "Kitchen > Utensils" : "Food > Honey > Infused honey",
    additionalProperty: [{ "@type": "PropertyValue", name: "Ingredients", value: p.ingredients }, { "@type": "PropertyValue", name: "Size", value: p.size }],
    ...(REVIEWS_VERIFIED ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 } } : {}),
    offers: { "@type": "Offer", url: abs(p.url), priceCurrency: "USD", price: p.price.toFixed(2), priceValidUntil: "2027-12-31", itemCondition: "https://schema.org/NewCondition", availability: p.stock > 0 ? (p.stock <= CFG.lowStockAt ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock") : "https://schema.org/OutOfStock", seller: { "@id": abs("/#organization") },
      shippingDetails: { "@type": "OfferShippingDetails", shippingRate: { "@type": "MonetaryAmount", value: "5.95", currency: "USD" }, shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" }, deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 7, unitCode: "DAY" } } },
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", applicableCountry: "US", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow", merchantReturnDays: CFG.returnsDays, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn" } },
  }),
  faq: (items) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) }),
  article: (a) => ({ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, datePublished: a.date, dateModified: a.modified || a.date, author: { "@type": "Organization", name: BRAND.name, url: SITE_URL }, publisher: { "@id": abs("/#organization") }, mainEntityOfPage: abs(a.url), image: [OG_DEFAULT], articleSection: a.tag, wordCount: a.body.replace(/<[^>]+>/g, "").split(/\s+/).length }),
};

export const breadcrumbs = (items) => `<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items.map((b, i) => i === items.length - 1 ? `<li aria-current="page">${esc(b.name)}</li>` : `<li><a href="${b.href}">${esc(b.name)}</a></li>`).join("")}</ol></nav>`;

export function productCard(p) {
  const badge = p.stock <= 0 ? `<span class="pcard__badge pcard__badge--out">Sold out</span>` : p.stock <= CFG.lowStockAt ? `<span class="pcard__badge pcard__badge--low">Only ${p.stock} left</span>` : p.badge ? `<span class="pcard__badge">${esc(p.badge)}</span>` : "";
  const v = p.art === "hero" ? "hero" : p.art;
  return `<article class="pcard reveal ${p.stock <= 0 ? "pcard--soldout" : ""}">
    <div class="pcard__media">${art(v, p, { alt: altFor(p, v) })}${badge}
      <button class="wish-btn" type="button" data-wish="${p.id}" aria-pressed="false" aria-label="Save ${esc(p.name)} to wishlist">${ICONS.heart}</button></div>
    <div class="pcard__body">
      <h3 class="pcard__title"><a href="${p.url}">${esc(p.name)}</a></h3>
      <p class="pcard__sub">${esc(p.sub)}</p>
      <div class="pcard__row"><span class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</span>
        <button class="btn btn--soft btn--sm pcard__add" type="button" data-add="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>${p.stock <= 0 ? "Sold out" : "Add"}</button></div>
    </div></article>`;
}

export const applePayButton = (extra = "") => `<button class="btn btn--apple-pay btn--block" type="button" ${extra}>${ICONS.apple}<span>Pay</span><span class="sr-only">with Apple Pay</span></button>`;
export const faqList = (items) => `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><div class="faq-a">${a}</div></details>`).join("")}</div>`;
export const ctaBand = (h = "One jar lasts about six weeks. Start tomorrow morning.", p = `Honey with Fresh Ginger, 15 oz — $23.99. Two jars $44.99 and shipping is on us. Thirty days to change your mind, opened jar included.`) => `<section class="section--tight"><div class="wrap"><div class="cta-band reveal"><div><h2>${h}</h2><p style="margin-top:.75rem">${p}</p></div><div class="cta-band__actions cluster"><a class="btn btn--on-dark" href="${HERO_URL}">Get the jar — $23.99</a><a class="btn btn--ghost" style="color:var(--cream);border-color:rgb(246 240 230 / .4)" href="/ritual/">The ritual</a></div></div></div></section>`;

function header() {
  return `<a class="skip" href="#main">Skip to content</a>
<p class="announce"><strong>15% off your first jar</strong> with code <strong>FIRSTJAR</strong> · Free US shipping over $${CFG.freeShipOver} · <a href="${HERO_URL}">Shop the 15 oz jar — $23.99</a></p>
<header class="header"><div class="wrap header__in">
  <a class="logo" href="/" aria-label="${BRAND.name} — home">${logoMark({ size: 40 })}</a>
  <nav class="nav" aria-label="Primary">${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}</nav>
  <div class="header__tools">
    <a class="icon-btn" href="/account/" aria-label="Account">${ICONS.user}</a>
    <button class="icon-btn" type="button" data-cart-open aria-label="Open cart" aria-controls="cart-drawer">${ICONS.cart}<span class="cart-count" data-cart-count aria-live="polite"></span></button>
    <button class="icon-btn menu-btn" type="button" data-menu-open aria-label="Open menu" aria-controls="mobile-nav">${ICONS.menu}</button>
  </div></div></header>
<div class="mobile-nav" id="mobile-nav" aria-hidden="true" role="dialog" aria-label="Menu">
  <div class="mobile-nav__top"><a class="logo" href="/">${logoMark({ size: 40 })}</a><button class="icon-btn" type="button" data-menu-close aria-label="Close menu">${ICONS.close}</button></div>
  <nav aria-label="Mobile">${NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}<a href="/gift-guide/">Gift guide</a><a href="/account/">Account</a></nav>
  <div class="mobile-nav__foot"><a href="/faq/">FAQ</a><a href="/shipping/">Shipping &amp; delivery</a><a href="/contact/">Contact</a></div>
</div>`;
}

function drawer() {
  return `<div class="drawer-backdrop"></div>
<aside class="drawer" id="cart-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <div class="drawer__head"><h2 id="drawer-title">Your cart</h2><button class="icon-btn" type="button" data-drawer-close aria-label="Close cart">${ICONS.close}</button></div>
  <div class="drawer__body" data-drawer-lines></div>
  <div class="drawer__foot" data-drawer-foot hidden></div>
</aside>
<div class="capture-backdrop"></div>
<div class="capture" id="capture" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="capture-title">
  <button class="icon-btn capture__close" type="button" data-capture-close aria-label="Close">${ICONS.close}</button>
  <div data-capture-body>
    <img class="fe-mark" src="/assets/img/logo.png" width="48" height="48" alt="" decoding="async">
    <h2 id="capture-title">Take 15% off your first jar</h2>
    <p>One letter a month from the kitchen — new batches, recipes, and the occasional early jar. Your code arrives the moment you join.</p>
    <form novalidate>
      <label class="sr-only" for="capture-email">Email address</label>
      <input class="input" id="capture-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
      <button class="btn btn--primary btn--block" type="submit">Send my 15% code</button>
      <button class="btn btn--link tiny mx-auto" type="button" data-capture-close>No thanks, I'll pay full price</button>
    </form>
    <p class="tiny" style="margin-top:1rem">No spam, ever. Unsubscribe in one tap. <a href="/privacy/">Privacy</a>.</p>
  </div>
</div>
<div class="cookie" id="cookie" role="region" aria-label="Cookie notice"><p>Essential cookies only, unless you say otherwise. <a href="/cookies/">Details</a></p><div class="cluster"><button class="btn btn--primary btn--sm" type="button" data-cookie="all">Accept all</button><button class="btn btn--ghost btn--sm" type="button" data-cookie="essential">Essential only</button></div></div>`;
}

function footer() {
  const col = (t, items) => `<div><h3>${t}</h3><ul>${items.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></div>`;
  return `<footer class="footer"><div class="wrap">
  <div class="footer__news"><div><h2>Notes from the kitchen</h2><p>One letter a month: new batches, recipes, and the occasional early jar. 15% off your first order (up to $5) when you join.</p></div>
    <form class="news-form" data-news-form novalidate><label class="sr-only" for="news-email">Email address</label><input class="input" id="news-email" type="email" name="email" placeholder="you@example.com" autocomplete="email" required><button class="btn btn--on-dark" type="submit">Send my code</button><p class="small">No spam, ever. Unsubscribe in one tap. <a href="/privacy/">Privacy</a>.</p></form></div>
  <div class="footer__grid">
    <div class="footer__brand"><a class="logo" href="/">${logoMark({ size: 40 })}</a><p>${BRAND.positioning}</p>
      <div class="footer__promise"><div>${ICONS.truck}<span>Free US shipping over $${CFG.freeShipOver} · ships in 1–2 business days</span></div><div>${ICONS.refresh}<span>30-day happiness guarantee — if a jar isn’t for you, we’ll make it right</span></div><div>${ICONS.leaf}<span>Raw honey + fresh ginger · small batches · nothing else</span></div></div></div>
    ${col("Shop", FOOTER.shop)}${col("Functional Elixirs", FOOTER.about)}${col("Help", FOOTER.help)}
  </div>
  <div class="footer__bottom"><div><p>© ${new Date().getFullYear()} ${BRAND.legal} · Made in the USA</p><p class="disclaimer" style="margin-top:.5rem">${BRAND.disclaimer}</p></div><ul>${FOOTER.legal.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul><div class="pay-marks" aria-label="Accepted payments"><span>APPLE PAY</span><span>G PAY</span><span>VISA</span><span>MC</span><span>AMEX</span></div></div>
</div></footer>`;
}

/* The guarantee, given a name and a position next to the price (offer-strategist rec). */
export const guaranteeBlock = () => `<div class="guarantee">
  <strong>${ICONS.shield} Open the jar. Then decide.</strong>
  <p>Take it every morning for thirty days. If it isn't for you, write to us — we'll refund you. An opened jar is fine; please don't ship it back. <a href="/returns/">How it works</a></p>
</div>`;

export function page({ title, description, path, body, type = "website", image = OG_DEFAULT, jsonld: ld = [], breadcrumbs: bc, noindex = false, bodyClass = "", published, modified, extraHead = "" }) {
  const fullTitle = title.includes(BRAND.name) ? title : `${title} | ${BRAND.name}`;
  const url = abs(path);
  const graphs = [jsonld.org(), jsonld.site(), ...(bc ? [jsonld.breadcrumbs(bc)] : []), ...ld];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? `<meta name="robots" content="noindex, nofollow">` : `<meta name="robots" content="index, follow, max-image-preview:large">`}
<meta name="theme-color" content="#F6F0E6">
<meta name="color-scheme" content="light">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/img/favicon-64.png" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preload" href="/assets/css/site.css?v=${CSS_V}" as="style">
<link rel="stylesheet" href="/assets/css/site.css?v=${CSS_V}">
<meta property="og:type" content="${type === "product" ? "product" : type === "article" ? "article" : "website"}">
<meta property="og:site_name" content="${BRAND.name}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(description)}">
${published ? `<meta property="article:published_time" content="${published}">` : ""}${modified ? `<meta property="article:modified_time" content="${modified}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">
<script type="application/ld+json">${JSON.stringify(graphs)}</script>
${extraHead}
</head>
<body class="${bodyClass}">
${header()}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${drawer()}
<script type="application/json" id="sw-catalog">${catalogJSON()}</script>
<script src="/assets/js/site.js?v=${JS_V}" defer></script>
</body>
</html>`;
}

/* Bundle tiers — the buy buttons follow the selected radio (see initTiers in site.js). */
export function bundleTiers(ids, { selected = 0 } = {}) {
  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const base = items[0];
  return `<fieldset class="tiers" data-tiers>
    <legend class="sr-only">Choose your pack</legend>
    <div class="tiers__head"><strong>Choose your pack</strong><span>Two ships free</span></div>
    ${items.map((p, i) => {
      const jars = p.id === "hg-trio" ? 3 : p.id === "hg-duo" ? 2 : 1;
      const each = p.price / jars;
      const save = p.compareAt ? p.compareAt - p.price : 0;
      const pct = p.compareAt ? Math.round((save / p.compareAt) * 100) : 0;
      const badge = save ? `<span class="tier__save ${i === items.length - 1 ? "tier__save--best" : ""}">${i === 1 ? "Most popular · " : ""}save ${money(save)}</span>` : "";
      return `<label class="tier ${i === 1 ? "tier--pop" : ""}">
        <input type="radio" name="tier" value="${p.id}" ${i === selected ? "checked" : ""}>
        <span class="tier__main"><span class="tier__qty">${jars} jar${jars > 1 ? "s" : ""}</span><span class="tier__meta">${jars === 1 ? "15 oz · about six weeks" : jars === 2 ? "30 oz · one to keep, one to give" : "45 oz · the whole household"}${p.price >= CFG.freeShipOver ? " · ships free" : ""}</span></span>
        <span class="tier__right"><span class="tier__price">${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}${money(p.price)}</span><span class="tier__each">${money(each)} each</span></span>
        ${badge}</label>`;
    }).join("")}
  </fieldset>`;
}

export const valueBullets = () => `<div class="value-bullets">
  <div>${ICONS.check}<span><strong>Two ingredients.</strong> Raw honey and fresh ginger root — never powder, never extract.</span></div>
  <div>${ICONS.check}<span><strong>No added sugar</strong>, colours, flavourings or preservatives.</span></div>
  <div>${ICONS.refresh}<span><strong>30-day happiness guarantee.</strong> Don't love it? We'll make it right, jar or no jar.</span></div>
</div>`;

export { stars, PRODUCTS, ICONS, esc, money, BRAND, CFG, abs, SITE_URL, HERO_URL, logoMark, REVIEWS_VERIFIED };
