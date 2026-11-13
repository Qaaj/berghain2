"""Neukölln street kit, part 4: a galvanised chain-link fence (a reusable kit) and a vacant lot (Baulücke).

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
WALL, WALL_LO, WALL_HI = '#3f3c35', '#2f2c27', '#4b4740'     # the bare firewall at the back of the lot
BRICK, MORTAR = '#5b3a2c', '#3a2a22'
DIRT, DIRT_LO, DIRT_HI = '#3a2f22', '#2a2219', '#4f4130'
WEED, WEED_HI, WEED_LO = '#2f5a24', '#4f8a32', '#1c3a16'


def firewall(s, rng, bricks=False):
    for y in range(16):
        for x in range(16):
            r = rng.random()
            s.set(x, y, WALL_LO if r < 0.10 else WALL_HI if r < 0.16 else WALL)
    if bricks:                                                # plaster fallen off, bricks showing through
        for y in range(3, 14):
            for x in range(2, 14):
                if ((x - 8) / 6) ** 2 + ((y - 8) / 5.2) ** 2 <= 1:
                    s.set(x, y, MORTAR if y % 3 == 0 or (x + (y // 3) * 3) % 6 == 0 else BRICK)


def firewall_top(s, rng):
    """The coping of the firewall: a sky-coloured gap above (transparent), a dark capping row, then wall."""
    for y in range(5, 16):
        for x in range(16):
            r = rng.random()
            s.set(x, y, WALL_LO if r < 0.10 else WALL_HI if r < 0.16 else WALL)
    s.rect(0, 4, 16, 2, '#262525'); s.hline(0, 4, 16, '#47433c')
    for x in (3, 11):                                         # rain streaks under the coping
        s.vline(x, 6, 5 + x % 4, WALL_LO)


def ghost_house(s):
    """The imprint a demolished side wing leaves on a Berlin firewall: a pitched roofline, the floors as
    lighter bands, scraps of wallpaper and tiles, and the zig-zag of the old staircase. 6x6 tiles."""
    W, H = 96, 96
    roof = lambda x: 18 + abs(x - 48) * 18 // 48             # gable peak at the middle
    for x in range(4, W - 4):
        s.set(x, roof(x), '#5a554c')                          # roofline scar
        s.set(x, roof(x) + 1, '#2f2c27')
    s.vline(4, roof(4), H - roof(4), '#4f4b43'); s.vline(W - 5, roof(W - 5), H - roof(W - 5), '#4f4b43')
    floors = (40, 64, 88)
    for fy in floors:                                         # where the ceilings were keyed into the wall
        s.hline(5, fy, W - 10, '#2a2722'); s.hline(5, fy + 1, W - 10, '#4f4b43')
    rooms = ((8, 42, 30, 20, '#57464a'), (44, 42, 18, 20, '#454e43'), (8, 66, 22, 20, '#4f4a3c'),
             (64, 66, 24, 20, '#434a52'), (40, 24, 18, 14, '#4f4436'))
    rng = noise(61)
    for x0, y0, w, h, col in rooms:                           # faded wallpaper, half scraped off
        for y in range(y0, y0 + h):
            for x in range(x0, x0 + w):
                if rng.random() < 0.9:
                    pat = (x // 3 + y // 4) % 2 == 0 and (x + y) % 5 == 0
                    s.set(x, y, shade(col, 1.15) if pat else col)
    for y in range(68, 84, 3):                                # a bathroom: white tiles in a grid
        for x in range(34, 56, 3):
            if rng.random() < 0.8:
                s.rect(x, y, 2, 2, '#7d7a72')
    for i in range(6):                                        # the staircase climbing between the floors
        s.line(66 + i * 4, 62 - i * 3, 70 + i * 4, 62 - i * 3, '#2a2722')
        s.vline(70 + i * 4, 59 - i * 3, 3, '#2a2722')
    s.line(64, 88, 88, 66, '#2a2722')
    s.rect(46, 30, 6, 6, '#2a2722'); s.rect(47, 31, 4, 4, '#1d1b1b')   # a bricked-up hole for a stove pipe


def lot_dirt_top(s, rng, v):
    """Trodden earth reaching back to the firewall: top edge uneven, with grass along it."""
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


def vacant_lot(sheet):
    sheet.group('vacant lot')
    rng = noise(71)
    firewall_top(sheet.add('firewall_top'), rng)
    firewall(sheet.add('firewall_a'), rng)
    firewall(sheet.add('firewall_b'), rng)
    firewall(sheet.add('firewall_brick'), rng, bricks=True)
    lot_dirt_top(sheet.add('lot_dirt_top_a'), rng, 'a')
    lot_dirt_top(sheet.add('lot_dirt_top_b'), rng, 'b')
    lot_dirt(sheet.add('lot_dirt'), rng)
    weeds(sheet.add('weeds_a'), rng, False)
    weeds(sheet.add('weeds_b'), rng, True)
    rubble(sheet.add('rubble', 2, 1), rng)
    mattress(sheet.add('mattress', 2, 1))
    cart(sheet.add('shopping_cart', 2, 1))
    ghost_house(sheet.add('firewall_ghost', 6, 6))
