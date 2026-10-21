"""Builds the Neukölln street tileset for the Sprite Fusion tilemap editor.

Run:  python3 art/scripts/street_art.py
Writes  art/tilesets/neukoelln_street.png  (native 16px tiles, import this into Sprite Fusion),
        art/neukoelln_street.aseprite       (editable source),
        art/tilesets/neukoelln_street.json  (name -> tile position catalog used by the map scripts).
"""
import os

import street_facades as F
import street_props as P
import street_shops as S
from sheet import TileSheet
from spriteart import ART_DIR, Studio

OUT = os.path.join(ART_DIR, 'tilesets')


def build():
    sheet = TileSheet(cols=16)
    F.ground(sheet)
    F.plaster(sheet)
    F.windows(sheet)
    F.balconies(sheet)
    F.doors(sheet)
    S.shops(sheet)
    P.furniture(sheet)
    P.graffiti(sheet)
    P.far(sheet)
    P.markers(sheet)
    return sheet


if __name__ == '__main__':
    sheet = build()
    master = sheet.compose()
    sheet.write_catalog(os.path.join(OUT, 'neukoelln_street.json'))
    studio = Studio()
    try:
        studio.make('neukoelln_street', master, os.path.join(OUT, 'neukoelln_street.png'), scale=1)
    finally:
        studio.close()
    print('tiles: %dx%d (%d px sheet)' % (sheet.cols, sheet.rows, sheet.cols * 16), len(sheet.blocks), 'blocks')
