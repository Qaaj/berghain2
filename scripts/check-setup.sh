#!/usr/bin/env bash
# Checks that everything this repo's workflow needs is installed. Run it with: npm run doctor
# Required: Node 20+, installed npm packages. For the art pipeline: Python 3 + Pillow, Aseprite, pixel-plugin.
# Optional: the Sprite Fusion desktop app (for editing levels).
cd "$(dirname "$0")/.."

fails=0; warns=0
ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '  \033[31m✗\033[0m %s\n      %s\n' "$1" "$2"; fails=$((fails + 1)); }
warn() { printf '  \033[33m!\033[0m %s\n      %s\n' "$1" "$2"; warns=$((warns + 1)); }

echo "Game (needed to play and develop)"
if command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ]; then
  ok "Node $(node -v)"
else
  bad "Node 20 or newer" "install it from nodejs.org or with nvm"
fi
if [ -d node_modules/phaser ]; then ok "npm packages installed"; else bad "npm packages" "run: npm install"; fi

echo "Art pipeline (needed to draw assets and import editor maps)"
if command -v python3 >/dev/null; then ok "$(python3 -V)"; else bad "Python 3" "install Python 3"; fi
if python3 -c 'import PIL' 2>/dev/null; then ok "Pillow"; else bad "Pillow" "run: pip3 install pillow"; fi

CFG="$HOME/.config/pixel-mcp/config.json"
ASE=""
if [ -f "$CFG" ]; then ASE="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('aseprite_path',''))" "$CFG" 2>/dev/null)"; fi
if [ -n "$ASE" ] && [ -x "$ASE" ]; then
  ok "Aseprite: $("$ASE" --version 2>/dev/null)"
else
  bad "Aseprite (configured in $CFG)" "build it with: bash scripts/install-aseprite-macos.sh   (or buy it and set aseprite_path)"
fi

PLUGIN="$(ls -d "$HOME"/.claude/plugins/cache/pixel-plugin/pixel-plugin/*/bin/pixel-mcp 2>/dev/null | tail -1)"
if [ -n "$PLUGIN" ]; then
  ok "pixel-plugin installed"
else
  bad "pixel-plugin" "run: claude plugin marketplace add willibrandon/pixel-plugin && claude plugin install pixel-plugin@pixel-plugin"
fi

if [ -n "$PLUGIN" ] && [ -n "$ASE" ] && [ -x "$ASE" ] && python3 -c 'import PIL' 2>/dev/null; then
  if python3 - <<'PY' 2>/dev/null
import sys
sys.path.insert(0, 'art/scripts')
from pixelmcp import PixelMcp
m = PixelMcp()
res = m.call('create_canvas', width=4, height=4, color_mode='rgb')
m.close()
sys.exit(0 if res.get('file_path') else 1)
PY
  then ok "pixel-mcp can drive Aseprite (created a test canvas)"; else bad "pixel-mcp end to end" "check aseprite_path in $CFG"; fi
fi

echo "Level editor (optional)"
if [ -d "/Applications/Sprite Fusion.app" ] || [ -d "$HOME/Applications/Sprite Fusion.app" ]; then
  ok "Sprite Fusion desktop app"
else
  warn "Sprite Fusion desktop app" "get the Tilemap Editor from spritefusion.com to build levels (art/EDITOR.md)"
fi

echo
if [ "$fails" -eq 0 ]; then echo "All required checks passed${warns:+ ($warns optional item(s) missing)}."; else echo "$fails required item(s) missing."; fi
exit "$fails"
