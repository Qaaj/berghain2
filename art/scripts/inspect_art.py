"""Draws the close-up ("inspect") views through pixel-mcp: what you see when you look into, behind or at something.

Run:  python3 art/scripts/inspect_art.py [name ...]
Each view is a framed background (art/inspect_<view>.aseprite -> public/assets/inspect/<view>.png, 3x) plus one
sprite per thing you can take out of it (inspect_<view>_<item>), drawn separately so the game can remove it.
Hotspot rectangles for every view live in src/systems/inspect.ts, in the native pixels of these canvases.
"""
import sys

from spriteart import Sprite, Studio, mix, noise, shade

# ---------------------------------------------------------------- the street container, seen from above
CONTAINER_W, CONTAINER_H = 192, 120
RIM, RIM_HI, RIM_LO = '#2c2929', '#47433c', '#121114'
WALL, WALL_RIB = '#1d1b1b', '#262525'
BAG_BLACK, BAG_WHITE, BAG_YELLOW = '#38363e', '#cfcabd', '#d2c22a'


def bag(s, cx, cy, rx, ry, col, rng):
    """A tied bin bag: lit from the street lamp at the top left, creased, with its knot on top."""
    for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
        for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
            u, v = (x - cx) / rx, (y - cy) / ry
            d = u * u + v * v
            if d > 1:
                continue
            light = -(u + v) * 0.5                       # +1 towards the top left
            f = 1.0 + 0.35 * light - 0.25 * d
            s.set(x, y, shade(col, max(0.45, f)))
    for _ in range(int(rx * ry / 150) + 1):              # creases: a dark fold with a lit edge under it
        x, y = cx + rng.randint(-int(rx * 0.6), int(rx * 0.5)), cy + rng.randint(-int(ry * 0.5), int(ry * 0.5))
        n, slope = rng.randint(5, 9), rng.choice((-1, 1))
        dark, hi = shade(col, 0.6), shade(col, 1.3)
        for i in range(n):
            yy = y + slope * (i // 3)
            s.set(x + i, yy, dark)
            s.set(x + i, yy + 1, hi)
    kx, ky = int(cx + rx * 0.15), int(cy - ry)
    s.rect(kx - 1, ky - 1, 3, 2, shade(col, 0.8))         # knot and its two ears
    s.set(kx - 3, ky - 3, shade(col, 1.2)); s.set(kx - 2, ky - 2, shade(col, 1.0))
    s.set(kx + 3, ky - 3, shade(col, 1.1)); s.set(kx + 2, ky - 2, shade(col, 0.9))


def pizza_box(s, x0, y0, w, h):
    card, top, edge, grease = '#a97b4f', '#c29262', '#6b4a2f', '#8a6240'
    s.rect(x0, y0, w, h, card)
    s.hline(x0, y0, w, top); s.vline(x0, y0, h, top)
    s.hline(x0, y0 + h - 1, w, edge); s.vline(x0 + w - 1, y0, h, edge)
    s.hline(x0 + 2, y0 + 4, w - 4, shade(card, 0.85))   # the lid's fold line
    rng = noise(5)
    for _ in range(5):
        gx, gy = x0 + rng.randint(4, w - 8), y0 + rng.randint(7, h - 6)
        s.rect(gx, gy, rng.randint(2, 4), rng.randint(1, 3), grease)
    label = 'PIZZA'
    tx = x0 + (w - s.text_width(label)) // 2
    s.text(tx, y0 + h // 2 - 2, label, '#be2633')
    s.hline(tx, y0 + h // 2 + 4, s.text_width(label), '#be2633')
    s.set(x0 + w - 6, y0 + 8, '#d93532'); s.set(x0 + w - 5, y0 + 8, '#2fa84a')   # tiny Italian flag


def newspaper(s, x0, y0):
    rows = [
        '....aaaaab......',
        '..aaaabbaaaab...',
        '.aaccccaaccaab..',
        'aaaaaabaaaaaaaab',
        'aacccacccaccaab.',
        '.aaaaaaaabaaaab.',
        'aaccaccccacccaab',
        'aaaaabaaaaaaaabb',
        '.accaacccaacaab.',
        '..aaaaaaaaabbb..',
        '...abbaaabb.....',
    ]
    legend = {'a': '#dcd6c6', 'b': '#b3ac99', 'c': '#807e7e'}
    for dy, row in enumerate(rows):                      # doubled up so it reads as crumpled pages, not a grid
        for dx, ch in enumerate(row):
            if ch != '.':
                s.rect(x0 + dx * 2, y0 + dy * 2, 2, 2, legend[ch])
    s.rect(x0 + 6, y0 + 2, 6, 2, '#be2633')              # the masthead


def banana(s, x0, y0):
    """A peel flopped open, at 2x like the newspaper so its shape reads."""
    rows = [
        '....h....',
        '...yyd...',
        '.yyyyyyd.',
        'yyd.yd.yd',
        'yd..yd..d',
        'd...d....',
    ]
    for dy, row in enumerate(rows):
        for dx, ch in enumerate(row):
            if ch != '.':
                s.rect(x0 + dx * 2, y0 + dy * 2, 2, 2, {'y': '#d2d631', 'h': '#6b4a2f', 'd': '#aaaa38'}[ch])


def coffee_cup(s, x0, y0):
    s.grid(x0, y0, [
        '..wwwwwwwwwwwkk.',
        'wwwwwwwwwwwwwkkk',
        'wwnnnnnnwwwwwkkk',
        'wwnnnnnnwwwwwkkk',
        'ggggggggggggggkk',
        '..ggggggggggggk.',
    ], {'w': '#f0ece0', 'n': '#6b4a2f', 'g': '#b3ac99', 'k': '#3c3a3a'})


def container():
    s = Sprite(CONTAINER_W, CONTAINER_H, outline=False)
    rng = noise(23)
    W, H = CONTAINER_W, CONTAINER_H
    s.rect(0, 0, W, H, '#09080a')                           # the gaps between everything are the bottom of the bin

    for y in range(6, 22):                               # the far inner wall, moulded ribs catching some light
        for x in range(6, W - 6):
            col = WALL_RIB if (x - 6) % 12 < 2 else WALL
            s.set(x, y, shade(col, 0.7 + 0.3 * (y - 6) / 16))
    for y in range(6, H - 6):                            # the side walls narrow towards the viewer
        side = max(2, 14 - (y - 6) // 8)
        for i in range(side):
            s.set(6 + i, y, shade(WALL, 1.1 - i * 0.03))
            s.set(W - 7 - i, y, shade(WALL, 0.75))

    bags = [  # cx, cy, rx, ry, colour; back to front
        (38, 50, 30, 22, BAG_BLACK), (156, 46, 28, 20, BAG_WHITE), (98, 66, 36, 18, BAG_BLACK),
        (34, 96, 28, 18, BAG_BLACK), (104, 102, 30, 16, BAG_YELLOW), (162, 96, 26, 18, BAG_BLACK),
    ]
    for cx, cy, rx, ry, col in bags:
        bag(s, cx, cy, rx, ry, col, rng)

    pizza_box(s, 70, 22, 46, 30)
    newspaper(s, 128, 66)
    banana(s, 44, 60)
    coffee_cup(s, 16, 26)
    for x, y in ((62, 82), (124, 58), (144, 110), (78, 112), (182, 70), (20, 70)):   # cigarette butts
        s.set(x, y, '#e08a3c'); s.set(x + 1, y, '#dcd6c6'); s.set(x + 2, y, '#dcd6c6')
    for x, y in ((120, 88), (60, 40)):                   # bottle caps
        s.rect(x, y, 2, 2, '#a9a7a7'); s.set(x, y, '#f0ece0')

    for y in range(H):                                   # the rim, lit at the top and left by the street lamp
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 6:
                col = RIM
                if edge == 0:
                    col = RIM_LO
                elif edge == 1 and (y <= 1 or x <= 1):
                    col = RIM_HI
                elif edge == 5:
                    col = RIM_LO
                elif (x + y) % 23 == 0:
                    col = shade(RIM, 1.25)               # scuffs
                s.set(x, y, col)
    for x in range(30, W - 30, 40):                      # bolts holding the lid hinge
        s.rect(x, 2, 2, 2, '#5b5a5a'); s.set(x, 2, '#807e7e')
    return s


def container_bottle():
    """An empty green beer bottle lying across the bags, its neck tilted up to the right."""
    s = Sprite(46, 17)
    glass, hi, lo = '#127a2a', '#8fd18a', '#0b4d1b'

    def lift(x):
        return 6 - x // 8                                # 1px up every 8 columns

    def column(x, top, h):
        for y in range(top, top + h):
            col = glass
            if y == top + 1 and h > 4:
                col = hi                                 # the reflection running along the glass
            elif y == top + 2 and h > 4:
                col = mix(glass, hi, 0.3)
            elif y >= top + h - 2:
                col = lo
            s.set(x, y, col)

    for x in range(0, 28):                               # body
        column(x, lift(x), 11)
    for x in range(28, 33):                              # shoulder
        h = 11 - (x - 27) * 2 + 1
        column(x, lift(x) + (11 - h) // 2, h)
    for x in range(33, 44):                              # neck
        column(x, lift(x) + 4, 3)
    for y in range(lift(44) + 3, lift(44) + 8):          # the lip; the crown cap is long gone
        s.set(44, y, '#5ab06a')
    for x in range(8, 20):                               # label
        top = lift(x)
        for y in range(top + 2, top + 9):
            s.set(x, y, '#dcd6c6')
        s.set(x, top + 2, '#b3ac99')
        s.set(x, top + 5, '#be2633'); s.set(x, top + 6, '#be2633')
    s.vline(0, lift(0) + 1, 9, lo)                       # the base, seen end-on
    return s


VIEWS = {
    'container': [('container', container, 'inspect/container.png'),
                  ('container_bottle', container_bottle, 'inspect/container_bottle.png')],
}


def main(names):
    studio = Studio()
    try:
        for view, assets in VIEWS.items():
            if names and view not in names:
                continue
            for name, fn, dest in assets:
                studio.make('inspect_' + name, fn(), dest)
                print('drew', name)
    finally:
        studio.close()


if __name__ == '__main__':
    main(sys.argv[1:])
