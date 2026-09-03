/* ==========================================================================
   Scene generator — "soft & round" candidate.
   SVG "photographs" of the Honey with Fresh Ginger jar: a plump cushion-shaped
   jar with a domed bamboo lid, round bokeh, a round tea bowl, a circular lemon
   slice and ginger drawn as a cluster of soft lobes. Same contract as art.mjs.
   ========================================================================== */
import { esc, logoMark } from "../site.mjs";

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
const SANS = "-apple-system, Segoe UI, Helvetica, Arial, sans-serif";

/* jar body: a plump cushion, 300×300 in local units, big radii, sides that bulge a touch */
const BODY = "M0 104C0 38 38 0 104 0H196C262 0 300 38 300 104C305 142 305 178 300 214C300 272 262 300 206 300H94C38 300 0 272 0 214C-5 178 -5 142 0 104Z";

function defs(id, p) {
  const honey = p?.honey || "#7A3E0F";
  return `<defs>
    <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7EEDF"/><stop offset=".55" stop-color="#EDE0CB"/><stop offset="1" stop-color="#DCCAAE"/></linearGradient>
    <radialGradient id="${id}-window" cx=".74" cy=".1" r=".62"><stop offset="0" stop-color="#FFF9E8" stop-opacity=".95"/><stop offset=".4" stop-color="#FFF4DD" stop-opacity=".4"/><stop offset="1" stop-color="#FFF4DD" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CBA678"/><stop offset=".4" stop-color="#AE835A"/><stop offset="1" stop-color="#7B5636"/></linearGradient>
    <linearGradient id="${id}-woodx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <radialGradient id="${id}-pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".32"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-lid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A57F52"/><stop offset=".3" stop-color="#D9B98A"/><stop offset=".62" stop-color="#E7CFA2"/><stop offset=".85" stop-color="#CBA772"/><stop offset="1" stop-color="#9A7548"/></linearGradient>
    <radialGradient id="${id}-lidtop" cx=".62" cy=".3" r=".75"><stop offset="0" stop-color="#F2E0B8"/><stop offset=".6" stop-color="#DDBE8C"/><stop offset="1" stop-color="#BE9A66"/></radialGradient>
    <linearGradient id="${id}-honey" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${shade(honey, -.45)}"/><stop offset=".25" stop-color="${shade(honey, .1)}"/><stop offset=".55" stop-color="${honey}"/><stop offset=".82" stop-color="${shade(honey, .16)}"/><stop offset="1" stop-color="${shade(honey, -.5)}"/></linearGradient>
    <radialGradient id="${id}-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#E8912A" stop-opacity=".75"/><stop offset=".5" stop-color="#D47A1E" stop-opacity=".3"/><stop offset="1" stop-color="#D47A1E" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-thread" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(honey, .38)}"/><stop offset=".5" stop-color="${shade(honey, .18)}"/><stop offset="1" stop-color="${honey}"/></linearGradient>
    <linearGradient id="${id}-honeyv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".06" stop-color="#fff" stop-opacity=".18"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".05"/><stop offset=".92" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>
    <linearGradient id="${id}-wrap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".14" stop-color="#000" stop-opacity=".06"/><stop offset=".32" stop-color="#fff" stop-opacity=".05"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset=".76" stop-color="#fff" stop-opacity=".1"/><stop offset=".9" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
    <pattern id="${id}-weave" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5H7M3.5 0V7" stroke="#a8977c" stroke-opacity=".09" stroke-width="1"/></pattern>
    <pattern id="${id}-stripe" width="16" height="10" patternUnits="userSpaceOnUse"><rect width="16" height="10" fill="#FBF6E7"/><rect width="8" height="10" fill="#F2E4B0" opacity=".9"/></pattern>
    <linearGradient id="${id}-beech" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A67B4B"/><stop offset=".5" stop-color="#E2C28F"/><stop offset="1" stop-color="#B1885A"/></linearGradient>
    <radialGradient id="${id}-ginger" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#EFDDB4"/><stop offset=".55" stop-color="#D8B98A"/><stop offset="1" stop-color="#A78053"/></radialGradient>
    <radialGradient id="${id}-cut" cx=".45" cy=".4" r=".6"><stop offset="0" stop-color="#F8EFC4"/><stop offset=".7" stop-color="#EEDF9E"/><stop offset="1" stop-color="#D3BF77"/></radialGradient>
    <radialGradient id="${id}-tea" cx=".55" cy=".35" r=".7"><stop offset="0" stop-color="#E9B968"/><stop offset=".65" stop-color="#C98A3A"/><stop offset="1" stop-color="#8A5620"/></radialGradient>
    <linearGradient id="${id}-ceramic" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DDD5C4"/><stop offset=".45" stop-color="#FBF8F1"/><stop offset=".72" stop-color="#F6F1E6"/><stop offset="1" stop-color="#C7BBA6"/></linearGradient>
    <linearGradient id="${id}-cupv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#4a3a28" stop-opacity=".3"/></linearGradient>
    <linearGradient id="${id}-linen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FAF6EE"/><stop offset="1" stop-color="#E6DCC8"/></linearGradient>
    <radialGradient id="${id}-peel" cx=".5" cy=".5" r=".5"><stop offset=".8" stop-color="#F3D24E"/><stop offset="1" stop-color="#D8AF2A"/></radialGradient>
    <radialGradient id="${id}-flesh" cx=".42" cy=".4" r=".6"><stop offset="0" stop-color="#FBEA98"/><stop offset="1" stop-color="#F1CF52"/></radialGradient>
    <radialGradient id="${id}-vig" cx=".5" cy=".45" r=".78"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".3"/></radialGradient>
    <filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="${id}-soft2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${id}-hi" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
    <filter id="${id}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="${id}-dof" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.4"/></filter>
    <filter id="${id}-steam" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4.5"/></filter>
    <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .07 0"/></filter>
    <clipPath id="${id}-jarclip"><path d="${BODY}"/></clipPath>
  </defs>`;
}

const wall = (id, H) => `<rect width="1000" height="${H}" fill="url(#${id}-wall)"/><rect width="1000" height="${H}" fill="url(#${id}-window)"/><circle cx="740" cy="${H * .22}" r="${H * .26}" fill="#FFF9EA" opacity=".26" filter="url(#${id}-soft)"/>`;
function bokeh(id, anim) {
  const dots = [[800, 130, 92, .7], [905, 280, 58, .5], [690, 60, 46, .55], [955, 70, 36, .45], [745, 320, 28, .4], [130, 200, 74, .22], [560, 150, 30, .28]];
  return `<g class="${anim ? "bokeh" : ""}" filter="url(#${id}-blur)">${dots.map(([x, y, r, o], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFBF0" opacity="${o}" style="--i:${i}"/>`).join("")}</g>`;
}
/* warm light the honey throws onto the table */
const glowSpot = (id, cx, cy, rx, ry, o = .22) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#E8912A" opacity="${o}" filter="url(#${id}-soft2)"/>`;
function table(id, y, H) {
  const grain = Array.from({ length: 6 }, (_, i) => { const yy = y + 40 + i * ((H - y) / 6) + (i % 2) * 14; return `<path d="M-20 ${yy} C 240 ${yy - 10}, 520 ${yy + 12}, 1020 ${yy - 5}" fill="none" stroke="#3a2415" stroke-opacity=".11" stroke-width="${1.4 + (i % 3) * .7}"/>`; }).join("");
  return `<rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-wood)"/><rect x="0" y="${y}" width="1000" height="${H - y}" fill="url(#${id}-woodx)"/>${grain}
    <ellipse cx="640" cy="${y + 120}" rx="520" ry="150" fill="url(#${id}-pool)"/>
    <path d="M0 ${y} H1000" stroke="#fff" stroke-opacity=".28" stroke-width="3" filter="url(#${id}-hi)"/>`;
}
const shadow = (id, cx, cy, rx, ry, o = .42, cls = "") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a1a0e" opacity="${o}" filter="url(#${id}-soft)"/>`;
const contact = (id, cx, cy, rx, ry, o = .5) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1f1208" opacity="${o}" filter="url(#${id}-soft2)"/>`;
/* a linen napkin — a round-cornered cloth with soft wavy edges, a weave texture and one corner folded over */
function linen(id, x, y, w = 520, h = 210, rot = -4) {
  const P = (px, py) => `${(w * px).toFixed(0)} ${(h * py).toFixed(0)}`;
  const cloth = `M${P(.3, 0)} C${P(.5, -.015)} ${P(.7, .015)} ${P(.78, 0)} C${P(.92, 0)} ${P(1, .12)} ${P(1, .3)} C${P(1.012, .5)} ${P(.99, .7)} ${P(1, .72)} C${P(1, .9)} ${P(.9, 1)} ${P(.72, 1)} C${P(.5, 1.015)} ${P(.3, .985)} ${P(.26, 1)} C${P(.1, 1)} ${P(0, .9)} ${P(0, .72)} C${P(-.012, .5)} ${P(.01, .3)} ${P(0, .3)} C${P(0, .1)} ${P(.12, 0)} ${P(.3, 0)}Z`;
  const flap = `M${P(.56, .01)} C${P(.7, .1)} ${P(.86, .26)} ${P(.985, .44)} C${P(.9, .5)} ${P(.72, .5)} ${P(.62, .44)} C${P(.58, .3)} ${P(.56, .16)} ${P(.56, .01)}Z`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="${cloth}" fill="#2a1a0e" opacity=".28" filter="url(#${id}-soft2)" transform="translate(-8 14)"/>
    <path d="${cloth}" fill="url(#${id}-linen)"/><path d="${cloth}" fill="url(#${id}-weave)"/>
    <path d="${flap}" fill="#2a1a0e" opacity=".18" filter="url(#${id}-hi)" transform="translate(-6 6)"/>
    <path d="${flap}" fill="#EFE6D4"/><path d="${flap}" fill="url(#${id}-weave)"/>
    <path d="M${P(.56, .01)} C${P(.7, .1)} ${P(.86, .26)} ${P(.985, .44)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5"/>
    <path d="M${P(.06, .66)} C${P(.3, .56)} ${P(.6, .78)} ${P(.9, .66)}" fill="none" stroke="#b8a88f" stroke-opacity=".3" stroke-width="3"/>
    <path d="M${P(.06, .66)} C${P(.3, .56)} ${P(.6, .78)} ${P(.9, .66)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" transform="translate(0 -4)"/>
    <path d="${cloth}" fill="none" stroke="#a8977c" stroke-opacity=".3" stroke-width="1.5"/>
  </g>`;
}

/* ginger slices suspended in the honey */
const slices = (n, seed = 1) => Array.from({ length: n }, (_, i) => { const x = 36 + ((i * 97 + seed * 31) % 228), y = 30 + ((i * 61 + seed * 17) % 220), r = 9 + (i % 3) * 4, rot = (i * 37) % 180; return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#EAD9A8" opacity=".5" transform="rotate(${rot} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${r * .6}" ry="${r * .3}" fill="#F4E8C2" opacity=".5" transform="rotate(${rot} ${x} ${y})"/>`; }).join("");

/* the label — striped cream ground wrapped round the glass, the real plaque mark, HONEY / with fresh / GINGER */
function label(id, p, lx = 26, ly = 70, lw = 248, lh = 198) {
  const cx = lx + lw / 2, bow = 9, isDipper = p?.id === "dipper";
  const shape = `M${lx} ${ly} Q${cx} ${ly + 2 * bow} ${lx + lw} ${ly} V${ly + lh} Q${cx} ${ly + lh + 2 * bow} ${lx} ${ly + lh}Z`;
  const mark = logoMark({ size: 82, wordmark: false, id: `${id}-lm` }).replace("<svg ", `<svg x="${cx - 41}" y="${ly + 14}" `);
  const body = isDipper ? `<text x="${cx}" y="${ly + 138}" text-anchor="middle" font-family="${SERIF}" font-size="26" letter-spacing="3.5" fill="#B58A3A" font-weight="600">DIPPER</text>
       <text x="${cx}" y="${ly + 158}" text-anchor="middle" font-family="${SCRIPT}" font-size="12.5" fill="#6B5A3E" font-style="italic">turned beechwood</text>
       <text x="${cx}" y="${ly + 186}" text-anchor="middle" font-family="${SANS}" font-size="8.5" letter-spacing="1" fill="#6B5A3E">${esc(p?.size || "6 in")}</text>`
    : `<text x="${cx}" y="${ly + 126}" text-anchor="middle" font-family="${SERIF}" font-size="28" letter-spacing="3.5" fill="#B58A3A" font-weight="600">HONEY</text>
       <text x="${cx}" y="${ly + 142}" text-anchor="middle" font-family="${SCRIPT}" font-size="13" fill="#6B5A3E" font-style="italic">with fresh</text>
       <text x="${cx}" y="${ly + 168}" text-anchor="middle" font-family="${SERIF}" font-size="28" letter-spacing="3.5" fill="#B58A3A" font-weight="600">GINGER</text>
       <text x="${cx}" y="${ly + 183}" text-anchor="middle" font-family="${SCRIPT}" font-size="10.5" fill="#6B5A3E" font-style="italic">Crafted from family tradition</text>
       <text x="${cx}" y="${ly + 195}" text-anchor="middle" font-family="${SANS}" font-size="8" letter-spacing="1" fill="#6B5A3E">${esc(p?.size || "15 oz")} · NET WT</text>`;
  return `<g clip-path="url(#${id}-jarclip)"><path d="${shape}" fill="url(#${id}-stripe)"/><path d="${shape}" fill="url(#${id}-wrap)"/>${mark}${body}<path d="${shape}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/></g>`;
}

/* dipper: origin at the centre of the bulb, stick rising up the local -y axis */
const dipperBits = (id, len = 220) => `<rect x="-6" y="${-len}" width="12" height="${len - 18}" rx="6" fill="url(#${id}-beech)"/><ellipse cx="0" cy="0" rx="22" ry="30" fill="url(#${id}-beech)"/>${[-18, -8, 2, 12, 22].map((yy) => `<ellipse cx="0" cy="${yy}" rx="${(21 * Math.sqrt(1 - (yy / 30) ** 2)).toFixed(1)}" ry="4" fill="none" stroke="#7c5a34" stroke-opacity=".5" stroke-width="1.6"/>`).join("")}`;

/* jar: local body 300×300, origin at top-left of the glass body; the lid rises 108 above it */
function jar(id, p, x, y, s = 1, { lidOff = false, dipper = false } = {}) {
  const lid = lidOff
    ? `<g>
        <path d="M32 -24 C32 -30 40 -34 60 -34 H240 C260 -34 268 -30 268 -24 V4 H32Z" fill="url(#${id}-honey)"/><path d="M32 -24 C32 -30 40 -34 60 -34 H240 C260 -34 268 -30 268 -24 V4 H32Z" fill="url(#${id}-glass)" opacity=".9"/>
        ${[-26, -14, -2].map((yy) => `<ellipse cx="150" cy="${yy}" rx="118" ry="7" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2"/>`).join("")}
        <ellipse cx="150" cy="-34" rx="120" ry="25" fill="#EFE3CF"/><ellipse cx="150" cy="-34" rx="120" ry="25" fill="url(#${id}-glass)"/>
        <ellipse cx="150" cy="-33" rx="106" ry="19" fill="url(#${id}-honey)"/><ellipse cx="150" cy="-33" rx="106" ry="19" fill="#000" opacity=".25"/>
        <ellipse cx="172" cy="-40" rx="46" ry="8" fill="#fff" opacity=".22" filter="url(#${id}-hi)"/>
        <ellipse cx="150" cy="-34" rx="120" ry="25" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5"/>
      </g>`
    : `<g>
        <path d="M-6 -50 C-6 -66 6 -78 24 -78 H276 C294 -78 306 -66 306 -50 V-16 C306 -2 296 6 282 6 H18 C4 6 -6 -2 -6 -16Z" fill="url(#${id}-lid)"/>
        ${[30, 70, 110, 150, 190, 230, 270].map((gx) => `<path d="M${gx} -70 Q${gx + 2} -32 ${gx} 2" stroke="#8F6D42" stroke-opacity=".14" stroke-width="2" fill="none"/>`).join("")}
        <ellipse cx="150" cy="-78" rx="156" ry="30" fill="url(#${id}-lidtop)"/>
        ${[[150, -80, 128, 22], [154, -82, 92, 15], [158, -84, 56, 9], [162, -86, 24, 4]].map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#9A7748" stroke-opacity=".28" stroke-width="1.4"/>`).join("")}
        <ellipse cx="150" cy="-78" rx="156" ry="30" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
        <path d="M60 -96 C 110 -108, 200 -108, 250 -96" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="7" stroke-linecap="round" filter="url(#${id}-hi)"/>
        <path d="M-2 -20 C-2 -8 8 4 20 6 H280 C292 4 302 -8 302 -20" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="5"/>
      </g>`;
  const dip = dipper ? `<g transform="translate(198 -112) rotate(16)">${dipperBits(id, 250)}<path d="M-18 2 C -18 30, 18 30, 18 2 C 10 8, -10 8, -18 2Z" fill="${shade(p?.honey || "#7A3E0F", .12)}" opacity=".95"/></g>
      <path d="M190 -86 C 193 -66, 186 -50, 190 -30" stroke="url(#${id}-thread)" stroke-width="9" stroke-linecap="round" fill="none" opacity=".95"/>
      <path class="honey-drip" d="M190 -86 C 193 -66, 186 -50, 190 -30" stroke="url(#${id}-thread)" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M188 -84 C 190 -68, 185 -54, 188 -36" stroke="#fff" stroke-opacity=".38" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      <ellipse cx="190" cy="-30" rx="18" ry="6" fill="${shade(p?.honey || "#7A3E0F", .2)}" opacity=".8"/><ellipse cx="190" cy="-30" rx="18" ry="6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` : "";
  return `<g class="float" transform="translate(${x} ${y}) scale(${s})">
    <g clip-path="url(#${id}-jarclip)">
      <rect x="0" y="0" width="300" height="300" fill="url(#${id}-honey)"/>
      <ellipse cx="196" cy="120" rx="150" ry="140" fill="url(#${id}-glow)"/>
      ${slices(7, p?.id?.length || 1)}
      <rect x="0" y="0" width="300" height="300" fill="url(#${id}-honeyv)"/>
      <ellipse cx="150" cy="306" rx="176" ry="42" fill="#000" opacity=".3"/>
      ${lidOff ? "" : `<ellipse cx="150" cy="8" rx="164" ry="26" fill="#2a1608" opacity=".55" filter="url(#${id}-soft2)"/>`}
    </g>
    ${label(id, p)}
    <path d="${BODY}" fill="url(#${id}-glass)"/>
    <path d="${BODY}" fill="none" stroke="#2a1608" stroke-opacity=".22" stroke-width="5"/>
    <path d="${BODY}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.5"/>
    <path class="glass-sweep" d="M262 58 C 288 120, 288 200, 258 254" stroke="#fff" stroke-opacity=".55" stroke-width="12" stroke-linecap="round" fill="none" filter="url(#${id}-hi)"/>
    <path d="M36 66 C 20 130, 20 200, 40 250" stroke="#fff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round" fill="none" filter="url(#${id}-hi)"/>
    <ellipse cx="104" cy="36" rx="44" ry="13" fill="#fff" opacity=".22" filter="url(#${id}-hi)"/>
    <path d="M70 280 C 110 296, 190 296, 230 280" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round" fill="none" filter="url(#${id}-hi)"/>
    ${lid}${dip}
  </g>`;
}

/* the domed lid lying flat on the table, seen from slightly above */
function lidFlat(id, cx, cy, s = 1) {
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
    ${contact(id, -8, 30, 170, 40, .4)}
    <path d="M-160 0 V30 A160 54 0 0 0 160 30 V0Z" fill="url(#${id}-lid)"/>
    <ellipse cx="0" cy="0" rx="160" ry="54" fill="url(#${id}-lidtop)"/>
    ${[[0, -2, 130, 42], [4, -4, 92, 29], [8, -6, 54, 17], [12, -8, 22, 7]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#9A7748" stroke-opacity=".28" stroke-width="1.4"/>`).join("")}
    <ellipse cx="0" cy="0" rx="160" ry="54" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
    <path d="M-90 -34 C -30 -50, 60 -50, 110 -34" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="7" stroke-linecap="round" filter="url(#${id}-hi)"/>
  </g>`;
}

/* round tea bowl with a ring handle on a saucer; origin at the rim centre */
function cup(id, x, y, s = 1, { steam = true, anim = false, spoon = true, saucer = true } = {}) {
  const st = steam ? `<g class="${anim ? "steam" : ""}" filter="url(#${id}-steam)" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".5"><path style="--i:0" d="M-52 -30 C -78 -70, -26 -100, -56 -150"/><path style="--i:1" d="M-6 -26 C -32 -72, 26 -96, -4 -164"/><path style="--i:2" d="M40 -32 C 22 -68, 70 -100, 44 -142"/></g>` : "";
  const sc = saucer ? `${contact(id, 10, 126, 160, 34, .3)}<ellipse cx="0" cy="112" rx="158" ry="36" fill="url(#${id}-ceramic)"/><ellipse cx="0" cy="110" rx="150" ry="31" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><ellipse cx="0" cy="114" rx="100" ry="20" fill="#5a4a38" opacity=".18"/>` : "";
  const sp = spoon ? `<g transform="translate(34 2) rotate(38)">
      <path d="M-5 -6 L-7 -118 C-7 -128 -14 -132 -14 -142 C-14 -152 -6 -156 0 -156 C6 -156 14 -152 14 -142 C14 -132 7 -128 7 -118 L5 -6Z" fill="url(#${id}-ceramic)"/>
      <path d="M-1 -140 V-16" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
    </g><ellipse cx="36" cy="3" rx="20" ry="6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${st}${sc}
    <circle cx="128" cy="44" r="32" fill="none" stroke="#B9AE9B" stroke-opacity=".5" stroke-width="24" transform="translate(5 5)"/>
    <circle cx="128" cy="44" r="32" fill="none" stroke="url(#${id}-ceramic)" stroke-width="22"/>
    <path d="M-110 0 C-110 74 -60 122 0 122 C60 122 110 74 110 0Z" fill="url(#${id}-ceramic)"/>
    <path d="M-110 0 C-110 74 -60 122 0 122 C60 122 110 74 110 0Z" fill="url(#${id}-cupv)"/>
    <ellipse cx="0" cy="0" rx="110" ry="28" fill="#F1EADB"/><ellipse cx="0" cy="0" rx="110" ry="28" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    <ellipse cx="0" cy="3" rx="98" ry="23" fill="url(#${id}-tea)"/>
    <path d="M-30 6 c 8 -9 32 -7 32 3 c 0 8 -16 11 -20 3" fill="none" stroke="url(#${id}-honey)" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>
    <path d="M-60 -3 C -30 -14, 20 -14, 50 -3" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/>
    ${sp}</g>`;
}

/* ginger: a cluster of soft rounded lobes, one cut face */
function ginger(id, x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M10 50 C0 30 20 14 40 22 C48 4 74 2 82 20 C100 6 126 12 128 32 C150 34 152 62 132 70 C136 92 108 100 96 84 C84 100 58 98 54 80 C36 96 8 84 10 50Z" fill="#2a1a0e" opacity=".3" filter="url(#${id}-soft2)" transform="translate(-6 10)"/>
    <path d="M10 50 C0 30 20 14 40 22 C48 4 74 2 82 20 C100 6 126 12 128 32 C150 34 152 62 132 70 C136 92 108 100 96 84 C84 100 58 98 54 80 C36 96 8 84 10 50Z" fill="url(#${id}-ginger)"/>
    <path d="M40 24 C 42 34, 42 44, 38 54 M82 22 C 82 34, 80 46, 76 56 M96 82 C 92 72, 90 60, 92 48 M54 78 C 56 68, 58 58, 62 50" fill="none" stroke="#8F6B45" stroke-opacity=".4" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M18 40 c 6 -3 12 -3 18 0 M58 14 c 6 -2 12 -1 16 2 M104 22 c 6 0 10 3 14 8 M112 60 c -6 6 -14 8 -22 6 M70 90 c -6 -2 -10 -6 -12 -12 M24 68 c 6 4 12 4 18 0" fill="none" stroke="#8F6B45" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="134" cy="52" r="20" fill="url(#${id}-cut)"/><circle cx="134" cy="52" r="15" fill="none" stroke="#CDB870" stroke-opacity=".7" stroke-width="1.5"/><circle cx="134" cy="52" r="6" fill="none" stroke="#CDB870" stroke-opacity=".6" stroke-width="1.2"/>
    <ellipse class="glint" cx="128" cy="45" rx="8" ry="4.5" fill="#fff" opacity=".6" transform="rotate(-30 128 45)"/>
  </g>`;
}
/* a full round lemon slice */
const lemon = (id, x, y, r = 46) => `<g>${contact(id, x - 4, y + r * .35, r * 1.05, r * .55, .35)}<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-peel)"/><circle cx="${x}" cy="${y}" r="${r * .86}" fill="#FCF5CF"/><circle cx="${x}" cy="${y}" r="${r * .78}" fill="url(#${id}-flesh)"/>${[0, 45, 90, 135].map((a) => `<path d="M${x - r * .78} ${y} H ${x + r * .78}" stroke="#FCF5CF" stroke-width="3" transform="rotate(${a} ${x} ${y})" opacity=".95"/>`).join("")}<circle cx="${x}" cy="${y}" r="${r * .1}" fill="#FCF5CF"/><ellipse class="glint" cx="${x - r * .3}" cy="${y - r * .3}" rx="${r * .22}" ry="${r * .12}" fill="#fff" opacity=".55" transform="rotate(-40 ${x - r * .3} ${y - r * .3})"/></g>`;
const scatter = (pts) => pts.map(([x, y, r, rot]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#DCC395" transform="rotate(${rot} ${x} ${y})" opacity=".9"/><ellipse cx="${x}" cy="${y}" rx="${r * .6}" ry="${r * .3}" fill="#EEDFB8" transform="rotate(${rot} ${x} ${y})" opacity=".8"/>`).join("");
const finish = (id, W, H) => `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/><rect width="${W}" height="${H}" filter="url(#${id}-grain)" opacity=".5" style="mix-blend-mode:multiply"/>`;

/* the beechwood dipper leaning on the jar (dipper SKU front scene) */
const dipperLean = (id, x, y, rot = -26) => `<g>${contact(id, x, y + 26, 34, 10, .35)}<g transform="translate(${x} ${y}) rotate(${rot})">${dipperBits(id, 250)}<path d="M-16 4 C -16 30, 16 30, 16 4 C 10 8, -10 8, -16 4Z" fill="url(#${id}-honey)" opacity=".9"/></g></g>`;

const VARIANTS = {
  hero(id, p, anim) {
    const W = 1000, H = 1200, T = 740;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}
      ${table(id, T, H)}${linen(id, 70, T + 96, 540, 232, -5)}
      ${shadow(id, 462, T + 226, 250, 46, .42, "float-shadow")}${contact(id, 472, T + 212, 168, 20, .5)}${glowSpot(id, 480, T + 232, 130, 18, .16)}
      ${jar(id, p, 300, 620, 1.15)}
      ${shadow(id, 806, T + 128, 130, 26, .32)}
      ${cup(id, 812, T + 20, .9, { anim })}
      ${ginger(id, 78, T + 208, 1.05, -8)}${lemon(id, 270, T + 266, 42)}
      ${scatter([[690, T + 250, 10, -20], [726, T + 288, 8, 30], [900, T + 210, 10, 10]])}
      ${finish(id, W, H)}`;
  },
  front(id, p, anim) {
    const W = 1000, H = 1250, T = 760;
    const dip = p?.id === "dipper";
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${shadow(id, 490, T + 300, 300, 56, .45, "float-shadow")}${contact(id, 500, T + 286, 200, 22, .5)}${glowSpot(id, 550, T + 312, 170, 26)}
      ${jar(id, p, 312, 663, 1.25)}
      ${dip ? dipperLean(id, 720, T + 290, -28) : ginger(id, 720, T + 250, 1.0, 12)}
      ${scatter([[262, T + 200, 12, -20], [300, T + 260, 8, 40], [760, T + 320, 9, 30]])}
      ${finish(id, W, H)}`;
  },
  open(id, p, anim) {
    const W = 1000, H = 1250, T = 760;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      ${shadow(id, 470, T + 280, 280, 52, .44, "float-shadow")}${contact(id, 486, T + 266, 190, 22, .5)}${glowSpot(id, 530, T + 292, 160, 24)}
      ${jar(id, p, 316, 653, 1.15, { lidOff: true, dipper: true })}
      ${shadow(id, 780, T + 345, 190, 40, .36)}${lidFlat(id, 790, T + 322, 1.02)}
      ${ginger(id, 90, T + 210, .95, -14)}
      ${scatter([[290, T + 140, 12, -20], [880, T + 110, 10, 10], [250, T + 190, 8, -40]])}
      ${finish(id, W, H)}`;
  },
  cup(id, p, anim) {
    const W = 1000, H = 1250, T = 720;
    return `${defs(id, p)}${wall(id, H)}${bokeh(id, anim)}${table(id, T, H)}
      <g filter="url(#${id}-dof)" opacity=".96">${shadow(id, 690, T + 56, 200, 30, .32, "float-shadow")}${jar(id, p, 566, 520, .8)}</g>
      ${linen(id, -330, T + 170, 780, 270, 2)}
      ${shadow(id, 380, T + 360, 300, 50, .45)}
      ${cup(id, 330, T + 200, 1.55, { anim })}
      ${lemon(id, 840, T + 330, 48)}
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${defs(id, p)}<rect width="1200" height="630" fill="url(#${id}-wall)"/><rect width="1200" height="630" fill="url(#${id}-window)"/>${table(id, T, 630)}${shadow(id, 880, T + 100, 220, 36, .45)}${jar(id, p, 745, 232, .88)}${ginger(id, 560, T + 40, .8, -10)}
    <g transform="translate(70 120)">${logoMark({ size: 120, wordmark: false, id: "og-lm" })}<text x="0" y="200" font-family="${SERIF}" font-size="44" letter-spacing="6" fill="#1D2B33">FUNCTIONAL ELIXIRS</text><text x="0" y="260" font-family="${SERIF}" font-size="30" fill="#5C534B">${esc(p ? p.name + " · " + p.size : "Nature’s Daily Elixir.")}</text><text x="0" y="310" font-family="${SANS}" font-size="20" letter-spacing="3" fill="#7F5E1C">RAW HONEY · FRESH GINGER · NOTHING ELSE</text></g>${finish(id, 1200, 630)}</svg>`;
}

export const altFor = (p, variant) => ({
  hero: `Functional Elixirs ${p.name} in a plump glass jar with a domed wooden lid on a linen napkin, beside a round ceramic cup of steaming tea with a honey spoon, fresh ginger root and a lemon slice in soft morning window light`,
  front: `Glass jar of Functional Elixirs ${p.name} (${p.size}) with a blonde wooden lid and cream striped label standing on a wooden table next to a knob of fresh ginger root`,
  open: `Open jar of Functional Elixirs ${p.name} with the wooden lid resting beside it and a beechwood dipper lifting a thread of dark amber honey`,
  cup: `Round ceramic cup of warm tea with a spoon stirring honey-ginger in, the Functional Elixirs jar softly out of focus behind`,
}[variant]);

export const photo = (key, { className = "" } = {}) => { const r = REAL[key]; return `<img src="${r.src}" alt="${esc(r.alt)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" class="${className}">`; };
