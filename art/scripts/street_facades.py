"""Neukölln street kit, part 1: ground, plaster, windows, balconies, doors, roofs."""
from spriteart import mix, noise, shade

BASES = {'a': '#4f4531', 'b': '#362f20', 'c': '#3f3c35', 'd': '#5b5340', 'e': '#493f27'}  # OG building colours
STONE = '#6f6a5e'
FRAME = '#d8d2c0'
WARM = '#e0a845'


# ------------------------------------------------------------------ ground
def asphalt(s, rng, dark=1.0, ox=0, oy=0, w=16, h=16):
    for y in range(h):
        for x in range(w):
            col = '#3a3a3e'
            r = rng.random()
            if r < 0.06:
                col = '#4a4a50'
            elif r < 0.10:
                col = '#2c2c30'
            s.set(ox + x, oy + y, shade(col, dark))


def ground(sheet):
    sheet.group('ground')
    rng = noise(11)
    for v in 'abc':
        s = sheet.add('pave_top_' + v)
        for y in range(16):
            for x in range(16):
                col = '#7d7770' if y < 2 else '#5f5b55'
                if y >= 2 and (x == (7 if v != 'b' else 3) or (v == 'b' and x == 11) or y == 9):
                    col = '#3d3a37'
                elif rng.random() < 0.08:
                    col = '#6a655e'
                s.set(x, y, col)
        if v == 'c':
            for i, (x, y) in enumerate(((10, 3), (11, 4), (11, 5), (12, 6), (12, 7), (13, 8))):
                s.set(x, y, '#2a2826')
    for v in 'ab':
        s = sheet.add('pave_fill_' + v)
        for y in range(16):
            for x in range(16):
                col = '#3d3a37'
                r = rng.random()
                if r < 0.10:
                    col = '#4b4743'
                elif r < 0.16:
                    col = '#2e2b29'
                s.set(x, y, col)
    for v in 'ab':
        s = sheet.add('curb_' + v)
        for y in range(16):
            for x in range(16):
                col = '#8a847b' if y < 2 else '#6b6762'
                if x == (9 if v == 'a' else 4) and y >= 2:
                    col = '#3d3a37'
                if y > 12:
                    col = shade(col, 0.7)
                s.set(x, y, col)
    for v in 'abc':
        s = sheet.add('cobble_top_' + v)
        for row in range(4):
            off = (row % 2) * 3 + (2 if v == 'b' else 0) + (1 if v == 'c' and row > 1 else 0)
            for x in range(16):
                for y in range(row * 4, row * 4 + 4):
                    k = (x + off) % 6
                    col = '#2f2c29' if k == 5 or y == row * 4 + 3 else '#6a665f'
                    if col != '#2f2c29' and (y == row * 4 and k < 4):
                        col = '#7f7a72'
                    if col == '#6a665f' and rng.random() < 0.15:
                        col = '#59554f'
                    s.set(x, y, col)
    s = sheet.add('cobble_fill')
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#2f2c29' if (x + (y // 4) * 3) % 6 == 5 or y % 4 == 3 else '#4a463f')
    for v in 'ab':
        s = sheet.add('asphalt_top_' + v)
        asphalt(s, rng)
        if v == 'b':
            s.line(2, 5, 7, 9, '#232326'); s.line(7, 9, 9, 8, '#232326'); s.line(9, 8, 14, 12, '#232326')
        s.rect(0, 0, 16, 2, '#4d4d52')
    s = sheet.add('asphalt_fill')
    asphalt(s, rng, 0.75)
    s = sheet.add('crosswalk_top')
    asphalt(s, rng)
    s.rect(0, 0, 16, 2, '#4d4d52')
    for x in (1, 9):
        s.rect(x, 2, 6, 14, '#cfcabd')
    s = sheet.add('bikelane_top')
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#8a2f2a' if rng.random() > 0.08 else '#a04038')
    s.rect(0, 0, 16, 2, '#a8483f')
    s.rect(0, 14, 16, 2, '#cfcabd')
    s = sheet.add('manhole_top')
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#7d7770' if y < 2 else '#5f5b55')
    s.ellipse(8, 9, 6.5, 5.5, '#2a2826')
    s.ellipse(8, 9, 5.5, 4.5, '#47433c')
    for x in range(4, 13, 2):
        s.line(x, 6, x, 12, '#3a3733')
    s = sheet.add('grate_top')
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#7d7770' if y < 2 else '#5f5b55')
    s.rect(3, 5, 10, 8, '#1d1b1b')
    for x in range(4, 13, 2):
        s.vline(x, 6, 6, '#5b5a5a')
    # transparent decals for the props layer
    s = sheet.add('puddle')
    s.ellipse(8, 12, 7, 2.5, '#26304d')
    s.ellipse(7, 12, 4, 1.2, '#4a5b8a')
    s.set(10, 12, '#c46927'); s.set(11, 12, '#c46927')
    s = sheet.add('litter_a')
    for x, y, col in ((3, 14, '#dcd6c6'), (4, 14, '#dcd6c6'), (9, 15, '#d28c6b'), (11, 14, '#be2633'),
                      (12, 14, '#be2633'), (6, 15, '#a7a5a5'), (13, 15, '#dcd6c6'), (2, 15, '#b3ac99')):
        s.set(x, y, col)
    s = sheet.add('litter_b')
    s.rect(4, 12, 3, 4, '#2fa84a')
    s.set(5, 11, '#2fa84a')
    s.rect(4, 14, 3, 1, '#dcd6c6')
    s.rect(10, 14, 4, 2, '#dcd6c6')
    s.hline(10, 14, 4, '#a7a5a5')
    s = sheet.add('leaves')
    for x, y, col in ((2, 15, '#8a5a2a'), (3, 14, '#a97b4f'), (6, 15, '#8a5a2a'), (9, 14, '#c46927'), (10, 15, '#8a5a2a'),
                      (13, 15, '#a97b4f'), (12, 14, '#8a5a2a')):
        s.set(x, y, col)


# ----------------------------------------------------------------- plaster
def plaster_tile(s, base, rng, kind):
    for y in range(16):
        for x in range(16):
            col = base
            r = rng.random()
            if r < 0.05:
                col = shade(base, 1.08)
            elif r < 0.09:
                col = shade(base, 0.92)
            s.set(x, y, col)
    if kind == 'dirty':
        for x0 in (3, 9, 13):
            for y in range(rng.randint(8, 16)):
                s.set(x0, y, shade(base, 0.82))
                if y < 7:
                    s.set(x0 + 1, y, shade(base, 0.9))
    elif kind == 'damaged':
        brick = '#6b3f2f'
        for (x, y) in ((5, 5), (6, 5), (7, 5), (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (5, 7), (6, 7), (7, 7), (8, 7), (6, 8), (7, 8)):
            s.set(x, y, brick if (x + y) % 3 else shade(brick, 0.8))
        s.hline(4, 9, 3, shade(base, 0.8))
        s.set(9, 7, shade(base, 0.8))
    elif kind == 'band':
        s.rect(0, 0, 16, 2, shade(base, 1.45))
        s.rect(0, 2, 16, 4, shade(base, 1.2))
        s.rect(0, 6, 16, 1, shade(base, 0.55))
        for x in range(16):
            s.set(x, 7, shade(base, 0.75))
    elif kind == 'plinth':
        s.rect(0, 9, 16, 7, '#47433c')
        s.hline(0, 9, 16, '#7d7770')
        s.hline(0, 10, 16, '#5f5b55')
        for x in (5, 12):
            s.vline(x, 11, 5, '#2a2826')
        s.hline(0, 15, 16, '#2a2826')


def plaster(sheet):
    sheet.group('facade')
    rng = noise(21)
    for key, base in BASES.items():
        for kind in ('plain', 'dirty', 'damaged', 'band', 'plinth'):
            plaster_tile(sheet.add('wall_%s_%s' % (kind, key)), base, rng, kind)
    # roofline: cornice (2 tiles tall) in each plaster colour, then slate roof, chimney, dormer, aerial
    for key, base in BASES.items():
        s = sheet.add('cornice_' + key, 1, 2)
        for y in range(32):
            for x in range(16):
                if y < 4:
                    col = shade(base, 1.7)
                elif y < 6:
                    col = shade(base, 1.3)
                elif y < 10:
                    col = shade(base, 0.7) if (x // 2) % 2 == 0 else shade(base, 1.25)
                elif y < 16:
                    col = shade(base, 1.1)
                elif y < 20:
                    col = shade(base, 0.55 + (y - 16) * 0.1)
                else:
                    col = base
                s.set(x, y, col)
    rng = noise(33)
    s = sheet.add('roof_slate')
    for y in range(16):
        for x in range(16):
            col = '#2b2b33'
            if y % 4 == 3:
                col = '#1a1a20'
            elif (x + (y // 4) * 4) % 8 == 7:
                col = '#202027'
            elif rng.random() < 0.08:
                col = '#383842'
            s.set(x, y, col)
    s.rect(0, 0, 16, 1, '#41414d')
    s = sheet.add('roof_ridge')
    s.rect(0, 10, 16, 6, '#2b2b33')
    s.rect(0, 8, 16, 2, '#41414d')
    s.hline(0, 10, 16, '#1a1a20')
    s = sheet.add('chimney', 1, 3)
    s.rect(2, 0, 12, 4, '#2a2826')
    s.rect(1, 3, 14, 2, '#47433c')
    s.rect(3, 5, 10, 43, '#6b3f2f')
    for y in range(6, 48, 4):
        s.hline(3, y, 10, '#4a2a20')
        for x in range(5 + (y // 4 % 2) * 3, 13, 6):
            s.vline(x, y + 1, 3, '#4a2a20')
    s.vline(12, 5, 43, '#4a2a20')
    s = sheet.add('dormer', 2, 3)
    s.rect(0, 14, 32, 34, '#2b2b33')
    for y in range(14, 48, 4):
        s.hline(0, y + 3, 32, '#1a1a20')
    s.rect(6, 10, 20, 38, '#4f4531')
    s.rect(4, 8, 24, 3, '#8a8476')
    s.rect(9, 18, 14, 20, '#d8d2c0')
    s.rect(11, 20, 10, 16, '#e0a845')
    s.vline(15, 20, 16, '#d8d2c0'); s.hline(11, 27, 10, '#d8d2c0')
    s.rect(7, 40, 18, 3, '#8a8476')
    s.rect(10, 3, 12, 6, '#2b2b33'); s.hline(10, 3, 12, '#41414d')
    s = sheet.add('aerial', 1, 2)
    s.vline(8, 4, 28, '#5b5a5a')
    for y, half in ((6, 6), (10, 5), (14, 6), (18, 4)):
        s.hline(8 - half, y, half * 2 + 1, '#807e7e')
    s.rect(6, 30, 5, 2, '#2a2826')


# ----------------------------------------------------------------- windows
def pane_rects():
    return [(5, 7, 10, 14), (17, 7, 10, 14), (5, 23, 10, 16), (17, 23, 10, 16)]


def window(s, style):
    s.rect(0, 0, 32, 48, STONE)
    s.rect(0, 0, 32, 4, '#8a8476')
    s.hline(0, 0, 32, '#a29c8b')
    s.rect(13, 0, 6, 6, '#b3ac99')              # keystone
    s.hline(13, 5, 6, '#7a7467')
    s.vline(0, 4, 38, '#5f5b55'); s.vline(31, 4, 38, '#5f5b55')
    s.rect(0, 42, 32, 6, '#a29c8b')
    s.hline(0, 42, 32, '#c9c2ae')
    s.rect(0, 46, 32, 2, '#3c3a3a')
    s.rect(3, 5, 26, 36, FRAME)
    s.vline(3, 5, 36, '#b3ac99')
    for (x, y, w, h) in pane_rects():
        s.rect(x, y, w, h, '#0e1320')
    lit = style in ('lit', 'curtain', 'plants', 'shutter')
    if lit:
        for (x, y, w, h) in pane_rects():
            for yy in range(h):
                s.hline(x, y + yy, w, '#f2c668' if yy < h * 0.35 else WARM if yy < h * 0.75 else '#cc8a35')
    if style == 'dark':
        for (x, y, w, h) in pane_rects():
            s.line(x + 1, y + 4, x + 4, y + 1, '#1b2438')
            s.line(x + 2, y + 7, x + 7, y + 2, '#161d2e')
    if style == 'curtain':
        cur = '#c9566e'
        for (x, y, w, h) in pane_rects():
            for yy in range(min(h, 11)):
                s.hline(x, y + yy, 3 - yy // 6, cur)
                s.hline(x + w - 3 + yy // 6, y + yy, 3 - yy // 6, cur)
            s.vline(x + 1, y, 6, shade(cur, 0.75))
            s.vline(x + w - 2, y, 6, shade(cur, 0.75))
    if style == 'shutter':
        for yy in range(7, 33):
            col = '#5b5a5a' if yy % 3 else '#2e2d2d'
            s.hline(5, yy, 22, col)
        s.hline(5, 33, 22, '#f2c668')
        s.hline(5, 34, 22, '#2e2d2d')
        s.rect(13, 31, 6, 2, '#3c3a3a')
    if style == 'tv':
        for (x, y, w, h) in pane_rects():
            for yy in range(h):
                s.hline(x, y + yy, w, '#2f5f9a' if yy % 5 else '#8ec5ff')
        s.rect(5, 33, 10, 6, '#16181e')
        s.rect(17, 33, 10, 6, '#16181e')
    s.hline(3, 21, 26, FRAME); s.hline(3, 22, 26, '#b3ac99')
    s.vline(15, 7, 32, FRAME); s.vline(16, 7, 32, '#b3ac99')
    s.hline(3, 40, 26, '#b3ac99')
    if style == 'plants':
        s.rect(4, 37, 24, 4, '#6b4a2f')
        s.hline(4, 37, 24, '#8a6240')
        rng = noise(5)
        for x in range(5, 27, 2):
            h = rng.randint(3, 6)
            s.vline(x, 36 - h, h, '#1a7a2a')
            s.set(x + 1, 36 - h + 1, '#12501f')
            if x % 6 == 1:
                s.set(x, 36 - h - 1, '#d26ba0')
                s.set(x + 1, 36 - h, '#ff71f0')


def windows(sheet):
    sheet.group('windows')
    for style in ('dark', 'lit', 'curtain', 'shutter', 'plants', 'tv'):
        window(sheet.add('window_' + style, 2, 3), style)


# ---------------------------------------------------------------- balconies
def balcony(s, kind):
    slab = '#5f5b55'
    s.rect(0, 26, 64, 2, '#8a8476')
    s.rect(0, 28, 64, 3, slab)
    s.rect(0, 31, 64, 1, '#2a2826')
    for x in (4, 54):
        s.rect(x, 28, 6, 2, '#6f6a5e')
    iron = '#1d1b1b'
    s.rect(1, 6, 62, 2, '#2c2929')
    s.hline(1, 6, 62, '#3c3a3a')
    s.hline(1, 24, 62, iron)
    for x in range(2, 63, 4):
        s.vline(x, 8, 16, iron)
        s.set(x - 1, 14, '#2c2929'); s.set(x + 1, 18, '#2c2929')
    s.vline(1, 6, 20, iron); s.vline(62, 6, 20, iron)
    if kind == 'plants':
        for cx in (12, 46):
            s.rect(cx - 4, 21, 8, 5, '#c46927')
            s.rect(cx - 5, 20, 10, 2, '#e08a3c')
            for dx, dy, r in ((-3, 12, 4), (3, 11, 4), (0, 6, 4), (-5, 16, 3), (5, 16, 3)):
                s.ellipse(cx + dx, dy, r, r - 0.5, '#1a7a2a')
            s.set(cx - 1, 6, '#ff71f0'); s.set(cx + 4, 12, '#d26ba0'); s.set(cx - 5, 15, '#ff71f0')
    elif kind == 'dish':
        s.ellipse(44, 14, 8, 6, '#cfcabd')
        s.ellipse(44, 14, 6.5, 4.5, '#9a968a')
        s.line(44, 14, 40, 22, '#5b5a5a')
        s.rect(38, 20, 8, 5, '#3c3a3a')
        s.rect(12, 18, 10, 7, '#6b4a2f')          # crate with a chair-like silhouette
        s.rect(12, 14, 2, 4, '#6b4a2f')
    elif kind == 'laundry':
        s.hline(4, 9, 56, '#a7a5a5')
        for x, w, h, col in ((8, 7, 9, '#be2633'), (18, 6, 7, '#dcd6c6'), (28, 8, 10, '#3460d9'), (40, 6, 8, '#d2d631'), (50, 7, 9, '#dcd6c6')):
            s.rect(x, 10, w, h, col)
            s.hline(x, 10, w, shade(col, 1.2))


def balconies(sheet):
    sheet.group('balconies')
    for kind in ('plain', 'plants', 'dish', 'laundry'):
        balcony(sheet.add('balcony_' + kind, 4, 2), kind)


# -------------------------------------------------------------------- doors
def apartment_door(s, wood, ring_lit):
    s.rect(0, 0, 48, 64, STONE)
    s.rect(0, 0, 48, 3, '#8a8476')
    s.rect(2, 3, 44, 61, '#8a8476')
    s.ellipse(24, 15, 17, 13, '#6f6a5e')           # arch
    s.rect(7, 14, 34, 50, '#6f6a5e')
    s.ellipse(24, 15, 15, 11, '#1d1b1b')
    s.rect(9, 15, 30, 49, '#1d1b1b')
    for y in range(5, 15):                          # fanlight
        for x in range(9, 39):
            if ((x - 24) / 14.5) ** 2 + ((y - 15) / 10.5) ** 2 <= 1:
                s.set(x, y, '#e0a845' if ring_lit else '#16181e')
    for x in range(12, 37, 4):
        s.line(24, 15, x, 4 if x < 20 or x > 28 else 4, '#6b4a2f')
    s.hline(9, 15, 30, wood)
    s.rect(9, 16, 14, 40, wood)
    s.rect(25, 16, 14, 40, wood)
    for lx in (9, 25):
        s.rect(lx + 2, 19, 10, 15, shade(wood, 0.75))
        s.rect(lx + 2, 37, 10, 16, shade(wood, 0.75))
        s.hline(lx + 2, 19, 10, shade(wood, 1.25))
        s.hline(lx + 2, 37, 10, shade(wood, 1.25))
    s.vline(23, 16, 40, '#1d1b1b'); s.vline(24, 16, 40, '#1d1b1b')
    s.rect(20, 36, 2, 4, '#c6c754'); s.rect(26, 36, 2, 4, '#c6c754')
    s.rect(38, 9, 5, 4, '#b3ac99')                  # number plate
    s.text(39, 10, '12', '#121114')
    s.rect(4, 56, 40, 8, '#6f6a5e')                 # stoop
    s.hline(4, 56, 40, '#a29c8b')
    s.rect(2, 60, 44, 4, '#5f5b55')
    s.hline(2, 60, 44, '#8a8476')


def passage(s):
    s.rect(0, 0, 64, 64, STONE)
    s.rect(0, 0, 64, 4, '#8a8476')
    s.ellipse(32, 24, 28, 22, '#8a8476')
    s.rect(4, 24, 56, 40, '#8a8476')
    s.ellipse(32, 24, 24, 19, '#1d1b1b')
    s.rect(8, 24, 48, 40, '#1d1b1b')
    for y in range(8, 64):                           # courtyard glow far away
        for x in range(14, 50):
            d = abs(x - 32) / 18
            if y > 18 and d < 1 and ((x - 32) / 18) ** 2 + ((y - 30) / 14) ** 2 < 1:
                s.set(x, y, '#3a2e1c' if d > 0.55 else '#5e4a28')
    s.rect(26, 28, 12, 16, '#c6a455')
    s.rect(28, 30, 8, 12, '#f0d58a')
    s.rect(8, 56, 48, 8, '#2f2c29')                  # cobbles
    for x in range(8, 56, 5):
        s.vline(x, 56, 8, '#1d1b1b')
    s.rect(7, 6, 3, 58, '#5f5b55'); s.rect(54, 6, 3, 58, '#5f5b55')
    s.rect(29, 3, 6, 5, '#b3ac99')


def doors(sheet):
    sheet.group('doors')
    apartment_door(sheet.add('door_apt_brown', 3, 4), '#4a321f', True)
    apartment_door(sheet.add('door_apt_green', 3, 4), '#1f4a3a', False)
    passage(sheet.add('passage', 4, 4))
