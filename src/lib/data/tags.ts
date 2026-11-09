/**
 * Cache tags for the data functions in this folder. When the admin changes something,
 * call `updateTag(TAGS.x)` (from a Server Action) so the pages using it refresh.
 */
export const TAGS = {
  settings: "settings",
  catalog: "catalog",
  articles: "articles",
  banners: "banners",
  faqs: "faqs",
  centers: "centers",
  doctors: "doctors",
} as const;
