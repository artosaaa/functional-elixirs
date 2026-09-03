/* Brand config + shared helpers used by every page template.
   ⚠ VERIFY before launch: email, governing state, founding year, social handles (see README → "Facts to confirm"). */
export const SITE_URL = (process.env.SITE_URL || "https://functional-elixirs-iskakanmarketingvercel.vercel.app").replace(/\/$/, "");

export const BRAND = {
  name: "Functional Elixirs",
  short: "F·E",
  legal: "Functional Elixirs LLC",
  tagline: "Nature’s Daily Elixir.",
  ritual: "Scoop. Stir. Sip.",
  positioning: "Rich raw honey infused with real fresh ginger — two ingredients, one daily ritual, from our mother’s kitchen to yours.",
  email: "hello@functionalelixirs.com",
  address: { city: "", region: "CA", country: "US" },
  hours: "Mon–Fri 9am–5pm PT",
  founded: 2023,
  social: { instagram: "https://instagram.com/functionalelixirs", facebook: "https://facebook.com/functionalelixirs" },
  disclaimer: "These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.",
};

export const CFG = { freeShipOver: 45, lowStockAt: 10, returnsDays: 30 };

export const NAV = [
  { label: "Shop", href: "/shop/" },
  { label: "The Ritual", href: "/ritual/" },
  { label: "Journal", href: "/journal/" },
  { label: "Our Story", href: "/our-story/" },
];

export const HERO_URL = "/shop/honey-with-fresh-ginger/";

export const FOOTER = {
  shop: [
    ["All products", "/shop/"], ["Honey with Fresh Ginger — 15 oz", HERO_URL],
    ["Gifts under $30", "/collections/gifts-under-30/"], ["New here? Start here", "/collections/for-beginners/"], ["Gift guide", "/gift-guide/"],
  ],
  about: [
    ["Our story", "/our-story/"], ["The ritual", "/ritual/"], ["Ingredients & sourcing", "/sourcing/"], ["Sustainability", "/sustainability/"], ["Journal", "/journal/"],
  ],
  help: [
    ["FAQ", "/faq/"], ["Contact", "/contact/"], ["Shipping & delivery", "/shipping/"], ["Returns & exchanges", "/returns/"], ["Track an order", "/track-order/"], ["Account", "/account/"],
  ],
  legal: [["Privacy", "/privacy/"], ["Terms", "/terms/"], ["Cookies", "/cookies/"], ["Sitemap", "/sitemap/"]],
};

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const money = (n) => `$${Number(n).toFixed(2)}`;
export const abs = (p) => SITE_URL + p;

/* ---------- The F·E plaque mark, recreated as vector from the printed label ----------
   Navy plaque with notched corners, double gold rule, Roman-cap F and E, olive branch, wordmark.
   If you have the original vector file, drop it at assets/img/logo.svg and set LOGO_FILE=true. */
export function logoMark({ size = 32, wordmark = true, id = "fe" } = {}) {
  const plaque = "M16 0H184A16 16 0 0 0 200 16V184A16 16 0 0 0 184 200H16A16 16 0 0 0 0 184V16A16 16 0 0 0 16 0Z";
  const leaf = (x, y, r, l) => `<ellipse cx="${x}" cy="${y}" rx="${l}" ry="${l * .32}" transform="rotate(${r} ${x} ${y})" fill="#D4AC54"/>`;
  const branch = `<g>
    <path d="M56 158 C 90 120, 120 88, 170 34" fill="none" stroke="#D4AC54" stroke-width="2.6" stroke-linecap="round"/>
    ${leaf(66, 138, -62, 12)}${leaf(88, 126, 8, 12)}${leaf(84, 112, -66, 12)}${leaf(108, 104, 4, 12)}${leaf(104, 90, -68, 12)}${leaf(128, 82, 0, 12)}${leaf(124, 68, -70, 12)}${leaf(148, 60, -4, 12)}${leaf(146, 46, -72, 11)}${leaf(166, 40, -10, 10)}
    <circle cx="70" cy="152" r="3.2" fill="#D4AC54"/><circle cx="98" cy="118" r="2.8" fill="#D4AC54"/><circle cx="118" cy="98" r="2.6" fill="#D4AC54"/><circle cx="142" cy="72" r="2.6" fill="#D4AC54"/><circle cx="160" cy="52" r="2.4" fill="#D4AC54"/>
  </g>`;
  const mark = `<svg viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-labelledby="${id}-t" class="fe-mark"><title id="${id}-t">Functional Elixirs</title>
    <path d="${plaque}" fill="#1D2B33"/>
    <path d="${plaque}" fill="none" stroke="#D4AC54" stroke-width="2.4" transform="translate(100 100) scale(.94) translate(-100 -100)"/>
    <path d="${plaque}" fill="none" stroke="#D4AC54" stroke-width="1.2" transform="translate(100 100) scale(.895) translate(-100 -100)"/>
    <text x="26" y="112" font-family="Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif" font-size="104" fill="#D4AC54">F</text>
    <text x="122" y="152" font-family="Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif" font-size="104" fill="#D4AC54">E</text>
    ${branch}
    <text x="100" y="173" text-anchor="middle" font-family="Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif" font-size="17.5" letter-spacing="1.6" fill="#D4AC54">FUNCTIONAL</text>
    <text x="100" y="191" text-anchor="middle" font-family="Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif" font-size="17.5" letter-spacing="2.4" fill="#D4AC54">ELIXIRS</text>
  </svg>`;
  return wordmark ? `${mark}<span class="logo__word"><span>Functional</span><span>Elixirs</span></span>` : mark;
}

/* Inline icon set — stroke icons, currentColor, 24 grid */
const I = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;
export const ICONS = {
  cart: I('<path d="M6 3h12l1 5H5l1-5zM5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8z"/><path d="M9 12c0 2 1 3 3 3s3-1 3-3"/>'),
  user: I('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'),
  menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  leaf: I('<path d="M20 4c-8 0-14 4-15 12 4 1 9-1 12-6M5 16l-1 4"/><path d="M8 13c2 0 4 0 6-1"/>'),
  truck: I('<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>'),
  shield: I('<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>'),
  star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z"/></svg>`,
  check: I('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z"/></svg>`,
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  pin: I('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>'),
  refresh: I('<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>'),
  spoon: I('<path d="M12 21v-8"/><ellipse cx="12" cy="7.5" rx="4" ry="5.5"/>'),
  cup: I('<path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8zM17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M9 3c0 1-1 1-1 2s1 1 1 2M13 3c0 1-1 1-1 2s1 1 1 2"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: I('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  lock: I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  drop: I('<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>'),
  root: I('<path d="M4 14c3-1 5-4 8-4s5 2 8 1M8 10c0-3 2-5 4-5s4 2 4 5M6 18c2 1 4 0 6 0s4 1 6 0"/>'),
  apple: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8C6.1 7.5 4 9.5 4 13.2c0 1.2.2 2.4.6 3.6.6 1.6 2.6 5.4 4.7 5.3 1.1 0 1.8-.7 3.2-.7s2 .7 3.2.7c2.1 0 3.9-3.5 4.5-5.1-2.8-1.3-3.8-3.4-3.8-4.3zM13.9 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>`,
};
export const stars = (n = 5) => `<span class="stars" aria-hidden="true">${ICONS.star.repeat(Math.round(n))}</span>`;
