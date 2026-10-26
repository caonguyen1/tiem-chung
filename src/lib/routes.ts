/*
 * Pages that exist today. Add a path here when its page ships; until then every
 * link to it renders as plain, unclickable content instead of leading to a 404.
 */
const builtPaths = new Set<string>(["/"]);

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
  return builtPaths.has(path);
}
