DROP YOUR PRODUCT PHOTOS IN THIS FOLDER.

Currently here: hg-15-hero.jpg (+ -400/-800) — the 15 oz jar lying in sunlit grass,
cropped 4:5 from brand-source/photo-jar-in-grass-2026.jpg. Every other variant falls
back to it. Because /assets/ is cached immutably for a year, give a replacement a NEW
file name (and update the references) rather than overwriting this one.

Also here: hg-3-front.v2.jpg (+ -400/-800) — the Travel Pack listing, cut 4:5 from the
square studio shot on beige (brand-source/photo-travel-pack-3oz-2026.jpg).

The `.v2` is a cache-busting version, not a variant: /assets/ is served with a one-year
immutable cache, so a reshot photo needs a NEW file name or returning visitors keep the
old picture. art.mjs strips `.v<N>`, so hg-3-front.v2.jpg resolves exactly as
hg-3-front.jpg did. Reshoot again -> hg-3-front.v3.jpg, and nothing else changes.

The site picks them up automatically on the next build — no code changes.

FILENAMES
  hero.jpg    the big hero: jar on a wooden table with a cup, ginger, linen, morning light
  front.jpg   the jar alone, straight on
  open.jpg    lid off, dipper or honey visible
  cup.jpg     a cup of tea in front, jar softly behind

  Optional per-size versions (override the generic ones):
  hg-15-hero.jpg, hg-8-front.jpg, hg-duo-front.jpg, hg-gift-front.jpg,
  dipper-front.jpg, hg-3-front.jpg, hg-trio-front.jpg

  .jpg .jpeg .png .webp .avif all work. Anything missing falls back to
  another photo you did supply, and finally to the drawn scene.

SHOOTING NOTES
  - Portrait, roughly 4:5 (e.g. 1600 x 2000). The site crops to fill, centred.
  - Jar slightly off-axis, label facing camera, lid on (except open.jpg).
  - Window light from the side or behind; no direct flash.
  - Props behind and beside the jar, never covering the label.
  - Leave ~15% empty space around the jar so cropping never clips it.
  - Same table, same light, same white balance across all four.
