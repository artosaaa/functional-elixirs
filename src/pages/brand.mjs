/* Our story · Ingredients & sourcing · Gift guide */
import { existsSync } from "node:fs";
import { BEE, BEE_FLY } from "../site.mjs";
import { page, jsonld, breadcrumbs, productCard, faqList, ctaBand, ICONS, esc, money, BRAND, CFG, HERO_URL } from "../layout.mjs";
import { HERO } from "../products.mjs";
import { art, altFor, photo } from "../art.mjs";

const head = (crumb, eyebrow, h1, lede, center = false) => `${breadcrumbs([{ name: crumb, href: "" }])}<div class="wrap page-head ${center ? "page-head--center" : ""}"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lede ${center ? "measure mx-auto" : "measure--wide"}">${lede}</p></div>`;

function story() {
  const path = "/about-us/";
  /* The family photograph is the page. It falls back to the kitchen shot only so the
     page is never imageless if the archive scan hasn't been added yet. */
  const ARCHIVE = "/assets/img/about-family-archive.jpg";
  const hasArchive = existsSync(new URL("../../assets/img/about-family-archive.jpg", import.meta.url));
  const photo = hasArchive
    ? `<img src="${ARCHIVE}" alt="A photograph from the family album: two children in striped shirts standing at the edge of a large fountain" width="1280" height="1980" fetchpriority="high" decoding="async">`
    : `<img src="/assets/img/honey-ginger-jars-kitchen.jpg" alt="Jars of Functional Elixirs Honey with Fresh Ginger stacked on the kitchen counter, ready to go out" width="640" height="640" fetchpriority="high" decoding="async">`;
  const body = `${breadcrumbs([{ name: "About us", href: path }])}
<section class="about-hero"><div class="wrap about-hero__in about-hero__in--story">
  <figure class="about-hero__photo about-hero__photo--archive reveal">${photo}${hasArchive ? `<figcaption>From the family album.</figcaption>` : ""}</figure>
  <div class="about-hero__copy reveal">
    <p class="mk-eyebrow">Our story</p>
    <h1 class="mk-h1 mk-h1--page">It started<br>with our mom.</h1>
    <span class="mk-rule" aria-hidden="true"></span>
    <div class="about-hero__prose">
      <p class="mk-lede">Functional Elixirs began with our mother and a simple ritual she created for her own wellness.</p>
      <p>She combined honey and fresh ginger as part of her daily routine, looking for natural ways to support how she felt. Over time she told us how much better she felt — and naturally, we wanted to try it ourselves.</p>
      <p>We fell in love with more than the taste. What began in our mother’s kitchen became something we genuinely believed was worth sharing: just two natural ingredients, nothing complicated, rooted in a family tradition we still enjoy today.</p>
    </div>
  </div>
</div></section>

<section class="stripes stripes--band"><div class="wrap"><div class="mk-band reveal">
  <span class="mk-band__bee" aria-hidden="true">${BEE_FLY}</span>
  <div class="mk-band__text"><h2 class="mk-h3">From our mother’s recipe to your daily ritual</h2><p>Functional Elixirs — Nature’s Daily Elixir.</p></div>
  <a class="btn btn--gold" href="/shop/">Shop now</a>
</div></div></section>`;
  return { path, html: page({ title: "About Us — It Started With Our Mom | Functional Elixirs", description: "Functional Elixirs began with our mother’s daily ritual of honey and fresh ginger. Two natural ingredients, a family tradition, and a jar we believed was worth sharing.", path, body, breadcrumbs: [{ name: "About us", href: path }] }) };
}

function sourcing() {
  const path = "/sourcing/";
  const body = `${head("Ingredients & sourcing", "Ingredients", "Two ingredients, chosen carefully.", "Everything in the jar is on the label: raw honey and fresh ginger root — and everything is sourced locally.")}
<section class="section--tight"><div class="wrap split">
  <div class="hero__art reveal" style="box-shadow:var(--shadow-2)">${art("open", HERO, { alt: altFor(HERO, "open") })}</div>
  <div class="prose reveal">
    <h2>Honey — nature’s golden sweetener</h2>
    <p>Honey is more than a beautifully rich natural sweetener. Its distinctive flavour and naturally occurring compounds have made it a treasured food across cultures for generations. Ours is raw — not heated or ultra-filtered — which is why it may crystallize over time and why it tastes like the flowers it came from rather than like sugar.</p>
    <p>We buy from small local suppliers. Because raw honey varies with the season, no two batches taste exactly alike. We think that’s the point.</p>
  </div>
</div></section>
<section class="section--tight"><div class="wrap--prose">
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
  <p>Blended and jarred in small batches in the USA. Glass jars, wooden lids and paper labels — chosen because they age well and recycle cleanly.</p>
</div></section>${ctaBand()}`;
  return { path, html: page({ title: "Ingredients & Sourcing — Raw Honey and Fresh Ginger", description: "What’s in Functional Elixirs Honey with Fresh Ginger: locally sourced raw honey and fresh ginger root — no added sugar, flavourings or preservatives. Allergen details.", path, body, bodyClass: "p-ingredients", breadcrumbs: [{ name: "Ingredients & sourcing", href: path }] }) };
}

export default () => [story(), sourcing()];
