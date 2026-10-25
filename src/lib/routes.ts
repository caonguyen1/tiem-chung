/*
 * Pages that exist today. Add a path here when its page ships; until then every
 * link to it renders as plain, unclickable content instead of leading to a 404.
 */
const builtPaths = new Set<string>(["/"]);

/** In-page actions that already work (e.g. `#tu-van` opens the consult popup). */
const builtHashActions = new Set<string>(["#tu-van"]);

export function isExternalHref(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

export function isNavigable(href: string | undefined): href is string {
  if (!href) return false;
  if (isExternalHref(href)) return true;
  if (href.startsWith("#")) return builtHashActions.has(href);
  const path = href.split(/[?#]/)[0] || "/";
  return builtPaths.has(path);
}
