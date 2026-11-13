import * as Phaser from 'phaser';

// A level built in the Sprite Fusion tilemap editor (or by art/scripts/build_*_map.py) and imported with
// art/scripts/import_map.py. Layers keep the names they have in the editor:
//   "far*"      scrolls at half speed (skyline, moon)
//   "markers"   never drawn; each tile spawns something (player start, doors, NPCs...) where it stands
//   "front*"    drawn over the player (trees)
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
  private readonly layers: Phaser.Tilemaps.TilemapLayer[] = [];
  private readonly catalog: Record<string, { id: number; w: number; h: number }>;
  private readonly columns: number;

  static preload(scene: Phaser.Scene, key: string) {
    scene.load.tilemapTiledJSON(key, `tilemaps/${key}.json`);
    scene.load.image(`${key}_sheet`, `tilemaps/${key}_sheet.png`);
    scene.load.json(`${key}_catalog`, `tilemaps/${key}_catalog.json`);
  }

  constructor(scene: Phaser.Scene, key: string) {
    this.map = scene.make.tilemap({ key });
    const tileset = this.map.addTilesetImage(key, `${key}_sheet`)!;
    this.columns = tileset.columns;
    this.catalog = scene.cache.json.get(`${key}_catalog`).blocks;
    const markerNames = new Map<number, string>();
    for (const [name, b] of Object.entries(this.catalog)) if (name.startsWith('marker_')) markerNames.set(b.id, name.slice(7));

    this.map.layers.forEach((data, order) => {
      const layer = this.map.createLayer(data.name, tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
      const lname = data.name.toLowerCase();
      if (lname.startsWith('markers')) {
        this.readMarkers(layer, markerNames);
        layer.setVisible(false);
        return;
      }
      this.layers.push(layer);
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

  // Cycles every placed copy of these same-sized blocks through them in order, so a level can drop any one frame
  // (e.g. "ampel_red") and get the whole animation. All copies stay in step, starting at the first frame.
  animate(scene: Phaser.Scene, frames: { block: string; ms: number }[]) {
    const ids = frames.map((f) => this.catalog[f.block]);
    if (ids.some((b) => !b)) return;
    const { w, h } = ids[0];
    const offsets: number[] = []; // tile ids within a block, relative to its top-left
    for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) offsets.push(dy * this.columns + dx);
    const frameOf = new Map<number, number>(); // tile id -> offset, for any frame
    for (const b of ids) for (const o of offsets) frameOf.set(b.id + o, o);

    const tiles: { tile: Phaser.Tilemaps.Tile; offset: number }[] = [];
    for (const layer of this.layers) {
      layer.forEachTile((tile) => {
        const offset = frameOf.get(tile.index - 1); // gid 1 = tile id 0
        if (offset !== undefined) tiles.push({ tile, offset });
      });
    }
    if (!tiles.length) return;

    const show = (i: number) => {
      for (const { tile, offset } of tiles) tile.index = ids[i].id + offset + 1;
      scene.time.delayedCall(frames[i].ms, () => show((i + 1) % frames.length));
    };
    show(0);
  }

  // Top-left pixel of every placed copy of a block, found by its top-left tile, in any drawn layer
  blocksNamed(name: string) {
    const b = this.catalog[name];
    const found: { x: number; y: number }[] = [];
    if (!b) return found;
    for (const layer of this.layers) {
      layer.forEachTile((tile) => {
        if (tile.index - 1 === b.id) found.push({ x: tile.pixelX, y: tile.pixelY });
      });
    }
    return found;
  }

  markersNamed(name: string) {
    return this.markers.filter((m) => m.name === name);
  }
}
