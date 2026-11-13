"""Builds the starter Neukölln street (public/assets/tilemaps/street.json) from the tile kit.

It is only a starting point: open art/tilesets/neukoelln_street.png in the Sprite Fusion tilemap editor,
build your own street with the layer names below, export, and run import_map.py to replace it.

Layers, bottom to top:  far (scrolls at half speed) | buildings | details | ground (collider) | props |
                        markers (hidden, spawns things) | front (drawn over the player, e.g. tree crowns)
Marker tiles (see the 'markers' section of the tileset): P player start, D door into the Späti,
R door into the record shop, U U-Bahn entrance, S/W/C smoker/weirdo/cop, F fire bin, K cat. An entity stands on the bottom of its marker tile.
"""
import random

from tilemaplib import Level

W, H = 110, 15
GROUND = 13          # the row the player walks on top of
PAL = 'abcde'


def build():
    L = Level('neukoelln_street', W, H)
    rng = random.Random(1)
    for name, collider in (('far', False), ('buildings', False), ('details', False), ('ground', True),
                           ('props', False), ('markers', False), ('front', False)):
        L.layer(name, collider)

    # ---------------------------------------------------------------- ground
    for x in range(W):
        L.set('ground', x, GROUND, L.catalog['blocks']['pave_top_' + 'abc'[(x * 7 + x // 3) % 3]]['id'])
        L.set('ground', x, GROUND + 1, L.catalog['blocks']['curb_' + 'ab'[x % 2]]['id'])
    for x in range(56, 60):
        L.put('ground', 'crosswalk_top', x, GROUND)
        L.put('ground', 'asphalt_fill', x, GROUND + 1)
    L.put('ground', 'manhole_top', 25, GROUND)
    L.put('ground', 'grate_top', 41, GROUND)
    L.put('ground', 'bikelane_top', 72, GROUND)
    for x in (13, 33, 62, 83):
        L.put('props', 'puddle', x, GROUND - 1)
    for x in (6, 22, 44, 66, 91):
        L.put('props', 'litter_a' if x % 2 else 'litter_b', x, GROUND - 1)
    L.put('props', 'leaves', 49, GROUND - 1)

    def window_style():
        return rng.choice(['dark', 'dark', 'dark', 'lit', 'lit', 'curtain', 'curtain', 'shutter', 'plants', 'tv'])

    def plaster(x0, w, top, pal, plinth_rows=(9, 12)):
        """Wall from `top` to the street, with a band above the ground floor and a plinth at the bottom."""
        for y in range(top, GROUND):
            for x in range(x0, x0 + w):
                kind = 'dirty' if rng.random() < 0.18 else 'damaged' if rng.random() < 0.04 else 'plain'
                L.put('buildings', 'wall_%s_%s' % (kind, pal), x, y)
            if y == 8:
                for x in range(x0, x0 + w):
                    L.put('buildings', 'wall_band_' + pal, x, y)
            if y == 12:
                for x in range(x0, x0 + w):
                    L.put('buildings', 'wall_plinth_' + pal, x, y)

    def upper(x0, w, floors, pal, balcony=True, windows=(1, 4, 7)):
        tops = (4, 0)[:floors]
        for i, r in enumerate(tops):
            for wx in windows:
                if wx + 1 < w:
                    L.put('buildings', 'window_' + window_style(), x0 + wx, r + 1)
            if balcony and i == 0:
                L.put('details', 'balcony_' + rng.choice(['plain', 'plants', 'dish', 'laundry']), x0 + 3, r + 2)

    def roofline(x0, w, pal):
        for x in range(x0, x0 + w):
            L.put('buildings', 'cornice_' + pal, x, 2)
            L.put('buildings', 'roof_slate', x, 1)
            L.put('buildings', 'roof_slate', x, 0)
        L.put('buildings', 'chimney', x0 + 2, -1)
        L.put('details', 'aerial', x0 + w - 3, 0)

    def shop_building(x0, shop, pal, floors=2, door_marker=None, w=10):
        plaster(x0, w, 4 if floors == 1 else 0, pal)
        L.put('buildings', shop, x0 + 2, 9)
        for x in (x0, x0 + 1, x0 + w - 2, x0 + w - 1):
            L.put('buildings', 'wall_plain_' + pal, x, 9)
        if floors == 1:
            roofline(x0, w, pal)
        upper(x0, w, floors, pal, balcony=floors > 1)
        if door_marker:
            L.put('markers', door_marker, x0 + 2 + 4, 12)

    def apartment_building(x0, door, pal, w=10):
        plaster(x0, w, 0, pal)
        L.put('buildings', door, x0 + 3, 9)
        L.put('buildings', 'window_dark', x0, 9)
        L.put('buildings', 'window_lit', x0 + 7, 9)
        upper(x0, w, 2, pal)

    def passage_building(x0, pal, w=8):
        plaster(x0, w, 0, pal)
        L.put('buildings', 'passage', x0 + 2, 9)
        upper(x0, w, 2, pal, balcony=False, windows=(1, 5))

    # ----------------------------------------------------------- buildings
    shop_building(0, 'shop_kneipe', 'a')
    shop_building(10, 'shop_spati', 'd', door_marker='marker_door')
    apartment_building(20, 'door_apt_brown', 'c')
    passage_building(30, 'e')
    shop_building(38, 'shop_doener', 'b')
    shop_building(60, 'shop_kiosk', 'c', floors=1)
    apartment_building(70, 'door_apt_green', 'a')
    shop_building(80, 'shop_friseur', 'e')
    shop_building(90, 'shop_closed', 'b')
    shop_building(100, 'shop_dj', 'c', door_marker='marker_djdoor')

    # ---------------------------------------------------------- graffiti etc
    L.put('details', 'tag_rave', 8, 10)
    L.put('details', 'mural_a', 30, 6)
    L.put('details', 'tag_toy', 36, 11)
    L.put('details', 'tag_kotti', 90, 7)
    L.put('details', 'poster_gig', 19, 9)
    L.put('details', 'poster_party', 29, 9)
    L.put('details', 'poster_dub', 47, 9)
    L.put('details', 'stickers', 69, 10)
    L.put('details', 'tag_star', 37, 9)
    L.put('details', 'tag_eye', 79, 10)
    L.put('details', 'sat_dish', 24, 3)
    L.put('details', 'sign_weser', 19, 7)

    # -------------------------------------------------- street furniture
    for x in (8, 28, 46, 66, 86, 101):
        L.put('props', 'lamp', x, 9)
    for x in (19, 39, 69):
        L.put('props', 'bin_orange', x, 11)
    L.put('props', 'bikes', 26, 11)
    L.put('props', 'bike_rack', 44, 12)
    L.put('props', 'postbox', 36, 11)
    L.put('props', 'pot_plant', 17, 12)
    L.put('props', 'pot_plant', 75, 12)
    L.put('props', 'poller', 55, 12)
    L.put('props', 'poller', 60, 12)
    L.put('props', 'ampel_red', 55, 9)
    L.put('props', 'ampel_red', 59, 9)
    L.put('props', 'haltestelle', 78, 9)
    L.put('props', 'bench', 76, 12)
    # plaza
    L.put('props', 'tree_trunk', 48, 10)
    L.put('front', 'tree_crown', 46, 6)
    L.put('props', 'litfass', 50, 9)
    L.put('props', 'ubahn_entrance', 52, 8)
    L.put('props', 'tree_trunk', 99, 10)
    L.put('front', 'tree_crown', 97, 6)

    # ---------------------------------------------------------------- far
    L.layers['far']['data'] = [-1] * (W * H)
    x = 0
    seq = ['skyline_b', 'skyline_a', 'skyline_c', 'skyline_b', 'skyline_a', 'skyline_c']
    i = 0
    while x < 66:
        name = seq[i % len(seq)]
        b = L.catalog['blocks'][name]
        L.put('far', name, x, 12 - b['h'])
        x += b['w']
        i += 1
    for x in range(0, 66):
        L.put('far', 'skyline_fill', x, 12)
        L.put('far', 'skyline_fill', x, 13)
        L.put('far', 'skyline_fill', x, 14)
    L.put('far', 'fernsehturm', 36, 4)
    L.put('far', 'moon', 16, 1)
    for i in range(30):
        L.put('far', rng.choice(['star_a', 'star_b']), rng.randint(0, 65), rng.randint(0, 5))
    L.put('far', 'moon', 16, 1)

    # -------------------------------------------------------------- markers
    L.put('markers', 'marker_start', 3, 12)
    L.put('markers', 'marker_smoker', 15, 12)
    L.put('markers', 'marker_ubahn', 53, 12)
    L.put('markers', 'marker_ubahn', 54, 12)
    L.put('markers', 'marker_weirdo', 45, 12)
    L.put('markers', 'marker_fire', 42, 12)
    L.put('markers', 'marker_cat', 57, 12)
    L.put('markers', 'marker_cop', 66, 12)
    return L


if __name__ == '__main__':
    level = build()
    level.write('street')
    print('street: %dx%d tiles' % (level.width, level.height), list(level.layers))
