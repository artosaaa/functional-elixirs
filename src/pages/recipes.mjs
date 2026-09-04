/* Recipes — built from the brand's own "How to enjoy it" notes. Scoop. Stir. Sip. */
import { page, breadcrumbs, jsonld, esc, HERO_URL, BRAND, ICONS } from "../layout.mjs";
import { LINE, BEE } from "../site.mjs";

const RECIPES = [
  { id: "morning-ritual", icon: LINE.cup, when: "Morning", time: "2 minutes", title: "The Morning Ritual",
    lede: "The way our mother made it — a spoonful in warm water before anything else.",
    you: ["1 tsp Honey with Fresh Ginger", "1 mug warm water (not boiling)"],
    steps: ["Warm the water until it steams but doesn’t boil.", "Stir in a teaspoon until it melts through.", "Sip slowly. Let the day start from there."] },
  { id: "honey-ginger-lemon", icon: LINE.drop, when: "Any time", time: "3 minutes", title: "Honey, Ginger & Lemon",
    lede: "Sweet, warm and bright. The one people come back to.",
    you: ["1 tsp Honey with Fresh Ginger", "Juice of half a lemon", "1 mug warm water"],
    steps: ["Squeeze the lemon into the mug.", "Add the honey-ginger and pour over warm water.", "Stir until clear and golden."] },
  { id: "tea-time", icon: LINE.leaf, when: "Afternoon", time: "5 minutes", title: "Tea Time",
    lede: "Swap the sugar bowl for the jar. Works in black, green or herbal tea.",
    you: ["Your favourite tea", "1 tsp Honey with Fresh Ginger"],
    steps: ["Brew the tea as you normally would.", "Let it cool for a minute so the honey keeps its character.", "Stir in a teaspoon. Adjust to taste."] },
  { id: "breakfast-drizzle", icon: LINE.honeycomb, when: "Breakfast", time: "1 minute", title: "Breakfast Drizzle",
    lede: "Over oatmeal, yogurt, granola or hot buttered toast.",
    you: ["A bowl of oatmeal, yogurt or granola — or toast", "1–2 tsp Honey with Fresh Ginger"],
    steps: ["Warm the spoon under the tap for an easier pour.", "Drizzle in a slow spiral.", "Finish with a pinch of flaky salt if you like the contrast."] },
  { id: "morning-smoothie", icon: LINE.drop, when: "Breakfast", time: "5 minutes", title: "The Morning Smoothie",
    lede: "A spoonful does the work of a sweetener and a flavour at once.",
    you: ["1 banana", "1 cup milk or oat milk", "½ cup frozen mango or pineapple", "1 tbsp Honey with Fresh Ginger"],
    steps: ["Add everything to the blender.", "Blend until smooth.", "Taste — add another half teaspoon of honey-ginger if you want more warmth."] },
  { id: "honey-ginger-glaze", icon: LINE.jar, when: "Dinner", time: "10 minutes", title: "Honey-Ginger Glaze",
    lede: "For salmon, chicken, tofu or roasted carrots.",
    you: ["2 tbsp Honey with Fresh Ginger", "1 tbsp soy sauce", "1 tsp rice vinegar", "1 small clove garlic, grated"],
    steps: ["Whisk everything together in a small bowl.", "Brush over the protein or vegetables in the last 5 minutes of cooking.", "Spoon any extra over the plate before serving."] },
  { id: "salad-dressing", icon: LINE.leaf, when: "Lunch", time: "3 minutes", title: "Honey-Ginger Dressing",
    lede: "Bright enough for greens, warm enough for grain bowls.",
    you: ["1 tbsp Honey with Fresh Ginger", "2 tbsp olive oil", "1 tbsp lemon juice or apple cider vinegar", "Pinch of salt"],
    steps: ["Shake everything in a jar with a lid.", "Taste and balance — more lemon for sharpness, more honey for warmth.", "Keeps in the fridge for a week."] },
  { id: "evening-ritual", icon: BEE, when: "Evening", time: "3 minutes", title: "The Evening Ritual",
    lede: "Something warm and caffeine-free to close the day.",
    you: ["1 tsp Honey with Fresh Ginger", "1 mug warm milk, oat milk or chamomile tea"],
    steps: ["Warm the milk or brew the chamomile.", "Stir in the honey-ginger.", "Sip slowly, lights low."] },
  { id: "by-the-spoonful", icon: ICONS.spoon, when: "Any time", time: "10 seconds", title: "By the Spoonful",
    lede: "No recipe. Straight from the jar — sweet first, then the warmth.",
    you: ["A spoon", "The jar"],
    steps: ["Scoop.", "Enjoy."] },
];

const card = (r) => `<article class="recipe reveal" id="${r.id}">
  <div class="recipe__head"><span class="recipe__icon">${r.icon}</span><div><p class="recipe__meta">${esc(r.when)} · ${esc(r.time)}</p><h2>${esc(r.title)}</h2></div></div>
  <p class="recipe__lede">${esc(r.lede)}</p>
  <div class="recipe__body">
    <div><h3>You’ll need</h3><ul>${r.you.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h3>Method</h3><ol>${r.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
  </div>
</article>`;

function recipes() {
  const path = "/recipes/";
  const body = `${breadcrumbs([{ name: "Recipes", href: path }])}
<div class="wrap page-head page-head--center">
  <p class="mk-eyebrow">Recipes</p>
  <h1 class="mk-h1 mk-h1--page">Scoop. Stir. Sip.</h1>
  <span class="mk-rule mk-rule--center" aria-hidden="true"></span>
  <p class="lede measure mx-auto">One jar. Two simple ingredients. Endless ways to enjoy — straight from the spoon, stirred into something warm, or drizzled over what you already love.</p>
</div>
<div class="wrap"><div class="recipes">${RECIPES.map(card).join("")}</div></div>
<section class="stripes stripes--band"><div class="wrap"><div class="mk-band reveal">
  <span class="mk-band__bee" aria-hidden="true">${BEE}</span>
  <div class="mk-band__text"><h2 class="mk-h3">Every recipe starts with the jar</h2><p>Honey with Fresh Ginger, 15 oz — crafted from family tradition.</p></div>
  <a class="btn btn--gold" href="${HERO_URL}">Shop now</a>
</div></div></section>`;
  const ld = RECIPES.map((r) => ({
    "@context": "https://schema.org", "@type": "Recipe", name: r.title, description: r.lede,
    recipeIngredient: r.you, recipeInstructions: r.steps.map((t) => ({ "@type": "HowToStep", text: t })),
    author: { "@type": "Organization", name: BRAND.name }, keywords: "honey, ginger, honey ginger recipe",
  }));
  return { path, html: page({ title: "Recipes — Scoop, Stir, Sip | Honey with Fresh Ginger", description: "Simple ways to enjoy Functional Elixirs honey with fresh ginger: the morning ritual, honey-ginger lemon, tea time, breakfast drizzle, smoothies, glazes, dressings and the evening ritual.", path, body, breadcrumbs: [{ name: "Recipes", href: path }], jsonld: ld }) };
}

export default () => [recipes()];
