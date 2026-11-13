"""Neukölln street kit, part 2: 6x4-tile shopfronts (one per kind of shop)."""
from spriteart import mix, noise, shade

FRAME = '#1d1b1b'


def neon_text(s, x, y, text, col, k=2, bg=None):
    s.text(x, y, text, col, k)
    halo = mix(col, bg or '#1d1b1b', 0.65)
    for (px, py), c0 in list(s.p.items()):
        if c0 == col:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if (px + dx, py + dy) not in s.p:
                    s.set(px + dx, py + dy, halo)


def window_box(s, x, y, w, h):
    s.rect(x - 2, y - 2, w + 4, h + 4, FRAME)
    s.hline(x - 2, y - 2, w + 4, '#3c3a3a')


# Window interiors ---------------------------------------------------------
def interior_gradient(s, x, y, w, h, top, bottom):
    for yy in range(h):
        s.hline(x, y + yy, w, mix(top, bottom, yy / max(1, h - 1)))


def paint_spati(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#f0c060', '#b8782c')
    cols = ['#be2633', '#2fa84a', '#3460d9', '#d2d631', '#d26ba0', '#c46927', '#71faff']
    for tier, ty in enumerate((y + 3, y + 14, y + 25)):
        s.hline(x, ty + 8, w - 14, '#3c3a3a')
        for i in range(0, w - 16, 4):
            col = cols[(i // 4 + tier * 2) % len(cols)]
            hgt = 6 if tier < 2 else 5
            s.rect(x + 1 + i, ty + 8 - hgt, 3, hgt, col)
            s.hline(x + 1 + i, ty + 8 - hgt, 3, shade(col, 1.3))
    s.rect(x + w - 13, y + 1, 12, h - 2, '#2d4a55')            # drinks fridge glowing cyan
    s.rect(x + w - 12, y + 2, 10, h - 4, '#71faff')
    for k in range(4):
        s.hline(x + w - 12, y + 8 + k * 7, 10, '#2d4a55')
        for i in range(0, 8, 2):
            s.rect(x + w - 11 + i, y + 3 + k * 7, 1, 4, cols[(i + k) % len(cols)])


def paint_doener(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#d9772b', '#7a2a12')
    cx = x + 16
    for i, (rw, yy) in enumerate(((7, 4), (8, 8), (9, 13), (9, 18), (8, 23), (6, 27))):
        s.rect(cx - rw // 2, y + yy, rw, 5, '#7a3f1d' if i % 2 else '#8f4a22')
        s.hline(cx - rw // 2, y + yy, rw, '#b46a38')
    s.rect(cx - 1, y, 2, 3, '#4a321f'); s.rect(cx - 1, y + 31, 2, 3, '#4a321f')
    s.rect(cx + 8, y + 5, 3, 24, '#ff7a1c')                    # grill element
    for k in range(5):
        s.set(cx + 9, y + 7 + k * 5, '#ffd23c')
    s.rect(x + 28, y + 22, w - 30, 3, '#cfcabd')                # counter
    s.rect(x + 28, y + 25, w - 30, h - 25, '#3c3a3a')
    for i in range(3):
        s.rect(x + 31 + i * 7, y + 17, 5, 5, ('#2fa84a', '#be2633', '#dcd6c6')[i])


def paint_kneipe(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#4a2c14', '#150e08')
    s.rect(x, y + 6, w, 2, '#6b4a2f')                           # shelf with bottles
    for i in range(0, w - 4, 5):
        col = ('#127a2a', '#c46927', '#dcd6c6', '#8f1c26')[i // 5 % 4]
        s.rect(x + 2 + i, y + 1, 2, 5, col)
    for i in range(3):                                          # stools
        sx = x + 8 + i * 14
        s.ellipse(sx, y + h - 13, 4, 1.6, '#2a1a0e')
        s.vline(sx, y + h - 11, 9, '#1d1b1b')
        s.hline(sx - 3, y + h - 2, 7, '#1d1b1b')
    s.rect(x, y + h - 8, w, 8, '#2a1a0e')
    neon_text(s, x + 4, y + 11, 'BIER', '#12ff00', 1, '#150e08')


def paint_friseur(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#bcd0dc', '#7f98a8')
    for i in range(2):
        mx = x + 5 + i * 24
        s.rect(mx, y + 3, 16, 20, '#3c3a3a')
        s.rect(mx + 2, y + 5, 12, 16, '#e8f0f4')
        s.set(mx + 4, y + 7, '#ffffff'); s.set(mx + 5, y + 8, '#ffffff')
        s.rect(mx + 5, y + 26, 6, 6, '#be2633')                  # chair
        s.rect(mx + 3, y + 29, 10, 3, '#8f1c26')
        s.vline(mx + 8, y + 32, 3, '#807e7e')


def paint_kiosk(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#e0c878', '#a8873a')
    cols = ['#be2633', '#3460d9', '#d2d631', '#2fa84a', '#d26ba0', '#dcd6c6', '#c46927']
    for row in range(3):
        for i in range(0, w - 8, 6):
            col = cols[(i // 6 + row * 2) % len(cols)]
            s.rect(x + 3 + i, y + 3 + row * 11, 5, 9, col)
            s.hline(x + 3 + i, y + 3 + row * 11, 5, '#f0ece0')
    s.rect(x, y + h - 5, w, 5, '#6b4a2f')


def paint_handy(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#101a2a', '#05080e')
    cols = ['#71faff', '#ff71f0', '#d2d631', '#2fa84a', '#71faff']
    for row in range(3):
        for i in range(0, w - 6, 7):
            col = cols[(i // 7 + row) % len(cols)]
            s.rect(x + 3 + i, y + 4 + row * 11, 4, 8, '#1d1b1b')
            s.rect(x + 4 + i, y + 5 + row * 11, 2, 5, col)


def paint_apotheke(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#dfeee0', '#9cc09c')
    for row in range(3):
        for i in range(0, w - 8, 6):
            s.rect(x + 3 + i, y + 4 + row * 11, 5, 8, ('#ffffff', '#3b9c5a', '#dcd6c6')[(i // 6 + row) % 3])
            s.hline(x + 3 + i, y + 4 + row * 11, 5, '#2f7a47')
    s.rect(x + w - 14, y + h - 12, 10, 10, '#2f7a47')
    s.rect(x + w - 11, y + h - 11, 4, 8, '#ffffff'); s.rect(x + w - 13, y + h - 8, 8, 4, '#ffffff')


def paint_dj(s, x, y, w, h):
    interior_gradient(s, x, y, w, h, '#2e1745', '#0c0714')
    sleeves = [('#ff71f0', '#1a1226'), ('#d2d631', '#121114'), ('#71faff', '#134ae0'), ('#e08a3c', '#4a1612'),
               ('#dcd6c6', '#be2633')]
    if w < 20:                                                  # side window: a stack of record spines
        for i in range(0, h - 4, 3):
            col = sleeves[(i // 3) % len(sleeves)][0]
            s.hline(x + 1, y + h - 3 - i, w - 2, shade(col, 0.55 if i % 2 else 0.8))
        s.set(x + w - 2, y + 2, '#e0a845')
        return
    # pendant lamp, its warm light pooling on the deck below
    s.vline(x + 39, y, 3, '#3c3a3a')
    s.rect(x + 37, y + 3, 5, 2, '#5b5a5a')
    s.hline(x + 38, y + 5, 3, '#ffd27a')
    s.set(x + 37, y + 5, '#6b4a2f'); s.set(x + 41, y + 5, '#6b4a2f')
    # LP sleeves on a ledge, faced out
    for i, (fg, bg) in enumerate(sleeves[:3]):
        sx, sy = x + 3 + i * 11, y + 3 + (i % 2)
        s.rect(sx, sy, 10, 10, bg)
        s.hline(sx, sy, 10, shade(bg, 1.6) if bg != '#121114' else '#3c3a3a')
        if i == 0:                                              # ring
            s.ellipse(sx + 4.5, sy + 4.5, 3, 3, fg)
            s.ellipse(sx + 4.5, sy + 4.5, 1.6, 1.6, bg)
        elif i == 1:                                            # stripes
            for k in range(2, 9, 3):
                s.hline(sx + 1, sy + k, 8, fg)
        else:                                                   # sun over waves
            s.rect(sx + 3, sy + 2, 4, 3, fg)
            for k in range(8):
                s.set(sx + 1 + k, sy + 7 + (k % 2), fg)
    s.hline(x, y + 15, 36, '#4f4531')
    s.hline(x, y + 16, 36, '#121114')
    # deck: table, turntable with a spinning record, tonearm
    s.rect(x, y + 25, w, 2, '#5b5340')
    s.hline(x + 30, y + 25, 18, '#8a6240')
    s.rect(x, y + 27, w, h - 27, '#1a1418')
    s.rect(x + 27, y + 18, 22, 7, '#3c3a3a')
    s.hline(x + 27, y + 18, 22, '#807e7e')
    s.hline(x + 27, y + 24, 22, '#262525')
    s.ellipse(x + 35, y + 20.5, 6.5, 2, '#121114')
    s.hline(x + 31, y + 20, 8, '#2e2d2d')
    s.rect(x + 34, y + 20, 3, 1, '#ff4d5e')
    s.line(x + 46, y + 18, x + 41, y + 21, '#a9a7a7')
    s.set(x + 46, y + 17, '#5b5a5a')
    s.set(x + 29, y + 23, '#12ff00'); s.set(x + 31, y + 23, '#e0a845')
    # crate of records below the ledge
    s.rect(x + 4, y + 19, 16, 6, '#4f4531')
    s.hline(x + 4, y + 19, 16, '#5b5340')
    for k in range(5):
        s.vline(x + 6 + k * 3, y + 17, 2, sleeves[k][0] if k % 2 else shade(sleeves[k][0], 0.6))
    s.hline(x + 4, y + 22, 16, '#362f20')


def paint_shutter(s, x, y, w, h):
    for yy in range(h):
        s.hline(x, y + yy, w, '#5b5a5a' if yy % 3 else '#2e2d2d')
    s.hline(x, y + h - 1, w, '#807e7e')


PAINTERS = dict(spati=paint_spati, doener=paint_doener, kneipe=paint_kneipe, friseur=paint_friseur,
                kiosk=paint_kiosk, handy=paint_handy, apotheke=paint_apotheke, closed=paint_shutter,
                dj=paint_dj)
DOOR_GLOW = dict(dj='#6a3a8c')


def shopfront(s, kind, sign, sign_bg, sign_fg, awning=None, lit_door=True, tag=None):
    s.rect(0, 0, 96, 64, '#2a2623')
    # sign band
    s.rect(0, 0, 96, 16, sign_bg)
    s.hline(0, 0, 96, shade(sign_bg, 1.5)); s.hline(0, 15, 96, shade(sign_bg, 0.5))
    if kind != 'closed':
        w = s.text_width(sign, 2)
        neon_text(s, (96 - w) // 2, 5 if 'Ä' not in sign else 6, sign, sign_fg, 2, sign_bg)
    else:
        s.text(30, 6, sign, shade(sign_bg, 1.4), 2)
    # display window
    wx, wy, ww, wh = 5, 22, 54, 33
    window_box(s, wx, wy, ww, wh)
    PAINTERS[kind](s, wx, wy, ww, wh)
    # door tile (column 4)
    s.rect(64, 16, 16, 48, FRAME)
    if kind == 'closed':
        paint_shutter(s, 66, 18, 12, 38)
    else:
        gl = DOOR_GLOW.get(kind, '#f0c060') if lit_door else '#16181e'
        interior_gradient(s, 66, 18, 12, 38, gl, shade(gl, 0.6))
        s.vline(77, 36, 4, '#cfcabd')
        if kind == 'spati':
            neon_text(s, 66, 22, 'OPEN', '#ff4d5e', 1, '#b8782c')
        if kind == 'dj':                                        # vinyl sticker on the door glass
            s.ellipse(71.5, 27.5, 3.2, 3.2, '#121114')
            s.ellipse(71.5, 27.5, 1, 1, '#ff71f0')
    # small side window
    if kind not in ('friseur',):
        window_box(s, 84, 24, 8, 31)
        interior_gradient(s, 84, 24, 8, 31, '#1d1b1b', '#0d0c0c') if kind == 'closed' else PAINTERS[kind](s, 84, 24, 8, 31)
        if kind == 'closed':
            paint_shutter(s, 84, 24, 8, 31)
    else:                                                       # barber pole
        s.rect(84, 26, 6, 26, '#dcd6c6')
        for i in range(0, 26, 5):
            for j in range(6):
                s.set(84 + j, 26 + (i + j) % 26, '#be2633')
                s.set(84 + j, 28 + (i + j) % 24, '#3460d9')
        s.rect(83, 24, 8, 2, '#807e7e'); s.rect(83, 52, 8, 2, '#807e7e')
    # plinth
    s.rect(0, 56, 96, 8, '#47433c')
    s.hline(0, 56, 96, '#7d7770')
    for x in range(10, 96, 24):
        s.vline(x, 58, 6, '#2a2826')
    # awning
    if awning:
        s.rect(0, 16, 96, 7, awning)
        for x in range(0, 96, 8):
            s.rect(x, 16, 4, 7, '#dcd6c6')
        for x in range(0, 96, 4):
            s.set(x + 1, 23, awning if (x // 4) % 2 == 0 else '#dcd6c6')
            s.set(x + 2, 23, awning if (x // 4) % 2 == 0 else '#dcd6c6')
        s.hline(0, 16, 96, shade(awning, 1.3))
        s.hline(0, 22, 96, shade(awning, 0.6))
    if tag:
        tag(s)


def tag_closed(s):
    s.text(20, 30, 'TOY', '#ff71f0', 3)
    s.text(21, 31, 'TOY', '#121114', 3)
    s.text(20, 30, 'TOY', '#ff71f0', 3)
    for x in (22, 32, 42):
        s.vline(x, 45, 6, '#ff71f0')


def shops(sheet):
    sheet.group('shopfronts')
    shopfront(sheet.add('shop_spati', 6, 4), 'spati', 'SPÄTI', '#1a1226', '#ff71f0', None, True)
    shopfront(sheet.add('shop_doener', 6, 4), 'doener', 'DONER', '#4a1612', '#ffb000', '#be2633')
    shopfront(sheet.add('shop_kneipe', 6, 4), 'kneipe', 'KNEIPE', '#1c140e', '#e08a3c', '#1f4a3a')
    shopfront(sheet.add('shop_friseur', 6, 4), 'friseur', 'FRISEUR', '#202a36', '#71faff')
    shopfront(sheet.add('shop_kiosk', 6, 4), 'kiosk', 'KIOSK', '#12224a', '#ffffff', '#3460d9')
    shopfront(sheet.add('shop_handy', 6, 4), 'handy', 'HANDY', '#0d1b2a', '#71faff')
    shopfront(sheet.add('shop_apotheke', 6, 4), 'apotheke', 'APOTHEKE', '#16301f', '#12ff00')
    shopfront(sheet.add('shop_closed', 6, 4), 'closed', 'LADEN', '#2a2a2e', '#807e7e', None, False, tag_closed)
    shopfront(sheet.add('shop_dj', 6, 4), 'dj', 'DJ RECORDS', '#140a1e', '#71faff')
