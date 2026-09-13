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
assets/img/            real photos (jars-kitchen, teapot, garden) + generated logo/favicon/OG SVGs
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
Hero copy rises in sequence, art settles · animated **steam** wisps and **bokeh** drift and a **glass light sweep** inside the SVG scenes · staggered `.reveal` on scroll · button lift/press + `data-added` success pulse · cart badge pop · heart beat · tasting-notes ribbon · drawer contents slide · underline-draw links · cross-page **View Transitions** on the jar (`.vt-hero`).

### Runtime contract (data attributes)
`data-add="id"` add to cart (reads `[data-qty-input]`) · `data-express-buy="id"` add + open checkout with Apple Pay armed · `data-cart-open` · `data-cart-count` · `data-wish="id"` · `data-stock="id"` renders in-stock / "Only X left" / sold-out · `[data-ship-calc]` form · `[data-promo-form]` · `#checkout-form` · `[data-apple-pay] [data-gpay] [data-shop-pay]` · `[data-confirmation]` · `#track-form` · `#signup-form #login-form #forgot-form` · `[data-account="orders|addresses|wishlist"]` · `#contact-form` · `[data-news-form]` · `#cookie`.

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
- **Receipts are sent from `/api/stripe-webhook`, not the browser**, so a shopper who closes the tab still gets one. The webhook verifies Stripe's signature against the raw body and rejects replays older than five minutes.

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

`assets/img/product/` holds crops of **your own phone photos** (IMG_0117 / IMG_0118 / IMG_0079),
brightened and sharpened. They are real product shots and they beat the illustrations — but the
originals are only **640 x 640**, so they are upscaled and soft at large sizes.

**Reshoot when you can**, at 2000 px or more: jar straight on, label square to camera, on the same
marble, window light from the side. Then just overwrite these filenames — no code changes:

| File | Shows |
|---|---|
| `hero.jpg` | single jar, portrait — home hero + product page |
| `front.jpg` | single jar, tighter — product cards |
| `cup.jpg` | alternate angle |
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

- Contact email (`hello@functionalelixirs.com`), social handles, founding year
- Prices for every SKU except the 15 oz jar ($23.99); stock counts; whether the 8 oz, sets, dipper and travel jar exist
- "Blended and jarred in small batches in the USA" — add the real city/state
- Governing law and tax nexus (set to **California**); free-shipping threshold ($45); shipping rates and carriers; return window (30 days)
- **Review quotes, star ratings and review counts are PLACEHOLDERS.** They appear on the home page,
  every product page and in `Product` JSON-LD `aggregateRating`. Publishing invented ratings as real
  is both an FTC problem and a Google structured-data violation — replace them with real reviews
  (Judge.me, Okendo, Loox) or delete the `aggregateRating` block in `src/layout.mjs` before launch.
- "Only X left in this batch" is driven by `stock` in `src/products.mjs` — set real numbers or raise them
- The bundle tier prices ($44.99 two-jar, $64.99 three-jar) and the $40 free-shipping threshold are
  my proposals — check them against your real margins and shipping cost
- Allergen/facility statement in `/sourcing/`

Health language is deliberately conservative (no treatment claims; FDA disclaimer in the footer and on story/sourcing pages) per the note in your product document.

