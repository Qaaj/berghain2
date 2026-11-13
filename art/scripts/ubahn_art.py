"""U-Bahn station tile kits (for the Sprite Fusion editor) and train sprites (entities).

Run:  python3 art/scripts/ubahn_art.py            (both stations and the train)
      python3 art/scripts/ubahn_art.py fhain      (only some of: neukoelln fhain train)
Writes  art/tilesets/ubahn_station.png/.json (Neukölln, U7), art/tilesets/ubahn_fhain.png/.json (Friedrichshain,
U5) (+ .aseprite), and public/assets/ubahn/train_*.png (3x).

Both stations share block names (wall_clean, pillar_mid_a, bench...) so the map scripts lay them out the same
way; a THEME decides how they look.
"""
import os
import sys

from sheet import TileSheet
from spriteart import ART_DIR, Sprite, Studio, mix, noise, shade
from street_props import tag

WALL = '#b9b199'
GROUT = '#8c8570'
BLUE = '#2a5a8a'
LINE = '#528dba'          # U7
DARK_BLUE = '#1f3a5f'
YELLOW = '#e2b514'

# Neukölln: beige brick-bond tiles, a blue U7 band, tiled pillars. Friedrichshain: glossy green square tiles,
# a brown U5 band, oxblood dado and riveted steel columns, so you can tell at a glance you got off elsewhere.
THEMES = {
    'neukoelln': dict(
        kit='ubahn_station', pattern='brick', wall=WALL, grout=GROUT, band=BLUE, dado=DARK_BLUE,
        line='U7', line_col=LINE, pillar='tiled', ceiling='#2c2c33',
        signs=(('station_sign_neukoelln', 'NEUKOELLN', 4), ('station_sign_rudow', 'RUDOW', 4)),
        board=('U7 RUDOW 2', 'U7 RUDOW 7'),
    ),
    'fhain': dict(
        kit='ubahn_fhain', pattern='square', wall='#5fa58f', grout='#2f6a5a', band='#7e5330', dado='#5a2426',
        line='U5', line_col='#7e5330', pillar='steel', ceiling='#3a3632',
        signs=(('station_sign_fhain', 'FRIEDRICHSHAIN', 6), ('station_sign_hoenow', 'HOENOW', 4)),
        board=('U5 HOENOW 4', 'U5 HOENOW 9'),
    ),
}
T = THEMES['neukoelln']   # the theme being drawn; build() sets it


# ------------------------------------------------------------- structure
def wall_tile(s, rng, variant):
    if T['pattern'] == 'square':
        return square_tile(s, rng, variant)
    for y in range(16):
        for x in range(16):
            row = y // 4
            off = 4 if row % 2 else 0
            col = WALL
            if y % 4 == 3 or (x + off) % 8 == 7:
                col = GROUT
            elif y % 4 == 0:
                col = '#c7c0a8'
            elif rng.random() < 0.05:
                col = '#aea68e'
            s.set(x, y, col)
    if variant == 'stained':
        for x0, ln in ((4, 14), (11, 9)):
            for y in range(ln):
                s.set(x0, y, '#8c8268'); s.set(x0 + 1, y, '#a39a80') if y < 8 else None
    elif variant == 'cracked':
        for (x, y) in ((8, 1), (8, 2), (9, 3), (9, 4), (10, 5), (9, 6), (9, 7), (8, 8), (7, 9), (7, 10), (6, 11)):
            s.set(x, y, '#5f5a4a')


def square_tile(s, rng, variant):
    """Glossy 8px square tiles with a bevel: light top-left, dark grout bottom-right."""
    wall, grout = T['wall'], T['grout']
    hi, lo = shade(wall, 1.25), shade(wall, 0.85)
    for y in range(16):
        for x in range(16):
            tx, ty = x % 8, y % 8
            col = wall
            if tx == 7 or ty == 7:
                col = grout
            elif tx == 0 or ty == 0:
                col = hi
            elif tx == 6 or ty == 6:
                col = lo
            elif (tx, ty) in ((2, 1), (1, 2), (2, 2)):
                col = '#d8f0e6'                       # the shine on each tile
            elif rng.random() < 0.04:
                col = lo
            s.set(x, y, col)
    if variant == 'stained':
        for x0, ln in ((3, 15), (12, 10)):
            for y in range(ln):
                s.set(x0, y, '#3f6a5a')
    elif variant == 'cracked':                        # a missing tile showing the concrete behind
        s.rect(8, 8, 7, 7, '#6d6a66'); s.rect(9, 9, 5, 5, '#5a5753'); s.set(10, 11, '#3a3836')


def station_structure(sheet):
    sheet.group('walls and floor')
    rng = noise(61)
    for v in ('clean', 'stained', 'cracked'):
        wall_tile(sheet.add('wall_' + v), rng, v)
    s = sheet.add('wall_band')                     # the line-coloured stripe
    wall_tile(s, rng, 'clean')
    s.rect(0, 3, 16, 10, T['band'])
    s.hline(0, 3, 16, shade(T['band'], 1.5)); s.hline(0, 12, 16, shade(T['band'], 0.5))
    s.hline(0, 7, 16, '#ffffff')
    s = sheet.add('wall_dado')                     # dark tiles along the foot of the wall
    for y in range(16):
        for x in range(16):
            col = T['dado']
            if y % 8 == 7 or x % 8 == 7:
                col = shade(T['dado'], 0.6)
            elif y % 8 == 0 or x % 8 == 0:
                col = shade(T['dado'], 1.3)
            s.set(x, y, col)
    for name, lamp in (('ceiling', False), ('ceiling_lamp', True)):
        s = sheet.add(name)
        for y in range(16):
            for x in range(16):
                s.set(x, y, T['ceiling'] if y < 14 else '#1a1a20')
        s.hline(0, 14, 16, '#41414d')
        if lamp and T['pillar'] == 'steel':           # a long fluorescent tube instead of a lamp box
            s.rect(0, 9, 16, 2, '#e8fff4'); s.hline(0, 11, 16, '#7a8a84')
            s.rect(0, 8, 2, 4, '#5b5a5a'); s.rect(14, 8, 2, 4, '#5b5a5a')
        elif lamp:
            s.rect(2, 8, 12, 3, '#f4f1d0')
            s.hline(2, 8, 12, '#ffffff')
            for x in (1, 14):
                s.rect(x, 7, 1, 5, '#8a8a90')
            s.set(0, 15, '#5a5638'); s.set(15, 15, '#5a5638')
    s = sheet.add('beam')
    s.rect(0, 0, 16, 10, T['ceiling'])
    s.hline(0, 0, 16, '#41414d'); s.rect(0, 10, 16, 2, '#1a1a20')
    for x in range(2, 16, 5):
        s.set(x, 4, '#41414d')
    for v in 'abc':
        s = sheet.add('floor_top_' + v)
        for y in range(16):
            for x in range(16):
                col = '#8a8681' if y < 2 else '#6d6a66'
                if y >= 2 and (x == 15 or y == 15):
                    col = '#4a4744'
                elif rng.random() < 0.10:
                    col = '#7d7973' if rng.random() < 0.5 else '#5a5753'
                s.set(x, y, col)
        if v == 'c':
            s.line(3, 4, 7, 8, '#3a3836'); s.line(7, 8, 6, 12, '#3a3836')
    s = sheet.add('floor_edge')                    # safety strip with a tactile guidance line
    for y in range(16):
        for x in range(16):
            col = '#6d6a66'
            if y < 2:
                col = '#e8e4d6'
            elif y < 5:
                col = '#e3b81a' if (x // 2) % 2 == 0 else '#b88f10'
            elif y == 15 or x == 15:
                col = '#4a4744'
            elif rng.random() < 0.08:
                col = '#7d7973'
            s.set(x, y, col)
    for v in 'ab':
        s = sheet.add('floor_fill_' + v)
        for y in range(16):
            for x in range(16):
                col = '#3a3836'
                if rng.random() < 0.1:
                    col = '#4a4744'
                if y == 0:
                    col = '#2a2826'
                s.set(x, y, col)

    sheet.group('tracks')
    for v, off in (('a', 0), ('b', 3), ('c', 6)):
        s = sheet.add('track_' + v)
        for y in range(16):
            for x in range(16):
                s.set(x, y, '#3a3733' if rng.random() > 0.14 else '#4a4640')
        for x in range(off % 8 - 8, 16, 8):
            s.rect(x, 2, 3, 13, '#4a321f')
            s.vline(x, 2, 13, '#6b4a2f')
        for ry in (4, 12):
            s.rect(0, ry, 16, 2, '#8a8a90')
            s.hline(0, ry, 16, '#c5c5cc')
            s.hline(0, ry + 2, 16, '#2c2c33')
        s.rect(0, 8, 16, 2, '#2c2c33')            # power rail with its cover
        s.hline(0, 8, 16, '#e3b81a')
    s = sheet.add('track_pit')                       # dark gap under the platform lip
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#1a1a20' if y > 3 else '#2c2c33')

    sheet.group('pillars')
    if T['pillar'] == 'steel':
        return steel_pillars(sheet)
    s = sheet.add('pillar_cap')
    s.rect(0, 0, 16, 5, '#41414d'); s.rect(1, 5, 14, 11, WALL)
    s.hline(0, 0, 16, '#5a5a68')
    for x in (4, 9):
        s.vline(x, 5, 11, GROUT)
    s.vline(14, 5, 11, shade(WALL, 0.75))
    for v in 'ab':
        s = sheet.add('pillar_mid_' + v)
        s.rect(1, 0, 14, 16, WALL)
        for x in (4, 9):
            s.vline(x, 0, 16, GROUT)
        s.vline(14, 0, 16, shade(WALL, 0.75)); s.vline(1, 0, 16, '#c7c0a8')
        if v == 'b':
            s.rect(1, 5, 14, 6, BLUE); s.hline(1, 8, 14, '#ffffff')
    s = sheet.add('pillar_base')
    s.rect(1, 0, 14, 10, WALL)
    for x in (4, 9):
        s.vline(x, 0, 10, GROUT)
    s.vline(14, 0, 10, shade(WALL, 0.75))
    s.rect(0, 10, 16, 6, DARK_BLUE); s.hline(0, 10, 16, shade(DARK_BLUE, 1.5)); s.hline(0, 15, 16, '#121114')


def steel_pillars(sheet):
    """Riveted steel columns (an I-beam with a flange either side), the older Berlin station look."""
    steel, hi, lo = '#3d5a4c', '#5d8270', '#22362c'

    def column(s, y0, y1):
        s.rect(4, y0, 8, y1 - y0, steel)              # web
        s.rect(2, y0, 2, y1 - y0, hi); s.rect(12, y0, 2, y1 - y0, lo)   # flanges
        s.vline(6, y0, y1 - y0, shade(steel, 1.15))
        for y in range(y0 + 2, y1, 5):
            s.set(3, y, '#a7c4b4'); s.set(12, y, '#8aa898')

    s = sheet.add('pillar_cap')
    s.rect(0, 0, 16, 4, T['ceiling']); s.hline(0, 0, 16, '#5a5a68')
    s.rect(1, 4, 14, 3, lo); s.hline(1, 4, 14, hi)   # capital plate
    for x in (2, 5, 10, 13):
        s.set(x, 5, '#a7c4b4')
    column(s, 7, 16)
    for v in 'ab':
        s = sheet.add('pillar_mid_' + v)
        column(s, 0, 16)
        if v == 'b':                                  # a line plate bolted to the column
            s.rect(1, 4, 14, 8, T['band']); s.hline(1, 4, 14, '#ffffff'); s.hline(1, 11, 14, '#ffffff')
            s.text(4, 5, T['line'], '#ffffff')
    s = sheet.add('pillar_base')
    column(s, 0, 10)
    s.rect(1, 8, 14, 2, lo); s.hline(1, 8, 14, hi)
    s.rect(0, 10, 16, 6, T['dado']); s.hline(0, 10, 16, shade(T['dado'], 1.5)); s.hline(0, 15, 16, '#121114')


# --------------------------------------------------------------- props
def station_sign(s, name, w=4):
    px = w * 16
    s.rect(0, 2, px, 14, DARK_BLUE)
    s.hline(0, 2, px, '#ffffff'); s.hline(0, 15, px, '#ffffff')
    s.rect(0, 0, 2, 3, '#5b5a5a'); s.rect(px - 2, 0, 2, 3, '#5b5a5a')
    s.rect(3, 4, 14, 10, T['line_col'])
    s.text(5, 7, T['line'], '#ffffff')
    s.text(21, 7, name, '#ffffff')


def ticket_machine(s):
    s.rect(2, 0, 28, 46, YELLOW)
    s.rect(2, 0, 28, 2, '#f6cf3b'); s.vline(2, 0, 46, '#f6cf3b'); s.vline(29, 0, 46, '#a8860c')
    s.rect(4, 2, 24, 8, '#121114')
    s.text(8, 4, 'BVG', YELLOW, 1)
    s.rect(5, 12, 14, 13, '#0b1a2a')
    s.rect(6, 13, 12, 11, '#1a4a7a')
    for y in (15, 18, 21):
        s.hline(7, y, 10, '#71faff')
    s.rect(21, 12, 7, 11, '#2c2929')
    for yy in range(3):
        for xx in range(2):
            s.rect(22 + xx * 3, 13 + yy * 3, 2, 2, '#a7a5a5')
    s.rect(5, 28, 8, 3, '#121114'); s.rect(6, 29, 6, 1, '#71faff')   # card reader
    s.rect(16, 28, 4, 6, '#121114'); s.hline(17, 30, 2, '#c5c5cc')      # coins
    s.rect(8, 36, 16, 6, '#121114'); s.hline(8, 36, 16, '#5b5a5a')
    s.rect(2, 44, 28, 4, '#3c3a3a')


def vending(s, body, label):
    s.rect(1, 0, 14, 30, body)
    s.vline(1, 0, 30, shade(body, 1.3)); s.vline(14, 0, 30, shade(body, 0.6))
    s.rect(3, 2, 10, 14, '#121114')
    cols = ['#be2633', '#2fa84a', '#d2d631', '#3460d9', '#ff71f0', '#e08a3c']
    for r in range(3):
        for i in range(3):
            s.rect(4 + i * 3, 3 + r * 4, 2, 3, cols[(r * 3 + i) % len(cols)])
    s.rect(4, 22, 3, 3, '#a7a5a5'); s.rect(9, 22, 3, 3, '#a7a5a5')
    s.rect(3, 27, 10, 2, '#121114')
    s.rect(2, 30, 12, 2, '#3c3a3a')


def clock(s):
    s.ellipse(8, 8, 7, 7, '#121114')
    s.ellipse(8, 8, 6, 6, '#f0ece0')
    for x, y in ((8, 3), (8, 13), (3, 8), (13, 8)):
        s.set(x, y, '#121114')
    s.line(8, 8, 8, 4, '#121114'); s.line(8, 8, 11, 9, '#121114')
    s.set(8, 8, '#be2633')


def departure_board(s):
    s.rect(1, 1, 46, 14, '#121114')
    s.hline(1, 1, 46, '#5b5a5a'); s.hline(1, 14, 46, '#2c2929')
    s.text(4, 3, T['board'][0], '#ffb000')
    s.text(4, 9, T['board'][1], '#cc8a00')


def network_map(s):
    s.rect(0, 0, 32, 32, '#e8e4d6')
    s.rect(1, 1, 30, 4, DARK_BLUE)
    lines = (('#528dba', (3, 26), (28, 8)), ('#2fa84a', (3, 10), (28, 24)), ('#be2633', (16, 6), (16, 30)),
             ('#e3b81a', (4, 18), (28, 18)), ('#a06aa8', (4, 28), (14, 8)))
    for col, a, b in lines:
        s.line(a[0], a[1], b[0], b[1], col)
        s.line(a[0], a[1] + 1, b[0], b[1] + 1, col)
    for x, y in ((10, 20), (20, 14), (16, 18), (6, 18), (25, 22), (13, 10)):
        s.ellipse(x, y, 1.5, 1.5, '#ffffff'); s.set(x, y, '#121114')


def timetable(s):
    s.rect(2, 1, 12, 30, '#f0ece0')
    s.rect(2, 1, 12, 5, T['line_col'])
    s.text(4, 1, T['line'], '#ffffff')
    for y in range(8, 29, 4):
        s.hline(3, y, 10, '#a7a5a5')
        s.hline(3, y + 2, 6, '#3c3a3a')


def ad(s, bg, fg, text, k=1):
    s.rect(1, 1, 14, 30, bg)
    s.hline(1, 1, 14, shade(bg, 1.3))
    s.text(3 if len(text) < 4 else 2, 5, text, fg)
    s.rect(3, 14, 10, 8, shade(bg, 0.7)); s.rect(4, 15, 8, 6, shade(bg, 1.2))
    s.hline(3, 25, 10, fg); s.hline(3, 27, 7, fg)


def bench(s):
    s.rect(2, 3, 28, 2, '#a7a5a5')
    s.rect(2, 5, 28, 1, '#5b5a5a')
    s.rect(1, 8, 30, 3, '#8a8a90')
    for x in range(4, 29, 3):
        s.set(x, 9, '#3c3a3a')
    s.hline(1, 8, 30, '#c5c5cc')
    s.rect(3, 11, 2, 5, '#3c3a3a'); s.rect(27, 11, 2, 5, '#3c3a3a')
    s.vline(2, 3, 5, '#5b5a5a'); s.vline(29, 3, 5, '#5b5a5a')


def bin_small(s):
    s.rect(3, 2, 10, 14, '#5b5a5a')
    s.rect(2, 0, 12, 3, '#3c3a3a')
    s.rect(4, 6, 8, 5, '#2f7a47'); s.rect(5, 7, 6, 3, '#121114')
    s.vline(4, 3, 13, '#807e7e')


def stairs_exit(s):
    s.rect(0, 0, 48, 80, '#8c8570')
    for y in range(0, 80, 8):
        s.hline(0, y, 48, '#6f6a56')
    s.ellipse(24, 40, 18, 22, '#b9b199')
    s.rect(6, 40, 36, 40, '#b9b199')
    s.ellipse(24, 40, 15, 19, '#fff4c0')
    s.rect(9, 40, 30, 40, '#fff4c0')
    for i in range(9):                                       # steps climbing toward the light
        s.rect(9 + i * 3, 74 - i * 4, 30 - i * 3, 3, '#6d6a66')
        s.hline(9 + i * 3, 74 - i * 4, 30 - i * 3, '#8a8681')
        s.rect(9 + i * 3, 77 - i * 4, 30 - i * 3, 1, '#3a3836')
    s.rect(4, 4, 40, 11, '#127a2a')
    s.hline(4, 4, 40, '#2fa84a'); s.hline(4, 14, 40, '#0b4d1b')
    s.text(9, 7, 'AUSGANG', '#ffffff')
    s.rect(7, 62, 2, 18, '#5b5a5a'); s.rect(39, 62, 2, 18, '#5b5a5a')


def lamp_hang(s):
    s.vline(8, 0, 12, '#5b5a5a'); s.vline(3, 0, 6, '#5b5a5a'); s.vline(13, 0, 6, '#5b5a5a')
    s.rect(1, 12, 14, 3, '#3c3a3a'); s.rect(2, 15, 12, 3, '#f4f1d0'); s.hline(2, 15, 12, '#ffffff')
    s.rect(1, 18, 14, 2, '#8a8a90')


def sign_ausgang(s):
    s.rect(0, 3, 32, 11, '#127a2a')
    s.hline(0, 3, 32, '#2fa84a'); s.hline(0, 13, 32, '#0b4d1b')
    s.text(2, 6, 'EXIT', '#ffffff')
    s.line(22, 8, 28, 8, '#ffffff'); s.line(26, 6, 28, 8, '#ffffff'); s.line(26, 10, 28, 8, '#ffffff')


def sign_line(s):
    s.ellipse(8, 8, 7, 7, T['line_col'])
    s.ellipse(8, 8, 6, 6, '#ffffff'); s.ellipse(8, 8, 5, 5, T['line_col'])
    s.text(4, 6, T['line'], '#ffffff')


MARKERS = [('marker_start', 'P', '#2fa84a'), ('marker_exit', 'E', '#127a2a'), ('marker_train', 'T', '#e3b81a'),
           ('marker_ticket', 'V', '#71faff'), ('marker_smoker', 'S', '#d28c6b'), ('marker_weirdo', 'W', '#d26ba0')]


def station_props(sheet):
    sheet.group('signs and boards')
    for name, text, w in T['signs']:
        station_sign(sheet.add(name, w, 1), text, w)
    departure_board(sheet.add('departure_board', 3, 1))
    clock(sheet.add('clock'))
    sign_line(sheet.add('sign_' + T['line'].lower()))
    sign_ausgang(sheet.add('sign_exit', 2, 1))
    lamp_hang(sheet.add('lamp_hang', 1, 2))
    timetable(sheet.add('timetable', 1, 2))
    network_map(sheet.add('network_map', 2, 2))
    ad(sheet.add('ad_film', 1, 2), '#d2d631', '#121114', 'FILM')
    ad(sheet.add('ad_sale', 1, 2), '#be2633', '#f0ece0', 'SALE')
    ad(sheet.add('ad_bier', 1, 2), '#127a2a', '#f0ece0', 'BIER')
    sheet.group('platform furniture')
    ticket_machine(sheet.add('ticket_machine', 2, 3))
    vending(sheet.add('vending_snack', 1, 2), '#be2633', 'S')
    vending(sheet.add('vending_drink', 1, 2), '#2a5a8a', 'D')
    bench(sheet.add('bench', 2, 1))
    bin_small(sheet.add('bin'))
    stairs_exit(sheet.add('stairs_exit', 3, 5))
    sheet.group('graffiti')
    tag(sheet.add('tag_kotti', 3, 1), 'KOTTI', '#d2d631', 2, 4, 2)
    tag(sheet.add('tag_rave', 2, 1), 'RAVE', '#ff71f0', 2, 1, 2)
    tag(sheet.add('tag_toy', 2, 1), 'TOY', '#71faff', 2, 4, 2)
    sheet.group('markers')
    for name, letter, col in MARKERS:
        s = sheet.add(name)
        s.rect(0, 0, 16, 16, col)
        s.rect(1, 1, 14, 14, shade(col, 0.55))
        s.rect(2, 2, 12, 12, col)
        s.text(6, 5, letter, '#121114')
        for x in range(0, 16, 2):
            s.set(x, 0, '#121114'); s.set(x + 1, 15, '#121114')


def build(theme='neukoelln'):
    global T
    T = THEMES[theme]
    sheet = TileSheet(cols=16)
    station_structure(sheet)
    station_props(sheet)
    return sheet


# ---------------------------------------------------------------- train
CAR_W, CAR_H = 128, 80
BODY, BODY_HI, BODY_LO = '#d6a90e', '#f1c93a', '#a88108'


def train_car(open_doors, cab=False):
    s = Sprite(CAR_W, CAR_H, outline=True)
    x0 = 14 if cab else 1
    # body, with a nose on the cab
    for y in range(6, 66):
        left = x0
        if cab:
            left = 14 - int((y - 6) * 14 / 34) if y < 40 else 0
        for x in range(left, 127):
            s.set(x, y, BODY)
    s.rect(x0 if not cab else 8, 6, 127 - (x0 if not cab else 8), 2, BODY_HI)
    s.rect(2 if not cab else 0, 60, 126, 4, BODY_LO)
    s.rect(1, 64, 126, 6, '#1d1b1b')                   # skirt
    s.rect(1, 66, 126, 1, '#3c3a3a')
    # roof
    s.rect(x0 + (6 if cab else 0), 0, 122 - (6 if cab else 0) - x0 + 4, 6, '#a7a5a5')
    s.hline(x0 + (6 if cab else 0), 0, 118, '#c5c5cc')
    for ax in (30, 60, 88):
        s.rect(ax, 0, 12, 3, '#807e7e'); s.hline(ax, 0, 12, '#c5c5cc')
    s.rect(1 if not cab else 14, 5, 126, 1, '#5b5a5a')
    # doors
    door_x = [38] if cab else [10]
    door_x.append(98)
    for dx in door_x:
        if open_doors:
            s.rect(dx, 10, 20, 52, '#16131a')
            s.rect(dx + 1, 10, 18, 3, '#f2e9b0')
            s.rect(dx + 1, 56, 18, 6, '#6b6a58')
            s.rect(dx + 9, 12, 2, 46, BODY)
            for sy in (36,):
                s.rect(dx + 2, sy, 5, 12, '#2a3d5a'); s.rect(dx + 13, sy, 5, 12, '#2a3d5a')
            s.rect(dx - 1, 10, 2, 52, BODY_LO); s.rect(dx + 19, 10, 2, 52, BODY_LO)
        else:
            s.rect(dx, 10, 20, 52, BODY_LO)
            for leaf in (dx + 1, dx + 11):
                s.rect(leaf, 12, 8, 48, shade(BODY, 0.9))
                s.rect(leaf + 1, 15, 6, 28, '#0e1320')
                s.line(leaf + 1, 28, leaf + 5, 17, '#2a4050')
            s.vline(dx + 10, 10, 52, '#1d1b1b')
            s.rect(dx + 8, 46, 1, 6, '#1d1b1b'); s.rect(dx + 12, 46, 1, 6, '#1d1b1b')
    # windows
    wx0 = 62 if cab else 34
    for i in range(4):
        wx = wx0 + i * 16 if not cab else wx0 + i * 16
        if wx + 13 > 96:
            continue
        s.rect(wx, 14, 13, 28, '#0b1a22')
        s.rect(wx + 1, 15, 11, 26, '#1a2b33')
        s.hline(wx + 1, 15, 11, '#e0d58a')               # ceiling lights seen inside
        s.line(wx + 2, 36, wx + 8, 20, '#2a4050')
        s.rect(wx + 1, 34, 11, 7, '#2a3a2a' if i % 2 else '#3a2a2a')   # seats
    # lettering
    s.text(56 if not cab else 80, 48, 'BVG', '#121114', 2)
    s.hline(1, 44, 126, BODY_LO)
    # cab details
    if cab:
        for y in range(10, 34):
            left = 14 - int((y - 6) * 14 / 34) + 2
            for x in range(left, 24):
                s.set(x, y, '#0b1a22')
        s.rect(26, 8, 10, 6, '#121114'); s.text(27, 9, 'U7', '#ffb000')
        s.rect(1, 46, 3, 3, '#f6f2d0'); s.rect(1, 53, 3, 3, '#f6f2d0')
        s.rect(0, 58, 12, 3, '#3c3a3a')
    # bogies
    for wx in (16, 112) if not cab else (18, 112):
        s.rect(wx - 12, 68, 24, 4, '#2c2929')
        for ox in (-6, 6):
            s.ellipse(wx + ox, 73, 6.5, 6.5, '#121114')
            s.ellipse(wx + ox, 73, 3.5, 3.5, '#807e7e')
            s.set(wx + ox, 73, '#3c3a3a')
    return s


def make_train(studio):
    for name, open_doors, cab in (('train_car', False, False), ('train_car_open', True, False),
                                  ('train_cab', False, True), ('train_cab_open', True, True)):
        studio.make('ubahn_' + name, train_car(open_doors, cab), 'ubahn/%s.png' % name)
        print('drew', name)


if __name__ == '__main__':
    only = sys.argv[1:] or [*THEMES, 'train']
    studio = Studio()
    try:
        for theme in THEMES:
            if theme not in only:
                continue
            sheet = build(theme)
            master = sheet.compose()
            kit = THEMES[theme]['kit']
            sheet.write_catalog(os.path.join(ART_DIR, 'tilesets', kit + '.json'))
            studio.make(kit, master, os.path.join(ART_DIR, 'tilesets', kit + '.png'), scale=1)
            print('%s tiles: %dx%d' % (kit, sheet.cols, sheet.rows), len(sheet.blocks), 'blocks')
        if 'train' in only:
            make_train(studio)
    finally:
        studio.close()
