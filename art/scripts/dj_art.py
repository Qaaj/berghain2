"""Draws the DJ / record shop tileset and props through pixel-mcp.

Run:  python3 art/scripts/dj_art.py [name ...]
Each asset lands in art/dj_<name>.aseprite and public/assets/building/dj/<name>.png (3x).
The room tileset (dj_tiles) keeps the Späti's 11-tile order so the same room layout code can use it.
"""
import sys

from spriteart import P, Sprite, Studio, mix, noise, shade


def ell(s, cx, cy, rx, ry, col):
    for y in range(s.h):
        for x in range(s.w):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                s.set(x, y, col)


def glow_text(s, x, y, text, col, halo, bg):
    """3x5 text with a dim halo on the background pixels around each stroke."""
    s.text(x, y, text, P.get(col, col))
    col = P.get(col, col)
    for (px, py), c0 in list(s.p.items()):
        if c0 == col:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if s.p.get((px + dx, py + dy)) == bg:
                    s.set(px + dx, py + dy, halo)


# LP sleeve colours (fg, bg): loud covers that read against the dark room
SLEEVES = [('M2', '#1a1226'), ('Y3', 'K0'), ('B5', 'B1'), ('O3', '#4a1612'), ('W1', 'R1'),
           ('G4', 'G3'), ('K0', 'W1'), ('M1', '#2e1745'), ('R3', 'K1')]


def sleeve(s, x, y, size, i):
    """A face-out record cover with one of a few simple designs."""
    fg, bg = SLEEVES[i % len(SLEEVES)]
    s.rect(x, y, size, size, bg)
    s.hline(x, y, size, shade(P.get(bg, bg), 1.5) if bg not in ('K0', 'K1') else 'K3')
    kind = i % 4
    m = size // 2
    if kind == 0:                                   # ring
        ell_local(s, x, y, size, fg)
    elif kind == 1:                                 # stripes
        for k in range(1, size - 1, 2):
            s.hline(x + 1, y + k, size - 2, fg) if k % 4 == 1 else None
    elif kind == 2:                                 # sun over a horizon
        s.rect(x + m - 1, y + 1, 3, 2, fg)
        s.hline(x, y + size - 3, size, fg)
    else:                                           # diagonal slash
        for k in range(size - 1):
            s.set(x + k, y + size - 2 - k, fg)
    s.set(x + size - 1, y + size - 1, shade(P.get(bg, bg), 0.6))


def ell_local(s, x, y, size, fg):
    r = (size - 2) / 2
    cx = cy = (size - 1) / 2
    for yy in range(size):
        for xx in range(size):
            d = ((xx - cx) ** 2 + (yy - cy) ** 2) ** 0.5
            if r - 1.1 <= d <= r:
                s.set(x + xx, y + yy, fg)


# ---------------------------------------------------------------- tileset
TILE_NAMES = ['floor_a', 'floor_b', 'wall_top', 'wall_mid', 'wainscot', 'side_l', 'side_r',
              'front', 'floor_shadow', 'door_l', 'door_r']

PLANKS = ['#3b2a24', '#37271f', '#3e2c25', '#352620']
WALL = '#2a1d36'


def floor_tile(s, ox, flip, rng, darken=None):
    """Worn dark floorboards: long 4px planks, a butt joint on every other plank, a little grain."""
    for y in range(16):
        row = y // 4
        seam = 3 + row * 4 + flip * 6 if (row + flip) % 2 == 0 else None
        for x in range(16):
            col = PLANKS[(row + flip * 2) % 4]
            if y % 4 == 3:
                col = '#2a1e1a'
            elif seam is not None and x == seam % 16:
                col = '#2a1e1a'
            elif y % 4 == 1 and (x * 7 + row * 5 + flip * 3) % 11 < 3:
                col = shade(col, 0.9)
            elif rng.random() < 0.03:
                col = '#45332a'
            if darken and y < len(darken):
                col = shade(col, darken[y])
            s.set(ox + x, y, col)


def wall_pixels(s, ox, y0, y1, rng):
    for y in range(y0, y1):
        for x in range(16):
            col = '#251a30' if x % 4 == 0 else WALL
            if rng.random() < 0.04:
                col = '#30233d'
            s.set(ox + x, y, col)


def make_tiles(studio):
    s = Sprite(16 * len(TILE_NAMES), 16, outline=False)
    r = noise(11)
    floor_tile(s, 0, 0, r)
    floor_tile(s, 16, 1, r)
    # wall_top: ceiling shadow, a thin dark molding, then the purple wall
    s.rect(32, 0, 16, 2, '#0e0a12')
    s.rect(32, 2, 16, 1, '#4a3a58')
    s.rect(32, 3, 16, 1, '#1a1222')
    wall_pixels(s, 32, 4, 16, r)
    wall_pixels(s, 48, 0, 16, r)
    # wainscot: black slat panelling under a pink LED strip
    ox = 64
    s.rect(ox, 0, 16, 1, '#ff71f0')
    s.rect(ox, 1, 16, 1, '#5a2a5a')
    for x in range(16):
        col = '#1c1820' if x % 4 in (0, 1, 2) else '#0f0d12'
        if x % 4 == 0:
            col = '#28232d'
        s.vline(ox + x, 2, 12, col)
    s.hline(ox, 2, 16, '#3a2a40')
    s.rect(ox, 14, 16, 2, '#121114')
    s.hline(ox, 14, 16, '#2a2630')
    # side walls: dark with a lit edge toward the room
    for i, edge in ((5, 'L'), (6, 'R')):
        ox = i * 16
        for y in range(16):
            for x in range(16):
                s.set(ox + x, y, '#211a28' if r.random() < 0.12 else '#1b1621')
        for y in range(16):
            lit = (15, 14) if edge == 'L' else (0, 1)
            s.set(ox + lit[0], y, '#4e4458')
            s.set(ox + lit[1], y, '#332b3b')
    # front wall
    ox = 7 * 16
    for y in range(16):
        for x in range(16):
            s.set(ox + x, y, '#211a28' if r.random() < 0.1 else '#16121b')
    s.hline(ox, 0, 16, '#4e4458')
    s.hline(ox, 1, 16, '#332b3b')
    floor_tile(s, 8 * 16, 0, r, darken=[0.5, 0.65, 0.8, 0.9])
    # door: the dark street seen past steel jambs
    for i, jamb in ((9, 'L'), (10, 'R')):
        ox = i * 16
        for y in range(16):
            col = shade('#0b0f1e', 1 + y / 40)
            for x in range(16):
                s.set(ox + x, y, col)
        for y in range(16):
            for x in ((0, 1) if jamb == 'L' else (14, 15)):
                s.set(ox + x, y, '#807e7e' if x in (0, 15) else '#3c3a3a')
        s.hline(ox, 0, 16, '#3c3a3a')
        for k in range(5):
            s.set(ox + (5 + k * 2 if jamb == 'L' else 3 + k * 2), 3 + k * 2, '#1c2547')
    studio.make('dj_tiles', s, 'building/dj/dj_tiles.png')


# ----------------------------------------------------------------- props
def turntable(s, x, y):
    """18x7 deck seen from the front and a little above."""
    s.rect(x, y, 18, 7, 'K2')
    s.hline(x, y, 18, 'K4')
    s.hline(x, y + 6, 18, 'K1')
    ell(s, x + 7.5, y + 2.5, 6, 2, 'K0')
    s.hline(x + 4, y + 2, 7, 'K1')
    s.rect(x + 7, y + 2, 2, 1, 'R3')
    s.line(x + 16, y + 1, x + 13, y + 3, 'K5')
    s.set(x + 16, y, 'K4')
    s.vline(x + 16, y + 4, 2, 'K3')
    s.set(x + 1, y + 5, 'G4')


def dj_booth():
    s = Sprite(62, 38)
    # gear on top
    turntable(s, 2, 8)
    turntable(s, 42, 8)
    s.rect(22, 6, 18, 9, 'K1')                   # mixer
    s.hline(22, 6, 18, 'K3')
    for i in range(4):
        x = 24 + i * 4
        s.set(x, 8, ('B5', 'M2', 'B5', 'M2')[i]); s.set(x + 1, 8, 'K4')
        s.set(x, 10, 'K4'); s.set(x + 1, 10, 'K4')
        s.vline(x + 1, 11, 3, 'K0'); s.set(x + 1, 11 + i % 3, 'W2')
    s.hline(25, 14, 12, 'K0'); s.rect(29 + 1, 13, 2, 2, 'W1')    # crossfader
    s.rect(28, 3, 6, 3, 'K3'); s.hline(29, 4, 4, 'Y3')           # level meter
    s.set(29, 4, 'G2'); s.set(30, 4, 'G2')
    # desk top and front
    s.rect(0, 15, 62, 3, 'K3')
    s.hline(0, 15, 62, 'K4')
    s.rect(0, 18, 62, 20, 'K1')
    s.hline(0, 18, 62, 'K0')
    s.hline(0, 19, 62, 'M2')                      # LED strip
    s.hline(0, 20, 62, '#5a2a5a')
    for x in range(4, 62, 6):                     # front grille slats
        s.vline(x, 22, 13, 'K2')
    s.rect(0, 35, 62, 3, 'K0')
    # stickers on the front
    s.rect(6, 25, 7, 5, 'Y3'); s.text(8, 25, 'J', 'K0')
    s.rect(40, 24, 9, 6, 'W1'); s.hline(41, 26, 7, 'R1'); s.hline(41, 28, 5, 'K3')
    s.rect(26, 27, 5, 5, 'B5'); s.set(28, 29, 'K0')
    s.rect(52, 28, 6, 4, 'M1')
    return s


def dj():
    s = Sprite(22, 34)
    # head, black beanie, stubble
    s.rect(6, 2, 10, 9, 'S1')
    s.erase(6, 10); s.erase(15, 10)
    s.rect(5, 0, 12, 4, 'K1')
    s.hline(5, 3, 12, 'K2')
    s.hline(7, 0, 8, 'K2')
    s.set(5, 5, 'S1'); s.set(16, 5, 'S1')
    s.hline(8, 5, 2, 'K0'); s.hline(12, 5, 2, 'K0')      # sleepy eyes
    s.set(8, 4, 'S3'); s.set(13, 4, 'S3')
    s.vline(11, 6, 2, 'S3')
    s.rect(7, 8, 8, 3, '#a97b62')
    s.hline(8, 8, 6, 'S1')
    s.hline(10, 9, 3, 'K3')
    s.rect(9, 11, 4, 2, 'S3')
    # black tee with a pink print, arms
    s.rect(3, 13, 16, 16, 'K1')
    s.rect(16, 13, 3, 16, 'K0')
    s.rect(1, 14, 3, 6, 'K1')
    s.rect(18, 14, 3, 6, 'K0')
    s.rect(1, 20, 3, 6, 'S1')
    s.rect(18, 20, 3, 6, 'S3')
    s.rect(1, 25, 3, 2, 'S2')
    s.grid(8, 19, ['.MMMM.', 'M....M', 'M.MM.M', 'M.MM.M', 'M....M', '.MMMM.'], {'M': 'M2'})
    # headphones round the neck
    s.hline(6, 13, 10, 'K3')
    s.rect(4, 12, 3, 4, 'K2'); s.vline(4, 13, 2, 'B5')
    s.rect(15, 12, 3, 4, 'K2'); s.vline(17, 13, 2, 'B5')
    # jeans and trainers
    s.rect(6, 29, 4, 4, 'B3'); s.rect(12, 29, 4, 4, 'B3')
    s.rect(5, 33, 5, 1, 'W1'); s.rect(12, 33, 5, 1, 'W1')
    return s


def record_bin():
    s = Sprite(34, 22)
    # LPs standing in the bin, tops showing; a divider card
    for i in range(10):
        x = 2 + i * 3
        fg, bg = SLEEVES[i % len(SLEEVES)]
        top = 1 + (i * 7) % 3
        s.rect(x, top, 3, 9 - top, bg)
        s.hline(x, top, 3, fg)
        s.vline(x + 2, top + 1, 8 - top, 'K0')
    s.rect(13, 0, 9, 5, 'W1')
    s.hline(14, 2, 7, 'K3')
    # wooden crate
    s.rect(0, 7, 34, 10, 'N2')
    s.hline(0, 7, 34, 'N4')
    s.hline(0, 11, 34, 'N1')
    s.vline(0, 7, 10, 'N3'); s.vline(33, 7, 10, 'N3')
    s.rect(13, 9, 8, 2, 'N3')                     # hand hole
    s.text(3, 12, 'A-K', 'N4')
    s.hline(0, 16, 34, 'N3')
    s.rect(1, 17, 3, 5, 'N3'); s.rect(30, 17, 3, 5, 'N3')
    s.hline(2, 19, 30, 'N1')
    return s


def record_wall():
    s = Sprite(48, 30)
    s.rect(0, 0, 48, 30, 'N3')
    s.vline(0, 0, 30, 'N1'); s.vline(47, 0, 30, 'N1')
    i = 0
    for row, y in enumerate((1, 11, 21)):
        for k in range(5):
            sleeve(s, 2 + k * 9 + (row % 2), y, 8, i)
            i += 1
        s.rect(0, y + 8, 48, 1, 'N4')
        s.rect(0, y + 9, 48, 1, 'K0')
    return s


def speaker():
    s = Sprite(18, 40)
    s.rect(0, 0, 18, 37, 'K1')
    s.vline(17, 0, 37, 'K0')
    s.hline(0, 0, 18, 'K3')
    s.vline(0, 0, 37, 'K2')
    # horn
    s.rect(4, 3, 10, 5, 'K0')
    s.rect(6, 4, 6, 3, 'K2')
    s.hline(8, 5, 2, 'K0')
    # two woofers
    for cy in (15, 28):
        ell(s, 8.5, cy, 7, 6.2, 'K2')
        ell(s, 8.5, cy, 5.6, 5, 'K0')
        ell(s, 8.5, cy, 2.4, 2.2, 'K3')
        s.set(8, cy - 1, 'K4')
    for x, y in ((1, 1), (16, 1), (1, 35), (16, 35)):
        s.set(x, y, 'K4')
    s.set(15, 36, 'B5')
    s.rect(1, 37, 3, 3, 'K0'); s.rect(14, 37, 3, 3, 'K0')
    return s


def neon_records():
    s = Sprite(42, 11)
    s.rect(0, 0, 42, 11, '#140a1e')
    s.hline(0, 0, 42, 'K3'); s.hline(0, 10, 42, 'K3')
    s.vline(0, 0, 11, 'K3'); s.vline(41, 0, 11, 'K3')
    # spinning-record icon in pink, text in cyan
    for y in range(11):
        for x in range(11):
            d = ((x - 5) ** 2 + (y - 5) ** 2) ** 0.5
            if 2.5 <= d <= 3.5:
                s.set(x, y, 'M2')
            elif 1.5 <= d < 2.5:
                s.set(x, y, '#3a1640')
    s.set(5, 5, 'M2')
    glow_text(s, 12, 3, 'RECORDS', 'B5', '#1a3a46', '#140a1e')
    return s


def poster_techno():
    s = Sprite(13, 18)
    s.rect(0, 0, 13, 18, 'K0')
    s.rect(0, 0, 13, 1, 'W2')
    # stacked bars like an EQ, then date text
    for i, hgt in enumerate((3, 6, 9, 5, 7, 4)):
        s.rect(1 + i * 2, 10 - hgt, 1, hgt, ('M2', 'B5')[i % 2])
    s.hline(1, 11, 11, 'W1')
    s.text(1, 12, 'SA', 'W2')
    s.text(9, 12, '4', 'Y3')
    s.vline(0, 0, 18, 'K2'); s.vline(12, 0, 18, 'K2')
    s.hline(0, 17, 13, 'K2')
    s.set(6, 0, 'K4')                             # tack
    return s


def disco_ball():
    s = Sprite(11, 15)
    s.vline(5, 0, 4, 'K3')
    s.rect(4, 3, 3, 1, 'K4')
    ell(s, 5, 9, 5, 5, 'K4')
    for y in range(4, 15):
        for x in range(11):
            if (x, y) in s.p and y >= 4:
                d = ((x - 5) ** 2 + (y - 9) ** 2) ** 0.5
                if d <= 5.2 and y > 4:
                    base = 'K5' if (x + y) % 2 else 'K3'
                    if x < 5 and y < 9:
                        base = 'W2' if (x + y) % 2 else 'K5'
                    if x > 7 or y > 12:
                        base = 'K3' if (x + y) % 2 else 'K2'
                    s.set(x, y, base)
    s.set(3, 6, 'W2'); s.set(2, 7, 'B5'); s.set(7, 10, 'M2')
    return s


def listening_station():
    s = Sprite(22, 32)
    # turntable on a small cabinet
    s.rect(1, 6, 20, 6, 'K2')
    s.hline(1, 6, 20, 'K4')
    ell(s, 9, 8.5, 6, 1.7, 'K0')
    s.hline(6, 8, 6, 'K1')
    s.set(9, 8, 'O3')
    s.line(18, 7, 15, 9, 'K5')
    s.set(2, 10, 'G2')
    # headphones hanging on a hook
    s.vline(20, 0, 6, 'K3')
    s.hline(17, 0, 4, 'K3')
    s.hline(15, 1, 4, 'K4'); s.vline(14, 2, 3, 'K4'); s.vline(19, 2, 3, 'K4')
    s.rect(13, 4, 2, 3, 'M1'); s.rect(19, 4, 2, 3, 'M1')
    # cabinet with a record shelf
    s.rect(2, 12, 18, 18, 'N3')
    s.hline(2, 12, 18, 'N4')
    s.vline(19, 12, 18, 'N1')
    s.rect(4, 15, 14, 7, 'K1')
    for i in range(6):
        fg = SLEEVES[i][0]
        s.vline(5 + i * 2, 16, 6, P.get(fg, fg) if i % 2 else shade(P[fg] if fg in P else fg, 0.6))
    s.rect(5, 24, 12, 2, 'W1')                    # "listen here" card
    s.hline(6, 24, 8, 'K3')
    s.rect(3, 30, 3, 2, 'K1'); s.rect(16, 30, 3, 2, 'K1')
    return s


def sofa():
    s = Sprite(46, 22)
    leather, dark, lite = '#5a2a22', '#3f1c17', '#7a3a2c'
    s.rect(4, 0, 38, 11, leather)                  # backrest
    s.hline(4, 0, 38, lite)
    s.vline(23, 1, 10, dark)
    s.rect(4, 10, 38, 6, leather)                  # seat cushions
    s.hline(4, 10, 38, lite)
    s.vline(23, 10, 6, dark)
    s.rect(0, 4, 5, 14, dark)                      # arms
    s.hline(0, 4, 5, leather)
    s.rect(41, 4, 5, 14, dark)
    s.hline(41, 4, 5, leather)
    s.rect(4, 16, 38, 3, dark)
    # tear with stuffing, a strip of gaffer tape
    s.rect(30, 12, 4, 2, 'W1'); s.set(31, 11, 'W0'); s.set(33, 14, 'W0')
    s.rect(9, 3, 6, 2, 'K3'); s.hline(9, 3, 6, 'K4')
    s.set(16, 6, dark); s.set(36, 3, dark)
    s.rect(1, 18, 3, 4, 'K1'); s.rect(42, 18, 3, 4, 'K1')
    return s


def doormat_dj():
    s = Sprite(32, 11)
    s.rect(0, 0, 32, 11, 'K1')
    s.hline(0, 0, 32, 'K2'); s.hline(0, 10, 32, 'K2')
    s.vline(0, 0, 11, 'K2'); s.vline(31, 0, 11, 'K2')
    for x in range(1, 31, 2):
        s.set(x, 1, '#5a2a5a'); s.set(x, 9, '#5a2a5a')
    s.text(7, 3, 'VINYL', 'M1')
    ell(s, 3.5, 5, 2.2, 2.2, 'K0'); s.set(3, 5, 'M2')
    ell(s, 27.5, 5, 2.2, 2.2, 'K0'); s.set(27, 5, 'M2')
    return s


PROPS = {
    'dj_booth': dj_booth, 'dj': dj, 'record_bin': record_bin, 'record_wall': record_wall,
    'speaker': speaker, 'neon_records': neon_records, 'poster_techno': poster_techno,
    'disco_ball': disco_ball, 'listening_station': listening_station, 'sofa': sofa,
    'doormat_dj': doormat_dj,
}


def main(names):
    studio = Studio()
    try:
        if not names or 'tiles' in names:
            make_tiles(studio)
        for name, fn in PROPS.items():
            if not names or name in names:
                studio.make('dj_' + name, fn(), 'building/dj/%s.png' % name)
                print('drew', name)
    finally:
        studio.close()


if __name__ == '__main__':
    main(sys.argv[1:])
