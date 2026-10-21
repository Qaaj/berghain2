"""Builds the starter U-Bahn station (public/assets/tilemaps/ubahn.json) from the station tile kit.

Layers, bottom to top:  wall | details | tracks | ground (collider) | props | markers (hidden) | front
Marker tiles: P player start, E stairs up to the street, T where the train's nose stops (the train drives in
on its own and stands with its bottom edge on this tile's bottom), V ticket machine, S/W passengers.
"""
from tilemaplib import Level

W, H = 80, 15
GROUND = 13


def build():
    L = Level('ubahn_station', W, H)
    for name, collider in (('wall', False), ('details', False), ('tracks', False), ('ground', True),
                           ('props', False), ('markers', False), ('front', False)):
        L.layer(name, collider)
    b = L.catalog['blocks']

    # back wall: ceiling, tiled wall with the U7 band, dark tiles at the foot
    for x in range(W):
        L.put('wall', 'ceiling', x, 0)
        L.put('wall', 'ceiling_lamp' if x % 6 == 2 else 'ceiling', x, 1)
        if x % 12:
            L.put('wall', 'beam', x, 2)
        for y in range(2 if x % 12 == 0 else 3, 11):
            if y == 4:
                L.put('wall', 'wall_band', x, y)
            else:
                kind = 'stained' if (x * 7 + y * 3) % 11 == 0 else 'cracked' if (x * 5 + y) % 29 == 0 else 'clean'
                L.put('wall', 'wall_' + kind, x, y)
        L.put('wall', 'wall_dado', x, 11)
    for x in range(W):                                           # track bed behind the platform, and the platform
        L.put('tracks', 'track_' + 'abc'[x % 3], x, 12)
        L.put('ground', 'floor_edge', x, GROUND)
        L.put('ground', 'floor_fill_' + 'ab'[x % 2], x, GROUND + 1)

    # pillars every 12 tiles, hanging lamps between them
    for x in range(8, W, 12):
        L.put('props', 'pillar_cap', x, 2)
        for y in range(3, 12):
            L.put('props', 'pillar_mid_b' if y == 7 else 'pillar_mid_a', x, y)
        L.put('props', 'pillar_base', x, 12)
        L.put('props', 'lamp_hang', x + 5, 2)

    # exit stairs and signs
    L.put('props', 'stairs_exit', 2, 8)
    L.put('props', 'sign_exit', 6, 7)
    L.put('props', 'station_sign_neukoelln', 14, 3)
    L.put('props', 'station_sign_neukoelln', 40, 3)
    L.put('props', 'station_sign_rudow', 66, 3)
    L.put('props', 'departure_board', 24, 3)
    L.put('props', 'departure_board', 58, 3)
    L.put('props', 'clock', 30, 3)
    L.put('props', 'sign_u7', 12, 6)
    L.put('props', 'sign_u7', 52, 6)

    # platform furniture
    L.put('props', 'ticket_machine', 18, 10)
    L.put('props', 'timetable', 15, 9)
    L.put('props', 'network_map', 21, 9)
    L.put('props', 'bench', 28, 12)
    L.put('props', 'vending_snack', 33, 11)
    L.put('props', 'vending_drink', 34, 11)
    L.put('props', 'bin', 36, 12)
    L.put('props', 'ad_film', 38, 9)
    L.put('props', 'bench', 46, 12)
    L.put('props', 'bin', 49, 12)
    L.put('props', 'ad_sale', 53, 9)
    L.put('props', 'bench', 62, 12)
    L.put('props', 'ad_bier', 68, 9)
    L.put('props', 'tag_kotti', 71, 10)
    L.put('props', 'tag_rave', 75, 7)
    L.put('props', 'tag_toy', 57, 10)

    # markers
    L.put('markers', 'marker_start', 6, 12)
    L.put('markers', 'marker_exit', 3, 12)
    L.put('markers', 'marker_exit', 4, 12)
    L.put('markers', 'marker_train', 24, 11)
    L.put('markers', 'marker_ticket', 18, 12)
    L.put('markers', 'marker_ticket', 19, 12)
    L.put('markers', 'marker_smoker', 30, 12)
    L.put('markers', 'marker_weirdo', 50, 12)
    return L


if __name__ == '__main__':
    level = build()
    level.write('ubahn')
    print('ubahn: %dx%d tiles' % (level.width, level.height), list(level.layers))
