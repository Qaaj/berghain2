"""Imports a map exported from the Sprite Fusion tilemap editor into the game.

    python3 art/scripts/import_map.py <street|ubahn> <map.zip | folder with map.json + spritesheet.png>

Works with the Phaser/TMX-style Tiled JSON export and with Sprite Fusion's own JSON export. Tiles are matched
to the master tileset (art/tilesets/*.png) by their pixels, so tile ids may differ in the export and it
still lands right. Layers keep their names and their `collider` flag.
"""
import json
import os
import sys
import tempfile
import zipfile

from PIL import Image

from tilemaplib import is_blank, load_kit, tile_images, tile_key, write_level

KIT_FOR = {'street': 'neukoelln_street', 'ubahn': 'ubahn_station'}
FLIP_MASK = 0x1FFFFFFF


def find(folder, name):
    for root, _, files in os.walk(folder):
        if name in files:
            return os.path.join(root, name)
    raise SystemExit('%s not found in %s' % (name, folder))


def collider_flag(layer):
    props = layer.get('properties')
    if isinstance(props, list):
        return any(p.get('name') == 'collider' and p.get('value') for p in props)
    if isinstance(props, dict):
        return bool(props.get('collider'))
    return bool(layer.get('collider'))


def read_export(map_json, sheet_img):
    """Returns (width, height, tile_size, [(name, collider, {(x, y): exported_id})])."""
    if 'tileSize' in map_json:                                   # Sprite Fusion JSON
        w, h, t = map_json['mapWidth'], map_json['mapHeight'], map_json['tileSize']
        layers = [(ly['name'], bool(ly.get('collider')), {(tl['x'], tl['y']): int(tl['id']) for tl in ly['tiles']})
                  for ly in map_json['layers']]
        return w, h, t, layers
    w, h, t = map_json['width'], map_json['height'], map_json['tilewidth']
    first = min(ts.get('firstgid', 1) for ts in map_json['tilesets'])
    layers = []
    for ly in map_json['layers']:
        if ly.get('type') != 'tilelayer':
            continue
        cells = {}
        for i, gid in enumerate(ly['data']):
            gid &= FLIP_MASK
            if gid:
                cells[(i % w, i // w)] = gid - first
        layers.append((ly['name'], collider_flag(ly), cells))
    return w, h, t, layers


def main(name, source):
    kit = KIT_FOR[name]
    master, catalog = load_kit(kit)
    mt = catalog['tile']
    by_key = {}
    for i, img in enumerate(tile_images(master, mt)):
        if not is_blank(img):
            by_key.setdefault(tile_key(img), i)

    tmp = None
    if source.endswith('.zip'):
        tmp = tempfile.mkdtemp()
        zipfile.ZipFile(source).extractall(tmp)
        source = tmp
    map_json = json.load(open(find(source, 'map.json')))
    sheet = Image.open(find(source, 'spritesheet.png')).convert('RGBA')
    width, height, t, layers = read_export(map_json, sheet)
    if t != mt:
        raise SystemExit('tile size in the export is %d, the kit uses %d' % (t, mt))
    exported = tile_images(sheet, t)

    remap, missing = {}, set()
    out_layers = []
    for lname, collider, cells in layers:
        data = [-1] * (width * height)
        for (x, y), eid in cells.items():
            if eid not in remap:
                img = exported[eid] if 0 <= eid < len(exported) else None
                remap[eid] = -1 if img is None or is_blank(img) else by_key.get(tile_key(img), None)
            cid = remap[eid]
            if cid is None:
                missing.add(eid)
                continue
            data[y * width + x] = cid
        out_layers.append({'name': lname, 'collider': collider, 'data': data})
    if missing:
        raise SystemExit('%d tile(s) in the export are not in the master tileset (ids %s). Did you edit the '
                         'tileset image? Re-import the original from art/tilesets/.' % (len(missing), sorted(missing)[:10]))
    path = write_level(name, kit, width, height, out_layers)
    print('imported %s: %dx%d tiles, layers: %s' % (path, width, height,
          ', '.join('%s%s' % (l['name'], '*' if l['collider'] else '') for l in out_layers)))


if __name__ == '__main__':
    if len(sys.argv) != 3 or sys.argv[1] not in KIT_FOR:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
