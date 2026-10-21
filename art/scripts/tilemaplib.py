"""Level files for the game, from the tileset catalog or from a Sprite Fusion export.

The game loads 48px-tile Tiled JSON (art is drawn at 16px and scaled 3x, like all sprites). This module
writes that format from canonical layers, and `import_map.py` uses it to convert what the editor exports.
A layer is {'name', 'collider', 'data'} where data is width*height canonical tile ids (-1 = empty).
"""
import hashlib
import json
import os

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KITS = os.path.join(ROOT, 'art', 'tilesets')
OUT = os.path.join(ROOT, 'public', 'assets', 'tilemaps')
SCALE = 3


def kit_paths(kit):
    return os.path.join(KITS, kit + '.png'), os.path.join(KITS, kit + '.json')


def load_kit(kit):
    png, js = kit_paths(kit)
    return Image.open(png).convert('RGBA'), json.load(open(js))


def tile_images(sheet, tile):
    cols, rows = sheet.width // tile, sheet.height // tile
    return [sheet.crop((x * tile, y * tile, (x + 1) * tile, (y + 1) * tile)) for y in range(rows) for x in range(cols)]


def tile_key(img):
    return hashlib.md5(img.tobytes()).hexdigest()


def is_blank(img):
    return not any(p[3] for p in img.getdata())


def id_of(catalog, name, dx=0, dy=0):
    b = catalog['blocks'][name]
    return (b['y'] + dy) * catalog['cols'] + b['x'] + dx


class Level:
    """Canvas of layers addressed by tile coordinates, placed from catalog block names."""

    def __init__(self, kit, width, height):
        self.kit, self.width, self.height = kit, width, height
        _, self.catalog = load_kit(kit)
        self.layers = {}

    def layer(self, name, collider=False):
        if name not in self.layers:
            self.layers[name] = {'name': name, 'collider': collider, 'data': [-1] * (self.width * self.height)}
        return self.layers[name]

    def set(self, layer, x, y, tile):
        if 0 <= x < self.width and 0 <= y < self.height:
            self.layer(layer)['data'][y * self.width + x] = tile

    def put(self, layer, name, x, y):
        """Place a whole block (e.g. 'shop_spati') with its top-left tile at x, y."""
        b = self.catalog['blocks'][name]
        for dy in range(b['h']):
            for dx in range(b['w']):
                self.set(layer, x + dx, y + dy, id_of(self.catalog, name, dx, dy))

    def fill(self, layer, name, x, y, w, h, variants=None):
        for dy in range(h):
            for dx in range(w):
                n = variants[(x + dx + dy * 7) % len(variants)] if variants else name
                self.set(layer, x + dx, y + dy, id_of(self.catalog, n))

    def write(self, out_name):
        write_level(out_name, self.kit, self.width, self.height, list(self.layers.values()))


def prop_list(layer):
    return [{'name': 'collider', 'type': 'bool', 'value': bool(layer.get('collider'))}]


def write_level(out_name, kit, width, height, layers):
    sheet, catalog = load_kit(kit)
    tile = catalog['tile']
    os.makedirs(OUT, exist_ok=True)
    big = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    big.save(os.path.join(OUT, out_name + '_sheet.png'))
    with open(os.path.join(OUT, out_name + '_catalog.json'), 'w') as f:
        json.dump({'blocks': {n: {'id': b['id'], 'w': b['w'], 'h': b['h']} for n, b in catalog['blocks'].items()}}, f)
    out_layers = []
    for i, ly in enumerate(layers):
        out_layers.append({
            'id': i + 1, 'name': ly['name'], 'type': 'tilelayer', 'width': width, 'height': height,
            'x': 0, 'y': 0, 'opacity': 1, 'visible': True, 'properties': prop_list(ly),
            'data': [t + 1 if t >= 0 else 0 for t in ly['data']],
        })
    doc = {
        'version': '1.10', 'tiledversion': '1.10.2', 'type': 'map', 'orientation': 'orthogonal',
        'renderorder': 'right-down', 'infinite': False, 'width': width, 'height': height,
        'tilewidth': tile * SCALE, 'tileheight': tile * SCALE, 'nextlayerid': len(out_layers) + 1,
        'nextobjectid': 1, 'properties': [], 'layers': out_layers,
        'tilesets': [{'firstgid': 1, 'name': out_name, 'image': out_name + '_sheet.png',
                      'imagewidth': big.width, 'imageheight': big.height, 'tilewidth': tile * SCALE,
                      'tileheight': tile * SCALE, 'margin': 0, 'spacing': 0,
                      'columns': sheet.width // tile, 'tilecount': (sheet.width // tile) * (sheet.height // tile)}],
    }
    path = os.path.join(OUT, out_name + '.json')
    with open(path, 'w') as f:
        json.dump(doc, f)
    return path
