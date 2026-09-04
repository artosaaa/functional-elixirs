/* Our story · The ritual · Ingredients & sourcing · Sustainability · Gift guide */
import { BEE } from "../site.mjs";
import { page, jsonld, breadcrumbs, productCard, faqList, ctaBand, ICONS, esc, money, BRAND, CFG, HERO_URL } from "../layout.mjs";
import { PRODUCTS, HERO, byId } from "../products.mjs";
import { art, altFor, photo } from "../art.mjs";

const head = (crumb, eyebrow, h1, lede, center = false) => `${breadcrumbs([{ name: crumb, href: "" }])}<div class="wrap page-head ${center ? "page-head--center" : ""}"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lede ${center ? "measure mx-auto" : "measure--wide"}">${lede}</p></div>`;

function story() {
  const path = "/about-us/";
  const body = `${breadcrumbs([{ name: "About us", href: path }])}
<section class="about-hero"><div class="wrap about-hero__in">
  <div class="about-hero__copy reveal">
    <p class="mk-eyebrow">Our story</p>
    <h1 class="mk-h1 mk-h1--page">It started<br>with our mom.</h1>
    <span class="mk-rule" aria-hidden="true"></span>
    <p class="mk-lede">Functional Elixirs began with our mother and a simple ritual she created for her own wellness.</p>
  </div>
  <figure class="about-hero__photo reveal"><img src="/assets/img/about-kitchen-jar.jpg" alt="A jar of Functional Elixirs Honey with Fresh Ginger on the kitchen counter at home" width="750" height="1000" fetchpriority="high" decoding="async"></figure>
</div></section>

<section class="about-story"><div class="wrap about-story__in">
  <div class="about-story__text reveal">
    <p>She began combining honey and fresh ginger as part of her daily routine, looking for natural ways to support how she felt. Over time, she told us how much better she felt — and naturally, we wanted to try it ourselves.</p>
    <p>We fell in love with more than the taste. For us, it became a daily ritual that leaves us feeling energized yet calm — a sense of balance that simply feels good.</p>
    <p>What began in our mother’s kitchen became something we genuinely believed was worth sharing.</p>
    <p>Just two natural ingredients: honey and fresh ginger. Nothing complicated. Delicious, versatile, and rooted in a family tradition we still enjoy today.</p>
  </div>
  <figure class="about-story__photo reveal"><img src="/assets/img/honey-ginger-jars-kitchen.jpg" alt="Jars of Functional Elixirs Honey with Fresh Ginger stacked on the kitchen counter, ready to ship" width="1200" height="1200" loading="lazy" decoding="async"><figcaption>Every batch is still jarred by hand.</figcaption></figure>
</div></section>

<section class="stripes stripes--band"><div class="wrap"><div class="mk-band reveal">
  <span class="mk-band__bee" aria-hidden="true">${BEE}</span>
  <div class="mk-band__text"><h2 class="mk-h3">From our mother’s recipe to your daily ritual</h2><p>Functional Elixirs — Nature’s Daily Elixir.</p></div>
  <a class="btn btn--gold" href="/shop/">Shop now</a>
</div></div></section>`;
  return { path, html: page({ title: "About Us — It Started With Our Mom | Functional Elixirs", description: "Functional Elixirs began with our mother’s daily ritual of honey and fresh ginger. Two natural ingredients, a family tradition, and a jar we believed was worth sharing.", path, body, breadcrumbs: [{ name: "About us", href: path }] }) };
}

function ritual() {
  const path = "/ritual/"; const p = HERO;
  const faq = [
    ["How much should I take?", "One teaspoon is the classic serving. Some mornings want two. It’s food, not medicine — use what tastes right."],
    ["Warm or hot water?", "Warm — around 120–140°F. Boiling water mutes the fresh ginger. Let the kettle stand a minute, or mix hot with a splash of cold."],
    ["Can I take it straight?", "Absolutely. Off the spoon is how our mother often took it. Sweet first, then the ginger’s warmth."],
    ["When is the best time?", "Whenever you’ll actually do it. Morning before the phone is our habit; the evening cup in warm water or rooibos is the other end of the same ritual."],
    ["Is it suitable for kids?", "Not for infants under 12 months (no honey of any kind). Older children usually love a half-teaspoon in warm milk or on toast."],
  ];
  const body = `${head("The ritual", "The ritual", "Scoop. Stir. Sip.", "One jar. Two simple ingredients. Endless ways to enjoy. The whole practice takes ninety seconds — here it is, and eight ways to make it yours.")}
<section class="section--tight"><div class="wrap split split--reverse">
  <div class="hero__art reveal" style="box-shadow:var(--shadow-2)">${art("cup", p, { alt: altFor(p, "cup"), anim: true, className: "scene--live" })}</div>
  <ol class="stack reveal" style="list-style:none;padding:0;--flow:var(--s-5)">
    <li class="ritual-step" style="border-top:0;padding-top:0"><h3>Scoop</h3><p>One teaspoon of <a href="${HERO_URL}">Honey with Fresh Ginger</a>. Use a dry spoon, or the <a href="/shop/beechwood-honey-dipper/">beechwood dipper</a> — water is the one thing honey doesn’t want.</p></li>
    <li class="ritual-step"><h3>Stir</h3><p>Into about 8 oz of warm water — not boiling. Stir until the spoon comes up clean and the ginger threads swirl up from the bottom.</p></li>
    <li class="ritual-step"><h3>Sip</h3><p>Wait thirty seconds. Sweet first, then a slow, clean warmth at the back of the throat. Take the minute; it’s the point.</p></li>
  </ol>
</div></section>
<section class="section section--sage"><div class="wrap">
  <div class="section-head center"><p class="eyebrow">How to enjoy it</p><h2>Spoon it. Stir it. Drizzle it. Make it yours.</h2><p class="lede mx-auto measure">Enjoy it straight from the spoon or fold it into the foods and drinks you already love.</p></div>
  <div class="grid grid--4">
    ${[["By the spoonful", "Enjoy directly from the jar.", ICONS.spoon], ["Morning ritual", "Stir into warm water for a simple start to your day.", ICONS.sun], ["Tea time", "Add to your favourite tea instead of ordinary sweetener.", ICONS.cup], ["With lemon", "Combine with warm water and fresh lemon.", ICONS.drop], ["Breakfast", "Drizzle over oatmeal, yogurt, granola or toast.", ICONS.leaf], ["Smoothies", "Blend a spoonful into your favourite smoothie.", ICONS.refresh], ["In the kitchen", "Salad dressings, marinades, sauces or glazes.", ICONS.root], ["Evening ritual", "Stir into a warm caffeine-free drink for something soothing.", ICONS.moon]].map(([t, d, i]) => `<div class="fact reveal">${i}<div><strong>${t}</strong><span>${d}</span></div></div>`).join("")}
  </div>
</div></section>
<section class="section"><div class="wrap split">
  <div class="prose reveal"><p class="eyebrow">A note on warmth</p><h2>Why warm, not boiling</h2><p>Fresh ginger carries bright, almost citrusy top notes that fade quickly in boiling water. Somewhere around 130°F the honey dissolves instantly and the ginger stays lively. That one detail is most of the difference between a good cup and a great one.</p><p>The same goes for cooking: add the jar late to glazes and marinades, and not at all to dressings and drinks. <a href="/journal/beyond-the-spoon-dressings-glazes-oats/">Six things to make →</a></p></div>
  <div class="marquee-photo reveal">${photo("ritual")}</div>
</div></section>
<section class="section section--well"><div class="wrap--narrow"><h2 class="center" style="margin-bottom:var(--s-5)">Ritual questions</h2>${faqList(faq)}</div></section>
${ctaBand("Start the ritual.", `The 15 oz jar is about six weeks of mornings — ${money(HERO.price)}, free shipping over $${CFG.freeShipOver}.`)}`;
  return { path, html: page({ title: "The Ritual — Scoop. Stir. Sip. | How to Enjoy Honey with Fresh Ginger", description: "How to enjoy honey with fresh ginger: one teaspoon in warm water, plus eight ways to use the jar — tea, lemon, breakfast, smoothies, glazes and an evening cup.", path, body, jsonld: [jsonld.faq(faq)], breadcrumbs: [{ name: "The ritual", href: path }] }) };
}

function sourcing() {
  const path = "/sourcing/";
  const body = `${head("Ingredients & sourcing", "Ingredients", "Two ingredients, chosen carefully.", "Everything in the jar is on the label: raw honey and fresh ginger root. Here is what that means, and what it doesn’t.")}
<section class="section--tight"><div class="wrap split">
  <div class="hero__art reveal" style="box-shadow:var(--shadow-2)">${art("open", HERO, { alt: altFor(HERO, "open") })}</div>
  <div class="prose reveal">
    <h2>Honey — nature’s golden sweetener</h2>
    <p>Honey is more than a beautifully rich natural sweetener. Its distinctive flavour and naturally occurring compounds have made it a treasured food across cultures for generations. Ours is raw — not heated or ultra-filtered — which is why it may crystallize over time and why it tastes like the flowers it came from rather than like sugar.</p>
    <p>We buy from small apiaries that can tell us which fields the hives sat in. Because raw honey varies with the season, no two batches taste exactly alike. We think that’s the point.</p>
  </div>
</div></section>
<section class="section"><div class="wrap split split--reverse">
  <div class="marquee-photo reveal">${photo("terraces")}</div>
  <div class="prose reveal">
    <h2>Ginger — a root with a long tradition</h2>
    <p>Ginger has been used in food and traditional wellness practices for centuries. It contains naturally occurring bioactive compounds — gingerols and shogaols among them — and has been widely studied for its antioxidant and anti-inflammatory properties and its role in digestive wellness.</p>
    <p>We use fresh ginger root, never powder or extract, because that’s what our mother used and because the flavour is simply better: bright, warm, and clean rather than dusty. You can see the threads suspended in the honey.</p>
    <p class="small muted">Research on ginger is largely on specific preparations and supplements rather than honey-and-ginger foods. We share it as background, not as a promise. ${BRAND.disclaimer}</p>
  </div>
</div></section>
<section class="section section--well"><div class="wrap">
  <div class="section-head"><p class="eyebrow">Better together</p><h2>What we don’t add</h2></div>
  <div class="grid grid--4">
    ${[["No added sugar", "Honey is the only sweetness."], ["No flavourings", "No ‘natural ginger flavour’. Just ginger."], ["No preservatives", "Honey doesn’t need them."], ["No heat", "Raw, so it tastes like itself — and may crystallize. That’s fine."]].map(([t, d]) => `<div class="fact reveal">${ICONS.check}<div><strong>${t}</strong><span>${d}</span></div></div>`).join("")}
  </div>
</div></section>
<section class="section"><div class="wrap--prose prose">
  <h2>Allergens &amp; suitability</h2>
  <p>Contains honey. Not suitable for infants under 12 months. Naturally gluten-free, dairy-free and nut-free; made in a facility that handles no nuts. Not vegan. If you have a known allergy to bee products or ginger, this jar isn’t for you.</p>
  <h2>Where it’s made</h2>
  <p>Blended and jarred in small batches in the USA. Glass jars, wooden lids and paper labels — more on why in <a href="/sustainability/">Sustainability</a>.</p>
</div></section>${ctaBand()}`;
  return { path, html: page({ title: "Ingredients & Sourcing — Raw Honey and Fresh Ginger", description: "What’s in Functional Elixirs Honey with Fresh Ginger: raw honey from small apiaries and fresh ginger root — no added sugar, flavourings or preservatives. Allergen details.", path, body, breadcrumbs: [{ name: "Ingredients & sourcing", href: path }] }) };
}

function sustainability() {
  const path = "/sustainability/";
  const body = `${head("Sustainability", "Sustainability", "Made to be finished, not thrown away.", "A consumable gift leaves nothing behind but the jar — and we chose the jar so you’d want to keep it.")}
<section class="section--tight"><div class="wrap grid grid--3">
  ${[["Glass, not plastic", "The jar is real glass: infinitely recyclable, dishwasher-safe, and better-looking on the counter. Most customers keep theirs. <a href='/journal/caring-for-and-reusing-the-jar/'>Second lives for the jar →</a>"], ["A lid made of wood", "Solid wood lids, oiled not lacquered. They age well, and when they finally give out they compost."], ["Paper labels", "Uncoated paper, soy-based inks, and no plastic sleeve. Soak and peel if you want a blank jar."], ["Small batches", "We make what sells, roughly monthly. No warehouse of ageing honey, no markdown bins."], ["Recycled-fibre shipping", "Boxes and paper cushioning, no foam, no bubble wrap. The box is curbside-recyclable everywhere in the US."], ["Honest about the rest", "We haven’t solved shipping emissions and we won’t pretend to have. We consolidate orders, ship ground by default, and offer the two-jar set so the truck comes half as often."]].map(([t, d]) => `<div class="gift-tier reveal"><h3>${t}</h3><p class="small muted">${d}</p></div>`).join("")}
</div></section>
<section class="section"><div class="wrap split"><div class="marquee-photo reveal">${photo("garden")}</div><div class="prose reveal"><h2>Bees first</h2><p>Raw honey only exists if hives are healthy. We buy from small apiaries at a fair price and don’t ask them to push production. When a season is thin, our batches are smaller — you may see the jar sell out. We’d rather that than compromise the honey.</p><h2>What you can do</h2><ul><li>Keep the jar — it’s a good jar.</li><li>Order the <a href="/shop/honey-with-fresh-ginger-two-jar-set/">two-jar set</a> if you get through one a month.</li><li>Recycle the box; compost the paper cushioning.</li></ul></div></div></section>${ctaBand()}`;
  return { path, html: page({ title: "Sustainability — Glass Jars, Wooden Lids, Small Batches", description: "How Functional Elixirs approaches sustainability: recyclable glass jars, wooden lids, paper labels, recycled-fibre shipping and small monthly batches from small apiaries.", path, body, breadcrumbs: [{ name: "Sustainability", href: path }] }) };
}

function giftGuide() {
  const path = "/gift-guide/";
  const body = `${head("Gift guide", "Gift guide", "A gift they’ll finish.", "The best gifts get used up. A jar of honey-ginger is a small pleasure every morning for six weeks — and gone before it becomes clutter.", true)}
<section class="section--tight"><div class="wrap gift-tiers">
  <div class="gift-tier reveal"><p class="eyebrow">Under $15</p><h3>The small kindness</h3><ul><li>8 oz everyday jar — ${money(byId["hg-8"].price)}</li><li>Beechwood dipper — ${money(byId.dipper.price)}</li><li>Add a note at checkout</li></ul><a class="btn btn--ghost btn--sm" href="/collections/gifts-under-30/">Shop under $30</a></div>
  <div class="gift-tier reveal" style="border-color:var(--gold-2)"><p class="eyebrow">Under $30</p><h3>The one we give most</h3><ul><li>15 oz signature jar — ${money(HERO.price)}</li><li>Six weeks of mornings</li><li>Ribbon on the lid, and it’s a gift</li></ul><a class="btn btn--primary btn--sm" href="${HERO_URL}">The 15 oz jar</a></div>
  <div class="gift-tier reveal"><p class="eyebrow">Under $50</p><h3>Ready to hand over</h3><ul><li>The Gift Box — ${money(byId["hg-gift"].price)}: jar, dipper, linen wrap, hand-written card</li><li>The Two-Jar Set — ${money(byId["hg-duo"].price)}, ships free</li></ul><a class="btn btn--ghost btn--sm" href="/shop/honey-with-fresh-ginger-gift-box/">The Gift Box</a></div>
</div></section>
<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Everything giftable</p><h2>All of it wraps well</h2></div><div class="products">${PRODUCTS.filter((p) => p.tags.includes("gift")).map(productCard).join("")}</div></div></section>
<section class="section section--well"><div class="wrap--prose prose"><h2>Gift notes &amp; shipping direct</h2><p>Enter their address at checkout and write a note — we hand-write it on the card and never include prices. Most US addresses see the box in 2–5 business days; <a href="/shipping/">see rates</a>. For the how and the why, read <a href="/journal/how-to-give-a-jar/">How to Give a Jar</a>.</p></div></section>`;
  return { path, html: page({ title: "Gift Guide — Honey with Fresh Ginger Gifts Under $15, $30 and $50", description: "Gift guide for Functional Elixirs: the 8 oz jar and dipper under $15, the 15 oz signature jar under $30, and the hand-wrapped Gift Box and two-jar set under $50. Gift notes included.", path, body, breadcrumbs: [{ name: "Gift guide", href: path }] }) };
}

export default () => [story(), ritual(), sourcing(), sustainability(), giftGuide()];
