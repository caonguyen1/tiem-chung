/*
 * Pages that exist today. Add a path here when its page ships; until then every
 * link to it renders as plain, unclickable content instead of leading to a 404.
 */
const builtPaths = new Set<string>(["/", "/vac-xin", "/goi-vac-xin", "/khuyen-mai", "/toi-nen-tiem-gi", "/dat-hen", "/gioi-thieu", "/doi-ngu-chuyen-mon", "/he-thong-trung-tam", "/kien-thuc", "/cau-hoi-thuong-gap", "/bang-gia"]);

/** Sections whose pages come from the database (`/vac-xin/<slug>`): any path below them counts as built. */
const builtPrefixes: string[] = ["/vac-xin/", "/goi-vac-xin/", "/khuyen-mai/", "/doi-ngu-chuyen-mon/", "/he-thong-trung-tam/", "/kien-thuc/", "/chinh-sach/"];

/**
 * In-page actions that already work: popups (`#tu-van`, `#dat-lich`) and the
 * homepage sections the shortcuts scroll to. `#dat-lich=<slug>` preselects a
 * vaccine or package, so only the part before `=` is matched.
 */
const builtHashActions = new Set<string>([
  "#tu-van",
  "#dat-lich",
  "#tra-cuu-vac-xin",
  "#goi-vac-xin",
  "#goi-y-vac-xin",
  "#lien-he",
]);

export const BOOKING_HASH = "#dat-lich";
export const CONSULT_HASH = "#tu-van";

/** `#dat-lich`, or `#dat-lich=gardasil-9` to preselect what to book. */
export function bookingHref(slug?: string) {
  return slug ? `${BOOKING_HASH}=${slug}` : BOOKING_HASH;
}

export function isExternalHref(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

export function isNavigable(href: string | undefined): href is string {
  if (!href) return false;
  if (isExternalHref(href)) return true;
  if (href.startsWith("#")) return builtHashActions.has(href.split("=")[0]);
  const path = href.split(/[?#]/)[0] || "/";
  return builtPaths.has(path) || builtPrefixes.some((prefix) => path.startsWith(prefix));
}
