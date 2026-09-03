/* Journal index + article pages */
import { page, jsonld, breadcrumbs, ctaBand, esc, HERO_URL } from "../layout.mjs";
import { ARTICLES, bySlug } from "../articles.mjs";
import { HERO } from "../products.mjs";
import { art, photo } from "../art.mjs";

const fmt = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const media = (a) => a.photo ? photo(a.photo) : art(a.art, HERO, { alt: `${a.title} — Functional Elixirs honey with fresh ginger jar in a kitchen scene` });
const card = (a) => `<article class="acard reveal"><div class="acard__media">${media(a)}</div><span class="meta">${a.tag} · ${a.readTime} min read · <time datetime="${a.date}">${fmt(a.date)}</time></span><h3><a href="${a.url}">${esc(a.title)}</a></h3><p>${esc(a.excerpt)}</p></article>`;

function index() {
  const path = "/journal/";
  const body = `${breadcrumbs([{ name: "Journal", href: path }])}
<div class="wrap page-head"><p class="eyebrow">Journal</p><h1>Notes from the kitchen</h1><p class="lede measure--wide">Short pieces on the ritual, the jar, and what to do with it — storage, tea, recipes, gifting. New notes monthly.</p></div>
<section class="section--tight"><div class="wrap grid grid--3">${ARTICLES.map(card).join("")}</div></section>
${ctaBand("Read enough. Try the spoon.", `Honey with Fresh Ginger, 15 oz — $23.99.`)}`;
  return { path, html: page({ title: "Journal — Notes on Honey, Ginger and the Daily Ritual", description: "The Functional Elixirs journal: the morning ritual, how to store raw honey, using honey-ginger in tea and cooking, gifting, seasonal ideas and jar care.", path, body, breadcrumbs: [{ name: "Journal", href: path }] }) };
}

function article(a) {
  const rel = (a.related || []).map((s) => bySlug[s]).filter(Boolean);
  const body = `${breadcrumbs([{ name: "Journal", href: "/journal/" }, { name: a.title, href: a.url }])}
<article>
  <header class="wrap--narrow article-head"><a class="tag" href="/journal/">${a.tag}</a><h1 style="margin-top:var(--s-4)">${esc(a.title)}</h1><p class="meta"><time datetime="${a.date}">${fmt(a.date)}</time> · ${a.readTime} min read · by ${"Functional Elixirs"}</p></header>
  <div class="wrap--narrow"><div class="article-hero">${media(a)}</div></div>
  <div class="wrap--prose prose">${a.body}
    ${a.faq ? `<h2>Quick answers</h2>${a.faq.map(([q, ans]) => `<h3>${esc(q)}</h3><p>${ans}</p>`).join("")}` : ""}
    <div class="callout"><strong>The jar in this story</strong><p style="margin-top:.4em"><a href="${HERO_URL}">Honey with Fresh Ginger, 15 oz</a> — $23.99, free shipping over $45. Or read <a href="/ritual/">the ritual</a> first.</p></div>
  </div>
</article>
<section class="wrap related"><div class="section-head"><p class="eyebrow">Keep reading</p><h2>Related notes</h2></div><div class="grid grid--3">${rel.map(card).join("")}</div></section>
${ctaBand()}`;
  return { path: a.url, html: page({ title: a.title, description: a.description, path: a.url, body, type: "article", published: a.date, modified: a.modified, jsonld: [jsonld.article(a), ...(a.faq ? [jsonld.faq(a.faq)] : [])], breadcrumbs: [{ name: "Journal", href: "/journal/" }, { name: a.title, href: a.url }] }) };
}

export default () => [index(), ...ARTICLES.map(article)];
