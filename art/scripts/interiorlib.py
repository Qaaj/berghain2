"""Shared builder for the top-down shop interiors (the Späti, the record shop).

A room is 16x10 tiles of 48px (768x480). Each interior has its own 11-tile set in the same order
(floor_a, floor_b, wall_top, wall_mid, wainscot, side_l, side_r, front, floor_shadow, door_l, door_r)
and its props in public/assets/building/<dir>/. Props are placed by their foot position; a prop with a
footprint height gets a collision rect that covers its feet, so the player can walk behind it.
"""
import json
import os
import struct

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ASSETS = os.path.join(ROOT, 'public', 'assets')
TILE, COLS, ROWS = 48, 16, 10
FLOOR_TOP, FLOOR_BOTTOM = 3 * TILE, 9 * TILE

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


def obj(oid, name, x, y, w, h, **props):
    return {'id': oid, 'name': name, 'type': '', 'x': x, 'y': y, 'width': w, 'height': h,
            'rotation': 0, 'visible': True, 'properties': props}


def build(out_name, tileset, asset_dir, props, extra_solids, interacts, pickups=(), start=(336, 312),
          texture=None, prop_dir=None, prefix=None):
    """props: (sprite, foot x, foot y, solid footprint height or 0, kind 'prop'|'decor'|'flat').
    pickups: (name, x, y, w, h, texture). Textures default to '<prefix>_<sprite>'."""
    texture, prop_dir, prefix = texture or {}, prop_dir or {}, prefix or asset_dir

    def sprite_size(name):
        rel = prop_dir.get(name, 'building/%s/%s.png' % (asset_dir, name))
        return png_size(os.path.join(ASSETS, rel))

    ids = iter(range(1, 1000))
    objects, solids = [], []
    for name, fx, fy, foot, kind in props:
        w, h = sprite_size(name)
        objects.append(obj(next(ids), name, fx, fy, w, h, spriteName=texture.get(name, '%s_%s' % (prefix, name)),
                           type=kind, depth=fy if kind == 'prop' else 0))
        if foot:
            solids.append((fx - w // 2 + 3, fy - foot, w - 6, foot))
    for name, x, y, w, h in extra_solids:
        solids.append((x, y, w, h))
    # room shell: back wall band, side walls and front wall
    shell = [(0, 0, COLS * TILE, FLOOR_TOP), (0, 0, TILE, ROWS * TILE),
             ((COLS - 1) * TILE, 0, TILE, ROWS * TILE), (0, FLOOR_BOTTOM, COLS * TILE, TILE)]
    collisions = [obj(next(ids), 'wall', x, y, w, h, spriteName='collision', type='collision')
                  for x, y, w, h in shell + solids]

    zones = [obj(next(ids), name, x, y, w, h, id=name, type='interact') for name, x, y, w, h in interacts]
    items = [obj(next(ids), name, x, y, w, h, spriteName=tex, type='pickup') for name, x, y, w, h, tex in pickups]
    player = [obj(next(ids), 'playerStart', start[0], start[1], 16, 16, spriteName='player_start', type='playerStart')]

    layers = [
        {'id': 1, 'name': 'roomLayer', 'type': 'tilelayer', 'width': COLS, 'height': ROWS, 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'data': tile_data()},
        {'id': 2, 'name': 'objectsLayer', 'type': 'objectgroup', 'draworder': 'topdown', 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'objects': objects + items + player + zones},
        {'id': 3, 'name': 'collisionsLayer', 'type': 'objectgroup', 'draworder': 'topdown', 'x': 0, 'y': 0,
         'opacity': 1, 'visible': True, 'objects': collisions},
    ]
    tw, th = png_size(os.path.join(ASSETS, 'building/%s/%s.png' % (asset_dir, tileset)))
    doc = {
        'version': 1, 'orientation': 'orthogonal', 'renderorder': 'right-down', 'width': COLS, 'height': ROWS,
        'tilewidth': TILE, 'tileheight': TILE, 'backgroundcolor': '#000000', 'properties': {},
        'nextobjectid': 1000, 'layers': layers,
        'tilesets': [{'firstgid': 1, 'name': tileset, 'image': '../building/%s/%s.png' % (asset_dir, tileset),
                      'imagewidth': tw, 'imageheight': th, 'tilewidth': TILE, 'tileheight': TILE,
                      'margin': 0, 'spacing': 0, 'properties': {}}],
    }
    out = os.path.join(ASSETS, 'tilemaps', out_name + '.json')
    with open(out, 'w') as f:
        json.dump(doc, f)
    print('wrote', out, '-', len(objects), 'props,', len(collisions), 'collision rects')
