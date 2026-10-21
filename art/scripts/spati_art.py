"""Draws the Späti tileset and props through pixel-mcp.

Run:  python3 art/scripts/spati_art.py [name ...]
Each asset lands in art/<name>.aseprite and public/assets/building/spati/<name>.png (3x).
"""
import sys

from spriteart import FONT, P, Sprite, Studio, c, noise

FONT.update({
    '2': ['111', '001', '111', '100', '111'],
    '4': ['101', '101', '111', '001', '001'],
    'K': ['101', '101', '110', '101', '101'],
})


def shade(hexcol, f):
    h = c(hexcol).lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return '#%02x%02x%02x' % (min(255, int(r * f)), min(255, int(g * f)), min(255, int(b * f)))


def ell(s, cx, cy, rx, ry, col):
    for y in range(s.h):
        for x in range(s.w):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                s.set(x, y, col)


# ---------------------------------------------------------------- tileset
TILE_NAMES = ['floor_a', 'floor_b', 'wall_top', 'wall_mid', 'wainscot', 'side_l', 'side_r',
              'front', 'floor_shadow', 'door_l', 'door_r']


def floor_tile(s, ox, flip, rng, darken=None):
    for y in range(16):
        for x in range(16):
            q = ((x // 8) + (y // 8) + flip) % 2
            col = '#3a3737' if q == 0 else '#2f2c2c'
            if x % 8 == 7 or y % 8 == 7:
                col = '#201e1e'
            elif x % 8 == 0 or y % 8 == 0:
                col = '#413e3e' if q == 0 else '#363333'
            elif rng.random() < 0.05:
                col = '#454141'
            if darken and y < len(darken):
                col = shade(col, darken[y])
            s.set(ox + x, y, col)


def wall_pixels(s, ox, y0, y1, rng):
    for y in range(y0, y1):
        for x in range(16):
            col = '#433c32' if x % 4 == 0 else '#4a4338'
            if rng.random() < 0.04:
                col = '#3d372e'
            s.set(ox + x, y, col)


def make_tiles(studio):
    s = Sprite(16 * len(TILE_NAMES), 16, outline=False)
    r = noise(7)
    floor_tile(s, 0, 0, r)
    floor_tile(s, 16, 1, r)
    # wall_top: ceiling shadow, cream molding, then wallpaper
    s.rect(32, 0, 16, 2, '#151314')
    s.rect(32, 2, 16, 1, '#7a6f60')
    s.rect(32, 3, 16, 1, '#2a2622')
    wall_pixels(s, 32, 4, 16, r)
    wall_pixels(s, 48, 0, 16, r)
    # wainscot: teal tiles in a running bond with a cap and baseboard
    ox = 64
    s.rect(ox, 0, 16, 1, '#7a6f60')
    s.rect(ox, 1, 16, 1, '#2a2622')
    for row, (y0, offs) in enumerate(((2, (0, 8, 16)), (8, (-4, 4, 12, 20)))):
        for i in range(len(offs) - 1):
            x0, x1 = max(offs[i], 0), min(offs[i + 1], 16)
            s.rect(ox + x0, y0, x1 - x0, 6, T_COLORS[(i + row) % 2])
            s.vline(ox + x1 - 1, y0, 6, P['T3']) if x1 < 16 else None
        s.hline(ox, y0 + 5, 16, P['T3'])
    s.rect(ox, 14, 16, 2, '#1d1b1b')
    s.hline(ox, 14, 16, '#3c3a3a')
    # side walls: dark with a lit edge toward the room
    for i, edge in ((5, 'L'), (6, 'R')):
        ox = i * 16
        for y in range(16):
            for x in range(16):
                s.set(ox + x, y, '#2c2929' if r.random() < 0.12 else '#262525')
        for y in range(16):
            lit = (15, 14) if edge == 'L' else (0, 1)
            s.set(ox + lit[0], y, '#5b5a5a')
            s.set(ox + lit[1], y, '#3c3a3a')
    # front wall
    ox = 7 * 16
    for y in range(16):
        for x in range(16):
            s.set(ox + x, y, '#2c2929' if r.random() < 0.1 else '#1d1b1b')
    s.hline(ox, 0, 16, '#5b5a5a')
    s.hline(ox, 1, 16, '#3c3a3a')
    # floor under the back wall gets a shadow
    floor_tile(s, 8 * 16, 0, r, darken=[0.5, 0.65, 0.8, 0.9])
    # door: the dark street seen past cream jambs
    for i, jamb in ((9, 'L'), (10, 'R')):
        ox = i * 16
        for y in range(16):
            col = shade('#0b0f1e', 1 + y / 40)
            for x in range(16):
                s.set(ox + x, y, col)
        for y in range(16):
            for x in ((0, 1) if jamb == 'L' else (14, 15)):
                s.set(ox + x, y, '#b3ac99' if x in (0, 15) else '#7a6f60')
        s.hline(ox, 0, 16, '#3c3a3a')
        for k in range(5):
            s.set(ox + (5 + k * 2 if jamb == 'L' else 3 + k * 2), 3 + k * 2, '#1c2547')
    studio.make('spati_tiles', s, 'building/spati/spati_tiles.png')


T_COLORS = ['#2f5550', '#356059']


# ----------------------------------------------------------------- props
def counter():
    s = Sprite(62, 38)
    # wooden counter: lit top, panelled front
    s.rect(0, 14, 62, 4, 'N4')
    s.hline(0, 14, 62, 'W0')
    s.rect(0, 18, 62, 1, 'N2')
    s.rect(0, 19, 62, 1, 'N3')
    s.rect(0, 20, 62, 18, 'N2')
    for x in range(8, 62, 8):
        s.vline(x, 21, 14, 'N3')
    s.rect(0, 35, 62, 3, 'N3')
    s.hline(0, 26, 62, 'N1')
    s.rect(54, 28, 6, 4, 'W1')           # price card
    s.hline(55, 29, 4, 'K4')
    s.hline(55, 31, 3, 'K4')
    # cash register
    s.rect(3, 6, 15, 8, 'K2')
    s.rect(5, 2, 11, 5, 'K1')
    s.rect(6, 3, 9, 3, 'G3')
    s.hline(7, 4, 5, 'G4')
    for x in range(4, 17, 3):
        s.rect(x, 9, 2, 2, 'K4')
    s.hline(3, 13, 15, 'K1')
    s.rect(19, 10, 5, 4, 'K3')           # coin tray
    s.set(20, 11, 'Y1')
    s.set(22, 11, 'Y3')
    s.set(21, 12, 'Y1')
    # sweets jar
    s.rect(38, 4, 8, 10, 'B4')
    s.rect(39, 5, 6, 8, 'B3')
    for (x, y, col) in ((40, 11, 'R1'), (42, 11, 'Y3'), (41, 9, 'M1'), (43, 9, 'G2'), (40, 7, 'B2'), (42, 7, 'O3')):
        s.rect(x, y, 2, 2, col)
    s.rect(39, 2, 6, 2, 'R1')
    # lighters and chewing gum rack
    s.rect(50, 8, 10, 6, 'K2')
    for i, col in enumerate(('R1', 'Y1', 'B1', 'G2', 'M1')):
        s.rect(51 + i * 2, 4, 1, 5, col)
    s.rect(52, 10, 6, 2, 'K3')
    return s


def shopkeeper():
    s = Sprite(22, 34)
    s.rect(6, 1, 10, 10, 'S1')
    for p in ((6, 1), (15, 1), (6, 10), (15, 10)):
        s.erase(*p)
    s.hline(8, 1, 4, 'S2')
    s.rect(5, 3, 1, 3, 'K4')
    s.rect(16, 3, 1, 3, 'K4')
    s.set(5, 5, 'S1'); s.set(16, 5, 'S1')
    s.hline(8, 4, 2, 'K3'); s.hline(12, 4, 2, 'K3')
    s.set(8, 5, 'K0'); s.set(13, 5, 'K0')
    s.vline(11, 6, 2, 'S3')
    s.rect(6, 8, 10, 4, 'K3')
    s.hline(8, 8, 6, 'K4')
    s.hline(10, 9, 3, 'S3')
    s.rect(9, 11, 4, 2, 'S3')
    s.rect(3, 13, 16, 16, 'W1')
    s.rect(16, 13, 3, 16, 'W0')
    s.rect(1, 14, 3, 11, 'W1')
    s.rect(18, 14, 3, 11, 'W0')
    s.rect(1, 25, 3, 3, 'S1')
    s.rect(18, 25, 3, 3, 'S3')
    s.rect(6, 15, 10, 14, 'G3')
    s.vline(7, 13, 3, 'G3'); s.vline(14, 13, 3, 'G3')
    s.rect(8, 22, 6, 3, 'G1')
    s.rect(6, 29, 4, 5, 'K2'); s.rect(12, 29, 4, 5, 'K2')
    s.rect(5, 33, 5, 1, 'K0'); s.rect(12, 33, 5, 1, 'K0')
    return s


def gondola():
    s = Sprite(38, 34)
    s.rect(2, 6, 34, 26, 'K1')
    s.rect(0, 4, 2, 30, 'K3'); s.rect(36, 4, 2, 30, 'K3')
    s.rect(0, 0, 38, 6, 'R1')
    s.hline(0, 0, 38, 'R3')
    s.text(8, 1, 'SNACKS', 'W2')
    for y in (14, 24):
        s.rect(2, y, 34, 2, 'K4')
        s.rect(2, y + 2, 34, 1, 'K0')
    s.rect(0, 32, 38, 2, 'K2')
    cols = ['Y1', 'R1', 'B2', 'G2', 'O1', 'M1', 'Y3', 'B5']
    for tier, (y, hgt) in enumerate(((7, 7), (17, 7))):
        for i in range(8):
            x = 3 + i * 4
            col = cols[(i + tier * 3) % len(cols)]
            s.rect(x, y, 3, hgt, col)
            s.hline(x, y, 3, shade_pair(col))
            s.rect(x, y + 3, 3, 2, 'W2')
    for i in range(8):                       # bottom tier: cans and boxes
        x = 3 + i * 4
        col = cols[(i * 2) % len(cols)]
        s.rect(x, 27, 3, 5, col)
        s.hline(x, 27, 3, 'K5')
    return s


def shade_pair(col):
    return shade(col, 1.25)


def magazine_rack():
    s = Sprite(18, 32)
    s.rect(0, 0, 18, 27, 'N3')
    rows = [('M1', 'B2', 'Y1'), ('R1', 'G2', 'W1'), ('O1', 'B5', 'M2')]
    for r_i, row in enumerate(rows):
        y = 2 + r_i * 8
        for i, col in enumerate(row):
            x = 1 + i * 5
            s.rect(x, y, 4, 7, col)
            s.hline(x, y, 4, 'W2')
            s.set(x + 1, y + 3, 'K0'); s.set(x + 2, y + 4, 'W2')
        s.hline(0, y + 7, 18, 'N1')
    s.rect(1, 27, 2, 5, 'N3'); s.rect(15, 27, 2, 5, 'N3')
    s.hline(1, 29, 16, 'N1')
    return s


def crates():
    s = Sprite(28, 26)
    for i in range(6):                       # bottle necks and caps
        x = 3 + i * 4
        s.rect(x, 1, 2, 4, 'G1')
        s.set(x, 0, 'Y1'); s.set(x + 1, 0, 'Y1')
    s.rect(0, 4, 28, 10, 'Y1')
    for y in (7, 10):
        s.hline(1, y, 26, 'Y2')
    s.rect(10, 5, 8, 2, 'Y2')
    s.vline(27, 4, 10, 'Y2')
    s.rect(0, 14, 28, 12, 'R1')
    for y in (17, 20, 23):
        s.hline(1, y, 26, 'R2')
    s.rect(10, 15, 8, 2, 'R2')
    s.vline(27, 14, 12, 'R2')
    return s


def freezer():
    s = Sprite(38, 26)
    s.rect(0, 8, 38, 18, 'W1')
    s.rect(0, 22, 38, 4, 'W0')
    s.rect(0, 0, 38, 9, 'W2')
    s.rect(2, 1, 34, 7, 'B3')
    for i, col in enumerate(('R1', 'Y1', 'B5', 'M1', 'G2', 'O1', 'B2')):
        x = 4 + i * 4
        s.rect(x, 2, 3, 4, col)
        s.set(x + 1, 6, 'W1')
    for k in range(5):
        s.set(6 + k * 6, 1 + (k % 2), 'B4')
        s.set(7 + k * 6, 2 + (k % 2), 'B4')
    s.rect(0, 12, 38, 6, 'R1')
    s.hline(0, 12, 38, 'R3')
    s.text(15, 13, 'EIS', 'W2')
    s.rect(2, 25, 4, 1, 'K1'); s.rect(32, 25, 4, 1, 'K1')
    return s


def cig_wall():
    s = Sprite(46, 28)
    s.rect(0, 0, 46, 28, 'K1')
    s.rect(0, 0, 46, 2, 'Y1')
    s.hline(0, 2, 46, 'Y2')
    bottles = ['G1', 'O1', 'B2', 'R2', 'W1', 'Y2', 'G2', 'O3', 'B1']
    for i, col in enumerate(bottles):
        x = 2 + i * 5
        s.rect(x, 5, 3, 6, col)
        s.set(x + 1, 3, col); s.set(x + 1, 4, col)
        s.set(x + 1, 2, 'K5')
        s.set(x, 6, 'K5')
    s.hline(0, 11, 46, 'N2')
    packs = ['R1', 'W1', 'B2', 'K3', 'Y1', 'G1', 'R3', 'M1', 'W2']
    for i, col in enumerate(packs):
        x = 2 + i * 5
        s.rect(x, 13, 4, 6, col)
        s.hline(x, 15, 4, 'K0' if col in ('W1', 'W2', 'Y1') else 'W1')
    s.hline(0, 19, 46, 'N2')
    cartons = ['W2', 'R1', 'B1', 'Y1', 'G2', 'K4']
    for i, col in enumerate(cartons):
        x = 2 + i * 7
        s.rect(x, 21, 6, 6, col)
        s.hline(x, 23, 6, 'K0' if col in ('W2', 'Y1', 'G2') else 'W2')
    s.vline(0, 0, 28, 'K3'); s.vline(45, 0, 28, 'K3')
    return s


def poster_party():
    s = Sprite(13, 17)
    s.rect(0, 0, 13, 17, '#1d1b2e')
    for y in range(17):
        for x in range(13):
            d = ((x - 6) ** 2 + (y - 7) ** 2) ** 0.5
            if 3.2 <= d <= 4.6:
                s.set(x, y, 'M2')
    s.text(5, 5, 'B', 'W2')
    for x in range(13):
        s.set(x, 13 + (1 if x % 4 in (1, 2) else 0), 'B5')
    s.hline(0, 0, 13, 'M1'); s.hline(0, 16, 13, 'M1')
    return s


def poster_beer():
    s = Sprite(13, 17)
    s.rect(0, 0, 13, 17, 'Y1')
    s.rect(0, 0, 13, 1, 'R1'); s.rect(0, 16, 13, 1, 'R1')
    s.vline(0, 0, 17, 'R1'); s.vline(12, 0, 17, 'R1')
    s.rect(4, 7, 5, 9, 'G1')
    s.rect(5, 5, 3, 2, 'G1')
    s.vline(6, 2, 3, 'G1')
    s.set(6, 1, 'R1')
    s.vline(5, 7, 8, 'G2')
    s.rect(4, 10, 5, 3, 'W2')
    s.set(6, 11, 'R1')
    return s


def poster_hours():
    s = Sprite(11, 15)
    s.rect(0, 0, 11, 15, 'W1')
    s.rect(0, 0, 11, 7, 'R1')
    s.text(2, 1, '24', 'W2')
    for y, n in ((9, 9), (11, 6), (13, 8)):
        s.hline(1, y, n, 'K4')
    return s


def neon_open():
    s = Sprite(22, 9)
    s.rect(0, 0, 22, 9, 'K1')
    s.hline(0, 0, 22, 'B1'); s.hline(0, 8, 22, 'B1')
    s.vline(0, 0, 9, 'B1'); s.vline(21, 0, 9, 'B1')
    s.text(4, 2, 'OPEN', '#ff4d5e')
    for (x, y), col in list(s.p.items()):
        if col == '#ff4d5e':
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if (x + dx, y + dy) not in s.p:
                    s.set(x + dx, y + dy, '#4a1622')
    return s


def plant():
    s = Sprite(16, 26)
    s.rect(3, 18, 10, 8, 'O1')
    s.rect(2, 17, 12, 2, 'O3')
    s.rect(10, 19, 3, 7, 'S3')
    s.rect(3, 16, 10, 1, 'N3')
    s.rect(7, 8, 2, 9, 'G3')
    for cx, cy, rx, ry, col in ((4, 7, 3.2, 5, 'G1'), (11, 6, 3.2, 5, 'G1'), (8, 3, 3, 3.4, 'G2'),
                                (4, 13, 3, 2.4, 'G1'), (12, 12, 3, 2.4, 'G3')):
        ell(s, cx, cy, rx, ry, col)
    for x, y in ((3, 4), (10, 3), (7, 1), (3, 12)):
        s.set(x, y, 'G4')
    return s


def trash_bin():
    s = Sprite(12, 15)
    s.rect(1, 3, 10, 12, 'K2')
    s.rect(0, 1, 12, 3, 'K4')
    s.rect(4, 0, 4, 1, 'K5')
    s.vline(2, 4, 11, 'K3')
    s.vline(10, 4, 11, 'K1')
    s.rect(4, 7, 4, 4, 'G2')
    s.rect(5, 8, 2, 2, 'K2')
    return s


def doormat():
    s = Sprite(32, 11)
    s.rect(0, 0, 32, 11, 'S3')
    s.hline(0, 0, 32, 'N3'); s.hline(0, 10, 32, 'N3')
    s.vline(0, 0, 11, 'N3'); s.vline(31, 0, 11, 'N3')
    s.text(3, 3, 'WELCOME', 'W1')
    for x in range(1, 31, 2):
        s.set(x, 1, 'R2'); s.set(x, 9, 'R2')
    return s


def cat():
    s = Sprite(18, 10)
    ell(s, 10, 6, 7.5, 3.4, 'O1')
    ell(s, 3.5, 6, 3, 3, 'O1')
    s.set(1, 3, 'O1'); s.set(2, 2, 'O1'); s.set(5, 2, 'O1'); s.set(6, 3, 'O1')
    s.hline(2, 6, 2, 'K0'); s.hline(5, 6, 2, 'K0')
    s.set(4, 7, 'M1')
    for x in (8, 11, 14):
        s.vline(x, 3, 4, 'O2')
    s.hline(7, 8, 9, 'O3')
    s.rect(16, 7, 2, 2, 'O1')
    s.set(17, 6, 'O2')
    return s


def pfand():
    s = Sprite(28, 38)
    s.rect(0, 0, 28, 38, 'K3')
    s.vline(27, 0, 38, 'K2')
    s.hline(0, 0, 28, 'K4')
    s.rect(2, 2, 24, 9, 'K1')
    s.rect(4, 3, 20, 7, 'G3')
    s.text(5, 4, 'PFAND', 'G4')
    s.rect(5, 14, 18, 10, 'K1')
    s.rect(5, 14, 18, 2, 'K2')
    s.rect(8, 18, 3, 5, 'G1'); s.rect(9, 16, 1, 2, 'G1')     # bottle pictogram
    s.rect(15, 18, 3, 5, 'O1'); s.rect(16, 16, 1, 2, 'O1')
    s.rect(4, 27, 20, 4, 'Y1')
    s.hline(6, 29, 16, 'K1')
    s.set(25, 13, 'R3'); s.set(25, 15, 'G2')
    s.rect(3, 34, 4, 4, 'K1'); s.rect(21, 34, 4, 4, 'K1')
    return s


def clock():
    s = Sprite(10, 10)
    ell(s, 4.5, 4.5, 4.7, 4.7, 'K3')
    ell(s, 4.5, 4.5, 3.6, 3.6, 'W2')
    for x, y in ((4, 1), (5, 1), (1, 4), (1, 5), (8, 4), (8, 5), (4, 8), (5, 8)):
        s.set(x, y, 'K4')
    for x, y in ((4, 4), (5, 5), (3, 3), (6, 3)):
        s.set(x, y, 'K0')
    s.set(5, 4, 'K0')
    s.set(7, 2, 'K0')
    return s


PROPS = {
    'counter': counter, 'shopkeeper': shopkeeper, 'gondola': gondola,
    'magazine_rack': magazine_rack, 'crates': crates, 'freezer': freezer,
    'cig_wall': cig_wall, 'poster_party': poster_party, 'poster_beer': poster_beer,
    'poster_hours': poster_hours, 'neon_open': neon_open, 'plant': plant,
    'trash_bin': trash_bin, 'doormat': doormat, 'cat': cat, 'pfand': pfand, 'clock': clock,
}


def main(names):
    studio = Studio()
    try:
        if not names or 'tiles' in names:
            make_tiles(studio)
        for name, fn in PROPS.items():
            if not names or name in names:
                studio.make('spati_' + name, fn(), 'building/spati/%s.png' % name)
                print('drew', name)
    finally:
        studio.close()


if __name__ == '__main__':
    main(sys.argv[1:])
