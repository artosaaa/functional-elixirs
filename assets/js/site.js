/* ==========================================================================
   FUNCTIONAL ELIXIRS — storefront runtime (vanilla, ~no deps)
   Persistent cart · drawer · promo codes · inventory · shipping calculator
   Express pay (Apple Pay / Payment Request) · guest + account checkout
   Mock auth + account (localStorage) · order confirmation · tracking
   Every server call here is a stub with a comment on how to wire it for real.
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- 0. Config (mirrors src/site.mjs — keep in sync) ---------- */
  const CFG = {
    freeShipOver: 40,
    lowStockAt: 10,
    taxRateCA: 0.0875,               // California nexus (edit for your state). Real: use a tax API (Stripe Tax / TaxJar).
    promos: {
      FIRSTJAR:  { type: "pct", value: 15, max: 5, label: "15% off your first jar (up to $5)" },
      MORNING10:  { type: "pct", value: 10, label: "10% off" },
      STEEP5:     { type: "amt", value: 5,  label: "$5 off" },
      FREESHIP:   { type: "ship", value: 0, label: "Free standard shipping" },
    },
    rates: {
      // Base rates; the calculator adjusts days by zone. Real: fetch from carrier / Shippo / EasyPost.
      standard: { id: "standard", name: "Standard", price: 5.95,  days: [4, 7] },
      express:  { id: "express",  name: "Express",  price: 14.00, days: [1, 3] },
      pickup:   { id: "pickup",   name: "Local pickup", price: 0, days: [0, 1] },
    },
    intl: {
      CA: { standard: { price: 12.95, days: [6, 10] }, express: { price: 24.00, days: [3, 5] } },
      GB: { standard: { price: 15.95, days: [7, 12] }, express: { price: 29.00, days: [3, 6] } },
      AU: { standard: { price: 19.95, days: [9, 15] }, express: { price: 34.00, days: [4, 7] } },
      OTHER: { standard: { price: 19.95, days: [8, 14] }, express: { price: 32.00, days: [4, 7] } },
    },
  };

  /* ---------- 1. Tiny utils ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const catalog = (() => { try { return JSON.parse($("#sw-catalog")?.textContent || "{}"); } catch { return {}; } })();
  const product = (id) => catalog[id];
  const uid = (p) => p + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();

  let toastTimer;
  function toast(msg) {
    let t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    t.textContent = msg; t.setAttribute("data-show", "");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.removeAttribute("data-show"), 2600);
  }

  /* Mini jar thumbnail for cart lines (keeps every page light — no per-product image payload) */
  function miniJar(p) {
    const h = p?.honey || "#7A3E0F", k = p?.id || "x";
    return `<svg viewBox="0 0 80 100" aria-hidden="true" focusable="false">
      <defs><linearGradient id="mj${k}" x1="0" x2="1"><stop offset="0" stop-color="#3a1e08"/><stop offset=".25" stop-color="#a8622a"/><stop offset=".5" stop-color="${h}"/><stop offset="1" stop-color="#3a1e08"/></linearGradient><linearGradient id="mg${k}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity=".25"/></linearGradient></defs>
      <rect width="80" height="100" fill="#E9DFCF"/><ellipse cx="40" cy="93" rx="28" ry="4" fill="#000" opacity=".14"/>
      <path d="M12 38 q0 -10 10 -10 h36 q10 0 10 10 v42 q0 8 -8 8 h-40 q-8 0 -8 -8z" fill="url(#mj${k})"/>
      <rect x="18" y="46" width="44" height="30" fill="#F8F1E0"/><rect x="18" y="46" width="44" height="30" fill="url(#mg${k})" opacity=".4"/>
      <rect x="32" y="49" width="16" height="16" rx="2" fill="#1D2B33"/><path d="M35 62 h10" stroke="#D4AC54" stroke-width="1.2"/>
      <path d="M12 38 q0 -10 10 -10 h36 q10 0 10 10 v42 q0 8 -8 8 h-40 q-8 0 -8 -8z" fill="url(#mg${k})"/>
      <rect x="10" y="16" width="60" height="14" rx="4" fill="#D6B77F"/><rect x="10" y="16" width="60" height="4" rx="2" fill="#E8D2A4"/>
    </svg>`;
  }

  /* ---------- 2. Cart state ---------- */
  const Cart = {
    key: "sw_cart",
    items() { return store.get(this.key, []); },
    save(items) { store.set(this.key, items); render(); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    add(id, qty = 1) {
      const p = product(id); if (!p) return;
      if (p.stock <= 0) { toast("Sold out — join the waitlist on the product page"); return; }
      const items = this.items(); const line = items.find((i) => i.id === id);
      const next = Math.min((line?.qty || 0) + qty, p.stock);
      if (line) { if (line.qty === next) toast(`Only ${p.stock} in stock`); line.qty = next; } else items.push({ id, qty: next });
      this.save(items); toast(`${p.name} added to cart`); Drawer.open();
    },
    setQty(id, qty) {
      const p = product(id); let items = this.items();
      qty = Math.max(0, Math.min(qty, p?.stock ?? 99));
      if (qty === 0) items = items.filter((i) => i.id !== id); else { const l = items.find((i) => i.id === id); if (l) l.qty = qty; }
      this.save(items);
    },
    remove(id) { this.save(this.items().filter((i) => i.id !== id)); },
    clear() { this.save([]); },
    subtotal() { return this.items().reduce((s, i) => s + (product(i.id)?.price || 0) * i.qty, 0); },
  };

  /* Promo */
  const Promo = {
    key: "sw_promo",
    get() { return store.get(this.key, null); },
    apply(code) {
      code = (code || "").trim().toUpperCase();
      const p = CFG.promos[code]; if (!p) return { ok: false, msg: "That code isn’t valid. Try FIRSTJAR." };
      store.set(this.key, { code, ...p }); render(); return { ok: true, msg: `${p.label} applied` };
    },
    clear() { store.del(this.key); render(); },
    discount(subtotal) { const p = this.get(); if (!p) return 0; if (p.type === "pct") { const d = subtotal * p.value / 100; return +Math.min(p.max ?? Infinity, d).toFixed(2); } if (p.type === "amt") return Math.min(p.value, subtotal); return 0; },
    freeShip() { return this.get()?.type === "ship"; },
  };

  /* Shipping */
  const Ship = {
    key: "sw_ship",
    get() { return store.get(this.key, { country: "US", zip: "", rate: "standard" }); },
    set(v) { store.set(this.key, { ...this.get(), ...v }); },
    zone(zip) { const d = +String(zip || "")[0]; if (Number.isNaN(d)) return null; if (d >= 8) return "west"; if (d >= 4) return "central"; return "east"; },
    /* Returns [{id,name,price,days,note}] for a destination; applies free-shipping threshold */
    quote(country, zip, subtotal) {
      const free = subtotal >= CFG.freeShipOver || Promo.freeShip();
      if (country === "US") {
        const z = this.zone(zip);
        const adj = { west: [-2, -3], central: [-1, -2], east: [0, 0] }[z] || [0, 0];
        const std = CFG.rates.standard, exp = CFG.rates.express;
        return [
          { ...std, price: free ? 0 : std.price, days: [Math.max(2, std.days[0] + adj[0]), Math.max(3, std.days[1] + adj[1])], note: free ? `Free — you’re over ${money(CFG.freeShipOver)}` : `Free over ${money(CFG.freeShipOver)}` },
          { ...exp, days: z === "west" ? [1, 2] : exp.days, note: "USPS Priority Express / UPS 2nd Day" },
          { ...CFG.rates.pickup, note: "Ready same day — we’ll email you when it’s boxed." },
        ];
      }
      const r = CFG.intl[country] || CFG.intl.OTHER;
      return [
        { id: "standard", name: "International standard", price: r.standard.price, days: r.standard.days, note: "Duties & taxes may apply on delivery" },
        { id: "express",  name: "International express",  price: r.express.price,  days: r.express.days,  note: "Tracked, DHL / UPS" },
      ];
    },
    daysLabel(d) { if (d[0] === 0) return "Today"; return d[0] === d[1] ? `${d[0]} business days` : `${d[0]}–${d[1]} business days`; },
    isCA(country, zip) { const n = parseInt(String(zip).slice(0, 3), 10); return country === "US" && n >= 900 && n <= 961; },
  };

  /* Wishlist */
  const Wish = {
    key: "sw_wishlist",
    items() { return store.get(this.key, []); },
    has(id) { return this.items().includes(id); },
    toggle(id) { let w = this.items(); w = w.includes(id) ? w.filter((x) => x !== id) : [...w, id]; store.set(this.key, w); render(); toast(w.includes(id) ? "Saved to wishlist" : "Removed from wishlist"); },
  };

  /* Auth (mock). Real: replace with your auth provider (Supabase / Clerk / Shopify Customer Accounts API). */
  const Auth = {
    key: "sw_user", usersKey: "sw_users",
    user() { return store.get(this.key, null); },
    users() { return store.get(this.usersKey, {}); },
    signup({ name, email, password }) {
      const users = this.users(); email = email.toLowerCase();
      if (users[email]) return { ok: false, msg: "There’s already an account with that email. Try logging in." };
      users[email] = { name, email, created: Date.now() }; store.set(this.usersKey, users);
      store.set(this.key, users[email]); return { ok: true };
    },
    login({ email, password }) {
      const users = this.users(); email = email.toLowerCase();
      const u = users[email] || { name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email };
      store.set(this.key, u); return { ok: true };
    },
    logout() { store.del(this.key); location.href = "/"; },
  };

  const Orders = {
    key: "sw_orders",
    all() { return store.get(this.key, []); },
    add(o) { store.set(this.key, [o, ...this.all()]); },
    find(q) { q = (q || "").trim().toUpperCase(); return this.all().find((o) => o.id === q || o.tracking === q); },
  };

  /* ---------- 3. Rendering ---------- */
  function lineHTML(i, compact) {
    const p = product(i.id); if (!p) return "";
    return `<div class="line" data-line="${p.id}">
      <a class="line__media" href="${p.url}" aria-hidden="true" tabindex="-1">${miniJar(p)}</a>
      <div class="line__body">
        <a class="line__title" href="${p.url}">${esc(p.name)}</a>
        <div class="line__meta">${esc(p.sub)} · ${money(p.price)}</div>
        <div class="line__row">
          <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
            <button type="button" data-dec aria-label="Decrease quantity">−</button>
            <input type="number" inputmode="numeric" min="0" max="${p.stock}" value="${i.qty}" aria-label="Quantity">
            <button type="button" data-inc aria-label="Increase quantity">+</button>
          </div>
          <strong class="price">${money(p.price * i.qty)}</strong>
        </div>
        ${compact ? "" : `<button type="button" class="line__remove" data-remove>Remove</button>`}
      </div>
    </div>`;
  }

  function totalsHTML(opts = {}) {
    const sub = Cart.subtotal(); const disc = Promo.discount(sub); const promo = Promo.get();
    const ship = opts.ship; const tax = opts.tax;
    const total = sub - disc + (ship?.price || 0) + (tax || 0);
    return `<div class="totals">
      <div><span>Subtotal</span><span>${money(sub)}</span></div>
      ${disc ? `<div class="discount"><span>${esc(promo.code)} — ${esc(promo.label)}</span><span>−${money(disc)}</span></div>` : ""}
      ${ship ? `<div><span>Shipping · ${esc(ship.name)}</span><span>${ship.price ? money(ship.price) : "Free"}</span></div>` : `<div><span>Shipping</span><span class="muted">${sub >= CFG.freeShipOver || Promo.freeShip() ? "Free" : "Calculated at checkout"}</span></div>`}
      ${tax !== undefined ? `<div><span>Estimated tax</span><span>${tax ? money(tax) : "—"}</span></div>` : ""}
      <div class="grand"><span>Total</span><span>${money(total)}</span></div>
    </div>`;
  }

  function freeShipHTML() {
    const sub = Cart.subtotal(); const left = CFG.freeShipOver - sub; const pct = Math.min(100, (sub / CFG.freeShipOver) * 100);
    const items = Cart.items();
    /* If the cart is exactly one single jar, the cheapest way to close the gap is the two-jar set — offer it in one tap. */
    const lone = items.length === 1 && items[0].id === "hg-15" && items[0].qty === 1;
    const duo = product("hg-duo");
    const upsell = left > 0 && lone && duo && duo.stock > 0
      ? `<button class="ship-upsell" type="button" data-swap-duo>Make it two jars — ${money(duo.price)}<span>${money(duo.price / 2)} a jar, ${money(23.99 * 2 - duo.price)} less than two bought apart, and it ships free</span></button>`
      : "";
    return `<div class="free-ship"><span>${left > 0 ? `You’re <strong>${money(left)}</strong> from free shipping` : `<strong>Free shipping unlocked.</strong>`}</span><div class="free-ship__bar"><i style="width:${pct}%"></i></div>${upsell}</div>`;
  }

  const emptyHTML = `<div class="empty">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 3h12l1 5H5l1-5zM5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8z"/><path d="M9 12c0 2 1 3 3 3s3-1 3-3"/></svg>
    <p>Your cart is empty. The spoon is waiting.</p><a class="btn btn--ghost btn--sm" href="/shop/">Shop the jar</a></div>`;

  function render() {
    const n = Cart.count();
    $$("[data-cart-count]").forEach((b) => { if (n > +(b.textContent || 0)) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); } b.textContent = n; n ? b.setAttribute("data-show", "") : b.removeAttribute("data-show"); });
    const items = Cart.items();

    // drawer
    const dl = $("[data-drawer-lines]"); if (dl) dl.innerHTML = items.length ? items.map((i) => lineHTML(i, true)).join("") : emptyHTML;
    const df = $("[data-drawer-foot]"); if (df) { df.hidden = !items.length; if (items.length) df.innerHTML = `${freeShipHTML()}${totalsHTML()}<a class="btn btn--primary btn--block" href="/checkout/">Checkout</a><a class="btn btn--link mx-auto small" href="/cart/">View cart &amp; add a note</a>`; }

    // cart page
    const cp = $("[data-cart-page]"); if (cp) cp.innerHTML = items.length ? items.map((i) => lineHTML(i)).join("") : emptyHTML;
    const cs = $("[data-cart-summary]"); if (cs) { cs.innerHTML = freeShipHTML() + totalsHTML(); }
    $$("[data-cart-has]").forEach((el) => (el.hidden = !items.length));

    // checkout summary
    const co = $("[data-summary-lines]"); if (co) co.innerHTML = items.length ? items.map((i) => lineHTML(i, true)).join("") : emptyHTML;
    Checkout.recalc?.();

    // promo state
    $$("[data-promo-form]").forEach((f) => { const p = Promo.get(); const inp = $("input", f); const msg = $(".promo-msg", f); if (p && inp && !inp.value) { inp.value = p.code; msg.textContent = `${p.label} applied`; msg.setAttribute("data-ok", ""); } });

    // wishlist buttons
    $$("[data-wish]").forEach((b) => b.setAttribute("aria-pressed", String(Wish.has(b.dataset.wish))));

    // stock labels
    $$("[data-stock]").forEach((el) => {
      const p = product(el.dataset.stock); if (!p) return;
      el.classList.remove("stock--low", "stock--out");
      if (p.stock <= 0) { el.textContent = "Sold out — next batch in about 3 weeks"; el.classList.add("stock--out"); }
      else if (p.stock <= CFG.lowStockAt) { el.textContent = `Only ${p.stock} left in this batch`; el.classList.add("stock--low"); }
      else el.textContent = "In stock — ships in 1–2 days";
    });
    $$("[data-add]").forEach((b) => { const p = product(b.dataset.add); if (p && p.stock <= 0) { b.disabled = true; b.textContent = "Sold out"; } });
    $$("[data-express-buy]").forEach((b) => { const p = product(b.dataset.expressBuy); if (p && p.stock <= 0) b.disabled = true; });

    // account header hint
    const u = Auth.user();
    $$("[data-user-name]").forEach((el) => (el.textContent = u ? u.name.split(" ")[0] : ""));
    $$("[data-auth-in]").forEach((el) => (el.hidden = !u));
    $$("[data-auth-out]").forEach((el) => (el.hidden = !!u));
  }

  /* ---------- 4. Drawer ---------- */
  const Drawer = {
    el: null, last: null,
    open() { if (!this.el) return; this.last = document.activeElement; this.el.setAttribute("data-open", ""); this.el.removeAttribute("aria-hidden"); document.body.style.overflow = "hidden"; setTimeout(() => $(".drawer__head button", this.el)?.focus(), 60); },
    close() { if (!this.el) return; this.el.removeAttribute("data-open"); this.el.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; this.last?.focus?.(); },
    init() {
      this.el = $("#cart-drawer"); if (!this.el) return;
      $("[data-drawer-close]", this.el)?.addEventListener("click", () => this.close());
      $(".drawer-backdrop")?.addEventListener("click", () => this.close());
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && this.el.hasAttribute("data-open")) this.close(); });
      // focus trap
      this.el.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;
        const f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', this.el).filter((x) => x.offsetParent);
        if (!f.length) return; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    },
  };

  /* ---------- 5. Global delegated events ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-add],[data-express-buy],[data-cart-open],[data-wish],[data-inc],[data-dec],[data-remove],[data-swap-duo],[data-menu-open],[data-menu-close],[data-promo-clear],[data-signout]");
    if (!t) return;
    if (t.dataset.add !== undefined) { const q = parseInt($("[data-qty-input]")?.value || "1", 10) || 1; Cart.add(t.dataset.add, q); t.setAttribute("data-added", ""); setTimeout(() => t.removeAttribute("data-added"), 900); }
    else if (t.dataset.expressBuy !== undefined) {
      /* Apple Pay from the product page: add the jar (qty from the selector if present), then open checkout with the
         Apple Pay sheet armed. With Stripe you'd instead mount the Express Checkout Element right here on the PDP. */
      e.preventDefault(); const p = product(t.dataset.expressBuy); if (!p || p.stock <= 0) return;
      const q = parseInt($("[data-qty-input]")?.value || "1", 10) || 1;
      const items = Cart.items(); const line = items.find((i) => i.id === p.id);
      if (line) line.qty = Math.min(line.qty + q, p.stock); else items.push({ id: p.id, qty: Math.min(q, p.stock) });
      store.set(Cart.key, items); t.setAttribute("aria-busy", "true"); location.href = "/checkout/?express=apple-pay";
    }
    else if (t.dataset.cartOpen !== undefined) { e.preventDefault(); Drawer.open(); }
    else if (t.dataset.wish !== undefined) Wish.toggle(t.dataset.wish);
    else if (t.dataset.inc !== undefined || t.dataset.dec !== undefined) {
      const line = t.closest("[data-line]"); const inp = $("input", line.querySelector(".qty"));
      if (line) Cart.setQty(line.dataset.line, (parseInt(inp.value, 10) || 0) + (t.dataset.inc !== undefined ? 1 : -1));
      else { const i = t.closest(".qty").querySelector("input"); i.value = Math.max(1, Math.min(+i.max || 99, (+i.value || 1) + (t.dataset.inc !== undefined ? 1 : -1))); i.dispatchEvent(new Event("change")); }
    }
    else if (t.dataset.remove !== undefined) Cart.remove(t.closest("[data-line]").dataset.line);
    else if (t.dataset.swapDuo !== undefined) { Cart.save(Cart.items().filter((i) => i.id !== "hg-15").concat([{ id: "hg-duo", qty: 1 }])); toast("Swapped to the two-jar set — shipping is on us"); }
    else if (t.dataset.menuOpen !== undefined) { const m = $("#mobile-nav"); m.setAttribute("data-open", ""); m.removeAttribute("aria-hidden"); document.body.style.overflow = "hidden"; $("[data-menu-close]", m)?.focus(); }
    else if (t.dataset.menuClose !== undefined) { const m = $("#mobile-nav"); m.removeAttribute("data-open"); m.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; $("[data-menu-open]")?.focus(); }
    else if (t.dataset.promoClear !== undefined) { Promo.clear(); $$("[data-promo-form] input").forEach((i) => (i.value = "")); $$(".promo-msg").forEach((m) => { m.textContent = ""; m.removeAttribute("data-ok"); }); }
    else if (t.dataset.signout !== undefined) { e.preventDefault(); Auth.logout(); }
  });
  document.addEventListener("change", (e) => {
    const line = e.target.closest("[data-line]"); if (line && e.target.matches(".qty input")) Cart.setQty(line.dataset.line, parseInt(e.target.value, 10) || 0);
  });
  document.addEventListener("submit", (e) => {
    const f = e.target;
    if (f.matches("[data-promo-form]")) { e.preventDefault(); const r = Promo.apply($("input", f).value); const m = $(".promo-msg", f); m.textContent = r.msg; m.toggleAttribute("data-ok", r.ok); m.toggleAttribute("data-err", !r.ok); }
    if (f.matches("[data-news-form]")) { e.preventDefault(); const em = $('input[type="email"]', f); if (!em.checkValidity()) { em.reportValidity(); return; } f.innerHTML = `<p class="small" role="status">Welcome in. Your first note arrives with the next batch — and code <strong>FIRSTJAR</strong> takes 15% off your first order, up to $5.</p>`; /* Real: POST to Klaviyo / Mailchimp / your API */ }
  });

  /* ---------- 6. Form validation helper (WCAG: error text is tied via aria-describedby) ---------- */
  function validate(form) {
    let ok = true;
    $$(".field", form).forEach((fld) => {
      const inp = $("input,select,textarea", fld); if (!inp || !inp.required && !inp.value) { fld.removeAttribute("data-invalid"); return; }
      const bad = !inp.checkValidity(); fld.toggleAttribute("data-invalid", bad); inp.setAttribute("aria-invalid", String(bad));
      if (bad && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------- 7. Page modules ---------- */

  /* PDP: gallery, qty, sticky buy bar */
  function initPDP() {
    const g = $("[data-gallery]");
    if (g) {
      const main = $(".gallery__main", g); const thumbs = $$(".gallery__thumbs button", g); const slides = $$("[data-slide]", g);
      thumbs.forEach((b, i) => b.addEventListener("click", () => { slides.forEach((s, j) => (s.hidden = j !== i)); thumbs.forEach((t, j) => t.setAttribute("aria-current", String(j === i))); }));
      // keyboard arrows on main
      main?.addEventListener("keydown", (e) => { const cur = thumbs.findIndex((t) => t.getAttribute("aria-current") === "true"); if (e.key === "ArrowRight") thumbs[(cur + 1) % thumbs.length].click(); if (e.key === "ArrowLeft") thumbs[(cur - 1 + thumbs.length) % thumbs.length].click(); });
    }
    const bar = $("#buybar"); const anchor = $("[data-buy-anchor]");
    if (bar && anchor && "IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => bar.toggleAttribute("data-show", !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);
    }
    // PDP shipping snippet: estimate from remembered zip
    const est = $("[data-ship-estimate]");
    if (est) { const s = Ship.get(); const q = Ship.quote(s.country, s.zip, product(est.dataset.shipEstimate)?.price || 0)[0]; est.textContent = s.zip ? `Arrives in ${Ship.daysLabel(q.days)} to ${s.zip}` : `Arrives in ${Ship.daysLabel(q.days)}`; }
  }

  /* Shipping calculator (used on cart, checkout, shipping policy) */
  function initShipCalc() {
    $$("[data-ship-calc]").forEach((calc) => {
      const country = $('select[name="country"]', calc), zip = $('input[name="zip"]', calc), out = $(".ship-calc__result", calc);
      const saved = Ship.get(); if (country) country.value = saved.country; if (zip) zip.value = saved.zip;
      const run = () => {
        const c = country?.value || "US", z = zip?.value || "";
        if (c === "US" && !/^\d{5}(-\d{4})?$/.test(z)) { out.innerHTML = `<p class="small muted">Enter a 5-digit ZIP for a live estimate.</p>`; return; }
        Ship.set({ country: c, zip: z });
        const sub = Cart.subtotal() || 23.99;
        const rates = Ship.quote(c, z, sub);
        out.innerHTML = `<table class="rate-table" aria-label="Shipping estimates"><thead><tr><th>Method</th><th>Arrives</th><th>Cost</th></tr></thead><tbody>${rates.map((r) => `<tr><td><strong>${esc(r.name)}</strong><br><span class="tiny muted">${esc(r.note)}</span></td><td>${Ship.daysLabel(r.days)}</td><td>${r.price ? money(r.price) : "Free"}</td></tr>`).join("")}</tbody></table>
          <p class="tiny muted">Estimates for a ${money(sub)} order${Ship.isCA(c, z) ? " · CA sales tax added at checkout" : ""}. Orders placed before 1pm PT ship the same day.</p>`;
        Checkout.recalc?.();
      };
      calc.addEventListener("submit", (e) => { e.preventDefault(); run(); });
      zip?.addEventListener("input", () => { if (zip.value.length >= 5) run(); });
      country?.addEventListener("change", run);
      if (saved.zip) run();
    });
  }

  /* Checkout */
  const Checkout = {
    init() {
      const form = $("#checkout-form"); if (!form) return;
      if (!Cart.items().length) { $("[data-checkout-empty]")?.removeAttribute("hidden"); form.hidden = true; return; }
      const u = Auth.user();
      if (u) { $('[name="email"]', form).value = u.email; const parts = u.name.split(" "); $('[name="first"]', form).value = parts[0] || ""; $('[name="last"]', form).value = parts.slice(1).join(" ") || ""; $("[data-guest-note]")?.setAttribute("hidden", ""); $("[data-account-note]")?.removeAttribute("hidden"); }
      const addrs = store.get("sw_addresses", []); const def = addrs.find((a) => a.default) || addrs[0];
      if (u && def) { ["address", "address2", "city", "state", "zip"].forEach((k) => { const el = $(`[name="${k}"]`, form); if (el && def[k]) el.value = def[k]; }); }

      // shipping rates
      const rates = $("[data-rates]"); const zip = $('[name="zip"]', form), country = $('[name="country"]', form);
      const drawRates = () => {
        const s = Ship.get(); const list = Ship.quote(country.value, zip.value, Cart.subtotal());
        const cur = list.find((r) => r.id === s.rate) ? s.rate : list[0].id;
        rates.innerHTML = list.map((r) => `<label><input type="radio" name="rate" value="${r.id}" ${r.id === cur ? "checked" : ""}><span><span class="opt__title">${esc(r.name)}</span><br><span class="opt__meta">${Ship.daysLabel(r.days)} · ${esc(r.note)}</span></span><span class="opt__price">${r.price ? money(r.price) : "Free"}</span></label>`).join("");
        Ship.set({ rate: cur }); this.recalc();
      };
      rates.addEventListener("change", (e) => { Ship.set({ rate: e.target.value }); this.recalc(); });
      zip.addEventListener("input", () => { if (zip.value.length >= 5) { Ship.set({ zip: zip.value, country: country.value }); drawRates(); } });
      country.addEventListener("change", () => { Ship.set({ country: country.value }); drawRates(); });
      if (!zip.value && Ship.get().zip) zip.value = Ship.get().zip;
      drawRates();

      // payment method toggle
      $$('input[name="pay"]', form).forEach((r) => r.addEventListener("change", () => { $("[data-card-fields]").hidden = r.value !== "card"; }));

      // Express wallets
      this.initExpress(form);
      if (new URLSearchParams(location.search).get("express") === "apple-pay") { const ap = $("[data-apple-pay]"); ap?.scrollIntoView({ block: "center" }); setTimeout(() => ap?.click(), 350); }

      // Submit (card)
      form.addEventListener("submit", (e) => {
        e.preventDefault(); if (!validate(form)) return;
        const btn = $('[type="submit"]', form); btn.disabled = true; btn.textContent = "Processing…";
        /* REAL: 1) POST cart+address to /api/checkout → server creates Stripe PaymentIntent
                 2) stripe.confirmCardPayment(clientSecret, { payment_method: { card } })
                 3) on success → server marks order paid → redirect to confirmation. Never send raw card data to your server. */
        setTimeout(() => this.complete(form, "Card"), 900);
      });
    },
    quote() { const s = Ship.get(); return Ship.quote(s.country, s.zip, Cart.subtotal()).find((r) => r.id === s.rate); },
    recalc() {
      const box = $("[data-checkout-totals]"); if (!box) return;
      const s = Ship.get(); const ship = this.quote(); const sub = Cart.subtotal() - Promo.discount(Cart.subtotal());
      const tax = Ship.isCA(s.country, s.zip) ? +(sub * CFG.taxRateCA).toFixed(2) : 0;
      box.innerHTML = totalsHTML({ ship, tax });
      const total = sub + (ship?.price || 0) + tax; $$("[data-total]").forEach((el) => (el.textContent = money(total)));
      this._total = total; this._tax = tax; this._ship = ship;
    },
    initExpress(form) {
      const ap = $("[data-apple-pay]"); const gp = $("[data-gpay]"); const sp = $("[data-shop-pay]");
      /* Apple Pay availability. On Safari/iOS with a card in Wallet, ApplePaySession.canMakePayments() is true.
         We still render the button elsewhere (as Apple's HIG allows for demo) but mark it. */
      const hasAP = !!(window.ApplePaySession && ApplePaySession.canMakePayments());
      if (ap) {
        ap.dataset.native = String(hasAP);
        ap.addEventListener("click", async () => {
          const s = Ship.get(); const total = this._total ?? Cart.subtotal();
          if (hasAP) {
            /* REAL Apple Pay JS flow (merchant validation MUST happen on your server):
               const session = new ApplePaySession(6, {
                 countryCode: "US", currencyCode: "USD",
                 supportedNetworks: ["visa", "masterCard", "amex", "discover"],
                 merchantCapabilities: ["supports3DS"],
                 requiredShippingContactFields: ["postalAddress", "email", "name"],
                 shippingMethods: Ship.quote(...).map(r => ({ label: r.name, amount: r.price.toFixed(2), identifier: r.id, detail: Ship.daysLabel(r.days) })),
                 total: { label: "Functional Elixirs", amount: total.toFixed(2) },
               });
               session.onvalidatemerchant = async (e) => {
                 const res = await fetch("/api/apple-pay/validate", { method: "POST", body: JSON.stringify({ url: e.validationURL }) });
                 session.completeMerchantValidation(await res.json());
               };
               session.onshippingcontactselected = (e) => { ...recompute rates from e.shippingContact.postalCode; session.completeShippingContactSelection(...) };
               session.onpaymentauthorized = async (e) => {
                 // Send e.payment.token to Stripe: stripe.confirmPayment with the Apple Pay PaymentMethod, or your PSP's decrypt endpoint
                 const r = await fetch("/api/apple-pay/charge", { method: "POST", body: JSON.stringify({ token: e.payment.token, cart: Cart.items() }) });
                 session.completePayment(r.ok ? ApplePaySession.STATUS_SUCCESS : ApplePaySession.STATUS_FAILURE);
                 if (r.ok) Checkout.complete(form, "Apple Pay", e.payment.shippingContact);
               };
               session.begin();
               ————— With Stripe, the simplest route is Stripe's Payment Request Button / Express Checkout Element,
               which wraps Apple Pay + Google Pay + Link in one element and handles merchant validation for you. */
          }
          // Payment Request API path (Chrome/Edge/Safari): shows the browser's native sheet where supported.
          if (window.PaymentRequest) {
            try {
              const methods = [{ supportedMethods: "https://apple.com/apple-pay", data: { version: 3, merchantIdentifier: "merchant.com.functionalelixirs", merchantCapabilities: ["supports3DS"], supportedNetworks: ["visa", "masterCard", "amex"], countryCode: "US" } }, { supportedMethods: "https://google.com/pay", data: { environment: "TEST", apiVersion: 2, apiVersionMinor: 0, merchantInfo: { merchantName: "Functional Elixirs" }, allowedPaymentMethods: [{ type: "CARD", parameters: { allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX"] }, tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "example", gatewayMerchantId: "exampleGatewayMerchantId" } } }] } }];
              const details = { total: { label: "Functional Elixirs", amount: { currency: "USD", value: total.toFixed(2) } }, displayItems: Cart.items().map((i) => ({ label: `${product(i.id).name} × ${i.qty}`, amount: { currency: "USD", value: (product(i.id).price * i.qty).toFixed(2) } })) };
              const req = new PaymentRequest(methods, details, { requestPayerEmail: true, requestShipping: false });
              if (await req.canMakePayment()) { const resp = await req.show(); await resp.complete("success"); this.complete(form, "Apple Pay", { emailAddress: resp.payerEmail }); return; }
            } catch (err) { /* user dismissed sheet or unsupported → fall through to demo */ if (err?.name === "AbortError") return; }
          }
          // Demo fallback: simulate the sheet so the flow is testable anywhere.
          ap.disabled = true; ap.setAttribute("aria-busy", "true"); toast("Opening Apple Pay…");
          setTimeout(() => this.complete(form, "Apple Pay"), 1100);
        });
      }
      gp?.addEventListener("click", () => { toast("Opening Google Pay…"); setTimeout(() => this.complete(form, "Google Pay"), 1100); /* REAL: google.payments.api.PaymentsClient().loadPaymentData(...) */ });
      sp?.addEventListener("click", () => { toast("Opening Shop Pay…"); setTimeout(() => this.complete(form, "Shop Pay"), 1100); /* REAL: Shop Pay button via Shopify's Web Components or Stripe's Link as the equivalent accelerated checkout */ });
    },
    complete(form, method, contact) {
      const fd = new FormData(form); const s = Ship.get(); const ship = this.quote(); const u = Auth.user();
      const items = Cart.items().map((i) => ({ id: i.id, qty: i.qty, name: product(i.id).name, price: product(i.id).price }));
      const sub = Cart.subtotal(); const disc = Promo.discount(sub);
      const order = {
        id: uid("FE-"), tracking: "1ZFE" + Math.floor(1e9 + Math.random() * 9e9), placed: Date.now(), method,
        email: fd.get("email") || contact?.emailAddress || u?.email || "guest@functionalelixirs.com",
        name: `${fd.get("first") || ""} ${fd.get("last") || ""}`.trim() || u?.name || "Guest",
        address: { line1: fd.get("address") || "", line2: fd.get("address2") || "", city: fd.get("city") || "", state: fd.get("state") || "", zip: fd.get("zip") || s.zip, country: fd.get("country") || s.country },
        shipping: ship || { name: "Standard", price: 0, days: [4, 7] }, items, subtotal: sub, discount: disc, promo: Promo.get()?.code || null,
        tax: this._tax || 0, total: this._total ?? sub, status: "confirmed", guest: !u,
      };
      Orders.add(order);
      if (fd.get("create_account") && !u && fd.get("email")) Auth.signup({ name: order.name, email: fd.get("email"), password: fd.get("new_password") || "" });
      if (fd.get("save_address") && u) { const a = store.get("sw_addresses", []); a.push({ id: uid("A"), label: "Home", name: order.name, ...order.address, default: !a.length }); store.set("sw_addresses", a); }
      Cart.clear(); Promo.clear();
      location.href = `/order-confirmation/?order=${order.id}`;
    },
  };

  /* Confirmation */
  function initConfirmation() {
    const box = $("[data-confirmation]"); if (!box) return;
    const id = new URLSearchParams(location.search).get("order"); const o = Orders.find(id) || Orders.all()[0];
    if (!o) { box.innerHTML = `<div class="empty"><p>We couldn’t find that order in this browser.</p><a class="btn btn--ghost btn--sm" href="/track-order/">Track an order</a></div>`; return; }
    const eta = new Date(o.placed + (o.shipping.days[1] + 1) * 864e5).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    box.innerHTML = `
      <div class="confirm-hero">
        <div class="check-ring" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.5l4.5 4.5L19 7"/></svg></div>
        <p class="eyebrow">Order confirmed</p>
        <h1>Thank you, ${esc(o.name.split(" ")[0])}.</h1>
        <p class="lede mx-auto" style="max-width:32em;margin-top:1rem">Your jar is being packed by hand. A confirmation is on its way to <strong>${esc(o.email)}</strong>.</p>
        <p style="margin-top:1.25rem"><span class="order-no">${esc(o.id)}</span></p>
      </div>
      <div class="grid grid--2" style="align-items:start">
        <div class="panel"><div class="panel__head"><h2>Delivery</h2><span class="pill">${esc(o.shipping.name)}</span></div>
          <p class="small">${o.shipping.days[0] === 0 ? "Ready for pickup today after 2pm." : `Estimated arrival by <strong>${eta}</strong>.`}</p>
          ${o.address.line1 ? `<address class="small muted" style="font-style:normal;margin-top:.75rem">${esc(o.address.line1)}${o.address.line2 ? "<br>" + esc(o.address.line2) : ""}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.zip)}</address>` : ""}
          <p class="small" style="margin-top:1rem">Tracking: <a href="/track-order/?q=${o.tracking}"><code>${o.tracking}</code></a></p></div>
        <div class="panel"><div class="panel__head"><h2>Summary</h2><span class="small muted">Paid with ${esc(o.method)}</span></div>
          ${o.items.map((i) => `<div class="order-row"><span>${esc(i.name)} <span class="muted">× ${i.qty}</span></span><span>${money(i.price * i.qty)}</span></div>`).join("")}
          <div class="totals" style="margin-top:1rem"><div><span>Subtotal</span><span>${money(o.subtotal)}</span></div>${o.discount ? `<div class="discount"><span>${esc(o.promo)}</span><span>−${money(o.discount)}</span></div>` : ""}<div><span>Shipping</span><span>${o.shipping.price ? money(o.shipping.price) : "Free"}</span></div>${o.tax ? `<div><span>Tax</span><span>${money(o.tax)}</span></div>` : ""}<div class="grand"><span>Total</span><span>${money(o.total)}</span></div></div></div>
      </div>
      <div class="center" style="margin-top:3rem"><div class="cluster" style="justify-content:center"><a class="btn btn--primary" href="/track-order/?q=${o.id}">Track this order</a>${o.guest ? `<a class="btn btn--ghost" href="/account/signup/">Create an account to save it</a>` : `<a class="btn btn--ghost" href="/account/">View in your account</a>`}</div>
        <p class="small muted" style="margin-top:1.5rem">While you wait: <a href="/ritual/">read the ritual</a> or <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">learn how to keep honey at its best</a>.</p></div>`;
  }

  /* Tracking */
  function initTrack() {
    const f = $("#track-form"); if (!f) return; const out = $("[data-track-result]");
    const q0 = new URLSearchParams(location.search).get("q"); if (q0) $("input", f).value = q0;
    const draw = (q) => {
      q = (q || "").trim().toUpperCase(); const o = Orders.find(q);
      const placed = o ? o.placed : /^(FE-|1Z)/.test(q) ? Date.now() - 2.3 * 864e5 : null;
      if (!placed) { out.innerHTML = `<p class="form-msg form-msg--err" data-show>We couldn’t find that number. Order numbers look like <code>FE-XXXXXX</code>; tracking numbers start with <code>1ZFE</code>.</p>`; return; }
      const hrs = (Date.now() - placed) / 36e5; const days = o?.shipping?.days || [4, 7];
      const steps = [
        ["Order confirmed", "We’ve received your order and sent a receipt.", 0],
        ["Packed by hand", "Your jar is wrapped in paper and tucked into a recycled-fiber box.", 6],
        ["Handed to carrier", `Scanned in by ${days[1] <= 3 ? "UPS" : "USPS"} · label ${o?.tracking || q}`, 20],
        ["In transit", "Moving through the network. Scans update a few times a day.", 30],
        ["Out for delivery", "On the truck — usually delivered by 8pm local time.", (days[1] - 0.5) * 24],
        ["Delivered", "Scoop. Stir. Sip.", days[1] * 24],
      ];
      const nowIdx = steps.reduce((k, s, i) => (hrs >= s[2] ? i : k), 0);
      out.innerHTML = `<div class="panel"><div class="panel__head"><h2>${o ? esc(o.id) : esc(q)}</h2><span class="pill ${nowIdx >= 5 ? "" : "pill--gold"}">${esc(steps[nowIdx][0])}</span></div>
        <p class="small muted">Placed ${new Date(placed).toLocaleDateString("en-US", { month: "long", day: "numeric" })}${o ? ` · ${esc(o.shipping.name)}` : ""}${nowIdx < 5 ? ` · estimated delivery ${new Date(placed + (days[1] + 1) * 864e5).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}` : ""}</p>
        <ol class="track-line" style="list-style:none;padding-left:2rem">${steps.map((s, i) => `<li class="track-step" ${i < nowIdx ? "data-done" : i === nowIdx ? "data-now" : ""}><strong>${s[0]}</strong><span>${s[1]}</span></li>`).join("")}</ol>
        <p class="tiny muted">Something look off? <a href="/contact/">Write to us</a> — a human answers within one business day.</p></div>`;
    };
    f.addEventListener("submit", (e) => { e.preventDefault(); draw($("input", f).value); });
    if (q0) draw(q0);
  }

  /* Auth forms */
  function initAuth() {
    const su = $("#signup-form");
    su?.addEventListener("submit", (e) => { e.preventDefault(); if (!validate(su)) return; const fd = new FormData(su); const r = Auth.signup({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") }); const m = $(".form-msg", su); if (!r.ok) { m.textContent = r.msg; m.className = "form-msg form-msg--err"; m.setAttribute("data-show", ""); return; } location.href = "/account/"; });
    const li = $("#login-form");
    li?.addEventListener("submit", (e) => { e.preventDefault(); if (!validate(li)) return; const fd = new FormData(li); Auth.login({ email: fd.get("email"), password: fd.get("password") }); location.href = new URLSearchParams(location.search).get("next") || "/account/"; });
    const fp = $("#forgot-form");
    fp?.addEventListener("submit", (e) => { e.preventDefault(); if (!validate(fp)) return; const m = $(".form-msg", fp); m.textContent = "If that email has an account, a reset link is on its way. Check spam if it’s shy."; m.className = "form-msg form-msg--ok"; m.setAttribute("data-show", ""); fp.querySelector("button").disabled = true; /* Real: POST /api/auth/forgot */ });
  }

  /* Account pages */
  function initAccount() {
    const root = $("[data-account]"); if (!root) return;
    const u = Auth.user();
    if (!u) { root.innerHTML = `<div class="gated"><h2 class="serif">Please log in</h2><p class="muted">Your orders, addresses and wishlist live behind your account.</p><div class="cluster"><a class="btn btn--primary" href="/account/login/?next=${encodeURIComponent(location.pathname)}">Log in</a><a class="btn btn--ghost" href="/account/signup/">Create account</a></div></div>`; return; }
    const view = root.dataset.account;
    if (view === "orders") {
      const os = Orders.all();
      root.innerHTML = `<div class="panel"><div class="panel__head"><h2>Welcome back, ${esc(u.name.split(" ")[0])}</h2><span class="small muted">${esc(u.email)}</span></div><p class="small muted">Your orders, addresses and saved jars — everything in one quiet place.</p></div>
        <div class="panel"><div class="panel__head"><h2>Orders</h2>${os.length ? `<span class="small muted">${os.length} total</span>` : ""}</div>
        ${os.length ? os.map((o) => `<div class="order-row"><div><strong>${esc(o.id)}</strong><br><span class="muted">${new Date(o.placed).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${o.items.reduce((n, i) => n + i.qty, 0)} item${o.items.length > 1 ? "s" : ""} · ${money(o.total)}</span></div><div style="text-align:right"><span class="pill">${esc(o.status)}</span><br><a class="tiny" href="/track-order/?q=${o.id}">Track</a></div></div>`).join("") : `<p class="small muted">No orders yet. <a href="/shop/honey-with-fresh-ginger/">Start with the 15 oz jar</a> — it’s the one that started everything.</p>`}</div>`;
    }
    if (view === "addresses") {
      const draw = () => {
        const a = store.get("sw_addresses", []);
        root.innerHTML = `<div class="panel"><div class="panel__head"><h2>Addresses</h2><button class="btn btn--soft btn--sm" data-addr-new>Add address</button></div>
          <div class="addr">${a.length ? a.map((x) => `<div class="addr__card" data-id="${x.id}"><div class="cluster" style="justify-content:space-between"><strong>${esc(x.label)}</strong>${x.default ? `<span class="pill">Default</span>` : ""}</div><address>${esc(x.name)}<br>${esc(x.line1)}${x.line2 ? "<br>" + esc(x.line2) : ""}<br>${esc(x.city)}, ${esc(x.state)} ${esc(x.zip)}</address><div class="cluster">${x.default ? "" : `<button class="btn btn--link tiny" data-addr-default>Make default</button>`}<button class="btn btn--link tiny" data-addr-del>Remove</button></div></div>`).join("") : `<p class="small muted">No saved addresses yet — add one to speed through checkout.</p>`}</div>
          <form class="form form--tight" data-addr-form hidden style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--cream-3)">
            <div class="field-row"><div class="field"><label for="a-label">Label</label><input class="input" id="a-label" name="label" placeholder="Home" required></div><div class="field"><label for="a-name">Full name</label><input class="input" id="a-name" name="name" autocomplete="name" required value="${esc(u.name)}"></div></div>
            <div class="field"><label for="a-line1">Street address</label><input class="input" id="a-line1" name="line1" autocomplete="address-line1" required></div>
            <div class="field"><label for="a-line2">Apt, suite (optional)</label><input class="input" id="a-line2" name="line2" autocomplete="address-line2"></div>
            <div class="field-row field-row--3"><div class="field"><label for="a-city">City</label><input class="input" id="a-city" name="city" autocomplete="address-level2" required></div><div class="field"><label for="a-state">State</label><input class="input" id="a-state" name="state" autocomplete="address-level1" required maxlength="2" placeholder="CA"></div><div class="field"><label for="a-zip">ZIP</label><input class="input" id="a-zip" name="zip" autocomplete="postal-code" inputmode="numeric" pattern="\\d{5}(-\\d{4})?" required></div></div>
            <div class="cluster"><button class="btn btn--primary btn--sm" type="submit">Save address</button><button class="btn btn--link" type="button" data-addr-cancel>Cancel</button></div></form></div>`;
        $("[data-addr-new]", root).onclick = () => { $("[data-addr-form]", root).hidden = false; $("#a-label").focus(); };
        $("[data-addr-cancel]", root).onclick = () => ($("[data-addr-form]", root).hidden = true);
        $("[data-addr-form]", root).onsubmit = (e) => { e.preventDefault(); const f = e.target; if (!validate(f)) return; const fd = Object.fromEntries(new FormData(f)); const list = store.get("sw_addresses", []); list.push({ id: uid("A"), ...fd, default: !list.length }); store.set("sw_addresses", list); toast("Address saved"); draw(); };
        $$("[data-addr-del]", root).forEach((b) => (b.onclick = () => { const id = b.closest("[data-id]").dataset.id; let l = store.get("sw_addresses", []).filter((x) => x.id !== id); if (l.length && !l.some((x) => x.default)) l[0].default = true; store.set("sw_addresses", l); draw(); }));
        $$("[data-addr-default]", root).forEach((b) => (b.onclick = () => { const id = b.closest("[data-id]").dataset.id; store.set("sw_addresses", store.get("sw_addresses", []).map((x) => ({ ...x, default: x.id === id }))); draw(); }));
      };
      draw();
    }
    if (view === "wishlist") {
      const draw = () => {
        const w = Wish.items().map(product).filter(Boolean);
        root.innerHTML = `<div class="panel"><div class="panel__head"><h2>Wishlist</h2><span class="small muted">${w.length} saved</span></div>
          ${w.length ? `<div class="addr">${w.map((p) => `<div class="addr__card" style="grid-template-columns:4rem 1fr;display:grid;gap:1rem;align-items:center"><div class="line__media">${miniJar(p)}</div><div><a class="line__title" href="${p.url}">${esc(p.name)}</a><div class="line__meta">${esc(p.sub)} · ${money(p.price)}</div><div class="cluster" style="margin-top:.5rem"><button class="btn btn--primary btn--sm" data-add="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>${p.stock <= 0 ? "Sold out" : "Add to cart"}</button><button class="btn btn--link tiny" data-wish="${p.id}">Remove</button></div></div></div>`).join("")}</div>` : `<p class="small muted">Nothing saved yet. Tap the heart on any product to keep it here.</p><p style="margin-top:1rem"><a class="btn btn--ghost btn--sm" href="/shop/">Shop</a></p>`}</div>`;
      };
      draw(); document.addEventListener("click", (e) => { if (e.target.closest("[data-wish]") && root.contains(e.target)) setTimeout(draw, 0); });
    }
  }

  /* Contact form */
  function initContact() {
    const f = $("#contact-form"); if (!f) return;
    f.addEventListener("submit", (e) => { e.preventDefault(); if (!validate(f)) return; const m = $(".form-msg", f); m.textContent = "Thank you — we read every note and reply within one business day (Mon–Fri, 9–5 PT)."; m.className = "form-msg form-msg--ok"; m.setAttribute("data-show", ""); f.querySelector('[type="submit"]').disabled = true; /* Real: POST /api/contact or a form service (Formspree, Basin) */ });
  }

  /* Cookie notice — essential-only by default (CCPA/CPRA friendly) */
  function initCookie() {
    const c = $("#cookie"); if (!c) return;
    if (store.get("sw_cookie", null)) return; c.setAttribute("data-show", "");
    $$("button", c).forEach((b) => b.addEventListener("click", () => { store.set("sw_cookie", { choice: b.dataset.cookie, at: Date.now() }); c.removeAttribute("data-show"); }));
  }

  /* Reveal on scroll */
  function initReveal() {
    const els = $$(".reveal"); if (!els.length || !("IntersectionObserver" in window)) { els.forEach((e) => e.setAttribute("data-in", "")); return; }
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.setAttribute("data-in", ""); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* Current nav */
  function markNav() { const p = location.pathname; $$(".nav a, .mobile-nav nav a").forEach((a) => { const h = a.getAttribute("href"); if (h !== "/" && p.startsWith(h)) a.setAttribute("aria-current", "page"); }); }

  /* ---------- 7b. Selling layer ---------- */

  /* Bundle tiers: the radio picks which SKU the buy buttons add. */
  function initTiers() {
    $$("[data-tiers]").forEach((box) => {
      const sync = () => {
        const r = $('input[name="tier"]:checked', box); if (!r) return;
        const p = product(r.value); if (!p) return;
        $$("[data-tier-add]").forEach((b) => { b.dataset.add = p.id; const l = $("[data-tier-label]", b); if (l) l.textContent = money(p.price); });
        $$("[data-tier-express]").forEach((b) => (b.dataset.expressBuy = p.id));
        $$("[data-tier-price]").forEach((el) => (el.textContent = money(p.price)));
        $$("[data-tier-compare]").forEach((el) => { el.textContent = p.compareAt ? money(p.compareAt) : ""; el.hidden = !p.compareAt; });
        $$("[data-tier-stock]").forEach((el) => (el.dataset.stock = p.id));
        $$("[data-tier-ship]").forEach((el) => {
          const free = p.price >= CFG.freeShipOver;
          el.innerHTML = free ? "<strong>Ships free.</strong> No minimum to hit." : `Add ${money(CFG.freeShipOver - p.price)} more for free shipping`;
        });
        render();
      };
      box.addEventListener("change", (e) => { if (e.target.name === "tier") sync(); });
      sync();
    });
  }

  /* Same-day dispatch line — honest: counts down to the real 1pm PT cutoff, then rolls to the next business day. */
  function initDispatch() {
    const els = $$("[data-dispatch]"); if (!els.length) return;
    const tick = () => {
      const now = new Date();
      // "now" expressed in Los Angeles wall-clock time
      const pt = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
      const cutoff = new Date(pt); cutoff.setHours(13, 0, 0, 0);
      const day = pt.getDay(); const weekend = day === 0 || day === 6;
      let msg;
      if (!weekend && pt < cutoff) {
        const mins = Math.floor((cutoff - pt) / 60000), h = Math.floor(mins / 60), m = mins % 60;
        msg = `<strong>Ships today</strong> if you order in the next ${h ? h + "h " : ""}${m}m`;
      } else {
        const next = new Date(pt); next.setDate(next.getDate() + 1);
        while (next.getDay() === 0 || next.getDay() === 6) next.setDate(next.getDate() + 1);
        msg = `<strong>Ships ${next.toLocaleDateString("en-US", { weekday: "long" })}</strong> — packed by hand in small batches`;
      }
      els.forEach((el) => (el.innerHTML = msg));
    };
    tick(); setInterval(tick, 60000);
  }

  /* Sticky desktop buy bar — mirrors the mobile one above 56em. */
  function initDeskbar() {
    const bar = $("#deskbar"), anchor = $("[data-buy-anchor]");
    if (!bar || !anchor || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(([en]) => bar.toggleAttribute("data-show", !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);
  }

  /* First-order email capture: once per 14 days, never on cart/checkout, never if already joined. */
  function initCapture() {
    const el = $("#capture"); if (!el) return;
    if (/^\/(cart|checkout|order-confirmation|account)\//.test(location.pathname)) return;
    const seen = store.get("sw_capture", null);
    if (seen && (Date.now() - seen.at) < 14 * 864e5) return;
    let opened = false;
    const open = () => {
      if (opened || document.querySelector(".drawer[data-open]")) return;
      opened = true; el.setAttribute("data-open", ""); el.removeAttribute("aria-hidden");
      store.set("sw_capture", { at: Date.now(), state: "shown" });
      setTimeout(() => $("input", el)?.focus(), 340);
    };
    const close = () => { el.removeAttribute("data-open"); el.setAttribute("aria-hidden", "true"); };
    const timer = setTimeout(open, 28000);
    const exit = (e) => { if (e.clientY <= 0) { clearTimeout(timer); open(); document.removeEventListener("mouseout", exit); } };
    document.addEventListener("mouseout", exit);
    $$("[data-capture-close]", el).forEach((b) => b.addEventListener("click", close));
    $(".capture-backdrop")?.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && el.hasAttribute("data-open")) close(); });
    $("form", el)?.addEventListener("submit", (e) => {
      e.preventDefault(); const em = $('input[type="email"]', e.target);
      if (!em.checkValidity()) { em.reportValidity(); return; }
      store.set("sw_capture", { at: Date.now(), state: "joined" });
      /* REAL: POST to Klaviyo / Mailchimp here, then issue a single-use code. */
      $("[data-capture-body]", el).innerHTML = `<h2>Here's your code.</h2><p>15% off your first jar — it's already waiting in your cart at checkout.</p><p><span class="capture__code">FIRSTJAR</span></p><p style="margin-top:1.25rem"><a class="btn btn--primary btn--block" href="/shop/honey-with-fresh-ginger/">Shop the 15 oz jar</a></p>`;
      Promo.apply("FIRSTJAR");
    });
  }

  /* ---------- 8. Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    Drawer.init(); render(); markNav();
    initPDP(); initTiers(); initDispatch(); initDeskbar(); initCapture(); initShipCalc(); Checkout.init(); initConfirmation(); initTrack(); initAuth(); initAccount(); initContact(); initCookie(); initReveal();
    window.addEventListener("storage", (e) => { if (e.key?.startsWith("sw_")) render(); }); // multi-tab sync
  });

  window.FE = { Cart, Promo, Ship, Wish, Auth, Orders, CFG }; // handy for debugging / analytics hooks
})();
