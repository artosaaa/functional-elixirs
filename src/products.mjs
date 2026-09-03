/* Catalog — one product, several formats. All SKUs are formats of the real Honey with Fresh Ginger jar
   (plus the wooden dipper). Prices other than the 15 oz jar are suggested placeholders — edit freely.
   Inventory is static; the runtime clamps qty to `stock`, shows “Only X left” at <= 10, sold-out at 0. */
const P = (o) => ({ url: `/shop/${o.slug}/`, currency: "USD", rating: 4.9, reviews: 96, type: "Infused honey", ...o });

const BASE_INGREDIENTS = "Raw honey, fresh ginger root. That’s the whole list.";
const BASE_SHORT = "Rich raw honey infused with real fresh ginger. Sweet, warming, slightly spicy — by the spoon, in tea, over breakfast.";

export const PRODUCTS = [
  P({
    id: "hg-15", slug: "honey-with-fresh-ginger", sku: "FE-HG-15",
    name: "Honey with Fresh Ginger", sub: "15 oz (425 g) glass jar", label: ["HONEY", "with fresh", "GINGER"], size: "15 oz",
    price: 23.99, stock: 9, badge: "Signature", rating: 4.9, reviews: 214,
    honey: "#7A3E0F", art: "hero",
    notes: ["Warm honey", "Fresh ginger", "Gentle heat"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Morning", also: "Tea · oats · glazes" },
    ingredients: BASE_INGREDIENTS, origin: "Blended and jarred in small batches in the USA",
    short: BASE_SHORT,
    story: "This is the jar that started everything — the one our mother kept on her counter. Rich raw honey is infused with real fresh ginger (never powder, never extract) until the two taste like one thing: sweet first, then a slow, clean warmth. A teaspoon in warm water is how she took it every morning. It’s how we still do.",
    tags: ["signature", "gift", "under30", "bestseller", "beginner"], featured: true,
  }),
  P({
    id: "hg-8", slug: "honey-with-fresh-ginger-8oz", sku: "FE-HG-08",
    name: "Honey with Fresh Ginger", sub: "8 oz (227 g) everyday jar", label: ["HONEY", "with fresh", "GINGER"], size: "8 oz",
    price: 14.99, stock: 40, rating: 4.9, reviews: 88,
    honey: "#7A3E0F", art: "front",
    notes: ["Warm honey", "Fresh ginger", "Gentle heat"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Any time", also: "Desk · travel · gifting" },
    ingredients: BASE_INGREDIENTS, origin: "Blended and jarred in small batches in the USA",
    short: "The same honey-ginger in a smaller jar. Right for a desk drawer, a first try, or a stocking.",
    story: "Everything the 15 oz jar is, in a size that fits a tote bag. About three weeks of morning spoonfuls.",
    tags: ["gift", "under30", "beginner"], featured: true,
  }),
  P({
    id: "hg-duo", slug: "honey-with-fresh-ginger-two-jar-set", sku: "FE-HG-DUO",
    name: "The Two-Jar Set", sub: "2 × 15 oz jars · one for the counter, one for the pantry", label: ["HONEY", "with fresh", "GINGER"], size: "2 × 15 oz",
    price: 44.99, compareAt: 47.98, stock: 20, badge: "Ships free", rating: 5.0, reviews: 41,
    honey: "#7A3E0F", art: "open",
    notes: ["Two months", "of mornings", "Ships free"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Daily", also: "Share one" },
    ingredients: "Two 15 oz jars of Honey with Fresh Ginger.", origin: "Blended and jarred in small batches in the USA",
    short: "Two signature jars, a little less each. Free shipping, and you won’t run out mid-ritual.",
    story: "Most people who try the jar come back for two. This saves them the second trip.",
    tags: ["gift", "set", "value"], featured: true,
  }),
  P({
    id: "hg-gift", slug: "honey-with-fresh-ginger-gift-box", sku: "FE-HG-GIFT",
    name: "The Gift Box", sub: "15 oz jar · wooden dipper · linen wrap · ritual card", label: ["HONEY", "with fresh", "GINGER"], size: "15 oz + dipper",
    price: 34.99, stock: 12, badge: "Gift", rating: 5.0, reviews: 37,
    honey: "#7A3E0F", art: "hero",
    notes: ["Ready to give", "Hand-wrapped", "Card included"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Morning", also: "Write a note at checkout" },
    ingredients: "One 15 oz jar of Honey with Fresh Ginger, one beechwood honey dipper, unbleached linen wrap, a printed ritual card and a blank note card.", origin: "Assembled by hand",
    short: "The signature jar, a beechwood dipper, and a linen wrap — ready to hand over. Add a note at checkout.",
    story: "We wrap each one ourselves. Tell us what to write on the card and we’ll write it.",
    tags: ["gift", "set"],
  }),
  P({
    id: "dipper", slug: "beechwood-honey-dipper", sku: "FE-DIP-01", type: "Accessory",
    name: "Beechwood Honey Dipper", sub: "6-inch turned beechwood", label: ["DIPPER"], size: "6 in",
    price: 8.99, stock: 60, rating: 4.8, reviews: 52,
    honey: "#7A3E0F", art: "cup",
    notes: ["Beechwood", "No drips", "Fits the jar"],
    use: { spoon: "Twist", water: "—", when: "—", also: "Hand wash" },
    ingredients: "Solid beechwood, food-safe oil finish.", origin: "Turned in Europe",
    short: "A simple turned-wood dipper that carries honey-ginger to the cup without the drip down the jar.",
    story: "The jar’s wide mouth was made for this. Twist, lift, let it spiral off the end.",
    tags: ["gift", "under30", "accessory"],
  }),
  P({
    id: "hg-3", slug: "honey-with-fresh-ginger-travel-jar", sku: "FE-HG-03",
    name: "Travel Jar", sub: "3 oz (85 g) · fits a carry-on", label: ["HONEY", "with fresh", "GINGER"], size: "3 oz",
    price: 7.99, stock: 0, badge: "Sold out", rating: 4.9, reviews: 29,
    honey: "#7A3E0F", art: "front",
    notes: ["TSA-friendly", "One week", "Pocket-sized"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "On the road", also: "Hotel tea" },
    ingredients: BASE_INGREDIENTS, origin: "Blended and jarred in small batches in the USA",
    short: "A week of spoonfuls in a jar that clears security. Sold out — back with the next batch.",
    story: "Made for the hotel kettle and the long flight home.",
    tags: ["under30", "travel", "limited"],
  }),
  P({
    id: "hg-trio", slug: "honey-with-fresh-ginger-family-pack", sku: "FE-HG-TRIO",
    name: "The Family Pack", sub: "3 × 15 oz jars · the whole household, covered", label: ["HONEY", "with fresh", "GINGER"], size: "3 × 15 oz",
    price: 64.99, compareAt: 71.97, stock: 8, badge: "Best value", rating: 5.0, reviews: 18,
    honey: "#7A3E0F", art: "open",
    notes: ["Three jars", "Ships free", "Best value"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Daily", also: "Kitchen · office · gift" },
    ingredients: "Three 15 oz jars of Honey with Fresh Ginger.", origin: "Blended and jarred in small batches in the USA",
    short: "Three signature jars at our best per-jar price. One for the kitchen, one for the office, one to give.",
    story: "For the houses where the jar empties faster than anyone admits.",
    tags: ["set", "value", "gift"],
  }),
];

export const HERO = PRODUCTS[0];
export const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
export const COLLECTIONS = {
  "gifts-under-30": { title: "Gifts under $30", h1: "Gifts under $30", description: "Honey with fresh ginger gifts under $30 — the signature 15 oz jar, the 8 oz everyday jar and the beechwood dipper. Free shipping over $40.", lede: "A jar of honey-ginger is the kind of gift people actually finish. These are the ones we wrap most often.", filter: (p) => p.price < 30 && p.tags.includes("gift") },
  "for-beginners": { title: "New here? Start here", h1: "Start here", description: "New to Functional Elixirs? Start with the 15 oz signature jar or the 8 oz everyday jar, and the simple daily ritual: scoop, stir, sip.", lede: "Two ingredients and a teaspoon. If you’re new, start with a jar and the ritual — the rest follows.", filter: (p) => p.tags.includes("beginner") },
};

/* Compact catalog injected into every page for the runtime cart */
export const catalogJSON = () => JSON.stringify(Object.fromEntries(PRODUCTS.map((p) => [p.id, { id: p.id, name: p.name, sub: p.sub, price: p.price, stock: p.stock, url: p.url, honey: p.honey, size: p.size }])));
