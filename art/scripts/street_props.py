"""Neukölln street kit, part 3: street furniture, trees, vehicles, graffiti, skyline and marker tiles."""
from spriteart import mix, noise, shade

IRON = '#1d1b1b'


# ---------------------------------------------------------------- furniture
def lamp(s):
    s.rect(14, 12, 2, 52, '#5b5a5a')
    s.vline(14, 12, 52, '#807e7e')
    s.rect(11, 56, 8, 8, '#3c3a3a'); s.rect(12, 52, 6, 4, '#47433c')
    s.hline(11, 56, 8, '#5b5a5a')
    s.rect(9, 11, 12, 3, '#2c2929')
    s.rect(8, 2, 14, 9, '#2c2929')
    s.rect(10, 3, 10, 7, '#f0d070')
    s.rect(12, 4, 6, 5, '#fff4b8')
    s.rect(11, 0, 8, 2, '#2c2929'); s.rect(13, 0, 4, 1, '#5b5a5a')
    for x, y in ((6, 5), (24, 5), (7, 9), (23, 9), (4, 7), (26, 7)):    # glow dither
        s.set(x, y, '#6b5a20')


def tree(sheet):
    rng = noise(44)
    s = sheet.add('tree_crown', 5, 4)
    for cx, cy, rx, ry in ((40, 34, 36, 26), (20, 40, 19, 18), (60, 40, 19, 18), (40, 18, 26, 16), (22, 24, 16, 14), (58, 24, 16, 14)):
        s.ellipse(cx, cy, rx, ry, '#0c2a14')
    for (x, y), col in list(s.p.items()):
        r = rng.random()
        if r < 0.22:
            s.set(x, y, '#12401f')
        elif r < 0.30 and y < 34:
            s.set(x, y, '#1c5c2e')
        elif r < 0.34:
            s.set(x, y, '#081c0e')
    for _ in range(16):                                       # fairy lights
        x, y = rng.randint(8, 72), rng.randint(14, 56)
        if (x, y) in s.p:
            s.set(x, y, '#ffd878')
    s = sheet.add('tree_trunk', 1, 3)
    s.rect(5, 0, 6, 48, '#3d2a1c')
    s.vline(5, 0, 48, '#5a3f28'); s.vline(10, 0, 48, '#2a1c12')
    s.rect(3, 42, 10, 6, '#3d2a1c'); s.rect(2, 45, 12, 3, '#3d2a1c')
    for y in range(4, 44, 6):
        s.set(7, y, '#2a1c12'); s.set(8, y + 2, '#2a1c12')
    s.rect(4, 14, 2, 14, '#1a7a2a')                           # ivy
    s = sheet.add('tree_small', 3, 4)
    s.ellipse(24, 16, 17, 13, '#0c2a14')
    s.ellipse(17, 20, 10, 8, '#12401f'); s.ellipse(30, 18, 9, 8, '#12401f')
    for _ in range(8):
        x, y = rng.randint(10, 38), rng.randint(6, 26)
        if (x, y) in s.p:
            s.set(x, y, '#ffd878')
    s.rect(23, 26, 3, 28, '#3d2a1c')
    s.rect(6, 52, 36, 2, IRON); s.rect(6, 58, 36, 2, IRON)     # tree guard
    for x in range(6, 42, 5):
        s.vline(x, 50, 14, IRON)
    s = sheet.add('bush', 2, 1)
    for cx, rx in ((7, 7), (16, 8), (25, 7)):
        s.ellipse(cx, 11, rx, 6, '#0f3a1c')
    s.ellipse(14, 9, 6, 4, '#16542a')
    for x, y in ((6, 8), (20, 7), (27, 10)):
        s.set(x, y, '#d26ba0')


def ubahn_entrance(s):
    s.rect(0, 4, 64, 76, '#5b5a55')                           # tiled wall
    for y in range(4, 80, 8):
        s.hline(0, y, 64, '#3d3a37')
    for x in range(0, 64, 8):
        s.vline(x, 4, 76, '#3d3a37')
    s.rect(0, 0, 64, 6, '#2c2929'); s.hline(0, 0, 64, '#47433c')
    s.ellipse(32, 38, 20, 22, '#8a8476')
    s.rect(12, 38, 40, 42, '#8a8476')
    s.ellipse(32, 38, 17, 19, '#0d0c0f')
    s.rect(15, 38, 34, 42, '#0d0c0f')
    for i in range(9):                                        # stairs going down to the right
        s.rect(15 + i * 3, 46 + i * 4, 34 - i * 3, 2, '#2c2929')
        s.hline(15 + i * 3, 46 + i * 4, 34 - i * 3, '#5b5a5a')
    s.rect(15, 20, 34, 3, '#1d1b1b')
    s.rect(28, 22, 8, 2, '#f0d070')                           # lamp in the stairwell
    s.rect(2, 8, 26, 24, '#134ae0')                           # hanging U sign
    s.rect(3, 9, 24, 22, '#ffffff'); s.rect(4, 10, 22, 20, '#134ae0')
    s.rect(9, 13, 4, 13, '#ffffff'); s.rect(18, 13, 4, 13, '#ffffff'); s.rect(9, 23, 13, 4, '#ffffff')
    s.set(9, 26, '#134ae0'); s.set(21, 26, '#134ae0')
    s.rect(14, 0, 2, 8, '#2c2929')
    s.rect(52, 44, 10, 36, '#1d1b1b')
    s.rect(52, 44, 10, 3, '#3c3a3a')


def bin_orange(s, fire=False):
    s.rect(3, 12, 10, 18, '#d96a1c')
    s.vline(4, 12, 18, '#f08a3c'); s.vline(12, 12, 18, '#a84c10')
    s.rect(2, 10, 12, 3, '#3c3a3a')
    s.rect(4, 17, 8, 3, '#f0ece0')
    s.hline(5, 18, 6, '#d96a1c')
    s.rect(3, 30, 3, 2, IRON); s.rect(10, 30, 3, 2, IRON)
    if fire:
        s.rect(4, 8, 8, 3, '#ff7a1c')
        for x, h in ((4, 6), (6, 9), (8, 12), (10, 8)):
            s.rect(x, 9 - h, 2, h, '#ff9d2c')
            s.rect(x, 9 - h // 2, 2, h // 2, '#ffd23c')


def bike(s, x, y, col):
    for wx in (x + 6, x + 25):
        s.ellipse(wx, y + 18, 6.5, 6.5, '#121114')
        for yy in range(y + 11, y + 26):
            for xx in range(wx - 7, wx + 8):
                if (xx - wx) ** 2 + (yy - y - 18) ** 2 <= 4.6 ** 2:
                    s.erase(xx, yy)
        s.line(wx - 4, y + 18, wx + 4, y + 18, '#5b5a5a')
        s.line(wx, y + 14, wx, y + 22, '#5b5a5a')
        s.set(wx, y + 18, '#a7a5a5')
    s.line(x + 6, y + 18, x + 14, y + 8, col)
    s.line(x + 14, y + 8, x + 25, y + 18, col)
    s.line(x + 14, y + 8, x + 22, y + 8, col)
    s.line(x + 22, y + 8, x + 25, y + 18, col)
    s.line(x + 6, y + 18, x + 17, y + 18, col)
    s.line(x + 17, y + 18, x + 14, y + 8, col)
    s.line(x + 22, y + 8, x + 21, y + 4, '#1d1b1b')
    s.hline(x + 19, y + 4, 5, '#1d1b1b')
    s.hline(x + 11, y + 6, 6, '#1d1b1b')


def car(s, body):
    hi, lo = shade(body, 1.3), shade(body, 0.6)
    s.rect(4, 24, 120, 14, body)
    s.rect(4, 24, 120, 2, hi)
    s.rect(4, 36, 120, 2, lo)
    s.rect(26, 11, 70, 13, body)
    s.rect(28, 11, 66, 2, hi)
    for wx, ww in ((30, 18), (51, 20), (74, 18)):
        s.rect(wx, 14, ww, 10, '#0e1320')
        s.line(wx + 2, 22, wx + 7, 15, '#1b2438')
    s.rect(6, 28, 4, 3, '#f0d070'); s.rect(118, 28, 4, 3, '#be2633')
    s.rect(2, 34, 6, 4, '#a7a5a5'); s.rect(120, 34, 6, 4, '#a7a5a5')
    s.hline(60, 30, 5, lo); s.hline(24, 30, 5, lo)
    for wx in (28, 100):
        s.ellipse(wx, 39, 8, 8, '#121114')
        s.ellipse(wx, 39, 4.5, 4.5, '#807e7e')
        s.set(wx, 39, '#3c3a3a')
    s.rect(4, 38, 120, 1, '#121114')


def postbox(s):
    s.rect(3, 12, 10, 18, '#d9b21c')
    s.ellipse(8, 12, 5, 3, '#d9b21c')
    s.vline(4, 12, 18, '#f2d24c'); s.vline(12, 12, 18, '#a8860c')
    s.rect(5, 15, 6, 2, IRON)
    s.rect(6, 21, 4, 4, IRON); s.rect(8, 20, 2, 2, IRON)
    s.rect(3, 30, 10, 2, '#3c3a3a')


def litfass(s):
    s.rect(4, 12, 24, 52, '#1f4a3a')
    s.vline(5, 12, 52, '#2f6a52'); s.vline(26, 12, 52, '#12302a')
    s.ellipse(16, 12, 12, 5, '#2c2929')
    s.rect(4, 8, 24, 4, '#2c2929')
    cols = ['#be2633', '#d2d631', '#3460d9', '#dcd6c6', '#ff71f0', '#2fa84a']
    rng = noise(9)
    for i, y in enumerate(range(16, 50, 8)):
        for j, x in enumerate((6, 17)):
            s.rect(x, y, 9, 7, cols[(i * 2 + j) % len(cols)])
            s.hline(x + 1, y + 2, 6, '#121114')
            s.hline(x + 1, y + 4, 4, '#121114')
    s.rect(2, 60, 28, 4, '#47433c')


def ampel(s, walking):
    s.rect(7, 20, 2, 44, '#5b5a5a')
    s.rect(3, 2, 10, 20, IRON)
    s.rect(4, 3, 8, 18, '#0d0c0f')
    col, glow = ('#2fa84a', '#12ff00') if walking else ('#be2633', '#ff4d5e')
    s.rect(5, 6, 6, 12, shade(col, 0.5))
    man = (['..##..', '..##..', '.####.', '######', '.####.', '.#..#.', '.#..#.', '.#..#.', '.#..#.'] if not walking else
           ['..##..', '..##..', '.####.', '#####.', '.####.', '.#..#.', '#...#.', '#...#.', '#.....'])
    for dy, row in enumerate(man):
        for dx, ch in enumerate(row):
            if ch == '#':
                s.set(5 + dx, 7 + dy, glow)
    s.rect(6, 62, 4, 2, '#3c3a3a')


def bench(s):
    s.rect(2, 2, 28, 5, '#6b4a2f')
    s.hline(2, 4, 28, '#4a321f'); s.hline(2, 2, 28, '#8a6240')
    s.rect(1, 8, 30, 3, '#8a6240'); s.hline(1, 10, 30, '#4a321f')
    s.rect(3, 6, 2, 10, IRON); s.rect(27, 6, 2, 10, IRON)
    s.rect(1, 6, 2, 4, IRON); s.rect(29, 6, 2, 4, IRON)


def haltestelle(s):
    s.rect(7, 12, 2, 52, '#5b5a5a')
    s.ellipse(8, 6, 7, 6.5, '#e3b81a')
    s.ellipse(8, 6, 5.5, 5, '#f4d34a')
    s.text(6, 4, 'H', '#127a2a')
    s.rect(6, 62, 4, 2, '#3c3a3a')


def street_sign(s, text):
    s.rect(0, 3, 32, 11, '#dcd6c6')
    s.hline(0, 3, 32, '#ffffff'); s.hline(0, 13, 32, '#a7a5a5')
    s.text(1, 6, text, '#121114')
    s.vline(15, 14, 2, '#5b5a5a')


def furniture(sheet):
    sheet.group('street furniture')
    lamp(sheet.add('lamp', 2, 4))
    tree(sheet)
    ubahn_entrance(sheet.add('ubahn_entrance', 4, 5))
    bin_orange(sheet.add('bin_orange', 1, 2))
    bin_orange(sheet.add('fire_bin_art', 1, 2), fire=True)
    s = sheet.add('bike_rack', 2, 1)
    for x in (4, 14, 24):
        s.ellipse(x + 2, 9, 3, 7, '#a7a5a5')
        for yy in range(3, 17):
            for xx in range(x - 1, x + 6):
                if ((xx - x - 2) / 1.6) ** 2 + ((yy - 10) / 6) ** 2 <= 1:
                    s.erase(xx, yy)
        s.vline(x - 1, 8, 8, '#a7a5a5'); s.vline(x + 5, 8, 8, '#a7a5a5')
    s = sheet.add('bikes', 3, 2)
    bike(s, 0, 4, '#be2633')
    bike(s, 18, 4, '#12737a')
    car(sheet.add('car_blue', 8, 3), '#3a5a7a')
    car(sheet.add('car_red', 8, 3), '#7a2a2a')
    postbox(sheet.add('postbox', 1, 2))
    litfass(sheet.add('litfass', 2, 4))
    ampel(sheet.add('ampel_red', 1, 4), False)
    ampel(sheet.add('ampel_green', 1, 4), True)
    bench(sheet.add('bench', 2, 1))
    haltestelle(sheet.add('haltestelle', 1, 4))
    street_sign(sheet.add('sign_weser', 2, 1), 'WESERSTR')
    street_sign(sheet.add('sign_karl', 2, 1), 'KARLMARX')
    s = sheet.add('poller')
    s.rect(6, 3, 4, 13, '#807e7e'); s.rect(6, 6, 4, 2, '#f0ece0'); s.vline(6, 3, 13, '#a7a5a5')
    s = sheet.add('sat_dish')
    s.ellipse(8, 7, 6, 5, '#cfcabd'); s.ellipse(8, 7, 4.5, 3.5, '#9a968a'); s.line(8, 7, 5, 13, '#5b5a5a')
    s = sheet.add('pot_plant')
    s.rect(4, 9, 8, 7, '#c46927'); s.rect(3, 8, 10, 2, '#e08a3c')
    for dx, dy, r in ((-2, 3, 3), (2, 2, 3), (0, 0, 2.5)):
        s.ellipse(8 + dx, 5 + dy - 2, r, r, '#1a7a2a')


# ---------------------------------------------------------------- graffiti
def tag(s, text, col, k, x, y, shadow='#121114'):
    s.text(x + 1, y + 1, text, shadow, k)
    s.text(x, y, text, col, k)
    w = s.text_width(text, k)
    for i in range(0, w, 4):
        if (i // 4) % 2 == 0:
            s.vline(x + i, y + 5 * k + 1, 3 + (i % 3), col)


def graffiti(sheet):
    sheet.group('graffiti')
    tag(sheet.add('tag_rave', 2, 1), 'RAVE', '#ff71f0', 2, 1, 2)
    tag(sheet.add('tag_toy', 2, 1), 'TOY', '#71faff', 2, 4, 2)
    tag(sheet.add('tag_kotti', 3, 1), 'KOTTI', '#d2d631', 2, 4, 2)
    s = sheet.add('tag_star')
    for p in ((8, 2), (8, 3), (7, 4), (9, 4), (4, 6), (5, 6), (6, 6), (10, 6), (11, 6), (12, 6), (6, 7), (10, 7), (7, 9), (9, 9), (6, 11), (10, 11), (5, 12), (11, 12)):
        s.set(*p, '#ffd23c')
    s.set(8, 6, '#ffd23c'); s.set(8, 7, '#ffd23c'); s.set(8, 8, '#ffd23c'); s.set(7, 5, '#ffd23c'); s.set(9, 5, '#ffd23c'); s.set(7, 7, '#ffd23c'); s.set(9, 7, '#ffd23c'); s.set(8, 9, '#ffd23c')
    s = sheet.add('tag_spiral')
    x0, y0, x1, y1 = 2, 2, 13, 13
    col = '#71faff'
    while x0 < x1 and y0 < y1:
        s.hline(x0, y0, x1 - x0 + 1, col); s.vline(x1, y0, y1 - y0 + 1, col)
        s.hline(x0 + 2, y1, x1 - x0 - 1, col); s.vline(x0, y0 + 2, y1 - y0 - 1, col)
        x0 += 2; y0 += 2; x1 -= 2; y1 -= 2
    s = sheet.add('tag_eye')
    s.ellipse(8, 8, 7, 4, '#ffffff'); s.ellipse(8, 8, 3, 3, '#ff4d5e'); s.set(8, 8, '#121114'); s.hline(2, 8, 2, '#121114')
    s.hline(3, 3, 10, '#121114'); s.hline(3, 13, 10, '#121114')
    m = sheet.add('mural_a', 4, 3)
    for y in range(48):
        for x in range(64):
            m.set(x, y, mix('#3b1f5e', '#ff7a3c', y / 47))
    m.ellipse(32, 30, 14, 14, '#ffd23c')
    m.ellipse(32, 30, 11, 11, '#fff0a0')
    for x, h in ((2, 16), (10, 24), (19, 12), (46, 20), (54, 28), (59, 14)):
        m.rect(x, 48 - h, 7, h, '#1a1226')
        for wy in range(48 - h + 3, 46, 5):
            m.set(x + 2, wy, '#ffb000')
    m.rect(30, 16, 3, 32, '#1a1226'); m.ellipse(31, 20, 3, 3, '#1a1226')
    m.rect(0, 44, 64, 4, '#1a1226')
    m.hline(0, 0, 64, '#ffffff'); m.hline(0, 47, 64, '#ffffff'); m.vline(0, 0, 48, '#ffffff'); m.vline(63, 0, 48, '#ffffff')
    m = sheet.add('mural_b', 3, 2)
    cols = ['#ff71f0', '#71faff', '#ffd23c', '#12ff00']
    for y in range(32):
        for x in range(48):
            band = int((y + ((x // 6) % 2) * 3 + (x // 12) * 2) // 6) % len(cols)
            m.set(x, y, cols[band])
    m.ellipse(24, 16, 10, 10, '#121114'); m.ellipse(24, 16, 7, 7, '#ffffff'); m.ellipse(24, 16, 3, 3, '#121114')
    m.hline(0, 0, 48, '#121114'); m.hline(0, 31, 48, '#121114')
    for name, bg, fg, text, k in (('poster_gig', '#121114', '#ff71f0', 'LIVE', 1), ('poster_party', '#d2d631', '#1a1226', 'B', 3),
                                  ('poster_dub', '#2fa84a', '#121114', 'DUB', 1)):
        s = sheet.add(name, 1, 2)
        s.rect(2, 2, 12, 28, bg)
        s.hline(2, 2, 12, shade(bg, 1.3))
        s.text(3 if k == 1 else 5, 5 if k == 1 else 8, text, fg, k)
        s.hline(4, 14 if k == 1 else 20, 8, fg); s.hline(4, 17 if k == 1 else 23, 6, fg); s.hline(4, 24, 8, fg)
    s = sheet.add('stickers')
    rng = noise(77)
    cols = ['#ff71f0', '#71faff', '#ffd23c', '#12ff00', '#ff4d5e', '#dcd6c6']
    for _ in range(7):
        x, y = rng.randint(1, 12), rng.randint(1, 12)
        s.rect(x, y, 3, 3, rng.choice(cols))


# ---------------------------------------------------------- sky / skyline
def far(sheet):
    sheet.group('sky and skyline')
    s = sheet.add('moon', 2, 2)
    s.ellipse(15, 15, 13, 13, '#a7ae65')
    s.ellipse(15, 15, 11, 11, '#949c5f')
    for (x, y), col in list(s.p.items()):
        if ((x - 21) / 11.5) ** 2 + ((y - 13) / 11.5) ** 2 <= 1:
            s.erase(x, y)
    for n in ('star_a', 'star_b'):
        s = sheet.add(n)
        rng = noise(5 if n == 'star_a' else 6)
        for _ in range(6):
            s.set(rng.randint(0, 15), rng.randint(0, 15), '#dcd6c6' if rng.random() < 0.7 else '#a7ae65')
    sil = '#17120c'
    for name, w, h, bars in (('skyline_a', 4, 3, ((0, 18), (9, 30), (20, 22), (30, 38), (42, 26), (52, 20))),
                             ('skyline_b', 4, 4, ((0, 30), (8, 22), (18, 44), (30, 36), (42, 52), (54, 28))),
                             ('skyline_c', 3, 3, ((0, 24), (10, 36), (22, 20), (32, 30)))):
        s = sheet.add(name, w, h)
        rng = noise(len(name) + w)
        for x0, bh in bars:
            bw = rng.randint(8, 11)
            s.rect(x0, h * 16 - bh, bw, bh, sil)
            for wy in range(h * 16 - bh + 3, h * 16 - 2, 4):
                for wx in range(x0 + 2, x0 + bw - 1, 3):
                    if rng.random() < 0.18:
                        s.set(wx, wy, '#e0a845')
        s.rect(0, h * 16 - 3, w * 16, 3, sil)
    s = sheet.add('skyline_fill')
    rng = noise(3)
    for y in range(16):
        for x in range(16):
            s.set(x, y, '#e0a845' if rng.random() < 0.04 and x % 3 == 1 and y % 4 == 1 else sil)
    s = sheet.add('fernsehturm', 2, 8)
    s.rect(15, 0, 2, 56, sil)
    s.rect(14, 40, 4, 40, sil); s.rect(13, 80, 6, 30, sil); s.rect(11, 108, 10, 20, sil)
    s.ellipse(16, 56, 10, 8, '#3c3a3a')
    s.ellipse(16, 56, 8.5, 6.5, '#17120c')
    s.hline(8, 56, 17, '#e0a845')
    for x in range(8, 25, 3):
        s.set(x, 54, '#e0a845')
    s.set(16, 1, '#ff4d5e'); s.set(16, 0, '#ff4d5e')


# ----------------------------------------------------------------- markers
MARKERS = [  # name, letter, colour
    ('marker_start', 'P', '#2fa84a'), ('marker_door', 'D', '#ff71f0'), ('marker_djdoor', 'R', '#9b5cff'),
    ('marker_ubahn', 'U', '#134ae0'),
    ('marker_smoker', 'S', '#d28c6b'), ('marker_weirdo', 'W', '#d26ba0'), ('marker_cop', 'C', '#5d7a8c'),
    ('marker_fire', 'F', '#ff7a1c'), ('marker_cat', 'K', '#e08a3c'),
]


def markers(sheet):
    sheet.group('markers')
    for name, letter, col in MARKERS:
        s = sheet.add(name)
        s.rect(0, 0, 16, 16, col)
        s.rect(1, 1, 14, 14, shade(col, 0.55))
        s.rect(2, 2, 12, 12, col)
        s.text(6, 5, letter, '#121114')
        for x in range(0, 16, 2):
            s.set(x, 0, '#121114'); s.set(x + 1, 15, '#121114')
