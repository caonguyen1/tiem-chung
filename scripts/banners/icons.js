// Brand icons for banner artwork (same drawing rules as src/components/icons/brand-icons.tsx).
// Usage: <span data-icon="shield" data-size="56"></span>
(function () {
  const N = "#283C96";
  const S = "#FADC00";
  const g = (body, disc = true) =>
    `<svg viewBox="0 0 64 64" fill="none">${disc ? '<circle cx="32" cy="32" r="30" fill="#F2F4FB"/>' : ""}<g stroke="${N}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
  const icons = {
    stethoscope: `<path d="M18 13v11a8 8 0 0 0 16 0V13M15 13h6M31 13h6"/><path d="M26 32v6a9 9 0 0 0 18 0v-5"/><circle cx="44" cy="28" r="5" fill="${S}"/>`,
    shield: `<path d="M32 12 16 18v12c0 10.5 6.8 18.6 16 22 9.2-3.4 16-11.5 16-22V18Z"/><path d="M32 18.5 22 22.3v7.9c0 7 4.2 12.5 10 15" fill="${S}" stroke="none"/><path d="m25 31 5 5 9-10"/>`,
    timer: `<path d="M33 34V17.5A16.5 16.5 0 0 1 49.5 34Z" fill="${S}" stroke="none"/><circle cx="33" cy="34" r="16.5"/><path d="M28 11h10M33 11v6.5M33 34l7-7M47 18l2.5-2.5"/>`,
    reminder: `<path d="M20 41V29a12 12 0 0 1 24 0v12l3 4H17Z"/><path d="M28 49a4 4 0 0 0 8 0M32 13v4"/><circle cx="45" cy="18" r="6.5" fill="${S}"/><path d="M45 15.5V18l1.6 1.4"/>`,
    baby: `<circle cx="23" cy="38" r="3" fill="${S}" stroke="none"/><circle cx="41" cy="38" r="3" fill="${S}" stroke="none"/><circle cx="32" cy="34" r="15"/><path d="M29.5 19.4c-.6-3.4 3.6-5 5.4-2.4"/><path d="M27 32.5v.5M37 32.5v.5M28.5 40c2 2 5 2 7 0"/>`,
    pregnancy: `<circle cx="30" cy="15" r="4.5"/><path d="M33 30.5c5.8 1 9.5 5.2 9.5 10.3 0 4.6-3.6 7.2-8.5 7.2" fill="${S}"/><path d="M28.5 22.5c-3 2.2-4.5 6-4.5 10.5 0 5.5 2 9.5 3 15M33 23c1.5 2.5.8 5.5 0 7.5M27 50h-4M34 50v-2"/>`,
    gift: `<rect x="14" y="28" width="36" height="22" rx="4" fill="${S}"/><rect x="11" y="20" width="42" height="9" rx="3" fill="#fff"/><path d="M32 20v30M32 20c-3-6-12-8-12-2 0 3 5 2 12 2ZM32 20c3-6 12-8 12-2 0 3-5 2-12 2Z"/>`,
    syringe: `<g transform="rotate(45 32 32)"><rect x="26" y="30" width="12" height="12" fill="${S}" stroke="none"/><rect x="26" y="16" width="12" height="26" rx="2"/><path d="M32 16V9M27 9h10M32 42v11M26 22h5M26 27h5"/></g>`,
    lungs: `<path d="M38 22c6 0 12.5 9 12.5 21.5 0 4-2.8 6.2-6 5.3L38.5 47A3.6 3.6 0 0 1 36 43.6V24.4c0-1.3.7-2.4 2-2.4Z" fill="${S}"/><path d="M26 22c-6 0-12.5 9-12.5 21.5 0 4 2.8 6.2 6 5.3l6-1.8a3.6 3.6 0 0 0 2.5-3.4V24.4c0-1.3-.7-2.4-2-2.4Z"/><path d="M32 12v16l-4.5 4.5M32 28l4.5 4.5"/>`,
  };
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const size = el.dataset.size || 56;
    el.innerHTML = g(icons[el.dataset.icon], el.dataset.disc !== "0");
    el.firstChild.setAttribute("width", size);
    el.firstChild.setAttribute("height", size);
  });
  // ?v=pc or ?v=mb picks the canvas
  document.body.classList.add(new URLSearchParams(location.search).get("v") === "mb" ? "mb" : "pc");
})();
