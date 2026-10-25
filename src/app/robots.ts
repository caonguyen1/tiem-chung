import type { MetadataRoute } from "next";

// Mirrors the `robots` metadata in layout.tsx: closed until SITE_INDEXABLE=1.
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE === "1") {
    return { rules: { userAgent: "*", allow: "/" } };
  }
  return { rules: { userAgent: "*", disallow: "/" } };
}
