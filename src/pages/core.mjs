/* Home · Shop · Product (all SKUs) · Collections · Cart · Checkout · Confirmation · Track */
import { page, jsonld, breadcrumbs, productCard, applePayButton, faqList, ctaBand, stars, ICONS, esc, money, BRAND, CFG, abs, HERO_URL, bundleTiers, valueBullets } from "../layout.mjs";
import { PRODUCTS, HERO, COLLECTIONS, byId } from "../products.mjs";
import { art, altFor, photo } from "../art.mjs";
import { ARTICLES } from "../articles.mjs";

const REVIEWS = [
  { q: "I bought it for the ginger and stayed for the ritual. One spoon in warm water before the kids are up. Six weeks in and I’ve ordered the two-jar set.", n: "Danielle R.", w: "Sacramento, CA" },
  { q: "Real ginger — you can see the threads in the honey. Sweet first, then that slow warmth. It replaced sugar in my tea entirely.", n: "Marcus T.", w: "Austin, TX" },
  { q: "Gave the gift box to my mother-in-law. She sent a photo of the jar on her windowsill the next morning. That has never happened with a gift before.", n: "Priya S.", w: "Portland, OR" },
];
const reviewCard = (r) => `<article class="review reveal"><div class="rating">${stars(5)}<span class="sr-only">5 out of 5 stars</span></div><blockquote>“${r.q}”</blockquote><footer><span>${r.n} · ${r.w}</span><span class="verified">${ICONS.check} Verified buyer</span></footer></article>`;

const USES = [
  ["By the spoonful", "Straight from the jar. The simplest way, and our mother’s favourite.", ICONS.spoon],
  ["Morning ritual", "One teaspoon in warm water for a slow, clear start to the day.", ICONS.sun],
  ["Tea time", "In place of sugar in black tea, chai or rooibos.", ICONS.cup],
  ["With lemon", "Warm water, half a lemon, one spoon. A tonic without the fuss.", ICONS.drop],
  ["Breakfast", "Drizzled over oatmeal, yogurt, granola or hot buttered toast.", ICONS.leaf],
  ["Smoothies", "A spoon blended in reads as fresh, not sweet.", ICONS.refresh],
  ["In the kitchen", "Dressings, marinades, glazes for salmon and roasted roots.", ICONS.root],
  ["Evening ritual", "Stirred into a warm caffeine-free cup to close the day.", ICONS.moon],
];

/* ---------------- HOME ---------------- */
function home() {
  const p = HERO;
  const featured = PRODUCTS.filter((x) => x.featured).slice(0, 3);
  const body = `
<section class="hero"><div class="wrap hero__grid">
  <div class="hero__copy">
    <p class="eyebrow">Raw honey · fresh ginger · nothing else</p>
    <h1>Sweet first. Then the warmth.</h1>
    <p class="lede">The two-ingredient jar our mother made every morning for herself. One spoon in warm water — and the day starts differently.</p>
    <div class="hero__proof">${stars(p.rating)}<span><strong>${p.rating}</strong> · <a href="#reviews">${p.reviews} reviews</a></span><span aria-hidden="true">·</span><span class="stock" data-tier-stock data-stock="${p.id}">In stock</span></div>
    <div class="hero__ctas" style="max-width:28rem" data-buy-anchor>
      ${bundleTiers(["hg-15", "hg-duo", "hg-trio"], { selected: 0 })}
      <div class="express" style="margin-top:var(--s-4)">
        <button class="btn btn--primary btn--block" type="button" data-add="${p.id}" data-tier-add style="min-height:3.25rem">Add to cart — <span data-tier-label>${money(p.price)}</span></button>
        ${applePayButton(`data-express-buy="${p.id}" data-tier-express aria-label="Buy now with Apple Pay"`)}
      </div>
      <p class="urgency" style="margin-top:var(--s-4)" data-dispatch><strong>Ships today</strong> if you order before 1pm PT</p>
      <p class="small muted" data-tier-ship style="margin-top:var(--s-2)"></p>
    </div>
    <div class="hero__meta"><span>${ICONS.truck} Free shipping over $${CFG.freeShipOver}</span><span>${ICONS.refresh} 30-day guarantee</span><span>${ICONS.leaf} Made in the USA</span></div>
  </div>
  <div class="hero__art vt-hero">${art("hero", p, { alt: altFor(p, "hero"), anim: true, className: "scene--live" })}<div class="hero__tag"><strong>${esc(p.name)}</strong><span>15 oz (425 g) · ${money(p.price)}</span></div></div>
</div></section>

<section class="proof"><div class="wrap proof__in">
  <div class="proof__item">${stars(5)}<strong>${p.rating}</strong><span>${p.reviews} REVIEWS</span></div>
  <div class="proof__item"><strong>2</strong><span>INGREDIENTS, THAT'S ALL</span></div>
  <div class="proof__item"><strong>30</strong><span>DAY GUARANTEE</span></div>
  <div class="proof__item"><strong>1–2</strong><span>DAYS TO DISPATCH</span></div>
</div></section>

<div class="ribbon" aria-hidden="true"><div class="ribbon__track">${"<span>Raw honey</span><span>Fresh ginger</span><span>Nothing else</span><span>Scoop</span><span>Stir</span><span>Sip</span><span>Small batch</span><span>Made in the USA</span>".repeat(2)}</div></div>

<section class="section"><div class="wrap split">
  <div class="marquee-photo reveal">${photo("jars")}</div>
  <div class="stack reveal" style="--flow:var(--s-4)">
    <p class="eyebrow">Our story</p>
    <h2>It started with our mom.</h2>
    <p class="lede">Looking for natural ways to support how she felt, she began stirring honey and fresh ginger together every morning. She told us how much better her days felt. Naturally, we wanted to try it too.</p>
    <p>We fell in love with more than the taste. It became a daily ritual that leaves us energized yet calm — a sense of balance that simply feels good. What began in her kitchen became something we believed was worth sharing.</p>
    <p><a class="btn btn--ghost" href="/our-story/">Read the whole story</a></p>
  </div>
</div></section>

<section class="section section--well"><div class="wrap">
  <div class="section-head center"><p class="eyebrow">The jar</p><h2>Honey with Fresh Ginger, three ways to bring it home</h2><p class="lede mx-auto measure">One recipe. The signature 15 oz, the everyday 8 oz, and the set that ships free.</p></div>
  <div class="products products--featured">${featured.map(productCard).join("")}</div>
  <p class="center" style="margin-top:var(--s-6)"><a class="btn btn--ghost" href="/shop/">Shop everything</a></p>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head"><p class="eyebrow">The ritual</p><h2>Scoop. Stir. Sip.</h2><p class="lede measure">Ninety seconds, one spoon, warm water. The whole practice — and the reason a jar lives on the counter, not in the pantry.</p></div>
  <ol class="ritual-steps" style="list-style:none;padding:0">
    <li class="ritual-step reveal"><h3>Scoop</h3><p>One teaspoon from the jar. Dry spoon, or the beechwood dipper.</p></li>
    <li class="ritual-step reveal"><h3>Stir</h3><p>Into 8 oz of warm — not boiling — water until the spoon comes up clean.</p></li>
    <li class="ritual-step reveal"><h3>Sip</h3><p>Sweet first. Then the ginger’s slow warmth. Take the minute.</p></li>
    <li class="ritual-step reveal"><h3>Make it yours</h3><p>Lemon, tea, oatmeal, a glaze. <a href="/ritual/">Eight ways to enjoy it →</a></p></li>
  </ol>
</div></section>

<section class="section section--sage"><div class="wrap">
  <div class="section-head center"><p class="eyebrow">How to enjoy it</p><h2>Spoon it. Stir it. Drizzle it. Make it yours.</h2></div>
  <div class="grid grid--4">${USES.map(([t, d, i]) => `<div class="fact reveal">${i}<div><strong>${t}</strong><span>${d}</span></div></div>`).join("")}</div>
</div></section>

<section class="section"><div class="wrap split split--reverse">
  <div class="hero__art reveal" style="aspect-ratio:4/5;box-shadow:var(--shadow-2)">${art("open", p, { alt: altFor(p, "open") })}</div>
  <div class="stack reveal" style="--flow:var(--s-5)">
    <div><p class="eyebrow">Two timeless ingredients</p><h2>Naturally powerful. Nothing added.</h2></div>
    <div class="fact-list">
      <div class="fact">${ICONS.root}<div><strong>Ginger — a root with a long tradition</strong><span>Used in food and traditional wellness practices for centuries. Fresh root, never powder or extract — you can see the threads in the jar.</span></div></div>
      <div class="fact">${ICONS.drop}<div><strong>Honey — nature’s golden sweetener</strong><span>Rich, raw and unfiltered. A treasured food across cultures for generations, and the reason the jar tastes the way it does.</span></div></div>
      <div class="fact">${ICONS.leaf}<div><strong>Better together</strong><span>Sweet, warming and slightly spicy — a combination that makes everyday wellness feel less like a routine and more like a ritual.</span></div></div>
    </div>
    <p><a class="btn btn--ghost" href="/sourcing/">Ingredients &amp; sourcing</a></p>
  </div>
</div></section>

<section class="section section--well"><div class="wrap">
  <div class="section-head center"><p class="eyebrow">From the counter</p><h2>What people say after the first jar</h2><div class="rating" style="justify-content:center;margin-top:var(--s-3)">${stars(5)}<span>4.9 · ${p.reviews} reviews</span></div></div>
  <div class="grid grid--3">${REVIEWS.map(reviewCard).join("")}</div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head" style="display:flex;justify-content:space-between;align-items:baseline;gap:var(--s-4);flex-wrap:wrap"><div><p class="eyebrow">Journal</p><h2>Notes from the kitchen</h2></div><a class="btn btn--link" href="/journal/">All posts →</a></div>
  <div class="grid grid--3">${ARTICLES.slice(0, 3).map((a) => `<article class="acard reveal"><div class="acard__media">${a.photo ? photo(a.photo) : art(a.art, p, { alt: a.title })}</div><span class="meta">${a.tag} · ${a.readTime} min read</span><h3><a href="${a.url}">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p></article>`).join("")}</div>
</div></section>
${ctaBand()}`;
  return { path: "/", html: page({ title: `${BRAND.name} — Honey with Fresh Ginger | Nature’s Daily Elixir`, description: "Rich raw honey infused with real fresh ginger. Two ingredients, one daily ritual — scoop, stir, sip. 15 oz jar $23.99, free US shipping over $40, Apple Pay checkout.", path: "/", body, jsonld: [jsonld.product(p)] }) };
}

/* ---------------- SHOP ---------------- */
function shop() {
  const body = `${breadcrumbs([{ name: "Shop", href: "/shop/" }])}
<div class="wrap page-head"><p class="eyebrow">Shop</p><h1>One honey. Every size of ritual.</h1><p class="lede measure--wide">Everything here is the same jar in different amounts — raw honey, fresh ginger — plus the dipper made to fit it. Free US shipping over $${CFG.freeShipOver}. Use code <strong>FIRSTJAR</strong> for 15% off your first order.</p></div>
<section class="section--tight"><div class="wrap"><div class="products">${PRODUCTS.map(productCard).join("")}</div></div></section>
<section class="section"><div class="wrap--narrow"><h2 class="center" style="margin-bottom:var(--s-5)">Before you choose</h2>${faqList([
  ["Which size should I start with?", `The <a href="${HERO_URL}">15 oz jar</a> is about six weeks of daily spoonfuls and the best value per ounce. The <a href="/shop/honey-with-fresh-ginger-8oz/">8 oz</a> is right for a first try or a gift.`],
  ["Is it the same recipe in every jar?", "Yes. Raw honey and fresh ginger root, blended in small batches. Only the amount changes."],
  ["How long does a jar last?", "Honey is naturally shelf-stable. For peak ginger flavour, enjoy within 12 months of opening — see the date on the base. <a href='/journal/how-to-store-honey-and-why-it-crystallizes/'>Storage tips</a>."],
])}</div></section>`;
  return { path: "/shop/", html: page({ title: "Shop Honey with Fresh Ginger — 8 oz, 15 oz, sets & gifts", description: "Shop Functional Elixirs Honey with Fresh Ginger: the 15 oz signature jar ($23.99), 8 oz everyday jar, two-jar set, gift box and beechwood dipper. Free US shipping over $40.", path: "/shop/", body, breadcrumbs: [{ name: "Shop", href: "/shop/" }] }) };
}

function collection(slug) {
  const c = COLLECTIONS[slug]; const items = PRODUCTS.filter(c.filter); const path = `/collections/${slug}/`;
  const body = `${breadcrumbs([{ name: "Shop", href: "/shop/" }, { name: c.title, href: path }])}
<div class="wrap page-head"><p class="eyebrow">Collection</p><h1>${c.h1}</h1><p class="lede measure--wide">${c.lede}</p></div>
<section class="section--tight"><div class="wrap"><div class="products">${items.map(productCard).join("")}</div></div></section>
<section class="section--tight"><div class="wrap--narrow center"><p class="muted">Not sure? Read <a href="/journal/the-morning-ritual-honey-ginger-warm-water/">how the morning ritual works</a> or browse the <a href="/gift-guide/">gift guide</a>.</p></div></section>${ctaBand()}`;
  return { path, html: page({ title: c.title, description: c.description, path, body, breadcrumbs: [{ name: "Shop", href: "/shop/" }, { name: c.title, href: path }] }) };
}

/* ---------------- PRODUCT ---------------- */
function product(p) {
  const variants = p.type === "Accessory" ? ["cup", "front", "open", "hero"] : p.art === "hero" ? ["hero", "front", "open", "cup"] : [p.art, ...["hero", "front", "open", "cup"].filter((v) => v !== p.art)];
  const faq = p.type === "Accessory" ? [
    ["Does it fit the jar?", "Yes — the dipper was chosen for the jar’s wide mouth and is short enough to rest inside with the lid off."],
    ["How do I clean it?", "Rinse in warm water and dry upright. No dishwasher. A drop of food-safe mineral oil once a year keeps the wood happy."],
  ] : [
    ["How do I use it?", `One teaspoon in about 8 oz of warm (not boiling) water is the classic. It’s also a one-for-one swap for sugar in tea, and works in oats, smoothies, dressings and glazes. <a href="/ritual/">The ritual →</a>`],
    ["Is the ginger fresh?", "Yes — fresh ginger root, never powder or extract. You can see the ginger threads suspended in the honey."],
    ["Does it need refrigeration?", `No. Keep it at room temperature with the lid closed. Raw honey may crystallize; that’s natural — <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">here’s how to bring it back</a>.`],
    ["Is it safe for children?", "Honey should not be given to infants under 12 months. For everyone else, it’s food — enjoy it as you would any honey."],
    ["Is it vegan / gluten-free?", "It contains honey, so it isn’t vegan. It is naturally gluten-free with no added sugar, colours or preservatives."],
  ];
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
  const body = `${breadcrumbs([{ name: "Shop", href: "/shop/" }, { name: p.name, href: p.url }])}
<section class="wrap pdp">
  <div class="pdp__gallery"><div class="gallery" data-gallery>
    <div class="gallery__main vt-hero" tabindex="0" aria-label="Product images — use arrow keys to browse">${variants.map((v, i) => `<div data-slide ${i ? "hidden" : ""}>${art(v, p, { alt: altFor(p, v), anim: i === 0, className: i === 0 ? "scene--live" : "" })}</div>`).join("")}</div>
    <div class="gallery__thumbs" role="group" aria-label="Choose image">${variants.map((v, i) => `<button type="button" aria-current="${i === 0}" aria-label="${esc(altFor(p, v))}">${art(v, p, { alt: "" })}</button>`).join("")}</div>
  </div></div>
  <div class="pdp__buy">
    <div class="pdp__title"><p class="eyebrow">${esc(p.type)}${p.badge ? ` · ${esc(p.badge)}` : ""}</p><h1>${esc(p.name)}</h1><p class="sub">${esc(p.sub)}</p></div>
    <div class="rating">${stars(p.rating)}<span>${p.rating} · <a href="#reviews">${p.reviews} reviews</a></span></div>
    <div class="pdp__price"><span class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</span><span class="stock" data-stock="${p.id}">In stock</span></div>
    <p class="muted">${esc(p.short)}</p>
    <div class="notes">${p.notes.map((n, i) => `<div><small>${["Taste", "Then", "Finish"][i] || "Note"}</small><strong>${esc(n)}</strong></div>`).join("")}</div>
    ${p.id === "hg-15" ? bundleTiers(["hg-15", "hg-duo", "hg-trio"], { selected: 0 }) : ""}
    <div class="pdp__actions" data-buy-anchor>
      ${p.id === "hg-15" ? "" : `<div class="qty" role="group" aria-label="Quantity"><button type="button" data-dec aria-label="Decrease quantity">−</button><input type="number" data-qty-input inputmode="numeric" min="1" max="${Math.max(1, p.stock)}" value="1" aria-label="Quantity"></div>`}
      <button class="btn btn--primary btn--block" type="button" data-add="${p.id}" ${p.id === "hg-15" ? "data-tier-add" : ""} style="min-height:3.25rem;grid-column:${p.id === "hg-15" ? "1 / -1" : "auto"}">Add to cart — <span data-tier-label>${money(p.price)}</span></button>
    </div>
    <p class="urgency" data-dispatch><strong>Ships today</strong> if you order before 1pm PT</p>
    <div class="express">
      ${applePayButton(`data-express-buy="${p.id}" ${p.id === "hg-15" ? "data-tier-express" : ""} aria-label="Buy now with Apple Pay"`)}
      <div class="express__secondary"><button class="btn btn--gpay" type="button" data-express-buy="${p.id}" aria-label="Buy with Google Pay"><strong style="color:#4285F4">G</strong>&nbsp;Pay</button><button class="btn btn--shop-pay" type="button" data-express-buy="${p.id}" aria-label="Buy with Shop Pay">Shop <span style="font-style:normal;font-weight:400">Pay</span></button></div>
      <p class="express__or">or pay with card at checkout</p>
    </div>
    <div class="ship-snippet">
      <div>${ICONS.truck}<span><strong data-ship-estimate="${p.id}">Arrives in 3–5 business days</strong> · Free shipping over $${CFG.freeShipOver} · <a href="/shipping/">Rates &amp; calculator</a></span></div>
      <div>${ICONS.refresh}<span>30-day happiness guarantee. Not for you? <a href="/returns/">We’ll make it right.</a></span></div>
      <div>${ICONS.lock}<span>Secure checkout · Apple Pay, Google Pay, all major cards</span></div>
    </div>
    ${valueBullets()}
    <div class="acc">
      <details open><summary>How to enjoy it</summary><div class="acc__body">
        <div class="brew"><div><strong>${esc(p.use.spoon)}</strong><small>Scoop</small></div><div><strong>${esc(p.use.water)}</strong><small>Stir into</small></div><div><strong>${esc(p.use.when)}</strong><small>When</small></div><div><strong style="font-size:var(--fs-base)">${esc(p.use.also)}</strong><small>Also</small></div></div>
        <p>${p.type === "Accessory" ? "Twist the dipper in the jar, lift, and let the honey spiral off the end into your cup. Rest it on a small dish between uses." : `Sweet first, then the ginger’s slow warmth. Warm — not boiling — water keeps the fresh ginger bright. <a href="/ritual/">The full ritual, and eight ways to use the jar →</a>`}</p></div></details>
      <details><summary>Ingredients</summary><div class="acc__body"><p>${esc(p.ingredients)}</p><p>${esc(p.origin)}. No added sugar, colours, flavours or preservatives. Naturally gluten-free. Not suitable for infants under 12 months.</p></div></details>
      <details><summary>Storage</summary><div class="acc__body"><p>Room temperature, lid closed, dry spoon. Raw honey may crystallize over time — that’s natural. Warm the closed jar in a bowl of warm water to restore. <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">Storage guide →</a></p></div></details>
      <details><summary>Shipping &amp; returns</summary><div class="acc__body"><p>Ships in 1–2 business days from the USA. Standard $5.95 (free over $${CFG.freeShipOver}), Express $14, local pickup free. Unopened jars can be returned within ${CFG.returnsDays} days; if an opened jar isn’t for you, tell us and we’ll make it right. <a href="/shipping/">Shipping</a> · <a href="/returns/">Returns</a></p></div></details>
    </div>
  </div>
</section>

<section class="section"><div class="wrap split">
  <div class="stack reveal" style="--flow:var(--s-4)"><p class="eyebrow">Why this jar</p><h2>${p.type === "Accessory" ? "Made for the wide mouth." : "From our mother’s counter."}</h2><p class="lede">${esc(p.story)}</p><p><a href="/our-story/">Our story →</a></p></div>
  <div class="marquee-photo reveal">${photo(p.type === "Accessory" ? "ritual" : "jars")}</div>
</div></section>

<section class="section section--well" id="reviews"><div class="wrap"><div class="section-head center"><p class="eyebrow">Reviews</p><h2>${p.rating} out of 5</h2><p class="muted">${p.reviews} verified reviews</p></div><div class="grid grid--3">${REVIEWS.map(reviewCard).join("")}</div></div></section>

<section class="section"><div class="wrap--narrow"><h2 class="center" style="margin-bottom:var(--s-5)">Questions</h2>${faqList(faq)}</div></section>

<section class="section section--well"><div class="wrap"><div class="section-head"><p class="eyebrow">Also</p><h2>Other sizes &amp; sets</h2></div><div class="products">${related.map(productCard).join("")}</div></div></section>

<div class="deskbar" id="deskbar"><div class="wrap deskbar__in">
  <div class="deskbar__thumb">${art("front", p, { alt: "" })}</div>
  <div class="deskbar__info"><strong>${esc(p.name)}</strong><span>${esc(p.size)} · <span data-tier-price>${money(p.price)}</span></span></div>
  <div class="deskbar__actions">
    ${applePayButton(`data-express-buy="${p.id}" ${p.id === "hg-15" ? "data-tier-express" : ""} aria-label="Buy now with Apple Pay"`).replace('btn--block', '')}
    <button class="btn btn--primary" type="button" data-add="${p.id}" ${p.id === "hg-15" ? "data-tier-add" : ""}>Add to cart — <span data-tier-label>${money(p.price)}</span></button>
  </div>
</div></div>
<div class="buybar" id="buybar"><div class="buybar__info"><strong>${esc(p.name)}</strong><span>${esc(p.size)} · ${money(p.price)}</span></div><div class="cluster" style="flex-wrap:nowrap"><button class="btn btn--apple-pay btn--sm" type="button" data-express-buy="${p.id}" aria-label="Buy with Apple Pay">${ICONS.apple} Pay</button><button class="btn btn--primary btn--sm" type="button" data-add="${p.id}">Add</button></div></div>`;
  return { path: p.url, html: page({ title: `${p.name} — ${p.sub} | ${money(p.price)}`, description: `${p.short} ${p.size}, ${money(p.price)}. Free US shipping over $${CFG.freeShipOver}. Apple Pay checkout.`, path: p.url, body, type: "product", image: abs(`/assets/img/og-${p.slug}.svg`), jsonld: [jsonld.product(p), jsonld.faq(faq)], breadcrumbs: [{ name: "Shop", href: "/shop/" }, { name: p.name, href: p.url }] }) };
}

/* ---------------- CART ---------------- */
const promoForm = () => `<form class="promo" data-promo-form novalidate><label class="sr-only" for="promo">Promo code</label><input class="input" id="promo" name="code" placeholder="Promo code" autocomplete="off"><button class="btn btn--soft" type="submit">Apply</button></form><p class="promo-msg" aria-live="polite"></p>`;
const shipCalc = () => `<form class="ship-calc" data-ship-calc novalidate>
  <div class="field-row"><div class="field"><label for="sc-country">Country</label><select class="select" id="sc-country" name="country"><option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="AU">Australia</option><option value="OTHER">Other</option></select></div>
  <div class="field"><label for="sc-zip">ZIP / postcode</label><input class="input" id="sc-zip" name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="94103"></div></div>
  <button class="btn btn--ghost btn--sm" type="submit">Estimate shipping</button>
  <div class="ship-calc__result" aria-live="polite"><p class="small muted">Enter a ZIP for a live estimate — standard, express and local pickup.</p></div></form>`;

function cart() {
  const body = `${breadcrumbs([{ name: "Cart", href: "/cart/" }])}
<div class="wrap page-head"><h1>Your cart</h1></div>
<section class="section--tight"><div class="wrap cart-layout">
  <div><div data-cart-page></div>
    <div data-cart-has hidden style="margin-top:var(--s-6)"><div class="field"><label for="note">Gift note or delivery instructions (optional)</label><textarea class="textarea" id="note" name="note" placeholder="“One spoon, warm water, before the phone. Thinking of you.”"></textarea></div></div>
  </div>
  <aside class="cart-layout__side summary"><h2>Summary</h2><div data-cart-summary></div>${promoForm()}<a class="btn btn--primary btn--block" href="/checkout/">Checkout</a>${applePayButton(`onclick="location.href='/checkout/?express=apple-pay'"`)}<p class="secure">${ICONS.lock} Secure checkout · guest or account</p><hr><h2 style="font-size:var(--fs-base)">Estimate shipping</h2>${shipCalc()}</aside>
</div></section>
<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Add to your order</p><h2>Goes well with the jar</h2></div><div class="products">${PRODUCTS.filter((x) => ["dipper", "hg-8", "hg-duo", "hg-gift"].includes(x.id)).map(productCard).join("")}</div></div></section>`;
  return { path: "/cart/", html: page({ title: "Cart", description: "Your Functional Elixirs cart — review your honey-ginger jars, apply a promo code, estimate shipping, and check out with Apple Pay or card.", path: "/cart/", body, noindex: true }) };
}

/* ---------------- CHECKOUT ---------------- */
function checkout() {
  const states = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" ");
  const body = `
<div class="wrap page-head"><div class="steps" aria-label="Checkout progress"><span>Cart</span><span aria-current="step">Information &amp; payment</span><span>Confirmation</span></div><h1>Checkout</h1></div>
<section class="section--tight"><div class="wrap">
  <div class="empty" data-checkout-empty hidden><p>Your cart is empty.</p><a class="btn btn--ghost btn--sm" href="/shop/">Shop the jar</a></div>
  <div class="checkout">
  <aside class="checkout__side summary"><h2>Order summary</h2><div data-summary-lines></div>${promoForm()}<div data-checkout-totals></div><p class="secure">${ICONS.lock} Payments encrypted end-to-end. We never store card numbers.</p></aside>
  <form id="checkout-form" class="form" novalidate>
    <section class="co-section">
      <h2>Express checkout</h2>
      <div class="express">${applePayButton('data-apple-pay')}<div class="express__secondary"><button class="btn btn--gpay" type="button" data-gpay><strong style="color:#4285F4">G</strong>&nbsp;Pay</button><button class="btn btn--shop-pay" type="button" data-shop-pay>Shop <span style="font-style:normal;font-weight:400">Pay</span></button></div><p class="express__or">or continue below</p></div>
    </section>
    <section class="co-section">
      <div class="co-section__head"><h2>Contact</h2><p class="small" data-guest-note>Have an account? <a href="/account/login/?next=/checkout/">Log in</a></p><p class="small" data-account-note hidden>Checking out with your account.</p></div>
      <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" required inputmode="email"><p class="error" id="email-err">Enter a valid email so we can send your receipt.</p></div>
      <label class="check"><input type="checkbox" name="news" checked> Email me the monthly note from the kitchen (unsubscribe any time)</label>
    </section>
    <section class="co-section">
      <h2>Shipping address</h2>
      <div class="field-row"><div class="field"><label for="first">First name</label><input class="input" id="first" name="first" autocomplete="given-name" required><p class="error">Required.</p></div><div class="field"><label for="last">Last name</label><input class="input" id="last" name="last" autocomplete="family-name" required><p class="error">Required.</p></div></div>
      <div class="field"><label for="address">Street address</label><input class="input" id="address" name="address" autocomplete="address-line1" required><p class="error">Required.</p></div>
      <div class="field"><label for="address2">Apt, suite, etc. <span class="muted">(optional)</span></label><input class="input" id="address2" name="address2" autocomplete="address-line2"></div>
      <div class="field-row field-row--3">
        <div class="field"><label for="city">City</label><input class="input" id="city" name="city" autocomplete="address-level2" required><p class="error">Required.</p></div>
        <div class="field"><label for="state">State</label><select class="select" id="state" name="state" autocomplete="address-level1" required><option value="">—</option>${states.map((s) => `<option>${s}</option>`).join("")}</select><p class="error">Required.</p></div>
        <div class="field"><label for="zip">ZIP</label><input class="input" id="zip" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="\\d{5}(-\\d{4})?" required><p class="error">5-digit ZIP.</p></div>
      </div>
      <div class="field"><label for="country">Country</label><select class="select" id="country" name="country" autocomplete="country"><option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="AU">Australia</option><option value="OTHER">Other</option></select></div>
      <div class="field"><label for="phone">Phone <span class="muted">(optional — for delivery questions only)</span></label><input class="input" id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
    </section>
    <section class="co-section">
      <h2>Delivery</h2>
      <div class="opt" data-rates role="radiogroup" aria-label="Shipping method"></div>
      <p class="small muted">Live estimate for your ZIP. Free standard shipping on orders over $${CFG.freeShipOver}. <a href="/shipping/">Shipping details</a></p>
    </section>
    <section class="co-section">
      <h2>Payment</h2>
      <div class="opt" role="radiogroup" aria-label="Payment method">
        <label><input type="radio" name="pay" value="card" checked><span><span class="opt__title">Credit or debit card</span><br><span class="opt__meta">Visa, Mastercard, Amex, Discover</span></span><span class="card-icons" aria-hidden="true"><span>VISA</span><span>MC</span><span>AMEX</span></span></label>
        <label><input type="radio" name="pay" value="paypal"><span><span class="opt__title">PayPal</span><br><span class="opt__meta">You’ll be redirected to PayPal to confirm</span></span><span></span></label>
      </div>
      <div class="card-fields" data-card-fields>
        <!-- REAL: replace these three inputs with a Stripe <PaymentElement> / Elements mount (div#card-element).
             Card data then never touches your DOM or server (PCI SAQ-A). -->
        <div class="field"><label for="cc">Card number</label><input class="input" id="cc" name="cc" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" pattern="[\\d ]{15,19}" required><p class="error">Enter a valid card number.</p></div>
        <div class="field-row"><div class="field"><label for="exp">Expiry</label><input class="input" id="exp" name="exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" pattern="\\d{2}\\s?/\\s?\\d{2}" required><p class="error">MM / YY</p></div><div class="field"><label for="cvc">Security code</label><input class="input" id="cvc" name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" pattern="\\d{3,4}" required><p class="error">3–4 digits.</p></div></div>
        <div class="field"><label for="ccname">Name on card</label><input class="input" id="ccname" name="ccname" autocomplete="cc-name" required><p class="error">Required.</p></div>
        <label class="check"><input type="checkbox" name="billing_same" checked> Billing address same as shipping</label>
      </div>
    </section>
    <section class="co-section">
      <h2>Save time next order <span class="muted small">(optional)</span></h2>
      <label class="check"><input type="checkbox" name="create_account"> Create an account with this email — orders, addresses and wishlist in one place</label>
      <div class="field"><label for="new_password">Password <span class="muted">(only if creating an account)</span></label><input class="input" id="new_password" name="new_password" type="password" autocomplete="new-password" minlength="8"><p class="help">8+ characters.</p></div>
      <label class="check"><input type="checkbox" name="save_address" checked> Save this address to my account</label>
    </section>
    <section class="co-section">
      <div class="field"><label for="gift">Gift note <span class="muted">(optional — we never include prices)</span></label><textarea class="textarea" id="gift" name="gift" style="min-height:5rem"></textarea></div>
      <button class="btn btn--primary btn--block" type="submit" style="min-height:3.25rem">Place order · <span data-total>—</span></button>
      <p class="small muted center">By placing your order you agree to our <a href="/terms/">Terms</a> and <a href="/privacy/">Privacy Policy</a>. ${CFG.returnsDays}-day happiness guarantee.</p>
    </section>
  </form>
  </div>
</div></section>`;
  return { path: "/checkout/", html: page({ title: "Checkout", description: "Secure checkout — Apple Pay, Google Pay, Shop Pay or card. Guest or account checkout with live shipping rates.", path: "/checkout/", body, noindex: true }) };
}

function confirmation() {
  return { path: "/order-confirmation/", html: page({ title: "Order confirmed", description: "Thank you — your Functional Elixirs order is confirmed. Order details, delivery estimate and tracking.", path: "/order-confirmation/", body: `<section class="wrap" data-confirmation style="padding-bottom:var(--section)"></section>`, noindex: true }) };
}

function track() {
  const body = `${breadcrumbs([{ name: "Track order", href: "/track-order/" }])}
<div class="wrap page-head page-head--center"><p class="eyebrow">Track</p><h1>Where’s my jar?</h1><p class="lede measure">Enter your order number (FE-XXXXXX) or tracking number (starts with 1ZFE). Both are in your confirmation email.</p></div>
<section class="section--tight"><div class="wrap--narrow stack" style="--flow:var(--s-6)">
  <form id="track-form" class="form-card form" novalidate><div class="field"><label for="track-q">Order or tracking number</label><input class="input" id="track-q" name="q" placeholder="FE-ABC123" autocomplete="off" required></div><button class="btn btn--primary" type="submit">Track order</button></form>
  <div data-track-result aria-live="polite"></div>
  <p class="small muted center">Can’t find your number? <a href="/contact/">Contact us</a> with the email you ordered with — or <a href="/account/">log in</a> to see all your orders.</p>
</div></section>`;
  return { path: "/track-order/", html: page({ title: "Track your order", description: "Track your Functional Elixirs order by order number or tracking number — see when your honey-ginger jar was packed, shipped, and will arrive.", path: "/track-order/", body, breadcrumbs: [{ name: "Track order", href: "/track-order/" }] }) };
}

export default () => [home(), shop(), ...Object.keys(COLLECTIONS).map(collection), ...PRODUCTS.map(product), cart(), checkout(), confirmation(), track()];
