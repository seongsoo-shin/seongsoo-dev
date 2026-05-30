#!/usr/bin/env python3
"""Generate OG image + favicons for seongsoo.dev (dark + gold brand)."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "social"
OUT.mkdir(parents=True, exist_ok=True)

BG = (10, 10, 10)
INK = (237, 237, 237)
DIM = (176, 176, 176)
MUTE = (119, 119, 119)
GOLD = (184, 152, 86)
GOLD2 = (214, 182, 115)
GOOD = (74, 222, 128)

BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

def F(path, size):
    return ImageFont.truetype(path, size)

# ---------- OG image 1200x630 ----------
W, H = 1200, 630
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# subtle radial-ish glow (gold) using concentric translucent ellipses
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
cx, cy = int(W * 0.78), int(H * 0.30)
for i in range(60, 0, -1):
    r = i * 9
    a = int(2.0 * (i / 60))
    gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(184, 152, 86, a))
img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
d = ImageDraw.Draw(img)

PAD = 80
# top: green dot + brand
dot_y = PAD + 8
d.ellipse([PAD, dot_y, PAD + 18, dot_y + 18], fill=GOOD)
d.text((PAD + 34, PAD), "seongsoo.dev", font=F(MONO, 30), fill=DIM)

# headline
name_f = F(BOLD, 84)
d.text((PAD, 210), "Seongsoo Shin", font=name_f, fill=INK)

role_f = F(REG, 44)
d.text((PAD, 312), "Full-stack Software Engineer", font=role_f, fill=GOLD2)

# supporting line
sub_f = F(REG, 30)
d.text((PAD, 392), "A decade shipping product end to end.", font=sub_f, fill=DIM)

# chips
chip_f = F(REG, 26)
chips = ["ex-CTO", "Series A", "KR + JP", "React · Laravel · Node"]
x = PAD
cy2 = 470
for c in chips:
    bbox = d.textbbox((0, 0), c, font=chip_f)
    tw = bbox[2] - bbox[0]
    pad_x = 22
    box_w = tw + pad_x * 2
    d.rounded_rectangle([x, cy2, x + box_w, cy2 + 52], radius=10,
                        outline=(58, 58, 58), width=2, fill=(20, 20, 20))
    d.text((x + pad_x, cy2 + 11), c, font=chip_f, fill=DIM)
    x += box_w + 16

# bottom availability + gold rule
d.rectangle([PAD, 560, PAD + 110, 564], fill=GOLD)
avail_f = F(REG, 26)
d.text((PAD, 580), "Available from March 2027", font=avail_f, fill=MUTE)

og_path = OUT / "og.png"
img.save(og_path, "PNG")
print("wrote", og_path, img.size)

# NOTE: Favicons are generated from the user's profile photo by
# scripts/make_favicon_from_photo.py — do NOT regenerate them here, or you'll
# overwrite the photo icons with a placeholder mark. This script only builds og.png.
print("DONE (og only — run make_favicon_from_photo.py for favicons)")

print("DONE")
