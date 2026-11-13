"""Builds the Friedrichshain street tileset: the Neukölln kit's ground, facades, furniture, sky and markers, plus
the Berghain, a mesh fence, bare winter trees and crowd barriers.

Run:  python3 art/scripts/fhain_art.py
Writes  art/tilesets/friedrichshain_street.png/.json (+ art/friedrichshain_street.aseprite).
"""
import math
import os

import street_facades as F
import street_props as P
from sheet import TileSheet
from spriteart import ART_DIR, Studio, mix, noise, shade

OUT = os.path.join(ART_DIR, 'tilesets')

# Night-muted sandstone concrete; lighter than the Altbau plaster so the power station stands out
SAND, SAND_HI, SAND_LO = '#7d715a', '#948669', '#5c533f'
GLASS, FRAME = '#14171c', '#a99d80'
STEEL = '#2c2929'


# ----------------------------------------------------------------- berghain
def berghain(s):
    """22x13 tiles. A former power station: overhanging roof slab, a row of small attic windows, a grid of tall
    windows between pilasters, and a dark ground floor with graffiti-covered shutters and one unmarked steel door."""
    W, H = 22 * 16, 13 * 16
    rng = noise(77)
    s.rect(0, 6, W, H - 6, SAND)
    for _ in range(900):                                     # weathering
        x, y = rng.randrange(W), rng.randrange(8, 150)
        s.set(x, y, SAND_LO if rng.random() < 0.6 else SAND_HI)
    for x0 in range(6, W, 23):                               # rain streaks under the slab
        ln = rng.randint(20, 70)
        for y in range(8, 8 + ln):
            if rng.random() < 0.8:
                s.set(x0, y, mix(SAND, SAND_LO, 0.7))

    # roof slab
    s.rect(0, 0, W, 6, '#4f4738'); s.hline(0, 0, W, '#71674f'); s.rect(0, 6, W, 2, '#2f2a22')

    # attic: small square windows
    for i in range(12):
        x = 12 + i * 28
        s.rect(x - 1, 13, 10, 10, FRAME); s.rect(x, 14, 8, 8, GLASS)
        s.hline(x, 14, 8, '#232a33')
    s.rect(0, 30, W, 3, SAND_HI); s.hline(0, 33, W, SAND_LO)     # ledge

    # main floors: 11 columns of tall windows between pilasters, three storeys
    cols = [19 + i * 30 for i in range(11)]
    for x in cols[:-1]:                                      # pilasters between the columns
        px = x + 19
        s.rect(px, 34, 6, 116, SAND_HI); s.vline(px + 5, 34, 116, SAND_LO)
    glow = {(2, 1): '#4a1f5a', (3, 1): '#4a1f5a', (6, 0): '#5a2a1c', (8, 2): '#2a1f4a', (9, 2): '#2a1f4a'}
    for row, y in enumerate((40, 77, 114)):
        for i, x in enumerate(cols):
            s.rect(x - 1, y - 1, 16, 31, FRAME)
            pane = glow.get((i, row), GLASS)
            s.rect(x, y, 14, 29, pane)
            s.vline(x + 7, y, 29, FRAME); s.hline(x, y + 10, 14, FRAME)
            if pane == GLASS:
                s.line(x + 1, y + 8, x + 5, y + 1, '#232a33')   # a glint
            else:
                s.rect(x + 1, y + 20, 5, 8, shade(pane, 1.6))  # something moving inside
            s.hline(x - 2, y + 30, 18, SAND_HI)                # sill
    s.rect(0, 150, W, 4, SAND_HI); s.hline(0, 154, W, SAND_LO)   # ledge over the ground floor

    # ground floor
    s.rect(0, 155, W, 53, '#4d4538')
    for _ in range(300):
        s.set(rng.randrange(W), rng.randrange(155, H), '#40392e')
    s.rect(0, 204, W, 4, '#2f2a22')

    def shutter(x, w, tags):
        s.rect(x, 166, w, 38, '#5b5a55')
        for y in range(166, 204, 3):
            s.hline(x, y, w, '#4a4945')
        s.rect(x - 2, 163, w + 4, 3, '#3c3a3a')
        r = noise(x)
        for col in tags:                                     # layered tags and throw-ups
            cx, cy = x + r.randint(3, w - 8), r.randint(172, 196)
            for k in range(r.randint(6, 12)):
                a = k * 0.7 + r.random()
                s.rect(cx + int(math.cos(a) * 5), cy + int(math.sin(a) * 4), 2, 2, col)
        s.rect(x + 2, 188, w - 4, 2, '#d2d631') if w > 20 else None

    shutter(14, 26, ('#ff71f0', '#71faff', '#ffffff'))
    shutter(50, 26, ('#d2d631', '#be2633'))
    shutter(86, 26, ('#2fa84a', '#ff71f0', '#e08a3c'))
    shutter(122, 22, ('#71faff', '#ffffff'))
    shutter(276, 26, ('#e08a3c', '#71faff'))
    shutter(312, 26, ('#ff71f0', '#d2d631', '#ffffff'))

    # the entrance: a plain steel door, no sign, one lamp
    dx = 200
    s.rect(dx - 4, 160, 44, 44, '#121114')
    s.rect(dx, 164, 36, 40, STEEL)
    s.vline(dx + 18, 164, 40, '#121114')
    for x in (dx + 2, dx + 20):
        s.rect(x, 166, 14, 36, '#383535'); s.hline(x, 166, 14, '#4a4646')
    s.rect(dx + 14, 182, 2, 6, '#807e7e'); s.rect(dx + 21, 182, 2, 6, '#807e7e')
    s.rect(dx + 14, 156, 8, 3, '#2c2929'); s.rect(dx + 15, 159, 6, 2, '#fff4c0')
    for x, y in ((dx + 12, 161), (dx + 24, 161), (dx + 10, 163), (dx + 26, 163)):
        s.set(x, y, '#6b5a20')
    s.rect(dx - 10, 196, 56, 8, '#3a342b')                   # worn patch where the queue stands

    # the bouncer, arms crossed, beside the door
    bx, by = 244, 172
    s.rect(bx + 3, by, 7, 7, '#c99f86'); s.rect(bx + 3, by, 7, 2, '#a7806a')    # shaved head
    s.rect(bx + 3, by + 5, 7, 3, '#2c2929')                   # beard
    s.rect(bx + 4, by + 3, 2, 1, '#121114'); s.rect(bx + 8, by + 3, 2, 1, '#121114')
    s.rect(bx, by + 8, 13, 14, '#1a1919'); s.hline(bx, by + 8, 13, '#2c2929')
    s.rect(bx + 1, by + 13, 11, 3, '#262525'); s.hline(bx + 2, by + 13, 9, '#3c3a3a')   # crossed arms
    s.rect(bx + 1, by + 22, 5, 10, '#121114'); s.rect(bx + 7, by + 22, 5, 10, '#121114')
    s.rect(bx, by + 31, 6, 1, '#000000'); s.rect(bx + 7, by + 31, 6, 1, '#000000')

    # stickers and posters by the door
    for x, y, col in ((150, 172, '#e8e4d6'), (156, 178, '#be2633'), (176, 168, '#d2d631'), (262, 170, '#e8e4d6')):
        s.rect(x, y, 5, 6, col)


# -------------------------------------------------------------- fence etc.
def fence(s):
    """2x5 tiles, tiles seamlessly: a post on the left, diamond mesh, top and middle rails."""
    mesh = '#6f7a80'
    for y in range(8, 80):
        for x in range(32):
            if (x + y) % 6 == 0 or (x - y) % 6 == 0:
                s.set(x, y, mesh if (x * y) % 7 else '#8e999e')
    s.rect(0, 4, 32, 2, '#8a8a90'); s.hline(0, 4, 32, '#b5b5bc')
    s.rect(0, 44, 32, 2, '#6a6a70')
    s.rect(0, 2, 3, 78, '#5b5a5a'); s.vline(0, 2, 78, '#807e7e')
    s.rect(0, 77, 6, 3, '#3c3a3a')
    s.rect(1, 0, 2, 2, '#807e7e')
    for y in range(1, 4):                                    # barbed wire on top
        s.hline(4, y, 28, '#5b5a5a') if y == 2 else None
    for x in range(5, 32, 5):
        s.set(x, 1, '#807e7e'); s.set(x + 1, 3, '#807e7e')


def tree_bare(s):
    """5x7 tiles, a winter plane tree: trunk and bare branches only."""
    bark, twig = '#3d3226', '#4f4232'
    rng = noise(9)

    def branch(x, y, ang, ln, w):
        if ln < 4:
            return
        x2, y2 = x + math.cos(ang) * ln, y - math.sin(ang) * ln
        steps = int(ln)
        for i in range(steps + 1):
            px, py = x + (x2 - x) * i / steps, y + (y2 - y) * i / steps
            s.rect(int(px), int(py), max(1, w), max(1, w), bark if w > 1 else twig)
        for d in (-0.5, 0.45):
            branch(x2, y2, ang + d + rng.uniform(-0.2, 0.2), ln * rng.uniform(0.6, 0.75), w - 1)

    s.rect(37, 50, 6, 62, bark); s.vline(37, 50, 62, '#54463a'); s.vline(42, 50, 62, '#2a2219')
    s.rect(35, 108, 10, 4, bark)
    for ang, ln in ((1.2, 22), (1.9, 22), (1.55, 26), (0.7, 18), (2.5, 18)):
        branch(40, 54, ang, ln, 3)
    for _ in range(6):                                       # a few dead leaves hanging on
        x, y = rng.randint(10, 70), rng.randint(6, 40)
        if (x, y) in s.p:
            s.set(x, y + 1, '#8a5a2a')


def barrier(s):
    """3x2 tiles: a galvanised crowd barrier, for the queue."""
    m, hi = '#8a8a90', '#c5c5cc'
    s.rect(1, 6, 46, 2, m); s.hline(1, 6, 46, hi)
    s.rect(1, 22, 46, 2, m)
    s.rect(1, 6, 2, 22, m); s.rect(45, 6, 2, 22, m)
    for x in range(6, 44, 4):
        s.vline(x, 8, 14, m)
    s.rect(0, 28, 8, 2, '#5b5a5a'); s.rect(40, 28, 8, 2, '#5b5a5a')


MARKERS = [('marker_berghain', 'B', '#9b9b9b')]


def build():
    sheet = TileSheet(cols=24)
    F.ground(sheet)
    F.plaster(sheet)
    F.windows(sheet)
    F.doors(sheet)
    P.furniture(sheet)
    P.graffiti(sheet)
    sheet.group('friedrichshain')
    berghain(sheet.add('berghain', 22, 13))
    fence(sheet.add('fence', 2, 5))
    tree_bare(sheet.add('tree_bare', 5, 7))
    barrier(sheet.add('barrier', 3, 2))
    P.far(sheet)
    P.markers(sheet)
    for name, letter, col in MARKERS:
        s = sheet.add(name)
        s.rect(0, 0, 16, 16, col)
        s.rect(1, 1, 14, 14, shade(col, 0.55))
        s.rect(2, 2, 12, 12, col)
        s.text(6, 5, letter, '#121114')
        for x in range(0, 16, 2):
            s.set(x, 0, '#121114'); s.set(x + 1, 15, '#121114')
    return sheet


if __name__ == '__main__':
    sheet = build()
    master = sheet.compose()
    sheet.write_catalog(os.path.join(OUT, 'friedrichshain_street.json'))
    studio = Studio()
    try:
        studio.make('friedrichshain_street', master, os.path.join(OUT, 'friedrichshain_street.png'), scale=1)
    finally:
        studio.close()
    print('tiles: %dx%d' % (sheet.cols, sheet.rows), len(sheet.blocks), 'blocks')
