#!/usr/bin/env python3
"""Generate favicons from the user's profile photo (square crop, rounded)."""
from PIL import Image, ImageDraw
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "profile" / "derived" / "profile-card.jpg"
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)

base = Image.open(SRC).convert("RGB")
w, h = base.size
side = min(w, h)
# center square crop
left = (w - side) // 2
top = (h - side) // 2
sq = base.crop((left, top, left + side, top + side))

def rounded(size, radius_ratio=0.0):
    im = sq.resize((size, size), Image.LANCZOS).convert("RGBA")
    if radius_ratio > 0:
        mask = Image.new("L", (size, size), 0)
        d = ImageDraw.Draw(mask)
        r = int(size * radius_ratio)
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
        im.putalpha(mask)
    return im

# Small favicons: slight rounding so it reads as an avatar chip
for s in (16, 32, 48, 192, 512):
    rounded(s, radius_ratio=0.20 if s <= 48 else 0.16).save(OUT / f"icon-{s}.png")
print("wrote PNG icons from photo")

# apple-touch: solid square (iOS rounds it itself), no transparency
at = sq.resize((180, 180), Image.LANCZOS).convert("RGB")
at.save(OUT / "apple-touch-icon.png")
print("wrote apple-touch-icon")

# favicon.ico multi-size (square, no alpha for max compatibility)
ico = sq.resize((48, 48), Image.LANCZOS).convert("RGB")
ico.save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")

# remove the old vector S favicon.svg so the photo is used everywhere
svg = ROOT / "favicon.svg"
if svg.exists():
    svg.unlink()
    print("removed old favicon.svg")
print("DONE")
