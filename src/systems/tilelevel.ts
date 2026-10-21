import * as Phaser from 'phaser';

// A level built in the Sprite Fusion tilemap editor (or by art/scripts/build_*_map.py) and imported with
// art/scripts/import_map.py. Layers keep the names they have in the editor:
//   "far*"      scrolls at half speed (skyline, moon)
//   "markers"   never drawn; each tile spawns something (player start, doors, NPCs...) where it stands
//   "front*"    drawn over the player (tree crowns)
//   any layer with the `collider` property becomes solid
// Everything else is drawn behind the player in the order it appears in the file.
export interface Marker {
  name: string; // e.g. "door", "ubahn", "start" (the tile's catalog name without "marker_")
  x: number; // left edge in pixels
  y: number; // bottom edge in pixels (where an entity stands)
  w: number; // width in pixels; neighbouring tiles of the same marker are merged
}

const FRONT_DEPTH = 20;
const DEPTH_BY_NAME: Record<string, number> = { far: 0, buildings: 1, details: 2, ground: 3, props: 4 };

function layerFlag(props: unknown, name: string): boolean {
  if (Array.isArray(props)) return props.some((p: { name: string; value: unknown }) => p.name === name && !!p.value);
  return !!(props as Record<string, unknown> | undefined)?.[name];
}

export class TileLevel {
  readonly map: Phaser.Tilemaps.Tilemap;
  readonly solid: Phaser.Tilemaps.TilemapLayer[] = [];
  readonly markers: Marker[] = [];

  static preload(scene: Phaser.Scene, key: string) {
    scene.load.tilemapTiledJSON(key, `tilemaps/${key}.json`);
    scene.load.image(`${key}_sheet`, `tilemaps/${key}_sheet.png`);
    scene.load.json(`${key}_catalog`, `tilemaps/${key}_catalog.json`);
  }

  constructor(scene: Phaser.Scene, key: string) {
    this.map = scene.make.tilemap({ key });
    const tileset = this.map.addTilesetImage(key, `${key}_sheet`)!;
    const catalog = scene.cache.json.get(`${key}_catalog`).blocks as Record<string, { id: number }>;
    const markerNames = new Map<number, string>();
    for (const [name, b] of Object.entries(catalog)) if (name.startsWith('marker_')) markerNames.set(b.id, name.slice(7));

    this.map.layers.forEach((data, order) => {
      const layer = this.map.createLayer(data.name, tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
      const lname = data.name.toLowerCase();
      if (lname.startsWith('markers')) {
        this.readMarkers(layer, markerNames);
        layer.setVisible(false);
        return;
      }
      layer.setDepth(lname.startsWith('front') ? FRONT_DEPTH : DEPTH_BY_NAME[lname] ?? Math.min(order, 6));
      if (lname.startsWith('far')) layer.setScrollFactor(0.5);
      if (layerFlag(data.properties, 'collider')) {
        layer.setCollisionByExclusion([-1]);
        this.solid.push(layer);
      }
    });
  }

  get widthPx() {
    return this.map.widthInPixels;
  }

  get heightPx() {
    return this.map.heightInPixels;
  }

  private readMarkers(layer: Phaser.Tilemaps.TilemapLayer, names: Map<number, string>) {
    const t = this.map.tileWidth;
    for (let y = 0; y < this.map.height; y++) {
      let open: Marker | null = null;
      for (let x = 0; x < this.map.width; x++) {
        const tile = layer.getTileAt(x, y);
        const name = tile ? names.get(tile.index - 1) : undefined; // gid 1 = tile id 0
        if (name && open && open.name === name) open.w += t;
        else if (name) {
          open = { name, x: x * t, y: (y + 1) * t, w: t };
          this.markers.push(open);
        } else open = null;
      }
    }
  }

  markersNamed(name: string) {
    return this.markers.filter((m) => m.name === name);
  }
}
