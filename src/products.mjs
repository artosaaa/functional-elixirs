/* Catalog — one product, several formats. All SKUs are formats of the real Honey with Fresh Ginger jar
   (plus the wooden dipper). Prices other than the 15 oz jar are suggested placeholders — edit freely.
   Inventory is static; the runtime clamps qty to `stock`, shows “Only X left” at <= 10, sold-out at 0. */
/* rating/reviews are null until real verified figures exist. Everything that would
   render them — the PDP rating line and the JSON-LD aggregateRating — is gated on
   them being truthy, so invented numbers cannot reach a search result. */
const P = (o) => ({ url: `/shop/${o.slug}/`, currency: "USD", rating: null, reviews: 0, type: "Infused honey", ...o });

const BASE_INGREDIENTS = "Raw honey, fresh ginger root. That’s the whole list.";
const BASE_SHORT = "Rich raw honey infused with real fresh ginger. Sweet, warming, slightly spicy — by the spoon, in tea, over breakfast.";

export const PRODUCTS = [
  P({
    id: "hg-15", slug: "honey-with-fresh-ginger", sku: "FE-HG-15",
    name: "Honey with Fresh Ginger", sub: "15 oz (425 g) glass jar", label: ["HONEY", "with fresh", "GINGER"], size: "15 oz",
    price: 23.99, stock: 240, badge: "Signature", rating: null, reviews: 0,
    honey: "#7A3E0F", art: "hero",
    notes: ["Warm honey", "Fresh ginger", "Gentle heat"],
    use: { spoon: "1 tsp", water: "8 oz warm", when: "Morning", also: "Tea · oats · glazes" },
    ingredients: BASE_INGREDIENTS, origin: "Blended and jarred in small batches in the USA",
    short: BASE_SHORT,
    story: "This is the jar that started everything — the one our mother kept on her counter. Rich raw honey is infused with real fresh ginger (never powder, never extract) until the two taste like one thing: sweet first, then a slow, clean warmth. A teaspoon in warm water is how she took it every morning. It’s how we still do.",
    tags: ["signature", "gift", "under30", "bestseller", "beginner"], featured: true,
  }),
];

export const HERO = PRODUCTS[0];
export const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
/* Compact catalog injected into every page for the runtime cart */
export const catalogJSON = () => JSON.stringify(Object.fromEntries(PRODUCTS.map((p) => [p.id, { id: p.id, name: p.name, sub: p.sub, price: p.price, stock: p.stock, url: p.url, honey: p.honey, size: p.size }])));
