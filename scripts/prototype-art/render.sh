#!/usr/bin/env bash
# Xuất ảnh banner chính, banner ưu đãi và popup chào mừng cho bản xem trước
# layout C vào public/prototypes/art/ (chụp bằng puppeteer qua shot.mjs).
# Usage: bash scripts/prototype-art/render.sh
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/../.." && pwd)"
out="$root/public/prototypes/art"
mkdir -p "$out"

shot() { # file query width height target [scale]
  (cd "$root" && node "$here/shot.mjs" "$1" "$2" "$3" "$4" "${6:-2}" "$5")
  echo "rendered $(basename "$5")"
}

shot "$here/hero.html" v=pc 800 420 "$out/hero-pc.jpg"
shot "$here/hero.html" v=mb 343 440 "$out/hero-mb.jpg" 3
shot "$here/offer.html" v=pc 1200 400 "$out/offer-pc.jpg"
shot "$here/offer.html" v=mb 360 200 "$out/offer-mb.jpg" 3
shot "$here/welcome.html" v=1 540 540 "$out/welcome.jpg"
