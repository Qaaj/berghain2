"""Neukölln street kit, part 4: a galvanised chain-link fence (a reusable kit) and an empty, rubbish-strewn lot.

Fence pieces are all 3 tiles tall and stand on the pavement (bottom of the block = top of the ground row), so any
run of them lines up: fence_end_l, then fence_mesh_* / fence_post / fence_sign in any order, then fence_end_r.
The mesh repeats every 8 px, which divides the 16 px tile, so panels tile seamlessly in any combination.
"""
from spriteart import noise, shade

ZINC, ZINC_HI, ZINC_LO = '#7d8285', '#aeb3b5', '#4f5356'     # galvanised steel: cold grey, bright edge, shadow
RAIL_Y = 7                                                   # top rail (2 px pipe), where the mesh hangs from
MESH_TOP, MESH_BOT = RAIL_Y + 2, 46                          # mesh rows; 46/47 are the bottom tension wire + gap
FOOT = '#6b6762'                                             # concrete footing, same as the curb


def mesh(s, x0=0, x1=16, skip=lambda x, y: False):
    """Diamond chain-link between columns x0..x1: '/' wires catch the light, '\\' wires are a step darker."""
    for y in range(MESH_TOP, MESH_BOT):
        for x in range(x0, x1):
            if skip(x, y):
                continue
            if (x + y) % 8 == 0:
                s.set(x, y, ZINC_HI if (x - y) % 8 else ZINC_LO)  # the knuckle where two wires twist is darker
            elif (x - y) % 8 == 0:
                s.set(x, y, ZINC)


def rail(s, x0=0, x1=16):
    s.hline(x0, RAIL_Y, x1 - x0, ZINC_HI)
    s.hline(x0, RAIL_Y + 1, x1 - x0, ZINC_LO)
    s.hline(x0, MESH_BOT, x1 - x0, ZINC)                     # tension wire along the bottom


def post(s, x):
    """A 3 px round pipe post with a domed cap and a concrete footing; `x` is its left column."""
    s.rect(x, RAIL_Y - 2, 3, 48 - RAIL_Y + 2, ZINC)
    s.vline(x, RAIL_Y - 2, 48 - RAIL_Y + 2, ZINC_HI)
    s.vline(x + 2, RAIL_Y - 2, 48 - RAIL_Y + 2, ZINC_LO)
    s.rect(x - 1, RAIL_Y - 4, 5, 2, ZINC); s.hline(x - 1, RAIL_Y - 4, 5, ZINC_HI); s.set(x + 1, RAIL_Y - 5, ZINC_HI)
    for y in (RAIL_Y + 12, RAIL_Y + 25):                     # tension bands clamping the mesh
        s.hline(x - 1, y, 5, ZINC_LO)
    s.rect(x - 1, 45, 5, 3, FOOT); s.hline(x - 1, 45, 5, shade(FOOT, 1.25))


def panel(s):
    mesh(s)
    rail(s)


def fence_bag(s):
    """A panel with a torn plastic bag and leaves blown against the bottom of the mesh."""
    panel(s)
    bag, lo = '#c9c3b3', '#8f8a7e'
    for y, x0, n in ((38, 6, 4), (39, 4, 7), (40, 3, 9), (41, 3, 10), (42, 4, 9), (43, 5, 7), (44, 6, 5)):
        s.hline(x0, y, n, bag)
    s.hline(5, 43, 7, lo); s.set(12, 41, lo); s.set(12, 42, lo)
    s.set(4, 37, bag); s.set(3, 36, bag)                        # a flapping corner
    for x, y, col in ((0, 45, '#8a5a2a'), (1, 44, '#a86a2a'), (13, 45, '#6b4a2f'), (14, 44, '#8a5a2a'), (15, 45, '#a86a2a')):
        s.set(x, y, col)


def fence_torn(s):
    """A panel cut open at the bottom and peeled up, the way people get into a lot."""
    def hole(x, y):
        return ((x - 8) / 6.5) ** 2 + ((y - 47) / 15) ** 2 <= 1
    mesh(s, skip=hole)
    s.hline(0, RAIL_Y, 16, ZINC_HI); s.hline(0, RAIL_Y + 1, 16, ZINC_LO)
    s.hline(0, MESH_BOT, 2, ZINC); s.hline(14, MESH_BOT, 2, ZINC)
    for x, y in ((2, 40), (3, 37), (4, 35), (6, 33), (8, 32), (10, 33), (12, 35), (13, 37), (14, 40)):   # cut ends
        s.set(x, y, ZINC_HI)
    for x, y in ((9, 31), (10, 30), (11, 30), (12, 31), (13, 32), (11, 29)):                             # flap curled up
        s.set(x, y, ZINC)


def fence_sign(s):
    """Two panels with a warning sign wired to the mesh."""
    panel(s)
    s.rect(3, 16, 26, 14, '#121114')                          # shadow behind the plate
    s.rect(3, 15, 26, 13, '#e8e2d2'); s.hline(3, 15, 26, '#ffffff')
    s.rect(4, 16, 24, 1, '#be2633'); s.rect(4, 26, 24, 1, '#be2633')
    s.text(5, 18, 'PRIVAT', '#be2633')
    for x in (4, 27):                                         # wire ties
        s.set(x, 14, ZINC_HI); s.set(x, 13, ZINC)
    s.set(20, 22, '#9f402d'); s.set(21, 23, '#9f402d'); s.set(9, 25, '#b3ac99')   # rust bleeding from a bolt


def fences(sheet):
    sheet.group('chain-link fence')
    panel(sheet.add('fence_mesh_a', 1, 3))
    fence_bag(sheet.add('fence_mesh_b', 1, 3))
    fence_torn(sheet.add('fence_mesh_torn', 1, 3))
    s = sheet.add('fence_post', 1, 3)
    panel(s)
    post(s, 6)
    s = sheet.add('fence_end_l', 1, 3)
    mesh(s, 3, 16); rail(s, 3, 16)
    post(s, 1)
    s = sheet.add('fence_end_r', 1, 3)
    mesh(s, 0, 13); rail(s, 0, 13)
    post(s, 12)
    fence_sign(sheet.add('fence_sign', 2, 3))


# -------------------------------------------------------------- vacant lot
BRICK, MORTAR = '#5b3a2c', '#3a2a22'
DIRT, DIRT_LO, DIRT_HI = '#3a2f22', '#2a2219', '#4f4130'
WEED, WEED_HI, WEED_LO = '#2f5a24', '#4f8a32', '#1c3a16'


def lot_dirt_top(s, rng, v):
    """The far edge of the lot's trodden earth: uneven, with grass along it; open sky above."""
    edge = [4 + int(2 * rng.random()) + (1 if (x + ord(v)) % 7 < 2 else 0) for x in range(16)]
    for x in range(16):
        for y in range(edge[x], 16):
            r = rng.random()
            s.set(x, y, DIRT_LO if r < 0.14 else DIRT_HI if r < 0.22 else DIRT)
        for k in range(rng.randint(1, 4)):
            s.set(x, edge[x] - k, WEED if k < 2 else WEED_HI)
    if v == 'b':
        for x, y in ((3, 10), (4, 10), (9, 12), (12, 9), (13, 9)):   # broken brick and glass
            s.set(x, y, BRICK if x < 10 else '#6a8a5a')


def lot_dirt(s, rng):
    for y in range(16):
        for x in range(16):
            r = rng.random()
            s.set(x, y, DIRT_LO if r < 0.14 else DIRT_HI if r < 0.22 else '#4f4b43' if r < 0.25 else DIRT)


def weeds(s, rng, tall):
    """Ruderal weeds: grasses, a few taller stalks (mugwort, goldenrod) and a flower or two."""
    for x in range(1, 15):
        h = rng.randint(2, 6) + (rng.randint(3, 8) if tall and rng.random() < 0.35 else 0)
        for k in range(h):
            s.set(x + (1 if k > 4 and x % 3 == 0 else 0), 15 - k, WEED_LO if k < 2 else WEED if k < 5 else WEED_HI)
    if tall:
        for x, y in ((4, 4), (5, 3), (11, 5), (12, 4)):
            s.set(x, y, '#d2b62c')                            # goldenrod
    s.set(8, 10, '#d26ba0')


def rubble(s, rng):
    """A heap of bricks and plaster 2 tiles wide."""
    for y in range(4, 16):
        for x in range(32):
            if ((x - 16) / 15) ** 2 + ((y - 16) / 11) ** 2 <= 1:
                r = rng.random()
                s.set(x, y, BRICK if r < 0.35 else MORTAR if r < 0.55 else '#5f5b55' if r < 0.8 else '#8a847b')
    s.rect(9, 8, 6, 3, BRICK); s.hline(9, 8, 6, shade(BRICK, 1.3))
    s.rect(19, 10, 5, 2, '#8a847b')
    s.line(22, 3, 26, 12, '#6b4a2f')                           # a slat sticking out


def mattress(s):
    """An old striped mattress leaning on its long side. 2x1."""
    for y in range(5, 16):
        for x in range(2, 30):
            s.set(x, y, '#b3a888' if (x // 3) % 2 else '#9f9474')
    s.hline(2, 5, 28, '#cfc4a2'); s.hline(2, 15, 28, '#6e6650')
    s.vline(2, 5, 11, '#6e6650'); s.vline(29, 5, 11, '#6e6650')
    for x, y in ((8, 8), (16, 8), (24, 8), (8, 12), (16, 12), (24, 12)):
        s.set(x, y, '#6e6650')                                # buttons
    s.rect(18, 10, 6, 4, '#7a6a3a'); s.set(20, 9, '#7a6a3a')  # the stain


def cart(s):
    """A shopping trolley on its side, 2x1."""
    for x in range(4, 28):                                    # basket: grid of wires
        for y in range(4, 13):
            if x % 3 == 0 or y % 3 == 1:
                s.set(x, y, ZINC)
    s.hline(4, 4, 24, ZINC_HI); s.vline(4, 4, 9, ZINC_HI); s.vline(27, 4, 9, ZINC_LO)
    s.hline(2, 13, 28, ZINC_LO)                               # chassis
    s.hline(28, 6, 3, '#be2633'); s.hline(28, 7, 3, '#be2633')   # red handle
    for wx in (6, 24):
        s.rect(wx, 14, 2, 2, '#121114')


def mound(s, rng):
    """A heap of dumped earth, 3 tiles wide, grassed over on top, a bit of brick poking out."""
    top = {}
    for x in range(48):
        h = 11 * (1 - ((x - 24) / 24) ** 2) + rng.random() * 1.5
        top[x] = 16 - max(1, int(h))
        for y in range(top[x], 16):
            r = rng.random()
            s.set(x, y, DIRT_LO if r < 0.14 or x > 30 and r < 0.4 else DIRT_HI if r < 0.24 else DIRT)
    for x in range(2, 46):
        for k in range(rng.randint(0, 3)):
            s.set(x, top[x] - k, WEED if k < 2 else WEED_HI)
    s.rect(14, 10, 4, 2, BRICK); s.rect(30, 11, 3, 2, '#8a847b')


def birch(s, rng):
    """A young birch, the first tree to grow on any Berlin waste ground: white trunk, black marks, light crown.
    2x5 tiles; its foot is a little above the bottom so it stands in the earth of lot_dirt_top."""
    for cx, cy, rx, ry in ((16, 20, 12, 15), (10, 30, 8, 9), (23, 28, 8, 10), (16, 9, 7, 7)):
        s.ellipse(cx, cy, rx, ry, '#1f4a22')
    for (x, y), col in list(s.p.items()):
        r = rng.random()
        if r < 0.25:
            s.set(x, y, '#2f6a2a')
        elif r < 0.30 and y < 26:
            s.set(x, y, '#5a8a3a')
        elif r < 0.36:
            s.set(x, y, '#143418')
    for y in range(14, 74):                                   # trunk, leaning slightly
        x = 15 + (y - 14) // 30
        s.set(x, y, '#d8d4c8'); s.set(x + 1, y, '#bdb8aa'); s.set(x + 2, y, '#8a867c')
        if y % 7 in (0, 3) and y > 30:
            s.set(x + (y % 2), y, '#121114')                  # the black bark marks
    s.line(16, 40, 9, 32, '#bdb8aa'); s.line(17, 34, 23, 28, '#bdb8aa')


def tyres(s):
    """Two dumped car tyres, one leaning on the other."""
    for cx, cy, rx in ((5, 12, 5), (11, 11, 5)):
        s.ellipse(cx, cy, rx, 4.5, '#1d1b1b')
        s.ellipse(cx, cy, rx - 2.5, 2, '#121114')
        s.hline(cx - rx + 2, cy - 4, rx * 2 - 4, '#3c3a3a')


def pallet(s):
    """A broken wooden pallet lying in the weeds, 2x1."""
    for x0 in (1, 9, 17, 25):
        s.rect(x0, 8, 6, 2, '#8a6240'); s.hline(x0, 8, 6, '#a97b4f')
    s.rect(1, 10, 30, 2, '#6b4a2f')
    for x0 in (2, 15, 28):
        s.rect(x0, 12, 3, 3, '#4a321f')
    s.erase(19, 8, 4, 2)                                      # a slat snapped off
    s.line(20, 9, 24, 5, '#8a6240')


def vacant_lot(sheet):
    sheet.group('vacant lot')
    rng = noise(71)
    lot_dirt_top(sheet.add('lot_dirt_top_a'), rng, 'a')
    lot_dirt_top(sheet.add('lot_dirt_top_b'), rng, 'b')
    lot_dirt(sheet.add('lot_dirt'), rng)
    weeds(sheet.add('weeds_a'), rng, False)
    weeds(sheet.add('weeds_b'), rng, True)
    rubble(sheet.add('rubble', 2, 1), rng)
    mound(sheet.add('lot_mound', 3, 1), rng)
    mattress(sheet.add('mattress', 2, 1))
    cart(sheet.add('shopping_cart', 2, 1))
    tyres(sheet.add('tyres'))
    pallet(sheet.add('pallet', 2, 1))
    birch(sheet.add('birch', 2, 5), rng)
