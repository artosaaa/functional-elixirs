/* ==========================================================================
   Scene generator — SVG "photographs" of the honey-ginger jar on a wooden table.
   Why SVG: zero network cost, no CLS, crisp at any DPR, and every SKU gets an
   in-scene jar with the real label (plaque mark, stripes, HONEY / GINGER) with
   no photo shoot. Swap in real photography by mapping PHOTOS[slot] → image path;
   art() then emits an <img> instead (README → "Swapping in real photos").
   ========================================================================== */
import { esc, logoMark } from "./site.mjs";

export const PHOTOS = {
  // "hg-15:hero": "/assets/img/honey-ginger-hero.jpg",   ← uncomment + drop the file to replace the hero scene
};
export const REAL = {
  ritual: { src: "/assets/img/ritual-teapot-window-light.jpg", w: 480, h: 640, alt: "Pale celadon teapot and cup on a linen-covered wooden table beside a tall window, soft morning light and red curtains" },
  garden: { src: "/assets/img/tea-table-garden-morning.jpg", w: 480, h: 640, alt: "Teapot and two cups of pale tea on a dark table overlooking a sunlit garden and lake" },
  terraces: { src: "/assets/img/garden-terraces-green.jpg", w: 640, h: 480, alt: "Green terraced garden with a tall cedar, a pond and two small tents under a moving sky" },
  jars: { src: "/assets/img/honey-ginger-jars-kitchen.jpg", w: 640, h: 640, alt: "A pyramid of Functional Elixirs Honey with Fresh Ginger jars with wooden lids stacked on a marble kitchen counter" },
};

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = ([r, g, b]) => `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")}`;
const shade = (h, k) => rgb(hex(h).map((v) => (k < 0 ? v * (1 + k) : v + (255 - v) * k)));
const SERIF = "Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif";
const SCRIPT = "Snell Roundhand, Brush Script MT, Segoe Script, cursive";

function defs(id, p) {
  const honey = p?.honey || "#7A3E0F";
  return `<defs>
    <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5ECDD"/><stop offset=".6" stop-color="#EADDC7"/><stop offset="1" stop-color="#D8C7AC"/></linearGradient>
    <radialGradient id="${id}-window" cx=".78" cy=".12" r=".7"><stop offset="0" stop-color="#FFF7E4" stop-opacity=".95"/><stop offset=".45" stop-color="#FFF3DC" stop-opacity=".35"/><stop offset="1" stop-color="#FFF3DC" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A57A50"/><stop offset=".5" stop-color="#835B3A"/><stop offset="1" stop-color="#5E3F29"/></linearGradient>
    <linearGradient id="${id}-woodx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".35" stop-color="#000" stop-opacity="0"/><stop offset=".75" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <linearGradient id="${id}-lid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B08D5E"/><stop offset=".22" stop-color="#E2C596"/><stop offset=".55" stop-color="#D6B77F"/><stop offset="1" stop-color="#9D7A4E"/></linearGradient>
    <radialGradient id="${id}-lidtop" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#EDD7AE"/><stop offset="1" stop-color="#C5A26F"/></radialGradient>
    <linearGradient id="${id}-honey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(honey, -.35)}"/><stop offset=".22" stop-color="${shade(honey, .22)}"/><stop offset=".5" stop-color="${honey}"/><stop offset=".8" stop-color="${shade(honey, .1)}"/><stop offset="1" stop-color="${shade(honey, -.45)}"/></linearGradient>
    <linearGradient id="${id}-honeyv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".08" stop-color="#fff" stop-opacity=".16"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".06"/><stop offset=".86" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#2a1a0a" stop-opacity=".3"/></linearGradient>
    <pattern id="${id}-stripe" width="16" height="10" patternUnits="userSpaceOnUse"><rect width="16" height="10" fill="#FAF4E4"/><rect width="8" height="10" fill="#F1E3AE" opacity=".85"/></pattern>
    <linearGradient id="${id}-ginger" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7CFA0"/><stop offset=".5" stop-color="#D3B07A"/><stop offset="1" stop-color="#A9835A"/></linearGradient>
    <radialGradient id="${id}-tea" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#E4B25F"/><stop offset=".7" stop-color="#C98A3A"/><stop offset="1" stop-color="#8E5A22"/></radialGradient>
    <linearGradient id="${id}-ceramic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FBF7EE"/><stop offset=".5" stop-color="#F1EADB"/><stop offset="1" stop-color="#CFC3AE"/></linearGradient>
    <linearGradient id="${id}-linen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F2E8"/><stop offset="1" stop-color="#E3D9C6"/></linearGradient>
    <radialGradient id="${id}-lemon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F9E58A"/><stop offset=".78" stop-color="#F0CF4E"/><stop offset=".82" stop-color="#FCF6D8"/><stop offset=".9" stop-color="#F6E27A"/><stop offset="1" stop-color="#D9B22E"/></radialGradient>
    <radialGradient id="${id}-vig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".28"/></radialGradient>
    <filter id="${id}-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="${id}-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${id}-dof" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.2"/></filter>
    <filter id="${id}-steam" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .07 0"/></filter>
    <clipPath id="${id}-jarclip"><path d="M0 46 Q0 0 46 0 H254 Q300 0 300 46 V262 Q300 296 266 296 H34 Q0 296 0 262 Z"/></clipPath>
  </defs>`;
}

const wall = (id, H) => `<rect width="1000" height="${H}" fill="url(#${id}-wall)"/><rect width="1000" height="${H}" fill="url(#${id}-window)"/>`;
function bokeh(id, anim) {
  const dots = [[820, 120, 70, .5], [900, 260, 46, .35], [700, 60, 38, .4], [960, 90, 28, .3], [760, 300, 22, .25], [120, 180, 60, .18], [60, 90, 30, .14]];
  return `<g class="${anim ? "bokeh" : ""}" filter="url(#${id}-blur)" opacity=".9">${dots.map(([x, y, r, o], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6DF" opacity="${o}" style="--i:${i}"/>`).join("")}</g>`;
}
function table(id, y, H) {
  const grain = Array.from({ length: 9 }, (_, i) => { const yy = y + 30 + i * ((H - y) / 9) + (i % 2) * 11; return `<path d="M-20 ${yy} C 250 ${yy - 8}, 520 ${yy + 10}, 1020 ${yy - 4}" fill="none" stroke="#3a2415" stroke-opacity=".14" stroke-width="${1.2 + (i % 3) * .6}"/>`; }).join("");
  return `<rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-wood)"/><rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-woodx)"/>${grain}<rect x="0" y="${y}" width="1000" height="6" fill="#fff" opacity=".08"/>`;
}
const shadow = (id, cx, cy, rx, ry, o = .42, cls = "") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a1a0e" opacity="${o}" filter="url(#${id}-soft)"/>`;
function linen(id, x, y) {
  return `<path d="M${x} ${y + 40} C ${x + 120} ${y - 10}, ${x + 300} ${y + 60}, ${x + 460} ${y + 20} L ${x + 520} ${y + 180} C ${x + 340} ${y + 220}, ${x + 160} ${y + 150}, ${x - 40} ${y + 210} Z" fill="url(#${id}-linen)"/>
    <path d="M${x + 20} ${y + 70} C ${x + 160} ${y + 40}, ${x + 300} ${y + 90}, ${x + 440} ${y + 60}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
    <path d="M${x + 10} ${y + 130} C ${x + 150} ${y + 100}, ${x + 290} ${y + 150}, ${x + 430} ${y + 120}" fill="none" stroke="#b8a88f" stroke-opacity=".35" stroke-width="2"/>`;
}

/* ginger slices suspended in the honey */
const slices = (n, seed = 1) => Array.from({ length: n }, (_, i) => { const x = 30 + ((i * 97 + seed * 31) % 240), y = 60 + ((i * 61 + seed * 17) % 200), r = 10 + (i % 3) * 4, rot = (i * 37) % 180; return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#E9D8A6" opacity=".55" transform="rotate(${rot} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${r * .6}" ry="${r * .3}" fill="#F3E7BF" opacity=".5" transform="rotate(${rot} ${x} ${y})"/>`; }).join("");

/* the label — striped cream ground, the real plaque mark, HONEY / with fresh / GINGER */
function label(id, p, lx = 30, ly = 62, lw = 240, lh = 214) {
  const cx = lx + lw / 2; const isDipper = p?.id === "dipper";
  const mark = logoMark({ size: 88, wordmark: false, id: `${id}-lm` }).replace("<svg ", `<svg x="${cx - 44}" y="${ly + 12}" `);
  const body = isDipper ? `<text x="${cx}" y="${ly + 140}" text-anchor="middle" font-family="${SERIF}" font-size="22" letter-spacing="3" fill="#B58A3A">DIPPER</text>`
    : `<text x="${cx}" y="${ly + 134}" text-anchor="middle" font-family="${SERIF}" font-size="27" letter-spacing="3.5" fill="#B58A3A" font-weight="600">HONEY</text>
       <text x="${cx}" y="${ly + 150}" text-anchor="middle" font-family="${SCRIPT}" font-size="12.5" fill="#6B5A3E" font-style="italic">with fresh</text>
       <text x="${cx}" y="${ly + 176}" text-anchor="middle" font-family="${SERIF}" font-size="27" letter-spacing="3.5" fill="#B58A3A" font-weight="600">GINGER</text>
       <text x="${cx}" y="${ly + 194}" text-anchor="middle" font-family="${SCRIPT}" font-size="10" fill="#6B5A3E" font-style="italic">Crafted from family tradition</text>
       <text x="${cx}" y="${ly + 207}" text-anchor="middle" font-family="-apple-system, Segoe UI, Helvetica, Arial, sans-serif" font-size="8" letter-spacing="1" fill="#6B5A3E">${esc(p?.size || "15 oz")} · NET WT</text>`;
  return `<g><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="url(#${id}-stripe)"/><rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="url(#${id}-glass)" opacity=".5"/>${mark}${body}</g>`;
}

/* jar: local body 300×296, origin at top-left of the glass body */
function jar(id, p, x, y, s = 1, { lidOff = false, dipper = false } = {}) {
  const lid = lidOff
    ? `<g transform="translate(340 300) rotate(-72)"><rect x="-158" y="-34" width="316" height="68" rx="10" fill="url(#${id}-lid)"/><ellipse cx="0" cy="-34" rx="158" ry="26" fill="url(#${id}-lidtop)"/>${[126, 92, 58, 28].map((r) => `<ellipse cx="0" cy="-34" rx="${r}" ry="${r * .16}" fill="none" stroke="#9D7A4E" stroke-opacity=".3"/>`).join("")}</g>`
    : `<g><rect x="-8" y="-72" width="316" height="78" rx="12" fill="url(#${id}-lid)"/>${[40, 90, 140, 190, 240].map((gx) => `<path d="M${gx} -66 v 66" stroke="#8F6D42" stroke-opacity=".18" stroke-width="2"/>`).join("")}<ellipse cx="150" cy="-72" rx="158" ry="26" fill="url(#${id}-lidtop)"/>${[126, 92, 58, 28].map((r) => `<ellipse cx="150" cy="-72" rx="${r}" ry="${r * .16}" fill="none" stroke="#9D7A4E" stroke-opacity=".3"/>`).join("")}<rect x="-8" y="0" width="316" height="8" rx="3" fill="#3a2410" opacity=".35"/></g>`;
  const dip = dipper ? `<g transform="translate(150 -160) rotate(14)"><rect x="-6" y="0" width="12" height="230" rx="5" fill="#C9A66F"/><ellipse cx="0" cy="230" rx="22" ry="26" fill="#B8955F"/>${[212, 224, 236, 248].map((yy) => `<ellipse cx="0" cy="${yy}" rx="22" ry="4" fill="none" stroke="#8F6D42" stroke-opacity=".6"/>`).join("")}<path class="honey-drip" d="M0 256 C 0 290, -6 320, 2 360" stroke="url(#${id}-honey)" stroke-width="6" stroke-linecap="round" fill="none" opacity=".95"/></g>` : "";
  return `<g class="float"><g transform="translate(${x} ${y}) scale(${s})">
    <g clip-path="url(#${id}-jarclip)">
      <rect x="0" y="0" width="300" height="296" fill="url(#${id}-honey)"/>
      ${slices(9, p?.id?.length || 1)}
      <rect x="0" y="0" width="300" height="296" fill="url(#${id}-honeyv)"/>
      <ellipse cx="150" cy="8" rx="150" ry="18" fill="#fff" opacity=".12"/>
    </g>
    <path d="M0 46 Q0 0 46 0 H254 Q300 0 300 46 V262 Q300 296 266 296 H34 Q0 296 0 262 Z" fill="url(#${id}-glass)"/>
    <path d="M0 46 Q0 0 46 0 H254 Q300 0 300 46 V262 Q300 296 266 296 H34 Q0 296 0 262 Z" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
    ${label(id, p)}
    <path class="glass-sweep" d="M26 40 L 26 262" stroke="#fff" stroke-opacity=".55" stroke-width="9" stroke-linecap="round"/>
    <path d="M270 60 L 270 250" stroke="#fff" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>
    ${lid}${dip}
  </g></g>`;
}

function cup(id, x, y, s = 1, { steam = true, anim = false, spoon = true } = {}) {
  const st = steam ? `<g class="${anim ? "steam" : ""}" filter="url(#${id}-steam)" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"><path style="--i:0" d="M70 -20 C 40 -60, 110 -90, 78 -140"/><path style="--i:1" d="M120 -10 C 90 -60, 160 -80, 126 -150"/><path style="--i:2" d="M170 -24 C 150 -60, 200 -95, 172 -130"/></g>` : "";
  const sp = spoon ? `<g transform="translate(150 -30) rotate(28)"><rect x="-5" y="0" width="10" height="150" rx="4" fill="url(#${id}-ceramic)"/><ellipse cx="0" cy="-16" rx="20" ry="26" fill="url(#${id}-ceramic)"/><ellipse cx="0" cy="-14" rx="14" ry="18" fill="url(#${id}-honey)" opacity=".9"/><path d="M0 4 C 0 30, 6 60, -2 90" stroke="url(#${id}-honey)" stroke-width="4" stroke-linecap="round" fill="none" opacity=".85"/></g>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${st}
    <path d="M232 20 C 290 10, 300 90, 236 96" fill="none" stroke="#b9ad98" stroke-opacity=".5" stroke-width="26" stroke-linecap="round" transform="translate(6 4)"/>
    <path d="M232 20 C 290 10, 300 90, 236 96" fill="none" stroke="url(#${id}-ceramic)" stroke-width="24" stroke-linecap="round"/>
    <path d="M10 0 L 30 118 Q 120 150 210 118 L 230 0 Z" fill="url(#${id}-ceramic)"/>
    <path d="M10 0 L 30 118 Q 120 150 210 118 L 230 0 Z" fill="#7a6a55" opacity=".16" style="mix-blend-mode:multiply"/>
    <ellipse cx="120" cy="0" rx="110" ry="26" fill="#EDE5D6"/><ellipse cx="120" cy="2" rx="98" ry="21" fill="url(#${id}-tea)"/><ellipse cx="96" cy="-4" rx="34" ry="7" fill="#fff" opacity=".35"/>
    ${sp}</g>`;
}

function ginger(id, x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 c 10 -22 34 -26 50 -12 c 14 -18 40 -14 46 6 c 20 -6 34 14 22 30 c 12 14 -2 34 -22 30 c -6 18 -32 22 -46 6 c -16 14 -42 8 -48 -10 c -18 -2 -24 -22 -12 -36 Z" fill="url(#${id}-ginger)"/>
    <path d="M10 -6 c 6 -2 12 -1 16 4 M60 -8 c 6 -3 12 -2 16 3 M98 24 c 4 4 6 10 4 16 M30 40 c 6 4 12 4 18 0 M70 46 c 6 2 12 0 16 -4" fill="none" stroke="#8F6B45" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="118" cy="10" rx="16" ry="11" fill="#F0E4A8" transform="rotate(-20 118 10)"/><ellipse cx="118" cy="10" rx="10" ry="6" fill="none" stroke="#C7B06A" stroke-opacity=".7" transform="rotate(-20 118 10)"/>
  </g>`;
}
const lemon = (id, x, y, r = 46) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-lemon)"/>${[0, 45, 90, 135].map((a) => `<path d="M${x - r * .8} ${y} H ${x + r * .8}" stroke="#FCF6D8" stroke-width="2" transform="rotate(${a} ${x} ${y})" opacity=".8"/>`).join("")}<circle cx="${x}" cy="${y}" r="4" fill="#FCF6D8"/></g>`;
const scatter = (pts) => pts.map(([x, y, r, rot]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .5}" fill="#D9BE8E" transform="rotate(${rot} ${x} ${y})" opacity=".85"/>`).join("");
const finish = (id, W, H) => `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/><rect width="${W}" height="${H}" filter="url(#${id}-grain)" opacity=".5" style="mix-blend-mode:multiply"/>`;

const VARIANTS = {
  hero(id, p, anim) {
    const W = 1000, H = 1200, T = 760;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}<rect x="640" y="0" width="360" height="${T}" fill="#FFF8E8" opacity=".18"/>
      ${table(id, T, H)}${linen(id, -60, T - 10)}
      ${shadow(id, 470, T + 250, 300, 48, .45, "float-shadow")}${shadow(id, 800, T + 150, 130, 26, .35)}${shadow(id, 180, T + 250, 120, 22, .3)}
      ${jar(id, p, 320, 420, 1.06)}
      ${ginger(id, 90, T + 170, 1.05, -8)}${lemon(id, 250, T + 190, 40)}
      ${cup(id, 700, T - 10, .92, { anim })}
      ${scatter([[600, T + 200, 10, -20], [640, T + 240, 8, 30], [880, T + 60, 10, 10]])}
      ${finish(id, W, H)}`;
  },
  front(id, p, anim) {
    const W = 1000, H = 1250, T = 720;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${shadow(id, 500, T + 300, 300, 56, .48)}${shadow(id, 800, T + 250, 110, 22, .3)}
      ${jar(id, p, 335, 440, 1.1)}
      ${ginger(id, 700, T + 190, .95, 12)}
      ${scatter([[280, T + 150, 12, -20], [720, T + 290, 9, 30]])}
      ${finish(id, W, H)}`;
  },
  open(id, p, anim) {
    const W = 1000, H = 1250, T = 740;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}${linen(id, 520, T + 60)}
      ${shadow(id, 470, T + 280, 300, 52, .46)}
      ${jar(id, p, 320, 460, 1.05, { lidOff: true, dipper: true })}
      ${ginger(id, 640, T + 200, .9, -14)}
      ${scatter([[300, T + 120, 12, -20], [820, T + 90, 10, 10], [270, T + 170, 8, -40]])}
      ${finish(id, W, H)}`;
  },
  cup(id, p, anim) {
    const W = 1000, H = 1250, T = 690;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      <g filter="url(#${id}-dof)" opacity=".95">${shadow(id, 700, T + 60, 200, 34, .35)}${jar(id, p, 560, 330, .78)}</g>
      ${linen(id, -100, T + 120)}
      ${shadow(id, 380, T + 330, 260, 46, .5)}
      ${cup(id, 180, T + 130, 1.6, { anim })}
      ${lemon(id, 820, T + 300, 44)}
      ${finish(id, W, H)}`;
  },
};

let n = 0;
export function art(variant, p, { alt, anim = false, className = "", slot } = {}) {
  const key = slot || `${p?.id || "brand"}:${variant}`;
  if (PHOTOS[key]) return `<img src="${PHOTOS[key]}" alt="${esc(alt)}" class="${className}" width="1000" height="1250" loading="${anim ? "eager" : "lazy"}" decoding="async">`;
  const id = `a${(n++).toString(36)}`; const fn = VARIANTS[variant] || VARIANTS.front;
  const H = variant === "hero" ? 1200 : 1250;
  return `<svg class="${className} scene" viewBox="0 0 1000 ${H}" role="img" aria-labelledby="${id}-t" preserveAspectRatio="xMidYMid slice"><title id="${id}-t">${esc(alt)}</title>${fn(id, p, anim)}</svg>`;
}
/* OG image (1200×630) — hero scene cropped wide with wordmark */
export function ogImage(p) {
  const id = "og"; const T = 500;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${defs(id, p)}<rect width="1200" height="630" fill="url(#${id}-wall)"/><rect width="1200" height="630" fill="url(#${id}-window)"/>${table(id, T, 630)}${shadow(id, 880, T + 100, 220, 36, .45)}${jar(id, p, 740, 220, .9)}${ginger(id, 540, T + 40, .8, -10)}
    <g transform="translate(70 120)">${logoMark({ size: 120, wordmark: false, id: "og-lm" })}<text x="0" y="200" font-family="${SERIF}" font-size="44" letter-spacing="6" fill="#1D2B33">FUNCTIONAL ELIXIRS</text><text x="0" y="260" font-family="${SERIF}" font-size="30" fill="#5C534B">${esc(p ? p.name + " · " + p.size : "Nature’s Daily Elixir.")}</text><text x="0" y="310" font-family="-apple-system, Segoe UI, Helvetica, Arial, sans-serif" font-size="20" letter-spacing="3" fill="#7F5E1C">RAW HONEY · FRESH GINGER · NOTHING ELSE</text></g>${finish(id, 1200, 630)}</svg>`;
}

export const altFor = (p, variant) => ({
  hero: `Functional Elixirs ${p.name} in a wide glass jar with a wooden lid on a wooden kitchen table, beside a ceramic cup of steaming tea with a honey spoon, fresh ginger root, a lemon half and a linen cloth in soft morning window light`,
  front: `Glass jar of Functional Elixirs ${p.name} (${p.size}) with a blonde wooden lid and cream striped label standing on a wooden table next to a knob of fresh ginger root`,
  open: `Open jar of Functional Elixirs ${p.name} with the wooden lid resting beside it and a beechwood dipper lifting a spiral of dark amber honey`,
  cup: `Ceramic cup of warm tea with a spoon of honey-ginger dripping in, the Functional Elixirs jar softly out of focus behind`,
}[variant]);

export const photo = (key, { className = "" } = {}) => { const r = REAL[key]; return `<img src="${r.src}" alt="${esc(r.alt)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" class="${className}">`; };
