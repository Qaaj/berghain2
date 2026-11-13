"""Draws the talking NPCs through pixel-mcp: the street dealer (street sprite, conversation close-up, what he sells)
and Jule, the neighbour who sends you to him (street sprite and close-up).

Run:  python3 art/scripts/npc_art.py [name ...]      (names: dealer, talk, jule, jule_talk, pickups, or one pickup)
Writes  public/assets/npc/dealer.png       street sheet, 2 frames of 32x32 native side by side (idle, glancing),
                                            exported at 3x (192x96), feet on the bottom row like public/assets/npc.png
        public/assets/talk/dealer.png      the close-up shown while you talk to him, 192x120 native at 3x
        public/assets/npc/jule.png, talk/jule.png   the same two for Jule
        public/assets/pickups/pickup_*.png HUD icons for what you can buy (weed, ketamine, cocaine, heroin, poppers)
and an editable art/npc_*.aseprite for each.
"""
import sys

from spriteart import FONT, Sprite, Studio, mix, noise, shade

# ---------------------------------------------------------------- shared look
HOOD, HOOD_HI, HOOD_LO = '#1f2a33', '#34444f', '#141a20'   # a dark navy hoodie, close to the palette's B3
SKIN, SKIN_HI, SKIN_LO = '#d28c6b', '#db9b76', '#a8694e'
BAG, BAG_HI, BAG_LO = '#5b5340', '#807254', '#362f20'      # the OG browns: a worn khaki bum bag
PANTS, PANTS_LO, STRIPE = '#262525', '#1a1919', '#dcd6c6'
SHOE, SHOE_LO, SOLE = '#f0ece0', '#b3ac99', '#807e7e'


# ---------------------------------------------------------------- street sprite
def street_frame(glance):
    """32x32, facing left (towards the player coming down the street). `glance`: head turned to look back over his
    shoulder and the near hand resting on the bum bag."""
    s = Sprite(32, 32, outline=False)
    L = {'h': HOOD, 'l': HOOD_HI, 'd': HOOD_LO, 's': SKIN, 'S': SKIN_HI, 'z': SKIN_LO, 'e': '#121114',
         'b': BAG, 'B': BAG_HI, 'o': BAG_LO, 't': '#3c3a3a', 'p': PANTS, 'q': PANTS_LO, 'w': STRIPE,
         'W': SHOE, 'x': SHOE_LO, 'k': SOLE}
    if not glance:
        head = [
            '.............lhhhh..............',   # 3
            '............lhhhhhhd............',
            '...........lhhhhhhhd............',
            '...........hzzzshhhd............',
            '...........hsessshhd............',
            '..........ssssszhhhd............',
            '...........sssshhhd.............',
            '...........hzzshhhd.............',
            '............hzhhhd..............',   # 11
        ]
    else:
        head = [
            '..............hhhhl.............',
            '.............dhhhhhl............',
            '.............dhhhhhhl...........',
            '.............dhhszzzh...........',
            '.............dhhsssesh..........',
            '.............dhhzsssss..........',
            '..............dhhssss...........',
            '..............dhhszzh...........',
            '...............dhhzh............',
        ]
    s.grid(0, 3, head, L)
    body = [
        '..........lhhhhhhhhd............',   # 12 shoulders
        '.........lhhhhhhhhhhd...........',
        '.........lhhbbbbbthhd...........',   # the bag on his chest, strap up over the far shoulder
        '.........lhbBBBBbhthd...........',
        '.........lhobbbbohhtd...........',
        '.........lhtoooohhhhd...........',
        '.........lhthhhhhhhdd...........',
        '.........lhhthhhhhhdd...........',
        '.........shhhhhhhhhds...........',   # 20 hands hanging at his sides
        '.........zdddddddddz............',   # ribbed hem
        '...........pppppqppp............',   # 22 track pants
        '...........wpppqpppw............',
        '...........wpppqpppw............',
        '...........wppp.pppw............',
        '...........wppp.pppw............',
        '...........wppp.pppw............',
        '...........wppq.pppw............',
        '...........qqqq.qqqq............',   # 29 cuffs
        '.........WWWWx.WWWWx............',   # 30 white sneakers, toes to the left
        '.........kkkkk.kkkkk............',
    ]
    s.grid(0, 12, body, L)
    for y in range(17, 20):                                # the inner edge of each sleeve
        s.set(10, y, HOOD_LO if not glance else HOOD)
        s.set(18, y, HOOD_LO)
    if glance:   # the near arm bent up, its hand on the bag's zip; the sleeve no longer hangs at his side
        s.erase(9, 18, 1, 4)
        s.grid(9, 14, [
            'lhSs',
            'lhhz',
            'lhd.',
            'ld..',
        ], L)
        for y in range(18, 21):
            s.set(10, y, HOOD_HI)
        s.set(10, 21, HOOD_LO)
    return s


def dealer():
    s = Sprite(64, 32, outline=False)
    s.blit(street_frame(False), 0, 0)
    s.blit(street_frame(True), 32, 0)
    return s


# ---------------------------------------------------------------- conversation close-up
TALK_W, TALK_H = 192, 120
LAMP = (14, -10)                                           # the street lamp, just off the top left corner
WALL, WALL_LO = '#4f4531', '#362f20'
DOOR, DOOR_LO = '#1d1a1c', '#121114'
STONE = '#5b5340'


def lamp_light(x, y):
    """How much of the sodium lamp reaches (x, y): 1 right under it, fading to 0 across the picture."""
    d = ((x - LAMP[0]) ** 2 + (y - LAMP[1]) ** 2) ** 0.5
    return max(0.0, 1.0 - d / 210)


def lit(col, x, y, amount=1.0):
    k = lamp_light(x, y) * amount
    return mix(shade(col, 0.55 + 0.75 * k), '#e0a845', 0.22 * k * k)


def tag(s, pts, col, w=2):
    """A spray-painted scrawl through points, w px thick, with a darker drip under the low points."""
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        for dx in range(w):
            for dy in range(w):
                s.line(x0 + dx, y0 + dy, x1 + dx, y1 + dy, col)
    low = sorted(pts, key=lambda p: -p[1])[:2]
    for x, y in low:
        s.vline(x, y + w, 3, shade(col, 0.7))


def background(s):
    W, H = TALK_W, TALK_H
    rng = noise(41)
    for y in range(H):                                     # plaster, warmed by the lamp at the top left
        for x in range(W):
            col = WALL if rng.random() > 0.12 else WALL_LO
            s.set(x, y, lit(col, x, y))
    for _ in range(14):                                    # cracks and chips
        x, y = rng.randint(8, 60), rng.randint(10, 110)
        for i in range(rng.randint(3, 7)):
            s.set(x + i, y + (i * rng.choice((0, 1))) // 2, lit(WALL_LO, x, y, 0.6))

    # the doorway he hangs about in: a stone frame around a recessed, unlit house door
    x0, x1, top = 66, 176, 14
    for y in range(top - 6, H):
        for x in range(x0 - 7, x1 + 7):
            if x0 <= x < x1 and y >= top:
                continue
            s.set(x, y, lit(STONE, x, y, 1.1))
    s.hline(x0 - 7, top - 6, x1 - x0 + 14, lit('#807254', x0, top - 6))      # lit top edge of the lintel
    s.vline(x0 - 7, top - 6, H, lit('#807254', x0 - 7, 60))
    s.hline(x0 - 1, top - 1, x1 - x0 + 2, '#262525'); s.vline(x0 - 1, top, H, '#262525')
    for y in range(top, H):                                # the recess: a reveal on the left, then the door
        for x in range(x0, x1):
            if x < x0 + 6:
                col = lit(WALL_LO, x, y, 0.5)
            else:
                col = DOOR
                px = (x - x0 - 6) % 52
                if px in (0, 51):
                    col = DOOR_LO
                elif 6 <= px <= 45 and (y - top) % 50 in (6, 44):
                    col = '#2a2527'                        # panel mouldings catching nothing much
                elif 6 <= px <= 45 and 6 < (y - top) % 50 < 44 and px in (6, 45):
                    col = '#2a2527'
            s.set(x, y, col)
    s.rect(x0 + 6, top, x1 - x0 - 6, 3, DOOR_LO)           # the shadow under the lintel
    s.rect(160, 70, 3, 6, '#5b5a5a'); s.set(160, 70, '#807e7e')   # a letterbox-brass gone grey: the lock

    # graffiti: a pink piece on the left wall with a cyan throw-up under it, a silver signature on the door
    spray_text(s, 8, 26, 'ZEKO', '#ff71f0', '#5a1f55', 3, noise(3))
    spray_text(s, 12, 62, 'NK44', '#71faff', '#1a2b33', 2, noise(8))
    for x, y, col in ((40, 12, '#d2d631'), (48, 18, '#f0ece0'), (14, 90, '#d93532'), (46, 84, '#f0ece0'),
                      (8, 104, '#ff71f0')):                # stickers
        s.rect(x, y, 6, 4, lit(col, x, y, 1.2))
        s.set(x + 1, y + 1, lit(shade(col, 0.6), x, y)); s.hline(x + 2, y + 2, 3, lit(shade(col, 0.6), x, y))
    tag(s, [(130, 34), (134, 24), (138, 34), (141, 26), (145, 35), (150, 24), (149, 33), (156, 30), (162, 34)],
        '#a9a7a7', 1)
    tag(s, [(128, 40), (164, 37), (168, 32)], '#807e7e', 1)
    tag(s, [(62, 96), (58, 86), (64, 82), (60, 104)], '#d2d631', 1)


def spray_text(s, x, y, text, col, outline, k, rng):
    """Letters from the 3x5 font at k x, slanted and jostled like a quick tag, with a dark outline and drips."""
    pts = set()
    for ch in text:
        glyph = FONT[ch]
        jump = rng.randint(-1, 1) * k
        for gy, row in enumerate(glyph):
            for gx, bit in enumerate(row):
                if bit == '1':
                    for dy in range(k):
                        for dx in range(k):
                            yy = y + jump + gy * k + dy
                            pts.add((x + gx * k + dx + (5 * k - (yy - y)) // 4, yy))
        x += (len(glyph[0]) + 1) * k - 1
    for (px, py) in pts:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1)):
            if (px + dx, py + dy) not in pts:
                s.set(px + dx, py + dy, outline)
    for (px, py) in pts:
        s.set(px, py, mix(col, '#f0ece0', 0.35) if (px, py - 1) not in pts else col)
    for (px, py) in sorted(pts)[::7]:                      # a few drips off the bottom edges
        if (px, py + 1) not in pts and rng.random() < 0.4:
            s.vline(px, py + 2, rng.randint(2, 4), shade(col, 0.7))


def portrait(s):
    """Him from the chest up: hood up, lamp on his left cheek, eyes sliding off to the side."""
    cx = 100
    # shoulders and chest: a hoodie spreading out to the bottom edge, lit from the left
    for y in range(66, TALK_H):
        half = min(66, 22 + (y - 66) * 2.4)
        for x in range(int(cx - half), int(cx + half) + 1):
            u = (x - cx) / max(half, 1)
            f = 1.05 - 0.45 * (u + 1) / 2
            if u < -0.86:
                f = 1.3                                    # lamp catching the edge of his shoulder
            s.set(x, y, shade(HOOD, f + 0.15 * lamp_light(x, y)))
    # sleeve seams where the arms meet the body
    for y in range(86, TALK_H):
        s.set(int(cx - 44 + (y - 86) * 0.15), y, HOOD_LO)
        s.set(int(cx + 44 - (y - 86) * 0.15), y, shade(HOOD_LO, 0.8))
    # the hood: a big rounded shape round the head, its opening framing the face
    hx, hy, hrx, hry = cx - 2, 42, 31, 34
    for y in range(int(hy - hry), int(hy + hry) + 2):
        for x in range(int(hx - hrx) - 1, int(hx + hrx) + 2):
            u, v = (x - hx) / hrx, (y - hy) / hry
            if u * u + v * v > 1:
                continue
            f = 1.0 - 0.35 * u - 0.2 * v
            if u < -0.82 or (v < -0.85 and u < 0.2):
                f = 1.45                                   # lamp rim along the hood's top and left
            s.set(x, y, shade(HOOD, f))
    fx, fy = cx - 6, 50                                    # the face opening, slightly to our left: he faces us 3/4
    for y in range(fy - 26, fy + 28):
        for x in range(fx - 21, fx + 22):
            u, v = (x - fx) / 20, (y - fy) / 26
            if u * u + v * v <= 1:
                s.set(x, y, HOOD_LO if u * u + v * v > 0.8 else '#0e1216')   # inside the hood is dark
    # the face
    for y in range(fy - 20, fy + 24):
        for x in range(fx - 16, fx + 16):
            u, v = (x - fx + 1) / 15.5, (y - fy - 1) / 22.5
            if v > 0.4:
                u *= 1 + (v - 0.4) * 0.9                    # the jaw narrows to the chin
            if u * u + v * v > 1:
                continue
            light = -0.8 * u - 0.3 * v                     # lamp from the upper left
            if v < -0.55:
                light -= 0.9                               # the hood's shadow across his brow
            col = SKIN_HI if light > 0.45 else SKIN if light > -0.15 else SKIN_LO if light > -0.75 else '#7d4a37'
            s.set(x, y, col)
    rng = noise(9)
    for y in range(fy + 10, fy + 24):                      # stubble along the jaw
        for x in range(fx - 14, fx + 15):
            if (x, y) in s.p and s.p[(x, y)] in (SKIN, SKIN_LO, SKIN_HI) and rng.random() < 0.28:
                s.set(x, y, shade(s.p[(x, y)], 0.78))
    ey = fy - 2
    # brows, low and flat
    s.hline(fx - 12, ey - 5, 8, '#3a2a22'); s.hline(fx + 3, ey - 5, 8, '#2a1e18')
    s.set(fx - 12, ey - 4, '#3a2a22'); s.set(fx + 10, ey - 4, '#2a1e18')
    # eyes: narrow, pupils pushed to the far side as if checking the corner
    for ex in (fx - 11, fx + 4):
        s.hline(ex, ey - 1, 6, '#7d4a37')                  # heavy lids
        s.hline(ex + 1, ey, 5, '#dcd6c6')
        s.rect(ex + 1, ey, 2, 1, '#2a1e18'); s.set(ex + 1, ey + 1, '#7d4a37'); s.set(ex + 2, ey + 1, '#2a1e18')
        s.hline(ex + 1, ey + 2, 5, shade(SKIN_LO, 0.9))     # bags under the eyes
    s.set(fx - 10, ey, '#f0ece0')                          # glint on the lit side
    # nose: a lit ridge with its shadow falling right, nostril at the bottom
    for y in range(ey, ey + 11):
        s.set(fx - 2, y, SKIN_HI if y < ey + 9 else SKIN)
        s.set(fx - 1, y, SKIN_LO)
    s.hline(fx - 4, ey + 11, 3, SKIN_LO); s.set(fx, ey + 11, '#7d4a37'); s.set(fx + 1, ey + 10, SKIN_LO)
    s.set(fx - 3, ey + 11, '#7d4a37')
    # mouth: a flat line, one corner pulled up: not quite a smile
    my = ey + 16
    s.hline(fx - 7, my, 11, '#7d4a37')
    s.set(fx + 4, my - 1, '#7d4a37'); s.set(fx + 5, my - 1, '#7d4a37')
    s.hline(fx - 5, my + 1, 8, shade(SKIN, 1.05))
    s.hline(fx - 4, my + 2, 6, SKIN_LO)
    # neck in the hood's shadow, then the hoodie's neckline and drawstrings
    for y in range(fy + 22, fy + 30):
        for x in range(fx - 8, fx + 9):
            if (x, y) not in s.p or s.p[(x, y)] in ('#0e1216', HOOD_LO):
                s.set(x, y, '#7d4a37' if y < fy + 26 else '#5a3426')
    for x, n in ((fx - 6, 22), (fx + 9, 18)):              # drawstrings, with metal aglets
        for i in range(n):
            s.set(x + (i // 8), fy + 26 + i, '#a9a7a7' if i % 4 else '#807e7e')
        s.rect(x + (n - 1) // 8, fy + 26 + n, 1, 2, '#c6c754')
    # bum bag worn across the chest, strap from his far shoulder
    bx0, by0, bw, bh = 70, 86, 40, 14
    for i in range(48):                                    # strap up to the shoulder on our right
        x, y = bx0 + bw - 2 + i, by0 + 2 - int(i * 0.62)
        s.rect(x, y, 3, 2, '#3c3a3a'); s.set(x, y, '#5b5a5a')
    for i in range(18):                                    # and down under his arm on our left
        x, y = bx0 + 2 - i, by0 + 6 + int(i * 0.5)
        s.rect(x, y, 2, 3, '#3c3a3a'); s.set(x, y, '#5b5a5a')
    for y in range(by0, by0 + bh):
        for x in range(bx0, bx0 + bw):
            u, v = (x - bx0) / bw, (y - by0) / bh
            if (u < 0.06 or u > 0.94) and (v < 0.2 or v > 0.8):
                continue                                   # rounded ends
            f = 1.15 - 0.4 * u - 0.25 * v
            s.set(x, y, shade(BAG, f))
    s.hline(bx0 + 3, by0 + 1, bw - 6, BAG_HI)
    s.hline(bx0 + 2, by0 + 4, bw - 4, '#262525')            # zip
    s.hline(bx0 + 3, by0 + 5, bw - 6, BAG_LO)
    s.rect(bx0 + bw - 9, by0 + 4, 2, 4, '#a9a7a7'); s.set(bx0 + bw - 9, by0 + 4, '#f0ece0')   # zip pull
    s.rect(bx0 + 8, by0 + 8, 6, 3, '#121114'); s.hline(bx0 + 9, by0 + 9, 4, '#dcd6c6')      # a little logo patch
    s.hline(bx0 + 2, by0 + bh - 1, bw - 4, BAG_LO)


def frame(s):
    """A dark rim like the container view's, lit along the top and left."""
    W, H = TALK_W, TALK_H
    rim, hi, lo = '#2c2929', '#47433c', '#121114'
    for y in range(H):
        for x in range(W):
            edge = min(x, y, W - 1 - x, H - 1 - y)
            if edge < 4:
                col = rim
                if edge == 0:
                    col = lo
                elif edge == 1 and (y <= 1 or x <= 1):
                    col = hi
                elif edge == 3:
                    col = lo
                s.set(x, y, col)


def talk():
    s = Sprite(TALK_W, TALK_H, outline=False)
    background(s)
    portrait(s)
    frame(s)
    return s


# ---------------------------------------------------------------- HUD pickups (outlined like pickup_bottle.png)
def outlined(inner, col='#262525'):
    """`inner` padded by a pixel and ringed with the HUD icons' soft black (4-neighbour, so corners stay round)."""
    s = Sprite(inner.w + 2, inner.h + 2, outline=False)
    s.blit(inner, 1, 1)
    for (x, y) in list(s.p):
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (x + dx, y + dy) not in s.p:
                s.set(x + dx, y + dy, col)
    return s


def baggie(s, x0, y0, w, h, zip_col):
    """A small clear zip bag: pale plastic edges, a coloured zip strip at the top, see-through elsewhere."""
    clear, edge = '#8a96a6', '#b0bac8'
    s.rect(x0, y0, w, h, clear)
    s.hline(x0, y0, w, edge)
    s.hline(x0, y0 + 1, w, zip_col)
    s.vline(x0, y0, h, edge)
    s.vline(x0 + w - 1, y0 + 2, h - 2, '#6b7686')
    s.hline(x0, y0 + h - 1, w, '#6b7686')
    s.set(x0 + 1, y0 + 3, '#f0ece0')                       # glint on the plastic


def weed():
    s = Sprite(9, 11, outline=False)
    baggie(s, 0, 0, 9, 11, '#d93532')
    s.grid(1, 3, [                                         # a sticky green bud with orange hairs
        '..gGg..',
        '.gGgGo.',
        'gGgdgg.',
        'gogGgd.',
        '.gdgGg.',
        '..gdd..',
    ], {'g': '#2fa84a', 'G': '#8fd18a', 'd': '#127a2a', 'o': '#e08a3c'})
    s.set(1, 3, '#f0ece0')
    return outlined(s)


def ketamine():
    s = Sprite(9, 11, outline=False)
    baggie(s, 0, 0, 9, 11, '#3460d9')
    s.rect(1, 6, 7, 4, '#dcd6c6')                          # crystals settled at the bottom, catching light
    for x, y in ((2, 6), (5, 7), (3, 8), (6, 9), (1, 9)):
        s.set(x, y, '#f0ece0')
    for x, y in ((4, 6), (2, 9), (6, 7)):
        s.set(x, y, '#b0bac8')
    s.grid(4, 2, [                                         # a printed pink stamp on the bag
        'mMm',
        'MmM',
        'mMm',
    ], {'m': '#d26ba0', 'M': '#ff71f0'})
    s.set(1, 3, '#f0ece0')
    return outlined(s)


def cocaine():
    """A Briefchen: a little packet folded from glossy magazine paper."""
    s = Sprite(11, 8, outline=False)
    s.grid(0, 0, [
        'wwwwwwwwwwx',
        'wWWwwwwwwxx',
        'wwWWwwwwxwx',
        'wwwwWWwxwwx',
        'wwwwwwxccwx',
        'wwwwwxwcbwx',
        'wwwwxwwwwwx',
        'xxxxxxxxxxx',
    ], {'w': '#f0ece0', 'W': '#ffffff', 'x': '#b3ac99', 'c': '#be2633', 'b': '#71faff'})
    return outlined(s)


def heroin():
    """A little brown knotted bag, twisted shut."""
    s = Sprite(9, 11, outline=False)
    s.grid(0, 0, [
        '.........',
        '..b...B..',
        '...bBb...',
        '....n....',
        '...nNn...',
        '..nNNnn..',
        '.nNBNnnd.',
        '.nNNnnnd.',
        '.nnnnndd.',
        '..nnndd..',
        '...ddd...',
    ], {'n': '#8a6240', 'N': '#a97b4f', 'B': '#c29262', 'd': '#6b4a2f', 'b': '#6b4a2f'})
    return outlined(s)


def poppers():
    """A tiny brown glass bottle with a black cap and a loud yellow label."""
    s = Sprite(7, 13, outline=False)
    s.grid(0, 0, [
        '.kkkkk.',
        '.kKkkk.',
        '.kkkkk.',
        '..ggg..',
        'gGgggdg',
        'gGgggdg',
        'yyyyyyy',
        'yrrrrry',
        'yyyyyyy',
        'gGgggdg',
        'gGgggdg',
        'ggggddg',
        'ddddddd',
    ], {'k': '#3c3a3a', 'K': '#807e7e', 'g': '#6b4a2f', 'G': '#c29262', 'd': '#4a321f',
        'y': '#d2d631', 'r': '#be2633'})
    return outlined(s)


# ================================================================ Jule
# A tired neighbour on the stoop of her building: auburn hair in a messy bun, a big mustard cardigan over a striped
# shirt, black leggings, pink slippers, a red mug of tea. She wants a bag of weed and won't buy it herself.
HAIR, HAIR_HI, HAIR_LO = '#8a3b2a', '#b4553a', '#5a2419'
J_SKIN, J_SKIN_HI, J_SKIN_LO, J_SKIN_DK = '#e0b08f', '#ecc4a4', '#b7826a', '#8f5f4c'
CARDI, CARDI_HI, CARDI_LO = '#a8812f', '#c99e45', '#7a5b1f'
SHIRT, SHIRT_STRIPE = '#dcd6c6', '#3c4a6b'
MUG, MUG_HI, MUG_LO = '#d93532', '#f07a6a', '#8f1f22'
SLIPPER, SLIPPER_LO = '#d26ba0', '#a8507e'


def jule_frame(glance):
    """32x32, facing left like the dealer. `glance`: head turned to look down the street behind her."""
    s = Sprite(32, 32, outline=False)
    L = {'r': HAIR, 'R': HAIR_HI, 'q': HAIR_LO, 's': J_SKIN, 'S': J_SKIN_HI, 'z': J_SKIN_LO, 'e': '#121114',
         'l': '#b4553a', 'c': CARDI, 'C': CARDI_HI, 'd': CARDI_LO, 't': SHIRT, 'T': SHIRT_STRIPE,
         'm': MUG, 'M': MUG_HI, 'n': MUG_LO, 'j': '#262525', 'J': '#1a1919', 'p': SLIPPER, 'P': SLIPPER_LO}
    head = [
        '.....qRRq.....',   # 3 the bun
        '....qRrrrq....',
        '...RRRrrrrq...',
        '..RrrrrrrrRq..',
        '..RsSssrrrrq..',
        '..sessSsrrrq..',
        '.sssssszrrrq..',
        '..slssszrrrq..',
        '...sszzrrrq...',
        '....zzsrrq....',   # 12 neck, hair down her back
    ]
    if glance:
        head = [row[::-1] for row in head]
    s.grid(9, 3, head, L)
    body = [
        '...CcttcccCd..',   # 13 shoulders, cardigan open at the front
        '..CCcTTccccd..',
        '..Ccctttcccd..',
        '..CccTTTcccd..',
        '.MmCctttcccd..',   # 17 the mug, held in front
        'nmmsctTTcccd..',
        '.mmsctttcccd..',
        '..CcctTTcccd..',
        '..Cccttttccd..',
        '..dddcccdddd..',   # 22 the cardigan hangs long
        '...jjjjjjjj...',
        '...jjjjJjjj...',
        '...jjj..Jjj...',
        '...jjj..jjj...',
        '...jjj..jjj...',
        '...Jjj..jjJ...',
        '...jjj..jjj...',
        '..pppP.pppP...',   # 30 slippers
        '..PPPP.PPPP...',
    ]
    s.grid(9, 13, body, L)
    return s


def jule():
    s = Sprite(64, 32, outline=False)
    s.blit(jule_frame(False), 0, 0)
    s.blit(jule_frame(True), 32, 0)
    return s


J_WALL, J_WALL_LO = '#4a4840', '#3f3c35'                   # the grey-brown plaster of her building ('c')
WOOD, WOOD_HI, WOOD_LO = '#5a3a24', '#7a5236', '#3a2416'
GLASS = '#e0a845'


def jule_background(s):
    W, H = TALK_W, TALK_H
    rng = noise(57)
    for y in range(H):
        for x in range(W):
            s.set(x, y, lit(J_WALL if rng.random() > 0.14 else J_WALL_LO, x, y))
    # her front door: a tall wooden Altbau door to our right, its glass panel lit by the stairwell light behind it
    x0, x1, top = 112, 184, 6
    for y in range(top - 4, H):
        for x in range(x0 - 5, x1 + 5):
            s.set(x, y, lit('#5b5a5a', x, y, 0.9))           # the stone surround
    s.hline(x0 - 5, top - 4, x1 - x0 + 10, lit('#807e7e', x0, top))
    for y in range(top, H):
        for x in range(x0, x1):
            px = (x - x0) % 36                              # two door leaves
            col = WOOD
            if px in (0, 35):
                col = WOOD_LO
            elif px == 1:
                col = WOOD_HI
            elif 5 <= px <= 30 and top + 6 <= y <= top + 46:
                col = mix(GLASS, '#f0ece0', 0.25) if (px + y) % 9 else '#c99e45'   # frosted glass, lit
                if px in (5, 30) or y in (top + 6, top + 46):
                    col = WOOD_LO
                elif px == 17:
                    col = WOOD_LO                          # glazing bar
            elif 5 <= px <= 30 and top + 54 <= y <= top + 104 and (px in (5, 30) or y in (top + 54, top + 104)):
                col = WOOD_LO                              # the lower panel's moulding
            s.set(x, y, col)
    s.rect(x0 + 32, 70, 2, 8, '#c6c754'); s.set(x0 + 32, 70, '#f0ece0')   # brass handles
    s.rect(x0 + 38, 70, 2, 8, '#c6c754')
    # the doorbell panel beside the door: name tags in two columns, one of them hers
    bx, by = 90, 44
    s.rect(bx, by, 14, 34, '#a9a7a7'); s.rect(bx + 1, by + 1, 12, 32, '#807e7e')
    for i in range(6):
        for j in range(2):
            tx, ty = bx + 2 + j * 6, by + 3 + i * 5
            s.rect(tx, ty, 4, 3, '#f0ece0' if (i, j) != (2, 1) else '#ff71f0')
            s.set(tx + 4, ty + 1, '#3c3a3a')               # the button
    s.rect(bx + 3, by + 33 - 2, 8, 1, '#3c3a3a')            # speaker grille
    # house number, a sticker or two, a scrawled tag
    s.text(94, 30, '44', '#f0ece0', 2)
    for x, y, col in ((14, 20, '#d2d631'), (24, 26, '#71faff'), (8, 96, '#ff71f0')):
        s.rect(x, y, 6, 4, lit(col, x, y, 1.2))
        s.hline(x + 1, y + 2, 4, lit(shade(col, 0.6), x, y))
    tag(s, [(10, 70), (16, 60), (20, 70), (26, 58), (30, 68), (36, 62)], '#a9a7a7', 1)


def jule_portrait(s):
    """Her from the chest up, turned 3/4 towards us, mug of tea in both hands, tired eyes."""
    cx = 62
    # shoulders: the big cardigan, then the striped shirt in its open front
    for y in range(70, TALK_H):
        half = min(60, 20 + (y - 70) * 2.2)
        for x in range(int(cx - half), int(cx + half) + 1):
            u = (x - cx) / max(half, 1)
            f = 1.08 - 0.4 * (u + 1) / 2
            if u < -0.88:
                f = 1.3
            col = shade(CARDI, f + 0.12 * lamp_light(x, y))
            if (x + y * 2) % 5 == 0:
                col = shade(col, 0.9)                      # knit texture
            if abs(x - cx + 2) < 3 + (y - 70) * 0.35:
                col = SHIRT if (y // 3) % 2 else SHIRT_STRIPE
            s.set(x, y, col)
    # hair behind the head and shoulders
    rng = noise(23)
    for y in range(12, 84):
        for x in range(cx - 30, cx + 32):
            u, v = (x - cx - 1) / 29, (y - 46) / 36
            if u * u + v * v <= 1:
                f = 1.0 - 0.3 * u
                s.set(x, y, shade(HAIR, f) if rng.random() > 0.1 else HAIR_LO)
    # the bun, on top and a bit to our right
    bx, by = cx + 8, 10
    for y in range(by - 9, by + 9):
        for x in range(bx - 11, bx + 11):
            u, v = (x - bx) / 10.5, (y - by) / 8.5
            if u * u + v * v <= 1:
                s.set(x, y, HAIR_HI if (u < -0.3 and v < 0) else HAIR if rng.random() > 0.15 else HAIR_LO)
    for x, y in ((bx + 9, by - 6), (bx + 11, by - 4), (bx + 12, by - 2), (bx - 10, by - 7)):   # stray hairs
        s.set(x, y, HAIR_HI)
    # face
    fx, fy = cx - 4, 46
    for y in range(fy - 22, fy + 24):
        for x in range(fx - 17, fx + 17):
            u, v = (x - fx) / 16, (y - fy) / 22.5
            if v > 0.35:
                u *= 1 + (v - 0.35) * 1.0
            if u * u + v * v > 1:
                continue
            light = -0.8 * u - 0.3 * v
            col = J_SKIN_HI if light > 0.45 else J_SKIN if light > -0.2 else J_SKIN_LO if light > -0.8 else J_SKIN_DK
            s.set(x, y, col)
    # fringe falling over the forehead, sweeping to our right
    for y in range(fy - 24, fy - 10):
        for x in range(fx - 17, fx + 18):
            edge = fy - 12 - (x - fx + 17) * 0.18 - (2 if (x // 3) % 2 else 0)
            if y < edge and (x - fx) ** 2 / 17 ** 2 + (y - fy) ** 2 / 23 ** 2 <= 1.05:
                s.set(x, y, HAIR_HI if x < fx - 6 else HAIR)
    ey = fy - 3
    s.hline(fx - 12, ey - 5, 7, HAIR_LO); s.hline(fx + 4, ey - 5, 7, HAIR_LO)        # brows, raised in the middle
    s.set(fx - 6, ey - 6, HAIR_LO); s.set(fx + 4, ey - 6, HAIR_LO)
    for ex in (fx - 12, fx + 4):
        s.hline(ex, ey - 1, 7, J_SKIN_DK)                  # heavy lids: she hasn't slept
        s.hline(ex + 1, ey, 5, '#f0ece0')
        s.rect(ex + 2, ey, 2, 2, '#3a6b4a'); s.set(ex + 2, ey, '#121114')   # green eyes
        s.hline(ex, ey + 2, 7, shade(J_SKIN_LO, 0.85))     # dark circles
        s.hline(ex + 1, ey + 3, 5, shade(J_SKIN_LO, 0.95))
    s.set(fx - 9, ey, '#ffffff')
    for x, y in ((fx - 13, ey + 6), (fx - 10, ey + 7), (fx - 7, ey + 6), (fx + 6, ey + 6), (fx + 9, ey + 7)):
        s.set(x, y, shade(J_SKIN, 0.85))                   # freckles
    for y in range(ey + 1, ey + 10):
        s.set(fx - 1, y, J_SKIN_HI if y < ey + 8 else J_SKIN)
        s.set(fx, y, J_SKIN_LO)
    s.hline(fx - 3, ey + 10, 3, J_SKIN_LO); s.set(fx + 1, ey + 10, J_SKIN_DK)
    my = ey + 15                                           # mouth: a tired, lopsided half-smile
    s.hline(fx - 6, my, 10, '#9a4a3a')
    s.set(fx - 7, my - 1, '#9a4a3a')
    s.hline(fx - 5, my + 1, 8, '#c86a5a')
    s.hline(fx - 4, my + 2, 6, J_SKIN_LO)
    s.rect(fx + 13, ey + 4, 2, 3, '#d2d631'); s.set(fx + 13, ey + 4, '#f0ece0')       # a gold earring
    # neck
    for y in range(fy + 20, fy + 28):
        for x in range(fx - 7, fx + 8):
            if (x, y) not in s.p or s.p[(x, y)] in (HAIR, HAIR_LO, HAIR_HI) or y > fy + 22:
                s.set(x, y, J_SKIN_LO if x > fx else J_SKIN)
    # the mug, held up in front of her chest in both hands, steam curling off it
    mx, my0, mw, mh = 66, 86, 22, 24
    for y in range(my0, my0 + mh):
        for x in range(mx, mx + mw):
            u = (x - mx) / mw
            s.set(x, y, MUG_HI if u < 0.2 else MUG if u < 0.75 else MUG_LO)
    s.hline(mx, my0, mw, '#5a1a1c'); s.hline(mx + 1, my0 + 1, mw - 2, '#3a2416')       # rim and the tea in it
    for y in range(my0 + 6, my0 + 18):                     # the handle
        s.set(mx + mw, y, MUG_LO); s.set(mx + mw + 4, y, MUG_LO)
    s.hline(mx + mw, my0 + 6, 5, MUG_LO); s.hline(mx + mw, my0 + 17, 5, MUG_LO)
    s.text(mx + 4, my0 + 9, 'NK', '#f0ece0')
    for hx in (mx - 6, mx + mw - 4):                       # hands wrapped round it
        s.rect(hx, my0 + 8, 10, 10, J_SKIN)
        s.hline(hx, my0 + 8, 10, J_SKIN_HI)
        for k in range(1, 4):
            s.hline(hx + 1, my0 + 8 + k * 2 + 1, 8, J_SKIN_LO)
        s.rect(hx - 1 if hx < mx else hx + 8, my0 + 12, 3, 12, CARDI_LO)     # cuffs of the sleeves
    for i in range(16):                                    # steam
        x = mx + 8 + int(3 * __import__('math').sin(i / 2.2))
        s.set(x, my0 - 3 - i, mix('#f0ece0', J_WALL, i / 18))


def jule_talk():
    s = Sprite(TALK_W, TALK_H, outline=False)
    jule_background(s)
    jule_portrait(s)
    frame(s)
    return s


ASSETS = {  # key: (aseprite name, draw, output under public/assets)
    'dealer': ('npc_dealer', dealer, 'npc/dealer.png'),
    'talk': ('npc_dealer_talk', talk, 'talk/dealer.png'),
    'jule': ('npc_jule', jule, 'npc/jule.png'),
    'jule_talk': ('npc_jule_talk', jule_talk, 'talk/jule.png'),
    'weed': ('npc_pickup_weed', weed, 'pickups/pickup_weed.png'),
    'ketamine': ('npc_pickup_ketamine', ketamine, 'pickups/pickup_ketamine.png'),
    'cocaine': ('npc_pickup_cocaine', cocaine, 'pickups/pickup_cocaine.png'),
    'heroin': ('npc_pickup_heroin', heroin, 'pickups/pickup_heroin.png'),
    'poppers': ('npc_pickup_poppers', poppers, 'pickups/pickup_poppers.png'),
}
PICKUPS = ('weed', 'ketamine', 'cocaine', 'heroin', 'poppers')


def main(names):
    if 'pickups' in names:
        names = [n for n in names if n != 'pickups'] + list(PICKUPS)
    studio = Studio()
    try:
        for key, (name, fn, dest) in ASSETS.items():
            if names and key not in names:
                continue
            studio.make(name, fn(), dest)
            print('drew', key)
    finally:
        studio.close()


if __name__ == '__main__':
    main(sys.argv[1:])
