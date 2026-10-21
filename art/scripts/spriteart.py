"""Tiny pixel-art toolkit that draws through pixel-plugin's pixel-mcp server.

Sprites are described in code (rects, character grids, a 3x5 font) and then
pushed to Aseprite with create_canvas / draw_pixels / save_as, scaled with
scale_sprite and exported with export_sprite, so every asset also ends up as an
editable .aseprite file in art/.
"""
import os
import random

from pixelmcp import PixelMcp

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ART_DIR = os.path.join(ROOT, 'art')
PUBLIC = os.path.join(ROOT, 'public', 'assets')
TMP = os.environ.get('ART_TMP', '/tmp/berghain2-art')

# Shared palette, sampled from the OG sprites plus a few warm shop colours
P = dict(
    K0='#121114', K1='#262525', K2='#3c3a3a', K3='#5b5a5a', K4='#807e7e', K5='#a9a7a7',
    W0='#b3ac99', W1='#dcd6c6', W2='#f0ece0',
    R1='#be2633', R2='#8f1c26', R3='#d93532',
    O1='#c46927', O2='#c43a27', O3='#e08a3c',
    Y1='#c6c754', Y2='#aaaa38', Y3='#d2d631',
    G1='#127a2a', G2='#2fa84a', G3='#0b4d1b', G4='#8fd18a',
    B1='#134ae0', B2='#3460d9', B3='#1a2b33', B4='#b0bac8', B5='#71faff',
    S1='#d28c6b', S2='#db9b76', S3='#9f402d',
    N1='#6b4a2f', N2='#8a6240', N3='#4a321f', N4='#a97b4f',
    T1='#2f5550', T2='#356059', T3='#1e3a36',
    M1='#d26ba0', M2='#ff71f0',
)

# 3x5 pixel font, only the letters the shop needs
FONT = {
    'A': ['010', '101', '111', '101', '101'], 'B': ['110', '101', '110', '101', '110'],
    'C': ['011', '100', '100', '100', '011'], 'D': ['110', '101', '101', '101', '110'],
    'E': ['111', '100', '110', '100', '111'], 'F': ['111', '100', '110', '100', '100'],
    'G': ['011', '100', '101', '101', '011'], 'H': ['101', '101', '111', '101', '101'],
    'I': ['111', '010', '010', '010', '111'], 'L': ['100', '100', '100', '100', '111'],
    'M': ['101', '111', '111', '101', '101'], 'N': ['110', '101', '101', '101', '101'],
    'O': ['010', '101', '101', '101', '010'], 'P': ['110', '101', '110', '100', '100'],
    'R': ['110', '101', '110', '101', '101'], 'S': ['011', '100', '010', '001', '110'],
    'T': ['111', '010', '010', '010', '010'], 'U': ['101', '101', '101', '101', '111'],
    'W': ['101', '101', '111', '111', '101'], 'Y': ['101', '101', '010', '010', '010'],
    ' ': ['0', '0', '0', '0', '0'],
}


def c(name):
    return P.get(name, name)


class Sprite:
    def __init__(self, w, h, outline=True):
        self.w, self.h, self.outline = w, h, outline
        self.p = {}

    def set(self, x, y, col):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.p[(x, y)] = c(col)

    def rect(self, x, y, w, h, col):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.set(xx, yy, col)

    def hline(self, x, y, n, col):
        self.rect(x, y, n, 1, col)

    def vline(self, x, y, n, col):
        self.rect(x, y, 1, n, col)

    def grid(self, x, y, rows, legend):
        """Draw rows of characters; '.' is transparent, others look up legend."""
        for dy, row in enumerate(rows):
            for dx, ch in enumerate(row):
                if ch != '.':
                    self.set(x + dx, y + dy, legend[ch])

    def text(self, x, y, s, col):
        for ch in s:
            glyph = FONT[ch]
            for dy, row in enumerate(glyph):
                for dx, bit in enumerate(row):
                    if bit == '1':
                        self.set(x + dx, y + dy, col)
            x += len(glyph[0]) + 1

    def erase(self, x, y, w=1, h=1):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.p.pop((xx, yy), None)

    def canvas(self):
        """Pixels in canvas coordinates, with a 1px outline in the padding."""
        pad = 1 if self.outline else 0
        out = {(x + pad, y + pad): col for (x, y), col in self.p.items()}
        if self.outline:
            line = c('K0')
            for (x, y) in list(out):
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    n = (x + dx, y + dy)
                    if n not in out and 0 <= n[0] < self.w + 2 and 0 <= n[1] < self.h + 2:
                        out[n] = line
        return self.w + 2 * pad, self.h + 2 * pad, out


def noise(seed):
    return random.Random(seed)


class Studio:
    def __init__(self):
        os.makedirs(TMP, exist_ok=True)
        self.mcp = PixelMcp()

    def close(self):
        self.mcp.close()

    def make(self, name, spr, dest, scale=3):
        """Draw `spr` into art/<name>.aseprite and export a scaled PNG to public/assets/<dest>."""
        w, h, px = spr.canvas()
        path = self.mcp.call('create_canvas', width=w, height=h, color_mode='rgb')['file_path']
        items = [{'x': x, 'y': y, 'color': col} for (x, y), col in sorted(px.items(), key=lambda i: (i[0][1], i[0][0]))]
        corners = [{'x': 0, 'y': 0, 'color': '#00000000'}, {'x': w - 1, 'y': h - 1, 'color': '#00000000'}]
        for i in range(0, len(items), 600):
            chunk = items[i:i + 600]
            if i == 0:
                chunk = corners + chunk
            self.mcp.call('draw_pixels', sprite_path=path, layer_name='Layer 1', frame_number=1, pixels=chunk)
        src = os.path.join(ART_DIR, name + '.aseprite')
        self.mcp.call('save_as', sprite_path=path, output_path=src)
        tmp = os.path.join(TMP, name + '_x%d.aseprite' % scale)
        self.mcp.call('save_as', sprite_path=src, output_path=tmp)
        self.mcp.call('scale_sprite', sprite_path=tmp, scale_x=scale, scale_y=scale, algorithm='nearest')
        out = os.path.join(PUBLIC, dest)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        self.mcp.call('export_sprite', sprite_path=tmp, output_path=out, format='png', frame_number=1)
        return out
