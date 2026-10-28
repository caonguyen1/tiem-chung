// Brand icons copied from src/components/icons/brand-icons.tsx so the static
// layout drafts can use them. icon(name, disc) wraps one in a 64×64 svg.
const N = "#283C96";
const S = "#FADC00";
const PATHS = {
  syringe: `<g transform="rotate(45 32 32)"><rect x="26" y="30" width="12" height="12" fill="${S}" stroke="none"/><rect x="26" y="16" width="12" height="26" rx="2"/><path d="M32 16V9M27 9h10M32 42v11M26 22h5M26 27h5"/></g>`,
  package: `<path d="M15 21l17 9v21l-17-9Z" fill="${S}" stroke="none"/><path d="M32 13 15 21v21l17 9 17-9V21Z"/><path d="M15 21l17 9 17-9M32 30v21M23.5 17l17 8.5v8"/>`,
  calendar: `<rect x="14" y="17" width="36" height="33" rx="6"/><path d="M14 27h36M23 13v8M41 13v8"/><circle cx="40" cy="40" r="6.5" fill="${S}"/><path d="m37.3 40 2 2 3.5-3.8"/><path d="M21 34h5M21 41h8"/>`,
  chat: `<path d="M46 24h1a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6v6l-7-6H33a6 6 0 0 1-6-6v-1" fill="${S}"/><path d="M11 20a7 7 0 0 1 7-7h20a7 7 0 0 1 7 7v10a7 7 0 0 1-7 7H25l-7 6v-6a7 7 0 0 1-7-7Z" fill="#fff"/><path d="M28 19v12M22 25h12"/>`,
  advisor: `<path d="M13 19a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H28l-8 7v-7h-1a6 6 0 0 1-6-6Z"/><path d="M26 21.5a4.2 4.2 0 1 1 6.3 3.6c-1.3.8-2.3 1.7-2.3 3.2"/><circle cx="30" cy="32.6" r="0.6" fill="${N}"/><circle cx="46" cy="44" r="8" fill="${S}"/><path d="m42.5 44 2.5 2.5 4.5-5"/>`,
  lungs: `<path d="M38 22c6 0 12.5 9 12.5 21.5 0 4-2.8 6.2-6 5.3L38.5 47A3.6 3.6 0 0 1 36 43.6V24.4c0-1.3.7-2.4 2-2.4Z" fill="${S}"/><path d="M26 22c-6 0-12.5 9-12.5 21.5 0 4 2.8 6.2 6 5.3l6-1.8a3.6 3.6 0 0 0 2.5-3.4V24.4c0-1.3-.7-2.4-2-2.4Z"/><path d="M32 12v16l-4.5 4.5M32 28l4.5 4.5"/>`,
  baby: `<circle cx="23" cy="38" r="3" fill="${S}" stroke="none"/><circle cx="41" cy="38" r="3" fill="${S}" stroke="none"/><circle cx="32" cy="34" r="15"/><path d="M29.5 19.4c-.6-3.4 3.6-5 5.4-2.4"/><path d="M27 32.5v.5M37 32.5v.5M28.5 40c2 2 5 2 7 0"/>`,
  rotavirus: `<path d="M26 11v9c0 3-1.7 5-4.7 7-4.2 2.7-6.3 6.4-6.3 11.2C15 46 22 51 30 51c9.8 0 18-6 18-15 0-6.8-4.8-11-11-11h-2a5 5 0 0 1-5-5v-9"/><path d="M24 39c2.5 3.4 8.5 4 13 .5"/><circle cx="46" cy="16" r="4.5" fill="${S}"/><path d="M46 9v2.5M46 20.5V23M39 16h2.5M50.5 16H53"/>`,
  influenza: `<path d="M22 14a4 4 0 0 1 8 0v22.6a8 8 0 1 1-8 0Z"/><circle cx="26" cy="43" r="4.2" fill="${S}" stroke="none"/><path d="M26 39V24"/><circle cx="45" cy="22" r="5.5"/><path d="M45 13.5v3M45 27.5v3M36.5 22h3M50.5 22h3M39 16l2 2M49 26l2 2M51 16l-2 2M41 26l-2 2"/>`,
  rash: `<path d="M17 31c0-9 6.7-16 15-16s15 7 15 16c0 9.5-6.7 18-15 18s-15-8.5-15-18Z"/><path d="M17.5 27c4-1 8-4 9.5-8 4 4.5 12 7.5 19.5 7"/><path d="M26.5 33v.4M37.5 33v.4M29 42c1.8 1.3 4.2 1.3 6 0"/><circle cx="22.5" cy="38.5" r="1.9" fill="${S}" stroke="none"/><circle cx="41.5" cy="38.5" r="1.9" fill="${S}" stroke="none"/><circle cx="25" cy="44" r="1.5" fill="${S}" stroke="none"/><circle cx="39" cy="44" r="1.5" fill="${S}" stroke="none"/><circle cx="44" cy="31.5" r="1.5" fill="${S}" stroke="none"/>`,
  blister: `<path d="M14 30c0-8 6-14 14-14h8c8 0 14 6 14 14v4c0 8-6 14-14 14h-8c-8 0-14-6-14-14Z"/><circle cx="25" cy="27" r="4.2" fill="${S}"/><circle cx="39" cy="36" r="5" fill="${S}"/><circle cx="37" cy="24" r="2" fill="${S}" stroke="none"/><circle cx="25" cy="39" r="2" fill="${S}" stroke="none"/>`,
  hpv: `<path d="m27.6 34.5-8.6 16 6.4-1.6 3 5.6 7.7-15.4" fill="${S}"/><path d="M36.4 34.5 45 50.5l-6.4-1.6-3 5.6-7.7-15.4"/><path d="M32 40c-4.8-5.8-8-10.4-8-15.4a8 8 0 0 1 16 0C40 29.6 36.8 34.2 32 40Z"/>`,
  mosquito: `<ellipse cx="22.5" cy="25" rx="9.5" ry="4.2" transform="rotate(-28 22.5 25)"/><ellipse cx="41.5" cy="25" rx="9.5" ry="4.2" transform="rotate(28 41.5 25)"/><ellipse cx="32" cy="39" rx="4.5" ry="10" fill="${S}"/><circle cx="32" cy="24.5" r="3.6"/><path d="M32 21V10M28.5 33l-8.5 3.5-3 5.5M35.5 33l8.5 3.5 3 5.5M29 38l-6.5 8.5M35 38l6.5 8.5"/>`,
  pregnancy: `<circle cx="30" cy="15" r="4.5"/><path d="M33 30.5c5.8 1 9.5 5.2 9.5 10.3 0 4.6-3.6 7.2-8.5 7.2" fill="${S}"/><path d="M28.5 22.5c-3 2.2-4.5 6-4.5 10.5 0 5.5 2 9.5 3 15M33 23c1.5 2.5.8 5.5 0 7.5M27 50h-4M34 50v-2"/>`,
  stethoscope: `<path d="M18 13v11a8 8 0 0 0 16 0V13M15 13h6M31 13h6"/><path d="M26 32v6a9 9 0 0 0 18 0v-5"/><circle cx="44" cy="28" r="5" fill="${S}"/>`,
  shield: `<path d="M32 12 16 18v12c0 10.5 6.8 18.6 16 22 9.2-3.4 16-11.5 16-22V18Z"/><path d="M32 18.5 22 22.3v7.9c0 7 4.2 12.5 10 15" fill="${S}" stroke="none"/><path d="m25 31 5 5 9-10"/>`,
  timer: `<path d="M33 34V17.5A16.5 16.5 0 0 1 49.5 34Z" fill="${S}" stroke="none"/><circle cx="33" cy="34" r="16.5"/><path d="M28 11h10M33 11v6.5M33 34l7-7M47 18l2.5-2.5"/>`,
  reminder: `<path d="M20 41V29a12 12 0 0 1 24 0v12l3 4H17Z"/><path d="M28 49a4 4 0 0 0 8 0M32 13v4"/><circle cx="45" cy="18" r="6.5" fill="${S}"/><path d="M45 15.5V18l1.6 1.4"/>`,
};

function icon(name, disc = "#F2F4FB") {
  const bg = disc ? `<circle cx="32" cy="32" r="30" fill="${disc}"/>` : "";
  return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">${bg}<g stroke="${N}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</g></svg>`;
}

// Fills every <i data-icon="name" data-disc="#hex"> placeholder on the page.
document.querySelectorAll("[data-icon]").forEach((el) => {
  el.outerHTML = icon(el.dataset.icon, el.dataset.disc === "none" ? "" : el.dataset.disc || undefined).replace("<svg", `<svg class="${el.className}"`);
});
