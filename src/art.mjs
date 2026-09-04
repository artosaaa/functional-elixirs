/* ==========================================================================
   Scene generator — EDITORIAL candidate.
   Still-life "photographs" of the Honey with Fresh Ginger jar: a large,
   rounded jar in a lot of negative space, one or two props, cream wall,
   blonde-wood table, long soft light from the upper left, film grain.
   Same contract as src/art.mjs: PHOTOS, REAL, art(), ogImage(), altFor(), photo().
   ========================================================================== */
import { esc, logoPlaque, logoVector } from "./site.mjs";

/* ------------------------------------------------------------------
   REAL PHOTOS — just drop image files into  assets/img/product/
   and the build uses them automatically. No code changes needed.

   Filenames it looks for (jpg / jpeg / png / webp / avif):
     hero.jpg      → the big home + product hero (jar on the table, props)
     front.jpg     → jar straight on, alone
     open.jpg      → lid off, dipper / honey visible
     cup.jpg       → cup in front, jar behind
   Per-size overrides (optional) — prefix with the product id:
     hg-15-hero.jpg, hg-8-front.jpg, dipper-front.jpg, ...
   Anything missing falls back to the next best photo, then to the
   generated SVG scene. See README → "Swapping in real photos".
   ------------------------------------------------------------------ */
import { readdirSync, existsSync } from "node:fs";

const PHOTO_DIR = new URL("../assets/img/product/", import.meta.url);
const VARIANTS_ORDER = ["hero", "front", "open", "cup"];
export const PHOTOS = {};
const WIDTHS = {};   /* <name>-400 / <name>-800 responsive variants */
try {
  if (existsSync(PHOTO_DIR)) {
    for (const f of readdirSync(PHOTO_DIR)) {
      const m = /^(.*?)\.(jpe?g|png|webp|avif)$/i.exec(f); if (!m) continue;
      const key = m[1].toLowerCase();
      if (/-(400|800)$/.test(key)) { WIDTHS[key] = `/assets/img/product/${f}`; continue; }
      PHOTOS[key] = `/assets/img/product/${f}`;
    }
  }
} catch {}
/* resolve a photo for (productId, variant): exact → generic variant → any sibling variant → none */
function findPhoto(pid, variant) {
  const tries = [`${pid}-${variant}`, variant, ...VARIANTS_ORDER.filter((v) => v !== variant).map((v) => `${pid}-${v}`), ...VARIANTS_ORDER.filter((v) => v !== variant)];
  for (const t of tries) if (PHOTOS[t]) return PHOTOS[t];
  return null;
}
export const photoCount = () => Object.keys(PHOTOS).length;

export const REAL = {
  ritual: { src: "/assets/img/ritual-teapot-window-light.jpg", w: 480, h: 640, alt: "Pale celadon teapot and cup on a linen-covered wooden table beside a tall window, soft morning light and red curtains" },
  garden: { src: "/assets/img/tea-table-garden-morning.jpg", w: 480, h: 640, alt: "Teapot and two cups of pale tea on a dark table overlooking a sunlit garden and lake" },
  terraces: { src: "/assets/img/garden-terraces-green.jpg", w: 640, h: 480, alt: "Green terraced garden with a tall cedar, a pond and two small tents under a moving sky" },
  jars: { src: "/assets/img/honey-ginger-jars-kitchen.jpg", w: 640, h: 640, alt: "A pyramid of Functional Elixirs Honey with Fresh Ginger jars with wooden lids stacked on a marble kitchen counter" },
};

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = ([r, g, b]) => `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
const shade = (h, k) => rgb(hex(h).map((v) => (k < 0 ? v * (1 + k) : v + (255 - v) * k)));
const r1 = (v) => Math.round(v * 10) / 10;
const SERIF = "Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif";
const SCRIPT = "Snell Roundhand, Brush Script MT, Segoe Script, cursive";
const SANS = "-apple-system, Segoe UI, Helvetica, Arial, sans-serif";

/* ---------- jar geometry (local units: glass body 300 wide, origin = centre of the glass top) ---------- */
const BODY = "M-150 10 Q-150 -4 -136 -4 H136 Q150 -4 150 10 V236 A150 36 0 0 1 -150 236 Z";
const LABEL = "M-142 38 Q0 84 142 38 V230 Q0 276 -142 230 Z";
const JAR_BASE = 272; // local y of the bottom apex

function defs(id, p) {
  const honey = p?.honey || "#7A3E0F";
  return `<defs>
    <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F2EA"/><stop offset=".55" stop-color="#EFE7DA"/><stop offset="1" stop-color="#E2D7C5"/></linearGradient>
    <radialGradient id="${id}-light" cx=".22" cy=".08" r=".75"><stop offset="0" stop-color="#FFFCF5" stop-opacity=".9"/><stop offset=".5" stop-color="#FFF9EE" stop-opacity=".25"/><stop offset="1" stop-color="#FFF9EE" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-table" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6D5B8"/><stop offset=".45" stop-color="#DBC5A1"/><stop offset="1" stop-color="#C6AA82"/></linearGradient>
    <linearGradient id="${id}-tablex" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a3f22" stop-opacity=".14"/></linearGradient>
    <linearGradient id="${id}-wallfoot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4020" stop-opacity="0"/><stop offset="1" stop-color="#5a4020" stop-opacity=".12"/></linearGradient>
    <linearGradient id="${id}-horizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3418" stop-opacity=".16"/><stop offset="1" stop-color="#4a3418" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}-lidside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A98A5C"/><stop offset=".18" stop-color="#E9D2A6"/><stop offset=".5" stop-color="#E3C89A"/><stop offset=".82" stop-color="#C9AC7C"/><stop offset="1" stop-color="#93764C"/></linearGradient>
    <linearGradient id="${id}-lidv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2a12" stop-opacity=".28"/></linearGradient>
    <radialGradient id="${id}-lidtop" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#F4E4C2"/><stop offset=".6" stop-color="#E4CB9D"/><stop offset="1" stop-color="#C5A672"/></radialGradient>
    <linearGradient id="${id}-honey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(honey, -.62)}"/><stop offset=".14" stop-color="${shade(honey, -.2)}"/><stop offset=".36" stop-color="${shade(honey, .3)}"/><stop offset=".6" stop-color="${honey}"/><stop offset=".86" stop-color="${shade(honey, -.25)}"/><stop offset="1" stop-color="${shade(honey, -.65)}"/></linearGradient>
    <linearGradient id="${id}-honeyv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1a0a02" stop-opacity=".45"/></linearGradient>
    <radialGradient id="${id}-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E08A32" stop-opacity=".55"/><stop offset="1" stop-color="#E08A32" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}-surface" cx=".38" cy=".4" r=".7"><stop offset="0" stop-color="${shade(honey, .38)}"/><stop offset=".6" stop-color="${honey}"/><stop offset="1" stop-color="${shade(honey, -.5)}"/></radialGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".09" stop-color="#fff" stop-opacity=".1"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#fff" stop-opacity=".04"/><stop offset=".93" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#1a0c04" stop-opacity=".35"/></linearGradient>
    <linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1a0a" stop-opacity=".42"/><stop offset=".1" stop-color="#2a1a0a" stop-opacity=".1"/><stop offset=".3" stop-color="#2a1a0a" stop-opacity="0"/><stop offset=".72" stop-color="#2a1a0a" stop-opacity="0"/><stop offset=".9" stop-color="#2a1a0a" stop-opacity=".14"/><stop offset="1" stop-color="#2a1a0a" stop-opacity=".46"/></linearGradient>
    <linearGradient id="${id}-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A6835A"/><stop offset=".35" stop-color="#E2C592"/><stop offset=".7" stop-color="#D4B47E"/><stop offset="1" stop-color="#9A7749"/></linearGradient>
    <linearGradient id="${id}-ceramic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFDF8"/><stop offset=".12" stop-color="#F8F3EA"/><stop offset=".5" stop-color="#F1EADC"/><stop offset=".85" stop-color="#CFC2AC"/><stop offset="1" stop-color="#A89A83"/></linearGradient>
    <linearGradient id="${id}-ceramicv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a4a36" stop-opacity=".22"/></linearGradient>
    <radialGradient id="${id}-tea" cx=".42" cy=".4" r=".68"><stop offset="0" stop-color="#EBBD6C"/><stop offset=".6" stop-color="#CD8E3F"/><stop offset=".85" stop-color="#A5672A"/><stop offset="1" stop-color="#6E3F14"/></radialGradient>
    <linearGradient id="${id}-gingerv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#4a2e14" stop-opacity=".3"/></linearGradient>
    <linearGradient id="${id}-rind" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6DB63"/><stop offset="1" stop-color="#CFA426"/></linearGradient>
    <linearGradient id="${id}-ginger" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EBD6AC"/><stop offset=".5" stop-color="#D5B27E"/><stop offset="1" stop-color="#A88459"/></linearGradient>
    <radialGradient id="${id}-veil"><stop offset="0" stop-color="#FDFAF2" stop-opacity=".92"/><stop offset=".55" stop-color="#FDFAF2" stop-opacity=".78"/><stop offset="1" stop-color="#FDFAF2" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}-lemon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FBEFA6"/><stop offset=".72" stop-color="#F3D65E"/><stop offset=".8" stop-color="#FCF6DA"/><stop offset=".9" stop-color="#F1CF48"/><stop offset="1" stop-color="#D9B22E"/></radialGradient>
    <radialGradient id="${id}-vig" cx=".5" cy=".5" r=".72"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#3a2614" stop-opacity=".2"/></radialGradient>
    <filter id="${id}-soft" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="${id}-softer" x="-50%" y="-80%" width="200%" height="260%"><feGaussianBlur stdDeviation="34"/></filter>
    <filter id="${id}-contact" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="${id}-glowf" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="${id}-sweep" x="-100%" y="-10%" width="300%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${id}-steam" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="${id}-dof" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4.5"/></filter>
    <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .4 0 0 0 0 .35 0 0 0 .06 0"/></filter>
    <clipPath id="${id}-body"><path d="${BODY}"/></clipPath>
    <clipPath id="${id}-label"><path d="${LABEL}"/></clipPath>
  </defs>`;
}

/* ---------- room ---------- */
const wall = (id, H) => `<rect width="1000" height="${H}" fill="url(#${id}-wall)"/><rect width="1000" height="${H}" fill="url(#${id}-light)"/>`;
function bokeh(id, anim) {
  const dots = [[840, 150, 90, .26], [930, 320, 62, .18], [720, 96, 48, .22], [120, 260, 72, .12], [640, 240, 34, .16], [900, 92, 30, .18]];
  return `<g filter="url(#${id}-soft)"><ellipse class="window-glow" cx="790" cy="150" rx="330" ry="270" fill="#FFF6DC" opacity=".5"/></g>
  <g class="${anim ? "bokeh" : ""}" filter="url(#${id}-soft)">${dots.map(([x, y, r, o], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF8E6" opacity="${o}" style="--i:${i}"/>`).join("")}</g>`;
}
function table(id, y, H) {
  const grain = Array.from({ length: 7 }, (_, i) => { const yy = y + 50 + i * ((H - y) / 7) + (i % 2) * 9; return `<path d="M-20 ${yy} C 260 ${yy - 6}, 560 ${yy + 8}, 1020 ${yy - 3}" fill="none" stroke="#8a6a44" stroke-opacity=".${i % 3 ? "04" : "06"}" stroke-width="${1 + (i % 3) * .5}"/>`; }).join("");
  return `<rect x="0" y="${y - 70}" width="1000" height="70" fill="url(#${id}-wallfoot)"/><rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-table)"/><rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-tablex)"/>${grain}<rect x="0" y="${y}" width="1000" height="90" fill="url(#${id}-horizon)"/>`;
}
/* long soft shadow (light from upper left → shadow reaches right) + tight contact shadow */
const shadow = (id, cx, cy, rx, ry, o = .3, cls = "", f = "soft") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3a2410" opacity="${o}" filter="url(#${id}-${f})"/>`;
const ground = (id, cx, cy, w, s = 1, cls = "float-shadow") => `${shadow(id, cx + w * .42 * s, cy + 8, w * 1.1 * s, 32 * s, .32, "", "softer")}${shadow(id, cx + w * .06, cy + 2, w * .72 * s, 13 * s, .42, cls, "contact")}`;

/* ---------- the label: wrapped stripes (compressed toward the edges), white panel, plaque, HONEY / with fresh / GINGER ---------- */
function label(id, p) {
  const isDipper = p?.id === "dipper";
  let stripes = "";
  for (let t = -1.4; t <= 1.41; t += .1) {
    const x = r1(150 * Math.sin(t));
    stripes += `<path d="M${x} 30V280" stroke="#EFE0A6" stroke-width="${r1(8.6 * Math.cos(t))}"/>`;
  }
  const mark = logoPlaque({ x: -42, y: 64, size: 84 });
  const body = isDipper
    ? `<text x="0" y="198" text-anchor="middle" font-family="${SERIF}" font-size="25" letter-spacing="4" fill="#B8903E" font-weight="700" stroke="#B8903E" stroke-width=".8">DIPPER</text><text x="0" y="226" text-anchor="middle" font-family="${SCRIPT}" font-size="10.5" fill="#6B5A3E" font-style="italic">Crafted from family tradition</text><text x="0" y="240" text-anchor="middle" font-family="${SANS}" font-size="7.5" letter-spacing="1" fill="#6B5A3E">${esc(p?.size || "6 in")}</text>`
    : `<text x="0" y="176" text-anchor="middle" font-family="${SERIF}" font-size="27" letter-spacing="3.4" fill="#B8903E" font-weight="700" stroke="#B8903E" stroke-width=".8">HONEY</text>
       <text x="0" y="190" text-anchor="middle" font-family="${SCRIPT}" font-size="12" fill="#6B5A3E" font-style="italic">with fresh</text>
       <text x="0" y="215" text-anchor="middle" font-family="${SERIF}" font-size="27" letter-spacing="3.4" fill="#B8903E" font-weight="700" stroke="#B8903E" stroke-width=".8">GINGER</text>
       <text x="0" y="229" text-anchor="middle" font-family="${SCRIPT}" font-size="10" fill="#6B5A3E" font-style="italic">Crafted from family tradition</text>
       <text x="0" y="241" text-anchor="middle" font-family="${SANS}" font-size="7.5" letter-spacing="1" fill="#6B5A3E">${esc(p?.size || "15 oz")} (425 g)</text>`;
  return `<g clip-path="url(#${id}-label)"><path d="${LABEL}" fill="#FBF7EC"/>${stripes}<ellipse cx="0" cy="202" rx="118" ry="62" fill="url(#${id}-veil)"/>${mark}${body}<path d="${LABEL}" fill="url(#${id}-paper)"/><g class="label-sheen"><path d="M-190 -60 L-120 -60 L-40 360 L-110 360 Z" fill="#fff" opacity=".42"/></g></g>`;
}

/* ---------- bamboo lid, on the jar ---------- */
function lidOn(id) {
  const ticks = [-132, -100, -66, -34, 0, 34, 66, 100, 132].map((gx) => `<path d="M${gx} -58V${r1(26 * Math.sqrt(1 - (gx / 162) ** 2) - 4)}" stroke="#8F6D42" stroke-opacity=".14" stroke-width="1.6"/>`).join("");
  const grain = [-18, -12, -6, 0, 6, 12, 18].map((k) => { const w = r1(162 * Math.sqrt(1 - (k / 26) ** 2)); return `<path d="M${-w} ${-66 + k} Q0 ${-66 + k + 2} ${w} ${-66 + k}" fill="none" stroke="#B8975F" stroke-opacity=".28" stroke-width="1.1"/>`; }).join("");
  return `<g>
    <path d="M-162 -66 V0 A162 26 0 0 0 162 0 V-66 Z" fill="url(#${id}-lidside)"/><path d="M-162 -66 V0 A162 26 0 0 0 162 0 V-66 Z" fill="url(#${id}-lidv)"/>${ticks}
    <ellipse cx="0" cy="-66" rx="162" ry="26" fill="url(#${id}-lidtop)"/>${grain}
    <ellipse cx="0" cy="-66" rx="162" ry="26" fill="none" stroke="#F6E8CB" stroke-opacity=".8" stroke-width="2.2"/>
    <path d="M-162 -2 A162 26 0 0 0 162 -2" fill="none" stroke="#5a3d1c" stroke-opacity=".28" stroke-width="3"/>
  </g>`;
}
/* ---------- the same lid lying flat on the table, seen a little more from above ---------- */
function lidFlat(id, x, y, s = 1) {
  const grain = [-40, -28, -16, -4, 8, 20, 32, 44].map((k) => { const w = r1(160 * Math.sqrt(1 - (k / 56) ** 2)); return `<path d="M${-w} ${k} Q0 ${k + 3} ${w} ${k}" fill="none" stroke="#B8975F" stroke-opacity=".3" stroke-width="1.2"/>`; }).join("");
  return `${shadow(id, x + 40 * s, y + 46 * s, 190 * s, 34 * s, .28, "", "softer")}${shadow(id, x + 6 * s, y + 38 * s, 166 * s, 30 * s, .4, "", "contact")}
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-162 0 V34 A162 56 0 0 0 162 34 V0 Z" fill="url(#${id}-lidside)"/><path d="M-162 0 V34 A162 56 0 0 0 162 34 V0 Z" fill="url(#${id}-lidv)"/>
    <ellipse cx="0" cy="0" rx="162" ry="56" fill="url(#${id}-lidtop)"/>${grain}
    <ellipse cx="0" cy="0" rx="162" ry="56" fill="none" stroke="#F6E8CB" stroke-opacity=".85" stroke-width="2.4"/>
    <path d="M-162 36 A162 56 0 0 0 162 36" fill="none" stroke="#5a3d1c" stroke-opacity=".25" stroke-width="2"/>
  </g>`;
}
/* ---------- open mouth, split so the dipper can stand IN the honey: back (neck, rim, surface) → dipper → front (near surface, neck glass, near rim) ---------- */
const NECK = "M-140 -30 V2 A140 22 0 0 0 140 2 V-30 Z";
function mouthBack(id) {
  return `<path d="${NECK}" fill="url(#${id}-honey)"/>
    <ellipse cx="0" cy="-30" rx="140" ry="22" fill="#E9DCC6"/>
    <ellipse cx="0" cy="-29" rx="126" ry="17" fill="url(#${id}-surface)"/>
    <ellipse cx="0" cy="-29" rx="126" ry="17" fill="none" stroke="#3a1a06" stroke-opacity=".35" stroke-width="1.5"/>`;
}
function mouthFront(id) {
  return `<path d="M-126 -29 A126 17 0 0 0 126 -29 L140 -30 V2 A140 22 0 0 1 -140 2 V-30 Z" fill="url(#${id}-honey)"/>
    <path d="M-126 -29 A126 17 0 0 0 126 -29 L140 -30 V2 A140 22 0 0 1 -140 2 V-30 Z" fill="url(#${id}-surface)" opacity=".55"/>
    <path d="${NECK}" fill="url(#${id}-glass)" opacity=".9"/>
    <path d="M-140 -18 A140 22 0 0 0 140 -18 M-140 -6 A140 22 0 0 0 140 -6" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2.4"/>
    <path d="M-140 -30 A140 22 0 0 0 140 -30 L126 -29 A126 17 0 0 1 -126 -29 Z" fill="#E9DCC6"/>
    <path d="M-126 -29 A126 17 0 0 0 126 -29" fill="none" stroke="#3a1a06" stroke-opacity=".3" stroke-width="1.5"/>
    <ellipse cx="-44" cy="-35" rx="34" ry="5" fill="#fff" opacity=".28"/>
    <ellipse cx="0" cy="-30" rx="140" ry="22" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2"/>`;
}
/* ---------- beechwood dipper (local: head at the origin, handle rising) ---------- */
function dipper(id, x, y, rot = 0, s = 1, glaze = "") {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <rect x="-6" y="-178" width="12" height="178" rx="6" fill="url(#${id}-wood)"/>
    <ellipse cx="0" cy="-180" rx="10" ry="9" fill="url(#${id}-wood)"/>
    <path d="M-23 0 C-26 18 -26 34 -21 52 Q0 62 21 52 C26 34 26 18 23 0 Q0 -10 -23 0 Z" fill="url(#${id}-wood)"/>
    ${[8, 21, 34, 46].map((yy) => `<path d="M-${r1(24 - Math.abs(yy - 26) * .14)} ${yy} Q0 ${yy + 7} ${r1(24 - Math.abs(yy - 26) * .14)} ${yy}" fill="none" stroke="#6f5330" stroke-opacity=".45" stroke-width="2"/>`).join("")}
    <path d="M-3 -172 V-8" stroke="#fff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>
    ${glaze ? `<path d="M-24 6 C-26 22 -25 40 -21 52 Q0 62 21 52 C25 40 26 22 24 6 Q0 16 -24 6 Z" fill="${glaze}" opacity=".9"/><path d="M-14 30 Q0 36 14 30" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
    <path d="M2 -104 C 5 -86, -1 -68, 2 -50 C 4 -34, 0 -20, 1 -6" stroke="${glaze}" stroke-width="3.6" stroke-linecap="round" fill="none"/><path class="honey-drip" d="M2 -104 C 5 -86, -1 -68, 2 -50 C 4 -34, 0 -20, 1 -6" stroke="${shade(glaze, .4)}" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".9"/><ellipse cx="3" cy="-104" rx="3" ry="4" fill="${glaze}"/>` : ""}
  </g>`;
}

/* ---------- the jar. (x, base) = scene position of the bottom apex; s = scale ---------- */
function jar(id, p, x, base, s = 1, { lidOff = false, withDipper = false } = {}) {
  const hc = p?.honey || "#7A3E0F";
  const dip = withDipper ? dipper(id, 36, -70, 16, 1, hc) : "";
  const top = lidOff ? `${mouthBack(id)}${dip}${mouthFront(id)}` : `${lidOn(id)}${dip}`;
  return `<g class="float"><g transform="translate(${x} ${base - JAR_BASE * s}) scale(${s})">
    <g clip-path="url(#${id}-body)">
      <rect x="-150" y="-4" width="300" height="280" fill="url(#${id}-honey)"/>
      <ellipse cx="-30" cy="130" rx="90" ry="120" fill="url(#${id}-glow)" filter="url(#${id}-glowf)"/>
      <rect x="-150" y="-4" width="300" height="280" fill="url(#${id}-honeyv)"/>
      <ellipse cx="0" cy="0" rx="160" ry="44" fill="#1a0a02" opacity=".55" filter="url(#${id}-contact)"/>
      <path d="M-150 236 A150 36 0 0 0 150 236" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="5" filter="url(#${id}-sweep)"/>
    </g>
    ${label(id, p)}
    <path d="${BODY}" fill="url(#${id}-glass)"/>
    <g clip-path="url(#${id}-body)">
      <path class="glass-sweep" d="M-120 22 V246" stroke="#fff" stroke-opacity=".5" stroke-width="13" stroke-linecap="round" filter="url(#${id}-sweep)"/>
      <path d="M134 60 V232" stroke="#fff" stroke-opacity=".16" stroke-width="5" stroke-linecap="round" filter="url(#${id}-sweep)"/>
      <path d="M-150 236 A150 36 0 0 0 150 236" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>
    </g>
    <path d="${BODY}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.5"/>
    ${top}
  </g></g>`;
}

/* ---------- stoneware cup (local: rim centre at the origin) ---------- */
function cup(id, x, y, s = 1, { steam = true, anim = false } = {}) {
  const st = steam ? `<g class="${anim ? "steam" : ""}" filter="url(#${id}-steam)" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".5"><path style="--i:0" d="M-44 -30 C -70 -70, -10 -100, -40 -150"/><path style="--i:1" d="M6 -22 C -24 -70, 40 -95, 6 -160"/><path style="--i:2" d="M52 -32 C 34 -70, 84 -100, 56 -140"/></g>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${st}
    <path d="M96 18 C 168 6, 172 108, 98 112" fill="none" stroke="#8f7f68" stroke-opacity=".35" stroke-width="30" stroke-linecap="round" transform="translate(6 6)"/>
    <path d="M96 18 C 168 6, 172 108, 98 112" fill="none" stroke="url(#${id}-ceramic)" stroke-width="26" stroke-linecap="round"/>
    <path d="M-100 0 C-100 60 -96 112 -80 140 Q-58 160 0 160 Q58 160 80 140 C96 112 100 60 100 0 Z" fill="url(#${id}-ceramic)"/>
    <path d="M-100 0 C-100 60 -96 112 -80 140 Q-58 160 0 160 Q58 160 80 140 C96 112 100 60 100 0 Z" fill="url(#${id}-ceramicv)"/>
    <path d="M-92 10 V130" stroke="#fff" stroke-opacity=".45" stroke-width="9" stroke-linecap="round" filter="url(#${id}-sweep)"/>
    <ellipse cx="0" cy="0" rx="100" ry="26" fill="#F2EBDF"/>
    <ellipse cx="0" cy="3" rx="88" ry="20" fill="url(#${id}-tea)"/><path d="M-88 3 A88 20 0 0 1 88 3" fill="none" stroke="#3a1e08" stroke-opacity=".28" stroke-width="7"/>
    <ellipse cx="0" cy="1.5" rx="94" ry="23" fill="none" stroke="#F2EBDF" stroke-width="12"/><ellipse cx="0" cy="0" rx="100" ry="26" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.5"/>
    <ellipse cx="-24" cy="0" rx="30" ry="5.5" fill="#fff" opacity=".32"/>
  </g>`;
}
/* ---------- a hand of fresh ginger: rounded fingers, ring striations, one cut face (glint) ---------- */
function ginger(id, x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-70 10 C-80 -8 -64 -22 -46 -16 C-40 -36 -18 -42 -6 -26 C6 -46 32 -48 42 -30 C58 -52 88 -42 82 -20 C96 -10 98 10 82 18 C92 34 74 48 56 38 C48 56 22 58 12 42 C2 58 -24 56 -32 38 C-52 46 -74 32 -70 10 Z" fill="url(#${id}-ginger)"/>
    <path d="M-70 10 C-80 -8 -64 -22 -46 -16 C-40 -36 -18 -42 -6 -26 C6 -46 32 -48 42 -30 C58 -52 88 -42 82 -20 C96 -10 98 10 82 18 C92 34 74 48 56 38 C48 56 22 58 12 42 C2 58 -24 56 -32 38 C-52 46 -74 32 -70 10 Z" fill="url(#${id}-gingerv)"/>
    <path d="M-52 -6 c 5 6 5 16 0 24 M-20 -24 c 5 8 6 20 1 30 M30 -30 c 5 8 5 20 0 30 M62 -32 c 5 8 5 18 0 26 M42 24 c -6 6 -14 8 -22 4 M-6 30 c -6 4 -12 4 -18 0" fill="none" stroke="#8F6B45" stroke-opacity=".38" stroke-width="2" stroke-linecap="round"/>
    <path d="M-40 -8 C-24 -20 -6 -22 8 -14" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>\n    <path d="M-70 10 C-80 -8 -64 -22 -46 -16 C-40 -36 -18 -42 -6 -26 C6 -46 32 -48 42 -30 C58 -52 88 -42 82 -20 C96 -10 98 10 82 18 C92 34 74 48 56 38 C48 56 22 58 12 42 C2 58 -24 56 -32 38 C-52 46 -74 32 -70 10 Z" fill="#A8875A" opacity=".26"/>
    <g transform="translate(86 0) rotate(-16)"><ellipse cx="0" cy="0" rx="14" ry="20" fill="#F3E6AE"/><ellipse cx="0" cy="0" rx="9" ry="13.5" fill="none" stroke="#CBB46E" stroke-opacity=".7"/><ellipse cx="0" cy="0" rx="14" ry="20" fill="none" stroke="#B9955E" stroke-opacity=".6" stroke-width="1.5"/><ellipse class="glint" cx="-3" cy="-7" rx="4" ry="6" fill="#fff" opacity=".6"/></g>
  </g>`;
}
/* ---------- a lemon half, cut face up, seen from the same three-quarter angle ---------- */
const lemon = (id, x, y, r = 46) => `<g transform="translate(${x} ${y})"><ellipse cx="10" cy="${r * .72}" rx="${r * 1.1}" ry="${r * .24}" fill="#3a2410" opacity=".32" filter="url(#${id}-contact)"/>
  <path d="M${-r} 0 A${r} ${r * .78} 0 0 0 ${r} 0 Z" fill="url(#${id}-rind)"/><path d="M${-r} 0 A${r} ${r * .78} 0 0 0 ${r} 0 Z" fill="url(#${id}-ceramicv)" opacity=".8"/>
  <g transform="scale(1 .52)"><circle r="${r}" fill="url(#${id}-lemon)"/>${[0, 45, 90, 135].map((a) => `<path d="M${-r * .78} 0 H ${r * .78}" stroke="#FCF6D8" stroke-width="2.2" transform="rotate(${a})" opacity=".85"/>`).join("")}<circle r="3.5" fill="#FCF6D8"/></g>
  <ellipse class="glint" cx="${-r * .3}" cy="${-r * .16}" rx="${r * .28}" ry="${r * .08}" fill="#fff" opacity=".55"/></g>`;
const finish = (id, W, H) => `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/><rect width="${W}" height="${H}" filter="url(#${id}-grain)" style="mix-blend-mode:multiply"/>`;

const VARIANTS = {
  hero(id, p, anim) {
    const W = 1000, H = 1200, T = 560;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${ground(id, 400, 930, 300, 1.34)}
      ${jar(id, p, 400, 930, 1.34)}
      ${shadow(id, 840, 1152, 190, 28, .26, "", "softer")}${shadow(id, 768, 1144, 136, 14, .42, "", "contact")}
      ${cup(id, 760, 932, 1.34, { anim })}
      ${shadow(id, 190, 1120, 116, 15, .35, "", "contact")}${ginger(id, 180, 1090, 1.12, -8)}
      ${finish(id, W, H)}`;
  },
  front(id, p, anim) {
    const W = 1000, H = 1250, T = 585;
    const isDipper = p?.id === "dipper";
    const prop = isDipper
      ? `${shadow(id, 300, 1124, 200, 12, .35, "", "contact")}${dipper(id, 440, 1116, -100, 1.3)}`
      : `${shadow(id, 230, 1112, 116, 14, .35, "", "contact")}${ginger(id, 215, 1080, 1.1, -8)}`;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${ground(id, 500, 985, 300, 1.56)}
      ${jar(id, p, 500, 985, 1.56)}
      ${prop}
      ${finish(id, W, H)}`;
  },
  open(id, p, anim) {
    const W = 1000, H = 1250, T = 590;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${ground(id, 400, 985, 300, 1.42)}
      ${jar(id, p, 400, 985, 1.42, { lidOff: true, withDipper: true })}
      ${lidFlat(id, 790, 1075, 1.02)}
      ${finish(id, W, H)}`;
  },
  cup(id, p, anim) {
    const W = 1000, H = 1250, T = 585;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      <g filter="url(#${id}-dof)">${ground(id, 650, 890, 300, 1.05)}${jar(id, p, 650, 890, 1.05)}</g>
      ${shadow(id, 430, 1206, 240, 30, .26, "", "softer")}${shadow(id, 340, 1200, 170, 14, .42, "", "contact")}
      ${cup(id, 330, 960, 1.55, { anim })}
      ${lemon(id, 745, 1120, 72)}
      ${finish(id, W, H)}`;
  },
};

let n = 0;
export function art(variant, p, { alt, anim = false, className = "", slot } = {}) {
  const src = slot ? PHOTOS[slot] : findPhoto(p?.id || "brand", variant);
  if (src) {
    /* the illustration alts describe a scene that no longer exists — describe the photograph */
    const jar = `${p?.name || "Functional Elixirs Honey with Fresh Ginger"}${p?.size ? `, ${p.size}` : ""}`;
    alt = variant === "hero" || variant === "front" ? `${jar} — glass jar with a bamboo lid on a marble counter`
        : variant === "cup" ? `${jar} — the jar photographed from a slightly wider angle on a marble counter`
        : variant === "open" ? `${jar} — jar on a marble counter` : alt;
    if (/hg-(duo|trio)/.test(src)) alt = `${jar} — several jars of Honey with Fresh Ginger stacked on a kitchen counter`;
    const stem = src.replace(/^.*\/(.*)\.[a-z]+$/i, "$1").toLowerCase();
    const set = [400, 800].filter((w) => WIDTHS[`${stem}-${w}`]).map((w) => `${WIDTHS[`${stem}-${w}`]} ${w}w`);
    set.push(`${src} 1000w`);
    /* sizes: cards sit in a 2/3/4-up grid, the hero is roughly half the page */
    const sizes = anim ? "(min-width: 56em) 46vw, 100vw" : "(min-width: 64em) 22vw, (min-width: 40em) 30vw, 45vw";
    return `<img src="${src}" ${set.length > 1 ? `srcset="${set.join(", ")}" sizes="${sizes}"` : ""} alt="${esc(alt)}" class="${className}" width="1000" height="${variant === "hero" ? 1200 : 1250}" loading="${anim ? "eager" : "lazy"}" ${anim ? 'fetchpriority="high"' : ""} decoding="async" style="width:100%;height:100%;object-fit:cover">`;
  }
  const id = `a${(n++).toString(36)}`; const fn = VARIANTS[variant] || VARIANTS.front;
  const H = variant === "hero" ? 1200 : 1250;
  return `<svg class="${className} scene" viewBox="0 0 1000 ${H}" role="img" aria-labelledby="${id}-t" preserveAspectRatio="xMidYMid slice"><title id="${id}-t">${esc(alt)}</title>${fn(id, p, anim)}</svg>`;
}
/* OG image (1200×630) — jar on the right, wordmark on the left */
export function ogImage(p) {
  const id = "og"; const T = 470;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${defs(id, p)}<rect width="1200" height="630" fill="url(#${id}-wall)"/><rect width="1200" height="630" fill="url(#${id}-light)"/>${table(id, T, 630)}${ground(id, 900, 600, 300, .95, "")}${jar(id, p, 900, 600, .95)}${ginger(id, 560, 545, .75, -10)}
    <g transform="translate(70 120)">${logoVector({ size: 120, id: "og-lm" })}<text x="0" y="200" font-family="${SERIF}" font-size="44" letter-spacing="6" fill="#1D2B33">FUNCTIONAL ELIXIRS</text><text x="0" y="260" font-family="${SERIF}" font-size="30" fill="#5C534B">${esc(p ? p.name + " · " + p.size : "Nature’s Daily Elixir.")}</text><text x="0" y="310" font-family="${SANS}" font-size="20" letter-spacing="3" fill="#7F5E1C">RAW HONEY · FRESH GINGER · NOTHING ELSE</text></g>${finish(id, 1200, 630)}</svg>`;
}

export const altFor = (p, variant) => ({
  hero: `Functional Elixirs ${p.name} in a wide glass jar with a bamboo lid on a pale wooden table, beside a stoneware cup of steaming tea and a knob of fresh ginger, in soft window light`,
  front: `Glass jar of Functional Elixirs ${p.name} (${p.size}) with a blonde bamboo lid and cream striped label on a pale wooden table${p.id === "dipper" ? ", the beechwood dipper lying in front" : " next to a knob of fresh ginger"}`,
  open: `Open jar of Functional Elixirs ${p.name}, the bamboo lid resting flat on the table beside it and a beechwood dipper standing in the jar with a thread of dark amber honey`,
  cup: `Stoneware cup of warm tea with steam rising, a lemon half beside it, and the Functional Elixirs ${p.name} jar softly out of focus behind`,
}[variant]);

export const photo = (key, { className = "" } = {}) => { const r = REAL[key]; return `<img src="${r.src}" alt="${esc(r.alt)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" class="${className}">`; };
