"""Packs prop/tile blocks into one 16px-grid tileset for the Sprite Fusion editor."""
import json
import os

from spriteart import Sprite

TILE = 16


class Block:
    def __init__(self, name, w, h, group):
        self.name, self.w, self.h, self.group = name, w, h, group
        self.sprite = Sprite(w * TILE, h * TILE, outline=False)
        self.x = self.y = 0


class TileSheet:
    def __init__(self, cols=16):
        self.cols = cols
        self.blocks = []
        self._group = ''
        self._breaks = set()

    def group(self, name):
        """Start a new labelled section; the next block begins on a fresh row."""
        self._group = name
        self._breaks.add(len(self.blocks))

    def add(self, name, w=1, h=1):
        if any(b.name == name for b in self.blocks):
            raise ValueError('duplicate block ' + name)
        b = Block(name, w, h, self._group)
        self.blocks.append(b)
        return b.sprite

    def pack(self):
        x = y = row_h = 0
        for i, b in enumerate(self.blocks):
            if i in self._breaks and x:
                x, y, row_h = 0, y + row_h, 0
            if x + b.w > self.cols:
                x, y, row_h = 0, y + row_h, 0
            b.x, b.y = x, y
            x += b.w
            row_h = max(row_h, b.h)
        self.rows = y + row_h

    def compose(self):
        self.pack()
        sheet = Sprite(self.cols * TILE, self.rows * TILE, outline=False)
        for b in self.blocks:
            sheet.blit(b.sprite, b.x * TILE, b.y * TILE)
        return sheet

    def catalog(self):
        """name -> position and size in tiles (id = y * cols + x, the order Sprite Fusion slices a sheet)."""
        return {
            'tile': TILE, 'cols': self.cols, 'rows': self.rows,
            'blocks': {b.name: {'x': b.x, 'y': b.y, 'w': b.w, 'h': b.h, 'id': b.y * self.cols + b.x, 'group': b.group}
                       for b in self.blocks},
        }

    def write_catalog(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump(self.catalog(), f, indent=1)
