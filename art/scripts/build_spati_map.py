"""Generates public/assets/tilemaps/building.json: the compact Späti interior.

Everything is laid out in pixels (a 16x10 room of 48px tiles = 768x480). Props are
placed by their foot position; collision rects come from each prop's footprint.
Run:  python3 art/scripts/build_spati_map.py
"""
import json
import os
import struct

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ASSETS = os.path.join(ROOT, 'public', 'assets')
TILE, COLS, ROWS = 48, 16, 10
FLOOR_TOP, FLOOR_BOTTOM = 3 * TILE, 9 * TILE

# tile indexes inside spati_tiles.png (+1 for the Tiled gid)
FLOOR_A, FLOOR_B, WALL_TOP, WALL_MID, WAINSCOT, SIDE_L, SIDE_R, FRONT, SHADOW, DOOR_L, DOOR_R = range(11)


def png_size(path):
    with open(path, 'rb') as f:
        head = f.read(24)
    return struct.unpack('>II', head[16:24])


def tile_data():
    grid = [[0] * COLS for _ in range(ROWS)]
    for r in range(ROWS):
        grid[r][0], grid[r][COLS - 1] = SIDE_L, SIDE_R
        for col in range(1, COLS - 1):
            if r == 0:
                t = WALL_TOP
            elif r == 1:
                t = WALL_MID
            elif r == 2:
                t = WAINSCOT
            elif r == 3:
                t = SHADOW
            elif r < ROWS - 1:
                t = FLOOR_A if (r + col) % 2 == 0 else FLOOR_B
            else:
                t = DOOR_L if col == 7 else DOOR_R if col == 8 else FRONT
            grid[r][col] = t
    return [t + 1 for row in grid for t in row]


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


def sprite_size(name):
    rel = PROP_DIR.get(name, 'building/spati/%s.png' % name)
    return png_size(os.path.join(ASSETS, rel))


def obj(oid, name, x, y, w, h, **props):
    return {'id': oid, 'name': name, 'type': '', 'x': x, 'y': y, 'width': w, 'height': h,
            'rotation': 0, 'visible': True, 'properties': props}


def main():
    ids = iter(range(1, 1000))
    objects, solids = [], []
    for name, fx, fy, foot, kind in PROPS:
        w, h = sprite_size(name)
        objects.append(obj(next(ids), name, fx, fy, w, h, spriteName=TEXTURE.get(name, 'spati_' + name),
                           type=kind, depth=fy if kind == 'prop' else 0))
        if foot:
            solids.append((fx - w // 2 + 3, fy - foot, w - 6, foot))
    for name, x, y, w, h in EXTRA_SOLIDS:
        solids.append((x, y, w, h))
    # room shell: back wall band, side walls and front wall
    shell = [(0, 0, COLS * TILE, FLOOR_TOP), (0, 0, TILE, ROWS * TILE),
             ((COLS - 1) * TILE, 0, TILE, ROWS * TILE), (0, FLOOR_BOTTOM, COLS * TILE, TILE)]
    collisions = [obj(next(ids), 'wall', x, y, w, h, spriteName='collision', type='collision')
                  for x, y, w, h in shell + solids]

    interacts = [obj(next(ids), name, x, y, w, h, id=name, type='interact') for name, x, y, w, h in INTERACTS]
    pickups = [
        obj(next(ids), 'cigarettes', 530, 272, 27, 39, spriteName='pickup_cigarettes', type='pickup'),
        obj(next(ids), 'bottle', 172, 388, 21, 51, spriteName='pickup_bottle', type='pickup'),
    ]
    start = [obj(next(ids), 'playerStart', 336, 312, 16, 16, spriteName='player_start', type='playerStart')]

    layers = [
        {'id': 1, 'name': 'roomLayer', 'type': 'tilelayer', 'width': COLS, 'height': ROWS, 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'data': tile_data()},
        {'id': 2, 'name': 'objectsLayer', 'type': 'objectgroup', 'draworder': 'topdown', 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'objects': objects + pickups + start + interacts},
        {'id': 3, 'name': 'collisionsLayer', 'type': 'objectgroup', 'draworder': 'topdown', 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'objects': collisions},
    ]
    tw, th = png_size(os.path.join(ASSETS, 'building/spati/spati_tiles.png'))
    doc = {
        'version': 1, 'orientation': 'orthogonal', 'renderorder': 'right-down', 'width': COLS, 'height': ROWS,
        'tilewidth': TILE, 'tileheight': TILE, 'backgroundcolor': '#000000', 'properties': {},
        'nextobjectid': 1000, 'layers': layers,
        'tilesets': [{'firstgid': 1, 'name': 'spati_tiles', 'image': '../building/spati/spati_tiles.png',
                      'imagewidth': tw, 'imageheight': th, 'tilewidth': TILE, 'tileheight': TILE,
                      'margin': 0, 'spacing': 0, 'properties': {}}],
    }
    out = os.path.join(ASSETS, 'tilemaps', 'building.json')
    with open(out, 'w') as f:
        json.dump(doc, f)
    print('wrote', out, '-', len(objects), 'props,', len(collisions), 'collision rects')


if __name__ == '__main__':
    main()
