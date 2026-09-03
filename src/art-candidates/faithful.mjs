/* ==========================================================================
   Scene generator (candidate "faithful") — SVG photographs of the real
   Honey with Fresh Ginger jar: squat barrel body with soft shoulders, wide
   pale bamboo lid with a rounded rim and end-grain rings, dark amber honey
   backlit at the top, ginger threads inside, the striped label wrapped round
   the front with the navy F·E plaque. Props are photographic (ceramic cup,
   ginger knob with a cut slice, half lemon, linen, wood grain), window light
   from the upper right, shallow depth of field. Same exports as src/art.mjs.
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
const r1 = (v) => Math.round(v * 10) / 10;
const SANS = "Gill Sans, Avenir Next, Futura, Helvetica Neue, Helvetica, Arial, sans-serif";
const SCRIPT = "Snell Roundhand, Brush Script MT, Segoe Script, cursive";

/* jar geometry (local units, bottom-centre at 0,0): body 300 wide × 330 tall, lid 314 × 72 on top, camera a little above */
const JW = 150, JH = 330, LH = 72, LW = 157, RY = 14;
/* rim is an ellipse seen from a little above (front edge bows down), barrel sides, soft elliptical foot */
const BODY = `M-150 -330A150 14 0 0 0 150 -330C156 -240 156 -120 150 -40C150 -18 100 0 0 0C-100 0 -150 -18 -150 -40C-156 -120 -156 -240 -150 -330Z`;
/* label outline: wraps the cylinder, top/bottom edges bow downward like a photographed jar */
const LT = -272, LB = -60, LR = 148;
const LABEL = `M-148 -272A148 11 0 0 0 148 -272L148 -60A148 11 0 0 1 -148 -60Z`;

function defs(id, p) {
  const honey = p?.honey || "#7A3E0F";
  return `<defs>
    <linearGradient id="${id}-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EADA"/><stop offset=".55" stop-color="#E9DCC6"/><stop offset="1" stop-color="#D3C1A4"/></linearGradient>
    <radialGradient id="${id}-window" cx=".82" cy=".1" r=".75"><stop offset="0" stop-color="#FFF9EA" stop-opacity=".95"/><stop offset=".4" stop-color="#FFF4DE" stop-opacity=".4"/><stop offset="1" stop-color="#FFF4DE" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B08657"/><stop offset=".35" stop-color="#8E6640"/><stop offset="1" stop-color="#4E3220"/></linearGradient>
    <linearGradient id="${id}-woodx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
    <linearGradient id="${id}-lid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A784E"/><stop offset=".16" stop-color="#C9A97A"/><stop offset=".55" stop-color="#EAD5AB"/><stop offset=".84" stop-color="#D8BB8A"/><stop offset="1" stop-color="#A07D55"/></linearGradient>
    <linearGradient id="${id}-lidv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2410" stop-opacity=".18"/><stop offset=".25" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#3a2410" stop-opacity=".26"/></linearGradient>
    <radialGradient id="${id}-lidtop" cx=".64" cy=".3" r=".8"><stop offset="0" stop-color="#F4E4C0"/><stop offset=".7" stop-color="#E0C595"/><stop offset="1" stop-color="#C7A676"/></radialGradient>
    <linearGradient id="${id}-honey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(honey, .4)}"/><stop offset=".13" stop-color="${shade(honey, .22)}"/><stop offset=".32" stop-color="${honey}"/><stop offset=".8" stop-color="${shade(honey, -.2)}"/><stop offset="1" stop-color="${shade(honey, -.42)}"/></linearGradient>
    <linearGradient id="${id}-honeyx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c0d04" stop-opacity=".5"/><stop offset=".2" stop-color="#1c0d04" stop-opacity=".08"/><stop offset=".55" stop-color="#ffb347" stop-opacity="0"/><stop offset=".84" stop-color="#ffc86a" stop-opacity=".24"/><stop offset="1" stop-color="#3a1c07" stop-opacity=".45"/></linearGradient>
    <radialGradient id="${id}-htop" cx=".62" cy=".4" r=".7"><stop offset="0" stop-color="${shade(honey, .35)}"/><stop offset=".6" stop-color="${honey}"/><stop offset="1" stop-color="${shade(honey, -.4)}"/></radialGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1a0a" stop-opacity=".28"/><stop offset=".05" stop-color="#fff" stop-opacity=".42"/><stop offset=".13" stop-color="#fff" stop-opacity=".1"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".78" stop-color="#fff" stop-opacity=".05"/><stop offset=".93" stop-color="#fff" stop-opacity=".36"/><stop offset="1" stop-color="#2a1a0a" stop-opacity=".35"/></linearGradient>
    <linearGradient id="${id}-wrap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b2a14" stop-opacity=".42"/><stop offset=".14" stop-color="#3b2a14" stop-opacity=".04"/><stop offset=".5" stop-color="#3b2a14" stop-opacity="0"/><stop offset=".8" stop-color="#3b2a14" stop-opacity=".05"/><stop offset="1" stop-color="#3b2a14" stop-opacity=".45"/></linearGradient>
    <linearGradient id="${id}-cer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CBBFA9"/><stop offset=".3" stop-color="#EFE8DA"/><stop offset=".62" stop-color="#FBF8F1"/><stop offset=".86" stop-color="#E8DFCE"/><stop offset="1" stop-color="#BBAE97"/></linearGradient>
    <linearGradient id="${id}-cerv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#3a2a18" stop-opacity=".08"/><stop offset="1" stop-color="#3a2a18" stop-opacity=".3"/></linearGradient>
    <radialGradient id="${id}-tea" cx=".62" cy=".38" r=".75"><stop offset="0" stop-color="#E9B96A"/><stop offset=".6" stop-color="#C98C3C"/><stop offset="1" stop-color="#7E4E1C"/></radialGradient>
    <linearGradient id="${id}-spoon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A8845A"/><stop offset=".5" stop-color="#E0C293"/><stop offset="1" stop-color="#B08B5E"/></linearGradient>
    <linearGradient id="${id}-linen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7F1E6"/><stop offset=".5" stop-color="#EBE1CF"/><stop offset="1" stop-color="#D3C5AC"/></linearGradient>
    <linearGradient id="${id}-ginger" x1="-90" y1="-80" x2="90" y2="20" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B58B5B"/><stop offset=".45" stop-color="#DDBA85"/><stop offset=".8" stop-color="#EDD2A1"/><stop offset="1" stop-color="#C39A66"/></linearGradient>
    <radialGradient id="${id}-cut" cx=".55" cy=".4" r=".7"><stop offset="0" stop-color="#F8EDBC"/><stop offset=".75" stop-color="#E9D68F"/><stop offset="1" stop-color="#CDB56A"/></radialGradient>
    <radialGradient id="${id}-lemon" cx=".55" cy=".45" r=".55"><stop offset="0" stop-color="#FBEFA6"/><stop offset=".72" stop-color="#F3D85A"/><stop offset=".79" stop-color="#FDF8DF"/><stop offset=".88" stop-color="#F6DF6D"/><stop offset="1" stop-color="#D5AF2A"/></radialGradient>
    <radialGradient id="${id}-rind" cx=".65" cy=".3" r=".8"><stop offset="0" stop-color="#F9E36E"/><stop offset=".7" stop-color="#E9C433"/><stop offset="1" stop-color="#A8801A"/></radialGradient>
    <radialGradient id="${id}-vig" cx=".5" cy=".48" r=".72"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1a10" stop-opacity=".32"/></radialGradient>
    <filter id="${id}-soft" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="${id}-softer" x="-40%" y="-60%" width="180%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="${id}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}-dof" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.6"/></filter>
    <filter id="${id}-steam" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4.5"/></filter>
    <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .065 0"/></filter>
    <clipPath id="${id}-body"><path d="${BODY}"/></clipPath>
    <clipPath id="${id}-label"><path d="${LABEL}"/></clipPath>
  </defs>`;
}

const wall = (id, H, T) => `<rect width="1000" height="${H}" fill="url(#${id}-wall)"/><rect width="1000" height="${H}" fill="url(#${id}-window)"/><rect x="620" y="-80" width="520" height="${Math.round(T * .9)}" rx="90" fill="#FFF8E6" opacity=".35" filter="url(#${id}-blur)"/>`;
function bokeh(id, anim) {
  const dots = [[840, 150, 74, .42], [930, 300, 50, .3], [720, 80, 40, .36], [980, 60, 30, .28], [790, 330, 24, .22], [110, 200, 64, .14]];
  return `<g class="${anim ? "bokeh" : ""}" filter="url(#${id}-blur)">${dots.map(([x, y, r, o], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF7E2" opacity="${o}" style="--i:${i}"/>`).join("")}</g>`;
}
function table(id, T, H) {
  const grain = Array.from({ length: 8 }, (_, i) => {
    const yy = Math.round(T + 26 + i * ((H - T) / 8) + (i % 3) * 9), a = 6 + (i % 4) * 5;
    return `<path d="M-20 ${yy}C200 ${yy - a} 420 ${yy + a} 640 ${yy - a * .6}S900 ${yy + a * .8} 1020 ${yy - 4}" fill="none" stroke="#2e1a0c" stroke-opacity="${.09 + (i % 3) * .035}" stroke-width="${1 + (i % 3) * .7}"/>`;
  }).join("");
  const knot = (x, y) => `<g opacity=".14" fill="none" stroke="#2e1a0c"><ellipse cx="${x}" cy="${y}" rx="24" ry="7" stroke-width="1.4"/><ellipse cx="${x}" cy="${y}" rx="12" ry="3.4"/></g>`;
  return `<rect x="0" y="${T}" width="1000" height="${H - T}" fill="url(#${id}-wood)"/><rect x="0" y="${T}" width="1000" height="${H - T}" fill="url(#${id}-woodx)"/>
    <path d="M330 ${T}L250 ${H}M690 ${T}L790 ${H}" stroke="#2e1a0c" stroke-opacity=".18" stroke-width="1.6"/>${grain}${knot(150, Math.round(T + (H - T) * .55))}${knot(860, Math.round(T + (H - T) * .3))}
    <ellipse cx="760" cy="${T + 80}" rx="420" ry="90" fill="#fff" opacity=".1" filter="url(#${id}-blur)"/><rect x="0" y="${T}" width="1000" height="3" fill="#fff" opacity=".14"/>`;
}
/* ground shadow thrown to the lower-left (window is upper-right) + tight contact shadow; the jar's shadow also
   carries a faint amber glow on the lit side, where light comes through the honey */
const shadow = (id, cx, cy, rx, ry, o = .42, cls = "") => `<g class="${cls}"><ellipse cx="${r1(cx - rx * .18)}" cy="${cy + 2}" rx="${rx}" ry="${ry}" fill="#2a1a0e" opacity="${o}" filter="url(#${id}-soft)"/>${cls ? `<ellipse cx="${r1(cx + rx * .3)}" cy="${cy + 4}" rx="${r1(rx * .55)}" ry="${r1(ry * .5)}" fill="#e0862a" opacity=".22" filter="url(#${id}-soft)"/>` : ""}<ellipse cx="${cx}" cy="${cy}" rx="${r1(rx * .66)}" ry="${r1(ry * .38)}" fill="#1d1108" opacity="${r1(o * .9)}" filter="url(#${id}-softer)"/></g>`;
/* folded linen: a soft-cornered cloth with a turned-over flap and blurred fold shadows */
function linen(id, x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-30 236C-40 170 10 110 0 44C90 0 250 26 400 6C470 -4 520 24 540 60C500 110 470 150 480 200C330 236 150 190 -30 236Z" fill="#2a1a0e" opacity=".3" filter="url(#${id}-soft)" transform="translate(-14 14)"/>
    <path d="M-30 236C-40 170 10 110 0 44C90 0 250 26 400 6C470 -4 520 24 540 60C500 110 470 150 480 200C330 236 150 190 -30 236Z" fill="url(#${id}-linen)"/>
    <path d="M0 44C90 0 250 26 400 6C470 -4 520 24 540 60C470 46 380 70 300 62C200 54 100 80 0 44Z" fill="#fff" opacity=".45"/>
    <path d="M0 44C90 0 250 26 400 6C470 -4 520 24 540 60C470 46 380 70 300 62C200 54 100 80 0 44Z" fill="none" stroke="#a8977c" stroke-opacity=".35" stroke-width="2"/>
    <g fill="none" stroke="#8f7e62" stroke-width="7" stroke-linecap="round" filter="url(#${id}-softer)" opacity=".28"><path d="M40 120C160 96 300 140 450 112"/><path d="M20 190C150 166 290 206 440 180"/><path d="M120 70C200 60 300 100 380 90"/></g>
    <path d="M30 100C160 74 300 120 460 92" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>
  </g>`;
}

/* ginger threads and slivers suspended in the honey */
function threads(seed = 1) {
  return Array.from({ length: 6 }, (_, i) => {
    const x = -110 + ((i * 71 + seed * 29) % 220), y = -300 + ((i * 53 + seed * 13) % 250), d = 14 + (i % 3) * 8, k = i % 2 ? 1 : -1;
    return `<path d="M${x} ${y}c${k * 8} ${d * .5} ${-k * 4} ${d} ${k * 6} ${d * 1.5}" fill="none" stroke="#EAD08F" stroke-opacity=".48" stroke-width="${1.8 + (i % 2)}" stroke-linecap="round"/><ellipse cx="${x + 18}" cy="${y + d}" rx="${5 + (i % 3) * 2}" ry="2.4" fill="#F0DFA5" opacity=".5" transform="rotate(${(i * 41) % 180} ${x + 18} ${y + d})"/>`;
  }).join("");
}

/* the label — cylinder-mapped cream/yellow stripes, white wrap margins, the plaque, HONEY / with fresh / GINGER */
function label(id, p) {
  const isDipper = p?.id === "dipper" || p?.type === "Accessory";
  let stripes = "";
  for (let i = 0; i < 16; i += 2) {
    const a0 = -80 + i * 10, x0 = LR * Math.sin(a0 * Math.PI / 180), x1 = LR * Math.sin((a0 + 10) * Math.PI / 180);
    stripes += `<rect x="${r1(x0)}" y="-300" width="${r1(x1 - x0)}" height="252" fill="#F0E3A7"/>`;
  }
  const mark = logoMark({ size: 100, wordmark: false, id: `${id}-lm` }).replace("<svg ", `<svg x="-50" y="${LT + 10}" `);
  const body = isDipper
    ? `<text x="0" y="-112" text-anchor="middle" font-family="${SANS}" font-size="30" font-weight="700" letter-spacing="4" fill="#B98F3A">DIPPER</text><text x="0" y="-93" text-anchor="middle" font-family="${SANS}" font-size="11" letter-spacing="1" fill="#2B3A44">turned beechwood</text><text x="0" y="-73" text-anchor="middle" font-family="${SCRIPT}" font-size="13" fill="#B98F3A">Crafted From Family Tradition</text>`
    : `<text x="0" y="-130" text-anchor="middle" font-family="${SANS}" font-size="31" font-weight="700" letter-spacing="2.5" fill="#B98F3A">HONEY</text>
       <text x="0" y="-115" text-anchor="middle" font-family="${SANS}" font-size="11.5" letter-spacing=".4" fill="#2B3A44">with fresh</text>
       <text x="0" y="-89" text-anchor="middle" font-family="${SANS}" font-size="31" font-weight="700" letter-spacing="2.5" fill="#B98F3A">GINGER</text>
       <text x="0" y="-74" text-anchor="middle" font-family="${SCRIPT}" font-size="13.5" fill="#A87A2A">Crafted From Family Tradition</text>
       <text x="0" y="-61" text-anchor="middle" font-family="${SANS}" font-size="8.5" letter-spacing=".8" fill="#2B3A44">${esc(p?.size || "15 oz")} (425g)</text>`;
  return `<g clip-path="url(#${id}-label)"><rect x="-148" y="-300" width="296" height="252" fill="#FBF7EC"/>${stripes}<rect x="-148" y="-300" width="8" height="252" fill="#FBF7EC"/><rect x="140" y="-300" width="8" height="252" fill="#FBF7EC"/><rect x="-148" y="-300" width="296" height="252" fill="url(#${id}-wrap)"/></g>${mark}${body}`;
}

/* end-grain rings on the lid's top face */
const rings = (cy, rx, ry) => [118, 74, 30].map((r, i) => `<ellipse cx="${14 - i * 4}" cy="${cy}" rx="${r}" ry="${r1(r * ry / rx)}" fill="none" stroke="#9E7C50" stroke-opacity="${.16 + i * .04}" stroke-width="1.2"/>`).join("");
/* the lid — pale bamboo, rounded rim (bevel highlight + dark underside), end-grain rings */
function lidOn(id) {
  /* the skirt reaches 8 below the glass rim so its front edge always covers the shoulder */
  const y0 = -JH - LH, y1 = -JH + 8, side = `M-${LW} ${y0}V${y1}A${LW} 16 0 0 0 ${LW} ${y1}V${y0}Z`;
  return `<g><path d="${side}" fill="url(#${id}-lid)"/><path d="${side}" fill="url(#${id}-lidv)"/>
    <path d="${[-120, -84, -46, -8, 30, 68, 106].map((gx) => `M${gx} ${y0 + 6}V${y1 + 4}`).join("")}" stroke="#7d5c36" stroke-opacity=".1" stroke-width="1.4"/>
    <path d="M-${LW} ${y1}A${LW} 16 0 0 0 ${LW} ${y1}" fill="none" stroke="#3a2410" stroke-opacity=".35" stroke-width="2"/>
    <ellipse cx="0" cy="${y0}" rx="${LW}" ry="${RY}" fill="url(#${id}-lidtop)"/>${rings(y0, LW, RY)}
    <ellipse cx="0" cy="${y0}" rx="${LW - 7}" ry="${RY - 1}" fill="none" stroke="#8a6a44" stroke-opacity=".14" stroke-width="1.2"/>
    <path d="M-${LW} ${y0}A${LW} ${RY} 0 0 1 ${LW} ${y0}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
    <path d="M-${LW} ${y0}A${LW} ${RY} 0 0 0 ${LW} ${y0}" fill="none" stroke="#6e4f2c" stroke-opacity=".3" stroke-width="1.6"/>
  </g>`;
}
function lidFlat(id, x, y, s = 1) {
  const rx = 157, ry = 60, h = 36;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="-34" cy="${h + 12}" rx="${rx + 16}" ry="${ry * .7}" fill="#2a1a0e" opacity=".42" filter="url(#${id}-soft)"/>
    <path d="M-${rx} 0V${h - 12}Q-${rx} ${h + ry - 8} -${rx - 30} ${h + ry - 4}Q0 ${h + ry + 6} ${rx - 30} ${h + ry - 4}Q${rx} ${h + ry - 8} ${rx} ${h - 12}V0Z" fill="url(#${id}-lid)"/>
    <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="url(#${id}-lidtop)"/>${rings(0, rx, ry)}
    <ellipse cx="0" cy="0" rx="${rx - 7}" ry="${ry - 3}" fill="none" stroke="#8a6a44" stroke-opacity=".14" stroke-width="1.2"/>
    <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
  </g>`;
}

/* turned beechwood dipper (handle 0→184, grooved head to 250) with an optional honey thread */
function dipperArt(id, x, y, rot, s = 1, thread = 0) {
  const grooves = [0, 12, 24, 36, 48].map((yy) => `<ellipse cx="0" cy="${186 + yy}" rx="${r1(22 - Math.abs(yy - 24) * .12)}" ry="5" fill="none" stroke="#6e4f2c" stroke-opacity=".55" stroke-width="2.2"/>`).join("");
  /* a solid thread (always visible) with the animated dashed one riding on top of it */
  const d = `M0 246C6 ${246 + thread * .35} -5 ${246 + thread * .7} 2 ${246 + thread}`;
  const th = thread ? `<path d="${d}" stroke="#7a3e0f" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9"/><path class="honey-drip" d="${d}" stroke="#b8621c" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9"/><path d="M-1 250C4 ${250 + thread * .35} -6 ${250 + thread * .7} 0 ${240 + thread}" stroke="#f0b055" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".7"/>` : "";
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M-5 0Q-7 0 -7 6V178Q-7 184 -3 184H3Q7 184 7 178V6Q7 0 5 0Z" fill="url(#${id}-spoon)"/>
    <path d="M-24 190C-24 176 24 176 24 190V232C24 250 -24 250 -24 232Z" fill="url(#${id}-spoon)"/>${grooves}
    <ellipse cx="0" cy="238" rx="22" ry="8" fill="#8f6d42"/>
    <path d="M-2 6V176" stroke="#fff" stroke-opacity=".3" stroke-width="2.2" stroke-linecap="round"/>${th}
  </g>`;
}

/* jar: bottom-centre at (x, y) in scene space */
function jar(id, p, x, y, s = 1, { lidOff = false, dipper = false } = {}) {
  const mouth = lidOff
    ? `<ellipse cx="0" cy="-330" rx="150" ry="14" fill="#e8d8b8" opacity=".5"/><ellipse cx="0" cy="-330" rx="144" ry="11" fill="url(#${id}-htop)"/><ellipse cx="0" cy="-330" rx="140" ry="8" fill="none" stroke="#1c0d04" stroke-opacity=".3" stroke-width="4"/><path d="M-70 -336A80 7 0 0 1 60 -336" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="-330" rx="150" ry="14" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><ellipse cx="0" cy="-330" rx="149" ry="13" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="7" stroke-linejoin="round"/>${dipper ? `<ellipse cx="14" cy="-329" rx="16" ry="4" fill="#c97b2a" opacity=".8"/>` : ""}`
    : `<path d="M-150 -330A150 14 0 0 0 150 -330V-298A150 14 0 0 1 -150 -298Z" fill="#160a03" opacity=".4"/>`;
  return `<g class="float" transform="translate(${x} ${y}) scale(${s})">
    <g clip-path="url(#${id}-body)">
      <rect x="-158" y="-334" width="316" height="338" fill="url(#${id}-honey)"/>${threads(p?.id?.length || 1)}
      <rect x="-158" y="-334" width="316" height="338" fill="url(#${id}-honeyx)"/>
      <circle cx="40" cy="-300" r="2.6" fill="#fff" opacity=".22"/><circle cx="-64" cy="-292" r="1.8" fill="#fff" opacity=".2"/><circle cx="96" cy="-305" r="1.4" fill="#fff" opacity=".2"/>
      ${label(id, p)}
      <path d="${BODY}" fill="url(#${id}-glass)"/>
      <path class="glass-sweep" d="M-124 -280C-130 -200 -130 -120 -124 -30" stroke="#fff" stroke-opacity=".32" stroke-width="16" stroke-linecap="round" fill="none" filter="url(#${id}-softer)"/>
      <path d="M134 -270C138 -200 138 -110 134 -40" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M60 -320Q120 -300 132 -250" stroke="#fff" stroke-opacity=".28" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#${id}-softer)"/>
      <path d="M-150 -40C-150 -18 -100 0 0 0C100 0 150 -18 150 -40V-8Q0 20 -150 -8Z" fill="#fff" opacity=".12"/>
      ${mouth}
    </g>
    <path d="${BODY}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6"/>
    ${lidOff ? "" : lidOn(id)}
    ${dipper ? dipperArt(id, -40, -636, 10, 1, 66) : ""}
  </g>`;
}

/* ceramic cup with tea, a spoon of honey resting in it and steam; bottom-centre at (x, y) */
function cup(id, x, y, s = 1, { steam = true, anim = false, spoon = true } = {}) {
  const st = steam ? `<g class="${anim ? "steam" : ""}" filter="url(#${id}-steam)" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"><path style="--i:0" d="M-40 -178C-70 -220 0 -250 -30 -300"/><path style="--i:1" d="M8 -180C-22 -230 46 -250 12 -318"/><path style="--i:2" d="M54 -176C34 -214 84 -246 56 -286"/></g>` : "";
  /* bowl sits at the surface line; the front half of the tea is repainted over it so it reads as half-submerged */
  const sp = spoon ? `<g transform="translate(-30 -150) rotate(-118)"><path d="M-4 0Q-6 0 -6 5V150Q-6 156 0 156Q6 156 6 150V5Q6 0 4 0Z" fill="url(#${id}-spoon)"/><ellipse cx="0" cy="-14" rx="19" ry="24" fill="url(#${id}-spoon)"/><ellipse cx="0" cy="-12" rx="13" ry="16" fill="#8a4812" opacity=".9"/><ellipse cx="-4" cy="-18" rx="5" ry="3.5" fill="#e39a3c" opacity=".7"/></g><path d="M-90 -146A90 18.5 0 0 0 90 -146Z" fill="url(#${id}-tea)"/><path d="M-90 -146A90 18.5 0 0 0 90 -146" fill="none" stroke="#5a3410" stroke-opacity=".25" stroke-width="2"/>` : "";
  return `<g transform="translate(${x} ${y}) scale(${s})">${st}
    <path d="M96 -122C154 -134 166 -52 102 -40" fill="none" stroke="#6b5a45" stroke-opacity=".35" stroke-width="26" stroke-linecap="round" transform="translate(5 6)"/>
    <path d="M96 -122C154 -134 166 -52 102 -40" fill="none" stroke="url(#${id}-cer)" stroke-width="24" stroke-linecap="round"/>
    <path d="M96 -122C154 -134 166 -52 102 -40" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round" transform="translate(3 -6)"/>
    <path d="M-100 -150C-102 -90 -98 -40 -84 -14C-60 2 60 2 84 -14C98 -40 102 -90 100 -150Z" fill="url(#${id}-cer)"/>
    <path d="M-100 -150C-102 -90 -98 -40 -84 -14C-60 2 60 2 84 -14C98 -40 102 -90 100 -150Z" fill="url(#${id}-cerv)"/>
    <ellipse cx="0" cy="-150" rx="100" ry="24" fill="#F4EEE3"/><ellipse cx="0" cy="-148" rx="92" ry="20" fill="#CFC3AF"/><ellipse cx="0" cy="-146" rx="90" ry="18.5" fill="url(#${id}-tea)"/>
    <path d="M-100 -150A100 24 0 0 1 100 -150" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
    ${sp}<ellipse cx="34" cy="-148" rx="28" ry="5" fill="#fff" opacity=".26"/></g>`;
}

/* knob of fresh ginger with one cut end and a loose slice; origin at its base centre */
function ginger(id, x, y, s = 1, rot = 0, slice = true) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <ellipse cx="0" cy="-30" rx="46" ry="30" fill="url(#${id}-ginger)"/><ellipse cx="46" cy="-44" rx="36" ry="24" fill="url(#${id}-ginger)"/><ellipse cx="-46" cy="-24" rx="32" ry="22" fill="url(#${id}-ginger)"/><ellipse cx="22" cy="-12" rx="34" ry="18" fill="url(#${id}-ginger)"/><ellipse cx="-14" cy="-52" rx="24" ry="16" fill="url(#${id}-ginger)"/>
    <path d="M-70 -20c6 -6 14 -6 20 0M-24 -54c8 -6 18 -6 26 0M8 -34c10 -8 22 -8 32 0M34 -60c8 -5 18 -5 26 0M-10 -10c10 -6 22 -6 32 0M-60 -34c6 -4 12 -4 18 0" fill="none" stroke="#8a6440" stroke-opacity=".4" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="-74" cy="-18" rx="6" ry="4" fill="#8a6440" opacity=".35"/><ellipse cx="-30" cy="-64" rx="5" ry="3" fill="#8a6440" opacity=".3"/>
    <g transform="translate(80 -46) rotate(-16)"><ellipse rx="12" ry="21" fill="url(#${id}-cut)"/><ellipse rx="9" ry="16" fill="none" stroke="#c8ae62" stroke-opacity=".6"/><ellipse rx="3" ry="6" fill="none" stroke="#c8ae62" stroke-opacity=".5"/><ellipse class="glint" cx="-3" cy="-7" rx="3" ry="5" fill="#fff" opacity=".55"/></g>
    ${slice ? `<g transform="translate(112 -2) rotate(-24)"><ellipse rx="22" ry="13" fill="#c9a86a"/><ellipse cy="-2" rx="20" ry="11" fill="url(#${id}-cut)"/><ellipse cy="-2" rx="13" ry="7" fill="none" stroke="#c8ae62" stroke-opacity=".6"/><ellipse cy="-2" rx="5" ry="2.6" fill="none" stroke="#c8ae62" stroke-opacity=".5"/></g>` : ""}
  </g>`;
}
/* half lemon, cut face up, tilted a little toward the camera */
function lemon(id, x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cy="22" rx="50" ry="46" fill="url(#${id}-rind)"/>
    <ellipse cy="0" rx="47" ry="34" fill="#F6ECC0"/><ellipse cy="0" rx="43" ry="30" fill="url(#${id}-lemon)"/>
    ${[0, 45, 90, 135].map((a) => `<path d="M-38 0H38" stroke="#FDF8DF" stroke-width="2.2" transform="rotate(${a}) scale(1 .7)" opacity=".85"/>`).join("")}
    <circle r="3.2" fill="#FDF8DF"/>
    <ellipse class="glint" cx="14" cy="-11" rx="12" ry="4.5" fill="#fff" opacity=".5" transform="rotate(-20 14 -11)"/>
  </g>`;
}
const finish = (id, W, H) => `<rect width="${W}" height="${H}" fill="url(#${id}-vig)"/><rect width="${W}" height="${H}" filter="url(#${id}-grain)" opacity=".5" style="mix-blend-mode:multiply"/>`;

const VARIANTS = {
  hero(id, p, anim) {
    const W = 1000, H = 1200, T = 620;
    return `${defs(id, p)}${wall(id, H, T)}${bokeh(id, anim)}${table(id, T, H)}
      ${linen(id, 560, T + 285, .95)}
      ${shadow(id, 775, T + 395, 150, 26, .36)}${shadow(id, 160, T + 415, 130, 24, .34)}${shadow(id, 430, T + 400, 215, 42, .5, "float-shadow")}
      ${jar(id, p, 430, T + 400, 1.12)}
      ${cup(id, 775, T + 395, 1.22, { anim })}
      ${ginger(id, 150, T + 420, 1.1, -6)}${shadow(id, 300, T + 490, 60, 14, .3)}${lemon(id, 300, T + 466, 1)}
      ${finish(id, W, H)}`;
  },
  front(id, p, anim) {
    const W = 1000, H = 1250, T = 690;
    const acc = p?.type === "Accessory";
    return `${defs(id, p)}${wall(id, H, T)}${bokeh(id, anim)}${table(id, T, H)}
      ${shadow(id, 500, T + 380, 250, 46, .5, "float-shadow")}
      ${jar(id, p, 500, T + 380, 1.24)}
      ${acc ? `<ellipse cx="400" cy="${T + 500}" rx="220" ry="18" fill="#2a1a0e" opacity=".42" filter="url(#${id}-soft)"/>${dipperArt(id, 190, T + 440, -80, 1.65)}` : `${shadow(id, 760, T + 460, 130, 24, .34)}${ginger(id, 760, T + 460, 1.35, 8)}`}
      ${finish(id, W, H)}`;
  },
  open(id, p, anim) {
    const W = 1000, H = 1250, T = 720;
    return `${defs(id, p)}${wall(id, H, T)}${bokeh(id, anim)}${table(id, T, H)}
      ${linen(id, 560, T + 220, .95)}
      ${lidFlat(id, 770, T + 300, 1.05)}
      ${shadow(id, 420, T + 370, 230, 42, .5, "float-shadow")}
      ${jar(id, p, 420, T + 370, 1.15, { lidOff: true, dipper: true })}
      ${shadow(id, 160, T + 440, 110, 20, .34)}${ginger(id, 160, T + 440, 1.05, -10)}
      ${finish(id, W, H)}`;
  },
  cup(id, p, anim) {
    const W = 1000, H = 1250, T = 640;
    return `${defs(id, p)}${wall(id, H, T)}${bokeh(id, anim)}${table(id, T, H)}
      <g filter="url(#${id}-dof)" opacity=".96">${shadow(id, 650, T + 250, 190, 34, .4, "float-shadow")}${jar(id, p, 650, T + 250, .92)}</g>
      ${linen(id, 520, T + 340, 1)}
      ${shadow(id, 340, T + 500, 220, 40, .5)}
      ${cup(id, 340, T + 500, 1.75, { anim })}
      ${shadow(id, 820, T + 480, 70, 16, .35)}${lemon(id, 820, T + 450, 1.1)}
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
/* OG image (1200×630) — jar on the table, wide crop, with wordmark */
export function ogImage(p) {
  const id = "og"; const T = 380;
  const SERIF = "Iowan Old Style, Palatino Linotype, Palatino, Georgia, serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${defs(id, p)}<rect width="1200" height="630" fill="url(#${id}-wall)"/><rect width="1200" height="630" fill="url(#${id}-window)"/>${table(id, T, 630)}${shadow(id, 900, T + 200, 190, 34, .45)}${jar(id, p, 900, T + 200, .9)}${shadow(id, 640, T + 220, 100, 18, .3)}${ginger(id, 640, T + 220, .85, -10)}
    <g transform="translate(70 120)">${logoMark({ size: 120, wordmark: false, id: "og-lm" })}<text x="0" y="200" font-family="${SERIF}" font-size="44" letter-spacing="6" fill="#1D2B33">FUNCTIONAL ELIXIRS</text><text x="0" y="260" font-family="${SERIF}" font-size="30" fill="#5C534B">${esc(p ? p.name + " · " + p.size : "Nature’s Daily Elixir.")}</text><text x="0" y="310" font-family="-apple-system, Segoe UI, Helvetica, Arial, sans-serif" font-size="20" letter-spacing="3" fill="#7F5E1C">RAW HONEY · FRESH GINGER · NOTHING ELSE</text></g>${finish(id, 1200, 630)}</svg>`;
}

export const altFor = (p, variant) => ({
  hero: `Functional Elixirs ${p.name} in a squat glass jar with a pale bamboo lid on a wooden table, beside a ceramic cup of steaming tea with a spoon of honey, fresh ginger, a lemon half and folded linen in soft window light`,
  front: `Glass jar of Functional Elixirs ${p.name} (${p.size}) with a wide bamboo lid and cream striped label standing on a wooden table next to fresh ginger root with one cut slice`,
  open: `Open jar of Functional Elixirs ${p.name} with the bamboo lid resting on the table beside it and a beechwood dipper lifting a thread of dark amber honey from the mouth`,
  cup: `Ceramic cup of warm tea with a spoon of honey-ginger resting in it and a lemon half, the Functional Elixirs jar softly out of focus behind`,
}[variant]);

export const photo = (key, { className = "" } = {}) => { const r = REAL[key]; return `<img src="${r.src}" alt="${esc(r.alt)}" width="${r.w}" height="${r.h}" loading="lazy" decoding="async" class="${className}">`; };
