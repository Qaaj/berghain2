---
name: setup-art-tools
description: Install and verify the tools behind Berghain2's art pipeline: Aseprite (built from source, free), pixel-plugin (the Aseprite MCP server for Claude Code), Pillow, and the Sprite Fusion tilemap editor. Use when a new contributor can't draw assets, `npm run doctor` fails, pixel-mcp can't find Aseprite, or someone asks how to set the repo up from scratch.
---

# Set up the art tools

Start with the check: `npm run doctor`. It reports exactly what is missing and prints the fix.

## What is needed

| Need | For | Install |
|---|---|---|
| Node 20+, `npm install` | the game | nodejs.org / nvm |
| Python 3 + Pillow | tileset guides, map import | `pip3 install pillow` |
| Aseprite 1.3+ | drawing (headless, through Lua) | buy it (aseprite.org, Steam) **or** `bash scripts/install-aseprite-macos.sh` |
| pixel-plugin | the `pixel-mcp` server Claude and `art/scripts/pixelmcp.py` talk to | `claude plugin marketplace add willibrandon/pixel-plugin && claude plugin install pixel-plugin@pixel-plugin` |
| Sprite Fusion Tilemap Editor (optional) | building levels by hand | spritefusion.com (desktop app, one-time purchase) |

This repo's `.claude/settings.json` already lists the pixel-plugin marketplace, so Claude Code offers to install it.

## Aseprite from source (macOS)

`bash scripts/install-aseprite-macos.sh` does what the Aseprite `INSTALL.md` describes, end to end: installs
cmake and ninja with Homebrew, clones the tagged release (default `v1.3.18.6`), downloads the prebuilt Skia that the
release expects, builds, assembles `Aseprite.app` (icon and ICU data, which the build leaves out), ad-hoc signs it,
installs to `/Applications` (or `~/Applications` if that isn't writable), and writes `~/.config/pixel-mcp/config.json`.
Preview first with `DRY_RUN=1`. The first build takes roughly 10 minutes. Compiling for personal use is allowed by
Aseprite's EULA; don't redistribute the binary. Linux/Windows: follow the Aseprite `INSTALL.md`, then set
`aseprite_path` in the config below.

## pixel-mcp configuration

`~/.config/pixel-mcp/config.json`:

```json
{ "aseprite_path": "/Applications/Aseprite.app/Contents/MacOS/aseprite", "temp_dir": "", "timeout": 30, "log_level": "info" }
```

The plugin's MCP tools only appear in a **new** Claude Code session after installing. Scripts in `art/scripts` use the
same server directly and need no session restart.

## Troubleshooting

- `pixel-mcp end to end` fails in doctor: run `<aseprite_path> -b --script x.lua` by hand; common causes are a wrong
  path or a missing `icudtl.dat` beside the binary (rerun the install script). If macOS refuses to launch the app you
  built, the script's ad-hoc signature may have been stripped: `codesign --force --deep -s - /Applications/Aseprite.app`.
- The build fails while configuring or linking against Skia: the prebuilt Skia must match the Aseprite release.
  The script reads the expected tag from `laf/misc/skia-tag.txt` in the Aseprite checkout; delete `~/Developer/deps/skia`
  and rerun if you switched `ASEPRITE_TAG`.
- `npm install` fails resolving Vite 8 peers: `.npmrc` sets `legacy-peer-deps=true` for this reason.
- Browser pane can't reach localhost: start the dev server yourself and open the URL.
