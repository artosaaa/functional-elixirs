/* Journal — eight pieces. Each has a unique title/meta, internal links, and (where useful) FAQ schema.
   Health language is deliberately conservative: “traditionally enjoyed”, “many people find” — no treatment claims. */
const A = (o) => ({ url: `/journal/${o.slug}/`, modified: o.date, ...o });
const P = "/shop/honey-with-fresh-ginger/";

export const ARTICLES = [
  A({
    slug: "the-morning-ritual-honey-ginger-warm-water", tag: "Ritual", date: "2026-08-18", readTime: 4, art: "cup",
    title: "The Morning Ritual: Honey, Ginger, Warm Water",
    description: "How to start the day with a teaspoon of honey-ginger in warm water — the simple morning ritual behind Functional Elixirs, and why the small details matter.",
    excerpt: "Before coffee, before the phone: a spoon, a mug, warm water. The whole thing takes ninety seconds and somehow changes the shape of the morning.",
    related: ["honey-ginger-in-tea-instead-of-sugar", "a-jar-for-the-cold-months", "how-to-store-honey-and-why-it-crystallizes"],
    faq: [["How much honey-ginger should I use in warm water?", "Start with one teaspoon in about 8 oz of warm (not boiling) water. Adjust to taste — some mornings want two."], ["Should the water be hot or warm?", "Warm. Around 120–140°F feels right on the tongue and keeps the ginger bright. Boiling water works, but you lose some of the fresh top notes."]],
    body: `
<p>Our mother never called it a ritual. She called it “my honey.” Every morning, before anything else, she’d take the jar down from the shelf, twist the wooden lid, and drop a teaspoon into a mug of warm water. She’d stand at the counter and drink it while the house woke up. It was the only ten minutes of the day that belonged entirely to her.</p>
<p>That’s the whole practice. There is nothing to learn. But after a few years of doing it ourselves, we’ve noticed the small details that make it feel like something rather than nothing.</p>
<h2>Warm, not boiling</h2>
<p>Water straight off the boil flattens fresh ginger — you get heat without the brightness. Let the kettle sit for a minute or two, or mix a splash of cold into hot. Somewhere around 130°F the honey dissolves instantly and the ginger stays lively.</p>
<h2>One spoon, then wait</h2>
<p>A single teaspoon of <a href="${P}">Honey with Fresh Ginger</a> in 8 oz of water is where most people land. Stir until the honey lets go of the spoon — you’ll see the ginger threads swirl up from the bottom — then leave it thirty seconds before the first sip. The flavour settles. The ginger softens from spicy to warm.</p>
<blockquote>Sweet first. Then, a beat later, warmth at the back of the throat. That second part is why people keep the jar on the counter and not in the pantry.</blockquote>
<h2>Make it yours</h2>
<p>Squeeze in a wedge of lemon and it turns into something closer to a tonic. Use it in place of sugar in your <a href="/journal/honey-ginger-in-tea-instead-of-sugar/">first cup of tea</a>. Take it neat off the spoon on a morning when you’re already late. None of it is wrong.</p>
<h2>Why we bother</h2>
<p>Honey and ginger have been enjoyed together for a very long time, across a lot of kitchens, for the plain reason that they taste right. Many people tell us the morning cup leaves them feeling energized yet calm — that was our mother’s word for it too: <em>balance</em>. We don’t make claims about it. We just notice that the days that start with the spoon tend to go a little better.</p>
<p>Ready to try it? The <a href="${P}">15 oz jar</a> is about six weeks of mornings. The <a href="/ritual/">ritual page</a> has the short version, and a few other ways to use it once the habit sticks.</p>`,
  }),
  A({
    slug: "how-to-store-honey-and-why-it-crystallizes", tag: "Care", date: "2026-07-29", readTime: 4, art: "open",
    title: "How to Store Honey (and Why It Crystallizes)",
    description: "Raw honey crystallizes — that’s normal and a sign it’s real. How to store Honey with Fresh Ginger, whether to refrigerate it, and how to bring it back to pourable.",
    excerpt: "If your jar has gone cloudy or grainy, nothing is wrong. Here’s what’s happening and what to do about it.",
    related: ["caring-for-and-reusing-the-jar", "the-morning-ritual-honey-ginger-warm-water", "beyond-the-spoon-dressings-glazes-oats"],
    faq: [["Does honey with ginger need to be refrigerated?", "No. Keep it at room temperature with the lid closed. Refrigeration speeds up crystallization and makes it harder to scoop."], ["My honey turned cloudy and thick. Is it spoiled?", "No — that’s crystallization, which raw honey does naturally. Set the closed jar in a bowl of warm (not hot) water for 20–30 minutes and stir."], ["How long does the jar last once opened?", "Honey is naturally shelf-stable. We recommend enjoying the jar within 12 months of opening for the freshest ginger flavour; see the date on the base."]],
    body: `
<p>Every few weeks someone writes to us worried that their jar has “gone off.” It’s turned pale, or thick, or grainy at the bottom. We understand the worry — and it’s almost always the best possible news: your honey is behaving exactly like real raw honey.</p>
<h2>Why raw honey crystallizes</h2>
<p>Honey is a supersaturated solution of two sugars — glucose and fructose — with barely any water. Glucose doesn’t love staying dissolved. Given time and a cool room, it forms crystals and the honey stiffens. Heavily processed supermarket honey is heated and ultra-filtered to delay this; ours isn’t, so ours does. Crystallized honey is still perfectly good honey. Many people prefer the spreadable texture.</p>
<h2>How to bring it back</h2>
<ol>
<li>Keep the lid on. Set the jar in a bowl of warm tap water — warm enough to hold your hand in comfortably, no hotter.</li>
<li>Leave it 20–30 minutes. Stir with a clean spoon or <a href="/shop/beechwood-honey-dipper/">wooden dipper</a> to move the crystals around.</li>
<li>Repeat with fresh warm water if needed. Avoid the microwave — it heats unevenly and can scorch the ginger.</li>
</ol>
<h2>Where to keep the jar</h2>
<p>Room temperature, out of direct sun, lid closed. The kitchen counter is fine; that’s where ours lives, because a jar you can see is a jar you use. Don’t refrigerate — cold speeds crystallization and turns the honey into something you have to chisel.</p>
<h2>About the ginger</h2>
<p>Fresh ginger root carries a little moisture and a lot of flavour. In the jar it’s suspended in honey, which is naturally inhospitable to spoilage, so the combination keeps well. You’ll notice the ginger flavour is boldest in the first few months and mellows gently after that. The best-by date on the base of each jar is the honest window for peak flavour.</p>
<h2>Use a dry spoon</h2>
<p>The single most useful habit: never dip a wet spoon in the jar. Water is the one thing that can upset honey’s stability. A dry teaspoon or the dipper, every time, and the jar will outlast your patience for it.</p>
<p>More on keeping the jar itself in good shape — and what to do with it when it’s empty — in <a href="/journal/caring-for-and-reusing-the-jar/">Jar Care</a>.</p>`,
  }),
  A({
    slug: "counter-styling-making-room-for-a-ritual", tag: "Home", date: "2026-07-10", readTime: 3, art: "front", photo: "jars",
    title: "Counter Styling: Making Room for a Ritual",
    description: "How to style a kitchen counter or tea table around a single jar — wood, linen, ceramic and morning light — so the daily ritual is the easiest thing in the room.",
    excerpt: "A ritual needs a place. Ours is a square foot of counter next to the kettle, arranged so the spoon is always within reach.",
    related: ["the-morning-ritual-honey-ginger-warm-water", "caring-for-and-reusing-the-jar", "how-to-give-a-jar"],
    body: `
<p>You don’t need a tea table. You need a spot. The trick is to make the spot so pleasant that you go to it without deciding to.</p>
<h2>Start with the jar</h2>
<p>The <a href="${P}">15 oz jar</a> was chosen partly for how it sits — squat, wide-mouthed, a pale wooden lid that takes the light. Put it where you stand in the morning: beside the kettle, near the mugs, at the end of the counter that catches the window. Not in a cupboard.</p>
<h2>Add three textures</h2>
<ul>
<li><strong>Wood</strong> — a small board or tray gives the jar a place to belong and catches drips. Our <a href="/shop/beechwood-honey-dipper/">beechwood dipper</a> can rest on it.</li>
<li><strong>Linen</strong> — a folded cloth softens the scene and dries the spoon. Unbleached, so honey drips don’t show.</li>
<li><strong>Ceramic</strong> — one mug you love. The one with the chipped rim you refuse to throw out is perfect.</li>
</ul>
<h2>Leave room for the hand</h2>
<p>The mistake is over-styling. Leave open counter so the jar can be lifted, the lid set down, the spoon stirred. A ritual corner that has to be rearranged to use is a display, not a ritual.</p>
<h2>Light does the rest</h2>
<p>Dark amber honey in glass is at its best with morning light behind it — you can see the ginger threads hanging in the jar like something in a river. If you have a window, the jar goes in front of it. If not, a warm bulb in a low lamp beats an overhead.</p>
<p>When the jar empties, it stays: a tiny vase, a spoon holder, a place for the next jar. More on that in <a href="/journal/caring-for-and-reusing-the-jar/">Jar Care</a>.</p>`,
  }),
  A({
    slug: "honey-ginger-in-tea-instead-of-sugar", tag: "Tea", date: "2026-06-22", readTime: 4, art: "cup", photo: "ritual",
    title: "Tea Time: Trading the Sugar Bowl for the Jar",
    description: "Using honey with fresh ginger in place of sugar in tea — which teas it suits, how much to use, and why it changes the cup more than sweetness alone.",
    excerpt: "Sugar sweetens. Honey-ginger sweetens and then does something else — a low warmth that turns a plain black tea into an occasion.",
    related: ["the-morning-ritual-honey-ginger-warm-water", "a-jar-for-the-cold-months", "beyond-the-spoon-dressings-glazes-oats"],
    faq: [["Which teas go best with honey-ginger?", "Black teas (English breakfast, Assam, chai) and rooibos take it best. It also lifts green tea if you use a light hand — half a teaspoon."], ["Will honey-ginger make my tea spicy?", "Gently. The ginger reads as warmth rather than heat, especially once it’s dispersed through a full cup."]],
    body: `
<p>A sugar bowl does one thing. A jar of honey-ginger does two: it sweetens, and then a moment later it warms. That second note is what makes an ordinary bag of black tea feel like it was made on purpose.</p>
<h2>How much</h2>
<p>Replace sugar one-for-one to start — one teaspoon of <a href="${P}">Honey with Fresh Ginger</a> for one teaspoon of sugar — then taste. Honey is slightly sweeter than sugar by volume and the ginger adds presence, so most people end up using a little less than they did.</p>
<h2>Which teas</h2>
<table><thead><tr><th>Tea</th><th>Honey-ginger</th><th>Notes</th></tr></thead><tbody>
<tr><td>English breakfast, Assam</td><td>1 tsp</td><td>The classic pairing. Malty tea, warm honey, ginger underneath.</td></tr>
<tr><td>Masala chai</td><td>1–2 tsp</td><td>Doubles down on the spice. Add a splash of milk.</td></tr>
<tr><td>Rooibos (caffeine-free)</td><td>1 tsp</td><td>Evening cup. The red-honey sweetness of rooibos and the jar are natural friends.</td></tr>
<tr><td>Green tea</td><td>½ tsp</td><td>Light hand. Adds warmth without covering the grassiness.</td></tr>
<tr><td>Chamomile / mint</td><td>½–1 tsp</td><td>Turns an herbal tea into something that feels like care.</td></tr>
</tbody></table>
<h2>Stir late</h2>
<p>Add the honey-ginger after the tea has steeped and the cup has cooled for a minute. Very hot water mutes fresh ginger; slightly cooler water keeps it bright. Stir until the spoon comes up clean.</p>
<h2>Iced</h2>
<p>In summer, brew strong, stir in the honey-ginger while the tea is still warm so it dissolves, then pour over ice with a squeeze of lemon. It’s what we drink at the kitchen table in July.</p>
<p>The <a href="/ritual/">ritual page</a> has the other ways we use the jar — including one that involves oatmeal.</p>`,
  }),
  A({
    slug: "how-to-give-a-jar", tag: "Gifting", date: "2026-05-30", readTime: 4, art: "hero",
    title: "How to Give a Jar",
    description: "Gifting honey with fresh ginger — who it suits, how to wrap it, what to write on the card, and why a consumable gift lands better than one more object.",
    excerpt: "The best gifts get used up. A jar of honey-ginger is finished in six weeks and remembered for longer than that.",
    related: ["counter-styling-making-room-for-a-ritual", "a-jar-for-the-cold-months", "the-morning-ritual-honey-ginger-warm-water"],
    body: `
<p>We have a theory about gifts: the ones people love most are the ones they can finish. No shelf to find, no drawer to fill, nothing to feel guilty about later. Just a jar that’s a small pleasure every morning for six weeks and then, gracefully, gone.</p>
<h2>Who it’s for</h2>
<ul>
<li><strong>The person who has everything</strong> — because they don’t have this, and it disappears.</li>
<li><strong>The tea drinker</strong> — see <a href="/journal/honey-ginger-in-tea-instead-of-sugar/">Tea Time</a>. It changes the cup they already love.</li>
<li><strong>The new parent, the new homeowner, the neighbour</strong> — a jar is the right size of thoughtful. Not too much, never too little.</li>
<li><strong>Someone having a hard month</strong> — a warm cup in the morning is a kind thing to hand a person.</li>
</ul>
<h2>Three ways to give it</h2>
<p><strong>The plain jar.</strong> The <a href="${P}">15 oz jar</a> on its own, with a ribbon around the wooden lid, is already a gift. The label does the talking.</p>
<p><strong>The Gift Box.</strong> Our <a href="/shop/honey-with-fresh-ginger-gift-box/">Gift Box</a> pairs the jar with a beechwood dipper and an unbleached linen wrap, and we hand-write your note on the card. Tell us what to say at checkout.</p>
<p><strong>The set.</strong> For the person who’ll want a second jar the moment the first is empty — the <a href="/shop/honey-with-fresh-ginger-two-jar-set/">Two-Jar Set</a> ships free.</p>
<h2>What to write</h2>
<p>Keep it short and give them one instruction. Our favourite: <em>“One spoon, warm water, before the phone. Thinking of you.”</em> A gift with a tiny ritual attached is more likely to be used than admired.</p>
<h2>Shipping straight to them</h2>
<p>Enter their address at checkout and add a gift note; we never include prices in the box. Orders over $45 ship free, and most US addresses see the jar in 2–5 business days. Details on the <a href="/shipping/">shipping page</a>, and more ideas in the <a href="/gift-guide/">gift guide</a>.</p>`,
  }),
  A({
    slug: "a-jar-for-the-cold-months", tag: "Seasonal", date: "2026-04-14", readTime: 3, art: "cup", photo: "garden",
    title: "A Jar for the Cold Months",
    description: "Why honey with fresh ginger belongs on the counter from October to March — warm drinks, evening rituals, and a few things to make when the weather turns.",
    excerpt: "There’s a week each autumn when the kitchen gets dark by five and the jar moves from the shelf to the counter and stays there until spring.",
    related: ["the-morning-ritual-honey-ginger-warm-water", "honey-ginger-in-tea-instead-of-sugar", "beyond-the-spoon-dressings-glazes-oats"],
    body: `
<p>Honey and ginger have been paired in cold-weather kitchens for centuries, in more cultures than we could list — not because anyone told people to, but because a warm, sweet, gently spicy cup is exactly what a dark evening asks for.</p>
<h2>Morning</h2>
<p>The <a href="/journal/the-morning-ritual-honey-ginger-warm-water/">warm-water ritual</a> is the same as always, but in winter we make it bigger — a full mug, a wedge of lemon, and a minute standing by the window before the day starts.</p>
<h2>Afternoon</h2>
<p>A spoon in strong black tea with milk. Stirred into hot apple cider, it’s better than anything from a packet. If there’s a child in the house, a half-teaspoon in warm milk is the drink they’ll ask for by name.</p>
<h2>Evening</h2>
<p>Our mother’s evening cup was warm water, honey-ginger, and nothing else — a caffeine-free way to close the day. Rooibos or chamomile with a teaspoon stirred in works the same way and tastes like a blanket.</p>
<h2>From the stove</h2>
<ul>
<li>Whisk into a glaze for roasted carrots or squash in the last ten minutes.</li>
<li>Stir into hot oatmeal with a pinch of salt and toasted walnuts.</li>
<li>Drizzle over warm cornbread or a slice of buttered toast.</li>
</ul>
<p>More of these in <a href="/journal/beyond-the-spoon-dressings-glazes-oats/">Beyond the Spoon</a>. And if the jar empties faster in winter — it does in our house — the <a href="/shop/honey-with-fresh-ginger-two-jar-set/">Two-Jar Set</a> exists for exactly this season.</p>`,
  }),
  A({
    slug: "caring-for-and-reusing-the-jar", tag: "Care", date: "2026-03-20", readTime: 3, art: "open",
    title: "Jar Care: Cleaning, Reusing, Refilling",
    description: "How to clean the glass jar and wooden lid, keep the label looking good, and give the empty jar a second life in the kitchen or on the desk.",
    excerpt: "The jar is glass, the lid is wood, and both were chosen to outlast the honey inside them.",
    related: ["how-to-store-honey-and-why-it-crystallizes", "counter-styling-making-room-for-a-ritual", "the-morning-ritual-honey-ginger-warm-water"],
    body: `
<p>We chose a real glass jar and a real wooden lid because they’re pleasant to hold every morning and because they don’t have to be thrown away. A little care keeps both looking right for years.</p>
<h2>While the jar is in use</h2>
<ul>
<li>Wipe the rim with a dry cloth after scooping so the lid doesn’t stick.</li>
<li>Keep the outside of the jar dry; the paper label prefers it.</li>
<li>Use a dry spoon or the <a href="/shop/beechwood-honey-dipper/">dipper</a> — never a wet one. See <a href="/journal/how-to-store-honey-and-why-it-crystallizes/">why</a>.</li>
</ul>
<h2>The wooden lid</h2>
<p>Wood and dishwashers don’t get along. Wipe the lid with a damp cloth and let it dry upright. If the finish looks dull after a year, a drop of food-safe mineral oil rubbed in with a cloth brings it back. Never soak it.</p>
<h2>Cleaning the empty jar</h2>
<p>Fill with warm water, leave for ten minutes so the last honey dissolves, then wash normally. The glass is dishwasher-safe; the lid isn’t. To remove the label, soak the jar in warm soapy water for half an hour and peel; a little oil takes off any residue. Or leave the label on — plenty of people do.</p>
<h2>Second lives</h2>
<ul>
<li><strong>Spoon jar</strong> next to the stove — it’s the right height for wooden spoons.</li>
<li><strong>Overnight oats</strong> — the wide mouth is made for it.</li>
<li><strong>Desk jar</strong> for pens, or a small vase for whatever’s growing outside.</li>
<li><strong>Pantry</strong> — dried ginger slices, tea, a spice you buy in bulk.</li>
</ul>
<p>And when the ritual calls for a refill, the <a href="${P}">jar</a> is here, along with the <a href="/sustainability/">reasons we package it the way we do</a>.</p>`,
  }),
  A({
    slug: "beyond-the-spoon-dressings-glazes-oats", tag: "Kitchen", date: "2026-03-02", readTime: 5, art: "front",
    title: "Beyond the Spoon: Dressings, Glazes, Oats",
    description: "Six simple ways to cook with honey and fresh ginger — a vinaigrette, a salmon glaze, breakfast oats, a smoothie, a marinade and a warm drink — using one jar.",
    excerpt: "The spoon is where most people start. The kitchen is where the jar earns its place on the counter.",
    related: ["a-jar-for-the-cold-months", "honey-ginger-in-tea-instead-of-sugar", "how-to-store-honey-and-why-it-crystallizes"],
    body: `
<p>Because it’s only honey and fresh ginger, the jar behaves in a recipe exactly like honey with a little warmth built in. Anywhere you’d reach for honey, reach for this instead. A few we make on repeat:</p>
<h2>1. Honey-ginger vinaigrette</h2>
<p>Whisk <strong>1 tbsp</strong> <a href="${P}">honey-ginger</a>, <strong>2 tbsp</strong> rice vinegar or lemon juice, <strong>1 tsp</strong> soy sauce and <strong>4 tbsp</strong> olive oil. Salt to taste. Good on anything with cabbage, cucumber or avocado. Keeps a week in the fridge.</p>
<h2>2. Ten-minute salmon glaze</h2>
<p>Mix <strong>1 tbsp</strong> honey-ginger with <strong>1 tbsp</strong> soy sauce and a squeeze of lime. Brush over salmon (or tofu, or chicken thighs) for the last 5 minutes under the broiler. It caramelises fast — watch it.</p>
<h2>3. Breakfast oats</h2>
<p>Stir a teaspoon into hot oatmeal with a pinch of salt. Or make overnight oats in the empty jar — see <a href="/journal/caring-for-and-reusing-the-jar/">Jar Care</a> — with a teaspoon swirled through before the fridge. Add pear or banana in the morning.</p>
<h2>4. The smoothie</h2>
<p>Banana, a handful of spinach, oat milk, a spoon of honey-ginger, ice. The ginger reads as fresh rather than sweet, which is the point.</p>
<h2>5. Marinade for a weeknight</h2>
<p><strong>2 tbsp</strong> honey-ginger, <strong>2 tbsp</strong> soy, <strong>1 tbsp</strong> sesame oil, a crushed garlic clove. Toss with sliced chicken or mushrooms and let it sit twenty minutes while the rice cooks.</p>
<h2>6. Warm lemon</h2>
<p>Not cooking, but the most-made thing on this list: juice of half a lemon, a teaspoon of honey-ginger, warm water. This is the <a href="/journal/the-morning-ritual-honey-ginger-warm-water/">morning ritual</a> with a twist of citrus, and the reason a lemon lives next to the jar on our counter.</p>
<h2>A note on heat</h2>
<p>Raw honey’s delicate notes fade with high heat, so for glazes and marinades add it late. For dressings and drinks, no heat at all — which is where the fresh ginger shows off most.</p>
<p>If you make something we should know about, <a href="/contact/">tell us</a>. The best ideas in the kitchen came from people who wrote in.</p>`,
  }),
];
export const bySlug = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));
