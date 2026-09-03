#!/usr/bin/env node
/* Static build: renders every page to <path>/index.html, plus sitemap.xml, robots.txt, RSS, logo + OG images.
   Usage: SITE_URL=https://your-domain.com node build.mjs */
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { SITE_URL, logoMark, BRAND } from "./src/site.mjs";
import { PRODUCTS, HERO } from "./src/products.mjs";
import { ARTICLES } from "./src/articles.mjs";
import { ogImage } from "./src/art.mjs";
import core from "./src/pages/core.mjs";
import account from "./src/pages/account.mjs";
import brand from "./src/pages/brand.mjs";
import journal from "./src/pages/journal.mjs";
import support from "./src/pages/support.mjs";

const ROOT = new URL(".", import.meta.url).pathname;
const out = (rel, content) => { const f = join(ROOT, rel); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, content); return f; };

// Clean previously generated HTML directories (keeps src/, assets/, config)
const KEEP = new Set(["src", "assets", "node_modules", ".git", ".vercel", "build.mjs", "package.json", "vercel.json", "README.md", ".gitignore", "LICENSE"]);
for (const name of readdirSync(ROOT)) { if (KEEP.has(name)) continue; const p = join(ROOT, name); if (statSync(p).isDirectory() || /\.(html|xml|txt)$/.test(name)) rmSync(p, { recursive: true, force: true }); }

const pages = [...core(), ...account(), ...brand(), ...journal(), ...support()];
const seen = new Set();
for (const { path, html } of pages) {
  if (seen.has(path)) throw new Error("Duplicate path " + path); seen.add(path);
  out(path.endsWith(".html") ? path.slice(1) : join(path.slice(1), "index.html"), html);
}

// Brand assets
const standalone = (svg) => svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
out("assets/img/logo.svg", standalone(logoMark({ size: 512, wordmark: false, id: "logo" })));
out("assets/img/favicon.svg", standalone(logoMark({ size: 64, wordmark: false, id: "fav" })));
out("assets/img/apple-touch-icon.svg", standalone(logoMark({ size: 180, wordmark: false, id: "ati" })));
out("assets/img/og-default.svg", ogImage(null));
for (const p of PRODUCTS) out(`assets/img/og-${p.slug}.svg`, ogImage(p));

// Sitemap (indexable pages only), robots, RSS
const noindex = new Set(["/cart/", "/checkout/", "/order-confirmation/", "/account/", "/account/addresses/", "/account/wishlist/", "/account/signup/", "/account/login/", "/account/forgot-password/", "/404.html"]);
const today = new Date().toISOString().slice(0, 10);
const prio = (p) => p === "/" ? "1.0" : p.startsWith("/shop/honey-with-fresh-ginger/") ? "0.9" : p.startsWith("/shop") || p.startsWith("/collections") ? "0.8" : p.startsWith("/journal/") && p !== "/journal/" ? "0.6" : ["/privacy/", "/terms/", "/cookies/", "/sitemap/"].includes(p) ? "0.3" : "0.7";
const urls = pages.map((p) => p.path).filter((p) => !noindex.has(p));
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemapns.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><changefreq>${u === "/" || u.startsWith("/shop") ? "weekly" : "monthly"}</changefreq><priority>${prio(u)}</priority></url>`).join("\n")}\n</urlset>\n`.replace("sitemapns.org", "sitemaps.org"));
out("robots.txt", `# ${BRAND.name} — robots.txt
# Everything public is crawlable. Transactional and account pages are noindex via <meta> and excluded here for tidiness.
User-agent: *
Allow: /
Disallow: /cart/
Disallow: /checkout/
Disallow: /order-confirmation/
Disallow: /account/

# AI crawlers: allowed by default. Uncomment to opt out of training crawls.
# User-agent: GPTBot
# Disallow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
out("journal/feed.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${BRAND.name} Journal</title><link>${SITE_URL}/journal/</link><description>Notes on honey, ginger and the daily ritual.</description>${ARTICLES.map((a) => `<item><title>${esc(a.title)}</title><link>${SITE_URL}${a.url}</link><guid>${SITE_URL}${a.url}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${esc(a.description)}</description></item>`).join("")}</channel></rss>\n`);

console.log(`✓ ${pages.length} pages · ${urls.length} in sitemap · ${PRODUCTS.length} products · ${ARTICLES.length} articles → ${SITE_URL}`);
