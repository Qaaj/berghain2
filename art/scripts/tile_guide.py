"""Renders a labelled guide of a tileset: python3 tile_guide.py <name> [scale]  (name = neukoelln_street | ubahn_station)"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
name = sys.argv[1] if len(sys.argv) > 1 else 'neukoelln_street'
scale = int(sys.argv[2]) if len(sys.argv) > 2 else 3
d = os.path.join(ROOT, 'art', 'tilesets')
cat = json.load(open(os.path.join(d, name + '.json')))
sheet = Image.open(os.path.join(d, name + '.png')).convert('RGBA')
t = cat['tile']
bg = Image.new('RGBA', (sheet.width, sheet.height), (58, 46, 52, 255))
bg.alpha_composite(sheet)
big = bg.resize((sheet.width * scale, sheet.height * scale), Image.NEAREST)
dr = ImageDraw.Draw(big)
font = ImageFont.load_default()
for n, b in cat['blocks'].items():
    x0, y0 = b['x'] * t * scale, b['y'] * t * scale
    dr.rectangle([x0, y0, x0 + b['w'] * t * scale - 1, y0 + b['h'] * t * scale - 1], outline=(255, 255, 0, 255))
    label = n.replace('_', ' ')
    tw = dr.textlength(label, font=font)
    dr.rectangle([x0 + 1, y0 + 1, x0 + 3 + tw, y0 + 12], fill=(0, 0, 0, 200))
    dr.text((x0 + 2, y0 + 1), label, fill=(255, 255, 255, 255), font=font)
out = os.path.join(d, name + '_guide.png')
big.save(out)
print(out, big.size)
# slices for quick viewing
if len(sys.argv) > 3:
    rows = int(sys.argv[3])
    for i in range(0, sheet.height // t, rows):
        big.crop((0, i * t * scale, big.width, min(big.height, (i + rows) * t * scale))).save(os.path.join(d, '_slice_%02d.png' % (i // rows)))
