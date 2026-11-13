"""Generates public/assets/tilemaps/dj.json: the record shop on the far end of the street.

Same 16x10 room as the Späti (see interiorlib.py), laid out in pixels. The DJ plays behind a booth
against the back wall, flanked by PA speakers; record bins fill the floor, a listening station sits
on the right and a worn sofa in the corner by the door.
Run:  python3 art/scripts/build_dj_map.py
"""
from interiorlib import FLOOR_TOP, build

# (sprite, foot x, foot y, solid footprint height or 0, kind)
PROPS = [
    ('neon_records', 384, 60, 0, 'decor'),
    ('record_wall', 150, 136, 0, 'decor'),
    ('record_wall', 618, 136, 0, 'decor'),
    ('poster_techno', 258, 100, 0, 'decor'),
    ('disco_ball', 500, 52, 0, 'decor'),
    ('speaker', 250, 236, 30, 'prop'),
    ('speaker', 518, 236, 30, 'prop'),
    ('dj', 384, 188, 0, 'prop'),
    ('dj_booth', 384, 240, 0, 'prop'),
    ('record_bin', 200, 330, 26, 'prop'),
    ('record_bin', 568, 330, 26, 'prop'),
    ('listening_station', 690, 260, 24, 'prop'),
    ('sofa', 120, 430, 34, 'prop'),
    ('doormat_dj', 384, 430, 0, 'flat'),
]

# The booth is solid all the way back to the wall so nobody gets behind the decks
EXTRA_SOLIDS = [
    ('booth', 300, FLOOR_TOP, 168, 240 - FLOOR_TOP),
]
INTERACTS = [
    ('exit', 336, 392, 96, 40),
    ('dj', 300, 242, 168, 56),
    ('record_bin', 130, 334, 140, 50),
    ('record_bin', 498, 334, 140, 50),
    ('listening', 640, 264, 100, 50),
    ('speaker', 200, 240, 100, 40),
    ('speaker', 468, 240, 100, 40),
    ('sofa', 60, 380, 130, 50),
]


if __name__ == '__main__':
    build('dj', 'dj_tiles', 'dj', PROPS, EXTRA_SOLIDS, INTERACTS)
