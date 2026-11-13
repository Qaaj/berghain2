"""Generates public/assets/tilemaps/building.json: the compact Späti interior.

Everything is laid out in pixels (a 16x10 room of 48px tiles = 768x480, see interiorlib.py). Props are
placed by their foot position; collision rects come from each prop's footprint.
Run:  python3 art/scripts/build_spati_map.py
"""
from interiorlib import FLOOR_TOP, build

# (sprite, foot x, foot y, solid footprint height or 0, kind)
PROPS = [
    ('neon_open', 118, 54, 0, 'decor'),
    ('poster_beer', 345, 100, 0, 'decor'),
    ('poster_party', 395, 100, 0, 'decor'),
    ('poster_hours', 445, 96, 0, 'decor'),
    ('clock', 492, 62, 0, 'decor'),
    ('cig_wall', 606, 134, 0, 'decor'),
    ('fridge', 84, 170, 30, 'prop'),
    ('fridge', 152, 170, 30, 'prop'),
    ('freezer', 262, 184, 36, 'prop'),
    ('shopkeeper', 603, 212, 0, 'prop'),
    ('counter', 612, 238, 0, 'prop'),
    ('gondola', 410, 340, 30, 'prop'),
    ('magazine_rack', 684, 412, 30, 'prop'),
    ('pfand', 96, 330, 36, 'prop'),
    ('crates', 96, 424, 30, 'prop'),
    ('plant', 305, 428, 26, 'prop'),
    ('trash_bin', 470, 428, 24, 'prop'),
    ('cat', 220, 300, 12, 'prop'),
    ('doormat', 384, 430, 0, 'flat'),
]

TEXTURE = {'fridge': 'spati_fridge'}
PROP_DIR = {'fridge': 'building/inside/spati_fridge.png'}

EXTRA_SOLIDS = [
    ('counter', 516, FLOOR_TOP, 204, 238 - FLOOR_TOP),
]
INTERACTS = [
    ('exit', 336, 392, 96, 40),
    ('shopkeeper', 516, 240, 192, 56),
    ('pfand', 51, 334, 92, 50),
    ('cat', 170, 250, 130, 70),
    ('fridge', 51, 172, 134, 40),
    ('freezer', 202, 186, 120, 40),
    ('magazines', 640, 414, 80, 20),
]


PICKUPS = [
    ('cigarettes', 530, 272, 27, 39, 'pickup_cigarettes'),
]


if __name__ == '__main__':
    build('building', 'spati_tiles', 'spati', PROPS, EXTRA_SOLIDS, INTERACTS, PICKUPS,
          texture=TEXTURE, prop_dir=PROP_DIR)
