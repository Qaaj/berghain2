"""Builds the starter Friedrichshain street (public/assets/tilemaps/fhain.json) from the friedrichshain_street kit.

Kept deliberately basic: an Altbau and the U-Bahn stairs on the left, then the Berghain behind a gravel lot,
a queue barrier, bare trees and a fence running off to the right.

Layers and markers work like the Neukölln street (see build_street_map.py); P is where you come up from the
U-Bahn, U the stairs back down, B the Berghain door (you can't get in yet).
"""
import random

from tilemaplib import Level

W, H = 72, 15
GROUND = 13
BH = 30            # left edge of the Berghain block (22 tiles wide)


def build():
    L = Level('friedrichshain_street', W, H)
    rng = random.Random(5)
    for name, collider in (('far', False), ('buildings', False), ('details', False), ('ground', True),
                           ('props', False), ('markers', False), ('front', False)):
        L.layer(name, collider)

    # ground: pavement up to the lot, then cobbles in front of the club
    for x in range(W):
        top = 'cobble_top_' + 'ab'[x % 2] if BH - 2 <= x < BH + 26 else 'pave_top_' + 'abc'[(x * 7 + x // 3) % 3]
        L.put('ground', top, x, GROUND)
        L.put('ground', 'curb_' + 'ab'[x % 2], x, GROUND + 1)
    L.put('ground', 'manhole_top', 8, GROUND)
    for x in (5, 36, 49, 60):
        L.put('props', 'leaves', x, GROUND - 1)
    for x in (18, 44, 66):
        L.put('props', 'litter_' + 'ab'[x % 2], x, GROUND - 1)

    # an Altbau on the left
    for y in range(0, GROUND):
        for x in range(0, 10):
            kind = 'dirty' if rng.random() < 0.2 else 'plain'
            L.put('buildings', 'wall_%s_c' % kind, x, y)
        if y == 8:
            for x in range(10):
                L.put('buildings', 'wall_band_c', x, y)
        if y == 12:
            for x in range(10):
                L.put('buildings', 'wall_plinth_c', x, y)
    for r in (1, 5):
        for wx in (1, 4, 7):
            L.put('buildings', 'window_' + rng.choice(['dark', 'dark', 'lit', 'curtain']), wx, r)
    L.put('buildings', 'door_apt_green', 3, 9)
    L.put('buildings', 'window_dark', 0, 9)
    L.put('buildings', 'window_lit', 7, 9)
    L.put('details', 'tag_spiral', 6, 11) if 'tag_spiral' in L.catalog['blocks'] else None
    L.put('details', 'sign_karl', 1, 8)

    # U-Bahn stairs, lamps and a bench by the road
    L.put('props', 'ubahn_entrance', 12, 8)
    L.put('props', 'lamp', 10, 9)
    L.put('props', 'lamp', 24, 9)
    L.put('props', 'bin_orange', 17, 11)
    L.put('props', 'bench', 19, 12)
    L.put('props', 'litfass', 22, 9)

    # the Berghain, its queue and the fence
    L.put('buildings', 'berghain', BH, 0)
    L.put('props', 'barrier', BH + 6, 11)
    L.put('props', 'barrier', BH + 9, 11)
    L.put('props', 'lamp', BH + 18, 9)
    for x in range(BH + 22, W, 2):
        L.put('props', 'fence', x, 8)
    L.put('props', 'bikes', BH + 24, 11)
    L.put('front', 'tree_bare', 26, 6)
    L.put('front', 'tree_bare', BH + 3, 6)
    L.put('front', 'tree_bare', BH + 15, 6)
    L.put('front', 'tree_bare', BH + 28, 6)
    L.put('front', 'trash_bags', BH + 20, 12)

    # far: skyline, the Fernsehturm close by, moon and stars
    x, i = 0, 0
    seq = ['skyline_a', 'skyline_c', 'skyline_b']
    while x < W // 2 + 20:
        name = seq[i % len(seq)]
        b = L.catalog['blocks'][name]
        L.put('far', name, x, 12 - b['h'])
        x += b['w']
        i += 1
    for x in range(0, W // 2 + 20):
        for y in (12, 13, 14):
            L.put('far', 'skyline_fill', x, y)
    L.put('far', 'fernsehturm', 30, 4)
    for _ in range(26):
        L.put('far', rng.choice(['star_a', 'star_b']), rng.randint(0, W // 2 + 18), rng.randint(0, 5))
    L.put('far', 'moon', 44, 1)

    # markers
    L.put('markers', 'marker_start', 16, 12)
    L.put('markers', 'marker_ubahn', 13, 12)
    L.put('markers', 'marker_ubahn', 14, 12)
    for x in range(BH + 12, BH + 15):        # the steel door is at native x 200..236 in the block
        L.put('markers', 'marker_berghain', x, 12)
    L.put('markers', 'marker_smoker', BH + 8, 12)
    return L


if __name__ == '__main__':
    level = build()
    level.write('fhain')
    print('fhain: %dx%d tiles' % (level.width, level.height), list(level.layers))
