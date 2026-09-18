# Functional Elixirs — storefront

**Honey with Fresh Ginger · Nature's Daily Elixir.** A dependency-free, static luxury e-commerce site: 44 pages, persistent cart, Apple Pay / Payment Request checkout, live-feeling shipping calculator, guest + account checkout, inventory states, promo codes, full policy copy and a journal — all rendered from one design system.

```bash
node build.mjs          # renders every page to /<path>/index.html + sitemap.xml, robots.txt, RSS, logo + OG images
npm run dev             # build + serve on http://localhost:4173
SITE_URL=https://functionalelixirs.com node build.mjs   # canonical/OG/sitemap URLs for production
```

Deploys anywhere static files go. `vercel.json` is included (clean URLs, immutable asset caching, security headers). No framework, no bundler, no npm install.

---

## 1. Sitemap (44 URLs)

| Section | URLs |
|---|---|
| **Core** | `/` · `/shop/` · `/cart/` · `/checkout/` · `/order-confirmation/` · `/track-order/` |
| **Products (7)** | `/shop/honey-with-fresh-ginger/` (15 oz, **$23.99**, hero) · `/shop/honey-with-fresh-ginger-8oz/` · `/shop/honey-with-fresh-ginger-two-jar-set/` · `/shop/honey-with-fresh-ginger-gift-box/` · `/shop/beechwood-honey-dipper/` · `/shop/honey-with-fresh-ginger-travel-jar/` (sold out) · `/shop/honey-with-fresh-ginger-family-pack/` |
| **Collections** | `/collections/gifts-under-30/` · `/collections/for-beginners/` |
| **Account (6)** | `/account/signup/` · `/account/login/` · `/account/forgot-password/` · `/account/` (orders) · `/account/addresses/` · `/account/wishlist/` |
| **Brand (5)** | `/our-story/` · `/ritual/` · `/sourcing/` · `/sustainability/` · `/gift-guide/` |
| **Journal (9)** | `/journal/` + 8 articles: morning ritual · storing honey & crystallization · counter styling · honey-ginger in tea · how to give a jar · a jar for the cold months · jar care & reuse · dressings, glazes, oats |
| **Support (8)** | `/faq/` · `/contact/` · `/shipping/` · `/returns/` · `/privacy/` · `/terms/` · `/cookies/` · `/sitemap/` |
| **System** | `/404.html` · `/sitemap.xml` · `/robots.txt` · `/journal/feed.xml` |

---

## 2. Project layout

```
build.mjs              static renderer (pages → HTML, sitemap, robots, RSS, logo/OG SVGs)
src/site.mjs           brand config, nav, footer links, icon set, logoMark()/logoPlaque()/logoVector()
src/products.mjs       catalog (7 SKUs), collections, runtime catalog JSON
src/art.mjs            SVG scene generator: jar on wooden table, cup, ginger, lemon, linen — 4 compositions + OG image
src/articles.mjs       8 journal pieces (HTML bodies, FAQ schema where useful)
src/layout.mjs         page shell: <head> SEO, JSON-LD graph, header, footer, cart drawer, cookie notice
src/pages/*.mjs        core · account · brand · journal · support
assets/css/site.css    design system (tokens → components → motion layer)
assets/js/site.js      storefront runtime (cart, drawer, promo, shipping, express pay, auth, account, tracking)
assets/img/            real photos (jar-in-grass*, jars-kitchen, product/hg-15-hero*) + logo/favicon PNGs + generated OG SVGs
```

---

## 3. Design system (shared CSS variables)

```css
--cream #F6F0E6  --cream-2 #FBF7F0  --cream-3 #EDE4D6  --linen #E4D9C7      /* grounds */
--navy #1D2B33   --navy-2 #152128   --navy-3 #0F181D                       /* logo navy: buttons, headings, footer */
--gold #7F5E1C (text, 5:1 on cream)   --gold-2 #D4AC54 (logo gold, on dark) /* one accent, two weights */
--honey #B5651D  --honey-deep #7A3E0F                                       /* amber: badges, progress, low stock */
--sage #8FA189   --sage-2 #56684F   --sage-tint #E9EEE5                     /* olive branch echo */
--ink #241F1A    --ink-soft #5C534B                                          /* text (14:1 / 6.9:1) */
--serif  Iowan Old Style → Palatino → Georgia     /* voice: h1–h3, prices, pull quotes, label */
--sans   -apple-system → Segoe UI → Inter → Arial /* UI: body, buttons, forms */
```

**Why system fonts:** zero font bytes, zero layout shift, and Iowan/Palatino read as "quiet luxury" on Apple devices where most of this audience shops. Swap in a variable font by adding one `@font-face` with `font-display: swap` and `size-adjust` to preserve CLS.

**Type scale** uses `clamp()` (`--fs-xs` … `--fs-2xl`). **Spacing** is a 4 px scale (`--s-1` … `--s-10`) with `--section` and `--gutter` fluid. **Radius** `--r-sm/md/lg/pill`. **Shadows** `--shadow-1/2/3`. **Focus ring** `--ring` (gold, 2 px offset).

### Components (all in `site.css`, sections 5–15)
`.btn` (`--primary --ghost --soft --link --sm --block --on-dark`) · express wallets `.btn--apple-pay / --gpay / --shop-pay` + `.express` group · `.field / .input / .select / .textarea / .check / .field-row` · `.opt` radio cards (shipping, payment) · `.qty` stepper · header/nav/mobile-nav · `.hero` · `.pcard` (container-query aware) · `.pdp` + `.gallery` + `.acc` accordions + `.brew` facts + `.buybar` (mobile sticky) · `.drawer` cart · `.summary / .totals / .line / .promo / .free-ship` · `.checkout / .co-section / .steps` · confirmation + `.track-line` · `.account / .panel / .addr` · content: `.ritual-steps .review .acard .article-head .prose .faq-list .fact .stat .cta-band .gift-tier` · `.footer` · `.cookie` · `.toast` · `.reveal` · `.ribbon`.

### Motion (section 16 — all opacity/transform, all off under `prefers-reduced-motion`)
Hero copy rises in sequence, art settles · animated **steam** wisps and **bokeh** drift and a **glass light sweep** inside the SVG scenes · staggered `.reveal` on scroll · button lift/press + `data-added` success pulse · cart badge pop · heart beat · tasting-notes ribbon · drawer contents slide · underline-draw links · cross-page **View Transitions** on the jar (`.vt-hero`) · **bees** — `bees()` in `src/site.mjs` lays a pointer-events-none layer of two or three bees over the home hero, the "Inspired by nature" block, the shop, the About Us hero and the recipes head; each drifts across on its own lane and loop (34–64 s), bobs and flutters its wings, and the CTA band's bee hovers in place ·
· **add-to-cart idle loop** — a sheen pass and a gold ring every ~5 s on every enabled `[data-add]` button, off on hover, focus and after a click, with a green ring burst on a successful add · **every other button answers the pointer** (section 25): lift and shadow on hover, settle on press, one light pass across solid buttons, ghost buttons fill from the left, text-link underlines settle lower and `.arrow` spans lean in; every button also carries its own idle loop, paced by role — add-to-cart fastest and the only one with a ring, gold CTAs at 9 s, dark and soft buttons at 13 s, ghost buttons a slow gold border glow; hover, focus and a disabled state stop each one · the **brand intro** (`#intro`, section 24) — a once-per-session curtain: plaque, name, rule, tagline, a bee, then it lifts; decided before first paint by an inline `<head>` script, skipped under reduced motion, the Reduce-motion switch and without JavaScript.

### Runtime contract (data attributes)
`data-add="id"` add to cart (reads `[data-qty-input]`) · `data-express-buy="id"` add + open checkout with Apple Pay armed · `data-cart-open` · `data-cart-count` · `data-wish="id"` · `data-stock="id"` renders in-stock / "Only X left" / sold-out · `[data-ship-calc]` form · `[data-promo-form]` · `#checkout-form` · `[data-apple-pay] [data-gpay] [data-shop-pay]` · `[data-confirmation]` · `#track-form` · `#signup-form #login-form #forgot-form` · `[data-account="orders|addresses|wishlist"]` · `#contact-form` · `[data-news-form]` · `#cookie` · `#display-options` + `[data-dopt="text|contrast|spacing|links|motion"]` accessibility panel (five attributes on `<html>`, `data-dopt-reset` clears them) · `#intro`.

**Promo codes:** `FIRSTJAR` 15% · `MORNING10` 10% · `STEEP5` $5 · `FREESHIP`. **Free shipping over $45.** **Low-stock threshold 10.** All in `CFG` at the top of `site.js` (mirror in `src/site.mjs`).

---

## 4. Payments and email — what is wired and what you must set

Checkout takes real card payments through Stripe, and receipts go out through Resend.
Neither works until the environment variables below are set: with no publishable key
the checkout says so plainly and disables the button rather than pretending.

### Environment variables (Vercel → Project → Settings → Environment Variables)

| Variable | Where it comes from | Scope |
| --- | --- | --- |
| `STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys (`pk_…`) | read at **build** time, ends up in the page |
| `STRIPE_SECRET_KEY` | same page (`sk_…`) — reveal once, never commit | server only |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → your endpoint (`whsec_…`) | server only |
| `RESEND_API_KEY` | Resend → API Keys (`re_…`) | server only |
| `EMAIL_FROM` | e.g. `orders@yourdomain.com` — the domain must be **verified in Resend** (SPF + DKIM) or every send is rejected | server only |
| `ORDERS_EMAIL` | where the shop's own copy of each order lands | server only |
| `CONTACT_EMAIL` | contact-form destination; falls back to `ORDERS_EMAIL` | server only |

Use **test** keys (`pk_test_`/`sk_test_`) in Preview and live keys in Production only.
Scoping both the same lets a preview deploy take real money.

`STRIPE_PUBLISHABLE_KEY` is inlined at build time, so changing it needs a redeploy,
not just a settings save.

### In the Stripe dashboard

1. Activate the account (business details + payout bank account) — until then you are in test mode.
2. Settings → Payments → **Payment methods**: enable card, Apple Pay, Google Pay, Link.
3. Settings → Payments → **Payment method domains**: register the live domain, or Apple Pay will not render.
4. Developers → **Webhooks** → add endpoint `https://<domain>/api/stripe-webhook`, event `payment_intent.succeeded`, then copy the `whsec_…` secret.
   **Then press "Send test webhook" and check the response is `200`.** This project sets
   `trailingSlash: true`, which redirects paths without a trailing slash. Browsers follow
   a 308 and keep the POST body, so the checkout and contact form are unaffected — but
   **Stripe does not follow redirects on webhook deliveries** and records a `307`/`308` as a
   failed delivery. If the test webhook comes back as a redirect rather than `200`, register
   the endpoint as `https://<domain>/api/stripe-webhook/` instead, with the trailing slash.
   Get this wrong and payments still succeed while no receipt is ever sent.
5. Settings → Business → Public details: set the statement descriptor, so charges are recognisable and do not turn into chargebacks.

### How the flow actually works

- `assets/js/site.js` mounts Stripe's **Payment Element** in deferred mode. Card details live inside Stripe's iframe — they never reach this site's DOM or its server (PCI SAQ-A).
- On submit the browser POSTs product **ids and quantities** to `/api/create-payment-intent`. It never sends an amount. The server re-prices from `src/commerce.mjs` and that is what Stripe charges, so a tampered cart buys nothing cheaper.
- `stripe.confirmPayment()` redirects to `/order-confirmation/`, which asks Stripe whether the intent actually succeeded before claiming anything.
- **Receipts are sent by two routes, and the webhook is not required.** The order
  confirmation page calls `/api/send-confirmation` as soon as Stripe redirects the
  shopper back, so receipts go out with no dashboard configuration at all. The
  webhook does the same job and is still worth registering, because it is the only
  one that survives a shopper closing the tab before the page loads.
  Delivery is recorded per recipient on the PaymentIntent, so the page, the webhook,
  a page reload and a Stripe retry can all happen for one order without anyone
  getting a second copy — whichever arrives first sends, the rest find it recorded
  and send nothing.
  `/api/send-confirmation` trusts the browser for nothing but *which* PaymentIntent
  to look at: whether it was paid, what was in it and what it cost all come from
  asking Stripe with the secret key, and the `client_secret` is compared against the
  real one so a guessed intent id cannot trigger a stranger's receipt.
- **The webhook** , so a shopper who closes the tab still gets one. The webhook verifies Stripe's signature against the raw body and rejects replays older than five minutes.
- **Two emails go out per order:** the customer's receipt, and a picking slip to `ORDERS_EMAIL`.
  The webhook reports which ones it sent in its `200` body, and Stripe shows that body in the
  endpoint's **Attempts** tab — so `{"emailed":["jane@…","shop@…"],"shopNotified":true}` answers
  "did my copy go out?" without opening a log. `shopNotified: false` means `ORDERS_EMAIL` is unset.
- **To test email without placing an order:** press **Send test webhook** in the Stripe dashboard.
  That event carries no customer details, so instead of doing nothing the webhook emails
  `ORDERS_EMAIL` to confirm the whole path works — Stripe reached the endpoint, the signature
  verified, and Resend delivered. It can only ever send to `ORDERS_EMAIL`, never to an address
  taken from the event.
- **The PaymentIntent deliberately does not set `receipt_email`.** In live mode — but *not* in test
  mode, so you would not catch it while testing — Stripe sends its own receipt to that address when
  "Successful payments" is enabled under Settings → Customer emails. The customer would get two
  emails seconds apart. The address is still on the intent as `metadata.email`. Want both? Put
  `receipt_email` back in `api/create-payment-intent.js`.

### Still approximate

- **Tax:** `TAX_RATE_CA` in `src/commerce.mjs` is one hardcoded 8.75% rate for ZIPs 900–961. Real California rates run 7.25–10.75% by city, and nexus anywhere else collects nothing. Switch on **Stripe Tax** before selling at volume.
- **Shipping:** `Ship.quote()` is zone-based, not carrier-live. Swap for Shippo / EasyPost keeping the shape `{id, name, price, days:[min,max], note}`.
- **Inventory:** `stock` in `src/products.mjs` is static. Nothing decrements on a sale.
- **Duplicate receipts:** the webhook marks the PaymentIntent `emailed=1` to skip Stripe's repeat deliveries. A tight race could still send twice — a duplicate receipt, never a duplicate charge.
- **Order records:** there is no database. The email is the record, and the shopper's browser keeps a local copy for `/track-order/`.

---

## 5. SEO checklist (what's already done → what to do at launch)

**Done in the build**
- [x] Unique `<title>` + `<meta name="description">` on every page; canonical URLs; `noindex` on cart/checkout/account/404
- [x] Open Graph + Twitter cards on every page; per-product OG images (`/assets/img/og-<slug>.svg`)
- [x] JSON-LD graph: `Organization`, `WebSite`, `BreadcrumbList` (all pages), `Product` + `Offer` with shipping & return policy (PDPs + home), `FAQPage` (FAQ, ritual, PDPs, 3 articles), `Article` (journal)
- [x] Clean, hyphenated URLs; one `<h1>` per page; h2/h3 hierarchy; semantic landmarks (`header/nav/main/footer/aside`), skip link
- [x] `sitemap.xml` (34 indexable URLs, priorities), `robots.txt` with comments, human `/sitemap/`, RSS feed
- [x] Descriptive alt text on every image (scene described: jar + lid + table + cup + ginger), `<title>` inside every SVG scene
- [x] Internal linking: shop ↔ ritual ↔ journal ↔ policies ↔ product on every template; related articles; "also" products
- [x] Core Web Vitals: system fonts (0 KB), single CSS file preloaded, one deferred JS, SVG art (no image requests above the fold), fixed aspect ratios everywhere (no CLS), animations opacity/transform only
- [x] Accessibility: WCAG 2.2 AA contrast, visible focus, labelled controls, `aria-live` on cart/toasts, focus-trapped drawer, `prefers-reduced-motion`, 44 px targets

**At launch**
- [ ] Set `SITE_URL` to the real domain and rebuild; add the domain to Vercel
- [ ] Convert OG SVGs to 1200×630 PNG/JPG (`npx sharp-cli`) — some crawlers ignore SVG
- [ ] Submit `sitemap.xml` in Google Search Console + Bing; verify Product rich results with the Rich Results Test
- [ ] Merchant Center feed (name, price, GTIN, availability) — mirror `src/products.mjs`
- [ ] Replace SVG hero with real photography where you have it (below) and add `<link rel="preload" as="image">` for the hero
- [ ] Add real review data source (Judge.me / Okendo) and keep `aggregateRating` honest
- [ ] Run Lighthouse on `/`, `/shop/honey-with-fresh-ginger/`, `/checkout/` — target ≥ 90 all four; fix anything the CSS budget didn't anticipate
- [ ] Analytics: enable only after "Accept all" (hook in `initCookie`)

---

## Deploying

**Vercel (production):** the GitHub repo is connected to the Vercel project, so every push to
`main` deploys automatically. `vercel.json` builds with `node build.mjs`, packs the output into
`dist/` via `tools/pack.mjs`, and serves that. Canonical URLs follow the Vercel production domain.

**GitHub Pages (mirror):** `.github/workflows/pages.yml` builds with `BASE_PATH=/functional-elixirs`
on every push and publishes to https://artosaaa.github.io/functional-elixirs/.

## 6. Swapping in real photos — just drop files in a folder

**No code changes.** Put your photos in `assets/img/product/` and run `node build.mjs`.

| File | Where it shows |
|---|---|
| `hero.jpg` | home hero + product page main image |
| `front.jpg` | jar alone — product cards, shop grid |
| `open.jpg` | lid off, dipper / honey visible |
| `cup.jpg` | cup in front, jar behind |

Optional per-size overrides beat the generic ones: `hg-15-hero.jpg`, `hg-8-front.jpg`, `hg-duo-front.jpg`, `hg-gift-front.jpg`, `dipper-front.jpg`, `hg-3-front.jpg`, `hg-trio-front.jpg`. `.jpg .jpeg .png .webp .avif` all work. Any variant you don't supply falls back to another photo you did, then to the drawn SVG scene — so one photo is enough to start.

**Shooting notes** (also in `assets/img/product/README.txt`):
- Portrait ~4:5 (1600×2000 is plenty). The site crops to fill, centred.
- Jar slightly off-axis, label to camera, lid on (except `open.jpg`).
- Window light from the side or behind — no direct flash, no hard shadow across the label.
- Props (cup, ginger, lemon, linen) behind and beside the jar, never covering the label.
- Leave ~15% space around the jar so cropping never clips it.
- Same table, same light, same white balance across all four so the set looks like one shoot.

Until photos land, the site uses generated SVG scenes of the jar (`src/art.mjs`) — chosen by a three-way design panel and scored against your own jar photos. The rejected alternates are kept in `src/art-candidates/` for reference.

## 6a. Product photography currently in use

One photograph — the jar lying in sunlit grass, shot at 1500 × 2000 — carries the whole site.
The original is kept in `brand-source/photo-jar-in-grass-2026.jpg` (not published); the crops
under `assets/img/` are what pages load:

| File | Crop | Where it shows |
|---|---|---|
| `product/hg-15-hero.jpg` (+ `-400`, `-800`) | tight 4:5 on the jar | shop, product gallery, ingredients page, product cards, cart thumbnail |
| `jar-on-marble.jpg` (+ `-640`) | 1:1, the square studio shot as supplied (jar on a marble plinth, ginger slices, dipper) | home "signature jar" section — original in `brand-source/photo-jar-on-marble-2026.jpg` |
| `jar-in-grass-square.jpg` (+ `-640`) | 1:1, wider | home hero |
| `about-family-archive.jpg` (+ `-720`) | the family album scan, whole, at its own ratio | About Us, with the caption "From the family album." — original in `brand-source/photo-family-archive.jpg` |
| `product/hg-3-front.jpg` (+ `-400`, `-800`) | 4:5 cut from a square studio shot on beige | Travel Pack card and page (its label reads 15 oz; the original is `brand-source/photo-travel-pack-studio-2026.jpg`) |

Every product variant (`front`, `open`, `cup`) resolves to `hg-15-hero.jpg`, so the product
gallery shows one frame and no thumbnail strip. To add a second angle, drop `hg-15-front.jpg`
(or `front.jpg`) in `assets/img/product/`, run `python3 tools/make-images.py`, rebuild — the
strip comes back on its own. Update `photoAlt()` in `src/art.mjs` so the alt text describes it.

The file names are new on purpose: `/assets/*` is served with a one-year immutable cache, so
overwriting `hero.jpg` in place would have left returning visitors on the old photo.
| `hg-duo-front.jpg`, `hg-trio-front.jpg` | several jars together — the set SKUs |
| `hg-gift-hero.jpg` | the Gift Box (currently a single jar; **replace with an actual gift-box shot** — jar, dipper, linen wrap) |

Still missing: an open jar with the dipper, and a cup of tea with a spoonful going in. Both would
earn their place on the product page.

## 6b. The logo

The client's real artwork drives the site. `assets/img/logo.png` is `LOGO-2.jpg` with the white
surround flood-filled to transparency and trimmed, exported at several sizes:

| File | Used for |
|---|---|
| `logo.png` (512) | header, mobile nav, footer, `Organization` JSON-LD |
| `logo-mark.png` (96) | the plaque **on the jar label** inside every SVG scene |
| `apple-touch-icon.png` (180), `favicon-64.png`, `favicon-32.png` | icons |
| `logo-tile.jpg` | opaque navy tile (from `LOGO-3.jpg`) if you need a full-bleed square |
| `logo-source-LOGO-2.jpg` / `-LOGO-3.jpg` | originals, kept for re-export |

To change the logo, replace `logo.png` (and `logo-mark.png`) — nothing else needs editing;
`logoMark()` and `logoPlaque()` in `src/site.mjs` point at those paths.

`logoVector()` is a hand-built vector copy of the plaque used **only** by the OG share images,
which are standalone `.svg` files and cannot reference external assets.

**Note:** the two files you sent differ — `LOGO-2` reads **ELIXIRS**, `LOGO-3` reads **ÉLIXIRS**.
The site uses `LOGO-2` (no accent), matching the printed jar label and your brand documents.
Say the word if the accented version is the correct one.

## 7. Facts to confirm before launch

Copy is written from your two brand documents. These items were **not** in them and were written as reasonable defaults — change in `src/site.mjs` / `src/products.mjs` / `src/pages/support.mjs`:

- Contact email (`info@functionalelixirs.com` — set once in `BRAND.email`, injected into the runtime as `window.__BRAND_EMAIL__`), social handles, founding year
- Prices for every SKU except the 15 oz jar ($23.99); stock counts; whether the 8 oz, sets, dipper and travel jar exist
- "Blended and jarred in small batches in the USA" — add the real city/state
- Governing law and tax nexus (set to **California**); shipping rates and carriers
- **Reviews: resolved, and it should stay that way.** Six invented testimonials and a fabricated
  "4.9 out of 5 from 214 reviews" used to sit in the source behind a flag. They are deleted, and
  `rating`/`reviews` are now `null`/`0`. Both the review section and the JSON-LD `aggregateRating`
  check for real data *as well as* `REVIEWS_VERIFIED`, so flipping that flag on its own publishes
  nothing — verified by flipping it and rebuilding. Publishing invented ratings as real is an FTC
  problem and a Google structured-data violation; to add real ones, see the comment above `REVIEWS`
  in `src/pages/core.mjs`.
- "Only X left in this batch" is driven by `stock` in `src/products.mjs` — set real numbers or raise them
- **The $50 free-shipping threshold** needs three jars to reach at $23.99 each. Check it against your
  real margin and shipping cost; it may be doing nothing but discouraging single-jar orders.
- ~~Your real dispatch turnaround~~ — answered: **within 3 business days**, set once as
  `CFG.dispatchDays` in `src/site.mjs` (mirrored in `assets/js/site.js`) and reflected in the
  JSON-LD `handlingTime`, the shipping page, the FAQ, the product accordion and the stock line.
  Change the number in those two places and it changes everywhere.
- Allergen/facility statement in `/sourcing/`

Health language is deliberately conservative (no treatment claims; FDA disclaimer in the footer and on story/sourcing pages) per the note in your product document.

