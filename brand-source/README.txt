Master artwork. Kept in the repo, deliberately NOT published.

These are 2000x2000 originals. Under assets/img they were served as part of the
website, so anyone could download the full-resolution brand marks — and they cost
1.8 MB on every deploy for files no page ever referenced.

build.mjs keeps this folder through its clean step; tools/pack.mjs leaves it out
of dist/. The web-sized logos the site actually uses live in assets/img.

photo-jar-in-grass-2026.jpg is the 1500x2000 product photograph as supplied — the
jar in the grass. The crops the site serves (assets/img/jar-in-grass*.jpg and
assets/img/product/hg-15-hero*.jpg) were cut from it; recrop from here, not from them.
