#!/usr/bin/env python3
"""Generate responsive sizes for every product photo.

Drop a full-size photo in assets/img/product/ and run:  python3 tools/make-images.py
It writes <name>-400.jpg and <name>-800.jpg beside it; the build emits them as srcset.
Requires Pillow (pip install pillow).
"""
import glob, os
from PIL import Image, ImageFilter

SRC = "assets/img/product"
WIDTHS = (400, 800)

for path in sorted(glob.glob(f"{SRC}/*.jpg")):
    stem = os.path.basename(path)[:-4]
    if stem.endswith(("-400", "-800")):
        continue
    im = Image.open(path).convert("RGB")
    for w in WIDTHS:
        if im.width <= w:
            continue
        h = round(im.height * w / im.width)
        out = f"{SRC}/{stem}-{w}.jpg"
        r = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.0, 90, 3))
        r.save(out, quality=82, optimize=True, progressive=True)
        print(f"  {os.path.basename(out):28} {w}px  {os.path.getsize(out)//1024} KB")
print("done")
