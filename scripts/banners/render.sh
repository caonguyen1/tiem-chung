#!/usr/bin/env bash
# Renders every scripts/banners/NN-*.html into public/images/banners/<name>-pc.jpg
# (1920×710) and <name>-mb.jpg (1080×1080) with headless Chrome.
# Usage: bash scripts/banners/render.sh [name-filter]
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="$root/public/images/banners"
tmp="$(mktemp -d)"
mkdir -p "$out"

chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"

shot() { # file variant width height scale target
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$tmp/profile" \
    --allow-file-access-from-files --force-device-scale-factor="$5" \
    --window-size="$3,$4" --virtual-time-budget=6000 \
    --screenshot="$tmp/shot.png" "file:///$(cygpath -m "$1" 2>/dev/null || echo "$1")?v=$2" >/dev/null 2>&1
  python -I -c "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=86, optimize=True, progressive=True)" \
    "$tmp/shot.png" "$6"
}

for html in "$here"/[0-9][0-9]-*.html; do
  name="$(basename "$html" .html)"
  name="${name#[0-9][0-9]-}"
  [[ -n "${1:-}" && "$name" != *"$1"* ]] && continue
  shot "$html" pc 1920 710 1 "$out/$name-pc.jpg"
  shot "$html" mb 540 540 2 "$out/$name-mb.jpg"
  echo "rendered $name"
done
rm -rf "$tmp"
