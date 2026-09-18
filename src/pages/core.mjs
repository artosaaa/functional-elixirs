/* Home · Shop · Product (all SKUs) · Collections · Cart · Checkout · Confirmation · Track */
import { BEE, BEE_FLY, bees, LINE } from "../site.mjs";
import { page, jsonld, breadcrumbs, productCard, stripeHead, faqList, ctaBand, stars, ICONS, esc, money, BRAND, CFG, abs, HERO_URL, valueBullets, guaranteeBlock, REVIEWS_VERIFIED } from "../layout.mjs";
import { PRODUCTS, HERO, byId } from "../products.mjs";
import { art, altFor, photo, photoAlt, resolvedPhoto } from "../art.mjs";
import { existsSync } from "node:fs";

/* No testimonials yet, and inventing them is not an option: the card renders a
   name, a city and a "Verified buyer" badge, which is a representation about a
   real person who bought something. Six placeholders used to live here — three
   of them praising a Two-jar set, a Gift box and a 3-pack that the catalogue no
   longer contains, and one promising delivery "in two days".

   To publish real ones: put them in REVIEWS as
     { q: "...", n: "First L.", w: "City, ST", t: "15 oz jar" }
   with the buyer's permission, set rating/reviews in products.mjs to the real
   figures, and flip REVIEWS_VERIFIED in site.mjs. The section stays on the
   Questions block until all three are true. */
const REVIEWS = [];
const reviewCard = (r) => `<article class="review reveal"><div class="rating">${stars(5)}<span class="sr-only">5 out of 5 stars</span>${r.t ? `<span class="small muted">${esc(r.t)}</span>` : ""}</div><blockquote>“${r.q}”</blockquote><footer><span>${r.n} · ${r.w}</span><span class="verified">${ICONS.check} Verified buyer</span></footer></article>`;

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

/* keep a "·" separator attached to the word before it, so a wrapped value never
   starts a line with a lone middot */
const gluePunct = (t) => String(t).replace(/ · /g, "\u00A0· ");

/* ---------------- HOME ---------------- */
function home() {
  const p = HERO;
  /* three, not four — the two garden-table frames were near-duplicates of each other */
  /* The three photographs that used to sit here were stock-feeling holiday snapshots
     — a dim teapot, an English garden with event tents — none of which had anything
     to do with honey or ginger, and all of which undercut the product photography
     directly above them. Same treatment as the recipes hero strip: the row renders
     only for files actually present, so it stays empty until real photographs exist
     and comes back on its own the moment they are dropped in. */
  const GALLERY_DIR = new URL("../../assets/img/home/", import.meta.url);
  const gallery = [
    ["morning-ritual.jpg", "A spoonful of Functional Elixirs honey with fresh ginger being stirred into a mug of warm water"],
    ["jar-on-counter.jpg", "The Functional Elixirs jar open on a kitchen counter, the ginger threads visible in the honey"],
    ["breakfast-drizzle.jpg", "Honey with fresh ginger drizzled over a bowl of oats and fruit"],
  ].filter(([file]) => existsSync(new URL(file, GALLERY_DIR)));
  const features = [
    [LINE.leaf, "Natural ingredients", "Pure, simple, and sustainably sourced."],
    [LINE.honeycomb, "Functional benefits", "Thoughtfully crafted to support your well-being."],
    [LINE.cup, "Mindful moments", "Rituals that bring balance to your day."],
    [BEE, "Inspired by nature", "Created with care in harmony with the earth."],
  ];
  const trust = [[LINE.no, "No preservatives"], [LINE.drop, "No additives"], [LINE.jar, "Made in small batches"], [LINE.heart, "Made with love"]];
  const body = `
<section class="mk-hero">${bees([
  { top: "14%", from: "-8vw", to: "104vw", dur: 34, delay: 0, size: 1.5, tilt: 9, bob: 1.4 },
  { top: "62%", from: "106vw", to: "-10vw", dur: 46, delay: 6, size: 1.05, tilt: -7, bob: 1 },
  { top: "38%", from: "-12vw", to: "108vw", dur: 58, delay: 17, size: 0.85, tilt: 5, bob: 1.6 },
])}<div class="wrap mk-hero__in">
  <div class="mk-hero__copy reveal">
    <p class="mk-eyebrow">Nature’s Daily Elixir</p>
    <h1 class="mk-h1">Honey.<br>Ginger.<br>Wellness.</h1>
    <span class="mk-rule" aria-hidden="true"></span>
    <p class="mk-lede">A wholesome blend of raw honey and real ginger — crafted to nourish your body and elevate your every day.</p>
    <a class="btn btn--gold" href="/shop/">Shop now</a>
  </div>
  <div class="mk-hero__photo reveal"><img src="/assets/img/jar-in-grass-square.jpg" srcset="/assets/img/jar-in-grass-square-640.jpg 640w, /assets/img/jar-in-grass-square.jpg 1200w" sizes="(min-width: 56em) 50vw, 100vw" alt="A jar of Functional Elixirs Honey with Fresh Ginger, bamboo lid on, lying in bright green grass in full sun" width="1200" height="1200" fetchpriority="high" decoding="async"></div>
</div></section>

<section class="mk-signature"><div class="wrap mk-signature__in">
  <figure class="mk-signature__photo reveal"><img src="/assets/img/jar-on-board.jpg" srcset="/assets/img/jar-on-board-720.jpg 720w, /assets/img/jar-on-board.jpg 1200w" sizes="(min-width: 56em) 34vw, 74vw" alt="The 15 oz Functional Elixirs Honey with Fresh Ginger jar on a dark wooden board in a warm kitchen, a honey dipper trailing honey to its left and fresh ginger root, cut to show the flesh, to its right" width="1200" height="1600" loading="lazy" decoding="async"></figure>
  <div class="mk-signature__copy reveal">
    <p class="mk-eyebrow">The signature jar</p>
    <h2 class="mk-h2 mk-h2--left">${esc(p.name)}</h2>
    <span class="mk-rule" aria-hidden="true"></span>
    <p class="mk-price"><span class="mk-price__num">${money(p.price)}</span><span class="mk-price__sub">${esc(p.sub)}</span></p>
    <div class="mk-signature__acts">
      <button class="btn btn--gold" type="button" data-add="${p.id}">Add to cart</button>
      <a class="btn btn--link" href="${p.url}">Read the full story</a>
    </div>
    <p class="mk-signature__note">${ICONS.truck} Free US shipping over $${CFG.freeShipOver}</p>
  </div>
</div></section>

<section class="mk-nature">${bees([
  { top: "18%", from: "104vw", to: "-8vw", dur: 52, delay: 3, size: 1.15, tilt: -8, bob: 1.3 },
  { top: "74%", from: "-10vw", to: "106vw", dur: 64, delay: 21, size: 0.9, tilt: 6, bob: 1 },
])}<div class="wrap">
  <div class="mk-title reveal"><h2 class="mk-h2">Inspired by nature. Made for you.</h2><span class="mk-rule mk-rule--center" aria-hidden="true"></span></div>
  ${gallery.length ? `<div class="mk-gallery">${gallery.map(([file, alt], i) => `<figure class="reveal" style="--d:${i * 90}ms"><img src="/assets/img/home/${file}" alt="${esc(alt)}" width="900" height="900" loading="lazy" decoding="async"></figure>`).join("")}</div>` : ""}
  <div class="mk-features">${features.map(([ic, t, d], i) => `<div class="mk-feature reveal" style="--d:${i * 90}ms"><span class="mk-feature__icon">${ic}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>

<section class="stripes stripes--band"><div class="wrap"><div class="mk-band reveal">
  <span class="mk-band__bee" aria-hidden="true">${BEE_FLY}</span>
  <div class="mk-band__text"><h2 class="mk-h3">Bring Nature’s Daily Elixir into your life</h2><p>Wellness never tasted so good.</p></div>
  <a class="btn btn--gold" href="/shop/">Shop now</a>
</div></div></section>

<section class="mk-trust"><div class="wrap mk-trust__in">${trust.map(([ic, t]) => `<span>${ic}${t}</span>`).join("")}</div></section>`;
  return { path: "/", html: page({ title: `${BRAND.name} — Honey + Fresh Ginger | Nature’s Daily Elixir`, description: "A wholesome blend of raw honey and real fresh ginger, crafted from family tradition. Nature’s Daily Elixir — a 15 oz jar made in small batches in the USA.", path: "/", body, jsonld: [jsonld.product(p)] }) };
}

/* ---------------- SHOP ---------------- */
function shop() {
  const p = HERO;
  /* One SKU doesn't belong in a four-up grid — it lands as a single stranded tile.
     Present it instead; the grid comes back on its own if more products are added.
     Sold-out formats don't count towards that: they are listed under the jar you can
     actually buy rather than competing with it for the top of the page. */
  const forSale = PRODUCTS.filter((x) => x.stock > 0);
  const soldOut = PRODUCTS.filter((x) => x.stock <= 0);
  const single = forSale.length === 1;
  const body = `${breadcrumbs([{ name: "Shop", href: "/shop/" }])}
<div class="wrap page-head"><p class="eyebrow">Shop</p><h1>Honey with Fresh Ginger.</h1></div>
${single ? `<section class="section--tight shop-single-sec">${bees([
  { top: "12%", from: "-8vw", to: "104vw", dur: 44, delay: 2, size: 1.2, tilt: 8, bob: 1.3 },
  { top: "70%", from: "106vw", to: "-10vw", dur: 60, delay: 15, size: 0.9, tilt: -6, bob: 1.1 },
])}<div class="wrap shop-single">
  <figure class="shop-single__photo reveal">${art("hero", p, { alt: altFor(p, "hero"), anim: true, sizes: "(min-width: 56em) 42vw, 88vw" })}</figure>
  <div class="shop-single__copy reveal">
    <p class="eyebrow">${esc(p.badge || p.type)}</p>
    <p class="shop-single__sub">${esc(p.sub)}</p>
    <p class="mk-price"><span class="mk-price__num">${money(p.price)}</span><span class="mk-price__sub" data-stock="${p.id}">In stock</span></p>
    <div class="shop-single__acts">
      <div class="qty" role="group" aria-label="Quantity"><button type="button" data-dec aria-label="Decrease quantity">−</button><input type="number" data-qty-input inputmode="numeric" min="1" max="${Math.max(1, p.stock)}" value="1" aria-label="Quantity"></div>
      <button class="btn btn--gold" type="button" data-add="${p.id}">Add to cart — ${money(p.price)}</button>
    </div>
    <p class="shop-single__more"><a href="${p.url}">Ingredients, storage and the full story <span class="arrow" aria-hidden="true">→</span></a></p>
    <div class="shop-single__promise">
      <div>${ICONS.truck}<span>Free US shipping over $${CFG.freeShipOver}</span></div>
    </div>
  </div>
</div></section>` : `<section class="section--tight"><div class="wrap"><div class="products">${forSale.map(productCard).join("")}</div></div></section>`}
${soldOut.length ? `<section class="section--tight"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Not right now</p><h2>Back with the next batch</h2></div>
  <div class="products products--few">${soldOut.map(productCard).join("")}</div>
</div></section>` : ""}
`;
  return { path: "/shop/", html: page({ title: "Shop Honey with Fresh Ginger — 15 oz Jar", description: "Shop Functional Elixirs Honey with Fresh Ginger: the 15 oz signature jar, $23.99. Raw honey and fresh ginger root, nothing else. Free US shipping over $50.", path: "/shop/", body, breadcrumbs: [{ name: "Shop", href: "/shop/" }] }) };
}

/* ---------------- PRODUCT ---------------- */
function product(p) {
  /* the dipper renders one drawn scene, so it gets one frame rather than four identical thumbs */
  const allVariants = p.id === "dipper" ? ["dipper"] : p.type === "Accessory" ? ["cup", "front", "open", "hero"] : p.art === "hero" ? ["hero", "front", "open", "cup"] : [p.art, ...["hero", "front", "open", "cup"].filter((v) => v !== p.art)];
  /* several variants can resolve to the same photograph — showing the same jar twice in
     a four-thumbnail strip reads as a mistake, so keep one frame per distinct image */
  const seenSrc = new Set();
  const variants = allVariants.filter((v) => { const src = resolvedPhoto(p, v); if (!src) return true; if (seenSrc.has(src)) return false; seenSrc.add(src); return true; });
  /* a thumbnail strip of one is a button that does nothing — with a single frame, show the frame alone */
  const label = (v) => { const src = resolvedPhoto(p, v); return src ? photoAlt(p, src) : altFor(p, v); };
  const faq = p.type === "Accessory" ? [
    ["Does it fit the jar?", "Yes — the dipper was chosen for the jar’s wide mouth and is short enough to rest inside with the lid off."],
    ["How do I clean it?", "Rinse in warm water and dry upright. No dishwasher. A drop of food-safe mineral oil once a year keeps the wood happy."],
  ] : [
    ["How do I use it?", `One teaspoon in about 8 oz of warm (not boiling) water is the classic. It’s also a one-for-one swap for sugar in tea, and works in oats, smoothies, dressings and glazes. <a href="/recipes/">Recipes <span class="arrow" aria-hidden="true">→</span></a>`],
    ["Is the ginger fresh?", "Yes — fresh ginger root, never powder or extract. You can see the ginger threads suspended in the honey."],
    ["Does it need refrigeration?", `No. Keep it at room temperature with the lid closed. Raw honey may crystallize; that’s natural — stand the closed jar in warm water for 20–30 minutes and stir.`],
    ["Is it safe for children?", "Honey should not be given to infants under 12 months. For everyone else, it’s food — enjoy it as you would any honey."],
    ["Is it vegan / gluten-free?", "It contains honey, so it isn’t vegan. It is naturally gluten-free with no added sugar, colours or preservatives."],
  ];
  const body = `${breadcrumbs([{ name: "Shop", href: "/shop/" }, { name: p.name, href: p.url }])}
<section class="wrap pdp">
  <div class="pdp__gallery"><div class="gallery" data-gallery>
    <div class="gallery__main vt-hero" tabindex="0" aria-label="Product images — use arrow keys to browse">${variants.map((v, i) => `<div data-slide ${i ? "hidden" : ""}>${art(v, p, { alt: altFor(p, v), anim: i === 0, className: i === 0 ? "scene--live" : "" })}</div>`).join("")}</div>
    ${variants.length > 1 ? `<div class="gallery__thumbs" role="group" aria-label="Choose image">${variants.map((v, i) => `<button type="button" aria-current="${i === 0}" aria-label="${esc(label(v))}">${art(v, p, { alt: "" })}</button>`).join("")}</div>` : ""}
  </div></div>
  <div class="pdp__buy">
    <div class="pdp__title"><p class="eyebrow">${esc(p.type)}${p.badge ? ` · ${esc(p.badge)}` : ""}</p><h1>${esc(p.name)}</h1><p class="sub">${esc(p.sub)}</p></div>
    ${REVIEWS_VERIFIED ? `<div class="rating">${stars(p.rating)}<span>${p.rating} · <a href="#reviews">${p.reviews} reviews</a></span></div>` : ""}
    <div class="pdp__price"><span class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</span><span class="stock" data-stock="${p.id}">In stock</span></div>
    <p class="muted">${esc(p.short)}</p>
    <div class="notes">${p.notes.map((n, i) => `<div><small>${(p.type === "Accessory" ? ["Material", "Why", "Fit"] : ["Taste", "Then", "Finish"])[i] || "Note"}</small><strong>${esc(n)}</strong></div>`).join("")}</div>
    <div class="pdp__actions" data-buy-anchor>
      <div class="qty" role="group" aria-label="Quantity"><button type="button" data-dec aria-label="Decrease quantity">−</button><input type="number" data-qty-input inputmode="numeric" min="1" max="${Math.max(1, p.stock)}" value="1" aria-label="Quantity"></div>
      <button class="btn btn--primary btn--block" type="button" data-add="${p.id}" style="min-height:3.25rem">Add to cart — ${money(p.price)}</button>
    </div>
    <div class="objections">
      <p><strong>Worried it’s too hot?</strong> It’s honey first. The ginger arrives after, as warmth rather than heat.</p>
      <p><strong>How long does it last?</strong> ${esc(p.lasts)}</p>
      <p><strong>What if I change my mind?</strong> Send the jar back unopened and we’ll refund it in full — there’s no deadline. Return postage is yours. Once a jar is opened we can’t take it back: honey is food.</p>
    </div>
    <div class="express">
      <button class="btn btn--ghost btn--block" type="button" data-buy-now="${p.id}">Buy it now</button>
      <p class="express__or">Card, Apple&nbsp;Pay, Google&nbsp;Pay and Link at checkout</p>
    </div>
    <div class="ship-snippet">
      <div>${ICONS.truck}<span><strong data-ship-estimate="${p.id}">Arrives in 3–5 business days</strong> · Free shipping over $${CFG.freeShipOver} · <a href="/shipping/">Rates &amp; calculator</a></span></div>
      <div>${ICONS.refresh}<span>Unopened jars returnable for a full refund. <a href="/returns/">How returns work.</a></span></div>
      <div>${ICONS.lock}<span>Secure checkout · Apple Pay, Google Pay, all major cards</span></div>
    </div>
    ${valueBullets()}
    ${guaranteeBlock()}
    <div class="acc">
      <details open><summary>How to enjoy it</summary><div class="acc__body">
        ${p.type === "Accessory"
          ? `<div class="brew"><div><strong>${esc(p.size)}</strong><small>Length</small></div><div><strong>Beechwood</strong><small>Material</small></div><div><strong>${gluePunct(esc(p.use.also))}</strong><small>Care</small></div></div>`
          : `<div class="brew"><div><strong>${esc(p.use.spoon)}</strong><small>Scoop</small></div><div><strong>${esc(p.use.water)}</strong><small>Stir into</small></div><div><strong>${esc(p.use.when)}</strong><small>When</small></div><div><strong>${gluePunct(esc(p.use.also))}</strong><small>Also</small></div></div>`}
        <p>${p.type === "Accessory" ? "Twist the dipper in the jar, lift, and let the honey spiral off the end into your cup. Rest it on a small dish between uses." : `Sweet first, then the ginger’s slow warmth. Warm — not boiling — water keeps the fresh ginger bright. <a href="/recipes/">Ways to use the jar <span class="arrow" aria-hidden="true">→</span></a>`}</p></div></details>
      <details><summary>Ingredients</summary><div class="acc__body"><p>${esc(p.ingredients)}</p><p>${esc(p.origin)}. No added sugar, colours, flavours or preservatives. Naturally gluten-free. Not suitable for infants under 12 months.</p></div></details>
      <details><summary>Storage</summary><div class="acc__body"><p>Room temperature, lid closed, dry spoon. Raw honey may crystallize over time — that’s natural. Warm the closed jar in a bowl of warm water to restore.</p></div></details>
      <details><summary>Shipping &amp; returns</summary><div class="acc__body"><p>Packed and posted within ${CFG.dispatchDays} business days, then shipped within the US by standard mail — $5.95, free over $${CFG.freeShipOver}, 2–7 business days in transit. An unopened jar can be returned any time for a full refund, with return postage paid by you; opened jars can’t be returned. <a href="/shipping/">Shipping</a> · <a href="/returns/">Returns</a></p></div></details>
    </div>
  </div>
</section>

<section class="section"><div class="wrap split">
  <div class="stack reveal" style="--flow:var(--s-4)"><p class="eyebrow">Why this jar</p><h2>${p.type === "Accessory" ? "Made for the wide mouth." : "From our mother’s counter."}</h2><p class="lede">${esc(p.story)}</p><p><a href="/about-us/">Our story <span class="arrow" aria-hidden="true">→</span></a></p></div>
  <div class="marquee-photo reveal">${photo("jars")}</div>
</div></section>

<section class="section section--well" id="reviews"><div class="wrap">${REVIEWS_VERIFIED && REVIEWS.length && p.rating && p.reviews
  ? `<div class="section-head center"><p class="eyebrow">Reviews</p><h2>${p.rating} out of 5</h2><p class="muted">${p.reviews} verified reviews</p></div><div class="grid grid--3">${REVIEWS.slice(0, 3).map(reviewCard).join("")}</div>`
  : `<div class="wrap--narrow center stack" style="--flow:var(--s-4)"><p class="eyebrow">Questions</p><h2>Anything you want to ask, ask.</h2><p class="lede">Ingredients, storage, gifting, an order that hasn’t turned up — a person reads every message and replies within one business day.</p><p><a class="btn btn--ghost" href="/contact/">Write to us</a></p></div>`}</div></section>

<section class="section"><div class="wrap--narrow"><h2 class="center" style="margin-bottom:var(--s-5)">Questions</h2>${faqList(faq)}</div></section>



<div class="deskbar" id="deskbar"><div class="wrap deskbar__in">
  <div class="deskbar__thumb">${art("front", p, { alt: "" })}</div>
  <div class="deskbar__info"><strong>${esc(p.name)}</strong><span>${esc(p.size)} · ${money(p.price)}</span></div>
  <div class="deskbar__actions">
    <button class="btn btn--ghost" type="button" data-buy-now="${p.id}">Buy it now</button>
    <button class="btn btn--gold" type="button" data-add="${p.id}">Add to cart — ${money(p.price)}</button>
  </div>
</div></div>
<div class="buybar" id="buybar"><div class="buybar__info"><strong>${esc(p.name)}</strong><span>${esc(p.size)} · ${money(p.price)}</span></div><div class="cluster" style="flex-wrap:nowrap"><button class="btn btn--ghost btn--sm" type="button" data-buy-now="${p.id}">Buy now</button><button class="btn btn--primary btn--sm" type="button" data-add="${p.id}">Add</button></div></div>`;
  return { path: p.url, html: page({ title: `${p.name} — ${p.sub} | ${money(p.price)}`, description: `${p.short} ${p.size}, ${money(p.price)}. Free US shipping over $${CFG.freeShipOver}. Apple Pay checkout.`, path: p.url, body, type: "product", image: abs(`/assets/img/og-${p.slug}.svg`), jsonld: [jsonld.product(p), jsonld.faq(faq)], breadcrumbs: [{ name: "Shop", href: "/shop/" }, { name: p.name, href: p.url }] }) };
}

/* ---------------- CART ---------------- */
const promoForm = () => `<form class="promo" data-promo-form novalidate><label class="sr-only" for="promo">Promo code</label><input class="input" id="promo" name="code" placeholder="Promo code" autocomplete="off"><button class="btn btn--soft" type="submit">Apply</button></form><p class="promo-msg" aria-live="polite"></p>`;
const shipCalc = () => `<form class="ship-calc" data-ship-calc novalidate>
  <div class="field-row">
  <div class="field"><label for="sc-zip">ZIP code</label><input class="input" id="sc-zip" name="zip" inputmode="numeric" autocomplete="postal-code" placeholder="94103"></div></div>
  <button class="btn btn--ghost btn--sm" type="submit">Estimate shipping</button>
  <div class="ship-calc__result" aria-live="polite"><p class="small muted">Enter a ZIP for a live estimate.</p></div></form>`;

function cart() {
  const body = `${breadcrumbs([{ name: "Cart", href: "/cart/" }])}
<div class="wrap page-head"><h1>Your cart</h1></div>
<section class="section--tight"><div class="wrap cart-layout">
  <div><div data-cart-page></div>
    <div data-cart-has hidden style="margin-top:var(--s-6)">
      <div class="field"><label for="note">Gift note or delivery instructions (optional)</label><textarea class="textarea" id="note" name="note" placeholder="“One spoon, warm water, before the phone. Thinking of you.”"></textarea></div>
      <div class="cart-estimate"><h2 style="font-size:var(--fs-base)">Estimate shipping</h2>${shipCalc()}</div>
    </div>
  </div>
  <aside class="cart-layout__side summary"><h2>Summary</h2><div data-cart-summary></div>${promoForm()}<a class="btn btn--gold btn--block" href="/checkout/">Checkout</a><p class="secure">${ICONS.lock} Secure checkout · no account needed</p></aside>
</div></section>
`;
  return { path: "/cart/", html: page({ title: "Cart", description: "Your Functional Elixirs cart — review your honey-ginger jars, apply a promo code, estimate shipping, and check out securely.", path: "/cart/", body, noindex: true }) };
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
      <div class="co-section__head"><h2>Contact</h2><p class="small muted">We’ll email your receipt and tracking here.</p></div>
      <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" required inputmode="email"><p class="error" id="email-err">Enter a valid email so we can send your receipt.</p></div>
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
      <input type="hidden" id="country" name="country" value="US">
      <div class="field"><label for="phone">Phone <span class="muted">(optional — for delivery questions only)</span></label><input class="input" id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
    </section>
    <section class="co-section">
      <h2>Delivery</h2>
      <div class="opt" data-rates role="radiogroup" aria-label="Shipping method"></div>
      <p class="small muted">Live estimate for your ZIP. Free standard shipping on orders over $${CFG.freeShipOver}. <a href="/shipping/">Shipping details</a></p>
    </section>
    <section class="co-section">
      <h2>Payment</h2>
      <!-- Stripe's Payment Element. Card, Apple Pay, Google Pay and Link render here
           according to what is enabled in the Stripe dashboard and what the shopper's
           browser supports. Card details live inside Stripe's iframe: they never touch
           this page's DOM or our server, which is what keeps us in PCI SAQ-A. -->
      <div id="payment-element" data-payment-element></div>
      <p class="field-note small muted" data-payment-status role="status" aria-live="polite">Loading secure payment…</p>
      <label class="check"><input type="checkbox" name="billing_same" checked> Billing address same as shipping</label>
    </section>
    <section class="co-section">
      <div class="field"><label for="gift">Gift note <span class="muted">(optional — we never include prices)</span></label><textarea class="textarea" id="gift" name="gift" style="min-height:5rem"></textarea></div>
      <button class="btn btn--gold btn--block" type="submit" style="min-height:3.25rem">Place order · <span data-total>—</span></button>
      <p class="small muted center">By placing your order you agree to our <a href="/terms/">Terms</a> and <a href="/privacy/">Privacy Policy</a>. Unopened jars are returnable for a full refund.</p>
    </section>
  </form>
  </div>
</div></section>`;
  return { path: "/checkout/", html: page({ title: "Checkout", description: "Secure checkout — card, Apple Pay, Google Pay or Link. Guest checkout with live shipping rates.", path: "/checkout/", body, noindex: true, extraHead: stripeHead() }) };
}

function confirmation() {
  return { path: "/order-confirmation/", html: page({ title: "Order confirmed", description: "Thank you — your Functional Elixirs order is confirmed. Order details, delivery estimate and tracking.", path: "/order-confirmation/", body: `<section class="wrap" data-confirmation style="padding-bottom:var(--section)"></section>`, noindex: true, extraHead: stripeHead() }) };
}

function track() {
  const body = `${breadcrumbs([{ name: "Track order", href: "/track-order/" }])}
<div class="wrap page-head page-head--center"><p class="eyebrow">Track</p><h1>Where’s my jar?</h1><p class="lede measure">Enter your order number (FE-XXXXXX) or tracking number (starts with 1ZFE). Both are in your confirmation email.</p></div>
<section class="section--tight"><div class="wrap--narrow stack" style="--flow:var(--s-6)">
  <form id="track-form" class="form-card form" novalidate><div class="field"><label for="track-q">Order or tracking number</label><input class="input" id="track-q" name="q" placeholder="FE-ABC123" autocomplete="off" required></div><button class="btn btn--primary" type="submit">Track order</button></form>
  <div data-track-result aria-live="polite"></div>
  <p class="small muted center">Can’t find your number? <a href="/contact/">Contact us</a> with the email you ordered with.</p>
</div></section>`;
  return { path: "/track-order/", html: page({ title: "Track your order", description: "Track your Functional Elixirs order by order number or tracking number — see when your honey-ginger jar was packed, shipped, and will arrive.", path: "/track-order/", body, breadcrumbs: [{ name: "Track order", href: "/track-order/" }] }) };
}

export default () => [home(), shop(), ...PRODUCTS.map(product), cart(), checkout(), confirmation(), track()];
