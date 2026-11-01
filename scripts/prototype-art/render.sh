#!/usr/bin/env bash
# Xuất ảnh banner ưu đãi và popup chào mừng cho bản xem trước layout C
# vào public/prototypes/art/ bằng Chrome headless (độ phân giải 2x).
# Usage: bash scripts/prototype-art/render.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="$root/public/prototypes/art"
tmp="$(mktemp -d)"
mkdir -p "$out"

chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"

shot() { # file query width height target
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$tmp/profile" \
    --allow-file-access-from-files --force-device-scale-factor=2 \
    --window-size="$3,$4" --virtual-time-budget=6000 \
    --screenshot="$tmp/shot.png" "file:///$(cygpath -m "$1" 2>/dev/null || echo "$1")?$2" >/dev/null 2>&1
  python -I -c "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], quality=86, optimize=True, progressive=True)" \
    "$tmp/shot.png" "$5"
  echo "rendered $(basename "$5")"
}

shot "$here/offer.html" v=pc 1200 400 "$out/offer-pc.jpg"
shot "$here/offer.html" v=mb 540 270 "$out/offer-mb.jpg"
shot "$here/welcome.html" v=1 540 540 "$out/welcome.jpg"
rm -rf "$tmp"
