// Vẽ lọ vắc xin minh họa cho banner: <i data-vial="Tên|màu nắp" style="left..;top..;width.."></i>
function vialSvg(label, cap) {
  const id = "v" + Math.random().toString(36).slice(2, 7);
  return `<svg viewBox="0 0 90 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#e8f0ff" stop-opacity=".85"/><stop offset="1" stop-color="#b9cbf5" stop-opacity=".9"/></linearGradient>
      <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="${cap}"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="${cap}"/></linearGradient>
    </defs>
    <rect x="17" y="6" width="56" height="34" rx="9" fill="${cap}"/>
    <rect x="17" y="6" width="56" height="34" rx="9" fill="url(#${id}c)" opacity=".45"/>
    <rect x="24" y="38" width="42" height="14" rx="3" fill="#cfd8ee"/>
    <path d="M14 70c0-10 8-18 18-18h26c10 0 18 8 18 18v108c0 9-7 16-16 16H30c-9 0-16-7-16-16Z" fill="url(#${id}g)"/>
    <path d="M14 150h62v28c0 9-7 16-16 16H30c-9 0-16-7-16-16Z" fill="#9fc0ff" opacity=".7"/>
    <rect x="14" y="88" width="62" height="54" fill="#fff"/>
    <rect x="14" y="88" width="62" height="8" fill="#283c96"/>
    <text x="45" y="121" text-anchor="middle" font-family="Google Sans Flex, sans-serif" font-weight="800" font-size="${Math.min(12, 96 / label.length).toFixed(1)}" fill="#283c96">${label}</text>
    <text x="45" y="134" text-anchor="middle" font-family="Google Sans Flex, sans-serif" font-weight="600" font-size="7" fill="#7d84a2">0.5 ml</text>
    <rect x="20" y="62" width="7" height="110" rx="3.5" fill="#fff" opacity=".7"/>
  </svg>`;
}

document.querySelectorAll("[data-vial]").forEach((el) => {
  const [label, cap] = el.dataset.vial.split("|");
  el.innerHTML = vialSvg(label, cap || "#fadc00");
});
