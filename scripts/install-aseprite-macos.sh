#!/usr/bin/env bash
# Builds Aseprite from source on macOS and wires it up for pixel-plugin (the Aseprite MCP server).
#
#   bash scripts/install-aseprite-macos.sh            # build + install to /Applications (or ~/Applications)
#   DRY_RUN=1 bash scripts/install-aseprite-macos.sh  # print what it would do
#
# Aseprite's EULA lets you compile it for personal use; don't redistribute the binary. If you'd rather buy it
# (aseprite.org or Steam), skip this script and just run `npm run doctor` afterwards.
#
# Tunables (environment): ASEPRITE_TAG, DEV_DIR (where the source and Skia go), APP_DIR (where Aseprite.app goes).
set -euo pipefail

ASEPRITE_TAG="${ASEPRITE_TAG:-v1.3.18.6}"
DEV_DIR="${DEV_DIR:-$HOME/Developer}"
APP_DIR="${APP_DIR:-/Applications}"
DRY="${DRY_RUN:-0}"

run() { echo "+ $*"; if [ "$DRY" != 1 ]; then "$@"; fi; }
say() { printf '\n==> %s\n' "$*"; }
die() { echo "error: $*" >&2; exit 1; }

[ "$(uname -s)" = Darwin ] || die "this script is for macOS; on Linux/Windows follow INSTALL.md in the Aseprite repo"
case "$(uname -m)" in
  arm64)  SK_ARCH=arm64; SK_DIR=Release-arm64; CM_ARCH=arm64;  DEPLOY=11.0 ;;
  x86_64) SK_ARCH=x64;   SK_DIR=Release-x64;   CM_ARCH=x86_64; DEPLOY=10.14 ;;
  *) die "unsupported architecture $(uname -m)" ;;
esac

say "Checking tools"
xcode-select -p >/dev/null 2>&1 || die "install the Xcode command line tools first: xcode-select --install"
command -v git  >/dev/null || die "git is required"
command -v curl >/dev/null || die "curl is required"
if ! command -v cmake >/dev/null || ! command -v ninja >/dev/null; then
  command -v brew >/dev/null || die "cmake and ninja are missing and Homebrew is not installed (https://brew.sh)"
  run brew install cmake ninja
fi

SRC="$DEV_DIR/aseprite"
SKIA="$DEV_DIR/deps/skia"
run mkdir -p "$DEV_DIR/deps"

say "Fetching Aseprite $ASEPRITE_TAG"
if [ -d "$SRC/.git" ]; then
  echo "$SRC already exists, reusing it"
else
  run git clone --recursive --depth 1 --shallow-submodules --branch "$ASEPRITE_TAG" https://github.com/aseprite/aseprite.git "$SRC"
fi

# Each Aseprite release names the Skia build it expects
if [ -f "$SRC/laf/misc/skia-tag.txt" ]; then SKIA_TAG="$(cat "$SRC/laf/misc/skia-tag.txt")"; else SKIA_TAG="m124-08a5439a6b"; fi

say "Fetching the prebuilt Skia $SKIA_TAG"
if [ -f "$SKIA/out/$SK_DIR/libskia.a" ]; then
  echo "Skia already present"
else
  ZIP="$DEV_DIR/deps/Skia-macOS-Release-$SK_ARCH.zip"
  run curl -fSL -o "$ZIP" "https://github.com/aseprite/skia/releases/download/$SKIA_TAG/Skia-macOS-Release-$SK_ARCH.zip"
  run mkdir -p "$SKIA"
  run unzip -q -o "$ZIP" -d "$SKIA"
fi

say "Configuring and building (about 10 minutes the first time)"
run mkdir -p "$SRC/build"
(
  if [ "$DRY" != 1 ]; then cd "$SRC/build"; fi
  run cmake \
    -DCMAKE_BUILD_TYPE=RelWithDebInfo \
    -DCMAKE_OSX_ARCHITECTURES="$CM_ARCH" \
    -DCMAKE_OSX_DEPLOYMENT_TARGET="$DEPLOY" \
    -DCMAKE_OSX_SYSROOT="$(xcrun --show-sdk-path)" \
    -DLAF_BACKEND=skia \
    -DSKIA_DIR="$SKIA" \
    -DSKIA_LIBRARY_DIR="$SKIA/out/$SK_DIR" \
    -DSKIA_LIBRARY="$SKIA/out/$SK_DIR/libskia.a" \
    -DPNG_ARM_NEON:STRING=on \
    -DCMAKE_POLICY_VERSION_MINIMUM=3.5 \
    -G Ninja ..
  run ninja aseprite
)

say "Assembling Aseprite.app"
BIN="$SRC/build/bin"
APP="$BIN/Aseprite.app"
if [ "$DRY" != 1 ]; then
  [ -d "$APP/Contents/MacOS" ] || die "the build did not produce $APP"
  cp "$BIN/icudtl.dat" "$APP/Contents/MacOS/"
  ICONS="$(mktemp -d)/Aseprite.iconset"; mkdir -p "$ICONS"
  D="$SRC/data/icons"
  cp "$D/ase16.png" "$ICONS/icon_16x16.png";   cp "$D/ase32.png" "$ICONS/icon_16x16@2x.png"
  cp "$D/ase32.png" "$ICONS/icon_32x32.png";   cp "$D/ase64.png" "$ICONS/icon_32x32@2x.png"
  cp "$D/ase128.png" "$ICONS/icon_128x128.png"; cp "$D/ase256.png" "$ICONS/icon_128x128@2x.png"
  cp "$D/ase256.png" "$ICONS/icon_256x256.png"
  iconutil -c icns "$ICONS" -o "$APP/Contents/Resources/Aseprite.icns"
  /usr/libexec/PlistBuddy -c "Add :CFBundleIconFile string Aseprite" "$APP/Contents/Info.plist" 2>/dev/null || true
else
  echo "+ (copy icudtl.dat, build Aseprite.icns, set CFBundleIconFile)"
fi

say "Installing"
if [ ! -w "$APP_DIR" ]; then APP_DIR="$HOME/Applications"; run mkdir -p "$APP_DIR"; fi
run rm -rf "$APP_DIR/Aseprite.app"
run ditto "$APP" "$APP_DIR/Aseprite.app"
run codesign --force --deep -s - "$APP_DIR/Aseprite.app"
ASE="$APP_DIR/Aseprite.app/Contents/MacOS/aseprite"

say "Configuring pixel-mcp"
CFG="$HOME/.config/pixel-mcp/config.json"
if [ -f "$CFG" ]; then
  echo "$CFG exists; make sure aseprite_path is $ASE"
else
  run mkdir -p "$(dirname "$CFG")"
  if [ "$DRY" != 1 ]; then
    printf '{\n  "aseprite_path": "%s",\n  "temp_dir": "",\n  "timeout": 30,\n  "log_level": "info",\n  "log_file": "",\n  "enable_timing": false\n}\n' "$ASE" > "$CFG"
  else
    echo "+ write $CFG with aseprite_path=$ASE"
  fi
fi

say "Done"
[ "$DRY" = 1 ] || "$ASE" --version
echo "Next: install the plugin in Claude Code (claude plugin marketplace add willibrandon/pixel-plugin && claude plugin install pixel-plugin@pixel-plugin), then: npm run doctor"
